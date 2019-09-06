import { Post } from "./me2day.map";
import * as db from "../define/me2day.db";
import { Dates, Strings } from "./helper";
import { Logger } from "winston";

export const PostQueries = {
  insert: (post: Post) =>
    `INSERT INTO POST (content, writer, created_at, hash_code) 
        VALUES ('${post.content}', 
                ${post.writer.id}, 
                '${Dates.toDatabaseTimestamp(post.timestamp)}', 
                ${Strings.hashCode(post.content)})`,
  findById: (id: number) =>
    `SELECT * FROM POST WHERE id = ${id}`,
  findByHashCode: (post: Post) =>
    `SELECT * FROM POST WHERE hash_code = ${Strings.hashCode(post.content)}`,
  update: (id: number, post: Post) =>
    `UPDATE POST 
        SET 
          content = '${post.content}', 
          writer = ${post.writer.id}, 
          created_at = '${Dates.toDatabaseTimestamp(post.timestamp)}', 
          hash_code = ${Strings.hashCode(post.content)}) 
        WHERE id = ${id}`
};

export const PostMappers = {
  all: (row: any): db.Post => {
    return {
      id: row.id,
      content: row.content,
      writer: row.writer,
      created_at: row.created_at,
      hash_code: row.hash_code
    }
  }
};

export const Callbacks = {
  update: (logger: Logger) => {
    return function (err: Error) {
      if (err) {
        logger.warn(``);
      } else {
        logger.debug(`${this.lastID}`);
        logger.debug(`${this.changes}`);
      }
    };
  }
};