export type UnsubscribeFn = () => void

type WithAbortSignal<T extends Array<any>> = [
  ...args: T,
  abortSignal?: AbortSignal,
]
export type AbortablePromiseFn<A extends Array<any>, T> = (
  ...args: WithAbortSignal<A>
) => Promise<T>
