import type { UnsubscribeFn } from "../common-types"

export interface TxValidated {
  type: "validated"
}

export interface TxBroadcasted {
  type: "broadcasted"
  numPeers: number
}

export interface TxBestChainBlockIncluded {
  type: "bestChainBlockIncluded"
  block: {
    hash: string
    index: number
  } | null
}

export interface TxFinalized {
  type: "finalized"
  block: {
    hash: string
    index: number
  }
}

export interface TxInvalid {
  type: "invalid"
  error: string
}

export interface TxDropped {
  type: "dropped"
  broadcasted: boolean
  error: string
}

export interface TxError {
  type: "error"
  error: string
}

export type TxEvent =
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | TxFinalized
  | TxInvalid
  | TxDropped
  | TxError

export type Transaction = (
  tx: string,
  next: (event: TxEvent) => void,
  error: (e: Error) => void,
) => UnsubscribeFn
