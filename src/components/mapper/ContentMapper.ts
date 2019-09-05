import { Mapper, Pair } from "../defines";
import { injectable } from "inversify";
import "cheerio";

@injectable()
export class ContentMapper implements Mapper<Pair<CheerioStatic, Cheerio>, string> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const { left, right } = pair;
    return this.getText(
      left,
      right.html()
        .replace(/<span class="post_permalink">.+<\/span>|\n|\s{2,}/gim, '')
    );
  }

  private getText = ($: CheerioStatic, text: string) => {
    return $('<p>' + text + '</p>').text().trim();
  }
}