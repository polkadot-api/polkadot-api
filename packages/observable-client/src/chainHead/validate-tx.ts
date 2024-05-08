import { Observable, map } from "rxjs"
import { fromHex, mergeUint8, toHex } from "@polkadot-api/utils"

const external = new Uint8Array([2])

const getValidateTxArgs = (tx: string, hash: string) =>
  toHex(mergeUint8(external, fromHex(tx), fromHex(hash)))

export const getValidateTx =
  (
    call$: (
      hash: string | null,
      fnName: string,
      parameters: string,
    ) => Observable<string>,
  ) =>
  (blockHash: string, tx: string) =>
    call$(
      blockHash,
      "TaggedTransactionQueue_validate_transaction",
      getValidateTxArgs(tx, blockHash),
    ).pipe(map((x) => x.startsWith("0x00")))
