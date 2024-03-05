import {
  Binary,
  Enum,
  PlainDescriptor,
  SS58String,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
import type {
  TxBestChainBlockIncluded,
  TxBroadcasted,
  TxFinalized,
  TxValidated,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  concat,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
  takeWhile,
} from "rxjs"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import { getObservableClient, SystemEvent } from "./observableClient"

type TxSuccess = {
  ok: boolean
  events: Array<SystemEvent["event"]>
}

type TxFunction<Asset> = (
  from: SS58String | Uint8Array,
  hintedSignExtensions?: Partial<
    void extends Asset
      ? {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
        }
      : {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
          asset: Asset
        }
  >,
) => Promise<TxSuccess>

type TxObservable<Asset> = (
  from: SS58String | Uint8Array,
  hintedSignExtensions?: Partial<
    void extends Asset
      ? {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
        }
      : {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
          asset: Asset
        }
  >,
) => Observable<
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | (TxFinalized & TxSuccess)
>

type TxCall = () => Promise<Binary>

type TxSigned<Asset> = (
  from: SS58String | Uint8Array,
  hintedSignExtensions?: Partial<
    void extends Asset
      ? {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
        }
      : {
          tip: bigint
          mortal: { mortal: false } | { mortal: true; period: number }
          asset: Asset
        }
  >,
) => Promise<string>

export type Transaction<
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset,
> = {
  callData: Enum<{
    type: Pallet
    value: Enum<{
      type: Name
      value: Arg
    }>
  }>
  getEncodedData: TxCall
  getTx: TxSigned<Asset>
  submit: TxFunction<Asset>
  submit$: TxObservable<Asset>
}

const getTxSuccessFromSystemEvents = (
  systemEvents: Array<SystemEvent>,
  txIdx: number,
): TxSuccess => {
  const events = systemEvents
    .filter((x) => x.phase.type === "ApplyExtrinsic" && x.phase.value === txIdx)
    .map((x) => x.event)

  const lastEvent = events[events.length - 1]
  const ok =
    lastEvent.type === "System" && lastEvent.value.type === "ExtrinsicSuccess"

  return { ok, events }
}

export const createTxEntry =
  <
    Arg extends {} | undefined,
    Pallet extends string,
    Name extends string,
    Asset extends PlainDescriptor<any>,
  >(
    descriptor: TxDescriptor<Arg>,
    pallet: Pallet,
    name: Name,
    assetChecksum: Asset,
    chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
    client: ReturnType<typeof getObservableClient>,
    signer: (
      from: string | Uint8Array,
      callData: Uint8Array,
      hinted?: Partial<{}>,
    ) => Promise<Uint8Array>,
  ): ((arg: any) => Transaction<Arg, Pallet, Name, Asset["_type"]>) =>
  (arg?: Arg): any => {
    const tx$ = (tx: string) =>
      concat(
        client.tx$(tx).pipe(takeWhile((x) => x.type !== "broadcasted", true)),
        chainHead.trackTx$(tx),
      )

    const getCallData$ = (arg: any, hinted: Partial<{ asset: any }> = {}) =>
      chainHead.getRuntimeContext$(null).pipe(
        map(
          ({
            checksumBuilder,
            dynamicBuilder,
            asset: [assetEnc, assetCheck],
          }) => {
            const checksum = checksumBuilder.buildCall(pallet, name)
            if (checksum !== descriptor)
              throw new Error(
                `Incompatible runtime entry Tx(${pallet}.${name})`,
              )

            let returnHinted = hinted
            if (hinted.asset) {
              if (assetChecksum !== assetCheck)
                throw new Error(`Incompatible runtime asset`)
              returnHinted = { ...hinted, asset: assetEnc(hinted.asset) }
            }

            const { location, codec } = dynamicBuilder.buildCall(pallet, name)
            return {
              callData: Binary.fromBytes(
                mergeUint8(new Uint8Array(location), codec.enc(arg)),
              ),
              hinted: returnHinted,
            }
          },
        ),
      )

    const getEncodedData: TxCall = () =>
      firstValueFrom(getCallData$(arg).pipe(map((x) => x.callData)))

    const getTx: TxSigned<Asset> = (from, _hinted) =>
      firstValueFrom(
        getCallData$(arg, _hinted as any).pipe(
          mergeMap(({ callData, hinted }) =>
            signer(from, callData.asBytes(), hinted),
          ),
          map(toHex),
        ),
      )

    const submit: TxFunction<Asset> = async (from, _hinted) => {
      const tx = await firstValueFrom(
        getCallData$(arg, _hinted as any).pipe(
          mergeMap(({ callData, hinted }) =>
            signer(from, callData.asBytes(), hinted).then(toHex),
          ),
        ),
      )

      const result = await lastValueFrom(tx$(tx))

      switch (result.type) {
        case "invalid":
          throw new Error("Invalid")
        case "dropped":
          throw new Error("Dropped")
        case "finalized": {
          const systemEvents = await firstValueFrom(
            chainHead.eventsAt$(result.block.hash),
          )

          return getTxSuccessFromSystemEvents(
            systemEvents,
            Number(result.block.index),
          )
        }
        default:
          return { ok: true, events: [] }
      }
    }

    const submit$: TxObservable<Asset> = (from, _hinted) =>
      getCallData$(arg, _hinted as any).pipe(
        mergeMap(({ callData, hinted }) =>
          signer(from, callData.asBytes(), hinted),
        ),
        take(1),
        mergeMap((result) => {
          return tx$(toHex(result)).pipe(
            mergeMap((result) => {
              switch (result.type) {
                case "invalid":
                  throw new Error("Invalid")
                case "dropped":
                  throw new Error("Dropped")
                case "finalized": {
                  return chainHead.eventsAt$(result.block.hash).pipe(
                    map((events) => ({
                      ...result,
                      ...getTxSuccessFromSystemEvents(
                        events,
                        Number(result.block.index),
                      ),
                    })),
                  )
                }
                default:
                  return of(result)
              }
            }),
          )
        }),
      )

    return {
      callData: Enum(pallet, Enum(name, arg as any)) as Enum<{
        type: Pallet
        value: any
      }>,
      getEncodedData,
      getTx,
      submit,
      submit$,
    }
  }
