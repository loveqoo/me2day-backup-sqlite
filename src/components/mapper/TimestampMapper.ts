import { Mapper, Timestamp } from "../defines";
import { injectable } from "inversify";

@injectable()
export class TimestampMapper implements Mapper<string, Timestamp> {

  map(source: string) {
    const parsed: string[] = source.replace(/\s|:/gim, '.')
      .split('.');
    return {
      year: parseInt(20 + parsed[0], 10),
      month: parseInt(parsed[1], 10),
      day: parseInt(parsed[2], 10),
      hour: parseInt(parsed[3], 10),
      minute: parseInt(parsed[4], 10)
    }
  }
}