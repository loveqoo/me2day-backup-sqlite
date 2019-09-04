import * as winston from "winston";
import { Database } from "sqlite3";
import { ApplicationContext, DatabaseHandler, ResourceHandler } from "../defines";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import "reflect-metadata";

@injectable()
export default class DefaultApplicationContext implements ApplicationContext, ResourceHandler<void> {

  @inject(TYPES.LogHandler)
  readonly loggerResourceHandler: ResourceHandler<winston.Logger>;
  @inject(TYPES.SqliteHandler)
  readonly databaseResourceHandler: DatabaseHandler;

  logger : winston.Logger;
  db : Database;

  async execute(f: () => void, option: {}) {
    this.getResource(option);
    await f();
    this.close();
  }

  getResource(option: {}) {
    this.logger = this.loggerResourceHandler.getResource({});
    this.db = this.databaseResourceHandler.getResource({});
  }

  close() {
    this.logger = null;
    this.db = null;
    this.loggerResourceHandler.close();
    this.databaseResourceHandler.close();
  }
}