import type { SolidityClient } from "../client"
import { Vector, address, bytes, Struct, uint } from "solidity-codecs"
import { solidityFn } from "../descriptors"
import { batcher, withOverload } from "../internal"

const calls = Vector(Struct({ target: address, callData: bytes }))
const aggregate = solidityFn(
  "aggregate",
  [calls] as [calls: typeof calls],
  Struct({ blockNumber: uint, returnData: Vector(bytes) }),
  2,
)

export const withMulticall = (
  multicallAddress: () => string,
  client: SolidityClient,
): SolidityClient => {
  const batchedCall = client.call(aggregate)
  const batchedTx = client.tx(aggregate)

  const call = withOverload(
    1,
    batcher(
      client.call,
      (args, fn) =>
        args.length - 1 > fn.encoder.size ? args[args.length - 1] : "latest",
      (calls, blockNumber) => {
        const data = calls.map(({ args, fn }) => {
          const [target, ...otherArgs] = args
          const actualArgs =
            otherArgs.length > fn.encoder.size
              ? otherArgs.slice(0, -1)
              : otherArgs
          return { target, callData: fn.encoder(...actualArgs) }
        })

        const actualBlock: any = Number.isNaN(parseInt(blockNumber))
          ? blockNumber
          : parseInt(blockNumber)

        batchedCall(multicallAddress(), data, actualBlock).then(
          ({ returnData }) => {
            calls.forEach(({ res, fn }, idx) => {
              res(fn.decoder(returnData[idx]))
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
  ) as SolidityClient["call"]

  const tx = withOverload(
    2,
    batcher(
      client.tx,
      (args) => args[1],
      (calls, from) => {
        const data = calls.map(({ args, fn }) => {
          const [target, , ...otherArgs] = args
          const actualArgs =
            otherArgs.length > fn.encoder.size
              ? otherArgs.slice(0, -1)
              : otherArgs
          return { target, callData: fn.encoder(...actualArgs) }
        })

        batchedTx(multicallAddress(), from, data).then(
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
  ) as SolidityClient["tx"]

  return { ...client, call, tx }
}
