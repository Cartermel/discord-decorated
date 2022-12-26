/**
 * Interface defining functionality of argument transformers used when parsing commands
 */
export interface ITransformer {
  /**
   * Transforms the given args to T
   * @param args the string array of arguments to transform
   * @throws on parsing failure
   */
  transform<T>(args: string[]): Promise<T>;
}
