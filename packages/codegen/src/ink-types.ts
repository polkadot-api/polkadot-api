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

    return {
      type: "enum",
      value: node.enum.variants.map(
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

  /*
  Try to assign names to the types, based on the `displayName` of the contract metadata
  This is only to add better IDE intellisense support, the types won't be exported.
  Types without conflicts (same name points to the same type) are given that name.
  Types with unique conflicts (same name used by different types, but without being shared) will have a prefix of their source
    => E.g. msg_deposit_funds_MessageResult and msg_get_nft_MessageResult
  Types with shared conflicts (e.g. two sources use id=3, another uses id=1) will be anonymized.
  */
  const names = new Map<
    string,
    Array<{
      source: string
      id: number
    }>
  >()
  const addName = (
    displayName: string[],
    value: { source: string; id: number },
  ) => {
    const name = displayName.at(-1)
    if (!name) return

    const v = names.get(name) ?? []
    v.push(value)
    names.set(name, v)
  }
  const addCallableNames =
    (prefix: string) =>
    (callable: {
      args: Array<MessageParamSpec>
      returnType: TypeSpec
      label: string
    }) => {
      callable.args.forEach((arg) =>
        addName(arg.type.displayName, {
          source: `${prefix}_${callable.label}`,
          id: arg.type.type,
        }),
      )
      addName(callable.returnType.displayName, {
        source: `${prefix}_${callable.label}`,
        id: callable.returnType.type,
      })
    }
  lookup.metadata.spec.constructors.forEach(addCallableNames("ctor"))
  lookup.metadata.spec.messages.forEach(addCallableNames("msg"))

  const assignedNames: Record<number, { name: string; anonymous: boolean }> = {}
  for (const [name, candidates] of names.entries()) {
    const uniqueIds = new Set(candidates.map((c) => c.id))
    if (uniqueIds.size === 1) {
      assignedNames[candidates[0].id] = { name, anonymous: false }
    } else if (uniqueIds.size === candidates.length) {
      candidates.forEach((c) => {
        assignedNames[c.id] ||= {
          name: `${c.source}_${name}`,
          anonymous: false,
        }
      })
    }
  }
  let nextAnonymousId = 0
  const getName = (id: number) => {
    if (!assignedNames[id]) {
      assignedNames[id] = { name: `T${nextAnonymousId++}`, anonymous: true }
    }
    return assignedNames[id]
  }

  // Exclude primitive types from rootNodes
  const filteredRootNodes = Array.from(rootNodes).filter(
    (id) => !isPrimitive(internalBuilder(id)),
  )

  const types: Record<number, CodegenOutput & { name?: string }> = {}
  const generateNodeType = (node: TypeNode | LookupTypeNode): CodegenOutput => {
    const anonymize = (name: string, id: number) =>
      assignedNames[id]?.anonymous ? `Anonymize<${name}>` : name
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
              code: anonymize(cached.name, node.id),
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
          name: assignedName.name,
        }
      }

      const result =
        processPapiPrimitives(node, next, true) ?? nativeNodeCodegen(node, next)
      if (assignedName) {
        types[node.id].code = result.code
        types[node.id].imports = result.imports
        return {
          code: anonymize(assignedName.name, node.id),
          imports: {
            types: new Set([assignedName.name]),
          },
        }
      }
      types[node.id] = result
      return types[node.id]
    })

    if ("id" in node && types[node.id]?.name) {
      const name = types[node.id].name!
      return {
        code: anonymize(name, node.id),
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
    .map(([id, value]) => `type ${value.name} = ${types[Number(id)].code};`)
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

    export const descriptor: InkDescriptors<StorageDescriptor, MessagesDescriptor, ConstructorsDescriptor> = { metadata: ${JSON.stringify(lookup.metadata)} } as any;
  `

  return result
}
