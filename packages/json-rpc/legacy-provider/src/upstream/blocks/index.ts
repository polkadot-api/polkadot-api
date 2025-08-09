import type { ClientRequest } from "@polkadot-api/raw-client"
import { getBlocks } from "./blocks"
import { getUpstreamEvents } from "./upstream-events"
import { Observable } from "rxjs"
import { DecentHeader, ShittyHeader } from "@/types"

export const getBlocks$ = (
  request: ClientRequest<any, any>,
  getHeader: (hash: string) => Observable<DecentHeader>,
  fromShittyHeader: (header: ShittyHeader) => DecentHeader,
) => getBlocks(getUpstreamEvents(request, getHeader, fromShittyHeader))
