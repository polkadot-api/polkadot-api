import {
  HexString,
  Shape,
  StructDecoded,
} from "@polkadot-api/substrate-codegen"

export interface DecodedCall {
  pallet: InitStruct
  call: InitStructWithDocs
  args: { value: StructDecoded; shape: Shape }
}

export type InitStructWithDocs = InitStruct & {
  docs: string[]
}

export type InitStruct = {
  value: {
    name: string
    idx: number
  }
  input: HexString
}
