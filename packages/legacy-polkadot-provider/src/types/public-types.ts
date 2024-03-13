import type { Callback } from "./chain-types"

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
}

export type CreateTxCallback = <
  UserSignedExtensionsName extends Array<UserSignedExtensionName>,
>(
  context: OnCreateTxCtx<UserSignedExtensionsName>,

  // The function to call once the user has decided to cancel or proceed with the tx.
  // Passing `null` indicates that the user has decided not to sing the tx.
  callback: Callback<UserSignedExtensionsData<UserSignedExtensionsName>>,
) => void

export type UserSignedExtensions = {
  CheckMortality: { mortal: false } | { mortal: true; period: number }
  ChargeTransactionPayment: bigint
  ChargeAssetTxPayment: { tip: bigint; asset?: Uint8Array }
}

export type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  asset: Uint8Array
}>

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
