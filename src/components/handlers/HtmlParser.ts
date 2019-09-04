import { FileHandler, Parser, ResourceHandler } from "../defines";
import { inject, injectable } from "inversify";
import * as winston from "winston";
import { TYPES } from "./types";
import * as cheerio from "cheerio";

@injectable()
export default class DefaultHtmlParser implements Parser {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: ResourceHandler<winston.Logger>;
  @inject(TYPES.FileHandler)
  readonly fileHandler: FileHandler;

  async load(path: string) {
    const data = await this.fileHandler.read(path);
    const $ = cheerio.load(data, { normalizeWhitespace: true });
    //console.log(path);
    return <T>(f: ($: CheerioStatic) => T) => f($);
  }
}