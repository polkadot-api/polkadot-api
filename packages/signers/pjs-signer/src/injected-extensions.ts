import { TxCreatorChainApi } from "@polkadot-api/signers-common"
import { getTxCreatorFromPjs } from "./from-pjs-account"
import type {
  InjectedAccount,
  InjectedExtension,
  InjectedPolkadotAccount,
  KeypairType,
} from "./types"

export type {
  InjectedAccount,
  InjectedExtension,
  InjectedPolkadotAccount,
  KeypairType,
}

const supportedAccountTypes = new Set<KeypairType | "ethereum">([
  "ed25519",
  "sr25519",
  "ecdsa",
  "ethereum",
])

export const connectInjectedExtension = async (
  api: TxCreatorChainApi,
  name: string,
  dappName?: string,
): Promise<InjectedExtension> => {
  let entry = window.injectedWeb3?.[name]

  if (!entry) throw new Error(`Unavailable extension: "${name}"`)

  const enabledExtension = await entry.enable(dappName)
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
        const txCreator = getTxCreatorFromPjs(
          api,
          x.address,
          signPayload,
          signRaw,
          x.type,
        )
        return {
          ...x,
          txCreator,
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
