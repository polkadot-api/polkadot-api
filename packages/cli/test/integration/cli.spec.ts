import { describe, test, expect, it } from "vitest"
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
import { mapDescriptorRecords } from "./utils"

type Descriptor =
  | ConstantDescriptor<DescriptorCommon<string, string>, any>
  | EventDescriptor<DescriptorCommon<string, string>, any>
  | StorageDescriptor<DescriptorCommon<string, string>, any>
  | ErrorDescriptor<DescriptorCommon<string, string>, any>
  | TxDescriptor<DescriptorCommon<string, string>, any, any, any>

const cmd = "./bin/main.js"

describe("cli", async () => {
  describe.concurrent("happy paths", async () => {
    const descriptorJSON = await descriptorSchema.parseAsync(
      JSON.parse(
        await fs.readFile("test/artifacts/test_descriptors.json", {
          encoding: "utf-8",
        }),
      ),
    )

    Object.entries(descriptorJSON).map(
      ([key, { outputFolder, descriptors: descriptorRecords }]) =>
        test.concurrent(
          `descriptor codegen - ${key}`,
          async () => {
            const expectedDescriptors = mapDescriptorRecords(descriptorRecords)

            await runner()
              .file("package.json", { bin: { "polkadot-api": cmd } })
              .spawn(cmd, ["--file test/artifacts/test_descriptors.json"], {})
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
  })
  describe("unhappy paths", async () => {
    const descriptorJSON = await descriptorSchema.parseAsync(
      JSON.parse(
        await fs.readFile("test/artifacts/test_descriptors-altered.json", {
          encoding: "utf-8",
        }),
      ),
    )

    it.concurrent(
      "should crash if there are descriptor discrepancies",
      async () => {
        let testRunner = runner()
          .file("package.json", { bin: { "polkadot-api": cmd } })
          .spawn(
            cmd,
            ["--file test/artifacts/test_descriptors-altered.json"],
            {},
          )
          .code(1)

        const keys = Object.keys(descriptorJSON)
        for (const key of keys) {
          testRunner = testRunner
            .stdout(new RegExp(descriptorStartPrompt(key)))
            .stdout(new RegExp(descriptorEndPrompt(key)))
        }

        await testRunner.end()
      },
    )
  })
})

const descriptorStartPrompt = (key: string) =>
  `-------- ${key} Discrepancies Start --------`

const descriptorEndPrompt = (key: string) =>
  `-------- ${key} Discrepancies End --------`
