import type {
  GetEnum,
  TxCallData,
  StorageDescriptor,
  PlainDescriptor,
  TxDescriptor,
  RuntimeDescriptor,
  Enum,
  ApisFromDef,
  QueryFromPalletsDef,
  TxFromPalletsDef,
  EventsFromPalletsDef,
  ErrorsFromPalletsDef,
  ConstFromPalletsDef,
  ViewFnsFromPalletsDef,
  SS58String,
  Binary,
  FixedSizeBinary,
  FixedSizeArray,
} from "polkadot-api"
export type I5sesotjlssv2d = {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: {
    free: bigint
    reserved: bigint
    frozen: bigint
    flags: bigint
  }
}
export type Ib6hg1p9olcq8s = AnonymousEnum<{
  /**
   * Make some on-chain remark.
   *
   * Can be executed by every `origin`.
   */
  remark: Anonymize<I8ofcg5rbj0g2c>
}>
export type I8ofcg5rbj0g2c = {
  remark: Binary
}
export type Iabpgqcjikia83 = Binary | undefined
export type Icgljjb6j82uhn = Array<number>
export type Ironaioq8hfkf = AnonymousEnum<{
  System: Enum<{
    /**
     * Make some on-chain remark.
     *
     * Can be executed by every `origin`.
     */
    remark: Anonymize<I8ofcg5rbj0g2c>
    /**
     * Set the number of pages in the WebAssembly environment's heap.
     */
    set_heap_pages: {
      pages: bigint
    }
    /**
     * Set the new runtime code.
     */
    set_code: {
      code: Binary
    }
    /**
     * Set the new runtime code without doing any checks of the given `code`.
     *
     * Note that runtime upgrades will not run if this is called with a
     * not-increasing spec version!
     */
    set_code_without_checks: {
      code: Binary
    }
    /**
     * Set some items of storage.
     */
    set_storage: {
      items: Array<FixedSizeArray<2, Binary>>
    }
    /**
     * Kill some items from storage.
     */
    kill_storage: {
      keys: Anonymize<Itom7fk49o0c9>
    }
    /**
     * Kill all storage items with a key that starts with the given prefix.
     *
     * **NOTE:** We rely on the Root origin to provide us the number of subkeys
     * under the prefix we are removing to accurately calculate the weight of
     * this function.
     */
    kill_prefix: {
      prefix: Binary
      subkeys: number
    }
    /**
     * Make some on-chain remark and emit event.
     */
    remark_with_event: Anonymize<I8ofcg5rbj0g2c>
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime
     * can be supplied later.
     *
     * This call requires Root origin.
     */
    authorize_upgrade: {
      code_hash: FixedSizeBinary<32>
    }
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime
     * can be supplied later.
     *
     * WARNING: This authorizes an upgrade that will take place without any
     * safety checks, for example that the spec name remains the same and that
     * the version number increases. Not recommended for normal use. Use
     * `authorize_upgrade` instead.
     *
     * This call requires Root origin.
     */
    authorize_upgrade_without_checks: {
      code_hash: FixedSizeBinary<32>
    }
    /**
     * Provide the preimage (runtime binary) `code` for an upgrade that has been
     * authorized.
     *
     * If the authorization required a version check, this call will ensure the
     * spec name remains unchanged and that the spec version has increased.
     *
     * Depending on the runtime's `OnSetCode` configuration, this function may
     * directly apply the new `code` in the same block or attempt to schedule
     * the upgrade.
     *
     * All origins are allowed.
     */
    apply_authorized_upgrade: {
      code: Binary
    }
  }>
  Scheduler: Enum<{
    /**
     * Anonymously schedule a task.
     */
    schedule: {
      when: number
      maybe_periodic?: Anonymize<Iep7au1720bm0e>
      priority: number
      call: TxCallData
    }
    /**
     * Cancel an anonymously scheduled task.
     */
    cancel: {
      when: number
      index: number
    }
    /**
     * Schedule a named task.
     */
    schedule_named: {
      id: FixedSizeBinary<32>
      when: number
      maybe_periodic?: Anonymize<Iep7au1720bm0e>
      priority: number
      call: TxCallData
    }
    /**
     * Cancel a named scheduled task.
     */
    cancel_named: {
      id: FixedSizeBinary<32>
    }
    /**
     * Anonymously schedule a task after a delay.
     */
    schedule_after: {
      after: number
      maybe_periodic?: Anonymize<Iep7au1720bm0e>
      priority: number
      call: TxCallData
    }
    /**
     * Schedule a named task after a delay.
     */
    schedule_named_after: {
      id: FixedSizeBinary<32>
      after: number
      maybe_periodic?: Anonymize<Iep7au1720bm0e>
      priority: number
      call: TxCallData
    }
    /**
     * Set a retry configuration for a task so that, in case its scheduled run
     * fails, it will be retried after `period` blocks, for a total amount of
     * `retries` retries or until it succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight
     * metering and agenda space, same as a regular task. If a periodic task
     * fails, it will be scheduled normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed,
     * non-periodic clones of the original task. Their retry configuration will
     * be derived from the original task's configuration, but will have a lower
     * value for `remaining` than the original `total_retries`.
     */
    set_retry: {
      task: Anonymize<I9jd27rnpm8ttv>
      retries: number
      period: number
    }
    /**
     * Set a retry configuration for a named task so that, in case its scheduled
     * run fails, it will be retried after `period` blocks, for a total amount
     * of `retries` retries or until it succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight
     * metering and agenda space, same as a regular task. If a periodic task
     * fails, it will be scheduled normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed,
     * non-periodic clones of the original task. Their retry configuration will
     * be derived from the original task's configuration, but will have a lower
     * value for `remaining` than the original `total_retries`.
     */
    set_retry_named: {
      id: FixedSizeBinary<32>
      retries: number
      period: number
    }
    /**
     * Removes the retry configuration of a task.
     */
    cancel_retry: {
      task: Anonymize<I9jd27rnpm8ttv>
    }
    /**
     * Cancel the retry configuration of a named task.
     */
    cancel_retry_named: {
      id: FixedSizeBinary<32>
    }
  }>
  Preimage: Enum<{
    /**
     * Register a preimage on-chain.
     *
     * If the preimage was previously requested, no fees or deposits are taken
     * for providing the preimage. Otherwise, a deposit is taken proportional to
     * the size of the preimage.
     */
    note_preimage: {
      bytes: Binary
    }
    /**
     * Clear an unrequested preimage from the runtime storage.
     *
     * If `len` is provided, then it will be a much cheaper operation.
     *
     * - `hash`: The hash of the preimage to be removed from the store.
     * - `len`: The length of the preimage of `hash`.
     */
    unnote_preimage: Anonymize<I1jm8m1rh9e20v>
    /**
     * Request a preimage be uploaded to the chain without paying any fees or
     * deposits.
     *
     * If the preimage requests has already been provided on-chain, we unreserve
     * any deposit a user may have paid, and take the control of the preimage
     * out of their hands.
     */
    request_preimage: Anonymize<I1jm8m1rh9e20v>
    /**
     * Clear a previously made request for a preimage.
     *
     * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN
     * `request_preimage`.
     */
    unrequest_preimage: Anonymize<I1jm8m1rh9e20v>
    /**
     * Ensure that the bulk of pre-images is upgraded.
     *
     * The caller pays no fee if at least 90% of pre-images were successfully
     * updated.
     */
    ensure_updated: {
      hashes: Anonymize<Ic5m5lp1oioo8r>
    }
  }>
  Babe: Enum<{
    /**
     * Report authority equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     */
    report_equivocation: {
      equivocation_proof: {
        offender: FixedSizeBinary<32>
        slot: bigint
        first_header: Anonymize<Ic952bubvq4k7d>
        second_header: Anonymize<Ic952bubvq4k7d>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report authority equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     * This extrinsic must be called unsigned and it is expected that only block
     * authors will call it (validated in `ValidateUnsigned`), as such if the
     * block author is defined it will be defined as the equivocation reporter.
     */
    report_equivocation_unsigned: {
      equivocation_proof: {
        offender: FixedSizeBinary<32>
        slot: bigint
        first_header: Anonymize<Ic952bubvq4k7d>
        second_header: Anonymize<Ic952bubvq4k7d>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Plan an epoch config change. The epoch config change is recorded and will
     * be enacted on the next call to `enact_epoch_change`. The config will be
     * activated one epoch after.
     * Multiple calls to this method will replace any existing planned config
     * change that had not been enacted yet.
     */
    plan_config_change: {
      config: BabeDigestsNextConfigDescriptor
    }
  }>
  Timestamp: Enum<{
    /**
     * Set the current time.
     *
     * This call should be invoked exactly once per block. It will panic at the
     * finalization phase, if this call hasn't been invoked by that time.
     *
     * The timestamp should be greater than the previous one by the amount
     * specified by [`Config::MinimumPeriod`].
     *
     * The dispatch origin for this call must be _None_.
     *
     * This dispatch class is _Mandatory_ to ensure it gets executed in the
     * block. Be aware that changing the complexity of this call could result
     * exhausting the resources in a block to execute any other calls.
     *
     * ## Complexity - `O(1)` (Note that implementations of `OnTimestampSet`
     * must also be `O(1)`)
     * - 1 storage read and 1 storage mutation (codec `O(1)` because of
     * `DidUpdate::take` in `on_finalize`)
     * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
     */
    set: {
      now: bigint
    }
  }>
  Indices: Enum<{
    /**
     * Assign an previously unassigned index.
     *
     * Payment: `Deposit` is reserved from the sender account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be claimed. This must not be in use.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity - `O(1)`.
     */
    claim: Anonymize<I666bl2fqjkejo>
    /**
     * Assign an index already owned by the sender to another account. The
     * balance reservation is effectively transferred to the new account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be re-assigned. This must be owned by the sender.
     * - `new`: the new owner of the index. This function is a no-op if it is
     * equal to sender.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity - `O(1)`.
     */
    transfer: {
      new: MultiAddress
      index: number
    }
    /**
     * Free up an index owned by the sender.
     *
     * Payment: Any previous deposit placed for the index is unreserved in the
     * sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must
     * own the index.
     *
     * - `index`: the index to be freed. This must be owned by the sender.
     *
     * Emits `IndexFreed` if successful.
     *
     * ## Complexity - `O(1)`.
     */
    free: Anonymize<I666bl2fqjkejo>
    /**
     * Force an index to an account. This doesn't require a deposit. If the
     * index is already held, then any deposit is reimbursed to its current
     * owner.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `index`: the index to be (re-)assigned.
     * - `new`: the new owner of the index. This function is a no-op if it is
     * equal to sender.
     * - `freeze`: if set to `true`, will freeze the index so it cannot be
     * transferred.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity - `O(1)`.
     */
    force_transfer: {
      new: MultiAddress
      index: number
      freeze: boolean
    }
    /**
     * Freeze an index so it will always point to the sender account. This
     * consumes the deposit.
     *
     * The dispatch origin for this call must be _Signed_ and the signing
     * account must have a non-frozen account `index`.
     *
     * - `index`: the index to be frozen in place.
     *
     * Emits `IndexFrozen` if successful.
     *
     * ## Complexity - `O(1)`.
     */
    freeze: Anonymize<I666bl2fqjkejo>
    /**
     * Poke the deposit reserved for an index.
     *
     * The dispatch origin for this call must be _Signed_ and the signing
     * account must have a non-frozen account `index`.
     *
     * The transaction fees is waived if the deposit is changed after
     * poking/reconsideration.
     *
     * - `index`: the index whose deposit is to be poked/reconsidered.
     *
     * Emits `DepositPoked` if successful.
     */
    poke_deposit: Anonymize<I666bl2fqjkejo>
  }>
  Balances: Enum<{
    /**
     * Transfer some liquid free balance to another account.
     *
     * `transfer_allow_death` will set the `FreeBalance` of the sender and
     * receiver.
     * If the sender's account is below the existential deposit as a result of
     * the transfer, the account will be reaped.
     *
     * The dispatch origin for this call must be `Signed` by the transactor.
     */
    transfer_allow_death: {
      dest: MultiAddress
      value: bigint
    }
    /**
     * Exactly as `transfer_allow_death`, except the origin must be root and the
     * source account may be specified.
     */
    force_transfer: {
      source: MultiAddress
      dest: MultiAddress
      value: bigint
    }
    /**
     * Same as the [`transfer_allow_death`] call, but with a check that the
     * transfer will not kill the origin account.
     *
     * 99% of the time you want [`transfer_allow_death`] instead.
     *
     * [`transfer_allow_death`]: struct.Pallet.html#method.transfer.
     */
    transfer_keep_alive: {
      dest: MultiAddress
      value: bigint
    }
    /**
     * Transfer the entire transferable balance from the caller account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances.
     * This means that any locked, reserved, or existential deposits (when
     * `keep_alive` is `true`), will not be transferred by this function. To
     * ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters,
     * storage deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation
     * should send all of the funds the account has, causing the sender account
     * to be killed (false), or transfer everything except at least the
     * existential deposit, which will guarantee to keep the sender account
     * alive (true).
     */
    transfer_all: {
      dest: MultiAddress
      keep_alive: boolean
    }
    /**
     * Unreserve some balance from a user by force.
     *
     * Can only be called by ROOT.
     */
    force_unreserve: {
      who: MultiAddress
      amount: bigint
    }
    /**
     * Upgrade a specified account.
     *
     * - `origin`: Must be `Signed`.
     * - `who`: The account to be upgraded.
     *
     * This will waive the transaction fee if at least all but 10% of the
     * accounts needed to be upgraded. (We let some not have to be upgraded just
     * in order to allow for the possibility of churn).
     */
    upgrade_accounts: {
      who: Anonymize<Ia2lhg7l2hilo3>
    }
    /**
     * Set the regular balance of a given account.
     *
     * The dispatch origin for this call is `root`.
     */
    force_set_balance: {
      who: MultiAddress
      new_free: bigint
    }
    /**
     * Adjust the total issuance in a saturating way.
     *
     * Can only be called by root and always needs a positive `delta`.
     *
     * # Example.
     */
    force_adjust_total_issuance: {
      direction: BalancesAdjustmentDirection
      delta: bigint
    }
    /**
     * Burn the specified liquid free balance from the origin account.
     *
     * If the origin's account ends up below the existential deposit as a result
     * of the burn and `keep_alive` is false, the account will be reaped.
     *
     * Unlike sending funds to a _burn_ address, which merely makes the funds
     * inaccessible,
     * this `burn` operation will reduce total issuance by the amount _burned_.
     */
    burn: {
      value: bigint
      keep_alive: boolean
    }
  }>
  Staking: Enum<{
    /**
     * Take the origin account as a stash and lock up `value` of its balance.
     * `controller` will be the account that controls it.
     *
     * `value` must be more than the `minimum_balance` specified by
     * `T::Currency`.
     *
     * The dispatch origin for this call must be _Signed_ by the stash account.
     *
     * Emits `Bonded`.
     * ## Complexity - Independent of the arguments. Moderate complexity.
     * - O(1).
     * - Three extra DB entries.
     *
     * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are
     * _never_ cleaned unless the `origin` falls below _existential deposit_ (or
     * equal to 0) and gets removed as dust.
     */
    bond: {
      value: bigint
      payee: StakingRewardDestination
    }
    /**
     * Add some extra amount that have appeared in the stash `free_balance` into
     * the balance up for staking.
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the
     * controller.
     *
     * Use this if there are additional funds in your stash account that you
     * wish to bond.
     * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function
     * does not impose any limitation on the amount that can be added.
     *
     * Emits `Bonded`.
     *
     * ## Complexity - Independent of the arguments. Insignificant complexity.
     * - O(1).
     */
    bond_extra: {
      max_additional: bigint
    }
    /**
     * Schedule a portion of the stash to be unlocked ready for transfer out
     * after the bond period ends. If this leaves an amount actively bonded less
     * than [`asset::existential_deposit`], then it is increased to the full
     * amount.
     *
     * The stash may be chilled if the ledger total amount falls to 0 after
     * unbonding.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     *
     * Once the unlock period is done, you can call `withdraw_unbonded` to
     * actually move the funds out of management ready for transfer.
     *
     * No more than a limited number of unlocking chunks (see
     * `MaxUnlockingChunks`)
     * can co-exists at the same time. If there are no unlocking chunks slots
     * available [`Call::withdraw_unbonded`] is called to remove some of the
     * chunks (if possible).
     *
     * If a user encounters the `InsufficientBond` error when calling this
     * extrinsic,
     * they should call `chill` first in order to free up their bonded funds.
     *
     * Emits `Unbonded`.
     *
     * See also [`Call::withdraw_unbonded`].
     */
    unbond: {
      value: bigint
    }
    /**
     * Remove any unlocked chunks from the `unlocking` queue from our
     * management.
     *
     * This essentially frees up that balance to be used by the stash account to
     * do whatever it wants.
     *
     * The dispatch origin for this call must be _Signed_ by the controller.
     *
     * Emits `Withdrawn`.
     *
     * See also [`Call::unbond`].
     *
     * ## Parameters
     *
     * - `num_slashing_spans` indicates the number of metadata slashing spans to
     * clear when this call results in a complete removal of all the data
     * related to the stash account.
     * In this case, the `num_slashing_spans` must be larger or equal to the
     * number of slashing spans associated with the stash account in the
     * [`SlashingSpans`] storage type,
     * otherwise the call will fail. The call weight is directly proportional to
     * `num_slashing_spans`.
     *
     * ## Complexity O(S) where S is the number of slashing spans to remove
     * NOTE: Weight annotation is the kill scenario, we refund otherwise.
     */
    withdraw_unbonded: {
      num_slashing_spans: number
    }
    /**
     * Declare the desire to validate for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     */
    validate: {
      prefs: {
        commission: number
        blocked: boolean
      }
    }
    /**
     * Declare the desire to nominate `targets` for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     *
     * ## Complexity - The transaction's complexity is proportional to the size
     * of `targets` (N)
     * which is capped at CompactAssignments::LIMIT (T::MaxNominations).
     * - Both the reads and writes follow a similar pattern.
     */
    nominate: {
      targets: Anonymize<I28gn91b2ttnbk>
    }
    /**
     * Declare no desire to either validate or nominate.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     *
     * ## Complexity - Independent of the arguments. Insignificant complexity.
     * - Contains one read.
     * - Writes are limited to the `origin` account key.
     */
    chill: undefined
    /**
     * (Re-)set the payment target for a controller.
     *
     * Effects will be felt instantly (as soon as this function is completed
     * successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     *
     * ## Complexity - O(1)
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     * ---------
     */
    set_payee: {
      payee: StakingRewardDestination
    }
    /**
     * (Re-)sets the controller of a stash to the stash itself. This function
     * previously accepted a `controller` argument to set the controller to an
     * account other than the stash itself. This functionality has now been
     * removed, now only setting the controller to the stash, if it is not
     * already.
     *
     * Effects will be felt instantly (as soon as this function is completed
     * successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the
     * controller.
     *
     * ## Complexity O(1)
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     */
    set_controller: undefined
    /**
     * Sets the ideal number of validators.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity O(1)
     */
    set_validator_count: Anonymize<I3vh014cqgmrfd>
    /**
     * Increments the ideal number of validators up to maximum of
     * `ElectionProviderBase::MaxWinners`.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity Same as [`Self::set_validator_count`].
     */
    increase_validator_count: {
      additional: number
    }
    /**
     * Scale up the ideal number of validators by a factor up to maximum of
     * `ElectionProviderBase::MaxWinners`.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity Same as [`Self::set_validator_count`].
     */
    scale_validator_count: {
      factor: number
    }
    /**
     * Force there to be no new eras indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * Thus the election process may be ongoing when this is called. In this
     * case the election will continue until the next era is triggered.
     *
     * ## Complexity - No arguments.
     * - Weight: O(1)
     */
    force_no_eras: undefined
    /**
     * Force there to be a new era at the end of the next session. After this,
     * it will be reset to normal (non-forced) behaviour.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election
     * process may not have enough blocks to get a result.
     *
     * ## Complexity - No arguments.
     * - Weight: O(1)
     */
    force_new_era: undefined
    /**
     * Set the validators who cannot be slashed (if any).
     *
     * The dispatch origin must be Root.
     */
    set_invulnerables: {
      invulnerables: Anonymize<Ia2lhg7l2hilo3>
    }
    /**
     * Force a current staker to become completely unstaked, immediately.
     *
     * The dispatch origin must be Root.
     *
     * ## Parameters
     *
     * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`]
     * for more details.
     */
    force_unstake: {
      stash: SS58String
      num_slashing_spans: number
    }
    /**
     * Force there to be a new era at the end of sessions indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election
     * process may not have enough blocks to get a result.
     */
    force_new_era_always: undefined
    /**
     * Cancel enactment of a deferred slash.
     *
     * Can be called by the `T::AdminOrigin`.
     *
     * Parameters: era and indices of the slashes for that era to kill.
     * They **must** be sorted in ascending order, *and* unique.
     */
    cancel_deferred_slash: {
      era: number
      slash_indices: Anonymize<Icgljjb6j82uhn>
    }
    /**
     * Pay out next page of the stakers behind a validator for the given era.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth;
     * current_era]`.
     *
     * The origin of this call must be _Signed_. Any account can call this
     * function, even if it is not one of the stakers.
     *
     * The reward payout could be paged in case there are too many nominators
     * backing the `validator_stash`. This call will payout unpaid pages in an
     * ascending order. To claim a specific page, use `payout_stakers_by_page`.`
     *
     * If all pages are claimed, it returns an error `InvalidPage`.
     */
    payout_stakers: {
      validator_stash: SS58String
      era: number
    }
    /**
     * Rebond a portion of the stash scheduled to be unlocked.
     *
     * The dispatch origin must be signed by the controller.
     *
     * ## Complexity - Time complexity: O(L), where L is unlocking chunks -
     * Bounded by `MaxUnlockingChunks`.
     */
    rebond: {
      value: bigint
    }
    /**
     * Remove all data structures concerning a staker/stash once it is at a
     * state where it can be considered `dust` in the staking system. The
     * requirements are:
     *
     * 1. the `total_balance` of the stash is below existential deposit.
     * 2. or, the `ledger.total` of the stash is below existential deposit.
     * 3. or, existential deposit is zero and either `total_balance` or
     * `ledger.total` is zero.
     *
     * The former can happen in cases like a slash; the latter when a fully
     * unbonded account is still receiving staking rewards in
     * `RewardDestination::Staked`.
     *
     * It can be called by anyone, as long as `stash` meets the above
     * requirements.
     *
     * Refunds the transaction fees upon successful execution.
     *
     * ## Parameters
     *
     * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`]
     * for more details.
     */
    reap_stash: {
      stash: SS58String
      num_slashing_spans: number
    }
    /**
     * Remove the given nominations from the calling validator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not
     * the stash.
     *
     * - `who`: A list of nominator stash accounts who are nominating this
     * validator which should no longer be nominating this validator.
     *
     * Note: Making this call only makes sense if you first set the validator
     * preferences to block any further nominations.
     */
    kick: {
      who: Anonymize<I28gn91b2ttnbk>
    }
    /**
     * Update the various staking configurations .
     *
     * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
     * * `min_validator_bond`: The minimum active bond needed to be a validator.
     * * `max_nominator_count`: The max number of users who can be a nominator
     * at once. When set to `None`, no limit is enforced.
     * * `max_validator_count`: The max number of users who can be a validator
     * at once. When set to `None`, no limit is enforced.
     * * `chill_threshold`: The ratio of `max_nominator_count` or
     * `max_validator_count` which should be filled in order for the
     * `chill_other` transaction to work.
     * * `min_commission`: The minimum amount of commission that each validators
     * must maintain.
     * This is checked only upon calling `validate`. Existing validators are not
     * affected.
     *
     * RuntimeOrigin must be Root to call this function.
     *
     * NOTE: Existing nominators and validators will not be affected by this
     * update.
     * to kick people under the new limits, `chill_other` should be called.
     */
    set_staking_configs: {
      min_nominator_bond: StakingPalletConfigOpBig
      min_validator_bond: StakingPalletConfigOpBig
      max_nominator_count: StakingPalletConfigOp
      max_validator_count: StakingPalletConfigOp
      chill_threshold: StakingPalletConfigOp
      min_commission: StakingPalletConfigOp
      max_staked_rewards: StakingPalletConfigOp
    }
    /**
     * Declare a `controller` to stop participating as either a validator or
     * nominator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_, but can be called by
     * anyone.
     *
     * If the caller is the same as the controller being targeted, then no
     * further checks are enforced, and this function behaves just like `chill`.
     *
     * If the caller is different than the controller being targeted, the
     * following conditions must be met:
     *
     * * `controller` must belong to a nominator who has become non-decodable,
     *
     * Or:
     *
     * * A `ChillThreshold` must be set and checked which defines how close to
     * the max nominators or validators we must reach before users can start
     * chilling one-another.
     * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used
     * to determine how close we are to the threshold.
     * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked,
     * which determines if this is a person that should be chilled because they
     * have not met the threshold bond required.
     *
     * This can be helpful if bond requirements are updated, and we need to
     * remove old users who do not satisfy these requirements.
     */
    chill_other: {
      stash: SS58String
    }
    /**
     * Force a validator to have at least the minimum commission. This will not
     * affect a validator who already has a commission greater than or equal to
     * the minimum. Any account can call this.
     */
    force_apply_min_commission: {
      validator_stash: SS58String
    }
    /**
     * Sets the minimum amount of commission that each validators must maintain.
     *
     * This call has lower privilege requirements than `set_staking_config` and
     * can be called by the `T::AdminOrigin`. Root can always call this.
     */
    set_min_commission: Anonymize<I3vh014cqgmrfd>
    /**
     * Pay out a page of the stakers behind a validator for the given era and
     * page.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth;
     * current_era]`.
     * - `page` is the page index of nominators to pay out with value between 0
     * and `num_nominators / T::MaxExposurePageSize`.
     *
     * The origin of this call must be _Signed_. Any account can call this
     * function, even if it is not one of the stakers.
     *
     * If a validator has more than [`Config::MaxExposurePageSize`] nominators
     * backing them, then the list of nominators is paged, with each page being
     * capped at [`Config::MaxExposurePageSize`.] If a validator has more than
     * one page of nominators,
     * the call needs to be made for each page separately in order for all the
     * nominators backing a validator to receive the reward. The nominators are
     * not sorted across pages and so it should not be assumed the highest
     * staker would be on the topmost page and vice versa. If rewards are not
     * claimed in [`Config::HistoryDepth`] eras, they are lost.
     */
    payout_stakers_by_page: {
      validator_stash: SS58String
      era: number
      page: number
    }
    /**
     * Migrates an account's `RewardDestination::Controller` to
     * `RewardDestination::Account(controller)`.
     *
     * Effects will be felt instantly (as soon as this function is completed
     * successfully).
     *
     * This will waive the transaction fee if the `payee` is successfully
     * migrated.
     */
    update_payee: {
      controller: SS58String
    }
    /**
     * Updates a batch of controller accounts to their corresponding stash
     * account if they are not the same. Ignores any controller accounts that do
     * not exist, and does not operate if the stash and controller are already
     * the same.
     *
     * Effects will be felt instantly (as soon as this function is completed
     * successfully).
     *
     * The dispatch origin must be `T::AdminOrigin`.
     */
    deprecate_controller_batch: {
      controllers: Anonymize<Ia2lhg7l2hilo3>
    }
    /**
     * Restores the state of a ledger which is in an inconsistent state.
     *
     * The requirements to restore a ledger are the following:
     * * The stash is bonded; or * The stash is not bonded but it has a staking
     * lock left behind; or * If the stash has an associated ledger and its
     * state is inconsistent; or * If the ledger is not corrupted *but* its
     * staking lock is out of sync.
     *
     * The `maybe_*` input parameters will overwrite the corresponding data and
     * metadata of the ledger associated with the stash. If the input parameters
     * are not set, the ledger will be reset values from on-chain state.
     */
    restore_ledger: {
      stash: SS58String
      maybe_controller?: Anonymize<Ihfphjolmsqq1>
      maybe_total?: Anonymize<I35p85j063s0il>
      maybe_unlocking?:
        | Array<{
            value: bigint
            era: number
          }>
        | undefined
    }
    /**
     * Removes the legacy Staking locks if they exist.
     *
     * This removes the legacy lock on the stake with [`Config::OldCurrency`]
     * and creates a hold on it if needed. If all stake cannot be held, the best
     * effort is made to hold as much as possible. The remaining stake is forced
     * withdrawn from the ledger.
     *
     * The fee is waived if the migration is successful.
     */
    migrate_currency: {
      stash: SS58String
    }
    /**
     * This function allows governance to manually slash a validator and is a
     * **fallback mechanism**.
     *
     * The dispatch origin must be `T::AdminOrigin`.
     *
     * ## Parameters - `validator_stash` - The stash account of the validator to
     * slash.
     * - `era` - The era in which the validator was in the active set.
     * - `slash_fraction` - The percentage of the stake to slash, expressed as a
     * Perbill.
     *
     * ## Behavior
     *
     * The slash will be applied using the standard slashing mechanics,
     * respecting the configured `SlashDeferDuration`.
     *
     * This means:
     * - If the validator was already slashed by a higher percentage for the
     * same era, this slash will have no additional effect.
     * - If the validator was previously slashed by a lower percentage, only the
     * difference will be applied.
     * - The slash will be deferred by `SlashDeferDuration` eras before being
     * enacted.
     */
    manual_slash: {
      validator_stash: SS58String
      era: number
      slash_fraction: number
    }
  }>
  Session: Enum<{
    /**
     * Sets the session key(s) of the function caller to `keys`.
     * Allows an account to set its session key prior to becoming a validator.
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be signed.
     *
     * ## Complexity - `O(1)`. Actual cost depends on the number of length of
     * `T::Keys::key_ids()` which is fixed.
     */
    set_keys: {
      keys: {
        grandpa: FixedSizeBinary<32>
        babe: FixedSizeBinary<32>
        para_validator: FixedSizeBinary<32>
        para_assignment: FixedSizeBinary<32>
        authority_discovery: FixedSizeBinary<32>
        beefy: FixedSizeBinary<33>
      }
      proof: Binary
    }
    /**
     * Removes any session key(s) of the function caller.
     *
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be Signed and the account must
     * be either be convertible to a validator ID using the chain's typical
     * addressing system (this usually means being a controller account) or
     * directly convertible into a validator ID (which usually means being a
     * stash account).
     *
     * ## Complexity - `O(1)` in number of key types. Actual cost depends on the
     * number of length of `T::Keys::key_ids()` which is fixed.
     */
    purge_keys: undefined
  }>
  Grandpa: Enum<{
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     */
    report_equivocation: {
      equivocation_proof: {
        set_id: bigint
        equivocation: GrandpaEquivocation
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only block
     * authors will call it (validated in `ValidateUnsigned`), as such if the
     * block author is defined it will be defined as the equivocation reporter.
     */
    report_equivocation_unsigned: {
      equivocation_proof: {
        set_id: bigint
        equivocation: GrandpaEquivocation
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Note that the current authority set of the GRANDPA finality gadget has
     * stalled.
     *
     * This will trigger a forced authority set change at the beginning of the
     * next session, to be enacted `delay` blocks after that. The `delay` should
     * be high enough to safely assume that the block signalling the forced
     * change will not be re-orged e.g. 1000 blocks.
     * The block production rate (which may be slowed down because of finality
     * lagging) should be taken into account when choosing the `delay`. The
     * GRANDPA voters based on the new authority will start voting on top of
     * `best_finalized_block_number` for new finalized blocks.
     * `best_finalized_block_number` should be the highest of the latest
     * finalized block of all validators of the new authority set.
     *
     * Only callable by root.
     */
    note_stalled: {
      delay: number
      best_finalized_block_number: number
    }
  }>
  Treasury: Enum<{
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least
     * `amount`.
     *
     * ### Details NOTE: For record-keeping purposes, the proposer is deemed to
     * be equivalent to the beneficiary.
     *
     * ### Parameters - `amount`: The amount to be transferred from the treasury
     * to the `beneficiary`.
     * - `beneficiary`: The destination account for the transfer.
     *
     * ## Events
     *
     * Emits [`Event::SpendApproved`] if successful.
     */
    spend_local: {
      amount: bigint
      beneficiary: MultiAddress
    }
    /**
     * Force a previously approved proposal to be removed from the approval
     * queue.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * The original deposit will no longer be returned.
     *
     * ### Parameters - `proposal_id`: The index of a proposal
     *
     * ### Complexity - O(A) where `A` is the number of approvals
     *
     * ### Errors - [`Error::ProposalNotApproved`]: The `proposal_id` supplied
     * was not found in the approval queue, i.e., the proposal has not been
     * approved. This could also mean the proposal does not exist altogether,
     * thus there is no way it would have been approved in the first place.
     */
    remove_approval: {
      proposal_id: number
    }
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least
     * `amount` of `asset_kind` in the native asset. The amount of `asset_kind`
     * is converted for assertion using the [`Config::BalanceConverter`].
     *
     * ## Details
     *
     * Create an approved spend for transferring a specific `amount` of
     * `asset_kind` to a designated beneficiary. The spend must be claimed using
     * the `payout` dispatchable within the [`Config::PayoutPeriod`].
     *
     * ### Parameters - `asset_kind`: An indicator of the specific asset class
     * to be spent.
     * - `amount`: The amount to be transferred from the treasury to the
     * `beneficiary`.
     * - `beneficiary`: The beneficiary of the spend.
     * - `valid_from`: The block number from which the spend can be claimed. It
     * can refer to the past if the resulting spend has not yet expired
     * according to the [`Config::PayoutPeriod`]. If `None`, the spend can be
     * claimed immediately after approval.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendApproved`] if successful.
     */
    spend: {
      asset_kind: Anonymize<I2q3ri6itcjj5u>
      amount: bigint
      beneficiary: XcmVersionedLocation
      valid_from?: Anonymize<I4arjljr6dpflb>
    }
    /**
     * Claim a spend.
     *
     * ## Dispatch Origin
     *
     * Must be signed
     *
     * ## Details
     *
     * Spends must be claimed within some temporal bounds. A spend may be
     * claimed within one [`Config::PayoutPeriod`] from the `valid_from` block.
     * In case of a payout failure, the spend status must be updated with the
     * `check_status`
     * dispatchable before retrying with the current function.
     *
     * ### Parameters - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::Paid`] if successful.
     */
    payout: Anonymize<I666bl2fqjkejo>
    /**
     * Check the status of the spend and remove it from the storage if
     * processed.
     *
     * ## Dispatch Origin
     *
     * Must be signed.
     *
     * ## Details
     *
     * The status check is a prerequisite for retrying a failed payout.
     * If a spend has either succeeded or expired, it is removed from the
     * storage by this function. In such instances, transaction fees are
     * refunded.
     *
     * ### Parameters - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::PaymentFailed`] if the spend payout has failed.
     * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
     */
    check_status: Anonymize<I666bl2fqjkejo>
    /**
     * Void previously approved spend.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * A spend void is only possible if the payout has not been attempted yet.
     *
     * ### Parameters - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendVoided`] if successful.
     */
    void_spend: Anonymize<I666bl2fqjkejo>
  }>
  ConvictionVoting: Enum<{
    /**
     * Vote in a poll. If `vote.is_aye()`, the vote is to enact the proposal;
     * otherwise it is a vote to keep the status quo.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `poll_index`: The index of the poll to vote for.
     * - `vote`: The vote configuration.
     *
     * Weight: `O(R)` where R is the number of polls the voter has voted on.
     */
    vote: {
      poll_index: number
      vote: ConvictionVotingVoteAccountVote
    }
    /**
     * Delegate the voting power (with some given conviction) of the sending
     * account for a particular class of polls.
     *
     * The balance delegated is locked for as long as it's delegated, and
     * thereafter for the time appropriate for the conviction's lock period.
     *
     * The dispatch origin of this call must be _Signed_, and the signing
     * account must either:
     * - be delegating already; or - have no voting activity (if there is, then
     * it will need to be removed through `remove_vote`).
     *
     * - `to`: The account whose voting the `target` account's voting power will
     * follow.
     * - `class`: The class of polls to delegate. To delegate multiple classes,
     * multiple calls to this function are required.
     * - `conviction`: The conviction that will be attached to the delegated
     * votes. When the account is undelegated, the funds will be locked for the
     * corresponding period.
     * - `balance`: The amount of the account's balance to be used in
     * delegating. This must not be more than the account's current balance.
     *
     * Emits `Delegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is
     * refunded later.
     */
    delegate: {
      class: number
      to: MultiAddress
      conviction: VotingConviction
      balance: bigint
    }
    /**
     * Undelegate the voting power of the sending account for a particular class
     * of polls.
     *
     * Tokens may be unlocked following once an amount of time consistent with
     * the lock period of the conviction with which the delegation was issued
     * has passed.
     *
     * The dispatch origin of this call must be _Signed_ and the signing account
     * must be currently delegating.
     *
     * - `class`: The class of polls to remove the delegation from.
     *
     * Emits `Undelegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is
     * refunded later.
     */
    undelegate: {
      class: number
    }
    /**
     * Remove the lock caused by prior voting/delegating which has expired
     * within a particular class.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `class`: The class of polls to unlock.
     * - `target`: The account to remove the lock on.
     *
     * Weight: `O(R)` with R number of vote of target.
     */
    unlock: {
      class: number
      target: MultiAddress
    }
    /**
     * Remove a vote for a poll.
     *
     * If:
     * - the poll was cancelled, or - the poll is ongoing, or - the poll has
     * ended such that - the vote of the account was in opposition to the
     * result; or - there was no conviction to the account's vote; or - the
     * account made a split vote ...then the vote is removed cleanly and a
     * following call to `unlock` may result in more funds being available.
     *
     * If, however, the poll has ended and:
     * - it finished corresponding to the vote of the account, and - the account
     * made a standard vote with conviction, and - the lock period of the
     * conviction is not over ...then the lock will be aggregated into the
     * overall account's lock, which may involve *overlocking* (where the two
     * locks are combined into a single lock that is the maximum of both the
     * amount locked and the time is it locked for).
     *
     * The dispatch origin of this call must be _Signed_, and the signer must
     * have a vote registered for poll `index`.
     *
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: Optional parameter, if given it indicates the class of the
     * poll. For polls which have finished or are cancelled, this must be
     * `Some`.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has
     * voted on.
     * Weight is calculated for the maximum number of vote.
     */
    remove_vote: {
      class?: Anonymize<I4arjljr6dpflb>
      index: number
    }
    /**
     * Remove a vote for a poll.
     *
     * If the `target` is equal to the signer, then this function is exactly
     * equivalent to `remove_vote`. If not equal to the signer, then the vote
     * must have expired,
     * either because the poll was cancelled, because the voter lost the poll or
     * because the conviction period is over.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `target`: The account of the vote to be removed; this account must have
     * voted for poll `index`.
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: The class of the poll.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has
     * voted on.
     * Weight is calculated for the maximum number of vote.
     */
    remove_other_vote: {
      target: MultiAddress
      class: number
      index: number
    }
  }>
  Referenda: Enum<{
    /**
     * Propose a referendum on a privileged action.
     *
     * - `origin`: must be `SubmitOrigin` and the account must have
     * `SubmissionDeposit` funds available.
     * - `proposal_origin`: The origin from which the proposal should be
     * executed.
     * - `proposal`: The proposal.
     * - `enactment_moment`: The moment that the proposal should be enacted.
     *
     * Emits `Submitted`.
     */
    submit: {
      proposal_origin: Anonymize<I39p61kmiacrk5>
      proposal: PreimagesBounded
      enactment_moment: TraitsScheduleDispatchTime
    }
    /**
     * Post the Decision Deposit for a referendum.
     *
     * - `origin`: must be `Signed` and the account must have funds available
     * for the referendum's track's Decision Deposit.
     * - `index`: The index of the submitted referendum whose Decision Deposit
     * is yet to be posted.
     *
     * Emits `DecisionDepositPlaced`.
     */
    place_decision_deposit: Anonymize<I666bl2fqjkejo>
    /**
     * Refund the Decision Deposit for a closed referendum back to the
     * depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Decision Deposit has
     * not yet been refunded.
     *
     * Emits `DecisionDepositRefunded`.
     */
    refund_decision_deposit: Anonymize<I666bl2fqjkejo>
    /**
     * Cancel an ongoing referendum.
     *
     * - `origin`: must be the `CancelOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Cancelled`.
     */
    cancel: Anonymize<I666bl2fqjkejo>
    /**
     * Cancel an ongoing referendum and slash the deposits.
     *
     * - `origin`: must be the `KillOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Killed` and `DepositSlashed`.
     */
    kill: Anonymize<I666bl2fqjkejo>
    /**
     * Advance a referendum onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `index`: the referendum to be advanced.
     */
    nudge_referendum: Anonymize<I666bl2fqjkejo>
    /**
     * Advance a track onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `track`: the track to be advanced.
     *
     * Action item for when there is now one fewer referendum in the deciding
     * phase and the `DecidingCount` is not yet updated. This means that we
     * should either:
     * - begin deciding another referendum (and leave `DecidingCount` alone); or
     * - decrement `DecidingCount`.
     */
    one_fewer_deciding: {
      track: number
    }
    /**
     * Refund the Submission Deposit for a closed referendum back to the
     * depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Submission Deposit has
     * not yet been refunded.
     *
     * Emits `SubmissionDepositRefunded`.
     */
    refund_submission_deposit: Anonymize<I666bl2fqjkejo>
    /**
     * Set or clear metadata of a referendum.
     *
     * Parameters:
     * - `origin`: Must be `Signed` by a creator of a referendum or by anyone to
     * clear a metadata of a finished referendum.
     * - `index`: The index of a referendum to set or clear metadata for.
     * - `maybe_hash`: The hash of an on-chain stored preimage. `None` to clear
     * a metadata.
     */
    set_metadata: {
      index: number
      maybe_hash?: FixedSizeBinary<32> | undefined
    }
  }>
  Whitelist: Enum<{
    whitelist_call: {
      call_hash: FixedSizeBinary<32>
    }
    remove_whitelisted_call: {
      call_hash: FixedSizeBinary<32>
    }
    dispatch_whitelisted_call: {
      call_hash: FixedSizeBinary<32>
      call_encoded_len: number
      call_weight_witness: Anonymize<I4q39t5hn830vp>
    }
    dispatch_whitelisted_call_with_preimage: {
      call: TxCallData
    }
  }>
  Claims: Enum<{
    /**
     * Make a claim to collect your DOTs.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to claim is deemed valid if the signature provided matches the
     * expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)
     *
     * and `address` matches the `dest` account.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message
     * matching the format described above.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    claim: {
      dest: SS58String
      ethereum_signature: FixedSizeBinary<65>
    }
    /**
     * Mint a new claim to collect DOTs.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * Parameters:
     * - `who`: The Ethereum address allowed to collect this claim.
     * - `value`: The number of DOTs that will be claimed.
     * - `vesting_schedule`: An optional vesting schedule for these DOTs.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * We assume worst case that both vesting and statement is being inserted.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    mint_claim: {
      who: FixedSizeBinary<20>
      value: bigint
      vesting_schedule?: [bigint, bigint, number] | undefined
      statement?: ClaimsStatementKind | undefined
    }
    /**
     * Make a claim to collect your DOTs by signing a statement.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to `claim_attest` is deemed valid if the signature provided
     * matches the expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)(statement)
     *
     * and `address` matches the `dest` account; the `statement` must match that
     * which is expected according to your purchase arrangement.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message
     * matching the format described above.
     * - `statement`: The identity of the statement which is being attested to
     * in the signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim_attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    claim_attest: {
      dest: SS58String
      ethereum_signature: FixedSizeBinary<65>
      statement: Binary
    }
    /**
     * Attest to a statement, needed to finalize the claims process.
     *
     * WARNING: Insecure unless your chain includes `PrevalidateAttests` as a
     * `TransactionExtension`.
     *
     * Unsigned Validation:
     * A call to attest is deemed valid if the sender has a `Preclaim`
     * registered and provides a `statement` which is expected for the account.
     *
     * Parameters:
     * - `statement`: The identity of the statement which is being attested to
     * in the signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to do pre-validation on `attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    attest: {
      statement: Binary
    }
    move_claim: {
      old: FixedSizeBinary<20>
      new: FixedSizeBinary<20>
      maybe_preclaim?: Anonymize<Ihfphjolmsqq1>
    }
  }>
  Vesting: Enum<{
    /**
     * Unlock any vested funds of the sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must
     * have funds still locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity - `O(1)`.
     */
    vest: undefined
    /**
     * Unlock any vested funds of a `target` account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account whose vested funds should be unlocked. Must have
     * funds still locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity - `O(1)`.
     */
    vest_other: {
      target: MultiAddress
    }
    /**
     * Create a vested transfer.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account receiving the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity - `O(1)`.
     */
    vested_transfer: {
      target: MultiAddress
      schedule: Anonymize<I4aro1m78pdrtt>
    }
    /**
     * Force a vested transfer.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `source`: The account whose funds should be transferred.
     * - `target`: The account that should be transferred the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity - `O(1)`.
     */
    force_vested_transfer: {
      source: MultiAddress
      target: MultiAddress
      schedule: Anonymize<I4aro1m78pdrtt>
    }
    /**
     * Merge two vesting schedules together, creating a new vesting schedule
     * that unlocks over the highest possible start and end blocks. If both
     * schedules have already started the current block will be used as the
     * schedule start; with the caveat that if one schedule is finished by the
     * current block, the other will be treated as the new merged schedule,
     * unmodified.
     *
     * NOTE: If `schedule1_index == schedule2_index` this is a no-op.
     * NOTE: This will unlock all schedules through the current block prior to
     * merging.
     * NOTE: If both schedules have ended by the current block, no new schedule
     * will be created and both will be removed.
     *
     * Merged schedule attributes:
     * - `starting_block`: `MAX(schedule1.starting_block,
     * scheduled2.starting_block,
     * current_block)`.
     * - `ending_block`: `MAX(schedule1.ending_block, schedule2.ending_block)`.
     * - `locked`: `schedule1.locked_at(current_block) +
     * schedule2.locked_at(current_block)`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `schedule1_index`: index of the first schedule to merge.
     * - `schedule2_index`: index of the second schedule to merge.
     */
    merge_schedules: {
      schedule1_index: number
      schedule2_index: number
    }
    /**
     * Force remove a vesting schedule
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `target`: An account that has a vesting schedule - `schedule_index`:
     * The vesting schedule index that should be removed.
     */
    force_remove_vesting_schedule: {
      target: MultiAddress
      schedule_index: number
    }
  }>
  Utility: Enum<{
    /**
     * Send a batch of dispatch calls.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of
     * call must not exceed the constant: `batched_calls_limit` (available in
     * constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin
     * filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity - O(C) where C is the number of calls to be batched.
     *
     * This will return `Ok` in all circumstances. To determine the success of
     * the batch, an event is deposited. If a call failed and the batch was
     * interrupted, then the `BatchInterrupted` event is deposited, along with
     * the number of successful calls made and the error of the failed call. If
     * all were successful, then the `BatchCompleted`
     * event is deposited.
     */
    batch: {
      calls: Array<TxCallData>
    }
    /**
     * Send a call through an indexed pseudonym of the sender.
     *
     * Filter from origin are passed along. The call will be dispatched with an
     * origin which use the same filter as the origin of this call.
     *
     * NOTE: If you need to ensure that any account-based filtering is not
     * honored (i.e.
     * because you expect `proxy` to have been used prior in the call stack and
     * you do not want the call restrictions to apply to any sub-accounts), then
     * use `as_multi_threshold_1`
     * in the Multisig pallet instead.
     *
     * NOTE: Prior to version *12, this was called `as_limited_sub`.
     *
     * The dispatch origin for this call must be _Signed_.
     */
    as_derivative: {
      index: number
      call: TxCallData
    }
    /**
     * Send a batch of dispatch calls and atomically execute them.
     * The whole transaction will rollback and fail if any of the calls failed.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of
     * call must not exceed the constant: `batched_calls_limit` (available in
     * constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin
     * filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity - O(C) where C is the number of calls to be batched.
     */
    batch_all: {
      calls: Array<TxCallData>
    }
    /**
     * Dispatches a function call with a provided origin.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * ## Complexity - O(1).
     */
    dispatch_as: {
      as_origin: Anonymize<I39p61kmiacrk5>
      call: TxCallData
    }
    /**
     * Send a batch of dispatch calls.
     * Unlike `batch`, it allows errors and won't interrupt.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of
     * call must not exceed the constant: `batched_calls_limit` (available in
     * constant metadata).
     *
     * If origin is root then the calls are dispatch without checking origin
     * filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity - O(C) where C is the number of calls to be batched.
     */
    force_batch: {
      calls: Array<TxCallData>
    }
    /**
     * Dispatch a function call with a specified weight.
     *
     * This function does not check the weight of the call, and instead allows
     * the Root origin to specify the weight of the call.
     *
     * The dispatch origin for this call must be _Root_.
     */
    with_weight: {
      call: TxCallData
      weight: Anonymize<I4q39t5hn830vp>
    }
    /**
     * Dispatch a fallback call in the event the main call fails to execute.
     * May be called from any origin except `None`.
     *
     * This function first attempts to dispatch the `main` call.
     * If the `main` call fails, the `fallback` is attemted.
     * if the fallback is successfully dispatched, the weights of both calls are
     * accumulated and an event containing the main call error is deposited.
     *
     * In the event of a fallback failure the whole call fails with the weights
     * returned.
     *
     * - `main`: The main call to be dispatched. This is the primary action to
     * execute.
     * - `fallback`: The fallback call to be dispatched in case the `main` call
     * fails.
     *
     * ## Dispatch Logic - If the origin is `root`, both the main and fallback
     * calls are executed without applying any origin filters.
     * - If the origin is not `root`, the origin filter is applied to both the
     * `main` and `fallback` calls.
     *
     * ## Use Case - Some use cases might involve submitting a `batch` type call
     * in either main, fallback or both.
     */
    if_else: {
      main: TxCallData
      fallback: TxCallData
    }
    /**
     * Dispatches a function call with a provided origin.
     *
     * Almost the same as [`Pallet::dispatch_as`] but forwards any error of the
     * inner call.
     *
     * The dispatch origin for this call must be _Root_.
     */
    dispatch_as_fallible: {
      as_origin: Anonymize<I39p61kmiacrk5>
      call: TxCallData
    }
  }>
  Proxy: Enum<{
    /**
     * Dispatch the given `call` from an account that the sender is authorised
     * for through `add_proxy`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked
     * for this call.
     * - `call`: The call to be made by the `real` account.
     */
    proxy: {
      real: MultiAddress
      force_proxy_type?: Anonymize<I93g3hgcn0dpaj>
      call: TxCallData
    }
    /**
     * Register a proxy account for the sender that is able to make calls on its
     * behalf.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to make a proxy.
     * - `proxy_type`: The permissions allowed for this proxy account.
     * - `delay`: The announcement period required of the initial proxy. Will
     * generally be zero.
     */
    add_proxy: {
      delegate: MultiAddress
      proxy_type: Anonymize<I7adrgaqb51jb9>
      delay: number
    }
    /**
     * Unregister a proxy account for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to remove as a proxy.
     * - `proxy_type`: The permissions currently enabled for the removed proxy
     * account.
     */
    remove_proxy: {
      delegate: MultiAddress
      proxy_type: Anonymize<I7adrgaqb51jb9>
      delay: number
    }
    /**
     * Unregister all proxy accounts for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * WARNING: This may be called on accounts created by `create_pure`, however
     * if done, then the unreserved fees will be inaccessible. **All access to
     * this account will be lost.**
     */
    remove_proxies: undefined
    /**
     * Spawn a fresh new account that is guaranteed to be otherwise
     * inaccessible, and initialize it with a proxy of `proxy_type` for `origin`
     * sender.
     *
     * Requires a `Signed` origin.
     *
     * - `proxy_type`: The type of the proxy that the sender will be registered
     * as over the new account. This will almost always be the most permissive
     * `ProxyType` possible to allow for maximum flexibility.
     * - `index`: A disambiguation index, in case this is called multiple times
     * in the same transaction (e.g. with `utility::batch`). Unless you're using
     * `batch` you probably just want to use `0`.
     * - `delay`: The announcement period required of the initial proxy. Will
     * generally be zero.
     *
     * Fails with `Duplicate` if this has already been called in this
     * transaction, from the same sender, with the same parameters.
     *
     * Fails if there are insufficient funds to pay for deposit.
     */
    create_pure: {
      proxy_type: Anonymize<I7adrgaqb51jb9>
      delay: number
      index: number
    }
    /**
     * Removes a previously spawned pure proxy.
     *
     * WARNING: **All access to this account will be lost.** Any funds held in
     * it will be inaccessible.
     *
     * Requires a `Signed` origin, and the sender account must have been created
     * by a call to `create_pure` with corresponding parameters.
     *
     * - `spawner`: The account that originally called `create_pure` to create
     * this account.
     * - `index`: The disambiguation index originally passed to `create_pure`.
     * Probably `0`.
     * - `proxy_type`: The proxy type originally passed to `create_pure`.
     * - `height`: The height of the chain when the call to `create_pure` was
     * processed.
     * - `ext_index`: The extrinsic index in which the call to `create_pure` was
     * processed.
     *
     * Fails with `NoPermission` in case the caller is not a previously created
     * pure account whose `create_pure` call has corresponding parameters.
     */
    kill_pure: {
      spawner: MultiAddress
      proxy_type: Anonymize<I7adrgaqb51jb9>
      index: number
      height: number
      ext_index: number
    }
    /**
     * Publish the hash of a proxy-call that will be made in the future.
     *
     * This must be called some number of blocks before the corresponding
     * `proxy` is attempted if the delay associated with the proxy relationship
     * is greater than zero.
     *
     * No more than `MaxPending` announcements may be made at any one time.
     *
     * This will take a deposit of `AnnouncementDepositFactor` as well as
     * `AnnouncementDepositBase` if there are no other pending announcements.
     *
     * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    announce: {
      real: MultiAddress
      call_hash: FixedSizeBinary<32>
    }
    /**
     * Remove a given announcement.
     *
     * May be called by a proxy account to remove a call they previously
     * announced and return the deposit.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    remove_announcement: {
      real: MultiAddress
      call_hash: FixedSizeBinary<32>
    }
    /**
     * Remove the given announcement of a delegate.
     *
     * May be called by a target (proxied) account to remove a call that one of
     * their delegates (`delegate`) has announced they want to execute. The
     * deposit is returned.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `delegate`: The account that previously announced the call.
     * - `call_hash`: The hash of the call to be made.
     */
    reject_announcement: {
      delegate: MultiAddress
      call_hash: FixedSizeBinary<32>
    }
    /**
     * Dispatch the given `call` from an account that the sender is authorized
     * for through `add_proxy`.
     *
     * Removes any corresponding announcement(s).
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked
     * for this call.
     * - `call`: The call to be made by the `real` account.
     */
    proxy_announced: {
      delegate: MultiAddress
      real: MultiAddress
      force_proxy_type?: Anonymize<I93g3hgcn0dpaj>
      call: TxCallData
    }
    /**
     * Poke / Adjust deposits made for proxies and announcements based on
     * current values.
     * This can be used by accounts to possibly lower their locked amount.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * The transaction fee is waived if the deposit amount has changed.
     *
     * Emits `DepositPoked` if successful.
     */
    poke_deposit: undefined
  }>
  Multisig: Enum<{
    /**
     * Immediately dispatch a multi-signature call using a single approval from
     * the caller.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `other_signatories`: The accounts (other than the sender) who are part
     * of the multi-signature, but do not participate in the approval process.
     * - `call`: The call to be executed.
     *
     * Result is equivalent to the dispatched result.
     *
     * ## Complexity O(Z + C) where Z is the length of the call and C its
     * execution weight.
     */
    as_multi_threshold_1: {
      other_signatories: Anonymize<Ia2lhg7l2hilo3>
      call: TxCallData
    }
    /**
     * Register approval for a dispatch to be made from a deterministic
     * composite account if approved by a total of `threshold - 1` of
     * `other_signatories`.
     *
     * If there are enough, then dispatch the call.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval,
     * plus `threshold` times `DepositFactor`. It is returned once this dispatch
     * happens or is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it
     * is executed.
     * - `other_signatories`: The accounts (other than the sender) who can
     * approve this dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be
     * `None`. If it is not the first approval, then it must be `Some`, with the
     * timepoint (block number and transaction index) of the first approval
     * transaction.
     * - `call`: The call to be executed.
     *
     * NOTE: Unless this is the final approval, you will generally want to use
     * `approve_as_multi` instead, since it only requires a hash of the call.
     *
     * Result is equivalent to the dispatched result if `threshold` is exactly
     * `1`. Otherwise on success, result is `Ok` and the result from the
     * interior call, if it was executed,
     * may be found in the deposited `MultisigExecuted` event.
     *
     * ## Complexity - `O(S + Z + Call)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the
     * number of signatories. `S` is capped by `MaxSignatories`, with weight
     * being proportional.
     * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - The weight of the `call`.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with
     * a deposit taken for its lifetime of `DepositBase + threshold *
     * DepositFactor`.
     */
    as_multi: {
      threshold: number
      other_signatories: Anonymize<Ia2lhg7l2hilo3>
      maybe_timepoint?: Anonymize<I95jfd8j5cr5eh>
      call: TxCallData
      max_weight: Anonymize<I4q39t5hn830vp>
    }
    /**
     * Register approval for a dispatch to be made from a deterministic
     * composite account if approved by a total of `threshold - 1` of
     * `other_signatories`.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval,
     * plus `threshold` times `DepositFactor`. It is returned once this dispatch
     * happens or is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it
     * is executed.
     * - `other_signatories`: The accounts (other than the sender) who can
     * approve this dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be
     * `None`. If it is not the first approval, then it must be `Some`, with the
     * timepoint (block number and transaction index) of the first approval
     * transaction.
     * - `call_hash`: The hash of the call to be executed.
     *
     * NOTE: If this is the final approval, you will want to use `as_multi`
     * instead.
     *
     * ## Complexity - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the
     * number of signatories. `S` is capped by `MaxSignatories`, with weight
     * being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with
     * a deposit taken for its lifetime of `DepositBase + threshold *
     * DepositFactor`.
     */
    approve_as_multi: {
      threshold: number
      other_signatories: Anonymize<Ia2lhg7l2hilo3>
      maybe_timepoint?: Anonymize<I95jfd8j5cr5eh>
      call_hash: FixedSizeBinary<32>
      max_weight: Anonymize<I4q39t5hn830vp>
    }
    /**
     * Cancel a pre-existing, on-going multisig transaction. Any deposit
     * reserved previously for this operation will be unreserved on success.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it
     * is executed.
     * - `other_signatories`: The accounts (other than the sender) who can
     * approve this dispatch. May not be empty.
     * - `timepoint`: The timepoint (block number and transaction index) of the
     * first approval transaction for this dispatch.
     * - `call_hash`: The hash of the call to be executed.
     *
     * ## Complexity - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the
     * number of signatories. `S` is capped by `MaxSignatories`, with weight
     * being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - One event.
     * - I/O: 1 read `O(S)`, one remove.
     * - Storage: removes one item.
     */
    cancel_as_multi: {
      threshold: number
      other_signatories: Anonymize<Ia2lhg7l2hilo3>
      timepoint: Anonymize<Itvprrpb0nm3o>
      call_hash: FixedSizeBinary<32>
    }
    /**
     * Poke the deposit reserved for an existing multisig operation.
     *
     * The dispatch origin for this call must be _Signed_ and must be the
     * original depositor of the multisig operation.
     *
     * The transaction fee is waived if the deposit amount has changed.
     *
     * - `threshold`: The total number of approvals needed for this multisig.
     * - `other_signatories`: The accounts (other than the sender) who are part
     * of the multisig.
     * - `call_hash`: The hash of the call this deposit is reserved for.
     *
     * Emits `DepositPoked` if successful.
     */
    poke_deposit: {
      threshold: number
      other_signatories: Anonymize<Ia2lhg7l2hilo3>
      call_hash: FixedSizeBinary<32>
    }
  }>
  Bounties: Enum<{
    /**
     * Propose a new bounty.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Payment: `TipReportDepositBase` will be reserved from the origin account,
     * as well as `DataDepositPerByte` for each byte in `reason`. It will be
     * unreserved upon approval,
     * or slashed when rejected.
     *
     * - `curator`: The curator account whom will manage this bounty.
     * - `fee`: The curator fee.
     * - `value`: The total payment amount of this bounty, curator fee included.
     * - `description`: The description of this bounty.
     */
    propose_bounty: {
      value: bigint
      description: Binary
    }
    /**
     * Approve a bounty proposal. At a later time, the bounty will be funded and
     * become active and the original deposit will be returned.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity - O(1).
     */
    approve_bounty: {
      bounty_id: number
    }
    /**
     * Propose a curator to a funded bounty.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity - O(1).
     */
    propose_curator: {
      bounty_id: number
      curator: MultiAddress
      fee: bigint
    }
    /**
     * Unassign curator from a bounty.
     *
     * This function can only be called by the `RejectOrigin` a signed origin.
     *
     * If this function is called by the `RejectOrigin`, we assume that the
     * curator is malicious or inactive. As a result, we will slash the curator
     * when possible.
     *
     * If the origin is the curator, we take this as a sign they are unable to
     * do their job and they willingly give up. We could slash them, but for now
     * we allow them to recover their deposit and exit without issue. (We may
     * want to change this if it is abused.)
     *
     * Finally, the origin can be anyone if and only if the curator is
     * "inactive". This allows anyone in the community to call out that a
     * curator is not doing their due diligence, and we should pick a new
     * curator. In this case the curator should also be slashed.
     *
     * ## Complexity - O(1).
     */
    unassign_curator: {
      bounty_id: number
    }
    /**
     * Accept the curator role for a bounty.
     * A deposit will be reserved from curator and refund upon successful
     * payout.
     *
     * May only be called from the curator.
     *
     * ## Complexity - O(1).
     */
    accept_curator: {
      bounty_id: number
    }
    /**
     * Award bounty to a beneficiary account. The beneficiary will be able to
     * claim the funds after a delay.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to award.
     * - `beneficiary`: The beneficiary account whom will receive the payout.
     *
     * ## Complexity - O(1).
     */
    award_bounty: {
      bounty_id: number
      beneficiary: MultiAddress
    }
    /**
     * Claim the payout from an awarded bounty after payout delay.
     *
     * The dispatch origin for this call must be the beneficiary of this bounty.
     *
     * - `bounty_id`: Bounty ID to claim.
     *
     * ## Complexity - O(1).
     */
    claim_bounty: {
      bounty_id: number
    }
    /**
     * Cancel a proposed or active bounty. All the funds will be sent to
     * treasury and the curator deposit will be unreserved if possible.
     *
     * Only `T::RejectOrigin` is able to cancel a bounty.
     *
     * - `bounty_id`: Bounty ID to cancel.
     *
     * ## Complexity - O(1).
     */
    close_bounty: {
      bounty_id: number
    }
    /**
     * Extend the expiry time of an active bounty.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to extend.
     * - `remark`: additional information.
     *
     * ## Complexity - O(1).
     */
    extend_bounty_expiry: {
      bounty_id: number
      remark: Binary
    }
    /**
     * Approve bountry and propose a curator simultaneously.
     * This call is a shortcut to calling `approve_bounty` and `propose_curator`
     * separately.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * - `bounty_id`: Bounty ID to approve.
     * - `curator`: The curator account whom will manage this bounty.
     * - `fee`: The curator fee.
     *
     * ## Complexity - O(1).
     */
    approve_bounty_with_curator: {
      bounty_id: number
      curator: MultiAddress
      fee: bigint
    }
    /**
     * Poke the deposit reserved for creating a bounty proposal.
     *
     * This can be used by accounts to update their reserved amount.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `bounty_id`: The bounty id for which to adjust the deposit.
     *
     * If the deposit is updated, the difference will be reserved/unreserved
     * from the proposer's account.
     *
     * The transaction is made free if the deposit is updated and paid
     * otherwise.
     *
     * Emits `DepositPoked` if the deposit is updated.
     */
    poke_deposit: {
      bounty_id: number
    }
  }>
  ChildBounties: Enum<{
    /**
     * Add a new child-bounty.
     *
     * The dispatch origin for this call must be the curator of parent bounty
     * and the parent bounty must be in "active" state.
     *
     * Child-bounty gets added successfully & fund gets transferred from parent
     * bounty to child-bounty account, if parent bounty has enough funds, else
     * the call fails.
     *
     * Upper bound to maximum number of active child bounties that can be added
     * are managed via runtime trait config
     * [`Config::MaxActiveChildBountyCount`].
     *
     * If the call is success, the status of child-bounty is updated to "Added".
     *
     * - `parent_bounty_id`: Index of parent bounty for which child-bounty is
     * being added.
     * - `value`: Value for executing the proposal.
     * - `description`: Text description for the child-bounty.
     */
    add_child_bounty: {
      parent_bounty_id: number
      value: bigint
      description: Binary
    }
    /**
     * Propose curator for funded child-bounty.
     *
     * The dispatch origin for this call must be curator of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "Added" state, for processing the call. And state
     * of child-bounty is moved to "CuratorProposed" on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `curator`: Address of child-bounty curator.
     * - `fee`: payment fee to child-bounty curator for execution.
     */
    propose_curator: {
      parent_bounty_id: number
      child_bounty_id: number
      curator: MultiAddress
      fee: bigint
    }
    /**
     * Accept the curator role for the child-bounty.
     *
     * The dispatch origin for this call must be the curator of this
     * child-bounty.
     *
     * A deposit will be reserved from the curator and refund upon successful
     * payout or cancellation.
     *
     * Fee for curator is deducted from curator fee of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "CuratorProposed" state, for processing the call.
     * And state of child-bounty is moved to "Active" on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    accept_curator: {
      parent_bounty_id: number
      child_bounty_id: number
    }
    /**
     * Unassign curator from a child-bounty.
     *
     * The dispatch origin for this call can be either `RejectOrigin`, or the
     * curator of the parent bounty, or any signed origin.
     *
     * For the origin other than T::RejectOrigin and the child-bounty curator,
     * parent bounty must be in active state, for this call to work. We allow
     * child-bounty curator and T::RejectOrigin to execute this call
     * irrespective of the parent bounty state.
     *
     * If this function is called by the `RejectOrigin` or the parent bounty
     * curator, we assume that the child-bounty curator is malicious or
     * inactive. As a result, child-bounty curator deposit is slashed.
     *
     * If the origin is the child-bounty curator, we take this as a sign that
     * they are unable to do their job, and are willingly giving up.
     * We could slash the deposit, but for now we allow them to unreserve their
     * deposit and exit without issue. (We may want to change this if it is
     * abused.)
     *
     * Finally, the origin can be anyone iff the child-bounty curator is
     * "inactive". Expiry update due of parent bounty is used to estimate
     * inactive state of child-bounty curator.
     *
     * This allows anyone in the community to call out that a child-bounty
     * curator is not doing their due diligence, and we should pick a new one.
     * In this case the child-bounty curator deposit is slashed.
     *
     * State of child-bounty is moved to Added state on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    unassign_curator: {
      parent_bounty_id: number
      child_bounty_id: number
    }
    /**
     * Award child-bounty to a beneficiary.
     *
     * The beneficiary will be able to claim the funds after a delay.
     *
     * The dispatch origin for this call must be the parent curator or curator
     * of this child-bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in active state, for processing the call. And state
     * of child-bounty is moved to "PendingPayout" on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `beneficiary`: Beneficiary account.
     */
    award_child_bounty: {
      parent_bounty_id: number
      child_bounty_id: number
      beneficiary: MultiAddress
    }
    /**
     * Claim the payout from an awarded child-bounty after payout delay.
     *
     * The dispatch origin for this call may be any signed origin.
     *
     * Call works independent of parent bounty state, No need for parent bounty
     * to be in active state.
     *
     * The Beneficiary is paid out with agreed bounty value. Curator fee is paid
     * & curator deposit is unreserved.
     *
     * Child-bounty must be in "PendingPayout" state, for processing the call.
     * And instance of child-bounty is removed from the state on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    claim_child_bounty: {
      parent_bounty_id: number
      child_bounty_id: number
    }
    /**
     * Cancel a proposed or active child-bounty. Child-bounty account funds are
     * transferred to parent bounty account. The child-bounty curator deposit
     * may be unreserved if possible.
     *
     * The dispatch origin for this call must be either parent curator or
     * `T::RejectOrigin`.
     *
     * If the state of child-bounty is `Active`, curator deposit is unreserved.
     *
     * If the state of child-bounty is `PendingPayout`, call fails &
     * returns `PendingPayout` error.
     *
     * For the origin other than T::RejectOrigin, parent bounty must be in
     * active state, for this child-bounty call to work. For origin
     * T::RejectOrigin execution is forced.
     *
     * Instance of child-bounty is removed from the state on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    close_child_bounty: {
      parent_bounty_id: number
      child_bounty_id: number
    }
  }>
  ElectionProviderMultiPhase: Enum<{
    /**
     * Submit a solution for the unsigned phase.
     *
     * The dispatch origin fo this call must be __none__.
     *
     * This submission is checked on the fly. Moreover, this unsigned solution
     * is only validated when submitted to the pool from the **local** node.
     * Effectively, this means that only active validators can submit this
     * transaction when authoring a block (similar to an inherent).
     *
     * To prevent any incorrect solution (and thus wasted time/weight), this
     * transaction will panic if the solution submitted by the validator is
     * invalid in any way, effectively putting their authoring reward at risk.
     *
     * No deposit or reward is associated with this submission.
     */
    submit_unsigned: {
      raw_solution: Anonymize<I7je4n92ump862>
      witness: {
        voters: number
        targets: number
      }
    }
    /**
     * Set a new value for `MinimumUntrustedScore`.
     *
     * Dispatch origin must be aligned with `T::ForceOrigin`.
     *
     * This check can be turned off by setting the value to `None`.
     */
    set_minimum_untrusted_score: {
      maybe_next_score?: Anonymize<I8s6n43okuj2b1> | undefined
    }
    /**
     * Set a solution in the queue, to be handed out to the client of this
     * pallet in the next call to `ElectionProvider::elect`.
     *
     * This can only be set by `T::ForceOrigin`, and only when the phase is
     * `Emergency`.
     *
     * The solution is not checked for any feasibility and is assumed to be
     * trustworthy, as any feasibility check itself can in principle cause the
     * election process to fail (due to memory/weight constrains).
     */
    set_emergency_election_result: {
      supports: Array<
        [
          SS58String,
          {
            total: bigint
            voters: Array<[SS58String, bigint]>
          },
        ]
      >
    }
    /**
     * Submit a solution for the signed phase.
     *
     * The dispatch origin fo this call must be __signed__.
     *
     * The solution is potentially queued, based on the claimed score and
     * processed at the end of the signed phase.
     *
     * A deposit is reserved and recorded for the solution. Based on the
     * outcome, the solution might be rewarded, slashed, or get all or a part of
     * the deposit back.
     */
    submit: {
      raw_solution: Anonymize<I7je4n92ump862>
    }
    /**
     * Trigger the governance fallback.
     *
     * This can only be called when [`Phase::Emergency`] is enabled, as an
     * alternative to calling [`Call::set_emergency_election_result`].
     */
    governance_fallback: undefined
  }>
  VoterList: Enum<{
    /**
     * Declare that some `dislocated` account has, through rewards or penalties,
     * sufficiently changed its score that it should properly fall into a
     * different bag than its current one.
     *
     * Anyone can call this function about any potentially dislocated account.
     *
     * Will always update the stored score of `dislocated` to the correct score,
     * based on `ScoreProvider`.
     *
     * If `dislocated` does not exists, it returns an error.
     */
    rebag: {
      dislocated: MultiAddress
    }
    /**
     * Move the caller's Id directly in front of `lighter`.
     *
     * The dispatch origin for this call must be _Signed_ and can only be called
     * by the Id of the account going in front of `lighter`. Fee is payed by the
     * origin under all circumstances.
     *
     * Only works if:
     *
     * - both nodes are within the same bag,
     * - and `origin` has a greater `Score` than `lighter`.
     */
    put_in_front_of: {
      lighter: MultiAddress
    }
    /**
     * Same as [`Pallet::put_in_front_of`], but it can be called by anyone.
     *
     * Fee is paid by the origin under all circumstances.
     */
    put_in_front_of_other: {
      heavier: MultiAddress
      lighter: MultiAddress
    }
  }>
  NominationPools: Enum<{
    /**
     * Stake funds with a pool. The amount to bond is delegated (or transferred
     * based on [`adapter::StakeStrategyType`]) from the member to the pool
     * account and immediately increases the pool's bond.
     *
     * The method of transferring the amount to the pool account is determined
     * by [`adapter::StakeStrategyType`]. If the pool is configured to use
     * [`adapter::StakeStrategyType::Delegate`], the funds remain in the account
     * of the `origin`, while the pool gains the right to use these funds for
     * staking.
     *
     * # Note
     *
     * * An account can only be a member of a single pool.
     * * An account cannot join the same pool multiple times.
     * * This call will *not* dust the member account, so the member must have
     * at least `existential deposit + amount` in their account.
     * * Only a pool with [`PoolState::Open`] can be joined.
     */
    join: {
      amount: bigint
      pool_id: number
    }
    /**
     * Bond `extra` more funds from `origin` into the pool to which they already
     * belong.
     *
     * Additional funds can come from either the free balance of the account, of
     * from the accumulated rewards, see [`BondExtra`].
     *
     * Bonding extra funds implies an automatic payout of all pending rewards as
     * well.
     * See `bond_extra_other` to bond pending rewards of `other` members.
     */
    bond_extra: {
      extra: NominationPoolsBondExtra
    }
    /**
     * A bonded member can use this to claim their payout based on the rewards
     * that the pool has accumulated since their last claimed payout (OR since
     * joining if this is their first time claiming rewards). The payout will be
     * transferred to the member's account.
     *
     * The member will earn rewards pro rata based on the members stake vs the
     * sum of the members in the pools stake. Rewards do not "expire".
     *
     * See `claim_payout_other` to claim rewards on behalf of some `other` pool
     * member.
     */
    claim_payout: undefined
    /**
     * Unbond up to `unbonding_points` of the `member_account`'s funds from the
     * pool. It implicitly collects the rewards one last time, since not doing
     * so would mean some rewards would be forfeited.
     *
     * Under certain conditions, this call can be dispatched permissionlessly
     * (i.e. by any account).
     *
     * # Conditions for a permissionless dispatch.
     *
     * * The pool is blocked and the caller is either the root or bouncer. This
     * is refereed to as a kick.
     * * The pool is destroying and the member is not the depositor.
     * * The pool is destroying, the member is the depositor and no other
     * members are in the pool.
     *
     * ## Conditions for permissioned dispatch (i.e. the caller is also the
     * `member_account`):
     *
     * * The caller is not the depositor.
     * * The caller is the depositor, the pool is destroying and no other
     * members are in the pool.
     *
     * # Note
     *
     * If there are too many unlocking chunks to unbond with the pool account,
     * [`Call::pool_withdraw_unbonded`] can be called to try and minimize
     * unlocking chunks.
     * The [`StakingInterface::unbond`] will implicitly call
     * [`Call::pool_withdraw_unbonded`]
     * to try to free chunks if necessary (ie. if unbound was called and no
     * unlocking chunks are available). However, it may not be possible to
     * release the current unlocking chunks,
     * in which case, the result of this call will likely be the `NoMoreChunks`
     * error from the staking system.
     */
    unbond: {
      member_account: MultiAddress
      unbonding_points: bigint
    }
    /**
     * Call `withdraw_unbonded` for the pools account. This call can be made by
     * any account.
     *
     * This is useful if there are too many unlocking chunks to call `unbond`,
     * and some can be cleared by withdrawing. In the case there are too many
     * unlocking chunks, the user would probably see an error like
     * `NoMoreChunks` emitted from the staking system when they attempt to
     * unbond.
     */
    pool_withdraw_unbonded: {
      pool_id: number
      num_slashing_spans: number
    }
    /**
     * Withdraw unbonded funds from `member_account`. If no bonded funds can be
     * unbonded, an error is returned.
     *
     * Under certain conditions, this call can be dispatched permissionlessly
     * (i.e. by any account).
     *
     * # Conditions for a permissionless dispatch
     *
     * * The pool is in destroy mode and the target is not the depositor.
     * * The target is the depositor and they are the only member in the sub
     * pools.
     * * The pool is blocked and the caller is either the root or bouncer.
     *
     * # Conditions for permissioned dispatch
     *
     * * The caller is the target and they are not the depositor.
     *
     * # Note
     *
     * - If the target is the depositor, the pool will be destroyed.
     * - If the pool has any pending slash, we also try to slash the member
     * before letting them withdraw. This calculation adds some weight overhead
     * and is only defensive. In reality,
     * pool slashes must have been already applied via permissionless
     * [`Call::apply_slash`].
     */
    withdraw_unbonded: {
      member_account: MultiAddress
      num_slashing_spans: number
    }
    /**
     * Create a new delegation pool.
     *
     * # Arguments
     *
     * * `amount` - The amount of funds to delegate to the pool. This also acts
     * of a sort of deposit since the pools creator cannot fully unbond funds
     * until the pool is being destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only
     * useful when creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `bouncer` - The account to set as the [`PoolRoles::bouncer`].
     *
     * # Note
     *
     * In addition to `amount`, the caller will transfer the existential
     * deposit; so the caller needs at have at least `amount +
     * existential_deposit` transferable.
     */
    create: {
      amount: bigint
      root: MultiAddress
      nominator: MultiAddress
      bouncer: MultiAddress
    }
    /**
     * Create a new delegation pool with a previously used pool id
     *
     * # Arguments
     *
     * same as `create` with the inclusion of * `pool_id` - `A valid PoolId.
     */
    create_with_pool_id: {
      amount: bigint
      root: MultiAddress
      nominator: MultiAddress
      bouncer: MultiAddress
      pool_id: number
    }
    /**
     * Nominate on behalf of the pool.
     *
     * The dispatch origin of this call must be signed by the pool nominator or
     * the pool root role.
     *
     * This directly forwards the call to an implementation of
     * `StakingInterface` (e.g.,
     * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the
     * bonded pool.
     *
     * # Note
     *
     * In addition to a `root` or `nominator` role of `origin`, the pool's
     * depositor needs to have at least `depositor_min_bond` in the pool to
     * start nominating.
     */
    nominate: {
      pool_id: number
      validators: Anonymize<Ia2lhg7l2hilo3>
    }
    /**
     * Set a new state for the pool.
     *
     * If a pool is already in the `Destroying` state, then under no condition
     * can its state change again.
     *
     * The dispatch origin of this call must be either:
     *
     * 1. signed by the bouncer, or the root role of the pool,
     * 2. if the pool conditions to be open are NOT met (as described by
     * `ok_to_be_open`), and then the state of the pool can be permissionlessly
     * changed to `Destroying`.
     */
    set_state: {
      pool_id: number
      state: NominationPoolsPoolState
    }
    /**
     * Set a new metadata for the pool.
     *
     * The dispatch origin of this call must be signed by the bouncer, or the
     * root role of the pool.
     */
    set_metadata: {
      pool_id: number
      metadata: Binary
    }
    /**
     * Update configurations for the nomination pools. The origin for this call
     * must be [`Config::AdminOrigin`].
     *
     * # Arguments
     *
     * * `min_join_bond` - Set [`MinJoinBond`].
     * * `min_create_bond` - Set [`MinCreateBond`].
     * * `max_pools` - Set [`MaxPools`].
     * * `max_members` - Set [`MaxPoolMembers`].
     * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
     * * `global_max_commission` - Set [`GlobalMaxCommission`].
     */
    set_configs: {
      min_join_bond: StakingPalletConfigOpBig
      min_create_bond: StakingPalletConfigOpBig
      max_pools: StakingPalletConfigOp
      max_members: StakingPalletConfigOp
      max_members_per_pool: StakingPalletConfigOp
      global_max_commission: StakingPalletConfigOp
    }
    /**
     * Update the roles of the pool.
     *
     * The root is the only entity that can change any of the roles, including
     * itself,
     * excluding the depositor, who can never change.
     *
     * It emits an event, notifying UIs of the role change. This event is quite
     * relevant to most pool members and they should be informed of changes to
     * pool roles.
     */
    update_roles: {
      pool_id: number
      new_root: NominationPoolsConfigOp
      new_nominator: NominationPoolsConfigOp
      new_bouncer: NominationPoolsConfigOp
    }
    /**
     * Chill on behalf of the pool.
     *
     * The dispatch origin of this call can be signed by the pool nominator or
     * the pool root role, same as [`Pallet::nominate`].
     *
     * This directly forwards the call to an implementation of
     * `StakingInterface` (e.g.,
     * `pallet-staking`) through [`Config::StakeAdapter`], on behalf of the
     * bonded pool.
     *
     * Under certain conditions, this call can be dispatched permissionlessly
     * (i.e. by any account).
     *
     * # Conditions for a permissionless dispatch:
     * * When pool depositor has less than `MinNominatorBond` staked, otherwise
     * pool members are unable to unbond.
     *
     * # Conditions for permissioned dispatch:
     * * The caller is the pool's nominator or root.
     */
    chill: {
      pool_id: number
    }
    /**
     * `origin` bonds funds from `extra` for some pool member `member` into
     * their respective pools.
     *
     * `origin` can bond extra funds from free balance or pending rewards when
     * `origin ==
     * other`.
     *
     * In the case of `origin != other`, `origin` can only bond extra pending
     * rewards of `other` members assuming set_claim_permission for the given
     * member is `PermissionlessCompound` or `PermissionlessAll`.
     */
    bond_extra_other: {
      member: MultiAddress
      extra: NominationPoolsBondExtra
    }
    /**
     * Allows a pool member to set a claim permission to allow or disallow
     * permissionless bonding and withdrawing.
     *
     * # Arguments
     *
     * * `origin` - Member of a pool.
     * * `permission` - The permission to be applied.
     */
    set_claim_permission: {
      permission: NominationPoolsClaimPermission
    }
    /**
     * `origin` can claim payouts on some pool member `other`'s behalf.
     *
     * Pool member `other` must have a `PermissionlessWithdraw` or
     * `PermissionlessAll` claim permission for this call to be successful.
     */
    claim_payout_other: {
      other: SS58String
    }
    /**
     * Set the commission of a pool.
     * Both a commission percentage and a commission payee must be provided in
     * the `current`
     * tuple. Where a `current` of `None` is provided, any current commission
     * will be removed.
     *
     * - If a `None` is supplied to `new_commission`, existing commission will
     * be removed.
     */
    set_commission: {
      pool_id: number
      new_commission?: [number, SS58String] | undefined
    }
    /**
     * Set the maximum commission of a pool.
     *
     * - Initial max can be set to any `Perbill`, and only smaller values
     * thereafter.
     * - Current commission will be lowered in the event it is higher than a new
     * max commission.
     */
    set_commission_max: {
      pool_id: number
      max_commission: number
    }
    /**
     * Set the commission change rate for a pool.
     *
     * Initial change rate is not bounded, whereas subsequent updates can only
     * be more restrictive than the current.
     */
    set_commission_change_rate: {
      pool_id: number
      change_rate: {
        max_increase: number
        min_delay: number
      }
    }
    /**
     * Claim pending commission.
     *
     * The `root` role of the pool is _always_ allowed to claim the pool's
     * commission.
     *
     * If the pool has set `CommissionClaimPermission::Permissionless`, then any
     * account can trigger the process of claiming the pool's commission.
     *
     * If the pool has set its `CommissionClaimPermission` to `Account(acc)`,
     * then only accounts * `acc`, and * the pool's root account
     *
     * may call this extrinsic on behalf of the pool.
     *
     * Pending commissions are paid out and added to the total claimed
     * commission.
     * The total pending commission is reset to zero.
     */
    claim_commission: {
      pool_id: number
    }
    /**
     * Top up the deficit or withdraw the excess ED from the pool.
     *
     * When a pool is created, the pool depositor transfers ED to the reward
     * account of the pool. ED is subject to change and over time, the deposit
     * in the reward account may be insufficient to cover the ED deficit of the
     * pool or vice-versa where there is excess deposit to the pool. This call
     * allows anyone to adjust the ED deposit of the pool by either topping up
     * the deficit or claiming the excess.
     */
    adjust_pool_deposit: {
      pool_id: number
    }
    /**
     * Set or remove a pool's commission claim permission.
     *
     * Determines who can claim the pool's pending commission. Only the `Root`
     * role of the pool is able to configure commission claim permissions.
     */
    set_commission_claim_permission: {
      pool_id: number
      permission?: NominationPoolsCommissionClaimPermission | undefined
    }
    /**
     * Apply a pending slash on a member.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * The pending slash amount of the member must be equal or more than
     * `ExistentialDeposit`.
     * This call can be dispatched permissionlessly (i.e. by any account). If
     * the execution is successful, fee is refunded and caller may be rewarded
     * with a part of the slash based on the
     * [`crate::pallet::Config::StakeAdapter`] configuration.
     */
    apply_slash: {
      member_account: MultiAddress
    }
    /**
     * Migrates delegated funds from the pool account to the `member_account`.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This is a permission-less call and refunds any fee if claim is
     * successful.
     *
     * If the pool has migrated to delegation based staking, the staked tokens
     * of pool members can be moved and held in their own account. See
     * [`adapter::DelegateStake`]
     */
    migrate_delegation: {
      member_account: MultiAddress
    }
    /**
     * Migrate pool from [`adapter::StakeStrategyType::Transfer`] to
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This call can be dispatched permissionlessly, and refunds any fee if
     * successful.
     *
     * If the pool has already migrated to delegation based staking, this call
     * will fail.
     */
    migrate_pool_to_delegate_stake: {
      pool_id: number
    }
  }>
  FastUnstake: Enum<{
    /**
     * Register oneself for fast-unstake.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be *signed* by whoever is permitted
     * to call unbond funds by the staking system. See [`Config::Staking`].
     *
     * ## Details
     *
     * The stash associated with the origin must have no ongoing unlocking
     * chunks. If successful, this will fully unbond and chill the stash. Then,
     * it will enqueue the stash to be checked in further blocks.
     *
     * If by the time this is called, the stash is actually eligible for
     * fast-unstake, then they are guaranteed to remain eligible, because the
     * call will chill them as well.
     *
     * If the check works, the entire staking data is removed, i.e. the stash is
     * fully unstaked.
     *
     * If the check fails, the stash remains chilled and waiting for being
     * unbonded as in with the normal staking system, but they lose part of
     * their unbonding chunks due to consuming the chain's resources.
     *
     * ## Events
     *
     * Some events from the staking and currency system might be emitted.
     */
    register_fast_unstake: undefined
    /**
     * Deregister oneself from the fast-unstake.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be *signed* by whoever is permitted
     * to call unbond funds by the staking system. See [`Config::Staking`].
     *
     * ## Details
     *
     * This is useful if one is registered, they are still waiting, and they
     * change their mind.
     *
     * Note that the associated stash is still fully unbonded and chilled as a
     * consequence of calling [`Pallet::register_fast_unstake`]. Therefore, this
     * should probably be followed by a call to `rebond` in the staking system.
     *
     * ## Events
     *
     * Some events from the staking and currency system might be emitted.
     */
    deregister: undefined
    /**
     * Control the operation of this pallet.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be [`Config::ControlOrigin`].
     *
     * ## Details
     *
     * Can set the number of eras to check per block, and potentially other
     * admin work.
     *
     * ## Events
     *
     * No events are emitted from this dispatch.
     */
    control: {
      eras_to_check: number
    }
  }>
  Configuration: Enum<{
    /**
     * Set the validation upgrade cooldown.
     */
    set_validation_upgrade_cooldown: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the validation upgrade delay.
     */
    set_validation_upgrade_delay: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the acceptance period for an included candidate.
     */
    set_code_retention_period: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the max validation code size for incoming upgrades.
     */
    set_max_code_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the max POV block size for incoming upgrades.
     */
    set_max_pov_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the max head data size for paras.
     */
    set_max_head_data_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the number of coretime execution cores.
     *
     * NOTE: that this configuration is managed by the coretime chain. Only
     * manually change this, if you really know what you are doing!
     */
    set_coretime_cores: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the parachain validator-group rotation frequency.
     */
    set_group_rotation_frequency: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the availability period for paras.
     */
    set_paras_availability_period: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the scheduling lookahead, in expected number of blocks at peak
     * throughput.
     */
    set_scheduling_lookahead: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the maximum number of validators to assign to any core.
     */
    set_max_validators_per_core: {
      new?: Anonymize<I4arjljr6dpflb>
    }
    /**
     * Set the maximum number of validators to use in parachain consensus.
     */
    set_max_validators: {
      new?: Anonymize<I4arjljr6dpflb>
    }
    /**
     * Set the dispute period, in number of sessions to keep for disputes.
     */
    set_dispute_period: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the dispute post conclusion acceptance period.
     */
    set_dispute_post_conclusion_acceptance_period: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the no show slots, in number of number of consensus slots.
     * Must be at least 1.
     */
    set_no_show_slots: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the total number of delay tranches.
     */
    set_n_delay_tranches: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the zeroth delay tranche width.
     */
    set_zeroth_delay_tranche_width: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the number of validators needed to approve a block.
     */
    set_needed_approvals: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the number of samples to do of the `RelayVRFModulo` approval
     * assignment criterion.
     */
    set_relay_vrf_modulo_samples: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum items that can present in a upward dispatch queue at
     * once.
     */
    set_max_upward_queue_count: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum total size of items that can present in a upward
     * dispatch queue at once.
     */
    set_max_upward_queue_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the critical downward message size.
     */
    set_max_downward_message_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum size of an upward message that can be sent by a
     * candidate.
     */
    set_max_upward_message_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum number of messages that a candidate can contain.
     */
    set_max_upward_message_num_per_candidate: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the number of sessions after which an HRMP open channel request
     * expires.
     */
    set_hrmp_open_request_ttl: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the amount of funds that the sender should provide for opening an
     * HRMP channel.
     */
    set_hrmp_sender_deposit: {
      new: bigint
    }
    /**
     * Sets the amount of funds that the recipient should provide for accepting
     * opening an HRMP channel.
     */
    set_hrmp_recipient_deposit: {
      new: bigint
    }
    /**
     * Sets the maximum number of messages allowed in an HRMP channel at once.
     */
    set_hrmp_channel_max_capacity: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum total size of messages in bytes allowed in an HRMP
     * channel at once.
     */
    set_hrmp_channel_max_total_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum number of inbound HRMP channels a parachain is allowed
     * to accept.
     */
    set_hrmp_max_parachain_inbound_channels: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum size of a message that could ever be put into an HRMP
     * channel.
     */
    set_hrmp_channel_max_message_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum number of outbound HRMP channels a parachain is allowed
     * to open.
     */
    set_hrmp_max_parachain_outbound_channels: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the maximum number of outbound HRMP messages can be sent by a
     * candidate.
     */
    set_hrmp_max_message_num_per_candidate: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the number of session changes after which a PVF pre-checking voting
     * is rejected.
     */
    set_pvf_voting_ttl: Anonymize<I3vh014cqgmrfd>
    /**
     * Sets the minimum delay between announcing the upgrade block for a
     * parachain until the upgrade taking place.
     *
     * See the field documentation for information and constraints for the new
     * value.
     */
    set_minimum_validation_upgrade_delay: Anonymize<I3vh014cqgmrfd>
    /**
     * Setting this to true will disable consistency checks for the
     * configuration setters.
     * Use with caution.
     */
    set_bypass_consistency_check: {
      new: boolean
    }
    /**
     * Set the asynchronous backing parameters.
     */
    set_async_backing_params: {
      new: {
        max_candidate_depth: number
        allowed_ancestry_len: number
      }
    }
    /**
     * Set PVF executor parameters.
     */
    set_executor_params: {
      new: Array<PolkadotPrimitivesV6ExecutorParamsExecutorParam>
    }
    /**
     * Set the on demand (parathreads) base fee.
     */
    set_on_demand_base_fee: {
      new: bigint
    }
    /**
     * Set the on demand (parathreads) fee variability.
     */
    set_on_demand_fee_variability: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the on demand (parathreads) queue max size.
     */
    set_on_demand_queue_max_size: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the on demand (parathreads) fee variability.
     */
    set_on_demand_target_queue_utilization: Anonymize<I3vh014cqgmrfd>
    /**
     * Set the minimum backing votes threshold.
     */
    set_minimum_backing_votes: Anonymize<I3vh014cqgmrfd>
    /**
     * Set/Unset a node feature.
     */
    set_node_feature: {
      index: number
      value: boolean
    }
    /**
     * Set approval-voting-params.
     */
    set_approval_voting_params: Anonymize<I3vh014cqgmrfd>
    /**
     * Set scheduler-params.
     */
    set_scheduler_params: {
      new: {
        group_rotation_frequency: number
        paras_availability_period: number
        max_validators_per_core?: Anonymize<I4arjljr6dpflb>
        lookahead: number
        num_cores: number
        max_availability_timeouts: number
        on_demand_queue_max_size: number
        on_demand_target_queue_utilization: number
        on_demand_fee_variability: number
        on_demand_base_fee: bigint
        ttl: number
      }
    }
  }>
  ParasShared: undefined
  ParaInclusion: undefined
  ParaInherent: Enum<{
    /**
     * Enter the paras inherent. This will process bitfields and backed
     * candidates.
     */
    enter: {
      data: {
        bitfields: Array<{
          payload: Array<0 | 1>
          validator_index: number
          signature: FixedSizeBinary<64>
        }>
        backed_candidates: Array<{
          candidate: {
            descriptor: {
              para_id: number
              relay_parent: FixedSizeBinary<32>
              version: number
              core_index: number
              session_index: number
              reserved1: FixedSizeBinary<25>
              persisted_validation_data_hash: FixedSizeBinary<32>
              pov_hash: FixedSizeBinary<32>
              erasure_root: FixedSizeBinary<32>
              reserved2: FixedSizeBinary<64>
              para_head: FixedSizeBinary<32>
              validation_code_hash: FixedSizeBinary<32>
            }
            commitments: {
              upward_messages: Anonymize<Itom7fk49o0c9>
              horizontal_messages: Array<{
                recipient: number
                data: Binary
              }>
              new_validation_code?: Anonymize<Iabpgqcjikia83>
              head_data: Binary
              processed_downward_messages: number
              hrmp_watermark: number
            }
          }
          validity_votes: Array<ValidityAttestation>
          validator_indices: Array<0 | 1>
        }>
        disputes: Array<{
          candidate_hash: FixedSizeBinary<32>
          session: number
          statements: Array<
            [PolkadotPrimitivesV6DisputeStatement, number, FixedSizeBinary<64>]
          >
        }>
        parent_header: Anonymize<Ic952bubvq4k7d>
      }
    }
  }>
  Paras: Enum<{
    /**
     * Set the storage for the parachain validation code immediately.
     */
    force_set_current_code: Anonymize<I1k3urvkqqshbc>
    /**
     * Set the storage for the current parachain head data immediately.
     */
    force_set_current_head: Anonymize<I2ff0ffsh15vej>
    /**
     * Schedule an upgrade as if it was scheduled in the given relay parent
     * block.
     */
    force_schedule_code_upgrade: {
      para: number
      new_code: Binary
      relay_parent_number: number
    }
    /**
     * Note a new block head for para within the context of the current block.
     */
    force_note_new_head: Anonymize<I2ff0ffsh15vej>
    /**
     * Put a parachain directly into the next session's action queue.
     * We can't queue it any sooner than this without going into the
     * initializer...
     */
    force_queue_action: Anonymize<Iaus4cb3drhu9q>
    /**
     * Adds the validation code to the storage.
     *
     * The code will not be added if it is already present. Additionally, if PVF
     * pre-checking is running for that code, it will be instantly accepted.
     *
     * Otherwise, the code will be added into the storage. Note that the code
     * will be added into storage with reference count 0. This is to account the
     * fact that there are no users for this code yet. The caller will have to
     * make sure that this code eventually gets used by some parachain or
     * removed from the storage to avoid storage leaks. For the latter prefer to
     * use the `poke_unused_validation_code` dispatchable to raw storage
     * manipulation.
     *
     * This function is mainly meant to be used for upgrading parachains that do
     * not follow the go-ahead signal while the PVF pre-checking feature is
     * enabled.
     */
    add_trusted_validation_code: {
      validation_code: Binary
    }
    /**
     * Remove the validation code from the storage iff the reference count is 0.
     *
     * This is better than removing the storage directly, because it will not
     * remove the code that was suddenly got used by some parachain while this
     * dispatchable was pending dispatching.
     */
    poke_unused_validation_code: {
      validation_code_hash: FixedSizeBinary<32>
    }
    /**
     * Includes a statement for a PVF pre-checking vote. Potentially, finalizes
     * the vote and enacts the results if that was the last vote before
     * achieving the supermajority.
     */
    include_pvf_check_statement: {
      stmt: {
        accept: boolean
        subject: FixedSizeBinary<32>
        session_index: number
        validator_index: number
      }
      signature: FixedSizeBinary<64>
    }
    /**
     * Set the storage for the current parachain head data immediately.
     */
    force_set_most_recent_context: {
      para: number
      context: number
    }
    /**
     * Remove an upgrade cooldown for a parachain.
     *
     * The cost for removing the cooldown earlier depends on the time left for
     * the cooldown multiplied by [`Config::CooldownRemovalMultiplier`]. The
     * paid tokens are burned.
     */
    remove_upgrade_cooldown: Anonymize<Iaus4cb3drhu9q>
    /**
     * Sets the storage for the authorized current code hash of the parachain.
     * If not applied, it will be removed at the `System::block_number() +
     * valid_period` block.
     *
     * This can be useful, when triggering `Paras::force_set_current_code(para,
     * code)`
     * from a different chain than the one where the `Paras` pallet is deployed.
     *
     * The main purpose is to avoid transferring the entire `code` Wasm blob
     * between chains.
     * Instead, we authorize `code_hash` with `root`, which can later be applied
     * by `Paras::apply_authorized_force_set_current_code(para, code)` by
     * anyone.
     *
     * Authorizations are stored in an **overwriting manner**.
     */
    authorize_force_set_current_code_hash: {
      para: number
      new_code_hash: FixedSizeBinary<32>
      valid_period: number
    }
    /**
     * Applies the already authorized current code for the parachain,
     * triggering the same functionality as `force_set_current_code`.
     */
    apply_authorized_force_set_current_code: Anonymize<I1k3urvkqqshbc>
  }>
  Initializer: Enum<{
    /**
     * Issue a signal to the consensus engine to forcibly act as though all
     * parachain blocks in all relay chain blocks up to and including the given
     * number in the current chain are valid and should be finalized.
     */
    force_approve: {
      up_to: number
    }
  }>
  Hrmp: Enum<{
    /**
     * Initiate opening a channel from a parachain to a given recipient with
     * given channel parameters.
     *
     * - `proposed_max_capacity` - specifies how many messages can be in the
     * channel at once.
     * - `proposed_max_message_size` - specifies the maximum size of the
     * messages.
     *
     * These numbers are a subject to the relay-chain configuration limits.
     *
     * The channel can be opened only after the recipient confirms it and only
     * on a session change.
     */
    hrmp_init_open_channel: {
      recipient: number
      proposed_max_capacity: number
      proposed_max_message_size: number
    }
    /**
     * Accept a pending open channel request from the given sender.
     *
     * The channel will be opened only on the next session boundary.
     */
    hrmp_accept_open_channel: {
      sender: number
    }
    /**
     * Initiate unilateral closing of a channel. The origin must be either the
     * sender or the recipient in the channel being closed.
     *
     * The closure can only happen on a session change.
     */
    hrmp_close_channel: {
      channel_id: Anonymize<I50mrcbubp554e>
    }
    /**
     * This extrinsic triggers the cleanup of all the HRMP storage items that a
     * para may have.
     * Normally this happens once per session, but this allows you to trigger
     * the cleanup immediately for a specific parachain.
     *
     * Number of inbound and outbound channels for `para` must be provided as
     * witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_clean_hrmp: {
      para: number
      num_inbound: number
      num_outbound: number
    }
    /**
     * Force process HRMP open channel requests.
     *
     * If there are pending HRMP open channel requests, you can use this
     * function to process all of those requests immediately.
     *
     * Total number of opening channels must be provided as witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_process_hrmp_open: {
      channels: number
    }
    /**
     * Force process HRMP close channel requests.
     *
     * If there are pending HRMP close channel requests, you can use this
     * function to process all of those requests immediately.
     *
     * Total number of closing channels must be provided as witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_process_hrmp_close: {
      channels: number
    }
    /**
     * This cancels a pending open channel request. It can be canceled by either
     * of the sender or the recipient for that request. The origin must be
     * either of those.
     *
     * The cancellation happens immediately. It is not possible to cancel the
     * request if it is already accepted.
     *
     * Total number of open requests (i.e. `HrmpOpenChannelRequestsList`) must
     * be provided as witness data.
     */
    hrmp_cancel_open_request: {
      channel_id: Anonymize<I50mrcbubp554e>
      open_requests: number
    }
    /**
     * Open a channel from a `sender` to a `recipient` `ParaId`. Although opened
     * by governance,
     * the `max_capacity` and `max_message_size` are still subject to the Relay
     * Chain's configured limits.
     *
     * Expected use is when one (and only one) of the `ParaId`s involved in the
     * channel is governed by the system, e.g. a system parachain.
     *
     * Origin must be the `ChannelManager`.
     */
    force_open_hrmp_channel: {
      sender: number
      recipient: number
      max_capacity: number
      max_message_size: number
    }
    /**
     * Establish an HRMP channel between two system chains. If the channel does
     * not already exist, the transaction fees will be refunded to the caller.
     * The system does not take deposits for channels between system chains, and
     * automatically sets the message number and size limits to the maximum
     * allowed by the network's configuration.
     *
     * Arguments:
     *
     * - `sender`: A system chain, `ParaId`.
     * - `recipient`: A system chain, `ParaId`.
     *
     * Any signed origin can call this function, but _both_ inputs MUST be
     * system chains. If the channel does not exist yet, there is no fee.
     */
    establish_system_channel: Anonymize<I50mrcbubp554e>
    /**
     * Update the deposits held for an HRMP channel to the latest
     * `Configuration`. Channels with system chains do not require a deposit.
     *
     * Arguments:
     *
     * - `sender`: A chain, `ParaId`.
     * - `recipient`: A chain, `ParaId`.
     *
     * Any signed origin can call this function.
     */
    poke_channel_deposits: Anonymize<I50mrcbubp554e>
    /**
     * Establish a bidirectional HRMP channel between a parachain and a system
     * chain.
     *
     * Arguments:
     *
     * - `target_system_chain`: A system chain, `ParaId`.
     *
     * The origin needs to be the parachain origin.
     */
    establish_channel_with_system: {
      target_system_chain: number
    }
  }>
  ParasDisputes: Enum<{
    force_unfreeze: undefined
  }>
  ParasSlashing: Enum<{
    report_dispute_lost_unsigned: {
      dispute_proof: {
        time_slot: {
          session_index: number
          candidate_hash: FixedSizeBinary<32>
        }
        kind: Enum<{
          ForInvalidBacked: undefined
          AgainstValid: undefined
          ForInvalidApproved: undefined
        }>
        validator_index: number
        validator_id: FixedSizeBinary<32>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
  }>
  OnDemand: Enum<{
    /**
     * Create a single on demand core order.
     * Will use the spot price for the current block and will reap the account
     * if needed.
     *
     * Parameters:
     * - `origin`: The sender of the call, funds will be withdrawn from this
     * account.
     * - `max_amount`: The maximum balance to withdraw from the origin to place
     * an order.
     * - `para_id`: A `ParaId` the origin wants to provide blockspace for.
     *
     * Errors:
     * - `InsufficientBalance`: from the Currency implementation - `QueueFull`
     * - `SpotPriceHigherThanMaxAmount`
     *
     * Events:
     * - `OnDemandOrderPlaced`
     */
    place_order_allow_death: {
      max_amount: bigint
      para_id: number
    }
    /**
     * Same as the [`place_order_allow_death`](Self::place_order_allow_death)
     * call , but with a check that placing the order will not reap the account.
     *
     * Parameters:
     * - `origin`: The sender of the call, funds will be withdrawn from this
     * account.
     * - `max_amount`: The maximum balance to withdraw from the origin to place
     * an order.
     * - `para_id`: A `ParaId` the origin wants to provide blockspace for.
     *
     * Errors:
     * - `InsufficientBalance`: from the Currency implementation - `QueueFull`
     * - `SpotPriceHigherThanMaxAmount`
     *
     * Events:
     * - `OnDemandOrderPlaced`
     */
    place_order_keep_alive: {
      max_amount: bigint
      para_id: number
    }
    /**
     * Create a single on demand core order with credits.
     * Will charge the owner's on-demand credit account the spot price for the
     * current block.
     *
     * Parameters:
     * - `origin`: The sender of the call, on-demand credits will be withdrawn
     * from this account.
     * - `max_amount`: The maximum number of credits to spend from the origin to
     * place an order.
     * - `para_id`: A `ParaId` the origin wants to provide blockspace for.
     *
     * Errors:
     * - `InsufficientCredits`
     * - `QueueFull`
     * - `SpotPriceHigherThanMaxAmount`
     *
     * Events:
     * - `OnDemandOrderPlaced`
     */
    place_order_with_credits: {
      max_amount: bigint
      para_id: number
    }
  }>
  Registrar: Enum<{
    /**
     * Register head data and validation code for a reserved Para Id.
     *
     * ## Arguments - `origin`: Must be called by a `Signed` origin.
     * - `id`: The para ID. Must be owned/managed by the `origin` signing
     * account.
     * - `genesis_head`: The genesis head data of the parachain/thread.
     * - `validation_code`: The initial validation code of the parachain/thread.
     *
     * ## Deposits/Fees The account with the originating signature must reserve
     * a deposit.
     *
     * The deposit is required to cover the costs associated with storing the
     * genesis head data and the validation code.
     * This accounts for the potential to store validation code of a size up to
     * the `max_code_size`, as defined in the configuration pallet
     *
     * Anything already reserved previously for this para ID is accounted for.
     *
     * ## Events The `Registered` event is emitted in case of success.
     */
    register: {
      id: number
      genesis_head: Binary
      validation_code: Binary
    }
    /**
     * Force the registration of a Para Id on the relay chain.
     *
     * This function must be called by a Root origin.
     *
     * The deposit taken can be specified for this registration. Any `ParaId`
     * can be registered, including sub-1000 IDs which are System Parachains.
     */
    force_register: {
      who: SS58String
      deposit: bigint
      id: number
      genesis_head: Binary
      validation_code: Binary
    }
    /**
     * Deregister a Para Id, freeing all data and returning any deposit.
     *
     * The caller must be Root, the `para` owner, or the `para` itself. The para
     * must be an on-demand parachain.
     */
    deregister: {
      id: number
    }
    /**
     * Swap a lease holding parachain with another parachain, either on-demand
     * or lease holding.
     *
     * The origin must be Root, the `para` owner, or the `para` itself.
     *
     * The swap will happen only if there is already an opposite swap pending.
     * If there is not,
     * the swap will be stored in the pending swaps map, ready for a later
     * confirmatory swap.
     *
     * The `ParaId`s remain mapped to the same head data and code so external
     * code can rely on `ParaId` to be a long-term identifier of a notional
     * "parachain". However, their scheduling info (i.e. whether they're an
     * on-demand parachain or lease holding parachain), auction information and
     * the auction deposit are switched.
     */
    swap: {
      id: number
      other: number
    }
    /**
     * Remove a manager lock from a para. This will allow the manager of a
     * previously locked para to deregister or swap a para without using
     * governance.
     *
     * Can only be called by the Root origin or the parachain.
     */
    remove_lock: Anonymize<Iaus4cb3drhu9q>
    /**
     * Reserve a Para Id on the relay chain.
     *
     * This function will reserve a new Para Id to be owned/managed by the
     * origin account.
     * The origin account is able to register head data and validation code
     * using `register` to create an on-demand parachain. Using the Slots
     * pallet, an on-demand parachain can then be upgraded to a lease holding
     * parachain.
     *
     * ## Arguments - `origin`: Must be called by a `Signed` origin. Becomes the
     * manager/owner of the new para ID.
     *
     * ## Deposits/Fees The origin must reserve a deposit of `ParaDeposit` for
     * the registration.
     *
     * ## Events The `Reserved` event is emitted in case of success, which
     * provides the ID reserved for use.
     */
    reserve: undefined
    /**
     * Add a manager lock from a para. This will prevent the manager of a para
     * to deregister or swap a para.
     *
     * Can be called by Root, the parachain, or the parachain manager if the
     * parachain is unlocked.
     */
    add_lock: Anonymize<Iaus4cb3drhu9q>
    /**
     * Schedule a parachain upgrade.
     *
     * This will kick off a check of `new_code` by all validators. After the
     * majority of the validators have reported on the validity of the code, the
     * code will either be enacted or the upgrade will be rejected. If the code
     * will be enacted, the current code of the parachain will be overwritten
     * directly. This means that any PoV will be checked by this new code. The
     * parachain itself will not be informed explicitly that the validation code
     * has changed.
     *
     * Can be called by Root, the parachain, or the parachain manager if the
     * parachain is unlocked.
     */
    schedule_code_upgrade: Anonymize<I1k3urvkqqshbc>
    /**
     * Set the parachain's current head.
     *
     * Can be called by Root, the parachain, or the parachain manager if the
     * parachain is unlocked.
     */
    set_current_head: Anonymize<I2ff0ffsh15vej>
  }>
  Slots: Enum<{
    /**
     * Just a connect into the `lease_out` call, in case Root wants to force
     * some lease to happen independently of any other on-chain mechanism to use
     * it.
     *
     * The dispatch origin for this call must match `T::ForceOrigin`.
     */
    force_lease: {
      para: number
      leaser: SS58String
      amount: bigint
      period_begin: number
      period_count: number
    }
    /**
     * Clear all leases for a Para Id, refunding any deposits back to the
     * original owners.
     *
     * The dispatch origin for this call must match `T::ForceOrigin`.
     */
    clear_all_leases: Anonymize<Iaus4cb3drhu9q>
    /**
     * Try to onboard a parachain that has a lease for the current lease period.
     *
     * This function can be useful if there was some state issue with a para
     * that should have onboarded, but was unable to. As long as they have a
     * lease period, we can let them onboard from here.
     *
     * Origin must be signed, but can be called by anyone.
     */
    trigger_onboard: Anonymize<Iaus4cb3drhu9q>
  }>
  Auctions: Enum<{
    /**
     * Create a new auction.
     *
     * This can only happen when there isn't already an auction in progress and
     * may only be called by the root origin. Accepts the `duration` of this
     * auction and the `lease_period_index` of the initial lease period of the
     * four that are to be auctioned.
     */
    new_auction: {
      duration: number
      lease_period_index: number
    }
    /**
     * Make a new bid from an account (including a parachain account) for
     * deploying a new parachain.
     *
     * Multiple simultaneous bids from the same bidder are allowed only as long
     * as all active bids overlap each other (i.e. are mutually exclusive). Bids
     * cannot be redacted.
     *
     * - `sub` is the sub-bidder ID, allowing for multiple competing bids to be
     * made by (and funded by) the same account.
     * - `auction_index` is the index of the auction to bid on. Should just be
     * the present value of `AuctionCounter`.
     * - `first_slot` is the first lease period index of the range to bid on.
     * This is the absolute lease period index value, not an auction-specific
     * offset.
     * - `last_slot` is the last lease period index of the range to bid on. This
     * is the absolute lease period index value, not an auction-specific offset.
     * - `amount` is the amount to bid to be held as deposit for the parachain
     * should the bid win. This amount is held throughout the range.
     */
    bid: {
      para: number
      auction_index: number
      first_slot: number
      last_slot: number
      amount: bigint
    }
    /**
     * Cancel an in-progress auction.
     *
     * Can only be called by Root origin.
     */
    cancel_auction: undefined
  }>
  Crowdloan: Enum<{
    /**
     * Create a new crowdloaning campaign for a parachain slot with the given
     * lease period range.
     *
     * This applies a lock to your parachain configuration, ensuring that it
     * cannot be changed by the parachain manager.
     */
    create: {
      index: number
      cap: bigint
      first_period: number
      last_period: number
      end: number
      verifier?: MultiSigner | undefined
    }
    /**
     * Contribute to a crowd sale. This will transfer some balance over to fund
     * a parachain slot. It will be withdrawable when the crowdloan has ended
     * and the funds are unused.
     */
    contribute: {
      index: number
      value: bigint
      signature?: Anonymize<I86cdjmsf3a81s>
    }
    /**
     * Withdraw full balance of a specific contributor.
     *
     * Origin must be signed, but can come from anyone.
     *
     * The fund must be either in, or ready for, retirement. For a fund to be
     * *in* retirement,
     * then the retirement flag must be set. For a fund to be ready for
     * retirement, then:
     * - it must not already be in retirement;
     * - the amount of raised funds must be bigger than the _free_ balance of
     * the account;
     * - and either:
     * - the block number must be at least `end`; or - the current lease period
     * must be greater than the fund's `last_period`.
     *
     * In this case, the fund's retirement flag is set and its `end` is reset to
     * the current block number.
     *
     * - `who`: The account whose contribution should be withdrawn.
     * - `index`: The parachain to whose crowdloan the contribution was made.
     */
    withdraw: {
      who: SS58String
      index: number
    }
    /**
     * Automatically refund contributors of an ended crowdloan.
     * Due to weight restrictions, this function may need to be called multiple
     * times to fully refund all users. We will refund `RemoveKeysLimit` users
     * at a time.
     *
     * Origin must be signed, but can come from anyone.
     */
    refund: Anonymize<I666bl2fqjkejo>
    /**
     * Remove a fund after the retirement period has ended and all funds have
     * been returned.
     */
    dissolve: Anonymize<I666bl2fqjkejo>
    /**
     * Edit the configuration for an in-progress crowdloan.
     *
     * Can only be called by Root origin.
     */
    edit: {
      index: number
      cap: bigint
      first_period: number
      last_period: number
      end: number
      verifier?: MultiSigner | undefined
    }
    /**
     * Add an optional memo to an existing crowdloan contribution.
     *
     * Origin must be Signed, and the user must have contributed to the
     * crowdloan.
     */
    add_memo: {
      index: number
      memo: Binary
    }
    /**
     * Poke the fund into `NewRaise`
     *
     * Origin must be Signed, and the fund has non-zero raise.
     */
    poke: Anonymize<I666bl2fqjkejo>
    /**
     * Contribute your entire balance to a crowd sale. This will transfer the
     * entire balance of a user over to fund a parachain slot. It will be
     * withdrawable when the crowdloan has ended and the funds are unused.
     */
    contribute_all: {
      index: number
      signature?: Anonymize<I86cdjmsf3a81s>
    }
  }>
  Coretime: Enum<{
    /**
     * Request the configuration to be updated with the specified number of
     * cores. Warning:
     * Since this only schedules a configuration update, it takes two sessions
     * to come into effect.
     *
     * - `origin`: Root or the Coretime Chain - `count`: total number of cores.
     */
    request_core_count: Anonymize<Iafscmv8tjf0ou>
    /**
     * Request to claim the instantaneous coretime sales revenue starting from
     * the block it was last claimed until and up to the block specified. The
     * claimed amount value is sent back to the Coretime chain in a
     * `notify_revenue` message. At the same time, the amount is teleported to
     * the Coretime chain.
     */
    request_revenue_at: {
      when: number
    }
    credit_account: {
      who: SS58String
      amount: bigint
    }
    /**
     * Receive instructions from the `ExternalBrokerOrigin`, detailing how a
     * specific core is to be used.
     *
     * Parameters:
     * -`origin`: The `ExternalBrokerOrigin`, assumed to be the coretime chain.
     * -`core`: The core that should be scheduled.
     * -`begin`: The starting blockheight of the instruction.
     * -`assignment`: How the blockspace should be utilised.
     * -`end_hint`: An optional hint as to when this particular set of
     * instructions will end.
     */
    assign_core: {
      core: number
      begin: number
      assignment: Array<[BrokerCoretimeInterfaceCoreAssignment, number]>
      end_hint?: Anonymize<I4arjljr6dpflb>
    }
  }>
  StateTrieMigration: Enum<{
    /**
     * Control the automatic migration.
     *
     * The dispatch origin of this call must be [`Config::ControlOrigin`].
     */
    control_auto_migration: {
      maybe_config?: Anonymize<I215mkl885p4da> | undefined
    }
    /**
     * Continue the migration for the given `limits`.
     *
     * The dispatch origin of this call can be any signed account.
     *
     * This transaction has NO MONETARY INCENTIVES. calling it will not reward
     * anyone. Albeit,
     * Upon successful execution, the transaction fee is returned.
     *
     * The (potentially over-estimated) of the byte length of all the data read
     * must be provided for up-front fee-payment and weighing. In essence, the
     * caller is guaranteeing that executing the current `MigrationTask` with
     * the given `limits` will not exceed `real_size_upper` bytes of read data.
     *
     * The `witness_task` is merely a helper to prevent the caller from being
     * slashed or generally trigger a migration that they do not intend. This
     * parameter is just a message from caller, saying that they believed
     * `witness_task` was the last state of the migration, and they only wish
     * for their transaction to do anything, if this assumption holds. In case
     * `witness_task` does not match, the transaction fails.
     *
     * Based on the documentation of
     * [`MigrationTask::migrate_until_exhaustion`], the recommended way of doing
     * this is to pass a `limit` that only bounds `count`, as the `size` limit
     * can always be overwritten.
     */
    continue_migrate: {
      limits: Anonymize<I215mkl885p4da>
      real_size_upper: number
      witness_task: {
        progress_top: Anonymize<I1ufmh6d8psvik>
        progress_child: Anonymize<I1ufmh6d8psvik>
        size: number
        top_items: number
        child_items: number
      }
    }
    /**
     * Migrate the list of top keys by iterating each of them one by one.
     *
     * This does not affect the global migration process tracker
     * ([`MigrationProcess`]), and should only be used in case any keys are
     * leftover due to a bug.
     */
    migrate_custom_top: {
      keys: Anonymize<Itom7fk49o0c9>
      witness_size: number
    }
    /**
     * Migrate the list of child keys by iterating each of them one by one.
     *
     * All of the given child keys must be present under one `child_root`.
     *
     * This does not affect the global migration process tracker
     * ([`MigrationProcess`]), and should only be used in case any keys are
     * leftover due to a bug.
     */
    migrate_custom_child: {
      root: Binary
      child_keys: Anonymize<Itom7fk49o0c9>
      total_size: number
    }
    /**
     * Set the maximum limit of the signed migration.
     */
    set_signed_max_limits: {
      limits: Anonymize<I215mkl885p4da>
    }
    /**
     * Forcefully set the progress the running migration.
     *
     * This is only useful in one case: the next key to migrate is too big to be
     * migrated with a signed account, in a parachain context, and we simply
     * want to skip it. A reasonable example of this would be `:code:`, which is
     * both very expensive to migrate, and commonly used, so probably it is
     * already migrated.
     *
     * In case you mess things up, you can also, in principle, use this to reset
     * the migration process.
     */
    force_set_progress: {
      progress_top: Anonymize<I1ufmh6d8psvik>
      progress_child: Anonymize<I1ufmh6d8psvik>
    }
  }>
  XcmPallet: Enum<{
    send: {
      dest: XcmVersionedLocation
      message: XcmVersionedXcm
    }
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * **This function is deprecated: Use `limited_teleport_assets` instead.**
     *
     * Fee payment on the destination side is made from the asset in the
     * `assets` vector of index `fee_asset_item`. The weight limit for fees is
     * not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]`
     * to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of
     * `dest`. Will generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be
     * used to pay fees.
     */
    teleport_assets: {
      dest: XcmVersionedLocation
      beneficiary: XcmVersionedLocation
      assets: XcmVersionedAssets
      fee_asset_item: number
    }
    /**
     * Transfer some assets from the local chain to the destination chain
     * through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to
     * `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of
     * destination chain and forward a notification XCM to `dest` to mint and
     * deposit reserve-based assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a
     * notification to `dest` chain to withdraw the reserve assets from this
     * chain's sovereign account and deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve
     * chain to move reserves from this chain's SA to `dest` chain's SA, and
     * forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * **This function is deprecated: Use `limited_reserve_transfer_assets`
     * instead.**
     *
     * Fee payment on the destination side is made from the asset in the
     * `assets` vector of index `fee_asset_item`. The weight limit for fees is
     * not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]`
     * to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of
     * `dest`. Will generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be
     * used to pay fees.
     */
    reserve_transfer_assets: {
      dest: XcmVersionedLocation
      beneficiary: XcmVersionedLocation
      assets: XcmVersionedAssets
      fee_asset_item: number
    }
    /**
     * Execute an XCM message from a local, signed, origin.
     *
     * An event is deposited indicating whether `msg` could be executed
     * completely or only partially.
     *
     * No more than `max_weight` will be used in its attempted execution. If
     * this is less than the maximum amount of weight that the message could
     * take to be executed, then no execution attempt will be made.
     */
    execute: {
      message: XcmVersionedXcm
      max_weight: Anonymize<I4q39t5hn830vp>
    }
    /**
     * Extoll that a particular destination can be communicated with through a
     * particular version of XCM.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The destination that is being described.
     * - `xcm_version`: The latest version of XCM that `location` supports.
     */
    force_xcm_version: {
      location: Anonymize<If9iqq7i64mur8>
      version: number
    }
    /**
     * Set a safe XCM version (the version that XCM should be encoded with if
     * the most recent version a destination can accept is unknown).
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `maybe_xcm_version`: The default XCM encoding version, or `None` to
     * disable.
     */
    force_default_xcm_version: {
      maybe_xcm_version?: Anonymize<I4arjljr6dpflb>
    }
    /**
     * Ask a location to notify us regarding their XCM version and any changes
     * to it.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we should subscribe for XCM version
     * notifications.
     */
    force_subscribe_version_notify: {
      location: XcmVersionedLocation
    }
    /**
     * Require that a particular destination should no longer notify us
     * regarding any XCM version changes.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we are currently subscribed for XCM
     * version notifications which we no longer desire.
     */
    force_unsubscribe_version_notify: {
      location: XcmVersionedLocation
    }
    /**
     * Transfer some assets from the local chain to the destination chain
     * through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to
     * `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of
     * destination chain and forward a notification XCM to `dest` to mint and
     * deposit reserve-based assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a
     * notification to `dest` chain to withdraw the reserve assets from this
     * chain's sovereign account and deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve
     * chain to move reserves from this chain's SA to `dest` chain's SA, and
     * forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * Fee payment on the destination side is made from the asset in the
     * `assets` vector of index `fee_asset_item`, up to enough to pay for
     * `weight_limit` of weight. If more weight is needed than `weight_limit`,
     * then the operation will fail and the sent assets may be at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]`
     * to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of
     * `dest`. Will generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be
     * used to pay fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee
     * purchase.
     */
    limited_reserve_transfer_assets: {
      dest: XcmVersionedLocation
      beneficiary: XcmVersionedLocation
      assets: XcmVersionedAssets
      fee_asset_item: number
      weight_limit: XcmV3WeightLimit
    }
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * Fee payment on the destination side is made from the asset in the
     * `assets` vector of index `fee_asset_item`, up to enough to pay for
     * `weight_limit` of weight. If more weight is needed than `weight_limit`,
     * then the operation will fail and the sent assets may be at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]`
     * to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of
     * `dest`. Will generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be
     * used to pay fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee
     * purchase.
     */
    limited_teleport_assets: {
      dest: XcmVersionedLocation
      beneficiary: XcmVersionedLocation
      assets: XcmVersionedAssets
      fee_asset_item: number
      weight_limit: XcmV3WeightLimit
    }
    /**
     * Set or unset the global suspension state of the XCM executor.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `suspended`: `true` to suspend, `false` to resume.
     */
    force_suspension: {
      suspended: boolean
    }
    /**
     * Transfer some assets from the local chain to the destination chain
     * through their local,
     * destination or remote reserve, or through teleports.
     *
     * Fee payment on the destination side is made from the asset in the
     * `assets` vector of index `fee_asset_item` (hence referred to as `fees`),
     * up to enough to pay for `weight_limit` of weight. If more weight is
     * needed than `weight_limit`, then the operation will fail and the sent
     * assets may be at risk.
     *
     * `assets` (excluding `fees`) must have same reserve location or otherwise
     * be teleportable to `dest`, no limitations imposed on `fees`.
     * - for local reserve: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit
     * reserve-based assets to `beneficiary`.
     * - for destination reserve: burn local assets and forward a notification
     * to `dest` chain to withdraw the reserve assets from this chain's
     * sovereign account and deposit them to `beneficiary`.
     * - for remote reserve: burn local assets, forward XCM to reserve chain to
     * move reserves from this chain's SA to `dest` chain's SA, and forward
     * another XCM to `dest` to mint and deposit reserve-based assets to
     * `beneficiary`.
     * - for teleports: burn local assets and forward XCM to `dest` chain to
     * mint/teleport assets and deposit them to `beneficiary`.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be
     * `X2(Parent,
     * Parachain(..))` to send from parachain to parachain, or
     * `X1(Parachain(..))` to send from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of
     * `dest`. Will generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be
     * used to pay fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee
     * purchase.
     */
    transfer_assets: {
      dest: XcmVersionedLocation
      beneficiary: XcmVersionedLocation
      assets: XcmVersionedAssets
      fee_asset_item: number
      weight_limit: XcmV3WeightLimit
    }
    /**
     * Claims assets trapped on this pallet because of leftover assets during
     * XCM execution.
     *
     * - `origin`: Anyone can call this extrinsic.
     * - `assets`: The exact assets that were trapped. Use the version to
     * specify what version was the latest when they were trapped.
     * - `beneficiary`: The location/account where the claimed assets will be
     * deposited.
     */
    claim_assets: {
      assets: XcmVersionedAssets
      beneficiary: XcmVersionedLocation
    }
    /**
     * Transfer assets from the local chain to the destination chain using
     * explicit transfer types for assets and fees.
     *
     * `assets` must have same reserve location or may be teleportable to
     * `dest`. Caller must provide the `assets_transfer_type` to be used for
     * `assets`:
     * - `TransferType::LocalReserve`: transfer assets to sovereign account of
     * destination chain and forward a notification XCM to `dest` to mint and
     * deposit reserve-based assets to `beneficiary`.
     * - `TransferType::DestinationReserve`: burn local assets and forward a
     * notification to `dest` chain to withdraw the reserve assets from this
     * chain's sovereign account and deposit them to `beneficiary`.
     * - `TransferType::RemoteReserve(reserve)`: burn local assets, forward XCM
     * to `reserve`
     * chain to move reserves from this chain's SA to `dest` chain's SA, and
     * forward another XCM to `dest` to mint and deposit reserve-based assets to
     * `beneficiary`. Typically the remote `reserve` is Asset Hub.
     * - `TransferType::Teleport`: burn local assets and forward XCM to `dest`
     * chain to mint/teleport assets and deposit them to `beneficiary`.
     *
     * On the destination chain, as well as any intermediary hops,
     * `BuyExecution` is used to buy execution using transferred `assets`
     * identified by `remote_fees_id`.
     * Make sure enough of the specified `remote_fees_id` asset is included in
     * the given list of `assets`. `remote_fees_id` should be enough to pay for
     * `weight_limit`. If more weight is needed than `weight_limit`, then the
     * operation will fail and the sent assets may be at risk.
     *
     * `remote_fees_id` may use different transfer type than rest of `assets`
     * and can be specified through `fees_transfer_type`.
     *
     * The caller needs to specify what should happen to the transferred assets
     * once they reach the `dest` chain. This is done through the
     * `custom_xcm_on_dest` parameter, which contains the instructions to
     * execute on `dest` as a final step.
     * This is usually as simple as:
     * `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())),
     * beneficiary }])`,
     * but could be something more exotic like sending the `assets` even
     * further.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing
     * XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]`
     * to send from relay to parachain, or `(parents: 2, (GlobalConsensus(..),
     * ..))` to send from parachain across a bridge to another ecosystem
     * destination.
     * - `assets`: The assets to be withdrawn. This should include the assets
     * used to pay the fee on the `dest` (and possibly reserve) chains.
     * - `assets_transfer_type`: The XCM `TransferType` used to transfer the
     * `assets`.
     * - `remote_fees_id`: One of the included `assets` to be used to pay fees.
     * - `fees_transfer_type`: The XCM `TransferType` used to transfer the
     * `fees` assets.
     * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the
     * last step of the transfer, which also determines what happens to the
     * assets on the destination chain.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee
     * purchase.
     */
    transfer_assets_using_type_and_then: {
      dest: XcmVersionedLocation
      assets: XcmVersionedAssets
      assets_transfer_type: Enum<{
        Teleport: undefined
        LocalReserve: undefined
        DestinationReserve: undefined
        RemoteReserve: XcmVersionedLocation
      }>
      remote_fees_id: XcmVersionedAssetId
      fees_transfer_type: Enum<{
        Teleport: undefined
        LocalReserve: undefined
        DestinationReserve: undefined
        RemoteReserve: XcmVersionedLocation
      }>
      custom_xcm_on_dest: XcmVersionedXcm
      weight_limit: XcmV3WeightLimit
    }
    /**
     * Authorize another `aliaser` location to alias into the local `origin`
     * making this call.
     * The `aliaser` is only authorized until the provided `expiry` block
     * number.
     * The call can also be used for a previously authorized alias in order to
     * update its `expiry` block number.
     *
     * Usually useful to allow your local account to be aliased into from a
     * remote location also under your control (like your account on another
     * chain).
     *
     * WARNING: make sure the caller `origin` (you) trusts the `aliaser`
     * location to act in their/your name. Once authorized using this call, the
     * `aliaser` can freely impersonate `origin` in XCM programs executed on the
     * local chain.
     */
    add_authorized_alias: {
      aliaser: XcmVersionedLocation
      expires?: Anonymize<I35p85j063s0il>
    }
    /**
     * Remove a previously authorized `aliaser` from the list of locations that
     * can alias into the local `origin` making this call.
     */
    remove_authorized_alias: {
      aliaser: XcmVersionedLocation
    }
    /**
     * Remove all previously authorized `aliaser`s that can alias into the local
     * `origin`
     * making this call.
     */
    remove_all_authorized_aliases: undefined
  }>
  MessageQueue: Enum<{
    /**
     * Remove a page which has no more messages remaining to be processed or is
     * stale.
     */
    reap_page: {
      message_origin: ParachainsInclusionAggregateMessageOrigin
      page_index: number
    }
    /**
     * Execute an overweight message.
     *
     * Temporary processing errors will be propagated whereas permanent errors
     * are treated as success condition.
     *
     * - `origin`: Must be `Signed`.
     * - `message_origin`: The origin from which the message to be executed
     * arrived.
     * - `page`: The page in the queue in which the message to be executed is
     * sitting.
     * - `index`: The index into the queue of the message to be executed.
     * - `weight_limit`: The maximum amount of weight allowed to be consumed in
     * the execution of the message.
     *
     * Benchmark complexity considerations: O(index + weight_limit).
     */
    execute_overweight: {
      message_origin: ParachainsInclusionAggregateMessageOrigin
      page: number
      index: number
      weight_limit: Anonymize<I4q39t5hn830vp>
    }
  }>
  AssetRate: Enum<{
    /**
     * Initialize a conversion rate to native balance for the given asset.
     *
     * ## Complexity - O(1)
     */
    create: {
      asset_kind: Anonymize<I2q3ri6itcjj5u>
      rate: bigint
    }
    /**
     * Update the conversion rate to native balance for the given asset.
     *
     * ## Complexity - O(1)
     */
    update: {
      asset_kind: Anonymize<I2q3ri6itcjj5u>
      rate: bigint
    }
    /**
     * Remove an existing conversion rate to native balance for the given asset.
     *
     * ## Complexity - O(1)
     */
    remove: {
      asset_kind: Anonymize<I2q3ri6itcjj5u>
    }
  }>
  Beefy: Enum<{
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     */
    report_double_voting: {
      equivocation_proof: {
        first: Anonymize<I3eao7ea0kppv8>
        second: Anonymize<I3eao7ea0kppv8>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender. If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only block
     * authors will call it (validated in `ValidateUnsigned`), as such if the
     * block author is defined it will be defined as the equivocation reporter.
     */
    report_double_voting_unsigned: {
      equivocation_proof: {
        first: Anonymize<I3eao7ea0kppv8>
        second: Anonymize<I3eao7ea0kppv8>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Reset BEEFY consensus by setting a new BEEFY genesis at `delay_in_blocks`
     * blocks in the future.
     *
     * Note: `delay_in_blocks` has to be at least 1.
     */
    set_new_genesis: {
      delay_in_blocks: number
    }
    /**
     * Report fork voting equivocation. This method will verify the equivocation
     * proof and validate the given key ownership proof against the extracted
     * offender.
     * If both are valid, the offence will be reported.
     */
    report_fork_voting: {
      equivocation_proof: {
        vote: Anonymize<I3eao7ea0kppv8>
        ancestry_proof: {
          prev_peaks: Anonymize<Ic5m5lp1oioo8r>
          prev_leaf_count: bigint
          leaf_count: bigint
          items: Array<[bigint, FixedSizeBinary<32>]>
        }
        header: Anonymize<Ic952bubvq4k7d>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report fork voting equivocation. This method will verify the equivocation
     * proof and validate the given key ownership proof against the extracted
     * offender.
     * If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only block
     * authors will call it (validated in `ValidateUnsigned`), as such if the
     * block author is defined it will be defined as the equivocation reporter.
     */
    report_fork_voting_unsigned: {
      equivocation_proof: {
        vote: Anonymize<I3eao7ea0kppv8>
        ancestry_proof: {
          prev_peaks: Anonymize<Ic5m5lp1oioo8r>
          prev_leaf_count: bigint
          leaf_count: bigint
          items: Array<[bigint, FixedSizeBinary<32>]>
        }
        header: Anonymize<Ic952bubvq4k7d>
      }
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report future block voting equivocation. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender.
     * If both are valid, the offence will be reported.
     */
    report_future_block_voting: {
      equivocation_proof: Anonymize<I3eao7ea0kppv8>
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
    /**
     * Report future block voting equivocation. This method will verify the
     * equivocation proof and validate the given key ownership proof against the
     * extracted offender.
     * If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only block
     * authors will call it (validated in `ValidateUnsigned`), as such if the
     * block author is defined it will be defined as the equivocation reporter.
     */
    report_future_block_voting_unsigned: {
      equivocation_proof: Anonymize<I3eao7ea0kppv8>
      key_owner_proof: Anonymize<I3ia7aufsoj0l1>
    }
  }>
}>
export type Itom7fk49o0c9 = Array<Binary>
export type Iep7au1720bm0e = Anonymize<I9jd27rnpm8ttv> | undefined
export type I9jd27rnpm8ttv = FixedSizeArray<2, number>
export type I1jm8m1rh9e20v = {
  hash: FixedSizeBinary<32>
}
export type Ic5m5lp1oioo8r = Array<FixedSizeBinary<32>>
export type Ic952bubvq4k7d = {
  parent_hash: FixedSizeBinary<32>
  number: number
  state_root: FixedSizeBinary<32>
  extrinsics_root: FixedSizeBinary<32>
  digest: Array<DigestItem>
}
export type DigestItem = Enum<{
  PreRuntime: [FixedSizeBinary<4>, Binary]
  Consensus: [FixedSizeBinary<4>, Binary]
  Seal: [FixedSizeBinary<4>, Binary]
  Other: Binary
  RuntimeEnvironmentUpdated: undefined
}>
export declare const DigestItem: GetEnum<DigestItem>
export type I3ia7aufsoj0l1 = {
  session: number
  trie_nodes: Anonymize<Itom7fk49o0c9>
  validator_count: number
}
export type BabeDigestsNextConfigDescriptor = Enum<{
  V1: {
    c: FixedSizeArray<2, bigint>
    allowed_slots: BabeAllowedSlots
  }
}>
export declare const BabeDigestsNextConfigDescriptor: GetEnum<BabeDigestsNextConfigDescriptor>
export type BabeAllowedSlots = Enum<{
  PrimarySlots: undefined
  PrimaryAndSecondaryPlainSlots: undefined
  PrimaryAndSecondaryVRFSlots: undefined
}>
export declare const BabeAllowedSlots: GetEnum<BabeAllowedSlots>
export type I666bl2fqjkejo = {
  index: number
}
export type MultiAddress = Enum<{
  Id: SS58String
  Index: undefined
  Raw: Binary
  Address32: FixedSizeBinary<32>
  Address20: FixedSizeBinary<20>
}>
export declare const MultiAddress: GetEnum<MultiAddress>
export type Ia2lhg7l2hilo3 = Array<SS58String>
export type BalancesAdjustmentDirection = Enum<{
  Increase: undefined
  Decrease: undefined
}>
export declare const BalancesAdjustmentDirection: GetEnum<BalancesAdjustmentDirection>
export type StakingRewardDestination = Enum<{
  Staked: undefined
  Stash: undefined
  Controller: undefined
  Account: SS58String
  None: undefined
}>
export declare const StakingRewardDestination: GetEnum<StakingRewardDestination>
export type I28gn91b2ttnbk = Array<MultiAddress>
export type I3vh014cqgmrfd = {
  new: number
}
export type StakingPalletConfigOpBig = Enum<{
  Noop: undefined
  Set: bigint
  Remove: undefined
}>
export declare const StakingPalletConfigOpBig: GetEnum<StakingPalletConfigOpBig>
export type StakingPalletConfigOp = Enum<{
  Noop: undefined
  Set: number
  Remove: undefined
}>
export declare const StakingPalletConfigOp: GetEnum<StakingPalletConfigOp>
export type Ihfphjolmsqq1 = SS58String | undefined
export type I35p85j063s0il = bigint | undefined
export type GrandpaEquivocation = Enum<{
  Prevote: {
    round_number: bigint
    identity: FixedSizeBinary<32>
    first: [
      {
        target_hash: FixedSizeBinary<32>
        target_number: number
      },
      FixedSizeBinary<64>,
    ]
    second: [
      {
        target_hash: FixedSizeBinary<32>
        target_number: number
      },
      FixedSizeBinary<64>,
    ]
  }
  Precommit: {
    round_number: bigint
    identity: FixedSizeBinary<32>
    first: [
      {
        target_hash: FixedSizeBinary<32>
        target_number: number
      },
      FixedSizeBinary<64>,
    ]
    second: [
      {
        target_hash: FixedSizeBinary<32>
        target_number: number
      },
      FixedSizeBinary<64>,
    ]
  }
}>
export declare const GrandpaEquivocation: GetEnum<GrandpaEquivocation>
export type I2q3ri6itcjj5u = AnonymousEnum<{
  V3: {
    location: Anonymize<I4c0s5cioidn76>
    asset_id: XcmV3MultiassetAssetId
  }
  V4: {
    location: Anonymize<I4c0s5cioidn76>
    asset_id: Anonymize<I4c0s5cioidn76>
  }
  V5: {
    location: Anonymize<If9iqq7i64mur8>
    asset_id: Anonymize<If9iqq7i64mur8>
  }
}>
export type I4c0s5cioidn76 = {
  parents: number
  interior: XcmV3Junctions
}
export type XcmV3Junctions = Enum<{
  Here: undefined
  X1: XcmV3Junction
  X2: FixedSizeArray<2, XcmV3Junction>
  X3: FixedSizeArray<3, XcmV3Junction>
  X4: FixedSizeArray<4, XcmV3Junction>
  X5: FixedSizeArray<5, XcmV3Junction>
  X6: FixedSizeArray<6, XcmV3Junction>
  X7: FixedSizeArray<7, XcmV3Junction>
  X8: FixedSizeArray<8, XcmV3Junction>
}>
export declare const XcmV3Junctions: GetEnum<XcmV3Junctions>
export type XcmV3Junction = Enum<{
  Parachain: number
  AccountId32: {
    network?: Anonymize<Idcq3vns9tgp5p>
    id: FixedSizeBinary<32>
  }
  AccountIndex64: {
    network?: Anonymize<Idcq3vns9tgp5p>
    index: bigint
  }
  AccountKey20: {
    network?: Anonymize<Idcq3vns9tgp5p>
    key: FixedSizeBinary<20>
  }
  PalletInstance: number
  GeneralIndex: bigint
  GeneralKey: Anonymize<I15lht6t53odo4>
  OnlyChild: undefined
  Plurality: Anonymize<I518fbtnclg1oc>
  GlobalConsensus: XcmV3JunctionNetworkId
}>
export declare const XcmV3Junction: GetEnum<XcmV3Junction>
export type Idcq3vns9tgp5p = XcmV3JunctionNetworkId | undefined
export type XcmV3JunctionNetworkId = Enum<{
  ByGenesis: FixedSizeBinary<32>
  ByFork: Anonymize<I15vf5oinmcgps>
  Polkadot: undefined
  Kusama: undefined
  Westend: undefined
  Rococo: undefined
  Wococo: undefined
  Ethereum: Anonymize<I623eo8t3jrbeo>
  BitcoinCore: undefined
  BitcoinCash: undefined
  PolkadotBulletin: undefined
}>
export declare const XcmV3JunctionNetworkId: GetEnum<XcmV3JunctionNetworkId>
export type I15vf5oinmcgps = {
  block_number: bigint
  block_hash: FixedSizeBinary<32>
}
export type I623eo8t3jrbeo = {
  chain_id: bigint
}
export type I15lht6t53odo4 = {
  length: number
  data: FixedSizeBinary<32>
}
export type I518fbtnclg1oc = {
  id: XcmV3JunctionBodyId
  part: XcmV2JunctionBodyPart
}
export type XcmV3JunctionBodyId = Enum<{
  Unit: undefined
  Moniker: FixedSizeBinary<4>
  Index: number
  Executive: undefined
  Technical: undefined
  Legislative: undefined
  Judicial: undefined
  Defense: undefined
  Administration: undefined
  Treasury: undefined
}>
export declare const XcmV3JunctionBodyId: GetEnum<XcmV3JunctionBodyId>
export type XcmV2JunctionBodyPart = Enum<{
  Voice: undefined
  Members: Anonymize<Iafscmv8tjf0ou>
  Fraction: {
    nom: number
    denom: number
  }
  AtLeastProportion: {
    nom: number
    denom: number
  }
  MoreThanProportion: {
    nom: number
    denom: number
  }
}>
export declare const XcmV2JunctionBodyPart: GetEnum<XcmV2JunctionBodyPart>
export type Iafscmv8tjf0ou = {
  count: number
}
export type XcmV3MultiassetAssetId = Enum<{
  Concrete: Anonymize<I4c0s5cioidn76>
  Abstract: FixedSizeBinary<32>
}>
export declare const XcmV3MultiassetAssetId: GetEnum<XcmV3MultiassetAssetId>
export type If9iqq7i64mur8 = {
  parents: number
  interior: XcmV5Junctions
}
export type XcmV5Junctions = Enum<{
  Here: undefined
  X1: XcmV5Junction
  X2: FixedSizeArray<2, XcmV5Junction>
  X3: FixedSizeArray<3, XcmV5Junction>
  X4: FixedSizeArray<4, XcmV5Junction>
  X5: FixedSizeArray<5, XcmV5Junction>
  X6: FixedSizeArray<6, XcmV5Junction>
  X7: FixedSizeArray<7, XcmV5Junction>
  X8: FixedSizeArray<8, XcmV5Junction>
}>
export declare const XcmV5Junctions: GetEnum<XcmV5Junctions>
export type XcmV5Junction = Enum<{
  Parachain: number
  AccountId32: {
    network?: Anonymize<I97pd2rst02a7r>
    id: FixedSizeBinary<32>
  }
  AccountIndex64: {
    network?: Anonymize<I97pd2rst02a7r>
    index: bigint
  }
  AccountKey20: {
    network?: Anonymize<I97pd2rst02a7r>
    key: FixedSizeBinary<20>
  }
  PalletInstance: number
  GeneralIndex: bigint
  GeneralKey: Anonymize<I15lht6t53odo4>
  OnlyChild: undefined
  Plurality: Anonymize<I518fbtnclg1oc>
  GlobalConsensus: XcmV5NetworkId
}>
export declare const XcmV5Junction: GetEnum<XcmV5Junction>
export type I97pd2rst02a7r = XcmV5NetworkId | undefined
export type XcmV5NetworkId = Enum<{
  ByGenesis: FixedSizeBinary<32>
  ByFork: Anonymize<I15vf5oinmcgps>
  Polkadot: undefined
  Kusama: undefined
  Ethereum: Anonymize<I623eo8t3jrbeo>
  BitcoinCore: undefined
  BitcoinCash: undefined
  PolkadotBulletin: undefined
}>
export declare const XcmV5NetworkId: GetEnum<XcmV5NetworkId>
export type XcmVersionedLocation = Enum<{
  V3: Anonymize<I4c0s5cioidn76>
  V4: Anonymize<I4c0s5cioidn76>
  V5: Anonymize<If9iqq7i64mur8>
}>
export declare const XcmVersionedLocation: GetEnum<XcmVersionedLocation>
export type I4arjljr6dpflb = number | undefined
export type ConvictionVotingVoteAccountVote = Enum<{
  Standard: {
    vote: number
    balance: bigint
  }
  Split: {
    aye: bigint
    nay: bigint
  }
  SplitAbstain: {
    aye: bigint
    nay: bigint
    abstain: bigint
  }
}>
export declare const ConvictionVotingVoteAccountVote: GetEnum<ConvictionVotingVoteAccountVote>
export type VotingConviction = Enum<{
  None: undefined
  Locked1x: undefined
  Locked2x: undefined
  Locked3x: undefined
  Locked4x: undefined
  Locked5x: undefined
  Locked6x: undefined
}>
export declare const VotingConviction: GetEnum<VotingConviction>
export type I39p61kmiacrk5 = AnonymousEnum<{
  system: Enum<{
    Root: undefined
    Signed: SS58String
    None: undefined
    Authorized: undefined
  }>
  Origins: GovernanceOrigin
  ParachainsOrigin: ParachainsOrigin
  XcmPallet: Enum<{
    Xcm: Anonymize<If9iqq7i64mur8>
    Response: Anonymize<If9iqq7i64mur8>
  }>
}>
export type GovernanceOrigin = Enum<{
  StakingAdmin: undefined
  Treasurer: undefined
  FellowshipAdmin: undefined
  GeneralAdmin: undefined
  AuctionAdmin: undefined
  LeaseAdmin: undefined
  ReferendumCanceller: undefined
  ReferendumKiller: undefined
  SmallTipper: undefined
  BigTipper: undefined
  SmallSpender: undefined
  MediumSpender: undefined
  BigSpender: undefined
  WhitelistedCaller: undefined
  WishForChange: undefined
}>
export declare const GovernanceOrigin: GetEnum<GovernanceOrigin>
export type ParachainsOrigin = Enum<{
  Parachain: number
}>
export declare const ParachainsOrigin: GetEnum<ParachainsOrigin>
export type PreimagesBounded = Enum<{
  Legacy: Anonymize<I1jm8m1rh9e20v>
  Inline: Binary
  Lookup: {
    hash: FixedSizeBinary<32>
    len: number
  }
}>
export declare const PreimagesBounded: GetEnum<PreimagesBounded>
export type TraitsScheduleDispatchTime = Enum<{
  At: number
  After: number
}>
export declare const TraitsScheduleDispatchTime: GetEnum<TraitsScheduleDispatchTime>
export type I4q39t5hn830vp = {
  ref_time: bigint
  proof_size: bigint
}
export type ClaimsStatementKind = Enum<{
  Regular: undefined
  Saft: undefined
}>
export declare const ClaimsStatementKind: GetEnum<ClaimsStatementKind>
export type I4aro1m78pdrtt = {
  locked: bigint
  per_block: bigint
  starting_block: number
}
export type I93g3hgcn0dpaj = Anonymize<I7adrgaqb51jb9> | undefined
export type I7adrgaqb51jb9 = AnonymousEnum<{
  Any: undefined
  NonTransfer: undefined
  Governance: undefined
  Staking: undefined
  CancelProxy: undefined
  Auction: undefined
  NominationPools: undefined
  ParaRegistration: undefined
}>
export type I95jfd8j5cr5eh = Anonymize<Itvprrpb0nm3o> | undefined
export type Itvprrpb0nm3o = {
  height: number
  index: number
}
export type I7je4n92ump862 = {
  solution: {
    votes1: Array<Anonymize<I5g2vv0ckl2m8b>>
    votes2: Array<[number, Anonymize<I5g2vv0ckl2m8b>, number]>
    votes3: Array<
      [number, FixedSizeArray<2, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes4: Array<
      [number, FixedSizeArray<3, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes5: Array<
      [number, FixedSizeArray<4, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes6: Array<
      [number, FixedSizeArray<5, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes7: Array<
      [number, FixedSizeArray<6, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes8: Array<
      [number, FixedSizeArray<7, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes9: Array<
      [number, FixedSizeArray<8, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes10: Array<
      [number, FixedSizeArray<9, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes11: Array<
      [number, FixedSizeArray<10, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes12: Array<
      [number, FixedSizeArray<11, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes13: Array<
      [number, FixedSizeArray<12, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes14: Array<
      [number, FixedSizeArray<13, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes15: Array<
      [number, FixedSizeArray<14, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
    votes16: Array<
      [number, FixedSizeArray<15, Anonymize<I5g2vv0ckl2m8b>>, number]
    >
  }
  score: Anonymize<I8s6n43okuj2b1>
  round: number
}
export type I5g2vv0ckl2m8b = [number, number]
export type I8s6n43okuj2b1 = {
  minimal_stake: bigint
  sum_stake: bigint
  sum_stake_squared: bigint
}
export type NominationPoolsBondExtra = Enum<{
  FreeBalance: bigint
  Rewards: undefined
}>
export declare const NominationPoolsBondExtra: GetEnum<NominationPoolsBondExtra>
export type NominationPoolsPoolState = Enum<{
  Open: undefined
  Blocked: undefined
  Destroying: undefined
}>
export declare const NominationPoolsPoolState: GetEnum<NominationPoolsPoolState>
export type NominationPoolsConfigOp = Enum<{
  Noop: undefined
  Set: SS58String
  Remove: undefined
}>
export declare const NominationPoolsConfigOp: GetEnum<NominationPoolsConfigOp>
export type NominationPoolsClaimPermission = Enum<{
  Permissioned: undefined
  PermissionlessCompound: undefined
  PermissionlessWithdraw: undefined
  PermissionlessAll: undefined
}>
export declare const NominationPoolsClaimPermission: GetEnum<NominationPoolsClaimPermission>
export type NominationPoolsCommissionClaimPermission = Enum<{
  Permissionless: undefined
  Account: SS58String
}>
export declare const NominationPoolsCommissionClaimPermission: GetEnum<NominationPoolsCommissionClaimPermission>
export type PolkadotPrimitivesV6ExecutorParamsExecutorParam = Enum<{
  MaxMemoryPages: number
  StackLogicalMax: number
  StackNativeMax: number
  PrecheckingMaxMemory: bigint
  PvfPrepTimeout: [PolkadotPrimitivesV6PvfPrepKind, bigint]
  PvfExecTimeout: [PvfExecKind, bigint]
  WasmExtBulkMemory: undefined
}>
export declare const PolkadotPrimitivesV6ExecutorParamsExecutorParam: GetEnum<PolkadotPrimitivesV6ExecutorParamsExecutorParam>
export type PolkadotPrimitivesV6PvfPrepKind = Enum<{
  Precheck: undefined
  Prepare: undefined
}>
export declare const PolkadotPrimitivesV6PvfPrepKind: GetEnum<PolkadotPrimitivesV6PvfPrepKind>
export type PvfExecKind = Enum<{
  Backing: undefined
  Approval: undefined
}>
export declare const PvfExecKind: GetEnum<PvfExecKind>
export type ValidityAttestation = Enum<{
  Implicit: FixedSizeBinary<64>
  Explicit: FixedSizeBinary<64>
}>
export declare const ValidityAttestation: GetEnum<ValidityAttestation>
export type PolkadotPrimitivesV6DisputeStatement = Enum<{
  Valid: PolkadotPrimitivesV6ValidDisputeStatementKind
  Invalid: InvalidDisputeStatementKind
}>
export declare const PolkadotPrimitivesV6DisputeStatement: GetEnum<PolkadotPrimitivesV6DisputeStatement>
export type PolkadotPrimitivesV6ValidDisputeStatementKind = Enum<{
  Explicit: undefined
  BackingSeconded: FixedSizeBinary<32>
  BackingValid: FixedSizeBinary<32>
  ApprovalChecking: undefined
  ApprovalCheckingMultipleCandidates: Anonymize<Ic5m5lp1oioo8r>
}>
export declare const PolkadotPrimitivesV6ValidDisputeStatementKind: GetEnum<PolkadotPrimitivesV6ValidDisputeStatementKind>
export type InvalidDisputeStatementKind = Enum<{
  Explicit: undefined
}>
export declare const InvalidDisputeStatementKind: GetEnum<InvalidDisputeStatementKind>
export type I1k3urvkqqshbc = {
  para: number
  new_code: Binary
}
export type I2ff0ffsh15vej = {
  para: number
  new_head: Binary
}
export type Iaus4cb3drhu9q = {
  para: number
}
export type I50mrcbubp554e = {
  sender: number
  recipient: number
}
export type MultiSigner = Enum<{
  Ed25519: FixedSizeBinary<32>
  Sr25519: FixedSizeBinary<32>
  Ecdsa: FixedSizeBinary<33>
}>
export declare const MultiSigner: GetEnum<MultiSigner>
export type I86cdjmsf3a81s = MultiSignature | undefined
export type MultiSignature = Enum<{
  Ed25519: FixedSizeBinary<64>
  Sr25519: FixedSizeBinary<64>
  Ecdsa: FixedSizeBinary<65>
}>
export declare const MultiSignature: GetEnum<MultiSignature>
export type BrokerCoretimeInterfaceCoreAssignment = Enum<{
  Idle: undefined
  Pool: undefined
  Task: number
}>
export declare const BrokerCoretimeInterfaceCoreAssignment: GetEnum<BrokerCoretimeInterfaceCoreAssignment>
export type I215mkl885p4da = {
  size: number
  item: number
}
export type I1ufmh6d8psvik = AnonymousEnum<{
  ToStart: undefined
  LastKey: Binary
  Complete: undefined
}>
export type XcmVersionedXcm = Enum<{
  V3: Anonymize<Ianvng4e08j9ii>
  V4: Anonymize<Iegrepoo0c1jc5>
  V5: Anonymize<Ict03eedr8de9s>
}>
export declare const XcmVersionedXcm: GetEnum<XcmVersionedXcm>
export type Ianvng4e08j9ii = Array<XcmV3Instruction>
export type XcmV3Instruction = Enum<{
  WithdrawAsset: Anonymize<Iai6dhqiq3bach>
  ReserveAssetDeposited: Anonymize<Iai6dhqiq3bach>
  ReceiveTeleportedAsset: Anonymize<Iai6dhqiq3bach>
  QueryResponse: {
    query_id: bigint
    response: XcmV3Response
    max_weight: Anonymize<I4q39t5hn830vp>
    querier?: Anonymize<Ia9cgf4r40b26h>
  }
  TransferAsset: {
    assets: Anonymize<Iai6dhqiq3bach>
    beneficiary: Anonymize<I4c0s5cioidn76>
  }
  TransferReserveAsset: {
    assets: Anonymize<Iai6dhqiq3bach>
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Ianvng4e08j9ii>
  }
  Transact: Anonymize<I92p6l5cs3fr50>
  HrmpNewChannelOpenRequest: Anonymize<I5uhhrjqfuo4e5>
  HrmpChannelAccepted: Anonymize<Ifij4jam0o7sub>
  HrmpChannelClosing: Anonymize<Ieeb4svd9i8fji>
  ClearOrigin: undefined
  DescendOrigin: XcmV3Junctions
  ReportError: Anonymize<I4r3v6e91d1qbs>
  DepositAsset: {
    assets: XcmV3MultiassetMultiAssetFilter
    beneficiary: Anonymize<I4c0s5cioidn76>
  }
  DepositReserveAsset: {
    assets: XcmV3MultiassetMultiAssetFilter
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Ianvng4e08j9ii>
  }
  ExchangeAsset: {
    give: XcmV3MultiassetMultiAssetFilter
    want: Anonymize<Iai6dhqiq3bach>
    maximal: boolean
  }
  InitiateReserveWithdraw: {
    assets: XcmV3MultiassetMultiAssetFilter
    reserve: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Ianvng4e08j9ii>
  }
  InitiateTeleport: {
    assets: XcmV3MultiassetMultiAssetFilter
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Ianvng4e08j9ii>
  }
  ReportHolding: {
    response_info: Anonymize<I4r3v6e91d1qbs>
    assets: XcmV3MultiassetMultiAssetFilter
  }
  BuyExecution: {
    fees: Anonymize<Idcm24504c8bkk>
    weight_limit: XcmV3WeightLimit
  }
  RefundSurplus: undefined
  SetErrorHandler: Anonymize<Ianvng4e08j9ii>
  SetAppendix: Anonymize<Ianvng4e08j9ii>
  ClearError: undefined
  ClaimAsset: {
    assets: Anonymize<Iai6dhqiq3bach>
    ticket: Anonymize<I4c0s5cioidn76>
  }
  Trap: bigint
  SubscribeVersion: Anonymize<Ieprdqqu7ildvr>
  UnsubscribeVersion: undefined
  BurnAsset: Anonymize<Iai6dhqiq3bach>
  ExpectAsset: Anonymize<Iai6dhqiq3bach>
  ExpectOrigin?: Anonymize<Ia9cgf4r40b26h>
  ExpectError?: Anonymize<I7sltvf8v2nure>
  ExpectTransactStatus: XcmV3MaybeErrorCode
  QueryPallet: Anonymize<Iba5bdbapp16oo>
  ExpectPallet: Anonymize<Id7mf37dkpgfjs>
  ReportTransactStatus: Anonymize<I4r3v6e91d1qbs>
  ClearTransactStatus: undefined
  UniversalOrigin: XcmV3Junction
  ExportMessage: {
    network: XcmV3JunctionNetworkId
    destination: XcmV3Junctions
    xcm: Anonymize<Ianvng4e08j9ii>
  }
  LockAsset: {
    asset: Anonymize<Idcm24504c8bkk>
    unlocker: Anonymize<I4c0s5cioidn76>
  }
  UnlockAsset: {
    asset: Anonymize<Idcm24504c8bkk>
    target: Anonymize<I4c0s5cioidn76>
  }
  NoteUnlockable: {
    asset: Anonymize<Idcm24504c8bkk>
    owner: Anonymize<I4c0s5cioidn76>
  }
  RequestUnlock: {
    asset: Anonymize<Idcm24504c8bkk>
    locker: Anonymize<I4c0s5cioidn76>
  }
  SetFeesMode: Anonymize<I4nae9rsql8fa7>
  SetTopic: FixedSizeBinary<32>
  ClearTopic: undefined
  AliasOrigin: Anonymize<I4c0s5cioidn76>
  UnpaidExecution: Anonymize<I40d50jeai33oq>
}>
export declare const XcmV3Instruction: GetEnum<XcmV3Instruction>
export type Iai6dhqiq3bach = Array<Anonymize<Idcm24504c8bkk>>
export type Idcm24504c8bkk = {
  id: XcmV3MultiassetAssetId
  fun: XcmV3MultiassetFungibility
}
export type XcmV3MultiassetFungibility = Enum<{
  Fungible: bigint
  NonFungible: XcmV3MultiassetAssetInstance
}>
export declare const XcmV3MultiassetFungibility: GetEnum<XcmV3MultiassetFungibility>
export type XcmV3MultiassetAssetInstance = Enum<{
  Undefined: undefined
  Index: bigint
  Array4: FixedSizeBinary<4>
  Array8: FixedSizeBinary<8>
  Array16: FixedSizeBinary<16>
  Array32: FixedSizeBinary<32>
}>
export declare const XcmV3MultiassetAssetInstance: GetEnum<XcmV3MultiassetAssetInstance>
export type XcmV3Response = Enum<{
  Null: undefined
  Assets: Anonymize<Iai6dhqiq3bach>
  ExecutionResult?: Anonymize<I7sltvf8v2nure>
  Version: number
  PalletsInfo: Anonymize<I599u7h20b52at>
  DispatchResult: XcmV3MaybeErrorCode
}>
export declare const XcmV3Response: GetEnum<XcmV3Response>
export type I7sltvf8v2nure = [number, XcmV3TraitsError] | undefined
export type XcmV3TraitsError = Enum<{
  Overflow: undefined
  Unimplemented: undefined
  UntrustedReserveLocation: undefined
  UntrustedTeleportLocation: undefined
  LocationFull: undefined
  LocationNotInvertible: undefined
  BadOrigin: undefined
  InvalidLocation: undefined
  AssetNotFound: undefined
  FailedToTransactAsset: undefined
  NotWithdrawable: undefined
  LocationCannotHold: undefined
  ExceedsMaxMessageSize: undefined
  DestinationUnsupported: undefined
  Transport: undefined
  Unroutable: undefined
  UnknownClaim: undefined
  FailedToDecode: undefined
  MaxWeightInvalid: undefined
  NotHoldingFees: undefined
  TooExpensive: undefined
  Trap: bigint
  ExpectationFalse: undefined
  PalletNotFound: undefined
  NameMismatch: undefined
  VersionIncompatible: undefined
  HoldingWouldOverflow: undefined
  ExportError: undefined
  ReanchorFailed: undefined
  NoDeal: undefined
  FeesNotMet: undefined
  LockError: undefined
  NoPermission: undefined
  Unanchored: undefined
  NotDepositable: undefined
  UnhandledXcmVersion: undefined
  WeightLimitReached: Anonymize<I4q39t5hn830vp>
  Barrier: undefined
  WeightNotComputable: undefined
  ExceedsStackLimit: undefined
}>
export declare const XcmV3TraitsError: GetEnum<XcmV3TraitsError>
export type I599u7h20b52at = Array<{
  index: number
  name: Binary
  module_name: Binary
  major: number
  minor: number
  patch: number
}>
export type XcmV3MaybeErrorCode = Enum<{
  Success: undefined
  Error: Binary
  TruncatedError: Binary
}>
export declare const XcmV3MaybeErrorCode: GetEnum<XcmV3MaybeErrorCode>
export type Ia9cgf4r40b26h = Anonymize<I4c0s5cioidn76> | undefined
export type I92p6l5cs3fr50 = {
  origin_kind: XcmV2OriginKind
  require_weight_at_most: Anonymize<I4q39t5hn830vp>
  call: Binary
}
export type XcmV2OriginKind = Enum<{
  Native: undefined
  SovereignAccount: undefined
  Superuser: undefined
  Xcm: undefined
}>
export declare const XcmV2OriginKind: GetEnum<XcmV2OriginKind>
export type I5uhhrjqfuo4e5 = {
  sender: number
  max_message_size: number
  max_capacity: number
}
export type Ifij4jam0o7sub = {
  recipient: number
}
export type Ieeb4svd9i8fji = {
  initiator: number
  sender: number
  recipient: number
}
export type I4r3v6e91d1qbs = {
  destination: Anonymize<I4c0s5cioidn76>
  query_id: bigint
  max_weight: Anonymize<I4q39t5hn830vp>
}
export type XcmV3MultiassetMultiAssetFilter = Enum<{
  Definite: Anonymize<Iai6dhqiq3bach>
  Wild: XcmV3MultiassetWildMultiAsset
}>
export declare const XcmV3MultiassetMultiAssetFilter: GetEnum<XcmV3MultiassetMultiAssetFilter>
export type XcmV3MultiassetWildMultiAsset = Enum<{
  All: undefined
  AllOf: {
    id: XcmV3MultiassetAssetId
    fun: XcmV2MultiassetWildFungibility
  }
  AllCounted: number
  AllOfCounted: {
    id: XcmV3MultiassetAssetId
    fun: XcmV2MultiassetWildFungibility
    count: number
  }
}>
export declare const XcmV3MultiassetWildMultiAsset: GetEnum<XcmV3MultiassetWildMultiAsset>
export type XcmV2MultiassetWildFungibility = Enum<{
  Fungible: undefined
  NonFungible: undefined
}>
export declare const XcmV2MultiassetWildFungibility: GetEnum<XcmV2MultiassetWildFungibility>
export type XcmV3WeightLimit = Enum<{
  Unlimited: undefined
  Limited: Anonymize<I4q39t5hn830vp>
}>
export declare const XcmV3WeightLimit: GetEnum<XcmV3WeightLimit>
export type Ieprdqqu7ildvr = {
  query_id: bigint
  max_response_weight: Anonymize<I4q39t5hn830vp>
}
export type Iba5bdbapp16oo = {
  module_name: Binary
  response_info: Anonymize<I4r3v6e91d1qbs>
}
export type Id7mf37dkpgfjs = {
  index: number
  name: Binary
  module_name: Binary
  crate_major: number
  min_crate_minor: number
}
export type I4nae9rsql8fa7 = {
  jit_withdraw: boolean
}
export type I40d50jeai33oq = {
  weight_limit: XcmV3WeightLimit
  check_origin?: Anonymize<Ia9cgf4r40b26h>
}
export type Iegrepoo0c1jc5 = Array<XcmV4Instruction>
export type XcmV4Instruction = Enum<{
  WithdrawAsset: Anonymize<I50mli3hb64f9b>
  ReserveAssetDeposited: Anonymize<I50mli3hb64f9b>
  ReceiveTeleportedAsset: Anonymize<I50mli3hb64f9b>
  QueryResponse: {
    query_id: bigint
    response: XcmV4Response
    max_weight: Anonymize<I4q39t5hn830vp>
    querier?: Anonymize<Ia9cgf4r40b26h>
  }
  TransferAsset: {
    assets: Anonymize<I50mli3hb64f9b>
    beneficiary: Anonymize<I4c0s5cioidn76>
  }
  TransferReserveAsset: {
    assets: Anonymize<I50mli3hb64f9b>
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Iegrepoo0c1jc5>
  }
  Transact: Anonymize<I92p6l5cs3fr50>
  HrmpNewChannelOpenRequest: Anonymize<I5uhhrjqfuo4e5>
  HrmpChannelAccepted: Anonymize<Ifij4jam0o7sub>
  HrmpChannelClosing: Anonymize<Ieeb4svd9i8fji>
  ClearOrigin: undefined
  DescendOrigin: XcmV3Junctions
  ReportError: Anonymize<I4r3v6e91d1qbs>
  DepositAsset: {
    assets: XcmV4AssetAssetFilter
    beneficiary: Anonymize<I4c0s5cioidn76>
  }
  DepositReserveAsset: {
    assets: XcmV4AssetAssetFilter
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Iegrepoo0c1jc5>
  }
  ExchangeAsset: {
    give: XcmV4AssetAssetFilter
    want: Anonymize<I50mli3hb64f9b>
    maximal: boolean
  }
  InitiateReserveWithdraw: {
    assets: XcmV4AssetAssetFilter
    reserve: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Iegrepoo0c1jc5>
  }
  InitiateTeleport: {
    assets: XcmV4AssetAssetFilter
    dest: Anonymize<I4c0s5cioidn76>
    xcm: Anonymize<Iegrepoo0c1jc5>
  }
  ReportHolding: {
    response_info: Anonymize<I4r3v6e91d1qbs>
    assets: XcmV4AssetAssetFilter
  }
  BuyExecution: {
    fees: Anonymize<Ia5l7mu5a6v49o>
    weight_limit: XcmV3WeightLimit
  }
  RefundSurplus: undefined
  SetErrorHandler: Anonymize<Iegrepoo0c1jc5>
  SetAppendix: Anonymize<Iegrepoo0c1jc5>
  ClearError: undefined
  ClaimAsset: {
    assets: Anonymize<I50mli3hb64f9b>
    ticket: Anonymize<I4c0s5cioidn76>
  }
  Trap: bigint
  SubscribeVersion: Anonymize<Ieprdqqu7ildvr>
  UnsubscribeVersion: undefined
  BurnAsset: Anonymize<I50mli3hb64f9b>
  ExpectAsset: Anonymize<I50mli3hb64f9b>
  ExpectOrigin?: Anonymize<Ia9cgf4r40b26h>
  ExpectError?: Anonymize<I7sltvf8v2nure>
  ExpectTransactStatus: XcmV3MaybeErrorCode
  QueryPallet: Anonymize<Iba5bdbapp16oo>
  ExpectPallet: Anonymize<Id7mf37dkpgfjs>
  ReportTransactStatus: Anonymize<I4r3v6e91d1qbs>
  ClearTransactStatus: undefined
  UniversalOrigin: XcmV3Junction
  ExportMessage: {
    network: XcmV3JunctionNetworkId
    destination: XcmV3Junctions
    xcm: Anonymize<Iegrepoo0c1jc5>
  }
  LockAsset: {
    asset: Anonymize<Ia5l7mu5a6v49o>
    unlocker: Anonymize<I4c0s5cioidn76>
  }
  UnlockAsset: {
    asset: Anonymize<Ia5l7mu5a6v49o>
    target: Anonymize<I4c0s5cioidn76>
  }
  NoteUnlockable: {
    asset: Anonymize<Ia5l7mu5a6v49o>
    owner: Anonymize<I4c0s5cioidn76>
  }
  RequestUnlock: {
    asset: Anonymize<Ia5l7mu5a6v49o>
    locker: Anonymize<I4c0s5cioidn76>
  }
  SetFeesMode: Anonymize<I4nae9rsql8fa7>
  SetTopic: FixedSizeBinary<32>
  ClearTopic: undefined
  AliasOrigin: Anonymize<I4c0s5cioidn76>
  UnpaidExecution: Anonymize<I40d50jeai33oq>
}>
export declare const XcmV4Instruction: GetEnum<XcmV4Instruction>
export type I50mli3hb64f9b = Array<Anonymize<Ia5l7mu5a6v49o>>
export type Ia5l7mu5a6v49o = {
  id: Anonymize<I4c0s5cioidn76>
  fun: XcmV3MultiassetFungibility
}
export type XcmV4Response = Enum<{
  Null: undefined
  Assets: Anonymize<I50mli3hb64f9b>
  ExecutionResult?: Anonymize<I7sltvf8v2nure>
  Version: number
  PalletsInfo: Anonymize<I599u7h20b52at>
  DispatchResult: XcmV3MaybeErrorCode
}>
export declare const XcmV4Response: GetEnum<XcmV4Response>
export type XcmV4AssetAssetFilter = Enum<{
  Definite: Anonymize<I50mli3hb64f9b>
  Wild: XcmV4AssetWildAsset
}>
export declare const XcmV4AssetAssetFilter: GetEnum<XcmV4AssetAssetFilter>
export type XcmV4AssetWildAsset = Enum<{
  All: undefined
  AllOf: {
    id: Anonymize<I4c0s5cioidn76>
    fun: XcmV2MultiassetWildFungibility
  }
  AllCounted: number
  AllOfCounted: {
    id: Anonymize<I4c0s5cioidn76>
    fun: XcmV2MultiassetWildFungibility
    count: number
  }
}>
export declare const XcmV4AssetWildAsset: GetEnum<XcmV4AssetWildAsset>
export type Ict03eedr8de9s = Array<XcmV5Instruction>
export type XcmV5Instruction = Enum<{
  WithdrawAsset: Anonymize<I4npjalvhmfuj>
  ReserveAssetDeposited: Anonymize<I4npjalvhmfuj>
  ReceiveTeleportedAsset: Anonymize<I4npjalvhmfuj>
  QueryResponse: {
    query_id: bigint
    response: Enum<{
      Null: undefined
      Assets: Anonymize<I4npjalvhmfuj>
      ExecutionResult?: Anonymize<I3l6ejee750fv1>
      Version: number
      PalletsInfo: Anonymize<I599u7h20b52at>
      DispatchResult: XcmV3MaybeErrorCode
    }>
    max_weight: Anonymize<I4q39t5hn830vp>
    querier?: Anonymize<I4pai6qnfk426l>
  }
  TransferAsset: {
    assets: Anonymize<I4npjalvhmfuj>
    beneficiary: Anonymize<If9iqq7i64mur8>
  }
  TransferReserveAsset: {
    assets: Anonymize<I4npjalvhmfuj>
    dest: Anonymize<If9iqq7i64mur8>
    xcm: Anonymize<Ict03eedr8de9s>
  }
  Transact: {
    origin_kind: XcmV2OriginKind
    fallback_max_weight?: Anonymize<I4q39t5hn830vp> | undefined
    call: Binary
  }
  HrmpNewChannelOpenRequest: Anonymize<I5uhhrjqfuo4e5>
  HrmpChannelAccepted: Anonymize<Ifij4jam0o7sub>
  HrmpChannelClosing: Anonymize<Ieeb4svd9i8fji>
  ClearOrigin: undefined
  DescendOrigin: XcmV5Junctions
  ReportError: Anonymize<I6vsmh07hrp1rc>
  DepositAsset: {
    assets: XcmV5AssetFilter
    beneficiary: Anonymize<If9iqq7i64mur8>
  }
  DepositReserveAsset: {
    assets: XcmV5AssetFilter
    dest: Anonymize<If9iqq7i64mur8>
    xcm: Anonymize<Ict03eedr8de9s>
  }
  ExchangeAsset: {
    give: XcmV5AssetFilter
    want: Anonymize<I4npjalvhmfuj>
    maximal: boolean
  }
  InitiateReserveWithdraw: {
    assets: XcmV5AssetFilter
    reserve: Anonymize<If9iqq7i64mur8>
    xcm: Anonymize<Ict03eedr8de9s>
  }
  InitiateTeleport: {
    assets: XcmV5AssetFilter
    dest: Anonymize<If9iqq7i64mur8>
    xcm: Anonymize<Ict03eedr8de9s>
  }
  ReportHolding: {
    response_info: Anonymize<I6vsmh07hrp1rc>
    assets: XcmV5AssetFilter
  }
  BuyExecution: {
    fees: Anonymize<Iffh1nc5e1mod6>
    weight_limit: XcmV3WeightLimit
  }
  RefundSurplus: undefined
  SetErrorHandler: Anonymize<Ict03eedr8de9s>
  SetAppendix: Anonymize<Ict03eedr8de9s>
  ClearError: undefined
  ClaimAsset: {
    assets: Anonymize<I4npjalvhmfuj>
    ticket: Anonymize<If9iqq7i64mur8>
  }
  Trap: bigint
  SubscribeVersion: Anonymize<Ieprdqqu7ildvr>
  UnsubscribeVersion: undefined
  BurnAsset: Anonymize<I4npjalvhmfuj>
  ExpectAsset: Anonymize<I4npjalvhmfuj>
  ExpectOrigin?: Anonymize<I4pai6qnfk426l>
  ExpectError?: Anonymize<I3l6ejee750fv1>
  ExpectTransactStatus: XcmV3MaybeErrorCode
  QueryPallet: {
    module_name: Binary
    response_info: Anonymize<I6vsmh07hrp1rc>
  }
  ExpectPallet: Anonymize<Id7mf37dkpgfjs>
  ReportTransactStatus: Anonymize<I6vsmh07hrp1rc>
  ClearTransactStatus: undefined
  UniversalOrigin: XcmV5Junction
  ExportMessage: {
    network: XcmV5NetworkId
    destination: XcmV5Junctions
    xcm: Anonymize<Ict03eedr8de9s>
  }
  LockAsset: {
    asset: Anonymize<Iffh1nc5e1mod6>
    unlocker: Anonymize<If9iqq7i64mur8>
  }
  UnlockAsset: {
    asset: Anonymize<Iffh1nc5e1mod6>
    target: Anonymize<If9iqq7i64mur8>
  }
  NoteUnlockable: {
    asset: Anonymize<Iffh1nc5e1mod6>
    owner: Anonymize<If9iqq7i64mur8>
  }
  RequestUnlock: {
    asset: Anonymize<Iffh1nc5e1mod6>
    locker: Anonymize<If9iqq7i64mur8>
  }
  SetFeesMode: Anonymize<I4nae9rsql8fa7>
  SetTopic: FixedSizeBinary<32>
  ClearTopic: undefined
  AliasOrigin: Anonymize<If9iqq7i64mur8>
  UnpaidExecution: {
    weight_limit: XcmV3WeightLimit
    check_origin?: Anonymize<I4pai6qnfk426l>
  }
  PayFees: {
    asset: Anonymize<Iffh1nc5e1mod6>
  }
  InitiateTransfer: {
    destination: Anonymize<If9iqq7i64mur8>
    remote_fees?: Anonymize<Ifhmc9e7vpeeig> | undefined
    preserve_origin: boolean
    assets: Array<Anonymize<Ifhmc9e7vpeeig>>
    remote_xcm: Anonymize<Ict03eedr8de9s>
  }
  ExecuteWithOrigin: {
    descendant_origin?: XcmV5Junctions | undefined
    xcm: Anonymize<Ict03eedr8de9s>
  }
  SetHints: {
    hints: Array<
      Enum<{
        AssetClaimer: {
          location: Anonymize<If9iqq7i64mur8>
        }
      }>
    >
  }
}>
export declare const XcmV5Instruction: GetEnum<XcmV5Instruction>
export type I4npjalvhmfuj = Array<Anonymize<Iffh1nc5e1mod6>>
export type Iffh1nc5e1mod6 = {
  id: Anonymize<If9iqq7i64mur8>
  fun: XcmV3MultiassetFungibility
}
export type I3l6ejee750fv1 =
  | [
      number,
      Enum<{
        Overflow: undefined
        Unimplemented: undefined
        UntrustedReserveLocation: undefined
        UntrustedTeleportLocation: undefined
        LocationFull: undefined
        LocationNotInvertible: undefined
        BadOrigin: undefined
        InvalidLocation: undefined
        AssetNotFound: undefined
        FailedToTransactAsset: undefined
        NotWithdrawable: undefined
        LocationCannotHold: undefined
        ExceedsMaxMessageSize: undefined
        DestinationUnsupported: undefined
        Transport: undefined
        Unroutable: undefined
        UnknownClaim: undefined
        FailedToDecode: undefined
        MaxWeightInvalid: undefined
        NotHoldingFees: undefined
        TooExpensive: undefined
        Trap: bigint
        ExpectationFalse: undefined
        PalletNotFound: undefined
        NameMismatch: undefined
        VersionIncompatible: undefined
        HoldingWouldOverflow: undefined
        ExportError: undefined
        ReanchorFailed: undefined
        NoDeal: undefined
        FeesNotMet: undefined
        LockError: undefined
        NoPermission: undefined
        Unanchored: undefined
        NotDepositable: undefined
        TooManyAssets: undefined
        UnhandledXcmVersion: undefined
        WeightLimitReached: Anonymize<I4q39t5hn830vp>
        Barrier: undefined
        WeightNotComputable: undefined
        ExceedsStackLimit: undefined
      }>,
    ]
  | undefined
export type I4pai6qnfk426l = Anonymize<If9iqq7i64mur8> | undefined
export type I6vsmh07hrp1rc = {
  destination: Anonymize<If9iqq7i64mur8>
  query_id: bigint
  max_weight: Anonymize<I4q39t5hn830vp>
}
export type XcmV5AssetFilter = Enum<{
  Definite: Anonymize<I4npjalvhmfuj>
  Wild: XcmV5WildAsset
}>
export declare const XcmV5AssetFilter: GetEnum<XcmV5AssetFilter>
export type XcmV5WildAsset = Enum<{
  All: undefined
  AllOf: {
    id: Anonymize<If9iqq7i64mur8>
    fun: XcmV2MultiassetWildFungibility
  }
  AllCounted: number
  AllOfCounted: {
    id: Anonymize<If9iqq7i64mur8>
    fun: XcmV2MultiassetWildFungibility
    count: number
  }
}>
export declare const XcmV5WildAsset: GetEnum<XcmV5WildAsset>
export type Ifhmc9e7vpeeig = AnonymousEnum<{
  Teleport: XcmV5AssetFilter
  ReserveDeposit: XcmV5AssetFilter
  ReserveWithdraw: XcmV5AssetFilter
}>
export type XcmVersionedAssets = Enum<{
  V3: Anonymize<Iai6dhqiq3bach>
  V4: Anonymize<I50mli3hb64f9b>
  V5: Anonymize<I4npjalvhmfuj>
}>
export declare const XcmVersionedAssets: GetEnum<XcmVersionedAssets>
export type XcmVersionedAssetId = Enum<{
  V3: XcmV3MultiassetAssetId
  V4: Anonymize<I4c0s5cioidn76>
  V5: Anonymize<If9iqq7i64mur8>
}>
export declare const XcmVersionedAssetId: GetEnum<XcmVersionedAssetId>
export type ParachainsInclusionAggregateMessageOrigin = Enum<{
  Ump: ParachainsInclusionUmpQueueId
}>
export declare const ParachainsInclusionAggregateMessageOrigin: GetEnum<ParachainsInclusionAggregateMessageOrigin>
export type ParachainsInclusionUmpQueueId = Enum<{
  Para: number
}>
export declare const ParachainsInclusionUmpQueueId: GetEnum<ParachainsInclusionUmpQueueId>
export type I3eao7ea0kppv8 = {
  commitment: {
    payload: Array<[FixedSizeBinary<2>, Binary]>
    block_number: number
    validator_set_id: bigint
  }
  id: FixedSizeBinary<33>
  signature: FixedSizeBinary<65>
}
export {}

type AnonymousEnum<T extends {}> = T & {
  __anonymous: true
}
type MyTuple<T> = [T, ...T[]]
type SeparateUndefined<T> = undefined extends T
  ? undefined | Exclude<T, undefined>
  : T
type Anonymize<T> = SeparateUndefined<
  T extends FixedSizeBinary<infer L>
    ? number extends L
      ? Binary
      : FixedSizeBinary<L>
    : T extends
          | string
          | number
          | bigint
          | boolean
          | void
          | undefined
          | null
          | symbol
          | Uint8Array
          | Enum<any>
      ? T
      : T extends AnonymousEnum<infer V>
        ? Enum<V>
        : T extends MyTuple<any>
          ? {
              [K in keyof T]: T[K]
            }
          : T extends []
            ? []
            : T extends FixedSizeArray<infer L, infer T>
              ? number extends L
                ? Array<T>
                : FixedSizeArray<L, T>
              : {
                  [K in keyof T & string]: T[K]
                }
>
type IStorage = {
  System: {
    /**
     * The full account information for a particular account ID.
     */
    Account: StorageDescriptor<
      [Key: SS58String],
      Anonymize<I5sesotjlssv2d>,
      false,
      never
    >
  }
}
type ICalls = {
  System: {
    /**
     * Make some on-chain remark.
     *
     * Can be executed by every `origin`.
     */
    remark: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>
  }
}
type IEvent = {}
type IError = {}
type IConstants = {
  Balances: {
    /**
     * The minimum amount required to keep an account open. MUST BE GREATER THAN
     * ZERO!
     *
     * If you *really* need it to be zero, you can enable the feature
     * `insecure_zero_ed` for this pallet. However, you do so at your own risk:
     * this will open up a major DoS vector.
     * In case you have multiple sources of provider references, you may also
     * get unexpected behaviour if you set this to zero.
     *
     * Bottom line: Do yourself a favour and make it at least one!
     */
    ExistentialDeposit: PlainDescriptor<bigint>
  }
}
type IViewFns = {}
type IRuntimeCalls = {
  /**
   * The `Metadata` api trait that returns metadata for the runtime.
   */
  Metadata: {
    /**
     * Returns the metadata at a given version.
     *
     * If the given `version` isn't supported, this will return `None`.
     * Use [`Self::metadata_versions`] to find out about supported metadata
     * version of the runtime.
     */
    metadata_at_version: RuntimeDescriptor<
      [version: number],
      Anonymize<Iabpgqcjikia83>
    >
    /**
     * Returns the supported metadata versions.
     *
     * This can be used to call `metadata_at_version`.
     */
    metadata_versions: RuntimeDescriptor<[], Anonymize<Icgljjb6j82uhn>>
  }
}
type IAsset = PlainDescriptor<void>
export type DotDispatchError = unknown
type PalletsTypedef = {
  __storage: IStorage
  __tx: ICalls
  __event: IEvent
  __error: IError
  __const: IConstants
  __view: IViewFns
}
export type Dot = {
  descriptors: {
    pallets: PalletsTypedef
    apis: IRuntimeCalls
  } & Promise<any>
  metadataTypes: Promise<Uint8Array>
  asset: IAsset
  getMetadata: () => Promise<Uint8Array>
  genesis: string | undefined
}
declare const _allDescriptors: Dot
export default _allDescriptors
export type DotApis = ApisFromDef<IRuntimeCalls>
export type DotQueries = QueryFromPalletsDef<PalletsTypedef>
export type DotCalls = TxFromPalletsDef<PalletsTypedef>
export type DotEvents = EventsFromPalletsDef<PalletsTypedef>
export type DotErrors = ErrorsFromPalletsDef<PalletsTypedef>
export type DotConstants = ConstFromPalletsDef<PalletsTypedef>
export type DotViewFns = ViewFnsFromPalletsDef<PalletsTypedef>
export type DotCallData = Anonymize<Ironaioq8hfkf> & {
  value: {
    type: string
  }
}
export type DotWhitelistEntry =
  | PalletKey
  | ApiKey<IRuntimeCalls>
  | `query.${NestedKey<PalletsTypedef["__storage"]>}`
  | `tx.${NestedKey<PalletsTypedef["__tx"]>}`
  | `event.${NestedKey<PalletsTypedef["__event"]>}`
  | `error.${NestedKey<PalletsTypedef["__error"]>}`
  | `const.${NestedKey<PalletsTypedef["__const"]>}`
  | `view.${NestedKey<PalletsTypedef["__view"]>}`
type PalletKey =
  `*.${keyof (IStorage & ICalls & IEvent & IError & IConstants & IRuntimeCalls & IViewFns)}`
type NestedKey<D extends Record<string, Record<string, any>>> =
  | "*"
  | {
      [P in keyof D & string]:
        | `${P}.*`
        | {
            [N in keyof D[P] & string]: `${P}.${N}`
          }[keyof D[P] & string]
    }[keyof D & string]
type ApiKey<D extends Record<string, Record<string, any>>> =
  | "api.*"
  | {
      [P in keyof D & string]:
        | `api.${P}.*`
        | {
            [N in keyof D[P] & string]: `api.${P}.${N}`
          }[keyof D[P] & string]
    }[keyof D & string]
