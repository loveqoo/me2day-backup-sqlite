import { Mapper, Pair } from "../define/base";
import { injectable } from "inversify";
import "cheerio";
import * as map from "../define/me2day.map";
import { Anchor } from "../define/me2day.map";

@injectable()
export class ContentMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Content> {

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const { left, right } = pair;
    const body = this.getText(
      left,
      right.html()
        .replace(/<span class="post_permalink">.+<\/span>|\n|\s{2,}/gim, '')
    );
    // TODO: extract anchor
    return {
      body: body,
      anchors: Array.of<Anchor>()
    };
  }

  private getText = ($: CheerioStatic, text: string) => {
    return $('<p>' + text + '</p>').text().trim();
  }
}