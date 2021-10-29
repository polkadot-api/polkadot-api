export { GetProvider, Provider, ProviderStatus } from "@unstoppablejs/provider"
export interface Client {
  request: <T>(
    method: string,
    params: any[],
    cb: (result: T) => void,
  ) => () => void
  connect: () => void
  disconnect: () => void
}
