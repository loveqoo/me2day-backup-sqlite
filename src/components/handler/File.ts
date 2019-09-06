import { FileHandler, Precondition, ResourceHandler } from "../define/base";
import * as fs from "fs";
import * as path from "path";
import { inject, injectable } from "inversify";
import * as winston from "winston";
import { TYPES } from "../inversify/types";
import * as util from "util";

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

  async checkStats(path: string, precondition: Precondition<fs.Stats>) {
    if (!path) {
      return false;
    }
    return precondition.assert(await this.getStats(path));
  }

  async execute(base: string, f: (path: string) => void, filter: (path: string) => boolean = () => true) {
    const stat = await this.getStats(base);
    if (!stat.isDirectory()) {
      this.loggerHandler.getResource().error(`path(${base}) is not directory`);
    } else {
      const fileNameList = await this.getFileList(base);
      await fileNameList.filter(filter).forEach(filePath => f(path.join(base, filePath)));
    }
  }
}