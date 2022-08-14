import type { SolidityClient } from "../client"
import { Vector, address, bytes, Struct, bool } from "solidity-codecs"
import { solidityFn } from "../descriptors"
import { batcher, withOverload } from "../internal"

const calls = Vector(Struct({ target: address, callData: bytes }))
const aggregate = solidityFn(
  "tryAggregate",
  [bool, calls] as [requireSuccess: typeof bool, calls: typeof calls],
  Vector(Struct({ success: bool, returnData: Vector(bytes) })),
  2,
)

export const withMulticall = (
  multicallAddress: () => string,
  client: SolidityClient,
): SolidityClient => {
  const batchedCall = client.call(aggregate)

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

        batchedCall(multicallAddress(), false, data, actualBlock).then(
          (result) => {
            calls.forEach(({ res, rej, fn }, idx) => {
              const { success, returnData } = result[idx]
              if (success) res(fn.decoder(returnData[idx]))
              else rej(returnData)
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

  return { ...client, call }
}
