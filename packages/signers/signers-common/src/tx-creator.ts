import { TxCreator } from "@polkadot-api/polkadot-signer"
import { Observable } from "rxjs"

interface Block {
  hash: string
  number: number
  parent: string
}

type Blocks = Observable<{
  finalized: Block
  tips: Array<Block>
}>

type RuntimeCall = (
  call: string,
  args: Uint8Array,
  at: string,
) => Promise<Uint8Array>

export type TxCreatorBindings = {
  blocks: Blocks
  call: RuntimeCall
}

export type TxCreatorFactory = <T>(chain: {
  txCreatorBindings: TxCreatorBindings
}) => TxCreator<T>
