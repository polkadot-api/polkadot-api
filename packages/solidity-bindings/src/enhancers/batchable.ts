import type { Codec } from "solidity-codecs"
import type { SolidityEvent, SolidityFn } from "../descriptors"
import type { SolidityContractClient } from "./contract"
import { batcher, withOverload } from "../internal"

export const batchable = <
  T extends {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  } = {
    functions:
      | SolidityFn<any, any, any, any>
      | Array<SolidityFn<any, any, any, any>>
    events: SolidityEvent<any, any, any>
  },
>(
  batchFn: SolidityFn<any, [Codec<Uint8Array[]>], Uint8Array[], 2 | 3>,
  client: SolidityContractClient<T>,
): SolidityContractClient<T> => {
  const batchedCall = client.call(batchFn as any)
  const batchedTx = client.tx(batchFn as any)

  const call = withOverload(
    0,
    batcher(
      client.call,
      (args, fn) =>
        args.length > fn.encoder.size ? args[args.length - 1] : "latest",
      (calls, blockNumber) => {
        const data = calls.map(({ args, fn }) => {
          const actualArgs =
            args.length > fn.encoder.size ? args.slice(0, -1) : args
          return fn.encoder(...actualArgs)
        })

        const actualBlock: any = Number.isNaN(parseInt(blockNumber))
          ? blockNumber
          : parseInt(blockNumber)

        batchedCall(data, actualBlock).then(
          (responses: any) => {
            calls.forEach(({ res, fn }, idx) => {
              res(fn.decoder(responses[idx]))
            })
          },
          (e) => {
            calls.forEach(({ rej }) => {
              rej(e)
            })
          },
        )
      },
    ),
  )

  const tx = withOverload(
    1,
    batcher(
      client.tx,
      (args) => args[0],
      (calls, from) => {
        const data = calls.map(({ args, fn }) => {
          const actualArgs = args.slice(1)
          return fn.encoder(...actualArgs)
        })

        batchedTx(from, data).then(
          (response) => {
            calls.forEach(({ res }) => {
              res(response)
            })
          },
          (e) => {
            calls.forEach(({ rej }) => {
              rej(e)
            })
          },
        )
      },
    ),
  )

  return { ...client, call, tx }
}
