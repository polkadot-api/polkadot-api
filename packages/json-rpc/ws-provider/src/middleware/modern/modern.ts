import { ParsedJsonRpcEnhancer } from "../types"
import { followEnhancer } from "./fix-follow"
import { fixChainSpec } from "./chain-spec"
import { fixDescendantValues } from "./fix-descendant-values"
import { fixPrematureBlocks } from "./fix-premature-blocks"
import { fixUnorderedBlocks } from "./fix-unordered-blocks"
import { fixUnorderedEvents } from "./fix-unordered-events"
import { patchChainHeadEvents } from "./patch-chainhead-events"
import { unpinHash } from "./unpin-hash"

const middlewares = [
  fixUnorderedEvents,
  unpinHash,
  patchChainHeadEvents,
  fixPrematureBlocks,
  fixUnorderedBlocks,
  fixChainSpec,
  fixDescendantValues,
  followEnhancer,
]

export const modern: ParsedJsonRpcEnhancer = (base) =>
  middlewares.reduce((a, b) => b(a), base)
