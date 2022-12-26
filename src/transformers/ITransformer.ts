/**
 * Interface defining functionality of argument transformers used when parsing commands
 */
export interface ITransformer<T> {
  /**
   * Transforms the given args to T
   *
   * @param args the string array of arguments to transform
   * @throws on parsing failure
   */
  transform(args: string[]): Promise<T[]>;
}
