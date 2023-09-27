export interface TxValidatedRpc {
  event: "validated"
}

export interface TxBroadcastedRpc {
  event: "broadcasted"
  numPeers: number
}

export interface TxBestChainBlockIncludedRpc {
  event: "bestChainBlockIncluded"
  block: {
    hash: string
    index: number
  } | null
}

export interface TxFinalizedRpc {
  event: "finalized"
  block: {
    hash: string
    index: number
  }
}

export interface TxInvalidRpc {
  event: "invalid"
  error: string
}

export interface TxDroppedRpc {
  event: "dropped"
  broadcasted: boolean
  error: string
}

export interface TxErrorRpc {
  event: "error"
  error: string
}

export type TxEventRpc =
  | TxValidatedRpc
  | TxBroadcastedRpc
  | TxBestChainBlockIncludedRpc
  | TxFinalizedRpc
  | TxInvalidRpc
  | TxDroppedRpc
  | TxErrorRpc
