import { HexString, SS58String } from "polkadot-api"

export type CodecComponentProps<T = any> = {
  value: T
  encodedValue: Uint8Array
}

export type PrimiveComponentProps<T = any> = CodecComponentProps<T> & {
  onValueChanged: (newValue: T) => void
  onBinChanged: (newValue: Uint8Array | HexString) => void
}

export type NumberInterface = CodecComponentProps<number> & {
  type: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
}

export type BNumberInterface = CodecComponentProps<bigint> & {
  type: "64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
}

export type BoolInterface = CodecComponentProps<boolean>
export type VoidInterface = CodecComponentProps<undefined>
export type StrInterface = CodecComponentProps<string>
export type BytesInterface = CodecComponentProps<Uint8Array> & {
  len?: number
}
export type AccountIdInterface = CodecComponentProps<SS58String>
export type EthAccountInterface = CodecComponentProps<HexString>
