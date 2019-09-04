import { container } from "./components/container";
import { ApplicationContext } from "./components/defines";
import { TYPES } from "./components/handlers/types";

const context = container.get<ApplicationContext>(TYPES.ApplicationContext);
context.execute(async () => {
  const SCHEMA_FILE = "./db/schema.sql";
  await context.databaseResourceHandler.load(SCHEMA_FILE);
}, {});