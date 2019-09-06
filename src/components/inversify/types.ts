const TYPES = {

  PeopleMapper: Symbol.for("PeopleMapper"),
  TimestampMapper: Symbol.for("TimestampMapper"),
  ImageMapper: Symbol.for("ImageMapper"),
  LocationMapper: Symbol.for("LocationMapper"),
  EmbedMapper: Symbol.for("EmbedMapper"),
  ContentMapper: Symbol.for("ContentMapper"),
  CommentMapper: Symbol.for("CommentMapper"),
  TagMapper: Symbol.for("TagMapper"),
  PostMapper: Symbol.for("PostMapper"),
  PostSaver: Symbol.for("PostSaver"),

  LogHandler: Symbol.for("LogHandler"),
  SqliteHandler: Symbol.for("SqliteHandler"),
  FileHandler: Symbol.for("FileHandler"),
  HtmlParser: Symbol.for("HtmlParser"),
  ApplicationContext: Symbol.for("ApplicationContext"),
};
export { TYPES };