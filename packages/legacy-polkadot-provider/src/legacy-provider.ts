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
import { Observable } from "rxjs"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import type { ScClient } from "@substrate/connect"
import { getScProvider, WellKnownChain } from "./ScProvider"

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
  }: {
    chain: WellKnownChain | string
    chainId: string
    name: string
    ss58Format: number
  }): Chain => {
    const connect = getTxCreator(getProvider(chain), onCreateTx, signPayload)

    return {
      chainId,
      name,
      connect,
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

const getInjectedExtension = async (
  name: string,
): Promise<InjectedExtension | undefined> => {
  if (!window.injectedWeb3) {
    await new Promise((res) => {
      setTimeout(res, 0)
    })
    return getInjectedExtension(name)
  }

  const entry = window.injectedWeb3[name]
  if (!entry) return undefined

  return entry.enable()
}

export const getLegacyProvider = (
  scClient: ScClient,
  onCreateTx: CreateTxCallback = defaultOnCreateTx,
  name: string = "polkadot-js",
): PolkadotProvider => {
  const injectedExtension = getInjectedExtension(name)

  const allAccounts$ = getAllAccounts$(injectedExtension)

  const signer = getSigner(injectedExtension)
  const signPayload = (payload: SignerPayloadJSON) =>
    signer.then((s) => s(payload as any))

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
    getChains: () => chains,
    getChain: async (chainSpec: string) =>
      chainCreator(await getChainProps(chainSpec, getProvider)),
  }
}
