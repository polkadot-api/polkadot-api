import type {
  EventFilter,
  SolidityEvent,
  SolidityFn,
  SolidityError,
  ErrorResult,
} from "../descriptors"
import type { Observable } from "rxjs"
import type { SolidityPullClient } from "../client"
import type {
  UnionToIntersection,
  Untuple,
  InnerCodecsOrBlock,
  InnerCodecs,
  InnerCodecsOrPayableAmount,
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

type SolidityTxFunctions<
  A extends Array<SolidityFn<any, any, any, any>>,
  E extends Array<SolidityError<any, any>>,
> = UnionToIntersection<
  {
    [K in keyof A]: A[K] extends SolidityFn<any, infer V, any, infer Mutability>
      ? Mutability extends 2
        ? (
            fromAddress: string,
            overload: K,
            ...args: InnerCodecs<V>
          ) => Promise<ErrorResult<E, string>>
        : Mutability extends 3
        ? (
            fromAddress: string,
            overload: K,
            ...args: InnerCodecsOrPayableAmount<V>
          ) => Promise<ErrorResult<E, string>>
        : never
      : never
  }[keyof A & number]
>

type SolidityTxFunction<
  F extends SolidityFn<any, any, any, 2 | 3>,
  E extends Array<SolidityError<any, any>>,
> = F extends SolidityFn<any, infer V, any, infer M>
  ? M extends 2
    ? (
        fromAddress: string,
        ...args: InnerCodecs<V>
      ) => Promise<ErrorResult<E, string>>
    : M extends 3
    ? (
        fromAddress: string,
        ...args: InnerCodecsOrPayableAmount<V>
      ) => Promise<ErrorResult<E, string>>
    : never
  : never

type SolidityEventFn<E extends SolidityEvent<any, any, any>> =
  E extends SolidityEvent<infer F, infer O, any>
    ? (
        eventFilter: Partial<EventFilter<F>>,
        startAtBlock?: number,
      ) => Observable<{
        data: Untuple<O>
        filters: EventFilter<F>
        message: any
      }>
    : never

type SolidityQueryEventFn<E extends SolidityEvent<any, any, any>> =
  E extends SolidityEvent<infer F, infer O, any>
    ? (
        eventFilter: Partial<EventFilter<F>>,
        from: number | "latest" | "pending" | "earliest",
        to: number | "latest" | "pending" | "earliest",
      ) => Array<{
        data: Untuple<O>
        filters: EventFilter<F>
        message: any
      }>
    : never

type SolidityCallFunction<
  F,
  E extends Array<SolidityError<any, any>>,
> = F extends SolidityFn<any, infer I, infer O, any>
  ? (...args: InnerCodecsOrBlock<I>) => Promise<ErrorResult<E, Untuple<O>>>
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
  queryEvent: <E extends CTX["events"]>(e: E) => SolidityQueryEventFn<E>
  event: <E extends CTX["events"]>(e: E) => SolidityEventFn<E>
  call: (<
    F extends NonOverloaded<CTX["functions"]>,
    E extends Array<SolidityError<any, any>>,
  >(
    fn: F,
    ...errors: E
  ) => SolidityCallFunction<F, E>) &
    (<
      F extends Overloaded<CTX["functions"]>,
      E extends Array<SolidityError<any, any>>,
    >(
      overloaded: F,
      ...errors: E
    ) => SolidityCallFunctions<F>)
  tx: (<
    F extends MutableNonOverloaded<CTX["functions"]>,
    E extends Array<SolidityError<any, any>>,
  >(
    fn: F,
    ...errors: E
  ) => SolidityTxFunction<F, E>) &
    (<
      F extends Overloaded<CTX["functions"]>,
      E extends Array<SolidityError<any, any>>,
    >(
      overloaded: F,
      ...errors: E
    ) => SolidityTxFunctions<F, E>)
  getError: SolidityPullClient["getError"]
  logger?: (meta: any) => void
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
  client: Pick<
    SolidityPullClient,
    "call" | "event" | "tx" | "queryEvent" | "getError"
  > & {
    logger?: (meta: any) => void
  },
): SolidityContractClient<CTX> => {
  const event = <E extends CTX["events"]>(e: E): SolidityEventFn<E> => {
    const ctx = client.event(e)
    return ((eventFilter: any, ...other: Array<any>) =>
      ctx(eventFilter, getContractAddress(), ...other)) as any
  }

  const queryEvent = <E extends CTX["events"]>(
    e: E,
  ): SolidityQueryEventFn<E> => {
    const ctx = client.queryEvent(e)
    return ((eventFilter: any, from: any, to: any) =>
      ctx(eventFilter, from, to, getContractAddress())) as any
  }

  const call: (<
    F extends NonOverloaded<CTX["functions"]>,
    E extends Array<SolidityError<any, any>>,
  >(
    fn: F,
    ...errors: E
  ) => SolidityCallFunction<F, E>) &
    (<
      F extends Overloaded<CTX["functions"]>,
      E extends Array<SolidityError<any, any>>,
    >(
      overloaded: F,
      ...errors: E
    ) => SolidityCallFunctions<F>) = withOverload(
    0,
    (fn: any, ...errors: any[]) => {
      const providerCall = client.call(fn, ...errors)
      return (...args: any) => providerCall(getContractAddress(), ...args)
    },
  )

  const tx: (<
    F extends MutableNonOverloaded<CTX["functions"]>,
    E extends Array<SolidityError<any, any>>,
  >(
    fn: F,
    ...errors: E
  ) => SolidityTxFunction<F, E>) &
    (<
      F extends Overloaded<CTX["functions"]>,
      E extends Array<SolidityError<any, any>>,
    >(
      overloaded: F,
      ...errors: E
    ) => SolidityTxFunctions<F, E>) = withOverload(
    1,
    (fn: any, ...errors: any[]) => {
      const providerTx = client.tx(fn, ...errors)
      return (fromAddress: string, ...args: any) =>
        providerTx(getContractAddress(), fromAddress, ...args)
    },
  )

  return {
    event,
    queryEvent,
    call,
    tx,
    logger: client.logger,
    getError: client.getError,
  }
}
