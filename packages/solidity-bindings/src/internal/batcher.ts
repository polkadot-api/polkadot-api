import { SolidityFn } from "../descriptors/fn"

interface BatchedCall {
  fn: SolidityFn<any, any, any, any>
  args: any[]
  res: (a: any) => void
  rej: (a: any) => void
}

export const batcher = (
  base: (fn: SolidityFn<any, any, any, any>) => (...args: any) => Promise<any>,
  getGroupKey: (args: any[], fn: SolidityFn<any, any, any, any>) => string,
  handler: (calls: Array<BatchedCall>, key: string) => void,
  scheduler: (onFlush: () => void) => () => void,
) => {
  let batched = new Map<string, [() => void, Array<BatchedCall>]>()

  return (fn: SolidityFn<any, any, any, any>) =>
    (...args: any[]): Promise<any> => {
      const key = getGroupKey(args, fn)
      if (!batched.has(key)) {
        batched.set(key, [
          scheduler(() => {
            const [, calls] = batched.get(key)!
            batched.delete(key)
            if (calls.length > 1) {
              handler(calls, key)
            } else {
              const [{ fn, args, res, rej }] = calls
              base(fn)(...args).then(res, rej)
            }
          }),
          [],
        ])
      }

      const [onData, calls] = batched.get(key)!
      const result = new Promise((res, rej) => {
        calls.push({
          fn,
          args,
          res,
          rej,
        })
      })
      onData()
      return result
    }
}
