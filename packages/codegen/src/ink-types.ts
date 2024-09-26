import {
  InkMetadataLookup,
  Layout,
  MessageParamSpec,
  TypeSpec,
} from "@polkadot-api/ink-contracts"
import {
  EnumVariant,
  getInternalTypesBuilder,
  isPrimitive,
  LookupTypeNode,
  StructField,
  TupleField,
  TypeNode,
} from "./internal-types"
import { getReusedNodes } from "./internal-types/reused-nodes"
import {
  CodegenOutput,
  generateTypescript,
  mergeImports,
  nativeNodeCodegen,
  processPapiPrimitives,
} from "./internal-types/generate-typescript"
import { anonymizeImports, anonymizeType } from "./anonymize"

export function generateInkTypes(lookup: InkMetadataLookup) {
  const internalBuilder = getInternalTypesBuilder(lookup)

  const buildLayout = (node: Layout): TypeNode | LookupTypeNode => {
    if ("root" in node) {
      return buildLayout(node.root.layout)
    }
    if ("leaf" in node) {
      return internalBuilder(node.leaf.ty)
    }
    if ("hash" in node) {
      throw new Error("HashLayout not implemented")
    }
    if ("array" in node) {
      return {
        type: "array",
        value: {
          value: buildLayout(node.array.layout),
          len: node.array.len,
        },
      }
    }
    if ("struct" in node) {
      return {
        type: "struct",
        value: node.struct.fields.map(
          (field): StructField => ({
            label: field.name,
            value: buildLayout(field.layout),
            docs: [],
          }),
        ),
      }
    }

    const variants = Object.values(node.enum.variants)
    if (
      node.enum.name === "Option" &&
      variants.length === 2 &&
      variants[0].name === "None" &&
      variants[1].name === "Some"
    ) {
      const inner: TypeNode =
        variants[1].fields.length === 1
          ? buildLayout(variants[1].fields[0].layout)
          : {
              type: "tuple",
              value: variants[1].fields.map(
                (v): TupleField => ({
                  value: buildLayout(v.layout),
                  docs: [],
                }),
              ),
            }
      return {
        type: "option",
        value: inner,
      }
    }

    return {
      type: "enum",
      value: Object.values(node.enum.variants).map(
        (variant): EnumVariant => ({
          label: variant.name,
          value: {
            type: "struct",
            value: variant.fields.map(
              (field): StructField => ({
                label: field.name,
                value: buildLayout(field.layout),
                docs: [],
              }),
            ),
          },
          docs: [],
        }),
      ),
    }
  }
  const storageRoot = buildLayout(lookup.metadata.storage)

  const buildCallable = (callable: {
    args: Array<MessageParamSpec>
    returnType: TypeSpec
  }) => {
    const call: TypeNode = {
      type: "struct",
      value: callable.args.map((param) => ({
        label: param.label,
        value: internalBuilder(param.type.type),
        docs: [],
      })),
    }

    return {
      call,
      value: internalBuilder(callable.returnType.type),
    }
  }
  const constructors = lookup.metadata.spec.constructors.map((ct) => ({
    ...ct,
    types: buildCallable(ct),
  }))
  const messages = lookup.metadata.spec.messages.map((ct) => ({
    ...ct,
    types: buildCallable(ct),
  }))

  const entryPoints: TypeNode[] = [
    storageRoot,
    ...constructors.flatMap((v) => [v.types.call, v.types.value]),
    ...messages.flatMap((v) => [v.types.call, v.types.value]),
  ]
  const rootNodes = getReusedNodes(entryPoints, new Set())

  const assignedNames: Record<number, string> = {}
  let nextAnonymousId = 0
  const getName = (id: number) => {
    if (!assignedNames[id]) {
      assignedNames[id] = `T${nextAnonymousId++}`
    }
    return assignedNames[id]
  }

  // Exclude primitive types from rootNodes
  const filteredRootNodes = Array.from(rootNodes).filter(
    (id) => !isPrimitive(internalBuilder(id)),
  )

  const types: Record<number, CodegenOutput & { name?: string }> = {}
  const generateNodeType = (node: TypeNode | LookupTypeNode): CodegenOutput => {
    const anonymize = (name: string) => `Anonymize<${name}>`

    const result = generateTypescript(node, (node, next): CodegenOutput => {
      if (!("id" in node) || isPrimitive(node)) {
        return (
          processPapiPrimitives(node, next, true) ??
          nativeNodeCodegen(node, next)
        )
      }
      if (types[node.id]) {
        const cached = types[node.id]
        return cached.name
          ? {
              code: anonymize(cached.name),
              imports: {
                types: new Set([cached.name]),
              },
            }
          : cached
      }

      const assignedName =
        (assignedNames[node.id] as any as null) ??
        (filteredRootNodes.includes(node.id) ? getName(node.id) : null)
      if (assignedName) {
        // Preassign the type to allow recursion
        types[node.id] = {
          code: "",
          imports: {},
          name: assignedName,
        }
      }

      const result =
        processPapiPrimitives(node, next, true) ?? nativeNodeCodegen(node, next)
      if (assignedName) {
        types[node.id].code = result.code
        types[node.id].imports = result.imports
        return {
          code: anonymize(assignedName),
          imports: {
            types: new Set([assignedName]),
          },
        }
      }
      types[node.id] = result
      return types[node.id]
    })

    if ("id" in node && types[node.id]?.name) {
      const name = types[node.id].name!
      return {
        code: anonymize(name),
        imports: {
          types: new Set([name]),
        },
      }
    }
    return result
  }

  const storageTypes = generateNodeType(storageRoot)
  const createCallableDescriptor = (
    callables: Array<{
      label: string
      docs: string[]
      types: ReturnType<typeof buildCallable>
    }>,
  ) =>
    generateNodeType({
      type: "struct",
      value: callables.map(
        (callable): StructField => ({
          label: callable.label,
          value: {
            type: "struct",
            value: [
              {
                label: "message",
                value: callable.types.call,
                docs: [],
              },
              {
                label: "response",
                value: callable.types.value,
                docs: [],
              },
            ],
          },
          docs: callable.docs,
        }),
      ),
    })
  const constructorsDescriptor = createCallableDescriptor(constructors)
  const messagesDescriptor = createCallableDescriptor(messages)

  const namedTypes = Object.entries(assignedNames)
    .filter(([id]) => types[Number(id)])
    .map(([id, value]) => `type ${value} = ${types[Number(id)].code};`)
    .join("\n")

  const clientImports = Array.from(
    mergeImports([
      storageTypes.imports,
      messagesDescriptor.imports,
      constructorsDescriptor.imports,
      ...Object.values(types).map((v) => v.imports),
      {
        client: new Set(anonymizeImports),
      },
    ]).client,
  )

  const result = `
    import type { ${clientImports.join(", ")} } from 'polkadot-api';
    import type { InkDescriptors } from 'polkadot-api/ink';

    ${anonymizeType}

    ${namedTypes}

    type StorageDescriptor = ${storageTypes.code};
    type MessagesDescriptor = ${messagesDescriptor.code};
    type ConstructorsDescriptor = ${constructorsDescriptor.code};

    export const descriptor: InkDescriptors<Anonymize<StorageDescriptor>, MessagesDescriptor, ConstructorsDescriptor> = { metadata: ${JSON.stringify(lookup.metadata)} } as any;
  `

  return result
}
