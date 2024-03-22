import {
  AssetDescriptor,
  Binary,
  Enum,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import {
  Observable,
  concat,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
} from "rxjs"
import {
  RuntimeContext,
  SystemEvent,
  getObservableClient,
} from "./observableClient"
import {
  IsCompatible,
  Runtime,
  createIsCompatible,
  getRuntimeContext,
} from "./runtime"
import { TrackedTx } from "./observableClient/chainHead/track-tx"

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
  | { type: "broadcasted" }
  | { type: "bestChainBlockIncluded"; block: { hash: string; index: number } }
  | ({ type: "finalized"; block: { hash: string; index: number } } & TxSuccess)
>

interface TxCall {
  (): Promise<Binary>
  (runtime: Runtime): Binary
}

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

export const createTxEntry = <
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset extends AssetDescriptor<any>,
>(
  checksum: string,
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
): TxEntry<Arg, Pallet, Name, Asset["_type"]> => {
  const hasSameChecksum = (
    checksumBuilder: RuntimeContext["checksumBuilder"],
  ) => checksumBuilder.buildCall(pallet, name) === checksum
  const isCompatible = createIsCompatible(chainHead, (ctx) =>
    hasSameChecksum(ctx.checksumBuilder),
  )

  const fn = (arg?: Arg): any => {
    const tx$ = (tx: string) =>
      concat(
        chainHead.finalized$.pipe(
          take(1),
          mergeMap((finalized) => chainHead.validateTx$(tx, finalized.hash)),
          map((isValid) => {
            if (!isValid) throw new Error("Invalid")
            return { type: "broadcasted" as "broadcasted" }
          }),
        ),
        new Observable<TrackedTx>((observer) => {
          const subscription = chainHead.trackTx$(tx).subscribe(observer)
          subscription.add(
            client.broadcastTx$(tx).subscribe({
              error(e) {
                observer.error(e)
              },
            }),
          )
          return subscription
        }),
      )

    const getCallDataWithContext = (
      {
        checksumBuilder,
        dynamicBuilder,
        asset: [assetEnc, assetCheck],
      }: RuntimeContext,
      arg: any,
      hinted: Partial<{ asset: any }> = {},
    ) => {
      const checksum = checksumBuilder.buildCall(pallet, name)
      if (checksum !== checksum)
        throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

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
    }

    const getCallData$ = (arg: any, hinted: Partial<{ asset: any }> = {}) =>
      chainHead
        .getRuntimeContext$(null)
        .pipe(map((ctx) => getCallDataWithContext(ctx, arg, hinted)))

    const getEncodedData: TxCall = (runtime?: Runtime): any => {
      if (runtime) {
        return getCallDataWithContext(getRuntimeContext(runtime), arg).callData
      }
      return firstValueFrom(getCallData$(arg).pipe(map((x) => x.callData)))
    }

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

      const result = (await lastValueFrom(tx$(tx))) as TrackedTx

      const systemEvents = await firstValueFrom(
        chainHead.eventsAt$(result.block.hash),
      )

      return getTxSuccessFromSystemEvents(
        systemEvents,
        Number(result.block.index),
      )
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
              return result.type !== "finalized"
                ? of(result)
                : chainHead.eventsAt$(result.block.hash).pipe(
                    map((events) => ({
                      ...result,
                      ...getTxSuccessFromSystemEvents(
                        events,
                        Number(result.block.index),
                      ),
                    })),
                  )
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

  return Object.assign(fn, { isCompatible })
}
