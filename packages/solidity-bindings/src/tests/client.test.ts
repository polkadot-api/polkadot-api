import { bool, bytes, str, Tuple, uint, Vector } from "solidity-codecs"
import { createClient, solidityFn } from "../"

const mockedProvider = () => {
  return {
    request: jest.fn(),
  }
}

describe("createClient", () => {
  describe("request", () => {
    it("calls request on the provider with the correct arguments", () => {
      const provider = mockedProvider()
      const client = createClient(() => provider as any)
      client.request("foo", ["bar", "baz"])

      expect(provider.request).toHaveBeenCalledWith({
        method: "foo",
        params: ["bar", "baz"],
      })
    })
  })

  describe("call", () => {
    it("calls the function with the correct arguments", () => {
      const sam = solidityFn("sam", [bytes, bool, Vector(uint)], Tuple(), 0)

      const provider = mockedProvider()
      provider.request = jest.fn(() => Promise.resolve(""))
      const client = createClient(() => provider as any)
      const getSam = client.call(sam)

      const textEncoder = new TextEncoder()
      getSam("fakeAddress", textEncoder.encode("dave"), true, [1n, 2n, 3n])

      expect(provider.request).toHaveBeenCalledWith({
        method: "eth_call",
        params: [
          {
            to: "fakeAddress",
            data: "0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
          },
          "latest",
        ],
      })

      getSam(
        "fakeAddress",
        textEncoder.encode("dave"),
        true,
        [1n, 2n, 3n],
        "pending",
      )

      expect(provider.request).toHaveBeenCalledWith({
        method: "eth_call",
        params: [
          {
            to: "fakeAddress",
            data: "0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
          },
          "pending",
        ],
      })

      getSam("fakeAddress", textEncoder.encode("dave"), true, [1n, 2n, 3n], 15)
      expect(provider.request).toHaveBeenCalledWith({
        method: "eth_call",
        params: [
          {
            to: "fakeAddress",
            data: "0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
          },
          "0x0f",
        ],
      })

      getSam("fakeAddress", textEncoder.encode("dave"), true, [1n, 2n, 3n], 16)
      expect(provider.request).toHaveBeenCalledWith({
        method: "eth_call",
        params: [
          {
            to: "fakeAddress",
            data: "0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
          },
          "0x10",
        ],
      })
    })

    it("receives the correct response", async () => {
      const responseCodec = Tuple(str, bool, Vector(uint))
      const sam = solidityFn(
        "sam",
        [bytes, bool, Vector(uint)],
        responseCodec,
        0,
      )

      const provider = mockedProvider()
      provider.request = jest.fn(() =>
        Promise.resolve(responseCodec.enc(["dave", true, [1n, 2n, 3n]])),
      )

      const client = createClient(() => provider as any)
      const getSam = client.call(sam)

      const textEncoder = new TextEncoder()
      const response = await getSam(
        "fakeAddress",
        textEncoder.encode("dave"),
        true,
        [1n, 2n, 3n],
      )

      expect(response).toEqual(["dave", true, [1n, 2n, 3n]])
    })
  })

  describe("tx", () => {
    it("calls the tx with the correct arguments", () => {
      const sam = solidityFn("sam", [bytes, bool, Vector(uint)], Tuple(), 3)

      const provider = mockedProvider()
      provider.request = jest.fn(() => Promise.resolve("txnumber"))
      const client = createClient(() => provider as any)
      const getSam = client.tx(sam)

      const textEncoder = new TextEncoder()
      getSam(
        "fakeAddressTo",
        "fakeAddressFrom",
        textEncoder.encode("dave"),
        true,
        [1n, 2n, 3n],
      )

      expect(provider.request).toHaveBeenCalledWith({
        method: "eth_sendTransaction",
        params: [
          {
            to: "fakeAddressTo",
            from: "fakeAddressFrom",
            data: "0xa5643bf20000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000464617665000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003",
          },
        ],
      })
    })
  })
})
