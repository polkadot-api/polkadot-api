type AbiPrimitive =
  | `uint${number}`
  | `uint`
  | `int${number}`
  | `int`
  | "address"
  | "bool"
  | `fixed${number}x${number}`
  | `ufixed${number}x${number}`
  | "fixed"
  | "ufixed"
  | `bytes${number}`
  | "function"
  | "bytes"
  | "string"

type AbiType =
  | AbiPrimitive
  | `${AbiPrimitive}[${number}]`
  | `${AbiPrimitive}[]`
  | `tuple`

type TypedVariable = {
  name: string
  type: AbiType
  components: TypedVariable[]
}
type FunctionAbi = {
  type: "function" | "constructor" | "receive" | "fallback"
  name?: string
  inputs?: Array<TypedVariable>
  outputs?: Array<TypedVariable>
  stateMutability: "pure" | "view" | "nonpayable" | "payable"
}

type EventAbi = {
  type: "event"
  name: string
  inputs: Array<TypedVariable>
  anonymous?: boolean
}

type ErrorAbi = {
  type: "error"
  name: string
  inputs: Array<TypedVariable>
}

type Abi = Array<FunctionAbi | EventAbi | ErrorAbi>

const intRegex = /^u?int(\d+)$/
const fixedRegex = /^u?fixed\d+x(\d+)$/
function generatePrimitiveType(primitive: AbiPrimitive) {
  switch (primitive) {
    case "uint":
    case "int":
      return "bigint"
    case "address":
      return "Address"
    case "bool":
      return "boolean"
    case "fixed":
    case "ufixed":
      // Spec'ed, but not implemented in solc yet.
      return "Decimal<18>"
    case "function":
      return "FunctionRef"
    case "bytes":
      return "Binary"
    case "string":
      return "string"
  }

  if (primitive.startsWith("bytes")) {
    return "Binary"
  }

  const intMatch = intRegex.exec(primitive)
  if (intMatch) {
    return Number(intMatch[1]) > 53 ? "bigint" : "number"
  }

  const fixedMatch = fixedRegex.exec(primitive)
  if (fixedMatch) {
    return `Decimal<${fixedMatch[1]}>`
  }

  throw new Error("Can't map " + primitive)
}

const arrayRegex = /^(.+)\[(\d+)\]$/
function generateVariableType(variable: TypedVariable) {
  if (variable.type === "tuple") {
    return generateStructType(variable.components)
  }

  if (variable.type.endsWith("[]")) {
    return `Array<${generatePrimitiveType(variable.type.replace("[]", "") as AbiPrimitive)}>`
  }

  const arrayMatch = arrayRegex.exec(variable.type)
  if (arrayMatch) {
    return `Array<${generatePrimitiveType(arrayMatch[1] as AbiPrimitive)}>`
  }

  return generatePrimitiveType(variable.type as AbiPrimitive)
}

function generateStructType(params?: Array<TypedVariable>): string {
  if (!params || !params.length) return `{}`

  const unnamedTypes = params.filter((v) => !v.name)
  const namedTypes = params.filter((v) => !!v.name)

  if (namedTypes.length == 0) {
    if (unnamedTypes.length === 1) {
      return generateVariableType(unnamedTypes[0])
    }

    return "[" + unnamedTypes.map(generateVariableType).join(", ") + "]"
  }

  if (unnamedTypes.length) {
    namedTypes.push({
      name: "args",
      type: "tuple",
      components: unnamedTypes,
    })
  }

  return `{${namedTypes.map((v): string => `"${v.name}": ${generateVariableType(v)}`).join(",\n")}}`
}

function generateFunctionType(fnAbi: FunctionAbi) {
  if (!fnAbi.name) {
    console.log(fnAbi)
    throw new Error("Function needs a name")
  }
  return `"${fnAbi.name}": { message: ${generateStructType(fnAbi.inputs)}, response: ${generateStructType(fnAbi.outputs)} }`
}

export function generateSolTypes(abi: Abi) {
  const messages = abi.filter((v) => v.type === "function") as FunctionAbi[]

  const receive = abi.find((v) => v.type === "receive") as
    | FunctionAbi
    | undefined
  if (receive) {
    messages.push({
      name: "receive",
      ...receive,
      type: "function",
    })
  }

  const fallback = abi.find((v) => v.type === "fallback") as
    | FunctionAbi
    | undefined
  if (fallback) {
    messages.push({
      name: "fallback",
      ...fallback,
      type: "function",
    })
  }

  const messagesDescriptor = `{ ${messages.map(generateFunctionType).join(",\n")} }`

  const constructor = (abi.find((v) => v.type === "constructor") as
    | FunctionAbi
    | undefined) ?? {
    type: "constructor",
    stateMutability: "pure",
  }

  const constructorsDescriptor = `{ ${generateFunctionType({
    name: "new",
    ...constructor,
  })} }`

  const result = `
    import type { InkDescriptors } from 'polkadot-api/ink';
    import type { Enum, Binary } from 'polkadot-api';

    type HexString = \`0x\${string}\`
    type Address = HexString
    type Decimal<T extends number> = { value: bigint, decimals: T }
    type FunctionRef = { address: Address, selector: HexString }

    type StorageDescriptor = {};
    type MessagesDescriptor = ${messagesDescriptor};
    type ConstructorsDescriptor = ${constructorsDescriptor};
    type EventDescriptor = Enum<{}>;

    export const descriptor: InkDescriptors<StorageDescriptor, MessagesDescriptor, ConstructorsDescriptor, EventDescriptor> = { abi: ${JSON.stringify(abi)} } as any;
  `

  return result
}
