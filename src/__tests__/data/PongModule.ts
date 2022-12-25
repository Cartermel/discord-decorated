import { Message } from "discord.js";
import { command } from "../../decorators/command";

/** The module from the readme */
export class PongModule {
  @command("ping")
  public async pong(message: Message) {
    return message.reply("pong!");
  }

  @command("zing")
  public async zong(message: Message) {
    return message.reply("zong!");
  }
}
