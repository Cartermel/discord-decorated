import { ITransformer } from "../transformers/ITransformer";

export interface CommandMetadata {
  name: string;
  propertyKey: string | symbol;
  transformer?: ITransformer<unknown>;
}
