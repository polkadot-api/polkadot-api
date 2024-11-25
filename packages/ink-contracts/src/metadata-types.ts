import { HexString } from "@polkadot-api/substrate-bindings"
import { PjsTypes } from "./metadata-pjs-types"

interface InkMetadataV4 {
  source: InkSource
  spec: InkSpecV4
  storage: RootLayout
  types: PjsTypes
  version: "4"
  user?: Record<string, unknown>
}

interface InkSpecV4 {
  constructors: ConstructorSpec[]
  messages: MessageSpec[]
  environment: EnvironmentSpecV4
  events: EventSpecV4[]
  docs: string[]
  lang_error: TypeSpec
}

interface InkMetadataV5 {
  source: InkSource
  spec: InkSpecV5
  storage: RootLayout
  types: PjsTypes
  version: 5
}

export type InkMetadata = InkMetadataV4 | InkMetadataV5

export interface InkSource {
  hash: HexString
  language: string
  compiler: string
  wasm?: HexString
  build_info?: Record<string, unknown>
}

export interface InkContractInfo {
  name: string
  version: string
  authors: string[]
  description?: string
  repository?: string
  homepage?: string
  license?: string
}

interface InkSpecV5 {
  constructors: ConstructorSpec[]
  messages: MessageSpec[]
  environment: EnvironmentSpecV5
  events: EventSpecV5[]
  lang_error: TypeSpec
}

interface ConstructorSpec {
  label: string
  selector: string
  payable: boolean
  default: boolean
  args: Array<MessageParamSpec>
  returnType: TypeSpec
  docs: string[]
}

interface MessageSpec {
  label: string
  selector: string
  mutates: boolean
  payable: boolean
  args: Array<MessageParamSpec>
  returnType: TypeSpec
  docs: string[]
  default: boolean
}

interface EnvironmentSpecV4 {
  accountId: TypeSpec
  balance: TypeSpec
  // hash: TypeSpec
  timestamp: TypeSpec
  blockNumber: TypeSpec
  chainExtension: TypeSpec
  maxEventTopics: number
  // staticBufferSize: number
}
interface EnvironmentSpecV5 extends EnvironmentSpecV4 {
  staticBufferSize: number
}

export interface MessageParamSpec {
  label: string
  type: TypeSpec
}

interface EventSpecV4 {
  label: string
  args: EventParamSpec[]
  docs: string[]
}

export interface EventSpecV5 extends EventSpecV4 {
  modulePath: string
  signature_topic?: string
}

export interface EventParamSpec {
  label: string
  indexed: number
  type: TypeSpec
  docs: string[]
}

export interface TypeSpec {
  type: number
  displayName: string[]
}

export type Layout =
  | LeafLayout
  | RootLayout
  | HashLayout
  | ArrayLayout
  | StructLayout
  | EnumLayout

export interface LeafLayout {
  leaf: {
    key: string
    ty: number
  }
}
export interface RootLayout {
  root: {
    root_key: string
    layout: Layout
    ty?: number
  }
}
export interface HashLayout {
  hash: {
    offset: string
    strategy: {
      hasher: "Blake2x256" | "Sha2x256" | "Keccak256"
      prefix: string
      postfix: string
    }
    layout: Layout
  }
}
export interface ArrayLayout {
  array: {
    offset: string
    len: number
    layout: Layout
  }
}
export interface StructLayout {
  struct: {
    name: string
    fields: Array<FieldLayout>
  }
}
export interface EnumLayout {
  enum: {
    name: string
    dispatchKey: string
    variants: Record<
      number,
      {
        name: string
        fields: Array<FieldLayout>
      }
    >
  }
}

export interface FieldLayout {
  name: string
  layout: Layout
}
