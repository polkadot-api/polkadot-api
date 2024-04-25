import type { ClientRequest } from "@/client"
import { UnsubscribeFn } from "./common-types"
import { noop } from "./internal-utils"

export const getCompatibilityEnhancer =
  <T, E>(rpcMethodsP: Promise<Set<string>>, request: ClientRequest<T, E>) =>
  (methods: Record<string, string>): ClientRequest<T, E> => {
    let translations: Record<string, string> = {}
    let enhancedRequest: ClientRequest<T, E> | null = null

    return ((method, ...rest) => {
      if (enhancedRequest) return enhancedRequest(method, ...rest)

      let isRunning = true
      let cleanup: UnsubscribeFn = () => {
        isRunning = false
      }

      rpcMethodsP
        .then((rpcMethods) => {
          enhancedRequest = (method_, ...iRest) => {
            const method = translations[method_] ?? method_
            if (rpcMethods.has(method)) return request(method, ...iRest)
            iRest[1]?.onError(new Error(`Unsupported method ${method}`))
            return noop
          }

          if (rpcMethods.has(method)) return

          const parts = method.split("_")
          if (parts[1] !== "v1") return

          parts[1] = "unstable"

          if (rpcMethods.has(parts.join("_")))
            Object.values(methods).forEach((value) => {
              translations[value] = value.replace("_v1_", "_unstable_")
            })
          else if (parts[0] === "transaction") {
            // old versions of smoldot and Polkadot-SDK don't support transaction_xx_broadcast
            // some old versions have `transactions_unstable_submitAndWatch` while others have `transaction_xx_submitAndWatch`
            // if we find any of this options, then we will can use them as if they were broadast/stop
            let unwatch: string | undefined
            let version: string | undefined

            const txGroup = ["transactionWatch", "transaction"].find(
              (group) => {
                version = ["v1", "unstable"].find((v) =>
                  rpcMethods.has((unwatch = `${group}_${v}_unwatch`)),
                )
                return !!version
              },
            )

            if (txGroup) {
              translations[methods.broadcast] =
                `${txGroup}_${version}_submitAndWatch`
              translations[methods.stop] = unwatch!
            }
          }
        })
        .then(() => {
          if (isRunning) cleanup = enhancedRequest!(method, ...rest)
        })

      return () => {
        cleanup()
      }
    }) as ClientRequest<T, E>
  }
