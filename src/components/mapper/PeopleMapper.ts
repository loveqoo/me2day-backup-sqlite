import { DatabaseHandler, Mapper, Pair } from "../define/base";
import * as map from "../define/me2day.map";
import "cheerio";
import { inject, injectable } from "inversify";
import { TYPES } from "../inversify/types";

@injectable()
export class PeopleMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.People> {

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