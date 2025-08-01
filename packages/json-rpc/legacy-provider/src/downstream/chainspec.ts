import { createUpstream } from "@/upstream/upstream"

export const createChainSpec = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
) => {
  return (rId: string, name: "chainName" | "genesisHash" | "properties") => {
    const observable = upstream[name]
    if (!observable) return err(rId, -32602, "Invalid method")

    observable.subscribe(
      (result) => {
        reply(rId, result)
      },
      (e: any) => {
        console.error(e)
        err(rId, -32602, "Invalid")
      },
    )
  }
}
