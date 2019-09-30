import { describe } from 'mocha'
import { expect } from 'chai';

const extractor = (str: string) => {
  const result: any[] = [];
  if (!str) {
    return result;
  }
  const regex = /<a href="(.+)">(.+)<\/a>/gm;
  let match;
  while ((match = regex.exec(str)) !== null) {
    result.push({ 'text': match[2], 'url': match[1] });
  }
  return result;
};

describe('extract_anchor', function () {
  it('type_1', function () {
    const str = `<a href="http://me2day.net/lubs/2010/08/23#09:56:51">정리1</a>
    를 하자면, 특정인 미투 검색-http://me2day.net/특정me2아이디/archive?search=검색어, 각자 미투 검색-http://me2day.net/search?query=검색어&amp;search_at=me
    <a href="http://me2day.net/lubs/2010/08/23#09:56:51">정리2</a>
    를 하자면, 특정인 미투 검색-http://me2day.net/특정me2아이디/archive?search=검색어, 각자 미투 검색-http://me2day.net/search?query=검색어&amp;search_at=me
`;
    const result = extractor(str);
    expect(result).is.length(2);
    expect(result[0]['text']).equal('정리1');
    expect(result[1]['text']).equal('정리2');
  });
});