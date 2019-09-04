import * as winston from "winston";
import { Database } from "sqlite3";

export interface ResourceHandler<T> {
  getResource: (option: {}) => T
  close: () => void
}

export interface DatabaseHandler extends ResourceHandler<Database> {
  findOne: <T> (sql: string, mapper: (row: any) => T) => T | null
  find: <T> (sql: string, mapper: (row: any) => T) => Array<T> | null
  update: (sql: string) => number
  load: (path: string) => void
}

export interface ApplicationContext {
  loggerResourceHandler: ResourceHandler<winston.Logger>
  databaseResourceHandler: DatabaseHandler
  logger?: winston.Logger
  db?: Database
  execute: (f: () => void, option: {}) => void
}