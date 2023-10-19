import { WellKnownChain, GetProvider } from "@polkadot-api/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"
import { createProvider } from "./smolldot-worker"

const [provider, terminateProvider] = createProvider(WellKnownChain.polkadot)

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

export const { chainHead, destroy } = createClient(withLogsProvider(provider))

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

try {
  const nominators = await getAllNominators()
  console.log(nominators)
} catch (err) {
  console.error(err)
}

// we need to set a delay because `getAllNominators` resolves BEFORE the finally
// block where `chainHeadFollower.unfollow()` is invoked ... which causing some
// timing errors
setTimeout(async () => {
  console.log("destroy", destroy())
  console.log("terminate provider", await terminateProvider())
}, 5000)
