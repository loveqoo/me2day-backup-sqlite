import { FileHandler, Pair, Parser, ResourceHandler, toPair } from "../define/base";
import { inject, injectable } from "inversify";
import * as winston from "winston";
import { TYPES } from "../inversify/types";
import * as cheerio from "cheerio";

@injectable()
export default class DefaultHtmlParser implements Parser {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: ResourceHandler<winston.Logger>;

  @inject(TYPES.FileHandler)
  readonly fileHandler: FileHandler;

  async load(path: string) {
    const data = await this.fileHandler.read(path);
    const $: CheerioStatic = cheerio.load(data, { normalizeWhitespace: true });
    return <T>(f: (pair: Pair<CheerioStatic, Cheerio>) => T) => f(toPair($, $.root()));
  }
}