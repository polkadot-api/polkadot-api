import { compactBn } from "@polkadot-api/substrate-bindings"
import { map } from "rxjs"
import type { GetUserSignedExtension } from "@/types/internal-types"

export const ChargeTransactionPayment: GetUserSignedExtension<
  "ChargeTransactionPayment"
> = (user$) =>
  user$.pipe(
    map((val) => ({
      extra: compactBn.enc(val),
      additional: new Uint8Array(),
      pjs: { tip: "0x" + val.toString(16) },
    })),
  )
