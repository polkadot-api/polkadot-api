import type { Codec } from "solidity-codecs"
import type { SolidityEvent, SolidityFn } from "../descriptors"
import type { SolidityContractClient } from "./contract"
import { batcher, getTrackingId, logResponse, withOverload } from "../internal"

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
  scheduler: (onFlush: () => void) => () => void,
  client: SolidityContractClient<T> & { logger?: (meta: any) => void },
): SolidityContractClient<T> => {
  const batchedCall = client.call(batchFn as any)
  const batchedTx = client.tx(batchFn as any)
  const { logger } = client

  const call = withOverload(
    0,
    batcher(
      client.call,
      (args, fn) =>
        args.length > fn.encoder.size ? args[args.length - 1] : "latest",
      (calls, blockNumber) => {
        const trackingId = getTrackingId()
        const type = "batched_call"
        const meta: any = {
          type,
          trackingId,
          calls: [],
        }

        const data = calls.map(({ args, fn }) => {
          const actualArgs =
            args.length > fn.encoder.size ? args.slice(0, -1) : args
          if (logger) {
            meta.calls.push({
              fn: fn.name,
              args: actualArgs,
            })
          }
          return fn.encoder(...actualArgs)
        })

        const actualBlock: any = Number.isNaN(parseInt(blockNumber))
          ? blockNumber
          : parseInt(blockNumber)

        logger?.(meta)
        batchedCall(data, actualBlock).then(
          (responses: any) => {
            const metaReponse = logger
              ? {
                  ...meta,
                  calls: meta.calls.map((x: any) => ({ ...x })),
                  type: meta.type + "_responses",
                }
              : {}
            calls.forEach(({ res, fn }, idx) => {
              const response = fn.decoder(responses[idx])
              res(response)
              if (logger)
                Object.assign(metaReponse.calls[idx], {
                  success: true,
                  response,
                })
            })
            logger?.(metaReponse)
          },
          (error) => {
            calls.forEach(({ rej }) => {
              rej(error)
            })
            logger?.({
              type: meta.type + "_error",
              trackingId: meta.trackingId,
              error,
            })
          },
        )
      },
      scheduler,
    ),
  )

  const tx = withOverload(
    1,
    batcher(
      client.tx,
      (args) => args[0],
      (calls, from) => {
        const trackingId = getTrackingId()
        const type = "batched_tx"
        const meta: any = {
          type,
          trackingId,
          calls: [],
        }
        let value = 0n
        const data = calls.map(({ args, fn }) => {
          const slicedArgs = args.slice(1)
          const [actualArgs, val] =
            slicedArgs.length > fn.encoder.size
              ? [slicedArgs.slice(0, -1), slicedArgs.slice(-1)[0]]
              : [slicedArgs]
          value += val ?? 0n
          if (logger)
            meta.calls.push({
              fn: fn.name,
              args: actualArgs,
            })
          return fn.encoder(...actualArgs)
        })

        logger?.(meta)
        batchedTx(from, data, value)
          .then(...logResponse(meta, logger))
          .then(
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
      scheduler,
    ),
  )

  return { ...client, call, tx }
}
