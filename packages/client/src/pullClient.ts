import { createClient as createRawClient } from "@polkadot-api/substrate-client"
import {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  PlainDescriptor,
  SS58String,
  StorageDescriptor,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
import { filter, firstValueFrom, map } from "rxjs"
import { shareLatest } from "@/utils"
import { getCodecsFromMetadata } from "./codecs"
import type { PullClientStorage } from "./types"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient/getObservableClient"
import { TxClient, createTxEntry } from "./tx"
import { EvClient, createEventEntry } from "./events"

type FlattenTuples<T extends Array<Array<any>>> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends Array<any>
    ? Rest extends Array<Array<any>>
      ? [...First, ...FlattenTuples<Rest>]
      : First
    : []
  : []

type Descriptors = [
  Array<
    StorageDescriptor<
      DescriptorCommon<string, string>,
      ArgsWithPayloadCodec<any, any>
    >
  >,
  Array<TxDescriptor<DescriptorCommon<string, string>, any>>,
  // Events
  Array<PlainDescriptor<DescriptorCommon<string, string>, any>>,
  // Errors
  Array<PlainDescriptor<DescriptorCommon<string, string>, any>>,
  // Constants
  Array<PlainDescriptor<DescriptorCommon<string, string>, any>>,
]

type ExtractDescriptor<
  T extends Array<Descriptors>,
  Idx extends number,
> = FlattenTuples<{
  [K in keyof T]: T[K] extends Descriptors ? T[K][Idx] : unknown
}>

type CreateTx = (
  publicKey: Uint8Array,
  callData: Uint8Array,
) => Promise<Uint8Array>
interface JsonRpcProvider {
  send: (message: string) => void
  createTx: CreateTx
  disconnect: () => void
}

type Connect = (onMessage: (value: string) => void) => JsonRpcProvider

export function createClient<D extends Array<Descriptors>>(
  connect: Connect,
  ...allDescriptors: D
): PullClientStorage<
  ExtractDescriptor<D, 0>,
  ExtractDescriptor<D, 1>,
  ExtractDescriptor<D, 2>
> {
  let createTx: CreateTx

  const customConnect: Connect = (onMsg) => {
    const result = connect(onMsg)
    createTx = result.createTx
    return result
  }
  const client = getObservableClient(createRawClient(customConnect))
  const chainHead = client.chainHead$()

  const descriptors: Descriptors = [[], [], [], [], []]
  allDescriptors.forEach((current) => {
    current.forEach((x, idx) => {
      descriptors[idx].push(...(x as any[]))
    })
  })

  const getCodecs = getCodecsFromMetadata({
    storage: descriptors[0],
    tx: descriptors[1],
  })

  const descriptors$ = chainHead.metadata$.pipe(
    map((value) => (value ? getCodecs(value) : value)),
    shareLatest,
  )
  descriptors$.subscribe()

  const query = {} as Record<string, Record<string, StorageEntry<any, any>>>
  descriptors[0].forEach((d) => {
    const palletEntry = query[d.props.pallet] ?? {}
    query[d.props.pallet] = palletEntry
    palletEntry[d.props.name] = createStorageEntry(
      d,
      descriptors$,
      chainHead.storage$,
    )
  })

  const createTxFromAddress = async (address: string, callData: Uint8Array) => {
    const { accountId } = await firstValueFrom(
      descriptors$.pipe(filter(Boolean)),
    )
    return createTx(accountId.enc(address as SS58String), callData)
  }

  const tx = {} as Record<string, Record<string, TxClient<any>>>
  descriptors[1].forEach((d) => {
    const palletEntry = tx[d.props.pallet] ?? {}
    tx[d.props.pallet] = palletEntry
    palletEntry[d.props.name] = createTxEntry(
      d,
      descriptors$,
      client,
      chainHead.storage$,
      createTxFromAddress,
    )
  })

  const ev = {} as Record<string, Record<string, EvClient<any>>>
  descriptors[2].forEach((d) => {
    const palletEntry = ev[d.props.pallet] ?? {}
    ev[d.props.pallet] = palletEntry
    palletEntry[d.props.name] = createEventEntry(
      d,
      descriptors$,
      chainHead.finalized$,
      chainHead.storage$,
    )
  })

  return { query, tx, finalized: chainHead.finalized$, event: ev } as any
}
