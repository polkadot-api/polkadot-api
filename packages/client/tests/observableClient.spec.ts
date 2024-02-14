import { BlockInfo, getObservableClient } from "@/observableClient"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  encodeHeader,
  newHash,
  newInitialized,
  waitMicro,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"

describe("observableClient", () => {
  describe("finalized$", () => {
    it("emits the latest finalized block after initialized", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const { next, error, complete } = observe(client.chainHead$().finalized$)

      const initialized = newInitialized()
      mockClient.chainHead.mock.send(initialized)

      // initialized event is missing some parameters before `finalized$` can emit
      expect(next).not.toHaveBeenCalled()
      expect(mockClient.chainHead.mock.header).toHaveBeenCalledWith(
        initialized.finalizedBlockHash,
      )

      const header = createHeader({
        parentHash: newHash(),
      })
      await mockClient.chainHead.mock.header.reply(
        initialized.finalizedBlockHash,
        encodeHeader(header),
      )

      // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
      await waitMicro()

      expect(next).toHaveBeenCalledOnce()
      expect(next).toHaveBeenLastCalledWith({
        hash: initialized.finalizedBlockHash,
        number: header.number,
        parent: header.parentHash,
      } satisfies BlockInfo)
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()
    })
  })
})
