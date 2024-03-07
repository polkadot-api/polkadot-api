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

        // if the Observable emits synchronously, then `subscription`
        // won't exist yet.
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

    // in case that the observable emitted synchronously
    if (subscription) {
      unsubscribe()
    } else {
      signal?.addEventListener("abort", onAbort)
    }
  })
}
