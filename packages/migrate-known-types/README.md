# @polkadot-api/migrate-known-types

This internal tool is used to migrate the repository of known types when there's a change that results in the checksums changing.

## Usage

It's done in 3 (or 4) steps:

1. Retrieve the current version of the metadata for multiple chains.
2. On branch main, generate a map from "Known Type" to positional index of the metadata.
3. On the changed branch, use the positional index to recalculate the checksum and refresh it.
4. Cleanup

### 1. Retrieve the current metadata

1. Set the value `const STEP` to `1`.
2. Checkout branch `main`.
3. Run `pnpm start`. This starts smoldot connecting to multiple chains to grab their metadata.
4. Wait until all metadatas have been loaded. The process will periodically spit out the list of pending chains to load.

### 2. Generate positional indices

1. Set the value `const STEP` to `2`.
2. Run `pnpm start`.

The script will output a set of checksums that couldn't be found in any of the loaded chains. Usually they are types that have disappeared or changed since we have originally created them.

These types / checksums will be ignored

### 3. Refresh list of known types

1. Checkout branch that has the changes.
2. Run a repository-wide build.
3. Set the value of `const STEP` to `3`.
4. Copy the `known-types.ts` file into `./migration/known-types.ts`
5. Run `pnpm start`.
6. Copy `./migration/known-types.ts` back into the original location of `known-types.ts`

### 4. Cleanup

Commit the modified `known-types.ts`, reset everything else.
