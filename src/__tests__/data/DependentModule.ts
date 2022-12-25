import { DbService } from "./DbService";
import { command } from "../../decorators/command";
import { Message } from "discord.js";
import { injectable } from "tsyringe";

@injectable()
export class DependentModule {
  // dbService injected through constructor using tsyringe
  constructor(private readonly dbService: DbService) {}

  @command("getSomeData")
  public async getSomeData(msg: Message) {
    // use dbService to grab some data and send it to the discord chat
    const data = await this.dbService.getData();

    return msg.reply(data.toString());
  }
}
