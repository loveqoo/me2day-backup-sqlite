import { Timestamp } from "./me2day.map";
import { Database } from "sqlite3";

export const Dates = {
  toDatabaseTimestamp: (ts: Timestamp): string => {
    const padding = (n: number) => n < 10 ? '0' + n : '' + n;
    const result: string[] = [];
    result.push(padding(ts.year));
    result.push('-');
    result.push(padding(ts.month));
    result.push('-');
    result.push(padding(ts.day));
    result.push(' ');
    result.push(padding(ts.hour));
    result.push(':');
    result.push(padding(ts.minute));
    result.push(':00');
    return result.join('');
  }
};

export const Strings = {
  // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  hashCode: (str: string): number => {
    let hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
};

export interface RunResult {
  lastID: number
  changes: number
}

export const Databases = {
  run(db: Database, sql: string) {
    return new Promise<RunResult>((resolve, reject) => {
      db.run(sql, function (err: Error) {
        if (err) {
          console.error(sql);
          reject(err);
        } else resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      });
    }).catch((err) => console.log(`Databases.run : ${err}`));
  },
  runs(db: Database, sqls: string[]) {
    return Promise.all(sqls.map(sql => this.run(db, sql)));
  },
  sequentialRuns(db: Database, sqls: string[]) {
    let promise: Promise<void> = Promise.resolve();
    while (sqls.length > 0) {
      const sql = sqls.shift();
      promise = promise.then(() => this.run(db, sql)).catch((err) => console.log(`Databases.sequentialRuns: ${err}`));
    }
    return promise;
  },
  all<T>(db: Database, sql: string, map: (row: any) => T) {
    return new Promise<T[]>((resolve, reject) => {
      db.all(sql, function (err: Error, rows: any[]) {
        if (err) reject(err);
        else resolve(rows.map(row => map(row)));
      });
    });
  },
  get<T>(db: Database, sql: string, map: (row: any) => T) {
    return new Promise<T>((resolve, reject) => {
      db.get(sql, function (err: Error, row: any) {
        if (err) reject(err);
        else resolve(row ? map(row) : null);
      });
    });
  }
};

export const Promises = {
  async sequential<T>(supplier: () => Promise<T[]>, consumer: (t: T, retry: () => Promise<void>) => Promise<void>) {
    const sources: T[] = await supplier();
    const inner = async () => {
      if (sources.length === 0) return;
      await consumer(sources.shift(), inner);
      await inner();
    };
    await inner();
  }
};