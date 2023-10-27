import { SigningType } from "@polkadot-api/tx-helper"
type UnsubscribeFn = () => void

export type KeyPair = {
  address: string
  publicKey: Uint8Array
  signingType: SigningType
  name?: string
  sign: (input: Uint8Array) => Promise<Uint8Array>
}

export type Keyring = {
  getPairs: () => KeyPair[]
  onKeyPairsChanged: (cb: () => void) => UnsubscribeFn
}
