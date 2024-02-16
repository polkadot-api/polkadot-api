import { blockHeader } from "@polkadot-api/substrate-bindings"
import {
  BestBlockChanged,
  Finalized,
  FollowEventWithRuntime,
  InitializedWithRuntime,
  NewBlockWithRuntime,
  Runtime,
} from "@polkadot-api/substrate-client"
import { toHex } from "@polkadot-api/utils"
import { MockSubstrateClient } from "./mockSubstrateClient"

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
function sendFnChainheadFollow<
  Args extends any[],
  R extends FollowEventWithRuntime,
>(fn: (...args: Args) => R) {
  return (client: MockSubstrateClient, ...args: Args) => {
    const value = fn(...args)
    client.chainHead.mock.send(value)
    return value
  }
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
export const sendInitialized = sendFnChainheadFollow(newInitialized)

export const createNewBlock = fixtureWithDefault<NewBlockWithRuntime>(() => ({
  type: "newBlock",
  blockHash: nilHash,
  newRuntime: null,
  parentBlockHash: nilHash,
}))
export const sendNewBlock = sendFnChainheadFollow(createNewBlock)

export const newBestBlockChanged = fixtureWithDefault<BestBlockChanged>(() => ({
  type: "bestBlockChanged",
  bestBlockHash: nilHash,
}))
export const sendBestBlockChanged = sendFnChainheadFollow(newBestBlockChanged)

export const newFinalized = fixtureWithDefault<Finalized>(() => ({
  type: "finalized",
  finalizedBlockHashes: [nilHash],
  prunedBlockHashes: [],
}))
export const sendFinalized = sendFnChainheadFollow(newFinalized)

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

export const initialize = async (mockClient: MockSubstrateClient) => {
  const initialized = sendInitialized(mockClient, newInitialized())

  const header = createHeader({
    parentHash: newHash(),
  })
  await mockClient.chainHead.mock.header.reply(
    initialized.finalizedBlockHash,
    encodeHeader(header),
  )
  // Wait a microtask, internally the code is mapping values through .then(), but it's guaranteed the result will come in the same macro task
  await waitMicro()

  return {
    initialHash: initialized.finalizedBlockHash,
    initialNumber: header.number,
    initialized,
    header,
  }
}

export const sendNewBlockBranch = (
  mockClient: MockSubstrateClient,
  parentHash: string,
  length: number,
) => {
  let previousHash = parentHash
  return new Array(length).fill(0).map(() => {
    const result = sendNewBlock(mockClient, {
      blockHash: newHash(),
      parentBlockHash: previousHash,
    })
    previousHash = result.blockHash
    return result
  })
}
