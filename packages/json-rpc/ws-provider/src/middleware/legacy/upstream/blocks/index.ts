import type { Observable } from "rxjs"
import type { ClientRequest } from "@polkadot-api/raw-client"
import { getBlocks } from "./blocks"
import { getUpstreamEvents } from "./upstream-events"

export const getBlocks$ = (
  request: ClientRequest<any, any>,
  request$: <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
  ) => Observable<Payload>,
) => getBlocks(getUpstreamEvents(request, request$))
