import { WellKnownChain } from "@substrate/connect"
import { ScProvider } from "@unstoppablejs/sc-provider"
import { createClient } from "@polkadot-api/substrate-client"

const smProvider = ScProvider(
  WellKnownChain.polkadot /* {
  embeddedNodeConfig: {
    maxLogLevel: 9,
  },
}*/,
)

export interface Provider {
  send: (message: string) => void
  open: () => void
  close: () => void
}
export declare enum ProviderStatus {
  ready = 0,
  disconnected = 1,
  halt = 2,
}

export declare type GetProvider = (
  onMessage: (message: string) => void,
  onStatus: (status: ProviderStatus) => void,
) => Provider

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
        if (message.event === "newBlock") {
          chainHeadFollower.unpin([message.blockHash])
          return
        }
        if (requested || message.event !== "initialized") return
        const latestFinalized = message.finalizedBlockHash
        console.log({ latestFinalized })
        requested = true

        chainHeadFollower
          .storage(
            latestFinalized,
            {
              descendantsValues: [
                "0x5f3e4907f716ac89b6347d15ececedca88dcde934c658227ee1dfafcd6e16903",
              ],
            },
            null,
          )
          .then((response) => {
            res(response.descendantsValues)
          })
          .catch((e) => {
            console.log("error", e)
            rej(e)
          })
          .finally(() => {
            chainHeadFollower.unfollow()
          })
      },
      () => {},
    )
  })

getAllNominators().then(console.log, console.error)
