import {
  ScProvider,
  WellKnownChain,
  GetProvider,
} from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"

const smProvider = ScProvider(
  WellKnownChain.polkadot /* {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
)

const withLogsProvider = (input: GetProvider): GetProvider => {
  return (onMsg, onStatus) => {
    const result = input(
      (msg) => {
        console.log("<< " + msg)
        onMsg(msg)
      },
      (status) => {
        console.log("STATUS CHANGED =>" + status)
        onStatus(status)
      },
    )

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

export const { chainHead } = createClient(withLogsProvider(smProvider))

export const getAllNominators = (): Promise<any> =>
  new Promise<any>((res, rej) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (message) => {
        if (message.type === "newBlock") {
          chainHeadFollower.unpin([message.blockHash])
          return
        }
        if (requested || message.type !== "initialized") return
        const latestFinalized = message.finalizedBlockHash
        console.log({ latestFinalized })
        requested = true

        chainHeadFollower
          .storage(
            latestFinalized,
            "descendantsValues",
            "0x5f3e4907f716ac89b6347d15ececedca88dcde934c658227ee1dfafcd6e16903",
            null,
          )
          .then(res)
          .catch((e) => {
            console.log("error", e)
            rej(e)
          })
          .finally(() => {
            chainHeadFollower.unfollow()
          })
        chainHeadFollower.unpin([latestFinalized])
      },
      () => {},
    )
  })

getAllNominators().then(console.log, console.error)
