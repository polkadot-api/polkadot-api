import { Whitelist } from "@polkadot-api/cli"
import { wnd } from "@polkadot-api/descriptors"

export const whitelist: Whitelist<typeof wnd> = [
  "tx.Balances.transfer_keep_alive",
]
