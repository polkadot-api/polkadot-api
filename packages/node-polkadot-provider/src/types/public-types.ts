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

type CreateTxParams = NonNullable<Parameters<CreateTx>[2]>
type CreateTxContext = Parameters<CreateTxParams>[0]
type CustomizeTxResult<T extends Array<UserSignedExtensionName>> = {
  userSignedExtensionsData: ConsumerCallback<T>["userSignedExtensionsData"]
  overrides: ConsumerCallback<T>["overrides"]
}

export type GetChainArgs = {
  chainId: string
  name: string
  keyring: Keyring
  chainProvider: ConnectProvider
  userSignedExtensionDefaults?: Partial<UserSignedExtensions>
  customizeTx?: <T extends Array<UserSignedExtensionName>>(
    ctx: CreateTxContext,
  ) => Promise<Partial<CustomizeTxResult<T>>>
}
