import { TxCreatorFactory } from "@polkadot-api/signers-common"

export type WrapTxCreatorFactory<T extends TxCreatorFactory<any>> = T & {
  publicKey: Uint8Array
  accountId: Uint8Array
}
