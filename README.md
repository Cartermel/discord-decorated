<div>
  <h1>
    <img src="./assets/discord-decorated.svg" width="555" />
  </h1>

  <div>
    <a href="https://github.com/Cartermel/discord-decorated/actions/workflows/test.yml"
      ><img
        src="https://github.com/Cartermel/discord-decorated/actions/workflows/test.yml/badge.svg"
        alt="Test Status"
    /></a>
    <a href="https://www.npmjs.com/package/discord-decorated"
      ><img
        src="https://img.shields.io/npm/v/discord-decorated"
        alt="NPM version"
    /></a>
  </div>

  <p>
    <b>A lightweight extension library on top of <a href="https://github.com/discordjs/discord.js">discord.js</a> inspired by <a href="https://github.com/DSharpPlus/DSharpPlus">DSharpPlus.CommandsNext</a></b>
  </p>
</div>

## Features

- [Command decorators](#Command-Decorators)
- [Dependency injection (using tsyringe)](#Dependency-Injection)
- [Argument Transforming](#Argument-Transforming)

## Installation

discord-decorated depends on discord.js tsyringe and a reflect polyfill - for the example we'll install `reflect-metadata`.

```sh
npm i discord-decorated discord.js tsyringe reflect-metadata
```

```sh
yarn add discord-decorated discord.js tsyringe reflect-metadata
```

## Getting Started

discord-decorated seeks to make the setup for a discord bot simple, just create a DiscordClient instance - which just inherits from discord.js's Client - then assign command handlers and login!

```typescript
// bot.ts
import "reflect-metadata"; // ensure to import a reflect-metadata as early as possible
import { DiscordClient } from "discord-decorated";
import { PingModule } from "./command-modules/PingModule";
import { GatewayIntentBits } from "discord.js";

const bot = new DiscordClient({
  commandPrefix: "!",
  commandModules: [PingModule],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // ...
  ],
});

// DiscordClient extends Client, all discord.js methods are available
bot.on("ready", () => console.log("ready!"));

bot.login(process.env.token);
```

```typescript
// command-modules/PingModule.ts
import { command } from "discord-decorated";
import { Message } from "discord.js";

export class PingModule {
  @command("ping")
  public async ping(msg: Message) {
    await msg.reply("pong!");
  }
}
```

You'll also have to modify your `tsconfig.json` to include the following settings

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Command Decorators

discord-decorated adds the ability to decorate class methods with command decorators allowing easier command creation / classification.

```typescript
// PongModule.ts
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
```

A CommandModule can contain any number of commands, and the commands themselves can recieve up to two arguments: the Message, from discord.js, and the arguments, which currently are space delimited words from the original message (after the command string).

```typescript
export class EchoModule {
  @command("echo")
  public async echo(message: Message, args: string[]) {
    // from discord: !echo hello world!
    // will recieve reply: hello world!

    return message.reply(args.join(" "));
  }
}
```

## Dependency Injection

discord-decorated using tsyringe for dependency injection on it's CommandModule's and should work out of the box after following the install instructions.

```typescript
// use tsyringe's decorators
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
```

## Argument Transforming

discord-decorated comes with two built in argument transformers by default, the `ParseNumberTransformer` and the `ParseIntTransformer` which takes the string arguments from discord and parse them numbers / integers.

```typescript
export class ParserModule {
  // pass the transformer in to the command annotation
  @command("parse-numbers", new ParseNumberTransformer())
  public async parse(message: Message, args: number[]) {
    // args will be an array of numbers
    console.log(args);
  }
}
```

You can easily create your own transformers by creating a class that implements the `ITransformer` interface from discord-decorated

```typescript
import { ITransformer } from "discord-decorated";

// customer transformer which takes the arguments and converts them to caps
export class MyTransformer implements ITransformer<string> {
  // ITransformer requires a Promise returning an array of the desired transformed type
  async transform(args: string[]): Promise<string[]> {
    // simply transform each argument to uppercase
    return args.map((arg) => arg.toUpperCase());
  }
}
```

```typescript
export class MyCommandModule {
  // pass the transformer in to the command annotation
  @command("transform", new MyTransformer())
  public async transform(message: Message, args: number[]) {
    // from discord: ["hello"]

    // args == ["HELLO"]
    console.log(args);
  }
}
```

To exit a transformer's parse method, in case parsing has failed, just throw an error and the command will not be run.

```typescript
import { ITransformer } from "discord-decorated";

export class DisallowTheNumberOne implements ITransformer<number> {
  async transform(args: string[]): Promise<number[]> {
    return args.map((arg) => {
      const arg = parseFloat(arg);

      // if a user sends 1 in to the command, it will not be run!
      if (arg === 1) throw new Error();

      return arg;
    });
  }
}
```

## Command Registration

After creating command modules you can register them to the DiscordClient by passing their constructors to the DiscordClientOptions:

```typescript
const client = new DiscordClient({
  // ...
  commandModules: [PongModule, EchoModule, DependentModule],
  // ...
});

client.login(token);
```
