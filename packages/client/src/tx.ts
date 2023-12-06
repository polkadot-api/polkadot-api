import type { SS58String, TxDescriptor } from "@polkadot-api/substrate-bindings"
import type { Storage$ } from "./storage"
import type {
  TxBestChainBlockIncluded,
  TxBroadcasted,
  TxFinalized,
  TxValidated,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
} from "rxjs"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import { getObservableClient } from "./observableClient"
import { RuntimeContext } from "./observableClient/chainHead/chainHead"

type SystemEvent = {
  phase:
    | { tag: "ApplyExtrinsic"; value: number }
    | { tag: "Finalization" }
    | { tag: "Initialization" }
  event: {
    tag: string
    value: {
      tag: string
      value: any
    }
  }
  topics: Array<any>
}

type TxSuccess = {
  ok: boolean
  events: Array<SystemEvent["event"]>
}

type TxFunction<Args extends Array<any>> = (
  from: SS58String,
  ...args: Args
) => Promise<TxSuccess>

type TxObservable<Args extends Array<any>> = (
  from: SS58String,
  ...args: Args
) => Observable<
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | (TxFinalized & TxSuccess)
>

type TxCall<Args extends Array<any>> = (...args: Args) => Promise<string>

type TxSigned<Args extends Array<any>> = (
  from: SS58String,
  ...args: Args
) => Promise<string>

export type TxClient<Args extends Array<any>> = {
  getCallData: TxCall<Args>
  getTx: TxSigned<Args>
  submit: TxFunction<Args>
  submit$: TxObservable<Args>
}

const getTxSuccessFromSystemEvents = (
  systemEvents: Array<SystemEvent>,
  txIdx: number,
): TxSuccess => {
  const events = systemEvents
    .filter((x) => x.phase.tag === "ApplyExtrinsic" && x.phase.value === txIdx)
    .map((x) => x.event)

  const lastEvent = events[events.length - 1]
  const ok =
    lastEvent.tag === "System" && lastEvent.value.tag === "ExtrinsicSuccess"

  return { ok, events }
}

export const createTxEntry = <Args extends Array<any>>(
  descriptor: TxDescriptor<Args>,
  pallet: string,
  name: string,
  getRuntimeContext$: (blockHash: string | null) => Observable<RuntimeContext>,
  client: ReturnType<typeof getObservableClient>,
  storage$: Storage$,
  signer: (from: string, callData: Uint8Array) => Promise<Uint8Array>,
): TxClient<Args> => {
  const getCallDataAndEventDec$ = (...decodedArgs: Args) =>
    getRuntimeContext$(null).pipe(
      map(({ events, checksumBuilder, dynamicBuilder }) => {
        const checksum = checksumBuilder.buildCall(pallet, name)
        const { location, args } = dynamicBuilder.buildCall(pallet, name)
        if (checksum !== descriptor)
          throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

        return {
          callData: mergeUint8(new Uint8Array(location), args.enc(decodedArgs)),
          events,
        }
      }),
    )

  const getCallData: TxCall<Args> = (...args) =>
    firstValueFrom(getCallDataAndEventDec$(...args)).then((x) =>
      toHex(x.callData),
    )

  const getTx: TxSigned<Args> = (from, ...args) =>
    firstValueFrom(
      getCallDataAndEventDec$(...args).pipe(
        mergeMap(({ callData }) => signer(from, callData)),
        map(toHex),
      ),
    )

  const submit: TxFunction<Args> = async (from, ...args) => {
    const [tx, { key, dec }] = await firstValueFrom(
      getCallDataAndEventDec$(...args).pipe(
        mergeMap(({ callData, events }) =>
          signer(from, callData).then((result) => ({
            result,
            events,
          })),
        ),
        map((x) => [toHex(x.result), x.events] as const),
      ),
    )

    const result = await lastValueFrom(client.tx$(tx))

    switch (result.type) {
      case "invalid":
        throw new Error("Invalid")
      case "dropped":
        throw new Error("Dropped")
      case "finalized": {
        const systemEvents = await firstValueFrom(
          storage$(result.block.hash, "value", key, null).pipe(
            map((x) => dec(x!)),
          ),
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

  const submit$: TxObservable<Args> = (from, ...args) =>
    getCallDataAndEventDec$(...args).pipe(
      mergeMap(({ callData, events }) =>
        signer(from, callData).then((result) => ({
          result,
          events,
        })),
      ),
      take(1),
      mergeMap(({ result, events: { key, dec } }) => {
        return client.tx$(toHex(result)).pipe(
          mergeMap((result) => {
            switch (result.type) {
              case "invalid":
                throw new Error("Invalid")
              case "dropped":
                throw new Error("Dropped")
              case "finalized": {
                return storage$(result.block.hash, "value", key, null).pipe(
                  map((x) => dec(x!)),
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

  return { getCallData, getTx, submit, submit$ }
}
