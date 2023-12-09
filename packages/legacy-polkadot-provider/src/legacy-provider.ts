import {
  InjectedAccount,
  InjectedExtension,
  getAccountsChainFns,
  getAllAccounts$,
  getSigner,
} from "./accounts"
import { Chain, PolkadotProvider } from "./types/polkadot-provider"
import { SignerPayloadJSON } from "./types/internal-types"
import { getTxCreator } from "./get-tx-creator"
import { CreateTxCallback, UserSignedExtensions } from "./types/public-types"
import { knownChainsData } from "./known-chain-data"
import { getChainProps } from "./get-chain-props"
import { Observable, Subject } from "rxjs"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import type { ScClient } from "@substrate/connect"
import { getScProvider, WellKnownChain } from "./ScProvider"
import { Signer } from "@polkadot/api/types"

const createChain =
  (
    getProvider: (chain: WellKnownChain | string) => ConnectProvider,
    onCreateTx: CreateTxCallback,
    signPayload: (payload: SignerPayloadJSON) => Promise<{ signature: string }>,
    allAccounts$: Observable<InjectedAccount[]>,
  ) =>
  ({
    chain,
    chainId,
    name,
    ss58Format,
    decimals,
    symbol,
  }: {
    chain: WellKnownChain | string
    chainId: string
    name: string
    ss58Format: number
    decimals: number
    symbol: string
  }): Chain => {
    const connect = getTxCreator(getProvider(chain), onCreateTx, signPayload)

    return {
      chainId,
      name,
      ss58Format,
      connect,
      decimals,
      symbol,
      ...getAccountsChainFns(chainId, ss58Format, allAccounts$),
    }
  }

const defaultOnCreateTx: CreateTxCallback = (
  { userSingedExtensionsName },
  callback,
) => {
  const userSignedExtensionsData = Object.fromEntries(
    userSingedExtensionsName.map((x) => {
      if (x === "CheckMortality") {
        const result: UserSignedExtensions["CheckMortality"] = {
          mortal: true,
          period: 64,
        }
        return [x, result]
      }

      if (x === "ChargeTransactionPayment") return [x, 0n]
      return [x, { tip: 0n }]
    }),
  )

  callback(userSignedExtensionsData)
}

const _getInjectedExtensions = async (nTries = 0): Promise<string[]> => {
  const { injectedWeb3 } = window
  if (injectedWeb3) return Object.keys(injectedWeb3)
  if (nTries > 3) return []

  await new Promise((res) => {
    setTimeout(res, 250 * nTries)
  })
  return _getInjectedExtensions(nTries + 1)
}

const getInjectedExtension = async (
  name: string,
): Promise<InjectedExtension | undefined> => {
  let entry = window.injectedWeb3?.[name]

  if (!entry) {
    await _getInjectedExtensions()
    entry = window.injectedWeb3?.[name]
    if (!entry) return undefined
  }

  return entry.enable()
}

export const getInjectedExtensions = () => _getInjectedExtensions()

export const getLegacyProvider = (
  scClient: ScClient,
  onCreateTx: CreateTxCallback = defaultOnCreateTx,
): {
  connectAccounts: (extensionName: string | null) => Promise<boolean>
  provider: PolkadotProvider
} => {
  let signer: Promise<NonNullable<Signer["signPayload"]>> | null = null

  const injectedExtensions$ = new Subject<
    Promise<InjectedExtension | undefined> | undefined
  >()

  const connectAccounts = async (name: string | null): Promise<boolean> => {
    if (name === null) {
      signer = null
      injectedExtensions$.next(undefined)
      return true
    }

    const injectedExtension = getInjectedExtension(name)
    signer = getSigner(injectedExtension)
    injectedExtensions$.next(injectedExtension)

    const result = await injectedExtension
    return !!result
  }

  const allAccounts$ = getAllAccounts$(injectedExtensions$)

  const signPayload = async (payload: SignerPayloadJSON) => {
    if (!signer) throw new Error("Missing signer")

    const s = await signer
    return s(payload as any)
  }

  const getProvider = getScProvider(scClient)
  const chainCreator = createChain(
    getProvider,
    onCreateTx,
    signPayload,
    allAccounts$ as any,
  )
  const chainsArray = Object.values(knownChainsData).map(chainCreator)
  const chains = Object.fromEntries(chainsArray.map((c) => [c.chainId, c]))

  return {
    connectAccounts,
    provider: {
      getChains: () => chains,
      getChain: async (chainSpec: string) =>
        chainCreator(await getChainProps(chainSpec, getProvider)),
    },
  }
}
