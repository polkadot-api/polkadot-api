import {
  Binary,
  Enum,
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

type TxFunction = (from: SS58String) => Promise<TxSuccess>

type TxObservable = (
  from: SS58String,
) => Observable<
  | TxValidated
  | TxBroadcasted
  | TxBestChainBlockIncluded
  | (TxFinalized & TxSuccess)
>

type TxCall = () => Promise<Binary>

type TxSigned = (from: SS58String) => Promise<string>

export type Transaction<
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
> = {
  callData: Enum<{
    type: Pallet
    value: Enum<{
      type: Name
      value: Arg
    }>
  }>
  getEncodedData: TxCall
  getTx: TxSigned
  submit: TxFunction
  submit$: TxObservable
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
  <Arg extends {} | undefined, Pallet extends string, Name extends string>(
    descriptor: TxDescriptor<Arg>,
    pallet: Pallet,
    name: Name,
    chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
    client: ReturnType<typeof getObservableClient>,
    signer: (from: string, callData: Uint8Array) => Promise<Uint8Array>,
  ): ((arg: any) => Transaction<Arg, Pallet, Name>) =>
  (arg?: Arg): any => {
    const getCallData$ = (arg?: any) =>
      chainHead.getRuntimeContext$(null).pipe(
        map(({ checksumBuilder, dynamicBuilder }) => {
          const checksum = checksumBuilder.buildCall(pallet, name)
          if (checksum !== descriptor)
            throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`)

          const { location, args } = dynamicBuilder.buildCall(pallet, name)
          return Binary(mergeUint8(new Uint8Array(location), args.enc(arg)))
        }),
      )

    const getEncodedData: TxCall = () => firstValueFrom(getCallData$(arg))

    const getTx: TxSigned = (from) =>
      firstValueFrom(
        getCallData$(arg).pipe(
          mergeMap((callData) => signer(from, callData.asBytes())),
          map(toHex),
        ),
      )

    const submit: TxFunction = async (from) => {
      const tx = await firstValueFrom(
        getCallData$(arg).pipe(
          mergeMap((callData) => signer(from, callData.asBytes()).then(toHex)),
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

    const submit$: TxObservable = (from) =>
      getCallData$(arg).pipe(
        mergeMap((callData) => signer(from, callData.asBytes())),
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
