import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { TxCreatorFactory } from "./types"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { extensions } from "./extensions"
import { TxPayloadV1 } from "@polkadot-api/polkadot-signer"

export const commonTxCreatorFactory: (
  inner: TxCreatorFactory,
) => TxCreatorFactory =
  (innerFactory) =>
  ({ txCreatorBindings }) => {
    const inner = innerFactory({ txCreatorBindings })
    return async (payload, ext) => {
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
                ...(await mapper(
                  txCreatorBindings,
                  payload.context,
                  lookupFn,
                  builder,
                )),
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
      return inner({ ...payload, txExtVersion, extensions: encoded }, ext)
    }
  }
