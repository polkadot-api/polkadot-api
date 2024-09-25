import { StringRecord } from "scale-ts"
import { InkMetadata } from "./metadata-types"

export interface InkDescriptors<
  S,
  M extends InkCallableDescriptor,
  C extends InkCallableDescriptor,
> {
  metadata: InkMetadata
  __types: {
    storage: S
    messages: M
    constructors: C
  }
}

export type InkCallableDescriptor = Record<
  string,
  {
    message: StringRecord<unknown>
    response: StringRecord<unknown>
  }
>
