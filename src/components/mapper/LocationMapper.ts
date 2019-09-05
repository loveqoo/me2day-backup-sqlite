import "cheerio";
import { Location, Mapper, Pair } from "../defines";
import { injectable } from "inversify";

@injectable()
export class LocationMapper implements Mapper<Pair<CheerioStatic, Cheerio>, Location> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const nameNode = $.find('span.map_location_alt');
    return nameNode.length == 0 ? undefined : {
      name: nameNode.text(),
      link: $.find('a').attr('href'),
      image: $.find('img').attr('src')
    };
  }
}