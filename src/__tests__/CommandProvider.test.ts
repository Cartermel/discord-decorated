import { CommandProvider } from "../CommandProvider";
import { EchoModule } from "./data/EchoModule";
import { PongModule } from "./data/PongModule";
import { TestModule } from "./data/TestModule";
import { DependentModule } from "./data/DependentModule";
import { container } from "tsyringe";

let provider: CommandProvider;

describe("CommandProvider", () => {
  it("should resolve custom command modules", () => {
    provider = new CommandProvider([
      TestModule,
      PongModule,
      EchoModule,
      DependentModule,
    ]);
  });

  const mockMessage = {
    reply: (arg: string) => arg,
  };

  it("should execute the ping command", async () => {
    //@ts-ignore
    const pingResult = await provider.executeCommand("ping", mockMessage, []);
    expect(pingResult).toBe("pong!");
  });

  it("should execute the test command", async () => {
    //@ts-ignore - TODO: find a way to mock Message's from discord.js
    const testResult = await provider.executeCommand("test", {}, []);
    expect(testResult).toBe(1);
  });

  it("should execute the zing command", async () => {
    //@ts-ignore
    const zingResult = await provider.executeCommand("zing", mockMessage, []);
    expect(zingResult).toBe("zong!");
  });

  it("should execute the echo command", async () => {
    //@ts-ignore
    const echoResult = await provider.executeCommand("echo", mockMessage, [
      "hello",
      "world!",
    ]);
    expect(echoResult).toBe("hello world!");
  });

  it("should resolve the DependentModule's dependencies", async () => {
    const result = await provider.executeCommand(
      "getSomeData",
      //@ts-ignore
      mockMessage,
      []
    );

    expect(result).toBe("1,2,3,4");
  });
});
