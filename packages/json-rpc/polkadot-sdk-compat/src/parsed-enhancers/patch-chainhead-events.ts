import type { ParsedJsonRpcEnhancer } from "@/parsed"

export const patchChainHeadEvents: ParsedJsonRpcEnhancer = (base) => (onMsg) =>
  base((message) => {
    const result = (message as any)?.params?.result
    if (!("id" in message) && result) {
      const { prunedBlockHashes, finalizedBlockHash, event } = result
      if (event === "finalized" && Array.isArray(prunedBlockHashes))
        result.prunedBlockHashes = [...new Set(result.prunedBlockHashes)]
      else if (event === "initialized" && finalizedBlockHash) {
        result.finalizedBlockHashes = [result.finalizedBlockHash]
        delete result.finalizedBlockHash
      }
    }
    onMsg(message)
  })
