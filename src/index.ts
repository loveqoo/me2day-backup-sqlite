import { container } from "./components/inversify/container";
import { ApplicationContext, Environment, Me2dayService } from "./components/define/base";
import * as map from "./components/define/me2day.map";
import { TYPES } from "./components/inversify/types";
import * as path from "path";
import { Promises } from "./components/define/helper";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
const env = container.get<Environment>("Environment");
const me2dayService = container.get<Me2dayService>(TYPES.Me2dayService);
env.backup_path = '/Users/anthony/Documents/me2day/garangnip';

const SCHEMA_FILE = "./db/schema.sql";

context.execute(async () => {
  const valid = await me2dayService.checkDir(env.backup_path);
  if (!valid) {
    return;
  }
  await context.databaseHandler.load(SCHEMA_FILE);

  const base: string = path.join(env.backup_path, 'post');

  await Promises.sequential(async () => {
    const files: string[] = await context.fileHandler.getFileList(base);
    return files
      .filter(fileName => path.extname(fileName) === '.html')
      .map(filePath => path.join(base, filePath))
  }, async (filePath: string, retry: () => Promise<void>) => {
    const post: map.Post = await me2dayService.parse(filePath);
    await me2dayService.save(post, retry);
  });
});