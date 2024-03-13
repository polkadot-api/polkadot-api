export interface JsonRpcConnection {
  send: (message: string) => void
  disconnect: () => void
}

export declare type JsonRpcProvider = (
  onMessage: (message: string) => void,
) => JsonRpcConnection
