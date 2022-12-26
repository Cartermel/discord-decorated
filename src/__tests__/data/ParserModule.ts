import { Message } from "discord.js";
import { command } from "../../decorators/command";
import { ParseNumberTransformer } from "../../transformers/ParseNumberTransformer";

export class ParserModule {
  @command("parse", new ParseNumberTransformer())
  public async parse(message: Message, args: number[]) {
    return args;
  }
}
