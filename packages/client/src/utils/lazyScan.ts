import { Observable, defer, scan } from "rxjs"

export const lazyScan =
  <Acc, Item>(reducer: (acc: Acc, value: Item) => Acc, getInit: () => Acc) =>
  (base: Observable<Item>): Observable<Acc> =>
    defer(() => base.pipe(scan(reducer, getInit())))
