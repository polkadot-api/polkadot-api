import recast from "recast"
import { glob } from "glob"
import fs from "fs/promises"
import * as TSParser from "./parsers/typescript"
import { visit } from "ast-types"

export async function doIt(entrypoints: string) {
  const files = await glob(entrypoints)
  for (const file of files) {
    const source = await fs.readFile(file, { encoding: "utf-8" })
    const ast = recast.parse(source, {
      parser: TSParser,
    })

    const createClientVariables: Set<string> = new Set()

    // Find all identifiers that invoke createClient
    visit(ast, {
      visitVariableDeclarator(path) {
        const node = path.node
        if (node.id.type !== "Identifier" || !node.loc) {
          return this.traverse(path)
        }
        if (!node.init || node.init.type !== "CallExpression") {
          return this.traverse(path)
        }
        const { callee } = node.init
        if (callee.type !== "Identifier" || callee.name !== "createClient") {
          return this.traverse(path)
        }

        createClientVariables.add(node.id.name)

        return this.traverse(path)
      },
    })

    // Find all identifiers that alias createClient variables
    visit(ast, {
      visitVariableDeclarator(path) {
        const node = path.node
        if (
          node.id.type !== "Identifier" ||
          !node.init ||
          !(node.init.type === "Identifier")
        ) {
          return this.traverse(path)
        }

        if (createClientVariables.has(node.init.name)) {
          createClientVariables.add(node.id.name)
        }

        return this.traverse(path)
      },
    })

    console.log("createClientVariables", createClientVariables)

    // Traverse member expressions
    visit(ast, {
      visitMemberExpression(path) {
        const node = path.node
        if (node.property.type !== "Identifier") {
          return this.traverse(path)
        }
        const parentMemberExpr = node.object
        if (
          parentMemberExpr.type !== "MemberExpression" ||
          parentMemberExpr.property.type !== "Identifier"
        ) {
          return this.traverse(path)
        }
        const queryOrTxMemberExpr = parentMemberExpr.object
        if (
          queryOrTxMemberExpr.type !== "MemberExpression" ||
          queryOrTxMemberExpr.property.type !== "Identifier" ||
          (queryOrTxMemberExpr.property.name !== "query" &&
            queryOrTxMemberExpr.property.name !== "tx")
        ) {
          return this.traverse(path)
        }
        const clientId = queryOrTxMemberExpr.object
        if (
          clientId.type !== "Identifier" ||
          !createClientVariables.has(clientId.name)
        ) {
          return this.traverse(path)
        }

        console.log("clientId:", clientId.name)
        console.log("query or tx:", queryOrTxMemberExpr.property.name)
        console.log("pallet:", parentMemberExpr.property.name)
        console.log("pallet item:", node.property.name)
        console.log("------------")

        return this.traverse(path)
      },
    })
  }
}
