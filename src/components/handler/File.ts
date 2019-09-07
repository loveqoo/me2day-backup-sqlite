import { FileHandler, Precondition, ResourceHandler } from "../define/base";
import * as fs from "fs";
import * as path from "path";
import { inject, injectable } from "inversify";
import * as winston from "winston";
import { TYPES } from "../inversify/types";
import * as util from "util";
import { Promises } from "../define/helper";

@injectable()
export default class DefaultFileHandler implements FileHandler {

  @inject(TYPES.LogHandler)
  readonly loggerHandler: ResourceHandler<winston.Logger>;

  async read(path: string) {
    return await util.promisify(fs.readFile)(path, 'utf8');
  }

  async getFileList(path: string) {
    if (!path) {
      return [];
    }
    return await util.promisify(fs.readdir)(path, 'utf8');
  }

  async getStats(path: string) {
    if (!path) {
      return;
    }
    return await util.promisify(fs.lstat)(path);
  }

  async checkFileList(path: string, precondition: Precondition<string[]>) {
    return precondition.assert(await this.getFileList(path));
  }

  async checkStats(path: string, precondition: Precondition<fs.Stats | void>) {
    if (!path) {
      return false;
    }
    return precondition.assert(await this.getStats(path));
  }

  async execute(base: string, f: (path: string) => Promise<void>, filter: (path: string) => boolean = () => true) {
    const logger = await this.loggerHandler.getResource();
    const stat = await this.getStats(base);
    if (!stat || !stat.isDirectory()) {
      logger.error(`path(${base}) is not directory`);
      return;
    } else {
      const fileNameList = await this.getFileList(base);
      const filteredFileNameList = fileNameList.filter(filter).map(filePath => path.join(base, filePath));
      await Promises.sequential(filteredFileNameList, f);
      //await Promise.all(fileNameList.filter(filter).map(filePath => f(path.join(base, filePath))));
      return;
    }
  }
}