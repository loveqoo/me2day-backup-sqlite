import "cheerio";
import { DatabaseHandler, Mapper, Pair } from "../define/base";
import * as map from "../define/me2day.map";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class LocationMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Location> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const nameNode = $.find('span.map_location_alt');
    return nameNode.length == 0 ? undefined : {
      name: nameNode.text(),
      link: $.find('a').attr('href'),
      image_path: $.find('img').attr('src')
    };
  }
}