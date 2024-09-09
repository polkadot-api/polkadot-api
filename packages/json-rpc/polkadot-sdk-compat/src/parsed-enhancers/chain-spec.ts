import type { ParsedJsonRpcEnhancer } from "@/parsed"
import { chainSpec } from "@/methods"

export const fixChainSpec: ParsedJsonRpcEnhancer = (base) => (onMsg) => {
  const { send: originalSend, disconnect } = base(onMsg)

  const send = (msg: any) => {
    switch (msg.method) {
      case chainSpec.chainName:
        return originalSend({ ...msg, method: "system_chain" })
      case chainSpec.genesisHash:
        return originalSend({
          ...msg,
          method: "chain_getBlockHash",
          params: [0],
        })
      case chainSpec.properties:
        return originalSend({ ...msg, method: "system_properties" })
    }
    originalSend(msg)
  }

  return {
    send,
    disconnect,
  }
}
