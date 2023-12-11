import { V14 } from "@polkadot-api/substrate-codegen"
import fs from "fs/promises"
import * as readPkg from "read-pkg"
import * as writePkg from "write-pkg"
import * as z from "zod"
import descriptorSchema from "@/descriptor-schema"
import { dirname } from "path"
import fsExists from "fs.promises.exists"
import { getCodegenInfo } from "./getCodegenInfo"
import { createDtsFile } from "./createDtsFile"
import { createDescriptorsFile } from "./createDescriptorsFile"
import {
  metadata as $metadata,
  CodecType,
  OpaqueCodec,
} from "@polkadot-api/substrate-bindings"

type ReadDescriptorsArgs = {
  pkgJSONKey: string
  fileName?: string
}

export async function readDescriptors(args: ReadDescriptorsArgs) {
  const descriptorMetadata = await (async () => {
    if (args.fileName) {
      const file = JSON.parse(
        await fs.readFile(args.fileName, { encoding: "utf-8" }),
      )
      const result = await descriptorSchema.parseAsync(file)

      return result
    }
    if (await fsExists("package.json")) {
      const pkgJSON = JSON.parse(
        await fs.readFile("package.json", { encoding: "utf-8" }),
      )
      const schema = z.object({ [args.pkgJSONKey]: descriptorSchema })

      const result = await schema.safeParseAsync(pkgJSON)
      if (result.success) {
        return result.data[args.pkgJSONKey]
      }
    }

    return
  })()

  return descriptorMetadata
}

type OutputDescriptorsArgs = (
  | {
      type: "package-json"
      pkgJSONKey: string
    }
  | {
      type: "file"
      fileName: string
    }
) & {
  key: string
  metadataFile: string
  outputFolder: string
}

export async function outputDescriptors({
  key,
  metadataFile,
  outputFolder,
  ...rest
}: OutputDescriptorsArgs) {
  switch (rest.type) {
    case "package-json": {
      let output: z.TypeOf<typeof descriptorSchema> = {}

      const pkgJSONSchema = z.object({
        [rest.pkgJSONKey]: descriptorSchema,
      })
      const pkgJSON = await readPkg.readPackage()
      const parseResult = await pkgJSONSchema.safeParseAsync(pkgJSON)
      if (parseResult.success) {
        output = parseResult.data[rest.pkgJSONKey]
      }

      output = {
        ...output,
        [key]: {
          metadata: metadataFile,
          outputFolder: outputFolder,
        },
      }

      await writePkg.updatePackage({
        [rest.pkgJSONKey]: output,
      } as any)
      break
    }
    case "file": {
      let output: z.TypeOf<typeof descriptorSchema> = {}

      if (await fsExists(rest.fileName)) {
        const existingFile = JSON.parse(
          await fs.readFile(rest.fileName, {
            encoding: "utf-8",
          }),
        )
        output = await descriptorSchema.parseAsync(existingFile)
      }

      output = {
        ...output,
        [key]: {
          metadata: metadataFile,
          outputFolder: outputFolder,
        },
      }

      await fs.mkdir(dirname(rest.fileName), { recursive: true })
      await fs.writeFile(rest.fileName, JSON.stringify(output, null, 2))
      break
    }
  }
}

export async function writeMetadataToDisk(
  metadata: CodecType<typeof $metadata>,
  outFile: string,
) {
  const encodedMetadata = $metadata.enc(metadata)
  const encoded = OpaqueCodec($metadata).enc({
    length: encodedMetadata.length,
    inner: () => metadata,
  })

  await fs.mkdir(dirname(outFile), { recursive: true })
  await fs.writeFile(outFile, encoded)
}

export async function outputCodegen(
  metadata: V14,
  outputFolder: string,
  key: string,
  selectOnly?: string[],
) {
  const { code, descriptorsData } = getCodegenInfo(metadata, key, selectOnly)
  await fs.mkdir(outputFolder, { recursive: true })
  await createDtsFile(key, outputFolder, code)
  await createDescriptorsFile(key, outputFolder, descriptorsData)
}
