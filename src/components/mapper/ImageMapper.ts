import { Mapper, Pair } from "../define/base";
import { Image } from "../define/me2day.map";
import "cheerio";
import { injectable } from "inversify";

@injectable()
export class ImageMapper implements Mapper<Pair<CheerioStatic, Cheerio>, Image> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const $image = $.find('img');
    return {
      thumbnail: $image.attr('src'),
      original: $.attr('href')
    };
  }
}