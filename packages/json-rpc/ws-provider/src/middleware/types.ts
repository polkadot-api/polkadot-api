export interface ParsedJsonRpcConnection {
  send: <T extends {}>(message: T) => void
  disconnect: () => void
}

export type ParsedJsonRpcProvider = (
  onMesage: <T extends {}>(message: T) => void,
  onHalt: (e?: any) => void,
) => ParsedJsonRpcConnection

export type ParsedJsonRpcEnhancer = (
  base: ParsedJsonRpcProvider,
) => ParsedJsonRpcProvider
