export interface ShittyHeader {
  parentHash: string
  number: string
  stateRoot: string
  extrinsicsRoot: string
  digest: {
    logs: Array<string>
  }
}

export interface DecentHeader {
  parent: string
  hash: string
  number: number
  hasUpgrade: boolean
  header: string
}

export interface Runtime {
  specName: string
  implName: string
  specVersion: number
  implVersion: number
  transactionVersion: number
  apis: Record<string, number>
}

export type NewBlockEvent = {
  event: "newBlock"
  blockHash: string
  parentBlockHash: string
  newRuntime: Runtime | null
}

export interface InitializedEvent {
  event: "initialized"
  finalizedBlockHashes: string[]
}

export interface FinalizedIevent {
  event: "finalized"
  finalizedBlockHashes: Array<string>
  prunedBlockHashes: Array<string>
}

export interface BestBlockChangedEvent {
  event: "bestBlockChanged"
  bestBlockHash: string
}
