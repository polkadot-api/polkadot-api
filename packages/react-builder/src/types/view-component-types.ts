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

export type ViewCodecComponentProps<T = any> = {
  value: T
  encodedValue: Uint8Array
  path: string[]
}

export type ViewPrimitiveComponentProps<T = any> = ViewCodecComponentProps<T>

export type ViewVoidInterface = {}
export type ViewVoid = FC<ViewVoidInterface>

export type ViewAccountIdInterface = ViewPrimitiveComponentProps<SS58String>
export type ViewAccountId = FC<ViewAccountIdInterface>

export type ViewBigNumberInterface = ViewPrimitiveComponentProps<bigint> & {
  numType: "u64" | "u128" | "u256" | "i64" | "i128" | "i256"
}
export type ViewBigNumber = FC<ViewBigNumberInterface>

export type ViewNumberInterface = ViewPrimitiveComponentProps<number> & {
  numType: "u8" | "u16" | "u32" | "i8" | "i16" | "i32"
}
export type ViewNumber = FC<ViewNumberInterface>

export type ViewBoolInterface = ViewPrimitiveComponentProps<boolean>
export type ViewBool = FC<ViewBoolInterface>

export type ViewStrInterface = ViewPrimitiveComponentProps<string>
export type ViewStr = FC<ViewStrInterface>

export type ViewBytesInterface = ViewPrimitiveComponentProps<Binary> & {
  len?: number
}
export type ViewBytes = FC<ViewBytesInterface>

export type ViewEthAccountInterface = ViewPrimitiveComponentProps<HexString>
export type ViewEthAccount = FC<ViewEthAccountInterface>

export type ViewEnumInterface = ViewCodecComponentProps<{
  type: string
  value: any
}> & {
  tags: Array<{ idx: number; tag: string }>
  inner: ReactNode
  shape: EnumVar
}
export type ViewEnum = FC<ViewEnumInterface>

export type ViewSequenceInterface<T = any> = ViewCodecComponentProps<
  Array<T>
> & {
  innerComponents: Array<ReactNode>
  shape: SequenceVar
}
export type ViewSequence = FC<ViewSequenceInterface>

export type ViewArrayInterface<T = any> = ViewCodecComponentProps<Array<T>> & {
  innerComponents: Array<ReactNode>
  shape: ArrayVar
}
export type ViewArray = FC<ViewArrayInterface>

export type ViewTupleInterface<T = any> = ViewCodecComponentProps<Array<T>> & {
  innerComponents: Array<ReactNode>
  shape: TupleVar
}
export type ViewTuple = FC<ViewTupleInterface>

export type ViewStructInterface = ViewCodecComponentProps<
  Record<string, any>
> & {
  innerComponents: Record<string, ReactNode>
  shape: StructVar
}
export type ViewStruct = FC<ViewStructInterface>

export type ViewOptionInterface<T = any> = ViewCodecComponentProps<
  T | undefined
> & {
  inner: ReactNode
  shape: OptionVar
}
export type ViewOption = FC<ViewOptionInterface>

export type ViewResultInterface = ViewCodecComponentProps<{
  success: boolean
  value: any
}> & {
  shape: ResultVar
  inner: ReactNode
}
export type ViewResult = FC<ViewResultInterface>

export interface ViewComponents {
  CVoid: ViewVoid
  CAccountId: ViewAccountId
  CBigNumber: ViewBigNumber
  CNumber: ViewNumber
  CBool: ViewBool
  CStr: ViewStr
  CBytes: ViewBytes
  CEthAccount: ViewEthAccount
  CEnum: ViewEnum
  CSequence: ViewSequence
  CArray: ViewArray
  CTuple: ViewTuple
  CStruct: ViewStruct
  COption: ViewOption
  CResult: ViewResult
}
