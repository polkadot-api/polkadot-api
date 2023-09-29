import { Tuple, compact, metadata } from "../packages/substrate-bindings"
import { createClient } from "../packages/substrate-client"
import {
  ScProvider,
  WellKnownChain, //, WellKnownChain
} from "../packages/sc-provider"

export async function connect(_nodeName: string, networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  let provider = ScProvider(JSON.stringify(customChainSpec))
  return createClient(provider)
}

const provider = ScProvider(WellKnownChain.westend2)

const opaqueMeta = Tuple(compact, metadata)

const { chainHead } = await createClient(provider)

await new Promise(async (resolve, reject) => {
  let requested = false
  const chainHeadFollower = chainHead(
    true,
    (event) => {
      if (event.type === "newBlock") {
        chainHeadFollower.unpin([event.blockHash])
        return
      }
      if (requested || event.type !== "initialized") return
      const latestFinalized = event.finalizedBlockHash
      requested = true

      chainHeadFollower
        .call(latestFinalized, "Metadata_metadata", "")
        .then(async (response) => {
          // Get the metadata
          const [, metadata] = opaqueMeta.dec(response)
          if (metadata.metadata.tag === "v14") {
            const header = await chainHeadFollower.header(latestFinalized)
            const body = await chainHeadFollower.body(latestFinalized)
            if (
              header.startsWith("0x") &&
              body.length > 0 &&
              body[0].startsWith("0x")
            ) {
              resolve(chainHeadFollower.unfollow())
            }
          }
        })
    },
    reject,
  )
})
