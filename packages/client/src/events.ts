import {
  DescriptorCommon,
  PlainDescriptor,
} from "@polkadot-api/substrate-bindings"
import {
  Observable,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  take,
  withLatestFrom,
} from "rxjs"
import { RuntimeDescriptors } from "./codecs"
import { Storage$ } from "./storage"

export type EventToObject<
  E extends PlainDescriptor<DescriptorCommon<any, string>, any>,
> = E extends PlainDescriptor<DescriptorCommon<any, infer K>, infer V>
  ? { type: K; value: V }
  : unknown

export type UnionizeTupleEvents<E extends Array<PlainDescriptor<any, any>>> =
  E extends Array<infer Ev>
    ? Ev extends PlainDescriptor<any, any>
      ? EventToObject<Ev>
      : unknown
    : unknown

type EventData<T extends PlainDescriptor<any, any>> = T extends PlainDescriptor<
  any,
  infer V
>
  ? V
  : unknown

type EvWatch<D extends PlainDescriptor<any, any>> = (
  filter?: (value: EventData<D>) => boolean,
) => Observable<{
  meta: {
    blockHash: string
    txIdx: number
  }
  payload: EventData<D>
}>

type EvPull<D extends PlainDescriptor<any, any>> = () => Promise<
  Array<{
    meta: {
      blockHash: string
      txIdx: number
    }
    payload: EventData<D>
  }>
>

export type EvClient<T extends PlainDescriptor<any, any>> = {
  watch: EvWatch<T>
  pull: EvPull<T>
}

export const createEventEntry = <
  Descriptor extends PlainDescriptor<DescriptorCommon<string, string>, any>,
>(
  descriptor: Descriptor,
  codecs$: Observable<RuntimeDescriptors | null>,
  finalized: Observable<string>,
  storage$: Storage$,
): EvClient<Descriptor> => {
  const watch: EvWatch<Descriptor> = (f) =>
    finalized.pipe(
      withLatestFrom(codecs$),
      mergeMap(([block, codecs]) => {
        if (!codecs) return []

        return storage$(block, "value", codecs.events.key, null).pipe(
          mergeMap((x) => {
            const events = codecs.events.decoder(x!)
            const winners = events.filter(
              (e) =>
                e.phase.tag === "ApplyExtrinsic" &&
                e.event.tag === descriptor.props.pallet &&
                e.event.value.tag === descriptor.props.name &&
                (!f || f(e.event.value.value)),
            )
            return winners.map((x) => {
              const txIdx = (x.phase as unknown as { value: number }).value

              return {
                meta: {
                  txIdx,
                  blockHash: block,
                },
                payload: x.event.value.value,
              }
            })
          }),
        )
      }),
    )

  const pull: EvPull<Descriptor> = () =>
    firstValueFrom(
      finalized.pipe(
        mergeMap((block) => {
          return codecs$.pipe(
            filter(Boolean),
            take(1),
            mergeMap((codecs) => {
              return storage$(block, "value", codecs.events.key, null).pipe(
                map((x) => {
                  const events = codecs.events.decoder(x!)
                  const winners = events.filter(
                    (e) =>
                      e.phase.tag === "ApplyExtrinsic" &&
                      e.event.tag === descriptor.props.pallet &&
                      e.event.value.tag === descriptor.props.name,
                  )
                  return winners.map((x) => {
                    const txIdx = (x.phase as unknown as { value: number })
                      .value

                    return {
                      meta: {
                        txIdx,
                        blockHash: block,
                      },
                      payload: x.event.value.value,
                    }
                  })
                }),
              )
            }),
          )
        }),
      ),
    )

  return { watch, pull }
}
