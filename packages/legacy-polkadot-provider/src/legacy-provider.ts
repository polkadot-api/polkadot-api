import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { getAccountsChainFns, getAllAccounts$, getSigner } from "./accounts"
import { Chain, PolkadotProvider } from "./types/polkadot-provider"
import { SignerPayloadJSON } from "./types/internal-types"
import { getTxCreator } from "./get-tx-creator"
import { CreateTxCallback, UserSignedExtensions } from "./types/public-types"
import { knownChainsData } from "./known-chain-data"
import { getChainProps } from "./get-chain-props"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { Observable } from "rxjs"

const createChain =
  (
    onCreateTx: CreateTxCallback,
    signPayload: (payload: SignerPayloadJSON) => Promise<{ signature: string }>,
    allAccounts$: Observable<InjectedAccountWithMeta[]>,
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
    const connect = getTxCreator(ScProvider(chain), onCreateTx, signPayload)

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

export const getLegacyProvider = (
  onCreateTx: CreateTxCallback = defaultOnCreateTx,
  name: string = "polkadot-js",
): PolkadotProvider => {
  const signer = getSigner(name)
  const allAccounts$ = getAllAccounts$(name)

  const signPayload = (payload: SignerPayloadJSON) =>
    signer.then((s) => s(payload as any))

  const chainCreator = createChain(onCreateTx, signPayload, allAccounts$ as any)
  const chainsArray = Object.values(knownChainsData).map(chainCreator)
  const chains = Object.fromEntries(chainsArray.map((c) => [c.chainId, c]))

  return {
    getChains: () => chains,
    getChain: async (chainSpec: string) =>
      chainCreator(await getChainProps(chainSpec)),
  }
}
