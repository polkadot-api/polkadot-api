import { ChainHead } from "@polkadot-api/substrate-client"

export const limitOperationsEnhancer =
  (_ = 16) =>
  (base: ChainHead): ChainHead => {
    return base
  }
