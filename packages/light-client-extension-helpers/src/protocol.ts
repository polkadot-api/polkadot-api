import type {
  ToExtension as ConnectToExtension,
  ToApplication as ConnectToApplication,
} from "@substrate/connect-extension-protocol"

export type PostMessage<T> = {
  channelId: string
  msg: T
}

export type ToExtension = ToExtensionRequest | ConnectToExtension

export type ToExtensionRequest = {
  origin: "@polkadot-api/light-client-extension-helper-context-web-page"
  id: string
  request: BackgroundRequestGetChain | BackgroundRequestGetChains
}

export type ToPage = ToPageResponse | ToPageNotification | ConnectToApplication

export type ToPageResponse = {
  origin: "@polkadot-api/light-client-extension-helper-context-content-script"
  id: string
  result?: BackgroundResponseGetChain | BackgroundResponseGetChains
  error?: string
}

type ToPageNotificationOnAddChains = {
  origin: "@polkadot-api/light-client-extension-helper-context-background"
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

export type BackgroundRequest =
  | ({
      origin: "@polkadot-api/light-client-extension-helper-context-web-page"
    } & (BackgroundRequestGetChain | BackgroundRequestGetChains))
  | ({
      origin: "@polkadot-api/light-client-extension-helper-context-extension-page"
    } & (
      | BackgroundRequestDeleteChain
      | BackgroundRequestPersistChain
      | BackgroundRequestGetActiveConnections
      | BackgroundRequestDisconnect
      | BackgroundRequestSetBootNodes
    ))

// FIXME: merge BackgroundRequest/BackgroundResponse/ToExtensionRequest/ToPageResponse
type BackgroundRequestGetChain = {
  type: "getChain"
  chainSpec: string
  relayChainGenesisHash?: string
}

type BackgroundRequestDeleteChain = {
  type: "deleteChain"
  genesisHash: string
}

type BackgroundRequestPersistChain = {
  type: "persistChain"
  chainSpec: string
  relayChainGenesisHash?: string
}

type BackgroundRequestGetChains = {
  type: "getChains"
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

export type BackgroundResponse = {
  origin: "@polkadot-api/light-client-extension-helper-context-background"
} & (
  | BackgroundResponseGetChain
  | BackgroundResponseDeleteChain
  | BackgroundResponsePersistChain
  | BackgroundResponseGetChains
  | BackgroundResponseGetActiveConnections
  | BackgroundResponseDisconnect
  | BackgroundResponseSetBootNodes
)

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
  origin: "@polkadot-api/light-client-extension-helper-context-background"
  type: "error"
  error: string
}
