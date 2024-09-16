import { PjsTypes } from "./metadata-pjs-types"

interface InkMetadataV4 {
  spec: InkSpecV4
  storage: RootLayout
  types: PjsTypes
  version: "4"
}

interface InkSpecV4 {
  constructors: ConstructorSpec[]
  messages: MessageSpec[]
  environment: EnvironmentSpecV4
  events: EventSpecV4[]
  lang_error: TypeSpec
}

interface InkMetadataV5 {
  spec: InkSpecV5
  storage: RootLayout
  types: PjsTypes
  version: 5
}

export type InkMetadata = InkMetadataV4 | InkMetadataV5

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

interface EventSpecV5 extends EventSpecV4 {
  modulePath: string
  signatureTopic?: string
}

interface EventParamSpec {
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
    rootKey: string
    layout: Layout
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
    variants: Array<{
      name: string
      fields: Array<FieldLayout>
    }>
  }
}

export interface FieldLayout {
  name: string
  layout: Layout
}
