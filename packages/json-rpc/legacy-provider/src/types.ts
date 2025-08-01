/*
 {
  parentHash:
    "0xad5995efae31bd9eb0b37eb55a127f0db5f5cbd8ba7aa79d71314965db171b66",
  number: "0x8034e4",
  stateRoot:
    "0x47daa6b03e7b9a347ae666760be0f919f92f35d5dceceb867f0204dc902488dc",
  extrinsicsRoot:
    "0x02d01b148574bb6077652b25567642ddfca98424a0e79f672b8f5f5ce0a83114",
  digest: {
    logs: [
      "0x06617572612082d5b50800000000",
      "0x0452505352909578b12648423a09fa82c4ddf5ce1197f59c67bfda04ec15bd2eaa03a755489616a67306",
      "0x0466726f6e880153a7b729c869a04a693ca54da6998965e959a67e76fb8592cc27143865d2d1c100",
      "0x05617572610101f83f48727514fbdc6d861a3b683a4bc6fe9d7677397507c24edd349d41b3133d25e9893dc16025e19c88284ec1ce1316d009aab9d4fe8c605763e25833f2288a",
    ],
  },
}
*/

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
