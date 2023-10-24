import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { accountsReady, getAccountsChainFns, signer } from "./accounts"
import { Chain, PolkadotProvider } from "./types/polkadot-provider"
import { SignerPayloadJSON } from "./types/internal-types"
import { getTxCreator } from "./get-tx-creator"
import { CreateTxCallback, UserSignedExtensions } from "./types/public-types"
import { knownChainsData } from "./known-chain-data"
import { getChainProps } from "./get-chain-props"

const createChain =
  (
    onCreateTx: CreateTxCallback,
    signPayload: (payload: SignerPayloadJSON) => Promise<{ signature: string }>,
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
      ...getAccountsChainFns(chainId, ss58Format),
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

export const getLegacyProvider = async (
  onCreateTx: CreateTxCallback = defaultOnCreateTx,
): Promise<PolkadotProvider> => {
  const signPayload = (payload: SignerPayloadJSON) =>
    signer.then((s) => s.signPayload!(payload as any))

  const chainCreator = createChain(onCreateTx, signPayload)
  const chainsArray = Object.values(knownChainsData).map(chainCreator)
  const chains = Object.fromEntries(chainsArray.map((c) => [c.chainId, c]))

  await accountsReady
  return {
    getChains: () => chains,
    getChain: async (chainSpec: string) =>
      chainCreator(await getChainProps(chainSpec)),
  }
}
