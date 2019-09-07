import "cheerio";
import { DatabaseHandler, Mapper, Pair } from "../define/base";
import * as map from "../define/me2day.map";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class EmbedMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Embed> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const node = $.find('a');
    return node.length == 0 ? undefined : {
      src: node.attr('href'),
      thumbnail: $.find('img').attr('src')
    };
  }
}