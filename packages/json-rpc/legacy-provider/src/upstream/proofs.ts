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
              if (winner[0] !== key[nKeyChars++]) return []
              winnerHash = winner[1]
            }
          }
        } while (winnerHash)

        return [current!.hash]
      }),
    )
