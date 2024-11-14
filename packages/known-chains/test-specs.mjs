import * as chains from "./dist/index.mjs"
import { start } from "@polkadot-api/smoldot"

const RELAYS = ["polkadot", "ksmcc3", "westend2", "paseo"]

const smoldot = start()
async function main() {
  for (const c of RELAYS) {
    console.log(`starting ${c}`)
    const relay = await smoldot.addChain({ chainSpec: chains[c] })
    const paras = await Promise.all(
      Object.keys(chains)
        .filter((p) => p.startsWith(c + "_"))
        .map((p) =>
          smoldot.addChain({
            chainSpec: chains[p],
            potentialRelayChains: [relay],
          }),
        ),
    )
    paras.forEach((p) => p.remove())
    relay.remove()
    console.log(`${c} done`)
    console.log()
  }
  smoldot.terminate()
}
main().then(process.exit)
