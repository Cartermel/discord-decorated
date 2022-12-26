import { Message } from "discord.js";
import { CommandMetadata } from "./models/CommandMetadata";
import { constructor } from "tsyringe/dist/typings/types";
import { container } from "tsyringe";
import { CommandRecord } from "./models/CommandRecord";

/**
 * Takes CommandModule classes and registers them to be used as standalone command functions
 */
export class CommandProvider {
  /** map of registered commands indexed by name */
  private readonly commands = new Map<string, CommandRecord>();

  /**
   * Creates a new CommandProvider with the given CommandModules
   *
   * @param modules the command modules to register
   */
  constructor(modules: constructor<Object>[]) {
    modules.forEach((module) => {
      const instance = container.resolve(module);

      // for now it's quite hard coded that modules have a single meta data key for commands,
      // I don't see this changing in the future so this is probably fine - if it does change though, we just need key variables
      const [key] = Reflect.getMetadataKeys(instance);

      // the metadata retrieved should be an array of CommandMetadata
      // until typescript lets us type this stuff in a nicer way there's gonna be a lot of casts (js time baby)
      const data = Reflect.getMetadata(key, instance) as CommandMetadata[];

      if (!data?.length) {
        throw new Error(
          "Attempted to register a CommandModule with no commands. Ensure to annotate command methods with the @command() decorator!"
        );
      }

      // create a new CommandRecord for each CommandMetadata and add to the command map
      data.forEach(({ name, propertyKey, transformer }) => {
        this.commands.set(name, { propertyKey, instance, transformer });
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
    const record = this.commands.get(commandName);

    if (!record) return;

    const { propertyKey, instance, transformer } = record;

    if (transformer !== undefined) {
      try {
        // TODO: ts thinks this always returns a string[], as that what args types it as - I don't think we really care though as the user will define the type functionality
        args = await transformer.transform(args);
      } catch {
        return;
      }
    }

    // this syntax is a little weird... should probably refactor but referencing the function directly resulting in dependencies being lost
    // ie: this.dependency wouldn't resolve as it's in a function reference, which 'this' refers to the function rather than the class
    // @ts-ignore
    return instance[propertyKey](message, args);
  }
}
