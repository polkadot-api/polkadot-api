import { Tuple, compact, metadata } from "../packages/substrate-bindings/dist"
import { getDynamicBuilder } from "../packages/substrate-codegen/dist"
import { connect } from "./utils"

const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

export async function run(_nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(networkInfo)

  const opaqueMeta = Tuple(compact, metadata)

  let aliceBalance = 0

  await new Promise(async (resolve, reject) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      async (event) => {
        if (event.type === "newBlock") {
          chainHeadFollower.unpin([event.blockHash])
          return
        }
        if (requested || event.type !== "initialized") return
        const latestFinalized = event.finalizedBlockHash
        requested = true

        // Call metadata
        let response = await chainHeadFollower.call(
          latestFinalized,
          "Metadata_metadata",
          "",
        )

        const [, metadata] = opaqueMeta.dec(response)
        if (metadata.metadata.tag === "v14") {
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
          let res = storageAccount.dec(result as string)
          aliceBalance = res?.data?.free?.toString()
          resolve(chainHeadFollower.unfollow())
        }
      },
      reject,
    )
  })
  return aliceBalance
}
