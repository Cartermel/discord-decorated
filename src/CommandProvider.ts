import { Message } from "discord.js";
import { CommandMetadata } from "./models/CommandMetadata";
import { CommandModule } from "./models/CommandModule";

type CommandFunction = (
  message: Message<boolean>,
  args: string[]
) => Promise<void>;

/**
 * Takes CommandModule classes and registers them to be used as standalone command functions
 */
export class CommandProvider {
  /** map of registered commands indexed by name */
  private readonly commands = new Map<string, CommandFunction>();

  /**
   * Creates a new CommandProvider with the given CommandModules
   *
   * @param modules the command modules to register
   */
  constructor(modules: CommandModule[]) {
    modules.forEach((module) => {
      // for now it's quite hard coded that modules have a single meta data key for commands,
      // I don't see this changing in the future so this is probably fine - if it does change though, we just need key variables
      const [key] = Reflect.getMetadataKeys(module);

      // the metadata retrieved should be an array of CommandMetadata
      // until typescript lets us type this stuff in a nicer way there's gonna be a lot of casts (js time baby)
      const data = Reflect.getMetadata(key, module) as CommandMetadata[];

      if (!data?.length) {
        throw new Error(
          "Attempted to register a CommandModule with no commands. Ensure to annotate command methods with the @command() decorator!"
        );
      }

      data.forEach(({ name, propertyKey }) => {
        // @ts-ignore - javascript time baby, we know this prop exists because it's in the metadata - so just grab it - might be a cleaner way to achieve this
        this.commands.set(name, module[propertyKey] as CommandFunction);
      });
    });
  }

  /**
   * Attempts to execute a command by name, if the command is not found - does nothing
   *
   * @param commandName the command, by name, to execute
   * @param message the message from discord
   * @param args the arguments for the command
   */
  public async executeCommand(
    commandName: string,
    message: Message<boolean>,
    args: string[]
  ) {
    const command = this.commands.get(commandName);

    if (!command) return;

    return command(message, args);
  }
}
