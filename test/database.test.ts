import { describe } from 'mocha'
import { expect } from 'chai';
import { Database, OPEN_READWRITE } from "sqlite3";

describe('db_handle', function () {
  let db: Database;
  before('open db', () => {
    db = new Database('./db/me2day.db', OPEN_READWRITE);
  });
  after('close db', () => {
    db.run(`DELETE
            FROM TAG
            WHERE ID in ('_TEST_1', '_TEST_2')`);
    db.close();
  });

  it('insert_tag', function (done) {
    db.run(`INSERT INTO TAG (id)
            VALUES ('_TEST_1')`,
      function (err: Error) {
        if (err) console.log(err);
        else {
          console.log(`lastId: ${this.lastID}`);
          console.log(`changes: ${this.changes}`);
        }
        expect(!err).equal(true);
      });
    db.run(`INSERT INTO TAG (id)
            VALUES ('_TEST_2')`,
      function (err: Error) {
        if (err) console.log(err);
        else {
          console.log(`lastId: ${this.lastID}`);
          console.log(`changes: ${this.changes}`);
        }
        expect(!err).equal(true);
        done();
      });
  });

  it('select_tag', function (done) {
    db.run(`INSERT INTO TAG (id)
            VALUES ('_TEST_1')`);
    db.get(`SELECT *
            FROM TAG
            WHERE ID = '_TEST_1'`, function (err: Error, row: any) {
      if (err) console.log(err);
      expect(row).to.not.null;
      expect(row).to.haveOwnProperty('id');
      done();
    });
  });
});