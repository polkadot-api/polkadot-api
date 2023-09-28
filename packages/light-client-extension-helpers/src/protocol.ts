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

export type ToPageNotification = {
  origin: "@polkadot-api/light-client-extension-helper-context-content-script"
  id?: undefined
  type: string
  payload?: any
}

export type ToPage = ToPageResponse | ToPageNotification
