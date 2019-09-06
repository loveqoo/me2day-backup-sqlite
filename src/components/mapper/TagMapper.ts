import "cheerio";
import { Mapper, Pair } from "../defines";
import { injectable } from "inversify";

@injectable()
export class TagMapper implements Mapper<Pair<CheerioStatic, Cheerio>, string[]> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    return this.check(pair.right.text());
  }

  check(str: string): string[] {
    if (!str || str.length == 0) {
      return [];
    }
    return str
      .replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ');
  }
}