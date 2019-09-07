import * as map from "./me2day.map";
import * as db from "../define/me2day.db";
import { Dates, Strings } from "./helper";

export const PostQueries = {
  insert: (post: map.Post) =>
    `INSERT INTO POST (content, writer, created_at, hash_code) 
        VALUES ('${post.content}', 
                ${post.writer.id}, 
                '${Dates.toDatabaseTimestamp(post.timestamp)}', 
                ${Strings.hashCode(post.content)})`,
  findById: (id: number) =>
    `SELECT * FROM POST WHERE id = ${id}`,
  findByHashCode: (post: map.Post) =>
    `SELECT * FROM POST WHERE hash_code = ${Strings.hashCode(post.content)}`,
  update: (id: number, post: map.Post) =>
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

export const PeopleQueries = {
  findById: (id: string) =>
    `SELECT * FROM PEOPLE WHERE id = '${id}'`,
  insert: (people: map.People) => `INSERT INTO PEOPLE (id, nick_name, profile_path) VALUES (${people.id}, ${people.nickname}, ${people.profile})`
};

export const PeopleMappers = {
  all: (row: any): db.People => {
    return {
      id: row.id,
      nick_name: row.nick_name,
      profile_path: row.profile_path
    }
  }
};

export const TagQueries = {
  insert: (tag: string) => `INSERT INTO TAG (id) VALUES ('${tag}')`
};

export const LocationQueries = {
  findByName: (name: string) => `SELECT * FROM LOCATION WHERE name = '${name}'`,
  insert: (location: map.Location, postId: number) => `INSERT INTO LOCATION (name, link, image_path, post_id) VALUES ('${location.name}', '${location.link}', '${location.image_path}', ${postId})`
};

export const LocationMappers = {
  all: (row: any): db.Location => {
    return {
      name: row.name,
      link: row.link,
      image_path: row.image_path,
      post_id: row.post_id
    }
  }
};

export const ImageQueries = {
  findById: (id: number) => `SELECT * FROM IMAGE WHERE id = ${id}`,
  findByOriginal: (original: string) => `SELECT * FROM IMAGE WHERE original = '${original}'`,
  insert: (image: map.Image, postId: number) => `INSERT INTO IMAGE (original, thumbnail, post_id) VALUES ('${image.original}', '${image.thumbnail}', ${postId})`
};

export const ImageMappers = {
  all: (row: any): db.Image => {
    return {
      id: row.id,
      original: row.original,
      thumbnail: row.thumbnail,
      post_id: row.post_id
    }
  }
};

export const EmbedQueries = {
  findById: (id: number) => `SELECT * FROM EMBED WHERE id = ${id}`,
  findBySrc: (src: string) => `SELECT * FROM EMBED WHERE src = '${src}'`,
  insert: (embed: map.Embed, postId: number) => `INSERT INTO EMBED (src, thumbnail, post_id) VALUES ('${embed.src}', '${embed.thumbnail}', ${postId})`
};

export const EmbedMappers = {
  all: (row: any): db.Embed => {
    return {
      id: row.id,
      src: row.src,
      thumbnail: row.thumbnail,
      post_id: row.post_id
    }
  }
};

// export const Callbacks = {
//   update: (logger: Logger) => {
//     return function (err: Error) {
//       if (err) {
//         logger.warn(``);
//       } else {
//         logger.debug(`${this.lastID}`);
//         logger.debug(`${this.changes}`);
//       }
//     };
//   }
// };