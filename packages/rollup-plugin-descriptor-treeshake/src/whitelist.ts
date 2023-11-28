import type { ObjectExpression, Node } from "estree"
import { walk } from "estree-walker"

export function applyWhitelist(root: Node, whitelist: Set<string>) {
  const constNames = [...whitelist].map(pathToConst)

  walk(root, {
    enter(node) {
      if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
        if (node.id.name === "_allDescriptors") {
          applyWhitelistToDescriptor(node.init as ObjectExpression, whitelist)
          this.skip()
        } else if (
          !constNames.includes(node.id.name) &&
          node.init?.type === "Literal"
        ) {
          // Removing statements of shape `const TxPalletmethod = "hash"`;
          this.remove()
        }
      }
    },
    leave(node) {
      // The `this.remove()` removing the constant above left its parent VariableDeclaration
      // with no declarations, resulting in an invalid AST, e.g. `const ?? ??`.
      // We also need to remove the VariableDeclaration when this happens.
      if (
        node.type === "VariableDeclaration" &&
        node.declarations.length === 0
      ) {
        this.remove()
      }
    },
  })
}

function applyWhitelistToDescriptor(
  root: ObjectExpression,
  whitelist: Set<string>,
) {
  // [pallet, idx]
  const currentPath: string[] = []
  const idxToProp = ["query", "tx", "event", "error", "const"]
  let idx = 0

  walk(root, {
    enter(node) {
      switch (currentPath.length) {
        case 0:
          if (node.type === "Property" && node.key.type === "Identifier") {
            // Push pallet
            currentPath.push(node.key.name)
            idx = 0
          }
          break
        case 1:
          if (node.type === "ObjectExpression") {
            // Push idx
            currentPath.push(idxToProp[idx])
            idx++
          }
          break
        case 2:
          if (node.type === "Property" && node.key.type === "Identifier") {
            // Remove property from objet if it's not in the whitelist.
            const [pallet, prop] = currentPath
            if (!whitelist.has([prop, pallet, node.key.name].join("."))) {
              this.remove()
            }
          }
          break
      }
    },
    leave(node) {
      switch (currentPath.length) {
        case 1:
          if (node.type === "Property") {
            // Pop out from pallet
            currentPath.pop()
          }
          break
        case 2:
          if (node.type === "ObjectExpression") {
            // Pop out from prop
            currentPath.pop()
          }
          break
      }

      // Remove empty pallets: `{ Pallet: [{},{},{},{},{}] }`
      if (node.type === "ArrayExpression") {
        if (
          node.elements.every(
            (element) =>
              element?.type === "ObjectExpression" &&
              element.properties.length === 0,
          )
        ) {
          this.remove()
        }
      } else if (node.type === "ObjectExpression") {
        // The removal of empty pallets can leave objects with properties
        // without value, leaving an invalid AST: `{ Pallet: ?? }`
        // We also need to remove the property to leave it valid.
        node.properties = node.properties.filter((prop) => {
          if (prop.type === "Property" && !prop.value) {
            return false
          }
          return true
        })
      }
    },
  })
}
const pathToConst = (path: string) => {
  const [op, pallet, method] = path.split(".")

  return opToConst[op] + pallet + method
}
const opToConst: Record<string, string> = {
  query: "Stg",
  tx: "Tx",
  event: "Ev",
  error: "Err",
  const: "Const",
}
