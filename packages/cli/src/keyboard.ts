import { Subject } from "rxjs"

export const ESCSubject = new Subject<void>()

process.stdin.on("keypress", function (_, key) {
  if (key && key.name === "escape") {
    ESCSubject.next()
  }
})
