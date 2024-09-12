import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
  fixUnorderedBlocks,
  fixChainSpec,
  fixDescendantValues,
} from "./parsed-enhancers"

const withPolkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedBlocks,
  fixChainSpec,
  fixDescendantValues,
)

export * from "./parsed"
export {
  withPolkadotSdkCompat,
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedBlocks,
  fixDescendantValues,
}
