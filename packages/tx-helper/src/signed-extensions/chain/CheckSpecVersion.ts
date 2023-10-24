import type { GetChainSignedExtension } from "@/internal-types"
import { empty$, systemVersionProp$ } from "../utils"

export const CheckSpecVersion: GetChainSignedExtension = ({ metadata }) => ({
  additional: systemVersionProp$("spec_version", metadata),
  extra: empty$,
})
