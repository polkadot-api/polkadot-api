export default `
// sp_runtime,generic,digest,DigestItem
// 7bvp9q4ceuk7
type DigestItem = Enum<
  | { type: "PreRuntime"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Consensus"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Seal"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Other"; value: Anonymize<Binary> }
  | { type: "RuntimeEnvironmentUpdated"; value: undefined }
>

// polkadot_runtime,RuntimeEvent
// de34t9q69e2j6
type PolkadotRuntimeEvent = Enum<
  | { type: "System"; value: Anonymize<PalletEvent> }
  | { type: "Scheduler"; value: Anonymize<SchedulerEvent> }
  | { type: "Preimage"; value: Anonymize<PreimageEvent> }
  | { type: "Indices"; value: Anonymize<IndicesEvent> }
  | { type: "Balances"; value: Anonymize<BalancesEvent> }
  | { type: "TransactionPayment"; value: Anonymize<TransactionPaymentEvent> }
  | { type: "Staking"; value: Anonymize<StakingEvent> }
  | { type: "Offences"; value: Anonymize<OffencesEvent> }
  | { type: "Session"; value: Anonymize<SessionEvent> }
  | { type: "Grandpa"; value: Anonymize<GrandpaEvent> }
  | { type: "ImOnline"; value: Anonymize<ImOnlineEvent> }
  | { type: "Treasury"; value: Anonymize<TreasuryEvent> }
  | { type: "ConvictionVoting"; value: Anonymize<ConvictionVotingEvent> }
  | { type: "Referenda"; value: Anonymize<ReferendaEvent> }
  | { type: "Whitelist"; value: Anonymize<WhitelistEvent> }
  | { type: "Claims"; value: Anonymize<PolkadotRuntimeCommonClaimsEvent> }
  | { type: "Vesting"; value: Anonymize<VestingEvent> }
  | { type: "Utility"; value: Anonymize<UtilityEvent> }
  | { type: "Identity"; value: Anonymize<IdentityEvent> }
  | { type: "Proxy"; value: Anonymize<ProxyEvent> }
  | { type: "Multisig"; value: Anonymize<MultisigEvent> }
  | { type: "Bounties"; value: Anonymize<BountiesEvent> }
  | { type: "ChildBounties"; value: Anonymize<ChildBountiesEvent> }
  | {
      type: "ElectionProviderMultiPhase"
      value: Anonymize<ElectionProviderMultiPhaseEvent>
    }
  | { type: "VoterList"; value: Anonymize<BagsListEvent> }
  | { type: "NominationPools"; value: Anonymize<NominationPoolsEvent> }
  | { type: "FastUnstake"; value: Anonymize<FastUnstakeEvent> }
  | {
      type: "ParaInclusion"
      value: Anonymize<PolkadotRuntimeParachainsInclusionEvent>
    }
  | { type: "Paras"; value: Anonymize<PolkadotRuntimeParachainsParasEvent> }
  | { type: "Hrmp"; value: Anonymize<PolkadotRuntimeParachainsHrmpEvent> }
  | {
      type: "ParasDisputes"
      value: Anonymize<PolkadotRuntimeParachainsDisputesEvent>
    }
  | {
      type: "Registrar"
      value: Anonymize<PolkadotRuntimeCommonParasRegistrarEvent>
    }
  | { type: "Slots"; value: Anonymize<PolkadotRuntimeCommonSlotsEvent> }
  | { type: "Auctions"; value: Anonymize<PolkadotRuntimeCommonAuctionsEvent> }
  | { type: "Crowdloan"; value: Anonymize<PolkadotRuntimeCommonCrowdloanEvent> }
  | { type: "XcmPallet"; value: Anonymize<XcmEvent> }
  | { type: "MessageQueue"; value: Anonymize<MessageQueueEvent> }
>

// frame_system,pallet,Event
// 5qmbgbglg3djl
type PalletEvent = Enum<
  | { type: "ExtrinsicSuccess"; value: Anonymize<Iede1ukavoderd> }
  | { type: "ExtrinsicFailed"; value: Anonymize<Iennefu6o2bgdm> }
  | { type: "CodeUpdated"; value: undefined }
  | { type: "NewAccount"; value: Anonymize<Icbccs0ug47ilf> }
  | { type: "KilledAccount"; value: Anonymize<Icbccs0ug47ilf> }
  | { type: "Remarked"; value: Anonymize<Ieob37pbjnvmkj> }
>

// frame_support,dispatch,DispatchClass
// 90bksimft5ia2
type DispatchClass = Enum<
  | { type: "Normal"; value: undefined }
  | { type: "Operational"; value: undefined }
  | { type: "Mandatory"; value: undefined }
>

// frame_support,dispatch,Pays
// ehg04bj71rkd
type DispatchPays = Enum<
  { type: "Yes"; value: undefined } | { type: "No"; value: undefined }
>

// sp_runtime,DispatchError
// edh5jo3t7dgka
type DispatchError = Enum<
  | { type: "Other"; value: undefined }
  | { type: "CannotLookup"; value: undefined }
  | { type: "BadOrigin"; value: undefined }
  | { type: "Module"; value: Anonymize<I9mtpf03dt7lqs> }
  | { type: "ConsumerRemaining"; value: undefined }
  | { type: "NoProviders"; value: undefined }
  | { type: "TooManyConsumers"; value: undefined }
  | { type: "Token"; value: Anonymize<TokenError> }
  | { type: "Arithmetic"; value: Anonymize<ArithmeticError> }
  | { type: "Transactional"; value: Anonymize<TransactionalError> }
  | { type: "Exhausted"; value: undefined }
  | { type: "Corruption"; value: undefined }
  | { type: "Unavailable"; value: undefined }
  | { type: "RootNotAllowed"; value: undefined }
>

// sp_runtime,TokenError
// 5ltp1mv4fr7n7
type TokenError = Enum<
  | { type: "FundsUnavailable"; value: undefined }
  | { type: "OnlyProvider"; value: undefined }
  | { type: "BelowMinimum"; value: undefined }
  | { type: "CannotCreate"; value: undefined }
  | { type: "UnknownAsset"; value: undefined }
  | { type: "Frozen"; value: undefined }
  | { type: "Unsupported"; value: undefined }
  | { type: "CannotCreateHold"; value: undefined }
  | { type: "NotExpendable"; value: undefined }
  | { type: "Blocked"; value: undefined }
>

// sp_arithmetic,ArithmeticError
// 87r8lmtt997st
type ArithmeticError = Enum<
  | { type: "Underflow"; value: undefined }
  | { type: "Overflow"; value: undefined }
  | { type: "DivisionByZero"; value: undefined }
>

// sp_runtime,TransactionalError
// f87qnbuqe30lh
type TransactionalError = Enum<
  | { type: "LimitReached"; value: undefined }
  | { type: "NoLayer"; value: undefined }
>

// pallet_scheduler,pallet,Event
// cvnn3223kutus
type SchedulerEvent = Enum<
  | { type: "Scheduled"; value: Anonymize<I5n4sebgkfr760> }
  | { type: "Canceled"; value: Anonymize<I5n4sebgkfr760> }
  | { type: "Dispatched"; value: Anonymize<Idv8erd9m7jvse> }
  | { type: "CallUnavailable"; value: Anonymize<Ibkv7dijodoblp> }
  | { type: "PeriodicFailed"; value: Anonymize<Ibkv7dijodoblp> }
  | { type: "PermanentlyOverweight"; value: Anonymize<Ibkv7dijodoblp> }
>

// pallet_preimage,pallet,Event
// 302o6h1bqiqgu
type PreimageEvent = Enum<
  | { type: "Noted"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Requested"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Cleared"; value: Anonymize<Id9d48vaes3c53> }
>

// pallet_indices,pallet,Event
// 88qf3i6ugbvsp
type IndicesEvent = Enum<
  | { type: "IndexAssigned"; value: Anonymize<Ia1u3jll6a06ae> }
  | { type: "IndexFreed"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "IndexFrozen"; value: Anonymize<Ia1u3jll6a06ae> }
>

// pallet_balances,pallet,Event
// pa3jfc46ilad
type BalancesEvent = Enum<
  | { type: "Endowed"; value: Anonymize<Icv68aq8841478> }
  | { type: "DustLost"; value: Anonymize<Ic262ibdoec56a> }
  | { type: "Transfer"; value: Anonymize<Iflcfm9b6nlmdd> }
  | { type: "BalanceSet"; value: Anonymize<Ijrsf4mnp3eka> }
  | { type: "Reserved"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Unreserved"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "ReserveRepatriated"; value: Anonymize<Idm5rqp3duosod> }
  | { type: "Deposit"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Withdraw"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Slashed"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Minted"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Burned"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Suspended"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Restored"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Upgraded"; value: Anonymize<I4cbvqmqadhrea> }
  | { type: "Issued"; value: Anonymize<I3qt1hgg4djhgb> }
  | { type: "Rescinded"; value: Anonymize<I3qt1hgg4djhgb> }
  | { type: "Locked"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Unlocked"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Frozen"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "Thawed"; value: Anonymize<Id5fm4p8lj5qgi> }
>

// frame_support,traits,tokens,misc,BalanceStatus
// 7u481jea1442o
type BalanceStatus = Enum<
  { type: "Free"; value: undefined } | { type: "Reserved"; value: undefined }
>

// pallet_transaction_payment,pallet,Event
// cjonl4a47pcm8
type TransactionPaymentEvent = Enum<{
  type: "TransactionFeePaid"
  value: Anonymize<Ier2cke86dqbr2>
}>

// pallet_staking,pallet,pallet,Event
// fclbekcgm4i69
type StakingEvent = Enum<
  | { type: "EraPaid"; value: Anonymize<I1au3fq4n84nv3> }
  | { type: "Rewarded"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "Slashed"; value: Anonymize<Idnak900lt5lm8> }
  | { type: "SlashReported"; value: Anonymize<I27n7lbd66730p> }
  | { type: "OldSlashingReportDiscarded"; value: Anonymize<I2hq50pu2kdjpo> }
  | { type: "StakersElected"; value: undefined }
  | { type: "Bonded"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "Unbonded"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "Withdrawn"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "Kicked"; value: Anonymize<Iau4cgm6ih61cf> }
  | { type: "StakingElectionFailed"; value: undefined }
  | { type: "Chilled"; value: Anonymize<Idl3umm12u5pa> }
  | { type: "PayoutStarted"; value: Anonymize<I6ir616rur362k> }
  | { type: "ValidatorPrefsSet"; value: Anonymize<Ic19as7nbst738> }
  | { type: "SnapshotVotersSizeExceeded"; value: Anonymize<I54umskavgc9du> }
  | { type: "SnapshotTargetsSizeExceeded"; value: Anonymize<I54umskavgc9du> }
  | { type: "ForceEra"; value: Anonymize<I43l31t29k2o0p> }
>

// pallet_staking,Forcing
// bs10onqorvq4b
type StakingForcing = Enum<
  | { type: "NotForcing"; value: undefined }
  | { type: "ForceNew"; value: undefined }
  | { type: "ForceNone"; value: undefined }
  | { type: "ForceAlways"; value: undefined }
>

// pallet_offences,pallet,Event
// 1tac42poi01n8
type OffencesEvent = Enum<{ type: "Offence"; value: Anonymize<I41n4hddrgegvb> }>

// pallet_session,pallet,Event
// 1078dp8vlrjh3
type SessionEvent = Enum<{
  type: "NewSession"
  value: Anonymize<I2hq50pu2kdjpo>
}>

// pallet_grandpa,pallet,Event
// cg9t1ptkdnbi3
type GrandpaEvent = Enum<
  | { type: "NewAuthorities"; value: Anonymize<Ib31jedabim0q7> }
  | { type: "Paused"; value: undefined }
  | { type: "Resumed"; value: undefined }
>

// pallet_im_online,pallet,Event
// 9jqrili6gan6u
type ImOnlineEvent = Enum<
  | { type: "HeartbeatReceived"; value: Anonymize<I93nne97c4i0sr> }
  | { type: "AllGood"; value: undefined }
  | { type: "SomeOffline"; value: Anonymize<I311vp8270bfmr> }
>

// pallet_treasury,pallet,Event
// 3ul3cf3die25m
type TreasuryEvent = Enum<
  | { type: "Proposed"; value: Anonymize<I44hc4lgsn4o1j> }
  | { type: "Spending"; value: Anonymize<I8iksqi3eani0a> }
  | { type: "Awarded"; value: Anonymize<I16enopmju1p0q> }
  | { type: "Rejected"; value: Anonymize<Ifgqhle2413de7> }
  | { type: "Burnt"; value: Anonymize<I43kq8qudg7pq9> }
  | { type: "Rollover"; value: Anonymize<I76riseemre533> }
  | { type: "Deposit"; value: Anonymize<Ie5v6njpckr05b> }
  | { type: "SpendApproved"; value: Anonymize<I38bmcrmh852rk> }
  | { type: "UpdatedInactive"; value: Anonymize<I4hcillge8de5f> }
>

// pallet_conviction_voting,pallet,Event
// 7tae00r2its65
type ConvictionVotingEvent = Enum<
  | { type: "Delegated"; value: Anonymize<Ic5oktqtdlvdvq> }
  | { type: "Undelegated"; value: Anonymize<SS58String> }
>

// pallet_referenda,pallet,Event
// dfraa3b4eu018
type ReferendaEvent = Enum<
  | { type: "Submitted"; value: Anonymize<Idhr9v8mlnjej> }
  | { type: "DecisionDepositPlaced"; value: Anonymize<I62nte77gksm0f> }
  | { type: "DecisionDepositRefunded"; value: Anonymize<I62nte77gksm0f> }
  | { type: "DepositSlashed"; value: Anonymize<Id5fm4p8lj5qgi> }
  | { type: "DecisionStarted"; value: Anonymize<I932allgc83a4a> }
  | { type: "ConfirmStarted"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "ConfirmAborted"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "Confirmed"; value: Anonymize<Ilhp45uime5tp> }
  | { type: "Approved"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "Rejected"; value: Anonymize<Ilhp45uime5tp> }
  | { type: "TimedOut"; value: Anonymize<Ilhp45uime5tp> }
  | { type: "Cancelled"; value: Anonymize<Ilhp45uime5tp> }
  | { type: "Killed"; value: Anonymize<Ilhp45uime5tp> }
  | { type: "SubmissionDepositRefunded"; value: Anonymize<I62nte77gksm0f> }
  | { type: "MetadataSet"; value: Anonymize<I50aq0q2l1cdkr> }
  | { type: "MetadataCleared"; value: Anonymize<I50aq0q2l1cdkr> }
>

// frame_support,traits,preimages,Bounded
// cgde8bg5ldqpa
type PreimagesBounded = Enum<
  | { type: "Legacy"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Inline"; value: Anonymize<Binary> }
  | { type: "Lookup"; value: Anonymize<Ie4qb7tq0r9uel> }
>

// polkadot_runtime,RuntimeCall
// 87qsc0rkcck4h
type PolkadotRuntimeRuntimeCall = Enum<
  | { type: "System"; value: Anonymize<PalletCall> }
  | { type: "Scheduler"; value: Anonymize<SchedulerPalletCall> }
  | { type: "Preimage"; value: Anonymize<PreimagePalletCall> }
  | { type: "Babe"; value: Anonymize<BabePalletCall> }
  | { type: "Timestamp"; value: Anonymize<TimestampPalletCall> }
  | { type: "Indices"; value: Anonymize<IndicesPalletCall> }
  | { type: "Balances"; value: Anonymize<BalancesPalletCall> }
  | { type: "Staking"; value: Anonymize<StakingPalletCall> }
  | { type: "Session"; value: Anonymize<SessionPalletCall> }
  | { type: "Grandpa"; value: Anonymize<GrandpaPalletCall> }
  | { type: "ImOnline"; value: Anonymize<ImOnlinePalletCall> }
  | { type: "Treasury"; value: Anonymize<TreasuryPalletCall> }
  | { type: "ConvictionVoting"; value: Anonymize<ConvictionVotingPalletCall> }
  | { type: "Referenda"; value: Anonymize<ReferendaPalletCall> }
  | { type: "Whitelist"; value: Anonymize<WhitelistPalletCall> }
  | { type: "Claims"; value: Anonymize<PolkadotRuntimeCommonClaimsPalletCall> }
  | { type: "Vesting"; value: Anonymize<VestingPalletCall> }
  | { type: "Utility"; value: Anonymize<UtilityPalletCall> }
  | { type: "Identity"; value: Anonymize<IdentityPalletCall> }
  | { type: "Proxy"; value: Anonymize<ProxyPalletCall> }
  | { type: "Multisig"; value: Anonymize<MultisigPalletCall> }
  | { type: "Bounties"; value: Anonymize<BountiesPalletCall> }
  | { type: "ChildBounties"; value: Anonymize<ChildBountiesPalletCall> }
  | {
      type: "ElectionProviderMultiPhase"
      value: Anonymize<ElectionProviderMultiPhasePalletCall>
    }
  | { type: "VoterList"; value: Anonymize<BagsListPalletCall> }
  | { type: "NominationPools"; value: Anonymize<NominationPoolsPalletCall> }
  | { type: "FastUnstake"; value: Anonymize<FastUnstakePalletCall> }
  | {
      type: "Configuration"
      value: Anonymize<PolkadotRuntimeParachainsConfigurationPalletCall>
    }
  | { type: "ParasShared"; value: Anonymize<undefined> }
  | { type: "ParaInclusion"; value: Anonymize<undefined> }
  | {
      type: "ParaInherent"
      value: Anonymize<PolkadotRuntimeParachainsParasInherentPalletCall>
    }
  | {
      type: "Paras"
      value: Anonymize<PolkadotRuntimeParachainsParasPalletCall>
    }
  | {
      type: "Initializer"
      value: Anonymize<PolkadotRuntimeParachainsInitializerPalletCall>
    }
  | { type: "Hrmp"; value: Anonymize<PolkadotRuntimeParachainsHrmpPalletCall> }
  | {
      type: "ParasDisputes"
      value: Anonymize<PolkadotRuntimeParachainsDisputesPalletCall>
    }
  | {
      type: "ParasSlashing"
      value: Anonymize<PolkadotRuntimeParachainsDisputesSlashingPalletCall>
    }
  | {
      type: "Registrar"
      value: Anonymize<PolkadotRuntimeCommonParasRegistrarPalletCall>
    }
  | { type: "Slots"; value: Anonymize<PolkadotRuntimeCommonSlotsPalletCall> }
  | {
      type: "Auctions"
      value: Anonymize<PolkadotRuntimeCommonAuctionsPalletCall>
    }
  | {
      type: "Crowdloan"
      value: Anonymize<PolkadotRuntimeCommonCrowdloanPalletCall>
    }
  | { type: "XcmPallet"; value: Anonymize<XcmPalletCall> }
  | { type: "MessageQueue"; value: Anonymize<MessageQueuePalletCall> }
>

// frame_system,pallet,Call
// ccjej82b2j3c5
type SystemPalletCall = Enum<
  | { type: "remark"; value: Anonymize<I8ofcg5rbj0g2c> }
  | { type: "set_heap_pages"; value: Anonymize<I4adgbll7gku4i> }
  | { type: "set_code"; value: Anonymize<I6pjjpfvhvcfru> }
  | { type: "set_code_without_checks"; value: Anonymize<I6pjjpfvhvcfru> }
  | { type: "set_storage"; value: Anonymize<I8qrhskdehbu57> }
  | { type: "kill_storage"; value: Anonymize<I39uah9nss64h9> }
  | { type: "kill_prefix"; value: Anonymize<Ik64dknsq7k08> }
  | { type: "remark_with_event"; value: Anonymize<I8ofcg5rbj0g2c> }
>

// pallet_scheduler,pallet,Call
// 1mum455a9gns6
type SchedulerPalletCall = Enum<
  | { type: "schedule"; value: Anonymize<I9rdmmgjk34dr5> }
  | { type: "cancel"; value: Anonymize<I5n4sebgkfr760> }
  | { type: "schedule_named"; value: Anonymize<I5dl90cj1sr16l> }
  | { type: "cancel_named"; value: Anonymize<Idsdstalforb09> }
  | { type: "schedule_after"; value: Anonymize<Ia2eemenoeqgvm> }
  | { type: "schedule_named_after"; value: Anonymize<I19d5ngftia21g> }
>

// pallet_preimage,pallet,Call
// 2vgk5cmoj0b8m
type PreimagePalletCall = Enum<
  | { type: "note_preimage"; value: Anonymize<I82nfqfkd48n10> }
  | { type: "unnote_preimage"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "request_preimage"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "unrequest_preimage"; value: Anonymize<Id9d48vaes3c53> }
>

// pallet_babe,pallet,Call
// 1jeo0dpbkma5g
type BabePalletCall = Enum<
  | { type: "report_equivocation"; value: Anonymize<I7mmbgd20nut80> }
  | { type: "report_equivocation_unsigned"; value: Anonymize<I7mmbgd20nut80> }
  | { type: "plan_config_change"; value: Anonymize<I2dcpbss9027dl> }
>

// sp_consensus_babe,digests,NextConfigDescriptor
// ek17d55ubjjm9
type BabeDigestsNextConfigDescriptor = Enum<{
  type: "V1"
  value: Anonymize<Idkva8q2m9meg0>
}>

// sp_consensus_babe,AllowedSlots
// 3g7a8g60ho721
type BabeAllowedSlots = Enum<
  | { type: "PrimarySlots"; value: undefined }
  | { type: "PrimaryAndSecondaryPlainSlots"; value: undefined }
  | { type: "PrimaryAndSecondaryVRFSlots"; value: undefined }
>

// pallet_timestamp,pallet,Call
// 7d75gqfg6jh9c
type TimestampPalletCall = Enum<{
  type: "set"
  value: Anonymize<Idcr6u6361oad9>
}>

// pallet_indices,pallet,Call
// 4gfcs0af6e39j
type IndicesPalletCall = Enum<
  | { type: "claim"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "transfer"; value: Anonymize<Idge7gk9m5car0> }
  | { type: "free"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "force_transfer"; value: Anonymize<I34pbimt2i69v7> }
  | { type: "freeze"; value: Anonymize<I666bl2fqjkejo> }
>

// sp_runtime,multiaddress,MultiAddress
// 5a3qnpcq081o6
type MultiAddress = Enum<
  | { type: "Id"; value: Anonymize<SS58String> }
  | { type: "Index"; value: Anonymize<number> }
  | { type: "Raw"; value: Anonymize<Binary> }
  | { type: "Address32"; value: Anonymize<Binary> }
  | { type: "Address20"; value: Anonymize<Binary> }
>

// pallet_balances,pallet,Call
// 4hqi6cvv5mjpd
type BalancesPalletCall = Enum<
  | { type: "transfer_allow_death"; value: Anonymize<Ien6q0lasi0m7i> }
  | { type: "set_balance_deprecated"; value: Anonymize<I9ugjiks2ilgiv> }
  | { type: "force_transfer"; value: Anonymize<Icacgruoo9j3r2> }
  | { type: "transfer_keep_alive"; value: Anonymize<Ien6q0lasi0m7i> }
  | { type: "transfer_all"; value: Anonymize<I7dgmo7im9hljo> }
  | { type: "force_unreserve"; value: Anonymize<Iargojp1sv9icj> }
  | { type: "upgrade_accounts"; value: Anonymize<Ibmr18suc9ikh9> }
  | { type: "transfer"; value: Anonymize<Ien6q0lasi0m7i> }
  | { type: "force_set_balance"; value: Anonymize<Ie0io91hk7pejj> }
>

// pallet_staking,pallet,pallet,Call
// 4gpetiocnudbl
type StakingPalletCall = Enum<
  | { type: "bond"; value: Anonymize<I9f7ms9viml8of> }
  | { type: "bond_extra"; value: Anonymize<I564va64vtidbq> }
  | { type: "unbond"; value: Anonymize<Ie5v6njpckr05b> }
  | { type: "withdraw_unbonded"; value: Anonymize<I328av3j0bgmjb> }
  | { type: "validate"; value: Anonymize<I4tuqm9ato907i> }
  | { type: "nominate"; value: Anonymize<I5n9nf1mhg26dt> }
  | { type: "chill"; value: undefined }
  | { type: "set_payee"; value: Anonymize<Ida5hg7geddnc7> }
  | { type: "set_controller"; value: undefined }
  | { type: "set_validator_count"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "increase_validator_count"; value: Anonymize<Ifhs60omlhvt3> }
  | { type: "scale_validator_count"; value: Anonymize<If34udpd5e57vi> }
  | { type: "force_no_eras"; value: undefined }
  | { type: "force_new_era"; value: undefined }
  | { type: "set_invulnerables"; value: Anonymize<I39t01nnod9109> }
  | { type: "force_unstake"; value: Anonymize<Ie5vbnd9198quk> }
  | { type: "force_new_era_always"; value: undefined }
  | { type: "cancel_deferred_slash"; value: Anonymize<I3h6murn8bd4v5> }
  | { type: "payout_stakers"; value: Anonymize<I6k6jf8ncesuu3> }
  | { type: "rebond"; value: Anonymize<Ie5v6njpckr05b> }
  | { type: "reap_stash"; value: Anonymize<Ie5vbnd9198quk> }
  | { type: "kick"; value: Anonymize<I2j5nkj9u94qun> }
  | { type: "set_staking_configs"; value: Anonymize<I9nfsuc9smbmvv> }
  | { type: "chill_other"; value: Anonymize<I3v6ks33uluhnj> }
  | { type: "force_apply_min_commission"; value: Anonymize<I5ont0141q9ss5> }
  | { type: "set_min_commission"; value: Anonymize<I3vh014cqgmrfd> }
>

// pallet_staking,RewardDestination
// 4peoofcn0loqr
type StakingRewardDestination = Enum<
  | { type: "Staked"; value: undefined }
  | { type: "Stash"; value: undefined }
  | { type: "Controller"; value: undefined }
  | { type: "Account"; value: Anonymize<SS58String> }
  | { type: "None"; value: undefined }
>

// pallet_staking,pallet,pallet,ConfigOp
// fms5l9j358vie
type StakingPalletConfigOp = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<bigint> }
  | { type: "Remove"; value: undefined }
>

// pallet_staking,pallet,pallet,ConfigOp
// bb454pgf9ofrq
type StakingPalletConfigOp1 = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<number> }
  | { type: "Remove"; value: undefined }
>

// pallet_session,pallet,Call
// ekmvcec7emmbn
type SessionPalletCall = Enum<
  | { type: "set_keys"; value: Anonymize<Ifrg97o021lj9i> }
  | { type: "purge_keys"; value: undefined }
>

// pallet_grandpa,pallet,Call
// 5u9ggmn8umfqm
type GrandpaPalletCall = Enum<
  | { type: "report_equivocation"; value: Anonymize<I4kjek1q6rj24q> }
  | { type: "report_equivocation_unsigned"; value: Anonymize<I4kjek1q6rj24q> }
  | { type: "note_stalled"; value: Anonymize<I2hviml3snvhhn> }
>

// sp_consensus_grandpa,Equivocation
// brvqfk00lp42n
type GrandpaEquivocation = Enum<
  | { type: "Prevote"; value: Anonymize<Igd938ojs7e2l> }
  | { type: "Precommit"; value: Anonymize<Igd938ojs7e2l> }
>

// pallet_im_online,pallet,Call
// 7ubsrnb7nbvds
type ImOnlinePalletCall = Enum<{
  type: "heartbeat"
  value: Anonymize<Ifgbq9oil78ogk>
}>

// pallet_treasury,pallet,Call
// conpkk6eh7ho7
type TreasuryPalletCall = Enum<
  | { type: "propose_spend"; value: Anonymize<I5c883qnnqciv8> }
  | { type: "reject_proposal"; value: Anonymize<Icm9m0qeemu66d> }
  | { type: "approve_proposal"; value: Anonymize<Icm9m0qeemu66d> }
  | { type: "spend"; value: Anonymize<Idpn74s0i9cdvp> }
  | { type: "remove_approval"; value: Anonymize<Icm9m0qeemu66d> }
>

// pallet_conviction_voting,pallet,Call
// 7t0ikq66tic1d
type ConvictionVotingPalletCall = Enum<
  | { type: "vote"; value: Anonymize<Idnsr2pndm36h0> }
  | { type: "delegate"; value: Anonymize<Id7ut33dljf52c> }
  | { type: "undelegate"; value: Anonymize<I8steo882k7qns> }
  | { type: "unlock"; value: Anonymize<I1vc8h4t228bot> }
  | { type: "remove_vote"; value: Anonymize<I5f178ab6b89t3> }
  | { type: "remove_other_vote"; value: Anonymize<I5fak1u82ohqtm> }
>

// pallet_conviction_voting,vote,AccountVote
// cee77qkk3c81t
type ConvictionVotingVoteAccountVote = Enum<
  | { type: "Standard"; value: Anonymize<Ib024p97ls1cla> }
  | { type: "Split"; value: Anonymize<I5pi71t9bosoiv> }
  | { type: "SplitAbstain"; value: Anonymize<I89irppcaqmf1i> }
>

// pallet_conviction_voting,conviction,Conviction
// 85ca14rjo42j5
type VotingConviction = Enum<
  | { type: "None"; value: undefined }
  | { type: "Locked1x"; value: undefined }
  | { type: "Locked2x"; value: undefined }
  | { type: "Locked3x"; value: undefined }
  | { type: "Locked4x"; value: undefined }
  | { type: "Locked5x"; value: undefined }
  | { type: "Locked6x"; value: undefined }
>

// pallet_referenda,pallet,Call
// 76ia9hi2mtki0
type ReferendaPalletCall = Enum<
  | { type: "submit"; value: Anonymize<I86t0cca08a1h1> }
  | { type: "place_decision_deposit"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "refund_decision_deposit"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "cancel"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "kill"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "nudge_referendum"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "one_fewer_deciding"; value: Anonymize<Icbio0e1f0034b> }
  | { type: "refund_submission_deposit"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "set_metadata"; value: Anonymize<Ifml0k0sf0mu2g> }
>

// polkadot_runtime,OriginCaller
// 1fed1h86s1adc
type PolkadotRuntimeOriginCaller = Enum<
  | { type: "system"; value: Anonymize<DispatchRawOrigin> }
  | {
      type: "Origins"
      value: Anonymize<PolkadotRuntimeGovernanceOriginsPalletCustomOriginsOrigin>
    }
  | {
      type: "ParachainsOrigin"
      value: Anonymize<PolkadotRuntimeParachainsOriginPalletOrigin>
    }
  | { type: "XcmPallet"; value: Anonymize<XcmPalletOrigin> }
  | { type: "Void"; value: Anonymize<undefined> }
>

// frame_support,dispatch,RawOrigin
// a3gvv195g4jot
type DispatchRawOrigin = Enum<
  | { type: "Root"; value: undefined }
  | { type: "Signed"; value: Anonymize<SS58String> }
  | { type: "None"; value: undefined }
>

// polkadot_runtime,governance,origins,pallet_custom_origins,Origin
// 86j1nib528oqi
type GovernanceOrigin = Enum<
  | { type: "StakingAdmin"; value: undefined }
  | { type: "Treasurer"; value: undefined }
  | { type: "FellowshipAdmin"; value: undefined }
  | { type: "GeneralAdmin"; value: undefined }
  | { type: "AuctionAdmin"; value: undefined }
  | { type: "LeaseAdmin"; value: undefined }
  | { type: "ReferendumCanceller"; value: undefined }
  | { type: "ReferendumKiller"; value: undefined }
  | { type: "SmallTipper"; value: undefined }
  | { type: "BigTipper"; value: undefined }
  | { type: "SmallSpender"; value: undefined }
  | { type: "MediumSpender"; value: undefined }
  | { type: "BigSpender"; value: undefined }
  | { type: "WhitelistedCaller"; value: undefined }
>

// polkadot_runtime_parachains,origin,pallet,Origin
// 49em457ob9ou0
type ParachainsOrigin = Enum<{
  type: "Parachain"
  value: Anonymize<number>
}>

// pallet_xcm,pallet,Origin
// 30af8rr48c0nq
type XcmPalletOrigin = Enum<
  | { type: "Xcm"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Response"; value: Anonymize<I43cmiele6sevi> }
>

// xcm,v3,junctions,Junctions
// 2vq47ejc4o36c
type XcmV3Junctions = Enum<
  | { type: "Here"; value: undefined }
  | { type: "X1"; value: Anonymize<XcmV3Junction> }
  | { type: "X2"; value: Anonymize<I3n3hua43f17d> }
  | { type: "X3"; value: Anonymize<I9tnbt1qa8ct9f> }
  | { type: "X4"; value: Anonymize<Ifjp4mk1rg8qmc> }
  | { type: "X5"; value: Anonymize<I3e9mll436gmnq> }
  | { type: "X6"; value: Anonymize<Ibigks25jpj2f1> }
  | { type: "X7"; value: Anonymize<I9pffrtiap54jf> }
  | { type: "X8"; value: Anonymize<I5fuv9qoo4lgrf> }
>

// xcm,v3,junction,Junction
// aqrmqn3umgltq
type XcmV3Junction = Enum<
  | { type: "Parachain"; value: Anonymize<number> }
  | { type: "AccountId32"; value: Anonymize<I6i61tqvseg382> }
  | { type: "AccountIndex64"; value: Anonymize<Iufr71iing6fs> }
  | { type: "AccountKey20"; value: Anonymize<I192a40lbldnho> }
  | { type: "PalletInstance"; value: Anonymize<number> }
  | { type: "GeneralIndex"; value: Anonymize<bigint> }
  | { type: "GeneralKey"; value: Anonymize<Ic1rqnlu0a9i3k> }
  | { type: "OnlyChild"; value: undefined }
  | { type: "Plurality"; value: Anonymize<Ibb5u0oo9gtas> }
  | { type: "GlobalConsensus"; value: Anonymize<XcmV3JunctionNetworkId> }
>

// xcm,v3,junction,NetworkId
// 4k01tahcim329
type XcmV3JunctionNetworkId = Enum<
  | { type: "ByGenesis"; value: Anonymize<Binary> }
  | { type: "ByFork"; value: Anonymize<I83hg7ig5d74ok> }
  | { type: "Polkadot"; value: undefined }
  | { type: "Kusama"; value: undefined }
  | { type: "Westend"; value: undefined }
  | { type: "Rococo"; value: undefined }
  | { type: "Wococo"; value: undefined }
  | { type: "Ethereum"; value: Anonymize<I623eo8t3jrbeo> }
  | { type: "BitcoinCore"; value: undefined }
  | { type: "BitcoinCash"; value: undefined }
>

// xcm,v3,junction,BodyId
// bd6859lkk2107
type XcmV3JunctionBodyId = Enum<
  | { type: "Unit"; value: undefined }
  | { type: "Moniker"; value: Anonymize<Binary> }
  | { type: "Index"; value: Anonymize<number> }
  | { type: "Executive"; value: undefined }
  | { type: "Technical"; value: undefined }
  | { type: "Legislative"; value: undefined }
  | { type: "Judicial"; value: undefined }
  | { type: "Defense"; value: undefined }
  | { type: "Administration"; value: undefined }
  | { type: "Treasury"; value: undefined }
>

// xcm,v3,junction,BodyPart
// f5frjbmqcgt5k
type XcmV3JunctionBodyPart = Enum<
  | { type: "Voice"; value: undefined }
  | { type: "Members"; value: Anonymize<Iafscmv8tjf0ou> }
  | { type: "Fraction"; value: Anonymize<Idif02efq16j92> }
  | { type: "AtLeastProportion"; value: Anonymize<Idif02efq16j92> }
  | { type: "MoreThanProportion"; value: Anonymize<Idif02efq16j92> }
>

// frame_support,traits,schedule,DispatchTime
// e3otks9vj8a3b
type TraitsScheduleDispatchTime = Enum<
  | { type: "At"; value: Anonymize<number> }
  | { type: "After"; value: Anonymize<number> }
>

// pallet_whitelist,pallet,Call
// ahaflmpl38som
type WhitelistPalletCall = Enum<
  | { type: "whitelist_call"; value: Anonymize<I8413rb6im3iko> }
  | { type: "remove_whitelisted_call"; value: Anonymize<I8413rb6im3iko> }
  | { type: "dispatch_whitelisted_call"; value: Anonymize<Id3s9pakjjc472> }
  | {
      type: "dispatch_whitelisted_call_with_preimage"
      value: Anonymize<Icrc0k9rhur86a>
    }
>

// polkadot_runtime_common,claims,pallet,Call
// d0dj18ct09hlp
type ClaimsPalletCall = Enum<
  | { type: "claim"; value: Anonymize<I1u3s4gbjnre15> }
  | { type: "mint_claim"; value: Anonymize<I20qiajmn4c5d4> }
  | { type: "claim_attest"; value: Anonymize<Ie3aplba76d794> }
  | { type: "attest"; value: Anonymize<I1ntko0oih7v1a> }
  | { type: "move_claim"; value: Anonymize<I193pigt6gtjff> }
>

// polkadot_runtime_common,claims,StatementKind
// 9lvi13skegcil
type ClaimsStatementKind = Enum<
  { type: "Regular"; value: undefined } | { type: "Saft"; value: undefined }
>

// pallet_vesting,pallet,Call
// 4kol6ak3n4pb6
type VestingPalletCall = Enum<
  | { type: "vest"; value: undefined }
  | { type: "vest_other"; value: Anonymize<I29er5j74l8bu> }
  | { type: "vested_transfer"; value: Anonymize<I9l9kkok4o3ekh> }
  | { type: "force_vested_transfer"; value: Anonymize<I50ve0bbda0j1r> }
  | { type: "merge_schedules"; value: Anonymize<Ict9ivhr2c5hv0> }
>

// pallet_utility,pallet,Call
// 8e2cmllth3kf8
type UtilityPalletCall = Enum<
  | { type: "batch"; value: Anonymize<I5nt83bjbs8adq> }
  | { type: "as_derivative"; value: Anonymize<I5dd5n6i2aokg9> }
  | { type: "batch_all"; value: Anonymize<I5nt83bjbs8adq> }
  | { type: "dispatch_as"; value: Anonymize<I184i2p367jir3> }
  | { type: "force_batch"; value: Anonymize<I5nt83bjbs8adq> }
  | { type: "with_weight"; value: Anonymize<I9otsil0lbha0v> }
>

// pallet_identity,pallet,Call
// ciintj40nctsg
type IdentityPalletCall = Enum<
  | { type: "add_registrar"; value: Anonymize<Ibsu2pfvipmui6> }
  | { type: "set_identity"; value: Anonymize<I621gpns74tp1f> }
  | { type: "set_subs"; value: Anonymize<I5100vdjbepcoj> }
  | { type: "clear_identity"; value: undefined }
  | { type: "request_judgement"; value: Anonymize<I9l2s4klu0831o> }
  | { type: "cancel_request"; value: Anonymize<I2ctrt5nqb8o7c> }
  | { type: "set_fee"; value: Anonymize<I711qahikocb1c> }
  | { type: "set_account_id"; value: Anonymize<Idge7gk9m5car0> }
  | { type: "set_fields"; value: Anonymize<Id6gojh30v9ib2> }
  | { type: "provide_judgement"; value: Anonymize<I2g5s5rvm0mfuf> }
  | { type: "kill_identity"; value: Anonymize<I29er5j74l8bu> }
  | { type: "add_sub"; value: Anonymize<Iclf5v4qsadc12> }
  | { type: "rename_sub"; value: Anonymize<Iclf5v4qsadc12> }
  | { type: "remove_sub"; value: Anonymize<Ifcc5t6ed1elfd> }
  | { type: "quit_sub"; value: undefined }
>

// pallet_identity,types,Data
// 629bfqn3u6tle
type IdentityTypesData = Enum<
  | { type: "None"; value: undefined }
  | { type: "Raw0"; value: Anonymize<Binary> }
  | { type: "Raw1"; value: Anonymize<Binary> }
  | { type: "Raw2"; value: Anonymize<Binary> }
  | { type: "Raw3"; value: Anonymize<Binary> }
  | { type: "Raw4"; value: Anonymize<Binary> }
  | { type: "Raw5"; value: Anonymize<Binary> }
  | { type: "Raw6"; value: Anonymize<Binary> }
  | { type: "Raw7"; value: Anonymize<Binary> }
  | { type: "Raw8"; value: Anonymize<Binary> }
  | { type: "Raw9"; value: Anonymize<Binary> }
  | { type: "Raw10"; value: Anonymize<Binary> }
  | { type: "Raw11"; value: Anonymize<Binary> }
  | { type: "Raw12"; value: Anonymize<Binary> }
  | { type: "Raw13"; value: Anonymize<Binary> }
  | { type: "Raw14"; value: Anonymize<Binary> }
  | { type: "Raw15"; value: Anonymize<Binary> }
  | { type: "Raw16"; value: Anonymize<Binary> }
  | { type: "Raw17"; value: Anonymize<Binary> }
  | { type: "Raw18"; value: Anonymize<Binary> }
  | { type: "Raw19"; value: Anonymize<Binary> }
  | { type: "Raw20"; value: Anonymize<Binary> }
  | { type: "Raw21"; value: Anonymize<Binary> }
  | { type: "Raw22"; value: Anonymize<Binary> }
  | { type: "Raw23"; value: Anonymize<Binary> }
  | { type: "Raw24"; value: Anonymize<Binary> }
  | { type: "Raw25"; value: Anonymize<Binary> }
  | { type: "Raw26"; value: Anonymize<Binary> }
  | { type: "Raw27"; value: Anonymize<Binary> }
  | { type: "Raw28"; value: Anonymize<Binary> }
  | { type: "Raw29"; value: Anonymize<Binary> }
  | { type: "Raw30"; value: Anonymize<Binary> }
  | { type: "Raw31"; value: Anonymize<Binary> }
  | { type: "Raw32"; value: Anonymize<Binary> }
  | { type: "BlakeTwo256"; value: Anonymize<Binary> }
  | { type: "Sha256"; value: Anonymize<Binary> }
  | { type: "Keccak256"; value: Anonymize<Binary> }
  | { type: "ShaThree256"; value: Anonymize<Binary> }
>

// pallet_identity,types,IdentityField
// apijri6pqtqte
type IdentityField = Enum<
  | { type: "Display"; value: undefined }
  | { type: "Legal"; value: undefined }
  | { type: "Web"; value: undefined }
  | { type: "Riot"; value: undefined }
  | { type: "Email"; value: undefined }
  | { type: "PgpFingerprint"; value: undefined }
  | { type: "Image"; value: undefined }
  | { type: "Twitter"; value: undefined }
>

// pallet_identity,types,Judgement
// 7ujvudkvg12so
type IdentityJudgement = Enum<
  | { type: "Unknown"; value: undefined }
  | { type: "FeePaid"; value: Anonymize<bigint> }
  | { type: "Reasonable"; value: undefined }
  | { type: "KnownGood"; value: undefined }
  | { type: "OutOfDate"; value: undefined }
  | { type: "LowQuality"; value: undefined }
  | { type: "Erroneous"; value: undefined }
>

// pallet_proxy,pallet,Call
// 408jh0aa8oolr
type ProxyPalletCall = Enum<
  | { type: "proxy"; value: Anonymize<I5qk1jhgai8p1i> }
  | { type: "add_proxy"; value: Anonymize<Iaaog12m0bl04j> }
  | { type: "remove_proxy"; value: Anonymize<Iaaog12m0bl04j> }
  | { type: "remove_proxies"; value: undefined }
  | { type: "create_pure"; value: Anonymize<I6l2ag419uso4i> }
  | { type: "kill_pure"; value: Anonymize<I7304brn0jssvr> }
  | { type: "announce"; value: Anonymize<Id3bpmvju2iqi5> }
  | { type: "remove_announcement"; value: Anonymize<Id3bpmvju2iqi5> }
  | { type: "reject_announcement"; value: Anonymize<Ietdab69eu3c4e> }
  | { type: "proxy_announced"; value: Anonymize<Ickdcoc9hvcbmi> }
>

// polkadot_runtime,ProxyType
// 3tnqcv58l4e62
type ProxyType = Enum<
  | { type: "Any"; value: undefined }
  | { type: "NonTransfer"; value: undefined }
  | { type: "Governance"; value: undefined }
  | { type: "Staking"; value: undefined }
  | { type: "IdentityJudgement"; value: undefined }
  | { type: "CancelProxy"; value: undefined }
  | { type: "Auction"; value: undefined }
  | { type: "NominationPools"; value: undefined }
>

// pallet_multisig,pallet,Call
// 45lq3lvbnfa8h
type MultisigPalletCall = Enum<
  | { type: "as_multi_threshold_1"; value: Anonymize<Ifh15js2h1oacm> }
  | { type: "as_multi"; value: Anonymize<Iea90e94llgau7> }
  | { type: "approve_as_multi"; value: Anonymize<I349bg0i7n8ohu> }
  | { type: "cancel_as_multi"; value: Anonymize<I8plicv234mqe5> }
>

// pallet_bounties,pallet,Call
// id6a5f1ss4bc
type BountiesPalletCall = Enum<
  | { type: "propose_bounty"; value: Anonymize<I2a839vbf5817q> }
  | { type: "approve_bounty"; value: Anonymize<Ia9p5bg6p18r0i> }
  | { type: "propose_curator"; value: Anonymize<I86gbm3avnuhcj> }
  | { type: "unassign_curator"; value: Anonymize<Ia9p5bg6p18r0i> }
  | { type: "accept_curator"; value: Anonymize<Ia9p5bg6p18r0i> }
  | { type: "award_bounty"; value: Anonymize<I9khudebied2et> }
  | { type: "claim_bounty"; value: Anonymize<Ia9p5bg6p18r0i> }
  | { type: "close_bounty"; value: Anonymize<Ia9p5bg6p18r0i> }
  | { type: "extend_bounty_expiry"; value: Anonymize<I90n6nnkpdahrh> }
>

// pallet_child_bounties,pallet,Call
// 9rps5u7cv97of
type ChildBountiesPalletCall = Enum<
  | { type: "add_child_bounty"; value: Anonymize<I8mk5kjgn02hi8> }
  | { type: "propose_curator"; value: Anonymize<I113qogfj9ii7a> }
  | { type: "accept_curator"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "unassign_curator"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "award_child_bounty"; value: Anonymize<I6okbrc1o6b331> }
  | { type: "claim_child_bounty"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "close_child_bounty"; value: Anonymize<I2gr10p66od9ch> }
>

// pallet_election_provider_multi_phase,pallet,Call
// 15soeogelbbbh
type ElectionProviderMultiPhasePalletCall = Enum<
  | { type: "submit_unsigned"; value: Anonymize<I31k9f0jol8ko4> }
  | { type: "set_minimum_untrusted_score"; value: Anonymize<I80q14um2s2ckg> }
  | { type: "set_emergency_election_result"; value: Anonymize<I5qs1t1erfi7u8> }
  | { type: "submit"; value: Anonymize<I9et13knvdvgpb> }
  | { type: "governance_fallback"; value: Anonymize<Ifsme8miqq9006> }
>

// pallet_bags_list,pallet,Call
// 613rol2spf5hd
type BagsListPalletCall = Enum<
  | { type: "rebag"; value: Anonymize<Iqk00vc9d6173> }
  | { type: "put_in_front_of"; value: Anonymize<Idg844jjtqnc9b> }
  | { type: "put_in_front_of_other"; value: Anonymize<Ic87kbtabpr82b> }
>

// pallet_nomination_pools,pallet,Call
// 77u6cjli3die8
type NominationPoolsPalletCall = Enum<
  | { type: "join"; value: Anonymize<Ieg1oc56mamrl5> }
  | { type: "bond_extra"; value: Anonymize<Ifi2b6p41bfb97> }
  | { type: "claim_payout"; value: undefined }
  | { type: "unbond"; value: Anonymize<Itveli0chegtk> }
  | { type: "pool_withdraw_unbonded"; value: Anonymize<I36uoc8t9liv80> }
  | { type: "withdraw_unbonded"; value: Anonymize<I1u21ookp1djj3> }
  | { type: "create"; value: Anonymize<If5k9orpn9fi43> }
  | { type: "create_with_pool_id"; value: Anonymize<I1hlpf8ergrg8k> }
  | { type: "nominate"; value: Anonymize<I47a2tsd2o2b1c> }
  | { type: "set_state"; value: Anonymize<Ibat0jog71khv5> }
  | { type: "set_metadata"; value: Anonymize<I4ihj26hl75e5p> }
  | { type: "set_configs"; value: Anonymize<I2rqmn40aam5hg> }
  | { type: "update_roles"; value: Anonymize<I3cvu4kn8n81uv> }
  | { type: "chill"; value: Anonymize<I931cottvong90> }
  | { type: "bond_extra_other"; value: Anonymize<I6l7t90ftdbsr6> }
  | { type: "set_claim_permission"; value: Anonymize<Icbgkt7i4ps8kc> }
  | { type: "claim_payout_other"; value: Anonymize<I40s11r8nagn2g> }
  | { type: "set_commission"; value: Anonymize<I6bjj87fr5g9nl> }
  | { type: "set_commission_max"; value: Anonymize<I8cbluptqo8kbp> }
  | { type: "set_commission_change_rate"; value: Anonymize<I81cc4plffa1dm> }
  | { type: "claim_commission"; value: Anonymize<I931cottvong90> }
>

// pallet_nomination_pools,BondExtra
// 2bvq1blgrln1s
type NominationPoolsBondExtra = Enum<
  | { type: "FreeBalance"; value: Anonymize<bigint> }
  | { type: "Rewards"; value: undefined }
>

// pallet_nomination_pools,PoolState
// 22g1a3o3q475f
type NominationPoolsPoolState = Enum<
  | { type: "Open"; value: undefined }
  | { type: "Blocked"; value: undefined }
  | { type: "Destroying"; value: undefined }
>

// pallet_nomination_pools,ConfigOp
// 5tbcfetjk0h9h
type NominationPoolsConfigOp = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<SS58String> }
  | { type: "Remove"; value: undefined }
>

// pallet_nomination_pools,ClaimPermission
// 8g50cqebfncn4
type NominationPoolsClaimPermission = Enum<
  | { type: "Permissioned"; value: undefined }
  | { type: "PermissionlessCompound"; value: undefined }
  | { type: "PermissionlessWithdraw"; value: undefined }
  | { type: "PermissionlessAll"; value: undefined }
>

// pallet_fast_unstake,pallet,Call
// 44snhj1gahvrd
type FastUnstakePalletCall = Enum<
  | { type: "register_fast_unstake"; value: undefined }
  | { type: "deregister"; value: undefined }
  | { type: "control"; value: Anonymize<I9j0ul7nh7b8jv> }
>

// polkadot_runtime_parachains,configuration,pallet,Call
// f8hb8migh37h9
type ParachainsConfigurationPalletCall = Enum<
  | {
      type: "set_validation_upgrade_cooldown"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_validation_upgrade_delay"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_code_retention_period"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_code_size"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_pov_size"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_head_data_size"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_on_demand_cores"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_on_demand_retries"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_group_rotation_frequency"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_paras_availability_period"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_scheduling_lookahead"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_validators_per_core"; value: Anonymize<Id581arok0b1nj> }
  | { type: "set_max_validators"; value: Anonymize<Id581arok0b1nj> }
  | { type: "set_dispute_period"; value: Anonymize<I3vh014cqgmrfd> }
  | {
      type: "set_dispute_post_conclusion_acceptance_period"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_no_show_slots"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_n_delay_tranches"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_zeroth_delay_tranche_width"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_needed_approvals"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_relay_vrf_modulo_samples"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_upward_queue_count"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_upward_queue_size"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_downward_message_size"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_max_upward_message_size"; value: Anonymize<I3vh014cqgmrfd> }
  | {
      type: "set_max_upward_message_num_per_candidate"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_hrmp_open_request_ttl"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_hrmp_sender_deposit"; value: Anonymize<I9jsikd1ghmc7l> }
  | { type: "set_hrmp_recipient_deposit"; value: Anonymize<I9jsikd1ghmc7l> }
  | { type: "set_hrmp_channel_max_capacity"; value: Anonymize<I3vh014cqgmrfd> }
  | {
      type: "set_hrmp_channel_max_total_size"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | {
      type: "set_hrmp_max_parachain_inbound_channels"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | {
      type: "set_hrmp_channel_max_message_size"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | {
      type: "set_hrmp_max_parachain_outbound_channels"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | {
      type: "set_hrmp_max_message_num_per_candidate"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_pvf_voting_ttl"; value: Anonymize<I3vh014cqgmrfd> }
  | {
      type: "set_minimum_validation_upgrade_delay"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_bypass_consistency_check"; value: Anonymize<I2f6mha3v4ooda> }
  | { type: "set_async_backing_params"; value: Anonymize<Iasqjdhasi408s> }
  | { type: "set_executor_params"; value: Anonymize<Iehb5cb6rp4k2p> }
  | { type: "set_on_demand_base_fee"; value: Anonymize<I9jsikd1ghmc7l> }
  | { type: "set_on_demand_fee_variability"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_on_demand_queue_max_size"; value: Anonymize<I3vh014cqgmrfd> }
  | {
      type: "set_on_demand_target_queue_utilization"
      value: Anonymize<I3vh014cqgmrfd>
    }
  | { type: "set_on_demand_ttl"; value: Anonymize<I3vh014cqgmrfd> }
  | { type: "set_minimum_backing_votes"; value: Anonymize<I3vh014cqgmrfd> }
>

// polkadot_primitives,v5,executor_params,ExecutorParam
// 2s1qfdh76bati
type PolkadotPrimitivesV5ExecutorParam = Enum<
  | { type: "MaxMemoryPages"; value: Anonymize<number> }
  | { type: "StackLogicalMax"; value: Anonymize<number> }
  | { type: "StackNativeMax"; value: Anonymize<number> }
  | { type: "PrecheckingMaxMemory"; value: Anonymize<bigint> }
  | { type: "PvfPrepTimeout"; value: Anonymize<Iekilhq74ak677> }
  | { type: "PvfExecTimeout"; value: Anonymize<I3fsjjoj6u1h98> }
  | { type: "WasmExtBulkMemory"; value: undefined }
>

// polkadot_primitives,v5,PvfPrepTimeoutKind
// 1p5n9bbuf71e9
type PolkadotPrimitivesV5PvfPrepTimeoutKind = Enum<
  { type: "Precheck"; value: undefined } | { type: "Lenient"; value: undefined }
>

// polkadot_primitives,v5,PvfExecTimeoutKind
// 4k4r9im11cdan
type PolkadotPrimitivesV5PvfExecTimeoutKind = Enum<
  { type: "Backing"; value: undefined } | { type: "Approval"; value: undefined }
>

// polkadot_runtime_parachains,paras_inherent,pallet,Call
// din60jmik27o9
type ParachainsParasInherentPalletCall = Enum<{
  type: "enter"
  value: Anonymize<I6uj8ujct0o4v7>
}>

// polkadot_primitives,v5,ValidityAttestation
// fqkhvelo2q77o
type PolkadotPrimitivesV5ValidityAttestation = Enum<
  | { type: "Implicit"; value: Anonymize<Binary> }
  | { type: "Explicit"; value: Anonymize<Binary> }
>

// polkadot_primitives,v5,DisputeStatement
// b7nns1qbu48af
type PolkadotPrimitivesV5DisputeStatement = Enum<
  | {
      type: "Valid"
      value: Anonymize<PolkadotPrimitivesV5ValidDisputeStatementKind>
    }
  | {
      type: "Invalid"
      value: Anonymize<PolkadotPrimitivesV5InvalidDisputeStatementKind>
    }
>

// polkadot_primitives,v5,ValidDisputeStatementKind
// e33c1balm2hk9
type PolkadotPrimitivesV5ValidDisputeStatementKind = Enum<
  | { type: "Explicit"; value: undefined }
  | { type: "BackingSeconded"; value: Anonymize<Binary> }
  | { type: "BackingValid"; value: Anonymize<Binary> }
  | { type: "ApprovalChecking"; value: undefined }
>

// polkadot_primitives,v5,InvalidDisputeStatementKind
// f9rpgkuafvsb4
type PolkadotPrimitivesV5InvalidDisputeStatementKind = Enum<{
  type: "Explicit"
  value: undefined
}>

// polkadot_runtime_parachains,paras,pallet,Call
// e2dden5k4kk7t
type ParachainsParasPalletCall = Enum<
  | { type: "force_set_current_code"; value: Anonymize<I1k3urvkqqshbc> }
  | { type: "force_set_current_head"; value: Anonymize<I2ff0ffsh15vej> }
  | { type: "force_schedule_code_upgrade"; value: Anonymize<I1orfg86bkg123> }
  | { type: "force_note_new_head"; value: Anonymize<I2ff0ffsh15vej> }
  | { type: "force_queue_action"; value: Anonymize<Iaus4cb3drhu9q> }
  | { type: "add_trusted_validation_code"; value: Anonymize<Ivnsat10lv9d6> }
  | { type: "poke_unused_validation_code"; value: Anonymize<Ifqm1da2k7es4d> }
  | { type: "include_pvf_check_statement"; value: Anonymize<I4aouqiv2fh67c> }
  | { type: "force_set_most_recent_context"; value: Anonymize<I9tmok5kceg2bg> }
>

// polkadot_runtime_parachains,initializer,pallet,Call
// eggtnkc96vvt7
type ParachainsInitializerPalletCall = Enum<{
  type: "force_approve"
  value: Anonymize<I85icj2qbjeqbe>
}>

// polkadot_runtime_parachains,hrmp,pallet,Call
// bl5jgc3bginhv
type ParachainsHrmpPalletCall = Enum<
  | { type: "hrmp_init_open_channel"; value: Anonymize<Ibuhbp68e6tkct> }
  | { type: "hrmp_accept_open_channel"; value: Anonymize<Idrevppfiubhve> }
  | { type: "hrmp_close_channel"; value: Anonymize<I9s2h36kr71vk9> }
  | { type: "force_clean_hrmp"; value: Anonymize<I9mtfn9g2bnpvs> }
  | { type: "force_process_hrmp_open"; value: Anonymize<Id1baei7m8gkhk> }
  | { type: "force_process_hrmp_close"; value: Anonymize<Id1baei7m8gkhk> }
  | { type: "hrmp_cancel_open_request"; value: Anonymize<I96ftepqm4vs7m> }
  | { type: "force_open_hrmp_channel"; value: Anonymize<Ic3430470j4mbv> }
>

// polkadot_runtime_parachains,disputes,pallet,Call
// fkh1ep7g9h3rv
type ParachainsDisputesPalletCall = Enum<{
  type: "force_unfreeze"
  value: undefined
}>

// polkadot_runtime_parachains,disputes,slashing,pallet,Call
// 3jj054kp2bjol
type ParachainsDisputesSlashingPalletCall = Enum<{
  type: "report_dispute_lost_unsigned"
  value: Anonymize<I1ur1874hp9ar5>
}>

// polkadot_primitives,v5,slashing,SlashingOffenceKind
// 8jjr2rgj6aa2v
type PolkadotPrimitivesV5SlashingSlashingOffenceKind = Enum<
  | { type: "ForInvalid"; value: undefined }
  | { type: "AgainstValid"; value: undefined }
>

// polkadot_runtime_common,paras_registrar,pallet,Call
// cclqj5sge2nc7
type CommonParasRegistrarPalletCall = Enum<
  | { type: "register"; value: Anonymize<I7mf0sij342109> }
  | { type: "force_register"; value: Anonymize<Ibvirp862qkkup> }
  | { type: "deregister"; value: Anonymize<Ic5b47dj4coa3r> }
  | { type: "swap"; value: Anonymize<Idehabrqi23sc0> }
  | { type: "remove_lock"; value: Anonymize<Iaus4cb3drhu9q> }
  | { type: "reserve"; value: undefined }
  | { type: "add_lock"; value: Anonymize<Iaus4cb3drhu9q> }
  | { type: "schedule_code_upgrade"; value: Anonymize<I1k3urvkqqshbc> }
  | { type: "set_current_head"; value: Anonymize<I2ff0ffsh15vej> }
>

// polkadot_runtime_common,slots,pallet,Call
// afhis924j14hg
type CommonSlotsPalletCall = Enum<
  | { type: "force_lease"; value: Anonymize<Idfpo6162k0hq> }
  | { type: "clear_all_leases"; value: Anonymize<Iaus4cb3drhu9q> }
  | { type: "trigger_onboard"; value: Anonymize<Iaus4cb3drhu9q> }
>

// polkadot_runtime_common,auctions,pallet,Call
// 4a8qeimc5p3qn
type CommonAuctionsPalletCall = Enum<
  | { type: "new_auction"; value: Anonymize<I19hvnphoaj44l> }
  | { type: "bid"; value: Anonymize<I1ng31ej27mh4k> }
  | { type: "cancel_auction"; value: undefined }
>

// polkadot_runtime_common,crowdloan,pallet,Call
// aj4q75nu5v2i2
type CommonCrowdloanPalletCall = Enum<
  | { type: "create"; value: Anonymize<I3js6c9fubdele> }
  | { type: "contribute"; value: Anonymize<I6n5jj22t7mm7i> }
  | { type: "withdraw"; value: Anonymize<Ia1u3jll6a06ae> }
  | { type: "refund"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "dissolve"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "edit"; value: Anonymize<I3js6c9fubdele> }
  | { type: "add_memo"; value: Anonymize<I7cl9esn1l72m7> }
  | { type: "poke"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "contribute_all"; value: Anonymize<I3k27o64k49es2> }
>

// sp_runtime,MultiSigner
// d7em8997pfm92
type MultiSigner = Enum<
  | { type: "Ed25519"; value: Anonymize<Binary> }
  | { type: "Sr25519"; value: Anonymize<Binary> }
  | { type: "Ecdsa"; value: Anonymize<Binary> }
>

// sp_runtime,MultiSignature
// bkbo8vqdq5g5a
type MultiSignature = Enum<
  | { type: "Ed25519"; value: Anonymize<Binary> }
  | { type: "Sr25519"; value: Anonymize<Binary> }
  | { type: "Ecdsa"; value: Anonymize<Binary> }
>

// pallet_xcm,pallet,Call
// 5jnu77ehu4bfu
type XcmPalletCall = Enum<
  | { type: "send"; value: Anonymize<Icvpjofp09bmlh> }
  | { type: "teleport_assets"; value: Anonymize<Ieeis6pj62kiu4> }
  | { type: "reserve_transfer_assets"; value: Anonymize<Ieeis6pj62kiu4> }
  | { type: "execute"; value: Anonymize<I53e0mdinhcvpm> }
  | { type: "force_xcm_version"; value: Anonymize<I732o5n04n5ohg> }
  | { type: "force_default_xcm_version"; value: Anonymize<Ic76kfh5ebqkpl> }
  | { type: "force_subscribe_version_notify"; value: Anonymize<I3pog27ittgi9g> }
  | {
      type: "force_unsubscribe_version_notify"
      value: Anonymize<I3pog27ittgi9g>
    }
  | {
      type: "limited_reserve_transfer_assets"
      value: Anonymize<Ifcceq8taolrca>
    }
  | { type: "limited_teleport_assets"; value: Anonymize<Ifcceq8taolrca> }
  | { type: "force_suspension"; value: Anonymize<Ibgm4rnf22lal1> }
>

// xcm,VersionedMultiLocation
// fso6iqf887gac
type XcmVersionedMultiLocation = Enum<
  | { type: "V2"; value: Anonymize<Ibki0d249v3ojt> }
  | { type: "V3"; value: Anonymize<I43cmiele6sevi> }
>

// xcm,v2,multilocation,Junctions
// du33014qjqdr2
type XcmV2MultilocationJunctions = Enum<
  | { type: "Here"; value: undefined }
  | { type: "X1"; value: Anonymize<XcmV2Junction> }
  | { type: "X2"; value: Anonymize<I4jsker1kbjfdl> }
  | { type: "X3"; value: Anonymize<I13maq674kd1pa> }
  | { type: "X4"; value: Anonymize<Id88bctcqlqla7> }
  | { type: "X5"; value: Anonymize<I3d9nac7g0r3eq> }
  | { type: "X6"; value: Anonymize<I5q5ti9n9anvcm> }
  | { type: "X7"; value: Anonymize<I1famu3nq9knji> }
  | { type: "X8"; value: Anonymize<Idlq59tbqpri0l> }
>

// xcm,v2,junction,Junction
// 505kan7sticn1
type XcmV2Junction = Enum<
  | { type: "Parachain"; value: Anonymize<number> }
  | { type: "AccountId32"; value: Anonymize<I92r3c354plrou> }
  | { type: "AccountIndex64"; value: Anonymize<I1i2pf35t6tqc0> }
  | { type: "AccountKey20"; value: Anonymize<I9llkpmu569f8r> }
  | { type: "PalletInstance"; value: Anonymize<number> }
  | { type: "GeneralIndex"; value: Anonymize<bigint> }
  | { type: "GeneralKey"; value: Anonymize<Binary> }
  | { type: "OnlyChild"; value: undefined }
  | { type: "Plurality"; value: Anonymize<Icud1kgafcboq0> }
>

// xcm,v2,NetworkId
// 710b6mh49al4f
type XcmV2NetworkId = Enum<
  | { type: "Any"; value: undefined }
  | { type: "Named"; value: Anonymize<Binary> }
  | { type: "Polkadot"; value: undefined }
  | { type: "Kusama"; value: undefined }
>

// xcm,v2,BodyId
// 46j01db9schbn
type XcmV2BodyId = Enum<
  | { type: "Unit"; value: undefined }
  | { type: "Named"; value: Anonymize<Binary> }
  | { type: "Index"; value: Anonymize<number> }
  | { type: "Executive"; value: undefined }
  | { type: "Technical"; value: undefined }
  | { type: "Legislative"; value: undefined }
  | { type: "Judicial"; value: undefined }
  | { type: "Defense"; value: undefined }
  | { type: "Administration"; value: undefined }
  | { type: "Treasury"; value: undefined }
>

// xcm,VersionedXcm
// 69sdq9h61mcjv
type XcmVersionedXcm = Enum<
  | { type: "V2"; value: Anonymize<I797ibmv93o8n9> }
  | { type: "V3"; value: Anonymize<I8l0577387vghn> }
>

// xcm,v2,Instruction
// fn5bbkq9rcm83
type XcmV2Instruction = Enum<
  | { type: "WithdrawAsset"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ReserveAssetDeposited"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ReceiveTeleportedAsset"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "QueryResponse"; value: Anonymize<I7adp6ofrfskbq> }
  | { type: "TransferAsset"; value: Anonymize<I55b7rvmacg132> }
  | { type: "TransferReserveAsset"; value: Anonymize<I87p6gu1rs00b9> }
  | { type: "Transact"; value: Anonymize<I61kq38r93nm9u> }
  | { type: "HrmpNewChannelOpenRequest"; value: Anonymize<I5uhhrjqfuo4e5> }
  | { type: "HrmpChannelAccepted"; value: Anonymize<Ifij4jam0o7sub> }
  | { type: "HrmpChannelClosing"; value: Anonymize<Ieeb4svd9i8fji> }
  | { type: "ClearOrigin"; value: undefined }
  | { type: "DescendOrigin"; value: Anonymize<XcmV2MultilocationJunctions> }
  | { type: "ReportError"; value: Anonymize<I99o59cf77uo81> }
  | { type: "DepositAsset"; value: Anonymize<I2fdiqplld7l4b> }
  | { type: "DepositReserveAsset"; value: Anonymize<I4e86ltq2coupq> }
  | { type: "ExchangeAsset"; value: Anonymize<I8i9t5akp4s2qr> }
  | { type: "InitiateReserveWithdraw"; value: Anonymize<I3rvvq2i351pp4> }
  | { type: "InitiateTeleport"; value: Anonymize<I2eh04tsbsec6v> }
  | { type: "QueryHolding"; value: Anonymize<Iih6kp60v9gan> }
  | { type: "BuyExecution"; value: Anonymize<I2u6ut68eoldqa> }
  | { type: "RefundSurplus"; value: undefined }
  | { type: "SetErrorHandler"; value: Anonymize<I797ibmv93o8n9> }
  | { type: "SetAppendix"; value: Anonymize<I797ibmv93o8n9> }
  | { type: "ClearError"; value: undefined }
  | { type: "ClaimAsset"; value: Anonymize<I60l7lelr2s5kd> }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "SubscribeVersion"; value: Anonymize<Ido2s48ntevurj> }
  | { type: "UnsubscribeVersion"; value: undefined }
>

// xcm,v2,multiasset,AssetId
// 2kuvuc3c51k00
type XcmV2MultiassetAssetId = Enum<
  | { type: "Concrete"; value: Anonymize<Ibki0d249v3ojt> }
  | { type: "Abstract"; value: Anonymize<Binary> }
>

// xcm,v2,multiasset,Fungibility
// 1e4e6h17tes8n
type XcmV2MultiassetFungibility = Enum<
  | { type: "Fungible"; value: Anonymize<bigint> }
  | { type: "NonFungible"; value: Anonymize<XcmV2MultiassetAssetInstance> }
>

// xcm,v2,multiasset,AssetInstance
// 11avansl9buvp
type XcmV2MultiassetAssetInstance = Enum<
  | { type: "Undefined"; value: undefined }
  | { type: "Index"; value: Anonymize<bigint> }
  | { type: "Array4"; value: Anonymize<Binary> }
  | { type: "Array8"; value: Anonymize<Binary> }
  | { type: "Array16"; value: Anonymize<Binary> }
  | { type: "Array32"; value: Anonymize<Binary> }
  | { type: "Blob"; value: Anonymize<Binary> }
>

// xcm,v2,Response
// 7cgekabf482c4
type XcmV2Response = Enum<
  | { type: "Null"; value: undefined }
  | { type: "Assets"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ExecutionResult"; value: Anonymize<I17i9gqt27hetc> }
  | { type: "Version"; value: Anonymize<number> }
>

// xcm,v2,traits,Error
// amc6gl7bd9por
type XcmV2TraitsError = Enum<
  | { type: "Overflow"; value: undefined }
  | { type: "Unimplemented"; value: undefined }
  | { type: "UntrustedReserveLocation"; value: undefined }
  | { type: "UntrustedTeleportLocation"; value: undefined }
  | { type: "MultiLocationFull"; value: undefined }
  | { type: "MultiLocationNotInvertible"; value: undefined }
  | { type: "BadOrigin"; value: undefined }
  | { type: "InvalidLocation"; value: undefined }
  | { type: "AssetNotFound"; value: undefined }
  | { type: "FailedToTransactAsset"; value: undefined }
  | { type: "NotWithdrawable"; value: undefined }
  | { type: "LocationCannotHold"; value: undefined }
  | { type: "ExceedsMaxMessageSize"; value: undefined }
  | { type: "DestinationUnsupported"; value: undefined }
  | { type: "Transport"; value: undefined }
  | { type: "Unroutable"; value: undefined }
  | { type: "UnknownClaim"; value: undefined }
  | { type: "FailedToDecode"; value: undefined }
  | { type: "MaxWeightInvalid"; value: undefined }
  | { type: "NotHoldingFees"; value: undefined }
  | { type: "TooExpensive"; value: undefined }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "UnhandledXcmVersion"; value: undefined }
  | { type: "WeightLimitReached"; value: Anonymize<bigint> }
  | { type: "Barrier"; value: undefined }
  | { type: "WeightNotComputable"; value: undefined }
>

// xcm,v2,OriginKind
// 2dcitigd3tk41
type XcmV2OriginKind = Enum<
  | { type: "Native"; value: undefined }
  | { type: "SovereignAccount"; value: undefined }
  | { type: "Superuser"; value: undefined }
  | { type: "Xcm"; value: undefined }
>

// xcm,v2,multiasset,MultiAssetFilter
// e4sgpst2e3uke
type XcmV2MultiAssetFilter = Enum<
  | { type: "Definite"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "Wild"; value: Anonymize<XcmV2MultiassetWildMultiAsset> }
>

// xcm,v2,multiasset,WildMultiAsset
// d9gnfbqterb30
type XcmV2MultiassetWildMultiAsset = Enum<
  | { type: "All"; value: undefined }
  | { type: "AllOf"; value: Anonymize<I96k6616d81u1u> }
>

// xcm,v2,multiasset,WildFungibility
// cg1p3hrtv6n5f
type XcmV2MultiassetWildFungibility = Enum<
  | { type: "Fungible"; value: undefined }
  | { type: "NonFungible"; value: undefined }
>

// xcm,v2,WeightLimit
// adqdire0qjg0e
type XcmV2WeightLimit = Enum<
  | { type: "Unlimited"; value: undefined }
  | { type: "Limited"; value: Anonymize<bigint> }
>

// xcm,v3,Instruction
// 590ugg567qnb0
type XcmV3Instruction = Enum<
  | { type: "WithdrawAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ReserveAssetDeposited"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ReceiveTeleportedAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "QueryResponse"; value: Anonymize<I3hin12hf9pma8> }
  | { type: "TransferAsset"; value: Anonymize<Ibseg27e15rt5b> }
  | { type: "TransferReserveAsset"; value: Anonymize<I8nsq83051h7s5> }
  | { type: "Transact"; value: Anonymize<I4sfmje1omkmem> }
  | { type: "HrmpNewChannelOpenRequest"; value: Anonymize<I5uhhrjqfuo4e5> }
  | { type: "HrmpChannelAccepted"; value: Anonymize<Ifij4jam0o7sub> }
  | { type: "HrmpChannelClosing"; value: Anonymize<Ieeb4svd9i8fji> }
  | { type: "ClearOrigin"; value: undefined }
  | { type: "DescendOrigin"; value: Anonymize<XcmV3Junctions> }
  | { type: "ReportError"; value: Anonymize<I40u32g7uv47fo> }
  | { type: "DepositAsset"; value: Anonymize<I92hs9ri8pep98> }
  | { type: "DepositReserveAsset"; value: Anonymize<Ifu4iibn44bata> }
  | { type: "ExchangeAsset"; value: Anonymize<I5v4cm31o1r5t1> }
  | { type: "InitiateReserveWithdraw"; value: Anonymize<Ick8rmedif57q9> }
  | { type: "InitiateTeleport"; value: Anonymize<Ifu4iibn44bata> }
  | { type: "ReportHolding"; value: Anonymize<Icvkurqgno3h7q> }
  | { type: "BuyExecution"; value: Anonymize<I8nq35nm53n6bc> }
  | { type: "RefundSurplus"; value: undefined }
  | { type: "SetErrorHandler"; value: Anonymize<I8l0577387vghn> }
  | { type: "SetAppendix"; value: Anonymize<I8l0577387vghn> }
  | { type: "ClearError"; value: undefined }
  | { type: "ClaimAsset"; value: Anonymize<I8uojukg6cvq81> }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "SubscribeVersion"; value: Anonymize<Ieprdqqu7ildvr> }
  | { type: "UnsubscribeVersion"; value: undefined }
  | { type: "BurnAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExpectAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExpectOrigin"; value: Anonymize<I74hapqfd00s9i> }
  | { type: "ExpectError"; value: Anonymize<I8j770n2arfq59> }
  | { type: "ExpectTransactStatus"; value: Anonymize<XcmV3MaybeErrorCode> }
  | { type: "QueryPallet"; value: Anonymize<Ie3fdn0i40ahq2> }
  | { type: "ExpectPallet"; value: Anonymize<Id7mf37dkpgfjs> }
  | { type: "ReportTransactStatus"; value: Anonymize<I40u32g7uv47fo> }
  | { type: "ClearTransactStatus"; value: undefined }
  | { type: "UniversalOrigin"; value: Anonymize<XcmV3Junction> }
  | { type: "ExportMessage"; value: Anonymize<I7uretqff9fvu> }
  | { type: "LockAsset"; value: Anonymize<I5e83tpl0q5jq0> }
  | { type: "UnlockAsset"; value: Anonymize<Iffpr1249pemri> }
  | { type: "NoteUnlockable"; value: Anonymize<I5jls3ar3odglq> }
  | { type: "RequestUnlock"; value: Anonymize<I7cfckcbgdvb8j> }
  | { type: "SetFeesMode"; value: Anonymize<I4nae9rsql8fa7> }
  | { type: "SetTopic"; value: Anonymize<Binary> }
  | { type: "ClearTopic"; value: undefined }
  | { type: "AliasOrigin"; value: Anonymize<I43cmiele6sevi> }
  | { type: "UnpaidExecution"; value: Anonymize<Ifq797dv2t3djd> }
>

// xcm,v3,multiasset,AssetId
// d4ai9oreddetp
type XcmV3MultiassetAssetId = Enum<
  | { type: "Concrete"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Abstract"; value: Anonymize<Binary> }
>

// xcm,v3,multiasset,Fungibility
// d2d2vjc8h66mf
type XcmV3MultiassetFungibility = Enum<
  | { type: "Fungible"; value: Anonymize<bigint> }
  | { type: "NonFungible"; value: Anonymize<XcmV3MultiassetAssetInstance> }
>

// xcm,v3,multiasset,AssetInstance
// 9d6sev8uj006q
type XcmV3MultiassetAssetInstance = Enum<
  | { type: "Undefined"; value: undefined }
  | { type: "Index"; value: Anonymize<bigint> }
  | { type: "Array4"; value: Anonymize<Binary> }
  | { type: "Array8"; value: Anonymize<Binary> }
  | { type: "Array16"; value: Anonymize<Binary> }
  | { type: "Array32"; value: Anonymize<Binary> }
>

// xcm,v3,Response
// 42ng32a5771l6
type XcmV3Response = Enum<
  | { type: "Null"; value: undefined }
  | { type: "Assets"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExecutionResult"; value: Anonymize<I8j770n2arfq59> }
  | { type: "Version"; value: Anonymize<number> }
  | { type: "PalletsInfo"; value: Anonymize<I599u7h20b52at> }
  | { type: "DispatchResult"; value: Anonymize<XcmV3MaybeErrorCode> }
>

// xcm,v3,traits,Error
// 8j0abm9jkapk2
type XcmV3TraitsError = Enum<
  | { type: "Overflow"; value: undefined }
  | { type: "Unimplemented"; value: undefined }
  | { type: "UntrustedReserveLocation"; value: undefined }
  | { type: "UntrustedTeleportLocation"; value: undefined }
  | { type: "LocationFull"; value: undefined }
  | { type: "LocationNotInvertible"; value: undefined }
  | { type: "BadOrigin"; value: undefined }
  | { type: "InvalidLocation"; value: undefined }
  | { type: "AssetNotFound"; value: undefined }
  | { type: "FailedToTransactAsset"; value: undefined }
  | { type: "NotWithdrawable"; value: undefined }
  | { type: "LocationCannotHold"; value: undefined }
  | { type: "ExceedsMaxMessageSize"; value: undefined }
  | { type: "DestinationUnsupported"; value: undefined }
  | { type: "Transport"; value: undefined }
  | { type: "Unroutable"; value: undefined }
  | { type: "UnknownClaim"; value: undefined }
  | { type: "FailedToDecode"; value: undefined }
  | { type: "MaxWeightInvalid"; value: undefined }
  | { type: "NotHoldingFees"; value: undefined }
  | { type: "TooExpensive"; value: undefined }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "ExpectationFalse"; value: undefined }
  | { type: "PalletNotFound"; value: undefined }
  | { type: "NameMismatch"; value: undefined }
  | { type: "VersionIncompatible"; value: undefined }
  | { type: "HoldingWouldOverflow"; value: undefined }
  | { type: "ExportError"; value: undefined }
  | { type: "ReanchorFailed"; value: undefined }
  | { type: "NoDeal"; value: undefined }
  | { type: "FeesNotMet"; value: undefined }
  | { type: "LockError"; value: undefined }
  | { type: "NoPermission"; value: undefined }
  | { type: "Unanchored"; value: undefined }
  | { type: "NotDepositable"; value: undefined }
  | { type: "UnhandledXcmVersion"; value: undefined }
  | { type: "WeightLimitReached"; value: Anonymize<I4q39t5hn830vp> }
  | { type: "Barrier"; value: undefined }
  | { type: "WeightNotComputable"; value: undefined }
  | { type: "ExceedsStackLimit"; value: undefined }
>

// xcm,v3,MaybeErrorCode
// 5g0925eiftlcf
type XcmV3MaybeErrorCode = Enum<
  | { type: "Success"; value: undefined }
  | { type: "Error"; value: Anonymize<Binary> }
  | { type: "TruncatedError"; value: Anonymize<Binary> }
>

// xcm,v3,multiasset,MultiAssetFilter
// 6b08ikcf19cj0
type XcmV3MultiAssetFilter = Enum<
  | { type: "Definite"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "Wild"; value: Anonymize<XcmV3MultiassetWildMultiAsset> }
>

// xcm,v3,multiasset,WildMultiAsset
// 229oojecaod2j
type XcmV3WildMultiAsset = Enum<
  | { type: "All"; value: undefined }
  | { type: "AllOf"; value: Anonymize<Ikhntpa3k1bng> }
  | { type: "AllCounted"; value: Anonymize<number> }
  | { type: "AllOfCounted"; value: Anonymize<I8ef6ldr28dcsm> }
>

// xcm,v3,WeightLimit
// 769fta165mequ
type XcmV3WeightLimit = Enum<
  | { type: "Unlimited"; value: undefined }
  | { type: "Limited"; value: Anonymize<I4q39t5hn830vp> }
>

// xcm,VersionedMultiAssets
// 85l50t95kraik
type XcmVersionedMultiAssets = Enum<
  | { type: "V2"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "V3"; value: Anonymize<Id7mn3j3ge1h6a> }
>

// xcm,VersionedXcm
// 27oeif4on5jk1
type XcmVersionedXcm1 = Enum<
  | { type: "V2"; value: Anonymize<I6gdh0i5feh6sm> }
  | { type: "V3"; value: Anonymize<I3f103a4f7tafe> }
>

// xcm,v2,Instruction
// f1981q9hna52f
type XcmV2Instruction1 = Enum<
  | { type: "WithdrawAsset"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ReserveAssetDeposited"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ReceiveTeleportedAsset"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "QueryResponse"; value: Anonymize<I7adp6ofrfskbq> }
  | { type: "TransferAsset"; value: Anonymize<I55b7rvmacg132> }
  | { type: "TransferReserveAsset"; value: Anonymize<I87p6gu1rs00b9> }
  | { type: "Transact"; value: Anonymize<I61kq38r93nm9u> }
  | { type: "HrmpNewChannelOpenRequest"; value: Anonymize<I5uhhrjqfuo4e5> }
  | { type: "HrmpChannelAccepted"; value: Anonymize<Ifij4jam0o7sub> }
  | { type: "HrmpChannelClosing"; value: Anonymize<Ieeb4svd9i8fji> }
  | { type: "ClearOrigin"; value: undefined }
  | { type: "DescendOrigin"; value: Anonymize<XcmV2MultilocationJunctions> }
  | { type: "ReportError"; value: Anonymize<I99o59cf77uo81> }
  | { type: "DepositAsset"; value: Anonymize<I2fdiqplld7l4b> }
  | { type: "DepositReserveAsset"; value: Anonymize<I4e86ltq2coupq> }
  | { type: "ExchangeAsset"; value: Anonymize<I8i9t5akp4s2qr> }
  | { type: "InitiateReserveWithdraw"; value: Anonymize<I3rvvq2i351pp4> }
  | { type: "InitiateTeleport"; value: Anonymize<I2eh04tsbsec6v> }
  | { type: "QueryHolding"; value: Anonymize<Iih6kp60v9gan> }
  | { type: "BuyExecution"; value: Anonymize<I2u6ut68eoldqa> }
  | { type: "RefundSurplus"; value: undefined }
  | { type: "SetErrorHandler"; value: Anonymize<I6gdh0i5feh6sm> }
  | { type: "SetAppendix"; value: Anonymize<I6gdh0i5feh6sm> }
  | { type: "ClearError"; value: undefined }
  | { type: "ClaimAsset"; value: Anonymize<I60l7lelr2s5kd> }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "SubscribeVersion"; value: Anonymize<Ido2s48ntevurj> }
  | { type: "UnsubscribeVersion"; value: undefined }
>

// xcm,v3,Instruction
// 4so8crc3ps5sk
type XcmV3Instruction1 = Enum<
  | { type: "WithdrawAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ReserveAssetDeposited"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ReceiveTeleportedAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "QueryResponse"; value: Anonymize<I3hin12hf9pma8> }
  | { type: "TransferAsset"; value: Anonymize<Ibseg27e15rt5b> }
  | { type: "TransferReserveAsset"; value: Anonymize<I8nsq83051h7s5> }
  | { type: "Transact"; value: Anonymize<I4sfmje1omkmem> }
  | { type: "HrmpNewChannelOpenRequest"; value: Anonymize<I5uhhrjqfuo4e5> }
  | { type: "HrmpChannelAccepted"; value: Anonymize<Ifij4jam0o7sub> }
  | { type: "HrmpChannelClosing"; value: Anonymize<Ieeb4svd9i8fji> }
  | { type: "ClearOrigin"; value: undefined }
  | { type: "DescendOrigin"; value: Anonymize<XcmV3Junctions> }
  | { type: "ReportError"; value: Anonymize<I40u32g7uv47fo> }
  | { type: "DepositAsset"; value: Anonymize<I92hs9ri8pep98> }
  | { type: "DepositReserveAsset"; value: Anonymize<Ifu4iibn44bata> }
  | { type: "ExchangeAsset"; value: Anonymize<I5v4cm31o1r5t1> }
  | { type: "InitiateReserveWithdraw"; value: Anonymize<Ick8rmedif57q9> }
  | { type: "InitiateTeleport"; value: Anonymize<Ifu4iibn44bata> }
  | { type: "ReportHolding"; value: Anonymize<Icvkurqgno3h7q> }
  | { type: "BuyExecution"; value: Anonymize<I8nq35nm53n6bc> }
  | { type: "RefundSurplus"; value: undefined }
  | { type: "SetErrorHandler"; value: Anonymize<I3f103a4f7tafe> }
  | { type: "SetAppendix"; value: Anonymize<I3f103a4f7tafe> }
  | { type: "ClearError"; value: undefined }
  | { type: "ClaimAsset"; value: Anonymize<I8uojukg6cvq81> }
  | { type: "Trap"; value: Anonymize<bigint> }
  | { type: "SubscribeVersion"; value: Anonymize<Ieprdqqu7ildvr> }
  | { type: "UnsubscribeVersion"; value: undefined }
  | { type: "BurnAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExpectAsset"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExpectOrigin"; value: Anonymize<I74hapqfd00s9i> }
  | { type: "ExpectError"; value: Anonymize<I8j770n2arfq59> }
  | { type: "ExpectTransactStatus"; value: Anonymize<XcmV3MaybeErrorCode> }
  | { type: "QueryPallet"; value: Anonymize<Ie3fdn0i40ahq2> }
  | { type: "ExpectPallet"; value: Anonymize<Id7mf37dkpgfjs> }
  | { type: "ReportTransactStatus"; value: Anonymize<I40u32g7uv47fo> }
  | { type: "ClearTransactStatus"; value: undefined }
  | { type: "UniversalOrigin"; value: Anonymize<XcmV3Junction> }
  | { type: "ExportMessage"; value: Anonymize<I7uretqff9fvu> }
  | { type: "LockAsset"; value: Anonymize<I5e83tpl0q5jq0> }
  | { type: "UnlockAsset"; value: Anonymize<Iffpr1249pemri> }
  | { type: "NoteUnlockable"; value: Anonymize<I5jls3ar3odglq> }
  | { type: "RequestUnlock"; value: Anonymize<I7cfckcbgdvb8j> }
  | { type: "SetFeesMode"; value: Anonymize<I4nae9rsql8fa7> }
  | { type: "SetTopic"; value: Anonymize<Binary> }
  | { type: "ClearTopic"; value: undefined }
  | { type: "AliasOrigin"; value: Anonymize<I43cmiele6sevi> }
  | { type: "UnpaidExecution"; value: Anonymize<Ifq797dv2t3djd> }
>

// pallet_message_queue,pallet,Call
// 3lic4llm6egbr
type MessageQueuePalletCall = Enum<
  | { type: "reap_page"; value: Anonymize<I3f1tq7m3kurig> }
  | { type: "execute_overweight"; value: Anonymize<Ifhnflnkf9f278> }
>

// polkadot_runtime_parachains,inclusion,AggregateMessageOrigin
// 4sjnuvedkqa2r
type ParachainsInclusionAggregateMessageOrigin = Enum<{
  type: "Ump"
  value: Anonymize<PolkadotRuntimeParachainsInclusionUmpQueueId>
}>

// polkadot_runtime_parachains,inclusion,UmpQueueId
// 29a9v38btsv3g
type ParachainsInclusionUmpQueueId = Enum<{
  type: "Para"
  value: Anonymize<number>
}>

// pallet_whitelist,pallet,Event
// 9iria2mpol0si
type WhitelistEvent = Enum<
  | { type: "CallWhitelisted"; value: Anonymize<I8413rb6im3iko> }
  | { type: "WhitelistedCallRemoved"; value: Anonymize<I8413rb6im3iko> }
  | { type: "WhitelistedCallDispatched"; value: Anonymize<I7b8pe56shlide> }
>

// polkadot_runtime_common,claims,pallet,Event
// 2v2nj97k9o9e
type CommonClaimsEvent = Enum<{
  type: "Claimed"
  value: Anonymize<Idhjiuhlaei3db>
}>

// pallet_vesting,pallet,Event
// d226b5du5oie9
type VestingEvent = Enum<
  | { type: "VestingUpdated"; value: Anonymize<Ievr89968437gm> }
  | { type: "VestingCompleted"; value: Anonymize<Icbccs0ug47ilf> }
>

// pallet_utility,pallet,Event
// b1t99vn44417o
type UtilityEvent = Enum<
  | { type: "BatchInterrupted"; value: Anonymize<I6tn8e5lqr339o> }
  | { type: "BatchCompleted"; value: undefined }
  | { type: "BatchCompletedWithErrors"; value: undefined }
  | { type: "ItemCompleted"; value: undefined }
  | { type: "ItemFailed"; value: Anonymize<I11lb9o37qkk4f> }
  | { type: "DispatchedAs"; value: Anonymize<Ie5i8qqljk3tjb> }
>

// pallet_identity,pallet,Event
// fugjudpfm708s
type IdentityEvent = Enum<
  | { type: "IdentitySet"; value: Anonymize<I4cbvqmqadhrea> }
  | { type: "IdentityCleared"; value: Anonymize<Iep1lmt6q3s6r3> }
  | { type: "IdentityKilled"; value: Anonymize<Iep1lmt6q3s6r3> }
  | { type: "JudgementRequested"; value: Anonymize<I1fac16213rie2> }
  | { type: "JudgementUnrequested"; value: Anonymize<I1fac16213rie2> }
  | { type: "JudgementGiven"; value: Anonymize<Ifjt77oc391o43> }
  | { type: "RegistrarAdded"; value: Anonymize<Itvt1jsipv0lc> }
  | { type: "SubIdentityAdded"; value: Anonymize<Ick3mveut33f44> }
  | { type: "SubIdentityRemoved"; value: Anonymize<Ick3mveut33f44> }
  | { type: "SubIdentityRevoked"; value: Anonymize<Ick3mveut33f44> }
>

// pallet_proxy,pallet,Event
// 11i3h84sudutq
type ProxyEvent = Enum<
  | { type: "ProxyExecuted"; value: Anonymize<Ie5i8qqljk3tjb> }
  | { type: "PureCreated"; value: Anonymize<I180p9c978rp4d> }
  | { type: "Announced"; value: Anonymize<Idbjbboh0q507r> }
  | { type: "ProxyAdded"; value: Anonymize<I94ud6o1n6v0n8> }
  | { type: "ProxyRemoved"; value: Anonymize<I94ud6o1n6v0n8> }
>

// pallet_multisig,pallet,Event
// 5830pdel8nng3
type MultisigEvent = Enum<
  | { type: "NewMultisig"; value: Anonymize<Ibvv58de7m7rsi> }
  | { type: "MultisigApproval"; value: Anonymize<I4uo2dg1jvbdtg> }
  | { type: "MultisigExecuted"; value: Anonymize<Ifbo6gts4g8u33> }
  | { type: "MultisigCancelled"; value: Anonymize<I82jp3a00f0f8k> }
>

// pallet_bounties,pallet,Event
// alepu0vuuvje8
type BountiesEvent = Enum<
  | { type: "BountyProposed"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "BountyRejected"; value: Anonymize<Id9idaj83175f9> }
  | { type: "BountyBecameActive"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "BountyAwarded"; value: Anonymize<Ie1semicfuv5uu> }
  | { type: "BountyClaimed"; value: Anonymize<If25fjs9o37co1> }
  | { type: "BountyCanceled"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "BountyExtended"; value: Anonymize<I666bl2fqjkejo> }
>

// pallet_child_bounties,pallet,Event
// a5gvqckojmehj
type ChildBountiesEvent = Enum<
  | { type: "Added"; value: Anonymize<I60p8l86a8cm59> }
  | { type: "Awarded"; value: Anonymize<I3m3sk2lgcabvp> }
  | { type: "Claimed"; value: Anonymize<I5pf572duh4oeg> }
  | { type: "Canceled"; value: Anonymize<I60p8l86a8cm59> }
>

// pallet_election_provider_multi_phase,pallet,Event
// c5529239bmt3g
type ElectionProviderMultiPhaseEvent = Enum<
  | { type: "SolutionStored"; value: Anonymize<I5an5igf3n0vgh> }
  | { type: "ElectionFinalized"; value: Anonymize<I1rd7gkt317ndg> }
  | { type: "ElectionFailed"; value: undefined }
  | { type: "Rewarded"; value: Anonymize<I7j4m7a3pkvsf4> }
  | { type: "Slashed"; value: Anonymize<I7j4m7a3pkvsf4> }
  | { type: "PhaseTransitioned"; value: Anonymize<Icrg5eih8vnokr> }
>

// pallet_election_provider_multi_phase,ElectionCompute
// htopdh9noje5
type ElectionProviderMultiPhaseElectionCompute = Enum<
  | { type: "OnChain"; value: undefined }
  | { type: "Signed"; value: undefined }
  | { type: "Unsigned"; value: undefined }
  | { type: "Fallback"; value: undefined }
  | { type: "Emergency"; value: undefined }
>

// pallet_election_provider_multi_phase,Phase
// 1ra0103q36u4i
type ElectionProviderMultiPhasePhase = Enum<
  | { type: "Off"; value: undefined }
  | { type: "Signed"; value: undefined }
  | { type: "Unsigned"; value: Anonymize<I38fu9hj3b9un7> }
  | { type: "Emergency"; value: undefined }
>

// pallet_bags_list,pallet,Event
// 2qbmdeolj2cue
type BagsListEvent = Enum<
  | { type: "Rebagged"; value: Anonymize<I37454vatvmm1l> }
  | { type: "ScoreUpdated"; value: Anonymize<Iblau1qa7u7fet> }
>

// pallet_nomination_pools,pallet,Event
// a3rudoq0hsad6
type NominationPoolsEvent = Enum<
  | { type: "Created"; value: Anonymize<I1ti389kf8t6oi> }
  | { type: "Bonded"; value: Anonymize<If4nnre373amul> }
  | { type: "PaidOut"; value: Anonymize<I55kbor0ocqk6h> }
  | { type: "Unbonded"; value: Anonymize<Idsj9cg7j96kpc> }
  | { type: "Withdrawn"; value: Anonymize<Ido4u9drncfaml> }
  | { type: "Destroyed"; value: Anonymize<I931cottvong90> }
  | { type: "StateChanged"; value: Anonymize<I2inhcpqb4h0bg> }
  | { type: "MemberRemoved"; value: Anonymize<I7vqogd77mmdlm> }
  | { type: "RolesUpdated"; value: Anonymize<I6mik29s5073td> }
  | { type: "PoolSlashed"; value: Anonymize<I2m0sqmb75cnpb> }
  | { type: "UnbondingPoolSlashed"; value: Anonymize<I49agc5b62mehu> }
  | { type: "PoolCommissionUpdated"; value: Anonymize<Iatq9jda4hq6pg> }
  | { type: "PoolMaxCommissionUpdated"; value: Anonymize<I8cbluptqo8kbp> }
  | {
      type: "PoolCommissionChangeRateUpdated"
      value: Anonymize<I81cc4plffa1dm>
    }
  | { type: "PoolCommissionClaimed"; value: Anonymize<I2g87evcjlgmqi> }
>

// pallet_fast_unstake,pallet,Event
// dri14nid3e46g
type FastUnstakeEvent = Enum<
  | { type: "Unstaked"; value: Anonymize<Iag2vtju06tj0k> }
  | { type: "Slashed"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "BatchChecked"; value: Anonymize<Ic0he9tlf9ll0u> }
  | { type: "BatchFinished"; value: Anonymize<I54umskavgc9du> }
  | { type: "InternalError"; value: undefined }
>

// polkadot_runtime_parachains,inclusion,pallet,Event
// dp2d78gpqj4r6
type ParachainsInclusionEvent = Enum<
  | { type: "CandidateBacked"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateIncluded"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateTimedOut"; value: Anonymize<Ievbvtucck5gnq> }
  | { type: "UpwardMessagesReceived"; value: Anonymize<Ic8i89mfkmn3n7> }
>

// polkadot_runtime_parachains,paras,pallet,Event
// 5dmbh5kq5novn
type ParachainsParasEvent = Enum<
  | { type: "CurrentCodeUpdated"; value: Anonymize<number> }
  | { type: "CurrentHeadUpdated"; value: Anonymize<number> }
  | { type: "CodeUpgradeScheduled"; value: Anonymize<number> }
  | { type: "NewHeadNoted"; value: Anonymize<number> }
  | { type: "ActionQueued"; value: Anonymize<I5g2vv0ckl2m8b> }
  | { type: "PvfCheckStarted"; value: Anonymize<I64gm4hrq7urum> }
  | { type: "PvfCheckAccepted"; value: Anonymize<I64gm4hrq7urum> }
  | { type: "PvfCheckRejected"; value: Anonymize<I64gm4hrq7urum> }
>

// polkadot_runtime_parachains,hrmp,pallet,Event
// cd6v2du35hbin
type ParachainsHrmpEvent = Enum<
  | { type: "OpenChannelRequested"; value: Anonymize<I6eon79p2t4ecj> }
  | { type: "OpenChannelCanceled"; value: Anonymize<I77j9bmjjabsg9> }
  | { type: "OpenChannelAccepted"; value: Anonymize<I5g2vv0ckl2m8b> }
  | { type: "ChannelClosed"; value: Anonymize<I77j9bmjjabsg9> }
  | { type: "HrmpChannelForceOpened"; value: Anonymize<I6eon79p2t4ecj> }
>

// polkadot_runtime_parachains,disputes,pallet,Event
// 8vj9hqgjobpdo
type ParachainsDisputesEvent = Enum<
  | { type: "DisputeInitiated"; value: Anonymize<I3o099fcusuh31> }
  | { type: "DisputeConcluded"; value: Anonymize<Ifr2e7vm3bun8k> }
  | { type: "Revert"; value: Anonymize<number> }
>

// polkadot_runtime_parachains,disputes,DisputeLocation
// a2kllcmf9u10g
type ParachainsDisputesDisputeLocation = Enum<
  { type: "Local"; value: undefined } | { type: "Remote"; value: undefined }
>

// polkadot_runtime_parachains,disputes,DisputeResult
// 6hem0avr1eoco
type ParachainsDisputesDisputeResult = Enum<
  { type: "Valid"; value: undefined } | { type: "Invalid"; value: undefined }
>

// polkadot_runtime_common,paras_registrar,pallet,Event
// 1pil5vhej188n
type CommonParasRegistrarEvent = Enum<
  | { type: "Registered"; value: Anonymize<Ibs22tt76qp5bi> }
  | { type: "Deregistered"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "Reserved"; value: Anonymize<Idn2ghub1o4i40> }
  | { type: "Swapped"; value: Anonymize<I48u78djt89dod> }
>

// polkadot_runtime_common,slots,pallet,Event
// fdctp8g6s725t
type CommonSlotsEvent = Enum<
  | { type: "NewLeasePeriod"; value: Anonymize<Ib85m5kfbepu2t> }
  | { type: "Leased"; value: Anonymize<Idaml5bdhsfcsl> }
>

// polkadot_runtime_common,auctions,pallet,Event
// b1eprmg9d9eh2
type CommonAuctionsEvent = Enum<
  | { type: "AuctionStarted"; value: Anonymize<Ieec0cu336gteb> }
  | { type: "AuctionClosed"; value: Anonymize<I815d5k4ij85nv> }
  | { type: "Reserved"; value: Anonymize<Ifi98fgi9o46v7> }
  | { type: "Unreserved"; value: Anonymize<Ic0oj9tok33uap> }
  | { type: "ReserveConfiscated"; value: Anonymize<I3tdutpfjuk32j> }
  | { type: "BidAccepted"; value: Anonymize<I1esdujrkdacpb> }
  | { type: "WinningOffset"; value: Anonymize<I9g1d820jf9m2s> }
>

// polkadot_runtime_common,crowdloan,pallet,Event
// aoe6t9b9v4nhr
type CommonCrowdloanEvent = Enum<
  | { type: "Created"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "Contributed"; value: Anonymize<I8ve4g3egaln6a> }
  | { type: "Withdrew"; value: Anonymize<I8ve4g3egaln6a> }
  | { type: "PartiallyRefunded"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "AllRefunded"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "Dissolved"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "HandleBidResult"; value: Anonymize<If9e3ujpsfl4g7> }
  | { type: "Edited"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "MemoUpdated"; value: Anonymize<If4hvqaeoqq5us> }
  | { type: "AddedToNewRaise"; value: Anonymize<I37r4bdai8o9mp> }
>

// pallet_xcm,pallet,Event
// 83jrjk78nrqg0
type XcmEvent = Enum<
  | { type: "Attempted"; value: Anonymize<I4e7dkr4hrus3u> }
  | { type: "Sent"; value: Anonymize<Ia5b8kts5gt3p5> }
  | { type: "UnexpectedResponse"; value: Anonymize<Ise9r0vrat2m6> }
  | { type: "ResponseReady"; value: Anonymize<I7kkbgm2llu2o3> }
  | { type: "Notified"; value: Anonymize<I2uqmls7kcdnii> }
  | { type: "NotifyOverweight"; value: Anonymize<Idg69klialbkb8> }
  | { type: "NotifyDispatchError"; value: Anonymize<I2uqmls7kcdnii> }
  | { type: "NotifyDecodeFailed"; value: Anonymize<I2uqmls7kcdnii> }
  | { type: "InvalidResponder"; value: Anonymize<I9j133okge3c2> }
  | { type: "InvalidResponderVersion"; value: Anonymize<Ise9r0vrat2m6> }
  | { type: "ResponseTaken"; value: Anonymize<I30pg328m00nr3> }
  | { type: "AssetsTrapped"; value: Anonymize<I5qm1bvb2j3ap2> }
  | { type: "VersionChangeNotified"; value: Anonymize<I95aqmsd6gjmqs> }
  | { type: "SupportedVersionChanged"; value: Anonymize<I732o5n04n5ohg> }
  | { type: "NotifyTargetSendFail"; value: Anonymize<Iarlf7ddo81fm5> }
  | { type: "NotifyTargetMigrationFail"; value: Anonymize<Ie9bjgclf7vho0> }
  | { type: "InvalidQuerierVersion"; value: Anonymize<Ise9r0vrat2m6> }
  | { type: "InvalidQuerier"; value: Anonymize<I7dm0nb8u3g2hv> }
  | { type: "VersionNotifyStarted"; value: Anonymize<I5pnf8l8c1nkfk> }
  | { type: "VersionNotifyRequested"; value: Anonymize<I5pnf8l8c1nkfk> }
  | { type: "VersionNotifyUnrequested"; value: Anonymize<I5pnf8l8c1nkfk> }
  | { type: "FeesPaid"; value: Anonymize<Ibknqphki4flb3> }
  | { type: "AssetsClaimed"; value: Anonymize<I5qm1bvb2j3ap2> }
>

// xcm,v3,traits,Outcome
// b01fvb3ofrhi8
type XcmV3TraitsOutcome = Enum<
  | { type: "Complete"; value: Anonymize<I4q39t5hn830vp> }
  | { type: "Incomplete"; value: Anonymize<Ilcvm3kc2hvtg> }
  | { type: "Error"; value: Anonymize<XcmV3TraitsError> }
>

// pallet_message_queue,pallet,Event
// eknqsk8t6a8oo
type MessageQueueEvent = Enum<
  | { type: "ProcessingFailed"; value: Anonymize<I6ian27okrbc15> }
  | { type: "Processed"; value: Anonymize<I74b8cu68dfbfr> }
  | { type: "OverweightEnqueued"; value: Anonymize<Iacc6dee8ffsrh> }
  | { type: "PageReaped"; value: Anonymize<Ielsom2b1kkdm6> }
>

// frame_support,traits,messages,ProcessMessageError
// 4hum2k6q9amhf
type ProcessMessageError = Enum<
  | { type: "BadFormat"; value: undefined }
  | { type: "Corrupt"; value: undefined }
  | { type: "Unsupported"; value: undefined }
  | { type: "Overweight"; value: Anonymize<I4q39t5hn830vp> }
  | { type: "Yield"; value: undefined }
>

// frame_system,Phase
// bl1lrline4to8
type Phase = Enum<
  | { type: "ApplyExtrinsic"; value: Anonymize<number> }
  | { type: "Finalization"; value: undefined }
  | { type: "Initialization"; value: undefined }
>

// frame_system,pallet,Error
// 2b5jj3f5ebo54
type PalletError = Enum<
  | { type: "InvalidSpecName"; value: undefined }
  | { type: "SpecVersionNeedsToIncrease"; value: undefined }
  | { type: "FailedToExtractRuntimeVersion"; value: undefined }
  | { type: "NonDefaultComposite"; value: undefined }
  | { type: "NonZeroRefCount"; value: undefined }
  | { type: "CallFiltered"; value: undefined }
>

// pallet_scheduler,pallet,Error
// f7oa8fprnilo5
type SchedulerPalletError = Enum<
  | { type: "FailedToSchedule"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "TargetBlockNumberInPast"; value: undefined }
  | { type: "RescheduleNoChange"; value: undefined }
  | { type: "Named"; value: undefined }
>

// pallet_preimage,RequestStatus
// 515gfvv2a6c4o
type PreimageRequestStatus = Enum<
  | { type: "Unrequested"; value: Anonymize<I5jej6bvdjrisr> }
  | { type: "Requested"; value: Anonymize<Is7sg1rr9u2nm> }
>

// pallet_preimage,pallet,Error
// ehqcs6ic5kkkf
type PreimagePalletError = Enum<
  | { type: "TooBig"; value: undefined }
  | { type: "AlreadyNoted"; value: undefined }
  | { type: "NotAuthorized"; value: undefined }
  | { type: "NotNoted"; value: undefined }
  | { type: "Requested"; value: undefined }
  | { type: "NotRequested"; value: undefined }
>

// sp_consensus_babe,digests,PreDigest
// arof15is9j858
type BabeDigestsPreDigest = Enum<
  | { type: "Primary"; value: Anonymize<I7u2rr2qf89ek5> }
  | { type: "SecondaryPlain"; value: Anonymize<Ieiaevc5q41ard> }
  | { type: "SecondaryVRF"; value: Anonymize<I7u2rr2qf89ek5> }
>

// pallet_babe,pallet,Error
// b6q602k6o213a
type BabePalletError = Enum<
  | { type: "InvalidEquivocationProof"; value: undefined }
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "DuplicateOffenceReport"; value: undefined }
  | { type: "InvalidConfiguration"; value: undefined }
>

// pallet_indices,pallet,Error
// cq1825fru3di2
type IndicesPalletError = Enum<
  | { type: "NotAssigned"; value: undefined }
  | { type: "NotOwner"; value: undefined }
  | { type: "InUse"; value: undefined }
  | { type: "NotTransfer"; value: undefined }
  | { type: "Permanent"; value: undefined }
>

// pallet_balances,types,Reasons
// bgr9ooktct68l
type BalancesTypesReasons = Enum<
  | { type: "Fee"; value: undefined }
  | { type: "Misc"; value: undefined }
  | { type: "All"; value: undefined }
>

// pallet_balances,pallet,Error
// fe9031aj6on0k
type BalancesPalletError = Enum<
  | { type: "VestingBalance"; value: undefined }
  | { type: "LiquidityRestrictions"; value: undefined }
  | { type: "InsufficientBalance"; value: undefined }
  | { type: "ExistentialDeposit"; value: undefined }
  | { type: "Expendability"; value: undefined }
  | { type: "ExistingVestingSchedule"; value: undefined }
  | { type: "DeadAccount"; value: undefined }
  | { type: "TooManyReserves"; value: undefined }
  | { type: "TooManyHolds"; value: undefined }
  | { type: "TooManyFreezes"; value: undefined }
>

// pallet_transaction_payment,Releases
// fcqan2gt5adqc
type TransactionPaymentReleases = Enum<
  { type: "V1Ancient"; value: undefined } | { type: "V2"; value: undefined }
>

// pallet_staking,pallet,pallet,Error
// br8ob0iqlr7cl
type StakingPalletError = Enum<
  | { type: "NotController"; value: undefined }
  | { type: "NotStash"; value: undefined }
  | { type: "AlreadyBonded"; value: undefined }
  | { type: "AlreadyPaired"; value: undefined }
  | { type: "EmptyTargets"; value: undefined }
  | { type: "DuplicateIndex"; value: undefined }
  | { type: "InvalidSlashIndex"; value: undefined }
  | { type: "InsufficientBond"; value: undefined }
  | { type: "NoMoreChunks"; value: undefined }
  | { type: "NoUnlockChunk"; value: undefined }
  | { type: "FundedTarget"; value: undefined }
  | { type: "InvalidEraToReward"; value: undefined }
  | { type: "InvalidNumberOfNominations"; value: undefined }
  | { type: "NotSortedAndUnique"; value: undefined }
  | { type: "AlreadyClaimed"; value: undefined }
  | { type: "IncorrectHistoryDepth"; value: undefined }
  | { type: "IncorrectSlashingSpans"; value: undefined }
  | { type: "BadState"; value: undefined }
  | { type: "TooManyTargets"; value: undefined }
  | { type: "BadTarget"; value: undefined }
  | { type: "CannotChillOther"; value: undefined }
  | { type: "TooManyNominators"; value: undefined }
  | { type: "TooManyValidators"; value: undefined }
  | { type: "CommissionTooLow"; value: undefined }
  | { type: "BoundNotMet"; value: undefined }
>

// pallet_session,pallet,Error
// 1e07dgbaqd1sq
type SessionPalletError = Enum<
  | { type: "InvalidProof"; value: undefined }
  | { type: "NoAssociatedValidatorId"; value: undefined }
  | { type: "DuplicatedKey"; value: undefined }
  | { type: "NoKeys"; value: undefined }
  | { type: "NoAccount"; value: undefined }
>

// pallet_grandpa,StoredState
// 66mc66cqnpat1
type GrandpaStoredState = Enum<
  | { type: "Live"; value: undefined }
  | { type: "PendingPause"; value: Anonymize<Ib95oqfalvjqfe> }
  | { type: "Paused"; value: undefined }
  | { type: "PendingResume"; value: Anonymize<Ib95oqfalvjqfe> }
>

// pallet_grandpa,pallet,Error
// 7q8i0pp1gkas6
type GrandpaPalletError = Enum<
  | { type: "PauseFailed"; value: undefined }
  | { type: "ResumeFailed"; value: undefined }
  | { type: "ChangePending"; value: undefined }
  | { type: "TooSoon"; value: undefined }
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "InvalidEquivocationProof"; value: undefined }
  | { type: "DuplicateOffenceReport"; value: undefined }
>

// pallet_im_online,pallet,Error
// 8kh6j0q1r930d
type ImOnlinePalletError = Enum<
  | { type: "InvalidKey"; value: undefined }
  | { type: "DuplicatedHeartbeat"; value: undefined }
>

// pallet_treasury,pallet,Error
// f3i79pgq40jm0
type TreasuryPalletError = Enum<
  | { type: "InsufficientProposersBalance"; value: undefined }
  | { type: "InvalidIndex"; value: undefined }
  | { type: "TooManyApprovals"; value: undefined }
  | { type: "InsufficientPermission"; value: undefined }
  | { type: "ProposalNotApproved"; value: undefined }
>

// pallet_conviction_voting,vote,Voting
// e5ojv0odma80
type ConvictionVotingVoteVoting = Enum<
  | { type: "Casting"; value: Anonymize<If52hjr5c5nrc5> }
  | { type: "Delegating"; value: Anonymize<I77dj6ku8n5d58> }
>

// pallet_conviction_voting,pallet,Error
// dfa8k8ikssbsf
type ConvictionVotingPalletError = Enum<
  | { type: "NotOngoing"; value: undefined }
  | { type: "NotVoter"; value: undefined }
  | { type: "NoPermission"; value: undefined }
  | { type: "NoPermissionYet"; value: undefined }
  | { type: "AlreadyDelegating"; value: undefined }
  | { type: "AlreadyVoting"; value: undefined }
  | { type: "InsufficientFunds"; value: undefined }
  | { type: "NotDelegating"; value: undefined }
  | { type: "Nonsense"; value: undefined }
  | { type: "MaxVotesReached"; value: undefined }
  | { type: "ClassNeeded"; value: undefined }
  | { type: "BadClass"; value: undefined }
>

// pallet_referenda,types,ReferendumInfo
// a7j6l4e7oe7ln
type ReferendaTypesReferendumInfo = Enum<
  | { type: "Ongoing"; value: Anonymize<Iec63114qk6dsm> }
  | { type: "Approved"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Rejected"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Cancelled"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "TimedOut"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Killed"; value: Anonymize<number> }
>

// pallet_referenda,types,Curve
// 926pkc9itkbdk
type ReferendaTypesCurve = Enum<
  | { type: "LinearDecreasing"; value: Anonymize<Idcpso832hml3u> }
  | { type: "SteppedDecreasing"; value: Anonymize<I5qiv0grkufa8l> }
  | { type: "Reciprocal"; value: Anonymize<I58l93su2gte4i> }
>

// pallet_referenda,pallet,Error
// 8oq2c4augjrlt
type ReferendaPalletError = Enum<
  | { type: "NotOngoing"; value: undefined }
  | { type: "HasDeposit"; value: undefined }
  | { type: "BadTrack"; value: undefined }
  | { type: "Full"; value: undefined }
  | { type: "QueueEmpty"; value: undefined }
  | { type: "BadReferendum"; value: undefined }
  | { type: "NothingToDo"; value: undefined }
  | { type: "NoTrack"; value: undefined }
  | { type: "Unfinished"; value: undefined }
  | { type: "NoPermission"; value: undefined }
  | { type: "NoDeposit"; value: undefined }
  | { type: "BadStatus"; value: undefined }
  | { type: "PreimageNotExist"; value: undefined }
>

// pallet_whitelist,pallet,Error
// 15nctscutpbeh
type WhitelistPalletError = Enum<
  | { type: "UnavailablePreImage"; value: undefined }
  | { type: "UndecodableCall"; value: undefined }
  | { type: "InvalidCallWeightWitness"; value: undefined }
  | { type: "CallIsNotWhitelisted"; value: undefined }
  | { type: "CallAlreadyWhitelisted"; value: undefined }
>

// polkadot_runtime_common,claims,pallet,Error
// jh2jbbqvb176
type CommonClaimsPalletError = Enum<
  | { type: "InvalidEthereumSignature"; value: undefined }
  | { type: "SignerHasNoClaim"; value: undefined }
  | { type: "SenderHasNoClaim"; value: undefined }
  | { type: "PotUnderflow"; value: undefined }
  | { type: "InvalidStatement"; value: undefined }
  | { type: "VestedBalanceExists"; value: undefined }
>

// pallet_vesting,Releases
// cuaiiptinb4jf
type VestingReleases = Enum<
  { type: "V0"; value: undefined } | { type: "V1"; value: undefined }
>

// pallet_vesting,pallet,Error
// cof2acl69lq3c
type VestingPalletError = Enum<
  | { type: "NotVesting"; value: undefined }
  | { type: "AtMaxVestingSchedules"; value: undefined }
  | { type: "AmountLow"; value: undefined }
  | { type: "ScheduleIndexOutOfBounds"; value: undefined }
  | { type: "InvalidScheduleParams"; value: undefined }
>

// pallet_utility,pallet,Error
// 8dt2g2hcrgh36
type UtilityPalletError = Enum<{ type: "TooManyCalls"; value: undefined }>

// pallet_identity,pallet,Error
// 4burhm31qmut2
type IdentityPalletError = Enum<
  | { type: "TooManySubAccounts"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "NotNamed"; value: undefined }
  | { type: "EmptyIndex"; value: undefined }
  | { type: "FeeChanged"; value: undefined }
  | { type: "NoIdentity"; value: undefined }
  | { type: "StickyJudgement"; value: undefined }
  | { type: "JudgementGiven"; value: undefined }
  | { type: "InvalidJudgement"; value: undefined }
  | { type: "InvalidIndex"; value: undefined }
  | { type: "InvalidTarget"; value: undefined }
  | { type: "TooManyFields"; value: undefined }
  | { type: "TooManyRegistrars"; value: undefined }
  | { type: "AlreadyClaimed"; value: undefined }
  | { type: "NotSub"; value: undefined }
  | { type: "NotOwned"; value: undefined }
  | { type: "JudgementForDifferentIdentity"; value: undefined }
  | { type: "JudgementPaymentFailed"; value: undefined }
>

// pallet_proxy,pallet,Error
// uvt54ei4cehc
type ProxyPalletError = Enum<
  | { type: "TooMany"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "NotProxy"; value: undefined }
  | { type: "Unproxyable"; value: undefined }
  | { type: "Duplicate"; value: undefined }
  | { type: "NoPermission"; value: undefined }
  | { type: "Unannounced"; value: undefined }
  | { type: "NoSelfProxy"; value: undefined }
>

// pallet_multisig,pallet,Error
// a76qmhhg4jvb9
type MultisigPalletError = Enum<
  | { type: "MinimumThreshold"; value: undefined }
  | { type: "AlreadyApproved"; value: undefined }
  | { type: "NoApprovalsNeeded"; value: undefined }
  | { type: "TooFewSignatories"; value: undefined }
  | { type: "TooManySignatories"; value: undefined }
  | { type: "SignatoriesOutOfOrder"; value: undefined }
  | { type: "SenderInSignatories"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "NotOwner"; value: undefined }
  | { type: "NoTimepoint"; value: undefined }
  | { type: "WrongTimepoint"; value: undefined }
  | { type: "UnexpectedTimepoint"; value: undefined }
  | { type: "MaxWeightTooLow"; value: undefined }
  | { type: "AlreadyStored"; value: undefined }
>

// pallet_bounties,BountyStatus
// 8eicfpc71dtp2
type BountiesBountyStatus = Enum<
  | { type: "Proposed"; value: undefined }
  | { type: "Approved"; value: undefined }
  | { type: "Funded"; value: undefined }
  | { type: "CuratorProposed"; value: Anonymize<I846573mdj1pfn> }
  | { type: "Active"; value: Anonymize<I5s3sqq6r9nt63> }
  | { type: "PendingPayout"; value: Anonymize<I4aulgjqrdphrm> }
>

// pallet_bounties,pallet,Error
// bfvjqqblobf53
type BountiesPalletError = Enum<
  | { type: "InsufficientProposersBalance"; value: undefined }
  | { type: "InvalidIndex"; value: undefined }
  | { type: "ReasonTooBig"; value: undefined }
  | { type: "UnexpectedStatus"; value: undefined }
  | { type: "RequireCurator"; value: undefined }
  | { type: "InvalidValue"; value: undefined }
  | { type: "InvalidFee"; value: undefined }
  | { type: "PendingPayout"; value: undefined }
  | { type: "Premature"; value: undefined }
  | { type: "HasActiveChildBounty"; value: undefined }
  | { type: "TooManyQueued"; value: undefined }
>

// pallet_child_bounties,ChildBountyStatus
// 8fgf6e6g02u7k
type ChildBountyStatus = Enum<
  | { type: "Added"; value: undefined }
  | { type: "CuratorProposed"; value: Anonymize<I846573mdj1pfn> }
  | { type: "Active"; value: Anonymize<I846573mdj1pfn> }
  | { type: "PendingPayout"; value: Anonymize<I4aulgjqrdphrm> }
>

// pallet_child_bounties,pallet,Error
// 4u5ou5u3tthff
type ChildBountiesPalletError = Enum<
  | { type: "ParentBountyNotActive"; value: undefined }
  | { type: "InsufficientBountyBalance"; value: undefined }
  | { type: "TooManyChildBounties"; value: undefined }
>

// pallet_election_provider_multi_phase,pallet,Error
// aldi0cb4r5uls
type ElectionProviderMultiPhasePalletError = Enum<
  | { type: "PreDispatchEarlySubmission"; value: undefined }
  | { type: "PreDispatchWrongWinnerCount"; value: undefined }
  | { type: "PreDispatchWeakSubmission"; value: undefined }
  | { type: "SignedQueueFull"; value: undefined }
  | { type: "SignedCannotPayDeposit"; value: undefined }
  | { type: "SignedInvalidWitness"; value: undefined }
  | { type: "SignedTooMuchWeight"; value: undefined }
  | { type: "OcwCallWrongEra"; value: undefined }
  | { type: "MissingSnapshotMetadata"; value: undefined }
  | { type: "InvalidSubmissionIndex"; value: undefined }
  | { type: "CallNotAllowed"; value: undefined }
  | { type: "FallbackFailed"; value: undefined }
  | { type: "BoundNotMet"; value: undefined }
  | { type: "TooManyWinners"; value: undefined }
>

// pallet_bags_list,pallet,Error
// c35l5bgiij29p
type BagsListPalletError = Enum<{
  type: "List"
  value: Anonymize<BagsListListListError>
}>

// pallet_bags_list,list,ListError
// 5h5t0elhnbseq
type BagsListListListError = Enum<
  | { type: "Duplicate"; value: undefined }
  | { type: "NotHeavier"; value: undefined }
  | { type: "NotInSameBag"; value: undefined }
  | { type: "NodeNotFound"; value: undefined }
>

// pallet_nomination_pools,pallet,Error
// 1s3i1fsqjpvr8
type NominationPoolsPalletError = Enum<
  | { type: "PoolNotFound"; value: undefined }
  | { type: "PoolMemberNotFound"; value: undefined }
  | { type: "RewardPoolNotFound"; value: undefined }
  | { type: "SubPoolsNotFound"; value: undefined }
  | { type: "AccountBelongsToOtherPool"; value: undefined }
  | { type: "FullyUnbonding"; value: undefined }
  | { type: "MaxUnbondingLimit"; value: undefined }
  | { type: "CannotWithdrawAny"; value: undefined }
  | { type: "MinimumBondNotMet"; value: undefined }
  | { type: "OverflowRisk"; value: undefined }
  | { type: "NotDestroying"; value: undefined }
  | { type: "NotNominator"; value: undefined }
  | { type: "NotKickerOrDestroying"; value: undefined }
  | { type: "NotOpen"; value: undefined }
  | { type: "MaxPools"; value: undefined }
  | { type: "MaxPoolMembers"; value: undefined }
  | { type: "CanNotChangeState"; value: undefined }
  | { type: "DoesNotHavePermission"; value: undefined }
  | { type: "MetadataExceedsMaxLen"; value: undefined }
  | { type: "Defensive"; value: Anonymize<NominationPoolsPalletDefensiveError> }
  | { type: "PartialUnbondNotAllowedPermissionlessly"; value: undefined }
  | { type: "MaxCommissionRestricted"; value: undefined }
  | { type: "CommissionExceedsMaximum"; value: undefined }
  | { type: "CommissionExceedsGlobalMaximum"; value: undefined }
  | { type: "CommissionChangeThrottled"; value: undefined }
  | { type: "CommissionChangeRateNotAllowed"; value: undefined }
  | { type: "NoPendingCommission"; value: undefined }
  | { type: "NoCommissionCurrentSet"; value: undefined }
  | { type: "PoolIdInUse"; value: undefined }
  | { type: "InvalidPoolId"; value: undefined }
  | { type: "BondExtraRestricted"; value: undefined }
>

// pallet_nomination_pools,pallet,DefensiveError
// 8s9terlv6i0tr
type NominationPoolsPalletDefensiveError = Enum<
  | { type: "NotEnoughSpaceInUnbondPool"; value: undefined }
  | { type: "PoolNotFound"; value: undefined }
  | { type: "RewardPoolNotFound"; value: undefined }
  | { type: "SubPoolsNotFound"; value: undefined }
  | { type: "BondedStashKilledPrematurely"; value: undefined }
>

// pallet_fast_unstake,pallet,Error
// au9bur8dc3bec
type FastUnstakePalletError = Enum<
  | { type: "NotController"; value: undefined }
  | { type: "AlreadyQueued"; value: undefined }
  | { type: "NotFullyBonded"; value: undefined }
  | { type: "NotQueued"; value: undefined }
  | { type: "AlreadyHead"; value: undefined }
  | { type: "CallNotAllowed"; value: undefined }
>

// polkadot_runtime_parachains,configuration,pallet,Error
// n1jctfv299lm
type ParachainsConfigurationPalletError = Enum<{
  type: "InvalidNewValue"
  value: undefined
}>

// polkadot_runtime_parachains,inclusion,pallet,Error
// dp335n5ul2mnv
type ParachainsInclusionPalletError = Enum<
  | { type: "UnsortedOrDuplicateValidatorIndices"; value: undefined }
  | { type: "UnsortedOrDuplicateDisputeStatementSet"; value: undefined }
  | { type: "UnsortedOrDuplicateBackedCandidates"; value: undefined }
  | { type: "UnexpectedRelayParent"; value: undefined }
  | { type: "WrongBitfieldSize"; value: undefined }
  | { type: "BitfieldAllZeros"; value: undefined }
  | { type: "BitfieldDuplicateOrUnordered"; value: undefined }
  | { type: "ValidatorIndexOutOfBounds"; value: undefined }
  | { type: "InvalidBitfieldSignature"; value: undefined }
  | { type: "UnscheduledCandidate"; value: undefined }
  | { type: "CandidateScheduledBeforeParaFree"; value: undefined }
  | { type: "ScheduledOutOfOrder"; value: undefined }
  | { type: "HeadDataTooLarge"; value: undefined }
  | { type: "PrematureCodeUpgrade"; value: undefined }
  | { type: "NewCodeTooLarge"; value: undefined }
  | { type: "DisallowedRelayParent"; value: undefined }
  | { type: "InvalidAssignment"; value: undefined }
  | { type: "InvalidGroupIndex"; value: undefined }
  | { type: "InsufficientBacking"; value: undefined }
  | { type: "InvalidBacking"; value: undefined }
  | { type: "NotCollatorSigned"; value: undefined }
  | { type: "ValidationDataHashMismatch"; value: undefined }
  | { type: "IncorrectDownwardMessageHandling"; value: undefined }
  | { type: "InvalidUpwardMessages"; value: undefined }
  | { type: "HrmpWatermarkMishandling"; value: undefined }
  | { type: "InvalidOutboundHrmp"; value: undefined }
  | { type: "InvalidValidationCodeHash"; value: undefined }
  | { type: "ParaHeadMismatch"; value: undefined }
  | { type: "BitfieldReferencesFreedCore"; value: undefined }
>

// polkadot_runtime_parachains,paras_inherent,pallet,Error
// au1n8bje17hl9
type ParachainsParasInherentPalletError = Enum<
  | { type: "TooManyInclusionInherents"; value: undefined }
  | { type: "InvalidParentHeader"; value: undefined }
  | { type: "CandidateConcludedInvalid"; value: undefined }
  | { type: "InherentOverweight"; value: undefined }
  | { type: "DisputeStatementsUnsortedOrDuplicates"; value: undefined }
  | { type: "DisputeInvalid"; value: undefined }
>

// polkadot_primitives,v5,CoreOccupied
// b19964q7gq7o9
type PolkadotPrimitivesV5CoreOccupied = Enum<
  | { type: "Free"; value: undefined }
  | { type: "Paras"; value: Anonymize<I7kvbv2iq0pupl> }
>

// polkadot_runtime_parachains,paras,PvfCheckCause
// 8dtf4dr89ksvh
type ParachainsParasPvfCheckCause = Enum<
  | { type: "Onboarding"; value: Anonymize<number> }
  | { type: "Upgrade"; value: Anonymize<I4gl5i10pri3l6> }
>

// polkadot_runtime_parachains,paras,ParaLifecycle
// 341grmvm6j3e5
type ParachainsParasParaLifecycle = Enum<
  | { type: "Onboarding"; value: undefined }
  | { type: "Parathread"; value: undefined }
  | { type: "Parachain"; value: undefined }
  | { type: "UpgradingParathread"; value: undefined }
  | { type: "DowngradingParachain"; value: undefined }
  | { type: "OffboardingParathread"; value: undefined }
  | { type: "OffboardingParachain"; value: undefined }
>

// polkadot_primitives,v5,UpgradeGoAhead
// f331um1stp6g0
type PolkadotPrimitivesV5UpgradeGoAhead = Enum<
  { type: "Abort"; value: undefined } | { type: "GoAhead"; value: undefined }
>

// polkadot_primitives,v5,UpgradeRestriction
// 9pobt6o24rqdc
type PolkadotPrimitivesV5UpgradeRestriction = Enum<{
  type: "Present"
  value: undefined
}>

// polkadot_runtime_parachains,paras,pallet,Error
// bkrdj74n62tfq
type ParachainsParasPalletError = Enum<
  | { type: "NotRegistered"; value: undefined }
  | { type: "CannotOnboard"; value: undefined }
  | { type: "CannotOffboard"; value: undefined }
  | { type: "CannotUpgrade"; value: undefined }
  | { type: "CannotDowngrade"; value: undefined }
  | { type: "PvfCheckStatementStale"; value: undefined }
  | { type: "PvfCheckStatementFuture"; value: undefined }
  | { type: "PvfCheckValidatorIndexOutOfBounds"; value: undefined }
  | { type: "PvfCheckInvalidSignature"; value: undefined }
  | { type: "PvfCheckDoubleVote"; value: undefined }
  | { type: "PvfCheckSubjectInvalid"; value: undefined }
  | { type: "CannotUpgradeCode"; value: undefined }
>

// polkadot_runtime_parachains,hrmp,pallet,Error
// fvc08hks5b16p
type ParachainsHrmpPalletError = Enum<
  | { type: "OpenHrmpChannelToSelf"; value: undefined }
  | { type: "OpenHrmpChannelInvalidRecipient"; value: undefined }
  | { type: "OpenHrmpChannelZeroCapacity"; value: undefined }
  | { type: "OpenHrmpChannelCapacityExceedsLimit"; value: undefined }
  | { type: "OpenHrmpChannelZeroMessageSize"; value: undefined }
  | { type: "OpenHrmpChannelMessageSizeExceedsLimit"; value: undefined }
  | { type: "OpenHrmpChannelAlreadyExists"; value: undefined }
  | { type: "OpenHrmpChannelAlreadyRequested"; value: undefined }
  | { type: "OpenHrmpChannelLimitExceeded"; value: undefined }
  | { type: "AcceptHrmpChannelDoesntExist"; value: undefined }
  | { type: "AcceptHrmpChannelAlreadyConfirmed"; value: undefined }
  | { type: "AcceptHrmpChannelLimitExceeded"; value: undefined }
  | { type: "CloseHrmpChannelUnauthorized"; value: undefined }
  | { type: "CloseHrmpChannelDoesntExist"; value: undefined }
  | { type: "CloseHrmpChannelAlreadyUnderway"; value: undefined }
  | { type: "CancelHrmpOpenChannelUnauthorized"; value: undefined }
  | { type: "OpenHrmpChannelDoesntExist"; value: undefined }
  | { type: "OpenHrmpChannelAlreadyConfirmed"; value: undefined }
  | { type: "WrongWitness"; value: undefined }
>

// polkadot_runtime_parachains,disputes,pallet,Error
// akburbqot4g58
type ParachainsDisputesPalletError = Enum<
  | { type: "DuplicateDisputeStatementSets"; value: undefined }
  | { type: "AncientDisputeStatement"; value: undefined }
  | { type: "ValidatorIndexOutOfBounds"; value: undefined }
  | { type: "InvalidSignature"; value: undefined }
  | { type: "DuplicateStatement"; value: undefined }
  | { type: "SingleSidedDispute"; value: undefined }
  | { type: "MaliciousBacker"; value: undefined }
  | { type: "MissingBackingVotes"; value: undefined }
  | { type: "UnconfirmedDispute"; value: undefined }
>

// polkadot_runtime_parachains,disputes,slashing,pallet,Error
// 1v70p1j0r2q1j
type ParachainsDisputesSlashingPalletError = Enum<
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "InvalidSessionIndex"; value: undefined }
  | { type: "InvalidCandidateHash"; value: undefined }
  | { type: "InvalidValidatorIndex"; value: undefined }
  | { type: "ValidatorIndexIdMismatch"; value: undefined }
  | { type: "DuplicateSlashingReport"; value: undefined }
>

// polkadot_runtime_common,paras_registrar,pallet,Error
// 2dgbmoac0j5l9
type CommonParasRegistrarPalletError = Enum<
  | { type: "NotRegistered"; value: undefined }
  | { type: "AlreadyRegistered"; value: undefined }
  | { type: "NotOwner"; value: undefined }
  | { type: "CodeTooLarge"; value: undefined }
  | { type: "HeadDataTooLarge"; value: undefined }
  | { type: "NotParachain"; value: undefined }
  | { type: "NotParathread"; value: undefined }
  | { type: "CannotDeregister"; value: undefined }
  | { type: "CannotDowngrade"; value: undefined }
  | { type: "CannotUpgrade"; value: undefined }
  | { type: "ParaLocked"; value: undefined }
  | { type: "NotReserved"; value: undefined }
  | { type: "EmptyCode"; value: undefined }
  | { type: "CannotSwap"; value: undefined }
>

// polkadot_runtime_common,slots,pallet,Error
// ers095sa65pbg
type CommonSlotsPalletError = Enum<
  | { type: "ParaNotOnboarding"; value: undefined }
  | { type: "LeaseError"; value: undefined }
>

// polkadot_runtime_common,auctions,pallet,Error
// 4kgo47o2v3701
type CommonAuctionsPalletError = Enum<
  | { type: "AuctionInProgress"; value: undefined }
  | { type: "LeasePeriodInPast"; value: undefined }
  | { type: "ParaNotRegistered"; value: undefined }
  | { type: "NotCurrentAuction"; value: undefined }
  | { type: "NotAuction"; value: undefined }
  | { type: "AuctionEnded"; value: undefined }
  | { type: "AlreadyLeasedOut"; value: undefined }
>

// polkadot_runtime_common,crowdloan,LastContribution
// 1rjg0rh02tt4m
type CommonCrowdloanLastContribution = Enum<
  | { type: "Never"; value: undefined }
  | { type: "PreEnding"; value: Anonymize<number> }
  | { type: "Ending"; value: Anonymize<number> }
>

// polkadot_runtime_common,crowdloan,pallet,Error
// 9o6l1c4r4qc3s
type CommonCrowdloanPalletError = Enum<
  | { type: "FirstPeriodInPast"; value: undefined }
  | { type: "FirstPeriodTooFarInFuture"; value: undefined }
  | { type: "LastPeriodBeforeFirstPeriod"; value: undefined }
  | { type: "LastPeriodTooFarInFuture"; value: undefined }
  | { type: "CannotEndInPast"; value: undefined }
  | { type: "EndTooFarInFuture"; value: undefined }
  | { type: "Overflow"; value: undefined }
  | { type: "ContributionTooSmall"; value: undefined }
  | { type: "InvalidParaId"; value: undefined }
  | { type: "CapExceeded"; value: undefined }
  | { type: "ContributionPeriodOver"; value: undefined }
  | { type: "InvalidOrigin"; value: undefined }
  | { type: "NotParachain"; value: undefined }
  | { type: "LeaseActive"; value: undefined }
  | { type: "BidOrLeaseActive"; value: undefined }
  | { type: "FundNotEnded"; value: undefined }
  | { type: "NoContributions"; value: undefined }
  | { type: "NotReadyToDissolve"; value: undefined }
  | { type: "InvalidSignature"; value: undefined }
  | { type: "MemoTooLarge"; value: undefined }
  | { type: "AlreadyInNewRaise"; value: undefined }
  | { type: "VrfDelayInProgress"; value: undefined }
  | { type: "NoLeasePeriod"; value: undefined }
>

// pallet_xcm,pallet,QueryStatus
// 70hv9q4f7l6lo
type XcmPalletQueryStatus = Enum<
  | { type: "Pending"; value: Anonymize<Ichb9e5l86b18e> }
  | { type: "VersionNotifier"; value: Anonymize<I3mn2je4qtr2lg> }
  | { type: "Ready"; value: Anonymize<I7p4s7atk8cdq4> }
>

// xcm,VersionedResponse
// 6j42g3504c9ir
type XcmVersionedResponse = Enum<
  | { type: "V2"; value: Anonymize<XcmV2Response> }
  | { type: "V3"; value: Anonymize<XcmV3Response> }
>

// pallet_xcm,pallet,VersionMigrationStage
// 6c90ieeim9tjd
type XcmPalletVersionMigrationStage = Enum<
  | { type: "MigrateSupportedVersion"; value: undefined }
  | { type: "MigrateVersionNotifiers"; value: undefined }
  | { type: "NotifyCurrentTargets"; value: Anonymize<Iabpgqcjikia83> }
  | { type: "MigrateAndNotifyOldTargets"; value: undefined }
>

// xcm,VersionedAssetId
// 5d3g5d2drdfrc
type XcmVersionedAssetId = Enum<{
  type: "V3"
  value: Anonymize<XcmV3MultiassetAssetId>
}>

// pallet_xcm,pallet,Error
// 93avf3rpkhb2d
type XcmPalletError = Enum<
  | { type: "Unreachable"; value: undefined }
  | { type: "SendFailure"; value: undefined }
  | { type: "Filtered"; value: undefined }
  | { type: "UnweighableMessage"; value: undefined }
  | { type: "DestinationNotInvertible"; value: undefined }
  | { type: "Empty"; value: undefined }
  | { type: "CannotReanchor"; value: undefined }
  | { type: "TooManyAssets"; value: undefined }
  | { type: "InvalidOrigin"; value: undefined }
  | { type: "BadVersion"; value: undefined }
  | { type: "BadLocation"; value: undefined }
  | { type: "NoSubscription"; value: undefined }
  | { type: "AlreadySubscribed"; value: undefined }
  | { type: "InvalidAsset"; value: undefined }
  | { type: "LowBalance"; value: undefined }
  | { type: "TooManyLocks"; value: undefined }
  | { type: "AccountNotSovereign"; value: undefined }
  | { type: "FeesNotMet"; value: undefined }
  | { type: "LockNotFound"; value: undefined }
  | { type: "InUse"; value: undefined }
>

// pallet_message_queue,pallet,Error
// 3a4cqqjs0cj3s
type MessageQueuePalletError = Enum<
  | { type: "NotReapable"; value: undefined }
  | { type: "NoPage"; value: undefined }
  | { type: "NoMessage"; value: undefined }
  | { type: "AlreadyProcessed"; value: undefined }
  | { type: "Queued"; value: undefined }
  | { type: "InsufficientWeight"; value: undefined }
  | { type: "TemporarilyUnprocessable"; value: undefined }
  | { type: "QueuePaused"; value: undefined }
>

// frame_system,extensions,check_mortality,CheckMortality
// 8slcnsmtfbubd
type ExtensionsCheckMortality = Enum<
  | { type: "Immortal"; value: undefined }
  | { type: "Mortal1"; value: Anonymize<number> }
  | { type: "Mortal2"; value: Anonymize<number> }
  | { type: "Mortal3"; value: Anonymize<number> }
  | { type: "Mortal4"; value: Anonymize<number> }
  | { type: "Mortal5"; value: Anonymize<number> }
  | { type: "Mortal6"; value: Anonymize<number> }
  | { type: "Mortal7"; value: Anonymize<number> }
  | { type: "Mortal8"; value: Anonymize<number> }
  | { type: "Mortal9"; value: Anonymize<number> }
  | { type: "Mortal10"; value: Anonymize<number> }
  | { type: "Mortal11"; value: Anonymize<number> }
  | { type: "Mortal12"; value: Anonymize<number> }
  | { type: "Mortal13"; value: Anonymize<number> }
  | { type: "Mortal14"; value: Anonymize<number> }
  | { type: "Mortal15"; value: Anonymize<number> }
  | { type: "Mortal16"; value: Anonymize<number> }
  | { type: "Mortal17"; value: Anonymize<number> }
  | { type: "Mortal18"; value: Anonymize<number> }
  | { type: "Mortal19"; value: Anonymize<number> }
  | { type: "Mortal20"; value: Anonymize<number> }
  | { type: "Mortal21"; value: Anonymize<number> }
  | { type: "Mortal22"; value: Anonymize<number> }
  | { type: "Mortal23"; value: Anonymize<number> }
  | { type: "Mortal24"; value: Anonymize<number> }
  | { type: "Mortal25"; value: Anonymize<number> }
  | { type: "Mortal26"; value: Anonymize<number> }
  | { type: "Mortal27"; value: Anonymize<number> }
  | { type: "Mortal28"; value: Anonymize<number> }
  | { type: "Mortal29"; value: Anonymize<number> }
  | { type: "Mortal30"; value: Anonymize<number> }
  | { type: "Mortal31"; value: Anonymize<number> }
  | { type: "Mortal32"; value: Anonymize<number> }
  | { type: "Mortal33"; value: Anonymize<number> }
  | { type: "Mortal34"; value: Anonymize<number> }
  | { type: "Mortal35"; value: Anonymize<number> }
  | { type: "Mortal36"; value: Anonymize<number> }
  | { type: "Mortal37"; value: Anonymize<number> }
  | { type: "Mortal38"; value: Anonymize<number> }
  | { type: "Mortal39"; value: Anonymize<number> }
  | { type: "Mortal40"; value: Anonymize<number> }
  | { type: "Mortal41"; value: Anonymize<number> }
  | { type: "Mortal42"; value: Anonymize<number> }
  | { type: "Mortal43"; value: Anonymize<number> }
  | { type: "Mortal44"; value: Anonymize<number> }
  | { type: "Mortal45"; value: Anonymize<number> }
  | { type: "Mortal46"; value: Anonymize<number> }
  | { type: "Mortal47"; value: Anonymize<number> }
  | { type: "Mortal48"; value: Anonymize<number> }
  | { type: "Mortal49"; value: Anonymize<number> }
  | { type: "Mortal50"; value: Anonymize<number> }
  | { type: "Mortal51"; value: Anonymize<number> }
  | { type: "Mortal52"; value: Anonymize<number> }
  | { type: "Mortal53"; value: Anonymize<number> }
  | { type: "Mortal54"; value: Anonymize<number> }
  | { type: "Mortal55"; value: Anonymize<number> }
  | { type: "Mortal56"; value: Anonymize<number> }
  | { type: "Mortal57"; value: Anonymize<number> }
  | { type: "Mortal58"; value: Anonymize<number> }
  | { type: "Mortal59"; value: Anonymize<number> }
  | { type: "Mortal60"; value: Anonymize<number> }
  | { type: "Mortal61"; value: Anonymize<number> }
  | { type: "Mortal62"; value: Anonymize<number> }
  | { type: "Mortal63"; value: Anonymize<number> }
  | { type: "Mortal64"; value: Anonymize<number> }
  | { type: "Mortal65"; value: Anonymize<number> }
  | { type: "Mortal66"; value: Anonymize<number> }
  | { type: "Mortal67"; value: Anonymize<number> }
  | { type: "Mortal68"; value: Anonymize<number> }
  | { type: "Mortal69"; value: Anonymize<number> }
  | { type: "Mortal70"; value: Anonymize<number> }
  | { type: "Mortal71"; value: Anonymize<number> }
  | { type: "Mortal72"; value: Anonymize<number> }
  | { type: "Mortal73"; value: Anonymize<number> }
  | { type: "Mortal74"; value: Anonymize<number> }
  | { type: "Mortal75"; value: Anonymize<number> }
  | { type: "Mortal76"; value: Anonymize<number> }
  | { type: "Mortal77"; value: Anonymize<number> }
  | { type: "Mortal78"; value: Anonymize<number> }
  | { type: "Mortal79"; value: Anonymize<number> }
  | { type: "Mortal80"; value: Anonymize<number> }
  | { type: "Mortal81"; value: Anonymize<number> }
  | { type: "Mortal82"; value: Anonymize<number> }
  | { type: "Mortal83"; value: Anonymize<number> }
  | { type: "Mortal84"; value: Anonymize<number> }
  | { type: "Mortal85"; value: Anonymize<number> }
  | { type: "Mortal86"; value: Anonymize<number> }
  | { type: "Mortal87"; value: Anonymize<number> }
  | { type: "Mortal88"; value: Anonymize<number> }
  | { type: "Mortal89"; value: Anonymize<number> }
  | { type: "Mortal90"; value: Anonymize<number> }
  | { type: "Mortal91"; value: Anonymize<number> }
  | { type: "Mortal92"; value: Anonymize<number> }
  | { type: "Mortal93"; value: Anonymize<number> }
  | { type: "Mortal94"; value: Anonymize<number> }
  | { type: "Mortal95"; value: Anonymize<number> }
  | { type: "Mortal96"; value: Anonymize<number> }
  | { type: "Mortal97"; value: Anonymize<number> }
  | { type: "Mortal98"; value: Anonymize<number> }
  | { type: "Mortal99"; value: Anonymize<number> }
  | { type: "Mortal100"; value: Anonymize<number> }
  | { type: "Mortal101"; value: Anonymize<number> }
  | { type: "Mortal102"; value: Anonymize<number> }
  | { type: "Mortal103"; value: Anonymize<number> }
  | { type: "Mortal104"; value: Anonymize<number> }
  | { type: "Mortal105"; value: Anonymize<number> }
  | { type: "Mortal106"; value: Anonymize<number> }
  | { type: "Mortal107"; value: Anonymize<number> }
  | { type: "Mortal108"; value: Anonymize<number> }
  | { type: "Mortal109"; value: Anonymize<number> }
  | { type: "Mortal110"; value: Anonymize<number> }
  | { type: "Mortal111"; value: Anonymize<number> }
  | { type: "Mortal112"; value: Anonymize<number> }
  | { type: "Mortal113"; value: Anonymize<number> }
  | { type: "Mortal114"; value: Anonymize<number> }
  | { type: "Mortal115"; value: Anonymize<number> }
  | { type: "Mortal116"; value: Anonymize<number> }
  | { type: "Mortal117"; value: Anonymize<number> }
  | { type: "Mortal118"; value: Anonymize<number> }
  | { type: "Mortal119"; value: Anonymize<number> }
  | { type: "Mortal120"; value: Anonymize<number> }
  | { type: "Mortal121"; value: Anonymize<number> }
  | { type: "Mortal122"; value: Anonymize<number> }
  | { type: "Mortal123"; value: Anonymize<number> }
  | { type: "Mortal124"; value: Anonymize<number> }
  | { type: "Mortal125"; value: Anonymize<number> }
  | { type: "Mortal126"; value: Anonymize<number> }
  | { type: "Mortal127"; value: Anonymize<number> }
  | { type: "Mortal128"; value: Anonymize<number> }
  | { type: "Mortal129"; value: Anonymize<number> }
  | { type: "Mortal130"; value: Anonymize<number> }
  | { type: "Mortal131"; value: Anonymize<number> }
  | { type: "Mortal132"; value: Anonymize<number> }
  | { type: "Mortal133"; value: Anonymize<number> }
  | { type: "Mortal134"; value: Anonymize<number> }
  | { type: "Mortal135"; value: Anonymize<number> }
  | { type: "Mortal136"; value: Anonymize<number> }
  | { type: "Mortal137"; value: Anonymize<number> }
  | { type: "Mortal138"; value: Anonymize<number> }
  | { type: "Mortal139"; value: Anonymize<number> }
  | { type: "Mortal140"; value: Anonymize<number> }
  | { type: "Mortal141"; value: Anonymize<number> }
  | { type: "Mortal142"; value: Anonymize<number> }
  | { type: "Mortal143"; value: Anonymize<number> }
  | { type: "Mortal144"; value: Anonymize<number> }
  | { type: "Mortal145"; value: Anonymize<number> }
  | { type: "Mortal146"; value: Anonymize<number> }
  | { type: "Mortal147"; value: Anonymize<number> }
  | { type: "Mortal148"; value: Anonymize<number> }
  | { type: "Mortal149"; value: Anonymize<number> }
  | { type: "Mortal150"; value: Anonymize<number> }
  | { type: "Mortal151"; value: Anonymize<number> }
  | { type: "Mortal152"; value: Anonymize<number> }
  | { type: "Mortal153"; value: Anonymize<number> }
  | { type: "Mortal154"; value: Anonymize<number> }
  | { type: "Mortal155"; value: Anonymize<number> }
  | { type: "Mortal156"; value: Anonymize<number> }
  | { type: "Mortal157"; value: Anonymize<number> }
  | { type: "Mortal158"; value: Anonymize<number> }
  | { type: "Mortal159"; value: Anonymize<number> }
  | { type: "Mortal160"; value: Anonymize<number> }
  | { type: "Mortal161"; value: Anonymize<number> }
  | { type: "Mortal162"; value: Anonymize<number> }
  | { type: "Mortal163"; value: Anonymize<number> }
  | { type: "Mortal164"; value: Anonymize<number> }
  | { type: "Mortal165"; value: Anonymize<number> }
  | { type: "Mortal166"; value: Anonymize<number> }
  | { type: "Mortal167"; value: Anonymize<number> }
  | { type: "Mortal168"; value: Anonymize<number> }
  | { type: "Mortal169"; value: Anonymize<number> }
  | { type: "Mortal170"; value: Anonymize<number> }
  | { type: "Mortal171"; value: Anonymize<number> }
  | { type: "Mortal172"; value: Anonymize<number> }
  | { type: "Mortal173"; value: Anonymize<number> }
  | { type: "Mortal174"; value: Anonymize<number> }
  | { type: "Mortal175"; value: Anonymize<number> }
  | { type: "Mortal176"; value: Anonymize<number> }
  | { type: "Mortal177"; value: Anonymize<number> }
  | { type: "Mortal178"; value: Anonymize<number> }
  | { type: "Mortal179"; value: Anonymize<number> }
  | { type: "Mortal180"; value: Anonymize<number> }
  | { type: "Mortal181"; value: Anonymize<number> }
  | { type: "Mortal182"; value: Anonymize<number> }
  | { type: "Mortal183"; value: Anonymize<number> }
  | { type: "Mortal184"; value: Anonymize<number> }
  | { type: "Mortal185"; value: Anonymize<number> }
  | { type: "Mortal186"; value: Anonymize<number> }
  | { type: "Mortal187"; value: Anonymize<number> }
  | { type: "Mortal188"; value: Anonymize<number> }
  | { type: "Mortal189"; value: Anonymize<number> }
  | { type: "Mortal190"; value: Anonymize<number> }
  | { type: "Mortal191"; value: Anonymize<number> }
  | { type: "Mortal192"; value: Anonymize<number> }
  | { type: "Mortal193"; value: Anonymize<number> }
  | { type: "Mortal194"; value: Anonymize<number> }
  | { type: "Mortal195"; value: Anonymize<number> }
  | { type: "Mortal196"; value: Anonymize<number> }
  | { type: "Mortal197"; value: Anonymize<number> }
  | { type: "Mortal198"; value: Anonymize<number> }
  | { type: "Mortal199"; value: Anonymize<number> }
  | { type: "Mortal200"; value: Anonymize<number> }
  | { type: "Mortal201"; value: Anonymize<number> }
  | { type: "Mortal202"; value: Anonymize<number> }
  | { type: "Mortal203"; value: Anonymize<number> }
  | { type: "Mortal204"; value: Anonymize<number> }
  | { type: "Mortal205"; value: Anonymize<number> }
  | { type: "Mortal206"; value: Anonymize<number> }
  | { type: "Mortal207"; value: Anonymize<number> }
  | { type: "Mortal208"; value: Anonymize<number> }
  | { type: "Mortal209"; value: Anonymize<number> }
  | { type: "Mortal210"; value: Anonymize<number> }
  | { type: "Mortal211"; value: Anonymize<number> }
  | { type: "Mortal212"; value: Anonymize<number> }
  | { type: "Mortal213"; value: Anonymize<number> }
  | { type: "Mortal214"; value: Anonymize<number> }
  | { type: "Mortal215"; value: Anonymize<number> }
  | { type: "Mortal216"; value: Anonymize<number> }
  | { type: "Mortal217"; value: Anonymize<number> }
  | { type: "Mortal218"; value: Anonymize<number> }
  | { type: "Mortal219"; value: Anonymize<number> }
  | { type: "Mortal220"; value: Anonymize<number> }
  | { type: "Mortal221"; value: Anonymize<number> }
  | { type: "Mortal222"; value: Anonymize<number> }
  | { type: "Mortal223"; value: Anonymize<number> }
  | { type: "Mortal224"; value: Anonymize<number> }
  | { type: "Mortal225"; value: Anonymize<number> }
  | { type: "Mortal226"; value: Anonymize<number> }
  | { type: "Mortal227"; value: Anonymize<number> }
  | { type: "Mortal228"; value: Anonymize<number> }
  | { type: "Mortal229"; value: Anonymize<number> }
  | { type: "Mortal230"; value: Anonymize<number> }
  | { type: "Mortal231"; value: Anonymize<number> }
  | { type: "Mortal232"; value: Anonymize<number> }
  | { type: "Mortal233"; value: Anonymize<number> }
  | { type: "Mortal234"; value: Anonymize<number> }
  | { type: "Mortal235"; value: Anonymize<number> }
  | { type: "Mortal236"; value: Anonymize<number> }
  | { type: "Mortal237"; value: Anonymize<number> }
  | { type: "Mortal238"; value: Anonymize<number> }
  | { type: "Mortal239"; value: Anonymize<number> }
  | { type: "Mortal240"; value: Anonymize<number> }
  | { type: "Mortal241"; value: Anonymize<number> }
  | { type: "Mortal242"; value: Anonymize<number> }
  | { type: "Mortal243"; value: Anonymize<number> }
  | { type: "Mortal244"; value: Anonymize<number> }
  | { type: "Mortal245"; value: Anonymize<number> }
  | { type: "Mortal246"; value: Anonymize<number> }
  | { type: "Mortal247"; value: Anonymize<number> }
  | { type: "Mortal248"; value: Anonymize<number> }
  | { type: "Mortal249"; value: Anonymize<number> }
  | { type: "Mortal250"; value: Anonymize<number> }
  | { type: "Mortal251"; value: Anonymize<number> }
  | { type: "Mortal252"; value: Anonymize<number> }
  | { type: "Mortal253"; value: Anonymize<number> }
  | { type: "Mortal254"; value: Anonymize<number> }
  | { type: "Mortal255"; value: Anonymize<number> }
>

// sp_runtime,transaction_validity,TransactionValidityError
// 8ur8bpe8ahbdb
type TransactionValidityError = Enum<
  | { type: "Invalid"; value: Anonymize<TransactionValidityInvalidTransaction> }
  | { type: "Unknown"; value: Anonymize<TransactionValidityUnknownTransaction> }
>

// sp_runtime,transaction_validity,InvalidTransaction
// 9jj84pbmaraa
type TransactionValidityInvalidTransaction = Enum<
  | { type: "Call"; value: undefined }
  | { type: "Payment"; value: undefined }
  | { type: "Future"; value: undefined }
  | { type: "Stale"; value: undefined }
  | { type: "BadProof"; value: undefined }
  | { type: "AncientBirthBlock"; value: undefined }
  | { type: "ExhaustsResources"; value: undefined }
  | { type: "Custom"; value: Anonymize<number> }
  | { type: "BadMandatory"; value: undefined }
  | { type: "MandatoryValidation"; value: undefined }
  | { type: "BadSigner"; value: undefined }
>

// sp_runtime,transaction_validity,UnknownTransaction
// avhrl5td7rf4q
type TransactionValidityUnknownTransaction = Enum<
  | { type: "CannotLookup"; value: undefined }
  | { type: "NoUnsignedValidator"; value: undefined }
  | { type: "Custom"; value: Anonymize<number> }
>

// sp_runtime,transaction_validity,TransactionSource
// cpkfkhj5jq924
type TransactionValidityTransactionSource = Enum<
  | { type: "InBlock"; value: undefined }
  | { type: "Local"; value: undefined }
  | { type: "External"; value: undefined }
>

// polkadot_primitives,v5,CoreState
// b5fd0r2ju9g0l
type PolkadotPrimitivesV5CoreState = Enum<
  | { type: "Occupied"; value: Anonymize<Iedrr54lmrujd0> }
  | { type: "Scheduled"; value: Anonymize<Ij0oq61lvrdfj> }
  | { type: "Free"; value: undefined }
>

// polkadot_primitives,v5,OccupiedCoreAssumption
// 4vbt6tkj8bvqs
type PolkadotPrimitivesV5OccupiedCoreAssumption = Enum<
  | { type: "Included"; value: undefined }
  | { type: "TimedOut"; value: undefined }
  | { type: "Free"; value: undefined }
>

// polkadot_primitives,v5,CandidateEvent
// 129huic8ces20
type PolkadotPrimitivesV5CandidateEvent = Enum<
  | { type: "CandidateBacked"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateIncluded"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateTimedOut"; value: Anonymize<Ievbvtucck5gnq> }
>

// sp_mmr_primitives,Error
// 6rjjsd07rc200
type MmrPrimitivesError = Enum<
  | { type: "InvalidNumericOp"; value: undefined }
  | { type: "Push"; value: undefined }
  | { type: "GetRoot"; value: undefined }
  | { type: "Commit"; value: undefined }
  | { type: "GenerateProof"; value: undefined }
  | { type: "Verify"; value: undefined }
  | { type: "LeafNotFound"; value: undefined }
  | { type: "PalletNotIncluded"; value: undefined }
  | { type: "InvalidLeafIndex"; value: undefined }
  | { type: "InvalidBestKnownBlock"; value: undefined }
>

// polkadot_runtime,RuntimeError
// 6g80grgit8ufa
type RuntimeError = Enum<
  | { type: "System"; value: Anonymize<PalletError> }
  | { type: "Scheduler"; value: Anonymize<SchedulerPalletError> }
  | { type: "Preimage"; value: Anonymize<PreimagePalletError> }
  | { type: "Babe"; value: Anonymize<BabePalletError> }
  | { type: "Indices"; value: Anonymize<IndicesPalletError> }
  | { type: "Balances"; value: Anonymize<BalancesPalletError> }
  | { type: "Staking"; value: Anonymize<StakingPalletError> }
  | { type: "Session"; value: Anonymize<SessionPalletError> }
  | { type: "Grandpa"; value: Anonymize<GrandpaPalletError> }
  | { type: "ImOnline"; value: Anonymize<ImOnlinePalletError> }
  | { type: "Treasury"; value: Anonymize<TreasuryPalletError> }
  | { type: "ConvictionVoting"; value: Anonymize<ConvictionVotingPalletError> }
  | { type: "Referenda"; value: Anonymize<ReferendaPalletError> }
  | { type: "Whitelist"; value: Anonymize<WhitelistPalletError> }
  | { type: "Claims"; value: Anonymize<PolkadotRuntimeCommonClaimsPalletError> }
  | { type: "Vesting"; value: Anonymize<VestingPalletError> }
  | { type: "Utility"; value: Anonymize<UtilityPalletError> }
  | { type: "Identity"; value: Anonymize<IdentityPalletError> }
  | { type: "Proxy"; value: Anonymize<ProxyPalletError> }
  | { type: "Multisig"; value: Anonymize<MultisigPalletError> }
  | { type: "Bounties"; value: Anonymize<BountiesPalletError> }
  | { type: "ChildBounties"; value: Anonymize<ChildBountiesPalletError> }
  | {
      type: "ElectionProviderMultiPhase"
      value: Anonymize<ElectionProviderMultiPhasePalletError>
    }
  | { type: "VoterList"; value: Anonymize<BagsListPalletError> }
  | { type: "NominationPools"; value: Anonymize<NominationPoolsPalletError> }
  | { type: "FastUnstake"; value: Anonymize<FastUnstakePalletError> }
  | {
      type: "Configuration"
      value: Anonymize<PolkadotRuntimeParachainsConfigurationPalletError>
    }
  | {
      type: "ParaInclusion"
      value: Anonymize<PolkadotRuntimeParachainsInclusionPalletError>
    }
  | {
      type: "ParaInherent"
      value: Anonymize<PolkadotRuntimeParachainsParasInherentPalletError>
    }
  | {
      type: "Paras"
      value: Anonymize<PolkadotRuntimeParachainsParasPalletError>
    }
  | { type: "Hrmp"; value: Anonymize<PolkadotRuntimeParachainsHrmpPalletError> }
  | {
      type: "ParasDisputes"
      value: Anonymize<PolkadotRuntimeParachainsDisputesPalletError>
    }
  | {
      type: "ParasSlashing"
      value: Anonymize<PolkadotRuntimeParachainsDisputesSlashingPalletError>
    }
  | {
      type: "Registrar"
      value: Anonymize<PolkadotRuntimeCommonParasRegistrarPalletError>
    }
  | { type: "Slots"; value: Anonymize<PolkadotRuntimeCommonSlotsPalletError> }
  | {
      type: "Auctions"
      value: Anonymize<PolkadotRuntimeCommonAuctionsPalletError>
    }
  | {
      type: "Crowdloan"
      value: Anonymize<PolkadotRuntimeCommonCrowdloanPalletError>
    }
  | { type: "XcmPallet"; value: Anonymize<XcmPalletError> }
  | { type: "MessageQueue"; value: Anonymize<MessageQueuePalletError> }
>

// 2dtccotemif6i
type WestendRuntimeRuntimeEvent

// 15jjq0jj438cq
type PalletEvent

// ao8h4hv7atnq3
type BalancesEvent

// 1vpsle7nk6bbf
type StakingEvent

// bju6hjiipokne
type IdentityEvent

// a4b928jbpau7j
type RecoveryEvent

// 9d4cj2o3vj1d8
type SchedulerEvent

// 346qm7n7jcer7
type SudoEvent

// 8rdpads1sa84
type ProxyEvent

// fbiij71gdkvth
type WestendRuntimeProxyType

// 14qmevhulqskl
type NominationPoolsEvent

// 1lanl0ouai2l7
type NominationPoolsCommissionClaimPermission

// 3buks4t5p9jo5
type WestendRuntimeRuntimeCall

// ekve0i6djpd9f
type PalletCall

// 68md1shlobg68
type BalancesPalletCall

// 3vrnp048j3b2d
type BalancesTypesAdjustmentDirection

// 4q47o0id5531b
type StakingPalletCall

// ceajactc9a8pc
type SessionPalletCall

// 7ai6hngrgci9q
type UtilityPalletCall

// j50joavafcok
type WestendRuntimeOriginCaller

// 3f4te0335d8h1
type WestendRuntimeGovernanceOriginsPalletCustomOriginsOrigin

// 5svrq9ei0ks3q
type XcmPalletOrigin

// faafmcb1jmm2o
type XcmV4Junctions

// 6ag633d941o7v
type XcmV4Junction

// 982q4n5eor6ih
type XcmV4JunctionNetworkId

// bd2atep95irq3
type IdentityPalletCall

// 9gk8gt7ihk77k
type RecoveryPalletCall

// 27bisdosp4kdo
type VestingPalletCall

// afl9u0rriejnl
type SchedulerPalletCall

// f81ks88t5mpk5
type PreimagePalletCall

// c8ick5jm5228d
type SudoPalletCall

// f3ubj8sbog6fs
type ProxyPalletCall

// f5k05q35kbr90
type MultisigPalletCall

// annvvkuhf73hh
type NominationPoolsPalletCall

// 4n17hls1edfih
type ReferendaPalletCall

// 4iujedjoq34sc
type WhitelistPalletCall

// e61dae9rhc6h9
type TreasuryPalletCall

// bg4htetmc9ijl
type PolkadotRuntimeCommonImplsVersionedLocatableAsset

// 6g50r303ureo1
type XcmV3Junctions

// evr61550o2b5r
type XcmV3MultiassetAssetId

// 9kia9e3c30f2q
type XcmVersionedLocation

// 5bn08pbgv7o6l
type PolkadotRuntimeParachainsConfigurationPalletCall

// 9fihu1euvgfa
type PolkadotPrimitivesV6ExecutorParamsExecutorParam

// c7d5cscq9c6gi
type PolkadotPrimitivesV6PvfPrepKind

// d5l4f3jqtnb0u
type PolkadotRuntimeParachainsParasInherentPalletCall

// bs56nuk6pe5bp
type PolkadotPrimitivesV6DisputeStatement

// bta4mfoh73fpt
type PolkadotPrimitivesV6ValidDisputeStatementKind

// 2vev2224bc186
type PolkadotRuntimeParachainsHrmpPalletCall

// 9s7urueli180g
type PolkadotRuntimeParachainsAssignerOnDemandPalletCall

// bttqq10i7n2oi
type PolkadotRuntimeCommonParasSudoWrapperPalletCall

// 9do7mabokdub7
type XcmVersionedXcm

// 72g8jajh3f07q
type XcmV3Instruction

// 6tjgvbhdp6u37
type XcmV3Response

// 7kciqhufi9efg
type XcmV3MultiassetMultiAssetFilter

// cmduam81snutq
type XcmV3MultiassetWildMultiAsset

// andndh150vhd7
type XcmV4Instruction

// csmfdagrgtkj5
type XcmV4Response

// biemf2h6nh9pa
type XcmV4AssetAssetFilter

// e252kk4p31sv6
type XcmV4AssetWildAsset

// dlqs78vqqscm0
type PolkadotRuntimeCommonAssignedSlotsPalletCall

// 910lmkjcsvii
type PolkadotRuntimeCommonAssignedSlotsSlotLeasePeriodStart

// em08ilhcfie6v
type PolkadotRuntimeParachainsCoretimePalletCall

// cgoc620vdl0ci
type BrokerCoretimeInterfaceCoreAssignment

// depofgn4a4b4b
type XcmPalletCall

// euovokrvq9if6
type XcmVersionedAssets

// as92ddpgmu2iq
type XcmVersionedXcm1

// 9pburd1ur9ru2
type XcmV3Instruction1

// ch16j3eggp2rk
type XcmV4Instruction1

// 1arg0adfjutke
type AssetRatePalletCall

// 9rkc7eqejp3rj
type RootTestingPalletCall

// 918ie8roegt3d
type BeefyPalletCall

// 67t4bps9r5c4k
type PolkadotRuntimeCommonIdentityMigratorPalletCall

// f6gbfd96s6jd9
type TreasuryEvent

// c4alvt16n58rg
type PolkadotRuntimeParachainsHrmpEvent

// 9ct52rvkkel07
type PolkadotRuntimeParachainsAssignerOnDemandEvent

// cn24k411b4s6t
type PolkadotRuntimeCommonAssignedSlotsEvent

// 7t5v4k056sf3d
type PolkadotRuntimeParachainsCoretimeEvent

// ceudajfn32ki2
type XcmEvent

// bnmfm52c5n7nq
type XcmV4TraitsOutcome

// 12mt5ojqi246n
type AssetRateEvent

// tofo38uukr3h
type RootTestingEvent

// 43e3ummb3h5dn
type PolkadotRuntimeCommonIdentityMigratorEvent

// 3bjnl897tu8j2
type PalletError

// 9uqvk3mspevjn
type BabeDigestsPreDigest

// 3nveejfjt6cjg
type WestendRuntimeRuntimeHoldReason

// hpogi4p6q6h5
type PreimagePalletHoldReason

// c1jnealhlqk0n
type WestendRuntimeRuntimeFreezeReason

// 8b4gf7pjdvue3
type NominationPoolsPalletFreezeReason

// dj13i7adlomht
type BalancesPalletError

// bklnaqjbd0mho
type StakingPalletError

// 9mq328955mgb8
type IdentityPalletError

// 29mqdjoga49c9
type RecoveryPalletError

// 2gj0h0im54fqd
type PreimageRequestStatus

// 4cfhml1prt4lu
type PreimagePalletError

// aug04qjhbli00
type SudoPalletError

// db84kfjd998sl
type ElectionProviderMultiPhasePalletError

// 823cj5ecot4us
type NominationPoolsPalletError

// 2pnuv6i9ju403
type ReferendaTypesReferendumInfo

// 8mdo9fqa201s6
type TreasuryPaymentState

// 7dodf8ccnun1b
type TreasuryPalletError

// dr9omiep0prh9
type PolkadotRuntimeParachainsParasInherentPalletError

// d7hag4aqiaqqv
type PolkadotRuntimeParachainsSchedulerPalletCoreOccupied

// f6qqn0nd8o1nf
type PolkadotRuntimeParachainsSchedulerCommonAssignment

// 14vn72umovb89
type PolkadotRuntimeParachainsParasPvfCheckCause

// eo97unb4d08rl
type PolkadotRuntimeParachainsParasPalletError

// bns95nfmm92df
type PolkadotRuntimeParachainsHrmpPalletError

// 5kmpac1lo149t
type PolkadotRuntimeParachainsAssignerOnDemandPalletError

// e3b9qd0nd59gs
type PolkadotRuntimeParachainsAssignerCoretimePalletError

// 97vkspnd0b8bh
type PolkadotRuntimeCommonParasRegistrarPalletError

// eq0677kv2oqb2
type PolkadotRuntimeCommonParasSudoWrapperPalletError

// 40te5bcfc046n
type PolkadotRuntimeCommonAssignedSlotsPalletError

// 53h5rnv8hd3qi
type PolkadotRuntimeParachainsCoretimePalletError

// 2o3sscokodbdt
type XcmPalletQueryStatus

// 2usnldb1e5p8n
type XcmVersionedResponse

// 5v8ssv6fbnm1b
type XcmVersionedAssetId

// 4s86iefmp2rcu
type XcmPalletError

// 5iupade5ag2dp
type MessageQueuePalletError

// 3qgd61cgli6cp
type AssetRatePalletError

// 8d4epped9g7uv
type WestendRuntimeRuntimeError
`
