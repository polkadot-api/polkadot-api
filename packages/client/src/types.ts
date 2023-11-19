import {
  Descriptors,
  QueryFromDescriptors,
} from "@polkadot-api/substrate-bindings"
import { StorageEntry } from "./storage"

export type CreateTx = (
  publicKey: Uint8Array,
  callData: Uint8Array,
) => Promise<Uint8Array>
interface JsonRpcProvider {
  send: (message: string) => void
  createTx: CreateTx
  disconnect: () => void
}

type Connect = (onMessage: (value: string) => void) => JsonRpcProvider

type StorageApi<
  A extends Record<
    string,
    Record<
      string,
      | {
          KeyArgs: Array<any>
          Value: any
          IsOptional: false | true
        }
      | unknown
    >
  >,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {
      KeyArgs: Array<any>
      Value: any
      IsOptional: false | true
    }
      ? StorageEntry<A[K][KK]["KeyArgs"], A[K][KK]["Value"]>
      : unknown
  }
}

export type CreateClient = <T extends Descriptors>(
  connect: Connect,
  descriptors: T,
) => {
  query: StorageApi<QueryFromDescriptors<T>>
}
