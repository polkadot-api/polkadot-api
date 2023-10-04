import { helper } from "@polkadot-api/light-client-extension-helpers/extension-page"
import { genesisHash, chainSpec } from "./test-data/westend"
;(async () => {
  console.log({ getChain: await helper.getChain(genesisHash) })
  console.log({ persistChain: await helper.persistChain(chainSpec) })
  console.log({ getChain: await helper.getChain(genesisHash) })
  console.log({
    setBootNodes: await helper.setBootNodes(genesisHash, ["fake-bootnode"]),
  })
  console.log({ getChain: await helper.getChain(genesisHash) })
  console.log({
    setBootNodes: await helper.setBootNodes(genesisHash, []),
  })
  console.log({ getChain: await helper.getChain(genesisHash) })
  console.log({ deleteChain: await helper.deleteChain(genesisHash) })
  console.log({ getChain: await helper.getChain(genesisHash) })
  console.log({ getChain: await helper.getActiveConnections() })
  console.log({ getChain: await helper.disconnect(123, genesisHash) })
})()
