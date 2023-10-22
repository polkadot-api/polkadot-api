export interface Provider {
  send: (message: string) => void
  disconnect: () => void
}

export declare type ConnectProvider = (
  onMessage: (message: string) => void,
) => Provider
