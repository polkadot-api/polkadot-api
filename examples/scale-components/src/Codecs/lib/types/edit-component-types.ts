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

export type EditCodecComponentProps<T> =
  | {
      value: T
      encodedValue?: Uint8Array
    }
  | {
      value: NOTIN
      encodedValue?: undefined
    }

export type EditPrimitiveComponentProps<T = any> =
  EditCodecComponentProps<T> & {
    onValueChanged: (newValue: T) => void
    onBinChanged: (newValue: Uint8Array | HexString) => void
  }

export type EditVoidInterface = {}
export type EditVoid = FC<EditVoidInterface>

export type EditAccountIdInterface = EditPrimitiveComponentProps<SS58String>
export type EditAccountId = FC<EditAccountIdInterface>

export type EditBigNumberInterface = EditPrimitiveComponentProps<bigint> & {
  type: "u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn"
}
export type EditBigNumber = FC<EditBigNumberInterface>

export type EditNumberInterface = EditPrimitiveComponentProps<number> & {
  type: "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber"
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

export type EditEnumInterface = EditCodecComponentProps<{
  type: string
  value: any
}> & {
  tags: Array<{ idx: number; tag: string }>
  onChange: (val: string) => void
  inner: ReactNode
  shape: EnumVar
}
export type EditEnum = FC<EditEnumInterface>

export type EditSequenceInterface<T = any> = EditCodecComponentProps<
  Array<T>
> & {
  innerComponents: Array<ReactNode>
  onAddItem: (idx?: number, value?: T) => void
  onDeleteItem: (idx: number) => void
  onReorder: (prevIdx: number, newIdx: number) => void
  shape: SequenceVar
}
export type EditSequence = FC<EditSequenceInterface>

export type EditArrayInterface<T = any> = EditCodecComponentProps<Array<T>> & {
  innerComponents: Array<ReactNode>
  onReorder: (prevIdx: number, newIdx: number) => void
  shape: ArrayVar
}
export type EditArray = FC<EditArrayInterface>

export type EditTupleInterface<T = any> = EditCodecComponentProps<Array<T>> & {
  innerComponents: Array<ReactNode>
  shape: TupleVar
}
export type EditTuple = FC<EditTupleInterface>

export type EditStructInterface = EditCodecComponentProps<
  Record<string, any>
> & {
  innerComponents: Record<string, ReactNode>
  shape: StructVar
}
export type EditStruct = FC<EditStructInterface>

export type EditOptionInterface<T = any> = EditCodecComponentProps<
  T | undefined
> & {
  onChange: (value: boolean | { set: true; value: T }) => void
  inner: ReactNode
  shape: OptionVar
}
export type EditOption = FC<EditOptionInterface>

export type EditResultInterface = EditCodecComponentProps<{
  success: boolean
  value: any
  shape: ResultVar
}> & {
  onChange: (value: boolean | { success: boolean; value: any }) => void
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
