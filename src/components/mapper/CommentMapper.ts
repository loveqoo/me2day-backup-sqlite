import "cheerio";
import { Mapper, Pair, toPair } from "../define/base";
import * as map from "../define/me2day.map";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class CommentMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Comment> {

  @inject(TYPES.TimestampMapper)
  readonly timestampMapper: Mapper<string, map.Timestamp>;

  @inject(TYPES.PeopleMapper)
  readonly peopleMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.People>;

  @inject(TYPES.ContentMapper)
  readonly contentMapper: Mapper<Pair<CheerioStatic, Cheerio>, map.Content>;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const { left, right } = pair;
    const $ = right;
    return {
      writer: this.peopleMapper.map(toPair(left, $.find('a.comment_profile.profile_popup.no_link img'))),
      content: this.contentMapper.map(toPair(left, $.find('p.para'))),
      timestamp: this.timestampMapper.map($.find('span.comment_time').html())
    }
  }
}