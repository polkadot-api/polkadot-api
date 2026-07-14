import { TxCreator } from "@polkadot-api/tx-creator"

export type WrapTxCreator<T extends TxCreator> = {
  publicKey: Uint8Array
  accountId: Uint8Array
} & T
