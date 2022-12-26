if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
  throw new Error(
    `discord.js-decorated requires a reflect polyfill. Please add 'import "reflect-metadata"' to the top of your entry point.`
  );
}

export { DiscordClient } from "./DiscordClient";
export { command } from "./decorators/command";
export { ITransformer } from "./transformers/ITransformer";
export { ParseNumberTransformer } from "./transformers/ParseNumberTransformer";
export { ParseIntTransformer } from "./transformers/ParseIntTransformer";
