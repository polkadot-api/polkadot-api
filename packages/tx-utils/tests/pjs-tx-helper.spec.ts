import { getKsmMetadataBuffer } from "@polkadot-api/metadata-fixtures"
import {
  metadata as metadataCodec,
  u32,
  v15,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { beforeAll, describe, expect, it } from "vitest"
import { getPjsTxHelper, getTxHelper, SignerPayloadJSON } from "@/."

// kusama
const GENESIS =
  "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe"
const BLOCK_HASH =
  "0xb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10cb10c"
const BLOCK_NUMBER = 12345678

// System.Version constants of the ksm metadata fixture
const SPEC_VERSION = 1000000
const TX_VERSION = 24

// ksm fixture signedExtensions: CheckNonZeroSender, CheckSpecVersion, CheckTxVersion,
// CheckGenesis, CheckMortality, CheckNonce, CheckWeight, ChargeTransactionPayment
const SIGNED_EXTENSIONS = [
  "CheckNonZeroSender",
  "CheckSpecVersion",
  "CheckTxVersion",
  "CheckGenesis",
  "CheckMortality",
  "CheckNonce",
  "CheckWeight",
  "ChargeTransactionPayment",
]

const getPayload = (
  props: Partial<SignerPayloadJSON> = {},
): SignerPayloadJSON => ({
  address: "HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F",
  blockHash: BLOCK_HASH,
  blockNumber: `0x${BLOCK_NUMBER.toString(16).padStart(8, "0")}`,
  era: "0x00",
  genesisHash: GENESIS,
  // System.remark("talisman parity")
  method: "0x00003c74616c69736d616e20706172697479",
  nonce: "0x00000005",
  specVersion: `0x${SPEC_VERSION.toString(16).padStart(8, "0")}`,
  tip: "0x00000000000000000000000000000000",
  transactionVersion: `0x${TX_VERSION.toString(16).padStart(8, "0")}`,
  signedExtensions: SIGNED_EXTENSIONS,
  version: 4,
  ...props,
})

let metadataRaw: Uint8Array
beforeAll(async () => {
  // the fixture is a bare v15 blob: wrap it in the versioned envelope
  const bare = await getKsmMetadataBuffer()
  metadataRaw = metadataCodec.enc({
    magicNumber: 0x6174656d,
    metadata: { tag: "v15", value: v15.dec(bare) },
  })
})

describe("getPjsTxHelper", () => {
  it("uses the genesis hash as mortality checkpoint for immortal payloads", () => {
    const { extra, additionalSigned } = getPjsTxHelper(metadataRaw)(
      getPayload({ era: "0x00" }),
    )

    // era ++ compact(nonce) ++ compact(tip)
    expect(toHex(extra)).toBe(toHex(Uint8Array.from([0x00, 0x14, 0x00])))
    expect(toHex(additionalSigned)).toBe(
      toHex(
        mergeUint8([
          u32.enc(SPEC_VERSION),
          u32.enc(TX_VERSION),
          fromHex(GENESIS),
          // CheckMortality checkpoint: the genesis hash
          fromHex(GENESIS),
        ]),
      ),
    )
  })

  it("uses the block hash as mortality checkpoint for mortal payloads", () => {
    // period 64, phase 47
    const { extra, additionalSigned } = getPjsTxHelper(metadataRaw)(
      getPayload({ era: "0xf502" }),
    )

    expect(toHex(extra)).toBe(toHex(Uint8Array.from([0xf5, 0x02, 0x14, 0x00])))
    expect(toHex(additionalSigned)).toBe(
      toHex(
        mergeUint8([
          u32.enc(SPEC_VERSION),
          u32.enc(TX_VERSION),
          fromHex(GENESIS),
          // CheckMortality checkpoint: the block hash
          fromHex(BLOCK_HASH),
        ]),
      ),
    )
  })
})

describe("getTxHelper", () => {
  it("round-trips an immortal payload", () => {
    const helper = getTxHelper(toHex(metadataRaw))
    const { input, blockNumber } = helper.fromPjsToInputRaw(
      getPayload({ era: "0x00" }),
    )

    const mortality = input.extensions.find((x) => x.id === "CheckMortality")!
    expect(toHex(mortality.extra)).toBe("0x00")
    expect(toHex(mortality.additionalSigned)).toBe(GENESIS)

    const decoded = helper.getTxInputDecoded(input, blockNumber)
    expect(decoded.mortality).toBe(null)
    expect(decoded.genesisHash).toBe(GENESIS)
    expect(decoded.nonce).toBe(5)
    expect(decoded.tip).toBe(0n)
  })

  it("round-trips a mortal payload", () => {
    const helper = getTxHelper(toHex(metadataRaw))
    const { input, blockNumber } = helper.fromPjsToInputRaw(
      getPayload({ era: "0xf502" }),
    )

    const mortality = input.extensions.find((x) => x.id === "CheckMortality")!
    expect(toHex(mortality.additionalSigned)).toBe(BLOCK_HASH)

    const decoded = helper.getTxInputDecoded(input, blockNumber)
    // period 64, phase 47
    const height = Math.floor((BLOCK_NUMBER - 47) / 64) * 64 + 47
    expect(decoded.mortality).toEqual({
      from: { hash: BLOCK_HASH, height },
      to: height + 64,
    })
  })
})
