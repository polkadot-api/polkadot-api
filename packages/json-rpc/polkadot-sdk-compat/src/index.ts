import { parsed } from "./parsed"
import {
  translate,
  unpinHash,
  patchChainHeadEvents,
  fixUnorderedEvents,
  fixUnorderedBlocks,
  fixChainSpec,
  fixDescendantValues,
  fixPrematureBlocks,
} from "./parsed-enhancers"
import * as methods from "./methods"
export { methods }

const withPolkadotSdkCompat = parsed(
  translate,
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixPrematureBlocks,
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
  fixPrematureBlocks,
}
