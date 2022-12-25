import { CommandMetadata } from "../models/CommandMetadata";

const commandMetadataKey = "COMMAND";

/**
 * Registers a method as a Discord command which can be called by the given name.
 */
export const command = (name: string): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor: any) => {
    const existingMetaData = Reflect.getMetadata(commandMetadataKey, target);

    const data: CommandMetadata = { name, propertyKey };

    Reflect.defineMetadata(
      commandMetadataKey,
      // if we already have property key metadata add it to the existing array, otherwise create a new one
      existingMetaData ? [...existingMetaData, data] : [data],
      target
    );
  };
};
