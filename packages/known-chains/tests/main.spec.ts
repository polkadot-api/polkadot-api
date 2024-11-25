import * as chains from "@/index"
import { type Chain, start, type Client } from "@polkadot-api/smoldot"
import { afterAll, beforeAll, describe, it } from "vitest"
import { createClient } from "@polkadot-api/substrate-client"
import { getSmProvider } from "@polkadot-api/sm-provider"

let smoldot: Client
beforeAll(() => {
  smoldot = start()
})
afterAll(async () => {
  await smoldot.terminate()
})

describe("chain specs", () => {
  const RELAYS: Array<keyof typeof chains> = [
    "polkadot",
    "ksmcc3",
    "westend2",
    "paseo",
  ]
  const waitForRuntime = async (chain: Chain | Promise<Chain>) => {
    return new Promise<() => void>((res, rej) => {
      const client = createClient(getSmProvider(chain))
      const token = setTimeout(rej, 30_000)
      const { unfollow } = client.chainHead(
        true,
        (ev) => {
          if (ev.type === "initialized") {
            clearTimeout(token)
            unfollow()
            res(client.destroy)
          }
        },
        (err) => {
          throw err
        },
      )
    })
  }
  it.concurrent.each(RELAYS)("loads all specs", async (c) => {
    const relay = await smoldot.addChain({ chainSpec: chains[c] })
    const destroy = await waitForRuntime(relay)
    const parasDestroy = await Promise.all(
      (Object.keys(chains) as Array<keyof typeof chains>)
        .filter((p) => p.startsWith(c + "_"))
        .map((p) =>
          waitForRuntime(
            smoldot.addChain({
              chainSpec: chains[p],
              potentialRelayChains: [relay],
            }),
          ),
        ),
    )
    parasDestroy.forEach((p) => p())
    destroy()
  })
}, 60_000)
