import { HexString } from "@polkadot-api/substrate-bindings"

export type CodecComponentProps<T = any> = {
  value: T
  encodedValue: Uint8Array
}

export type PrimitiveComponentProps<T = any> = CodecComponentProps<T> & {
  onValueChanged: (newValue: T) => void
  onBinChanged: (newValue: Uint8Array | HexString) => void
}
