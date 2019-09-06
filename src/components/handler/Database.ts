import { Database, RunResult } from "sqlite3";
import { inject, injectable } from "inversify";
import DefaultResourceHandler from "./Handler";
import { DatabaseHandler, Environment, LogHandler } from "../define/base";
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
        async (err) => {
          const logger = await loggerResourceHandler.getResource();
          if (err) {
            logger.error(`sqlite open: ${err}`);
          } else {
            logger.info(`sqlite open: success`)
          }
        });
    }, async () => {
      const db = await this.getResource();
      db.close(async (err) => {
        const logger = await loggerResourceHandler.getResource();
        if (err) {
          logger.error(`sqlite close: ${err}`);
        } else {
          logger.info(`sqlite close: success`)
        }
      });
    });
  }

  async find<T>(sql: string, mapper: (row: any) => T) {
    let result: Array<T> = [];
    const db = await this.getResource();
    db.all(sql, function (err: Error, rows: any[]) {
      if (err) {
        console.error(err);
      }
      result = rows.length > 0 ? rows.map((idx, row) => mapper(row)) : [];
    });
    return result;
  };

  async findOne<T>(sql: string, mapper: (row: any) => T) {
    let result: T = null;
    const db = await this.getResource();
    const logger = await this.loggerResourceHandler.getResource();
    db.get(sql, function (err: Error, row: any) {
      if (err) {
        logger.error(err);
      } else {
        result = row ? mapper(row) : null;
      }
    });
    return result;
  };

  async update(sql: string) {
    let result: number = 0;
    const db = await this.getResource();
    const logger = await this.loggerResourceHandler.getResource();
    db.run(sql, function (err: Error) {
      if (err) {
        logger.error(err);
      } else {
        result = this.changes;
      }
    });
    return result;
  }

  async insert(sql: string) {
    let result: number = 0;
    const db = await this.getResource();
    const logger = await this.loggerResourceHandler.getResource();
    db.run(sql, function (err: Error) {
      if (err) {
        logger.error(err);
      } else {
        result = this.lastID;
      }
    });
    return result;
  }

  async load(path: string) {
    const db = await this.getResource();
    const logger = await this.loggerResourceHandler.getResource();
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