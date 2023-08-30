export interface DeferredPromise<T> {
  promise: Promise<T>
  res: (value: T) => void
  rej: (err: Error) => void
}

export function deferred<T>(): DeferredPromise<T> {
  let res: (value: T) => void = () => {}
  let rej: (err: Error) => void = () => {}

  const promise = new Promise<T>((_res, _rej) => {
    res = _res
    rej = _rej
  })

  return { promise, res, rej }
}
