import { backgroundHelper } from "@polkadot-api/light-client-extension-helpers/background"
import type { ToContent } from "./protocol"

backgroundHelper(async (inputChain) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) throw new Error("no active tab")
  if (
    !(await chrome.tabs.sendMessage(tab.id!, {
      origin: "my-extension-background",
      type: "onAddChainByUser",
      inputChain,
    } as ToContent))
  )
    throw new Error("addChainByUser rejected")
})
