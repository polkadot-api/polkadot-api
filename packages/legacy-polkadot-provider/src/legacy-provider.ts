import {
  InjectedExtension,
  getAccountsChainFns,
  getAllAccounts$,
  getSigner,
} from "./accounts"
import { ChainData, Parachain, RelayChain } from "./types/polkadot-provider"
import { SignerPayloadJSON } from "./types/internal-types"
import { getTxCreator } from "./get-tx-creator"
import { CreateTxCallback, UserSignedExtensions } from "./types/public-types"
import { knownChainsData } from "./known-chain-data"
import { getChainProps } from "./get-chain-props"
import { Subject } from "rxjs"
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import type { ScClient } from "@substrate/connect"
import { getScProvider, WellKnownChain } from "./ScProvider"
import { Signer } from "@polkadot/api/types"
import { mapObject } from "@polkadot-api/utils"

const defaultOnCreateTx: CreateTxCallback = (
  {
    userSingedExtensionsName,
    hintedSignedExtensions: { mortality, tip, asset },
  },
  callback,
) => {
  const userSignedExtensionsData = Object.fromEntries(
    userSingedExtensionsName.map((x) => {
      if (x === "CheckMortality") {
        const result: UserSignedExtensions["CheckMortality"] = mortality ?? {
          mortal: true,
          period: 64,
        }
        return [x, result]
      }

      if (x === "ChargeTransactionPayment") return [x, tip ?? 0n]

      return [x, { tip: tip ?? 0n, asset }]
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
  relayChains: Record<WellKnownChain, RelayChain>
  getSoloChain: (chainSpec: string) => Promise<RelayChain>
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

  const parachainCreator =
    (addParachain: (input: string) => ConnectProvider) =>
    (chainspec: string): Parachain => {
      const parachainProvider = addParachain(chainspec)
      const parachainData = getChainProps(parachainProvider)

      return {
        connect: getTxCreator(parachainProvider, onCreateTx, signPayload),
        ...getAccountsChainFns(parachainData, allAccounts$),
        chainData: parachainData,
      }
    }

  const relayChainCreator = (
    chainData: ChainData,
    provider: ConnectProvider,
    addParachain: (input: string) => ConnectProvider,
  ): RelayChain => {
    return {
      connect: getTxCreator(provider, onCreateTx, signPayload),
      chainData,
      ...getAccountsChainFns(Promise.resolve(chainData), allAccounts$),
      getParachain: parachainCreator(addParachain),
    }
  }

  const relayChains: Record<WellKnownChain, RelayChain> = mapObject(
    WellKnownChain,
    (id: WellKnownChain) => {
      const chainData = knownChainsData[id]
      const { provider, addParachain } = getProvider(chainData.chain)
      return relayChainCreator(chainData, provider, addParachain)
    },
  )

  return {
    connectAccounts,
    relayChains,
    getSoloChain: async (chainSpec: string) => {
      const { provider, addParachain } = getProvider(chainSpec)
      return relayChainCreator(
        await getChainProps(provider),
        provider,
        addParachain,
      )
    },
  }
}
