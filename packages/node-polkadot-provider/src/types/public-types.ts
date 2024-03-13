import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { SigningType, UserSignedExtensions } from "@polkadot-api/tx-helper"
import type {
  CreateTx,
  ConsumerCallback,
  UserSignedExtensionName,
} from "@polkadot-api/tx-helper"

export type KeyPair = {
  publicKey: Uint8Array
  signingType: SigningType
  name?: string
  sign: (input: Uint8Array) => Promise<Uint8Array>
}

export type CreateTxParams = NonNullable<Parameters<CreateTx>[3]>
export type CreateTxContext = Parameters<CreateTxParams>[0]
export type CustomizeTxResult<T extends Array<UserSignedExtensionName>> = {
  userSignedExtensionsData: ConsumerCallback<T>["userSignedExtensionsData"]
  overrides: ConsumerCallback<T>["overrides"]
}

export type GetChainArgs = {
  keyring: Array<KeyPair>
  provider: JsonRpcProvider
  txCustomizations?:
    | Partial<UserSignedExtensions>
    | (<T extends Array<UserSignedExtensionName>>(
        ctx: CreateTxContext,
      ) => Promise<Partial<CustomizeTxResult<T> | null>>)
}
