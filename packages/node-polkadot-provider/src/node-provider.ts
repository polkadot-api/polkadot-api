import { Chain, JsonRpcProvider } from "./types/polkadot-provider"
import { GetChainArgs } from "./types/public-types"
import { UserSignedExtensions, getTxCreator } from "@polkadot-api/tx-helper"
import { equals } from "./bytes"
import { toHex } from "@polkadot-api/utils"

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
  customizeTx = async () => ({}),
  onCreateTxError = () => {},
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
    const txCreator = getTxCreator(chainProvider, async (ctx, cb) => {
      try {
        const userCustomizations = await customizeTx(ctx)
        const userSignedExtensionsData = Object.fromEntries(
          ctx.userSingedExtensionsName.map((x) => [
            x,
            userSignedExtensionDefaults[x] ?? defaultUserSignedExtensions[x],
          ]),
        ) as any

        const keypair = keyring
          .getPairs()
          .find((kp) => equals(kp.publicKey, ctx.from))
        if (keypair) {
          cb({
            overrides: {
              ...(userCustomizations.overrides ?? {}),
            },
            userSignedExtensionsData: {
              ...userSignedExtensionsData,
              ...((userCustomizations.userSignedExtensionsData as any) ?? {}),
            },
            signingType: keypair.signingType,
            signer: keypair.sign,
          })
        } else {
          onCreateTxError(
            ctx,
            new Error(`${toHex(ctx.from)} doesn't exist in keyring`),
          )
          cb(null)
        }
      } catch (err) {
        onCreateTxError(ctx, err as Error)
        cb(null)
      }
    })

    const createTx: JsonRpcProvider["createTx"] = async (from, callData) =>
      txCreator.createTx(from, callData)

    return {
      createTx,
      send: provider.send,
      disconnect() {
        txCreator.destroy()
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
