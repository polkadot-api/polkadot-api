import {
  HexString,
  ProofTrieNode,
  TrieNode,
  validateProofs,
} from "@polkadot-api/substrate-bindings"
import { mergeMap, Observable } from "rxjs"

export const createClosestDescendantMerkleValue =
  (
    obsRequest: <Args extends Array<any>, Payload>(
      method: string,
      params: Args,
    ) => Observable<Payload>,
  ) =>
  (at: HexString, key: HexString) =>
    obsRequest<
      [keys: Array<HexString>, at: HexString],
      {
        at: HexString
        proof: HexString[]
      }
    >("state_getReadProof", [[key], at]).pipe(
      mergeMap((x) => {
        const result = validateProofs(x.proof)
        if (!result) throw new Error("Invalid Proof")
        const { rootHash, proofs } = result
        let winnerHash: HexString | undefined = rootHash
        let current: {
          hash: HexString
          parent?: HexString
        } & TrieNode = proofs[winnerHash!] as any

        let nKeyChars = 2 // skipping `0x`
        do {
          const nextOne: ProofTrieNode = proofs[winnerHash!]
          if (!nextOne || nextOne.type === "Raw") break

          current = nextOne
          winnerHash = undefined
          if (
            !current.partialKey.startsWith(
              key.slice(nKeyChars, nKeyChars + current.partialKey.length),
            )
          )
            // This causes the observable to complete, which in its turn triggers an [`operationStorageDone`](https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_follow.html#operationstoragedone)
            // event, without triggering the intermediary `OperationStorageItems` event. This is the expected behaviour when querying a non-existing storage entry.
            return []
          nKeyChars += current.partialKey.length
          if (
            (current.type === "LeafWithHash" ||
              current.type === "BranchWithHash") &&
            proofs[current.value]
          ) {
            winnerHash = current.value
            continue
          }

          if ("children" in current) {
            const winner: [string, string] | undefined = Object.entries(
              current.children,
            ).find(([, hash]) => proofs[hash])

            if (winner) {
              // Same as before: in this case we know that it won't match with the requested key, so we complete without an emission.
              if (winner[0] !== key[nKeyChars++]) return []
              winnerHash = winner[1]
            }
          }
        } while (winnerHash)

        return [current!.hash]
      }),
    )
