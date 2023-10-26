import type { GetChainSignedExtension } from "@/internal-types"
import { empty$, systemVersionProp$ } from "../utils"

export const CheckTxVersion: GetChainSignedExtension = ({ metadata }) => ({
  additionalSigned: systemVersionProp$("transaction_version", metadata),
  value: empty$,
})
