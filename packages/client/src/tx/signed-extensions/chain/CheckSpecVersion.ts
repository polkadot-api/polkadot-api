import { map } from "rxjs"
import type { GetChainSignedExtension } from "../internal-types"
import { additionalSigned, systemVersionProp$ } from "../utils"

export const CheckSpecVersion: GetChainSignedExtension = ({ lookupFn }) =>
  systemVersionProp$("spec_version", lookupFn).pipe(map(additionalSigned))
