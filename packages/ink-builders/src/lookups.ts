import { LookupEntry } from "@polkadot-api/metadata-builders"

export const getLookupFn = (
  _metadata: unknown,
): ((id: number) => LookupEntry) => {
  return (_id) => null as any
}
