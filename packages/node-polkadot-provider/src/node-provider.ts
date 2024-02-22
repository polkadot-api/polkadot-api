import { Connect, JsonRpcProvider } from "./types/json-rpc-provider"
import {
  CreateTxContext,
  CustomizeTxResult,
  GetChainArgs,
  KeyPair,
} from "./types/public-types"
import {
  UserSignedExtensionName,
  UserSignedExtensions,
  getTxCreator,
} from "@polkadot-api/tx-helper"
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
  provider: getProvider,
  keyring,
  txCustomizations = defaultUserSignedExtensions,
}: GetChainArgs): Connect => {
  const getUserSignedExtensionDefaults = () => {
    if (typeof txCustomizations === "object") {
      return txCustomizations
    }

    return {}
  }

  const keyringRecord: Record<string, KeyPair> = Object.fromEntries(
    keyring.map((x) => [toHex(x.publicKey), x]),
  )

  const getCustomizeTx = (): (<T extends Array<UserSignedExtensionName>>(
    ctx: CreateTxContext,
  ) => Promise<Partial<CustomizeTxResult<T>> | null>) => {
    if (typeof txCustomizations === "function") {
      return txCustomizations
    }

    return async () => ({})
  }

  return (onMessage) => {
    const provider = getProvider(onMessage)

    const txCreator = getTxCreator(getProvider, async (ctx, cb) => {
      const customizeTx = await getCustomizeTx()(ctx)
      if (!customizeTx) {
        cb(null)
        return
      }

      const {
        userSingedExtensionsName,
        hintedSignedExtensions: { mortality, tip, asset },
      } = ctx
      const userSignedExtensionDefaults = getUserSignedExtensionDefaults()

      const userSignedExtensionsData = Object.fromEntries(
        userSingedExtensionsName.map((x) => {
          const def = userSignedExtensionDefaults[x]
          if (x === "CheckMortality") {
            const result: UserSignedExtensions["CheckMortality"] = mortality ??
              (def as any) ?? {
                mortal: true,
                period: 64,
              }
            return [x, result]
          }

          if (x === "ChargeTransactionPayment")
            return [x, tip ?? (def as bigint) ?? 0n]

          return [
            x,
            {
              tip: tip ?? ((def as any).tip as bigint) ?? 0n,
              asset: asset ?? ((def as any).asset as Uint8Array | undefined),
            },
          ]
        }),
      )

      const fromAsHex = toHex(ctx.from)
      const keypair = keyringRecord[fromAsHex]

      if (!keypair) {
        throw new Error(`${fromAsHex} doesn't exist in keyring`)
      }

      cb({
        overrides: {
          ...(customizeTx.overrides ?? {}),
        },
        userSignedExtensionsData: {
          ...userSignedExtensionsData,
          ...((customizeTx.userSignedExtensionsData as any) ?? {}),
        },
        signingType: keypair.signingType,
        signer: keypair.sign,
      })
    })

    const createTx: JsonRpcProvider["createTx"] = async (
      from,
      callData,
      hinted,
    ) => txCreator.createTx(from, callData, hinted)

    return {
      createTx,
      send: provider.send,
      disconnect() {
        txCreator.destroy()
      },
    }
  }
}
