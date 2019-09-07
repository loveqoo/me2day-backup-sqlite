import { DatabaseHandler, Mapper, Pair, Saver } from "../define/base";
import * as map from "../define/me2day.map";
import * as db from "../define/me2day.db";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";
import { PeopleMappers, PeopleQueries } from "../define/query.db";

@injectable()
export class PeopleMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.People>, Saver<map.People, db.People> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  private regex: RegExp = /([a-zA-Z0-9_\-]+)\/profile.png$/gm;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const profile = $.attr('src');
    return {
      id: this.extractId(profile),
      nickname: $.attr('alt'),
      profile: profile
    }
  }

  async save(people: map.People) {
    const db = this.databaseHandler;
    const prevPeople = await db.findOne(PeopleQueries.findById(people.id), PeopleMappers.all);
    if (prevPeople) {
      return prevPeople;
    }
    await db.insert(PeopleQueries.insert(people));
    return db.findOne(PeopleQueries.findById(people.id), PeopleMappers.all);
  }

  private extractId(profile: string): string {
    if (!profile) {
      return '';
    }
    if (profile.includes('img/images/user')) {
      this.regex.lastIndex = 0;
      const match = this.regex.exec(profile);
      if (match) {
        return match[1];
      }
    } else {
      const step1 = profile.split('/');
      const step2 = step1[3].split('_');
      step2.pop();
      step2.pop();
      return step2.join('_');
    }
    return profile;
  }
}