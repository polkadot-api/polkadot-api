import { createClient } from "@polkadot-api/substrate-client"
import { HexString } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { getWsProvider } from "polkadot-api/ws-provider"
import { noop } from "rxjs"
import { it, describe, expect } from "vitest"
import { innerEnhancer } from "./inner-enhancer"

let { PROVIDER } = process.env
const ZOMBIENET_URI = "ws://127.0.0.1:9934/"

if (PROVIDER === "sm") {
  const smoldot = start()
  const rawClient = createClient(getWsProvider(ZOMBIENET_URI))
  const getChainspec = async (count = 1): Promise<{}> => {
    try {
      return await rawClient.request<{}>("sync_state_genSyncSpec", [false])
    } catch (e) {
      if (count === 20) throw e
      await new Promise((res) => setTimeout(res, 3_000))
      return getChainspec(count + 1)
    }
  }

  const chainSpec = JSON.stringify(await getChainspec())
  rawClient.destroy()
  const smClient = createClient(getSmProvider(smoldot.addChain({ chainSpec })))

  const legacyClient = createClient(
    getWsProvider(ZOMBIENET_URI, {
      innerEnhancer,
    }),
  )

  let targetBlock: HexString = ""
  const smBlocks = new Set<string>()
  const legacyBlocks = new Set<string>()

  let res: () => void = noop
  const trgtPromise = new Promise<void>((_res) => {
    res = _res
  })

  const getAddBlock =
    (mine: Set<string>, other: Set<string>) => (block: string) => {
      if (other.has(block)) {
        targetBlock = block
        res()
        res = noop
        return true
      }
      mine.add(block)
      return false
    }
  const smAddBlock = getAddBlock(smBlocks, legacyBlocks)
  const smChainHead = smClient.chainHead(
    true,
    (e) => {
      const newBlocks: string[] = []
      if (e.type === "initialized") newBlocks.push(...e.finalizedBlockHashes)
      if (e.type === "newBlock") newBlocks.push(e.blockHash)
      if (targetBlock) smChainHead.unpin(newBlocks)
      else
        newBlocks.forEach((h) => {
          if (smAddBlock(h)) smChainHead.unpin([...smBlocks])
        })
    },
    console.error,
  )

  const lgcAddBlock = getAddBlock(legacyBlocks, smBlocks)
  const lgcHead = legacyClient.chainHead(
    true,
    (e) => {
      const newBlocks: string[] = []
      if (e.type === "initialized") newBlocks.push(...e.finalizedBlockHashes)
      if (e.type === "newBlock") newBlocks.push(e.blockHash)

      if (targetBlock) lgcHead.unpin(newBlocks)
      else {
        newBlocks.forEach((h) => {
          if (lgcAddBlock(h)) lgcHead.unpin([...legacyBlocks])
        })
      }
    },
    console.error,
  )

  await trgtPromise

  const keys: Record<string, HexString> = {
    Alice:
      "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    "System.Account":
      "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9",
    root: "0x",
    "0x26": "0x26aa",
    NonExistingAccount:
      "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9344e2e20967464bb815644ade6cbaf6ad6ebcc75c7ea9a0c4459162b495e90c7ed5306e3a27f73125d6fbd2a34601323",
  }

  describe("closestDescendantMerkleValue", () => {
    it.each(Object.keys(keys) satisfies Array<string>)("%s", async (key) => {
      const [a, b] = await Promise.all(
        [smChainHead, lgcHead].map((head) =>
          head.storage(
            targetBlock,
            "closestDescendantMerkleValue",
            keys[key],
            null,
          ),
        ),
      )
      expect(a).toEqual(b)
    })
  })
} else {
  // Otherwise the CI fails b/c it can't find a test... ¯\_(ツ)_/¯
  describe("dummy", () => {
    it("works", () => {
      expect(true).toBe(true)
    })
  })
}
