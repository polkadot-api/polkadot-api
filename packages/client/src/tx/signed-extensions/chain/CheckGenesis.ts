import { map } from "rxjs"
import type { GetChainSignedExtension } from "../internal-types"
import { additionalSigned } from "../utils"
import { fromHex } from "@polkadot-api/utils"

export const CheckGenesis: GetChainSignedExtension = (ctx) =>
  ctx.chainHead.genesis$.pipe(map(fromHex), map(additionalSigned))
