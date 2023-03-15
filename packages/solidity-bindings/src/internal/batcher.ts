import { SolidityFn, SolidityError, createErrorReader } from "../descriptors"

interface BatchedCall {
  fn: SolidityFn<any, any, any, any>
  errorReader?: (possibleError: string) => null | { name: string; data: any }
  args: any[]
  res: (a: any) => void
  rej: (a: any) => void
}

export const batcher = (
  base: (
    fn: SolidityFn<any, any, any, any>,
    ...errors: Array<SolidityError<any, any>>
  ) => (...args: any) => Promise<any>,
  getGroupKey: (args: any[], fn: SolidityFn<any, any, any, any>) => string,
  handler: (calls: Array<BatchedCall>, key: string) => void,
  scheduler: (onFlush: () => void) => () => void,
) => {
  let batched = new Map<string, [() => void, Array<BatchedCall>]>()

  return (
    fn: SolidityFn<any, any, any, any>,
    ...errors: Array<SolidityError<any, any>>
  ) => {
    const errorReader =
      errors.length > 0 ? createErrorReader(errors) : undefined
    const baseFn = base(fn, ...errors)

    return (...args: any[]): Promise<any> => {
      const key = getGroupKey(args, fn)
      if (!batched.has(key)) {
        batched.set(key, [
          scheduler(() => {
            const [, calls] = batched.get(key)!
            batched.delete(key)
            if (calls.length > 1) {
              handler(calls, key)
            } else {
              const [{ args, res, rej }] = calls
              baseFn(...args).then(res, rej)
            }
          }),
          [],
        ])
      }

      const [onData, calls] = batched.get(key)!

      const result = new Promise((res, rej) => {
        calls.push({
          fn,
          errorReader,
          args,
          res,
          rej,
        })
      })

      onData()
      return result
    }
  }
}
