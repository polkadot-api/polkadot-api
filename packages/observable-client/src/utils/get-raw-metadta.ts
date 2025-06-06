import { Bytes, Option, u32, Vector } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { catchError, map, mergeMap, Observable, of } from "rxjs"

const versionedArgs = (v: number) => toHex(u32.enc(v))
const opaqueBytes = Bytes()
const optionalOpaqueBytes = Option(opaqueBytes)
const u32ListDecoder = Vector(u32).dec

export const getRawMetadata$ = (
  call$: (method: string, args: string) => Observable<string>,
): Observable<Uint8Array> => {
  const versions$ = call$("Metadata_metadata_versions", "").pipe(
    map(u32ListDecoder),
    catchError(() => of([14])),
  )

  const versioned$ = (availableVersions: number[]) => {
    const [v] = availableVersions
      .filter((x) => x > 13 && x < 17)
      .sort((a, b) => b - a)
    return v === 14
      ? call$("Metadata_metadata", "").pipe(map(opaqueBytes.dec))
      : call$("Metadata_metadata_at_version", versionedArgs(v)).pipe(
          map((x) => optionalOpaqueBytes.dec(x)!),
        )
  }

  return versions$.pipe(mergeMap(versioned$))
}
