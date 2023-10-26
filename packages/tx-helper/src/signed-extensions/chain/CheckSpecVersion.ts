import type { GetChainSignedExtension } from "@/internal-types"
import { empty$, systemVersionProp$ } from "../utils"

export const CheckSpecVersion: GetChainSignedExtension = ({ metadata }) => ({
  additionalSigned: systemVersionProp$("spec_version", metadata),
  value: empty$,
})
