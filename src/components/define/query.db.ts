import * as map from "./me2day.map";
import * as db from "../define/me2day.db";
import { Dates, Strings } from "./helper";

export const PostQueries = {
  insert: (post: map.Post) =>
    `INSERT INTO POST (content, writer, created_at, hash_code, file_path) 
        VALUES ('${post.content.body.replace(/'/g, "\'\'")}', 
                '${post.writer.id}', 
                '${Dates.toDatabaseTimestamp(post.timestamp)}', 
                ${Strings.hashCode(post.content.body)},
                '${post.file_path}')`,
  findById: (id: number) =>
    `SELECT * FROM POST WHERE id = ${id}`,
  findByHashCode: (post: map.Post) =>
    `SELECT * FROM POST WHERE hash_code = ${Strings.hashCode(post.content.body)}`,
  update: (id: number, post: map.Post) =>
    `UPDATE POST 
        SET 
          content = '${post.content}', 
          writer = '${post.writer.id}', 
          created_at = '${Dates.toDatabaseTimestamp(post.timestamp)}', 
          hash_code = ${Strings.hashCode(post.content.body)}) 
        WHERE id = ${id}`
};

export const PostMappers = {
  all: (row: any): db.Post => {
    return {
      id: row.id,
      content: row.content,
      writer: row.writer,
      created_at: row.created_at,
      hash_code: row.hash_code,
      file_path: row.file_path
    }
  }
};

export const CommentQueries = {
  findById: (id: number) =>
    `SELECT * FROM COMMENT WHERE id = '${id}'`,
  insert: (comment: map.Comment, postId: number) =>
    `INSERT INTO COMMENT (content, writer, post_id, created_at)  
        VALUES ('${comment.content.body.replace(/'/g, "\'\'")}', '${comment.writer.id}', '${postId}', '${Dates.toDatabaseTimestamp(comment.timestamp)}')`
};

export const CommentMappers = {
  all: (row: any): db.Comment => {
    return {
      id: row.id,
      content: row.content,
      writer: row.writer,
      post_id: row.post_id,
      created_at: row.created_at
    }
  }
};

export const PeopleQueries = {
  findById: (id: string) =>
    `SELECT * FROM PEOPLE WHERE id = '${id}'`,
  insert: (people: map.People) =>
    `INSERT INTO PEOPLE (id, nick_name, profile_path) 
        SELECT '${people.id}', '${people.nickname}', '${people.profile}' 
    WHERE NOT EXISTS (SELECT 1 FROM PEOPLE WHERE id = '${people.id}') 
    `
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
  insert: (tag: string) => `INSERT INTO TAG (id) SELECT '${tag}' WHERE NOT EXISTS (SELECT 1 FROM TAG WHERE id = '${tag}')`,
  all: (tags: string[]) => `SELECT * FROM TAG WHERE id in (${tags.map(tag => "'" + tag + "'").join(',')})`
};

export const TagMappers = {
  all: (row: any): db.Tag => {
    return {
      id: row.id
    }
  }
};

export const PostTagQueries = {
  insert: (postId: number, tagId: string) => `INSERT INTO POST_TAG (post_id, tag_id) VALUES (${postId}, '${tagId}')`
};

export const PostMetooQueries = {
  insert: (postId: number, peopleId: string) => `INSERT INTO POST_METOO (post_id, people_id) VALUES (${postId}, '${peopleId}')`
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