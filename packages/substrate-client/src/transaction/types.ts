export interface TxValidated {
  event: "validated"
}

export interface TxBroadcasted {
  event: "broadcasted"
  numPeers: number
}

export interface TxBestChainBlockIncluded {
  event: "bestChainBlockIncluded"
  block: {
    hash: string
    index: number
  } | null
}

export interface TxFinalized {
  event: "finalized"
  block: {
    hash: string
    index: number
  }
}

export interface TxInvalid {
  event: "invalid"
  error: string
}

export interface TxDropped {
  event: "dropped"
  broadcasted: boolean
  error: string
}

export type TxEvent =
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | TxFinalized
  | TxInvalid
  | TxDropped
