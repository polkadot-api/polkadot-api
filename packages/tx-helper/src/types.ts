import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"

export type Callback<T> = (value: T) => void

export type GetTxCreator = (
  // The `TransactionCreator` communicates with the Chain to obtain metadata, latest block, nonce, etc.
  chainProvider: ConnectProvider,

  // This callback is invoked in order to capture the necessary user input
  // for creating the transaction.
  onCreateTx: <UserSignedExtensionsName extends Array<UserSignedExtensionName>>(
    context: OnCreateTxCtx<UserSignedExtensionsName>,

    // The function to call once the user has decided to cancel or proceed with the tx.
    // Passing `null` indicates that the user has decided not to sing the tx.
    callback: Callback<null | ConsumerCallback<UserSignedExtensionsName>>,
  ) => void,
) => {
  createTx: CreateTx
  destroy: () => void
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

  // The dApp may suggested some default values for the signed extensions
  // that require from user input. The user interface should take these
  // values under consideration while allowing the user to alter them.
  hintedSignedExtensions: HintedSignedExtensions

  // An Array containing a list of the signed extensions which are unknown
  // to the library and that require for a value on the "extra" field
  // and/or additionally signed data. This will give the consumer the opportunity
  // to provide that data via the `overrides` field of the callback.
  unknownSignedExtensions: Array<string>

  // The user interface may need the metadata for many different reasons:
  // knowing how to decode and present the arguments of the call to the user,
  // validate the user input, later decode the singer data, etc, etc.
  metadata: Uint8Array
}

export type ConsumerCallback<T extends Array<UserSignedExtensionName>> = {
  // A tuple with the user-data corresponding to the provided `userSignedExtensionsName`
  userSignedExtensionsData: UserSignedExtensionsData<T>

  // in case that the consumer wants to add some signed-extension overrides
  overrides: Record<string, { value: Uint8Array; additionalSigned: Uint8Array }>

  // The type of the signature method
  signingType: SigningType

  // The function that will be called in order to finally sign the signature payload.
  signer: (input: Uint8Array) => Promise<Uint8Array>
}

export type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  assetId: Uint8Array
}>

export type CreateTx = (
  from: Uint8Array, // The public-key of the sender
  callData: Uint8Array,
  hintedSignedExtensions?: HintedSignedExtensions,
  cb?: <UserSignedExtensionsName extends Array<UserSignedExtensionName>>(
    context: OnCreateTxCtx<UserSignedExtensionsName>,
    callback: Callback<null | ConsumerCallback<UserSignedExtensionsName>>,
  ) => void,
) => Promise<Uint8Array>

export type SigningType = "Ed25519" | "Sr25519" | "Ecdsa"

export type UserSignedExtensions = {
  CheckMortality: { mortal: false } | { mortal: true; period: number }
  ChargeTransactionPayment: bigint
  ChargeAssetTxPayment: { tip: bigint; assetId?: Uint8Array }
}

export type UserSignedExtensionName = keyof UserSignedExtensions

export type TupleToIntersection<T extends Array<any>> = T extends [
  infer V,
  ...infer Rest,
]
  ? V & TupleToIntersection<Rest>
  : unknown

export type UserSignedExtensionsData<T extends Array<UserSignedExtensionName>> =
  TupleToIntersection<{
    [K in keyof T]: T[K] extends UserSignedExtensionName
      ? Pick<UserSignedExtensions, T[K]>
      : {}
  }>

export type UserSignedExtensionsInput<T extends UserSignedExtensionName> =
  UserSignedExtensions[T]
