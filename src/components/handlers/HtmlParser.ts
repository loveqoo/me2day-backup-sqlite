import { Embed, FileHandler, Location, Parser, People, ResourceHandler, Timestamp } from "../defines";
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
    return <T>(f: ($: CheerioStatic) => T) => f($);
  }
}

export const extractPost = async ($: CheerioStatic) => {

  const getPeople = ($profile: Cheerio) => {
    const writer: People = {
      nickname: '',
      profile: ''
    };
    writer.nickname = $profile.attr('alt');
    writer.profile = $profile.attr('src');
    return writer;
  };
  const writer: People = getPeople($('img.profile_img'));
  const content = $('<p>' +
    $('p.post_body')
      .html()
      .replace(/<span class="post_permalink">.+<\/span>|\n|\s{2,}/gim, '')
    + '</p>').text().trim();
  const rawTimestamp = $('span.post_permalink').html()
    .replace(/\s|:/gim, '.')
    .split('.');
  const timestamp: Timestamp = {
    year: parseInt(20 + rawTimestamp[0], 10),
    month: parseInt(rawTimestamp[1], 10),
    day: parseInt(rawTimestamp[2], 10),
    hour: parseInt(rawTimestamp[3], 10),
    minute: parseInt(rawTimestamp[4], 10)
  };
  const tag = $('p.post_tag').text();
  const metoo: People[] = $('a.pi_s.profile_popup.no_link img')
    .map((idx, image) => getPeople($(image)))
    .get();

  const images = $('a.per_img.photo')
    .map((idx, anchor) => {
      let $anchor = $(anchor), $image = $anchor.find('img'),
        thumbnail = $image.attr('src'),
        original = $anchor.attr('href');
      return {
        thumbnail: thumbnail,
        original: original
      };
    }).get();
  const map = $('div.map_container');
  const location: Location = { name: '', link: '', image: '' };
  if (map.length === 1) {
    location.name = map.find('span.map_location_alt').text();
    location.link = map.find('a').attr('href');
    location.image = map.find('img').attr('src');
  }
  const embed: Embed = { src: '', thumbnail: '' };
  const video = $('div.embed_me2photo');
  if (video.length === 1) {
    embed.src = video.find('a').attr('href');
    embed.thumbnail = video.find('img').attr('src');
  }
  return {
    writer: writer,
    content: content,
    tag: tag,
    metoo: metoo,
    timestamp: timestamp,
    images: images,
    location: location,
    embed: embed
  }
};