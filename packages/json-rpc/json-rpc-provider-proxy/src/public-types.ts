export interface GenericRpcConnection<T> {
  send: (message: T) => void
  disconnect: () => void
}

export type AsyncJsonRpcProvider<T = string> = (
  onMessage: (message: T) => void,
  onHalt: (e?: any) => void,
) => GenericRpcConnection<T>
