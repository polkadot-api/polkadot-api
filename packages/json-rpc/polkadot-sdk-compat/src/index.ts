import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
} from "./parsed-enhancers"

const polkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
)
export default polkadotSdkCompat

export * from "./parsed"
export { translate, fixUnorderedEvents, unpinHash, patchChainHeadEvents }
