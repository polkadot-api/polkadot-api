import { CompatibilityLevel } from "@polkadot-api/metadata-compatibility"

export type Change =
  | {
      kind: "const" | "storage" | "call" | "event" | "error" | "view"
      pallet: string
      name: string
    }
  | {
      kind: "api"
      group: string
      name: string
    }
  | {
      kind: "extension"
      version: number
    }

// TODO: having fine-grained compatibility checks would be desirable
export type ComparedChange =
  | {
      kind: "call" | "event" | "error" | "const"
      pallet: string
      name: string
      compat: CompatibilityLevel
    }
  | {
      kind: "storage" | "view"
      pallet: string
      name: string
      compat: {
        args: CompatibilityLevel
        values: CompatibilityLevel
      }
    }
  | {
      kind: "api"
      group: string
      name: string
      compat: {
        args: CompatibilityLevel
        values: CompatibilityLevel
      }
    }
  | {
      kind: "extension"
      version: number
      compat: CompatibilityLevel
    }

export type Output = {
  added: Array<Change>
  removed: Array<Change>
  kept: Array<ComparedChange>
}

export { CompatibilityLevel }
