import {
  ChainDefinition,
  DescriptorEntry,
  PlainDescriptor,
  RuntimeDescriptor,
  StorageDescriptor,
  TxDescriptor,
} from "@/descriptors"
import { ShapedCodec } from "./shaped-codec"

type StorageCodecs<Args extends Array<any>, T> = {
  args: ShapedCodec<Args>
  value: ShapedCodec<T>
}

type ExtractStorageCodec<
  T extends DescriptorEntry<StorageDescriptor<any, any, any, any>>,
> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends StorageDescriptor<
      infer Key,
      infer Value,
      any,
      any
    >
      ? StorageCodecs<Key, Value>
      : unknown
  }
}

type ExtractTxCodec<T extends DescriptorEntry<TxDescriptor<any>>> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends TxDescriptor<infer Args>
      ? ShapedCodec<Args>
      : unknown
  }
}

type ExtractRuntimeCodec<
  T extends DescriptorEntry<RuntimeDescriptor<any, any>>,
> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends RuntimeDescriptor<
      infer Args,
      infer Value
    >
      ? { args: ShapedCodec<Args>; value: ShapedCodec<Value> }
      : unknown
  }
}

type ExtractPlainCodec<T extends DescriptorEntry<PlainDescriptor<any>>> = {
  [K in keyof T]: {
    [KK in keyof T[K]]: T[K][KK] extends PlainDescriptor<infer Value>
      ? ShapedCodec<Value>
      : unknown
  }
}

export type TypedCodecs<T extends ChainDefinition> = {
  query: ExtractStorageCodec<T["descriptors"]["pallets"]["__storage"]>
  tx: ExtractTxCodec<T["descriptors"]["pallets"]["__tx"]>
  event: ExtractPlainCodec<T["descriptors"]["pallets"]["__event"]>
  apis: ExtractRuntimeCodec<T["descriptors"]["apis"]>
  constants: ExtractPlainCodec<T["descriptors"]["pallets"]["__const"]>
  view: ExtractRuntimeCodec<T["descriptors"]["pallets"]["__view"]>
}
