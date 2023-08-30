export interface IRpcError {
  code: number
  message: string
  data?: any
}

export class RpcError extends Error implements IRpcError {
  code
  data
  constructor(e: IRpcError) {
    super(e.message)
    this.code = e.code
    this.data = e.data
    this.name = "RpcError"
  }
}
