import type {
  ToExtension as ConnectToExtension,
  ToApplication as ConnectToApplication,
} from "@substrate/connect-extension-protocol"

export type ToExtensionRequest = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  request: BackgroundRequestGetChain | BackgroundRequestGetChains
}

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

type ToPageNotification = ToPageNotificationOnAddChains

export type ToPage = ToPageResponse | ToPageNotification | ConnectToApplication

// FIXME: merge BackgroundRequest/BackgroundResponse/ToExtensionRequest/ToPageResponse
type BackgroundRequestGetChain = {
  // FIXME: add origin
  // origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  type: "getChain"
  chainSpec: string
  relayChainGenesisHash?: string
}

type BackgroundRequestDeleteChain = {
  // FIXME: add origin
  // origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  type: "deleteChain"
  genesisHash: string
}

type BackgroundRequestPersistChain = {
  // FIXME: add origin
  // origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  type: "persistChain"
  chainSpec: string
  relayChainGenesisHash?: string
}

type BackgroundRequestGetChains = {
  // FIXME: add origin
  // origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  type: "getChains"
}

type BackgroundRequestGetChainData = {
  type: "getChainData"
  chainSpec: string
  relayChainGenesisHash?: string
}

type BackgroundRequestGetActiveConnections = {
  type: "getActiveConnections"
}

type BackgroundRequestDisconnect = {
  type: "disconnect"
  tabId: number
  genesisHash: string
}

type BackgroundRequestSetBootNodes = {
  type: "setBootNodes"
  genesisHash: string
  bootNodes: string[]
}

// FIXME: add origin to any request
export type BackgroundRequest =
  | BackgroundRequestGetChain
  | BackgroundRequestDeleteChain
  | BackgroundRequestPersistChain
  | BackgroundRequestGetChains
  | BackgroundRequestGetChainData
  | BackgroundRequestGetActiveConnections
  | BackgroundRequestDisconnect
  | BackgroundRequestSetBootNodes

type BackgroundResponseGetChain = {
  type: "getChainResponse"
  chain: {
    genesisHash: string
    name: string
  }
}

type BackgroundResponseDeleteChain = {
  type: "deleteChainResponse"
}

type BackgroundResponsePersistChain = {
  type: "persistChainResponse"
}

type BackgroundResponseGetChains = {
  type: "getChainsResponse"
  chains: Record<string, { genesisHash: string; name: string }>
}

type BackgroundResponseGetChainData = {
  type: "getChainDataResponse"
  genesisHash: string
  name: string
  ss58Format: number
}

type BackgroundResponseGetActiveConnections = {
  type: "getActiveConnectionsResponse"
  connections: { tabId: number; genesisHash: string }[]
}

type BackgroundResponseDisconnect = {
  type: "disconnectResponse"
}

type BackgroundResponseSetBootNodes = {
  type: "setBootNodesResponse"
}

export type BackgroundResponseError = {
  type: "error"
  error: string
}

// FIXME: add origin to any response
export type BackgroundResponse =
  | BackgroundResponseGetChain
  | BackgroundResponseDeleteChain
  | BackgroundResponsePersistChain
  | BackgroundResponseGetChains
  | BackgroundResponseGetChainData
  | BackgroundResponseGetActiveConnections
  | BackgroundResponseDisconnect
  | BackgroundResponseSetBootNodes

export type PostMessage<T> = {
  channelId: string
  msg: T
}
