import { DatabaseHandler, Mapper, Pair } from "../define/base";
import * as map from "../define/me2day.map";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class ImageMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Image> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const $image = $.find('img');
    return {
      thumbnail: $image.attr('src'),
      original: $.attr('href')
    };
  }
}