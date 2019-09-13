import { inject, injectable } from "inversify";
import { TYPES } from "./inversify/types";
import { DatabaseHandler, FileHandler, LogHandler, Mapper, Me2dayService, Pair, Parser, Preconditions } from "./define/base";
import * as map from "./define/me2day.map";
import "cheerio";
import * as path from "path";
import { Databases } from "./define/helper";
import {
  CommentQueries,
  EmbedQueries,
  ImageQueries,
  LocationQueries,
  PeopleQueries,
  PostLocationQueries,
  PostMetooQueries,
  PostQueries,
  PostTagQueries,
  TagMappers,
  TagQueries
} from "./define/query.db";
import * as fs from "fs";

@injectable()
export default class Me2day implements Me2dayService {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: LogHandler;

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  @inject(TYPES.FileHandler)
  readonly fileHandler: FileHandler;

  @inject(TYPES.HtmlParser)
  readonly htmlParser: Parser;

  @inject(TYPES.PostMapper)
  readonly postMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Post>;

  async checkDir(dirPath: string): Promise<boolean> {
    const logger = await this.loggerHandler.getResource();
    return Preconditions.checkAll(
      this.fileHandler.checkStats(
        dirPath,
        Preconditions.of(
          (stats: fs.Stats) => stats.isDirectory(),
          () => logger.error(`Your path(${dirPath}) is not directory.`))),
      this.fileHandler.checkFileList(
        dirPath,
        Preconditions.of(
          (fileList: string[]) => fileList.findIndex(fileName => fileName === 'post') > 0,
          () => logger.error(`Your path(${dirPath}) has not directory post`)))
    );
  }

  async parse(filePath: string): Promise<map.Post> {
    const holder = await this.htmlParser.load(filePath);
    return holder((pair: Pair<CheerioStatic, Cheerio>) =>
      this.postMapper.map(
        pair,
        { file_path: path.basename(filePath) })
    );
  }

  async save(post: map.Post, retry: () => Promise<void>): Promise<void> {
    const db = await this.databaseHandler.getResource();
    const logger = await this.loggerHandler.getResource();
    try {
      db.run("BEGIN");
      logger.debug(`Transaction Start`);

      await Databases.run(db, PeopleQueries.insert(post.writer));
      const postResult = await Databases.run(db, PostQueries.insert(post));
      if (!postResult) {
        await retry();
        return;
      }
      const postId = postResult.lastID;
      if (post.metoo.length > 0) {
        await Databases.runs(db, post.metoo.map(people => PeopleQueries.insert(people)));
        await Databases.runs(db, post.metoo.map(people => PostMetooQueries.insert(postId, people.id)));
      }
      if (post.tags.length > 0) {
        await Databases.runs(db, post.tags.map(tag => TagQueries.insert(tag)));
        const tags = await Databases.all(db, TagQueries.all(post.tags), TagMappers.all);
        await Databases.runs(db, tags.map(tag => PostTagQueries.insert(postId, tag.id)));
      }
      if (post.images.length > 0) {
        await Databases.runs(db, post.images.map(image => ImageQueries.insert(image, postId)));
      }
      if (post.location) {
        await Databases.run(db, LocationQueries.insert(post.location));
        await Databases.run(db, PostLocationQueries.insert(postId, post.location.name));
      }
      if (post.embed) {
        await Databases.run(db, EmbedQueries.insert(post.embed, postId));
      }
      if (post.comments.length > 0) {
        await Databases.runs(db, post.comments.map(comment => comment.writer).map(people => PeopleQueries.insert(people)));
        await Databases.runs(db, post.comments.map(comment => CommentQueries.insert(comment, postId)));
      }
      db.run("COMMIT");
      logger.info(post.content.body);
      logger.debug(`Transaction End`);
    } catch (error) {
      logger.error(`Transaction Error: ${error}`);
      db.run("ROLLBACK");
    }
  }
}