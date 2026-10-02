import { FileHandler, Pair, Parser, ResourceHandler, toPair, CheerioStatic, Cheerio } from "../define/base";
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
    // Keep the default HTML (parse5) parser; normalizeWhitespace was ignored by it.
    const $: CheerioStatic = cheerio.load(data);
    return Promise.resolve(<T>(f: (pair: Pair<CheerioStatic, Cheerio>) => T) => f(toPair($, $.root())));
  }
}