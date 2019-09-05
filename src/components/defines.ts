import * as winston from "winston";
import { Database } from "sqlite3";
import { Stats } from "fs";

export interface Pair<A, B> {
  left: A
  right: B
}

export const toPair = <A, B>(a: A, b: B): Pair<A, B> => {
  return { left: a, right: b };
};

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
  read: (path: string) => Promise<string>
  getStats: (path: string) => Promise<Stats>
  getFileList: (path: string) => Promise<string[]>
  execute: (f: (path: string) => void) => void
}

type ParseResult = <T> (f: (pair: Pair<CheerioStatic, Cheerio>) => T) => T;

export interface Parser {
  load: (path: string) => Promise<ParseResult>
}

export interface ApplicationContext {
  loggerHandler: ResourceHandler<winston.Logger>
  databaseHandler: DatabaseHandler
  fileHandler: FileHandler
  htmlParser: Parser
  logger?: winston.Logger
  db?: Database
  execute: (f: () => void) => void
}

export interface Image {
  original: string
  thumbnail: string
}

export interface Location {
  name: string
  link: string
  image: string
}

export interface Embed {
  src: string
  thumbnail: string
}

export interface Timestamp {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

export interface Mapper<S, T> {
  map: (source: S) => T
}

export interface People {
  id: string
  nickname: string
  profile: string
}

export interface Comment {
  writer: People
  content: string
  timestamp: Timestamp
}

export interface Post {
  writer: People
  content: string
  tag: string[]
  metoo: People[]
  timestamp: Timestamp
  images: Image[]
  location: Location
  embed: Embed
  comments: Comment[]
}