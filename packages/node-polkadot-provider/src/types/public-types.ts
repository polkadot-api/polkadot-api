import { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { SigningType, UserSignedExtensions } from "@polkadot-api/tx-helper"
import type {
  CreateTx,
  ConsumerCallback,
  UserSignedExtensionName,
} from "@polkadot-api/tx-helper"

type UnsubscribeFn = () => void

export type KeyPair = {
  address: string
  publicKey: Uint8Array
  signingType: SigningType
  name?: string
  sign: (input: Uint8Array) => Promise<Uint8Array>
}

export type Keyring = {
  getPairs: () => KeyPair[]
  onKeyPairsChanged: (cb: () => void) => UnsubscribeFn
}

export type CreateTxParams = NonNullable<Parameters<CreateTx>[2]>
export type CreateTxContext = Parameters<CreateTxParams>[0]
export type CustomizeTxResult<T extends Array<UserSignedExtensionName>> = {
  userSignedExtensionsData: ConsumerCallback<T>["userSignedExtensionsData"]
  overrides: ConsumerCallback<T>["overrides"]
}

export type GetChainArgs = {
  keyring: Keyring
  provider: ConnectProvider
  txCustomizations?:
    | Partial<UserSignedExtensions>
    | (<T extends Array<UserSignedExtensionName>>(
        ctx: CreateTxContext,
      ) => Promise<Partial<CustomizeTxResult<T>>>)
  onCreateTxError?: (ctx: CreateTxContext, err: Error) => void
}
