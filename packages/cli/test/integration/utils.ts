import descriptorSchema from "../../src/descriptor-schema"
import type { AsyncReturnType } from "type-fest"

type Descriptors = AsyncReturnType<
  typeof descriptorSchema.parseAsync
>[string]["descriptors"]

export const mapDescriptorRecords = (records: Descriptors) => {
  const descriptors: Record<
    string,
    [
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
    ]
  > = {}

  for (const [
    pallet,
    { storage, extrinsics, events, errors, constants },
  ] of Object.entries(records)) {
    descriptors[pallet] = [storage, extrinsics, events, errors, constants]
  }

  return descriptors
}
