import { Timestamp } from "./me2day.map";

export const Dates = {
  toDatabaseTimestamp: (ts: Timestamp): string => {
    const padding = (n: number) => n > 9 ? '0' + n : '' + n;
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