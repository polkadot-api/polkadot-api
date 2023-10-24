import { V14 } from "@polkadot-api/substrate-bindings"
import { UserSignedExtensionName, UserSignedExtensionsInput } from "./types"
import { getObservableClient } from "@polkadot-api/client"
import { Observable } from "rxjs"

export interface ChainExtensionCtx {
  from: Uint8Array
  callData: Uint8Array
  metadata: V14
  at: string
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>
}

export interface SignedExtension {
  extra: Observable<Uint8Array>
  additional: Observable<Uint8Array>
}

export type GetChainSignedExtension = (
  ctx: ChainExtensionCtx,
) => SignedExtension

export type GetUserSignedExtension<K extends UserSignedExtensionName> = (
  input$: Observable<UserSignedExtensionsInput<K>>,
  ctx: ChainExtensionCtx,
) => {
  extra: Observable<Uint8Array>
  additional: Observable<Uint8Array>
}
