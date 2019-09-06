import { DatabaseHandler, LogHandler, Mapper, Pair, Saver, toPair } from "../define/base";
import * as map from "../define/me2day.map";
import * as db from "../define/me2day.db";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { Callbacks, PostMappers, PostQueries } from "../define/query.db";

@injectable()
export class PostMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Post>, Saver<map.Post, db.Post> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  @inject(TYPES.LogHandler)
  readonly loggerHandler: LogHandler;

  @inject(TYPES.TimestampMapper)
  readonly timestampMapper: Mapper<string, map.Timestamp>;

  @inject(TYPES.PeopleMapper)
  readonly peopleMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.People>;

  @inject(TYPES.ContentMapper)
  readonly contentMapper: Mapper<Pair<CheerioStatic, Cheerio>, string>;

  @inject(TYPES.LocationMapper)
  readonly locationMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Location>;

  @inject(TYPES.EmbedMapper)
  readonly embedMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Embed>;

  @inject(TYPES.ImageMapper)
  readonly imageMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Image>;

  @inject(TYPES.CommentMapper)
  readonly commentMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Comment>;

  @inject(TYPES.TagMapper)
  readonly tagMapper: Mapper<Pair<CheerioStatic, Cheerio>, string[]>;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const { left } = pair;
    const $ = left;
    return {
      writer: this.peopleMapper.map(toPair(left, $('img.profile_img'))),
      content: this.contentMapper.map(toPair(left, $('p.post_body'))),
      tag: this.tagMapper.map(toPair(left, $('p.post_tag'))),
      metoo: $('a.pi_s.profile_popup.no_link img').map((_, image) => {
        return this.peopleMapper.map(toPair(left, $(image)));
      }).get(),
      timestamp: this.timestampMapper.map($('span.post_permalink').html()),
      images: $('a.per_img.photo').map((_, anchor) => {
        return this.imageMapper.map(toPair(left, $(anchor)));
      }).get(),
      location: this.locationMapper.map(toPair(left, $('div.map_container'))),
      embed: this.embedMapper.map(toPair(left, $('div.embed_me2photo'))),
      comments: $('div.comment_item').map((_, commentItem) => {
        return this.commentMapper.map(toPair(left, $(commentItem)));
      }).get()
    }
  }

  async save(post: map.Post) {
    const db = await this.databaseHandler.getResource();
    const logger = await this.loggerHandler.getResource();
    const prev = await this.databaseHandler.findOne(PostQueries.findByHashCode(post), PostMappers.all);
    if (prev) {
      if (prev.content === post.content) {
        return prev;
      }
      db.run(PostQueries.update(prev.id, post), Callbacks.update(logger));
      return this.databaseHandler.findOne(PostQueries.findById(prev.id), PostMappers.all);
    } else {
      const lastId = await this.databaseHandler.insert(PostQueries.insert(post));
      return this.databaseHandler.findOne(PostQueries.findById(lastId), PostMappers.all);
    }
  }
}