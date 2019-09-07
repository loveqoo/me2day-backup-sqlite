import "cheerio";
import { DatabaseHandler, Mapper, Pair, Saver } from "../define/base";
import * as map from "../define/me2day.map";
import * as db from "../define/me2day.db";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { LocationMappers, LocationQueries } from "../define/query.db";

@injectable()
export class LocationMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Location>, Saver<map.Location, db.Location> {

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

  async save(location: map.Location, option: { postId: number }) {
    const db = this.databaseHandler;
    const prevLocation = await db.findOne(LocationQueries.findByName(location.name), LocationMappers.all);
    if (prevLocation) {
      return prevLocation;
    }
    await db.insert(LocationQueries.insert(location, option.postId));
    return db.findOne(LocationQueries.findByName(location.name), LocationMappers.all);
  }
}