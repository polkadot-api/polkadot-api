type ToExtensionAddChain = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "addChain"
  chainspec: string
}

type ToExtensionGetChains = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "getChains"
}

export type ToExtension = ToExtensionAddChain | ToExtensionGetChains

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

export type ToPage = ToPageResponse | ToPageNotification
