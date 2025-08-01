import type { ClientRequest } from "@polkadot-api/raw-client"
import { getBlocks } from "./blocks"
import { getUpstreamEvents } from "./upstream-events"

export const getBlocks$ = (request: ClientRequest<any, any>) =>
  getBlocks(getUpstreamEvents(request))
