import { Provider, ProviderStatus, GetProvider } from "@unstoppablejs/provider"

export { Provider, ProviderStatus, GetProvider }

export const WsProvider = (uri: string): GetProvider => {
  return (onMessage, onStatus): Provider => {
    let ws: WebSocket

    function onOpen() {
      onStatus(ProviderStatus.ready)
    }
    function onDisconnected() {
      onStatus(ProviderStatus.disconnected)
    }

    function _onMessage(e: MessageEvent) {
      onMessage(e.data)
    }

    function removeEventListeners() {
      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("message", _onMessage)
      ws.removeEventListener("error", onDisconnected)
      ws.removeEventListener("close", onDisconnected)
    }

    const open = () => {
      ws = new WebSocket(uri)
      ws.addEventListener("open", onOpen)
      ws.addEventListener("message", _onMessage)
      ws.addEventListener("error", onDisconnected)
      ws.addEventListener("close", onDisconnected)
    }

    const close = () => {
      removeEventListeners()
      ws.close()
    }
    const send = (msg: string) => {
      ws.send(msg)
    }

    return { open, close, send }
  }
}
