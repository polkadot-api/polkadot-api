import { enhanceEncoder, u8 } from "@polkadot-api/substrate-bindings"

const versionCodec = enhanceEncoder(
  u8.enc,
  (value: { signed: boolean; version: number }) =>
    (+!!value.signed << 7) | value.version,
)

export const versionBytes = versionCodec({ signed: true, version: 4 })
