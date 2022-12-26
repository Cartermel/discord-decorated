import { ITransformer } from "./ITransformer";

/** Transforms strings to integers */
export class ParseIntTransformer implements ITransformer<number> {
  /**
   * Parses an array of strings to an array of integers
   *
   * @param args the array of strings to parse
   * @returns an array of integer Numbers
   * @throws when an argument cannot be parsed as a Number
   */
  async transform(args: string[]): Promise<number[]> {
    return args.map((arg) => {
      const num = parseInt(arg);

      if (isNaN(num) || !isFinite(num)) throw new Error();

      return num;
    });
  }
}
