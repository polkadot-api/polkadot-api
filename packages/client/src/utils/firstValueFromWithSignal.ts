import { Observable, noop } from "rxjs"

export function firstValueFromWithSignal<T>(
  source: Observable<T>,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = signal
      ? () => {
          subscription.unsubscribe()
        }
      : noop

    let isDone = false
    const subscription = source.subscribe({
      next: (value) => {
        resolve(value)

        // if the Observable emits synchronously, then `subscription`
        // won't exist yet.
        isDone = true
        subscription?.unsubscribe()
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
    if (isDone) {
      subscription.unsubscribe()
    } else {
      signal?.addEventListener("abort", onAbort)
    }
  })
}
