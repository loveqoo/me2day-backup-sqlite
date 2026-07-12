import { describe } from 'mocha'
import { expect } from 'chai';
import { readFileSync } from "fs";
import { Database } from "sqlite3";

describe('db_handle', function () {
  let db: Database;

  before('open db', (done) => {
    db = new Database(':memory:');
    db.exec(readFileSync('./db/schema.sql', 'utf8'), done);
  });

  beforeEach('clear test tags', (done) => {
    db.run(`DELETE
            FROM TAG
            WHERE ID in ('_TEST_1', '_TEST_2')`, done);
  });

  afterEach('clear test tags', (done) => {
    db.run(`DELETE
            FROM TAG
            WHERE ID in ('_TEST_1', '_TEST_2')`, done);
  });

  after('close db', (done) => {
    db.close(done);
  });

  it('insert_tag', function (done) {
    db.serialize(() => {
      db.run(`INSERT INTO TAG (id)
              VALUES ('_TEST_1')`);
      db.run(`INSERT INTO TAG (id)
              VALUES ('_TEST_2')`,
        function (err: Error) {
          expect(err).to.equal(null);
          expect(this.changes).eq(1);
          done();
        });
    });
  });

  it('select_tag', function (done) {
    db.serialize(() => {
      db.run(`INSERT INTO TAG (id)
              VALUES ('_TEST_1')`);
      db.get(`SELECT *
              FROM TAG
              WHERE ID = '_TEST_1'`, function (err: Error, row: any) {
        expect(err).to.equal(null);
        expect(row).to.not.null;
        expect(row).to.haveOwnProperty('id');
        done();
      });
    });
  });

  it('select_tags', function (done) {
    db.serialize(() => {
      db.run(`INSERT INTO TAG (id)
              VALUES ('_TEST_1')`);
      db.run(`INSERT INTO TAG (id)
              VALUES ('_TEST_2')`);
      db.get(`SELECT COUNT(*) as cnt
              FROM TAG`, function (err: Error, row: any) {
        expect(err).to.equal(null);
        expect(row).to.not.null;
        expect(row).to.haveOwnProperty('cnt');
        expect(row.cnt).eq(2)
      });
      db.all(`SELECT *
              FROM TAG
              WHERE ID in ('_TEST_1', '_TEST_2')`, function (err: Error, row: any) {
        expect(err).to.equal(null);
        expect(row).to.not.null;
        expect(row).to.be.an('array');
        expect(row.length).eq(2);
        done();
      });
    });
  });
});
