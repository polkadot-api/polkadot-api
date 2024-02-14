import { blockHeader } from "@polkadot-api/substrate-bindings"
import {
  BestBlockChanged,
  Finalized,
  InitializedWithRuntime,
  NewBlockWithRuntime,
  Runtime,
} from "@polkadot-api/substrate-client"
import { toHex } from "@polkadot-api/utils"

export const nilHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000"
let lastHash = 0
export const newHash = () => {
  const value = ++lastHash
  return "0x" + value.toString(16).padStart(64, "0")
}

function fixtureWithDefault<T>(defaultValue: () => T) {
  return (overrides: Partial<T> = {}): T => ({
    ...defaultValue(),
    ...overrides,
  })
}

export const newRuntime = fixtureWithDefault<Runtime>(() => ({
  apis: {},
  implName: "mock",
  implVersion: 1,
  specName: "spec",
  specVersion: 1,
  transactionVersion: 1,
}))

export const newInitialized = fixtureWithDefault<InitializedWithRuntime>(
  () => ({
    type: "initialized",
    finalizedBlockHash: nilHash,
    finalizedBlockRuntime: newRuntime(),
  }),
)

export const createNewBlock = fixtureWithDefault<NewBlockWithRuntime>(() => ({
  type: "newBlock",
  blockHash: nilHash,
  newRuntime: null,
  parentBlockHash: nilHash,
}))

export const newBestBlockChanged = fixtureWithDefault<BestBlockChanged>(() => ({
  type: "bestBlockChanged",
  bestBlockHash: nilHash,
}))

export const newFinalized = fixtureWithDefault<Finalized>(() => ({
  type: "finalized",
  finalizedBlockHashes: [nilHash],
  prunedBlockHashes: [],
}))

type Header = ReturnType<typeof blockHeader.dec>
export const createHeader = (overrides: Partial<Header> = {}) => ({
  digests: [],
  extrinsicRoot: nilHash,
  number: 0,
  parentHash: nilHash,
  stateRoot: nilHash,
  ...overrides,
})

export const encodeHeader = (header: Header) => toHex(blockHeader.enc(header))

export const wait = (timeout = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeout))
export const waitMicro = async (amount = 1) => {
  for (let i = 0; i < amount; i++) {
    await Promise.resolve()
  }
}
