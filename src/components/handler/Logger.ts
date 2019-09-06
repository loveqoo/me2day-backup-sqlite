import * as winston from "winston";
import { injectable } from "inversify";
import DefaultResourceHandler from "./Handler";
import "reflect-metadata";
import { LogHandler } from "../defines";

@injectable()
export default class DefaultLogHandler extends DefaultResourceHandler<winston.Logger> implements LogHandler {

  constructor() {
    super(() => {
      return winston.createLogger({
        level: 'debug',
        transports: [
          new winston.transports.Console()
        ],
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple()
        )
      });
    }, () => {
    });
  }
}