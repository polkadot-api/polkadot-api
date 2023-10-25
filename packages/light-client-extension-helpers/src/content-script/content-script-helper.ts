import type { PostMessage, ToExtension, ToPage } from "@/protocol"
import { CONTEXT, PORT, sendBackgroundRequest } from "@/shared"

let isRegistered = false
export const register = (channelId: string) => {
  if (isRegistered) throw new Error("helper already registered")
  isRegistered = true

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
    window.postMessage({ channelId, msg } as PostMessage<ToPage>, targetOrigin)
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

  const chainIds = new Set<string>()
  const handleExtensionError = (errorMessage: string, origin: string) => {
    console.error(errorMessage)
    chainIds.forEach((chainId) =>
      postToPage(
        {
          origin: "substrate-connect-extension",
          chainId,
          type: "error",
          errorMessage,
        },
        origin,
      ),
    )
    chainIds.clear()
  }

  let port: chrome.runtime.Port | undefined
  window.addEventListener("message", async ({ data, source, origin }) => {
    if (source !== window) return
    const { channelId: msgChannelId, msg } = data
    if (channelId !== msgChannelId) return
    if (!validOrigins.includes(msg?.origin)) return
    if (!checkMessage(msg)) return console.warn("Unrecognized message", msg)

    await whenActivated

    if (msg.origin === CONTEXT.WEB_PAGE) {
      // TODO: re-write more elegantly
      const { request } = msg
      try {
        let result: any
        switch (request.type) {
          case "getChain":
          case "getChains": {
            result = await sendBackgroundRequest(request)
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
            id: msg.id,
            origin:
              "@polkadot-api/light-client-extension-helper-context-content-script",
            result,
          },
          origin,
        )
      } catch (error) {
        postToPage(
          {
            id: msg.id,
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
      try {
        port = chrome.runtime.connect({ name: PORT.CONTENT_SCRIPT })
      } catch (error) {
        handleExtensionError("Cannot connect to extension", origin)
        return
      }
      port.onMessage.addListener((msg: ToPage) => {
        if (
          msg.origin === "substrate-connect-extension" &&
          msg.type === "error"
        )
          chainIds.delete(msg.chainId)
        postToPage(msg, origin)
      })

      port.onDisconnect.addListener(() => {
        port = undefined
        handleExtensionError("Disconnected from extension", origin)
      })
    }

    portPostMessage(port, msg)

    if (msg.origin !== "substrate-connect-client") return
    switch (msg.type) {
      case "add-chain":
      case "add-well-known-chain": {
        chainIds.add(msg.chainId)
        break
      }
      case "remove-chain": {
        chainIds.delete(msg.chainId)
        break
      }
      default:
        break
    }
  })

  chrome.runtime.onMessage.addListener((msg: ToPage) => {
    if (msg.origin === "substrate-connect-extension" && msg.type === "error")
      chainIds.delete(msg.chainId)
    // FIXME: filter background-helper messages
    postToPage(msg, window.origin)
  })
}
