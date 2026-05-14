import { TxCreator } from "@polkadot-api/polkadot-signer"
import { Observable } from "rxjs"

interface Block {
  hash: string
  number: number
  parent: string
}

// @ts-ignore
type Alternative =
  | {
      type: "finalized"
      finalized: Block
      tips: Array<Block>
    }
  | {
      type: "newTip"
      finalized: Block
      tips: Array<Block>
      newTip: Block
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
  // getBlock: (hash: string) => Block // TODO: let's see if we want it
  call: RuntimeCall
}

export type TxCreatorFactory = <T>(chain: {
  txCreatorBindings: TxCreatorBindings
}) => TxCreator<T>
