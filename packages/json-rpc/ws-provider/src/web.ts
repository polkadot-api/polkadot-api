import { getLegacyWsProvider } from "./legacy-provider"

export * from "./types-common"
export * from "./types-legacy"

/**
 * @deprecated This export will be removed in PAPI v2. Migrate as follows:
 *             `import { getWsProvider } from "polkadot-api/ws-provider"
 */
export const getWsProvider = getLegacyWsProvider(WebSocket)
