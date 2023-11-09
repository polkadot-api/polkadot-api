import descriptorSchema from "../../src/descriptor-schema"
import type { AsyncReturnType } from "type-fest"

type Descriptors = AsyncReturnType<
  typeof descriptorSchema.parseAsync
>[string]["descriptors"]

export const mapDescriptorRecords = (records: Descriptors) => {
  type MappedDescriptor = {
    type: string
    name: string
    pallet: string
    checksum: bigint
  }
  const constantsDescriptors: MappedDescriptor[] = []
  const storageDescriptors: MappedDescriptor[] = []
  const eventDescriptors: MappedDescriptor[] = []
  const errorDescriptors: MappedDescriptor[] = []
  const callDescriptors: MappedDescriptor[] = []

  for (const [
    pallet,
    { constants, storage, events, errors, extrinsics },
  ] of Object.entries(records)) {
    for (const [name, checksum] of Object.entries(constants ?? {})) {
      constantsDescriptors.push({
        type: "const",
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(storage ?? {})) {
      storageDescriptors.push({
        type: "storage",
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(events ?? {})) {
      eventDescriptors.push({
        type: "event",
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(errors ?? {})) {
      errorDescriptors.push({
        type: "error",
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, { checksum }] of Object.entries(extrinsics ?? {})) {
      callDescriptors.push({
        type: "tx",
        name,
        pallet,
        checksum,
      })
    }
  }

  return [
    constantsDescriptors,
    storageDescriptors,
    eventDescriptors,
    errorDescriptors,
    callDescriptors,
  ]
}
