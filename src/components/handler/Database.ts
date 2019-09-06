import { Database, RunResult } from "sqlite3";
import { inject, injectable } from "inversify";
import DefaultResourceHandler from "./Handler";
import { DatabaseHandler, Environment, LogHandler } from "../defines";
import { TYPES } from "../inversify/types";
import "reflect-metadata";
import * as util from "util";
import * as fs from "fs";

@injectable()
export default class SqliteDatabaseHandler extends DefaultResourceHandler<Database> implements DatabaseHandler {

  constructor(@inject("Environment") readonly env: Environment,
              @inject(TYPES.LogHandler) readonly loggerResourceHandler: LogHandler) {
    super(() => {
      return new Database(this.env.db_path, this.env.mode,
        (err) => {
          const logger = loggerResourceHandler.getResource();
          if (err) {
            logger.error(`sqlite open: ${err}`);
          } else {
            logger.info(`sqlite open: success`)
          }
        });
    }, () => {
      this.getResource().close((err) => {
        const logger = loggerResourceHandler.getResource();
        if (err) {
          logger.error(`sqlite close: ${err}`);
        } else {
          logger.info(`sqlite close: success`)
        }
      });
    });
  }

  find<T>(sql: string, mapper: (row: any) => T) {
    let result: Array<T> = [];
    this.getResource().all(sql, (err: Error, rows: any[]) => {
      if (err) {
        console.error(err);
      }
      result = rows.length > 0 ? rows.map((idx, row) => mapper(row)) : [];
    });
    return result;
  };

  findOne<T>(sql: string, mapper: (row: any) => T) {
    let result: T = null;
    this.getResource().get(sql, (err: Error, row: any) => {
      if (err) {
        console.error(err);
      } else {
        result = mapper(row);
      }
    });
    return result;
  };

  update(sql: string) {
    let result: number = 0;
    this.getResource().run(sql, (rs: RunResult, err: Error) => {
      if (err) {
        console.log(err);
      } else {
        result = rs.changes;
      }
    });
    return result;
  }

  async load(path: string) {
    const db = this.getResource();
    const logger = this.loggerResourceHandler.getResource();
    const readFile = (fileName: string) => util.promisify(fs.readFile)(fileName, 'utf8');
    const raw = await readFile(path);
    raw.split(';').forEach((query: string) => {
      if (query.trim().length == 0) {
        return;
      }
      db.run(query, (rs: RunResult, err: Error) => {
        if (err) {
          logger.error(`${err}`);
        } else {
          logger.info(`sqlite load: ${query.replace(/\n|\s{2,}/gim, '')}`);
        }
      });
    });
  }
}