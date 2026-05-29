import { TxCreator } from "@polkadot-api/polkadot-signer"
import { Observable } from "rxjs"

interface Block {
  /**
   * 0x-prefixed hash of the block.
   */
  hash: string
  /**
   * Block height.
   */
  number: number
  /**
   * 0x-prefixed hash of the block parent.
   */
  parent: string
}

type Blocks = Observable<
  | {
      /**
       * Emitted when the latest finalized block changes.
       */
      type: "finalized"
      /**
       * Latest known finalized block.
       */
      finalized: Block
      /**
       * Latest known chain tips.
       */
      tips: Array<Block>
    }
  | {
      /**
       * Emitted when a new chain tip is discovered.
       */
      type: "newTip"
      /**
       * Latest known finalized block.
       */
      finalized: Block
      /**
       * Latest known chain tips.
       */
      tips: Array<Block>
      /**
       * Newly discovered tip.
       */
      newTip: Block
    }
>

type RuntimeCall = (
  call: string,
  args: Uint8Array,
  at: string,
) => Promise<Uint8Array>

export type TxCreatorBindings = {
  /**
   * Observable of known finalized blocks and chain tips.
   *
   * After subscription, the latest finalized block and all of its known
   * descendants will be emitted synchronously as an initial burst of `newTip`
   * events. Once that burst is done, a `finalized` event is emitted
   * synchronously with the latest finalized block and tips.
   *
   * There is the strong guarantee that for every `newTip` emitted its parent
   * has been emitted already in the subscription, except for the first `newTip`
   * event of the subscription.
   *
   * Consumers that need the latest tree snapshot instead of each event in the
   * initial burst should wait for the first `finalized` event before reading
   * the snapshot.
   */
  blocks: Blocks
  /**
   * Performs a runtime API call at a specific block.
   *
   * @param call  Runtime API method name.
   * @param args  SCALE-encoded call arguments.
   * @param at    Block hash where the call should be executed.
   * @returns SCALE-encoded return value.
   */
  call: RuntimeCall
}

export type TxCreatorFactory<T> = (chain: {
  txCreatorBindings: TxCreatorBindings
}) => TxCreator<T>

export type TxCreatorEnhancer<T> = <A>(
  inner: TxCreatorFactory<A>,
) => TxCreatorFactory<T & A>
