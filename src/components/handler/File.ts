import { FileHandler, Precondition, ResourceHandler } from "../define/base";
import * as fs from "fs";
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

  async checkStats(path: string, precondition: Precondition<fs.Stats | void>) {
    if (!path) {
      return false;
    }
    return precondition.assert(await this.getStats(path));
  }
}