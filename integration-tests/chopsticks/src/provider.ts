import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

const noop = () => {}

if (typeof process === "object" && "env" in process)
  process.env.LOG_LEVEL = "fatal"

let nActiveClients = 0
const createProvider = (
  endpoint: string,
  {
    wasm,
    block,
  }: Partial<{
    wasm: string
    block: string | number
  }> = {},
) =>
  getSyncProvider(async () => {
    const { ChopsticksProvider, setup, destroyWorker } = await import(
      "@acala-network/chopsticks-core"
    )
    const chain = await setup({ endpoint, block, runtimeLogLevel: 0 })
    if (wasm) chain.head.setWasm(wasm as any)
    await chain.api.isReady

    const innerProvider = new ChopsticksProvider(chain)
    await innerProvider.isReady

    return (onMessage) => {
      nActiveClients++
      const subscriptions = new Set<string | number>()
      return {
        send: async (message: string) => {
          const parsed = JSON.parse(message)

          if (parsed.method === "chainHead_v1_follow") {
            const subscription = await innerProvider.subscribe(
              "chainHead_v1_followEvent",
              parsed.method,
              parsed.params,
              (err, result) => {
                if (err) {
                  console.error(err)
                } else
                  onMessage(
                    JSON.stringify({
                      jsonrpc: "2.0",
                      method: "chainHead_v1_followEvent",
                      params: {
                        subscription,
                        result,
                      },
                    }),
                  )
              },
            )
            subscriptions.add(subscription)

            onMessage(
              JSON.stringify({
                jsonrpc: "2.0",
                id: parsed.id,
                result: subscription,
              }),
            )
          } else if (parsed.method === "chainHead_v1_unfollow") {
            const id = parsed.params[0]
            if (subscriptions.has(id)) {
              subscriptions.delete(id)
              await innerProvider.unsubscribe(
                "chainHead_v1_followEvent",
                "chainHead_v1_unfollow",
                id,
              )
            }
          } else {
            onMessage(
              JSON.stringify({
                jsonrpc: "2.0",
                id: parsed.id,
                result: await innerProvider.send(parsed.method, parsed.params),
              }),
            )
          }
        },
        disconnect: () => {
          nActiveClients--
          const subscriptionsCopy = [...subscriptions]
          subscriptions.clear()
          Promise.all(
            [...subscriptionsCopy].map((id) =>
              innerProvider.unsubscribe(
                "chainHead_v1_followEvent",
                "chainHead_v1_follow",
                id,
              ),
            ),
          )
            .catch(noop)
            .then(() => chain.close().then(() => innerProvider.disconnect()))
            .then(() => (!nActiveClients ? destroyWorker() : null))
            .catch(noop)
        },
      }
    }
  })

const ENDPOINT = "wss://rpc.ibp.network/paseo"
const BLOCK =
  "0x446a006b992b7a760f718f0f7040aa94a10f8c329b46af7315ea7947fac2691e"

export const getChopsticksProvider = () =>
  createProvider(ENDPOINT, { block: BLOCK })
