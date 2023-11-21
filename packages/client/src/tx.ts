import type {
  Decoder,
  SS58String,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
import type { Storage$ } from "./storage"
import type {
  TxBestChainBlockIncluded,
  TxBroadcasted,
  TxFinalized,
  TxValidated,
} from "@polkadot-api/substrate-client"
import type { Codecs$ } from "./codecs"
import {
  Observable,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  mergeMap,
  of,
  take,
} from "rxjs"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import { getObservableClient } from "./observableClient"

type TxFunction<Args extends Array<any>> = (
  from: SS58String,
  ...args: Args
) => Promise<
  | {
      ok: true
      events: Array<any>
    }
  | { ok: false; events: Array<any> }
>

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

type TxObservable<Args extends Array<any>> = (
  from: SS58String,
  ...args: Args
) => Observable<
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | (TxFinalized &
      (
        | {
            ok: true
            events: Array<any>
          }
        | { ok: false; events: Array<any> }
      ))
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

export const createTxEntry = <Args extends Array<any>>(
  descriptor: TxDescriptor<Args>,
  pallet: string,
  name: string,
  codecs$: Codecs$,
  client: ReturnType<typeof getObservableClient>,
  storage$: Storage$,
  signer: (from: string, callData: Uint8Array) => Promise<Uint8Array>,
): TxClient<Args> => {
  const getCallDataAndEventDec$ = (...decodedArgs: Args) =>
    codecs$.pipe(
      filter(Boolean),
      take(1),
      map((getCodecs) => {
        const [checksum, { location, args }] = getCodecs("tx", pallet, name)
        if (checksum !== descriptor)
          throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

        const [, evCodecs] = getCodecs("stg", "System", "Events")
        return {
          callData: mergeUint8(new Uint8Array(location), args.enc(decodedArgs)),
          events: {
            key: evCodecs.enc(),
            decoder: evCodecs.dec as Decoder<Array<SystemEvent>>,
          },
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
    const [tx, { key, decoder }] = await firstValueFrom(
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
        const events = await firstValueFrom(
          storage$(result.block.hash, "value", key, null).pipe(
            map((x) => decoder(x!)),
          ),
        )
        return {
          ok: true,
          events: events
            .filter(
              (x) =>
                x.phase.tag === "ApplyExtrinsic" &&
                x.phase.value === Number(result.block.index),
            )
            .map((x) => x.event) as any[],
        }
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
      mergeMap(({ result, events: { key, decoder } }) => {
        return client.tx$(toHex(result)).pipe(
          mergeMap((result) => {
            switch (result.type) {
              case "invalid":
                throw new Error("Invalid")
              case "dropped":
                throw new Error("Dropped")
              case "finalized": {
                return storage$(result.block.hash, "value", key, null).pipe(
                  map((x) => decoder(x!)),
                  map((events) => ({
                    ...result,
                    ok: true as true,
                    events: events
                      .filter(
                        (x) =>
                          x.phase.tag === "ApplyExtrinsic" &&
                          x.phase.value === Number(result.block.index),
                      )
                      .map((x) => x.event) as any[],
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
