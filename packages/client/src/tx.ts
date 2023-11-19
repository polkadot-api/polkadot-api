import {
  DescriptorCommon,
  SS58String,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
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
import { RuntimeDescriptors } from "./codecs"
import { getObservableClient } from "./observableClient"
import { mergeUint8, toHex } from "@polkadot-api/utils"
import { Storage$ } from "./storage"
import {
  TxBestChainBlockIncluded,
  TxBroadcasted,
  TxFinalized,
  TxValidated,
} from "@polkadot-api/substrate-client"

type TxDescriptorArgs<T extends TxDescriptor<any, any>> =
  T extends TxDescriptor<any, infer Args> ? Args : unknown

type TxFunction<D extends TxDescriptor<any, any>> = (
  from: SS58String,
  ...args: TxDescriptorArgs<D>
) => Promise<
  | {
      ok: true
      events: Array<any>
    }
  | { ok: false; events: Array<any> }
>

type TxObservable<D extends TxDescriptor<any, any>> = (
  from: SS58String,
  ...args: TxDescriptorArgs<D>
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

type TxCall<D extends TxDescriptor<any, any>> = (
  ...args: TxDescriptorArgs<D>
) => Promise<string>

type TxSigned<D extends TxDescriptor<any, any>> = (
  from: SS58String,
  ...args: TxDescriptorArgs<D>
) => Promise<string>

export type TxClient<T extends TxDescriptor<any, any>> = {
  getCallData: TxCall<T>
  getTx: TxSigned<T>
  submit: TxFunction<T>
  submit$: TxObservable<T>
}

export const createTxEntry = <
  Descriptor extends TxDescriptor<DescriptorCommon<string, string>, any>,
>(
  descriptor: Descriptor,
  codecs$: Observable<RuntimeDescriptors | null>,
  client: ReturnType<typeof getObservableClient>,
  storage$: Storage$,
  signer: (from: string, callData: Uint8Array) => Promise<Uint8Array>,
): TxClient<Descriptor> => {
  const getCallDataAndEventDec$ = (
    ...decodedArgs: TxDescriptorArgs<Descriptor>
  ) =>
    codecs$.pipe(
      filter(Boolean),
      take(1),
      map((x) => {
        const { args, location } =
          x.tx[descriptor.props.pallet][descriptor.props.name].call

        return {
          callData: mergeUint8(new Uint8Array(location), args.enc(decodedArgs)),
          events: x.events,
        }
      }),
    )

  const getCallData: TxCall<Descriptor> = (...args) =>
    firstValueFrom(getCallDataAndEventDec$(...args)).then((x) =>
      toHex(x.callData),
    )

  const getTx: TxSigned<Descriptor> = (from, ...args) =>
    firstValueFrom(
      getCallDataAndEventDec$(...args).pipe(
        mergeMap(({ callData }) => signer(from, callData)),
        map(toHex),
      ),
    )

  const submit: TxFunction<Descriptor> = async (from, ...args) => {
    const [tx, { decoder, key }] = await firstValueFrom(
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

  const submit$: TxObservable<Descriptor> = (from, ...args) =>
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
