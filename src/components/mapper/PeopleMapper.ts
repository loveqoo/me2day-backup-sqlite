import { Mapper, Pair, People } from "../defines";
import "cheerio";
import { injectable } from "inversify";

@injectable()
export class PeopleMapper implements Mapper<Pair<CheerioStatic, Cheerio>, People> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const profile = $.attr('src');
    return {
      id: this.extractId(profile),
      nickname: $.attr('alt'),
      profile: profile
    }
  }

  private regex: RegExp = /([a-zA-Z0-9_\-]+)\/profile.png$/gm;

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