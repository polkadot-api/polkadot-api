import type {
  ToExtension as ConnectToExtension,
  ToApplication as ConnectToApplication,
} from "@substrate/connect-extension-protocol"

type ToExtensionRequestAddChain = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "addChain"
  chainSpec: string
  relayChainGenesisHash?: string
}

type ToExtensionRequestGetChains = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  type: "getChains"
}

export type ToExtensionRequest =
  | ToExtensionRequestAddChain
  | ToExtensionRequestGetChains

export type ToExtension = ToExtensionRequest | ConnectToExtension

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

export type ToPage = ToPageResponse | ToPageNotification | ConnectToApplication

// FIXME: merge BackgroundRequest/BackgroundResponse/ToExtensionRequest/ToPageResponse
export type BackgroundRequestAddChainData = {
  type: "getChainData"
  chainSpec: string
  relayChainGenesisHash?: string
}

export type BackgroundRequestGetActiveConnections = {
  type: "getActiveConnections"
}

export type BackgroundRequestDisconnect = {
  type: "disconnect"
  tabId: number
  genesisHash: string
}

export type BackgroundRequest =
  | BackgroundRequestAddChainData
  | BackgroundRequestGetActiveConnections
  | BackgroundRequestDisconnect

export type BackgroundResponseAddChainData = {
  type: "getChainDataResponse"
  genesisHash: string
  name: string
  ss58Format: number
}

export type BackgroundResponseGetActiveConnections = {
  type: "getActiveConnectionsResponse"
  connections: { tabId: number; genesisHash: string }[]
}

export type BackgroundResponseDisconnect = {
  type: "disconnectResponse"
}

export type BackgroundResponseError = {
  type: "error"
  error: string
}

export type BackgroundResponse =
  | BackgroundResponseAddChainData
  | BackgroundResponseGetActiveConnections
  | BackgroundResponseDisconnect
