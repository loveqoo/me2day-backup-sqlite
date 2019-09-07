import * as winston from "winston";
import { Logger } from "winston";
import { Database, RunResult } from "sqlite3";
import * as fs from "fs";
import { Stats } from "fs";

export interface Pair<A, B> {
  left: A
  right: B
}

export const toPair = <A, B>(a: A, b: B): Pair<A, B> => {
  return { left: a, right: b };
};

export interface Precondition<T> {
  assert: (t: T) => boolean
}

export const Preconditions = {
  of: <T>(checker: (t: T) => boolean, onFail: () => void): Precondition<T> => {
    return {
      assert: (t: T) => {
        if (checker(t)) {
          return true;
        } else {
          onFail();
          return false;
        }
      }
    }
  },
  checkAll: async (...args: Promise<boolean>[]) => {
    let result = await Promise.all(args);
    return !result.includes(false);
  }
};


export interface Environment {
  backup_path: string
  db_path: string
  mode: number
}

export interface ResourceHandler<T> {
  getResource: () => Promise<T>
  close: () => Promise<void>
}

export interface DatabaseHandler extends ResourceHandler<Database> {
  findOne: <T> (sql: string, mapper: (row: any) => T) => Promise<T>
  find: <T> (sql: string, mapper: (row: any) => T) => Promise<Array<T>>
  update: (sql: string, callback?: (this: RunResult, err: Error | null) => void) => Promise<number>
  insert: (sql: string, callback?: (this: RunResult, err: Error | null) => void) => Promise<number>
  load: (path: string) => Promise<void>
  doInTransaction: (f: (db: Database) => Promise<void>) => Promise<void>
}

export interface LogHandler extends ResourceHandler<Logger> {

}

export interface FileHandler {
  read: (path: string) => Promise<string>
  getStats: (path: string) => Promise<Stats | void>
  checkStats: (path: string, precondition: Precondition<fs.Stats | void>) => Promise<boolean>
  getFileList: (path: string) => Promise<string[]>
  checkFileList: (path: string, precondition: Precondition<string[]>) => Promise<boolean>
  execute: (base: string, f: (path: string) => Promise<void>, filter: (path: string) => boolean) => Promise<void>
}

type ParseResult = <T> (f: (pair: Pair<CheerioStatic, Cheerio>) => T) => T;

export interface Parser {
  load: (path: string) => Promise<ParseResult>
}

export interface ApplicationContext {
  loggerHandler: LogHandler
  databaseHandler: DatabaseHandler
  fileHandler: FileHandler
  htmlParser: Parser
  logger?: winston.Logger
  db?: Database
  execute: (f: () => Promise<void>) => void
}

export interface Mapper<S, T> {
  map: (source: S, option?: {}) => T
}