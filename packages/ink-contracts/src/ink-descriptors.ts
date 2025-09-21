import { InkMetadata } from "./metadata-types"

export type Event = { type: string; value: unknown }

export interface InkDescriptors<
  S extends InkStorageDescriptor,
  M extends InkCallableDescriptor,
  C extends InkCallableDescriptor,
  E extends Event,
> {
  metadata?: InkMetadata
  abi?: unknown
  __types: {
    storage: S
    messages: M
    constructors: C
    event: E
  }
}

export type InkCallableDescriptor = Record<
  string,
  {
    message: unknown
    response: unknown
    default?: boolean
    payable?: boolean
    mutates?: boolean
  }
>

export type InkStorageDescriptor = Record<
  string,
  {
    key: unknown
    value: unknown
  }
>
