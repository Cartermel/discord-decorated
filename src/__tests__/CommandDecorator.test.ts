import { CommandMetadata } from "../models/CommandMetadata";
import { TestModule } from "./data/TestModule";

describe("Command Decorator", () => {
  const testModule = new TestModule();

  it("should create metadata on methods", () => {
    // @ts-ignore - TODO: reflect typings in tests - for now just ignore
    const data = Reflect.getMetadata(
      "COMMAND",
      testModule
    ) as CommandMetadata[];

    expect(data).toHaveLength(1);

    const { name, propertyKey } = data[0];

    expect(name).toBe("test");
    expect(propertyKey).toBe("testCommand");
  });
});
