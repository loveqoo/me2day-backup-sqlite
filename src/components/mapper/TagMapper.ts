import "cheerio";
import { DatabaseHandler, Mapper, Pair, Saver } from "../define/base";
import { inject, injectable } from "inversify";
import { Tag } from "../define/me2day.db";
import { TYPES } from "../inversify/types";
import { TagQueries } from "../define/query.db";

@injectable()
export class TagMapper implements Mapper<Pair<CheerioStatic, Cheerio>, string[]>, Saver<string[], Tag[]> {

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

  async save(target: string[]) {
    const db = this.databaseHandler;
    return Promise.all(target.map(async (tag) => {
      await db.insert(TagQueries.insert(tag));
      return { id: tag };
    }));
  }
}