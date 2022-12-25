import { Message } from "discord.js";
import { command } from "../../decorators/command";

export class EchoModule {
  @command("echo")
  public async echo(message: Message, args: string[]) {
    // from discord: !echo hello world!
    // will recieve reply: hello world!

    return message.reply(args.join(" "));
  }
}
