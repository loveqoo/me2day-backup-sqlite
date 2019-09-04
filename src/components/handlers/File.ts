import { FileHandler, ResourceHandler, ResourceOption } from "../defines";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import * as winston from "winston";
import { TYPES } from "./types";
import * as util from "util";

@injectable()
export default class DefaultFileHandler implements FileHandler {

  @inject("resourceOption")
  readonly resourceOption: ResourceOption;

  @inject(TYPES.LogHandler)
  readonly loggerHandler: ResourceHandler<winston.Logger>;

  async getFileList(path: string) {
    return await util.promisify(fs.readdir)(path, 'utf8');
  }

  async getStats(path: string) {
    return await util.promisify(fs.lstat)(path);
  }

  async checkPath() {
    const logger = this.loggerHandler.getResource();
    const path = this.resourceOption.backup_path;
    if (!path) {
      logger.error(`backup_path is empty.`);
      return false;
    }
    const stat = await this.getStats(path);
    if (!stat.isDirectory()) {
      logger.error(`${path} is not directory.`);
      return false;
    }
    const fileNameList = await this.getFileList(path);
    if (!fileNameList.findIndex(fileName => fileName === 'post')) {
      logger.error(`${path} has not post directory.`);
      return false;
    }
    return true;
  }
}