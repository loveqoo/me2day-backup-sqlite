import * as winston from "winston";
import { Database } from "sqlite3";
import { ApplicationContext, DatabaseHandler, FileHandler, Parser, ResourceHandler } from "../defines";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import "reflect-metadata";

@injectable()
export default class DefaultApplicationContext implements ApplicationContext, ResourceHandler<void> {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: ResourceHandler<winston.Logger>;
  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;
  @inject(TYPES.FileHandler)
  readonly fileHandler: FileHandler;
  @inject(TYPES.HtmlParser)
  readonly htmlParser: Parser;

  logger: winston.Logger;
  db: Database;

  async execute(f: () => void) {
    this.getResource();
    await f();
    this.close();
  }

  getResource() {
    this.logger = this.loggerHandler.getResource();
    this.db = this.databaseHandler.getResource();
  }

  close() {
    this.logger = null;
    this.db = null;
    this.loggerHandler.close();
    this.databaseHandler.close();
  }
}