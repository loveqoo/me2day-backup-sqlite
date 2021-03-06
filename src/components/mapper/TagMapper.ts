import "cheerio";
import { DatabaseHandler, Mapper, Pair } from "../define/base";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class TagMapper implements Mapper<Pair<CheerioStatic, Cheerio>, string[]> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

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