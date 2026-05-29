import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { TxCreatorEnhancer } from "../types"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { extensions } from "./extensions"
import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"

export type CommonOpts = {
  /**
   * Tip in fundamental units. Default: `0`
   */
  tip?: bigint
  /**
   * Asset to pay fees with. Default: `None`
   */
  asset?: unknown
  /**
   * Mortality of the transaction.
   * If no `at` is passed, transaction will be alive for, at least, `period`
   * number of blocks after the current best block height.
   * If `at` is passed, transaction will be alive for `period` number of blocks
   * after `at`.
   *
   * Default: `{ mortal: true, period: 20 }`
   */
  mortality?:
    | { mortal: false }
    | { mortal: true; period: number; at?: { hash: string; number: number } }
}

export const withCommonExtensions: TxCreatorEnhancer<CommonOpts> =
  (innerFactory) =>
  ({ txCreatorBindings }) => {
    const inner = innerFactory({ txCreatorBindings })
    return async (payload, opts, mocked) => {
      const lookupFn = getLookupFn(
        unifyMetadata(decAnyMetadata(payload.context.metadata)),
      )
      const builder = getDynamicBuilder(lookupFn)
      const exts = Object.values(lookupFn.metadata.extrinsic.extensions)
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
      return inner({ ...payload, extensions: encoded }, opts, mocked)
    }
  }
