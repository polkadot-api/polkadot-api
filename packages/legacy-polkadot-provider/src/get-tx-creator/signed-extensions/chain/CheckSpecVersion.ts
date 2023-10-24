import { of } from "rxjs"
import type { GetChainSignedExtension } from "@/types/internal-types"
import { systemVersionProp } from "../utils"

export const CheckSpecVersion: GetChainSignedExtension = ({ metadata }) => {
  const specVersion = systemVersionProp("spec_version", metadata)
  return of({
    extra: new Uint8Array(),
    additional: specVersion.enc,
    pjs: { specVersion: specVersion.dec },
  })
}
