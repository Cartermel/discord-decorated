import { ITransformer } from "../transformers/ITransformer";

export interface CommandRecord {
  propertyKey: string | symbol;
  instance: object;
  transformer?: ITransformer<unknown>;
}
