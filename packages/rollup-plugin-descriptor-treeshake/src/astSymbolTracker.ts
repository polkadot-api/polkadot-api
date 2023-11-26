import { walk } from "estree-walker"

import type {
  AssignmentExpression,
  CallExpression,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Expression,
  ImportDeclaration,
  MemberExpression,
  Node,
  VariableDeclaration,
} from "estree"

export type ImportedSymbol =
  | {
      type: "named"
      name: string
    }
  | {
      type: "namespace" | "default"
    }
export type ExportedSymbol =
  | { type: "named"; name: string }
  | { type: "default" }

export interface Hooks<T> {
  importSymbol?: (
    index: number,
    imported: ImportedSymbol,
    file: string,
  ) => T | null | void
  memberAccess?: (symbol: T, property: string) => T | null | void
  functionCall?: (symbol: T, args: Array<T | null>) => T | null | void
  exportSymbol?: (symbol: T, exported: ExportedSymbol) => void
}

/**
 * AST symbolTracker
 *
 * -> Given a list of symbols defined in the root scope, lets you track their usage.
 * -> Features
 *  -> Member access: client.qt.Pallet1.baz.methodA() => client.qt.Pallet1.baz.methodA
 *  -> Function calls: client.qt.Pallet1.baz.methodA(), createClient(descriptor)
 *  -> Notify when creating a new variable, lets you keep tracking it: const client = createClient(descriptor);
 *  -> Notify on import, lets you track it.
 *  -> Notify on dynamic import, lets you track it.
 *  -> Which ones are exported
 */

export function astSymbolTracker<T>(rootAst: Node, hooks: Hooks<T>) {
  const scope = new Scope<T>()

  let importIndex = 0
  const readImportDeclaration = (root: ImportDeclaration) => {
    const file = String(root.source.value)
    root.specifiers.forEach((specifier) => {
      const name = specifier.local.name
      const importedSymbol = ((): ImportedSymbol => {
        switch (specifier.type) {
          case "ImportDefaultSpecifier":
            return { type: "default" }
          case "ImportNamespaceSpecifier":
            return { type: "namespace" }
          case "ImportSpecifier":
            return { type: "named", name: specifier.imported.name }
        }
      })()
      const metadata = hooks.importSymbol?.(importIndex, importedSymbol, file)
      if (metadata) {
        scope.set(name, metadata)
      }
    })
    importIndex++
  }
  const resolveExpression = (expression: Expression | Node) => {
    switch (expression.type) {
      case "MemberExpression":
        return readMemberExpression(expression)
      case "Identifier":
        return scope.get(expression.name)
      case "CallExpression":
        return readCallExpression(expression)
    }
    // For other types we don't support we will return null, but we still need
    // to go through the ast to find other used tracked symbols
    // e.g. `const someFunction = () => client.has.to.be.tracked;
    walkRoot(expression)
    return null
  }
  const readMemberExpression = (root: MemberExpression): T | null => {
    const property = root.property
    // property can also be an expression, such as in foo[1+2] foo["bar"] foo[something ? "bar" : "baz"]
    // In that case we can't track it
    // TODO bail out from tree shaking ?
    // TODO give opportunity to keep tracking with metadata
    if (property.type !== "Identifier") return null

    const symbol = resolveExpression(root.object)
    if (!symbol) return null

    return hooks.memberAccess?.(symbol, property.name) ?? null
  }
  const readCallExpression = (root: CallExpression): T | null => {
    const callee = resolveExpression(root.callee)
    if (!callee) return null

    const fnArgs = root.arguments.map((expression) =>
      resolveExpression(expression),
    )

    return hooks.functionCall?.(callee, fnArgs) ?? null
  }
  const readVariableDeclaration = (
    root: VariableDeclaration,
  ): Record<string, T | null> => {
    // We're returning an object with all the variables we have detected
    return Object.fromEntries(
      root.declarations
        .map((declarator) => {
          // `init` is the expression on the right-hand-side: We grab that value.
          const value = declarator.init
            ? resolveExpression(declarator.init)
            : null

          // Declarator is left-hand-side. Simplest case is an identifier
          if (declarator.id.type === "Identifier") {
            scope.set(declarator.id.name, value)
            return [declarator.id.name, value]
          }

          // Going for simple case of `const { property } = tracked`
          // TODO nested access `const { property: { subproperty }} = tracked`;
          if (declarator.id.type === "ObjectPattern") {
            return declarator.id.properties.map((property) => {
              if (
                property.type === "Property" &&
                property.key.type === "Identifier" &&
                property.value.type === "Identifier"
              ) {
                if (value) {
                  const tracked =
                    hooks.memberAccess?.(value, property.key.name) ?? null
                  scope.set(property.value.name, tracked)
                  return [property.value.name, tracked]
                }
                scope.set(property.value.name, null)
              }
              return null
            })
          }
          if (declarator.id.type === "ArrayPattern") {
            return declarator.id.elements.map((element, idx) => {
              if (element?.type === "Identifier") {
                if (value) {
                  const tracked =
                    hooks.memberAccess?.(value, String(idx)) ?? null
                  scope.set(element.name, tracked)
                }
                scope.set(element.name, null)
              }
              return null
            })
          }
          // TODO other pattern assignment

          // As we don't have a name on left-hand-side, we have to discard it: return null and filter out.
          return null!
        })
        .filter(Boolean),
    )
  }
  const readExportNamedDeclaration = (root: ExportNamedDeclaration) => {
    if (root.declaration) {
      // e.g. `export const result = { /* ... */ }`
      // Declaration can be variable, function or class. We only care about variables
      if (root.declaration.type !== "VariableDeclaration") return

      const variables = readVariableDeclaration(root.declaration)
      Object.entries(variables).forEach(([name, symbol]) => {
        if (!symbol) return
        hooks.exportSymbol?.(symbol, { type: "named", name })
      })
    }
    // Specifiers is for the case `export { result, client as bestClient }`
    root.specifiers.forEach((specifier) => {
      const symbol = scope.get(specifier.local.name)
      if (symbol) {
        hooks.exportSymbol?.(symbol, {
          type: "named",
          name: specifier.exported.name,
        })
      }
    })
  }
  const readExportDefaultDeclaration = (root: ExportDefaultDeclaration) => {
    // `export default class Something {}` and `export default function something() {}`
    // will never be tracked
    if (
      root.declaration.type === "ClassDeclaration" ||
      root.declaration.type === "FunctionDeclaration"
    )
      return

    const symbol = resolveExpression(root.declaration)
    if (symbol) {
      hooks.exportSymbol?.(symbol, { type: "default" })
    }
  }
  const readAssignmentExpression = (root: AssignmentExpression) => {
    const right = resolveExpression(root.right)
    // TODO pattern assignment
    if (root.left.type !== "Identifier") return null!
    scope.set(root.left.name, right)
  }

  // Functions can reference variables that are defined after the function. It's better if we read them after that.
  const hoisted: Node[] = []

  // Into a separate function since we can restart the walk from a sub-node
  const walkRoot = (root: Node, secondPass = false) => {
    walk(root, {
      enter(node) {
        switch (node.type) {
          case "ImportDeclaration":
            readImportDeclaration(node)
            this.skip()
            break
          case "MemberExpression":
            readMemberExpression(node)
            this.skip()
            break
          case "CallExpression":
            readCallExpression(node)
            this.skip()
            break
          case "VariableDeclaration":
            readVariableDeclaration(node)
            this.skip()
            break
          case "AssignmentExpression":
            readAssignmentExpression(node)
            this.skip()
            break
          case "ExportNamedDeclaration":
            readExportNamedDeclaration(node)
            this.skip()
            break
          case "ExportDefaultDeclaration":
            readExportDefaultDeclaration(node)
            this.skip()
            break
          case "FunctionDeclaration":
          case "ArrowFunctionExpression":
            if (!secondPass || node !== root) {
              hoisted.push(node)
              this.skip()
            }
            break
          case "BlockStatement":
            scope.push()
          // default:
          //   console.log(node);
        }
      },
      leave(node) {
        if (node.type === "BlockStatement") {
          scope.pop()
        }
      },
    })
  }

  walkRoot(rootAst)
  while (hoisted.length) {
    walkRoot(hoisted.pop()!, true)
  }
}

class Scope<T> {
  private stack: Array<Record<string, T | null>> = [{}]

  push() {
    this.stack.push({})
  }
  pop() {
    this.stack.pop()
  }
  set(name: string, value: T | null) {
    this.stack[this.stack.length - 1][name] = value
  }
  get(name: string) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (name in this.stack[i]) {
        return this.stack[i][name]
      }
    }
    return null
  }
  replace(name: string, value: T | null) {
    for (let i = this.stack.length - 1; i > 0; i--) {
      if (name in this.stack[i]) {
        this.stack[i][name] = value
        return
      }
    }
    this.stack[0][name] = value
  }
}
