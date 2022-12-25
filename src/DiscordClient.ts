import { Client, Message } from "discord.js";
import { CommandProvider } from "./CommandProvider";
import {
  CommandErrorCallback,
  DiscordClientOptions,
} from "./models/DiscordClientOptions";

/**
 * DiscordClient class which inherits from discord.js's Client
 */
export class DiscordClient extends Client {
  private readonly commandProvider: CommandProvider;
  private readonly commandPrefix: string;

  /**
   * Creates a new DiscordClient with the specified options
   *
   * @param options client options to use
   */
  constructor(options: DiscordClientOptions) {
    super(options);

    const {
      commands,
      commandPrefix,
      messageCreateHandler,
      commandErrorCallback,
    } = options;

    if (commandPrefix.length === 0)
      throw new Error("Command prefix must have a length greater than 0.");

    this.commandProvider = new CommandProvider(commands);
    this.commandPrefix = commandPrefix;

    // TODO: remove message create handler overriding ? this class extends Client - users can simply add / remove event listeners
    // assign callbacks from options or default implementations
    if (commandErrorCallback) this.commandErrorCallback = commandErrorCallback;
    this.on("messageCreate", messageCreateHandler || this.messageCreateHandler);
  }

  /** Default error callback for commands that throw errors. Simply logs the error to the console */
  private commandErrorCallback: CommandErrorCallback = (error) => {
    console.error(error);
  };

  /**
   * Handles messages from discord and attempts to execute commands from them
   */
  private messageCreateHandler(msg: Message<boolean>) {
    const { content } = msg;

    if (!content.startsWith(this.commandPrefix)) return;

    // TODO: this only supports one word commands, worth it to build in more than 1 word commands?
    const args = content.slice(this.commandPrefix.length).split(" ");
    const command = args.shift();

    if (!command) return;

    // execute the command using the provider, no need to await just log errors
    return this.commandProvider
      .executeCommand(command, msg, args)
      .catch((err) => {
        this.commandErrorCallback(err, msg);
      });
  }
}
