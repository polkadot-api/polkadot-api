import { Observable, map, withLatestFrom } from "rxjs"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import {
  _void,
  createDecoder,
  Decoder,
  ResultPayload,
  u8,
  Variant,
} from "@polkadot-api/substrate-bindings"
import { RuntimeContext } from "./streams"

const external = new Uint8Array([2])

const getValidateTxArgs = (tx: string, hash: string) =>
  toHex(mergeUint8([external, fromHex(tx), fromHex(hash)]))

const TaggedTransactionQueue = "TaggedTransactionQueue"
const validateTransaction = "validate_transaction"

const [, defaultInvalidTxDecoder] = Variant({
  InvalidTransaction: Variant({
    Call: _void,
    Payment: _void,
    Future: _void,
    Stale: _void,
    BadProof: _void,
    AncientBirthBlock: _void,
    ExhaustsResources: _void,
    Custom: u8,
    BadMandatory: _void,
    MandatoryValidation: _void,
    BadSigner: _void,
  }),
  UnknownTransaction: Variant({
    CannotLookup: _void,
    NoUnsignedValidator: _void,
    Custom: u8,
  }),
})
const defaultValidateTxDecoder: Decoder<ResultPayload<undefined, any>> =
  createDecoder((input) => {
    const firstByte = u8.dec(input)
    if (firstByte > 1)
      throw new Error("Unable to decode validateTransaction result")

    if (!firstByte) return { success: true, value: undefined }
    let value: any
    try {
      value = defaultInvalidTxDecoder(input)
    } catch (_) {
      value = {
        type: "UnknownInvalidTx",
      }
    }
    return { success: false, value }
  })

export const getValidateTx =
  (
    call$: (
      hash: string | null,
      fnName: string,
      parameters: string,
    ) => Observable<Uint8Array>,
    getRuntimeContext: (hash: string) => Observable<RuntimeContext>,
  ) =>
  (blockHash: string, tx: string): Observable<ResultPayload<any, any>> => {
    const decoder$ = getRuntimeContext(blockHash).pipe(
      map((ctx) => {
        try {
          return ctx.dynamicBuilder.buildRuntimeCall(
            TaggedTransactionQueue,
            validateTransaction,
          ).value[1] as Decoder<ResultPayload<any, any>>
        } catch (_) {
          return defaultValidateTxDecoder
        }
      }),
    )
    return call$(
      blockHash,
      `${TaggedTransactionQueue}_${validateTransaction}`,
      getValidateTxArgs(tx, blockHash),
    ).pipe(
      withLatestFrom(decoder$),
      map(([result, decoder]) => decoder(result)),
    )
  }
