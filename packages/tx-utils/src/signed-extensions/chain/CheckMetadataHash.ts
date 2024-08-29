import type { SignedExtension } from "../internal-types"
import { signedExtension } from "../utils"

const offMode = signedExtension(Uint8Array.from([0]), Uint8Array.from([0]))
export const CheckMetadataHash = (
  metadataHash: Uint8Array | undefined | null,
): SignedExtension =>
  metadataHash
    ? signedExtension(
        Uint8Array.from([1]),
        Uint8Array.from([1, ...metadataHash]),
      )
    : offMode
