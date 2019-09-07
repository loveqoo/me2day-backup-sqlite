import "cheerio";
import { DatabaseHandler, Mapper, Pair, Saver } from "../define/base";
import * as map from "../define/me2day.map";
import * as db from "../define/me2day.db";
import { inject, injectable } from "inversify";
import { EmbedMappers, EmbedQueries } from "../define/query.db";
import { TYPES } from "../inversify/types";

@injectable()
export class EmbedMapper implements Mapper<Pair<CheerioStatic, Cheerio>, map.Embed>, Saver<map.Embed, db.Embed> {

  @inject(TYPES.SqliteHandler)
  readonly databaseHandler: DatabaseHandler;

  map(pair: Pair<CheerioStatic, Cheerio>) {
    const $ = pair.right;
    const node = $.find('a');
    return node.length == 0 ? undefined : {
      src: node.attr('href'),
      thumbnail: $.find('img').attr('src')
    };
  }

  async save(embed: map.Embed, option: { postId: number }) {
    const db = this.databaseHandler;
    const prevEmbed = await db.findOne(EmbedQueries.findBySrc(embed.src), EmbedMappers.all);
    if (prevEmbed) {
      return prevEmbed;
    }
    const id = await db.insert(EmbedQueries.insert(embed, option.postId));
    return db.findOne(EmbedQueries.findById(id), EmbedMappers.all);
  }
}