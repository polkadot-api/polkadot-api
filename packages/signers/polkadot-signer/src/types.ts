import { Observable } from "rxjs"
import { ArgsForArgSpecs, TxArgSpec, TxChainDefinition } from "./txArgs"

export interface TxPayloadV1 {
  /**
   * Payload version. MUST be 1.
   */
  version: 1

  /**
   * Signer selection hint. Allows the implementer to identify which signer,
   * account, key, scheme, or higher-level signing authority should be used.
   *
   * The value is an implementer-defined handle that was previously exposed to
   * the caller, such as an address, account id, account name, or another stable
   * identifier.
   *
   * Set to `null` when the signer is implied or when the implementer should let
   * the user choose.
   */
  signer: string | null

  /**
   * SCALE-encoded call data: pallet index, call index, and call arguments.
   */
  callData: string

  /**
   * Transaction extensions supplied by the caller.
   *
   * The array order is irrelevant. Extensions are matched by `id`, using the
   * identifier declared in metadata.
   *
   * The caller SHOULD provide every extension it understands and cares about.
   * Extensions omitted from this array are intentional holes that the
   * implementer MAY fill when it knows how.
   *
   * Signer-owned extensions, including signature-carrying extensions, should
   * generally be omitted instead of being supplied with placeholder values.
   */
  extensions: Array<{
    /**
     * Extension identifier as declared in metadata, for example "CheckGenesis",
     * "CheckSpecVersion", or "ChargeAssetTxPayment".
     */
    id: string

    /**
     * SCALE-encoded extension value that is included in the extrinsic body.
     * This is encoded according to the extension's `extra` type in metadata.
     */
    extra: string

    /**
     * SCALE-encoded extension value that is signed but not included in the
     * extrinsic body. This is encoded according to the extension's
     * `additionalSigned` type in metadata.
     */
    additionalSigned: string
  }>

  /**
   * Requested transaction-extension version.
   *
   * Set to a number to require that exact extension version. For V4-style
   * transactions this is `0`.
   *
   * Set to `null` when the caller has no extension-version preference and the
   * implementer may choose an appropriate version supported by the runtime.
   */
  txExtVersion: number | null

  /**
   * Context needed to decode, display, validate, and complete the transaction.
   */
  context: {
    /**
     * RuntimeMetadataPrefixed blob (SCALE), starting with the ASCII "meta"
     * magic (`0x6d657461`), for the runtime at `bestBlockHash`.
     *
     * Metadata V14+ is allowed for V4-style transactions. Metadata V16+ is
     * required when versioned transaction extensions are used.
     */
    metadata: string

    /**
     * Native token display information.
     *
     * Set to `null` when token display information is unavailable or not
     * relevant to the caller.
     */
    token: {
      symbol: string
      decimals: number
    } | null

    /**
     * Highest known block number to aid mortality UX.
     */
    bestBlockHeight: number

    /**
     * Hash of the block whose runtime metadata is provided in `metadata`.
     */
    bestBlockHash: string

    /**
     * Genesis hash of the target chain.
     */
    genesisHash: string
  }
}

declare const txCreatorArgSpecs: unique symbol
/**
 * Creates a SCALE-encoded extrinsic (ready to broadcast).
 */
export interface TxCreator<Specs extends TxArgSpec[]> {
  [txCreatorArgSpecs]?: Specs;
  <Chain extends TxChainDefinition>(
    input: TxPayloadV1,
    opts: ArgsForArgSpecs<Specs, Chain>,
    bindings: TxCreatorBindings,
    mockedSignature: boolean,
  ): Promise<string>
}
export type ArgsForCreator<Creator, Chain extends TxChainDefinition> =
  Creator extends TxCreator<infer Specs> ? ArgsForArgSpecs<Specs, Chain> : never

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
) => Observable<Uint8Array>

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
   * Performs a runtime API call at a specific block. The Observable will emit
   * once and complete on each subscription.
   *
   * @param call  Runtime API method name.
   * @param args  SCALE-encoded call arguments.
   * @param at    Block hash where the call should be executed.
   * @returns Observable emitting SCALE-encoded value.
   */
  call: RuntimeCall
  /**
   * Performs a hash with the blockchain's hasher. The Observable will emit once
   * and complete on each subscription.
   *
   * @param payload  Payload to be hashed.
   * @returns Observable emitting hashed value.
   */
  hasher: (payload: Uint8Array) => Observable<Uint8Array>
}

export type TxCreatorEnhancer<T extends TxArgSpec[]> = <A extends TxArgSpec[]>(
  inner: TxCreator<A>,
) => TxCreator<[...T, ...A]>
