import type Transport from "@ledgerhq/hw-transport"
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  Binary,
  ethAccount,
  HexString,
  u16,
  u32,
} from "@polkadot-api/substrate-bindings"
import { mergeUint8 } from "@polkadot-api/utils"
import { getMetadata } from "./get-metadata"
import { CLA, DEFAULT_SS58, INS, P1, P2, PUBKEY_LEN, SIGN_LEN } from "./consts"
import { getSignBytes, createV4Tx } from "@polkadot-api/signers-common"

const METADATA_IDENTIFIER = "CheckMetadataHash"

// 44'/354'
const START_PATH = Uint8Array.from([44, 0, 0, 128, 98, 1, 0, 128])
// 0'
const MID_PATH = Uint8Array.from([0, 0, 0, 128])
const HARDENED = 0x80000000 // 1 << 31
const encodePath = (path1: number, path2: number) => {
  // ensure numbers are positive integers and fit in 31 bits
  if (
    !Number.isInteger(path1) ||
    path1 < 0 ||
    path1 >= HARDENED ||
    !Number.isInteger(path2) ||
    path2 < 0 ||
    path2 >= HARDENED
  )
    throw new Error(`Invalid path segments ${path1}, ${path2}`)

  return mergeUint8(
    START_PATH,
    u32.enc(HARDENED + path1),
    MID_PATH,
    u32.enc(HARDENED + path2),
  )
}

/**
 * ATTENTION: This class requires `Buffer` to be available. This is an Ledger
 * requirement that we need to fulfill. If you are on a browser-based
 * environment, make sure you polyfill it.
 */
export class LedgerSigner {
  readonly #transport: Transport
  readonly #schema: "ed25519" | "ecdsa"
  #pubkeys: Map<string, Promise<Uint8Array>> // `${schema}:${path1}:${path2}, pubkey|addr`
  #deviceId: Promise<number> | null
  #appInfo: ReturnType<typeof this.appInfo> | null
  #verified: Promise<void> | null

  /**
   * @param transport           Valid and opened transport.
   * @param [schema="ed25519"]  Signing schema to use. Default: `ed25519`.
   */
  constructor(transport: Transport, schema: "ed25519" | "ecdsa" = "ed25519") {
    this.#deviceId = null
    this.#appInfo = null
    this.#verified = null
    this.#transport = transport
    this.#schema = schema
    this.#pubkeys = new Map()
  }

  async #send(
    ...params: Parameters<Transport["send"]>
  ): ReturnType<Transport["send"]> {
    while (this.#transport.exchangeBusyPromise)
      await this.#transport.exchangeBusyPromise
    return await this.#transport.send(...params)
  }

  async #safeSend(
    ...params: Parameters<Transport["send"]>
  ): ReturnType<Transport["send"]> {
    if (!this.#verified)
      this.#verified = this.appInfo().then(({ appName, appVersion }) => {
        if (appName !== "Polkadot")
          throw new Error("Polkadot App is not opened")
        const version = appVersion.split(".").map((v) => parseInt(v))
        if (
          // from version 100 it is Polkadot Generic App
          version[0] < 100 ||
          // ecdsa was only released on 100.0.12
          (version[0] === 100 && version[1] === 0 && version[2] < 12)
        )
          throw new Error(`Polkadot App version ${appVersion} not expected`)
      })
    await this.#verified
    return await this.#send(...params)
  }

  /**
   * Retrieve running app from device.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @returns App name and version.
   * @throws This could throw if the device is not connected, locked, etc.
   */
  async appInfo(): Promise<{
    appName: string
    appVersion: string
  }> {
    // this message is common among Ledger, not only Polkadot app
    if (!this.#appInfo)
      this.#appInfo = this.#send(0xb0, 1, 0, 0).then((v) => {
        const res = Uint8Array.from(v)
        const appName = Binary.fromBytes(res.slice(2, 2 + res[1])).asText()
        const appVersion = Binary.fromBytes(
          res.slice(2 + res[1] + 1, 2 + res[1] + 1 + res[2 + res[1]]),
        ).asText()
        return { appName, appVersion }
      })
    return this.#appInfo
  }

  /**
   * Get unique identifier of the seed phrase. It is useful to uniquely identify
   * each device/seed that is connected.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @returns DeviceId.
   * @throws This could throw if the device is not connected, locked, in a
   *         different app than Polkadot, etc.
   */
  async deviceId(): Promise<number> {
    if (!this.#deviceId)
      this.#deviceId = this.#getPublicKeyAndAddr(0, 0).then((v) =>
        u32.dec(v.slice(0, 4)),
      )
    return this.#deviceId
  }

  async #getPublicKeyAndAddr(
    path1: number,
    path2: number,
    seeAddressInDevice?: boolean,
    ss58Prefix?: number,
  ): Promise<Uint8Array> {
    const key = `${this.#schema}:${path1}:${path2}`
    if (!seeAddressInDevice && this.#pubkeys.has(key))
      return this.#pubkeys.get(key)!
    if (
      ss58Prefix != null &&
      (!Number.isInteger(ss58Prefix) || ss58Prefix < 0 || ss58Prefix >= 1 << 16) // u16 max value
    )
      throw new Error(`Invalid ss58Prefix ${ss58Prefix}`)
    const bufToSend = Buffer.from(
      // id + ss58 prefix
      mergeUint8(
        encodePath(path1, path2),
        Uint8Array.from(u16.enc(ss58Prefix ?? DEFAULT_SS58)),
      ),
    )
    const prom = this.#safeSend(
      CLA,
      INS.getAddress,
      seeAddressInDevice ? P1.showAddress : P1.getAddress,
      P2[this.#schema],
      bufToSend,
    ).then((v) => Uint8Array.from(v).slice(0, -2)) // remove return code
    this.#pubkeys.set(key, prom)
    return prom
  }

  /**
   * Get pubkey for a specific derivation path.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @param path1  Primary derivation index.
   * @param path2  Secondary derivation index. Defaults to 0.
   * @returns Public key.
   * @throws This could throw if the device is not connected, locked, in a
   *         different app than Polkadot, etc.
   */
  async getPubkey(path1: number, path2: number = 0): Promise<Uint8Array> {
    return await this.#getPublicKeyAndAddr(path1, path2).then((v) =>
      v.slice(0, PUBKEY_LEN[this.#schema]),
    )
  }

  /**
   * Show address in device's screen.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @param ss58Prefix  SS58 prefix for address formatting. This is only
   *                    relevant for `ed25519` schema.
   * @param path1       Primary derivation index.
   * @param path2       Secondary derivation index. Defaults to 0.
   * @returns Public key.
   * @throws This could throw if the device is not connected, locked, in a
   *         different app than Polkadot, etc.
   */
  async seeAddressInDevice(
    ss58Prefix: number,
    path1: number,
    path2: number = 0,
  ): Promise<Uint8Array> {
    return await this.#getPublicKeyAndAddr(path1, path2, true, ss58Prefix).then(
      (v) => v.slice(0, PUBKEY_LEN[this.#schema]),
    )
  }

  /**
   * Get `AccountId20` (ETH-like) for a specific derivation path.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @param path1  Primary derivation index.
   * @param path2  Secondary derivation index. Defaults to 0.
   * @returns AccountId20.
   * @throws This could throw if the device is not connected, locked, in a
   *         different app than Polkadot, etc. It throws as well if the
   *         schema is `ed25519`.
   */
  async getAddress20(path1: number, path2: number = 0): Promise<HexString> {
    if (this.#schema !== "ecdsa")
      throw new Error("This method only supports `ecdsa` schema.")
    return await this.#getPublicKeyAndAddr(path1, path2).then((v) =>
      ethAccount.dec(v.slice(PUBKEY_LEN[this.#schema])),
    )
  }

  async #sign(
    path1: number,
    path2: number,
    payload: Uint8Array,
    // without shortMetadata indicates signBytes
    shortMetadata?: Uint8Array,
  ): Promise<Uint8Array> {
    const path = encodePath(path1, path2)
    const chunks: Buffer[] = []
    chunks.push(Buffer.from(mergeUint8(path, u16.enc(payload.length))))
    const combinedPayload =
      shortMetadata == null ? payload : mergeUint8(payload, shortMetadata)
    let offset = 0
    while (offset < combinedPayload.length) {
      const chunkEnd = Math.min(offset + 250, combinedPayload.length)
      chunks.push(Buffer.from(combinedPayload.slice(offset, chunkEnd)))
      offset = chunkEnd
    }
    let result
    for (let i = 0; i < chunks.length; i++) {
      result = await this.#safeSend(
        CLA,
        shortMetadata == null ? INS.signRaw : INS.signTx,
        i === 0 ? P1.init : i === chunks.length - 1 ? P1.end : P1.continue,
        P2[this.#schema],
        chunks[i],
      )
    }
    if (result == null) throw null

    // remove return code
    return Uint8Array.from(result).slice(
      0,
      // ed25519 includes as well a `0x00` at the beginning
      SIGN_LEN[this.#schema] + (this.#schema === "ed25519" ? 1 : 0),
    )
  }

  /**
   * Create PolkadotSigner object from a specific derivation path and for a
   * specific network.
   *
   * This call prevents race conditions and waits until the device is free to
   * receive new messages.
   *
   * @param networkInfo  Off-chain info required to sign transactions. This
   *                     makes this object be network-specific.
   * @param path1        Primary derivation index.
   * @param path2        Secondary derivation index. Defaults to 0.
   * @returns PolkadotSigner object.
   * @throws This could throw if the device is not connected, locked, in a
   *         different app than Polkadot, etc.
   */
  async getPolkadotSigner(
    networkInfo: { decimals: number; tokenSymbol: string },
    path1: number,
    path2: number = 0,
  ): Promise<PolkadotSigner> {
    // ed25519 has public key, ecdsa has addr (20 bytes)
    const publicKey = await this.#getPublicKeyAndAddr(path1, path2).then((v) =>
      this.#schema === "ed25519"
        ? v.slice(0, PUBKEY_LEN[this.#schema])
        : v.slice(PUBKEY_LEN[this.#schema]),
    )
    const signTx: PolkadotSigner["signTx"] = async (
      callData,
      signedExtensions,
      metadata,
    ) => {
      const merkleizer = merkleizeMetadata(metadata, networkInfo)
      const digest = merkleizer.digest()
      const meta = getMetadata(metadata)
      if (
        meta.extrinsic.signedExtensions.find(
          ({ identifier }) => identifier === METADATA_IDENTIFIER,
        ) == null
      )
        throw new Error("No `CheckMetadataHash` sigExt found")
      const extra: Array<Uint8Array> = []
      const additionalSigned: Array<Uint8Array> = []
      meta.extrinsic.signedExtensions.map(({ identifier }) => {
        if (identifier === METADATA_IDENTIFIER) {
          extra.push(Uint8Array.from([1]))
          additionalSigned.push(mergeUint8(Uint8Array.from([1]), digest))
          return
        }
        const signedExtension = signedExtensions[identifier]
        if (!signedExtension)
          throw new Error(`Missing ${identifier} signed extension`)
        extra.push(signedExtension.value)
        additionalSigned.push(signedExtension.additionalSigned)
      })
      const toSign = mergeUint8(callData, ...extra, ...additionalSigned)
      const signature = await this.#sign(
        path1,
        path2,
        toSign,
        merkleizer.getProofForExtrinsicPayload(toSign),
      )
      return createV4Tx(meta, publicKey, signature, extra, callData)
    }

    return {
      publicKey,
      signTx,
      signBytes: getSignBytes(async (x) =>
        // the signature includes a "0x00" at the beginning, indicating a ed25519 signature, ecdsa do not
        // this is not needed for non-extrinsic signatures
        (await this.#sign(path1, path2, x)).slice(
          this.#schema === "ed25519" ? 1 : 0,
        ),
      ),
    }
  }
}
