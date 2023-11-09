import { register } from "@polkadot-api/light-client-extension-helpers/background"
import type { ToContent } from "./protocol"
import { smoldotClient } from "./background-smoldot.code-split"

const { lightClientPageHelper, addOnAddChainByUserListener } =
  register(smoldotClient)

addOnAddChainByUserListener(async (inputChain, tabId) => {
  if (
    !(await chrome.tabs.sendMessage(tabId, {
      origin: "my-extension-background",
      type: "onAddChainByUser",
      inputChain,
    } as ToContent))
  )
    throw new Error("addChainByUser rejected")

  await lightClientPageHelper.persistChain(
    inputChain.chainSpec,
    inputChain.relayChainGenesisHash,
  )
})
