import { InnerJsonRpcProvider } from "@polkadot-api/json-rpc-provider-proxy"

export type Middleware = (base: InnerJsonRpcProvider) => InnerJsonRpcProvider
