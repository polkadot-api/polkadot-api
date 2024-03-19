import { Bytes, enhanceCodec } from "scale-ts"
import {
  getSs58AddressInfo,
  SS58String,
  fromBufferToBase58,
} from "@/utils/ss58-util"

function fromBase58ToBuffer(nBytes: number, _ss58Format: number) {
  return (address: SS58String) => {
    const info = getSs58AddressInfo(address)
    if (!info.isValid) throw new Error("Invalid checksum")
    const { publicKey } = info
    if (publicKey.length !== nBytes)
      throw new Error("Invalid public key length")

    return publicKey
  }
}

export const AccountId = (ss58Format: number = 42, nBytes: 32 | 33 = 32) =>
  enhanceCodec(
    Bytes(nBytes),
    fromBase58ToBuffer(nBytes, ss58Format),
    fromBufferToBase58(ss58Format),
  )
