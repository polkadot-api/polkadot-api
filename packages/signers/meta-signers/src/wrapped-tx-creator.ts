import { SignerTxCreator } from "@polkadot-api/tx-creator"

export type WrapTxCreator<T extends SignerTxCreator> = {
  accountId: Uint8Array
} & T
