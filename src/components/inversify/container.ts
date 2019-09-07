import { Container } from "inversify";
import { ApplicationContext, Environment, FileHandler, LogHandler, Mapper, Pair, Parser, ResourceHandler } from "../define/base";
import * as map from "../define/me2day.map"
import "cheerio";
import { TYPES } from "./types";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import DefaultLogHandler from "../handler/Logger";
import SqliteDatabaseHandler from "../handler/Database";
import DefaultApplicationContext from "../handler/Context";
import DefaultFileHandler from "../handler/File";
import DefaultHtmlParser from "../handler/HtmlParser";
import { PeopleMapper } from "../mapper/PeopleMapper";
import { TimestampMapper } from "../mapper/TimestampMapper";
import { ImageMapper } from "../mapper/ImageMapper";
import { LocationMapper } from "../mapper/LocationMapper";
import { EmbedMapper } from "../mapper/EmbedMapper";
import { ContentMapper } from "../mapper/ContentMapper";
import { TagMapper } from "../mapper/TagMapper";
import { PostMapper } from "../mapper/PostMapper";
import { CommentMapper } from "../mapper/CommentMapper";

const container = new Container();

container.bind<Mapper<string, map.Timestamp>>(TYPES.TimestampMapper).to(TimestampMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.People>>(TYPES.PeopleMapper).to(PeopleMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Image>>(TYPES.ImageMapper).to(ImageMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Location>>(TYPES.LocationMapper).to(LocationMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Embed>>(TYPES.EmbedMapper).to(EmbedMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Content>>(TYPES.ContentMapper).to(ContentMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, string[]>>(TYPES.TagMapper).to(TagMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Comment>>(TYPES.CommentMapper).to(CommentMapper).inSingletonScope();
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, map.Post>>(TYPES.PostMapper).to(PostMapper).inSingletonScope();

container.bind<LogHandler>(TYPES.LogHandler).to(DefaultLogHandler).inSingletonScope();
container.bind<FileHandler>(TYPES.FileHandler).to(DefaultFileHandler).inSingletonScope();
container.bind<Parser>(TYPES.HtmlParser).to(DefaultHtmlParser).inSingletonScope();
container.bind<ResourceHandler<Database>>(TYPES.SqliteHandler).to(SqliteDatabaseHandler).inSingletonScope();
container.bind<ApplicationContext>(TYPES.ApplicationContext).to(DefaultApplicationContext).inSingletonScope();

const env: Environment = {
  mode: OPEN_READWRITE | OPEN_CREATE,
  backup_path: process.argv[2] || '',
  db_path: './db/me2day.db'
};
container.bind<Environment>("Environment").toConstantValue(env);
export { container };