import type {
  ArrayVar,
  EnumVar,
  OptionVar,
  ResultVar,
  SequenceVar,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"
import type {
  Binary,
  HexString,
  SS58String,
} from "@polkadot-api/substrate-bindings"
import type { ReactNode, FC } from "react"

export const NOTIN = Symbol("Notin")
export type NOTIN = typeof NOTIN

export type EditComplexCodecComponentProps<T> = (
  | { type: "blank"; value: NOTIN; encodedValue: undefined }
  | { type: "partial"; value: T; encodedValue: undefined }
  | { type: "complete"; value: T; encodedValue: Uint8Array }
) & {
  path: string[]
  onValueChanged: (newValue: T | NOTIN) => boolean
  decode: (value: Uint8Array | HexString) => T | NOTIN
}

export type EditPrimitiveComponentProps<T = any> = (
  | { type: "blank"; value: NOTIN; encodedValue: undefined }
  | { type: "complete"; value: T; encodedValue: Uint8Array }
) & {
  path: string[]
  onValueChanged: (newValue: T | NOTIN) => boolean
  decode: (value: Uint8Array | HexString) => T | NOTIN
}

export type EditVoidInterface = {}
export type EditVoid = FC<EditVoidInterface>

export type EditAccountIdInterface = EditPrimitiveComponentProps<SS58String>
export type EditAccountId = FC<EditAccountIdInterface>

export type EditBigNumberInterface = EditPrimitiveComponentProps<bigint> & {
  numType: "u64" | "u128" | "u256" | "i64" | "i128" | "i256"
}
export type EditBigNumber = FC<EditBigNumberInterface>

export type EditNumberInterface = EditPrimitiveComponentProps<number> & {
  numType: "u8" | "u16" | "u32" | "i8" | "i16" | "i32"
}
export type EditNumber = FC<EditNumberInterface>

export type EditBoolInterface = EditPrimitiveComponentProps<boolean>
export type EditBool = FC<EditBoolInterface>

export type EditStrInterface = EditPrimitiveComponentProps<string>
export type EditStr = FC<EditStrInterface>

export type EditBytesInterface = EditPrimitiveComponentProps<Binary> & {
  len?: number
}
export type EditBytes = FC<EditBytesInterface>

export type EditEthAccountInterface = EditPrimitiveComponentProps<HexString>
export type EditEthAccount = FC<EditEthAccountInterface>

export type EditEnumInterface = EditComplexCodecComponentProps<{
  type: string
  value: any
}> & {
  tags: Array<{ idx: number; tag: string }>
  inner: ReactNode
  shape: EnumVar
}
export type EditEnum = FC<EditEnumInterface>

export type EditSequenceInterface<T = any> = EditComplexCodecComponentProps<
  Array<T>
> & {
  innerComponents: Array<ReactNode>
  shape: SequenceVar
}
export type EditSequence = FC<EditSequenceInterface>

export type EditArrayInterface<T = any> = EditComplexCodecComponentProps<
  Array<T>
> & {
  innerComponents: Array<ReactNode>
  shape: ArrayVar
}
export type EditArray = FC<EditArrayInterface>

export type EditTupleInterface<T = any> = EditComplexCodecComponentProps<
  Array<T>
> & {
  innerComponents: Array<ReactNode>
  shape: TupleVar
}
export type EditTuple = FC<EditTupleInterface>

export type EditStructInterface = EditComplexCodecComponentProps<
  Record<string, any>
> & {
  innerComponents: Record<string, ReactNode>
  shape: StructVar
}
export type EditStruct = FC<EditStructInterface>

export type EditOptionInterface<T = any> = EditComplexCodecComponentProps<
  T | undefined
> & {
  inner: ReactNode
  shape: OptionVar
}
export type EditOption = FC<EditOptionInterface>

export type EditResultInterface = EditComplexCodecComponentProps<{
  success: boolean
  value: any
}> & {
  shape: ResultVar
  inner: ReactNode
}
export type EditResult = FC<EditResultInterface>

export interface EditComponents {
  CVoid: EditVoid
  CAccountId: EditAccountId
  CBigNumber: EditBigNumber
  CNumber: EditNumber
  CBool: EditBool
  CStr: EditStr
  CBytes: EditBytes
  CEthAccount: EditEthAccount
  CEnum: EditEnum
  CSequence: EditSequence
  CArray: EditArray
  CTuple: EditTuple
  CStruct: EditStruct
  COption: EditOption
  CResult: EditResult
}
