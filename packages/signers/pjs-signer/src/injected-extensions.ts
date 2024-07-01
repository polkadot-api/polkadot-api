import { AccountId } from "@polkadot-api/substrate-bindings"
import { getPolkadotSignerFromPjs } from "./from-pjs-account"
import type { SignerPayloadJSON } from "./types"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"

declare global {
  interface Window {
    injectedWeb3?: InjectedWeb3
  }
}
export type InjectedWeb3 = Record<
  string,
  | {
      enable: () => Promise<PjsInjectedExtension>
    }
  | undefined
>

export type KeypairType = "ed25519" | "sr25519" | "ecdsa"
const supportedAccountTypes = new Set<KeypairType>([
  "ed25519",
  "sr25519",
  "ecdsa",
])

interface InjectedAccount {
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

export interface InjectedPolkadotAccount {
  polkadotSigner: PolkadotSigner
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

interface PjsInjectedExtension {
  signer: {
    signPayload: (
      payload: SignerPayloadJSON,
    ) => Promise<{ signature: string; signedTransaction?: string | Uint8Array }>
  }
  accounts: {
    get: () => Promise<InjectedPolkadotAccount[]>
    subscribe: (cb: (accounts: InjectedPolkadotAccount[]) => void) => () => void
  }
}

const getPublicKey = AccountId().enc

export interface InjectedExtension {
  name: string
  getAccounts: () => InjectedPolkadotAccount[]
  subscribe: (cb: (accounts: InjectedPolkadotAccount[]) => void) => () => void
  disconnect: () => void
}

export const connectInjectedExtension = async (
  name: string,
): Promise<InjectedExtension> => {
  let entry = window.injectedWeb3?.[name]

  if (!entry) throw new Error(`Unavailable extension: "${name}"`)

  const enabledExtension = await entry.enable()
  const signPayload = enabledExtension.signer.signPayload.bind(
    enabledExtension.signer,
  )

  const toPolkadotInjected = (
    accounts: InjectedAccount[],
  ): InjectedPolkadotAccount[] =>
    accounts
      .filter(({ type }) => supportedAccountTypes.has(type!))
      .map((x) => {
        const polkadotSigner = getPolkadotSignerFromPjs(
          getPublicKey(x.address),
          signPayload,
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

export const getInjectedExtensions = (): null | Array<string> => {
  const { injectedWeb3 } = window
  return injectedWeb3 ? Object.keys(injectedWeb3) : null
}
