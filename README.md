# me2day-backup-sqlite

Node.js requirements below are declared by the locked dependencies; they are not a tested compatibility matrix:

- Runtime: `sqlite3@6.0.1` requires Node.js `>=20.17.0`. Cheerio 1.0.0 and Undici 6 require `>=18.17`, so they do not raise that runtime floor.
- Native installation/build fallback: optional `node-gyp@12.4.0` and its tooling require `^20.17.0 || >=22.9.0`.
- Development/tests: `mocha@12.0.2` requires `^20.19.0 || >=22.12.0`. `npm start` runs TypeScript before starting the app, so it also needs the development dependencies installed.

Validated on macOS arm64 with Node.js 24.13.0 and npm 11.19.1 only. TypeScript 5.9.3 is a verified compatible compiler version, not a demonstrated minimum requirement.

```sh
npm ci
npm test
npx tsc --noEmit
npx tsc
npm audit
```

Tests use synthetic HTML and an in-memory SQLite database. Cheerio 1.0.0 adds encoding/stream-loading dependencies and makes Undici a required runtime dependency (previously optional through node-gyp). The converter continues to use local HTML with `cheerio.load`; it does not use Cheerio's URL-loading API.
