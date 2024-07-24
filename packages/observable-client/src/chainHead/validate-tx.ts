import { Observable, map, withLatestFrom } from "rxjs"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"
import { Decoder, ResultPayload } from "@polkadot-api/substrate-bindings"
import { RuntimeContext } from "./streams"

const external = new Uint8Array([2])

const getValidateTxArgs = (tx: string, hash: string) =>
  toHex(mergeUint8(external, fromHex(tx), fromHex(hash)))

const TaggedTransactionQueue = "TaggedTransactionQueue"
const validateTransaction = "validate_transaction"

export const getValidateTx =
  (
    call$: (
      hash: string | null,
      fnName: string,
      parameters: string,
    ) => Observable<string>,
    getRuntimeContext: (hash: string) => Observable<RuntimeContext>,
  ) =>
  (blockHash: string, tx: string): Observable<ResultPayload<any, any>> => {
    const decoder$ = getRuntimeContext(blockHash).pipe(
      map(
        (ctx) =>
          ctx.dynamicBuilder.buildRuntimeCall(
            TaggedTransactionQueue,
            validateTransaction,
          ).value[1] as Decoder<ResultPayload<any, any>>,
      ),
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
