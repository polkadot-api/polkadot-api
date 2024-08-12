import { getPolkadotSignerFromPjs } from "./from-pjs-account"
import type {
  InjectedAccount,
  InjectedExtension,
  InjectedPolkadotAccount,
  KeypairType,
} from "./types"

export type {
  KeypairType,
  InjectedExtension,
  InjectedAccount,
  InjectedPolkadotAccount,
}

const supportedAccountTypes = new Set<KeypairType>([
  "ed25519",
  "sr25519",
  "ecdsa",
])

export const connectInjectedExtension = async (
  name: string,
): Promise<InjectedExtension> => {
  let entry = window.injectedWeb3?.[name]

  if (!entry) throw new Error(`Unavailable extension: "${name}"`)

  const enabledExtension = await entry.enable()
  const signPayload = enabledExtension.signer.signPayload.bind(
    enabledExtension.signer,
  )
  const signRaw = enabledExtension.signer.signRaw.bind(enabledExtension.signer)

  const toPolkadotInjected = (
    accounts: InjectedAccount[],
  ): InjectedPolkadotAccount[] =>
    accounts
      .filter(({ type }) => supportedAccountTypes.has(type!))
      .map((x) => {
        const polkadotSigner = getPolkadotSignerFromPjs(
          x.address,
          signPayload,
          signRaw,
        )
        return {
          ...x,
          polkadotSigner,
        }
      })

  let currentAccounts: InjectedPolkadotAccount[] = toPolkadotInjected(
    await enabledExtension.accounts.get(),
  )

  const listeners = new Set<(accounts: InjectedPolkadotAccount[]) => void>()
  const stop = enabledExtension.accounts.subscribe((x) => {
    currentAccounts = toPolkadotInjected(x)
    listeners.forEach((cb) => {
      cb(currentAccounts)
    })
  })

  return {
    name,
    getAccounts: () => currentAccounts,
    subscribe: (cb: (accounts: InjectedPolkadotAccount[]) => void) => {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    },
    disconnect: () => {
      stop()
    },
  }
}

export const getInjectedExtensions = (): Array<string> => {
  const { injectedWeb3 } = window
  return injectedWeb3 ? Object.keys(injectedWeb3) : []
}
