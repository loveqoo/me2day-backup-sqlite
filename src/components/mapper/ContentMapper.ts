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
    // http 링크만 있는 경우 : p.iClY0.iOI.html
    // 난지 한강 공원에서 http://360.io/d9SG2s
    // 링크 문자와 함께 있는 경우 : p.G7tEg.iOI.html
    // <a href="http://me2day.net/lubs/2010/08/23#09:56:51">정리</a>
    // 를 하자면, 특정인 미투 검색-http://me2day.net/특정me2아이디/archive?search=검색어, 각자 미투 검색-http://me2day.net/search?query=검색어&amp;search_at=me
    //
    return {
      body: body,
      anchors: this.getAnchor(left, right.html())
    };
  }

  private getText = ($: CheerioStatic, text: string) => {
    return $('<p>' + text + '</p>').text().trim();
  };

  private getAnchor = ($: CheerioStatic, str: string) => {
    const result: Anchor[] = [];
    const anchorRegex = /<a href="(.+)">(.+)<\/a>/gm;
    let match;
    while ((match = anchorRegex.exec(str)) !== null) {
      const domain = match[1] ? /https?:\/\/([0-9a-zA-Z\\._]+)\/?/gm.exec(match[1])[1] || '' : '';
      result.push({ 'title': this.getText($, match[2]), 'url': match[1], 'domain': domain });
    }
    return result;
  }
}