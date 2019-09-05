import "cheerio";
import { Mapper, Pair } from "../defines";
import { injectable } from "inversify";

@injectable()
export class TagMapper implements Mapper<Pair<CheerioStatic, Cheerio>, string[]> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    return [pair.right.text()];
  }
}