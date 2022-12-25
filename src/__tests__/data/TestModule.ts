import { command } from "../../decorators/command";
import { Message } from "discord.js";

/**
 * Module to enable easier testing
 */
export class TestModule {
  @command("test")
  public async testCommand(msg: Message<boolean>, args: string[]) {
    // TODO: eslint gives a warning about enabling "experimentalDecirators" which is enabled in the root tsconfig
    // everything works fine but we should find a way to remove that warning
    return 1;
  }
}
