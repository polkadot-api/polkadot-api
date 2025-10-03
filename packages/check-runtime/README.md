# @polkadot-api/check-runtime

Detect common pitfalls when preparing or rolling out **runtime upgrades** on PolkadotSDK-based chains.

- **Two ways to use it**
  - **Library**: one function, `getProblems(uri, options)`, returns a list of problems detected.
  - **CLI**: `check-runtime problems <uri>` for fast local checks and CI.

> ✅ Designed to be **simple**, **deterministic**, and **automation‑friendly**.

---

## Table of contents

- [Installation](#installation)
- [Requirements](#requirements)
- [CLI Usage](#cli-usage)
  - [Examples](#examples)
  - [Exit codes](#exit-codes)
  - [CI integration](#ci-integration)

- [Programmatic API](#programmatic-api)
  - [Signature](#signature)
  - [Parameters](#parameters)
  - [Return value](#return-value)
  - [Usage examples](#usage-examples)

- [Problem reference](#problem-reference)
- [Notes & limitations](#notes--limitations)

---

## Installation

**Using npm**

```bash
npm i @polkadot-api/check-runtime
```

Or run the CLI without installing globally:

```bash
npx @polkadot-api/check-runtime@latest problems wss://your.chain.rpc
```

---

## Requirements

- **Node.js 22+**
- A **WebSocket RPC URI** for your chain (e.g. `wss://...`).

---

## CLI Usage

The CLI exposes a single subcommand (for now), `problems`, that inspects a live chain and/or a provided WASM artifact (that's applied at a certain state of the chain) and prints any detected issues.

```
check-runtime problems <uri> [options]
```

- `<uri>`: WebSocket RPC endpoint of the chain, e.g. `wss://rpc.ibp.network/polkadot`.

**Options**

| Option                   | Description                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--wasm <filenameOrUrl>` | A path to a local runtime WASM file **or** a direct URL to download it. When provided, checks are performed against this WASM at the target height (see `--at`). |
| `--at <block>`           | The height **or** block hash at which to check and/or apply the WASM. If omitted, the node’s latest state is used.                                               |
| `--symbol <symbol>`      | The native token symbol. If omitted, it is read from the RPC chainspec.                                                                                          |
| `--decimals <decimals>`  | The native token decimals. If omitted, it is read from the RPC chainspec.                                                                                        |

### Examples

Check a live chain at head:

```bash
npx @polkadot-api/check-runtime problems wss://sys.ibp.network/statemine
```

Check a specific block:

```bash
npx @polkadot-api/check-runtime problems wss://sys.ibp.network/statemine --at 0xe67351e56ddd9f12f4e67b98c709a58a170b0eb71d168ad0b5bb17fa45becff8
```

Check using a locally built WASM:

```bash
npx @polkadot-api/check-runtime problems wss://sys.ibp.network/statemine \
  --wasm ./artifacts/runtime.compact.compressed.wasm
```

Check against a WASM downloaded from a URL:

```bash
npx @polkadot-api/check-runtime problems wss://sys.ibp.network/statemine \
  --wasm https://github.com/polkadot-fellows/runtimes/releases/download/v1.7.1/asset-hub-kusama_runtime-v1007001.compact.compressed.wasm
  --at 0xe67351e56ddd9f12f4e67b98c709a58a170b0eb71d168ad0b5bb17fa45becff8
```

### Exit codes

- `0`: No problems found: “Everything looks great!”
- `1`: One or more problems detected (messages printed to stderr). This makes the command **CI‑friendly**.

### CI integration

**GitHub Actions** (minimal):

```yaml
name: Runtime checks
on: [push, pull_request]
jobs:
  check-runtime:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npx @polkadot-api/check-runtime problems ${{ RPC_URI }} --wasm ${{ TARGET_WASM_FILE }}
```

---

## Programmatic API

### Signature

```ts
import { HexString } from "polkadot-api"

declare const Problem: {
  readonly ANCIENT_METADATA: "ANCIENT_METADATA"
  readonly MISSING_MODERN_METADATA: "MISSING_MODERN_METADATA"
  readonly MISSING_RUNTIME_APIS: "MISSING_RUNTIME_APIS"
  readonly DEV_APIS_PRESENT: "DEV_APIS_PRESENT"
  readonly MISSING_CHECK_METADATA_HASH_EXTENSION: "MISSING_CHECK_METADATA_HASH_EXTENSION"
  readonly DIFFERENT_METADATA_HASHES: "DIFFERENT_METADATA_HASHES"
  readonly WRONG_OR_MISSING_METADATA_HASH: "WRONG_OR_MISSING_METADATA_HASH"
}

type Problem = (typeof Problem)[keyof typeof Problem]

declare function getProblems(
  uri: string,
  options?: Partial<{
    wasm: HexString
    block: HexString | number
    token: Partial<{ symbol: string; decimals: number }>
  }>,
): Promise<Array<Problem>>
```

### Parameters

- `uri` **(string, required)**: WebSocket RPC URI to the target chain.
- `options` **(optional)**
  - `wasm` **(HexString)**: The runtime code to check, as a hex string. When present, checks are performed against this code (at `block`, if provided).
  - `block` **(number | HexString)**: Height (number) or block hash (hex) at which to evaluate the runtime and metadata.
  - `token` **(Partial<{ symbol: string; decimals: number }> )**: The native token information. If omitted, values are read from the chain’s spec via RPC.

### Return value

A `Promise<Array<Problem>>` with zero or more problem identifiers. See [Problem reference](#problem-reference) for details.

### Usage examples

**Check a live chain at head**

```ts
import { getProblems } from "@polkadot-api/check-runtime"

const problems = await getProblems("wss://your.chain.rpc")
if (problems.length) {
  console.error("Issues detected:", problems)
} else {
  console.log("Looks great!")
}
```

**Check a specific WASM at a height**

```ts
import { readFile } from "node:fs/promises"
import { toHex } from "polkadot-api/utils"
import { getProblems } from "@polkadot-api/check-runtime"

const WASM_URI =
  "https://github.com/polkadot-fellows/runtimes/releases/download/v1.7.1/asset-hub-kusama_runtime-v1007001.compact.compressed.wasm"
const wasm = toHex(await (await fetch(WASM_URI)).bytes())

const problems = await getProblems("wss://rpc.my-chain.io", {
  wasm,
  block: 123_456,
})

if (problems.length) {
  console.error("Issues detected:", problems)
} else {
  console.log("Looks great!")
}
```

---

## Problem reference

Below are the possible Problems. For each, you’ll see what it means at a high level and why it matters.

| Problem                                 | What it means                                                                     | Why it matters                                                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANCIENT_METADATA`                      | The runtime **does not expose modern metadata ≥ v14**.                            | Tooling that relies on modern metadata (including many SDKs and wallets) will not function correctly. Upgrade the runtime to at least metadata v14.       |
| `MISSING_MODERN_METADATA`               | The runtime **only exposes metadata v14**, not newer formats (v15/v16).           | Some clients expect v15+ for enhanced correctness and hashing; remaining on v14 can limit compatibility and safety checks. Plan to migrate to v15 or v16. |
| `MISSING_RUNTIME_APIS`                  | The **Runtime APIs** required by modern tooling are missing.                      | Without them, metadata‑driven tools cannot interact reliably. See guidance linked in the CLI output.                                                      |
| `DEV_APIS_PRESENT`                      | The runtime contains \*\*Development only Runtime APIs.                           | These APIs are meant for development and should not be present in a production build.                                                                     |
| `MISSING_CHECK_METADATA_HASH_EXTENSION` | The **CheckMetadataHash** extension is not supported by this runtime's extrinsic. | Some popular **offline** signers may be able to create transactions for this chain.                                                                       |
| `WRONG_OR_MISSING_METADATA_HASH`        | The runtime was **compiled without the correct metadata hash** embedded.          | Transactions that correctly use `CheckMetadataHash` will be deemed invalid.                                                                               |
| `DIFFERENT_METADATA_HASHES`             | The **metadata hash differs** between metadata v15 and v16.                       | Indicates an inconsistency between versions; clients may behave unpredictably.                                                                            |

> The CLI provides short, actionable messages for each problem and exits with code `1` if any are found.

---

## Notes & limitations

- The tool **does not submit extrinsics** and does not mutate on‑chain state; it uses Chopsticks behind the scenes.
- `--at` / `block` accepts **either** a height (number) **or** a block hash (hex string).
- When `--wasm`/`wasm` is provided **together** with `--at`/`block`, the height is used as the context at which to **check and/or apply** that specific code.
- If `symbol`/`decimals` are not provided, they are read from the chain-spec via RPC. Keep in mind that's not "on-chain" data, ie: it's safer to provide these values.
