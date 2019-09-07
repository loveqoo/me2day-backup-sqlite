import { DatabaseHandler, Mapper, Pair, Saver } from "../define/base";
import * as map from "../define/me2day.map";
import "cheerio";
import { inject, injectable } from "inversify";
import * as db from "../define/me2day.db";
import { TYPES } from "../inversify/types";
import { ImageMappers, ImageQueries } from "../define/query.db";

@injectable()
export class ImageMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Image>, Saver<map.Image, db.Image> {

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

  async save(image: map.Image, option: { postId: number }) {
    const db = this.databaseHandler;
    const prevImage = await db.findOne(ImageQueries.findByOriginal(image.original), ImageMappers.all);
    if (prevImage) {
      return prevImage;
    }
    const id = await db.insert(ImageQueries.insert(image, option.postId));
    return db.findOne(ImageQueries.findById(id), ImageMappers.all);
  }
}