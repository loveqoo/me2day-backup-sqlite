import { container } from "./components/container";
import { ApplicationContext, Post, ResourceOption } from "./components/defines";
import { TYPES } from "./components/handlers/types";
import { extractPost } from "./components/handlers/HtmlParser";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const option = container.get<ResourceOption>("resourceOption");
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
    const post: Post = await holder(extractPost);
    console.log(post);
  });
});