import { container } from "./components/inversify/container";
import { ApplicationContext, Environment, Mapper, Pair, Post, Preconditions } from "./components/defines";
import { TYPES } from "./components/inversify/types";
import * as fs from "fs";
import * as path from "path";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const env = container.get<Environment>("Environment");
const postMapper = container.get<Mapper<Pair<CheerioStatic, Cheerio>, Post>>(TYPES.PostMapper);
//env.backup_path = '/Users/anthony/iCloud\ Drive\(아카이브\)/Documents/backup/me2day/garangnip';

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

  await context.fileHandler.execute(path.join(env.backup_path, 'post'), async (filePath: string) => {
    const holder = await context.htmlParser.load(filePath);
    const post: Post = await holder((pair: Pair<CheerioStatic, Cheerio>) => postMapper.map(pair));
    //post.comments.length > 0 && console.log(post.comments[0]);
    console.log(post);
  }, (fileName: string) => path.extname(fileName) === '.html');
});