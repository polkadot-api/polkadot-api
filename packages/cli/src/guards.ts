import { LookupEntry } from "@unstoppablejs/substrate-codegen"
import { CodecType, metadata } from "@unstoppablejs/substrate-bindings"

type Metadata = CodecType<typeof metadata>["metadata"]

export function assertMetadataIsv14(
  metadata: Metadata,
): asserts metadata is Metadata & { tag: "v14" } {
  if (metadata.tag !== "v14") {
    throw new Error("unreachable")
  }
}

export function assertLookupEntryIsEnum(
  lookupEntry: LookupEntry,
): asserts lookupEntry is LookupEntry & { type: "enum" } {
  if (lookupEntry.type !== "enum") {
    throw new Error("not an enum")
  }
}
