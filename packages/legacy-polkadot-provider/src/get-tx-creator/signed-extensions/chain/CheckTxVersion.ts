import { of } from "rxjs"
import type { GetChainSignedExtension } from "@/types/internal-types"
import { systemVersionProp } from "../utils"

export const CheckTxVersion: GetChainSignedExtension = ({ metadata }) => {
  const transactionVersion = systemVersionProp("transaction_version", metadata)
  return of({
    extra: new Uint8Array(),
    additional: transactionVersion.enc,
    pjs: { transactionVersion: transactionVersion.dec },
  })
}
