import { container } from "./components/container";
import { ApplicationContext } from "./components/defines";
import { TYPES } from "./components/handlers/types";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
//option.backup_path = '/Users/anthony/iCloud\ Drive\(아카이브\)/Documents/backup/me2day/garangnip';

context.execute(async () => {
  const valid = await context.fileHandler.checkPath();
  if (!valid) {
    return;
  }
  const SCHEMA_FILE = "./db/schema.sql";
  await context.databaseHandler.load(SCHEMA_FILE);
});