import { followEnhancer } from "./fix-follow"
import { fixDescendantValues } from "./fix-descendant-values"
import { fixPrematureBlocks } from "./fix-premature-blocks"
import { fixUnorderedBlocks } from "./fix-unordered-blocks"
import { fixUnorderedEvents } from "./fix-unordered-events"
import { patchChainHeadEvents } from "./patch-chainhead-events"
import { unpinHash } from "./unpin-hash"
import { apply } from "../utils"

export const modern = apply(
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixPrematureBlocks,
  fixUnorderedBlocks,
  fixDescendantValues,
  followEnhancer,
)
