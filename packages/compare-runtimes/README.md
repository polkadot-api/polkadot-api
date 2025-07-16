# 🧬 @polkadot-api/compare-runtimes

A lightweight yet powerful TypeScript library to **compare runtime metadata between upgrades** of PolkadotSDK-based blockchains. Easily detect **breaking changes, additions, and compatibility levels** across all runtime components.

## ✨ Features

- Detect added, removed, or changed runtime elements:
  - Constants, Storage items, Calls, Events, Errors, View Functions, APIs

- Classify compatibility as:
  - [`Identical`, `BackwardsCompatible`, `Partial`, or `Incompatible`](https://papi.how/typed#getcompatibilitylevel)

- Simple, typed API for easy integration into CLI tools, CI pipelines, or dashboards

## 🧩 API Reference

### `compareRuntimes(prevMetadata: Uint8Array, nextMetadata: Uint8Array): Output`

Compares two versions of runtime metadata and returns a detailed diff.

#### Output Structure

```ts
type Output = {
  added: Change[]
  removed: Change[]
  kept: ComparedChange[]
}
```

### `Change`

Represents a new or removed runtime item.

```ts
type Change =
  | {
      kind: "const" | "storage" | "call" | "event" | "error" | "view"
      pallet: string
      name: string
    }
  | { kind: "api"; group: string; name: string }
```

### `ComparedChange`

Represents a kept runtime item with compatibility information.

```ts
type ComparedChange =
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
      compat: { args: CompatibilityLevel; values: CompatibilityLevel }
    }
  | {
      kind: "api"
      group: string
      name: string
      compat: { args: CompatibilityLevel; values: CompatibilityLevel }
    }
```

### `CompatibilityLevel`

Indicates how compatible a change is:

```ts
enum CompatibilityLevel {
  Incompatible = 0,
  Partial = 1,
  BackwardsCompatible = 2,
  Identical = 3,
}
```

## 📦 Example Use Case

- Automatically detect **breaking changes** before pushing an upgrade
- Generate upgrade reports for **audit or governance proposals**
- Integrate into **CI/CD** to fail builds with breaking changes

## 📄 License

MIT
