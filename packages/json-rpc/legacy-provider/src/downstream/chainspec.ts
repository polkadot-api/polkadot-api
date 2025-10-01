import { createUpstream } from "@/upstream/upstream"

export const chainSpecMethods = Object.fromEntries(
  ["chainName", "genesisHash", "properties"].map(
    (key) => [key, `chainSpec_v1_${key}`] as const,
  ),
)

export const createChainSpec = (
  upstream: ReturnType<typeof createUpstream>,
  reply: (id: string, result: any) => void,
  err: (id: string, code: number, msg: string) => void,
) => {
  return (rId: string, method: string) => {
    const [, , name] = method.split("_")
    const observable =
      upstream[name as "chainName" | "genesisHash" | "properties"]
    if (!observable) throw null

    observable.subscribe(
      (result) => {
        reply(rId, result)
      },
      () => {
        err(rId, -32602, "Invalid")
      },
    )
  }
}
