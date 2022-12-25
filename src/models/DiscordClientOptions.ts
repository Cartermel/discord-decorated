import { ClientOptions, Message } from "discord.js";
import { constructor } from "tsyringe/dist/typings/types";

export type CommandErrorCallback = (
  error: any,
  message: Message<boolean>
) => void | PromiseLike<void>;

export interface DiscordClientOptions extends ClientOptions {
  /** Command handlers to register to the DiscordClient */
  commandModules: constructor<Object>[];

  /** String prefix to use for Commands */
  commandPrefix: string;

  /** Message create handler to use instead of the default implementation */
  messageCreateHandler?(message: Message<boolean>): Promise<void>;

  /** Optional Callback to use on command execution errors */
  commandErrorCallback?: CommandErrorCallback;
}
