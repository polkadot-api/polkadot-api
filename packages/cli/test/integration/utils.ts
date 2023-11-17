import descriptorSchema from "../../src/descriptor-schema"
import type { AsyncReturnType } from "type-fest"

type Descriptors = AsyncReturnType<
  typeof descriptorSchema.parseAsync
>[string]["descriptors"]

export const mapDescriptorRecords = (records: Descriptors) => {
  type MappedDescriptor = {
    name: string
    pallet: string
    checksum: string
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
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(storage ?? {})) {
      storageDescriptors.push({
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(events ?? {})) {
      eventDescriptors.push({
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, checksum] of Object.entries(errors ?? {})) {
      errorDescriptors.push({
        name,
        pallet,
        checksum,
      })
    }
    for (const [name, { checksum }] of Object.entries(extrinsics ?? {})) {
      callDescriptors.push({
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
