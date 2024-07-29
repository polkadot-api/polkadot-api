import { parentPort } from "node:worker_threads"
import { AddChainOptions, Chain, Client, ClientOptions, start } from "smoldot"

export type SmoldotOptions = Omit<ClientOptions, "portToWorker">
export interface StartMsg {
  type: "start"
  value: SmoldotOptions
}
export interface AddChainMsg {
  type: "add-chain"
  value: Omit<AddChainOptions, "potentialRelayChains"> & {
    potentialRelayChainIds?: number[]
  }
}
export interface TerminateMsg {
  type: "terminate"
}
export interface ChainMsg {
  type: "chain"
  value: {
    id: number
  } & (
    | {
        type: "remove" | "receive"
      }
    | {
        type: "send"
        value: string
      }
  )
}
export type RequestMessage = StartMsg | AddChainMsg | TerminateMsg | ChainMsg
export type CorrelatedRequestMessage = { id: number } & RequestMessage

let smoldot: Client | null = null

let chainId = 0
const chains = new Map<number, Chain>()

parentPort!.on("message", async (msg: CorrelatedRequestMessage) => {
  if (msg.type === "start") {
    if (smoldot !== null) {
      throw new Error("Can't call start on a client already started")
    }
    smoldot = start(msg.value)
    return parentPort?.postMessage({
      id: msg.id,
    })
  }

  if (smoldot === null) {
    throw new Error("Smoldot not started")
  }

  switch (msg.type) {
    case "add-chain": {
      const potentialRelayChains = msg.value.potentialRelayChainIds?.map(
        (id) => {
          const chain = chains.get(id)
          if (!chain) throw new Error("Can't reference removed chain")
          return chain
        },
      )
      const chain = await smoldot.addChain({
        ...msg.value,
        potentialRelayChains,
      })
      const id = chainId++
      chains.set(id, chain)
      parentPort?.postMessage({
        id: msg.id,
        value: id,
      })
      break
    }
    case "terminate":
      await smoldot.terminate()
      parentPort?.postMessage({
        id: msg.id,
      })
      smoldot = null
      chains.clear()
      break
    case "chain":
      handleChainMessage(msg, msg.id)
      break
  }
})

async function handleChainMessage(msg: ChainMsg, id: number) {
  const chain = chains.get(msg.value.id)
  if (!chain) throw new Error("Can't reference removed chain")

  switch (msg.value.type) {
    case "receive":
      parentPort?.postMessage({
        id,
        value: await chain.nextJsonRpcResponse(),
      })
      break
    case "send":
      chain.sendJsonRpc(msg.value.value)
      break
    case "remove":
      chain.remove()
      chains.delete(msg.value.id)
      break
  }
}
