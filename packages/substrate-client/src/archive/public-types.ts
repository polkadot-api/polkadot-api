import type { UnsubscribeFn } from "../common-types"

export type Transaction = (
  tx: string,
  error: (e: Error) => void,
) => UnsubscribeFn
