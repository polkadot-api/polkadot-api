import { of } from "rxjs"
import type { GetChainSignedExtension } from "../internal-types"
import { both, zero } from "../utils"

export const CheckMetadataHash: GetChainSignedExtension = () =>
  of(both(zero, zero))
