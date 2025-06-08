import { getPolkadotSignerFromModern } from "./from-modern-account"
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

const supportedAccountTypes = new Set<KeypairType | "ethereum">([
  "ed25519",
  "sr25519",
  "ecdsa",
  "ethereum",
])

export const connectInjectedExtension = async (
  name: string,
  dappName?: string,
): Promise<InjectedExtension> => {
  let entry = window.injectedWeb3?.[name]

  if (!entry) throw new Error(`Unavailable extension: "${name}"`)

  const { signer, accounts } = await entry.enable(dappName)

  const signRaw = signer.signRaw.bind(signer)
  const signPayload = signer.signPayload?.bind(signer)
  const signTx = signer.signTx?.bind(signer)
  const createSigner = (x: string) =>
    signTx
      ? getPolkadotSignerFromModern(x, signTx, signRaw)
      : getPolkadotSignerFromPjs(x, signPayload, signRaw)

  const toPolkadotInjected = (
    accounts: InjectedAccount[],
  ): InjectedPolkadotAccount[] =>
    accounts
      .filter(({ type }) => supportedAccountTypes.has(type!))
      .map((x) => ({
        ...x,
        polkadotSigner: createSigner(x.address),
      }))

  let currentAccounts: InjectedPolkadotAccount[] = toPolkadotInjected(
    await accounts.get(),
  )

  const listeners = new Set<(accounts: InjectedPolkadotAccount[]) => void>()
  const stop = accounts.subscribe((x) => {
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
