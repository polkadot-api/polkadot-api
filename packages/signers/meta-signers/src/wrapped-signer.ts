import { PolkadotSigner } from "@polkadot-api/polkadot-signer"

export interface WrappedSigner extends PolkadotSigner {
  accountId: Uint8Array
}
