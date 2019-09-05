import { Comment, Embed, Image, Location, Mapper, Pair, People, Post, Timestamp, toPair } from "../defines";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class PostMapper implements Mapper<Pair<CheerioStatic, Cheerio>, Post> {

  @inject(TYPES.TimestampMapper)
  readonly timestampMapper: Mapper<string, Timestamp>;

  @inject(TYPES.PeopleMapper)
  readonly peopleMapper: Mapper<Pair<CheerioStatic, Cheerio>, People>;

  @inject(TYPES.ContentMapper)
  readonly contentMapper: Mapper<Pair<CheerioStatic, Cheerio>, string>;

  @inject(TYPES.LocationMapper)
  readonly locationMapper: Mapper<Pair<CheerioStatic, Cheerio>, Location>;

  @inject(TYPES.EmbedMapper)
  readonly embedMapper: Mapper<Pair<CheerioStatic, Cheerio>, Embed>;

  @inject(TYPES.ImageMapper)
  readonly imageMapper: Mapper<Pair<CheerioStatic, Cheerio>, Image>;

  @inject(TYPES.CommentMapper)
  readonly commentMapper: Mapper<Pair<CheerioStatic, Cheerio>, Comment>;

  @inject(TYPES.TagMapper)
  readonly tagMapper: Mapper<Pair<CheerioStatic, Cheerio>, string[]>;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const { left } = pair;
    const $ = left;
    return {
      writer: this.peopleMapper.map(toPair(left, $('img.profile_img'))),
      content: this.contentMapper.map(toPair(left, $('p.post_body'))),
      tag: this.tagMapper.map(toPair(left, $('p.post_tag'))),
      metoo: $('a.pi_s.profile_popup.no_link img').map((idx, image) => {
        return this.peopleMapper.map(toPair(left, $(image)));
      }).get(),
      timestamp: this.timestampMapper.map($('span.post_permalink').html()),
      images: $('a.per_img.photo').map((idx, anchor) => {
        return this.imageMapper.map(toPair(left, $(anchor)));
      }).get(),
      location: this.locationMapper.map(toPair(left, $('div.map_container'))),
      embed: this.embedMapper.map(toPair(left, $('div.embed_me2photo'))),
      comments: $('div.comment_item').map((idx, commentItem) => {
        return this.commentMapper.map(toPair(left, $(commentItem)));
      }).get()
    }
  }
}