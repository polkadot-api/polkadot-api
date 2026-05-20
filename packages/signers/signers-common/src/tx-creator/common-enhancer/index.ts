import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import {
  ChainAwareTxCreatorOptions,
  ResolveTxCreatorOptions,
  TxCreatorChain,
  TxCreatorChainAsset,
  TxCreatorEnhancer,
  TxCreatorFactory,
} from "../types"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { extensions } from "./extensions"
import type { TxCreator, TxPayloadV1 } from "@polkadot-api/polkadot-signer"

type AssetOpts<Asset> = void extends Asset
  ? {}
  : {
      /**
       * Asset information to pay fees, tip, etc.
       * Default: asset selection disabled.
       */
      asset?: Asset
    }

export type CommonOpts<Asset = void> = {
  /**
   * Tip in fundamental units. Default: `0`
   */
  tip?: bigint
  /**
   * Mortality of the transaction.
   * Transaction will be alive for, at least, `period` number of blocks after
   * the current best block height.
   * Default: `{ mortal: true, period: 20 }`
   */
  mortality?: { mortal: false } | { mortal: true; period: number }
} & AssetOpts<Asset>

export interface CommonTxCreatorOptions extends ChainAwareTxCreatorOptions {
  readonly __txCreatorOptions: CommonOpts<
    TxCreatorChainAsset<NonNullable<this["__txCreatorChain"]>>
  >
}

export const withCommonExtensions = (<A>(innerFactory: TxCreatorFactory<A>) =>
  <Chain extends TxCreatorChain>(chain: Chain) => {
    const { txCreatorBindings } = chain
    const inner = innerFactory(chain)
    return (async (payload, opts) => {
      const lookupFn = getLookupFn(
        unifyMetadata(decAnyMetadata(payload.context.metadata)),
      )
      const builder = getDynamicBuilder(lookupFn)
      const txExtVersion = payload.txExtVersion ?? 0
      const exts = lookupFn.metadata.extrinsic.signedExtensions[txExtVersion]
      const encoded: TxPayloadV1["extensions"] = (
        await Promise.all(
          exts.map(async ({ identifier, type, additionalSigned }) => {
            const ext = payload.extensions.find(({ id }) => id === identifier)
            if (ext) {
              // ensure it is decodable with metadata
              try {
                builder.buildDefinition(type).dec(ext.extra)
                builder
                  .buildDefinition(additionalSigned)
                  .dec(ext.additionalSigned)
              } catch {
                throw new Error(`Cannot decode extension. Received ${ext}`)
              }
              return ext
            }
            const mapper = extensions[identifier]
            if (mapper) {
              return {
                id: identifier,
                ...(await mapper({
                  bindings: txCreatorBindings,
                  context: payload.context,
                  lookupFn,
                  dynamicBuilder: builder,
                  opts,
                })),
              }
            }
            // if there is no mapper, try if the extension is optional (or void)
            try {
              const exp = builder.buildDefinition(type).enc(undefined)
              const imp = builder
                .buildDefinition(additionalSigned)
                .enc(undefined)
              return {
                id: identifier,
                extra: toHex(exp),
                additionalSigned: toHex(imp),
              }
            } catch {
              return null
            }
          }),
        )
      ).filter((v) => v != null)
      return inner(
        { ...payload, txExtVersion, extensions: encoded },
        opts as ResolveTxCreatorOptions<A, Chain>,
      )
    }) as TxCreator<
      ResolveTxCreatorOptions<CommonTxCreatorOptions, Chain> &
        ResolveTxCreatorOptions<A, Chain>
    >
  }) as TxCreatorEnhancer<CommonTxCreatorOptions>
