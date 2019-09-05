import { Image, Mapper, Pair } from "../defines";
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