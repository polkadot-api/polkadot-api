import { describe, expect } from "vitest"
import { test, fc } from "@fast-check/vitest"
import { setupChainHeadOperationSubscription } from "./fixtures"
import { toHex } from "@unstoppablejs/utils"
import { pipe } from "./utils"

describe.each([true, false])("storage correctness", (mergeItems) => {
  const fcHash = fc.uint8Array({ minLength: 32, maxLength: 32 }).map(toHex)
  const fcStorageValue = fc.option(fc.uint8Array({ minLength: 1 }).map(toHex), {
    nil: null,
  })
  const fcShouldQuery = <T>(arb: fc.Arbitrary<T>) =>
    fc.boolean().chain((t) => (t ? arb : fc.constant(undefined)))

  const filterPairUndefinedValue = <T, V>(
    t: readonly [T, V],
  ): t is readonly [T, Exclude<V, undefined>] => t[1] !== undefined
  const filterPairNullValue = <T, V>(
    t: readonly [T, V],
  ): t is readonly [T, Exclude<V, null>] => t[1] !== null

  test.prop([
    fcHash,
    fc.uniqueArray(fcHash).chain((keys) =>
      fc
        .array(
          fc.record({
            value: fcShouldQuery(fcStorageValue),
            hash: fcShouldQuery(fcStorageValue),
            closestDescendantMerkleValue: fcShouldQuery(fcStorageValue),
            descendantsValues: fcShouldQuery(
              fc.uniqueArray(fcHash).chain((keySuffixes) =>
                fc
                  .array(
                    fc
                      .uint8Array({
                        minLength: 1,
                      })
                      .map(toHex),
                    {
                      minLength: keySuffixes.length,
                      maxLength: keySuffixes.length,
                    },
                  )
                  .map((arr) =>
                    arr.map((v, i) => [keySuffixes[i], v] as const),
                  ),
              ),
            ),
            descendantsHashes: fcShouldQuery(
              fc.uniqueArray(fcHash).chain((keySuffixes) =>
                fc
                  .array(fc.uint8Array({ minLength: 1 }).map(toHex), {
                    minLength: keySuffixes.length,
                    maxLength: keySuffixes.length,
                  })
                  .map((arr) =>
                    arr.map((v, i) => [keySuffixes[i], v] as const),
                  ),
              ),
            ),
          }),
          { minLength: keys.length, maxLength: keys.length },
        )
        .map((arr) =>
          arr.map((v, i) => {
            const prefixedDescendentValues = v.descendantsValues
              ? Object.fromEntries(
                  v.descendantsValues.map(
                    ([k, v]) => [keys[i] + k, v] as const,
                  ),
                )
              : undefined
            const prefixedDescendantsHashes = v.descendantsHashes
              ? Object.fromEntries(
                  v.descendantsHashes.map(
                    ([k, v]) => [keys[i] + k, v] as const,
                  ),
                )
              : undefined

            return [
              keys[i],
              {
                ...v,
                descendantsValues: prefixedDescendentValues,
                descendantsHashes: prefixedDescendantsHashes,
              },
            ] as const
          }),
        )
        .map((t) => Object.fromEntries(t)),
    ),
    fc.option(fcHash, { nil: null }),
    fc.integer({ min: 0, max: 0 }), // TODO: add functionality for discarded items
  ])(
    `chainHead_unstable_storage - mergeItems = ${mergeItems}`,
    async (blockHash, storageMap, childTrie, discardedItems) => {
      const [valueQueryKeys, valueStorage] = pipe(
        Object.entries(storageMap)
          .map(([key, { value }]) => [key, value] as const)
          .filter(filterPairUndefinedValue),
        (a) =>
          [
            a.map(([key]) => key),
            Object.fromEntries(a.filter(filterPairNullValue)),
          ] as const,
      )

      const [hashQueryKeys, hashStorage] = pipe(
        Object.entries(storageMap)
          .map(([key, { hash }]) => [key, hash] as const)
          .filter(filterPairUndefinedValue),
        (a) =>
          [
            a.map(([key]) => key),
            Object.fromEntries(a.filter(filterPairNullValue)),
          ] as const,
      )
      const [closestQueryKeys, closestStorage] = pipe(
        Object.entries(storageMap)
          .map(
            ([key, { closestDescendantMerkleValue }]) =>
              [key, closestDescendantMerkleValue] as const,
          )
          .filter(filterPairUndefinedValue),
        (a) =>
          [
            a.map(([key]) => key),
            Object.fromEntries(a.filter(filterPairNullValue)),
          ] as const,
      )

      const [descendantValuesKeys, descendantValuesStorage] = pipe(
        Object.entries(storageMap)
          .map(
            ([key, { descendantsValues }]) => [key, descendantsValues] as const,
          )
          .filter(filterPairUndefinedValue),
        (a) => [a.map(([key]) => key), Object.fromEntries(a)] as const,
      )
      for (const key of Object.keys(descendantValuesStorage)) {
        if (Object.entries(descendantValuesStorage[key]).length === 0) {
          delete descendantValuesStorage[key]
        }
      }
      const [descendantHashesKeys, descendantHashesStorage] = pipe(
        Object.entries(storageMap)
          .map(
            ([key, { descendantsHashes }]) => [key, descendantsHashes] as const,
          )
          .filter(filterPairUndefinedValue),
        (a) => [a.map(([key]) => key), Object.fromEntries(a)] as const,
      )
      for (const key of Object.keys(descendantHashesStorage)) {
        if (Object.entries(descendantHashesStorage[key]).length === 0) {
          delete descendantHashesStorage[key]
        }
      }

      const {
        fixtures: { sendOperationNotification },
        operationPromise,
      } = setupChainHeadOperationSubscription(
        { name: "storage", discardedItems: discardedItems },
        blockHash,
        {
          value: valueQueryKeys,
          hash: hashQueryKeys,
          closestDescendantMerkleValue: closestQueryKeys,
          descendantsValues: descendantValuesKeys,
          descendantsHashes: descendantHashesKeys,
        },
        childTrie,
      )

      const descendantValues = Object.values(descendantValuesStorage).flatMap(
        (a) => Object.entries(a).flatMap(([key, value]) => ({ key, value })),
      )

      const descendantHashes = Object.values(descendantHashesStorage).flatMap(
        (a) => Object.entries(a).flatMap(([key, hash]) => ({ key, hash })),
      )

      const items = mergeItems
        ? [
            ...Object.entries(storageMap).map(([key, v]) => ({
              key,
              value: v.value !== null ? v.value : undefined,
              hash: v.hash !== null ? v.hash : undefined,
              closestDescendantMerkleValue:
                v.closestDescendantMerkleValue !== null
                  ? v.closestDescendantMerkleValue
                  : undefined,
            })),
            ...descendantValues,
            ...descendantHashes,
          ]
        : [
            ...Object.entries(valueStorage).map(([key, value]) => ({
              key,
              value,
            })),
            ...Object.entries(hashStorage).map(([key, hash]) => ({
              key,
              hash,
            })),
            ...Object.entries(closestStorage).map(
              ([key, closestDescendantMerkleValue]) => ({
                key,
                closestDescendantMerkleValue,
              }),
            ),
            ...descendantValues,
            ...descendantHashes,
          ]

      sendOperationNotification({
        event: "operationStorageItems",
        items,
      })
      sendOperationNotification({
        event: "operationStorageDone",
      })

      const expected = {
        values: valueStorage,
        hashes: hashStorage,
        closests: closestStorage,
        descendantsHashes: pipe(
          Object.entries(descendantHashesStorage).map(
            ([key, v]) =>
              [
                key,
                Object.entries(v).map(([key, hash]) => ({ key, hash })),
              ] as const,
          ),
          (a) => Object.fromEntries(a),
        ),
        descendantsValues: pipe(
          Object.entries(descendantValuesStorage).map(
            ([key, v]) =>
              [
                key,
                Object.entries(v).map(([key, value]) => ({ key, value })),
              ] as const,
          ),
          (a) => Object.fromEntries(a),
        ),
      }

      await expect(operationPromise).resolves.toEqual(expected)
    },
  )
})
