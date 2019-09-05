import "cheerio";
import { Embed, Mapper, Pair } from "../defines";
import { injectable } from "inversify";

@injectable()
export class EmbedMapper implements Mapper<Pair<CheerioStatic, Cheerio>, Embed> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const node = $.find('a');
    return node.length == 0 ? undefined : {
      src: node.attr('href'),
      thumbnail: $.find('img').attr('src')
    };
  }
}