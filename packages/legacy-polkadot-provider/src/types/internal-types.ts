import type { V14 } from "@polkadot-api/substrate-bindings"
import { getObservableClient } from "@polkadot-api/client"
import { Observable } from "rxjs"
import type { ConnectProvider, Provider } from "@polkadot-api/json-rpc-provider"
import {
  CreateTxCallback,
  UserSignedExtensionName,
  UserSignedExtensions,
} from "./public-types"

export type Callback<T> = (value: T) => void

export type GetTxCreator = (
  // The `TransactionCreator` communicates with the Chain to obtain metadata, latest block, nonce, etc.
  chainProvider: ConnectProvider,

  // This callback is invoked in order to capture the necessary user input
  // for creating the transaction.
  onCreateTx: CreateTxCallback,
  signPayload: (payload: SignerPayloadJSON) => Promise<{ signature: string }>,
) => (onMessage: (msg: string) => void) => Provider & {
  createTx: CreateTx
}

export type OnCreateTxCtx<
  UserSignedExtensionsName extends Array<UserSignedExtensionName>,
> = {
  // The public-key of the sender
  from: Uint8Array

  // The scale encoded call-data (module index, call index and args)
  callData: Uint8Array

  // The list of signed extensions that require from user input.
  // The user interface should know how to adapt to the possibility that
  // different chains may require a different set of these.
  userSingedExtensionsName: UserSignedExtensionsName

  // An Array containing a list of the signed extensions which are unknown
  // to the library and that require for a value on the "extra" field
  // and/or additionally signed data. This will give the consumer the opportunity
  // to provide that data via the `overrides` field of the callback.
  unknownSignedExtensions: Array<string>
}

export type CreateTx = (
  from: Uint8Array, // The public-key of the sender
  callData: Uint8Array,
) => Promise<Uint8Array>

export type SigningType = "Ed25519" | "Sr25519" | "Ecdsa"

export type UserSignedExtensionsInput<T extends UserSignedExtensionName> =
  UserSignedExtensions[T]

export interface ChainExtensionCtx {
  from: Uint8Array
  callData: Uint8Array
  metadata: V14
  at: string
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>
}

export type SignedExtension = Observable<{
  extra: Uint8Array
  additional: Uint8Array
  pjs: Partial<SignerPayloadJSON>
}>

export type GetChainSignedExtension = (
  ctx: ChainExtensionCtx,
) => SignedExtension

export type GetUserSignedExtension<K extends UserSignedExtensionName> = (
  input$: Observable<UserSignedExtensionsInput<K>>,
  ctx: ChainExtensionCtx,
) => SignedExtension

export type HexString = string

export interface SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   */
  address: string

  /**
   * @description The checkpoint hash of the block, in hex
   * DONE
   */
  blockHash: HexString

  /**
   * @description The era for this transaction, in hex
   * DONE
   */
  era: HexString

  /**
   * @description The genesis hash of the chain, in hex
   * DONE
   */
  genesisHash: HexString

  blockNumber: number | bigint

  /**
   * @description The encoded method (with arguments) in hex
   */
  method: string

  /**
   * @description The nonce for this transaction, in hex
   */
  nonce: number | bigint

  /**
   * @description The current spec version for the runtime
   */
  specVersion: HexString

  /**
   * @description The tip for this transaction, in hex
   * DONE
   */
  tip: HexString

  /**
   * @description The current transaction version for the runtime
   * DONE
   */
  transactionVersion: HexString

  /**
   * @description The applicable signed extensions for this runtime
   */
  signedExtensions: string[]

  /**
   * @description The version of the extrinsic we are dealing with
   */
  version: number
}
