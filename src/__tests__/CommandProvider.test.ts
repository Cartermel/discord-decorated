import { CommandProvider } from "../CommandProvider";
import { TestModule } from "./data/TestModule";

let provider: CommandProvider;

describe("CommandProvider", () => {
  it("should register custom commands", () => {
    provider = new CommandProvider([new TestModule()]);
  });

  it("should execute custom commands", async () => {
    //@ts-ignore - TODO: find a way to mock Message's from discord.js
    const result = await provider.executeCommand("test", {}, []);
    expect(result).toBe(1);
  });
});
