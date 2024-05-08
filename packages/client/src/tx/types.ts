import { IsCompatible, Runtime } from "@/runtime"
import { SystemEvent } from "@polkadot-api/observable-client"
import { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  Binary,
  Enum,
  HexString,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { Observable } from "rxjs"

export type TxBroadcastEvent =
  | { type: "broadcasted" }
  | ({
      type: "bestChainBlockIncluded"
    } & TxEventsPayload)
  | ({
      type: "finalized"
    } & TxEventsPayload)
export type TxEvent = TxBroadcastEvent | { type: "signed"; tx: HexString }

export type TxEventsPayload = {
  ok: boolean
  events: Array<SystemEvent["event"]>
  block: { hash: string; index: number }
}

export type TxOptions<Asset> = Partial<
  void extends Asset
    ? {
        at: HexString | "best" | "finalized"
        tip: bigint
        mortality: { mortal: false } | { mortal: true; period: number }
        nonce: number
      }
    : {
        at: HexString | "best" | "finalized"
        tip: bigint
        mortality: { mortal: false } | { mortal: true; period: number }
        asset: Asset
        nonce: number
      }
>

export type TxFunction<Asset> = (
  from: PolkadotSigner,
  txOptions?: TxOptions<Asset>,
) => Promise<TxEventsPayload>

export type TxObservable<Asset> = (
  from: PolkadotSigner,
  txOptions?: TxOptions<Asset>,
) => Observable<TxEvent>

export interface TxCall {
  (): Promise<Binary>
  (runtime: Runtime): Binary
}

export type TxSigned<Asset> = (
  from: PolkadotSigner,
  txOptions?: TxOptions<Asset>,
) => Promise<string>

export type Transaction<
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset,
> = {
  sign: TxSigned<Asset>
  signSubmitAndWatch: TxObservable<Asset>
  signAndSubmit: TxFunction<Asset>
  getEncodedData: TxCall
  getEstimatedFees: (
    from: Uint8Array | SS58String,
    txOptions?: TxOptions<Asset>,
  ) => Promise<bigint>
  decodedCall: Enum<{ [P in Pallet]: Enum<{ [N in Name]: Arg }> }>
}

export interface TxEntry<
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset,
> {
  (
    ...args: Arg extends undefined ? [] : [data: Arg]
  ): Transaction<Arg, Pallet, Name, Asset>
  isCompatible: IsCompatible
}
