import { Container } from "inversify";
import { ApplicationContext, ResourceHandler } from "./defines";
import { Logger } from "winston";
import { TYPES } from "./handlers/types";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import LogHandler from "./handlers/Logger";
import SqliteDatabaseHandler from "./handlers/Database";
import DefaultApplicationContext from "./handlers/Context";

const container = new Container();
container.bind<ResourceHandler<Logger>>(TYPES.LogHandler).to(LogHandler);
container.bind<ResourceHandler<Database>>(TYPES.SqliteHandler).to(SqliteDatabaseHandler).inSingletonScope();
container.bind<ApplicationContext>(TYPES.ApplicationContext).to(DefaultApplicationContext);
container.bind<String>("dbName").toConstantValue("./db/me2day.db");
container.bind<number>("dbMode").toConstantValue(OPEN_READWRITE | OPEN_CREATE);
export { container };