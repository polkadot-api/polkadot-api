import { V15 } from "@polkadot-api/substrate-bindings"
import { UserSignedExtensionName, UserSignedExtensionsInput } from "./types"
import { getObservableClient } from "@polkadot-api/client"
import { Observable } from "rxjs"

export interface ChainExtensionCtx {
  from: Uint8Array
  callData: Uint8Array
  metadata: V15
  at: string
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>
}

export type SignedExtension = Record<
  "value" | "additionalSigned",
  Observable<Uint8Array>
>

export type FlattenSignedExtension = Observable<{
  value: Uint8Array
  additionalSigned: Uint8Array
}>

export type GetChainSignedExtension = (
  ctx: ChainExtensionCtx,
) => SignedExtension

export type GetUserSignedExtension<K extends UserSignedExtensionName> = (
  input$: Observable<UserSignedExtensionsInput<K>>,
  ctx: ChainExtensionCtx,
) => SignedExtension
