import { Container } from "inversify";
import {
  ApplicationContext,
  Comment,
  Embed,
  FileHandler,
  Image,
  Location,
  Mapper,
  Pair,
  Parser,
  People,
  Post,
  ResourceHandler,
  ResourceOption,
  Timestamp
} from "../defines";
import { Logger } from "winston";
import "cheerio";
import { TYPES } from "./types";
import { Database, OPEN_CREATE, OPEN_READWRITE } from "sqlite3";
import LogHandler from "../handlers/Logger";
import SqliteDatabaseHandler from "../handlers/Database";
import DefaultApplicationContext from "../handlers/Context";
import DefaultFileHandler from "../handlers/File";
import DefaultHtmlParser from "../handlers/HtmlParser";
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

container.bind<Mapper<string, Timestamp>>(TYPES.TimestampMapper).to(TimestampMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, People>>(TYPES.PeopleMapper).to(PeopleMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, Image>>(TYPES.ImageMapper).to(ImageMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, Location>>(TYPES.LocationMapper).to(LocationMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, Embed>>(TYPES.EmbedMapper).to(EmbedMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, string>>(TYPES.ContentMapper).to(ContentMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, string[]>>(TYPES.TagMapper).to(TagMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, Comment>>(TYPES.CommentMapper).to(CommentMapper);
container.bind<Mapper<Pair<CheerioStatic, Cheerio>, Post>>(TYPES.PostMapper).to(PostMapper);

container.bind<ResourceHandler<Logger>>(TYPES.LogHandler).to(LogHandler);
container.bind<FileHandler>(TYPES.FileHandler).to(DefaultFileHandler);
container.bind<Parser>(TYPES.HtmlParser).to(DefaultHtmlParser);
container.bind<ResourceHandler<Database>>(TYPES.SqliteHandler).to(SqliteDatabaseHandler).inSingletonScope();
container.bind<ApplicationContext>(TYPES.ApplicationContext).to(DefaultApplicationContext);

const resourceOption: ResourceOption = {
  mode: OPEN_READWRITE | OPEN_CREATE,
  backup_path: process.argv[2] || '',
  db_path: './db/me2day.db'
};
container.bind<ResourceOption>("resourceOption").toConstantValue(resourceOption);
export { container };