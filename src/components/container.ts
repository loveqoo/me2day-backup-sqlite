import { Container } from "inversify";
import { ApplicationContext, FileHandler, ResourceHandler, ResourceOption } from "./defines";
import { Logger } from "winston";
import { TYPES } from "./handlers/types";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import LogHandler from "./handlers/Logger";
import SqliteDatabaseHandler from "./handlers/Database";
import DefaultApplicationContext from "./handlers/Context";
import DefaultFileHandler from "./handlers/File";

const container = new Container();
container.bind<ResourceHandler<Logger>>(TYPES.LogHandler).to(LogHandler);
container.bind<FileHandler>(TYPES.FileHandler).to(DefaultFileHandler);
container.bind<ResourceHandler<Database>>(TYPES.SqliteHandler).to(SqliteDatabaseHandler).inSingletonScope();
container.bind<ApplicationContext>(TYPES.ApplicationContext).to(DefaultApplicationContext);

const resourceOption: ResourceOption = {
  mode: OPEN_READWRITE | OPEN_CREATE,
  backup_path: process.argv[2] || '',
  db_path: './db/me2day.db'
};
container.bind<ResourceOption>("resourceOption").toConstantValue(resourceOption);
export { container };