import * as winston from "winston";
import { injectable } from "inversify";
import DefaultResourceHandler from "./Handler";
import "reflect-metadata";

@injectable()
export default class LogHandler extends DefaultResourceHandler<winston.Logger> {

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