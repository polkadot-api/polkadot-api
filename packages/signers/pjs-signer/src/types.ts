import { PolkadotSigner } from "@polkadot-api/polkadot-signer"

declare global {
  interface Window {
    injectedWeb3?: InjectedWeb3
  }
}

type HexString = string
export interface SignerPayloadJSON {
  /**
   * The ss-58 encoded address.
   */
  address: string

  /**
   * The id of the asset used to pay fees, in hex.
   */
  assetId?: number | object

  /**
   * The checkpoint hash of the block, in hex.
   */
  blockHash: HexString

  /**
   * The checkpoint block number, in hex.
   */
  blockNumber: HexString

  /**
   * The era for this transaction, in hex.
   */
  era: HexString

  /**
   * The genesis hash of the chain, in hex.
   */
  genesisHash: HexString

  /**
   * The metadataHash for the CheckMetadataHash SignedExtension, as hex.
   */
  metadataHash?: HexString

  /**
   * The encoded method (with arguments) in hex.
   */
  method: string

  /**
   * The mode for the CheckMetadataHash SignedExtension, in hex.
   */
  mode?: number

  /**
   * The nonce for this transaction, in hex.
   */
  nonce: HexString

  /**
   * The current spec version for the runtime.
   */
  specVersion: HexString

  /**
   * The tip for this transaction, in hex.
   */
  tip: HexString

  /**
   * The current transaction version for the runtime.
   */
  transactionVersion: HexString

  /**
   * The applicable signed extensions for this runtime.
   */
  signedExtensions: string[]

  /**
   * The version of the extrinsic we are dealing with.
   */
  version: number

  /**
   * Optional flag that enables the use of the `signedTransaction` field in
   * `singAndSend`, `signAsync`, and `dryRun`.
   */
  withSignedTransaction?: boolean
}

export type InjectedWeb3 = Record<
  string,
  | {
      enable: (dappName?: string) => Promise<PjsInjectedExtension>
    }
  | undefined
>

export type KeypairType = "ed25519" | "sr25519" | "ecdsa"

export interface InjectedAccount {
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

export interface InjectedPolkadotAccount {
  polkadotSigner: PolkadotSigner
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

export type SignPayload = (
  payload: SignerPayloadJSON,
) => Promise<{ signature: string; signedTransaction?: string | Uint8Array }>

export interface SignTransactionInput {
  publicKey: HexString
  callData: HexString
  signedExtensions: Array<{
    identifier: string
    value: HexString
    additionalSigned: HexString
  }>
  metadata: HexString
  atBlockNumber: number
}

export type SignTransaction = (
  payload: SignTransactionInput,
) => Promise<HexString>

export type SignRaw = (payload: {
  address: string
  data: HexString
  type: "bytes"
}) => Promise<{ id: number; signature: HexString }>

export interface PjsInjectedExtension {
  signer: {
    signTx?: SignTransaction
    signPayload: SignPayload
    signRaw: SignRaw
  }
  accounts: {
    get: () => Promise<InjectedAccount[]>
    subscribe: (cb: (accounts: InjectedAccount[]) => void) => () => void
  }
}

export interface InjectedExtension {
  name: string
  getAccounts: () => InjectedPolkadotAccount[]
  subscribe: (cb: (accounts: InjectedPolkadotAccount[]) => void) => () => void
  disconnect: () => void
}
