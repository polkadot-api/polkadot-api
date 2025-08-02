import type { ClientRequest } from "@polkadot-api/raw-client"
import { getBlocks } from "./blocks"
import { getUpstreamEvents } from "./upstream-events"
import { Observable } from "rxjs"
import { DecentHeader } from "@/types"

export const getBlocks$ = (
  request: ClientRequest<any, any>,
  getHeader: (hash: string) => Observable<DecentHeader>,
) => getBlocks(getUpstreamEvents(request, getHeader))
