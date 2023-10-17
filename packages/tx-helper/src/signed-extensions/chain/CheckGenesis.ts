import type { GetChainSignedExtension } from "@/internal-types"
import { empty$, genesisHashFromCtx } from "../utils"

export const CheckGenesis: GetChainSignedExtension = (ctx) => ({
  additional: genesisHashFromCtx(ctx),
  extra: empty$,
})
