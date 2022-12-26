import { ParseIntTransformer } from "../../transformers/ParseIntTransformer";

describe("ParseNumberTransformer", () => {
  const transformer = new ParseIntTransformer();

  it("Should throw on NaN", async () => {
    await expect(transformer.transform(["NaN"])).rejects.toThrowError();
    await expect(transformer.transform(["NAN"])).rejects.toThrowError();
    await expect(transformer.transform(["nan"])).rejects.toThrowError();
  });

  it("Should throw on Infinity", async () => {
    await expect(transformer.transform(["Infinity"])).rejects.toThrowError();
    await expect(transformer.transform(["infinity"])).rejects.toThrowError();
  });

  it("Should parse strings to integers", async () => {
    await expect(
      transformer.transform(["1.123", "2", "3.14", "12339125.123312"])
    ).resolves.toStrictEqual([1, 2, 3, 12339125]);
  });

  it("Should throw on non numbers", async () => {
    await expect(
      transformer.transform(["1", "2", "hello..."])
    ).rejects.toThrowError();

    await expect(
      transformer.transform(["not a number nope"])
    ).rejects.toThrowError();
  });
});
