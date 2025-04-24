import { wnd, XcmV4Instruction } from "@polkadot-api/descriptors"
import { getTypedCodecs } from "polkadot-api"
import { toHex } from "polkadot-api/utils"

const dotCodecs = await getTypedCodecs(wnd)

const encoded = dotCodecs.tx.XcmPallet.execute.inner.message.inner.V4.enc([
  XcmV4Instruction.Trap(30n),
])

console.log(toHex(encoded))
