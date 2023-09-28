export interface Provider {
  send: (message: string) => void
  open: () => void
  close: () => void
}

export type ProviderStatus = "connected" | "disconnected"

export declare type GetProvider = (
  onMessage: (message: string) => void,
  onStatus: (status: ProviderStatus) => void,
) => Provider
