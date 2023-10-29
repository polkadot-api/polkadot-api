import { Chain } from "./types/polkadot-provider"
import { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { Keyring } from "./types/public-types"
import { UserSignedExtensions, getTxCreator } from "@polkadot-api/tx-helper"
import { equals } from "./bytes"

export type GetChainArgs = {
  chainId: string
  name: string
  keyring: Keyring
  chainProvider: ConnectProvider
  userSignedExtensionDefaults?: Partial<UserSignedExtensions>
}

const defaultUserSignedExtensions: UserSignedExtensions = {
  CheckMortality: {
    mortal: false,
  },
  ChargeTransactionPayment: 0n,
  ChargeAssetTxPayment: {
    tip: 0n,
  },
}

export const getChain = ({
  chainId,
  name,
  chainProvider,
  keyring,
  userSignedExtensionDefaults = defaultUserSignedExtensions,
}: GetChainArgs): Chain => {
  const getAccounts: Chain["getAccounts"] = async () =>
    keyring.getPairs().map((kp) => ({
      address: kp.address,
      publicKey: kp.publicKey,
      displayName: kp.name,
    }))

  const onAccountsChange: Chain["onAccountsChange"] = (accounts) => {
    const unsub = keyring.onKeyPairsChanged(() => getAccounts().then(accounts))

    return () => {
      unsub()
    }
  }

  const connect: Chain["connect"] = (onMessage) => {
    const provider = chainProvider(onMessage)
    const { createTx, destroy } = getTxCreator(
      chainProvider,
      ({ userSingedExtensionsName, from }, callback) => {
        const userSignedExtensionsData = Object.fromEntries(
          userSingedExtensionsName.map((x) => [
            x,
            userSignedExtensionDefaults[x] ?? defaultUserSignedExtensions[x],
          ]),
        ) as any

        const keypair = keyring
          .getPairs()
          .find((kp) => equals(kp.publicKey, from))
        if (keypair) {
          callback({
            overrides: {},
            userSignedExtensionsData,
            signingType: keypair.signingType,
            signer: keypair.sign,
          })
        } else {
          callback(null)
        }
      },
    )

    return {
      createTx,
      send: provider.send,
      disconnect() {
        destroy()
      },
    }
  }

  return {
    chainId,
    name,
    getAccounts,
    onAccountsChange,
    connect,
  }
}
