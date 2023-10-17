import type { GetChainSignedExtension } from "@/internal-types"
import { empty$, systemVersionProp$ } from "../utils"

export const CheckTxVersion: GetChainSignedExtension = ({ metadata }) => ({
  additional: systemVersionProp$("transaction_version", metadata),
  extra: empty$,
})
