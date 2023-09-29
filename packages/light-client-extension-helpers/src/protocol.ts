type ToExtensionRequestAddChain = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "addChain"
  chainSpec: string
}

type ToExtensionRequestGetChains = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "getChains"
}

export type ToExtensionRequest =
  | ToExtensionRequestAddChain
  | ToExtensionRequestGetChains

type ToExtensionRpc = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  type: "rpc"
  genesisHash: string
  msg: string
}

export type ToExtension = ToExtensionRequest | ToExtensionRpc

export type ToPageResponse = {
  origin: "@polkadot-api/light-client-extension-helper-context-content-script"
  id: string
  result?: any
  error?: any
}

type ToPageNotificationOnAddChains = {
  origin: "@polkadot-api/light-client-extension-helper-context-content-script"
  id?: undefined
  type: "onAddChains"
  chains: Record<
    string,
    {
      genesisHash: string
      name: string
    }
  >
}

export type ToPageNotification = ToPageNotificationOnAddChains

type ToPageRpc = {
  origin: "@polkadot-api/light-client-extension-helper-context-content-script"
  // FIXME: remove "id" and improve type narrowing
  id?: undefined
  type: "rpc"
  // TODO: add chainId to support multiple instances of the same chain
  genesisHash: string
  msg: string
}

export type ToPage = ToPageResponse | ToPageNotification | ToPageRpc
