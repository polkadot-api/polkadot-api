import { ValueCompat } from "@/compatibility"
import { getCallData } from "@/utils/get-call-data"
import type { ChainHead$ } from "@polkadot-api/observable-client"
import { TxCreator } from "@polkadot-api/polkadot-signer"
import {
  _void,
  compact,
  compactBn,
  Decoder,
  Enum,
  HexString,
  Struct,
  u128,
  u32,
  Variant,
} from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import {
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
} from "rxjs"
import { InvalidTxError, submit, submit$ } from "./submit-fns"
import { PaymentInfo, Transaction, TxEntry } from "./types"

export { InvalidTxError, submit, submit$ }

type TxCreatorOptions<T extends TxCreator<any>> =
  T extends TxCreator<infer A> ? A : never

const [, queryInfoDecFallback] = Struct({
  weight: Struct({
    ref_time: compactBn,
    proof_size: compactBn,
  }),
  class: Variant({
    Normal: _void,
    Operational: _void,
    Mandatory: _void,
  }),
  partial_fee: u128,
})

export const createTxEntry = <Arg extends {} | undefined>(
  pallet: string,
  name: string,
  chainHead: ChainHead$,
  broadcast: (tx: Uint8Array) => Observable<never>,
  compatibility: ValueCompat,
): TxEntry<Arg> => {
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

  return (arg?: Arg): Transaction => {
    const create$ = <T extends TxCreator<any>>(
      creator: T,
      opts: TxCreatorOptions<T>,
      mockedSignature: boolean,
    ) =>
      combineLatest([
        chainHead.genesis$,
        chainHead.best$.pipe(
          switchMap((best) =>
            combineLatest([
              of(best),
              chainHead.getRuntimeContext$(best.hash),
              getCallData$(arg, best.hash),
            ]),
          ),
        ),
      ]).pipe(
        take(1),
        mergeMap(([genesisHash, [best, ctx, { callData }]]) =>
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
            mockedSignature,
          ),
        ),
        map(fromHex),
      )

    const create: Transaction["create"] = (creator, options) =>
      firstValueFrom(create$(creator, options, false))

    const createAndSubmit: Transaction["createAndSubmit"] = (
      creator,
      options,
    ) =>
      firstValueFrom(create$(creator, options, false)).then((tx) =>
        submit(chainHead, broadcast, tx),
      )

    const createSubmitAndWatch: Transaction["createSubmitAndWatch"] = (
      creator,
      options,
    ) =>
      create$(creator, options, false).pipe(
        mergeMap((tx) => submit$(chainHead, broadcast, tx, true)),
      )

    const getPaymentInfo: Transaction["getPaymentInfo"] = async (
      creator,
      options,
    ) => {
      const encoded = await firstValueFrom(create$(creator, options, true))
      const args = toHex(mergeUint8([encoded, u32.enc(encoded.length)]))

      const decoder$: Observable<Decoder<PaymentInfo>> = chainHead
        .getRuntimeContext$(null)
        .pipe(
          map((ctx) => {
            try {
              return ctx.dynamicBuilder.buildRuntimeCall(
                "TransactionPaymentApi",
                "query_info",
              ).value.dec
            } catch {
              return queryInfoDecFallback
            }
          }),
        )

      const call$ = chainHead.call$(
        null,
        "TransactionPaymentApi_query_info",
        args,
      )

      return firstValueFrom(
        combineLatest([call$, decoder$]).pipe(
          map(([result, decoder]) => decoder(result)),
        ),
      )
    }

    const getEncodedData = () =>
      firstValueFrom(
        getCallData$(arg, null).pipe(map(({ callData }) => callData)),
      )

    const getEstimatedFees: Transaction["getEstimatedFees"] = async (
      creator,
      options,
    ) => (await getPaymentInfo(creator, options)).partial_fee

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
