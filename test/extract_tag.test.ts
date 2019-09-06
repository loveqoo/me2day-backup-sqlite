import { describe } from 'mocha'
import { expect } from 'chai';


describe('extract_tag', function () {
  it('filter', function () {
    const regex = /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]/g;
    expect('맛있는 빵집 42개 / 맛집 북마크'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('맛있는 빵집 42개 맛집 북마크');

    expect('이게 무슨 상황인가 / 어머니는 이미 나를 제외하고 동생부터 챙기실 모양 / 그래서 나보고 좋다는 사람 있음 덥썩 물라고 하신건가'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('이게 무슨 상황인가 어머니는 이미 나를 제외하고 동생부터 챙기실 모양 그래서 나보고 좋다는 사람 있음 덥썩 물라고 하신건가');

    expect('근데 어디가지?'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('근데 어디가지');

    expect('위급요청 / 헤헤~*'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('위급요청 헤헤');

    expect('폭력을 쓰면 일단 진거라고 생각해. 말로 못하니까 폭력인거지. 차라리 무시를 하던지...'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('폭력을 쓰면 일단 진거라고 생각해 말로 못하니까 폭력인거지 차라리 무시를 하던지');

    expect('닉네임에 유래가 궁금해요 / 1. 피부가 어둡다. 2. 초컬릿을 좋아한다'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('닉네임에 유래가 궁금해요 1 피부가 어둡다 2 초컬릿을 좋아한다');

    expect('네이트온 메신져 / 퇴근 권유 / 뭔가 이상해 ㅠ'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('네이트온 메신져 퇴근 권유 뭔가 이상해 ㅠ');

    expect('me2music King Of Pop (Korean Limited Edition)'
      .replace(regex, '')
      .replace(/\s{2,}/g, ' ')
    ).equal('me2music King Of Pop Korean Limited Edition');
  });
});