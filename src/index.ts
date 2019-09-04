import { container } from "./components/container";
import { ApplicationContext, ResourceOption } from "./components/defines";
import { TYPES } from "./components/handlers/types";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const option = container.get<ResourceOption>("resourceOption");
option.backup_path = '/Users/anthony/iCloud\ Drive\(아카이브\)/Documents/backup/me2day/garangnip';

context.execute(async () => {
  const valid = await context.fileHandler.checkPath();
  if (!valid) {
    return;
  }
  const SCHEMA_FILE = "./db/schema.sql";
  await context.databaseHandler.load(SCHEMA_FILE);

  await context.fileHandler.execute(async (filePath: string) => {
    const holder = await context.htmlParser.load(filePath);
    const rawPost = await holder(extractRawPost);
    console.log(rawPost);
  });
});

const extractRawPost = async ($: CheerioStatic) => {
  return $('<p>' +
    $('p.post_body')
      .html()
      .replace(/<span class="post_permalink">.+<\/span>|\n|\s{2,}/gim, '')
    + '</p>').text().trim();
};