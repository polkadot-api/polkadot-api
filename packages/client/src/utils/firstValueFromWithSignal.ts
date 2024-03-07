import { Observable, Subscription, noop } from "rxjs"

export function firstValueFromWithSignal<T>(
  source: Observable<T>,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let subscription: Subscription | null = null
    const unsubscribe = () => {
      subscription?.unsubscribe()
      subscription = null
    }
    const onAbort = signal ? unsubscribe : noop

    subscription = source.subscribe({
      next: (value) => {
        resolve(value)
        unsubscribe()
      },
      error: (e) => {
        reject(e)
        signal?.removeEventListener("abort", onAbort)
      },
      complete: () => {
        reject(new Error("Observable completed without emitting"))
        signal?.removeEventListener("abort", onAbort)
      },
    })

    // the observable could have emitted synchronously
    if (subscription) signal?.addEventListener("abort", onAbort)
  })
}
