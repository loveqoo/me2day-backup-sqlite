import * as winston from "winston";
import { Database } from "sqlite3";
import { ApplicationContext, DatabaseHandler, FileHandler, LogHandler, Parser, ResourceHandler } from "../define/base";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import "reflect-metadata";

@injectable()
export default class DefaultApplicationContext implements ApplicationContext, ResourceHandler<void> {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: LogHandler;

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  @inject(TYPES.FileHandler)
  readonly fileHandler: FileHandler;

  @inject(TYPES.HtmlParser)
  readonly htmlParser: Parser;

  logger: winston.Logger;
  db: Database;

  async execute(f: () => Promise<void>) {
    await this.getResource();
    await f();
    await this.close();
  }

  async getResource() {
    this.logger = await this.loggerHandler.getResource();
    this.db = await this.databaseHandler.getResource();
  }

  async close() {
    this.logger = null;
    this.db = null;
    await this.loggerHandler.close();
    await this.databaseHandler.close();
  }
}