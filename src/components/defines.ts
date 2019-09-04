import * as winston from "winston";
import { Database } from "sqlite3";
import { Stats } from "fs";

export interface ResourceHandler<T> {
  getResource: (option?: ResourceOption) => T
  close: () => void
}

export interface ResourceOption {
  backup_path: string
  db_path: string
  mode: number
}

export interface DatabaseHandler extends ResourceHandler<Database> {
  findOne: <T> (sql: string, mapper: (row: any) => T) => T | null
  find: <T> (sql: string, mapper: (row: any) => T) => Array<T> | null
  update: (sql: string) => number
  load: (path: string) => void
}

export interface FileHandler {
  checkPath: () => Promise<boolean>
  getStats: (path: string) => Promise<Stats>
  getFileList: (path: string) => Promise<string[]>
}

export interface ApplicationContext {
  loggerHandler: ResourceHandler<winston.Logger>
  databaseHandler: DatabaseHandler
  fileHandler: FileHandler
  logger?: winston.Logger
  db?: Database
  execute: (f: () => void) => void
}