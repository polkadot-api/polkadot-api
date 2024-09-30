import type { Transaction, Binary } from "polkadot-api"
import { from, switchMap } from "rxjs"

export type AsyncTransaction<
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset,
> = Omit<
  Transaction<Arg, Pallet, Name, Asset>,
  "decodedCall" | "getEncodedData"
> & {
  decodedCall: Promise<Transaction<Arg, Pallet, Name, Asset>["decodedCall"]>
  getEncodedData: () => Promise<Binary>
}

export const wrapAsyncTx = <
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset,
>(
  fn: () => Promise<Transaction<Arg, Pallet, Name, Asset>>,
): AsyncTransaction<Arg, Pallet, Name, Asset> => {
  const promise = fn()
  return {
    sign: (...args) => promise.then((tx) => tx.sign(...args)),
    signSubmitAndWatch: (...args) =>
      from(promise).pipe(switchMap((tx) => tx.signSubmitAndWatch(...args))),
    signAndSubmit: (...args) => promise.then((tx) => tx.signAndSubmit(...args)),
    getEstimatedFees: (...args) =>
      promise.then((tx) => tx.getEstimatedFees(...args)),
    getPaymentInfo: (...args) =>
      promise.then((tx) => tx.getPaymentInfo(...args)),
    decodedCall: promise.then((tx) => tx.decodedCall),
    getEncodedData: () => promise.then((tx) => tx.getEncodedData()),
  }
}
