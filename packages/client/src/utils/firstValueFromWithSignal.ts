import { AbortError } from "@polkadot-api/utils"
import { Observable, Subscription, noop } from "rxjs"

export function firstValueFromWithSignal<T>(
  source: Observable<T>,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let subscription: Subscription | null = null
    let isDone = false

    const onAbort = signal
      ? () => {
          subscription?.unsubscribe()
          reject(new AbortError())
        }
      : noop

    subscription = source.subscribe({
      next: (value) => {
        resolve(value)
        subscription?.unsubscribe()
        isDone = true
      },
      error: (e) => {
        signal?.removeEventListener("abort", onAbort)
        reject(e)
        isDone = true
      },
      complete: () => {
        signal?.removeEventListener("abort", onAbort)
        reject(new Error("Observable completed without emitting"))
        isDone = true
      },
    })

    // the observable could have emitted synchronously
    if (!isDone) signal?.addEventListener("abort", onAbort)
  })
}
