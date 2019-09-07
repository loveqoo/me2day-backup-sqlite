import { DatabaseHandler, Mapper, Pair, Saver, toPair } from "../define/base";
import * as map from "../define/me2day.map";
import * as db from "../define/me2day.db";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { PostMappers, PostQueries } from "../define/query.db";
import { Dates } from "../define/helper";

@injectable()
export class PostMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Post>, Saver<map.Post, db.Post> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  @inject(TYPES.TimestampMapper)
  readonly timestampMapper: Mapper<string, map.Timestamp>;

  @inject(TYPES.PeopleMapper)
  readonly peopleMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.People>;

  @inject(TYPES.PeopleSaver)
  readonly peopleSaver: Saver<map.People, db.People>;

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

    await this.peopleSaver.save(post.writer);

    const db = this.databaseHandler;
    const posts: Array<db.Post> = await db.find(PostQueries.findByHashCode(post), PostMappers.all);
    switch (posts.length) {
      case 0 :
        const lastId = await db.insert(PostQueries.insert(post));
        return db.findOne(PostQueries.findById(lastId), PostMappers.all);
      case 1 :
        const prevPost = posts[0];
        if (prevPost.content === post.content && prevPost.created_at == Dates.toDatabaseTimestamp(post.timestamp)) {
          return prevPost;
        }
        await db.update(PostQueries.update(prevPost.id, post));
        return db.findOne(PostQueries.findById(prevPost.id), PostMappers.all);
      default :
        const idx = posts.findIndex((p: db.Post) => {
          return p.content === post.content && p.created_at == Dates.toDatabaseTimestamp(post.timestamp)
        });
        if (idx < 0) {
          const lastId = await db.insert(PostQueries.insert(post));
          return db.findOne(PostQueries.findById(lastId), PostMappers.all);
        } else {
          const prevPost = posts[idx];
          await db.update(PostQueries.update(prevPost.id, post));
          return db.findOne(PostQueries.findById(prevPost.id), PostMappers.all);
        }
    }
  }
}