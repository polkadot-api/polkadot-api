import { describe, it, expect, vi } from "vitest"
import { getCli } from "../src/cli"
import { version } from "../package.json"

describe("CLI", () => {
  describe("version command", () => {
    it("should output the correct version", () => {
      const consoleSpy = vi.spyOn(console, "log")

      const mockCommands = {
        add: vi.fn(),
        generate: vi.fn(),
        remove: vi.fn(),
        update: vi.fn(),
        ink: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      }

      const cli = getCli(mockCommands)
      cli.parse(["node", "test", "version"])

      expect(consoleSpy).toHaveBeenCalledWith(version)
    })
  })
})
