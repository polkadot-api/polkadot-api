import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
  fixUnorderedBlocks,
  fixChainSpec,
} from "./parsed-enhancers"

const withPolkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedBlocks,
  fixChainSpec,
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
