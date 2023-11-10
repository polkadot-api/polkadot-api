import { Subject, Subscription } from "rxjs"

const ESCSubject = new Subject<void>()

process.stdin.on("keypress", function (_, key) {
  if (key && key.name === "escape") {
    ESCSubject.next()
  }
})

export const runWithEscapeKeyHandler = async (
  f: (
    subscriptions: Subscription[],
    subscribe: (g: () => void) => Subscription,
  ) => Promise<void>,
) => {
  const subscriptions: Subscription[] = []
  try {
    await f(subscriptions, (g) => ESCSubject.subscribe(g))
  } finally {
    subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
