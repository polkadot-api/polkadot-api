import { describe, expect, it } from "vitest"
import { Hooks, astSymbolTracker } from "./astSymbolTracker"
import { parse } from "@typescript-eslint/typescript-estree"

describe("astSymbolTracker", () => {
  it("notifies of every import", () => {
    testTrackerFromCode(
      `
      import defaultImport, { namedImportA, namedImportB } from 'moduleA'
      import * as nsImport from 'moduleB'`,
      {
        importSymbol: [
          [0, { type: "default" }, "moduleA"],
          [0, { type: "named", name: "namedImportA" }, "moduleA"],
          [0, { type: "named", name: "namedImportB" }, "moduleA"],
          [1, { type: "namespace" }, "moduleB"],
        ],
      },
    )
  })

  it("notifies when a tracked function is called", () => {
    testTrackerFromCode(
      `
      import { trackedA, trackedB, notTracked } from 'moduleA';

      trackedB();
      trackedA(trackedB, notTracked);
      notTracked();
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "trackedA" }, "moduleA", "metadataA"],
          [0, { type: "named", name: "trackedB" }, "moduleA", "metadataB"],
          [0, { type: "named", name: "notTracked" }, "moduleA"],
        ],
        functionCall: [
          ["metadataB", []],
          ["metadataA", ["metadataB", null]],
        ],
      },
    )
  })

  it("notifies when a member of a tracked symbol is accessed", () => {
    testTrackerFromCode(
      `
      import { tracked, notTracked } from 'moduleA';

      tracked.propertyA.propertyB;
      notTracked.propertyA.propertyB;
      tracked.propertyA.propertyB;
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
          [0, { type: "named", name: "notTracked" }, "moduleA"],
        ],
        memberAccess: [
          ["imported", "propertyA"],
          ["imported", "propertyA", "metadata"],
          ["metadata", "propertyB"],
        ],
      },
    )
  })

  it("notifies of exported tracked symbols", () => {
    testTrackerFromCode(
      `
      import { tracked, notTracked } from 'moduleA';

      const resultA = tracked();
      export const resultB = tracked.property;

      export { resultA, notTracked };
      export default resultA;
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
          [0, { type: "named", name: "notTracked" }, "moduleA"],
        ],
        memberAccess: [["imported", "property", "resultB"]],
        functionCall: [["imported", [], "resultA"]],
        exportSymbol: [
          ["resultB", { type: "named", name: "resultB" }],
          ["resultA", { type: "named", name: "resultA" }],
          ["resultA", { type: "default" }],
        ],
      },
    )
  })

  it("handles nested scopes", () => {
    testTrackerFromCode(
      `
      import { tracked } from 'moduleA';

      {
        const tracked = "Another value";
        tracked.toLocaleLowerCase();
      }

      tracked.trueCall();
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
        ],
        memberAccess: [["imported", "trueCall"]],
        functionCall: [],
      },
    )
  })

  it("handles reassignments", () => {
    testTrackerFromCode(
      `
      import { tracked } from 'moduleA';

      let tmp = tracked;
      tmp.first();
      tmp = "Not now";
      tmp.second();
      tmp = tracked;
      tmp.third();
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
        ],
        memberAccess: [
          ["imported", "first"],
          ["imported", "third"],
        ],
        functionCall: [],
      },
    )
  })

  it("tracks within complex expressions", () => {
    testTrackerFromCode(
      `
      import { tracked } from 'moduleA';

      const impossible = (() => {
        return tracked.property;
      })();
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
        ],
        memberAccess: [["imported", "property"]],
      },
    )
  })

  it("tracks when the code is in reverse order", () => {
    testTrackerFromCode(
      `
      import { tracked } from 'moduleA';

      function functionA() {
        something.subproperty;
      }
      const functionB = () => something()

      const something = tracked.something;
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
        ],
        memberAccess: [
          ["imported", "something", "something"],
          ["something", "subproperty"],
        ],
        functionCall: [["something", []]],
      },
    )
  })

  it("can handle destructuring", () => {
    testTrackerFromCode(
      `
      import { tracked } from 'moduleA';

      const { memberA: renamed, ...rest } = tracked;
      const { notHappening } = { notHappening: tracked };
      const [ first ] = renamed;
      const { nested: { property }} = rest;
      `,
      {
        importSymbol: [
          [0, { type: "named", name: "tracked" }, "moduleA", "imported"],
        ],
        memberAccess: [
          ["imported", "memberA", "renamed"],
          ["renamed", "0"],
          ["imported", "nested", "nested"],
          ["nested", "property"],
        ],
      },
    )
  })
})

type TransformHooks<T> = {
  [K in keyof T]?: T[K] extends ((...args: infer Args) => any) | undefined
    ? Array<[...Args, unknown?]>
    : never
}
function testTrackerFromCode(
  code: string,
  hooks: TransformHooks<Hooks<unknown>>,
) {
  const actualCalls: TransformHooks<Hooks<unknown>> = {
    exportSymbol: [],
    functionCall: [],
    importSymbol: [],
    memberAccess: [],
  }
  const mappedHooks = Object.fromEntries(
    Object.keys(hooks).map((key) => [
      key,
      (...args: unknown[]) => {
        const typedKey = key as keyof Hooks<unknown>
        const response =
          hooks[typedKey]?.[actualCalls[typedKey]!.length]?.[args.length]
        actualCalls[typedKey]!.push(args as any)
        return response
      },
    ]),
  )

  astSymbolTracker(parse(code), mappedHooks)

  const lengths = Object.fromEntries(
    Object.entries(actualCalls).map(([key, value]) => [
      key,
      value[0]?.length ?? 1,
    ]),
  )

  const expected = {
    exportSymbol:
      hooks.exportSymbol?.map((args) => args.slice(0, lengths.exportSymbol)) ??
      [],
    functionCall:
      hooks.functionCall?.map((args) => args.slice(0, lengths.functionCall)) ??
      [],
    importSymbol:
      hooks.importSymbol?.map((args) => args.slice(0, lengths.importSymbol)) ??
      [],
    memberAccess:
      hooks.memberAccess?.map((args) => args.slice(0, lengths.memberAccess)) ??
      [],
  }
  expect(actualCalls).toEqual(expected)
}
