import { combineLatest, map, mergeMap, of } from "rxjs"
import {
  Bytes,
  Storage,
  enhanceEncoder,
  u16,
  u32,
  u8,
} from "@polkadot-api/substrate-bindings"
import { fromHex } from "@polkadot-api/utils"
import type { GetUserSignedExtension } from "@/internal-types"
import { genesisHashFromCtx } from "../utils"

function trailingZeroes(n: number) {
  let i = 0
  while (!(n & 1)) {
    i++
    n >>= 1
  }
  return i
}

const mortal = enhanceEncoder(
  Bytes(2).enc,
  (value: { period: number; phase: number }) => {
    const factor = Math.max(value.period >> 12, 1)
    const left = Math.min(Math.max(trailingZeroes(value.period) - 1, 1), 15)
    const right = (value.phase / factor) << 4
    return u16.enc(left | right)
  },
)

const SystemNumber = Storage("System")("Number", u32.dec)
const SystemNumberKey = SystemNumber.enc()

export const CheckMortality: GetUserSignedExtension<"CheckMortality"> = (
  userInput$,
  ctx,
) => {
  const blockNumber$ = ctx.chainHead
    .storage$(ctx.at, "value", SystemNumberKey, null)
    .pipe(map((x) => SystemNumber.dec(x!)))

  return {
    additionalSigned: userInput$.pipe(
      mergeMap((input) =>
        input.mortal ? of(fromHex(ctx.at)) : genesisHashFromCtx(ctx),
      ),
    ),
    value: combineLatest([userInput$, blockNumber$]).pipe(
      map(([input, blockNumber]) =>
        input.mortal
          ? mortal({
              period: input.period,
              phase: blockNumber % input.period,
            })
          : u8.enc(0),
      ),
    ),
  }
}
