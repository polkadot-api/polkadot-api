import { TxCreator } from "@polkadot-api/polkadot-signer"

export type WrapTxCreator<T extends TxCreator> = {
  publicKey: Uint8Array
  accountId: Uint8Array
} & T
