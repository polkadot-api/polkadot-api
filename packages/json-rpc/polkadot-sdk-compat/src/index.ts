import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
} from "./parsed-enhancers"

const withPolkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
)

export * from "./parsed"
export {
  withPolkadotSdkCompat,
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
}
