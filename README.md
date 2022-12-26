<div>
  <img src="./assets/discord-decorated.svg" width="546" />

  <br/>

  <div class="badge-container">
    <a href="https://discordx.js.org/discord"
      ><img
        src="https://github.com/Cartermel/discord.js-decorated/actions/workflows/test.yml/badge.svg"
        alt="Test Status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/npm/v/@cartermel/discord.js-decorated"
        alt="NPM version"
    /></a>
  </div>

  <p>
    <b>A lightweight extension library on top of discord.js inspired by <a href="https://github.com/DSharpPlus/DSharpPlus">DSharpPlus.CommandsNext</a></b>
  </p>

  <br/>
</div>

## Features

- [Command decorators](#Command-Decorators)
- [Dependency injection (using tsyringe)](#Dependency-Injection)

## Installation

discord.js-decorated depends on discord.js tsyringe and a reflect polyfill - for the example we'll install `reflect-metadata`.

```sh
npm i @cartermel/discord.js-decorated discord.js tsyringe reflect-metadata
```

```sh
yarn add @cartermel/discord.js-decorated discord.js tsyringe reflect-metadata
```

## Getting Started

discord.js-decorated seeks to make the setup for a discord bot simple, just create a DiscordClient instance - which just inherits from discord.js's Client - then assign command handlers and login!

```typescript
// bot.ts
import "reflect-metadata"; // ensure to import a reflect-metadata as early as possible
import { DiscordClient } from "@cartermel/discord.js-decorated";
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
import { command } from "@cartermel/discord.js-decorated";
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

discord.js-decorated adds the ability to decorate class methods with command decorators allowing easier command creation / classification.

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

discord.js-decorated using tsyringe for dependency injection on it's CommandModule's and should work out of the box after following the install instructions.

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
