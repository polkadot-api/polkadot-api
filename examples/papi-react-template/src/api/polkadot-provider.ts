import { getLegacyProvider } from "@polkadot-api/legacy-polkadot-provider"
import { createScClient } from "@substrate/connect"

export const { relayChains, connectAccounts } =
  getLegacyProvider(createScClient())
