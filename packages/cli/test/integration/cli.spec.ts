import { describe, test, expect } from "vitest"
import { runner } from "clet"
import fsExists from "fs.promises.exists"
import path from "path"
import descriptorSchema from "../../src/descriptor-schema"
import {
  ConstantDescriptor,
  DescriptorCommon,
  ErrorDescriptor,
  EventDescriptor,
  StorageDescriptor,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
import fs from "fs/promises"

type Descriptor =
  | ConstantDescriptor<DescriptorCommon<string, string>, any>
  | EventDescriptor<DescriptorCommon<string, string>, any>
  | StorageDescriptor<DescriptorCommon<string, string>, any>
  | ErrorDescriptor<DescriptorCommon<string, string>, any>
  | TxDescriptor<DescriptorCommon<string, string>, any, any, any>

const cmd = "./bin/main.js"

describe("cli", async () => {
  const descriptorJSON = await descriptorSchema.parseAsync(
    JSON.parse(
      await fs.readFile("test_descriptors.json", { encoding: "utf-8" }),
    ),
  )

  Object.entries(descriptorJSON).map(
    ([key, { outputFolder, descriptors: descriptorRecords }]) =>
      test(
        `descriptor codegen - ${key}`,
        async () => {
          const expectedDescriptors = mapDescriptorRecords(descriptorRecords)

          await runner()
            .file("package.json", { bin: { "polkadot-api": cmd } })
            .spawn(cmd, ["--file test_descriptors.json"], {})
            .code(0)
            .end()
          await expect(
            fsExists(path.join(outputFolder, `${key}-types.d.ts`)),
          ).resolves.toEqual(true)
          await expect(
            fsExists(path.join(outputFolder, `${key}.ts`)),
          ).resolves.toEqual(true)
          await expect(
            fsExists(path.join(outputFolder, `${key}.d.ts`)),
          ).resolves.toEqual(false)

          const descriptors: [
            constants: Descriptor[],
            storage: Descriptor[],
            events: Descriptor[],
            errors: Descriptor[],
            calls: Descriptor[],
          ] = (await import(path.join(outputFolder, `${key}.ts`))).default

          const actualDescriptors = descriptors.map((arr) =>
            arr.map((d) => ({
              type: d.type,
              ...d.props,
            })),
          )

          expect(actualDescriptors).toStrictEqual(expectedDescriptors)
        },
        5 * 60_000,
      ),
  )

  function mapDescriptorRecords(
    records: (typeof descriptorJSON)[string]["descriptors"],
  ) {
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
})
