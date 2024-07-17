import { chainHead, chainSpec, transaction } from "@/methods"
import { ParsedJsonRpcEnhancer } from "@/parsed"

const jsonRpcMsg = <T extends {}>(msg: T) => ({
  jsonrpc: "2.0",
  ...msg,
})

const [transactionGroup] = transaction.stop.split("_")
const unstable = "unstable"
const rpcMethods = "rpc_methods"
const RPC_METHODS_ID = "__INTERNAL_ID"

export const translate: ParsedJsonRpcEnhancer = (base) => {
  return (originalOnMsg) => {
    let isRunning = true
    let bufferedMsgs: Array<{ id: string; method: string; params: string }> = []

    let _onMsg: (msg: any) => void = () => {}
    let _send = (msg: any) => {
      bufferedMsgs.push(msg)
    }
    const { send: originalSend, disconnect } = base((msg: any) => {
      _onMsg(msg)
    })

    new Promise<string[]>((res) => {
      _onMsg = ({
        id,
        result,
      }: {
        id: string
        result: { methods: string[] }
      }) => {
        if (id == RPC_METHODS_ID) res(result.methods)
      }
    }).then((methods) => {
      if (!isRunning) {
        _send = () => {}
        return
      }

      const methodsSet = new Set(methods)
      const methodMappings: Record<string, string | null> = {}

      ;[chainHead, chainSpec, transaction].forEach((obj) => {
        Object.values(obj).forEach((method) => {
          if (methodsSet.has(method)) {
            methodMappings[method] = method
          } else {
            const [group, , name] = method.split("_")
            const unstableMethod = `${group}_${unstable}_${name}`
            if (methodsSet.has(unstableMethod)) {
              methodMappings[method] = unstableMethod
              methodsSet.delete(unstableMethod)
              methodsSet.add(method)
            } else {
              methodMappings[method] = null
              if (group === transactionGroup) {
                let mapped: string | undefined
                const txGroup = [
                  transactionGroup + "Watch",
                  transactionGroup,
                ].find((group) =>
                  ["v1", unstable].find((v) =>
                    methodsSet.has((mapped = `${group}_${v}_${method}`)),
                  ),
                )
                if (txGroup) {
                  methodMappings[method] = mapped!
                  methodsSet.add(method)
                }
              }
            }
          }
        })
      })

      _onMsg = originalOnMsg
      const enhancedSend = ({
        method,
        ...rest
      }: {
        method: string
        id: string
      }) => {
        if (method === rpcMethods) {
          Promise.resolve().then(() => {
            originalOnMsg(
              jsonRpcMsg({
                id: rest.id,
                result: { methods: [...methodsSet] },
              }),
            )
          })
          return
        }

        const mapping = methodMappings[method]
        if (mapping === null)
          Promise.resolve().then(() => {
            originalOnMsg({
              error: { code: -32603, message: `Unexisting method: ${method}` },
              id: rest.id,
            })
          })
        else
          originalSend({
            method: mapping || method,
            ...rest,
          })
      }

      for (let i = 0; isRunning && i < bufferedMsgs.length; i++)
        enhancedSend(bufferedMsgs[i])
      bufferedMsgs = []
      if (isRunning) _send = enhancedSend
    })

    originalSend(
      jsonRpcMsg({
        id: RPC_METHODS_ID,
        method: rpcMethods,
        params: [],
      }),
    )

    return {
      send: (msg) => {
        _send(msg)
      },
      disconnect() {
        isRunning = false
        _send = _onMsg = () => {}
        bufferedMsgs = []
        disconnect()
      },
    }
  }
}
