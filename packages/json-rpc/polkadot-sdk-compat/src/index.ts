import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
  fixUnorderedBlocks,
} from "./parsed-enhancers"

const withPolkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedBlocks,
)

export * from "./parsed"
export {
  withPolkadotSdkCompat,
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedBlocks,
}
