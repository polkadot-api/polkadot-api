import { map } from "rxjs"
import type { GetChainSignedExtension } from "@/types/internal-types"
import { genesisHashFromCtx } from "../utils"
import { fromHex } from "@polkadot-api/utils"

export const CheckGenesis: GetChainSignedExtension = (ctx) =>
  genesisHashFromCtx(ctx).pipe(
    map((genesisHash) => ({
      additional: fromHex(genesisHash!),
      extra: new Uint8Array(),
      pjs: { genesisHash: genesisHash! },
    })),
  )
