# discord.js-decorated

A lightweight exstension library on top of discord.js, inspired by [DSharpPlus.CommandsNext](https://github.com/DSharpPlus/DSharpPlus)

## Features

- Command decorators
- Dependency injection (using tsyringe)

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
