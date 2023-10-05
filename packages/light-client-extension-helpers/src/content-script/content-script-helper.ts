import type { ToExtension, ToPage } from "@/protocol"
import { CONTEXT, PORT, sendBackgroundRequest } from "@/shared"

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

const postToPage = (msg: ToPage, targetOrigin: string) => {
  window.postMessage(msg, targetOrigin)
}

const validOrigins = [CONTEXT.WEB_PAGE, "substrate-connect-client"]
const checkMessage = (msg: any): msg is ToExtension => {
  if (!msg) return false
  if (!validOrigins.includes(msg?.origin)) return false
  if (!msg?.type && !msg?.id) return false
  return true
}

const portPostMessage = (port: chrome.runtime.Port, msg: ToExtension) =>
  port.postMessage(msg)

let port: chrome.runtime.Port | undefined
window.addEventListener("message", async ({ data, source, origin }) => {
  if (source !== window) return
  if (!validOrigins.includes(data?.origin)) return
  if (!checkMessage(data)) return console.warn("Unrecognized message", data)

  await whenActivated

  if (data.origin === CONTEXT.WEB_PAGE) {
    // TODO: re-write more elegantly
    const { request } = data
    try {
      let result: any
      switch (request.type) {
        case "addChain": {
          const { chain } = await sendBackgroundRequest(request)
          result = chain
          break
        }
        case "getChains": {
          const { chains } = await sendBackgroundRequest(request)
          result = chains
          break
        }
        default: {
          const unrecognizedMsg: never = request
          console.warn("Unrecognized message", unrecognizedMsg)
          return
        }
      }
      postToPage(
        {
          id: data.id,
          origin:
            "@polkadot-api/light-client-extension-helper-context-content-script",
          result,
        },
        origin,
      )
    } catch (error) {
      postToPage(
        {
          id: data.id,
          origin:
            "@polkadot-api/light-client-extension-helper-context-content-script",
          error: error instanceof Error ? error.toString() : "Unknown error",
        },
        origin,
      )
    }

    return
  }

  if (!port) {
    port = chrome.runtime.connect({ name: PORT.CONTENT_SCRIPT })
    port.onMessage.addListener((msg: ToPage) => postToPage(msg, origin))
    port.onDisconnect.addListener(() => {
      // FIXME: send error to active chains
      port = undefined
    })
  }

  portPostMessage(port, data)
})

chrome.runtime.onMessage.addListener((msg: ToPage) => {
  // FIXME: filter background-helper messages
  postToPage(msg, window.origin)
})
