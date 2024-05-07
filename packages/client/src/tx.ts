import {
  AccountId,
  Binary,
  Enum,
  HexString,
  SS58String,
  Tuple,
  compact,
  u128,
  u32,
  u8,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import {
  EMPTY,
  Observable,
  combineLatest,
  concat,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
  takeWhile,
  throwError,
} from "rxjs"
import {
  BlockInfo,
  RuntimeContext,
  SystemEvent,
  getObservableClient,
} from "@polkadot-api/observable-client"
import { AnalyzedBlock } from "@polkadot-api/observable-client"
import {
  CompatibilityHelper,
  IsCompatible,
  Runtime,
  getRuntimeContext,
} from "./runtime"
import { PolkadotSigner } from "../../signers/polkadot-signer/dist/index.mjs"
import { getPolkadotSigner } from "@polkadot-api/signer"
import { withLogs } from "./utils"
import { AssetDescriptor } from "./descriptors"

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

const getTxSuccessFromSystemEvents = (
  systemEvents: Array<SystemEvent>,
  txIdx: number,
): Omit<TxEventsPayload, "block"> => {
  const events = systemEvents
    .filter((x) => x.phase.type === "ApplyExtrinsic" && x.phase.value === txIdx)
    .map((x) => x.event)

  const lastEvent = events[events.length - 1]
  const ok =
    lastEvent.type === "System" && lastEvent.value.type === "ExtrinsicSuccess"

  return { ok, events }
}

type TxOptions<Asset> = Partial<
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

type TxFunction<Asset> = (
  from: PolkadotSigner,
  txOptions?: TxOptions<Asset>,
) => Promise<TxEventsPayload>

type TxObservable<Asset> = (
  from: PolkadotSigner,
  txOptions?: TxOptions<Asset>,
) => Observable<TxEvent>

interface TxCall {
  (): Promise<Binary>
  (runtime: Runtime): Binary
}

type TxSigned<Asset> = (
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

const accountIdEnc = AccountId().enc

export const getSubmitFns = (
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  client: ReturnType<typeof getObservableClient>,
) => {
  const tx$ = (tx: string, _at?: HexString) =>
    concat(
      (_at
        ? of(_at)
        : chainHead.finalized$.pipe(
            take(1),
            map((x) => x.hash),
          )
      ).pipe(
        mergeMap((at) =>
          chainHead.validateTx$(at, tx).pipe(
            map((isValid) => {
              if (!isValid) throw new Error("Invalid")
              return { type: "broadcasted" as "broadcasted" }
            }),
          ),
        ),
      ),
      new Observable<{ type: "analyzed"; value: AnalyzedBlock }>((observer) => {
        const subscription = chainHead
          .trackTx$(tx)
          .pipe(map((value) => ({ type: "analyzed" as const, value })))
          .subscribe(observer)
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

  const submit$ = (
    transaction: HexString,
    at?: HexString,
  ): Observable<TxBroadcastEvent> =>
    tx$(transaction, at).pipe(
      mergeMap((result) => {
        if (result.type === "broadcasted") return of(result)

        if (!result.value.found.type) {
          if (result.value.found.isValid) return EMPTY

          return chainHead.isBestOrFinalizedBlock(result.value.hash).pipe(
            filter((x) => x === "finalized"),
            map(() => {
              throw new Error("Invalid")
            }),
          )
        }

        const { index } = result.value.found
        return combineLatest([
          chainHead
            .isBestOrFinalizedBlock(result.value.hash)
            .pipe(filter(Boolean)),
          result.value.found.events as Observable<Array<SystemEvent>>,
        ]).pipe(
          map(([type, events]) => ({
            type: type === "best" ? ("bestChainBlockIncluded" as const) : type,
            block: {
              hash: result.value.hash,
              index,
            },
            ...getTxSuccessFromSystemEvents(events, index),
          })),
        )
      }),
      takeWhile((e) => e.type !== "finalized", true),
    )

  const submit = async (
    transaction: HexString,
    at?: HexString,
  ): Promise<{
    ok: boolean
    events: Array<SystemEvent["event"]>
    block: { hash: string; index: number }
  }> =>
    lastValueFrom(submit$(transaction, at)).then((x) => {
      if (x.type !== "finalized") throw null
      const result: {
        ok: boolean
        events: Array<SystemEvent["event"]>
        block: { hash: string; index: number }
        type?: any
      } = { ...x }
      delete result.type
      return result
    })

  return { submit$, submit }
}

const queryInfoRawDec = Tuple(compact, compact, u8, u128).dec
const queryInfoDec = (input: string): bigint => queryInfoRawDec(input)[3]
const fakeSignature = new Uint8Array(64)
const getFakeSignature = () => fakeSignature

export const createTxEntry = <
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset extends AssetDescriptor<any>,
>(
  pallet: Pallet,
  name: Name,
  assetChecksum: Asset,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  submits: ReturnType<typeof getSubmitFns>,
  signer: (
    from: PolkadotSigner,
    callData: Uint8Array,
    atBlock: BlockInfo,
    options?: Partial<{}>,
  ) => Observable<Uint8Array>,
  compatibilityHelper: CompatibilityHelper,
): TxEntry<Arg, Pallet, Name, Asset["_type"]> => {
  const { isCompatible, compatibleRuntime$ } = compatibilityHelper((ctx) =>
    ctx.checksumBuilder.buildCall(pallet, name),
  )
  const checksumError = () =>
    new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

  const fn = (arg?: Arg): any => {
    const getCallDataWithContext = (
      { dynamicBuilder, asset: [assetEnc, assetCheck] }: RuntimeContext,
      arg: any,
      txOptions: Partial<{ asset: any }> = {},
    ) => {
      let returnOptions = txOptions
      if (txOptions.asset) {
        if (assetChecksum !== assetCheck)
          throw new Error(`Incompatible runtime asset`)
        returnOptions = { ...txOptions, asset: assetEnc(txOptions.asset) }
      }

      const { location, codec } = dynamicBuilder.buildCall(pallet, name)
      return {
        callData: Binary.fromBytes(
          mergeUint8(new Uint8Array(location), codec.enc(arg)),
        ),
        options: returnOptions,
      }
    }

    const getCallData$ = (arg: any, options: Partial<{ asset: any }> = {}) =>
      compatibleRuntime$(chainHead, null, checksumError).pipe(
        map((ctx) => getCallDataWithContext(ctx, arg, options)),
      )

    const getEncodedData: TxCall = (runtime?: Runtime): any => {
      if (runtime) {
        if (!isCompatible(runtime)) {
          throw checksumError()
        }
        return getCallDataWithContext(getRuntimeContext(runtime), arg).callData
      }
      return firstValueFrom(getCallData$(arg).pipe(map((x) => x.callData)))
    }

    const sign$ = (
      from: PolkadotSigner,
      { ..._options }: Omit<TxOptions<{}>, "at">,
      atBlock: BlockInfo,
    ) =>
      getCallData$(arg, _options).pipe(
        mergeMap(({ callData, options }) =>
          signer(from, callData.asBytes(), atBlock, options),
        ),
      )

    const _sign = (
      from: PolkadotSigner,
      { at, ..._options }: TxOptions<{}> = {},
    ) => {
      return (
        !at || at === "finalized"
          ? chainHead.finalized$
          : at === "best"
            ? chainHead.best$
            : chainHead.bestBlocks$.pipe(
                map((x) => x.find((b) => b.hash === at)),
              )
      ).pipe(
        take(1),
        mergeMap((atBlock) =>
          atBlock
            ? sign$(from, _options, atBlock).pipe(
                map((signed) => ({
                  tx: toHex(signed),
                  block: atBlock,
                })),
              )
            : throwError(() => new Error(`Uknown block ${at}`)),
        ),
      )
    }

    const sign: TxSigned<Asset> = (from, options) =>
      firstValueFrom(_sign(from, options)).then((x) => x.tx)

    const signAndSubmit: TxFunction<Asset> = (from, _options) =>
      firstValueFrom(_sign(from, _options)).then(({ tx, block }) =>
        submits.submit(tx, block.hash),
      )

    const signSubmitAndWatch: TxObservable<Asset> = (from, _options) =>
      _sign(from, _options).pipe(
        mergeMap(({ tx, block }) => submits.submit$(tx, block.hash)),
      )

    const getEstimatedFees = async (
      from: Uint8Array | SS58String,
      _options?: any,
    ) => {
      const fakeSigner = getPolkadotSigner(
        from instanceof Uint8Array ? from : accountIdEnc(from),
        "Sr25519",
        getFakeSignature,
      )
      const encoded = fromHex(await sign(fakeSigner, _options))
      const args = toHex(mergeUint8(encoded, u32.enc(encoded.length)))

      return firstValueFrom(
        chainHead
          .call$(null, "TransactionPaymentApi_query_info", args)
          .pipe(withLogs("queryInfo"), map(queryInfoDec)),
      )
    }

    return {
      getEstimatedFees,
      decodedCall: {
        type: pallet,
        value: Enum(name, arg as any),
      },
      getEncodedData,
      sign,
      signSubmitAndWatch,
      signAndSubmit,
    }
  }

  return Object.assign(fn, { isCompatible })
}
