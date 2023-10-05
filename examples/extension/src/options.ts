import { helper } from "@polkadot-api/light-client-extension-helpers/extension-page"
import { genesisHash, chainSpec } from "./test-data/westend"
import { createClient } from "@polkadot-api/substrate-client"
;(async () => {
  console.log({ getChain: await helper.getChains() })
  console.log({ persistChain: await helper.persistChain(chainSpec) })
  console.log({ getChain: await helper.getChains() })
  console.log({
    setBootNodes: await helper.setBootNodes(genesisHash, ["fake-bootnode"]),
  })
  console.log({ getChain: await helper.getChains() })
  console.log({
    setBootNodes: await helper.setBootNodes(genesisHash, []),
  })
  console.log({ getChain: await helper.getChains() })
  console.log({ deleteChain: await helper.deleteChain(genesisHash) })
  console.log({ getChains: await helper.getChains() })
  console.log({ disconnect: await helper.disconnect(123, genesisHash) })
})()

setInterval(async () => {
  console.log({ getActiveConnections: await helper.getActiveConnections() })
}, 5000)
;(async () => {
  const [chain] = await helper.getChains()
  const client = createClient(chain.provider)

  let count = 0
  const follower = client.chainHead(
    true,
    (event) => {
      if (count === 5) {
        follower.unfollow()
        client.destroy()
      }
      console.log(`${chain.name} chainHead event#${count++}`, event)
    },
    (error) => console.error(error),
  )
})()
