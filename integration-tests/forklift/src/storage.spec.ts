import { describe, expect, it } from "vitest"
import { ALICE, getForkliftProvider } from "./lib/forklift"
import { randomBytes } from "crypto"
import { AccountId, createClient, HexString } from "polkadot-api"
import { dotAh } from "@polkadot-api/descriptors"

import { methods, ForkliftOptions } from "@polkadot-api/forklift"
import { JsonRpcRequest } from "@polkadot-api/json-rpc-provider"

type RpcMethod = ForkliftOptions["rpcOverrides"][string]

const chainHead_v1_storage: RpcMethod = async (
  con,
  req: JsonRpcRequest<
    [
      followSubscription: string,
      hash: HexString,
      items: Array<{
        key: HexString
        type:
          | "value"
          | "hash"
          | "closestDescendantMerkleValue"
          | "descendantsValues"
          | "descendantsHashes"
      }>,
      childTrie: HexString | null,
    ]
  >,
  ctx,
) => {
  const [followSubscription, hash, items, childTrie] = req.params!

  await new Promise((res) => setTimeout(res, 0))
  const sub = con.context.chainHead_v1_subs[followSubscription]

  if (!sub || Object.keys(sub.operations).length > 0) {
    return con.send({
      jsonrpc: "2.0",
      id: req.id!,
      result: { result: "limitReached" },
    })
  }

  if (items.length > 32) {
    const newItems = items.slice(0, 32)
    return methods.chainHead_v1_storage(
      {
        ...con,
        send(msg) {
          if ("result" in msg && msg.result.result === "started") {
            con.send({
              ...msg,
              result: {
                ...msg.result,
                discardedItems: items.length - 32,
              },
            })
          } else {
            con.send(msg)
          }
        },
      },
      {
        ...req,
        params: [followSubscription, hash, newItems, childTrie],
      },
      ctx,
    )
  }

  return methods.chainHead_v1_storage(con, req, ctx)
}

describe("storage", () => {
  it("subscribes and decodes storage values", async () => {
    const client = createClient(getForkliftProvider("storage_sub")[0])
    const api = client.getTypedApi(dotAh)

    const result = await api.query.System.Account.getValue(ALICE)
    const nonce: number = result.nonce
    expect(nonce).toBeGreaterThan(100)
    client.destroy()
  })

  it("entries decodes storage keys", async () => {
    const client = createClient(getForkliftProvider("storage_ent")[0])
    const api = client.getTypedApi(dotAh)

    const entries = await api.query.Referenda.ReferendumInfoFor.getEntries()
    expect(entries.length).toBeGreaterThan(0)
    entries.forEach(({ keyArgs }) => expect(keyArgs[0]).toBeTypeOf("number"))

    client.destroy()
  })

  it("handles storage query limits", async () => {
    const [provider, forklift] = getForkliftProvider("storage_ent")
    forklift.changeOptions({
      rpcOverrides: {
        chainHead_v1_storage,
      },
    })
    const client = createClient(provider)
    const api = client.getTypedApi(dotAh)

    const addresses = Array(70)
      .fill(null)
      .map(() => AccountId().dec(randomBytes(32)))

    console.log(`querying ${addresses.length} identities`)
    const result = await api.query.System.Account.getValues(
      addresses.map((address) => [address]),
    )
    expect(result.length).toEqual(addresses.length)

    client.destroy()
  })

  // Skipped - there are currently no storage entries with an opaque key hasher
  // it("returns the raw key if the hasher is opaque", async () => {
  //   const client = createClient(getForkliftProvider("storage_raw")[0])
  //   const api = client.getTypedApi(dotAh)
  //   const entries =
  //     await api.query.CoretimeAssignmentProvider.CoreDescriptors.getEntries()
  //   expect(entries.length).toBeGreaterThan(0)
  //   const hex: string = entries[0].keyArgs[0]
  //   expect(hex.startsWith("0x"), "Not a hex string").toBe(true)
  //   entries.forEach(({ keyArgs }) => expect(keyArgs[0]).toBeTypeOf("string"))
  //   client.destroy()
  // })
})
