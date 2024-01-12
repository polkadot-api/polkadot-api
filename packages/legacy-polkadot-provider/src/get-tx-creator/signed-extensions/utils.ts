import { of } from "rxjs"
import { V14 } from "@polkadot-api/substrate-bindings"
import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import type { ChainExtensionCtx } from "@/types/internal-types"

export const empty$ = of(new Uint8Array())

export const genesisHashFromCtx = (ctx: ChainExtensionCtx) =>
  ctx.chainHead.storage$(
    ctx.at,
    "value",
    (ctx) => ctx.dynamicBuilder.buildStorage("System", "BlockHash").enc(0),
    null,
  )

export const systemVersionProp = (propName: string, metadata: V14) => {
  const lookupFn = getLookupFn(metadata.lookup)
  const dynamicBuilder = getDynamicBuilder(metadata)

  const constant = metadata.pallets
    .find((x) => x.name === "System")!
    .constants!.find((s) => s.name === "Version")!

  const systemVersion = lookupFn(constant.type)
  const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec

  if (systemVersion.type !== "struct") throw new Error("not a struct")

  const valueEnc = dynamicBuilder.buildDefinition(
    systemVersion.value[propName].id,
  ).enc

  const dec = systemVersionDec(constant.value)[propName]
  const enc = valueEnc(dec)

  return { dec, enc }
}
