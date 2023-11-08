import { WellKnownChain } from "@substrate/connect"
import { createClient } from "@polkadot-api/substrate-client"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import * as fs from "node:fs/promises"
import {
  metadata as $metadata,
  CodecType,
  OpaqueCodec,
} from "@polkadot-api/substrate-bindings"
import { getObservableClient } from "@polkadot-api/client"
import { firstValueFrom, map, switchMap } from "rxjs"
import { fromHex } from "@polkadot-api/utils"
import { createProvider } from "./smolldot-worker"

type Metadata = ReturnType<typeof $metadata.dec>["metadata"]

async function getChainMetadata(chain: WellKnownChain): Promise<Uint8Array> {
  const provider = createProvider(chain)
  const { chainHead$, destroy } = getObservableClient(createClient(provider))

  const chainHead = chainHead$()

  const metadata = await firstValueFrom(
    chainHead.finalized$.pipe(
      switchMap((hash) => chainHead.call$(hash, "Metadata_metadata", "")),
      map(fromHex),
    ),
  )

  chainHead.unfollow()
  destroy()

  return metadata
}

export type GetMetadataArgs =
  | {
      source: "chain"
      chain: WellKnownChain
    }
  | {
      source: "file"
      file: string
    }

async function getRawMetadata(args: GetMetadataArgs): Promise<Uint8Array> {
  switch (args.source) {
    case "chain": {
      return getChainMetadata(args.chain)
    }
    case "file": {
      return fs.readFile(args.file)
    }
  }
}

export async function getMetadata(args: GetMetadataArgs) {
  const rawMetadata = await getRawMetadata(args)
  const { inner } = OpaqueCodec($metadata).dec(rawMetadata)

  const { magicNumber, metadata } = inner()

  assertIsv14(metadata)

  return { magicNumber, metadata }
}

export function encodeMetadata(metadata: CodecType<typeof $metadata>) {
  const encodedMetadata = $metadata.enc(metadata)

  return OpaqueCodec($metadata).enc({
    length: encodedMetadata.length,
    inner: () => metadata,
  })
}

function assertIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}
