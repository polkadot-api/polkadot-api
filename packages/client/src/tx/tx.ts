import type {
  BlockInfo,
  ChainHead$,
  RuntimeContext,
} from "@polkadot-api/observable-client"
import { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import { getPolkadotSigner } from "@polkadot-api/signer"
import {
  _void,
  AccountId,
  Binary,
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
  Observable,
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  of,
  take,
  throwError,
} from "rxjs"
import { PlainDescriptor } from "@/descriptors"
import { createTx } from "./create-tx"
import { InvalidTxError, submit, submit$ } from "./submit-fns"
import {
  PaymentInfo,
  Transaction,
  TxEntry,
  TxObservable,
  TxOptions,
  TxPromise,
  TxSignFn,
} from "./types"
import { ValueCompat } from "@/compatibility"
import { getCallData } from "@/utils/get-call-data"

export { submit, submit$, InvalidTxError }

const accountIdEnc = AccountId().enc
const fakeSignature = new Uint8Array(64)
const fakeSignatureEth = new Uint8Array(65)
const getFakeSignature = (isEth: boolean) => () =>
  isEth ? fakeSignatureEth : fakeSignature

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

export const createTxEntry = <
  Arg extends {} | undefined,
  Pallet extends string,
  Name extends string,
  Asset extends PlainDescriptor<any>,
>(
  pallet: Pallet,
  name: Name,
  chainHead: ChainHead$,
  broadcast: (tx: string) => Observable<never>,
  compatibility: ValueCompat,
  getIsAssetCompat: (ctx: RuntimeContext) => (asset: any) => Boolean,
): TxEntry<Arg, Pallet, Name, Asset> => {
  const getCompatCtx$ = (at: HexString | null) =>
    combineLatest([chainHead.getRuntimeContext$(at), compatibility]).pipe(
      map(([ctx, getCompat]) => ({
        ctx,
        isAssetCompat: getIsAssetCompat(ctx),
        ...getCompat(ctx),
      })),
    )

  const getCallData$ = (
    arg: any,
    at: HexString | null,
  ): Observable<Uint8Array> =>
    getCompatCtx$(at).pipe(
      map(({ ctx: { dynamicBuilder }, isValueCompatible: isCompat }) =>
        getCallData(dynamicBuilder, isCompat, pallet, name, arg),
      ),
    )

  const getEncodedAsset$ = (
    asset: any,
    at: HexString | null,
  ): Observable<Uint8Array | undefined> =>
    asset === undefined
      ? of(undefined)
      : getCompatCtx$(at).pipe(
          map(({ ctx, isAssetCompat }) => {
            if (!isAssetCompat(asset))
              throw new Error(`Incompatible runtime asset`)

            const { dynamicBuilder, assetId } = ctx
            if (!assetId) return undefined
            return dynamicBuilder.buildDefinition(assetId).enc(asset)
          }),
        )

  return (arg?: Arg): Transaction<Arg, Pallet, Name, Asset> => {
    const sign$ = (
      from: PolkadotSigner,
      { ..._options }: Omit<TxOptions<{}>, "at">,
      atBlock: BlockInfo,
    ) =>
      combineLatest([
        getCallData$(arg, atBlock.hash),
        getEncodedAsset$(_options.asset, atBlock.hash),
      ]).pipe(
        mergeMap(([callData, asset]) =>
          createTx(
            chainHead,
            from,
            callData,
            atBlock,
            _options.customSignedExtensions || {},
            { ..._options, asset },
          ),
        ),
      )

    const _sign = (
      from: PolkadotSigner,
      { at, ..._options }: TxOptions<{}> = {},
    ) => {
      const atBlock = chainHead.pinnedBlocks$.state.blocks.get(at!)
      if (at && !atBlock)
        return throwError(() => new Error(`Uknown block ${at}`))

      return (atBlock ? of(atBlock) : chainHead.finalized$).pipe(
        take(1),
        mergeMap((block) =>
          sign$(from, _options, block).pipe(
            map((signed) => ({ tx: toHex(signed), block })),
          ),
        ),
      )
    }

    const sign: TxSignFn<Asset> = (from, options) =>
      firstValueFrom(_sign(from, options)).then((x) => x.tx)

    const signAndSubmit: TxPromise<Asset> = (from, _options) =>
      firstValueFrom(_sign(from, _options)).then(({ tx, block }) =>
        submit(chainHead, broadcast, tx, block.hash),
      )

    const signSubmitAndWatch: TxObservable<Asset> = (from, _options) =>
      _sign(from, _options).pipe(
        mergeMap(({ tx }) => submit$(chainHead, broadcast, tx, true)),
      )

    const getPaymentInfo = async (
      from: Uint8Array | string,
      _options?: any,
    ) => {
      if (typeof from === "string")
        from = from.startsWith("0x") ? fromHex(from) : accountIdEnc(from)
      const isEth = from.length === 20
      const fakeSigner = getPolkadotSigner(
        from,
        isEth ? "Ecdsa" : "Sr25519",
        getFakeSignature(isEth),
      )
      const encoded = fromHex(await sign(fakeSigner, _options))
      const args = toHex(mergeUint8([encoded, u32.enc(encoded.length)]))

      const decoder$: Observable<Decoder<PaymentInfo>> = chainHead
        .getRuntimeContext$(null)
        .pipe(
          map((ctx) => {
            try {
              return ctx.dynamicBuilder.buildRuntimeCall(
                "TransactionPaymentApi",
                "query_info",
              ).value[1]
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
        getCallData$(arg, null).pipe(map((bytes) => Binary.fromBytes(bytes))),
      )

    const getEstimatedFees = async (
      from: Uint8Array | string,
      _options?: any,
    ) => (await getPaymentInfo(from, _options)).partial_fee

    return {
      getPaymentInfo,
      getEstimatedFees,
      decodedCall: {
        type: pallet,
        value: Enum(name, arg as any),
      },
      getEncodedData,
      sign,
      signSubmitAndWatch,
      signAndSubmit,
    }
  }
}
