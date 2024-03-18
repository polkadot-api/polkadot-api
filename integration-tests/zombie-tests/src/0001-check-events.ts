import { createClient } from "@polkadot-api/substrate-client"
import { getScProvider } from "@polkadot-api/sc-provider"

const scProvider = getScProvider()

export async function run(_nodeName: string, networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  let provider = scProvider(JSON.stringify(customChainSpec)).relayChain
  const { chainHead } = createClient(provider)

  let initialized = false

  let finalizedCount = 0
  let finalized = false

  let newBlockCount = 0
  let newBlock = false

  let bestBlockCount = 0
  let bestBlock = false

  await new Promise((resolve, reject) => {
    const chainHeadFollower = chainHead(
      true,
      (event) => {
        if (!newBlock && event.type === "newBlock" && ++newBlockCount === 2) {
          newBlock = true
          chainHeadFollower.unpin([event.blockHash])
          return
        }

        if (!initialized && event.type === "initialized") {
          initialized = true
          return
        }

        if (
          event.type === "finalized" &&
          !finalized &&
          ++finalizedCount === 2
        ) {
          finalized = true
          return
        }

        if (
          event.type === "bestBlockChanged" &&
          !bestBlock &&
          ++bestBlockCount === 5
        ) {
          bestBlock = true
          return
        }

        if (finalized && newBlock && bestBlock) {
          resolve(chainHeadFollower.unfollow())
        }
      },
      reject,
    )
  })
}
