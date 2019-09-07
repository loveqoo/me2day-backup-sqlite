import { container } from "./components/inversify/container";
import { ApplicationContext, Environment, Mapper, Pair, Preconditions } from "./components/define/base";
import * as map from "./components/define/me2day.map";
import { TYPES } from "./components/inversify/types";
import * as fs from "fs";
import * as path from "path";
import {
  CommentQueries,
  EmbedQueries,
  ImageQueries,
  LocationQueries,
  PeopleQueries,
  PostMetooQueries,
  PostQueries,
  PostTagQueries,
  TagMappers,
  TagQueries
} from "./components/define/query.db";
import { Databases } from "./components/define/helper";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const env = container.get<Environment>("Environment");
const postMapper = container.get<Mapper<Pair<CheerioStatic, Cheerio>, map.Post>>(TYPES.PostMapper);
env.backup_path = '/Users/anthony/iCloud\ Drive\(아카이브\)/Documents/backup/me2day/garangnip';

const SCHEMA_FILE = "./db/schema.sql";

context.execute(async () => {
  const valid = await Preconditions.checkAll(
    context.fileHandler.checkStats(
      env.backup_path,
      Preconditions.of(
        (stats: fs.Stats) => stats.isDirectory(),
        () => context.logger.error(`Your path(${env.backup_path}) is not directory.`))),
    context.fileHandler.checkFileList(
      env.backup_path,
      Preconditions.of(
        (fileList: string[]) => fileList.findIndex(fileName => fileName === 'post') > 0,
        () => context.logger.error(`Your path(${env.backup_path}) has not directory post`)))
  );
  if (!valid) {
    return;
  }
  await context.databaseHandler.load(SCHEMA_FILE);

  const base: string = path.join(env.backup_path, 'post');
  const files: string[] = await context.fileHandler.getFileList(base);
  const filteredFiles = files
    .filter(fileName => path.extname(fileName) === '.html')
    .map(filePath => path.join(base, filePath));

  const parseAndSave = async () => {
    if (filteredFiles.length === 0) {
      return;
    }
    const filePath: string = filteredFiles.shift();
    const holder = await context.htmlParser.load(filePath);
    const post: map.Post = await holder((pair: Pair<CheerioStatic, Cheerio>) => postMapper.map(pair, { file_path: path.basename(filePath) }));
    console.log(post.content.body);
    const db = context.db;
    const logger = context.logger;
    try {
      db.run("BEGIN");
      logger.debug(`Transaction Start`);

      await Databases.run(db, PeopleQueries.insert(post.writer));
      const postResult = await Databases.run(db, PostQueries.insert(post));
      if (!postResult) {
        await parseAndSave();
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
        await Databases.run(db, LocationQueries.insert(post.location, postId));
      }
      if (post.embed) {
        await Databases.run(db, EmbedQueries.insert(post.embed, postId));
      }
      if (post.comments.length > 0) {
        await Databases.runs(db, post.comments.map(comment => comment.writer).map(people => PeopleQueries.insert(people)));
        await Databases.runs(db, post.comments.map(comment => CommentQueries.insert(comment, postId)));
      }
      context.db.run("COMMIT");
      context.logger.debug(`Transaction End`);
    } catch (error) {
      context.logger.error(`Transaction Error: ${error}`);
      context.db.run("ROLLBACK");
    }
    await parseAndSave();
  };
  await parseAndSave();
});