import { ValueCompat } from "@/compatibility"
import { PlainDescriptor } from "@/descriptors"
import { getCallData } from "@/utils/get-call-data"
import type {
  ChainHead$,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import { TxCreator } from "@polkadot-api/polkadot-signer"
import { compact, Enum, HexString } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import {
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  take,
} from "rxjs"
import { InvalidTxError, submit, submit$ } from "./submit-fns"
import { Extensions, Transaction, TxEntry } from "./types"

export { InvalidTxError, submit, submit$ }

type TxCreatorOptions<T extends TxCreator<any>> =
  T extends TxCreator<infer A> ? A : never

export const createTxEntry = <
  Arg extends {} | undefined,
  Asset extends PlainDescriptor<any>,
  E,
>(
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  broadcast: (tx: Uint8Array) => Observable<never>,
  compatibility: ValueCompat,
  _getIsAssetCompat: (ctx: RuntimeContext) => (asset: any) => Boolean,
): TxEntry<Arg, E, Asset> => {
  type Ext = Extensions<E>

  const getCompatCtx$ = (at: HexString | null) =>
    combineLatest([chainHead.getRuntimeContext$(at), compatibility]).pipe(
      map(([ctx, getCompat]) => ({ ctx, ...getCompat(ctx) })),
    )

  const getCallData$ = (arg: any, at: HexString | null) =>
    getCompatCtx$(at).pipe(
      map(
        ({
          ctx: { dynamicBuilder, extVersions },
          isValueCompatible: isCompat,
        }) => {
          const callData = getCallData(
            dynamicBuilder,
            isCompat,
            pallet,
            name,
            arg,
          )
          return {
            callData,
            bare: mergeUint8([
              compact.enc(callData.length + 1),
              new Uint8Array(extVersions.slice(-1)),
              callData,
            ]),
          }
        },
      ),
    )

  return (arg?: Arg): Transaction<Asset, Ext> => {
    const create$ = <T extends TxCreator<any>>(
      creator: T,
      opts: TxCreatorOptions<T>,
    ) =>
      combineLatest([
        chainHead.genesis$,
        chainHead.best$,
        chainHead.getRuntimeContext$(null),
        getCallData$(arg, null),
      ]).pipe(
        take(1),
        mergeMap(([genesisHash, best, ctx, { callData }]) =>
          creator(
            {
              callData: toHex(callData),
              context: {
                metadata: toHex(ctx.metadataRaw),
                bestBlockHash: best.hash,
                bestBlockHeight: best.number,
                genesisHash,
                token: null,
              },
              extensions: [],
              signer: null,
              txExtVersion: null,
              version: 1,
            },
            opts,
          ),
        ),
        map(fromHex),
      )

    const create: Transaction<Asset, Ext>["create"] = (creator, options) =>
      firstValueFrom(create$(creator, options))

    const createAndSubmit: Transaction<Asset, Ext>["createAndSubmit"] = (
      creator,
      options,
    ) =>
      firstValueFrom(create$(creator, options)).then((tx) =>
        submit(chainHead, broadcast, tx),
      )

    const createSubmitAndWatch: Transaction<
      Asset,
      Ext
    >["createSubmitAndWatch"] = (creator, options) =>
      create$(creator, options).pipe(
        mergeMap((tx) => submit$(chainHead, broadcast, tx, true)),
      )

    const getPaymentInfo: Transaction<Asset, Ext>["getPaymentInfo"] = async (
      _from,
      _options,
    ) =>
      // TODO: migrate fee estimation to the TxCreator-based transaction flow.
      Promise.reject(
        new Error(
          "Transaction fee estimation is not migrated to TxCreator yet",
        ),
      )

    const getEncodedData = () =>
      firstValueFrom(
        getCallData$(arg, null).pipe(map(({ callData }) => callData)),
      )

    const getEstimatedFees = async (
      _from: Uint8Array | string,
      _options?: any,
    ) =>
      // TODO: migrate fee estimation to the TxCreator-based transaction flow.
      Promise.reject(
        new Error(
          "Transaction fee estimation is not migrated to TxCreator yet",
        ),
      )

    return {
      getPaymentInfo,
      getEstimatedFees,
      decodedCall: {
        type: pallet,
        value: Enum(name, arg),
      },
      getEncodedData,
      getBareTx: () =>
        firstValueFrom(getCallData$(arg, null).pipe(map(({ bare }) => bare))),
      create,
      createSubmitAndWatch,
      createAndSubmit,
    }
  }
}
