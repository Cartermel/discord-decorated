import { ITransformer } from "./ITransformer";

/** Parses strings to numbers */
export class ParseNumberTransformer implements ITransformer<number> {
  /**
   * Parses an array of strings to an array of numbers
   *
   * @param args the array of strings to parse
   * @returns an array of Numbers
   * @throws when an argument cannot be parsed as a Number
   */
  async transform(args: string[]): Promise<number[]> {
    return args.map((arg) => {
      const num = Number(arg);

      if (isNaN(num) || !isFinite(num)) throw new Error();

      return num;
    });
  }
}
