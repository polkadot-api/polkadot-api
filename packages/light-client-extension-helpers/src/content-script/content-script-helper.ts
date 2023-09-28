import type { ToExtension, ToPage } from "@/protocol"
import { CONTEXT, PORT } from "@/shared"

console.log(
  "@polkadot-api/light-client-extension-helpers content-script helper registered",
)

// Set up a promise for when the page is activated,
// which is needed for prerendered pages.
const whenActivated = new Promise<void>((resolve) => {
  // @ts-ignore
  if (document.prerendering) {
    // @ts-ignore
    document.addEventListener("prerenderingchange", resolve)
  } else {
    resolve()
  }
})

function postToPage(msg: ToPage, targetOrigin: string) {
  window.postMessage(msg, targetOrigin)
}

function checkMessage(msg: any): msg is ToExtension {
  if (!msg) return false
  if (msg?.origin !== CONTEXT.WEB_PAGE) return false
  if (!msg?.id) return false
  return true
}

const portPostMessage = (port: chrome.runtime.Port, msg: ToExtension) =>
  port.postMessage(msg)

let port: chrome.runtime.Port | undefined

window.addEventListener("message", async ({ data, source, origin }) => {
  if (source !== window) return
  if (data?.origin !== CONTEXT.WEB_PAGE) return
  if (!checkMessage(data)) return console.warn("Unrecognized message", data)

  await whenActivated

  // FIXME: forward to port
  if (!port) {
    // FIXME: extract to port name to constant
    port = chrome.runtime.connect({ name: PORT.CONTENT_SCRIPT })
    port.onMessage.addListener((msg: ToPage) => {
      postToPage(msg, origin)
    })
    port.onDisconnect.addListener(() => {
      port = undefined
    })
  }

  portPostMessage(port, data)
})
