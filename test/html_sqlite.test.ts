import 'reflect-metadata';
import { expect } from 'chai';
import { mkdtempSync, mkdirSync, writeFileSync, unlinkSync, rmdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { container } from '../src/components/inversify/container';
import { TYPES } from '../src/components/inversify/types';
import { DatabaseHandler, Environment, LogHandler, Me2dayService } from '../src/components/define/base';
import * as cheerio from 'cheerio';

describe('synthetic HTML to SQLite', function () {
  it('preserves selectors, Korean text, entities, metadata and related rows', async function () {
    const dir = mkdtempSync(join(tmpdir(), 'me2day-test-'));
    mkdirSync(join(dir, 'img'));
    mkdirSync(join(dir, 'post'));
    const file = join(dir, 'post', 'synthetic.html');
    writeFileSync(file, `<html><body>
      <img class="profile_img" src="../img/images/user/synthetic_writer/profile.png" alt="작성자">
      <p class="post_body">합성  본문 &amp; '따옴표' <a href="https://example.test/page">링크</a><br>다음 줄<span class="post_permalink">13.05.26 09:30</span></p>
      <p class="post_tag">테스트 태그</p>
      <a class="pi_s profile_popup no_link"><img src="../img/images/user/synthetic_friend/profile.png" alt="친구"></a>
      <a class="per_img photo" href="../img/original.jpg"><img src="../img/thumb.jpg"></a>
      <div class="map_container"><span class="map_location_alt">합성 공원</span><a href="https://example.test/map"><img src="../img/map.png"></a></div>
      <div class="embed_me2photo"><a href="https://example.test/embed"><img src="../img/embed.png"></a></div>
      <div class="comment_item"><a class="comment_profile profile_popup no_link"><img src="../img/images/user/synthetic_commenter/profile.png" alt="댓글 작성자"></a><p class="para">댓글 &amp; '인용'</p><span class="comment_time">13.05.26 10:31</span></div>
    </body></html>`, 'utf8');
    const env = container.get<Environment>('Environment');
    const oldPath = env.db_path;
    env.db_path = ':memory:';
    const handler = container.get<DatabaseHandler>(TYPES.SqliteHandler);
    const logger = await container.get<LogHandler>(TYPES.LogHandler).getResource();
    const oldSilent = logger.silent;
    logger.silent = true;
    const db = await handler.getResource();
    const rows = (table: string): Promise<any[]> => new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table} ORDER BY rowid`, (err: Error, result: any[]) => err ? reject(err) : resolve(result));
    });
    try {
      const service = container.get<Me2dayService>(TYPES.Me2dayService);
      expect(await service.checkDir(dir)).to.equal(true);
      await handler.load('./db/schema.sql');
      const post = await service.parse(file);
      expect(post.writer).to.deep.equal({ id: 'synthetic_writer', nickname: '작성자', profile: '../img/images/user/synthetic_writer/profile.png' });
      expect(post.content).to.deep.equal({
        body: "합성본문 & '따옴표' 링크다음 줄",
        anchors: [{ title: '링크', url: 'https://example.test/page', domain: 'example.test' }]
      });
      expect(post.timestamp).to.deep.equal({ year: 2013, month: 5, day: 26, hour: 9, minute: 30 });
      expect(post.tags).to.deep.equal(['테스트', '태그']);
      expect(post.images).to.deep.equal([{ original: '../img/original.jpg', thumbnail: '../img/thumb.jpg' }]);
      expect(post.location).to.deep.equal({ name: '합성 공원', link: 'https://example.test/map', image_path: '../img/map.png' });
      expect(post.embed).to.deep.equal({ src: 'https://example.test/embed', thumbnail: '../img/embed.png' });
      expect(post.metoo.map(person => person.id)).to.deep.equal(['synthetic_friend']);
      expect(post.comments[0].content.body).to.equal("댓글 & '인용'");
      expect(post.comments[0].timestamp).to.deep.equal({ year: 2013, month: 5, day: 26, hour: 10, minute: 31 });
      await service.save(post, async () => { throw new Error('Unexpected retry'); });
      const saved = await rows('POST');
      expect(saved).to.have.length(1);
      expect(saved[0]).to.include({ content: post.content.body, writer: 'synthetic_writer', file_path: 'synthetic.html', created_at: '2013-05-26 09:30:00' });
      expect((await rows('PEOPLE')).map(person => person.id)).to.deep.equal(['synthetic_writer', 'synthetic_friend', 'synthetic_commenter']);
      expect((await rows('COMMENT'))[0]).to.include({ content: "댓글 & '인용'", writer: 'synthetic_commenter', post_id: saved[0].id });
      for (const table of ['POST_ANCHOR', 'POST_METOO', 'IMAGE', 'LOCATION', 'POST_LOCATION', 'EMBED']) {
        expect(await rows(table), table).to.have.length(1);
      }
      expect(await rows('TAG')).to.deep.equal([{ id: '테스트' }, { id: '태그' }]);
      expect(await rows('POST_TAG')).to.have.length(2);
      expect(await new Promise((resolve, reject) => db.all('PRAGMA foreign_key_check', (err: Error, result: any[]) => err ? reject(err) : resolve(result)))).to.deep.equal([]);
      const $ = cheerio.load('<ul><li>첫째</li><li>둘째</li><li>셋째</li></ul>');
      expect($('li:nth-child(2n+1)').text()).to.equal('첫째셋째');
    } finally {
      await handler.close();
      env.db_path = oldPath;
      logger.silent = oldSilent;
      unlinkSync(file);
      rmdirSync(join(dir, 'post'));
      rmdirSync(join(dir, 'img'));
      rmdirSync(dir);
    }
  });
});
