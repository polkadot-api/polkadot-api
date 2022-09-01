import type { EventFilter, SolidityEvent, SolidityFn } from "../descriptors"
import type { Observable } from "rxjs"
import type { SolidityClient } from "../client"
import type {
  UnionToIntersection,
  Untuple,
  InnerCodecsOrBlock,
  InnerCodecs,
} from "../utils"
import { withOverload } from "../internal"

type OnlyMutable<T> = T extends SolidityFn<any, any, any, 2 | 3> ? T : never
type Overloaded<T> = Exclude<T, SolidityFn<any, any, any, any>>
type NonOverloaded<T> = Exclude<T, Array<any>>
type MutableNonOverloaded<T> = OnlyMutable<Exclude<T, Array<any>>>

type SolidityCallFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<any, infer V, infer O, any>
        ? (overload: K, ...args: InnerCodecsOrBlock<V>) => Promise<Untuple<O>>
        : never
    }[keyof A & number]
  >

type SolidityTxFunctions<A extends Array<SolidityFn<any, any, any, any>>> =
  UnionToIntersection<
    {
      [K in keyof A]: A[K] extends SolidityFn<
        any,
        infer V,
        any,
        infer Mutability
      >
        ? Mutability extends 2 | 3
          ? (
              fromAddress: string,
              overload: K,
              ...args: InnerCodecs<V>
            ) => Promise<string>
          : never
        : never
    }[keyof A & number]
  >

type SolidityTxFunction<F extends SolidityFn<any, any, any, 2 | 3>> =
  F extends SolidityFn<any, infer V, any, 2 | 3>
    ? (fromAddress: string, ...args: InnerCodecs<V>) => Promise<string>
    : never

type SolidityEventFn<E extends SolidityEvent<any, any, any>> =
  E extends SolidityEvent<infer F, infer O, any>
    ? (eventFilter: Partial<EventFilter<F>>) => Observable<{
        data: Untuple<O>
        filters: EventFilter<F>
        message: any
      }>
    : never

type SolidityCallFunction<F> = F extends SolidityFn<any, infer I, infer O, any>
  ? (...args: InnerCodecsOrBlock<I>) => Promise<Untuple<O>>
  : never

export type SolidityContractClient<
  CTX extends {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  } = {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  },
> = {
  event: <E extends CTX["events"]>(e: E) => SolidityEventFn<E>
  call: (<F extends NonOverloaded<CTX["functions"]>>(
    fn: F,
  ) => SolidityCallFunction<F>) &
    (<F extends Overloaded<CTX["functions"]>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>)
  tx: (<F extends MutableNonOverloaded<CTX["functions"]>>(
    fn: F,
  ) => SolidityTxFunction<F>) &
    (<F extends Overloaded<CTX["functions"]>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>)
}

export const withContract = <
  CTX extends {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  } = {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  },
>(
  getContractAddress: () => string,
  client: Pick<SolidityClient, "call" | "event" | "tx">,
): SolidityContractClient<CTX> => {
  const event = <E extends CTX["events"]>(e: E): SolidityEventFn<E> => {
    const ctx = client.event(e)
    return ((eventFilter: any) => ctx(eventFilter, getContractAddress())) as any
  }

  const call: (<F extends NonOverloaded<CTX["functions"]>>(
    fn: F,
  ) => SolidityCallFunction<F>) &
    (<F extends Overloaded<CTX["functions"]>>(
      overloaded: F,
    ) => SolidityCallFunctions<F>) = withOverload(0, (fn: any) => {
    const providerCall = client.call(fn)
    return (...args: any) => providerCall(getContractAddress(), ...args)
  })

  const tx: (<F extends MutableNonOverloaded<CTX["functions"]>>(
    fn: F,
  ) => SolidityTxFunction<F>) &
    (<F extends Overloaded<CTX["functions"]>>(
      overloaded: F,
    ) => SolidityTxFunctions<F>) = withOverload(1, (fn: any) => {
    const providerTx = client.tx(fn)
    return (fromAddress: string, ...args: any) =>
      providerTx(getContractAddress(), fromAddress, ...args)
  })

  return { event, call, tx }
}
