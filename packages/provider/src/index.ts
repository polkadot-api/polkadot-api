export interface Provider {
  send: (message: string) => void
  open: () => void
  close: () => void
}

export enum ProviderStatus {
  ready,
  disconnected,
  halt,
}

export type GetProvider = (
  onMessage: (message: string) => void,
  onStatus: (status: ProviderStatus) => void,
) => Provider
