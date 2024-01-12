import type { SS58String, TxDescriptor } from "@polkadot-api/substrate-bindings"
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
import { getObservableClient, SystemEvent } from "./observableClient"

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
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  client: ReturnType<typeof getObservableClient>,
  signer: (from: string, callData: Uint8Array) => Promise<Uint8Array>,
): TxClient<Args> => {
  const getCallData$ = (...decodedArgs: Args) =>
    chainHead.getRuntimeContext$(null).pipe(
      map(({ checksumBuilder, dynamicBuilder }) => {
        const checksum = checksumBuilder.buildCall(pallet, name)
        if (checksum !== descriptor)
          throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

        const { location, args } = dynamicBuilder.buildCall(pallet, name)
        return mergeUint8(new Uint8Array(location), args.enc(decodedArgs))
      }),
    )

  const getCallData: TxCall<Args> = (...args) =>
    firstValueFrom(getCallData$(...args)).then(toHex)

  const getTx: TxSigned<Args> = (from, ...args) =>
    firstValueFrom(
      getCallData$(...args).pipe(
        mergeMap((callData) => signer(from, callData)),
        map(toHex),
      ),
    )

  const submit: TxFunction<Args> = async (from, ...args) => {
    const tx = await firstValueFrom(
      getCallData$(...args).pipe(
        mergeMap((callData) => signer(from, callData).then(toHex)),
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

  const submit$: TxObservable<Args> = (from, ...args) =>
    getCallData$(...args).pipe(
      mergeMap((callData) => signer(from, callData)),
      take(1),
      mergeMap((result) => {
        return client.tx$(toHex(result)).pipe(
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

  return { getCallData, getTx, submit, submit$ }
}
