import { PullOptions, TxCallData } from "@/types"
import { SystemEvent } from "@polkadot-api/observable-client"
import { ArgsForCreator, TxCreator } from "@polkadot-api/polkadot-signer"
import { Enum, HexString } from "@polkadot-api/substrate-bindings"
import { Observable } from "rxjs"

export type TxEvent = TxSigned | TxBroadcasted | TxBestBlocksState | TxFinalized
export type TxBroadcastEvent =
  | TxSigned
  | TxBroadcasted
  | TxBestBlocksState
  | TxFinalized

export type TxSigned = { type: "signed"; txHash: HexString }

export type TxBroadcasted = { type: "broadcasted"; txHash: HexString }

export type TxBestBlocksState = {
  type: "txBestBlocksState"
  txHash: HexString
} & (TxInBestBlocksNotFound | TxInBestBlocksFound)

export type TxInBestBlocksNotFound = {
  found: false
  isValid: boolean
}

export type TxInBestBlocksFound = {
  found: true
} & TxEventsPayload

export type FlattenedEvent = SystemEvent & SystemEvent["event"]

export type TxEventsPayload = {
  /**
   * Verify if extrinsic was successful, i.e. check if `System.ExtrinsicSuccess`
   * is found.
   */
  ok: boolean
  /**
   * Array of all events emitted by the tx. Ordered as they are emitted
   * on-chain.
   */
  events: Array<FlattenedEvent>
  /**
   * Block information where the tx is found. `hash` of the block, `number` of
   * the block, `index` of the tx in the block.
   */
  block: { hash: string; number: number; index: number }
} & (
  | {
      ok: true
      /**
       * Dispatch Error found at `System.ExtrinsicFailed` event.
       */
      dispatchError?: undefined
    }
  | {
      ok: false
      /**
       * Dispatch Error found at `System.ExtrinsicFailed` event.
       */
      dispatchError: {
        type: string
        value: unknown
      }
    }
)

export type TxFinalized = {
  type: "finalized"
  txHash: HexString
} & TxEventsPayload
export type TxFinalizedPayload = { txHash: HexString } & TxEventsPayload
export type TxCreatorOptions<T extends TxCreator<any>, Asset> = ArgsForCreator<
  T,
  {
    extensions: {
      ChargeAssetTxPayment: {
        additionalSigned: never
        type: Asset
      }
    }
  }
>

type IsAny<T> = 0 extends 1 & T ? true : false
type TxCreatorOptionsArg<T extends TxCreator<any>, Asset> =
  IsAny<TxCreatorOptions<T, Asset>> extends true
    ? [txOptions?: TxCreatorOptions<T, Asset>]
    : {} extends TxCreatorOptions<T, Asset>
      ? [txOptions?: TxCreatorOptions<T, Asset>]
      : [txOptions: TxCreatorOptions<T, Asset>]

export type PaymentInfo = {
  weight: {
    ref_time: bigint
    proof_size: bigint
  }
  class: Enum<{
    Normal: undefined
    Operational: undefined
    Mandatory: undefined
  }>
  partial_fee: bigint
}

export type Transaction<Asset> = {
  /**
   * Creates a signed transaction asynchronously. If the creator fails (or the
   * user cancels the signature) it'll throw an error.
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns Encoded `SignedExtrinsic` ready for broadcasting.
   */
  create<T extends TxCreator<any>>(
    creator: T,
    ...txOptions: TxCreatorOptionsArg<T, Asset>
  ): Promise<Uint8Array>

  /**
   * Observable-based all-in-one transaction submitting. It will create,
   * broadcast, and track the transaction. The observable is singlecast, i.e.
   * it will create, broadcast, etc at every subscription. It will complete once
   * the transaction is found in a `finalizedBlock`.
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns Observable to the transaction.
   */
  createSubmitAndWatch<T extends TxCreator<any>>(
    creator: T,
    ...txOptions: TxCreatorOptionsArg<T, Asset>
  ): Observable<TxEvent>

  /**
   * Creates the transaction, broadcasts it, and tracks the transaction. The
   * promise will resolve as soon as the transaction in found in a
   * `finalizedBlock`. If the creator fails (or the user cancels the signature),
   * or the transaction becomes invalid it'll throw an error.
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns Finalized transaction information.
   */
  createAndSubmit<T extends TxCreator<any>>(
    creator: T,
    ...txOptions: TxCreatorOptionsArg<T, Asset>
  ): Promise<TxFinalizedPayload>

  /**
   * SCALE-encoded callData of the transaction.
   *
   * @returns Promise resolving in the encoded data.
   */
  getEncodedData(): Promise<Uint8Array>

  /**
   * SCALE-encoded Bare (aka Unsigned) transaction ready to be broadcasted.
   *
   * @returns Promise resolving in a Bare transaction (it falls back to an
   *          unsigned transaction if only v4 is available)
   */
  getBareTx(): Promise<Uint8Array>

  /**
   * Estimate fees against the latest known `finalizedBlock`
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns Fees in fundamental units.
   */
  getEstimatedFees<T extends TxCreator<any>>(
    creator: T,
    ...txOptions: TxCreatorOptionsArg<T, Asset>
  ): Promise<bigint>

  /**
   * Payment info against the latest known `finalizedBlock`
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns PaymentInfo for the given transaction (weight, estimated fees
   *          and class).
   */
  getPaymentInfo<T extends TxCreator<any>>(
    creator: T,
    ...txOptions: TxCreatorOptionsArg<T, Asset>
  ): Promise<PaymentInfo>

  /**
   * PAPI way of expressing an extrinsic with arguments.
   * It's useful to pass as a parameter to extrinsics that accept calls.
   */
  decodedCall: TxCallData
}

export type TxEntry<Arg extends {} | undefined, Asset> = {
  /**
   * Synchronously create the transaction object ready to sign, submit,
   * estimate fees, etc.
   *
   * @param args  All parameters required by the transaction.
   * @returns Transaction object.
   */
  (...args: Arg extends undefined ? [] : [data: Arg]): Transaction<Asset>
}

export type OfflineTxEntry<Arg extends {} | undefined> = (input: Arg) => {
  /**
   * Creates a signed transaction asynchronously. If the creator fails (or the
   * user cancels the signature) it'll throw an error.
   *
   * @param creator    Transaction creator.
   * @param txOptions  Transaction creator options.
   * @returns Encoded `SignedExtrinsic` ready for broadcasting.
   */
  create: <T extends TxCreator<any>>(
    creator: T,
    txOptions: T extends TxCreator<infer A> ? A & { nonce: number } : never,
  ) => Promise<Uint8Array>

  /**
   * SCALE-encoded callData of the transaction.
   */
  encodedData: Uint8Array
  /**
   * PAPI way of expressing an extrinsic with arguments.
   * It's useful to pass as a parameter to extrinsics that accept calls.
   */
  decodedCall: TxCallData
}

export type TxFromBinary<Asset> = {
  /**
   * Asynchronously create the transaction object from a binary call data ready
   * to sign, submit, estimate fees, etc.
   *
   * @param callData  SCALE-encoded call data.
   * @returns Transaction object.
   */
  (callData: Uint8Array, options?: PullOptions): Promise<Transaction<Asset>>
}
