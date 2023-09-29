import { createClient } from "../packages/substrate-client/dist"
import { ScProvider } from "../packages/sc-provider"

export async function connect(networkInfo: any) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  let provider = ScProvider(JSON.stringify(customChainSpec))
  return createClient(provider)
}
