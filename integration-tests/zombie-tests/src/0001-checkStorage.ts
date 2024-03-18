import {
  Option,
  u32,
  Tuple,
  compact,
  metadata,
} from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder } from "@polkadot-api/metadata-builders"
import { createClient } from "@polkadot-api/substrate-client"
import { getScProvider } from "@polkadot-api/sc-provider"
import { toHex } from "@polkadot-api/utils"

const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

const opaqueMeta = Option(Tuple(compact, metadata))
const v15Args = toHex(u32.enc(15))

const scProvider = getScProvider()
export async function run(_nodeName: string, networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  let provider = scProvider(JSON.stringify(customChainSpec)).relayChain
  const { chainHead } = createClient(provider)

  let aliceBalance = 0

  await new Promise((resolve, reject) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      async (event) => {
        if (event.type === "newBlock") {
          chainHeadFollower.unpin([event.blockHash])
          return
        }
        if (requested || event.type !== "initialized") return
        const [latestFinalized] = event.finalizedBlockHashes.slice(-1)
        requested = true

        // Call metadata
        let response = await chainHeadFollower.call(
          latestFinalized,
          "Metadata_metadata_at_version",
          v15Args,
        )

        const [, metadata] = opaqueMeta.dec(response)!
        if (metadata.metadata.tag === "v15") {
          const dynamicBuilder = getDynamicBuilder(metadata.metadata.value)
          const storageAccount = dynamicBuilder.buildStorage(
            "System",
            "Account",
          )
          let result = await chainHeadFollower.storage(
            latestFinalized,
            "value",
            storageAccount.enc(ALICE),
            null,
          )
          let res: any = storageAccount.dec(result as string)
          aliceBalance = res?.data?.free?.toString()
          resolve(chainHeadFollower.unfollow())
        }
      },
      reject,
    )
  })
  return aliceBalance
}
