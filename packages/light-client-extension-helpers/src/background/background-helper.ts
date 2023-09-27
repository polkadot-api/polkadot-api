import { ToExtension, ToPage } from "@/protocol"
import type { BackgroundHelper } from "./types"

console.log(
  "@polkadot-api/light-client-extension-helpers background helper registered",
)

const addChainByUserCallbacks: Parameters<BackgroundHelper>[0][] = []

export const backgroundHelper: BackgroundHelper = async (onAddChainByUser) => {
  addChainByUserCallbacks.push(onAddChainByUser)
}

// TODO: side-effects + register chains
const postMessage = (port: chrome.runtime.Port, message: ToPage) =>
  port.postMessage(message)

chrome.runtime.onConnect.addListener((port) => {
  // FIXME: extract port.name into a constant
  if (port.name === "content") {
    port.onMessage.addListener((msg: ToExtension) => {
      // FIXME: switch on msg.method
      postMessage(port, {
        origin: "content-script-helper",
        id: msg.id,
        result: `reply to ${msg.method}`,
      })
    })
  }
})
