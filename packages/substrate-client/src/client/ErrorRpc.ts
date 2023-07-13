export interface RpcError {
  code: number
  message: string
  data?: any
}

export class ErrorRpc extends Error implements RpcError {
  code
  data
  constructor(e: RpcError) {
    super(e.message)
    this.code = e.code
    this.data = e.data
  }
}
