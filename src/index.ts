import { container } from "./components/inversify/container";
import { ApplicationContext, Mapper, Pair, Post, ResourceOption } from "./components/defines";
import { TYPES } from "./components/inversify/types";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const option = container.get<ResourceOption>("resourceOption");
const postMapper = container.get<Mapper<Pair<CheerioStatic, Cheerio>, Post>>(TYPES.PostMapper);
option.backup_path = '/Users/anthony/iCloud\ Drive\(아카이브\)/Documents/backup/me2day/garangnip';

const SCHEMA_FILE = "./db/schema.sql";

context.execute(async () => {
  const valid = await context.fileHandler.checkPath();
  if (!valid) {
    return;
  }
  await context.databaseHandler.load(SCHEMA_FILE);

  await context.fileHandler.execute(async (filePath: string) => {
    const holder = await context.htmlParser.load(filePath);
    const post: Post = await holder((pair: Pair<CheerioStatic, Cheerio>) => postMapper.map(pair));
    //post.comments.length > 0 && console.log(post.comments[0]);
    console.log(post);
  });
});