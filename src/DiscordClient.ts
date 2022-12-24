import { Client, ClientOptions } from "discord.js";

/**
 * DiscordClient class which inherits from discord.js's Client class.
 */
export class DiscordClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }
}
