import {
  SS58String,
  Binary,
  ResultPayload,
  StorageDescriptor,
  PlainDescriptor,
  TxDescriptor,
  RuntimeDescriptor,
  Enum,
  _Enum,
  GetEnum,
  QueryFromDescriptors,
  TxFromDescriptors,
  EventsFromDescriptors,
  ErrorsFromDescriptors,
  ConstFromDescriptors,
} from "@polkadot-api/client"

type AnonymousEnum<T extends {}> = T & {
  __anonymous: true
}

type IEnum<T extends {}> = Enum<
  {
    [K in keyof T & string]: { type: K; value: T[K] }
  }[keyof T & string]
>

type MyTuple<T> = [T, ...T[]]

type SeparateUndefined<T> = undefined extends T
  ? undefined | Exclude<T, undefined>
  : T

type Anonymize<T> = SeparateUndefined<
  T extends
    | string
    | number
    | bigint
    | boolean
    | void
    | undefined
    | null
    | symbol
    | Binary
    | Uint8Array
    | Enum<{ type: string; value: any }>
    ? T
    : T extends AnonymousEnum<infer V>
      ? IEnum<V>
      : T extends MyTuple<any>
        ? {
            [K in keyof T]: T[K]
          }
        : T extends []
          ? []
          : T extends Array<infer A>
            ? Array<A>
            : {
                [K in keyof T & string]: T[K]
              }
>

type I5sesotjlssv2d = {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: Anonymize<I1q8tnt1cluu5j>
}

type I1q8tnt1cluu5j = {
  free: bigint
  reserved: bigint
  frozen: bigint
  flags: bigint
}

type Iffmde3ekjedi9 = {
  normal: Anonymize<I4q39t5hn830vp>
  operational: Anonymize<I4q39t5hn830vp>
  mandatory: Anonymize<I4q39t5hn830vp>
}

type I4q39t5hn830vp = { ref_time: bigint; proof_size: bigint }

type Idin6nhq46lvdj = Array<DigestItem>

export type DigestItem = Enum<
  | { type: "PreRuntime"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Consensus"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Seal"; value: Anonymize<Idhk5e7nto8mrb> }
  | { type: "Other"; value: Anonymize<Binary> }
  | { type: "RuntimeEnvironmentUpdated"; value: undefined }
>
export const DigestItem = _Enum as unknown as GetEnum<DigestItem>

type Idhk5e7nto8mrb = [Binary, Binary]

type Iav1fkj39ai0lr = Array<Anonymize<I2s0spoacio2qd>>

type I2s0spoacio2qd = {
  phase: Phase
  event: Anonymize<I90b5dvk8dn9qn>
  topics: Anonymize<Idhnf6rtqoslea>
}

export type Phase = Enum<
  | { type: "ApplyExtrinsic"; value: Anonymize<number> }
  | { type: "Finalization"; value: undefined }
  | { type: "Initialization"; value: undefined }
>
export const Phase = _Enum as unknown as GetEnum<Phase>

type I90b5dvk8dn9qn = AnonymousEnum<{
  System: Anonymize<PalletEvent>
  Scheduler: Anonymize<SchedulerEvent>
  Preimage: Anonymize<PreimageEvent>
  Indices: Anonymize<IndicesEvent>
  Balances: Anonymize<BalancesEvent>
  TransactionPayment: Anonymize<TransactionPaymentEvent>
  Staking: Anonymize<I8ohb99n25uga8>
  Offences: Anonymize<OffencesEvent>
  Session: Anonymize<SessionEvent>
  Grandpa: Anonymize<GrandpaEvent>
  ImOnline: Anonymize<ImOnlineEvent>
  Treasury: Anonymize<I7pitd9gb68o89>
  ConvictionVoting: Anonymize<ConvictionVotingEvent>
  Referenda: Anonymize<ReferendaEvent>
  Whitelist: Anonymize<WhitelistEvent>
  Claims: Anonymize<CommonClaimsEvent>
  Vesting: Anonymize<VestingEvent>
  Utility: Anonymize<UtilityEvent>
  Identity: Anonymize<IdentityEvent>
  Proxy: Anonymize<ProxyEvent>
  Multisig: Anonymize<MultisigEvent>
  Bounties: Anonymize<Iei6k1tdcht3q>
  ChildBounties: Anonymize<ChildBountiesEvent>
  ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhaseEvent>
  VoterList: Anonymize<BagsListEvent>
  NominationPools: Anonymize<Id4j84j1rd7upd>
  FastUnstake: Anonymize<FastUnstakeEvent>
  ParaInclusion: Anonymize<ParachainsInclusionEvent>
  Paras: Anonymize<ParachainsParasEvent>
  Hrmp: Anonymize<Ic4alvt16n58rg>
  ParasDisputes: Anonymize<ParachainsDisputesEvent>
  Registrar: Anonymize<CommonParasRegistrarEvent>
  Slots: Anonymize<CommonSlotsEvent>
  Auctions: Anonymize<CommonAuctionsEvent>
  Crowdloan: Anonymize<CommonCrowdloanEvent>
  XcmPallet: Anonymize<XcmEvent>
  MessageQueue: Anonymize<MessageQueueEvent>
  AssetRate: Anonymize<I1vmo9hpn12j0l>
}>

export type PalletEvent = Enum<
  | { type: "ExtrinsicSuccess"; value: Anonymize<Iede1ukavoderd> }
  | { type: "ExtrinsicFailed"; value: Anonymize<Iennefu6o2bgdm> }
  | { type: "CodeUpdated"; value: undefined }
  | { type: "NewAccount"; value: Anonymize<Icbccs0ug47ilf> }
  | { type: "KilledAccount"; value: Anonymize<Icbccs0ug47ilf> }
  | { type: "Remarked"; value: Anonymize<Ieob37pbjnvmkj> }
>
export const PalletEvent = _Enum as unknown as GetEnum<PalletEvent>

type Iede1ukavoderd = { dispatch_info: Anonymize<Ia2iiohca2et6f> }

type Ia2iiohca2et6f = {
  weight: Anonymize<I4q39t5hn830vp>
  class: DispatchClass
  pays_fee: DispatchPays
}

export type DispatchClass = Enum<
  | { type: "Normal"; value: undefined }
  | { type: "Operational"; value: undefined }
  | { type: "Mandatory"; value: undefined }
>
export const DispatchClass = _Enum as unknown as GetEnum<DispatchClass>

export type DispatchPays = Enum<
  { type: "Yes"; value: undefined } | { type: "No"; value: undefined }
>
export const DispatchPays = _Enum as unknown as GetEnum<DispatchPays>

type Iennefu6o2bgdm = {
  dispatch_error: DispatchError
  dispatch_info: Anonymize<Ia2iiohca2et6f>
}

export type DispatchError = Enum<
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
export const DispatchError = _Enum as unknown as GetEnum<DispatchError>

type I9mtpf03dt7lqs = { index: number; error: Binary }

export type TokenError = Enum<
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
export const TokenError = _Enum as unknown as GetEnum<TokenError>

export type ArithmeticError = Enum<
  | { type: "Underflow"; value: undefined }
  | { type: "Overflow"; value: undefined }
  | { type: "DivisionByZero"; value: undefined }
>
export const ArithmeticError = _Enum as unknown as GetEnum<ArithmeticError>

export type TransactionalError = Enum<
  | { type: "LimitReached"; value: undefined }
  | { type: "NoLayer"; value: undefined }
>
export const TransactionalError =
  _Enum as unknown as GetEnum<TransactionalError>

type Icbccs0ug47ilf = { account: SS58String }

type Ieob37pbjnvmkj = { sender: SS58String; hash: Binary }

export type SchedulerEvent = Enum<
  | { type: "Scheduled"; value: Anonymize<I5n4sebgkfr760> }
  | { type: "Canceled"; value: Anonymize<I5n4sebgkfr760> }
  | { type: "Dispatched"; value: Anonymize<Idv8erd9m7jvse> }
  | { type: "CallUnavailable"; value: Anonymize<Ibkv7dijodoblp> }
  | { type: "PeriodicFailed"; value: Anonymize<Ibkv7dijodoblp> }
  | { type: "PermanentlyOverweight"; value: Anonymize<Ibkv7dijodoblp> }
>
export const SchedulerEvent = _Enum as unknown as GetEnum<SchedulerEvent>

type I5n4sebgkfr760 = { when: number; index: number }

type Idv8erd9m7jvse = {
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
  result: Anonymize<Idtdr91jmq5g4i>
}

type I5g2vv0ckl2m8b = [number, number]

type I17k3ujudqd5df = Binary | undefined

type Idtdr91jmq5g4i = ResultPayload<undefined, DispatchError>

type Ibkv7dijodoblp = {
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}

export type PreimageEvent = Enum<
  | { type: "Noted"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Requested"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Cleared"; value: Anonymize<Id9d48vaes3c53> }
>
export const PreimageEvent = _Enum as unknown as GetEnum<PreimageEvent>

type Id9d48vaes3c53 = { hash: Binary }

export type IndicesEvent = Enum<
  | { type: "IndexAssigned"; value: Anonymize<Ia1u3jll6a06ae> }
  | { type: "IndexFreed"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "IndexFrozen"; value: Anonymize<Ia1u3jll6a06ae> }
>
export const IndicesEvent = _Enum as unknown as GetEnum<IndicesEvent>

type Ia1u3jll6a06ae = { who: SS58String; index: number }

type I666bl2fqjkejo = { index: number }

export type BalancesEvent = Enum<
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
export const BalancesEvent = _Enum as unknown as GetEnum<BalancesEvent>

type Icv68aq8841478 = { account: SS58String; free_balance: bigint }

type Ic262ibdoec56a = { account: SS58String; amount: bigint }

type Iflcfm9b6nlmdd = { from: SS58String; to: SS58String; amount: bigint }

type Ijrsf4mnp3eka = { who: SS58String; free: bigint }

type Id5fm4p8lj5qgi = { who: SS58String; amount: bigint }

type Idm5rqp3duosod = {
  from: SS58String
  to: SS58String
  amount: bigint
  destination_status: BalanceStatus
}

export type BalanceStatus = Enum<
  { type: "Free"; value: undefined } | { type: "Reserved"; value: undefined }
>
export const BalanceStatus = _Enum as unknown as GetEnum<BalanceStatus>

type I4cbvqmqadhrea = { who: SS58String }

type I3qt1hgg4djhgb = { amount: bigint }

export type TransactionPaymentEvent = Enum<{
  type: "TransactionFeePaid"
  value: Anonymize<Ier2cke86dqbr2>
}>
export const TransactionPaymentEvent =
  _Enum as unknown as GetEnum<TransactionPaymentEvent>

type Ier2cke86dqbr2 = { who: SS58String; actual_fee: bigint; tip: bigint }

type I8ohb99n25uga8 = AnonymousEnum<{
  EraPaid: Anonymize<I1au3fq4n84nv3>
  Rewarded: Anonymize<I5j22i27djc5r4>
  Slashed: Anonymize<Idnak900lt5lm8>
  SlashReported: Anonymize<I27n7lbd66730p>
  OldSlashingReportDiscarded: Anonymize<I2hq50pu2kdjpo>
  StakersElected: undefined
  Bonded: Anonymize<Ifk8eme5o7mukf>
  Unbonded: Anonymize<Ifk8eme5o7mukf>
  Withdrawn: Anonymize<Ifk8eme5o7mukf>
  Kicked: Anonymize<Iau4cgm6ih61cf>
  StakingElectionFailed: undefined
  Chilled: Anonymize<Idl3umm12u5pa>
  PayoutStarted: Anonymize<I6ir616rur362k>
  ValidatorPrefsSet: Anonymize<Ic19as7nbst738>
  SnapshotVotersSizeExceeded: Anonymize<I54umskavgc9du>
  SnapshotTargetsSizeExceeded: Anonymize<I54umskavgc9du>
  ForceEra: Anonymize<I43l31t29k2o0p>
}>

type I1au3fq4n84nv3 = {
  era_index: number
  validator_payout: bigint
  remainder: bigint
}

type I5j22i27djc5r4 = {
  stash: SS58String
  dest: StakingRewardDestination
  amount: bigint
}

export type StakingRewardDestination = Enum<
  | { type: "Staked"; value: undefined }
  | { type: "Stash"; value: undefined }
  | { type: "Controller"; value: undefined }
  | { type: "Account"; value: Anonymize<SS58String> }
  | { type: "None"; value: undefined }
>
export const StakingRewardDestination =
  _Enum as unknown as GetEnum<StakingRewardDestination>

type Idnak900lt5lm8 = { staker: SS58String; amount: bigint }

type I27n7lbd66730p = {
  validator: SS58String
  fraction: number
  slash_era: number
}

type I2hq50pu2kdjpo = { session_index: number }

type Ifk8eme5o7mukf = { stash: SS58String; amount: bigint }

type Iau4cgm6ih61cf = { nominator: SS58String; stash: SS58String }

type Idl3umm12u5pa = { stash: SS58String }

type I6ir616rur362k = { era_index: number; validator_stash: SS58String }

type Ic19as7nbst738 = { stash: SS58String; prefs: Anonymize<I9o7ssi9vmhmgr> }

type I9o7ssi9vmhmgr = { commission: number; blocked: boolean }

type I54umskavgc9du = { size: number }

type I43l31t29k2o0p = { mode: StakingForcing }

export type StakingForcing = Enum<
  | { type: "NotForcing"; value: undefined }
  | { type: "ForceNew"; value: undefined }
  | { type: "ForceNone"; value: undefined }
  | { type: "ForceAlways"; value: undefined }
>
export const StakingForcing = _Enum as unknown as GetEnum<StakingForcing>

export type OffencesEvent = Enum<{
  type: "Offence"
  value: Anonymize<I41n4hddrgegvb>
}>
export const OffencesEvent = _Enum as unknown as GetEnum<OffencesEvent>

type I41n4hddrgegvb = { kind: Binary; timeslot: Binary }

export type SessionEvent = Enum<{
  type: "NewSession"
  value: Anonymize<I2hq50pu2kdjpo>
}>
export const SessionEvent = _Enum as unknown as GetEnum<SessionEvent>

export type GrandpaEvent = Enum<
  | { type: "NewAuthorities"; value: Anonymize<Ib31jedabim0q7> }
  | { type: "Paused"; value: undefined }
  | { type: "Resumed"; value: undefined }
>
export const GrandpaEvent = _Enum as unknown as GetEnum<GrandpaEvent>

type Ib31jedabim0q7 = { authority_set: Anonymize<I2qinct8jq4bqe> }

type I2qinct8jq4bqe = Array<Anonymize<I3iuggguvi9njj>>

type I3iuggguvi9njj = [Binary, bigint]

export type ImOnlineEvent = Enum<
  | { type: "HeartbeatReceived"; value: Anonymize<I93nne97c4i0sr> }
  | { type: "AllGood"; value: undefined }
  | { type: "SomeOffline"; value: Anonymize<I311vp8270bfmr> }
>
export const ImOnlineEvent = _Enum as unknown as GetEnum<ImOnlineEvent>

type I93nne97c4i0sr = { authority_id: Binary }

type I311vp8270bfmr = { offline: Anonymize<I67ag5q10ogtvt> }

type I67ag5q10ogtvt = Array<Anonymize<Idi27pva6ajg4>>

type Idi27pva6ajg4 = [SS58String, Anonymize<Ifekshcrgkl12g>]

type Ifekshcrgkl12g = {
  total: bigint
  own: bigint
  others: Anonymize<I252o97fo263q7>
}

type I252o97fo263q7 = Array<Anonymize<I91eao91fmce8>>

type I91eao91fmce8 = { who: SS58String; value: bigint }

type I7pitd9gb68o89 = AnonymousEnum<{
  Proposed: Anonymize<I44hc4lgsn4o1j>
  Spending: Anonymize<I8iksqi3eani0a>
  Awarded: Anonymize<I16enopmju1p0q>
  Rejected: Anonymize<Ifgqhle2413de7>
  Burnt: Anonymize<I43kq8qudg7pq9>
  Rollover: Anonymize<I76riseemre533>
  Deposit: Anonymize<Ie5v6njpckr05b>
  SpendApproved: Anonymize<I38bmcrmh852rk>
  UpdatedInactive: Anonymize<I4hcillge8de5f>
  AssetSpendApproved: Anonymize<Iblqf6usek6oij>
  AssetSpendVoided: Anonymize<I666bl2fqjkejo>
  Paid: Anonymize<Iek7v4hrgnq6iv>
  PaymentFailed: Anonymize<Iek7v4hrgnq6iv>
  SpendProcessed: Anonymize<I666bl2fqjkejo>
}>

type I44hc4lgsn4o1j = { proposal_index: number }

type I8iksqi3eani0a = { budget_remaining: bigint }

type I16enopmju1p0q = {
  proposal_index: number
  award: bigint
  account: SS58String
}

type Ifgqhle2413de7 = { proposal_index: number; slashed: bigint }

type I43kq8qudg7pq9 = { burnt_funds: bigint }

type I76riseemre533 = { rollover_balance: bigint }

type Ie5v6njpckr05b = { value: bigint }

type I38bmcrmh852rk = {
  proposal_index: number
  amount: bigint
  beneficiary: SS58String
}

type I4hcillge8de5f = { reactivated: bigint; deactivated: bigint }

type Iblqf6usek6oij = {
  index: number
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: number
  expire_at: number
}

type I32r9skkupsthv = AnonymousEnum<{ V3: Anonymize<I30in122a9nnlb> }>

type I30in122a9nnlb = {
  location: Anonymize<I43cmiele6sevi>
  asset_id: XcmV3MultiassetAssetId
}

type I43cmiele6sevi = { parents: number; interior: XcmV3Junctions }

export type XcmV3Junctions = Enum<
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
export const XcmV3Junctions = _Enum as unknown as GetEnum<XcmV3Junctions>

export type XcmV3Junction = Enum<
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
export const XcmV3Junction = _Enum as unknown as GetEnum<XcmV3Junction>

type I6i61tqvseg382 = { network: Anonymize<I5r47nbqpq4gc3>; id: Binary }

type I5r47nbqpq4gc3 = XcmV3JunctionNetworkId | undefined

export type XcmV3JunctionNetworkId = Enum<
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
export const XcmV3JunctionNetworkId =
  _Enum as unknown as GetEnum<XcmV3JunctionNetworkId>

type I83hg7ig5d74ok = { block_number: bigint; block_hash: Binary }

type I623eo8t3jrbeo = { chain_id: bigint }

type Iufr71iing6fs = { network: Anonymize<I5r47nbqpq4gc3>; index: bigint }

type I192a40lbldnho = { network: Anonymize<I5r47nbqpq4gc3>; key: Binary }

type Ic1rqnlu0a9i3k = { length: number; data: Binary }

type Ibb5u0oo9gtas = { id: XcmV3JunctionBodyId; part: XcmV3JunctionBodyPart }

export type XcmV3JunctionBodyId = Enum<
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
export const XcmV3JunctionBodyId =
  _Enum as unknown as GetEnum<XcmV3JunctionBodyId>

export type XcmV3JunctionBodyPart = Enum<
  | { type: "Voice"; value: undefined }
  | { type: "Members"; value: Anonymize<Iafscmv8tjf0ou> }
  | { type: "Fraction"; value: Anonymize<Idif02efq16j92> }
  | { type: "AtLeastProportion"; value: Anonymize<Idif02efq16j92> }
  | { type: "MoreThanProportion"; value: Anonymize<Idif02efq16j92> }
>
export const XcmV3JunctionBodyPart =
  _Enum as unknown as GetEnum<XcmV3JunctionBodyPart>

type Iafscmv8tjf0ou = { count: number }

type Idif02efq16j92 = { nom: number; denom: number }

type I3n3hua43f17d = [XcmV3Junction, XcmV3Junction]

type I9tnbt1qa8ct9f = [XcmV3Junction, XcmV3Junction, XcmV3Junction]

type Ifjp4mk1rg8qmc = [
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
]

type I3e9mll436gmnq = [
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
]

type Ibigks25jpj2f1 = [
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
]

type I9pffrtiap54jf = [
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
]

type I5fuv9qoo4lgrf = [
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
  XcmV3Junction,
]

export type XcmV3MultiassetAssetId = Enum<
  | { type: "Concrete"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Abstract"; value: Anonymize<Binary> }
>
export const XcmV3MultiassetAssetId =
  _Enum as unknown as GetEnum<XcmV3MultiassetAssetId>

export type XcmVersionedMultiLocation = Enum<
  | { type: "V2"; value: Anonymize<Ibki0d249v3ojt> }
  | { type: "V3"; value: Anonymize<I43cmiele6sevi> }
>
export const XcmVersionedMultiLocation =
  _Enum as unknown as GetEnum<XcmVersionedMultiLocation>

type Ibki0d249v3ojt = { parents: number; interior: XcmV2MultilocationJunctions }

export type XcmV2MultilocationJunctions = Enum<
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
export const XcmV2MultilocationJunctions =
  _Enum as unknown as GetEnum<XcmV2MultilocationJunctions>

export type XcmV2Junction = Enum<
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
export const XcmV2Junction = _Enum as unknown as GetEnum<XcmV2Junction>

type I92r3c354plrou = { network: XcmV2NetworkId; id: Binary }

export type XcmV2NetworkId = Enum<
  | { type: "Any"; value: undefined }
  | { type: "Named"; value: Anonymize<Binary> }
  | { type: "Polkadot"; value: undefined }
  | { type: "Kusama"; value: undefined }
>
export const XcmV2NetworkId = _Enum as unknown as GetEnum<XcmV2NetworkId>

type I1i2pf35t6tqc0 = { network: XcmV2NetworkId; index: bigint }

type I9llkpmu569f8r = { network: XcmV2NetworkId; key: Binary }

type Icud1kgafcboq0 = { id: XcmV2BodyId; part: XcmV3JunctionBodyPart }

export type XcmV2BodyId = Enum<
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
export const XcmV2BodyId = _Enum as unknown as GetEnum<XcmV2BodyId>

type I4jsker1kbjfdl = [XcmV2Junction, XcmV2Junction]

type I13maq674kd1pa = [XcmV2Junction, XcmV2Junction, XcmV2Junction]

type Id88bctcqlqla7 = [
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
]

type I3d9nac7g0r3eq = [
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
]

type I5q5ti9n9anvcm = [
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
]

type I1famu3nq9knji = [
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
]

type Idlq59tbqpri0l = [
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
  XcmV2Junction,
]

type Iek7v4hrgnq6iv = { index: number; payment_id: bigint }

export type ConvictionVotingEvent = Enum<
  | { type: "Delegated"; value: Anonymize<Ic5oktqtdlvdvq> }
  | { type: "Undelegated"; value: Anonymize<SS58String> }
>
export const ConvictionVotingEvent =
  _Enum as unknown as GetEnum<ConvictionVotingEvent>

type Ic5oktqtdlvdvq = [SS58String, SS58String]

export type ReferendaEvent = Enum<
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
export const ReferendaEvent = _Enum as unknown as GetEnum<ReferendaEvent>

type Idhr9v8mlnjej = {
  index: number
  track: number
  proposal: PreimagesBounded
}

export type PreimagesBounded = Enum<
  | { type: "Legacy"; value: Anonymize<Id9d48vaes3c53> }
  | { type: "Inline"; value: Anonymize<Binary> }
  | { type: "Lookup"; value: Anonymize<Ie4qb7tq0r9uel> }
>
export const PreimagesBounded = _Enum as unknown as GetEnum<PreimagesBounded>

type Ie4qb7tq0r9uel = { hash: Binary; len: number }

type I62nte77gksm0f = { index: number; who: SS58String; amount: bigint }

type I932allgc83a4a = {
  index: number
  track: number
  proposal: PreimagesBounded
  tally: Anonymize<Ifsk7cbmtit1jd>
}

type Ifsk7cbmtit1jd = { ayes: bigint; nays: bigint; support: bigint }

type Ilhp45uime5tp = { index: number; tally: Anonymize<Ifsk7cbmtit1jd> }

type I50aq0q2l1cdkr = { index: number; hash: Binary }

export type WhitelistEvent = Enum<
  | { type: "CallWhitelisted"; value: Anonymize<I8413rb6im3iko> }
  | { type: "WhitelistedCallRemoved"; value: Anonymize<I8413rb6im3iko> }
  | { type: "WhitelistedCallDispatched"; value: Anonymize<I7b8pe56shlide> }
>
export const WhitelistEvent = _Enum as unknown as GetEnum<WhitelistEvent>

type I8413rb6im3iko = { call_hash: Binary }

type I7b8pe56shlide = { call_hash: Binary; result: Anonymize<Idurpak8qagatr> }

type Idurpak8qagatr = ResultPayload<
  Anonymize<I42817lesmslbu>,
  Anonymize<I9jhevvtlg11ei>
>

type I42817lesmslbu = {
  actual_weight: Anonymize<Iasb8k6ash5mjn>
  pays_fee: DispatchPays
}

type Iasb8k6ash5mjn = Anonymize<I4q39t5hn830vp> | undefined

type I9jhevvtlg11ei = {
  post_info: Anonymize<I42817lesmslbu>
  error: DispatchError
}

export type CommonClaimsEvent = Enum<{
  type: "Claimed"
  value: Anonymize<Idhjiuhlaei3db>
}>
export const CommonClaimsEvent = _Enum as unknown as GetEnum<CommonClaimsEvent>

type Idhjiuhlaei3db = {
  who: SS58String
  ethereum_address: Binary
  amount: bigint
}

export type VestingEvent = Enum<
  | { type: "VestingUpdated"; value: Anonymize<Ievr89968437gm> }
  | { type: "VestingCompleted"; value: Anonymize<Icbccs0ug47ilf> }
>
export const VestingEvent = _Enum as unknown as GetEnum<VestingEvent>

type Ievr89968437gm = { account: SS58String; unvested: bigint }

export type UtilityEvent = Enum<
  | { type: "BatchInterrupted"; value: Anonymize<I6tn8e5lqr339o> }
  | { type: "BatchCompleted"; value: undefined }
  | { type: "BatchCompletedWithErrors"; value: undefined }
  | { type: "ItemCompleted"; value: undefined }
  | { type: "ItemFailed"; value: Anonymize<I11lb9o37qkk4f> }
  | { type: "DispatchedAs"; value: Anonymize<Ie5i8qqljk3tjb> }
>
export const UtilityEvent = _Enum as unknown as GetEnum<UtilityEvent>

type I6tn8e5lqr339o = { index: number; error: DispatchError }

type I11lb9o37qkk4f = { error: DispatchError }

type Ie5i8qqljk3tjb = { result: Anonymize<Idtdr91jmq5g4i> }

export type IdentityEvent = Enum<
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
export const IdentityEvent = _Enum as unknown as GetEnum<IdentityEvent>

type Iep1lmt6q3s6r3 = { who: SS58String; deposit: bigint }

type I1fac16213rie2 = { who: SS58String; registrar_index: number }

type Ifjt77oc391o43 = { target: SS58String; registrar_index: number }

type Itvt1jsipv0lc = { registrar_index: number }

type Ick3mveut33f44 = { sub: SS58String; main: SS58String; deposit: bigint }

export type ProxyEvent = Enum<
  | { type: "ProxyExecuted"; value: Anonymize<Ie5i8qqljk3tjb> }
  | { type: "PureCreated"; value: Anonymize<I180p9c978rp4d> }
  | { type: "Announced"; value: Anonymize<Idbjbboh0q507r> }
  | { type: "ProxyAdded"; value: Anonymize<I94ud6o1n6v0n8> }
  | { type: "ProxyRemoved"; value: Anonymize<I94ud6o1n6v0n8> }
>
export const ProxyEvent = _Enum as unknown as GetEnum<ProxyEvent>

type I180p9c978rp4d = {
  pure: SS58String
  who: SS58String
  proxy_type: ProxyType
  disambiguation_index: number
}

export type ProxyType = Enum<
  | { type: "Any"; value: undefined }
  | { type: "NonTransfer"; value: undefined }
  | { type: "Governance"; value: undefined }
  | { type: "Staking"; value: undefined }
  | { type: "IdentityJudgement"; value: undefined }
  | { type: "CancelProxy"; value: undefined }
  | { type: "Auction"; value: undefined }
  | { type: "NominationPools"; value: undefined }
>
export const ProxyType = _Enum as unknown as GetEnum<ProxyType>

type Idbjbboh0q507r = { real: SS58String; proxy: SS58String; call_hash: Binary }

type I94ud6o1n6v0n8 = {
  delegator: SS58String
  delegatee: SS58String
  proxy_type: ProxyType
  delay: number
}

export type MultisigEvent = Enum<
  | { type: "NewMultisig"; value: Anonymize<Ibvv58de7m7rsi> }
  | { type: "MultisigApproval"; value: Anonymize<I4uo2dg1jvbdtg> }
  | { type: "MultisigExecuted"; value: Anonymize<Ifbo6gts4g8u33> }
  | { type: "MultisigCancelled"; value: Anonymize<I82jp3a00f0f8k> }
>
export const MultisigEvent = _Enum as unknown as GetEnum<MultisigEvent>

type Ibvv58de7m7rsi = {
  approving: SS58String
  multisig: SS58String
  call_hash: Binary
}

type I4uo2dg1jvbdtg = {
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}

type Itvprrpb0nm3o = { height: number; index: number }

type Ifbo6gts4g8u33 = {
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
  result: Anonymize<Idtdr91jmq5g4i>
}

type I82jp3a00f0f8k = {
  cancelling: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}

type Iei6k1tdcht3q = AnonymousEnum<{
  BountyProposed: Anonymize<I666bl2fqjkejo>
  BountyRejected: Anonymize<Id9idaj83175f9>
  BountyBecameActive: Anonymize<I666bl2fqjkejo>
  BountyAwarded: Anonymize<Ie1semicfuv5uu>
  BountyClaimed: Anonymize<If25fjs9o37co1>
  BountyCanceled: Anonymize<I666bl2fqjkejo>
  BountyExtended: Anonymize<I666bl2fqjkejo>
  BountyApproved: Anonymize<I666bl2fqjkejo>
  CuratorProposed: Anonymize<I70sc1pdo8vtos>
  CuratorUnassigned: Anonymize<Ia9p5bg6p18r0i>
  CuratorAccepted: Anonymize<I70sc1pdo8vtos>
}>

type Id9idaj83175f9 = { index: number; bond: bigint }

type Ie1semicfuv5uu = { index: number; beneficiary: SS58String }

type If25fjs9o37co1 = { index: number; payout: bigint; beneficiary: SS58String }

type I70sc1pdo8vtos = { bounty_id: number; curator: SS58String }

type Ia9p5bg6p18r0i = { bounty_id: number }

export type ChildBountiesEvent = Enum<
  | { type: "Added"; value: Anonymize<I60p8l86a8cm59> }
  | { type: "Awarded"; value: Anonymize<I3m3sk2lgcabvp> }
  | { type: "Claimed"; value: Anonymize<I5pf572duh4oeg> }
  | { type: "Canceled"; value: Anonymize<I60p8l86a8cm59> }
>
export const ChildBountiesEvent =
  _Enum as unknown as GetEnum<ChildBountiesEvent>

type I60p8l86a8cm59 = { index: number; child_index: number }

type I3m3sk2lgcabvp = {
  index: number
  child_index: number
  beneficiary: SS58String
}

type I5pf572duh4oeg = {
  index: number
  child_index: number
  payout: bigint
  beneficiary: SS58String
}

export type ElectionProviderMultiPhaseEvent = Enum<
  | { type: "SolutionStored"; value: Anonymize<I5an5igf3n0vgh> }
  | { type: "ElectionFinalized"; value: Anonymize<I1rd7gkt317ndg> }
  | { type: "ElectionFailed"; value: undefined }
  | { type: "Rewarded"; value: Anonymize<I7j4m7a3pkvsf4> }
  | { type: "Slashed"; value: Anonymize<I7j4m7a3pkvsf4> }
  | { type: "PhaseTransitioned"; value: Anonymize<Icrg5eih8vnokr> }
>
export const ElectionProviderMultiPhaseEvent =
  _Enum as unknown as GetEnum<ElectionProviderMultiPhaseEvent>

type I5an5igf3n0vgh = {
  compute: ElectionProviderMultiPhaseElectionCompute
  origin: Anonymize<Ihfphjolmsqq1>
  prev_ejected: boolean
}

export type ElectionProviderMultiPhaseElectionCompute = Enum<
  | { type: "OnChain"; value: undefined }
  | { type: "Signed"; value: undefined }
  | { type: "Unsigned"; value: undefined }
  | { type: "Fallback"; value: undefined }
  | { type: "Emergency"; value: undefined }
>
export const ElectionProviderMultiPhaseElectionCompute =
  _Enum as unknown as GetEnum<ElectionProviderMultiPhaseElectionCompute>

type Ihfphjolmsqq1 = SS58String | undefined

type I1rd7gkt317ndg = {
  compute: ElectionProviderMultiPhaseElectionCompute
  score: Anonymize<I8s6n43okuj2b1>
}

type I8s6n43okuj2b1 = {
  minimal_stake: bigint
  sum_stake: bigint
  sum_stake_squared: bigint
}

type I7j4m7a3pkvsf4 = { account: SS58String; value: bigint }

type Icrg5eih8vnokr = {
  from: ElectionProviderMultiPhasePhase
  to: ElectionProviderMultiPhasePhase
  round: number
}

export type ElectionProviderMultiPhasePhase = Enum<
  | { type: "Off"; value: undefined }
  | { type: "Signed"; value: undefined }
  | { type: "Unsigned"; value: Anonymize<I38fu9hj3b9un7> }
  | { type: "Emergency"; value: undefined }
>
export const ElectionProviderMultiPhasePhase =
  _Enum as unknown as GetEnum<ElectionProviderMultiPhasePhase>

type I38fu9hj3b9un7 = [boolean, number]

export type BagsListEvent = Enum<
  | { type: "Rebagged"; value: Anonymize<I37454vatvmm1l> }
  | { type: "ScoreUpdated"; value: Anonymize<Iblau1qa7u7fet> }
>
export const BagsListEvent = _Enum as unknown as GetEnum<BagsListEvent>

type I37454vatvmm1l = { who: SS58String; from: bigint; to: bigint }

type Iblau1qa7u7fet = { who: SS58String; new_score: bigint }

type Id4j84j1rd7upd = AnonymousEnum<{
  Created: Anonymize<I1ti389kf8t6oi>
  Bonded: Anonymize<If4nnre373amul>
  PaidOut: Anonymize<I55kbor0ocqk6h>
  Unbonded: Anonymize<Idsj9cg7j96kpc>
  Withdrawn: Anonymize<Ido4u9drncfaml>
  Destroyed: Anonymize<I931cottvong90>
  StateChanged: Anonymize<I2inhcpqb4h0bg>
  MemberRemoved: Anonymize<I7vqogd77mmdlm>
  RolesUpdated: Anonymize<I6mik29s5073td>
  PoolSlashed: Anonymize<I2m0sqmb75cnpb>
  UnbondingPoolSlashed: Anonymize<I49agc5b62mehu>
  PoolCommissionUpdated: Anonymize<Iatq9jda4hq6pg>
  PoolMaxCommissionUpdated: Anonymize<I8cbluptqo8kbp>
  PoolCommissionChangeRateUpdated: Anonymize<I81cc4plffa1dm>
  PoolCommissionClaimed: Anonymize<I2g87evcjlgmqi>
  MinBalanceDeficitAdjusted: Anonymize<Ieg1oc56mamrl5>
  MinBalanceExcessAdjusted: Anonymize<Ieg1oc56mamrl5>
}>

type I1ti389kf8t6oi = { depositor: SS58String; pool_id: number }

type If4nnre373amul = {
  member: SS58String
  pool_id: number
  bonded: bigint
  joined: boolean
}

type I55kbor0ocqk6h = { member: SS58String; pool_id: number; payout: bigint }

type Idsj9cg7j96kpc = {
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
  era: number
}

type Ido4u9drncfaml = {
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
}

type I931cottvong90 = { pool_id: number }

type I2inhcpqb4h0bg = { pool_id: number; new_state: NominationPoolsPoolState }

export type NominationPoolsPoolState = Enum<
  | { type: "Open"; value: undefined }
  | { type: "Blocked"; value: undefined }
  | { type: "Destroying"; value: undefined }
>
export const NominationPoolsPoolState =
  _Enum as unknown as GetEnum<NominationPoolsPoolState>

type I7vqogd77mmdlm = { pool_id: number; member: SS58String }

type I6mik29s5073td = {
  root: Anonymize<Ihfphjolmsqq1>
  bouncer: Anonymize<Ihfphjolmsqq1>
  nominator: Anonymize<Ihfphjolmsqq1>
}

type I2m0sqmb75cnpb = { pool_id: number; balance: bigint }

type I49agc5b62mehu = { pool_id: number; era: number; balance: bigint }

type Iatq9jda4hq6pg = { pool_id: number; current: Anonymize<Ie8iutm7u02lmj> }

type Ie8iutm7u02lmj = Anonymize<I7svnfko10tq2e> | undefined

type I7svnfko10tq2e = [number, SS58String]

type I8cbluptqo8kbp = { pool_id: number; max_commission: number }

type I81cc4plffa1dm = {
  pool_id: number
  change_rate: Anonymize<Ibqul338t9c1ll>
}

type Ibqul338t9c1ll = { max_increase: number; min_delay: number }

type I2g87evcjlgmqi = { pool_id: number; commission: bigint }

type Ieg1oc56mamrl5 = { amount: bigint; pool_id: number }

export type FastUnstakeEvent = Enum<
  | { type: "Unstaked"; value: Anonymize<Iag2vtju06tj0k> }
  | { type: "Slashed"; value: Anonymize<Ifk8eme5o7mukf> }
  | { type: "BatchChecked"; value: Anonymize<Ic0he9tlf9ll0u> }
  | { type: "BatchFinished"; value: Anonymize<I54umskavgc9du> }
  | { type: "InternalError"; value: undefined }
>
export const FastUnstakeEvent = _Enum as unknown as GetEnum<FastUnstakeEvent>

type Iag2vtju06tj0k = { stash: SS58String; result: Anonymize<Idtdr91jmq5g4i> }

type Ic0he9tlf9ll0u = { eras: Anonymize<Icgljjb6j82uhn> }

type Icgljjb6j82uhn = Array<number>

export type ParachainsInclusionEvent = Enum<
  | { type: "CandidateBacked"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateIncluded"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateTimedOut"; value: Anonymize<Ievbvtucck5gnq> }
  | { type: "UpwardMessagesReceived"; value: Anonymize<Ic8i89mfkmn3n7> }
>
export const ParachainsInclusionEvent =
  _Enum as unknown as GetEnum<ParachainsInclusionEvent>

type Ieno5vn1m65ng2 = [Anonymize<I4vjld3472quct>, Binary, number, number]

type I4vjld3472quct = {
  descriptor: Anonymize<Ib2u20s6roco9i>
  commitments_hash: Binary
}

type Ib2u20s6roco9i = {
  para_id: number
  relay_parent: Binary
  collator: Binary
  persisted_validation_data_hash: Binary
  pov_hash: Binary
  erasure_root: Binary
  signature: Binary
  para_head: Binary
  validation_code_hash: Binary
}

type Ievbvtucck5gnq = [Anonymize<I4vjld3472quct>, Binary, number]

type Ic8i89mfkmn3n7 = { from: number; count: number }

export type ParachainsParasEvent = Enum<
  | { type: "CurrentCodeUpdated"; value: Anonymize<number> }
  | { type: "CurrentHeadUpdated"; value: Anonymize<number> }
  | { type: "CodeUpgradeScheduled"; value: Anonymize<number> }
  | { type: "NewHeadNoted"; value: Anonymize<number> }
  | { type: "ActionQueued"; value: Anonymize<I5g2vv0ckl2m8b> }
  | { type: "PvfCheckStarted"; value: Anonymize<I64gm4hrq7urum> }
  | { type: "PvfCheckAccepted"; value: Anonymize<I64gm4hrq7urum> }
  | { type: "PvfCheckRejected"; value: Anonymize<I64gm4hrq7urum> }
>
export const ParachainsParasEvent =
  _Enum as unknown as GetEnum<ParachainsParasEvent>

type I64gm4hrq7urum = [Binary, number]

type Ic4alvt16n58rg = AnonymousEnum<{
  OpenChannelRequested: Anonymize<Id2bej717ckub0>
  OpenChannelCanceled: Anonymize<I545vo2e86o5i4>
  OpenChannelAccepted: Anonymize<I50mrcbubp554e>
  ChannelClosed: Anonymize<I545vo2e86o5i4>
  HrmpChannelForceOpened: Anonymize<Id2bej717ckub0>
  HrmpSystemChannelOpened: Anonymize<Id2bej717ckub0>
  OpenChannelDepositsUpdated: Anonymize<I50mrcbubp554e>
}>

type Id2bej717ckub0 = {
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}

type I545vo2e86o5i4 = {
  by_parachain: number
  channel_id: Anonymize<I50mrcbubp554e>
}

type I50mrcbubp554e = { sender: number; recipient: number }

export type ParachainsDisputesEvent = Enum<
  | { type: "DisputeInitiated"; value: Anonymize<I3o099fcusuh31> }
  | { type: "DisputeConcluded"; value: Anonymize<Ifr2e7vm3bun8k> }
  | { type: "Revert"; value: Anonymize<number> }
>
export const ParachainsDisputesEvent =
  _Enum as unknown as GetEnum<ParachainsDisputesEvent>

type I3o099fcusuh31 = [Binary, ParachainsDisputesDisputeLocation]

export type ParachainsDisputesDisputeLocation = Enum<
  { type: "Local"; value: undefined } | { type: "Remote"; value: undefined }
>
export const ParachainsDisputesDisputeLocation =
  _Enum as unknown as GetEnum<ParachainsDisputesDisputeLocation>

type Ifr2e7vm3bun8k = [Binary, ParachainsDisputesDisputeResult]

export type ParachainsDisputesDisputeResult = Enum<
  { type: "Valid"; value: undefined } | { type: "Invalid"; value: undefined }
>
export const ParachainsDisputesDisputeResult =
  _Enum as unknown as GetEnum<ParachainsDisputesDisputeResult>

export type CommonParasRegistrarEvent = Enum<
  | { type: "Registered"; value: Anonymize<Ibs22tt76qp5bi> }
  | { type: "Deregistered"; value: Anonymize<I37r4bdai8o9mp> }
  | { type: "Reserved"; value: Anonymize<Idn2ghub1o4i40> }
  | { type: "Swapped"; value: Anonymize<I48u78djt89dod> }
>
export const CommonParasRegistrarEvent =
  _Enum as unknown as GetEnum<CommonParasRegistrarEvent>

type Ibs22tt76qp5bi = { para_id: number; manager: SS58String }

type I37r4bdai8o9mp = { para_id: number }

type Idn2ghub1o4i40 = { para_id: number; who: SS58String }

type I48u78djt89dod = { para_id: number; other_id: number }

export type CommonSlotsEvent = Enum<
  | { type: "NewLeasePeriod"; value: Anonymize<Ib85m5kfbepu2t> }
  | { type: "Leased"; value: Anonymize<Idaml5bdhsfcsl> }
>
export const CommonSlotsEvent = _Enum as unknown as GetEnum<CommonSlotsEvent>

type Ib85m5kfbepu2t = { lease_period: number }

type Idaml5bdhsfcsl = {
  para_id: number
  leaser: SS58String
  period_begin: number
  period_count: number
  extra_reserved: bigint
  total_amount: bigint
}

export type CommonAuctionsEvent = Enum<
  | { type: "AuctionStarted"; value: Anonymize<Ieec0cu336gteb> }
  | { type: "AuctionClosed"; value: Anonymize<I815d5k4ij85nv> }
  | { type: "Reserved"; value: Anonymize<Ifi98fgi9o46v7> }
  | { type: "Unreserved"; value: Anonymize<Ic0oj9tok33uap> }
  | { type: "ReserveConfiscated"; value: Anonymize<I3tdutpfjuk32j> }
  | { type: "BidAccepted"; value: Anonymize<I1esdujrkdacpb> }
  | { type: "WinningOffset"; value: Anonymize<I9g1d820jf9m2s> }
>
export const CommonAuctionsEvent =
  _Enum as unknown as GetEnum<CommonAuctionsEvent>

type Ieec0cu336gteb = {
  auction_index: number
  lease_period: number
  ending: number
}

type I815d5k4ij85nv = { auction_index: number }

type Ifi98fgi9o46v7 = {
  bidder: SS58String
  extra_reserved: bigint
  total_amount: bigint
}

type Ic0oj9tok33uap = { bidder: SS58String; amount: bigint }

type I3tdutpfjuk32j = { para_id: number; leaser: SS58String; amount: bigint }

type I1esdujrkdacpb = {
  bidder: SS58String
  para_id: number
  amount: bigint
  first_slot: number
  last_slot: number
}

type I9g1d820jf9m2s = { auction_index: number; block_number: number }

export type CommonCrowdloanEvent = Enum<
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
export const CommonCrowdloanEvent =
  _Enum as unknown as GetEnum<CommonCrowdloanEvent>

type I8ve4g3egaln6a = { who: SS58String; fund_index: number; amount: bigint }

type If9e3ujpsfl4g7 = { para_id: number; result: Anonymize<Idtdr91jmq5g4i> }

type If4hvqaeoqq5us = { who: SS58String; para_id: number; memo: Binary }

export type XcmEvent = Enum<
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
export const XcmEvent = _Enum as unknown as GetEnum<XcmEvent>

type I4e7dkr4hrus3u = { outcome: XcmV3TraitsOutcome }

export type XcmV3TraitsOutcome = Enum<
  | { type: "Complete"; value: Anonymize<I4q39t5hn830vp> }
  | { type: "Incomplete"; value: Anonymize<Ilcvm3kc2hvtg> }
  | { type: "Error"; value: Anonymize<XcmV3TraitsError> }
>
export const XcmV3TraitsOutcome =
  _Enum as unknown as GetEnum<XcmV3TraitsOutcome>

type Ilcvm3kc2hvtg = [Anonymize<I4q39t5hn830vp>, XcmV3TraitsError]

export type XcmV3TraitsError = Enum<
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
export const XcmV3TraitsError = _Enum as unknown as GetEnum<XcmV3TraitsError>

type Ia5b8kts5gt3p5 = {
  origin: Anonymize<I43cmiele6sevi>
  destination: Anonymize<I43cmiele6sevi>
  message: Anonymize<I8l0577387vghn>
  message_id: Binary
}

type I8l0577387vghn = Array<XcmV3Instruction>

export type XcmV3Instruction = Enum<
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
export const XcmV3Instruction = _Enum as unknown as GetEnum<XcmV3Instruction>

type Id7mn3j3ge1h6a = Array<Anonymize<I9epi5ni2mqt8s>>

type I9epi5ni2mqt8s = {
  id: XcmV3MultiassetAssetId
  fun: XcmV3MultiassetFungibility
}

export type XcmV3MultiassetFungibility = Enum<
  | { type: "Fungible"; value: Anonymize<bigint> }
  | { type: "NonFungible"; value: Anonymize<XcmV3MultiassetAssetInstance> }
>
export const XcmV3MultiassetFungibility =
  _Enum as unknown as GetEnum<XcmV3MultiassetFungibility>

export type XcmV3MultiassetAssetInstance = Enum<
  | { type: "Undefined"; value: undefined }
  | { type: "Index"; value: Anonymize<bigint> }
  | { type: "Array4"; value: Anonymize<Binary> }
  | { type: "Array8"; value: Anonymize<Binary> }
  | { type: "Array16"; value: Anonymize<Binary> }
  | { type: "Array32"; value: Anonymize<Binary> }
>
export const XcmV3MultiassetAssetInstance =
  _Enum as unknown as GetEnum<XcmV3MultiassetAssetInstance>

type I3hin12hf9pma8 = {
  query_id: bigint
  response: XcmV3Response
  max_weight: Anonymize<I4q39t5hn830vp>
  querier: Anonymize<I74hapqfd00s9i>
}

export type XcmV3Response = Enum<
  | { type: "Null"; value: undefined }
  | { type: "Assets"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "ExecutionResult"; value: Anonymize<I8j770n2arfq59> }
  | { type: "Version"; value: Anonymize<number> }
  | { type: "PalletsInfo"; value: Anonymize<I599u7h20b52at> }
  | { type: "DispatchResult"; value: Anonymize<XcmV3MaybeErrorCode> }
>
export const XcmV3Response = _Enum as unknown as GetEnum<XcmV3Response>

type I8j770n2arfq59 = Anonymize<Ibgcthk0mc326i> | undefined

type Ibgcthk0mc326i = [number, XcmV3TraitsError]

type I599u7h20b52at = Array<Anonymize<Ift5r9b1bvoh16>>

type Ift5r9b1bvoh16 = {
  index: number
  name: Binary
  module_name: Binary
  major: number
  minor: number
  patch: number
}

export type XcmV3MaybeErrorCode = Enum<
  | { type: "Success"; value: undefined }
  | { type: "Error"; value: Anonymize<Binary> }
  | { type: "TruncatedError"; value: Anonymize<Binary> }
>
export const XcmV3MaybeErrorCode =
  _Enum as unknown as GetEnum<XcmV3MaybeErrorCode>

type I74hapqfd00s9i = Anonymize<I43cmiele6sevi> | undefined

type Ibseg27e15rt5b = {
  assets: Anonymize<Id7mn3j3ge1h6a>
  beneficiary: Anonymize<I43cmiele6sevi>
}

type I8nsq83051h7s5 = {
  assets: Anonymize<Id7mn3j3ge1h6a>
  dest: Anonymize<I43cmiele6sevi>
  xcm: Anonymize<I8l0577387vghn>
}

type I4sfmje1omkmem = {
  origin_kind: XcmV2OriginKind
  require_weight_at_most: Anonymize<I4q39t5hn830vp>
  call: Binary
}

export type XcmV2OriginKind = Enum<
  | { type: "Native"; value: undefined }
  | { type: "SovereignAccount"; value: undefined }
  | { type: "Superuser"; value: undefined }
  | { type: "Xcm"; value: undefined }
>
export const XcmV2OriginKind = _Enum as unknown as GetEnum<XcmV2OriginKind>

type I5uhhrjqfuo4e5 = {
  sender: number
  max_message_size: number
  max_capacity: number
}

type Ifij4jam0o7sub = { recipient: number }

type Ieeb4svd9i8fji = { initiator: number; sender: number; recipient: number }

type I40u32g7uv47fo = {
  destination: Anonymize<I43cmiele6sevi>
  query_id: bigint
  max_weight: Anonymize<I4q39t5hn830vp>
}

type I92hs9ri8pep98 = {
  assets: XcmV3MultiAssetFilter
  beneficiary: Anonymize<I43cmiele6sevi>
}

export type XcmV3MultiAssetFilter = Enum<
  | { type: "Definite"; value: Anonymize<Id7mn3j3ge1h6a> }
  | { type: "Wild"; value: Anonymize<XcmV3WildMultiAsset> }
>
export const XcmV3MultiAssetFilter =
  _Enum as unknown as GetEnum<XcmV3MultiAssetFilter>

export type XcmV3WildMultiAsset = Enum<
  | { type: "All"; value: undefined }
  | { type: "AllOf"; value: Anonymize<Ikhntpa3k1bng> }
  | { type: "AllCounted"; value: Anonymize<number> }
  | { type: "AllOfCounted"; value: Anonymize<I8ef6ldr28dcsm> }
>
export const XcmV3WildMultiAsset =
  _Enum as unknown as GetEnum<XcmV3WildMultiAsset>

type Ikhntpa3k1bng = {
  id: XcmV3MultiassetAssetId
  fun: XcmV2MultiassetWildFungibility
}

export type XcmV2MultiassetWildFungibility = Enum<
  | { type: "Fungible"; value: undefined }
  | { type: "NonFungible"; value: undefined }
>
export const XcmV2MultiassetWildFungibility =
  _Enum as unknown as GetEnum<XcmV2MultiassetWildFungibility>

type I8ef6ldr28dcsm = {
  id: XcmV3MultiassetAssetId
  fun: XcmV2MultiassetWildFungibility
  count: number
}

type Ifu4iibn44bata = {
  assets: XcmV3MultiAssetFilter
  dest: Anonymize<I43cmiele6sevi>
  xcm: Anonymize<I8l0577387vghn>
}

type I5v4cm31o1r5t1 = {
  give: XcmV3MultiAssetFilter
  want: Anonymize<Id7mn3j3ge1h6a>
  maximal: boolean
}

type Ick8rmedif57q9 = {
  assets: XcmV3MultiAssetFilter
  reserve: Anonymize<I43cmiele6sevi>
  xcm: Anonymize<I8l0577387vghn>
}

type Icvkurqgno3h7q = {
  response_info: Anonymize<I40u32g7uv47fo>
  assets: XcmV3MultiAssetFilter
}

type I8nq35nm53n6bc = {
  fees: Anonymize<I9epi5ni2mqt8s>
  weight_limit: XcmV3WeightLimit
}

export type XcmV3WeightLimit = Enum<
  | { type: "Unlimited"; value: undefined }
  | { type: "Limited"; value: Anonymize<I4q39t5hn830vp> }
>
export const XcmV3WeightLimit = _Enum as unknown as GetEnum<XcmV3WeightLimit>

type I8uojukg6cvq81 = {
  assets: Anonymize<Id7mn3j3ge1h6a>
  ticket: Anonymize<I43cmiele6sevi>
}

type Ieprdqqu7ildvr = {
  query_id: bigint
  max_response_weight: Anonymize<I4q39t5hn830vp>
}

type Ie3fdn0i40ahq2 = {
  module_name: Binary
  response_info: Anonymize<I40u32g7uv47fo>
}

type Id7mf37dkpgfjs = {
  index: number
  name: Binary
  module_name: Binary
  crate_major: number
  min_crate_minor: number
}

type I7uretqff9fvu = {
  network: XcmV3JunctionNetworkId
  destination: XcmV3Junctions
  xcm: Anonymize<I8l0577387vghn>
}

type I5e83tpl0q5jq0 = {
  asset: Anonymize<I9epi5ni2mqt8s>
  unlocker: Anonymize<I43cmiele6sevi>
}

type Iffpr1249pemri = {
  asset: Anonymize<I9epi5ni2mqt8s>
  target: Anonymize<I43cmiele6sevi>
}

type I5jls3ar3odglq = {
  asset: Anonymize<I9epi5ni2mqt8s>
  owner: Anonymize<I43cmiele6sevi>
}

type I7cfckcbgdvb8j = {
  asset: Anonymize<I9epi5ni2mqt8s>
  locker: Anonymize<I43cmiele6sevi>
}

type I4nae9rsql8fa7 = { jit_withdraw: boolean }

type Ifq797dv2t3djd = {
  weight_limit: XcmV3WeightLimit
  check_origin: Anonymize<I74hapqfd00s9i>
}

type Ise9r0vrat2m6 = { origin: Anonymize<I43cmiele6sevi>; query_id: bigint }

type I7kkbgm2llu2o3 = { query_id: bigint; response: XcmV3Response }

type I2uqmls7kcdnii = {
  query_id: bigint
  pallet_index: number
  call_index: number
}

type Idg69klialbkb8 = {
  query_id: bigint
  pallet_index: number
  call_index: number
  actual_weight: Anonymize<I4q39t5hn830vp>
  max_budgeted_weight: Anonymize<I4q39t5hn830vp>
}

type I9j133okge3c2 = {
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_location: Anonymize<I74hapqfd00s9i>
}

type I30pg328m00nr3 = { query_id: bigint }

type I5qm1bvb2j3ap2 = {
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}

export type XcmVersionedMultiAssets = Enum<
  | { type: "V2"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "V3"; value: Anonymize<Id7mn3j3ge1h6a> }
>
export const XcmVersionedMultiAssets =
  _Enum as unknown as GetEnum<XcmVersionedMultiAssets>

type Ia3ggl9eghkufh = Array<Anonymize<I16mc4mv5bb0qd>>

type I16mc4mv5bb0qd = {
  id: XcmV2MultiassetAssetId
  fun: XcmV2MultiassetFungibility
}

export type XcmV2MultiassetAssetId = Enum<
  | { type: "Concrete"; value: Anonymize<Ibki0d249v3ojt> }
  | { type: "Abstract"; value: Anonymize<Binary> }
>
export const XcmV2MultiassetAssetId =
  _Enum as unknown as GetEnum<XcmV2MultiassetAssetId>

export type XcmV2MultiassetFungibility = Enum<
  | { type: "Fungible"; value: Anonymize<bigint> }
  | { type: "NonFungible"; value: Anonymize<XcmV2MultiassetAssetInstance> }
>
export const XcmV2MultiassetFungibility =
  _Enum as unknown as GetEnum<XcmV2MultiassetFungibility>

export type XcmV2MultiassetAssetInstance = Enum<
  | { type: "Undefined"; value: undefined }
  | { type: "Index"; value: Anonymize<bigint> }
  | { type: "Array4"; value: Anonymize<Binary> }
  | { type: "Array8"; value: Anonymize<Binary> }
  | { type: "Array16"; value: Anonymize<Binary> }
  | { type: "Array32"; value: Anonymize<Binary> }
  | { type: "Blob"; value: Anonymize<Binary> }
>
export const XcmV2MultiassetAssetInstance =
  _Enum as unknown as GetEnum<XcmV2MultiassetAssetInstance>

type I95aqmsd6gjmqs = {
  destination: Anonymize<I43cmiele6sevi>
  result: number
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}

type I732o5n04n5ohg = { location: Anonymize<I43cmiele6sevi>; version: number }

type Iarlf7ddo81fm5 = {
  location: Anonymize<I43cmiele6sevi>
  query_id: bigint
  error: XcmV3TraitsError
}

type Ie9bjgclf7vho0 = { location: XcmVersionedMultiLocation; query_id: bigint }

type I7dm0nb8u3g2hv = {
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_querier: Anonymize<I43cmiele6sevi>
  maybe_actual_querier: Anonymize<I74hapqfd00s9i>
}

type I5pnf8l8c1nkfk = {
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}

type Ibknqphki4flb3 = {
  paying: Anonymize<I43cmiele6sevi>
  fees: Anonymize<Id7mn3j3ge1h6a>
}

export type MessageQueueEvent = Enum<
  | { type: "ProcessingFailed"; value: Anonymize<I6ian27okrbc15> }
  | { type: "Processed"; value: Anonymize<I74b8cu68dfbfr> }
  | { type: "OverweightEnqueued"; value: Anonymize<Iacc6dee8ffsrh> }
  | { type: "PageReaped"; value: Anonymize<Ielsom2b1kkdm6> }
>
export const MessageQueueEvent = _Enum as unknown as GetEnum<MessageQueueEvent>

type I6ian27okrbc15 = {
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  error: ProcessMessageError
}

export type ParachainsInclusionAggregateMessageOrigin = Enum<{
  type: "Ump"
  value: Anonymize<ParachainsInclusionUmpQueueId>
}>
export const ParachainsInclusionAggregateMessageOrigin =
  _Enum as unknown as GetEnum<ParachainsInclusionAggregateMessageOrigin>

export type ParachainsInclusionUmpQueueId = Enum<{
  type: "Para"
  value: Anonymize<number>
}>
export const ParachainsInclusionUmpQueueId =
  _Enum as unknown as GetEnum<ParachainsInclusionUmpQueueId>

export type ProcessMessageError = Enum<
  | { type: "BadFormat"; value: undefined }
  | { type: "Corrupt"; value: undefined }
  | { type: "Unsupported"; value: undefined }
  | { type: "Overweight"; value: Anonymize<I4q39t5hn830vp> }
  | { type: "Yield"; value: undefined }
>
export const ProcessMessageError =
  _Enum as unknown as GetEnum<ProcessMessageError>

type I74b8cu68dfbfr = {
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  weight_used: Anonymize<I4q39t5hn830vp>
  success: boolean
}

type Iacc6dee8ffsrh = {
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
  message_index: number
}

type Ielsom2b1kkdm6 = {
  origin: ParachainsInclusionAggregateMessageOrigin
  index: number
}

type I1vmo9hpn12j0l = AnonymousEnum<{
  AssetRateCreated: Anonymize<I16soggnee6qrb>
  AssetRateRemoved: Anonymize<Ifvnf1s3g2lg8u>
  AssetRateUpdated: Anonymize<Iedcb9b2srjfp0>
}>

type I16soggnee6qrb = { asset_kind: Anonymize<I32r9skkupsthv>; rate: bigint }

type Ifvnf1s3g2lg8u = { asset_kind: Anonymize<I32r9skkupsthv> }

type Iedcb9b2srjfp0 = {
  asset_kind: Anonymize<I32r9skkupsthv>
  old: bigint
  new: bigint
}

type Idhnf6rtqoslea = Array<Binary>

type Iep4uo61810hfs = Array<Anonymize<I5g2vv0ckl2m8b>>

type Ieniouoqkq4icf = { spec_version: number; spec_name: string }

type Iddofueil04dld = Array<Anonymize<I1n29q4mt87e84>>

type I1n29q4mt87e84 = Anonymize<I7p2g4213d2vvu> | undefined

type I7p2g4213d2vvu = {
  maybe_id: Anonymize<I17k3ujudqd5df>
  priority: number
  call: PreimagesBounded
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  origin: PolkadotRuntimeOriginCaller
}

type I34gtdjipdmjpt = Anonymize<I5g2vv0ckl2m8b> | undefined

export type PolkadotRuntimeOriginCaller = Enum<
  | { type: "system"; value: Anonymize<DispatchRawOrigin> }
  | { type: "Origins"; value: Anonymize<GovernanceOrigin> }
  | { type: "ParachainsOrigin"; value: Anonymize<ParachainsOrigin> }
  | { type: "XcmPallet"; value: Anonymize<XcmPalletOrigin> }
  | { type: "Void"; value: Anonymize<undefined> }
>
export const PolkadotRuntimeOriginCaller =
  _Enum as unknown as GetEnum<PolkadotRuntimeOriginCaller>

export type DispatchRawOrigin = Enum<
  | { type: "Root"; value: undefined }
  | { type: "Signed"; value: Anonymize<SS58String> }
  | { type: "None"; value: undefined }
>
export const DispatchRawOrigin = _Enum as unknown as GetEnum<DispatchRawOrigin>

export type GovernanceOrigin = Enum<
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
export const GovernanceOrigin = _Enum as unknown as GetEnum<GovernanceOrigin>

export type ParachainsOrigin = Enum<{
  type: "Parachain"
  value: Anonymize<number>
}>
export const ParachainsOrigin = _Enum as unknown as GetEnum<ParachainsOrigin>

export type XcmPalletOrigin = Enum<
  | { type: "Xcm"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Response"; value: Anonymize<I43cmiele6sevi> }
>
export const XcmPalletOrigin = _Enum as unknown as GetEnum<XcmPalletOrigin>

export type PreimageRequestStatus = Enum<
  | { type: "Unrequested"; value: Anonymize<I5jej6bvdjrisr> }
  | { type: "Requested"; value: Anonymize<Is7sg1rr9u2nm> }
>
export const PreimageRequestStatus =
  _Enum as unknown as GetEnum<PreimageRequestStatus>

type I5jej6bvdjrisr = { deposit: Anonymize<I95l2k9b1re95f>; len: number }

type I95l2k9b1re95f = [SS58String, bigint]

type Is7sg1rr9u2nm = {
  deposit: Anonymize<I92hdo1clkbp4g>
  count: number
  len: Anonymize<I4arjljr6dpflb>
}

type I92hdo1clkbp4g = Anonymize<I95l2k9b1re95f> | undefined

type I4arjljr6dpflb = number | undefined

type I2gj0h0im54fqd = AnonymousEnum<{
  Unrequested: Anonymize<Idvcv8961o32th>
  Requested: Anonymize<In82i9avte5re>
}>

type Idvcv8961o32th = { ticket: Anonymize<I95l2k9b1re95f>; len: number }

type In82i9avte5re = {
  maybe_ticket: Anonymize<I92hdo1clkbp4g>
  count: number
  maybe_len: Anonymize<I4arjljr6dpflb>
}

export type BabeDigestsNextConfigDescriptor = Enum<{
  type: "V1"
  value: Anonymize<Idkva8q2m9meg0>
}>
export const BabeDigestsNextConfigDescriptor =
  _Enum as unknown as GetEnum<BabeDigestsNextConfigDescriptor>

type Idkva8q2m9meg0 = {
  c: Anonymize<I2j729bmgsdiuo>
  allowed_slots: BabeAllowedSlots
}

type I2j729bmgsdiuo = [bigint, bigint]

export type BabeAllowedSlots = Enum<
  | { type: "PrimarySlots"; value: undefined }
  | { type: "PrimaryAndSecondaryPlainSlots"; value: undefined }
  | { type: "PrimaryAndSecondaryVRFSlots"; value: undefined }
>
export const BabeAllowedSlots = _Enum as unknown as GetEnum<BabeAllowedSlots>

type I5o0h2ngv65fpq = BabeDigestsPreDigest | undefined

export type BabeDigestsPreDigest = Enum<
  | { type: "Primary"; value: Anonymize<I7u2rr2qf89ek5> }
  | { type: "SecondaryPlain"; value: Anonymize<Ieiaevc5q41ard> }
  | { type: "SecondaryVRF"; value: Anonymize<I7u2rr2qf89ek5> }
>
export const BabeDigestsPreDigest =
  _Enum as unknown as GetEnum<BabeDigestsPreDigest>

type I7u2rr2qf89ek5 = {
  authority_index: number
  slot: bigint
  vrf_signature: Anonymize<Iam4jhuje8i9kk>
}

type Iam4jhuje8i9kk = { output: Binary; proof: Binary }

type Ieiaevc5q41ard = { authority_index: number; slot: bigint }

type Ifip05kcrl65am = Array<Anonymize<I6cs1itejju2vv>>

type I6cs1itejju2vv = [bigint, number]

type Iff9heri56m1mb = [SS58String, bigint, boolean]

type Ibtifm27unhnjf = Array<Anonymize<I5b29v4qfq4tu7>>

type I5b29v4qfq4tu7 = {
  id: Binary
  amount: bigint
  reasons: BalancesTypesReasons
}

export type BalancesTypesReasons = Enum<
  | { type: "Fee"; value: undefined }
  | { type: "Misc"; value: undefined }
  | { type: "All"; value: undefined }
>
export const BalancesTypesReasons =
  _Enum as unknown as GetEnum<BalancesTypesReasons>

type Iactubn52acokl = Array<Anonymize<I32btm6htd9bck>>

type I32btm6htd9bck = { id: Binary; amount: bigint }

type I233put12fltor = Array<Anonymize<I2g6pdv83dq8hk>>

type I2g6pdv83dq8hk = { id: Anonymize<I9b9mogv9ee9ar>; amount: bigint }

type I9b9mogv9ee9ar = AnonymousEnum<{ Preimage: Anonymize<If81hvnpidvhl> }>

type If81hvnpidvhl = AnonymousEnum<{ Preimage: undefined }>

type Icqu54ik1fbovu = Array<Anonymize<I6nlcdgcjnohed>>

type I6nlcdgcjnohed = { id: Anonymize<Id52mcjgamb06q>; amount: bigint }

type Id52mcjgamb06q = AnonymousEnum<{
  NominationPools: Anonymize<I62v3u2ji2s72p>
}>

type I62v3u2ji2s72p = AnonymousEnum<{ PoolMinBalance: undefined }>

export type TransactionPaymentReleases = Enum<
  { type: "V1Ancient"; value: undefined } | { type: "V2"; value: undefined }
>
export const TransactionPaymentReleases =
  _Enum as unknown as GetEnum<TransactionPaymentReleases>

type Ia2lhg7l2hilo3 = Array<SS58String>

type I21nedsp35hoih = {
  stash: SS58String
  total: bigint
  active: bigint
  unlocking: Anonymize<I9nc4v1upo2c8e>
  claimed_rewards: Anonymize<Icgljjb6j82uhn>
}

type I9nc4v1upo2c8e = Array<Anonymize<I3niuuk38q4krr>>

type I3niuuk38q4krr = { value: bigint; era: number }

type Ic3m9d6tdl6gi2 = {
  targets: Anonymize<Ia2lhg7l2hilo3>
  submitted_in: number
  suppressed: boolean
}

type Ib3j7gb0jgs38u = { index: number; start: Anonymize<I35p85j063s0il> }

type I35p85j063s0il = bigint | undefined

type Iff9p3c7k6pfoi = { total: number; individual: Anonymize<I205qrookusi3d> }

type I205qrookusi3d = Array<Anonymize<I6ouflveob4eli>>

type I6ouflveob4eli = [SS58String, number]

type Iafq6t4rgheait = Array<Anonymize<Ifedledo2fog34>>

type Ifedledo2fog34 = {
  validator: SS58String
  own: bigint
  others: Anonymize<Iba9inugg1atvo>
  reporters: Anonymize<Ia2lhg7l2hilo3>
  payout: bigint
}

type Iba9inugg1atvo = Array<Anonymize<I95l2k9b1re95f>>

type I4ojmnsk1dchql = [number, bigint]

type Iinkhfdlka9ch = {
  span_index: number
  last_start: number
  last_nonzero_slash: number
  prior: Anonymize<Icgljjb6j82uhn>
}

type I2kj4j6mp68hf8 = { slashed: bigint; paid_out: bigint }

type Ia9ek8s49lerat = Array<Anonymize<I39p6ln31i4n46>>

type I39p6ln31i4n46 = [number, boolean]

type I2bqvqrg0sbrdj = {
  offender: Anonymize<Idi27pva6ajg4>
  reporters: Anonymize<Ia2lhg7l2hilo3>
}

type Iasase33a12046 = [Binary, Binary]

type I6gic9mme18mpd = Array<Anonymize<Idp8pf1r5mria2>>

type Idp8pf1r5mria2 = [SS58String, Anonymize<I4g61cdhi06s1m>]

type I4g61cdhi06s1m = {
  grandpa: Binary
  babe: Binary
  im_online: Binary
  para_validator: Binary
  para_assignment: Binary
  authority_discovery: Binary
  beefy: Binary
}

export type GrandpaStoredState = Enum<
  | { type: "Live"; value: undefined }
  | { type: "PendingPause"; value: Anonymize<Ib95oqfalvjqfe> }
  | { type: "Paused"; value: undefined }
  | { type: "PendingResume"; value: Anonymize<Ib95oqfalvjqfe> }
>
export const GrandpaStoredState =
  _Enum as unknown as GetEnum<GrandpaStoredState>

type Ib95oqfalvjqfe = { scheduled_at: number; delay: number }

type Ibu50q5vhsfq5e = {
  scheduled_at: number
  delay: number
  next_authorities: Anonymize<I2qinct8jq4bqe>
  forced: Anonymize<I4arjljr6dpflb>
}

type Iegmj7n48sc3am = {
  proposer: SS58String
  value: bigint
  beneficiary: SS58String
  bond: bigint
}

type Ie05qfg5feue1l = {
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: number
  expire_at: number
  status: Anonymize<Ie3iqv87ntls1>
}

type Ie3iqv87ntls1 = AnonymousEnum<{
  Pending: undefined
  Attempted: Anonymize<I4ov6e94l79mbg>
  Failed: undefined
}>

type I4ov6e94l79mbg = { id: bigint }

export type ConvictionVotingVoteVoting = Enum<
  | { type: "Casting"; value: Anonymize<If52hjr5c5nrc5> }
  | { type: "Delegating"; value: Anonymize<I77dj6ku8n5d58> }
>
export const ConvictionVotingVoteVoting =
  _Enum as unknown as GetEnum<ConvictionVotingVoteVoting>

type If52hjr5c5nrc5 = {
  votes: Anonymize<I42jj1su7asrm9>
  delegations: Anonymize<I538qha8r4j3ii>
  prior: Anonymize<I4ojmnsk1dchql>
}

type I42jj1su7asrm9 = Array<Anonymize<I7mk5ivue8lr2m>>

type I7mk5ivue8lr2m = [number, ConvictionVotingVoteAccountVote]

export type ConvictionVotingVoteAccountVote = Enum<
  | { type: "Standard"; value: Anonymize<Ib024p97ls1cla> }
  | { type: "Split"; value: Anonymize<I5pi71t9bosoiv> }
  | { type: "SplitAbstain"; value: Anonymize<I89irppcaqmf1i> }
>
export const ConvictionVotingVoteAccountVote =
  _Enum as unknown as GetEnum<ConvictionVotingVoteAccountVote>

type Ib024p97ls1cla = { vote: number; balance: bigint }

type I5pi71t9bosoiv = { aye: bigint; nay: bigint }

type I89irppcaqmf1i = { aye: bigint; nay: bigint; abstain: bigint }

type I538qha8r4j3ii = { votes: bigint; capital: bigint }

type I77dj6ku8n5d58 = {
  balance: bigint
  target: SS58String
  conviction: VotingConviction
  delegations: Anonymize<I538qha8r4j3ii>
  prior: Anonymize<I4ojmnsk1dchql>
}

export type VotingConviction = Enum<
  | { type: "None"; value: undefined }
  | { type: "Locked1x"; value: undefined }
  | { type: "Locked2x"; value: undefined }
  | { type: "Locked3x"; value: undefined }
  | { type: "Locked4x"; value: undefined }
  | { type: "Locked5x"; value: undefined }
  | { type: "Locked6x"; value: undefined }
>
export const VotingConviction = _Enum as unknown as GetEnum<VotingConviction>

type If9jidduiuq7vv = Array<Anonymize<I4ojmnsk1dchql>>

export type ReferendaTypesReferendumInfo = Enum<
  | { type: "Ongoing"; value: Anonymize<Iec63114qk6dsm> }
  | { type: "Approved"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Rejected"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Cancelled"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "TimedOut"; value: Anonymize<Ini94eljn5lj8> }
  | { type: "Killed"; value: Anonymize<number> }
>
export const ReferendaTypesReferendumInfo =
  _Enum as unknown as GetEnum<ReferendaTypesReferendumInfo>

type Iec63114qk6dsm = {
  track: number
  origin: PolkadotRuntimeOriginCaller
  proposal: PreimagesBounded
  enactment: TraitsScheduleDispatchTime
  submitted: number
  submission_deposit: Anonymize<Id5fm4p8lj5qgi>
  decision_deposit: Anonymize<Ibd24caul84kv2>
  deciding: Anonymize<Ibcbcndfmk0jd9>
  tally: Anonymize<Ifsk7cbmtit1jd>
  in_queue: boolean
  alarm: Anonymize<I653443ft89b0e>
}

export type TraitsScheduleDispatchTime = Enum<
  | { type: "At"; value: Anonymize<number> }
  | { type: "After"; value: Anonymize<number> }
>
export const TraitsScheduleDispatchTime =
  _Enum as unknown as GetEnum<TraitsScheduleDispatchTime>

type Ibd24caul84kv2 = Anonymize<Id5fm4p8lj5qgi> | undefined

type Ibcbcndfmk0jd9 = Anonymize<I4a0pk3ivg0trh> | undefined

type I4a0pk3ivg0trh = { since: number; confirming: Anonymize<I4arjljr6dpflb> }

type I653443ft89b0e = Anonymize<I52d1f0503mqv7> | undefined

type I52d1f0503mqv7 = [number, Anonymize<I5g2vv0ckl2m8b>]

type Ini94eljn5lj8 = [
  number,
  Anonymize<Ibd24caul84kv2>,
  Anonymize<Ibd24caul84kv2>,
]

type I2phecamkn3pej = [bigint, bigint, number]

export type ClaimsStatementKind = Enum<
  { type: "Regular"; value: undefined } | { type: "Saft"; value: undefined }
>
export const ClaimsStatementKind =
  _Enum as unknown as GetEnum<ClaimsStatementKind>

type Ifble4juuml5ig = Array<Anonymize<I4aro1m78pdrtt>>

type I4aro1m78pdrtt = {
  locked: bigint
  per_block: bigint
  starting_block: number
}

export type VestingReleases = Enum<
  { type: "V0"; value: undefined } | { type: "V1"; value: undefined }
>
export const VestingReleases = _Enum as unknown as GetEnum<VestingReleases>

type I60cr97f9of5s5 = {
  judgements: Anonymize<I8lr6mvrp6262n>
  deposit: bigint
  info: Anonymize<I939m6d6t3dsgm>
}

type I8lr6mvrp6262n = Array<Anonymize<Icjt4rtq0era77>>

type Icjt4rtq0era77 = [number, IdentityJudgement]

export type IdentityJudgement = Enum<
  | { type: "Unknown"; value: undefined }
  | { type: "FeePaid"; value: Anonymize<bigint> }
  | { type: "Reasonable"; value: undefined }
  | { type: "KnownGood"; value: undefined }
  | { type: "OutOfDate"; value: undefined }
  | { type: "LowQuality"; value: undefined }
  | { type: "Erroneous"; value: undefined }
>
export const IdentityJudgement = _Enum as unknown as GetEnum<IdentityJudgement>

type I939m6d6t3dsgm = {
  additional: Anonymize<I33d2rrv01sdlq>
  display: IdentityTypesData
  legal: IdentityTypesData
  web: IdentityTypesData
  riot: IdentityTypesData
  email: IdentityTypesData
  pgp_fingerprint: Anonymize<I9k5avl0v1ch15>
  image: IdentityTypesData
  twitter: IdentityTypesData
}

type I33d2rrv01sdlq = Array<Anonymize<I22blct134ortt>>

type I22blct134ortt = [IdentityTypesData, IdentityTypesData]

export type IdentityTypesData = Enum<
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
export const IdentityTypesData = _Enum as unknown as GetEnum<IdentityTypesData>

type I9k5avl0v1ch15 = Binary | undefined

type Ib22937a5d3pt0 = [SS58String, IdentityTypesData]

type I4nfjdef0ibh44 = [bigint, Anonymize<Ia2lhg7l2hilo3>]

type I74af64m08r6as = Array<Anonymize<I48v3sekdprq30>>

type I48v3sekdprq30 = Anonymize<Icj8lp9f0lq0bm> | undefined

type Icj8lp9f0lq0bm = { account: SS58String; fee: bigint; fields: bigint }

type If0n3k77qd4p7k = [Anonymize<Id1245cgi7butj>, bigint]

type Id1245cgi7butj = Array<Anonymize<Ic03hb2bbrcdle>>

type Ic03hb2bbrcdle = {
  delegate: SS58String
  proxy_type: ProxyType
  delay: number
}

type I3tjio59962rg2 = [Anonymize<I99svmvk5amkcq>, bigint]

type I99svmvk5amkcq = Array<Anonymize<I5gk1hg65t79fm>>

type I5gk1hg65t79fm = { real: SS58String; call_hash: Binary; height: number }

type Iag146hmjgqfgj = {
  when: Anonymize<Itvprrpb0nm3o>
  deposit: bigint
  depositor: SS58String
  approvals: Anonymize<Ia2lhg7l2hilo3>
}

type I73gble6tmb52f = [SS58String, Binary]

type Ic28sp53lp2v4a = {
  proposer: SS58String
  value: bigint
  fee: bigint
  curator_deposit: bigint
  bond: bigint
  status: BountiesBountyStatus
}

export type BountiesBountyStatus = Enum<
  | { type: "Proposed"; value: undefined }
  | { type: "Approved"; value: undefined }
  | { type: "Funded"; value: undefined }
  | { type: "CuratorProposed"; value: Anonymize<I846573mdj1pfn> }
  | { type: "Active"; value: Anonymize<I5s3sqq6r9nt63> }
  | { type: "PendingPayout"; value: Anonymize<I4aulgjqrdphrm> }
>
export const BountiesBountyStatus =
  _Enum as unknown as GetEnum<BountiesBountyStatus>

type I846573mdj1pfn = { curator: SS58String }

type I5s3sqq6r9nt63 = { curator: SS58String; update_due: number }

type I4aulgjqrdphrm = {
  curator: SS58String
  beneficiary: SS58String
  unlock_at: number
}

type Idvn49j11itec9 = {
  parent_bounty: number
  value: bigint
  fee: bigint
  curator_deposit: bigint
  status: ChildBountyStatus
}

export type ChildBountyStatus = Enum<
  | { type: "Added"; value: undefined }
  | { type: "CuratorProposed"; value: Anonymize<I846573mdj1pfn> }
  | { type: "Active"; value: Anonymize<I846573mdj1pfn> }
  | { type: "PendingPayout"; value: Anonymize<I4aulgjqrdphrm> }
>
export const ChildBountyStatus = _Enum as unknown as GetEnum<ChildBountyStatus>

type Ia5nfh4hon3go3 = {
  supports: Anonymize<I4bboqsv44evel>
  score: Anonymize<I8s6n43okuj2b1>
  compute: ElectionProviderMultiPhaseElectionCompute
}

type I4bboqsv44evel = Array<Anonymize<Ib5vlbiqndekn9>>

type Ib5vlbiqndekn9 = [SS58String, Anonymize<I7qb1luldf1jtf>]

type I7qb1luldf1jtf = { total: bigint; voters: Anonymize<Iba9inugg1atvo> }

type Ia7o65280hur3p = {
  voters: Anonymize<I9cpogojpnsq8h>
  targets: Anonymize<Ia2lhg7l2hilo3>
}

type I9cpogojpnsq8h = Array<Anonymize<I6dvmrbp80vk5k>>

type I6dvmrbp80vk5k = [SS58String, bigint, Anonymize<Ia2lhg7l2hilo3>]

type Iasd2iat48n080 = { voters: number; targets: number }

type Ic8d01sg6acf60 = Array<Anonymize<Ie663uperueqm5>>

type Ie663uperueqm5 = [Anonymize<I8s6n43okuj2b1>, number, number]

type Irl37q7erstrb = {
  who: SS58String
  deposit: bigint
  raw_solution: Anonymize<I7je4n92ump862>
  call_fee: bigint
}

type I7je4n92ump862 = {
  solution: Anonymize<I1nvcsqg39g26j>
  score: Anonymize<I8s6n43okuj2b1>
  round: number
}

type I1nvcsqg39g26j = {
  votes1: Anonymize<Iep4uo61810hfs>
  votes2: Anonymize<Ickjq69hlul8c3>
  votes3: Anonymize<Icf645ln9bi1bj>
  votes4: Anonymize<I8nospv7k5s457>
  votes5: Anonymize<Iig9pofg77rah>
  votes6: Anonymize<Irttjt9tghoc0>
  votes7: Anonymize<I3o5epjr2va0dl>
  votes8: Anonymize<I1gfnebceebqb5>
  votes9: Anonymize<Ibo38fh2dhj4it>
  votes10: Anonymize<Id4gvspmdh8h9l>
  votes11: Anonymize<I5be3ho5m1r68a>
  votes12: Anonymize<I7s2sh7cpuv56r>
  votes13: Anonymize<I5fq8855gfhmlo>
  votes14: Anonymize<I4mvok713k4g7o>
  votes15: Anonymize<I90tu9lmjmhfhd>
  votes16: Anonymize<I3cqaev9m4hn9m>
}

type Ickjq69hlul8c3 = Array<Anonymize<I4l2a0q04ni20o>>

type I4l2a0q04ni20o = [number, Anonymize<I5g2vv0ckl2m8b>, number]

type Icf645ln9bi1bj = Array<Anonymize<Iamqg950vpqsp8>>

type Iamqg950vpqsp8 = [number, Anonymize<Iffarf0mj066h7>, number]

type Iffarf0mj066h7 = Array<Anonymize<I5g2vv0ckl2m8b>>

type I8nospv7k5s457 = Array<Anonymize<Ifr1o6ri1uf2of>>

type Ifr1o6ri1uf2of = [number, Anonymize<I33ipki9g5n04l>, number]

type I33ipki9g5n04l = Array<Anonymize<I5g2vv0ckl2m8b>>

type Iig9pofg77rah = Array<Anonymize<I4gus921fjj8lq>>

type I4gus921fjj8lq = [number, Anonymize<If6gr8nt3vreg9>, number]

type If6gr8nt3vreg9 = Array<Anonymize<I5g2vv0ckl2m8b>>

type Irttjt9tghoc0 = Array<Anonymize<I9h1lfefrjrss8>>

type I9h1lfefrjrss8 = [number, Anonymize<I8kcfo1iikpfd7>, number]

type I8kcfo1iikpfd7 = Array<Anonymize<I5g2vv0ckl2m8b>>

type I3o5epjr2va0dl = Array<Anonymize<I85q51vkapcmho>>

type I85q51vkapcmho = [number, Anonymize<I829dlpp8f7vhg>, number]

type I829dlpp8f7vhg = Array<Anonymize<I5g2vv0ckl2m8b>>

type I1gfnebceebqb5 = Array<Anonymize<I9kgeuvub0nepg>>

type I9kgeuvub0nepg = [number, Anonymize<Ie65d4ts6gb5rk>, number]

type Ie65d4ts6gb5rk = Array<Anonymize<I5g2vv0ckl2m8b>>

type Ibo38fh2dhj4it = Array<Anonymize<Ipcskss5flcis>>

type Ipcskss5flcis = [number, Anonymize<I45nria0sqoino>, number]

type I45nria0sqoino = Array<Anonymize<I5g2vv0ckl2m8b>>

type Id4gvspmdh8h9l = Array<Anonymize<Ifdgh79k56960e>>

type Ifdgh79k56960e = [number, Anonymize<Ie8fi1901h656e>, number]

type Ie8fi1901h656e = Array<Anonymize<I5g2vv0ckl2m8b>>

type I5be3ho5m1r68a = Array<Anonymize<I5n2npru4pt8nc>>

type I5n2npru4pt8nc = [number, Anonymize<I1ap4gedi13j9r>, number]

type I1ap4gedi13j9r = Array<Anonymize<I5g2vv0ckl2m8b>>

type I7s2sh7cpuv56r = Array<Anonymize<I2udmq2v26rio>>

type I2udmq2v26rio = [number, Anonymize<I5vtd36r5b6fss>, number]

type I5vtd36r5b6fss = Array<Anonymize<I5g2vv0ckl2m8b>>

type I5fq8855gfhmlo = Array<Anonymize<Id2nvrmi6cagga>>

type Id2nvrmi6cagga = [number, Anonymize<Iee99h3pht9j20>, number]

type Iee99h3pht9j20 = Array<Anonymize<I5g2vv0ckl2m8b>>

type I4mvok713k4g7o = Array<Anonymize<I2ajtdvlncoqrd>>

type I2ajtdvlncoqrd = [number, Anonymize<I3lmls9cse1mcr>, number]

type I3lmls9cse1mcr = Array<Anonymize<I5g2vv0ckl2m8b>>

type I90tu9lmjmhfhd = Array<Anonymize<Ifn0i2gsu8pkck>>

type Ifn0i2gsu8pkck = [number, Anonymize<Ia1o13i3p2r7gm>, number]

type Ia1o13i3p2r7gm = Array<Anonymize<I5g2vv0ckl2m8b>>

type I3cqaev9m4hn9m = Array<Anonymize<Icrp3ubf87cjna>>

type Icrp3ubf87cjna = [number, Anonymize<I8c5gqvfaedv6e>, number]

type I8c5gqvfaedv6e = Array<Anonymize<I5g2vv0ckl2m8b>>

type Ic5t26f9cp3tvk = {
  id: SS58String
  prev: Anonymize<Ihfphjolmsqq1>
  next: Anonymize<Ihfphjolmsqq1>
  bag_upper: bigint
  score: bigint
}

type I39k39h6vu4hbq = {
  head: Anonymize<Ihfphjolmsqq1>
  tail: Anonymize<Ihfphjolmsqq1>
}

type Idphjddn2h69vc = {
  pool_id: number
  points: bigint
  last_recorded_reward_counter: bigint
  unbonding_eras: Anonymize<If9jidduiuq7vv>
}

type I13ttsmlfr8g52 = {
  commission: Anonymize<I30ffej1k6vjpu>
  member_counter: number
  points: bigint
  roles: Anonymize<Ia8iksu9hedf5n>
  state: NominationPoolsPoolState
}

type I30ffej1k6vjpu = {
  current: Anonymize<Ie8iutm7u02lmj>
  max: Anonymize<I4arjljr6dpflb>
  change_rate: Anonymize<I7hapkpc6mcou7>
  throttle_from: Anonymize<I4arjljr6dpflb>
}

type I7hapkpc6mcou7 = Anonymize<Ibqul338t9c1ll> | undefined

type Ia8iksu9hedf5n = {
  depositor: SS58String
  root: Anonymize<Ihfphjolmsqq1>
  nominator: Anonymize<Ihfphjolmsqq1>
  bouncer: Anonymize<Ihfphjolmsqq1>
}

type If6qa32dj75gu1 = {
  last_recorded_reward_counter: bigint
  last_recorded_total_payouts: bigint
  total_rewards_claimed: bigint
  total_commission_pending: bigint
  total_commission_claimed: bigint
}

type I7oo2mprv1qd1s = {
  no_era: Anonymize<I4h0cfnkiqrna6>
  with_era: Anonymize<I48jqs22bfh5as>
}

type I4h0cfnkiqrna6 = { points: bigint; balance: bigint }

type I48jqs22bfh5as = Array<Anonymize<Ifp6metskahp08>>

type Ifp6metskahp08 = [number, Anonymize<I4h0cfnkiqrna6>]

export type NominationPoolsClaimPermission = Enum<
  | { type: "Permissioned"; value: undefined }
  | { type: "PermissionlessCompound"; value: undefined }
  | { type: "PermissionlessWithdraw"; value: undefined }
  | { type: "PermissionlessAll"; value: undefined }
>
export const NominationPoolsClaimPermission =
  _Enum as unknown as GetEnum<NominationPoolsClaimPermission>

type I2eh80qovrl7h2 = {
  stashes: Anonymize<Iba9inugg1atvo>
  checked: Anonymize<Icgljjb6j82uhn>
}

type Ia2hpj72knb2q9 = {
  max_code_size: number
  max_head_data_size: number
  max_upward_queue_count: number
  max_upward_queue_size: number
  max_upward_message_size: number
  max_upward_message_num_per_candidate: number
  hrmp_max_message_num_per_candidate: number
  validation_upgrade_cooldown: number
  validation_upgrade_delay: number
  async_backing_params: Anonymize<Iavuvfkop6318c>
  max_pov_size: number
  max_downward_message_size: number
  hrmp_max_parachain_outbound_channels: number
  hrmp_sender_deposit: bigint
  hrmp_recipient_deposit: bigint
  hrmp_channel_max_capacity: number
  hrmp_channel_max_total_size: number
  hrmp_max_parachain_inbound_channels: number
  hrmp_channel_max_message_size: number
  executor_params: Anonymize<I6sbufrhmgqdb6>
  code_retention_period: number
  on_demand_cores: number
  on_demand_retries: number
  on_demand_queue_max_size: number
  on_demand_target_queue_utilization: number
  on_demand_fee_variability: number
  on_demand_base_fee: bigint
  on_demand_ttl: number
  group_rotation_frequency: number
  paras_availability_period: number
  scheduling_lookahead: number
  max_validators_per_core: Anonymize<I4arjljr6dpflb>
  max_validators: Anonymize<I4arjljr6dpflb>
  dispute_period: number
  dispute_post_conclusion_acceptance_period: number
  no_show_slots: number
  n_delay_tranches: number
  zeroth_delay_tranche_width: number
  needed_approvals: number
  relay_vrf_modulo_samples: number
  pvf_voting_ttl: number
  minimum_validation_upgrade_delay: number
  minimum_backing_votes: number
}

type Iavuvfkop6318c = {
  max_candidate_depth: number
  allowed_ancestry_len: number
}

type I6sbufrhmgqdb6 = Array<PolkadotPrimitivesV5ExecutorParam>

export type PolkadotPrimitivesV5ExecutorParam = Enum<
  | { type: "MaxMemoryPages"; value: Anonymize<number> }
  | { type: "StackLogicalMax"; value: Anonymize<number> }
  | { type: "StackNativeMax"; value: Anonymize<number> }
  | { type: "PrecheckingMaxMemory"; value: Anonymize<bigint> }
  | { type: "PvfPrepTimeout"; value: Anonymize<Iekilhq74ak677> }
  | { type: "PvfExecTimeout"; value: Anonymize<I3fsjjoj6u1h98> }
  | { type: "WasmExtBulkMemory"; value: undefined }
>
export const PolkadotPrimitivesV5ExecutorParam =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5ExecutorParam>

type Iekilhq74ak677 = [PolkadotPrimitivesV5PvfPrepTimeoutKind, bigint]

export type PolkadotPrimitivesV5PvfPrepTimeoutKind = Enum<
  { type: "Precheck"; value: undefined } | { type: "Lenient"; value: undefined }
>
export const PolkadotPrimitivesV5PvfPrepTimeoutKind =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5PvfPrepTimeoutKind>

type I3fsjjoj6u1h98 = [PolkadotPrimitivesV5PvfExecTimeoutKind, bigint]

export type PolkadotPrimitivesV5PvfExecTimeoutKind = Enum<
  { type: "Backing"; value: undefined } | { type: "Approval"; value: undefined }
>
export const PolkadotPrimitivesV5PvfExecTimeoutKind =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5PvfExecTimeoutKind>

type Ies9ffs3ho1o06 = Array<Anonymize<If7itfec5udsb7>>

type If7itfec5udsb7 = [number, Anonymize<Ia2hpj72knb2q9>]

type I663ddds93n8hc = {
  buffer: Anonymize<Idm6djpsp7gtcm>
  latest_number: number
}

type Idm6djpsp7gtcm = Array<Anonymize<Idc5h3lsmctk6r>>

type Idc5h3lsmctk6r = [Binary, Binary]

type I78e99376i3249 = {
  bitfield: { bytes: Uint8Array; bitsLen: number }
  submitted_at: number
}

type Ic4ms979ng98e4 = {
  core: number
  hash: Binary
  descriptor: Anonymize<Ib2u20s6roco9i>
  availability_votes: { bytes: Uint8Array; bitsLen: number }
  backers: { bytes: Uint8Array; bitsLen: number }
  relay_parent_number: number
  backed_in_number: number
  backing_group: number
}

type Ic1d4u2opv3fst = {
  upward_messages: Anonymize<Itom7fk49o0c9>
  horizontal_messages: Anonymize<I6r5cbv8ttrb09>
  new_validation_code: Anonymize<Iabpgqcjikia83>
  head_data: Binary
  processed_downward_messages: number
  hrmp_watermark: number
}

type Itom7fk49o0c9 = Array<Binary>

type I6r5cbv8ttrb09 = Array<Anonymize<I958l48g4qg5rf>>

type I958l48g4qg5rf = { recipient: number; data: Binary }

type Iabpgqcjikia83 = Binary | undefined

type I3qttgoifdk5v6 = {
  session: number
  backing_validators_per_candidate: Anonymize<Ibabtlc0psj69a>
  disputes: Anonymize<I65nq8pomrmfij>
}

type Ibabtlc0psj69a = Array<Anonymize<I2sj9sob0g74s5>>

type I2sj9sob0g74s5 = [Anonymize<I4vjld3472quct>, Anonymize<Icl1tha16t1g7m>]

type Icl1tha16t1g7m = Array<Anonymize<I63c844nk8i073>>

type I63c844nk8i073 = [number, PolkadotPrimitivesV5ValidityAttestation]

export type PolkadotPrimitivesV5ValidityAttestation = Enum<
  | { type: "Implicit"; value: Anonymize<Binary> }
  | { type: "Explicit"; value: Anonymize<Binary> }
>
export const PolkadotPrimitivesV5ValidityAttestation =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5ValidityAttestation>

type I65nq8pomrmfij = Array<Anonymize<I23k12glbhqmf9>>

type I23k12glbhqmf9 = {
  candidate_hash: Binary
  session: number
  statements: Anonymize<I7ceopstr9sdg3>
}

type I7ceopstr9sdg3 = Array<Anonymize<I7lb7fdn2b9rgb>>

type I7lb7fdn2b9rgb = [PolkadotPrimitivesV5DisputeStatement, number, Binary]

export type PolkadotPrimitivesV5DisputeStatement = Enum<
  | {
      type: "Valid"
      value: Anonymize<PolkadotPrimitivesV5ValidDisputeStatementKind>
    }
  | {
      type: "Invalid"
      value: Anonymize<PolkadotPrimitivesV5InvalidDisputeStatementKind>
    }
>
export const PolkadotPrimitivesV5DisputeStatement =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5DisputeStatement>

export type PolkadotPrimitivesV5ValidDisputeStatementKind = Enum<
  | { type: "Explicit"; value: undefined }
  | { type: "BackingSeconded"; value: Anonymize<Binary> }
  | { type: "BackingValid"; value: Anonymize<Binary> }
  | { type: "ApprovalChecking"; value: undefined }
>
export const PolkadotPrimitivesV5ValidDisputeStatementKind =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5ValidDisputeStatementKind>

export type PolkadotPrimitivesV5InvalidDisputeStatementKind = Enum<{
  type: "Explicit"
  value: undefined
}>
export const PolkadotPrimitivesV5InvalidDisputeStatementKind =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5InvalidDisputeStatementKind>

type Iarlj3qd8u1v13 = Array<Anonymize<Icgljjb6j82uhn>>

type In9ekmba4m5ft = Array<PolkadotPrimitivesV5CoreOccupied>

export type PolkadotPrimitivesV5CoreOccupied = Enum<
  | { type: "Free"; value: undefined }
  | { type: "Paras"; value: Anonymize<I7kvbv2iq0pupl> }
>
export const PolkadotPrimitivesV5CoreOccupied =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5CoreOccupied>

type I7kvbv2iq0pupl = {
  assignment: number
  availability_timeouts: number
  ttl: number
}

type Ievsccbpmuhatk = Array<Anonymize<Iabtbb330q3t3q>>

type Iabtbb330q3t3q = [number, Anonymize<Icsuua8kklr5k2>]

type Icsuua8kklr5k2 = Array<Anonymize<I9b8vdn68or1nt>>

type I9b8vdn68or1nt = Anonymize<I7kvbv2iq0pupl> | undefined

type Iaja1oeag5u4b3 = {
  votes_accept: { bytes: Uint8Array; bitsLen: number }
  votes_reject: { bytes: Uint8Array; bitsLen: number }
  age: number
  created_at: number
  causes: Anonymize<Ia0a9586d8d811>
}

type Ia0a9586d8d811 = Array<Anonymize<I2abaj015pgc0k>>

type I2abaj015pgc0k = AnonymousEnum<{
  Onboarding: Anonymize<number>
  Upgrade: Anonymize<Ic9rr4c78iumk2>
}>

type Ic9rr4c78iumk2 = {
  id: number
  included_at: number
  set_go_ahead: DispatchPays
}

export type ParachainsParasParaLifecycle = Enum<
  | { type: "Onboarding"; value: undefined }
  | { type: "Parathread"; value: undefined }
  | { type: "Parachain"; value: undefined }
  | { type: "UpgradingParathread"; value: undefined }
  | { type: "DowngradingParachain"; value: undefined }
  | { type: "OffboardingParathread"; value: undefined }
  | { type: "OffboardingParachain"; value: undefined }
>
export const ParachainsParasParaLifecycle =
  _Enum as unknown as GetEnum<ParachainsParasParaLifecycle>

type I79cs1p3m59mo7 = {
  upgrade_times: Anonymize<I2v6n2k262gqsq>
  last_pruned: Anonymize<I4arjljr6dpflb>
}

type I2v6n2k262gqsq = Array<Anonymize<Ioham9r6hhu19>>

type Ioham9r6hhu19 = { expected_at: number; activated_at: number }

export type PolkadotPrimitivesV5UpgradeGoAhead = Enum<
  { type: "Abort"; value: undefined } | { type: "GoAhead"; value: undefined }
>
export const PolkadotPrimitivesV5UpgradeGoAhead =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5UpgradeGoAhead>

export type PolkadotPrimitivesV5UpgradeRestriction = Enum<{
  type: "Present"
  value: undefined
}>
export const PolkadotPrimitivesV5UpgradeRestriction =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5UpgradeRestriction>

type I2duhnt686rv0q = {
  genesis_head: Binary
  validation_code: Binary
  para_kind: boolean
}

type I14hoekog5s49k = Array<Anonymize<I36mfku1ea0i8t>>

type I36mfku1ea0i8t = {
  validators: Anonymize<Idhnf6rtqoslea>
  queued: Anonymize<Idhnf6rtqoslea>
  session_index: number
}

type I6ljjd4b5fa4ov = Array<Anonymize<I60847k37jfcc6>>

type I60847k37jfcc6 = { sent_at: number; msg: Binary }

type Ibhmrlkcu01imb = {
  confirmed: boolean
  _age: number
  sender_deposit: bigint
  max_message_size: number
  max_capacity: number
  max_total_size: number
}

type Id43g4eveajpkl = Array<Anonymize<I50mrcbubp554e>>

type I6u4labiv1bntm = {
  max_capacity: number
  max_total_size: number
  max_message_size: number
  msg_count: number
  total_size: number
  mqc_head: Anonymize<I17k3ujudqd5df>
  sender_deposit: bigint
  recipient_deposit: bigint
}

type Iev3u09i2vqn93 = Array<Anonymize<I409qo0sfkbh16>>

type I409qo0sfkbh16 = { sent_at: number; data: Binary }

type I9olhgo2o08h7b = Array<Anonymize<I8pg2rpr4ldgp9>>

type I8pg2rpr4ldgp9 = [number, Anonymize<Icgljjb6j82uhn>]

type I7k9oi9p83j43l = {
  active_validator_indices: Anonymize<Icgljjb6j82uhn>
  random_seed: Binary
  dispute_period: number
  validators: Anonymize<Idhnf6rtqoslea>
  discovery_keys: Anonymize<Idhnf6rtqoslea>
  assignment_keys: Anonymize<Idhnf6rtqoslea>
  validator_groups: Anonymize<Iarlj3qd8u1v13>
  n_cores: number
  zeroth_delay_tranche_width: number
  relay_vrf_modulo_samples: number
  n_delay_tranches: number
  no_show_slots: number
  needed_approvals: number
}

type I87u7jalc0lhah = {
  validators_for: { bytes: Uint8Array; bitsLen: number }
  validators_against: { bytes: Uint8Array; bitsLen: number }
  start: number
  concluded_at: Anonymize<I4arjljr6dpflb>
}

type If89923vhoiaim = [number, Binary]

type I3g2jv3qmtkrbe = {
  keys: Anonymize<I93ssha9egqq23>
  kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
}

type I93ssha9egqq23 = Array<Anonymize<If89923vhoiaim>>

export type PolkadotPrimitivesV5SlashingSlashingOffenceKind = Enum<
  | { type: "ForInvalid"; value: undefined }
  | { type: "AgainstValid"; value: undefined }
>
export const PolkadotPrimitivesV5SlashingSlashingOffenceKind =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5SlashingSlashingOffenceKind>

type I3av628q6dt6mq = {
  manager: SS58String
  deposit: bigint
  locked: Anonymize<I8ie0dco0kcuq5>
}

type I8ie0dco0kcuq5 = boolean | undefined

type Ifmaahl40gom3g = Array<Anonymize<I92hdo1clkbp4g>>

type I70iuri2ilha1f = Array<Anonymize<I1qlf98109qt29>>

type I1qlf98109qt29 = Anonymize<I7fcree6lak6uv> | undefined

type I7fcree6lak6uv = [SS58String, number, bigint]

type I2neqklu8gtd27 = {
  depositor: SS58String
  verifier: Anonymize<I8t18p6mokc3s4>
  deposit: bigint
  raised: bigint
  end: number
  cap: bigint
  last_contribution: CommonCrowdloanLastContribution
  first_period: number
  last_period: number
  fund_index: number
}

type I8t18p6mokc3s4 = MultiSigner | undefined

export type MultiSigner = Enum<
  | { type: "Ed25519"; value: Anonymize<Binary> }
  | { type: "Sr25519"; value: Anonymize<Binary> }
  | { type: "Ecdsa"; value: Anonymize<Binary> }
>
export const MultiSigner = _Enum as unknown as GetEnum<MultiSigner>

export type CommonCrowdloanLastContribution = Enum<
  | { type: "Never"; value: undefined }
  | { type: "PreEnding"; value: Anonymize<number> }
  | { type: "Ending"; value: Anonymize<number> }
>
export const CommonCrowdloanLastContribution =
  _Enum as unknown as GetEnum<CommonCrowdloanLastContribution>

export type XcmPalletQueryStatus = Enum<
  | { type: "Pending"; value: Anonymize<Ichb9e5l86b18e> }
  | { type: "VersionNotifier"; value: Anonymize<I3mn2je4qtr2lg> }
  | { type: "Ready"; value: Anonymize<I7p4s7atk8cdq4> }
>
export const XcmPalletQueryStatus =
  _Enum as unknown as GetEnum<XcmPalletQueryStatus>

type Ichb9e5l86b18e = {
  responder: XcmVersionedMultiLocation
  maybe_match_querier: Anonymize<Iffpe9i5dcgbrq>
  maybe_notify: Anonymize<I34gtdjipdmjpt>
  timeout: number
}

type Iffpe9i5dcgbrq = XcmVersionedMultiLocation | undefined

type I3mn2je4qtr2lg = { origin: XcmVersionedMultiLocation; is_active: boolean }

type I7p4s7atk8cdq4 = { response: XcmVersionedResponse; at: number }

export type XcmVersionedResponse = Enum<
  | { type: "V2"; value: Anonymize<XcmV2Response> }
  | { type: "V3"; value: Anonymize<XcmV3Response> }
>
export const XcmVersionedResponse =
  _Enum as unknown as GetEnum<XcmVersionedResponse>

export type XcmV2Response = Enum<
  | { type: "Null"; value: undefined }
  | { type: "Assets"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "ExecutionResult"; value: Anonymize<I17i9gqt27hetc> }
  | { type: "Version"; value: Anonymize<number> }
>
export const XcmV2Response = _Enum as unknown as GetEnum<XcmV2Response>

type I17i9gqt27hetc = Anonymize<I8l8ileau3j9jv> | undefined

type I8l8ileau3j9jv = [number, XcmV2TraitsError]

export type XcmV2TraitsError = Enum<
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
export const XcmV2TraitsError = _Enum as unknown as GetEnum<XcmV2TraitsError>

type I46ggargfeekkj = [number, XcmVersionedMultiLocation]

type I7vlvrrl2pnbgk = [bigint, Anonymize<I4q39t5hn830vp>, number]

type Ibdqc639q3ofe0 = Array<Anonymize<I2tguvlrf6n4ik>>

type I2tguvlrf6n4ik = [XcmVersionedMultiLocation, number]

export type XcmPalletVersionMigrationStage = Enum<
  | { type: "MigrateSupportedVersion"; value: undefined }
  | { type: "MigrateVersionNotifiers"; value: undefined }
  | { type: "NotifyCurrentTargets"; value: Anonymize<Iabpgqcjikia83> }
  | { type: "MigrateAndNotifyOldTargets"; value: undefined }
>
export const XcmPalletVersionMigrationStage =
  _Enum as unknown as GetEnum<XcmPalletVersionMigrationStage>

type Iaaeqd8puo95gs = {
  amount: bigint
  owner: XcmVersionedMultiLocation
  locker: XcmVersionedMultiLocation
  consumers: Anonymize<I48jka0f0ufl6q>
}

type I48jka0f0ufl6q = Array<Anonymize<I2jndntq8n8661>>

type I2jndntq8n8661 = [undefined, bigint]

type I61vn4ct4e1jjd = [number, SS58String, XcmVersionedAssetId]

export type XcmVersionedAssetId = Enum<{
  type: "V3"
  value: Anonymize<XcmV3MultiassetAssetId>
}>
export const XcmVersionedAssetId =
  _Enum as unknown as GetEnum<XcmVersionedAssetId>

type I64u7pb324isgb = Array<Anonymize<Ifk51k72g143a3>>

type Ifk51k72g143a3 = [bigint, XcmVersionedMultiLocation]

type Ic9ppo8st33eqb = {
  begin: number
  end: number
  count: number
  ready_neighbours: Anonymize<Iav3cdf9g9n9fp>
  message_count: bigint
  size: bigint
}

type Iav3cdf9g9n9fp = Anonymize<I4b0p76ud6qst3> | undefined

type I4b0p76ud6qst3 = {
  prev: ParachainsInclusionAggregateMessageOrigin
  next: ParachainsInclusionAggregateMessageOrigin
}

type I53esa2ms463bk = {
  remaining: number
  remaining_size: number
  first_index: number
  first: number
  last: number
  heap: Binary
}

type Ibg270mmpf1f2q = [ParachainsInclusionAggregateMessageOrigin, number]

type Ie5mvl0hn85mkc = Array<Binary>

type I3qm5u05tioq05 = { id: bigint; len: number; keyset_commitment: Binary }

type In7a38730s6qs = {
  base_block: Anonymize<I4q39t5hn830vp>
  max_block: Anonymize<I4q39t5hn830vp>
  per_class: Anonymize<I79te2qqsklnbd>
}

type I79te2qqsklnbd = {
  normal: Anonymize<Ia78ef0a3p5958>
  operational: Anonymize<Ia78ef0a3p5958>
  mandatory: Anonymize<Ia78ef0a3p5958>
}

type Ia78ef0a3p5958 = {
  base_extrinsic: Anonymize<I4q39t5hn830vp>
  max_extrinsic: Anonymize<Iasb8k6ash5mjn>
  max_total: Anonymize<Iasb8k6ash5mjn>
  reserved: Anonymize<Iasb8k6ash5mjn>
}

type If15el53dd76v9 = { normal: number; operational: number; mandatory: number }

type I9s0ave7t0vnrk = { read: bigint; write: bigint }

type Ib5fo0fakl8rog = {
  spec_name: string
  impl_name: string
  authoring_version: number
  spec_version: number
  impl_version: number
  apis: Anonymize<I1st1p92iu8h7e>
  transaction_version: number
  state_version: number
}

type I1st1p92iu8h7e = Array<Anonymize<If6q1i5gkbpmkc>>

type If6q1i5gkbpmkc = [Binary, number]

type Ibafpkl9hhno69 = Array<Anonymize<Ida9vhl30l98p4>>

type Ida9vhl30l98p4 = [number, Anonymize<I6s1tg2sl5nvmp>]

type I6s1tg2sl5nvmp = {
  name: string
  max_deciding: number
  decision_deposit: bigint
  prepare_period: number
  decision_period: number
  confirm_period: number
  min_enactment_period: number
  min_approval: ReferendaTypesCurve
  min_support: ReferendaTypesCurve
}

export type ReferendaTypesCurve = Enum<
  | { type: "LinearDecreasing"; value: Anonymize<Idcpso832hml3u> }
  | { type: "SteppedDecreasing"; value: Anonymize<I5qiv0grkufa8l> }
  | { type: "Reciprocal"; value: Anonymize<I58l93su2gte4i> }
>
export const ReferendaTypesCurve =
  _Enum as unknown as GetEnum<ReferendaTypesCurve>

type Idcpso832hml3u = { length: number; floor: number; ceil: number }

type I5qiv0grkufa8l = {
  begin: number
  end: number
  step: number
  period: number
}

type I58l93su2gte4i = { factor: bigint; x_offset: bigint; y_offset: bigint }

type Iafqnechp3omqg = Array<bigint>

export type SystemPalletCall = Enum<
  | { type: "remark"; value: Anonymize<I8ofcg5rbj0g2c> }
  | { type: "set_heap_pages"; value: Anonymize<I4adgbll7gku4i> }
  | { type: "set_code"; value: Anonymize<I6pjjpfvhvcfru> }
  | { type: "set_code_without_checks"; value: Anonymize<I6pjjpfvhvcfru> }
  | { type: "set_storage"; value: Anonymize<I8qrhskdehbu57> }
  | { type: "kill_storage"; value: Anonymize<I39uah9nss64h9> }
  | { type: "kill_prefix"; value: Anonymize<Ik64dknsq7k08> }
  | { type: "remark_with_event"; value: Anonymize<I8ofcg5rbj0g2c> }
>
export const SystemPalletCall = _Enum as unknown as GetEnum<SystemPalletCall>

type I8ofcg5rbj0g2c = { remark: Binary }

type I4adgbll7gku4i = { pages: bigint }

type I6pjjpfvhvcfru = { code: Binary }

type I8qrhskdehbu57 = { items: Anonymize<I5g1ftt6bt65bl> }

type I5g1ftt6bt65bl = Array<Anonymize<Ief9tkec59fktv>>

type Ief9tkec59fktv = [Binary, Binary]

type I39uah9nss64h9 = { keys: Anonymize<Itom7fk49o0c9> }

type Ik64dknsq7k08 = { prefix: Binary; subkeys: number }

type I1abrp8gjcpfc = AnonymousEnum<{
  schedule: Anonymize<I3qt1iclgnlpc3>
  cancel: Anonymize<I5n4sebgkfr760>
  schedule_named: Anonymize<Ie7cb775si1ku8>
  cancel_named: Anonymize<Idsdstalforb09>
  schedule_after: Anonymize<I6rb3dbq8mv545>
  schedule_named_after: Anonymize<I90bto8860mivd>
}>

type I3qt1iclgnlpc3 = {
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}

type I8e6un4uk1q07c = AnonymousEnum<{
  System: Anonymize<SystemPalletCall>
  Scheduler: Anonymize<I1abrp8gjcpfc>
  Preimage: Anonymize<Imbphi6s5kus8>
  Babe: Anonymize<BabePalletCall>
  Timestamp: Anonymize<TimestampPalletCall>
  Indices: Anonymize<IndicesPalletCall>
  Balances: Anonymize<Ibf8j84ii3a3kr>
  Staking: Anonymize<StakingPalletCall>
  Session: Anonymize<I454da453jskvn>
  Grandpa: Anonymize<GrandpaPalletCall>
  ImOnline: Anonymize<ImOnlinePalletCall>
  Treasury: Anonymize<Ibiic8ba5o502g>
  ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
  Referenda: Anonymize<ReferendaPalletCall>
  Whitelist: Anonymize<I51p8lm6kqdnho>
  Claims: Anonymize<ClaimsPalletCall>
  Vesting: Anonymize<VestingPalletCall>
  Utility: Anonymize<Iap9gdffi2u6nu>
  Identity: Anonymize<IdentityPalletCall>
  Proxy: Anonymize<Idedbf4rqpdmri>
  Multisig: Anonymize<Idd2oimlrnr76q>
  Bounties: Anonymize<BountiesPalletCall>
  ChildBounties: Anonymize<ChildBountiesPalletCall>
  ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
  VoterList: Anonymize<BagsListPalletCall>
  NominationPools: Anonymize<I29f4027kh5dho>
  FastUnstake: Anonymize<FastUnstakePalletCall>
  Configuration: Anonymize<ParachainsConfigurationPalletCall>
  ParasShared: Anonymize<undefined>
  ParaInclusion: Anonymize<undefined>
  ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
  Paras: Anonymize<ParachainsParasPalletCall>
  Initializer: Anonymize<ParachainsInitializerPalletCall>
  Hrmp: Anonymize<I2vev2224bc186>
  ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
  ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
  Registrar: Anonymize<CommonParasRegistrarPalletCall>
  Slots: Anonymize<CommonSlotsPalletCall>
  Auctions: Anonymize<CommonAuctionsPalletCall>
  Crowdloan: Anonymize<CommonCrowdloanPalletCall>
  XcmPallet: Anonymize<XcmPalletCall>
  MessageQueue: Anonymize<MessageQueuePalletCall>
  AssetRate: Anonymize<I2gv42mnmfo4fm>
  Beefy: Anonymize<Ibeddosggop7dd>
}>

type Imbphi6s5kus8 = AnonymousEnum<{
  note_preimage: Anonymize<I82nfqfkd48n10>
  unnote_preimage: Anonymize<Id9d48vaes3c53>
  request_preimage: Anonymize<Id9d48vaes3c53>
  unrequest_preimage: Anonymize<Id9d48vaes3c53>
  ensure_updated: Anonymize<Idaor7tajt0l3k>
}>

type I82nfqfkd48n10 = { bytes: Binary }

type Idaor7tajt0l3k = { hashes: Anonymize<Idhnf6rtqoslea> }

export type BabePalletCall = Enum<
  | { type: "report_equivocation"; value: Anonymize<I7mmbgd20nut80> }
  | { type: "report_equivocation_unsigned"; value: Anonymize<I7mmbgd20nut80> }
  | { type: "plan_config_change"; value: Anonymize<I2dcpbss9027dl> }
>
export const BabePalletCall = _Enum as unknown as GetEnum<BabePalletCall>

type I7mmbgd20nut80 = {
  equivocation_proof: Anonymize<I7bek4s9acs8nl>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}

type I7bek4s9acs8nl = {
  offender: Binary
  slot: bigint
  first_header: Anonymize<I6t1nedlt7mobn>
  second_header: Anonymize<I6t1nedlt7mobn>
}

type I6t1nedlt7mobn = {
  parent_hash: Binary
  number: number
  state_root: Binary
  extrinsics_root: Binary
  digest: Anonymize<Idin6nhq46lvdj>
}

type I3ia7aufsoj0l1 = {
  session: number
  trie_nodes: Anonymize<Itom7fk49o0c9>
  validator_count: number
}

type I2dcpbss9027dl = { config: BabeDigestsNextConfigDescriptor }

export type TimestampPalletCall = Enum<{
  type: "set"
  value: Anonymize<Idcr6u6361oad9>
}>
export const TimestampPalletCall =
  _Enum as unknown as GetEnum<TimestampPalletCall>

type Idcr6u6361oad9 = { now: bigint }

export type IndicesPalletCall = Enum<
  | { type: "claim"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "transfer"; value: Anonymize<Idge7gk9m5car0> }
  | { type: "free"; value: Anonymize<I666bl2fqjkejo> }
  | { type: "force_transfer"; value: Anonymize<I34pbimt2i69v7> }
  | { type: "freeze"; value: Anonymize<I666bl2fqjkejo> }
>
export const IndicesPalletCall = _Enum as unknown as GetEnum<IndicesPalletCall>

type Idge7gk9m5car0 = { index: number; new: MultiAddress }

export type MultiAddress = Enum<
  | { type: "Id"; value: Anonymize<SS58String> }
  | { type: "Index"; value: Anonymize<number> }
  | { type: "Raw"; value: Anonymize<Binary> }
  | { type: "Address32"; value: Anonymize<Binary> }
  | { type: "Address20"; value: Anonymize<Binary> }
>
export const MultiAddress = _Enum as unknown as GetEnum<MultiAddress>

type I34pbimt2i69v7 = { new: MultiAddress; index: number; freeze: boolean }

type Ibf8j84ii3a3kr = AnonymousEnum<{
  transfer_allow_death: Anonymize<Ien6q0lasi0m7i>
  force_transfer: Anonymize<Icacgruoo9j3r2>
  transfer_keep_alive: Anonymize<Ien6q0lasi0m7i>
  transfer_all: Anonymize<I7dgmo7im9hljo>
  force_unreserve: Anonymize<Iargojp1sv9icj>
  upgrade_accounts: Anonymize<Ibmr18suc9ikh9>
  force_set_balance: Anonymize<Ie0io91hk7pejj>
}>

type Ien6q0lasi0m7i = { dest: MultiAddress; value: bigint }

type Icacgruoo9j3r2 = {
  source: MultiAddress
  dest: MultiAddress
  value: bigint
}

type I7dgmo7im9hljo = { dest: MultiAddress; keep_alive: boolean }

type Iargojp1sv9icj = { who: MultiAddress; amount: bigint }

type Ibmr18suc9ikh9 = { who: Anonymize<Ia2lhg7l2hilo3> }

type Ie0io91hk7pejj = { who: MultiAddress; new_free: bigint }

export type StakingPalletCall = Enum<
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
export const StakingPalletCall = _Enum as unknown as GetEnum<StakingPalletCall>

type I9f7ms9viml8of = { value: bigint; payee: StakingRewardDestination }

type I564va64vtidbq = { max_additional: bigint }

type I328av3j0bgmjb = { num_slashing_spans: number }

type I4tuqm9ato907i = { prefs: Anonymize<I9o7ssi9vmhmgr> }

type I5n9nf1mhg26dt = { targets: Anonymize<I65ih42boctoq4> }

type I65ih42boctoq4 = Array<MultiAddress>

type Ida5hg7geddnc7 = { payee: StakingRewardDestination }

type I3vh014cqgmrfd = { new: number }

type Ifhs60omlhvt3 = { additional: number }

type If34udpd5e57vi = { factor: number }

type I39t01nnod9109 = { invulnerables: Anonymize<Ia2lhg7l2hilo3> }

type Ie5vbnd9198quk = { stash: SS58String; num_slashing_spans: number }

type I3h6murn8bd4v5 = { era: number; slash_indices: Anonymize<Icgljjb6j82uhn> }

type I6k6jf8ncesuu3 = { validator_stash: SS58String; era: number }

type I2j5nkj9u94qun = { who: Anonymize<I65ih42boctoq4> }

type I9nfsuc9smbmvv = {
  min_nominator_bond: StakingPalletConfigOp
  min_validator_bond: StakingPalletConfigOp
  max_nominator_count: StakingPalletConfigOp1
  max_validator_count: StakingPalletConfigOp1
  chill_threshold: StakingPalletConfigOp1
  min_commission: StakingPalletConfigOp1
}

export type StakingPalletConfigOp = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<bigint> }
  | { type: "Remove"; value: undefined }
>
export const StakingPalletConfigOp =
  _Enum as unknown as GetEnum<StakingPalletConfigOp>

export type StakingPalletConfigOp1 = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<number> }
  | { type: "Remove"; value: undefined }
>
export const StakingPalletConfigOp1 =
  _Enum as unknown as GetEnum<StakingPalletConfigOp1>

type I3v6ks33uluhnj = { controller: SS58String }

type I5ont0141q9ss5 = { validator_stash: SS58String }

type I454da453jskvn = AnonymousEnum<{
  set_keys: Anonymize<Ifu2fv3jk8vbos>
  purge_keys: undefined
}>

type Ifu2fv3jk8vbos = { keys: Anonymize<I4g61cdhi06s1m>; proof: Binary }

export type GrandpaPalletCall = Enum<
  | { type: "report_equivocation"; value: Anonymize<I4kjek1q6rj24q> }
  | { type: "report_equivocation_unsigned"; value: Anonymize<I4kjek1q6rj24q> }
  | { type: "note_stalled"; value: Anonymize<I2hviml3snvhhn> }
>
export const GrandpaPalletCall = _Enum as unknown as GetEnum<GrandpaPalletCall>

type I4kjek1q6rj24q = {
  equivocation_proof: Anonymize<I95fr9lj1pb8v8>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}

type I95fr9lj1pb8v8 = { set_id: bigint; equivocation: GrandpaEquivocation }

export type GrandpaEquivocation = Enum<
  | { type: "Prevote"; value: Anonymize<Igd938ojs7e2l> }
  | { type: "Precommit"; value: Anonymize<Igd938ojs7e2l> }
>
export const GrandpaEquivocation =
  _Enum as unknown as GetEnum<GrandpaEquivocation>

type Igd938ojs7e2l = {
  round_number: bigint
  identity: Binary
  first: Anonymize<I8f8rup5807mac>
  second: Anonymize<I8f8rup5807mac>
}

type I8f8rup5807mac = [Anonymize<I11vulp7gu5007>, Binary]

type I11vulp7gu5007 = { target_hash: Binary; target_number: number }

type I2hviml3snvhhn = { delay: number; best_finalized_block_number: number }

export type ImOnlinePalletCall = Enum<{
  type: "heartbeat"
  value: Anonymize<Ifgbq9oil78ogk>
}>
export const ImOnlinePalletCall =
  _Enum as unknown as GetEnum<ImOnlinePalletCall>

type Ifgbq9oil78ogk = {
  heartbeat: Anonymize<I7a9s2tcf2ejdv>
  signature: Binary
}

type I7a9s2tcf2ejdv = {
  block_number: number
  session_index: number
  authority_index: number
  validators_len: number
}

type Ibiic8ba5o502g = AnonymousEnum<{
  propose_spend: Anonymize<I5c883qnnqciv8>
  reject_proposal: Anonymize<Icm9m0qeemu66d>
  approve_proposal: Anonymize<Icm9m0qeemu66d>
  spend_local: Anonymize<Idpn74s0i9cdvp>
  remove_approval: Anonymize<Icm9m0qeemu66d>
  spend: Anonymize<I815t7ta25e227>
  payout: Anonymize<I666bl2fqjkejo>
  check_status: Anonymize<I666bl2fqjkejo>
  void_spend: Anonymize<I666bl2fqjkejo>
}>

type I5c883qnnqciv8 = { value: bigint; beneficiary: MultiAddress }

type Icm9m0qeemu66d = { proposal_id: number }

type Idpn74s0i9cdvp = { amount: bigint; beneficiary: MultiAddress }

type I815t7ta25e227 = {
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: Anonymize<I4arjljr6dpflb>
}

export type ConvictionVotingPalletCall = Enum<
  | { type: "vote"; value: Anonymize<Idnsr2pndm36h0> }
  | { type: "delegate"; value: Anonymize<Id7ut33dljf52c> }
  | { type: "undelegate"; value: Anonymize<I8steo882k7qns> }
  | { type: "unlock"; value: Anonymize<I1vc8h4t228bot> }
  | { type: "remove_vote"; value: Anonymize<I5f178ab6b89t3> }
  | { type: "remove_other_vote"; value: Anonymize<I5fak1u82ohqtm> }
>
export const ConvictionVotingPalletCall =
  _Enum as unknown as GetEnum<ConvictionVotingPalletCall>

type Idnsr2pndm36h0 = {
  poll_index: number
  vote: ConvictionVotingVoteAccountVote
}

type Id7ut33dljf52c = {
  class: number
  to: MultiAddress
  conviction: VotingConviction
  balance: bigint
}

type I8steo882k7qns = { class: number }

type I1vc8h4t228bot = { class: number; target: MultiAddress }

type I5f178ab6b89t3 = { class: Anonymize<I4arjljr6dpflb>; index: number }

type I5fak1u82ohqtm = { target: MultiAddress; class: number; index: number }

export type ReferendaPalletCall = Enum<
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
export const ReferendaPalletCall =
  _Enum as unknown as GetEnum<ReferendaPalletCall>

type I86t0cca08a1h1 = {
  proposal_origin: PolkadotRuntimeOriginCaller
  proposal: PreimagesBounded
  enactment_moment: TraitsScheduleDispatchTime
}

type Icbio0e1f0034b = { track: number }

type Ifml0k0sf0mu2g = { index: number; maybe_hash: Anonymize<I17k3ujudqd5df> }

type I51p8lm6kqdnho = AnonymousEnum<{
  whitelist_call: Anonymize<I8413rb6im3iko>
  remove_whitelisted_call: Anonymize<I8413rb6im3iko>
  dispatch_whitelisted_call: Anonymize<Id3s9pakjjc472>
  dispatch_whitelisted_call_with_preimage: Anonymize<Idf7eras2rn4rj>
}>

type Id3s9pakjjc472 = {
  call_hash: Binary
  call_encoded_len: number
  call_weight_witness: Anonymize<I4q39t5hn830vp>
}

type Idf7eras2rn4rj = { call: Anonymize<I8e6un4uk1q07c> }

export type ClaimsPalletCall = Enum<
  | { type: "claim"; value: Anonymize<I1u3s4gbjnre15> }
  | { type: "mint_claim"; value: Anonymize<I20qiajmn4c5d4> }
  | { type: "claim_attest"; value: Anonymize<Ie3aplba76d794> }
  | { type: "attest"; value: Anonymize<I1ntko0oih7v1a> }
  | { type: "move_claim"; value: Anonymize<I193pigt6gtjff> }
>
export const ClaimsPalletCall = _Enum as unknown as GetEnum<ClaimsPalletCall>

type I1u3s4gbjnre15 = { dest: SS58String; ethereum_signature: Binary }

type I20qiajmn4c5d4 = {
  who: Binary
  value: bigint
  vesting_schedule: Anonymize<I70kqehrkegc98>
  statement: Anonymize<I6rcr4im2g3gv9>
}

type I70kqehrkegc98 = Anonymize<I2phecamkn3pej> | undefined

type I6rcr4im2g3gv9 = ClaimsStatementKind | undefined

type Ie3aplba76d794 = {
  dest: SS58String
  ethereum_signature: Binary
  statement: Binary
}

type I1ntko0oih7v1a = { statement: Binary }

type I193pigt6gtjff = {
  old: Binary
  new: Binary
  maybe_preclaim: Anonymize<Ihfphjolmsqq1>
}

export type VestingPalletCall = Enum<
  | { type: "vest"; value: undefined }
  | { type: "vest_other"; value: Anonymize<I29er5j74l8bu> }
  | { type: "vested_transfer"; value: Anonymize<I9l9kkok4o3ekh> }
  | { type: "force_vested_transfer"; value: Anonymize<I50ve0bbda0j1r> }
  | { type: "merge_schedules"; value: Anonymize<Ict9ivhr2c5hv0> }
>
export const VestingPalletCall = _Enum as unknown as GetEnum<VestingPalletCall>

type I29er5j74l8bu = { target: MultiAddress }

type I9l9kkok4o3ekh = {
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}

type I50ve0bbda0j1r = {
  source: MultiAddress
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}

type Ict9ivhr2c5hv0 = { schedule1_index: number; schedule2_index: number }

type Iap9gdffi2u6nu = AnonymousEnum<{
  batch: Anonymize<Id8ilk50mukg0o>
  as_derivative: Anonymize<Ie36meht90lrma>
  batch_all: Anonymize<Id8ilk50mukg0o>
  dispatch_as: Anonymize<Ibb7qiar2nh5rh>
  force_batch: Anonymize<Id8ilk50mukg0o>
  with_weight: Anonymize<I6c37kkkbmesra>
}>

type Id8ilk50mukg0o = { calls: Anonymize<I1bfn7sbvfvk3t> }

type I1bfn7sbvfvk3t = Array<Anonymize<I8e6un4uk1q07c>>

type Ie36meht90lrma = { index: number; call: Anonymize<I8e6un4uk1q07c> }

type Ibb7qiar2nh5rh = {
  as_origin: PolkadotRuntimeOriginCaller
  call: Anonymize<I8e6un4uk1q07c>
}

type I6c37kkkbmesra = {
  call: Anonymize<I8e6un4uk1q07c>
  weight: Anonymize<I4q39t5hn830vp>
}

export type IdentityPalletCall = Enum<
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
export const IdentityPalletCall =
  _Enum as unknown as GetEnum<IdentityPalletCall>

type Ibsu2pfvipmui6 = { account: MultiAddress }

type I621gpns74tp1f = { info: Anonymize<I939m6d6t3dsgm> }

type I5100vdjbepcoj = { subs: Anonymize<I47e5e4dh41s5v> }

type I47e5e4dh41s5v = Array<Anonymize<Ib22937a5d3pt0>>

type I9l2s4klu0831o = { reg_index: number; max_fee: bigint }

type I2ctrt5nqb8o7c = { reg_index: number }

type I711qahikocb1c = { index: number; fee: bigint }

type Id6gojh30v9ib2 = { index: number; fields: bigint }

type I2g5s5rvm0mfuf = {
  reg_index: number
  target: MultiAddress
  judgement: IdentityJudgement
  identity: Binary
}

type Iclf5v4qsadc12 = { sub: MultiAddress; data: IdentityTypesData }

type Ifcc5t6ed1elfd = { sub: MultiAddress }

type Idedbf4rqpdmri = AnonymousEnum<{
  proxy: Anonymize<I55q6ritdd2v83>
  add_proxy: Anonymize<Iaaog12m0bl04j>
  remove_proxy: Anonymize<Iaaog12m0bl04j>
  remove_proxies: undefined
  create_pure: Anonymize<I6l2ag419uso4i>
  kill_pure: Anonymize<I7304brn0jssvr>
  announce: Anonymize<Id3bpmvju2iqi5>
  remove_announcement: Anonymize<Id3bpmvju2iqi5>
  reject_announcement: Anonymize<Ietdab69eu3c4e>
  proxy_announced: Anonymize<Ic91pvvaf9eh9k>
}>

type I55q6ritdd2v83 = {
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}

type Idrnto663vhd97 = ProxyType | undefined

type Iaaog12m0bl04j = {
  delegate: MultiAddress
  proxy_type: ProxyType
  delay: number
}

type I6l2ag419uso4i = { proxy_type: ProxyType; delay: number; index: number }

type I7304brn0jssvr = {
  spawner: MultiAddress
  proxy_type: ProxyType
  index: number
  height: number
  ext_index: number
}

type Id3bpmvju2iqi5 = { real: MultiAddress; call_hash: Binary }

type Ietdab69eu3c4e = { delegate: MultiAddress; call_hash: Binary }

type Ic91pvvaf9eh9k = {
  delegate: MultiAddress
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}

type Idd2oimlrnr76q = AnonymousEnum<{
  as_multi_threshold_1: Anonymize<I9qeq6jurh88f2>
  as_multi: Anonymize<I8aql6ho3v5akd>
  approve_as_multi: Anonymize<I349bg0i7n8ohu>
  cancel_as_multi: Anonymize<I8plicv234mqe5>
}>

type I9qeq6jurh88f2 = {
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I8e6un4uk1q07c>
}

type I8aql6ho3v5akd = {
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I8e6un4uk1q07c>
  max_weight: Anonymize<I4q39t5hn830vp>
}

type I95jfd8j5cr5eh = Anonymize<Itvprrpb0nm3o> | undefined

type I349bg0i7n8ohu = {
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call_hash: Binary
  max_weight: Anonymize<I4q39t5hn830vp>
}

type I8plicv234mqe5 = {
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  timepoint: Anonymize<Itvprrpb0nm3o>
  call_hash: Binary
}

export type BountiesPalletCall = Enum<
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
export const BountiesPalletCall =
  _Enum as unknown as GetEnum<BountiesPalletCall>

type I2a839vbf5817q = { value: bigint; description: Binary }

type I86gbm3avnuhcj = { bounty_id: number; curator: MultiAddress; fee: bigint }

type I9khudebied2et = { bounty_id: number; beneficiary: MultiAddress }

type I90n6nnkpdahrh = { bounty_id: number; remark: Binary }

export type ChildBountiesPalletCall = Enum<
  | { type: "add_child_bounty"; value: Anonymize<I8mk5kjgn02hi8> }
  | { type: "propose_curator"; value: Anonymize<I113qogfj9ii7a> }
  | { type: "accept_curator"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "unassign_curator"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "award_child_bounty"; value: Anonymize<I6okbrc1o6b331> }
  | { type: "claim_child_bounty"; value: Anonymize<I2gr10p66od9ch> }
  | { type: "close_child_bounty"; value: Anonymize<I2gr10p66od9ch> }
>
export const ChildBountiesPalletCall =
  _Enum as unknown as GetEnum<ChildBountiesPalletCall>

type I8mk5kjgn02hi8 = {
  parent_bounty_id: number
  value: bigint
  description: Binary
}

type I113qogfj9ii7a = {
  parent_bounty_id: number
  child_bounty_id: number
  curator: MultiAddress
  fee: bigint
}

type I2gr10p66od9ch = { parent_bounty_id: number; child_bounty_id: number }

type I6okbrc1o6b331 = {
  parent_bounty_id: number
  child_bounty_id: number
  beneficiary: MultiAddress
}

export type ElectionProviderMultiPhasePalletCall = Enum<
  | { type: "submit_unsigned"; value: Anonymize<I31k9f0jol8ko4> }
  | { type: "set_minimum_untrusted_score"; value: Anonymize<I80q14um2s2ckg> }
  | { type: "set_emergency_election_result"; value: Anonymize<I5qs1t1erfi7u8> }
  | { type: "submit"; value: Anonymize<I9et13knvdvgpb> }
  | { type: "governance_fallback"; value: Anonymize<Ifsme8miqq9006> }
>
export const ElectionProviderMultiPhasePalletCall =
  _Enum as unknown as GetEnum<ElectionProviderMultiPhasePalletCall>

type I31k9f0jol8ko4 = {
  raw_solution: Anonymize<I7je4n92ump862>
  witness: Anonymize<Iasd2iat48n080>
}

type I80q14um2s2ckg = { maybe_next_score: Anonymize<Iaebc5kcl654ln> }

type Iaebc5kcl654ln = Anonymize<I8s6n43okuj2b1> | undefined

type I5qs1t1erfi7u8 = { supports: Anonymize<I4bboqsv44evel> }

type I9et13knvdvgpb = { raw_solution: Anonymize<I7je4n92ump862> }

type Ifsme8miqq9006 = {
  maybe_max_voters: Anonymize<I4arjljr6dpflb>
  maybe_max_targets: Anonymize<I4arjljr6dpflb>
}

export type BagsListPalletCall = Enum<
  | { type: "rebag"; value: Anonymize<Iqk00vc9d6173> }
  | { type: "put_in_front_of"; value: Anonymize<Idg844jjtqnc9b> }
  | { type: "put_in_front_of_other"; value: Anonymize<Ic87kbtabpr82b> }
>
export const BagsListPalletCall =
  _Enum as unknown as GetEnum<BagsListPalletCall>

type Iqk00vc9d6173 = { dislocated: MultiAddress }

type Idg844jjtqnc9b = { lighter: MultiAddress }

type Ic87kbtabpr82b = { heavier: MultiAddress; lighter: MultiAddress }

type I29f4027kh5dho = AnonymousEnum<{
  join: Anonymize<Ieg1oc56mamrl5>
  bond_extra: Anonymize<Ifi2b6p41bfb97>
  claim_payout: undefined
  unbond: Anonymize<Itveli0chegtk>
  pool_withdraw_unbonded: Anonymize<I36uoc8t9liv80>
  withdraw_unbonded: Anonymize<I1u21ookp1djj3>
  create: Anonymize<If5k9orpn9fi43>
  create_with_pool_id: Anonymize<I1hlpf8ergrg8k>
  nominate: Anonymize<I47a2tsd2o2b1c>
  set_state: Anonymize<Ibat0jog71khv5>
  set_metadata: Anonymize<I4ihj26hl75e5p>
  set_configs: Anonymize<I2rqmn40aam5hg>
  update_roles: Anonymize<I3cvu4kn8n81uv>
  chill: Anonymize<I931cottvong90>
  bond_extra_other: Anonymize<I6l7t90ftdbsr6>
  set_claim_permission: Anonymize<Icbgkt7i4ps8kc>
  claim_payout_other: Anonymize<I40s11r8nagn2g>
  set_commission: Anonymize<I6bjj87fr5g9nl>
  set_commission_max: Anonymize<I8cbluptqo8kbp>
  set_commission_change_rate: Anonymize<I81cc4plffa1dm>
  claim_commission: Anonymize<I931cottvong90>
  adjust_pool_deposit: Anonymize<I931cottvong90>
}>

type Ifi2b6p41bfb97 = { extra: NominationPoolsBondExtra }

export type NominationPoolsBondExtra = Enum<
  | { type: "FreeBalance"; value: Anonymize<bigint> }
  | { type: "Rewards"; value: undefined }
>
export const NominationPoolsBondExtra =
  _Enum as unknown as GetEnum<NominationPoolsBondExtra>

type Itveli0chegtk = { member_account: MultiAddress; unbonding_points: bigint }

type I36uoc8t9liv80 = { pool_id: number; num_slashing_spans: number }

type I1u21ookp1djj3 = {
  member_account: MultiAddress
  num_slashing_spans: number
}

type If5k9orpn9fi43 = {
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
}

type I1hlpf8ergrg8k = {
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
  pool_id: number
}

type I47a2tsd2o2b1c = { pool_id: number; validators: Anonymize<Ia2lhg7l2hilo3> }

type Ibat0jog71khv5 = { pool_id: number; state: NominationPoolsPoolState }

type I4ihj26hl75e5p = { pool_id: number; metadata: Binary }

type I2rqmn40aam5hg = {
  min_join_bond: StakingPalletConfigOp
  min_create_bond: StakingPalletConfigOp
  max_pools: StakingPalletConfigOp1
  max_members: StakingPalletConfigOp1
  max_members_per_pool: StakingPalletConfigOp1
  global_max_commission: StakingPalletConfigOp1
}

type I3cvu4kn8n81uv = {
  pool_id: number
  new_root: NominationPoolsConfigOp
  new_nominator: NominationPoolsConfigOp
  new_bouncer: NominationPoolsConfigOp
}

export type NominationPoolsConfigOp = Enum<
  | { type: "Noop"; value: undefined }
  | { type: "Set"; value: Anonymize<SS58String> }
  | { type: "Remove"; value: undefined }
>
export const NominationPoolsConfigOp =
  _Enum as unknown as GetEnum<NominationPoolsConfigOp>

type I6l7t90ftdbsr6 = { member: MultiAddress; extra: NominationPoolsBondExtra }

type Icbgkt7i4ps8kc = { permission: NominationPoolsClaimPermission }

type I40s11r8nagn2g = { other: SS58String }

type I6bjj87fr5g9nl = {
  pool_id: number
  new_commission: Anonymize<Ie8iutm7u02lmj>
}

export type FastUnstakePalletCall = Enum<
  | { type: "register_fast_unstake"; value: undefined }
  | { type: "deregister"; value: undefined }
  | { type: "control"; value: Anonymize<I9j0ul7nh7b8jv> }
>
export const FastUnstakePalletCall =
  _Enum as unknown as GetEnum<FastUnstakePalletCall>

type I9j0ul7nh7b8jv = { eras_to_check: number }

export type ParachainsConfigurationPalletCall = Enum<
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
export const ParachainsConfigurationPalletCall =
  _Enum as unknown as GetEnum<ParachainsConfigurationPalletCall>

type Id581arok0b1nj = { new: Anonymize<I4arjljr6dpflb> }

type I9jsikd1ghmc7l = { new: bigint }

type I2f6mha3v4ooda = { new: boolean }

type Iasqjdhasi408s = { new: Anonymize<Iavuvfkop6318c> }

type Iehb5cb6rp4k2p = { new: Anonymize<I6sbufrhmgqdb6> }

export type ParachainsParasInherentPalletCall = Enum<{
  type: "enter"
  value: Anonymize<I6uj8ujct0o4v7>
}>
export const ParachainsParasInherentPalletCall =
  _Enum as unknown as GetEnum<ParachainsParasInherentPalletCall>

type I6uj8ujct0o4v7 = { data: Anonymize<Ieal73d05pk7dg> }

type Ieal73d05pk7dg = {
  bitfields: Anonymize<I429k1bjdoi8o7>
  backed_candidates: Anonymize<I2dmlgatlidtsb>
  disputes: Anonymize<I65nq8pomrmfij>
  parent_header: Anonymize<I6t1nedlt7mobn>
}

type I429k1bjdoi8o7 = Array<Anonymize<Ie6rq4t789eicm>>

type Ie6rq4t789eicm = {
  payload: { bytes: Uint8Array; bitsLen: number }
  validator_index: number
  signature: Binary
}

type I2dmlgatlidtsb = Array<Anonymize<I2f1tpeknmk3ja>>

type I2f1tpeknmk3ja = {
  candidate: Anonymize<Iedmhjqij0hr8g>
  validity_votes: Anonymize<Ibq6bocu5i9pjs>
  validator_indices: { bytes: Uint8Array; bitsLen: number }
}

type Iedmhjqij0hr8g = {
  descriptor: Anonymize<Ib2u20s6roco9i>
  commitments: Anonymize<Ic1d4u2opv3fst>
}

type Ibq6bocu5i9pjs = Array<PolkadotPrimitivesV5ValidityAttestation>

export type ParachainsParasPalletCall = Enum<
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
export const ParachainsParasPalletCall =
  _Enum as unknown as GetEnum<ParachainsParasPalletCall>

type I1k3urvkqqshbc = { para: number; new_code: Binary }

type I2ff0ffsh15vej = { para: number; new_head: Binary }

type I1orfg86bkg123 = {
  para: number
  new_code: Binary
  relay_parent_number: number
}

type Iaus4cb3drhu9q = { para: number }

type Ivnsat10lv9d6 = { validation_code: Binary }

type Ifqm1da2k7es4d = { validation_code_hash: Binary }

type I4aouqiv2fh67c = { stmt: Anonymize<I3h1ccufdk38ej>; signature: Binary }

type I3h1ccufdk38ej = {
  accept: boolean
  subject: Binary
  session_index: number
  validator_index: number
}

type I9tmok5kceg2bg = { para: number; context: number }

export type ParachainsInitializerPalletCall = Enum<{
  type: "force_approve"
  value: Anonymize<I85icj2qbjeqbe>
}>
export const ParachainsInitializerPalletCall =
  _Enum as unknown as GetEnum<ParachainsInitializerPalletCall>

type I85icj2qbjeqbe = { up_to: number }

type I2vev2224bc186 = AnonymousEnum<{
  hrmp_init_open_channel: Anonymize<Ibuhbp68e6tkct>
  hrmp_accept_open_channel: Anonymize<Idrevppfiubhve>
  hrmp_close_channel: Anonymize<I9s2h36kr71vk9>
  force_clean_hrmp: Anonymize<I4lkbiubo9ogq9>
  force_process_hrmp_open: Anonymize<Id1baei7m8gkhk>
  force_process_hrmp_close: Anonymize<Id1baei7m8gkhk>
  hrmp_cancel_open_request: Anonymize<I96ftepqm4vs7m>
  force_open_hrmp_channel: Anonymize<Ic3430470j4mbv>
  establish_system_channel: Anonymize<I50mrcbubp554e>
  poke_channel_deposits: Anonymize<I50mrcbubp554e>
}>

type Ibuhbp68e6tkct = {
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}

type Idrevppfiubhve = { sender: number }

type I9s2h36kr71vk9 = { channel_id: Anonymize<I50mrcbubp554e> }

type I4lkbiubo9ogq9 = {
  para: number
  num_inbound: number
  num_outbound: number
}

type Id1baei7m8gkhk = { channels: number }

type I96ftepqm4vs7m = {
  channel_id: Anonymize<I50mrcbubp554e>
  open_requests: number
}

type Ic3430470j4mbv = {
  sender: number
  recipient: number
  max_capacity: number
  max_message_size: number
}

export type ParachainsDisputesPalletCall = Enum<{
  type: "force_unfreeze"
  value: undefined
}>
export const ParachainsDisputesPalletCall =
  _Enum as unknown as GetEnum<ParachainsDisputesPalletCall>

export type ParachainsDisputesSlashingPalletCall = Enum<{
  type: "report_dispute_lost_unsigned"
  value: Anonymize<I1ur1874hp9ar5>
}>
export const ParachainsDisputesSlashingPalletCall =
  _Enum as unknown as GetEnum<ParachainsDisputesSlashingPalletCall>

type I1ur1874hp9ar5 = {
  dispute_proof: Anonymize<Iag14tqe65tvpf>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}

type Iag14tqe65tvpf = {
  time_slot: Anonymize<Ib0p1u8q0nho37>
  kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
  validator_index: number
  validator_id: Binary
}

type Ib0p1u8q0nho37 = { session_index: number; candidate_hash: Binary }

export type CommonParasRegistrarPalletCall = Enum<
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
export const CommonParasRegistrarPalletCall =
  _Enum as unknown as GetEnum<CommonParasRegistrarPalletCall>

type I7mf0sij342109 = {
  id: number
  genesis_head: Binary
  validation_code: Binary
}

type Ibvirp862qkkup = {
  who: SS58String
  deposit: bigint
  id: number
  genesis_head: Binary
  validation_code: Binary
}

type Ic5b47dj4coa3r = { id: number }

type Idehabrqi23sc0 = { id: number; other: number }

export type CommonSlotsPalletCall = Enum<
  | { type: "force_lease"; value: Anonymize<Idfpo6162k0hq> }
  | { type: "clear_all_leases"; value: Anonymize<Iaus4cb3drhu9q> }
  | { type: "trigger_onboard"; value: Anonymize<Iaus4cb3drhu9q> }
>
export const CommonSlotsPalletCall =
  _Enum as unknown as GetEnum<CommonSlotsPalletCall>

type Idfpo6162k0hq = {
  para: number
  leaser: SS58String
  amount: bigint
  period_begin: number
  period_count: number
}

export type CommonAuctionsPalletCall = Enum<
  | { type: "new_auction"; value: Anonymize<I19hvnphoaj44l> }
  | { type: "bid"; value: Anonymize<I1ng31ej27mh4k> }
  | { type: "cancel_auction"; value: undefined }
>
export const CommonAuctionsPalletCall =
  _Enum as unknown as GetEnum<CommonAuctionsPalletCall>

type I19hvnphoaj44l = { duration: number; lease_period_index: number }

type I1ng31ej27mh4k = {
  para: number
  auction_index: number
  first_slot: number
  last_slot: number
  amount: bigint
}

export type CommonCrowdloanPalletCall = Enum<
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
export const CommonCrowdloanPalletCall =
  _Enum as unknown as GetEnum<CommonCrowdloanPalletCall>

type I3js6c9fubdele = {
  index: number
  cap: bigint
  first_period: number
  last_period: number
  end: number
  verifier: Anonymize<I8t18p6mokc3s4>
}

type I6n5jj22t7mm7i = {
  index: number
  value: bigint
  signature: Anonymize<I7us28h09nc5sv>
}

type I7us28h09nc5sv = MultiSignature | undefined

export type MultiSignature = Enum<
  | { type: "Ed25519"; value: Anonymize<Binary> }
  | { type: "Sr25519"; value: Anonymize<Binary> }
  | { type: "Ecdsa"; value: Anonymize<Binary> }
>
export const MultiSignature = _Enum as unknown as GetEnum<MultiSignature>

type I7cl9esn1l72m7 = { index: number; memo: Binary }

type I3k27o64k49es2 = { index: number; signature: Anonymize<I7us28h09nc5sv> }

export type XcmPalletCall = Enum<
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
export const XcmPalletCall = _Enum as unknown as GetEnum<XcmPalletCall>

type Icvpjofp09bmlh = {
  dest: XcmVersionedMultiLocation
  message: XcmVersionedXcm
}

export type XcmVersionedXcm = Enum<
  | { type: "V2"; value: Anonymize<I797ibmv93o8n9> }
  | { type: "V3"; value: Anonymize<I8l0577387vghn> }
>
export const XcmVersionedXcm = _Enum as unknown as GetEnum<XcmVersionedXcm>

type I797ibmv93o8n9 = Array<XcmV2Instruction>

export type XcmV2Instruction = Enum<
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
export const XcmV2Instruction = _Enum as unknown as GetEnum<XcmV2Instruction>

type I7adp6ofrfskbq = {
  query_id: bigint
  response: XcmV2Response
  max_weight: bigint
}

type I55b7rvmacg132 = {
  assets: Anonymize<Ia3ggl9eghkufh>
  beneficiary: Anonymize<Ibki0d249v3ojt>
}

type I87p6gu1rs00b9 = {
  assets: Anonymize<Ia3ggl9eghkufh>
  dest: Anonymize<Ibki0d249v3ojt>
  xcm: Anonymize<I797ibmv93o8n9>
}

type I61kq38r93nm9u = {
  origin_type: XcmV2OriginKind
  require_weight_at_most: bigint
  call: Binary
}

type I99o59cf77uo81 = {
  query_id: bigint
  dest: Anonymize<Ibki0d249v3ojt>
  max_response_weight: bigint
}

type I2fdiqplld7l4b = {
  assets: XcmV2MultiAssetFilter
  max_assets: number
  beneficiary: Anonymize<Ibki0d249v3ojt>
}

export type XcmV2MultiAssetFilter = Enum<
  | { type: "Definite"; value: Anonymize<Ia3ggl9eghkufh> }
  | { type: "Wild"; value: Anonymize<XcmV2MultiassetWildMultiAsset> }
>
export const XcmV2MultiAssetFilter =
  _Enum as unknown as GetEnum<XcmV2MultiAssetFilter>

export type XcmV2MultiassetWildMultiAsset = Enum<
  | { type: "All"; value: undefined }
  | { type: "AllOf"; value: Anonymize<I96k6616d81u1u> }
>
export const XcmV2MultiassetWildMultiAsset =
  _Enum as unknown as GetEnum<XcmV2MultiassetWildMultiAsset>

type I96k6616d81u1u = {
  id: XcmV2MultiassetAssetId
  fun: XcmV2MultiassetWildFungibility
}

type I4e86ltq2coupq = {
  assets: XcmV2MultiAssetFilter
  max_assets: number
  dest: Anonymize<Ibki0d249v3ojt>
  xcm: Anonymize<I797ibmv93o8n9>
}

type I8i9t5akp4s2qr = {
  give: XcmV2MultiAssetFilter
  receive: Anonymize<Ia3ggl9eghkufh>
}

type I3rvvq2i351pp4 = {
  assets: XcmV2MultiAssetFilter
  reserve: Anonymize<Ibki0d249v3ojt>
  xcm: Anonymize<I797ibmv93o8n9>
}

type I2eh04tsbsec6v = {
  assets: XcmV2MultiAssetFilter
  dest: Anonymize<Ibki0d249v3ojt>
  xcm: Anonymize<I797ibmv93o8n9>
}

type Iih6kp60v9gan = {
  query_id: bigint
  dest: Anonymize<Ibki0d249v3ojt>
  assets: XcmV2MultiAssetFilter
  max_response_weight: bigint
}

type I2u6ut68eoldqa = {
  fees: Anonymize<I16mc4mv5bb0qd>
  weight_limit: XcmV2WeightLimit
}

export type XcmV2WeightLimit = Enum<
  | { type: "Unlimited"; value: undefined }
  | { type: "Limited"; value: Anonymize<bigint> }
>
export const XcmV2WeightLimit = _Enum as unknown as GetEnum<XcmV2WeightLimit>

type I60l7lelr2s5kd = {
  assets: Anonymize<Ia3ggl9eghkufh>
  ticket: Anonymize<Ibki0d249v3ojt>
}

type Ido2s48ntevurj = { query_id: bigint; max_response_weight: bigint }

type Ieeis6pj62kiu4 = {
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
}

type I53e0mdinhcvpm = {
  message: XcmVersionedXcm1
  max_weight: Anonymize<I4q39t5hn830vp>
}

export type XcmVersionedXcm1 = Enum<
  | { type: "V2"; value: Anonymize<I6gdh0i5feh6sm> }
  | { type: "V3"; value: Anonymize<I3f103a4f7tafe> }
>
export const XcmVersionedXcm1 = _Enum as unknown as GetEnum<XcmVersionedXcm1>

type I6gdh0i5feh6sm = Array<XcmV2Instruction1>

export type XcmV2Instruction1 = Enum<
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
export const XcmV2Instruction1 = _Enum as unknown as GetEnum<XcmV2Instruction1>

type I3f103a4f7tafe = Array<XcmV3Instruction1>

export type XcmV3Instruction1 = Enum<
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
export const XcmV3Instruction1 = _Enum as unknown as GetEnum<XcmV3Instruction1>

type Ic76kfh5ebqkpl = { maybe_xcm_version: Anonymize<I4arjljr6dpflb> }

type I3pog27ittgi9g = { location: XcmVersionedMultiLocation }

type Ifcceq8taolrca = {
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
  weight_limit: XcmV3WeightLimit
}

type Ibgm4rnf22lal1 = { suspended: boolean }

export type MessageQueuePalletCall = Enum<
  | { type: "reap_page"; value: Anonymize<I3f1tq7m3kurig> }
  | { type: "execute_overweight"; value: Anonymize<Ifhnflnkf9f278> }
>
export const MessageQueuePalletCall =
  _Enum as unknown as GetEnum<MessageQueuePalletCall>

type I3f1tq7m3kurig = {
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
}

type Ifhnflnkf9f278 = {
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page: number
  index: number
  weight_limit: Anonymize<I4q39t5hn830vp>
}

type I2gv42mnmfo4fm = AnonymousEnum<{
  create: Anonymize<I16soggnee6qrb>
  update: Anonymize<I16soggnee6qrb>
  remove: Anonymize<Ifvnf1s3g2lg8u>
}>

type Ibeddosggop7dd = AnonymousEnum<{
  report_equivocation: Anonymize<I894urueu7skf3>
  report_equivocation_unsigned: Anonymize<I894urueu7skf3>
  set_new_genesis: Anonymize<Iemqna2uucuei9>
}>

type I894urueu7skf3 = {
  equivocation_proof: Anonymize<I6lgkrki6lhal>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}

type I6lgkrki6lhal = {
  first: Anonymize<Ifukb31gb9emjd>
  second: Anonymize<Ifukb31gb9emjd>
}

type Ifukb31gb9emjd = {
  commitment: Anonymize<Ie28rq7o91tbl9>
  id: Binary
  signature: Binary
}

type Ie28rq7o91tbl9 = {
  payload: Anonymize<I2eg8oaov5ur5b>
  block_number: number
  validator_set_id: bigint
}

type I2eg8oaov5ur5b = Array<Anonymize<Id6fv7d28ees54>>

type Id6fv7d28ees54 = [Binary, Binary]

type Iemqna2uucuei9 = { delay_in_blocks: number }

type Ie7cb775si1ku8 = {
  id: Binary
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}

type Idsdstalforb09 = { id: Binary }

type I6rb3dbq8mv545 = {
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}

type I90bto8860mivd = {
  id: Binary
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}

export type PalletError = Enum<
  | { type: "InvalidSpecName"; value: undefined }
  | { type: "SpecVersionNeedsToIncrease"; value: undefined }
  | { type: "FailedToExtractRuntimeVersion"; value: undefined }
  | { type: "NonDefaultComposite"; value: undefined }
  | { type: "NonZeroRefCount"; value: undefined }
  | { type: "CallFiltered"; value: undefined }
>
export const PalletError = _Enum as unknown as GetEnum<PalletError>

export type SchedulerPalletError = Enum<
  | { type: "FailedToSchedule"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "TargetBlockNumberInPast"; value: undefined }
  | { type: "RescheduleNoChange"; value: undefined }
  | { type: "Named"; value: undefined }
>
export const SchedulerPalletError =
  _Enum as unknown as GetEnum<SchedulerPalletError>

type Ia89ulpbu4dl9t = AnonymousEnum<{
  TooBig: undefined
  AlreadyNoted: undefined
  NotAuthorized: undefined
  NotNoted: undefined
  Requested: undefined
  NotRequested: undefined
  TooMany: undefined
  TooFew: undefined
}>

export type BabePalletError = Enum<
  | { type: "InvalidEquivocationProof"; value: undefined }
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "DuplicateOffenceReport"; value: undefined }
  | { type: "InvalidConfiguration"; value: undefined }
>
export const BabePalletError = _Enum as unknown as GetEnum<BabePalletError>

export type IndicesPalletError = Enum<
  | { type: "NotAssigned"; value: undefined }
  | { type: "NotOwner"; value: undefined }
  | { type: "InUse"; value: undefined }
  | { type: "NotTransfer"; value: undefined }
  | { type: "Permanent"; value: undefined }
>
export const IndicesPalletError =
  _Enum as unknown as GetEnum<IndicesPalletError>

export type BalancesPalletError = Enum<
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
export const BalancesPalletError =
  _Enum as unknown as GetEnum<BalancesPalletError>

export type StakingPalletError = Enum<
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
export const StakingPalletError =
  _Enum as unknown as GetEnum<StakingPalletError>

export type SessionPalletError = Enum<
  | { type: "InvalidProof"; value: undefined }
  | { type: "NoAssociatedValidatorId"; value: undefined }
  | { type: "DuplicatedKey"; value: undefined }
  | { type: "NoKeys"; value: undefined }
  | { type: "NoAccount"; value: undefined }
>
export const SessionPalletError =
  _Enum as unknown as GetEnum<SessionPalletError>

export type GrandpaPalletError = Enum<
  | { type: "PauseFailed"; value: undefined }
  | { type: "ResumeFailed"; value: undefined }
  | { type: "ChangePending"; value: undefined }
  | { type: "TooSoon"; value: undefined }
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "InvalidEquivocationProof"; value: undefined }
  | { type: "DuplicateOffenceReport"; value: undefined }
>
export const GrandpaPalletError =
  _Enum as unknown as GetEnum<GrandpaPalletError>

export type ImOnlinePalletError = Enum<
  | { type: "InvalidKey"; value: undefined }
  | { type: "DuplicatedHeartbeat"; value: undefined }
>
export const ImOnlinePalletError =
  _Enum as unknown as GetEnum<ImOnlinePalletError>

type Ioc9hp9sj7pq0 = AnonymousEnum<{
  InsufficientProposersBalance: undefined
  InvalidIndex: undefined
  TooManyApprovals: undefined
  InsufficientPermission: undefined
  ProposalNotApproved: undefined
  FailedToConvertBalance: undefined
  SpendExpired: undefined
  EarlyPayout: undefined
  AlreadyAttempted: undefined
  PayoutError: undefined
  NotAttempted: undefined
  Inconclusive: undefined
}>

export type ConvictionVotingPalletError = Enum<
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
export const ConvictionVotingPalletError =
  _Enum as unknown as GetEnum<ConvictionVotingPalletError>

export type ReferendaPalletError = Enum<
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
export const ReferendaPalletError =
  _Enum as unknown as GetEnum<ReferendaPalletError>

export type WhitelistPalletError = Enum<
  | { type: "UnavailablePreImage"; value: undefined }
  | { type: "UndecodableCall"; value: undefined }
  | { type: "InvalidCallWeightWitness"; value: undefined }
  | { type: "CallIsNotWhitelisted"; value: undefined }
  | { type: "CallAlreadyWhitelisted"; value: undefined }
>
export const WhitelistPalletError =
  _Enum as unknown as GetEnum<WhitelistPalletError>

export type CommonClaimsPalletError = Enum<
  | { type: "InvalidEthereumSignature"; value: undefined }
  | { type: "SignerHasNoClaim"; value: undefined }
  | { type: "SenderHasNoClaim"; value: undefined }
  | { type: "PotUnderflow"; value: undefined }
  | { type: "InvalidStatement"; value: undefined }
  | { type: "VestedBalanceExists"; value: undefined }
>
export const CommonClaimsPalletError =
  _Enum as unknown as GetEnum<CommonClaimsPalletError>

export type VestingPalletError = Enum<
  | { type: "NotVesting"; value: undefined }
  | { type: "AtMaxVestingSchedules"; value: undefined }
  | { type: "AmountLow"; value: undefined }
  | { type: "ScheduleIndexOutOfBounds"; value: undefined }
  | { type: "InvalidScheduleParams"; value: undefined }
>
export const VestingPalletError =
  _Enum as unknown as GetEnum<VestingPalletError>

export type UtilityPalletError = Enum<{
  type: "TooManyCalls"
  value: undefined
}>
export const UtilityPalletError =
  _Enum as unknown as GetEnum<UtilityPalletError>

export type IdentityPalletError = Enum<
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
export const IdentityPalletError =
  _Enum as unknown as GetEnum<IdentityPalletError>

export type ProxyPalletError = Enum<
  | { type: "TooMany"; value: undefined }
  | { type: "NotFound"; value: undefined }
  | { type: "NotProxy"; value: undefined }
  | { type: "Unproxyable"; value: undefined }
  | { type: "Duplicate"; value: undefined }
  | { type: "NoPermission"; value: undefined }
  | { type: "Unannounced"; value: undefined }
  | { type: "NoSelfProxy"; value: undefined }
>
export const ProxyPalletError = _Enum as unknown as GetEnum<ProxyPalletError>

export type MultisigPalletError = Enum<
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
export const MultisigPalletError =
  _Enum as unknown as GetEnum<MultisigPalletError>

export type BountiesPalletError = Enum<
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
export const BountiesPalletError =
  _Enum as unknown as GetEnum<BountiesPalletError>

export type ChildBountiesPalletError = Enum<
  | { type: "ParentBountyNotActive"; value: undefined }
  | { type: "InsufficientBountyBalance"; value: undefined }
  | { type: "TooManyChildBounties"; value: undefined }
>
export const ChildBountiesPalletError =
  _Enum as unknown as GetEnum<ChildBountiesPalletError>

export type ElectionProviderMultiPhasePalletError = Enum<
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
export const ElectionProviderMultiPhasePalletError =
  _Enum as unknown as GetEnum<ElectionProviderMultiPhasePalletError>

export type BagsListPalletError = Enum<{
  type: "List"
  value: Anonymize<BagsListListListError>
}>
export const BagsListPalletError =
  _Enum as unknown as GetEnum<BagsListPalletError>

export type BagsListListListError = Enum<
  | { type: "Duplicate"; value: undefined }
  | { type: "NotHeavier"; value: undefined }
  | { type: "NotInSameBag"; value: undefined }
  | { type: "NodeNotFound"; value: undefined }
>
export const BagsListListListError =
  _Enum as unknown as GetEnum<BagsListListListError>

type I9ef24bhcdaoh3 = AnonymousEnum<{
  PoolNotFound: undefined
  PoolMemberNotFound: undefined
  RewardPoolNotFound: undefined
  SubPoolsNotFound: undefined
  AccountBelongsToOtherPool: undefined
  FullyUnbonding: undefined
  MaxUnbondingLimit: undefined
  CannotWithdrawAny: undefined
  MinimumBondNotMet: undefined
  OverflowRisk: undefined
  NotDestroying: undefined
  NotNominator: undefined
  NotKickerOrDestroying: undefined
  NotOpen: undefined
  MaxPools: undefined
  MaxPoolMembers: undefined
  CanNotChangeState: undefined
  DoesNotHavePermission: undefined
  MetadataExceedsMaxLen: undefined
  Defensive: Anonymize<NominationPoolsPalletDefensiveError>
  PartialUnbondNotAllowedPermissionlessly: undefined
  MaxCommissionRestricted: undefined
  CommissionExceedsMaximum: undefined
  CommissionExceedsGlobalMaximum: undefined
  CommissionChangeThrottled: undefined
  CommissionChangeRateNotAllowed: undefined
  NoPendingCommission: undefined
  NoCommissionCurrentSet: undefined
  PoolIdInUse: undefined
  InvalidPoolId: undefined
  BondExtraRestricted: undefined
  NothingToAdjust: undefined
}>

export type NominationPoolsPalletDefensiveError = Enum<
  | { type: "NotEnoughSpaceInUnbondPool"; value: undefined }
  | { type: "PoolNotFound"; value: undefined }
  | { type: "RewardPoolNotFound"; value: undefined }
  | { type: "SubPoolsNotFound"; value: undefined }
  | { type: "BondedStashKilledPrematurely"; value: undefined }
>
export const NominationPoolsPalletDefensiveError =
  _Enum as unknown as GetEnum<NominationPoolsPalletDefensiveError>

export type FastUnstakePalletError = Enum<
  | { type: "NotController"; value: undefined }
  | { type: "AlreadyQueued"; value: undefined }
  | { type: "NotFullyBonded"; value: undefined }
  | { type: "NotQueued"; value: undefined }
  | { type: "AlreadyHead"; value: undefined }
  | { type: "CallNotAllowed"; value: undefined }
>
export const FastUnstakePalletError =
  _Enum as unknown as GetEnum<FastUnstakePalletError>

export type ParachainsConfigurationPalletError = Enum<{
  type: "InvalidNewValue"
  value: undefined
}>
export const ParachainsConfigurationPalletError =
  _Enum as unknown as GetEnum<ParachainsConfigurationPalletError>

export type ParachainsInclusionPalletError = Enum<
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
export const ParachainsInclusionPalletError =
  _Enum as unknown as GetEnum<ParachainsInclusionPalletError>

export type ParachainsParasInherentPalletError = Enum<
  | { type: "TooManyInclusionInherents"; value: undefined }
  | { type: "InvalidParentHeader"; value: undefined }
  | { type: "CandidateConcludedInvalid"; value: undefined }
  | { type: "InherentOverweight"; value: undefined }
  | { type: "DisputeStatementsUnsortedOrDuplicates"; value: undefined }
  | { type: "DisputeInvalid"; value: undefined }
>
export const ParachainsParasInherentPalletError =
  _Enum as unknown as GetEnum<ParachainsParasInherentPalletError>

export type ParachainsParasPalletError = Enum<
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
export const ParachainsParasPalletError =
  _Enum as unknown as GetEnum<ParachainsParasPalletError>

type I89ine2unkluf5 = AnonymousEnum<{
  OpenHrmpChannelToSelf: undefined
  OpenHrmpChannelInvalidRecipient: undefined
  OpenHrmpChannelZeroCapacity: undefined
  OpenHrmpChannelCapacityExceedsLimit: undefined
  OpenHrmpChannelZeroMessageSize: undefined
  OpenHrmpChannelMessageSizeExceedsLimit: undefined
  OpenHrmpChannelAlreadyExists: undefined
  OpenHrmpChannelAlreadyRequested: undefined
  OpenHrmpChannelLimitExceeded: undefined
  AcceptHrmpChannelDoesntExist: undefined
  AcceptHrmpChannelAlreadyConfirmed: undefined
  AcceptHrmpChannelLimitExceeded: undefined
  CloseHrmpChannelUnauthorized: undefined
  CloseHrmpChannelDoesntExist: undefined
  CloseHrmpChannelAlreadyUnderway: undefined
  CancelHrmpOpenChannelUnauthorized: undefined
  OpenHrmpChannelDoesntExist: undefined
  OpenHrmpChannelAlreadyConfirmed: undefined
  WrongWitness: undefined
  ChannelCreationNotAuthorized: undefined
}>

export type ParachainsDisputesPalletError = Enum<
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
export const ParachainsDisputesPalletError =
  _Enum as unknown as GetEnum<ParachainsDisputesPalletError>

export type ParachainsDisputesSlashingPalletError = Enum<
  | { type: "InvalidKeyOwnershipProof"; value: undefined }
  | { type: "InvalidSessionIndex"; value: undefined }
  | { type: "InvalidCandidateHash"; value: undefined }
  | { type: "InvalidValidatorIndex"; value: undefined }
  | { type: "ValidatorIndexIdMismatch"; value: undefined }
  | { type: "DuplicateSlashingReport"; value: undefined }
>
export const ParachainsDisputesSlashingPalletError =
  _Enum as unknown as GetEnum<ParachainsDisputesSlashingPalletError>

export type CommonParasRegistrarPalletError = Enum<
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
export const CommonParasRegistrarPalletError =
  _Enum as unknown as GetEnum<CommonParasRegistrarPalletError>

export type CommonSlotsPalletError = Enum<
  | { type: "ParaNotOnboarding"; value: undefined }
  | { type: "LeaseError"; value: undefined }
>
export const CommonSlotsPalletError =
  _Enum as unknown as GetEnum<CommonSlotsPalletError>

export type CommonAuctionsPalletError = Enum<
  | { type: "AuctionInProgress"; value: undefined }
  | { type: "LeasePeriodInPast"; value: undefined }
  | { type: "ParaNotRegistered"; value: undefined }
  | { type: "NotCurrentAuction"; value: undefined }
  | { type: "NotAuction"; value: undefined }
  | { type: "AuctionEnded"; value: undefined }
  | { type: "AlreadyLeasedOut"; value: undefined }
>
export const CommonAuctionsPalletError =
  _Enum as unknown as GetEnum<CommonAuctionsPalletError>

export type CommonCrowdloanPalletError = Enum<
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
export const CommonCrowdloanPalletError =
  _Enum as unknown as GetEnum<CommonCrowdloanPalletError>

export type XcmPalletError = Enum<
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
export const XcmPalletError = _Enum as unknown as GetEnum<XcmPalletError>

export type MessageQueuePalletError = Enum<
  | { type: "NotReapable"; value: undefined }
  | { type: "NoPage"; value: undefined }
  | { type: "NoMessage"; value: undefined }
  | { type: "AlreadyProcessed"; value: undefined }
  | { type: "Queued"; value: undefined }
  | { type: "InsufficientWeight"; value: undefined }
  | { type: "TemporarilyUnprocessable"; value: undefined }
  | { type: "QueuePaused"; value: undefined }
>
export const MessageQueuePalletError =
  _Enum as unknown as GetEnum<MessageQueuePalletError>

type Ibsq79g5dg0tkf = AnonymousEnum<{
  UnknownAssetKind: undefined
  AlreadyExists: undefined
}>

type Ia4jqf401148a4 = {
  header: Anonymize<I6t1nedlt7mobn>
  extrinsics: Anonymize<Itom7fk49o0c9>
}

type I132412t2eshc6 = ResultPayload<
  Anonymize<Idtdr91jmq5g4i>,
  TransactionValidityError
>

export type TransactionValidityError = Enum<
  | { type: "Invalid"; value: Anonymize<TransactionValidityInvalidTransaction> }
  | { type: "Unknown"; value: Anonymize<TransactionValidityUnknownTransaction> }
>
export const TransactionValidityError =
  _Enum as unknown as GetEnum<TransactionValidityError>

export type TransactionValidityInvalidTransaction = Enum<
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
export const TransactionValidityInvalidTransaction =
  _Enum as unknown as GetEnum<TransactionValidityInvalidTransaction>

export type TransactionValidityUnknownTransaction = Enum<
  | { type: "CannotLookup"; value: undefined }
  | { type: "NoUnsignedValidator"; value: undefined }
  | { type: "Custom"; value: Anonymize<number> }
>
export const TransactionValidityUnknownTransaction =
  _Enum as unknown as GetEnum<TransactionValidityUnknownTransaction>

type If39abi8floaaf = Array<Anonymize<I1kbn2golmm2dm>>

type I1kbn2golmm2dm = [Binary, Binary]

type Ibcdj0j79gq1uo = {
  okay: boolean
  fatal_error: boolean
  errors: Anonymize<If39abi8floaaf>
}

export type TransactionValidityTransactionSource = Enum<
  | { type: "InBlock"; value: undefined }
  | { type: "Local"; value: undefined }
  | { type: "External"; value: undefined }
>
export const TransactionValidityTransactionSource =
  _Enum as unknown as GetEnum<TransactionValidityTransactionSource>

type I6d9lhhdri071p = ResultPayload<
  Anonymize<I6g5lcd9vf2cr0>,
  TransactionValidityError
>

type I6g5lcd9vf2cr0 = {
  priority: bigint
  requires: Anonymize<Itom7fk49o0c9>
  provides: Anonymize<Itom7fk49o0c9>
  longevity: bigint
  propagate: boolean
}

type I5985kfq7sspta = [Anonymize<Iarlj3qd8u1v13>, Anonymize<I94uslvmqboam8>]

type I94uslvmqboam8 = {
  session_start_block: number
  group_rotation_frequency: number
  now: number
}

type I8a7gsn4nh0gne = Array<PolkadotPrimitivesV5CoreState>

export type PolkadotPrimitivesV5CoreState = Enum<
  | { type: "Occupied"; value: Anonymize<Iedrr54lmrujd0> }
  | { type: "Scheduled"; value: Anonymize<Ij0oq61lvrdfj> }
  | { type: "Free"; value: undefined }
>
export const PolkadotPrimitivesV5CoreState =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5CoreState>

type Iedrr54lmrujd0 = {
  next_up_on_available: Anonymize<I4j5il5p7i6los>
  occupied_since: number
  time_out_at: number
  next_up_on_time_out: Anonymize<I4j5il5p7i6los>
  availability: { bytes: Uint8Array; bitsLen: number }
  group_responsible: number
  candidate_hash: Binary
  candidate_descriptor: Anonymize<Ib2u20s6roco9i>
}

type I4j5il5p7i6los = Anonymize<Ij0oq61lvrdfj> | undefined

type Ij0oq61lvrdfj = { para_id: number; collator: Anonymize<I17k3ujudqd5df> }

export type PolkadotPrimitivesV5OccupiedCoreAssumption = Enum<
  | { type: "Included"; value: undefined }
  | { type: "TimedOut"; value: undefined }
  | { type: "Free"; value: undefined }
>
export const PolkadotPrimitivesV5OccupiedCoreAssumption =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5OccupiedCoreAssumption>

type I3gq2gui038qt = Anonymize<I5r8ef6aie125l> | undefined

type I5r8ef6aie125l = {
  parent_head: Binary
  relay_parent_number: number
  relay_parent_storage_root: Binary
  max_pov_size: number
}

type Ic7as9gfl5utn9 = Anonymize<I9rov8gdjkv3b9> | undefined

type I9rov8gdjkv3b9 = [Anonymize<I5r8ef6aie125l>, Binary]

type I2914et6njplkd = Anonymize<Iedmhjqij0hr8g> | undefined

type Ianqtalutublq5 = Array<PolkadotPrimitivesV5CandidateEvent>

export type PolkadotPrimitivesV5CandidateEvent = Enum<
  | { type: "CandidateBacked"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateIncluded"; value: Anonymize<Ieno5vn1m65ng2> }
  | { type: "CandidateTimedOut"; value: Anonymize<Ievbvtucck5gnq> }
>
export const PolkadotPrimitivesV5CandidateEvent =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5CandidateEvent>

type I2pf0b05mc7sdr = Array<Anonymize<I9hvej6h53dqj0>>

type I9hvej6h53dqj0 = [number, Anonymize<Iev3u09i2vqn93>]

type Ibfq7qcjfd788c = Anonymize<I3qttgoifdk5v6> | undefined

type I5537sfe0t0708 = Anonymize<I7k9oi9p83j43l> | undefined

type I8bqhj6psoqsin = Array<Anonymize<Irsmd7gp7po60>>

type Irsmd7gp7po60 = [number, Binary, Anonymize<I87u7jalc0lhah>]

type I1b0210m3f090j = Anonymize<I6sbufrhmgqdb6> | undefined

type Icqsglphsrpv5 = Array<Anonymize<I5ork0l271qluj>>

type I5ork0l271qluj = [number, Binary, Anonymize<I3g2jv3qmtkrbe>]

type I4gc64ora0pbbf = Anonymize<I53uro0ns8ba5b> | undefined

type I53uro0ns8ba5b = {
  constraints: Anonymize<I269u13ficnsd5>
  pending_availability: Anonymize<Ic05b0cuggt8lp>
}

type I269u13ficnsd5 = {
  min_relay_parent_number: number
  max_pov_size: number
  max_code_size: number
  ump_remaining: number
  ump_remaining_bytes: number
  max_ump_num_per_candidate: number
  dmp_remaining_messages: Anonymize<Icgljjb6j82uhn>
  hrmp_inbound: Anonymize<Icgljjb6j82uhn>
  hrmp_channels_out: Anonymize<I1ilbeu6195gbh>
  max_hrmp_num_per_candidate: number
  required_parent: Binary
  validation_code_hash: Binary
  upgrade_restriction: Anonymize<Id34bi0o1gnln9>
  future_validation_code: Anonymize<I7r2laa851pa4v>
}

type I1ilbeu6195gbh = Array<Anonymize<If6i47cerum785>>

type If6i47cerum785 = [number, Anonymize<Ifq5eqaefrc6it>]

type Ifq5eqaefrc6it = { bytes_remaining: number; messages_remaining: number }

type Id34bi0o1gnln9 = PolkadotPrimitivesV5UpgradeRestriction | undefined

type I7r2laa851pa4v = Anonymize<If89923vhoiaim> | undefined

type Ic05b0cuggt8lp = Array<Anonymize<Ids4u62ll2l1p4>>

type Ids4u62ll2l1p4 = {
  candidate_hash: Binary
  descriptor: Anonymize<Ib2u20s6roco9i>
  commitments: Anonymize<Ic1d4u2opv3fst>
  relay_parent_number: number
  max_pov_size: number
}

type I71rr2d0kb0iu3 = Anonymize<I17bb7o70l1ke3> | undefined

type I17bb7o70l1ke3 = { validators: Anonymize<Ie5mvl0hn85mkc>; id: bigint }

type I7m8g2583l7nbe = ResultPayload<Binary, MmrPrimitivesError>

export type MmrPrimitivesError = Enum<
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
export const MmrPrimitivesError =
  _Enum as unknown as GetEnum<MmrPrimitivesError>

type I256gkugrgtccq = ResultPayload<bigint, MmrPrimitivesError>

type I32e5ntud5fl8i = ResultPayload<
  Anonymize<If93480lp8rssc>,
  MmrPrimitivesError
>

type If93480lp8rssc = [Anonymize<Itom7fk49o0c9>, Anonymize<I2ij509mgq3dve>]

type I2ij509mgq3dve = {
  leaf_indices: Anonymize<Iafqnechp3omqg>
  leaf_count: bigint
  items: Anonymize<Idhnf6rtqoslea>
}

type I9lnenfklcdre = ResultPayload<undefined, MmrPrimitivesError>

type Iap4lrotpgmqpv = {
  slot_duration: bigint
  epoch_length: bigint
  c: Anonymize<I2j729bmgsdiuo>
  authorities: Anonymize<I2qinct8jq4bqe>
  randomness: Binary
  allowed_slots: BabeAllowedSlots
}

type I6sbl80o3jmgfd = {
  epoch_index: bigint
  start_slot: bigint
  duration: bigint
  authorities: Anonymize<I2qinct8jq4bqe>
  randomness: Binary
  config: Anonymize<Idkva8q2m9meg0>
}

type I96ok5o1k21bpi = Anonymize<I4gkfq1hbsjrle> | undefined

type I4gkfq1hbsjrle = Array<Anonymize<I3dmbm7ul207u0>>

type I3dmbm7ul207u0 = [Binary, Binary]

type I5r4utvvlnltpd = {
  weight: Anonymize<I4q39t5hn830vp>
  class: DispatchClass
  partial_fee: bigint
}

type Iei2mvq0mjvt81 = { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }

type Id37fum600qfau = Anonymize<I246faqtjrsnee> | undefined

type I246faqtjrsnee = {
  base_fee: bigint
  len_fee: bigint
  adjusted_weight_fee: bigint
}

type I9q9lvv0h98nhk = ResultPayload<undefined, string>

const cf3ncnq6stc567 = "f3ncnq6stc567"
const cdhc577m5btfvc = "dhc577m5btfvc"
const cfmam6uono5akb = "fmam6uono5akb"
const c7i24fvhamijd = "7i24fvhamijd"
const cegurtje61sbu9 = "egurtje61sbu9"
const c7d2tqf029vcod = "7d2tqf029vcod"
const c2qinct8jq4bqe = "2qinct8jq4bqe"
const c5g2vv0ckl2m8b = "5g2vv0ckl2m8b"
const cdkva8q2m9meg0 = "dkva8q2m9meg0"
const ca2lhg7l2hilo3 = "a2lhg7l2hilo3"
const c2snmki6ntodt = "2snmki6ntodt"
const c95283gdo01p2p = "95283gdo01p2p"
const cau4oj9ee8cokk = "au4oj9ee8cokk"
const cep4uo61810hfs = "ep4uo61810hfs"
const ccgljjb6j82uhn = "cgljjb6j82uhn"
const c3u1nuj99f15hf = "3u1nuj99f15hf"
const cdhnf6rtqoslea = "dhnf6rtqoslea"
const cau2fn2kb28v1i = "au2fn2kb28v1i"
const c5e37esnd8etqt = "5e37esnd8etqt"
const ccsbuok7olbg29 = "csbuok7olbg29"
const cd43g4eveajpkl = "d43g4eveajpkl"
const c4arjljr6dpflb = "4arjljr6dpflb"
const ce5mvl0hn85mkc = "e5mvl0hn85mkc"
const c3qm5u05tioq05 = "3qm5u05tioq05"
const c4q39t5hn830vp = "4q39t5hn830vp"
const c35p85j063s0il = "35p85j063s0il"
const c7l9d2ilde057d = "7l9d2ilde057d"
const c8ofcg5rbj0g2c = "8ofcg5rbj0g2c"
const c6pjjpfvhvcfru = "6pjjpfvhvcfru"
const c5n4sebgkfr760 = "5n4sebgkfr760"
const cd9d48vaes3c53 = "d9d48vaes3c53"
const c7mmbgd20nut80 = "7mmbgd20nut80"
const c666bl2fqjkejo = "666bl2fqjkejo"
const cdge7gk9m5car0 = "dge7gk9m5car0"
const cen6q0lasi0m7i = "en6q0lasi0m7i"
const ce5v6njpckr05b = "e5v6njpckr05b"
const c39ibapn5dm6tr = "39ibapn5dm6tr"
const c3vh014cqgmrfd = "3vh014cqgmrfd"
const ce5vbnd9198quk = "e5vbnd9198quk"
const c4kjek1q6rj24q = "4kjek1q6rj24q"
const ccm9m0qeemu66d = "cm9m0qeemu66d"
const c8413rb6im3iko = "8413rb6im3iko"
const c29er5j74l8bu = "29er5j74l8bu"
const cd8ilk50mukg0o = "d8ilk50mukg0o"
const cclf5v4qsadc12 = "clf5v4qsadc12"
const caaog12m0bl04j = "aaog12m0bl04j"
const cd3bpmvju2iqi5 = "d3bpmvju2iqi5"
const ca9p5bg6p18r0i = "a9p5bg6p18r0i"
const c2gr10p66od9ch = "2gr10p66od9ch"
const ceg1oc56mamrl5 = "eg1oc56mamrl5"
const c931cottvong90 = "931cottvong90"
const c8cbluptqo8kbp = "8cbluptqo8kbp"
const c81cc4plffa1dm = "81cc4plffa1dm"
const cd581arok0b1nj = "d581arok0b1nj"
const c9jsikd1ghmc7l = "9jsikd1ghmc7l"
const c1k3urvkqqshbc = "1k3urvkqqshbc"
const c2ff0ffsh15vej = "2ff0ffsh15vej"
const caus4cb3drhu9q = "aus4cb3drhu9q"
const cd1baei7m8gkhk = "d1baei7m8gkhk"
const c50mrcbubp554e = "50mrcbubp554e"
const c3js6c9fubdele = "3js6c9fubdele"
const ca1u3jll6a06ae = "a1u3jll6a06ae"
const ceeis6pj62kiu4 = "eeis6pj62kiu4"
const c732o5n04n5ohg = "732o5n04n5ohg"
const c3pog27ittgi9g = "3pog27ittgi9g"
const cfcceq8taolrca = "fcceq8taolrca"
const c16soggnee6qrb = "16soggnee6qrb"
const cfvnf1s3g2lg8u = "fvnf1s3g2lg8u"
const c894urueu7skf3 = "894urueu7skf3"
const ccbccs0ug47ilf = "cbccs0ug47ilf"
const cbkv7dijodoblp = "bkv7dijodoblp"
const cd5fm4p8lj5qgi = "d5fm4p8lj5qgi"
const c4cbvqmqadhrea = "4cbvqmqadhrea"
const c3qt1hgg4djhgb = "3qt1hgg4djhgb"
const c2hq50pu2kdjpo = "2hq50pu2kdjpo"
const cfk8eme5o7mukf = "fk8eme5o7mukf"
const c54umskavgc9du = "54umskavgc9du"
const cek7v4hrgnq6iv = "ek7v4hrgnq6iv"
const c62nte77gksm0f = "62nte77gksm0f"
const clhp45uime5tp = "lhp45uime5tp"
const c50aq0q2l1cdkr = "50aq0q2l1cdkr"
const ce5i8qqljk3tjb = "e5i8qqljk3tjb"
const cep1lmt6q3s6r3 = "ep1lmt6q3s6r3"
const c1fac16213rie2 = "1fac16213rie2"
const cck3mveut33f44 = "ck3mveut33f44"
const c94ud6o1n6v0n8 = "94ud6o1n6v0n8"
const c70sc1pdo8vtos = "70sc1pdo8vtos"
const c60p8l86a8cm59 = "60p8l86a8cm59"
const c7j4m7a3pkvsf4 = "7j4m7a3pkvsf4"
const ceno5vn1m65ng2 = "eno5vn1m65ng2"
const c34ha3jf7jm288 = "34ha3jf7jm288"
const c64gm4hrq7urum = "64gm4hrq7urum"
const cd2bej717ckub0 = "d2bej717ckub0"
const c545vo2e86o5i4 = "545vo2e86o5i4"
const c37r4bdai8o9mp = "37r4bdai8o9mp"
const c8ve4g3egaln6a = "8ve4g3egaln6a"
const cse9r0vrat2m6 = "se9r0vrat2m6"
const c2uqmls7kcdnii = "2uqmls7kcdnii"
const c5qm1bvb2j3ap2 = "5qm1bvb2j3ap2"
const c5pnf8l8c1nkfk = "5pnf8l8c1nkfk"

const stg_System_Account: StorageDescriptor<
  [Key: SS58String],
  {
    nonce: number
    consumers: number
    providers: number
    sufficients: number
    data: Anonymize<I1q8tnt1cluu5j>
  },
  false
> = "4u7j8i23ciccr" as StorageDescriptor<
  [Key: SS58String],
  {
    nonce: number
    consumers: number
    providers: number
    sufficients: number
    data: Anonymize<I1q8tnt1cluu5j>
  },
  false
>
const stg_System_ExtrinsicCount: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_System_BlockWeight: StorageDescriptor<
  [],
  {
    normal: Anonymize<I4q39t5hn830vp>
    operational: Anonymize<I4q39t5hn830vp>
    mandatory: Anonymize<I4q39t5hn830vp>
  },
  false
> = "ffmde3ekjedi9" as StorageDescriptor<
  [],
  {
    normal: Anonymize<I4q39t5hn830vp>
    operational: Anonymize<I4q39t5hn830vp>
    mandatory: Anonymize<I4q39t5hn830vp>
  },
  false
>
const stg_System_AllExtrinsicsLen: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_System_BlockHash: StorageDescriptor<[Key: number], Binary, false> =
  cdhc577m5btfvc as StorageDescriptor<[Key: number], Binary, false>
const stg_System_ExtrinsicData: StorageDescriptor<
  [Key: number],
  Binary,
  false
> = cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, false>
const stg_System_Number: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_System_ParentHash: StorageDescriptor<[], Binary, false> =
  c7i24fvhamijd as StorageDescriptor<[], Binary, false>
const stg_System_Digest: StorageDescriptor<
  [],
  Array<DigestItem>,
  false
> = "din6nhq46lvdj" as StorageDescriptor<[], Array<DigestItem>, false>
const stg_System_Events: StorageDescriptor<
  [],
  Array<Anonymize<I2s0spoacio2qd>>,
  false
> = "av1fkj39ai0lr" as StorageDescriptor<
  [],
  Array<Anonymize<I2s0spoacio2qd>>,
  false
>
const stg_System_EventCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_System_EventTopics: StorageDescriptor<
  [Key: Binary],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
> = "b9d1sol3oue21" as StorageDescriptor<
  [Key: Binary],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
>
const stg_System_LastRuntimeUpgrade: StorageDescriptor<
  [],
  { spec_version: number; spec_name: string },
  true
> = "eniouoqkq4icf" as StorageDescriptor<
  [],
  { spec_version: number; spec_name: string },
  true
>
const stg_System_UpgradedToU32RefCount: StorageDescriptor<[], boolean, false> =
  cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_System_UpgradedToTripleRefCount: StorageDescriptor<
  [],
  boolean,
  false
> = cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_System_ExecutionPhase: StorageDescriptor<[], Phase, true> =
  "a3md08567vo9e" as StorageDescriptor<[], Phase, true>
const stg_Scheduler_IncompleteSince: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Scheduler_Agenda: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I1n29q4mt87e84>>,
  false
> = "3ft130i5brk12" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I1n29q4mt87e84>>,
  false
>
const stg_Scheduler_Lookup: StorageDescriptor<
  [Key: Binary],
  [number, number],
  true
> = "1lvn5l8onnkmp" as StorageDescriptor<[Key: Binary], [number, number], true>
const stg_Preimage_StatusFor: StorageDescriptor<
  [Key: Binary],
  PreimageRequestStatus,
  true
> = "efdvjds2mvqk7" as StorageDescriptor<
  [Key: Binary],
  PreimageRequestStatus,
  true
>
const stg_Preimage_RequestStatusFor: StorageDescriptor<
  [Key: Binary],
  Anonymize<
    AnonymousEnum<{
      Unrequested: Anonymize<Idvcv8961o32th>
      Requested: Anonymize<In82i9avte5re>
    }>
  >,
  true
> = "20nddnciorh2q" as StorageDescriptor<
  [Key: Binary],
  Anonymize<
    AnonymousEnum<{
      Unrequested: Anonymize<Idvcv8961o32th>
      Requested: Anonymize<In82i9avte5re>
    }>
  >,
  true
>
const stg_Preimage_PreimageFor: StorageDescriptor<
  [Key: [Binary, number]],
  Binary,
  true
> = "6q1snsvkrbatm" as StorageDescriptor<[Key: [Binary, number]], Binary, true>
const stg_Babe_EpochIndex: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Babe_Authorities: StorageDescriptor<
  [],
  Array<Anonymize<I3iuggguvi9njj>>,
  false
> = c2qinct8jq4bqe as StorageDescriptor<
  [],
  Array<Anonymize<I3iuggguvi9njj>>,
  false
>
const stg_Babe_GenesisSlot: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Babe_CurrentSlot: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Babe_Randomness: StorageDescriptor<[], Binary, false> =
  c7i24fvhamijd as StorageDescriptor<[], Binary, false>
const stg_Babe_PendingEpochConfigChange: StorageDescriptor<
  [],
  BabeDigestsNextConfigDescriptor,
  true
> = "dbrkktcap6cr5" as StorageDescriptor<
  [],
  BabeDigestsNextConfigDescriptor,
  true
>
const stg_Babe_NextRandomness: StorageDescriptor<[], Binary, false> =
  c7i24fvhamijd as StorageDescriptor<[], Binary, false>
const stg_Babe_NextAuthorities: StorageDescriptor<
  [],
  Array<Anonymize<I3iuggguvi9njj>>,
  false
> = c2qinct8jq4bqe as StorageDescriptor<
  [],
  Array<Anonymize<I3iuggguvi9njj>>,
  false
>
const stg_Babe_SegmentIndex: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Babe_UnderConstruction: StorageDescriptor<
  [Key: number],
  Array<Binary>,
  false
> = "dqa2fau59jv7f" as StorageDescriptor<[Key: number], Array<Binary>, false>
const stg_Babe_Initialized: StorageDescriptor<
  [],
  BabeDigestsPreDigest | undefined,
  true
> = "5o0h2ngv65fpq" as StorageDescriptor<
  [],
  BabeDigestsPreDigest | undefined,
  true
>
const stg_Babe_AuthorVrfRandomness: StorageDescriptor<
  [],
  Binary | undefined,
  false
> = "17k3ujudqd5df" as StorageDescriptor<[], Binary | undefined, false>
const stg_Babe_EpochStart: StorageDescriptor<[], [number, number], false> =
  c5g2vv0ckl2m8b as StorageDescriptor<[], [number, number], false>
const stg_Babe_Lateness: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Babe_EpochConfig: StorageDescriptor<
  [],
  { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
  true
> = cdkva8q2m9meg0 as StorageDescriptor<
  [],
  { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
  true
>
const stg_Babe_NextEpochConfig: StorageDescriptor<
  [],
  { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
  true
> = cdkva8q2m9meg0 as StorageDescriptor<
  [],
  { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
  true
>
const stg_Babe_SkippedEpochs: StorageDescriptor<
  [],
  Array<Anonymize<I6cs1itejju2vv>>,
  false
> = "fip05kcrl65am" as StorageDescriptor<
  [],
  Array<Anonymize<I6cs1itejju2vv>>,
  false
>
const stg_Timestamp_Now: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Timestamp_DidUpdate: StorageDescriptor<[], boolean, false> =
  cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_Indices_Accounts: StorageDescriptor<
  [Key: number],
  [SS58String, bigint, boolean],
  true
> = "eie54ehffvlk9" as StorageDescriptor<
  [Key: number],
  [SS58String, bigint, boolean],
  true
>
const stg_Balances_TotalIssuance: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Balances_InactiveIssuance: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Balances_Account: StorageDescriptor<
  [Key: SS58String],
  { free: bigint; reserved: bigint; frozen: bigint; flags: bigint },
  false
> = "btum7aot707m6" as StorageDescriptor<
  [Key: SS58String],
  { free: bigint; reserved: bigint; frozen: bigint; flags: bigint },
  false
>
const stg_Balances_Locks: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I5b29v4qfq4tu7>>,
  false
> = "1e2385hi92o2f" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I5b29v4qfq4tu7>>,
  false
>
const stg_Balances_Reserves: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I32btm6htd9bck>>,
  false
> = "be3psbb7upqsv" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I32btm6htd9bck>>,
  false
>
const stg_Balances_Holds: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I2g6pdv83dq8hk>>,
  false
> = "184j6s24d723g" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I2g6pdv83dq8hk>>,
  false
>
const stg_Balances_Freezes: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I6nlcdgcjnohed>>,
  false
> = "chji9ooap6m79" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I6nlcdgcjnohed>>,
  false
>
const stg_TransactionPayment_NextFeeMultiplier: StorageDescriptor<
  [],
  bigint,
  false
> = c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_TransactionPayment_StorageVersion: StorageDescriptor<
  [],
  TransactionPaymentReleases,
  false
> = "944994o3qcrkq" as StorageDescriptor<[], TransactionPaymentReleases, false>
const stg_Authorship_Author: StorageDescriptor<[], SS58String, true> =
  "86esvcpejimq9" as StorageDescriptor<[], SS58String, true>
const stg_Staking_ValidatorCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_MinimumValidatorCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_Invulnerables: StorageDescriptor<
  [],
  Array<SS58String>,
  false
> = ca2lhg7l2hilo3 as StorageDescriptor<[], Array<SS58String>, false>
const stg_Staking_Bonded: StorageDescriptor<
  [Key: SS58String],
  SS58String,
  true
> = "4j0n8mcbuvkci" as StorageDescriptor<[Key: SS58String], SS58String, true>
const stg_Staking_MinNominatorBond: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Staking_MinValidatorBond: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Staking_MinimumActiveStake: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Staking_MinCommission: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_Ledger: StorageDescriptor<
  [Key: SS58String],
  {
    stash: SS58String
    total: bigint
    active: bigint
    unlocking: Anonymize<I9nc4v1upo2c8e>
    claimed_rewards: Anonymize<Icgljjb6j82uhn>
  },
  true
> = "7qrau03b52d2u" as StorageDescriptor<
  [Key: SS58String],
  {
    stash: SS58String
    total: bigint
    active: bigint
    unlocking: Anonymize<I9nc4v1upo2c8e>
    claimed_rewards: Anonymize<Icgljjb6j82uhn>
  },
  true
>
const stg_Staking_Payee: StorageDescriptor<
  [Key: SS58String],
  StakingRewardDestination,
  false
> = "17sh9getsfh3" as StorageDescriptor<
  [Key: SS58String],
  StakingRewardDestination,
  false
>
const stg_Staking_Validators: StorageDescriptor<
  [Key: SS58String],
  { commission: number; blocked: boolean },
  false
> = "cr53ojlikel1u" as StorageDescriptor<
  [Key: SS58String],
  { commission: number; blocked: boolean },
  false
>
const stg_Staking_CounterForValidators: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_MaxValidatorsCount: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Staking_Nominators: StorageDescriptor<
  [Key: SS58String],
  {
    targets: Anonymize<Ia2lhg7l2hilo3>
    submitted_in: number
    suppressed: boolean
  },
  true
> = "5i8ce1ied6cg8" as StorageDescriptor<
  [Key: SS58String],
  {
    targets: Anonymize<Ia2lhg7l2hilo3>
    submitted_in: number
    suppressed: boolean
  },
  true
>
const stg_Staking_CounterForNominators: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_MaxNominatorsCount: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Staking_CurrentEra: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Staking_ActiveEra: StorageDescriptor<
  [],
  { index: number; start: Anonymize<I35p85j063s0il> },
  true
> = "b3j7gb0jgs38u" as StorageDescriptor<
  [],
  { index: number; start: Anonymize<I35p85j063s0il> },
  true
>
const stg_Staking_ErasStartSessionIndex: StorageDescriptor<
  [Key: number],
  number,
  true
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Staking_ErasStakers: StorageDescriptor<
  [number, SS58String],
  { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
  false
> = c95283gdo01p2p as StorageDescriptor<
  [number, SS58String],
  { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
  false
>
const stg_Staking_ErasStakersClipped: StorageDescriptor<
  [number, SS58String],
  { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
  false
> = c95283gdo01p2p as StorageDescriptor<
  [number, SS58String],
  { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
  false
>
const stg_Staking_ErasValidatorPrefs: StorageDescriptor<
  [number, SS58String],
  { commission: number; blocked: boolean },
  false
> = "3vfg012q6a4mo" as StorageDescriptor<
  [number, SS58String],
  { commission: number; blocked: boolean },
  false
>
const stg_Staking_ErasValidatorReward: StorageDescriptor<
  [Key: number],
  bigint,
  true
> = cau4oj9ee8cokk as StorageDescriptor<[Key: number], bigint, true>
const stg_Staking_ErasRewardPoints: StorageDescriptor<
  [Key: number],
  { total: number; individual: Anonymize<I205qrookusi3d> },
  false
> = "amb18r46s2klv" as StorageDescriptor<
  [Key: number],
  { total: number; individual: Anonymize<I205qrookusi3d> },
  false
>
const stg_Staking_ErasTotalStake: StorageDescriptor<
  [Key: number],
  bigint,
  false
> = cau4oj9ee8cokk as StorageDescriptor<[Key: number], bigint, false>
const stg_Staking_ForceEra: StorageDescriptor<[], StakingForcing, false> =
  "c142rsp117vl8" as StorageDescriptor<[], StakingForcing, false>
const stg_Staking_SlashRewardFraction: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_CanceledSlashPayout: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Staking_UnappliedSlashes: StorageDescriptor<
  [Key: number],
  Array<Anonymize<Ifedledo2fog34>>,
  false
> = "38jg2uee78d5a" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<Ifedledo2fog34>>,
  false
>
const stg_Staking_BondedEras: StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
> = cep4uo61810hfs as StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
>
const stg_Staking_ValidatorSlashInEra: StorageDescriptor<
  [number, SS58String],
  [number, bigint],
  true
> = "4kem8h2c8h020" as StorageDescriptor<
  [number, SS58String],
  [number, bigint],
  true
>
const stg_Staking_NominatorSlashInEra: StorageDescriptor<
  [number, SS58String],
  bigint,
  true
> = "5m2t8g3dset" as StorageDescriptor<[number, SS58String], bigint, true>
const stg_Staking_SlashingSpans: StorageDescriptor<
  [Key: SS58String],
  {
    span_index: number
    last_start: number
    last_nonzero_slash: number
    prior: Anonymize<Icgljjb6j82uhn>
  },
  true
> = "5pruv3r3j6mjm" as StorageDescriptor<
  [Key: SS58String],
  {
    span_index: number
    last_start: number
    last_nonzero_slash: number
    prior: Anonymize<Icgljjb6j82uhn>
  },
  true
>
const stg_Staking_SpanSlash: StorageDescriptor<
  [Key: [SS58String, number]],
  { slashed: bigint; paid_out: bigint },
  false
> = "2kj1olsktto0d" as StorageDescriptor<
  [Key: [SS58String, number]],
  { slashed: bigint; paid_out: bigint },
  false
>
const stg_Staking_CurrentPlannedSession: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Staking_OffendingValidators: StorageDescriptor<
  [],
  Array<Anonymize<I39p6ln31i4n46>>,
  false
> = "a9ek8s49lerat" as StorageDescriptor<
  [],
  Array<Anonymize<I39p6ln31i4n46>>,
  false
>
const stg_Staking_ChillThreshold: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Offences_Reports: StorageDescriptor<
  [Key: Binary],
  { offender: Anonymize<Idi27pva6ajg4>; reporters: Anonymize<Ia2lhg7l2hilo3> },
  true
> = "f0p1oli7brof3" as StorageDescriptor<
  [Key: Binary],
  { offender: Anonymize<Idi27pva6ajg4>; reporters: Anonymize<Ia2lhg7l2hilo3> },
  true
>
const stg_Offences_ConcurrentReportsIndex: StorageDescriptor<
  [Binary, Binary],
  Array<Binary>,
  false
> = "5jnsgk9uqigfd" as StorageDescriptor<[Binary, Binary], Array<Binary>, false>
const stg_Session_Validators: StorageDescriptor<
  [],
  Array<SS58String>,
  false
> = ca2lhg7l2hilo3 as StorageDescriptor<[], Array<SS58String>, false>
const stg_Session_CurrentIndex: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Session_QueuedChanged: StorageDescriptor<[], boolean, false> =
  cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_Session_QueuedKeys: StorageDescriptor<
  [],
  Array<Anonymize<Idp8pf1r5mria2>>,
  false
> = "6gic9mme18mpd" as StorageDescriptor<
  [],
  Array<Anonymize<Idp8pf1r5mria2>>,
  false
>
const stg_Session_DisabledValidators: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_Session_NextKeys: StorageDescriptor<
  [Key: SS58String],
  {
    grandpa: Binary
    babe: Binary
    im_online: Binary
    para_validator: Binary
    para_assignment: Binary
    authority_discovery: Binary
    beefy: Binary
  },
  true
> = "c0mjui7eer7o8" as StorageDescriptor<
  [Key: SS58String],
  {
    grandpa: Binary
    babe: Binary
    im_online: Binary
    para_validator: Binary
    para_assignment: Binary
    authority_discovery: Binary
    beefy: Binary
  },
  true
>
const stg_Session_KeyOwner: StorageDescriptor<
  [Key: [Binary, Binary]],
  SS58String,
  true
> = "8drjr6qpp26i0" as StorageDescriptor<
  [Key: [Binary, Binary]],
  SS58String,
  true
>
const stg_Grandpa_State: StorageDescriptor<[], GrandpaStoredState, false> =
  "9atcbaq1i12p8" as StorageDescriptor<[], GrandpaStoredState, false>
const stg_Grandpa_PendingChange: StorageDescriptor<
  [],
  {
    scheduled_at: number
    delay: number
    next_authorities: Anonymize<I2qinct8jq4bqe>
    forced: Anonymize<I4arjljr6dpflb>
  },
  true
> = "bu50q5vhsfq5e" as StorageDescriptor<
  [],
  {
    scheduled_at: number
    delay: number
    next_authorities: Anonymize<I2qinct8jq4bqe>
    forced: Anonymize<I4arjljr6dpflb>
  },
  true
>
const stg_Grandpa_NextForced: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Grandpa_Stalled: StorageDescriptor<[], [number, number], true> =
  c5g2vv0ckl2m8b as StorageDescriptor<[], [number, number], true>
const stg_Grandpa_CurrentSetId: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Grandpa_SetIdSession: StorageDescriptor<[Key: bigint], number, true> =
  c3u1nuj99f15hf as StorageDescriptor<[Key: bigint], number, true>
const stg_ImOnline_HeartbeatAfter: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ImOnline_Keys: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_ImOnline_ReceivedHeartbeats: StorageDescriptor<
  [number, number],
  boolean,
  true
> = "qdeom2o3dll6" as StorageDescriptor<[number, number], boolean, true>
const stg_ImOnline_AuthoredBlocks: StorageDescriptor<
  [number, SS58String],
  number,
  false
> = "79l89n8ard6m" as StorageDescriptor<[number, SS58String], number, false>
const stg_Treasury_ProposalCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Treasury_Proposals: StorageDescriptor<
  [Key: number],
  {
    proposer: SS58String
    value: bigint
    beneficiary: SS58String
    bond: bigint
  },
  true
> = "91okf2u22en9d" as StorageDescriptor<
  [Key: number],
  {
    proposer: SS58String
    value: bigint
    beneficiary: SS58String
    bond: bigint
  },
  true
>
const stg_Treasury_Deactivated: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Treasury_Approvals: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_Treasury_SpendCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Treasury_Spends: StorageDescriptor<
  [Key: number],
  {
    asset_kind: Anonymize<I32r9skkupsthv>
    amount: bigint
    beneficiary: XcmVersionedMultiLocation
    valid_from: number
    expire_at: number
    status: Anonymize<Ie3iqv87ntls1>
  },
  true
> = "7pumppc558d24" as StorageDescriptor<
  [Key: number],
  {
    asset_kind: Anonymize<I32r9skkupsthv>
    amount: bigint
    beneficiary: XcmVersionedMultiLocation
    valid_from: number
    expire_at: number
    status: Anonymize<Ie3iqv87ntls1>
  },
  true
>
const stg_ConvictionVoting_VotingFor: StorageDescriptor<
  [SS58String, number],
  ConvictionVotingVoteVoting,
  false
> = "d2utt7cpsnpeg" as StorageDescriptor<
  [SS58String, number],
  ConvictionVotingVoteVoting,
  false
>
const stg_ConvictionVoting_ClassLocksFor: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I4ojmnsk1dchql>>,
  false
> = "c5g150o6tnujs" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I4ojmnsk1dchql>>,
  false
>
const stg_Referenda_ReferendumCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Referenda_ReferendumInfoFor: StorageDescriptor<
  [Key: number],
  ReferendaTypesReferendumInfo,
  true
> = "637ot0rfk9ktp" as StorageDescriptor<
  [Key: number],
  ReferendaTypesReferendumInfo,
  true
>
const stg_Referenda_TrackQueue: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I4ojmnsk1dchql>>,
  false
> = "3aojtj9s5c6p0" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I4ojmnsk1dchql>>,
  false
>
const stg_Referenda_DecidingCount: StorageDescriptor<
  [Key: number],
  number,
  false
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, false>
const stg_Referenda_MetadataOf: StorageDescriptor<[Key: number], Binary, true> =
  cdhc577m5btfvc as StorageDescriptor<[Key: number], Binary, true>
const stg_Whitelist_WhitelistedCall: StorageDescriptor<
  [Key: Binary],
  undefined,
  true
> = "2pgep7i8dce2o" as StorageDescriptor<[Key: Binary], undefined, true>
const stg_Claims_Claims: StorageDescriptor<[Key: Binary], bigint, true> =
  "de707245g30i" as StorageDescriptor<[Key: Binary], bigint, true>
const stg_Claims_Total: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Claims_Vesting: StorageDescriptor<
  [Key: Binary],
  [bigint, bigint, number],
  true
> = "ds6mu9uf8odml" as StorageDescriptor<
  [Key: Binary],
  [bigint, bigint, number],
  true
>
const stg_Claims_Signing: StorageDescriptor<
  [Key: Binary],
  ClaimsStatementKind,
  true
> = "cpugkad2ei7ko" as StorageDescriptor<
  [Key: Binary],
  ClaimsStatementKind,
  true
>
const stg_Claims_Preclaims: StorageDescriptor<[Key: SS58String], Binary, true> =
  "cmettfsqoveue" as StorageDescriptor<[Key: SS58String], Binary, true>
const stg_Vesting_Vesting: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I4aro1m78pdrtt>>,
  true
> = "13g9ahdidi9g6" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I4aro1m78pdrtt>>,
  true
>
const stg_Vesting_StorageVersion: StorageDescriptor<
  [],
  VestingReleases,
  false
> = "f6v8gsdlcpu8j" as StorageDescriptor<[], VestingReleases, false>
const stg_Identity_IdentityOf: StorageDescriptor<
  [Key: SS58String],
  {
    judgements: Anonymize<I8lr6mvrp6262n>
    deposit: bigint
    info: Anonymize<I939m6d6t3dsgm>
  },
  true
> = "f6kitggev9qqr" as StorageDescriptor<
  [Key: SS58String],
  {
    judgements: Anonymize<I8lr6mvrp6262n>
    deposit: bigint
    info: Anonymize<I939m6d6t3dsgm>
  },
  true
>
const stg_Identity_SuperOf: StorageDescriptor<
  [Key: SS58String],
  [SS58String, IdentityTypesData],
  true
> = "culsi9ibos67i" as StorageDescriptor<
  [Key: SS58String],
  [SS58String, IdentityTypesData],
  true
>
const stg_Identity_SubsOf: StorageDescriptor<
  [Key: SS58String],
  [bigint, Anonymize<Ia2lhg7l2hilo3>],
  false
> = "8b0o8nk1fee6p" as StorageDescriptor<
  [Key: SS58String],
  [bigint, Anonymize<Ia2lhg7l2hilo3>],
  false
>
const stg_Identity_Registrars: StorageDescriptor<
  [],
  Array<Anonymize<I48v3sekdprq30>>,
  false
> = "74af64m08r6as" as StorageDescriptor<
  [],
  Array<Anonymize<I48v3sekdprq30>>,
  false
>
const stg_Proxy_Proxies: StorageDescriptor<
  [Key: SS58String],
  [Anonymize<Id1245cgi7butj>, bigint],
  false
> = "1lu00afp1n9ml" as StorageDescriptor<
  [Key: SS58String],
  [Anonymize<Id1245cgi7butj>, bigint],
  false
>
const stg_Proxy_Announcements: StorageDescriptor<
  [Key: SS58String],
  [Anonymize<I99svmvk5amkcq>, bigint],
  false
> = "bkn8jef9a7jau" as StorageDescriptor<
  [Key: SS58String],
  [Anonymize<I99svmvk5amkcq>, bigint],
  false
>
const stg_Multisig_Multisigs: StorageDescriptor<
  [SS58String, Binary],
  {
    when: Anonymize<Itvprrpb0nm3o>
    deposit: bigint
    depositor: SS58String
    approvals: Anonymize<Ia2lhg7l2hilo3>
  },
  true
> = "4hs7g508a8hnc" as StorageDescriptor<
  [SS58String, Binary],
  {
    when: Anonymize<Itvprrpb0nm3o>
    deposit: bigint
    depositor: SS58String
    approvals: Anonymize<Ia2lhg7l2hilo3>
  },
  true
>
const stg_Bounties_BountyCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Bounties_Bounties: StorageDescriptor<
  [Key: number],
  {
    proposer: SS58String
    value: bigint
    fee: bigint
    curator_deposit: bigint
    bond: bigint
    status: BountiesBountyStatus
  },
  true
> = "3d8o4cndintp6" as StorageDescriptor<
  [Key: number],
  {
    proposer: SS58String
    value: bigint
    fee: bigint
    curator_deposit: bigint
    bond: bigint
    status: BountiesBountyStatus
  },
  true
>
const stg_Bounties_BountyDescriptions: StorageDescriptor<
  [Key: number],
  Binary,
  true
> = cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, true>
const stg_Bounties_BountyApprovals: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_ChildBounties_ChildBountyCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ChildBounties_ParentChildBounties: StorageDescriptor<
  [Key: number],
  number,
  false
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, false>
const stg_ChildBounties_ChildBounties: StorageDescriptor<
  [number, number],
  {
    parent_bounty: number
    value: bigint
    fee: bigint
    curator_deposit: bigint
    status: ChildBountyStatus
  },
  true
> = "ehpnsumg33leb" as StorageDescriptor<
  [number, number],
  {
    parent_bounty: number
    value: bigint
    fee: bigint
    curator_deposit: bigint
    status: ChildBountyStatus
  },
  true
>
const stg_ChildBounties_ChildBountyDescriptions: StorageDescriptor<
  [Key: number],
  Binary,
  true
> = cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, true>
const stg_ChildBounties_ChildrenCuratorFees: StorageDescriptor<
  [Key: number],
  bigint,
  false
> = cau4oj9ee8cokk as StorageDescriptor<[Key: number], bigint, false>
const stg_ElectionProviderMultiPhase_Round: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ElectionProviderMultiPhase_CurrentPhase: StorageDescriptor<
  [],
  ElectionProviderMultiPhasePhase,
  false
> = "398ip9ldm6khf" as StorageDescriptor<
  [],
  ElectionProviderMultiPhasePhase,
  false
>
const stg_ElectionProviderMultiPhase_QueuedSolution: StorageDescriptor<
  [],
  {
    supports: Anonymize<I4bboqsv44evel>
    score: Anonymize<I8s6n43okuj2b1>
    compute: ElectionProviderMultiPhaseElectionCompute
  },
  true
> = "a5nfh4hon3go3" as StorageDescriptor<
  [],
  {
    supports: Anonymize<I4bboqsv44evel>
    score: Anonymize<I8s6n43okuj2b1>
    compute: ElectionProviderMultiPhaseElectionCompute
  },
  true
>
const stg_ElectionProviderMultiPhase_Snapshot: StorageDescriptor<
  [],
  { voters: Anonymize<I9cpogojpnsq8h>; targets: Anonymize<Ia2lhg7l2hilo3> },
  true
> = "a7o65280hur3p" as StorageDescriptor<
  [],
  { voters: Anonymize<I9cpogojpnsq8h>; targets: Anonymize<Ia2lhg7l2hilo3> },
  true
>
const stg_ElectionProviderMultiPhase_DesiredTargets: StorageDescriptor<
  [],
  number,
  true
> = cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_ElectionProviderMultiPhase_SnapshotMetadata: StorageDescriptor<
  [],
  { voters: number; targets: number },
  true
> = "asd2iat48n080" as StorageDescriptor<
  [],
  { voters: number; targets: number },
  true
>
const stg_ElectionProviderMultiPhase_SignedSubmissionNextIndex: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ElectionProviderMultiPhase_SignedSubmissionIndices: StorageDescriptor<
  [],
  Array<Anonymize<Ie663uperueqm5>>,
  false
> = "c8d01sg6acf60" as StorageDescriptor<
  [],
  Array<Anonymize<Ie663uperueqm5>>,
  false
>
const stg_ElectionProviderMultiPhase_SignedSubmissionsMap: StorageDescriptor<
  [Key: number],
  {
    who: SS58String
    deposit: bigint
    raw_solution: Anonymize<I7je4n92ump862>
    call_fee: bigint
  },
  true
> = "50h2ou6gb4n55" as StorageDescriptor<
  [Key: number],
  {
    who: SS58String
    deposit: bigint
    raw_solution: Anonymize<I7je4n92ump862>
    call_fee: bigint
  },
  true
>
const stg_ElectionProviderMultiPhase_MinimumUntrustedScore: StorageDescriptor<
  [],
  { minimal_stake: bigint; sum_stake: bigint; sum_stake_squared: bigint },
  true
> = "8s6n43okuj2b1" as StorageDescriptor<
  [],
  { minimal_stake: bigint; sum_stake: bigint; sum_stake_squared: bigint },
  true
>
const stg_VoterList_ListNodes: StorageDescriptor<
  [Key: SS58String],
  {
    id: SS58String
    prev: Anonymize<Ihfphjolmsqq1>
    next: Anonymize<Ihfphjolmsqq1>
    bag_upper: bigint
    score: bigint
  },
  true
> = "a3b6snjkc9nq8" as StorageDescriptor<
  [Key: SS58String],
  {
    id: SS58String
    prev: Anonymize<Ihfphjolmsqq1>
    next: Anonymize<Ihfphjolmsqq1>
    bag_upper: bigint
    score: bigint
  },
  true
>
const stg_VoterList_CounterForListNodes: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_VoterList_ListBags: StorageDescriptor<
  [Key: bigint],
  { head: Anonymize<Ihfphjolmsqq1>; tail: Anonymize<Ihfphjolmsqq1> },
  true
> = "74atcg5pj4eqj" as StorageDescriptor<
  [Key: bigint],
  { head: Anonymize<Ihfphjolmsqq1>; tail: Anonymize<Ihfphjolmsqq1> },
  true
>
const stg_NominationPools_TotalValueLocked: StorageDescriptor<
  [],
  bigint,
  false
> = c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_NominationPools_MinJoinBond: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_NominationPools_MinCreateBond: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_NominationPools_MaxPools: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_NominationPools_MaxPoolMembers: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_NominationPools_MaxPoolMembersPerPool: StorageDescriptor<
  [],
  number,
  true
> = cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_NominationPools_GlobalMaxCommission: StorageDescriptor<
  [],
  number,
  true
> = cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_NominationPools_PoolMembers: StorageDescriptor<
  [Key: SS58String],
  {
    pool_id: number
    points: bigint
    last_recorded_reward_counter: bigint
    unbonding_eras: Anonymize<If9jidduiuq7vv>
  },
  true
> = "62jhlg7g5v7bp" as StorageDescriptor<
  [Key: SS58String],
  {
    pool_id: number
    points: bigint
    last_recorded_reward_counter: bigint
    unbonding_eras: Anonymize<If9jidduiuq7vv>
  },
  true
>
const stg_NominationPools_CounterForPoolMembers: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_BondedPools: StorageDescriptor<
  [Key: number],
  {
    commission: Anonymize<I30ffej1k6vjpu>
    member_counter: number
    points: bigint
    roles: Anonymize<Ia8iksu9hedf5n>
    state: NominationPoolsPoolState
  },
  true
> = "1p23hk4m27lrb" as StorageDescriptor<
  [Key: number],
  {
    commission: Anonymize<I30ffej1k6vjpu>
    member_counter: number
    points: bigint
    roles: Anonymize<Ia8iksu9hedf5n>
    state: NominationPoolsPoolState
  },
  true
>
const stg_NominationPools_CounterForBondedPools: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_RewardPools: StorageDescriptor<
  [Key: number],
  {
    last_recorded_reward_counter: bigint
    last_recorded_total_payouts: bigint
    total_rewards_claimed: bigint
    total_commission_pending: bigint
    total_commission_claimed: bigint
  },
  true
> = "a1jlgo3kdi8f4" as StorageDescriptor<
  [Key: number],
  {
    last_recorded_reward_counter: bigint
    last_recorded_total_payouts: bigint
    total_rewards_claimed: bigint
    total_commission_pending: bigint
    total_commission_claimed: bigint
  },
  true
>
const stg_NominationPools_CounterForRewardPools: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_SubPoolsStorage: StorageDescriptor<
  [Key: number],
  { no_era: Anonymize<I4h0cfnkiqrna6>; with_era: Anonymize<I48jqs22bfh5as> },
  true
> = "dai8j2u3r09d" as StorageDescriptor<
  [Key: number],
  { no_era: Anonymize<I4h0cfnkiqrna6>; with_era: Anonymize<I48jqs22bfh5as> },
  true
>
const stg_NominationPools_CounterForSubPoolsStorage: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_Metadata: StorageDescriptor<
  [Key: number],
  Binary,
  false
> = cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, false>
const stg_NominationPools_CounterForMetadata: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_LastPoolId: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_ReversePoolIdLookup: StorageDescriptor<
  [Key: SS58String],
  number,
  true
> = "44uqc9gktfck1" as StorageDescriptor<[Key: SS58String], number, true>
const stg_NominationPools_CounterForReversePoolIdLookup: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_NominationPools_ClaimPermissions: StorageDescriptor<
  [Key: SS58String],
  NominationPoolsClaimPermission,
  false
> = "86kvd3ptiqiet" as StorageDescriptor<
  [Key: SS58String],
  NominationPoolsClaimPermission,
  false
>
const stg_FastUnstake_Head: StorageDescriptor<
  [],
  { stashes: Anonymize<Iba9inugg1atvo>; checked: Anonymize<Icgljjb6j82uhn> },
  true
> = "2eh80qovrl7h2" as StorageDescriptor<
  [],
  { stashes: Anonymize<Iba9inugg1atvo>; checked: Anonymize<Icgljjb6j82uhn> },
  true
>
const stg_FastUnstake_Queue: StorageDescriptor<
  [Key: SS58String],
  bigint,
  true
> = "5rfi6cjqeaiir" as StorageDescriptor<[Key: SS58String], bigint, true>
const stg_FastUnstake_CounterForQueue: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_FastUnstake_ErasToCheckPerBlock: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Configuration_ActiveConfig: StorageDescriptor<
  [],
  {
    max_code_size: number
    max_head_data_size: number
    max_upward_queue_count: number
    max_upward_queue_size: number
    max_upward_message_size: number
    max_upward_message_num_per_candidate: number
    hrmp_max_message_num_per_candidate: number
    validation_upgrade_cooldown: number
    validation_upgrade_delay: number
    async_backing_params: Anonymize<Iavuvfkop6318c>
    max_pov_size: number
    max_downward_message_size: number
    hrmp_max_parachain_outbound_channels: number
    hrmp_sender_deposit: bigint
    hrmp_recipient_deposit: bigint
    hrmp_channel_max_capacity: number
    hrmp_channel_max_total_size: number
    hrmp_max_parachain_inbound_channels: number
    hrmp_channel_max_message_size: number
    executor_params: Anonymize<I6sbufrhmgqdb6>
    code_retention_period: number
    on_demand_cores: number
    on_demand_retries: number
    on_demand_queue_max_size: number
    on_demand_target_queue_utilization: number
    on_demand_fee_variability: number
    on_demand_base_fee: bigint
    on_demand_ttl: number
    group_rotation_frequency: number
    paras_availability_period: number
    scheduling_lookahead: number
    max_validators_per_core: Anonymize<I4arjljr6dpflb>
    max_validators: Anonymize<I4arjljr6dpflb>
    dispute_period: number
    dispute_post_conclusion_acceptance_period: number
    no_show_slots: number
    n_delay_tranches: number
    zeroth_delay_tranche_width: number
    needed_approvals: number
    relay_vrf_modulo_samples: number
    pvf_voting_ttl: number
    minimum_validation_upgrade_delay: number
    minimum_backing_votes: number
  },
  false
> = "a2hpj72knb2q9" as StorageDescriptor<
  [],
  {
    max_code_size: number
    max_head_data_size: number
    max_upward_queue_count: number
    max_upward_queue_size: number
    max_upward_message_size: number
    max_upward_message_num_per_candidate: number
    hrmp_max_message_num_per_candidate: number
    validation_upgrade_cooldown: number
    validation_upgrade_delay: number
    async_backing_params: Anonymize<Iavuvfkop6318c>
    max_pov_size: number
    max_downward_message_size: number
    hrmp_max_parachain_outbound_channels: number
    hrmp_sender_deposit: bigint
    hrmp_recipient_deposit: bigint
    hrmp_channel_max_capacity: number
    hrmp_channel_max_total_size: number
    hrmp_max_parachain_inbound_channels: number
    hrmp_channel_max_message_size: number
    executor_params: Anonymize<I6sbufrhmgqdb6>
    code_retention_period: number
    on_demand_cores: number
    on_demand_retries: number
    on_demand_queue_max_size: number
    on_demand_target_queue_utilization: number
    on_demand_fee_variability: number
    on_demand_base_fee: bigint
    on_demand_ttl: number
    group_rotation_frequency: number
    paras_availability_period: number
    scheduling_lookahead: number
    max_validators_per_core: Anonymize<I4arjljr6dpflb>
    max_validators: Anonymize<I4arjljr6dpflb>
    dispute_period: number
    dispute_post_conclusion_acceptance_period: number
    no_show_slots: number
    n_delay_tranches: number
    zeroth_delay_tranche_width: number
    needed_approvals: number
    relay_vrf_modulo_samples: number
    pvf_voting_ttl: number
    minimum_validation_upgrade_delay: number
    minimum_backing_votes: number
  },
  false
>
const stg_Configuration_PendingConfigs: StorageDescriptor<
  [],
  Array<Anonymize<If7itfec5udsb7>>,
  false
> = "es9ffs3ho1o06" as StorageDescriptor<
  [],
  Array<Anonymize<If7itfec5udsb7>>,
  false
>
const stg_Configuration_BypassConsistencyCheck: StorageDescriptor<
  [],
  boolean,
  false
> = cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_ParasShared_CurrentSessionIndex: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParasShared_ActiveValidatorIndices: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_ParasShared_ActiveValidatorKeys: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_ParasShared_AllowedRelayParents: StorageDescriptor<
  [],
  { buffer: Anonymize<Idm6djpsp7gtcm>; latest_number: number },
  false
> = "663ddds93n8hc" as StorageDescriptor<
  [],
  { buffer: Anonymize<Idm6djpsp7gtcm>; latest_number: number },
  false
>
const stg_ParaInclusion_AvailabilityBitfields: StorageDescriptor<
  [Key: number],
  { bitfield: { bytes: Uint8Array; bitsLen: number }; submitted_at: number },
  true
> = "5pj0vo2r2ljrv" as StorageDescriptor<
  [Key: number],
  { bitfield: { bytes: Uint8Array; bitsLen: number }; submitted_at: number },
  true
>
const stg_ParaInclusion_PendingAvailability: StorageDescriptor<
  [Key: number],
  {
    core: number
    hash: Binary
    descriptor: Anonymize<Ib2u20s6roco9i>
    availability_votes: { bytes: Uint8Array; bitsLen: number }
    backers: { bytes: Uint8Array; bitsLen: number }
    relay_parent_number: number
    backed_in_number: number
    backing_group: number
  },
  true
> = "fc80em05kj1cq" as StorageDescriptor<
  [Key: number],
  {
    core: number
    hash: Binary
    descriptor: Anonymize<Ib2u20s6roco9i>
    availability_votes: { bytes: Uint8Array; bitsLen: number }
    backers: { bytes: Uint8Array; bitsLen: number }
    relay_parent_number: number
    backed_in_number: number
    backing_group: number
  },
  true
>
const stg_ParaInclusion_PendingAvailabilityCommitments: StorageDescriptor<
  [Key: number],
  {
    upward_messages: Anonymize<Itom7fk49o0c9>
    horizontal_messages: Anonymize<I6r5cbv8ttrb09>
    new_validation_code: Anonymize<Iabpgqcjikia83>
    head_data: Binary
    processed_downward_messages: number
    hrmp_watermark: number
  },
  true
> = "b23qnlqop1kue" as StorageDescriptor<
  [Key: number],
  {
    upward_messages: Anonymize<Itom7fk49o0c9>
    horizontal_messages: Anonymize<I6r5cbv8ttrb09>
    new_validation_code: Anonymize<Iabpgqcjikia83>
    head_data: Binary
    processed_downward_messages: number
    hrmp_watermark: number
  },
  true
>
const stg_ParaInherent_Included: StorageDescriptor<[], undefined, true> =
  cau2fn2kb28v1i as StorageDescriptor<[], undefined, true>
const stg_ParaInherent_OnChainVotes: StorageDescriptor<
  [],
  {
    session: number
    backing_validators_per_candidate: Anonymize<Ibabtlc0psj69a>
    disputes: Anonymize<I65nq8pomrmfij>
  },
  true
> = "3qttgoifdk5v6" as StorageDescriptor<
  [],
  {
    session: number
    backing_validators_per_candidate: Anonymize<Ibabtlc0psj69a>
    disputes: Anonymize<I65nq8pomrmfij>
  },
  true
>
const stg_ParaScheduler_ValidatorGroups: StorageDescriptor<
  [],
  Array<Anonymize<Icgljjb6j82uhn>>,
  false
> = "arlj3qd8u1v13" as StorageDescriptor<
  [],
  Array<Anonymize<Icgljjb6j82uhn>>,
  false
>
const stg_ParaScheduler_AvailabilityCores: StorageDescriptor<
  [],
  Array<PolkadotPrimitivesV5CoreOccupied>,
  false
> = "n9ekmba4m5ft" as StorageDescriptor<
  [],
  Array<PolkadotPrimitivesV5CoreOccupied>,
  false
>
const stg_ParaScheduler_SessionStartBlock: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParaScheduler_ClaimQueue: StorageDescriptor<
  [],
  Array<Anonymize<Iabtbb330q3t3q>>,
  false
> = "evsccbpmuhatk" as StorageDescriptor<
  [],
  Array<Anonymize<Iabtbb330q3t3q>>,
  false
>
const stg_Paras_PvfActiveVoteMap: StorageDescriptor<
  [Key: Binary],
  {
    votes_accept: { bytes: Uint8Array; bitsLen: number }
    votes_reject: { bytes: Uint8Array; bitsLen: number }
    age: number
    created_at: number
    causes: Anonymize<Ia0a9586d8d811>
  },
  true
> = "8vn9b4il050fq" as StorageDescriptor<
  [Key: Binary],
  {
    votes_accept: { bytes: Uint8Array; bitsLen: number }
    votes_reject: { bytes: Uint8Array; bitsLen: number }
    age: number
    created_at: number
    causes: Anonymize<Ia0a9586d8d811>
  },
  true
>
const stg_Paras_PvfActiveVoteList: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_Paras_Parachains: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_Paras_ParaLifecycles: StorageDescriptor<
  [Key: number],
  ParachainsParasParaLifecycle,
  true
> = "c7oj6ac9ipmaj" as StorageDescriptor<
  [Key: number],
  ParachainsParasParaLifecycle,
  true
>
const stg_Paras_Heads: StorageDescriptor<[Key: number], Binary, true> =
  cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, true>
const stg_Paras_MostRecentContext: StorageDescriptor<
  [Key: number],
  number,
  true
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Paras_CurrentCodeHash: StorageDescriptor<
  [Key: number],
  Binary,
  true
> = cdhc577m5btfvc as StorageDescriptor<[Key: number], Binary, true>
const stg_Paras_PastCodeHash: StorageDescriptor<
  [Key: [number, number]],
  Binary,
  true
> = "7qshf3nk8rev8" as StorageDescriptor<[Key: [number, number]], Binary, true>
const stg_Paras_PastCodeMeta: StorageDescriptor<
  [Key: number],
  {
    upgrade_times: Anonymize<I2v6n2k262gqsq>
    last_pruned: Anonymize<I4arjljr6dpflb>
  },
  false
> = "e2bu7rd8isrpv" as StorageDescriptor<
  [Key: number],
  {
    upgrade_times: Anonymize<I2v6n2k262gqsq>
    last_pruned: Anonymize<I4arjljr6dpflb>
  },
  false
>
const stg_Paras_PastCodePruning: StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
> = cep4uo61810hfs as StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
>
const stg_Paras_FutureCodeUpgrades: StorageDescriptor<
  [Key: number],
  number,
  true
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Paras_FutureCodeHash: StorageDescriptor<[Key: number], Binary, true> =
  cdhc577m5btfvc as StorageDescriptor<[Key: number], Binary, true>
const stg_Paras_UpgradeGoAheadSignal: StorageDescriptor<
  [Key: number],
  PolkadotPrimitivesV5UpgradeGoAhead,
  true
> = "8herb61smtp3l" as StorageDescriptor<
  [Key: number],
  PolkadotPrimitivesV5UpgradeGoAhead,
  true
>
const stg_Paras_UpgradeRestrictionSignal: StorageDescriptor<
  [Key: number],
  PolkadotPrimitivesV5UpgradeRestriction,
  true
> = "50ao57qq5bmnu" as StorageDescriptor<
  [Key: number],
  PolkadotPrimitivesV5UpgradeRestriction,
  true
>
const stg_Paras_UpgradeCooldowns: StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
> = cep4uo61810hfs as StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
>
const stg_Paras_UpcomingUpgrades: StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
> = cep4uo61810hfs as StorageDescriptor<
  [],
  Array<Anonymize<I5g2vv0ckl2m8b>>,
  false
>
const stg_Paras_ActionsQueue: StorageDescriptor<
  [Key: number],
  Array<number>,
  false
> = c5e37esnd8etqt as StorageDescriptor<[Key: number], Array<number>, false>
const stg_Paras_UpcomingParasGenesis: StorageDescriptor<
  [Key: number],
  { genesis_head: Binary; validation_code: Binary; para_kind: boolean },
  true
> = "ga3hcc415ve2" as StorageDescriptor<
  [Key: number],
  { genesis_head: Binary; validation_code: Binary; para_kind: boolean },
  true
>
const stg_Paras_CodeByHashRefs: StorageDescriptor<
  [Key: Binary],
  number,
  false
> = ccsbuok7olbg29 as StorageDescriptor<[Key: Binary], number, false>
const stg_Paras_CodeByHash: StorageDescriptor<[Key: Binary], Binary, true> =
  "49bulag1bvk1v" as StorageDescriptor<[Key: Binary], Binary, true>
const stg_Initializer_HasInitialized: StorageDescriptor<[], undefined, true> =
  cau2fn2kb28v1i as StorageDescriptor<[], undefined, true>
const stg_Initializer_BufferedSessionChanges: StorageDescriptor<
  [],
  Array<Anonymize<I36mfku1ea0i8t>>,
  false
> = "14hoekog5s49k" as StorageDescriptor<
  [],
  Array<Anonymize<I36mfku1ea0i8t>>,
  false
>
const stg_Dmp_DownwardMessageQueues: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I60847k37jfcc6>>,
  false
> = "9bipd38l817ra" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I60847k37jfcc6>>,
  false
>
const stg_Dmp_DownwardMessageQueueHeads: StorageDescriptor<
  [Key: number],
  Binary,
  false
> = cdhc577m5btfvc as StorageDescriptor<[Key: number], Binary, false>
const stg_Dmp_DeliveryFeeFactor: StorageDescriptor<
  [Key: number],
  bigint,
  false
> = cau4oj9ee8cokk as StorageDescriptor<[Key: number], bigint, false>
const stg_Hrmp_HrmpOpenChannelRequests: StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  {
    confirmed: boolean
    _age: number
    sender_deposit: bigint
    max_message_size: number
    max_capacity: number
    max_total_size: number
  },
  true
> = "9a2ssh2u357ft" as StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  {
    confirmed: boolean
    _age: number
    sender_deposit: bigint
    max_message_size: number
    max_capacity: number
    max_total_size: number
  },
  true
>
const stg_Hrmp_HrmpOpenChannelRequestsList: StorageDescriptor<
  [],
  Array<Anonymize<I50mrcbubp554e>>,
  false
> = cd43g4eveajpkl as StorageDescriptor<
  [],
  Array<Anonymize<I50mrcbubp554e>>,
  false
>
const stg_Hrmp_HrmpOpenChannelRequestCount: StorageDescriptor<
  [Key: number],
  number,
  false
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, false>
const stg_Hrmp_HrmpAcceptedChannelRequestCount: StorageDescriptor<
  [Key: number],
  number,
  false
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, false>
const stg_Hrmp_HrmpCloseChannelRequests: StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  undefined,
  true
> = "cbol1ehll269p" as StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  undefined,
  true
>
const stg_Hrmp_HrmpCloseChannelRequestsList: StorageDescriptor<
  [],
  Array<Anonymize<I50mrcbubp554e>>,
  false
> = cd43g4eveajpkl as StorageDescriptor<
  [],
  Array<Anonymize<I50mrcbubp554e>>,
  false
>
const stg_Hrmp_HrmpWatermarks: StorageDescriptor<[Key: number], number, true> =
  c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Hrmp_HrmpChannels: StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  {
    max_capacity: number
    max_total_size: number
    max_message_size: number
    msg_count: number
    total_size: number
    mqc_head: Anonymize<I17k3ujudqd5df>
    sender_deposit: bigint
    recipient_deposit: bigint
  },
  true
> = "ei0nlfv9nobu1" as StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  {
    max_capacity: number
    max_total_size: number
    max_message_size: number
    msg_count: number
    total_size: number
    mqc_head: Anonymize<I17k3ujudqd5df>
    sender_deposit: bigint
    recipient_deposit: bigint
  },
  true
>
const stg_Hrmp_HrmpIngressChannelsIndex: StorageDescriptor<
  [Key: number],
  Array<number>,
  false
> = c5e37esnd8etqt as StorageDescriptor<[Key: number], Array<number>, false>
const stg_Hrmp_HrmpEgressChannelsIndex: StorageDescriptor<
  [Key: number],
  Array<number>,
  false
> = c5e37esnd8etqt as StorageDescriptor<[Key: number], Array<number>, false>
const stg_Hrmp_HrmpChannelContents: StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  Array<Anonymize<I409qo0sfkbh16>>,
  false
> = "8e3fv1tdp89pc" as StorageDescriptor<
  [Key: { sender: number; recipient: number }],
  Array<Anonymize<I409qo0sfkbh16>>,
  false
>
const stg_Hrmp_HrmpChannelDigests: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I8pg2rpr4ldgp9>>,
  false
> = "70nlu29lgdbpl" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I8pg2rpr4ldgp9>>,
  false
>
const stg_ParaSessionInfo_AssignmentKeysUnsafe: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_ParaSessionInfo_EarliestStoredSession: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParaSessionInfo_Sessions: StorageDescriptor<
  [Key: number],
  {
    active_validator_indices: Anonymize<Icgljjb6j82uhn>
    random_seed: Binary
    dispute_period: number
    validators: Anonymize<Idhnf6rtqoslea>
    discovery_keys: Anonymize<Idhnf6rtqoslea>
    assignment_keys: Anonymize<Idhnf6rtqoslea>
    validator_groups: Anonymize<Iarlj3qd8u1v13>
    n_cores: number
    zeroth_delay_tranche_width: number
    relay_vrf_modulo_samples: number
    n_delay_tranches: number
    no_show_slots: number
    needed_approvals: number
  },
  true
> = "8o83l0ja8v2oc" as StorageDescriptor<
  [Key: number],
  {
    active_validator_indices: Anonymize<Icgljjb6j82uhn>
    random_seed: Binary
    dispute_period: number
    validators: Anonymize<Idhnf6rtqoslea>
    discovery_keys: Anonymize<Idhnf6rtqoslea>
    assignment_keys: Anonymize<Idhnf6rtqoslea>
    validator_groups: Anonymize<Iarlj3qd8u1v13>
    n_cores: number
    zeroth_delay_tranche_width: number
    relay_vrf_modulo_samples: number
    n_delay_tranches: number
    no_show_slots: number
    needed_approvals: number
  },
  true
>
const stg_ParaSessionInfo_AccountKeys: StorageDescriptor<
  [Key: number],
  Array<SS58String>,
  true
> = "f71t9q3462n6o" as StorageDescriptor<[Key: number], Array<SS58String>, true>
const stg_ParaSessionInfo_SessionExecutorParams: StorageDescriptor<
  [Key: number],
  Array<PolkadotPrimitivesV5ExecutorParam>,
  true
> = "fm18krdf5o2ll" as StorageDescriptor<
  [Key: number],
  Array<PolkadotPrimitivesV5ExecutorParam>,
  true
>
const stg_ParasDisputes_LastPrunedSession: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_ParasDisputes_Disputes: StorageDescriptor<
  [number, Binary],
  {
    validators_for: { bytes: Uint8Array; bitsLen: number }
    validators_against: { bytes: Uint8Array; bitsLen: number }
    start: number
    concluded_at: Anonymize<I4arjljr6dpflb>
  },
  true
> = "eh9amj3lnllpd" as StorageDescriptor<
  [number, Binary],
  {
    validators_for: { bytes: Uint8Array; bitsLen: number }
    validators_against: { bytes: Uint8Array; bitsLen: number }
    start: number
    concluded_at: Anonymize<I4arjljr6dpflb>
  },
  true
>
const stg_ParasDisputes_BackersOnDisputes: StorageDescriptor<
  [number, Binary],
  Array<number>,
  true
> = "b3dj3c9mhg0i9" as StorageDescriptor<[number, Binary], Array<number>, true>
const stg_ParasDisputes_Included: StorageDescriptor<
  [number, Binary],
  number,
  true
> = "d30vab5tnappv" as StorageDescriptor<[number, Binary], number, true>
const stg_ParasDisputes_Frozen: StorageDescriptor<
  [],
  number | undefined,
  false
> = c4arjljr6dpflb as StorageDescriptor<[], number | undefined, false>
const stg_ParasSlashing_UnappliedSlashes: StorageDescriptor<
  [number, Binary],
  {
    keys: Anonymize<I93ssha9egqq23>
    kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
  },
  true
> = "c9o14aqplk52r" as StorageDescriptor<
  [number, Binary],
  {
    keys: Anonymize<I93ssha9egqq23>
    kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
  },
  true
>
const stg_ParasSlashing_ValidatorSetCounts: StorageDescriptor<
  [Key: number],
  number,
  true
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Registrar_PendingSwap: StorageDescriptor<
  [Key: number],
  number,
  true
> = c2snmki6ntodt as StorageDescriptor<[Key: number], number, true>
const stg_Registrar_Paras: StorageDescriptor<
  [Key: number],
  { manager: SS58String; deposit: bigint; locked: Anonymize<I8ie0dco0kcuq5> },
  true
> = "bb6vpfpdsttrn" as StorageDescriptor<
  [Key: number],
  { manager: SS58String; deposit: bigint; locked: Anonymize<I8ie0dco0kcuq5> },
  true
>
const stg_Registrar_NextFreeParaId: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Slots_Leases: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I92hdo1clkbp4g>>,
  false
> = "3jn2ljvqgpmg4" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I92hdo1clkbp4g>>,
  false
>
const stg_Auctions_AuctionCounter: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Auctions_AuctionInfo: StorageDescriptor<[], [number, number], true> =
  c5g2vv0ckl2m8b as StorageDescriptor<[], [number, number], true>
const stg_Auctions_ReservedAmounts: StorageDescriptor<
  [Key: [SS58String, number]],
  bigint,
  true
> = "cckspamfm7bph" as StorageDescriptor<
  [Key: [SS58String, number]],
  bigint,
  true
>
const stg_Auctions_Winning: StorageDescriptor<
  [Key: number],
  Array<Anonymize<I1qlf98109qt29>>,
  true
> = "631551otptb43" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<I1qlf98109qt29>>,
  true
>
const stg_Crowdloan_Funds: StorageDescriptor<
  [Key: number],
  {
    depositor: SS58String
    verifier: Anonymize<I8t18p6mokc3s4>
    deposit: bigint
    raised: bigint
    end: number
    cap: bigint
    last_contribution: CommonCrowdloanLastContribution
    first_period: number
    last_period: number
    fund_index: number
  },
  true
> = "72idmjf73mhcr" as StorageDescriptor<
  [Key: number],
  {
    depositor: SS58String
    verifier: Anonymize<I8t18p6mokc3s4>
    deposit: bigint
    raised: bigint
    end: number
    cap: bigint
    last_contribution: CommonCrowdloanLastContribution
    first_period: number
    last_period: number
    fund_index: number
  },
  true
>
const stg_Crowdloan_NewRaise: StorageDescriptor<
  [],
  Array<number>,
  false
> = ccgljjb6j82uhn as StorageDescriptor<[], Array<number>, false>
const stg_Crowdloan_EndingsCount: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_Crowdloan_NextFundIndex: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_XcmPallet_QueryCounter: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_XcmPallet_Queries: StorageDescriptor<
  [Key: bigint],
  XcmPalletQueryStatus,
  true
> = "aifcpen4lan73" as StorageDescriptor<
  [Key: bigint],
  XcmPalletQueryStatus,
  true
>
const stg_XcmPallet_AssetTraps: StorageDescriptor<
  [Key: Binary],
  number,
  false
> = ccsbuok7olbg29 as StorageDescriptor<[Key: Binary], number, false>
const stg_XcmPallet_SafeXcmVersion: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_XcmPallet_SupportedVersion: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  number,
  true
> = "a2prke2fv2gco" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  number,
  true
>
const stg_XcmPallet_VersionNotifiers: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  bigint,
  true
> = "b5eb0g1ji08ce" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  bigint,
  true
>
const stg_XcmPallet_VersionNotifyTargets: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  [bigint, Anonymize<I4q39t5hn830vp>, number],
  true
> = "doqdmp81cgk1" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  [bigint, Anonymize<I4q39t5hn830vp>, number],
  true
>
const stg_XcmPallet_VersionDiscoveryQueue: StorageDescriptor<
  [],
  Array<Anonymize<I2tguvlrf6n4ik>>,
  false
> = "bdqc639q3ofe0" as StorageDescriptor<
  [],
  Array<Anonymize<I2tguvlrf6n4ik>>,
  false
>
const stg_XcmPallet_CurrentMigration: StorageDescriptor<
  [],
  XcmPalletVersionMigrationStage,
  true
> = "1s1utqquuaa2b" as StorageDescriptor<
  [],
  XcmPalletVersionMigrationStage,
  true
>
const stg_XcmPallet_RemoteLockedFungibles: StorageDescriptor<
  [number, SS58String, XcmVersionedAssetId],
  {
    amount: bigint
    owner: XcmVersionedMultiLocation
    locker: XcmVersionedMultiLocation
    consumers: Anonymize<I48jka0f0ufl6q>
  },
  true
> = "454kdvlmmv6ff" as StorageDescriptor<
  [number, SS58String, XcmVersionedAssetId],
  {
    amount: bigint
    owner: XcmVersionedMultiLocation
    locker: XcmVersionedMultiLocation
    consumers: Anonymize<I48jka0f0ufl6q>
  },
  true
>
const stg_XcmPallet_LockedFungibles: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<Ifk51k72g143a3>>,
  true
> = "eq3sb8bdg5e7m" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<Ifk51k72g143a3>>,
  true
>
const stg_XcmPallet_XcmExecutionSuspended: StorageDescriptor<
  [],
  boolean,
  false
> = cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_MessageQueue_BookStateFor: StorageDescriptor<
  [Key: ParachainsInclusionAggregateMessageOrigin],
  {
    begin: number
    end: number
    count: number
    ready_neighbours: Anonymize<Iav3cdf9g9n9fp>
    message_count: bigint
    size: bigint
  },
  false
> = "34el3ro8dldbd" as StorageDescriptor<
  [Key: ParachainsInclusionAggregateMessageOrigin],
  {
    begin: number
    end: number
    count: number
    ready_neighbours: Anonymize<Iav3cdf9g9n9fp>
    message_count: bigint
    size: bigint
  },
  false
>
const stg_MessageQueue_ServiceHead: StorageDescriptor<
  [],
  ParachainsInclusionAggregateMessageOrigin,
  true
> = "6liql5oh190bt" as StorageDescriptor<
  [],
  ParachainsInclusionAggregateMessageOrigin,
  true
>
const stg_MessageQueue_Pages: StorageDescriptor<
  [ParachainsInclusionAggregateMessageOrigin, number],
  {
    remaining: number
    remaining_size: number
    first_index: number
    first: number
    last: number
    heap: Binary
  },
  true
> = "2dosj31r13pfm" as StorageDescriptor<
  [ParachainsInclusionAggregateMessageOrigin, number],
  {
    remaining: number
    remaining_size: number
    first_index: number
    first: number
    last: number
    heap: Binary
  },
  true
>
const stg_AssetRate_ConversionRateToNative: StorageDescriptor<
  [Key: Anonymize<AnonymousEnum<{ V3: Anonymize<I30in122a9nnlb> }>>],
  bigint,
  true
> = "3sm4don8otma9" as StorageDescriptor<
  [Key: Anonymize<AnonymousEnum<{ V3: Anonymize<I30in122a9nnlb> }>>],
  bigint,
  true
>
const stg_Beefy_Authorities: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = ce5mvl0hn85mkc as StorageDescriptor<[], Array<Binary>, false>
const stg_Beefy_ValidatorSetId: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Beefy_NextAuthorities: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = ce5mvl0hn85mkc as StorageDescriptor<[], Array<Binary>, false>
const stg_Beefy_SetIdSession: StorageDescriptor<[Key: bigint], number, true> =
  c3u1nuj99f15hf as StorageDescriptor<[Key: bigint], number, true>
const stg_Beefy_GenesisBlock: StorageDescriptor<[], number | undefined, false> =
  c4arjljr6dpflb as StorageDescriptor<[], number | undefined, false>
const stg_Mmr_RootHash: StorageDescriptor<[], Binary, false> =
  c7i24fvhamijd as StorageDescriptor<[], Binary, false>
const stg_Mmr_NumberOfLeaves: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Mmr_Nodes: StorageDescriptor<[Key: bigint], Binary, true> =
  "d7pvv0lg5qu1i" as StorageDescriptor<[Key: bigint], Binary, true>
const stg_BeefyMmrLeaf_BeefyAuthorities: StorageDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary },
  false
> = c3qm5u05tioq05 as StorageDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary },
  false
>
const stg_BeefyMmrLeaf_BeefyNextAuthorities: StorageDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary },
  false
> = c3qm5u05tioq05 as StorageDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary },
  false
>
const call_System_remark: TxDescriptor<{ remark: Binary }> =
  c8ofcg5rbj0g2c as TxDescriptor<{ remark: Binary }>
const call_System_set_heap_pages: TxDescriptor<{ pages: bigint }> =
  "4adgbll7gku4i" as TxDescriptor<{ pages: bigint }>
const call_System_set_code: TxDescriptor<{ code: Binary }> =
  c6pjjpfvhvcfru as TxDescriptor<{ code: Binary }>
const call_System_set_code_without_checks: TxDescriptor<{ code: Binary }> =
  c6pjjpfvhvcfru as TxDescriptor<{ code: Binary }>
const call_System_set_storage: TxDescriptor<{
  items: Anonymize<I5g1ftt6bt65bl>
}> = "8qrhskdehbu57" as TxDescriptor<{ items: Anonymize<I5g1ftt6bt65bl> }>
const call_System_kill_storage: TxDescriptor<{
  keys: Anonymize<Itom7fk49o0c9>
}> = "39uah9nss64h9" as TxDescriptor<{ keys: Anonymize<Itom7fk49o0c9> }>
const call_System_kill_prefix: TxDescriptor<{
  prefix: Binary
  subkeys: number
}> = "k64dknsq7k08" as TxDescriptor<{ prefix: Binary; subkeys: number }>
const call_System_remark_with_event: TxDescriptor<{ remark: Binary }> =
  c8ofcg5rbj0g2c as TxDescriptor<{ remark: Binary }>
const call_Scheduler_schedule: TxDescriptor<{
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}> = "3qt1iclgnlpc3" as TxDescriptor<{
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Scheduler_cancel: TxDescriptor<{ when: number; index: number }> =
  c5n4sebgkfr760 as TxDescriptor<{ when: number; index: number }>
const call_Scheduler_schedule_named: TxDescriptor<{
  id: Binary
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}> = "e7cb775si1ku8" as TxDescriptor<{
  id: Binary
  when: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Scheduler_cancel_named: TxDescriptor<{ id: Binary }> =
  "dsdstalforb09" as TxDescriptor<{ id: Binary }>
const call_Scheduler_schedule_after: TxDescriptor<{
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}> = "6rb3dbq8mv545" as TxDescriptor<{
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Scheduler_schedule_named_after: TxDescriptor<{
  id: Binary
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}> = "90bto8860mivd" as TxDescriptor<{
  id: Binary
  after: number
  maybe_periodic: Anonymize<I34gtdjipdmjpt>
  priority: number
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Preimage_note_preimage: TxDescriptor<{ bytes: Binary }> =
  "82nfqfkd48n10" as TxDescriptor<{ bytes: Binary }>
const call_Preimage_unnote_preimage: TxDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as TxDescriptor<{ hash: Binary }>
const call_Preimage_request_preimage: TxDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as TxDescriptor<{ hash: Binary }>
const call_Preimage_unrequest_preimage: TxDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as TxDescriptor<{ hash: Binary }>
const call_Preimage_ensure_updated: TxDescriptor<{
  hashes: Anonymize<Idhnf6rtqoslea>
}> = "daor7tajt0l3k" as TxDescriptor<{ hashes: Anonymize<Idhnf6rtqoslea> }>
const call_Babe_report_equivocation: TxDescriptor<{
  equivocation_proof: Anonymize<I7bek4s9acs8nl>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c7mmbgd20nut80 as TxDescriptor<{
  equivocation_proof: Anonymize<I7bek4s9acs8nl>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Babe_report_equivocation_unsigned: TxDescriptor<{
  equivocation_proof: Anonymize<I7bek4s9acs8nl>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c7mmbgd20nut80 as TxDescriptor<{
  equivocation_proof: Anonymize<I7bek4s9acs8nl>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Babe_plan_config_change: TxDescriptor<{
  config: BabeDigestsNextConfigDescriptor
}> = "2dcpbss9027dl" as TxDescriptor<{
  config: BabeDigestsNextConfigDescriptor
}>
const call_Timestamp_set: TxDescriptor<{ now: bigint }> =
  "dcr6u6361oad9" as TxDescriptor<{ now: bigint }>
const call_Indices_claim: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Indices_transfer: TxDescriptor<{
  index: number
  new: MultiAddress
}> = cdge7gk9m5car0 as TxDescriptor<{ index: number; new: MultiAddress }>
const call_Indices_free: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Indices_force_transfer: TxDescriptor<{
  new: MultiAddress
  index: number
  freeze: boolean
}> = "34pbimt2i69v7" as TxDescriptor<{
  new: MultiAddress
  index: number
  freeze: boolean
}>
const call_Indices_freeze: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Balances_transfer_allow_death: TxDescriptor<{
  dest: MultiAddress
  value: bigint
}> = cen6q0lasi0m7i as TxDescriptor<{ dest: MultiAddress; value: bigint }>
const call_Balances_force_transfer: TxDescriptor<{
  source: MultiAddress
  dest: MultiAddress
  value: bigint
}> = "cacgruoo9j3r2" as TxDescriptor<{
  source: MultiAddress
  dest: MultiAddress
  value: bigint
}>
const call_Balances_transfer_keep_alive: TxDescriptor<{
  dest: MultiAddress
  value: bigint
}> = cen6q0lasi0m7i as TxDescriptor<{ dest: MultiAddress; value: bigint }>
const call_Balances_transfer_all: TxDescriptor<{
  dest: MultiAddress
  keep_alive: boolean
}> = "7dgmo7im9hljo" as TxDescriptor<{
  dest: MultiAddress
  keep_alive: boolean
}>
const call_Balances_force_unreserve: TxDescriptor<{
  who: MultiAddress
  amount: bigint
}> = "argojp1sv9icj" as TxDescriptor<{ who: MultiAddress; amount: bigint }>
const call_Balances_upgrade_accounts: TxDescriptor<{
  who: Anonymize<Ia2lhg7l2hilo3>
}> = "bmr18suc9ikh9" as TxDescriptor<{ who: Anonymize<Ia2lhg7l2hilo3> }>
const call_Balances_force_set_balance: TxDescriptor<{
  who: MultiAddress
  new_free: bigint
}> = "e0io91hk7pejj" as TxDescriptor<{ who: MultiAddress; new_free: bigint }>
const call_Staking_bond: TxDescriptor<{
  value: bigint
  payee: StakingRewardDestination
}> = "9f7ms9viml8of" as TxDescriptor<{
  value: bigint
  payee: StakingRewardDestination
}>
const call_Staking_bond_extra: TxDescriptor<{ max_additional: bigint }> =
  "564va64vtidbq" as TxDescriptor<{ max_additional: bigint }>
const call_Staking_unbond: TxDescriptor<{ value: bigint }> =
  ce5v6njpckr05b as TxDescriptor<{ value: bigint }>
const call_Staking_withdraw_unbonded: TxDescriptor<{
  num_slashing_spans: number
}> = "328av3j0bgmjb" as TxDescriptor<{ num_slashing_spans: number }>
const call_Staking_validate: TxDescriptor<{
  prefs: Anonymize<I9o7ssi9vmhmgr>
}> = "4tuqm9ato907i" as TxDescriptor<{ prefs: Anonymize<I9o7ssi9vmhmgr> }>
const call_Staking_nominate: TxDescriptor<{
  targets: Anonymize<I65ih42boctoq4>
}> = "5n9nf1mhg26dt" as TxDescriptor<{ targets: Anonymize<I65ih42boctoq4> }>
const call_Staking_chill: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Staking_set_payee: TxDescriptor<{
  payee: StakingRewardDestination
}> = "da5hg7geddnc7" as TxDescriptor<{ payee: StakingRewardDestination }>
const call_Staking_set_controller: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Staking_set_validator_count: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Staking_increase_validator_count: TxDescriptor<{
  additional: number
}> = "fhs60omlhvt3" as TxDescriptor<{ additional: number }>
const call_Staking_scale_validator_count: TxDescriptor<{ factor: number }> =
  "f34udpd5e57vi" as TxDescriptor<{ factor: number }>
const call_Staking_force_no_eras: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Staking_force_new_era: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Staking_set_invulnerables: TxDescriptor<{
  invulnerables: Anonymize<Ia2lhg7l2hilo3>
}> = "39t01nnod9109" as TxDescriptor<{
  invulnerables: Anonymize<Ia2lhg7l2hilo3>
}>
const call_Staking_force_unstake: TxDescriptor<{
  stash: SS58String
  num_slashing_spans: number
}> = ce5vbnd9198quk as TxDescriptor<{
  stash: SS58String
  num_slashing_spans: number
}>
const call_Staking_force_new_era_always: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Staking_cancel_deferred_slash: TxDescriptor<{
  era: number
  slash_indices: Anonymize<Icgljjb6j82uhn>
}> = "3h6murn8bd4v5" as TxDescriptor<{
  era: number
  slash_indices: Anonymize<Icgljjb6j82uhn>
}>
const call_Staking_payout_stakers: TxDescriptor<{
  validator_stash: SS58String
  era: number
}> = "6k6jf8ncesuu3" as TxDescriptor<{
  validator_stash: SS58String
  era: number
}>
const call_Staking_rebond: TxDescriptor<{ value: bigint }> =
  ce5v6njpckr05b as TxDescriptor<{ value: bigint }>
const call_Staking_reap_stash: TxDescriptor<{
  stash: SS58String
  num_slashing_spans: number
}> = ce5vbnd9198quk as TxDescriptor<{
  stash: SS58String
  num_slashing_spans: number
}>
const call_Staking_kick: TxDescriptor<{ who: Anonymize<I65ih42boctoq4> }> =
  "2j5nkj9u94qun" as TxDescriptor<{ who: Anonymize<I65ih42boctoq4> }>
const call_Staking_set_staking_configs: TxDescriptor<{
  min_nominator_bond: StakingPalletConfigOp
  min_validator_bond: StakingPalletConfigOp
  max_nominator_count: StakingPalletConfigOp1
  max_validator_count: StakingPalletConfigOp1
  chill_threshold: StakingPalletConfigOp1
  min_commission: StakingPalletConfigOp1
}> = "9nfsuc9smbmvv" as TxDescriptor<{
  min_nominator_bond: StakingPalletConfigOp
  min_validator_bond: StakingPalletConfigOp
  max_nominator_count: StakingPalletConfigOp1
  max_validator_count: StakingPalletConfigOp1
  chill_threshold: StakingPalletConfigOp1
  min_commission: StakingPalletConfigOp1
}>
const call_Staking_chill_other: TxDescriptor<{ controller: SS58String }> =
  "3v6ks33uluhnj" as TxDescriptor<{ controller: SS58String }>
const call_Staking_force_apply_min_commission: TxDescriptor<{
  validator_stash: SS58String
}> = "5ont0141q9ss5" as TxDescriptor<{ validator_stash: SS58String }>
const call_Staking_set_min_commission: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Session_set_keys: TxDescriptor<{
  keys: Anonymize<I4g61cdhi06s1m>
  proof: Binary
}> = "fu2fv3jk8vbos" as TxDescriptor<{
  keys: Anonymize<I4g61cdhi06s1m>
  proof: Binary
}>
const call_Session_purge_keys: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Grandpa_report_equivocation: TxDescriptor<{
  equivocation_proof: Anonymize<I95fr9lj1pb8v8>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c4kjek1q6rj24q as TxDescriptor<{
  equivocation_proof: Anonymize<I95fr9lj1pb8v8>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Grandpa_report_equivocation_unsigned: TxDescriptor<{
  equivocation_proof: Anonymize<I95fr9lj1pb8v8>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c4kjek1q6rj24q as TxDescriptor<{
  equivocation_proof: Anonymize<I95fr9lj1pb8v8>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Grandpa_note_stalled: TxDescriptor<{
  delay: number
  best_finalized_block_number: number
}> = "2hviml3snvhhn" as TxDescriptor<{
  delay: number
  best_finalized_block_number: number
}>
const call_ImOnline_heartbeat: TxDescriptor<{
  heartbeat: Anonymize<I7a9s2tcf2ejdv>
  signature: Binary
}> = "fgbq9oil78ogk" as TxDescriptor<{
  heartbeat: Anonymize<I7a9s2tcf2ejdv>
  signature: Binary
}>
const call_Treasury_propose_spend: TxDescriptor<{
  value: bigint
  beneficiary: MultiAddress
}> = "5c883qnnqciv8" as TxDescriptor<{
  value: bigint
  beneficiary: MultiAddress
}>
const call_Treasury_reject_proposal: TxDescriptor<{ proposal_id: number }> =
  ccm9m0qeemu66d as TxDescriptor<{ proposal_id: number }>
const call_Treasury_approve_proposal: TxDescriptor<{ proposal_id: number }> =
  ccm9m0qeemu66d as TxDescriptor<{ proposal_id: number }>
const call_Treasury_spend_local: TxDescriptor<{
  amount: bigint
  beneficiary: MultiAddress
}> = "dpn74s0i9cdvp" as TxDescriptor<{
  amount: bigint
  beneficiary: MultiAddress
}>
const call_Treasury_remove_approval: TxDescriptor<{ proposal_id: number }> =
  ccm9m0qeemu66d as TxDescriptor<{ proposal_id: number }>
const call_Treasury_spend: TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: Anonymize<I4arjljr6dpflb>
}> = "815t7ta25e227" as TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: Anonymize<I4arjljr6dpflb>
}>
const call_Treasury_payout: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Treasury_check_status: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Treasury_void_spend: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_ConvictionVoting_vote: TxDescriptor<{
  poll_index: number
  vote: ConvictionVotingVoteAccountVote
}> = "dnsr2pndm36h0" as TxDescriptor<{
  poll_index: number
  vote: ConvictionVotingVoteAccountVote
}>
const call_ConvictionVoting_delegate: TxDescriptor<{
  class: number
  to: MultiAddress
  conviction: VotingConviction
  balance: bigint
}> = "d7ut33dljf52c" as TxDescriptor<{
  class: number
  to: MultiAddress
  conviction: VotingConviction
  balance: bigint
}>
const call_ConvictionVoting_undelegate: TxDescriptor<{ class: number }> =
  "8steo882k7qns" as TxDescriptor<{ class: number }>
const call_ConvictionVoting_unlock: TxDescriptor<{
  class: number
  target: MultiAddress
}> = "1vc8h4t228bot" as TxDescriptor<{ class: number; target: MultiAddress }>
const call_ConvictionVoting_remove_vote: TxDescriptor<{
  class: Anonymize<I4arjljr6dpflb>
  index: number
}> = "5f178ab6b89t3" as TxDescriptor<{
  class: Anonymize<I4arjljr6dpflb>
  index: number
}>
const call_ConvictionVoting_remove_other_vote: TxDescriptor<{
  target: MultiAddress
  class: number
  index: number
}> = "5fak1u82ohqtm" as TxDescriptor<{
  target: MultiAddress
  class: number
  index: number
}>
const call_Referenda_submit: TxDescriptor<{
  proposal_origin: PolkadotRuntimeOriginCaller
  proposal: PreimagesBounded
  enactment_moment: TraitsScheduleDispatchTime
}> = "86t0cca08a1h1" as TxDescriptor<{
  proposal_origin: PolkadotRuntimeOriginCaller
  proposal: PreimagesBounded
  enactment_moment: TraitsScheduleDispatchTime
}>
const call_Referenda_place_decision_deposit: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_refund_decision_deposit: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_cancel: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_kill: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_nudge_referendum: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_one_fewer_deciding: TxDescriptor<{ track: number }> =
  "cbio0e1f0034b" as TxDescriptor<{ track: number }>
const call_Referenda_refund_submission_deposit: TxDescriptor<{
  index: number
}> = c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Referenda_set_metadata: TxDescriptor<{
  index: number
  maybe_hash: Anonymize<I17k3ujudqd5df>
}> = "fml0k0sf0mu2g" as TxDescriptor<{
  index: number
  maybe_hash: Anonymize<I17k3ujudqd5df>
}>
const call_Whitelist_whitelist_call: TxDescriptor<{ call_hash: Binary }> =
  c8413rb6im3iko as TxDescriptor<{ call_hash: Binary }>
const call_Whitelist_remove_whitelisted_call: TxDescriptor<{
  call_hash: Binary
}> = c8413rb6im3iko as TxDescriptor<{ call_hash: Binary }>
const call_Whitelist_dispatch_whitelisted_call: TxDescriptor<{
  call_hash: Binary
  call_encoded_len: number
  call_weight_witness: Anonymize<I4q39t5hn830vp>
}> = "d3s9pakjjc472" as TxDescriptor<{
  call_hash: Binary
  call_encoded_len: number
  call_weight_witness: Anonymize<I4q39t5hn830vp>
}>
const call_Whitelist_dispatch_whitelisted_call_with_preimage: TxDescriptor<{
  call: Anonymize<I8e6un4uk1q07c>
}> = "df7eras2rn4rj" as TxDescriptor<{ call: Anonymize<I8e6un4uk1q07c> }>
const call_Claims_claim: TxDescriptor<{
  dest: SS58String
  ethereum_signature: Binary
}> = "1u3s4gbjnre15" as TxDescriptor<{
  dest: SS58String
  ethereum_signature: Binary
}>
const call_Claims_mint_claim: TxDescriptor<{
  who: Binary
  value: bigint
  vesting_schedule: Anonymize<I70kqehrkegc98>
  statement: Anonymize<I6rcr4im2g3gv9>
}> = "20qiajmn4c5d4" as TxDescriptor<{
  who: Binary
  value: bigint
  vesting_schedule: Anonymize<I70kqehrkegc98>
  statement: Anonymize<I6rcr4im2g3gv9>
}>
const call_Claims_claim_attest: TxDescriptor<{
  dest: SS58String
  ethereum_signature: Binary
  statement: Binary
}> = "e3aplba76d794" as TxDescriptor<{
  dest: SS58String
  ethereum_signature: Binary
  statement: Binary
}>
const call_Claims_attest: TxDescriptor<{ statement: Binary }> =
  "1ntko0oih7v1a" as TxDescriptor<{ statement: Binary }>
const call_Claims_move_claim: TxDescriptor<{
  old: Binary
  new: Binary
  maybe_preclaim: Anonymize<Ihfphjolmsqq1>
}> = "193pigt6gtjff" as TxDescriptor<{
  old: Binary
  new: Binary
  maybe_preclaim: Anonymize<Ihfphjolmsqq1>
}>
const call_Vesting_vest: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Vesting_vest_other: TxDescriptor<{ target: MultiAddress }> =
  c29er5j74l8bu as TxDescriptor<{ target: MultiAddress }>
const call_Vesting_vested_transfer: TxDescriptor<{
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}> = "9l9kkok4o3ekh" as TxDescriptor<{
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}>
const call_Vesting_force_vested_transfer: TxDescriptor<{
  source: MultiAddress
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}> = "50ve0bbda0j1r" as TxDescriptor<{
  source: MultiAddress
  target: MultiAddress
  schedule: Anonymize<I4aro1m78pdrtt>
}>
const call_Vesting_merge_schedules: TxDescriptor<{
  schedule1_index: number
  schedule2_index: number
}> = "ct9ivhr2c5hv0" as TxDescriptor<{
  schedule1_index: number
  schedule2_index: number
}>
const call_Utility_batch: TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }> =
  cd8ilk50mukg0o as TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>
const call_Utility_as_derivative: TxDescriptor<{
  index: number
  call: Anonymize<I8e6un4uk1q07c>
}> = "e36meht90lrma" as TxDescriptor<{
  index: number
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Utility_batch_all: TxDescriptor<{
  calls: Anonymize<I1bfn7sbvfvk3t>
}> = cd8ilk50mukg0o as TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>
const call_Utility_dispatch_as: TxDescriptor<{
  as_origin: PolkadotRuntimeOriginCaller
  call: Anonymize<I8e6un4uk1q07c>
}> = "bb7qiar2nh5rh" as TxDescriptor<{
  as_origin: PolkadotRuntimeOriginCaller
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Utility_force_batch: TxDescriptor<{
  calls: Anonymize<I1bfn7sbvfvk3t>
}> = cd8ilk50mukg0o as TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>
const call_Utility_with_weight: TxDescriptor<{
  call: Anonymize<I8e6un4uk1q07c>
  weight: Anonymize<I4q39t5hn830vp>
}> = "6c37kkkbmesra" as TxDescriptor<{
  call: Anonymize<I8e6un4uk1q07c>
  weight: Anonymize<I4q39t5hn830vp>
}>
const call_Identity_add_registrar: TxDescriptor<{ account: MultiAddress }> =
  "bsu2pfvipmui6" as TxDescriptor<{ account: MultiAddress }>
const call_Identity_set_identity: TxDescriptor<{
  info: Anonymize<I939m6d6t3dsgm>
}> = "621gpns74tp1f" as TxDescriptor<{ info: Anonymize<I939m6d6t3dsgm> }>
const call_Identity_set_subs: TxDescriptor<{
  subs: Anonymize<I47e5e4dh41s5v>
}> = "5100vdjbepcoj" as TxDescriptor<{ subs: Anonymize<I47e5e4dh41s5v> }>
const call_Identity_clear_identity: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Identity_request_judgement: TxDescriptor<{
  reg_index: number
  max_fee: bigint
}> = "9l2s4klu0831o" as TxDescriptor<{ reg_index: number; max_fee: bigint }>
const call_Identity_cancel_request: TxDescriptor<{ reg_index: number }> =
  "2ctrt5nqb8o7c" as TxDescriptor<{ reg_index: number }>
const call_Identity_set_fee: TxDescriptor<{ index: number; fee: bigint }> =
  "711qahikocb1c" as TxDescriptor<{ index: number; fee: bigint }>
const call_Identity_set_account_id: TxDescriptor<{
  index: number
  new: MultiAddress
}> = cdge7gk9m5car0 as TxDescriptor<{ index: number; new: MultiAddress }>
const call_Identity_set_fields: TxDescriptor<{
  index: number
  fields: bigint
}> = "d6gojh30v9ib2" as TxDescriptor<{ index: number; fields: bigint }>
const call_Identity_provide_judgement: TxDescriptor<{
  reg_index: number
  target: MultiAddress
  judgement: IdentityJudgement
  identity: Binary
}> = "2g5s5rvm0mfuf" as TxDescriptor<{
  reg_index: number
  target: MultiAddress
  judgement: IdentityJudgement
  identity: Binary
}>
const call_Identity_kill_identity: TxDescriptor<{ target: MultiAddress }> =
  c29er5j74l8bu as TxDescriptor<{ target: MultiAddress }>
const call_Identity_add_sub: TxDescriptor<{
  sub: MultiAddress
  data: IdentityTypesData
}> = cclf5v4qsadc12 as TxDescriptor<{
  sub: MultiAddress
  data: IdentityTypesData
}>
const call_Identity_rename_sub: TxDescriptor<{
  sub: MultiAddress
  data: IdentityTypesData
}> = cclf5v4qsadc12 as TxDescriptor<{
  sub: MultiAddress
  data: IdentityTypesData
}>
const call_Identity_remove_sub: TxDescriptor<{ sub: MultiAddress }> =
  "fcc5t6ed1elfd" as TxDescriptor<{ sub: MultiAddress }>
const call_Identity_quit_sub: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Proxy_proxy: TxDescriptor<{
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}> = "55q6ritdd2v83" as TxDescriptor<{
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Proxy_add_proxy: TxDescriptor<{
  delegate: MultiAddress
  proxy_type: ProxyType
  delay: number
}> = caaog12m0bl04j as TxDescriptor<{
  delegate: MultiAddress
  proxy_type: ProxyType
  delay: number
}>
const call_Proxy_remove_proxy: TxDescriptor<{
  delegate: MultiAddress
  proxy_type: ProxyType
  delay: number
}> = caaog12m0bl04j as TxDescriptor<{
  delegate: MultiAddress
  proxy_type: ProxyType
  delay: number
}>
const call_Proxy_remove_proxies: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Proxy_create_pure: TxDescriptor<{
  proxy_type: ProxyType
  delay: number
  index: number
}> = "6l2ag419uso4i" as TxDescriptor<{
  proxy_type: ProxyType
  delay: number
  index: number
}>
const call_Proxy_kill_pure: TxDescriptor<{
  spawner: MultiAddress
  proxy_type: ProxyType
  index: number
  height: number
  ext_index: number
}> = "7304brn0jssvr" as TxDescriptor<{
  spawner: MultiAddress
  proxy_type: ProxyType
  index: number
  height: number
  ext_index: number
}>
const call_Proxy_announce: TxDescriptor<{
  real: MultiAddress
  call_hash: Binary
}> = cd3bpmvju2iqi5 as TxDescriptor<{ real: MultiAddress; call_hash: Binary }>
const call_Proxy_remove_announcement: TxDescriptor<{
  real: MultiAddress
  call_hash: Binary
}> = cd3bpmvju2iqi5 as TxDescriptor<{ real: MultiAddress; call_hash: Binary }>
const call_Proxy_reject_announcement: TxDescriptor<{
  delegate: MultiAddress
  call_hash: Binary
}> = "etdab69eu3c4e" as TxDescriptor<{
  delegate: MultiAddress
  call_hash: Binary
}>
const call_Proxy_proxy_announced: TxDescriptor<{
  delegate: MultiAddress
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}> = "c91pvvaf9eh9k" as TxDescriptor<{
  delegate: MultiAddress
  real: MultiAddress
  force_proxy_type: Anonymize<Idrnto663vhd97>
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Multisig_as_multi_threshold_1: TxDescriptor<{
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I8e6un4uk1q07c>
}> = "9qeq6jurh88f2" as TxDescriptor<{
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I8e6un4uk1q07c>
}>
const call_Multisig_as_multi: TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I8e6un4uk1q07c>
  max_weight: Anonymize<I4q39t5hn830vp>
}> = "8aql6ho3v5akd" as TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I8e6un4uk1q07c>
  max_weight: Anonymize<I4q39t5hn830vp>
}>
const call_Multisig_approve_as_multi: TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call_hash: Binary
  max_weight: Anonymize<I4q39t5hn830vp>
}> = "349bg0i7n8ohu" as TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call_hash: Binary
  max_weight: Anonymize<I4q39t5hn830vp>
}>
const call_Multisig_cancel_as_multi: TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  timepoint: Anonymize<Itvprrpb0nm3o>
  call_hash: Binary
}> = "8plicv234mqe5" as TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  timepoint: Anonymize<Itvprrpb0nm3o>
  call_hash: Binary
}>
const call_Bounties_propose_bounty: TxDescriptor<{
  value: bigint
  description: Binary
}> = "2a839vbf5817q" as TxDescriptor<{ value: bigint; description: Binary }>
const call_Bounties_approve_bounty: TxDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as TxDescriptor<{ bounty_id: number }>
const call_Bounties_propose_curator: TxDescriptor<{
  bounty_id: number
  curator: MultiAddress
  fee: bigint
}> = "86gbm3avnuhcj" as TxDescriptor<{
  bounty_id: number
  curator: MultiAddress
  fee: bigint
}>
const call_Bounties_unassign_curator: TxDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as TxDescriptor<{ bounty_id: number }>
const call_Bounties_accept_curator: TxDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as TxDescriptor<{ bounty_id: number }>
const call_Bounties_award_bounty: TxDescriptor<{
  bounty_id: number
  beneficiary: MultiAddress
}> = "9khudebied2et" as TxDescriptor<{
  bounty_id: number
  beneficiary: MultiAddress
}>
const call_Bounties_claim_bounty: TxDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as TxDescriptor<{ bounty_id: number }>
const call_Bounties_close_bounty: TxDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as TxDescriptor<{ bounty_id: number }>
const call_Bounties_extend_bounty_expiry: TxDescriptor<{
  bounty_id: number
  remark: Binary
}> = "90n6nnkpdahrh" as TxDescriptor<{ bounty_id: number; remark: Binary }>
const call_ChildBounties_add_child_bounty: TxDescriptor<{
  parent_bounty_id: number
  value: bigint
  description: Binary
}> = "8mk5kjgn02hi8" as TxDescriptor<{
  parent_bounty_id: number
  value: bigint
  description: Binary
}>
const call_ChildBounties_propose_curator: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
  curator: MultiAddress
  fee: bigint
}> = "113qogfj9ii7a" as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
  curator: MultiAddress
  fee: bigint
}>
const call_ChildBounties_accept_curator: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}> = c2gr10p66od9ch as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}>
const call_ChildBounties_unassign_curator: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}> = c2gr10p66od9ch as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}>
const call_ChildBounties_award_child_bounty: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
  beneficiary: MultiAddress
}> = "6okbrc1o6b331" as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
  beneficiary: MultiAddress
}>
const call_ChildBounties_claim_child_bounty: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}> = c2gr10p66od9ch as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}>
const call_ChildBounties_close_child_bounty: TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}> = c2gr10p66od9ch as TxDescriptor<{
  parent_bounty_id: number
  child_bounty_id: number
}>
const call_ElectionProviderMultiPhase_submit_unsigned: TxDescriptor<{
  raw_solution: Anonymize<I7je4n92ump862>
  witness: Anonymize<Iasd2iat48n080>
}> = "31k9f0jol8ko4" as TxDescriptor<{
  raw_solution: Anonymize<I7je4n92ump862>
  witness: Anonymize<Iasd2iat48n080>
}>
const call_ElectionProviderMultiPhase_set_minimum_untrusted_score: TxDescriptor<{
  maybe_next_score: Anonymize<Iaebc5kcl654ln>
}> = "80q14um2s2ckg" as TxDescriptor<{
  maybe_next_score: Anonymize<Iaebc5kcl654ln>
}>
const call_ElectionProviderMultiPhase_set_emergency_election_result: TxDescriptor<{
  supports: Anonymize<I4bboqsv44evel>
}> = "5qs1t1erfi7u8" as TxDescriptor<{ supports: Anonymize<I4bboqsv44evel> }>
const call_ElectionProviderMultiPhase_submit: TxDescriptor<{
  raw_solution: Anonymize<I7je4n92ump862>
}> = "9et13knvdvgpb" as TxDescriptor<{
  raw_solution: Anonymize<I7je4n92ump862>
}>
const call_ElectionProviderMultiPhase_governance_fallback: TxDescriptor<{
  maybe_max_voters: Anonymize<I4arjljr6dpflb>
  maybe_max_targets: Anonymize<I4arjljr6dpflb>
}> = "fsme8miqq9006" as TxDescriptor<{
  maybe_max_voters: Anonymize<I4arjljr6dpflb>
  maybe_max_targets: Anonymize<I4arjljr6dpflb>
}>
const call_VoterList_rebag: TxDescriptor<{ dislocated: MultiAddress }> =
  "qk00vc9d6173" as TxDescriptor<{ dislocated: MultiAddress }>
const call_VoterList_put_in_front_of: TxDescriptor<{ lighter: MultiAddress }> =
  "dg844jjtqnc9b" as TxDescriptor<{ lighter: MultiAddress }>
const call_VoterList_put_in_front_of_other: TxDescriptor<{
  heavier: MultiAddress
  lighter: MultiAddress
}> = "c87kbtabpr82b" as TxDescriptor<{
  heavier: MultiAddress
  lighter: MultiAddress
}>
const call_NominationPools_join: TxDescriptor<{
  amount: bigint
  pool_id: number
}> = ceg1oc56mamrl5 as TxDescriptor<{ amount: bigint; pool_id: number }>
const call_NominationPools_bond_extra: TxDescriptor<{
  extra: NominationPoolsBondExtra
}> = "fi2b6p41bfb97" as TxDescriptor<{ extra: NominationPoolsBondExtra }>
const call_NominationPools_claim_payout: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_NominationPools_unbond: TxDescriptor<{
  member_account: MultiAddress
  unbonding_points: bigint
}> = "tveli0chegtk" as TxDescriptor<{
  member_account: MultiAddress
  unbonding_points: bigint
}>
const call_NominationPools_pool_withdraw_unbonded: TxDescriptor<{
  pool_id: number
  num_slashing_spans: number
}> = "36uoc8t9liv80" as TxDescriptor<{
  pool_id: number
  num_slashing_spans: number
}>
const call_NominationPools_withdraw_unbonded: TxDescriptor<{
  member_account: MultiAddress
  num_slashing_spans: number
}> = "1u21ookp1djj3" as TxDescriptor<{
  member_account: MultiAddress
  num_slashing_spans: number
}>
const call_NominationPools_create: TxDescriptor<{
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
}> = "f5k9orpn9fi43" as TxDescriptor<{
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
}>
const call_NominationPools_create_with_pool_id: TxDescriptor<{
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
  pool_id: number
}> = "1hlpf8ergrg8k" as TxDescriptor<{
  amount: bigint
  root: MultiAddress
  nominator: MultiAddress
  bouncer: MultiAddress
  pool_id: number
}>
const call_NominationPools_nominate: TxDescriptor<{
  pool_id: number
  validators: Anonymize<Ia2lhg7l2hilo3>
}> = "47a2tsd2o2b1c" as TxDescriptor<{
  pool_id: number
  validators: Anonymize<Ia2lhg7l2hilo3>
}>
const call_NominationPools_set_state: TxDescriptor<{
  pool_id: number
  state: NominationPoolsPoolState
}> = "bat0jog71khv5" as TxDescriptor<{
  pool_id: number
  state: NominationPoolsPoolState
}>
const call_NominationPools_set_metadata: TxDescriptor<{
  pool_id: number
  metadata: Binary
}> = "4ihj26hl75e5p" as TxDescriptor<{ pool_id: number; metadata: Binary }>
const call_NominationPools_set_configs: TxDescriptor<{
  min_join_bond: StakingPalletConfigOp
  min_create_bond: StakingPalletConfigOp
  max_pools: StakingPalletConfigOp1
  max_members: StakingPalletConfigOp1
  max_members_per_pool: StakingPalletConfigOp1
  global_max_commission: StakingPalletConfigOp1
}> = "2rqmn40aam5hg" as TxDescriptor<{
  min_join_bond: StakingPalletConfigOp
  min_create_bond: StakingPalletConfigOp
  max_pools: StakingPalletConfigOp1
  max_members: StakingPalletConfigOp1
  max_members_per_pool: StakingPalletConfigOp1
  global_max_commission: StakingPalletConfigOp1
}>
const call_NominationPools_update_roles: TxDescriptor<{
  pool_id: number
  new_root: NominationPoolsConfigOp
  new_nominator: NominationPoolsConfigOp
  new_bouncer: NominationPoolsConfigOp
}> = "3cvu4kn8n81uv" as TxDescriptor<{
  pool_id: number
  new_root: NominationPoolsConfigOp
  new_nominator: NominationPoolsConfigOp
  new_bouncer: NominationPoolsConfigOp
}>
const call_NominationPools_chill: TxDescriptor<{ pool_id: number }> =
  c931cottvong90 as TxDescriptor<{ pool_id: number }>
const call_NominationPools_bond_extra_other: TxDescriptor<{
  member: MultiAddress
  extra: NominationPoolsBondExtra
}> = "6l7t90ftdbsr6" as TxDescriptor<{
  member: MultiAddress
  extra: NominationPoolsBondExtra
}>
const call_NominationPools_set_claim_permission: TxDescriptor<{
  permission: NominationPoolsClaimPermission
}> = "cbgkt7i4ps8kc" as TxDescriptor<{
  permission: NominationPoolsClaimPermission
}>
const call_NominationPools_claim_payout_other: TxDescriptor<{
  other: SS58String
}> = "40s11r8nagn2g" as TxDescriptor<{ other: SS58String }>
const call_NominationPools_set_commission: TxDescriptor<{
  pool_id: number
  new_commission: Anonymize<Ie8iutm7u02lmj>
}> = "6bjj87fr5g9nl" as TxDescriptor<{
  pool_id: number
  new_commission: Anonymize<Ie8iutm7u02lmj>
}>
const call_NominationPools_set_commission_max: TxDescriptor<{
  pool_id: number
  max_commission: number
}> = c8cbluptqo8kbp as TxDescriptor<{ pool_id: number; max_commission: number }>
const call_NominationPools_set_commission_change_rate: TxDescriptor<{
  pool_id: number
  change_rate: Anonymize<Ibqul338t9c1ll>
}> = c81cc4plffa1dm as TxDescriptor<{
  pool_id: number
  change_rate: Anonymize<Ibqul338t9c1ll>
}>
const call_NominationPools_claim_commission: TxDescriptor<{ pool_id: number }> =
  c931cottvong90 as TxDescriptor<{ pool_id: number }>
const call_NominationPools_adjust_pool_deposit: TxDescriptor<{
  pool_id: number
}> = c931cottvong90 as TxDescriptor<{ pool_id: number }>
const call_FastUnstake_register_fast_unstake: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_FastUnstake_deregister: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_FastUnstake_control: TxDescriptor<{ eras_to_check: number }> =
  "9j0ul7nh7b8jv" as TxDescriptor<{ eras_to_check: number }>
const call_Configuration_set_validation_upgrade_cooldown: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_validation_upgrade_delay: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_code_retention_period: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_code_size: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_pov_size: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_head_data_size: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_on_demand_cores: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_on_demand_retries: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_group_rotation_frequency: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_paras_availability_period: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_scheduling_lookahead: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_validators_per_core: TxDescriptor<{
  new: Anonymize<I4arjljr6dpflb>
}> = cd581arok0b1nj as TxDescriptor<{ new: Anonymize<I4arjljr6dpflb> }>
const call_Configuration_set_max_validators: TxDescriptor<{
  new: Anonymize<I4arjljr6dpflb>
}> = cd581arok0b1nj as TxDescriptor<{ new: Anonymize<I4arjljr6dpflb> }>
const call_Configuration_set_dispute_period: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_dispute_post_conclusion_acceptance_period: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_no_show_slots: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_n_delay_tranches: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_zeroth_delay_tranche_width: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_needed_approvals: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_relay_vrf_modulo_samples: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_upward_queue_count: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_upward_queue_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_downward_message_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_upward_message_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_max_upward_message_num_per_candidate: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_open_request_ttl: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_sender_deposit: TxDescriptor<{
  new: bigint
}> = c9jsikd1ghmc7l as TxDescriptor<{ new: bigint }>
const call_Configuration_set_hrmp_recipient_deposit: TxDescriptor<{
  new: bigint
}> = c9jsikd1ghmc7l as TxDescriptor<{ new: bigint }>
const call_Configuration_set_hrmp_channel_max_capacity: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_channel_max_total_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_max_parachain_inbound_channels: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_channel_max_message_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_max_parachain_outbound_channels: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_hrmp_max_message_num_per_candidate: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_pvf_voting_ttl: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_minimum_validation_upgrade_delay: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_bypass_consistency_check: TxDescriptor<{
  new: boolean
}> = "2f6mha3v4ooda" as TxDescriptor<{ new: boolean }>
const call_Configuration_set_async_backing_params: TxDescriptor<{
  new: Anonymize<Iavuvfkop6318c>
}> = "asqjdhasi408s" as TxDescriptor<{ new: Anonymize<Iavuvfkop6318c> }>
const call_Configuration_set_executor_params: TxDescriptor<{
  new: Anonymize<I6sbufrhmgqdb6>
}> = "ehb5cb6rp4k2p" as TxDescriptor<{ new: Anonymize<I6sbufrhmgqdb6> }>
const call_Configuration_set_on_demand_base_fee: TxDescriptor<{ new: bigint }> =
  c9jsikd1ghmc7l as TxDescriptor<{ new: bigint }>
const call_Configuration_set_on_demand_fee_variability: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_on_demand_queue_max_size: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_on_demand_target_queue_utilization: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_on_demand_ttl: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_Configuration_set_minimum_backing_votes: TxDescriptor<{
  new: number
}> = c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_ParaInherent_enter: TxDescriptor<{
  data: Anonymize<Ieal73d05pk7dg>
}> = "6uj8ujct0o4v7" as TxDescriptor<{ data: Anonymize<Ieal73d05pk7dg> }>
const call_Paras_force_set_current_code: TxDescriptor<{
  para: number
  new_code: Binary
}> = c1k3urvkqqshbc as TxDescriptor<{ para: number; new_code: Binary }>
const call_Paras_force_set_current_head: TxDescriptor<{
  para: number
  new_head: Binary
}> = c2ff0ffsh15vej as TxDescriptor<{ para: number; new_head: Binary }>
const call_Paras_force_schedule_code_upgrade: TxDescriptor<{
  para: number
  new_code: Binary
  relay_parent_number: number
}> = "1orfg86bkg123" as TxDescriptor<{
  para: number
  new_code: Binary
  relay_parent_number: number
}>
const call_Paras_force_note_new_head: TxDescriptor<{
  para: number
  new_head: Binary
}> = c2ff0ffsh15vej as TxDescriptor<{ para: number; new_head: Binary }>
const call_Paras_force_queue_action: TxDescriptor<{ para: number }> =
  caus4cb3drhu9q as TxDescriptor<{ para: number }>
const call_Paras_add_trusted_validation_code: TxDescriptor<{
  validation_code: Binary
}> = "vnsat10lv9d6" as TxDescriptor<{ validation_code: Binary }>
const call_Paras_poke_unused_validation_code: TxDescriptor<{
  validation_code_hash: Binary
}> = "fqm1da2k7es4d" as TxDescriptor<{ validation_code_hash: Binary }>
const call_Paras_include_pvf_check_statement: TxDescriptor<{
  stmt: Anonymize<I3h1ccufdk38ej>
  signature: Binary
}> = "4aouqiv2fh67c" as TxDescriptor<{
  stmt: Anonymize<I3h1ccufdk38ej>
  signature: Binary
}>
const call_Paras_force_set_most_recent_context: TxDescriptor<{
  para: number
  context: number
}> = "9tmok5kceg2bg" as TxDescriptor<{ para: number; context: number }>
const call_Initializer_force_approve: TxDescriptor<{ up_to: number }> =
  "85icj2qbjeqbe" as TxDescriptor<{ up_to: number }>
const call_Hrmp_hrmp_init_open_channel: TxDescriptor<{
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}> = "buhbp68e6tkct" as TxDescriptor<{
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}>
const call_Hrmp_hrmp_accept_open_channel: TxDescriptor<{ sender: number }> =
  "drevppfiubhve" as TxDescriptor<{ sender: number }>
const call_Hrmp_hrmp_close_channel: TxDescriptor<{
  channel_id: Anonymize<I50mrcbubp554e>
}> = "9s2h36kr71vk9" as TxDescriptor<{ channel_id: Anonymize<I50mrcbubp554e> }>
const call_Hrmp_force_clean_hrmp: TxDescriptor<{
  para: number
  num_inbound: number
  num_outbound: number
}> = "4lkbiubo9ogq9" as TxDescriptor<{
  para: number
  num_inbound: number
  num_outbound: number
}>
const call_Hrmp_force_process_hrmp_open: TxDescriptor<{ channels: number }> =
  cd1baei7m8gkhk as TxDescriptor<{ channels: number }>
const call_Hrmp_force_process_hrmp_close: TxDescriptor<{ channels: number }> =
  cd1baei7m8gkhk as TxDescriptor<{ channels: number }>
const call_Hrmp_hrmp_cancel_open_request: TxDescriptor<{
  channel_id: Anonymize<I50mrcbubp554e>
  open_requests: number
}> = "96ftepqm4vs7m" as TxDescriptor<{
  channel_id: Anonymize<I50mrcbubp554e>
  open_requests: number
}>
const call_Hrmp_force_open_hrmp_channel: TxDescriptor<{
  sender: number
  recipient: number
  max_capacity: number
  max_message_size: number
}> = "c3430470j4mbv" as TxDescriptor<{
  sender: number
  recipient: number
  max_capacity: number
  max_message_size: number
}>
const call_Hrmp_establish_system_channel: TxDescriptor<{
  sender: number
  recipient: number
}> = c50mrcbubp554e as TxDescriptor<{ sender: number; recipient: number }>
const call_Hrmp_poke_channel_deposits: TxDescriptor<{
  sender: number
  recipient: number
}> = c50mrcbubp554e as TxDescriptor<{ sender: number; recipient: number }>
const call_ParasDisputes_force_unfreeze: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_ParasSlashing_report_dispute_lost_unsigned: TxDescriptor<{
  dispute_proof: Anonymize<Iag14tqe65tvpf>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = "1ur1874hp9ar5" as TxDescriptor<{
  dispute_proof: Anonymize<Iag14tqe65tvpf>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Registrar_register: TxDescriptor<{
  id: number
  genesis_head: Binary
  validation_code: Binary
}> = "7mf0sij342109" as TxDescriptor<{
  id: number
  genesis_head: Binary
  validation_code: Binary
}>
const call_Registrar_force_register: TxDescriptor<{
  who: SS58String
  deposit: bigint
  id: number
  genesis_head: Binary
  validation_code: Binary
}> = "bvirp862qkkup" as TxDescriptor<{
  who: SS58String
  deposit: bigint
  id: number
  genesis_head: Binary
  validation_code: Binary
}>
const call_Registrar_deregister: TxDescriptor<{ id: number }> =
  "c5b47dj4coa3r" as TxDescriptor<{ id: number }>
const call_Registrar_swap: TxDescriptor<{ id: number; other: number }> =
  "dehabrqi23sc0" as TxDescriptor<{ id: number; other: number }>
const call_Registrar_remove_lock: TxDescriptor<{ para: number }> =
  caus4cb3drhu9q as TxDescriptor<{ para: number }>
const call_Registrar_reserve: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Registrar_add_lock: TxDescriptor<{ para: number }> =
  caus4cb3drhu9q as TxDescriptor<{ para: number }>
const call_Registrar_schedule_code_upgrade: TxDescriptor<{
  para: number
  new_code: Binary
}> = c1k3urvkqqshbc as TxDescriptor<{ para: number; new_code: Binary }>
const call_Registrar_set_current_head: TxDescriptor<{
  para: number
  new_head: Binary
}> = c2ff0ffsh15vej as TxDescriptor<{ para: number; new_head: Binary }>
const call_Slots_force_lease: TxDescriptor<{
  para: number
  leaser: SS58String
  amount: bigint
  period_begin: number
  period_count: number
}> = "dfpo6162k0hq" as TxDescriptor<{
  para: number
  leaser: SS58String
  amount: bigint
  period_begin: number
  period_count: number
}>
const call_Slots_clear_all_leases: TxDescriptor<{ para: number }> =
  caus4cb3drhu9q as TxDescriptor<{ para: number }>
const call_Slots_trigger_onboard: TxDescriptor<{ para: number }> =
  caus4cb3drhu9q as TxDescriptor<{ para: number }>
const call_Auctions_new_auction: TxDescriptor<{
  duration: number
  lease_period_index: number
}> = "19hvnphoaj44l" as TxDescriptor<{
  duration: number
  lease_period_index: number
}>
const call_Auctions_bid: TxDescriptor<{
  para: number
  auction_index: number
  first_slot: number
  last_slot: number
  amount: bigint
}> = "1ng31ej27mh4k" as TxDescriptor<{
  para: number
  auction_index: number
  first_slot: number
  last_slot: number
  amount: bigint
}>
const call_Auctions_cancel_auction: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Crowdloan_create: TxDescriptor<{
  index: number
  cap: bigint
  first_period: number
  last_period: number
  end: number
  verifier: Anonymize<I8t18p6mokc3s4>
}> = c3js6c9fubdele as TxDescriptor<{
  index: number
  cap: bigint
  first_period: number
  last_period: number
  end: number
  verifier: Anonymize<I8t18p6mokc3s4>
}>
const call_Crowdloan_contribute: TxDescriptor<{
  index: number
  value: bigint
  signature: Anonymize<I7us28h09nc5sv>
}> = "6n5jj22t7mm7i" as TxDescriptor<{
  index: number
  value: bigint
  signature: Anonymize<I7us28h09nc5sv>
}>
const call_Crowdloan_withdraw: TxDescriptor<{
  who: SS58String
  index: number
}> = ca1u3jll6a06ae as TxDescriptor<{ who: SS58String; index: number }>
const call_Crowdloan_refund: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Crowdloan_dissolve: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Crowdloan_edit: TxDescriptor<{
  index: number
  cap: bigint
  first_period: number
  last_period: number
  end: number
  verifier: Anonymize<I8t18p6mokc3s4>
}> = c3js6c9fubdele as TxDescriptor<{
  index: number
  cap: bigint
  first_period: number
  last_period: number
  end: number
  verifier: Anonymize<I8t18p6mokc3s4>
}>
const call_Crowdloan_add_memo: TxDescriptor<{ index: number; memo: Binary }> =
  "7cl9esn1l72m7" as TxDescriptor<{ index: number; memo: Binary }>
const call_Crowdloan_poke: TxDescriptor<{ index: number }> =
  c666bl2fqjkejo as TxDescriptor<{ index: number }>
const call_Crowdloan_contribute_all: TxDescriptor<{
  index: number
  signature: Anonymize<I7us28h09nc5sv>
}> = "3k27o64k49es2" as TxDescriptor<{
  index: number
  signature: Anonymize<I7us28h09nc5sv>
}>
const call_XcmPallet_send: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  message: XcmVersionedXcm
}> = "cvpjofp09bmlh" as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  message: XcmVersionedXcm
}>
const call_XcmPallet_teleport_assets: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
}> = ceeis6pj62kiu4 as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
}>
const call_XcmPallet_reserve_transfer_assets: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
}> = ceeis6pj62kiu4 as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
}>
const call_XcmPallet_execute: TxDescriptor<{
  message: XcmVersionedXcm1
  max_weight: Anonymize<I4q39t5hn830vp>
}> = "53e0mdinhcvpm" as TxDescriptor<{
  message: XcmVersionedXcm1
  max_weight: Anonymize<I4q39t5hn830vp>
}>
const call_XcmPallet_force_xcm_version: TxDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}> = c732o5n04n5ohg as TxDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}>
const call_XcmPallet_force_default_xcm_version: TxDescriptor<{
  maybe_xcm_version: Anonymize<I4arjljr6dpflb>
}> = "c76kfh5ebqkpl" as TxDescriptor<{
  maybe_xcm_version: Anonymize<I4arjljr6dpflb>
}>
const call_XcmPallet_force_subscribe_version_notify: TxDescriptor<{
  location: XcmVersionedMultiLocation
}> = c3pog27ittgi9g as TxDescriptor<{ location: XcmVersionedMultiLocation }>
const call_XcmPallet_force_unsubscribe_version_notify: TxDescriptor<{
  location: XcmVersionedMultiLocation
}> = c3pog27ittgi9g as TxDescriptor<{ location: XcmVersionedMultiLocation }>
const call_XcmPallet_limited_reserve_transfer_assets: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
  weight_limit: XcmV3WeightLimit
}> = cfcceq8taolrca as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
  weight_limit: XcmV3WeightLimit
}>
const call_XcmPallet_limited_teleport_assets: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
  weight_limit: XcmV3WeightLimit
}> = cfcceq8taolrca as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  beneficiary: XcmVersionedMultiLocation
  assets: XcmVersionedMultiAssets
  fee_asset_item: number
  weight_limit: XcmV3WeightLimit
}>
const call_XcmPallet_force_suspension: TxDescriptor<{ suspended: boolean }> =
  "bgm4rnf22lal1" as TxDescriptor<{ suspended: boolean }>
const call_MessageQueue_reap_page: TxDescriptor<{
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
}> = "3f1tq7m3kurig" as TxDescriptor<{
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
}>
const call_MessageQueue_execute_overweight: TxDescriptor<{
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page: number
  index: number
  weight_limit: Anonymize<I4q39t5hn830vp>
}> = "fhnflnkf9f278" as TxDescriptor<{
  message_origin: ParachainsInclusionAggregateMessageOrigin
  page: number
  index: number
  weight_limit: Anonymize<I4q39t5hn830vp>
}>
const call_AssetRate_create: TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}> = c16soggnee6qrb as TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}>
const call_AssetRate_update: TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}> = c16soggnee6qrb as TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}>
const call_AssetRate_remove: TxDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
}> = cfvnf1s3g2lg8u as TxDescriptor<{ asset_kind: Anonymize<I32r9skkupsthv> }>
const call_Beefy_report_equivocation: TxDescriptor<{
  equivocation_proof: Anonymize<I6lgkrki6lhal>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c894urueu7skf3 as TxDescriptor<{
  equivocation_proof: Anonymize<I6lgkrki6lhal>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Beefy_report_equivocation_unsigned: TxDescriptor<{
  equivocation_proof: Anonymize<I6lgkrki6lhal>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}> = c894urueu7skf3 as TxDescriptor<{
  equivocation_proof: Anonymize<I6lgkrki6lhal>
  key_owner_proof: Anonymize<I3ia7aufsoj0l1>
}>
const call_Beefy_set_new_genesis: TxDescriptor<{ delay_in_blocks: number }> =
  "emqna2uucuei9" as TxDescriptor<{ delay_in_blocks: number }>
const evt_System_ExtrinsicSuccess: PlainDescriptor<{
  dispatch_info: Anonymize<Ia2iiohca2et6f>
}> = "ede1ukavoderd" as PlainDescriptor<{
  dispatch_info: Anonymize<Ia2iiohca2et6f>
}>
const evt_System_ExtrinsicFailed: PlainDescriptor<{
  dispatch_error: DispatchError
  dispatch_info: Anonymize<Ia2iiohca2et6f>
}> = "ennefu6o2bgdm" as PlainDescriptor<{
  dispatch_error: DispatchError
  dispatch_info: Anonymize<Ia2iiohca2et6f>
}>
const evt_System_CodeUpdated: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_System_NewAccount: PlainDescriptor<{ account: SS58String }> =
  ccbccs0ug47ilf as PlainDescriptor<{ account: SS58String }>
const evt_System_KilledAccount: PlainDescriptor<{ account: SS58String }> =
  ccbccs0ug47ilf as PlainDescriptor<{ account: SS58String }>
const evt_System_Remarked: PlainDescriptor<{
  sender: SS58String
  hash: Binary
}> = "eob37pbjnvmkj" as PlainDescriptor<{ sender: SS58String; hash: Binary }>
const evt_Scheduler_Scheduled: PlainDescriptor<{
  when: number
  index: number
}> = c5n4sebgkfr760 as PlainDescriptor<{ when: number; index: number }>
const evt_Scheduler_Canceled: PlainDescriptor<{ when: number; index: number }> =
  c5n4sebgkfr760 as PlainDescriptor<{ when: number; index: number }>
const evt_Scheduler_Dispatched: PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
  result: Anonymize<Idtdr91jmq5g4i>
}> = "dv8erd9m7jvse" as PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
  result: Anonymize<Idtdr91jmq5g4i>
}>
const evt_Scheduler_CallUnavailable: PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}> = cbkv7dijodoblp as PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}>
const evt_Scheduler_PeriodicFailed: PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}> = cbkv7dijodoblp as PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}>
const evt_Scheduler_PermanentlyOverweight: PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}> = cbkv7dijodoblp as PlainDescriptor<{
  task: Anonymize<I5g2vv0ckl2m8b>
  id: Anonymize<I17k3ujudqd5df>
}>
const evt_Preimage_Noted: PlainDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as PlainDescriptor<{ hash: Binary }>
const evt_Preimage_Requested: PlainDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as PlainDescriptor<{ hash: Binary }>
const evt_Preimage_Cleared: PlainDescriptor<{ hash: Binary }> =
  cd9d48vaes3c53 as PlainDescriptor<{ hash: Binary }>
const evt_Indices_IndexAssigned: PlainDescriptor<{
  who: SS58String
  index: number
}> = ca1u3jll6a06ae as PlainDescriptor<{ who: SS58String; index: number }>
const evt_Indices_IndexFreed: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Indices_IndexFrozen: PlainDescriptor<{
  who: SS58String
  index: number
}> = ca1u3jll6a06ae as PlainDescriptor<{ who: SS58String; index: number }>
const evt_Balances_Endowed: PlainDescriptor<{
  account: SS58String
  free_balance: bigint
}> = "cv68aq8841478" as PlainDescriptor<{
  account: SS58String
  free_balance: bigint
}>
const evt_Balances_DustLost: PlainDescriptor<{
  account: SS58String
  amount: bigint
}> = "c262ibdoec56a" as PlainDescriptor<{ account: SS58String; amount: bigint }>
const evt_Balances_Transfer: PlainDescriptor<{
  from: SS58String
  to: SS58String
  amount: bigint
}> = "flcfm9b6nlmdd" as PlainDescriptor<{
  from: SS58String
  to: SS58String
  amount: bigint
}>
const evt_Balances_BalanceSet: PlainDescriptor<{
  who: SS58String
  free: bigint
}> = "jrsf4mnp3eka" as PlainDescriptor<{ who: SS58String; free: bigint }>
const evt_Balances_Reserved: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Unreserved: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_ReserveRepatriated: PlainDescriptor<{
  from: SS58String
  to: SS58String
  amount: bigint
  destination_status: BalanceStatus
}> = "dm5rqp3duosod" as PlainDescriptor<{
  from: SS58String
  to: SS58String
  amount: bigint
  destination_status: BalanceStatus
}>
const evt_Balances_Deposit: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Withdraw: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Slashed: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Minted: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Burned: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Suspended: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Restored: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Upgraded: PlainDescriptor<{ who: SS58String }> =
  c4cbvqmqadhrea as PlainDescriptor<{ who: SS58String }>
const evt_Balances_Issued: PlainDescriptor<{ amount: bigint }> =
  c3qt1hgg4djhgb as PlainDescriptor<{ amount: bigint }>
const evt_Balances_Rescinded: PlainDescriptor<{ amount: bigint }> =
  c3qt1hgg4djhgb as PlainDescriptor<{ amount: bigint }>
const evt_Balances_Locked: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Unlocked: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Frozen: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Balances_Thawed: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_TransactionPayment_TransactionFeePaid: PlainDescriptor<{
  who: SS58String
  actual_fee: bigint
  tip: bigint
}> = "er2cke86dqbr2" as PlainDescriptor<{
  who: SS58String
  actual_fee: bigint
  tip: bigint
}>
const evt_Staking_EraPaid: PlainDescriptor<{
  era_index: number
  validator_payout: bigint
  remainder: bigint
}> = "1au3fq4n84nv3" as PlainDescriptor<{
  era_index: number
  validator_payout: bigint
  remainder: bigint
}>
const evt_Staking_Rewarded: PlainDescriptor<{
  stash: SS58String
  dest: StakingRewardDestination
  amount: bigint
}> = "5j22i27djc5r4" as PlainDescriptor<{
  stash: SS58String
  dest: StakingRewardDestination
  amount: bigint
}>
const evt_Staking_Slashed: PlainDescriptor<{
  staker: SS58String
  amount: bigint
}> = "dnak900lt5lm8" as PlainDescriptor<{ staker: SS58String; amount: bigint }>
const evt_Staking_SlashReported: PlainDescriptor<{
  validator: SS58String
  fraction: number
  slash_era: number
}> = "27n7lbd66730p" as PlainDescriptor<{
  validator: SS58String
  fraction: number
  slash_era: number
}>
const evt_Staking_OldSlashingReportDiscarded: PlainDescriptor<{
  session_index: number
}> = c2hq50pu2kdjpo as PlainDescriptor<{ session_index: number }>
const evt_Staking_StakersElected: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Staking_Bonded: PlainDescriptor<{
  stash: SS58String
  amount: bigint
}> = cfk8eme5o7mukf as PlainDescriptor<{ stash: SS58String; amount: bigint }>
const evt_Staking_Unbonded: PlainDescriptor<{
  stash: SS58String
  amount: bigint
}> = cfk8eme5o7mukf as PlainDescriptor<{ stash: SS58String; amount: bigint }>
const evt_Staking_Withdrawn: PlainDescriptor<{
  stash: SS58String
  amount: bigint
}> = cfk8eme5o7mukf as PlainDescriptor<{ stash: SS58String; amount: bigint }>
const evt_Staking_Kicked: PlainDescriptor<{
  nominator: SS58String
  stash: SS58String
}> = "au4cgm6ih61cf" as PlainDescriptor<{
  nominator: SS58String
  stash: SS58String
}>
const evt_Staking_StakingElectionFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Staking_Chilled: PlainDescriptor<{ stash: SS58String }> =
  "dl3umm12u5pa" as PlainDescriptor<{ stash: SS58String }>
const evt_Staking_PayoutStarted: PlainDescriptor<{
  era_index: number
  validator_stash: SS58String
}> = "6ir616rur362k" as PlainDescriptor<{
  era_index: number
  validator_stash: SS58String
}>
const evt_Staking_ValidatorPrefsSet: PlainDescriptor<{
  stash: SS58String
  prefs: Anonymize<I9o7ssi9vmhmgr>
}> = "c19as7nbst738" as PlainDescriptor<{
  stash: SS58String
  prefs: Anonymize<I9o7ssi9vmhmgr>
}>
const evt_Staking_SnapshotVotersSizeExceeded: PlainDescriptor<{
  size: number
}> = c54umskavgc9du as PlainDescriptor<{ size: number }>
const evt_Staking_SnapshotTargetsSizeExceeded: PlainDescriptor<{
  size: number
}> = c54umskavgc9du as PlainDescriptor<{ size: number }>
const evt_Staking_ForceEra: PlainDescriptor<{ mode: StakingForcing }> =
  "43l31t29k2o0p" as PlainDescriptor<{ mode: StakingForcing }>
const evt_Offences_Offence: PlainDescriptor<{
  kind: Binary
  timeslot: Binary
}> = "41n4hddrgegvb" as PlainDescriptor<{ kind: Binary; timeslot: Binary }>
const evt_Session_NewSession: PlainDescriptor<{ session_index: number }> =
  c2hq50pu2kdjpo as PlainDescriptor<{ session_index: number }>
const evt_Grandpa_NewAuthorities: PlainDescriptor<{
  authority_set: Anonymize<I2qinct8jq4bqe>
}> = "b31jedabim0q7" as PlainDescriptor<{
  authority_set: Anonymize<I2qinct8jq4bqe>
}>
const evt_Grandpa_Paused: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Grandpa_Resumed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ImOnline_HeartbeatReceived: PlainDescriptor<{
  authority_id: Binary
}> = "93nne97c4i0sr" as PlainDescriptor<{ authority_id: Binary }>
const evt_ImOnline_AllGood: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ImOnline_SomeOffline: PlainDescriptor<{
  offline: Anonymize<I67ag5q10ogtvt>
}> = "311vp8270bfmr" as PlainDescriptor<{ offline: Anonymize<I67ag5q10ogtvt> }>
const evt_Treasury_Proposed: PlainDescriptor<{ proposal_index: number }> =
  "44hc4lgsn4o1j" as PlainDescriptor<{ proposal_index: number }>
const evt_Treasury_Spending: PlainDescriptor<{ budget_remaining: bigint }> =
  "8iksqi3eani0a" as PlainDescriptor<{ budget_remaining: bigint }>
const evt_Treasury_Awarded: PlainDescriptor<{
  proposal_index: number
  award: bigint
  account: SS58String
}> = "16enopmju1p0q" as PlainDescriptor<{
  proposal_index: number
  award: bigint
  account: SS58String
}>
const evt_Treasury_Rejected: PlainDescriptor<{
  proposal_index: number
  slashed: bigint
}> = "fgqhle2413de7" as PlainDescriptor<{
  proposal_index: number
  slashed: bigint
}>
const evt_Treasury_Burnt: PlainDescriptor<{ burnt_funds: bigint }> =
  "43kq8qudg7pq9" as PlainDescriptor<{ burnt_funds: bigint }>
const evt_Treasury_Rollover: PlainDescriptor<{ rollover_balance: bigint }> =
  "76riseemre533" as PlainDescriptor<{ rollover_balance: bigint }>
const evt_Treasury_Deposit: PlainDescriptor<{ value: bigint }> =
  ce5v6njpckr05b as PlainDescriptor<{ value: bigint }>
const evt_Treasury_SpendApproved: PlainDescriptor<{
  proposal_index: number
  amount: bigint
  beneficiary: SS58String
}> = "38bmcrmh852rk" as PlainDescriptor<{
  proposal_index: number
  amount: bigint
  beneficiary: SS58String
}>
const evt_Treasury_UpdatedInactive: PlainDescriptor<{
  reactivated: bigint
  deactivated: bigint
}> = "4hcillge8de5f" as PlainDescriptor<{
  reactivated: bigint
  deactivated: bigint
}>
const evt_Treasury_AssetSpendApproved: PlainDescriptor<{
  index: number
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: number
  expire_at: number
}> = "blqf6usek6oij" as PlainDescriptor<{
  index: number
  asset_kind: Anonymize<I32r9skkupsthv>
  amount: bigint
  beneficiary: XcmVersionedMultiLocation
  valid_from: number
  expire_at: number
}>
const evt_Treasury_AssetSpendVoided: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Treasury_Paid: PlainDescriptor<{
  index: number
  payment_id: bigint
}> = cek7v4hrgnq6iv as PlainDescriptor<{ index: number; payment_id: bigint }>
const evt_Treasury_PaymentFailed: PlainDescriptor<{
  index: number
  payment_id: bigint
}> = cek7v4hrgnq6iv as PlainDescriptor<{ index: number; payment_id: bigint }>
const evt_Treasury_SpendProcessed: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_ConvictionVoting_Delegated: PlainDescriptor<
  [SS58String, SS58String]
> = "c5oktqtdlvdvq" as PlainDescriptor<[SS58String, SS58String]>
const evt_ConvictionVoting_Undelegated: PlainDescriptor<SS58String> =
  "5ud5q8n726j4" as PlainDescriptor<SS58String>
const evt_Referenda_Submitted: PlainDescriptor<{
  index: number
  track: number
  proposal: PreimagesBounded
}> = "dhr9v8mlnjej" as PlainDescriptor<{
  index: number
  track: number
  proposal: PreimagesBounded
}>
const evt_Referenda_DecisionDepositPlaced: PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}> = c62nte77gksm0f as PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}>
const evt_Referenda_DecisionDepositRefunded: PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}> = c62nte77gksm0f as PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}>
const evt_Referenda_DepositSlashed: PlainDescriptor<{
  who: SS58String
  amount: bigint
}> = cd5fm4p8lj5qgi as PlainDescriptor<{ who: SS58String; amount: bigint }>
const evt_Referenda_DecisionStarted: PlainDescriptor<{
  index: number
  track: number
  proposal: PreimagesBounded
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = "932allgc83a4a" as PlainDescriptor<{
  index: number
  track: number
  proposal: PreimagesBounded
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_ConfirmStarted: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Referenda_ConfirmAborted: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Referenda_Confirmed: PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = clhp45uime5tp as PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_Approved: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Referenda_Rejected: PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = clhp45uime5tp as PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_TimedOut: PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = clhp45uime5tp as PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_Cancelled: PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = clhp45uime5tp as PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_Killed: PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}> = clhp45uime5tp as PlainDescriptor<{
  index: number
  tally: Anonymize<Ifsk7cbmtit1jd>
}>
const evt_Referenda_SubmissionDepositRefunded: PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}> = c62nte77gksm0f as PlainDescriptor<{
  index: number
  who: SS58String
  amount: bigint
}>
const evt_Referenda_MetadataSet: PlainDescriptor<{
  index: number
  hash: Binary
}> = c50aq0q2l1cdkr as PlainDescriptor<{ index: number; hash: Binary }>
const evt_Referenda_MetadataCleared: PlainDescriptor<{
  index: number
  hash: Binary
}> = c50aq0q2l1cdkr as PlainDescriptor<{ index: number; hash: Binary }>
const evt_Whitelist_CallWhitelisted: PlainDescriptor<{ call_hash: Binary }> =
  c8413rb6im3iko as PlainDescriptor<{ call_hash: Binary }>
const evt_Whitelist_WhitelistedCallRemoved: PlainDescriptor<{
  call_hash: Binary
}> = c8413rb6im3iko as PlainDescriptor<{ call_hash: Binary }>
const evt_Whitelist_WhitelistedCallDispatched: PlainDescriptor<{
  call_hash: Binary
  result: Anonymize<Idurpak8qagatr>
}> = "7b8pe56shlide" as PlainDescriptor<{
  call_hash: Binary
  result: Anonymize<Idurpak8qagatr>
}>
const evt_Claims_Claimed: PlainDescriptor<{
  who: SS58String
  ethereum_address: Binary
  amount: bigint
}> = "dhjiuhlaei3db" as PlainDescriptor<{
  who: SS58String
  ethereum_address: Binary
  amount: bigint
}>
const evt_Vesting_VestingUpdated: PlainDescriptor<{
  account: SS58String
  unvested: bigint
}> = "evr89968437gm" as PlainDescriptor<{
  account: SS58String
  unvested: bigint
}>
const evt_Vesting_VestingCompleted: PlainDescriptor<{ account: SS58String }> =
  ccbccs0ug47ilf as PlainDescriptor<{ account: SS58String }>
const evt_Utility_BatchInterrupted: PlainDescriptor<{
  index: number
  error: DispatchError
}> = "6tn8e5lqr339o" as PlainDescriptor<{ index: number; error: DispatchError }>
const evt_Utility_BatchCompleted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Utility_BatchCompletedWithErrors: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Utility_ItemCompleted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_Utility_ItemFailed: PlainDescriptor<{ error: DispatchError }> =
  "11lb9o37qkk4f" as PlainDescriptor<{ error: DispatchError }>
const evt_Utility_DispatchedAs: PlainDescriptor<{
  result: Anonymize<Idtdr91jmq5g4i>
}> = ce5i8qqljk3tjb as PlainDescriptor<{ result: Anonymize<Idtdr91jmq5g4i> }>
const evt_Identity_IdentitySet: PlainDescriptor<{ who: SS58String }> =
  c4cbvqmqadhrea as PlainDescriptor<{ who: SS58String }>
const evt_Identity_IdentityCleared: PlainDescriptor<{
  who: SS58String
  deposit: bigint
}> = cep1lmt6q3s6r3 as PlainDescriptor<{ who: SS58String; deposit: bigint }>
const evt_Identity_IdentityKilled: PlainDescriptor<{
  who: SS58String
  deposit: bigint
}> = cep1lmt6q3s6r3 as PlainDescriptor<{ who: SS58String; deposit: bigint }>
const evt_Identity_JudgementRequested: PlainDescriptor<{
  who: SS58String
  registrar_index: number
}> = c1fac16213rie2 as PlainDescriptor<{
  who: SS58String
  registrar_index: number
}>
const evt_Identity_JudgementUnrequested: PlainDescriptor<{
  who: SS58String
  registrar_index: number
}> = c1fac16213rie2 as PlainDescriptor<{
  who: SS58String
  registrar_index: number
}>
const evt_Identity_JudgementGiven: PlainDescriptor<{
  target: SS58String
  registrar_index: number
}> = "fjt77oc391o43" as PlainDescriptor<{
  target: SS58String
  registrar_index: number
}>
const evt_Identity_RegistrarAdded: PlainDescriptor<{
  registrar_index: number
}> = "tvt1jsipv0lc" as PlainDescriptor<{ registrar_index: number }>
const evt_Identity_SubIdentityAdded: PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}> = cck3mveut33f44 as PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}>
const evt_Identity_SubIdentityRemoved: PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}> = cck3mveut33f44 as PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}>
const evt_Identity_SubIdentityRevoked: PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}> = cck3mveut33f44 as PlainDescriptor<{
  sub: SS58String
  main: SS58String
  deposit: bigint
}>
const evt_Proxy_ProxyExecuted: PlainDescriptor<{
  result: Anonymize<Idtdr91jmq5g4i>
}> = ce5i8qqljk3tjb as PlainDescriptor<{ result: Anonymize<Idtdr91jmq5g4i> }>
const evt_Proxy_PureCreated: PlainDescriptor<{
  pure: SS58String
  who: SS58String
  proxy_type: ProxyType
  disambiguation_index: number
}> = "180p9c978rp4d" as PlainDescriptor<{
  pure: SS58String
  who: SS58String
  proxy_type: ProxyType
  disambiguation_index: number
}>
const evt_Proxy_Announced: PlainDescriptor<{
  real: SS58String
  proxy: SS58String
  call_hash: Binary
}> = "dbjbboh0q507r" as PlainDescriptor<{
  real: SS58String
  proxy: SS58String
  call_hash: Binary
}>
const evt_Proxy_ProxyAdded: PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: ProxyType
  delay: number
}> = c94ud6o1n6v0n8 as PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: ProxyType
  delay: number
}>
const evt_Proxy_ProxyRemoved: PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: ProxyType
  delay: number
}> = c94ud6o1n6v0n8 as PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: ProxyType
  delay: number
}>
const evt_Multisig_NewMultisig: PlainDescriptor<{
  approving: SS58String
  multisig: SS58String
  call_hash: Binary
}> = "bvv58de7m7rsi" as PlainDescriptor<{
  approving: SS58String
  multisig: SS58String
  call_hash: Binary
}>
const evt_Multisig_MultisigApproval: PlainDescriptor<{
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}> = "4uo2dg1jvbdtg" as PlainDescriptor<{
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}>
const evt_Multisig_MultisigExecuted: PlainDescriptor<{
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
  result: Anonymize<Idtdr91jmq5g4i>
}> = "fbo6gts4g8u33" as PlainDescriptor<{
  approving: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
  result: Anonymize<Idtdr91jmq5g4i>
}>
const evt_Multisig_MultisigCancelled: PlainDescriptor<{
  cancelling: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}> = "82jp3a00f0f8k" as PlainDescriptor<{
  cancelling: SS58String
  timepoint: Anonymize<Itvprrpb0nm3o>
  multisig: SS58String
  call_hash: Binary
}>
const evt_Bounties_BountyProposed: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Bounties_BountyRejected: PlainDescriptor<{
  index: number
  bond: bigint
}> = "d9idaj83175f9" as PlainDescriptor<{ index: number; bond: bigint }>
const evt_Bounties_BountyBecameActive: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Bounties_BountyAwarded: PlainDescriptor<{
  index: number
  beneficiary: SS58String
}> = "e1semicfuv5uu" as PlainDescriptor<{
  index: number
  beneficiary: SS58String
}>
const evt_Bounties_BountyClaimed: PlainDescriptor<{
  index: number
  payout: bigint
  beneficiary: SS58String
}> = "f25fjs9o37co1" as PlainDescriptor<{
  index: number
  payout: bigint
  beneficiary: SS58String
}>
const evt_Bounties_BountyCanceled: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Bounties_BountyExtended: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Bounties_BountyApproved: PlainDescriptor<{ index: number }> =
  c666bl2fqjkejo as PlainDescriptor<{ index: number }>
const evt_Bounties_CuratorProposed: PlainDescriptor<{
  bounty_id: number
  curator: SS58String
}> = c70sc1pdo8vtos as PlainDescriptor<{
  bounty_id: number
  curator: SS58String
}>
const evt_Bounties_CuratorUnassigned: PlainDescriptor<{ bounty_id: number }> =
  ca9p5bg6p18r0i as PlainDescriptor<{ bounty_id: number }>
const evt_Bounties_CuratorAccepted: PlainDescriptor<{
  bounty_id: number
  curator: SS58String
}> = c70sc1pdo8vtos as PlainDescriptor<{
  bounty_id: number
  curator: SS58String
}>
const evt_ChildBounties_Added: PlainDescriptor<{
  index: number
  child_index: number
}> = c60p8l86a8cm59 as PlainDescriptor<{ index: number; child_index: number }>
const evt_ChildBounties_Awarded: PlainDescriptor<{
  index: number
  child_index: number
  beneficiary: SS58String
}> = "3m3sk2lgcabvp" as PlainDescriptor<{
  index: number
  child_index: number
  beneficiary: SS58String
}>
const evt_ChildBounties_Claimed: PlainDescriptor<{
  index: number
  child_index: number
  payout: bigint
  beneficiary: SS58String
}> = "5pf572duh4oeg" as PlainDescriptor<{
  index: number
  child_index: number
  payout: bigint
  beneficiary: SS58String
}>
const evt_ChildBounties_Canceled: PlainDescriptor<{
  index: number
  child_index: number
}> = c60p8l86a8cm59 as PlainDescriptor<{ index: number; child_index: number }>
const evt_ElectionProviderMultiPhase_SolutionStored: PlainDescriptor<{
  compute: ElectionProviderMultiPhaseElectionCompute
  origin: Anonymize<Ihfphjolmsqq1>
  prev_ejected: boolean
}> = "5an5igf3n0vgh" as PlainDescriptor<{
  compute: ElectionProviderMultiPhaseElectionCompute
  origin: Anonymize<Ihfphjolmsqq1>
  prev_ejected: boolean
}>
const evt_ElectionProviderMultiPhase_ElectionFinalized: PlainDescriptor<{
  compute: ElectionProviderMultiPhaseElectionCompute
  score: Anonymize<I8s6n43okuj2b1>
}> = "1rd7gkt317ndg" as PlainDescriptor<{
  compute: ElectionProviderMultiPhaseElectionCompute
  score: Anonymize<I8s6n43okuj2b1>
}>
const evt_ElectionProviderMultiPhase_ElectionFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ElectionProviderMultiPhase_Rewarded: PlainDescriptor<{
  account: SS58String
  value: bigint
}> = c7j4m7a3pkvsf4 as PlainDescriptor<{ account: SS58String; value: bigint }>
const evt_ElectionProviderMultiPhase_Slashed: PlainDescriptor<{
  account: SS58String
  value: bigint
}> = c7j4m7a3pkvsf4 as PlainDescriptor<{ account: SS58String; value: bigint }>
const evt_ElectionProviderMultiPhase_PhaseTransitioned: PlainDescriptor<{
  from: ElectionProviderMultiPhasePhase
  to: ElectionProviderMultiPhasePhase
  round: number
}> = "crg5eih8vnokr" as PlainDescriptor<{
  from: ElectionProviderMultiPhasePhase
  to: ElectionProviderMultiPhasePhase
  round: number
}>
const evt_VoterList_Rebagged: PlainDescriptor<{
  who: SS58String
  from: bigint
  to: bigint
}> = "37454vatvmm1l" as PlainDescriptor<{
  who: SS58String
  from: bigint
  to: bigint
}>
const evt_VoterList_ScoreUpdated: PlainDescriptor<{
  who: SS58String
  new_score: bigint
}> = "blau1qa7u7fet" as PlainDescriptor<{ who: SS58String; new_score: bigint }>
const evt_NominationPools_Created: PlainDescriptor<{
  depositor: SS58String
  pool_id: number
}> = "1ti389kf8t6oi" as PlainDescriptor<{
  depositor: SS58String
  pool_id: number
}>
const evt_NominationPools_Bonded: PlainDescriptor<{
  member: SS58String
  pool_id: number
  bonded: bigint
  joined: boolean
}> = "f4nnre373amul" as PlainDescriptor<{
  member: SS58String
  pool_id: number
  bonded: bigint
  joined: boolean
}>
const evt_NominationPools_PaidOut: PlainDescriptor<{
  member: SS58String
  pool_id: number
  payout: bigint
}> = "55kbor0ocqk6h" as PlainDescriptor<{
  member: SS58String
  pool_id: number
  payout: bigint
}>
const evt_NominationPools_Unbonded: PlainDescriptor<{
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
  era: number
}> = "dsj9cg7j96kpc" as PlainDescriptor<{
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
  era: number
}>
const evt_NominationPools_Withdrawn: PlainDescriptor<{
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
}> = "do4u9drncfaml" as PlainDescriptor<{
  member: SS58String
  pool_id: number
  balance: bigint
  points: bigint
}>
const evt_NominationPools_Destroyed: PlainDescriptor<{ pool_id: number }> =
  c931cottvong90 as PlainDescriptor<{ pool_id: number }>
const evt_NominationPools_StateChanged: PlainDescriptor<{
  pool_id: number
  new_state: NominationPoolsPoolState
}> = "2inhcpqb4h0bg" as PlainDescriptor<{
  pool_id: number
  new_state: NominationPoolsPoolState
}>
const evt_NominationPools_MemberRemoved: PlainDescriptor<{
  pool_id: number
  member: SS58String
}> = "7vqogd77mmdlm" as PlainDescriptor<{ pool_id: number; member: SS58String }>
const evt_NominationPools_RolesUpdated: PlainDescriptor<{
  root: Anonymize<Ihfphjolmsqq1>
  bouncer: Anonymize<Ihfphjolmsqq1>
  nominator: Anonymize<Ihfphjolmsqq1>
}> = "6mik29s5073td" as PlainDescriptor<{
  root: Anonymize<Ihfphjolmsqq1>
  bouncer: Anonymize<Ihfphjolmsqq1>
  nominator: Anonymize<Ihfphjolmsqq1>
}>
const evt_NominationPools_PoolSlashed: PlainDescriptor<{
  pool_id: number
  balance: bigint
}> = "2m0sqmb75cnpb" as PlainDescriptor<{ pool_id: number; balance: bigint }>
const evt_NominationPools_UnbondingPoolSlashed: PlainDescriptor<{
  pool_id: number
  era: number
  balance: bigint
}> = "49agc5b62mehu" as PlainDescriptor<{
  pool_id: number
  era: number
  balance: bigint
}>
const evt_NominationPools_PoolCommissionUpdated: PlainDescriptor<{
  pool_id: number
  current: Anonymize<Ie8iutm7u02lmj>
}> = "atq9jda4hq6pg" as PlainDescriptor<{
  pool_id: number
  current: Anonymize<Ie8iutm7u02lmj>
}>
const evt_NominationPools_PoolMaxCommissionUpdated: PlainDescriptor<{
  pool_id: number
  max_commission: number
}> = c8cbluptqo8kbp as PlainDescriptor<{
  pool_id: number
  max_commission: number
}>
const evt_NominationPools_PoolCommissionChangeRateUpdated: PlainDescriptor<{
  pool_id: number
  change_rate: Anonymize<Ibqul338t9c1ll>
}> = c81cc4plffa1dm as PlainDescriptor<{
  pool_id: number
  change_rate: Anonymize<Ibqul338t9c1ll>
}>
const evt_NominationPools_PoolCommissionClaimed: PlainDescriptor<{
  pool_id: number
  commission: bigint
}> = "2g87evcjlgmqi" as PlainDescriptor<{ pool_id: number; commission: bigint }>
const evt_NominationPools_MinBalanceDeficitAdjusted: PlainDescriptor<{
  amount: bigint
  pool_id: number
}> = ceg1oc56mamrl5 as PlainDescriptor<{ amount: bigint; pool_id: number }>
const evt_NominationPools_MinBalanceExcessAdjusted: PlainDescriptor<{
  amount: bigint
  pool_id: number
}> = ceg1oc56mamrl5 as PlainDescriptor<{ amount: bigint; pool_id: number }>
const evt_FastUnstake_Unstaked: PlainDescriptor<{
  stash: SS58String
  result: Anonymize<Idtdr91jmq5g4i>
}> = "ag2vtju06tj0k" as PlainDescriptor<{
  stash: SS58String
  result: Anonymize<Idtdr91jmq5g4i>
}>
const evt_FastUnstake_Slashed: PlainDescriptor<{
  stash: SS58String
  amount: bigint
}> = cfk8eme5o7mukf as PlainDescriptor<{ stash: SS58String; amount: bigint }>
const evt_FastUnstake_BatchChecked: PlainDescriptor<{
  eras: Anonymize<Icgljjb6j82uhn>
}> = "c0he9tlf9ll0u" as PlainDescriptor<{ eras: Anonymize<Icgljjb6j82uhn> }>
const evt_FastUnstake_BatchFinished: PlainDescriptor<{ size: number }> =
  c54umskavgc9du as PlainDescriptor<{ size: number }>
const evt_FastUnstake_InternalError: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ParaInclusion_CandidateBacked: PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number, number]
> = ceno5vn1m65ng2 as PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number, number]
>
const evt_ParaInclusion_CandidateIncluded: PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number, number]
> = ceno5vn1m65ng2 as PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number, number]
>
const evt_ParaInclusion_CandidateTimedOut: PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number]
> = "evbvtucck5gnq" as PlainDescriptor<
  [Anonymize<I4vjld3472quct>, Binary, number]
>
const evt_ParaInclusion_UpwardMessagesReceived: PlainDescriptor<{
  from: number
  count: number
}> = "c8i89mfkmn3n7" as PlainDescriptor<{ from: number; count: number }>
const evt_Paras_CurrentCodeUpdated: PlainDescriptor<number> =
  c34ha3jf7jm288 as PlainDescriptor<number>
const evt_Paras_CurrentHeadUpdated: PlainDescriptor<number> =
  c34ha3jf7jm288 as PlainDescriptor<number>
const evt_Paras_CodeUpgradeScheduled: PlainDescriptor<number> =
  c34ha3jf7jm288 as PlainDescriptor<number>
const evt_Paras_NewHeadNoted: PlainDescriptor<number> =
  c34ha3jf7jm288 as PlainDescriptor<number>
const evt_Paras_ActionQueued: PlainDescriptor<[number, number]> =
  c5g2vv0ckl2m8b as PlainDescriptor<[number, number]>
const evt_Paras_PvfCheckStarted: PlainDescriptor<[Binary, number]> =
  c64gm4hrq7urum as PlainDescriptor<[Binary, number]>
const evt_Paras_PvfCheckAccepted: PlainDescriptor<[Binary, number]> =
  c64gm4hrq7urum as PlainDescriptor<[Binary, number]>
const evt_Paras_PvfCheckRejected: PlainDescriptor<[Binary, number]> =
  c64gm4hrq7urum as PlainDescriptor<[Binary, number]>
const evt_Hrmp_OpenChannelRequested: PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}> = cd2bej717ckub0 as PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}>
const evt_Hrmp_OpenChannelCanceled: PlainDescriptor<{
  by_parachain: number
  channel_id: Anonymize<I50mrcbubp554e>
}> = c545vo2e86o5i4 as PlainDescriptor<{
  by_parachain: number
  channel_id: Anonymize<I50mrcbubp554e>
}>
const evt_Hrmp_OpenChannelAccepted: PlainDescriptor<{
  sender: number
  recipient: number
}> = c50mrcbubp554e as PlainDescriptor<{ sender: number; recipient: number }>
const evt_Hrmp_ChannelClosed: PlainDescriptor<{
  by_parachain: number
  channel_id: Anonymize<I50mrcbubp554e>
}> = c545vo2e86o5i4 as PlainDescriptor<{
  by_parachain: number
  channel_id: Anonymize<I50mrcbubp554e>
}>
const evt_Hrmp_HrmpChannelForceOpened: PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}> = cd2bej717ckub0 as PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}>
const evt_Hrmp_HrmpSystemChannelOpened: PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}> = cd2bej717ckub0 as PlainDescriptor<{
  sender: number
  recipient: number
  proposed_max_capacity: number
  proposed_max_message_size: number
}>
const evt_Hrmp_OpenChannelDepositsUpdated: PlainDescriptor<{
  sender: number
  recipient: number
}> = c50mrcbubp554e as PlainDescriptor<{ sender: number; recipient: number }>
const evt_ParasDisputes_DisputeInitiated: PlainDescriptor<
  [Binary, ParachainsDisputesDisputeLocation]
> = "3o099fcusuh31" as PlainDescriptor<
  [Binary, ParachainsDisputesDisputeLocation]
>
const evt_ParasDisputes_DisputeConcluded: PlainDescriptor<
  [Binary, ParachainsDisputesDisputeResult]
> = "fr2e7vm3bun8k" as PlainDescriptor<
  [Binary, ParachainsDisputesDisputeResult]
>
const evt_ParasDisputes_Revert: PlainDescriptor<number> =
  c34ha3jf7jm288 as PlainDescriptor<number>
const evt_Registrar_Registered: PlainDescriptor<{
  para_id: number
  manager: SS58String
}> = "bs22tt76qp5bi" as PlainDescriptor<{
  para_id: number
  manager: SS58String
}>
const evt_Registrar_Deregistered: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Registrar_Reserved: PlainDescriptor<{
  para_id: number
  who: SS58String
}> = "dn2ghub1o4i40" as PlainDescriptor<{ para_id: number; who: SS58String }>
const evt_Registrar_Swapped: PlainDescriptor<{
  para_id: number
  other_id: number
}> = "48u78djt89dod" as PlainDescriptor<{ para_id: number; other_id: number }>
const evt_Slots_NewLeasePeriod: PlainDescriptor<{ lease_period: number }> =
  "b85m5kfbepu2t" as PlainDescriptor<{ lease_period: number }>
const evt_Slots_Leased: PlainDescriptor<{
  para_id: number
  leaser: SS58String
  period_begin: number
  period_count: number
  extra_reserved: bigint
  total_amount: bigint
}> = "daml5bdhsfcsl" as PlainDescriptor<{
  para_id: number
  leaser: SS58String
  period_begin: number
  period_count: number
  extra_reserved: bigint
  total_amount: bigint
}>
const evt_Auctions_AuctionStarted: PlainDescriptor<{
  auction_index: number
  lease_period: number
  ending: number
}> = "eec0cu336gteb" as PlainDescriptor<{
  auction_index: number
  lease_period: number
  ending: number
}>
const evt_Auctions_AuctionClosed: PlainDescriptor<{ auction_index: number }> =
  "815d5k4ij85nv" as PlainDescriptor<{ auction_index: number }>
const evt_Auctions_Reserved: PlainDescriptor<{
  bidder: SS58String
  extra_reserved: bigint
  total_amount: bigint
}> = "fi98fgi9o46v7" as PlainDescriptor<{
  bidder: SS58String
  extra_reserved: bigint
  total_amount: bigint
}>
const evt_Auctions_Unreserved: PlainDescriptor<{
  bidder: SS58String
  amount: bigint
}> = "c0oj9tok33uap" as PlainDescriptor<{ bidder: SS58String; amount: bigint }>
const evt_Auctions_ReserveConfiscated: PlainDescriptor<{
  para_id: number
  leaser: SS58String
  amount: bigint
}> = "3tdutpfjuk32j" as PlainDescriptor<{
  para_id: number
  leaser: SS58String
  amount: bigint
}>
const evt_Auctions_BidAccepted: PlainDescriptor<{
  bidder: SS58String
  para_id: number
  amount: bigint
  first_slot: number
  last_slot: number
}> = "1esdujrkdacpb" as PlainDescriptor<{
  bidder: SS58String
  para_id: number
  amount: bigint
  first_slot: number
  last_slot: number
}>
const evt_Auctions_WinningOffset: PlainDescriptor<{
  auction_index: number
  block_number: number
}> = "9g1d820jf9m2s" as PlainDescriptor<{
  auction_index: number
  block_number: number
}>
const evt_Crowdloan_Created: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Crowdloan_Contributed: PlainDescriptor<{
  who: SS58String
  fund_index: number
  amount: bigint
}> = c8ve4g3egaln6a as PlainDescriptor<{
  who: SS58String
  fund_index: number
  amount: bigint
}>
const evt_Crowdloan_Withdrew: PlainDescriptor<{
  who: SS58String
  fund_index: number
  amount: bigint
}> = c8ve4g3egaln6a as PlainDescriptor<{
  who: SS58String
  fund_index: number
  amount: bigint
}>
const evt_Crowdloan_PartiallyRefunded: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Crowdloan_AllRefunded: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Crowdloan_Dissolved: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Crowdloan_HandleBidResult: PlainDescriptor<{
  para_id: number
  result: Anonymize<Idtdr91jmq5g4i>
}> = "f9e3ujpsfl4g7" as PlainDescriptor<{
  para_id: number
  result: Anonymize<Idtdr91jmq5g4i>
}>
const evt_Crowdloan_Edited: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_Crowdloan_MemoUpdated: PlainDescriptor<{
  who: SS58String
  para_id: number
  memo: Binary
}> = "f4hvqaeoqq5us" as PlainDescriptor<{
  who: SS58String
  para_id: number
  memo: Binary
}>
const evt_Crowdloan_AddedToNewRaise: PlainDescriptor<{ para_id: number }> =
  c37r4bdai8o9mp as PlainDescriptor<{ para_id: number }>
const evt_XcmPallet_Attempted: PlainDescriptor<{
  outcome: XcmV3TraitsOutcome
}> = "4e7dkr4hrus3u" as PlainDescriptor<{ outcome: XcmV3TraitsOutcome }>
const evt_XcmPallet_Sent: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  destination: Anonymize<I43cmiele6sevi>
  message: Anonymize<I8l0577387vghn>
  message_id: Binary
}> = "a5b8kts5gt3p5" as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  destination: Anonymize<I43cmiele6sevi>
  message: Anonymize<I8l0577387vghn>
  message_id: Binary
}>
const evt_XcmPallet_UnexpectedResponse: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_XcmPallet_ResponseReady: PlainDescriptor<{
  query_id: bigint
  response: XcmV3Response
}> = "7kkbgm2llu2o3" as PlainDescriptor<{
  query_id: bigint
  response: XcmV3Response
}>
const evt_XcmPallet_Notified: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_XcmPallet_NotifyOverweight: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
  actual_weight: Anonymize<I4q39t5hn830vp>
  max_budgeted_weight: Anonymize<I4q39t5hn830vp>
}> = "dg69klialbkb8" as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
  actual_weight: Anonymize<I4q39t5hn830vp>
  max_budgeted_weight: Anonymize<I4q39t5hn830vp>
}>
const evt_XcmPallet_NotifyDispatchError: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_XcmPallet_NotifyDecodeFailed: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_XcmPallet_InvalidResponder: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_location: Anonymize<I74hapqfd00s9i>
}> = "9j133okge3c2" as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_location: Anonymize<I74hapqfd00s9i>
}>
const evt_XcmPallet_InvalidResponderVersion: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_XcmPallet_ResponseTaken: PlainDescriptor<{ query_id: bigint }> =
  "30pg328m00nr3" as PlainDescriptor<{ query_id: bigint }>
const evt_XcmPallet_AssetsTrapped: PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}> = c5qm1bvb2j3ap2 as PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}>
const evt_XcmPallet_VersionChangeNotified: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  result: number
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = "95aqmsd6gjmqs" as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  result: number
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_XcmPallet_SupportedVersionChanged: PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}> = c732o5n04n5ohg as PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}>
const evt_XcmPallet_NotifyTargetSendFail: PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  query_id: bigint
  error: XcmV3TraitsError
}> = "arlf7ddo81fm5" as PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  query_id: bigint
  error: XcmV3TraitsError
}>
const evt_XcmPallet_NotifyTargetMigrationFail: PlainDescriptor<{
  location: XcmVersionedMultiLocation
  query_id: bigint
}> = "e9bjgclf7vho0" as PlainDescriptor<{
  location: XcmVersionedMultiLocation
  query_id: bigint
}>
const evt_XcmPallet_InvalidQuerierVersion: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_XcmPallet_InvalidQuerier: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_querier: Anonymize<I43cmiele6sevi>
  maybe_actual_querier: Anonymize<I74hapqfd00s9i>
}> = "7dm0nb8u3g2hv" as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_querier: Anonymize<I43cmiele6sevi>
  maybe_actual_querier: Anonymize<I74hapqfd00s9i>
}>
const evt_XcmPallet_VersionNotifyStarted: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_XcmPallet_VersionNotifyRequested: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_XcmPallet_VersionNotifyUnrequested: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_XcmPallet_FeesPaid: PlainDescriptor<{
  paying: Anonymize<I43cmiele6sevi>
  fees: Anonymize<Id7mn3j3ge1h6a>
}> = "bknqphki4flb3" as PlainDescriptor<{
  paying: Anonymize<I43cmiele6sevi>
  fees: Anonymize<Id7mn3j3ge1h6a>
}>
const evt_XcmPallet_AssetsClaimed: PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}> = c5qm1bvb2j3ap2 as PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}>
const evt_MessageQueue_ProcessingFailed: PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  error: ProcessMessageError
}> = "6ian27okrbc15" as PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  error: ProcessMessageError
}>
const evt_MessageQueue_Processed: PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  weight_used: Anonymize<I4q39t5hn830vp>
  success: boolean
}> = "74b8cu68dfbfr" as PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  weight_used: Anonymize<I4q39t5hn830vp>
  success: boolean
}>
const evt_MessageQueue_OverweightEnqueued: PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
  message_index: number
}> = "acc6dee8ffsrh" as PlainDescriptor<{
  id: Binary
  origin: ParachainsInclusionAggregateMessageOrigin
  page_index: number
  message_index: number
}>
const evt_MessageQueue_PageReaped: PlainDescriptor<{
  origin: ParachainsInclusionAggregateMessageOrigin
  index: number
}> = "elsom2b1kkdm6" as PlainDescriptor<{
  origin: ParachainsInclusionAggregateMessageOrigin
  index: number
}>
const evt_AssetRate_AssetRateCreated: PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}> = c16soggnee6qrb as PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  rate: bigint
}>
const evt_AssetRate_AssetRateRemoved: PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
}> = cfvnf1s3g2lg8u as PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
}>
const evt_AssetRate_AssetRateUpdated: PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  old: bigint
  new: bigint
}> = "edcb9b2srjfp0" as PlainDescriptor<{
  asset_kind: Anonymize<I32r9skkupsthv>
  old: bigint
  new: bigint
}>
const err_System_InvalidSpecName: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_System_SpecVersionNeedsToIncrease: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_System_FailedToExtractRuntimeVersion: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_System_NonDefaultComposite: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_System_NonZeroRefCount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_System_CallFiltered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Scheduler_FailedToSchedule: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Scheduler_NotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Scheduler_TargetBlockNumberInPast: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Scheduler_RescheduleNoChange: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Scheduler_Named: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_TooBig: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_AlreadyNoted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_NotAuthorized: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_NotNoted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_Requested: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_NotRequested: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_TooMany: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Preimage_TooFew: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Babe_InvalidEquivocationProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Babe_InvalidKeyOwnershipProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Babe_DuplicateOffenceReport: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Babe_InvalidConfiguration: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Indices_NotAssigned: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Indices_NotOwner: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Indices_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Indices_NotTransfer: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Indices_Permanent: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_VestingBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_LiquidityRestrictions: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_InsufficientBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_ExistentialDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_Expendability: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_ExistingVestingSchedule: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_DeadAccount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_TooManyReserves: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_TooManyHolds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Balances_TooManyFreezes: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_NotController: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_NotStash: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_AlreadyBonded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_AlreadyPaired: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_EmptyTargets: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_DuplicateIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_InvalidSlashIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_InsufficientBond: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_NoMoreChunks: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_NoUnlockChunk: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_FundedTarget: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_InvalidEraToReward: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_InvalidNumberOfNominations: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_NotSortedAndUnique: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_AlreadyClaimed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_IncorrectHistoryDepth: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_IncorrectSlashingSpans: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_BadState: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_TooManyTargets: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_BadTarget: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_CannotChillOther: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_TooManyNominators: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_TooManyValidators: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_CommissionTooLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Staking_BoundNotMet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Session_InvalidProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Session_NoAssociatedValidatorId: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Session_DuplicatedKey: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Session_NoKeys: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Session_NoAccount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_PauseFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_ResumeFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_ChangePending: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_TooSoon: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_InvalidKeyOwnershipProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_InvalidEquivocationProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Grandpa_DuplicateOffenceReport: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ImOnline_InvalidKey: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ImOnline_DuplicatedHeartbeat: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_InsufficientProposersBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_InvalidIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_TooManyApprovals: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_InsufficientPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_ProposalNotApproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_FailedToConvertBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_SpendExpired: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_EarlyPayout: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_AlreadyAttempted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_PayoutError: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_NotAttempted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Treasury_Inconclusive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_NotOngoing: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_NotVoter: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_NoPermissionYet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_AlreadyDelegating: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_AlreadyVoting: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_InsufficientFunds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_NotDelegating: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_Nonsense: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_MaxVotesReached: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_ClassNeeded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ConvictionVoting_BadClass: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_NotOngoing: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_HasDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_BadTrack: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_Full: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_QueueEmpty: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_BadReferendum: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_NothingToDo: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_NoTrack: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_Unfinished: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_NoDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_BadStatus: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Referenda_PreimageNotExist: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Whitelist_UnavailablePreImage: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Whitelist_UndecodableCall: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Whitelist_InvalidCallWeightWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Whitelist_CallIsNotWhitelisted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Whitelist_CallAlreadyWhitelisted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_InvalidEthereumSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_SignerHasNoClaim: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_SenderHasNoClaim: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_PotUnderflow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_InvalidStatement: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Claims_VestedBalanceExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Vesting_NotVesting: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Vesting_AtMaxVestingSchedules: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Vesting_AmountLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Vesting_ScheduleIndexOutOfBounds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Vesting_InvalidScheduleParams: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Utility_TooManyCalls: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_TooManySubAccounts: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_NotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_NotNamed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_EmptyIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_FeeChanged: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_NoIdentity: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_StickyJudgement: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_JudgementGiven: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_InvalidJudgement: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_InvalidIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_InvalidTarget: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_TooManyFields: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_TooManyRegistrars: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_AlreadyClaimed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_NotSub: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_NotOwned: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_JudgementForDifferentIdentity: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Identity_JudgementPaymentFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_TooMany: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_NotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_NotProxy: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_Unproxyable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_Duplicate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_Unannounced: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Proxy_NoSelfProxy: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_MinimumThreshold: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_AlreadyApproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_NoApprovalsNeeded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_TooFewSignatories: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_TooManySignatories: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_SignatoriesOutOfOrder: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_SenderInSignatories: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_NotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_NotOwner: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_NoTimepoint: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_WrongTimepoint: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_UnexpectedTimepoint: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_MaxWeightTooLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Multisig_AlreadyStored: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_InsufficientProposersBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_InvalidIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_ReasonTooBig: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_UnexpectedStatus: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_RequireCurator: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_InvalidValue: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_InvalidFee: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_PendingPayout: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_Premature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_HasActiveChildBounty: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Bounties_TooManyQueued: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ChildBounties_ParentBountyNotActive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ChildBounties_InsufficientBountyBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ChildBounties_TooManyChildBounties: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_PreDispatchEarlySubmission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_PreDispatchWrongWinnerCount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_PreDispatchWeakSubmission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_SignedQueueFull: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_SignedCannotPayDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_SignedInvalidWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_SignedTooMuchWeight: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_OcwCallWrongEra: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_MissingSnapshotMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_InvalidSubmissionIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_CallNotAllowed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_FallbackFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_BoundNotMet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ElectionProviderMultiPhase_TooManyWinners: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_VoterList_List: PlainDescriptor<BagsListListListError> =
  "21tm2cc55503s" as PlainDescriptor<BagsListListListError>
const err_NominationPools_PoolNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_PoolMemberNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_RewardPoolNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_SubPoolsNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_AccountBelongsToOtherPool: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_FullyUnbonding: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MaxUnbondingLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CannotWithdrawAny: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MinimumBondNotMet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_OverflowRisk: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NotDestroying: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NotNominator: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NotKickerOrDestroying: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NotOpen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MaxPools: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MaxPoolMembers: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CanNotChangeState: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_DoesNotHavePermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MetadataExceedsMaxLen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_Defensive: PlainDescriptor<NominationPoolsPalletDefensiveError> =
  "1fk6ftrl6iddq" as PlainDescriptor<NominationPoolsPalletDefensiveError>
const err_NominationPools_PartialUnbondNotAllowedPermissionlessly: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_MaxCommissionRestricted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CommissionExceedsMaximum: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CommissionExceedsGlobalMaximum: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CommissionChangeThrottled: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_CommissionChangeRateNotAllowed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NoPendingCommission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NoCommissionCurrentSet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_PoolIdInUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_InvalidPoolId: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_BondExtraRestricted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_NominationPools_NothingToAdjust: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_NotController: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_AlreadyQueued: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_NotFullyBonded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_NotQueued: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_AlreadyHead: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_FastUnstake_CallNotAllowed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Configuration_InvalidNewValue: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_UnsortedOrDuplicateValidatorIndices: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_UnsortedOrDuplicateDisputeStatementSet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_UnsortedOrDuplicateBackedCandidates: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_UnexpectedRelayParent: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_WrongBitfieldSize: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_BitfieldAllZeros: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_BitfieldDuplicateOrUnordered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_ValidatorIndexOutOfBounds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidBitfieldSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_UnscheduledCandidate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_CandidateScheduledBeforeParaFree: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_ScheduledOutOfOrder: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_HeadDataTooLarge: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_PrematureCodeUpgrade: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_NewCodeTooLarge: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_DisallowedRelayParent: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidAssignment: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidGroupIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InsufficientBacking: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidBacking: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_NotCollatorSigned: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_ValidationDataHashMismatch: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_IncorrectDownwardMessageHandling: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidUpwardMessages: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_HrmpWatermarkMishandling: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidOutboundHrmp: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_InvalidValidationCodeHash: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_ParaHeadMismatch: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInclusion_BitfieldReferencesFreedCore: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_TooManyInclusionInherents: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_InvalidParentHeader: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_CandidateConcludedInvalid: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_InherentOverweight: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_DisputeStatementsUnsortedOrDuplicates: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParaInherent_DisputeInvalid: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_NotRegistered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_CannotOnboard: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_CannotOffboard: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_CannotUpgrade: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_CannotDowngrade: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckStatementStale: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckStatementFuture: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckValidatorIndexOutOfBounds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckInvalidSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckDoubleVote: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_PvfCheckSubjectInvalid: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Paras_CannotUpgradeCode: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelToSelf: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelInvalidRecipient: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelZeroCapacity: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelCapacityExceedsLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelZeroMessageSize: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelMessageSizeExceedsLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelAlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelAlreadyRequested: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelLimitExceeded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_AcceptHrmpChannelDoesntExist: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_AcceptHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_AcceptHrmpChannelLimitExceeded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_CloseHrmpChannelUnauthorized: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_CloseHrmpChannelDoesntExist: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_CloseHrmpChannelAlreadyUnderway: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_CancelHrmpOpenChannelUnauthorized: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelDoesntExist: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_OpenHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_WrongWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Hrmp_ChannelCreationNotAuthorized: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_DuplicateDisputeStatementSets: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_AncientDisputeStatement: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_ValidatorIndexOutOfBounds: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_InvalidSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_DuplicateStatement: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_SingleSidedDispute: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_MaliciousBacker: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_MissingBackingVotes: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasDisputes_UnconfirmedDispute: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_InvalidKeyOwnershipProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_InvalidSessionIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_InvalidCandidateHash: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_InvalidValidatorIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_ValidatorIndexIdMismatch: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParasSlashing_DuplicateSlashingReport: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_NotRegistered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_AlreadyRegistered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_NotOwner: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_CodeTooLarge: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_HeadDataTooLarge: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_NotParachain: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_NotParathread: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_CannotDeregister: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_CannotDowngrade: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_CannotUpgrade: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_ParaLocked: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_NotReserved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_EmptyCode: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Registrar_CannotSwap: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Slots_ParaNotOnboarding: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Slots_LeaseError: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_AuctionInProgress: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_LeasePeriodInPast: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_ParaNotRegistered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_NotCurrentAuction: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_NotAuction: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_AuctionEnded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Auctions_AlreadyLeasedOut: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_FirstPeriodInPast: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_FirstPeriodTooFarInFuture: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_LastPeriodBeforeFirstPeriod: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_LastPeriodTooFarInFuture: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_CannotEndInPast: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_EndTooFarInFuture: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_Overflow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_ContributionTooSmall: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_InvalidParaId: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_CapExceeded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_ContributionPeriodOver: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_InvalidOrigin: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_NotParachain: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_LeaseActive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_BidOrLeaseActive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_FundNotEnded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_NoContributions: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_NotReadyToDissolve: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_InvalidSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_MemoTooLarge: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_AlreadyInNewRaise: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_VrfDelayInProgress: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Crowdloan_NoLeasePeriod: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_Unreachable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_SendFailure: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_Filtered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_UnweighableMessage: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_DestinationNotInvertible: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_Empty: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_CannotReanchor: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_TooManyAssets: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_InvalidOrigin: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_BadVersion: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_BadLocation: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_NoSubscription: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_AlreadySubscribed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_InvalidAsset: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_LowBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_TooManyLocks: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_AccountNotSovereign: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_FeesNotMet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_LockNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmPallet_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_NotReapable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_NoPage: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_NoMessage: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_AlreadyProcessed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_Queued: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_InsufficientWeight: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_TemporarilyUnprocessable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_MessageQueue_QueuePaused: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_AssetRate_UnknownAssetKind: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_AssetRate_AlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Beefy_InvalidKeyOwnershipProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Beefy_InvalidEquivocationProof: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Beefy_DuplicateOffenceReport: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Beefy_InvalidConfiguration: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const const_System_BlockWeights: PlainDescriptor<{
  base_block: Anonymize<I4q39t5hn830vp>
  max_block: Anonymize<I4q39t5hn830vp>
  per_class: Anonymize<I79te2qqsklnbd>
}> = "n7a38730s6qs" as PlainDescriptor<{
  base_block: Anonymize<I4q39t5hn830vp>
  max_block: Anonymize<I4q39t5hn830vp>
  per_class: Anonymize<I79te2qqsklnbd>
}>
const const_System_BlockLength: PlainDescriptor<{
  normal: number
  operational: number
  mandatory: number
}> = "f15el53dd76v9" as PlainDescriptor<{
  normal: number
  operational: number
  mandatory: number
}>
const const_System_BlockHashCount: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_System_DbWeight: PlainDescriptor<{ read: bigint; write: bigint }> =
  "9s0ave7t0vnrk" as PlainDescriptor<{ read: bigint; write: bigint }>
const const_System_Version: PlainDescriptor<{
  spec_name: string
  impl_name: string
  authoring_version: number
  spec_version: number
  impl_version: number
  apis: Anonymize<I1st1p92iu8h7e>
  transaction_version: number
  state_version: number
}> = "b5fo0fakl8rog" as PlainDescriptor<{
  spec_name: string
  impl_name: string
  authoring_version: number
  spec_version: number
  impl_version: number
  apis: Anonymize<I1st1p92iu8h7e>
  transaction_version: number
  state_version: number
}>
const const_System_SS58Prefix: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Scheduler_MaximumWeight: PlainDescriptor<{
  ref_time: bigint
  proof_size: bigint
}> = c4q39t5hn830vp as PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>
const const_Scheduler_MaxScheduledPerBlock: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Babe_EpochDuration: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Babe_ExpectedBlockTime: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Babe_MaxAuthorities: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Babe_MaxNominators: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Timestamp_MinimumPeriod: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Indices_Deposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Balances_ExistentialDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Balances_MaxLocks: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Balances_MaxReserves: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Balances_MaxHolds: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Balances_MaxFreezes: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_TransactionPayment_OperationalFeeMultiplier: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_HistoryDepth: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_SessionsPerEra: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_BondingDuration: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_SlashDeferDuration: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_MaxNominatorRewardedPerValidator: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Staking_MaxUnlockingChunks: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Grandpa_MaxAuthorities: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Grandpa_MaxNominators: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Grandpa_MaxSetIdSessionEntries: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ImOnline_UnsignedPriority: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Treasury_ProposalBond: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Treasury_ProposalBondMinimum: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Treasury_ProposalBondMaximum: PlainDescriptor<bigint | undefined> =
  c35p85j063s0il as PlainDescriptor<bigint | undefined>
const const_Treasury_SpendPeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Treasury_Burn: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Treasury_PalletId: PlainDescriptor<Binary> =
  c7l9d2ilde057d as PlainDescriptor<Binary>
const const_Treasury_MaxApprovals: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Treasury_PayoutPeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ConvictionVoting_MaxVotes: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ConvictionVoting_VoteLockingPeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Referenda_SubmissionDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Referenda_MaxQueued: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Referenda_UndecidingTimeout: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Referenda_AlarmInterval: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Referenda_Tracks: PlainDescriptor<
  Array<Anonymize<Ida9vhl30l98p4>>
> = "bafpkl9hhno69" as PlainDescriptor<Array<Anonymize<Ida9vhl30l98p4>>>
const const_Claims_Prefix: PlainDescriptor<Binary> =
  "51jgofmopm9om" as PlainDescriptor<Binary>
const const_Vesting_MinVestedTransfer: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Vesting_MaxVestingSchedules: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Utility_batched_calls_limit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Identity_BasicDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Identity_FieldDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Identity_SubAccountDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Identity_MaxSubAccounts: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Identity_MaxAdditionalFields: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Identity_MaxRegistrars: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Proxy_ProxyDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Proxy_ProxyDepositFactor: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Proxy_MaxProxies: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Proxy_MaxPending: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Proxy_AnnouncementDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Proxy_AnnouncementDepositFactor: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Multisig_DepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Multisig_DepositFactor: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Multisig_MaxSignatories: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Bounties_BountyDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Bounties_BountyDepositPayoutDelay: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Bounties_BountyUpdatePeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Bounties_CuratorDepositMultiplier: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Bounties_CuratorDepositMax: PlainDescriptor<bigint | undefined> =
  c35p85j063s0il as PlainDescriptor<bigint | undefined>
const const_Bounties_CuratorDepositMin: PlainDescriptor<bigint | undefined> =
  c35p85j063s0il as PlainDescriptor<bigint | undefined>
const const_Bounties_BountyValueMinimum: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Bounties_DataDepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Bounties_MaximumReasonLength: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ChildBounties_MaxActiveChildBountyCount: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ChildBounties_ChildBountyValueMinimum: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ElectionProviderMultiPhase_UnsignedPhase: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_SignedPhase: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_BetterSignedThreshold: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_BetterUnsignedThreshold: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_OffchainRepeat: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_MinerTxPriority: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ElectionProviderMultiPhase_SignedMaxSubmissions: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_SignedMaxWeight: PlainDescriptor<{
  ref_time: bigint
  proof_size: bigint
}> = c4q39t5hn830vp as PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>
const const_ElectionProviderMultiPhase_SignedMaxRefunds: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_SignedRewardBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ElectionProviderMultiPhase_SignedDepositByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ElectionProviderMultiPhase_SignedDepositWeight: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ElectionProviderMultiPhase_MaxWinners: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_MinerMaxLength: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_MinerMaxWeight: PlainDescriptor<{
  ref_time: bigint
  proof_size: bigint
}> = c4q39t5hn830vp as PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>
const const_ElectionProviderMultiPhase_MinerMaxVotesPerVoter: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ElectionProviderMultiPhase_MinerMaxWinners: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_VoterList_BagThresholds: PlainDescriptor<Array<bigint>> =
  "afqnechp3omqg" as PlainDescriptor<Array<bigint>>
const const_NominationPools_PalletId: PlainDescriptor<Binary> =
  c7l9d2ilde057d as PlainDescriptor<Binary>
const const_NominationPools_MaxPointsToBalance: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_FastUnstake_Deposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Paras_UnsignedPriority: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Registrar_ParaDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Registrar_DataDepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Slots_LeasePeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Slots_LeaseOffset: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Auctions_EndingPeriod: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Auctions_SampleLength: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Auctions_SlotRangeCount: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Auctions_LeasePeriodsPerSlot: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Crowdloan_PalletId: PlainDescriptor<Binary> =
  c7l9d2ilde057d as PlainDescriptor<Binary>
const const_Crowdloan_MinContribution: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Crowdloan_RemoveKeysLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_MessageQueue_HeapSize: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_MessageQueue_MaxStale: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_MessageQueue_ServiceWeight: PlainDescriptor<
  Anonymize<I4q39t5hn830vp> | undefined
> = "asb8k6ash5mjn" as PlainDescriptor<Anonymize<I4q39t5hn830vp> | undefined>
const const_Beefy_MaxAuthorities: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Beefy_MaxNominators: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Beefy_MaxSetIdSessionEntries: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const runtime_Core_version: RuntimeDescriptor<
  [],
  {
    spec_name: string
    impl_name: string
    authoring_version: number
    spec_version: number
    impl_version: number
    apis: Anonymize<I1st1p92iu8h7e>
    transaction_version: number
    state_version: number
  }
> = "bckjab5tbgn0d" as RuntimeDescriptor<
  [],
  {
    spec_name: string
    impl_name: string
    authoring_version: number
    spec_version: number
    impl_version: number
    apis: Anonymize<I1st1p92iu8h7e>
    transaction_version: number
    state_version: number
  }
>
const runtime_Core_execute_block: RuntimeDescriptor<
  [
    block: {
      header: Anonymize<I6t1nedlt7mobn>
      extrinsics: Anonymize<Itom7fk49o0c9>
    },
  ],
  undefined
> = "etd7e8evd7agp" as RuntimeDescriptor<
  [
    block: {
      header: Anonymize<I6t1nedlt7mobn>
      extrinsics: Anonymize<Itom7fk49o0c9>
    },
  ],
  undefined
>
const runtime_Core_initialize_block: RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  undefined
> = "2lnjmv4e9dljk" as RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  undefined
>
const runtime_Metadata_metadata: RuntimeDescriptor<[], Binary> =
  "57k61dni7tq1q" as RuntimeDescriptor<[], Binary>
const runtime_Metadata_metadata_at_version: RuntimeDescriptor<
  [version: number],
  Binary | undefined
> = "6s9tg3j576u36" as RuntimeDescriptor<[version: number], Binary | undefined>
const runtime_Metadata_metadata_versions: RuntimeDescriptor<
  [],
  Array<number>
> = "64k0v4qcjg4rj" as RuntimeDescriptor<[], Array<number>>
const runtime_BlockBuilder_apply_extrinsic: RuntimeDescriptor<
  [extrinsic: Binary],
  ResultPayload<Anonymize<Idtdr91jmq5g4i>, TransactionValidityError>
> = "1pgfbek4i461t" as RuntimeDescriptor<
  [extrinsic: Binary],
  ResultPayload<Anonymize<Idtdr91jmq5g4i>, TransactionValidityError>
>
const runtime_BlockBuilder_finalize_block: RuntimeDescriptor<
  [],
  {
    parent_hash: Binary
    number: number
    state_root: Binary
    extrinsics_root: Binary
    digest: Anonymize<Idin6nhq46lvdj>
  }
> = "anacqk7csnask" as RuntimeDescriptor<
  [],
  {
    parent_hash: Binary
    number: number
    state_root: Binary
    extrinsics_root: Binary
    digest: Anonymize<Idin6nhq46lvdj>
  }
>
const runtime_BlockBuilder_inherent_extrinsics: RuntimeDescriptor<
  [inherent: Array<Anonymize<I1kbn2golmm2dm>>],
  Array<Binary>
> = "69ch9obc52eu6" as RuntimeDescriptor<
  [inherent: Array<Anonymize<I1kbn2golmm2dm>>],
  Array<Binary>
>
const runtime_BlockBuilder_check_inherents: RuntimeDescriptor<
  [
    block: {
      header: Anonymize<I6t1nedlt7mobn>
      extrinsics: Anonymize<Itom7fk49o0c9>
    },
    data: Array<Anonymize<I1kbn2golmm2dm>>,
  ],
  { okay: boolean; fatal_error: boolean; errors: Anonymize<If39abi8floaaf> }
> = "cnpijjh9g0g79" as RuntimeDescriptor<
  [
    block: {
      header: Anonymize<I6t1nedlt7mobn>
      extrinsics: Anonymize<Itom7fk49o0c9>
    },
    data: Array<Anonymize<I1kbn2golmm2dm>>,
  ],
  { okay: boolean; fatal_error: boolean; errors: Anonymize<If39abi8floaaf> }
>
const runtime_NominationPoolsApi_pending_rewards: RuntimeDescriptor<
  [who: SS58String],
  bigint
> = "9i239bcvd7kdu" as RuntimeDescriptor<[who: SS58String], bigint>
const runtime_NominationPoolsApi_points_to_balance: RuntimeDescriptor<
  [pool_id: number, points: bigint],
  bigint
> = "8tt6tg1g1segl" as RuntimeDescriptor<
  [pool_id: number, points: bigint],
  bigint
>
const runtime_NominationPoolsApi_balance_to_points: RuntimeDescriptor<
  [pool_id: number, new_funds: bigint],
  bigint
> = "6ej802meceeod" as RuntimeDescriptor<
  [pool_id: number, new_funds: bigint],
  bigint
>
const runtime_StakingApi_nominations_quota: RuntimeDescriptor<
  [balance: bigint],
  number
> = "brcm9ou4h5d32" as RuntimeDescriptor<[balance: bigint], number>
const runtime_TaggedTransactionQueue_validate_transaction: RuntimeDescriptor<
  [
    source: TransactionValidityTransactionSource,
    tx: Binary,
    block_hash: Binary,
  ],
  ResultPayload<Anonymize<I6g5lcd9vf2cr0>, TransactionValidityError>
> = "7v3l8ub2dan4" as RuntimeDescriptor<
  [
    source: TransactionValidityTransactionSource,
    tx: Binary,
    block_hash: Binary,
  ],
  ResultPayload<Anonymize<I6g5lcd9vf2cr0>, TransactionValidityError>
>
const runtime_OffchainWorkerApi_offchain_worker: RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  undefined
> = "2lnjmv4e9dljk" as RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  undefined
>
const runtime_ParachainHost_validators: RuntimeDescriptor<
  [],
  Array<Binary>
> = "2tjq7ncksi1hj" as RuntimeDescriptor<[], Array<Binary>>
const runtime_ParachainHost_validator_groups: RuntimeDescriptor<
  [],
  [Anonymize<Iarlj3qd8u1v13>, Anonymize<I94uslvmqboam8>]
> = "2l2qs25mbqi3l" as RuntimeDescriptor<
  [],
  [Anonymize<Iarlj3qd8u1v13>, Anonymize<I94uslvmqboam8>]
>
const runtime_ParachainHost_availability_cores: RuntimeDescriptor<
  [],
  Array<PolkadotPrimitivesV5CoreState>
> = "34d26ic4dpmld" as RuntimeDescriptor<
  [],
  Array<PolkadotPrimitivesV5CoreState>
>
const runtime_ParachainHost_persisted_validation_data: RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Anonymize<I5r8ef6aie125l> | undefined
> = "ahdhorm1njpaj" as RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Anonymize<I5r8ef6aie125l> | undefined
>
const runtime_ParachainHost_assumed_validation_data: RuntimeDescriptor<
  [para_id: number, expected_persisted_validation_data_hash: Binary],
  Anonymize<I9rov8gdjkv3b9> | undefined
> = "6dim566dra8pm" as RuntimeDescriptor<
  [para_id: number, expected_persisted_validation_data_hash: Binary],
  Anonymize<I9rov8gdjkv3b9> | undefined
>
const runtime_ParachainHost_check_validation_outputs: RuntimeDescriptor<
  [
    para_id: number,
    outputs: {
      upward_messages: Anonymize<Itom7fk49o0c9>
      horizontal_messages: Anonymize<I6r5cbv8ttrb09>
      new_validation_code: Anonymize<Iabpgqcjikia83>
      head_data: Binary
      processed_downward_messages: number
      hrmp_watermark: number
    },
  ],
  boolean
> = "7ac5amfbp9nh6" as RuntimeDescriptor<
  [
    para_id: number,
    outputs: {
      upward_messages: Anonymize<Itom7fk49o0c9>
      horizontal_messages: Anonymize<I6r5cbv8ttrb09>
      new_validation_code: Anonymize<Iabpgqcjikia83>
      head_data: Binary
      processed_downward_messages: number
      hrmp_watermark: number
    },
  ],
  boolean
>
const runtime_ParachainHost_session_index_for_child: RuntimeDescriptor<
  [],
  number
> = "5kdm82a42hnhk" as RuntimeDescriptor<[], number>
const runtime_ParachainHost_validation_code: RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Binary | undefined
> = "ckdan58a602bd" as RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Binary | undefined
>
const runtime_ParachainHost_candidate_pending_availability: RuntimeDescriptor<
  [para_id: number],
  Anonymize<Iedmhjqij0hr8g> | undefined
> = "dmhi3h77v35n" as RuntimeDescriptor<
  [para_id: number],
  Anonymize<Iedmhjqij0hr8g> | undefined
>
const runtime_ParachainHost_candidate_events: RuntimeDescriptor<
  [],
  Array<PolkadotPrimitivesV5CandidateEvent>
> = "f51o56v7ot5sa" as RuntimeDescriptor<
  [],
  Array<PolkadotPrimitivesV5CandidateEvent>
>
const runtime_ParachainHost_dmq_contents: RuntimeDescriptor<
  [recipient: number],
  Array<Anonymize<I60847k37jfcc6>>
> = "4dcsp55rkhols" as RuntimeDescriptor<
  [recipient: number],
  Array<Anonymize<I60847k37jfcc6>>
>
const runtime_ParachainHost_inbound_hrmp_channels_contents: RuntimeDescriptor<
  [recipient: number],
  Array<Anonymize<I9hvej6h53dqj0>>
> = "4et4b0kbi7l1b" as RuntimeDescriptor<
  [recipient: number],
  Array<Anonymize<I9hvej6h53dqj0>>
>
const runtime_ParachainHost_validation_code_by_hash: RuntimeDescriptor<
  [hash: Binary],
  Binary | undefined
> = "bhlals2nhjo4" as RuntimeDescriptor<[hash: Binary], Binary | undefined>
const runtime_ParachainHost_on_chain_votes: RuntimeDescriptor<
  [],
  Anonymize<I3qttgoifdk5v6> | undefined
> = "25larldjn3uar" as RuntimeDescriptor<
  [],
  Anonymize<I3qttgoifdk5v6> | undefined
>
const runtime_ParachainHost_session_info: RuntimeDescriptor<
  [index: number],
  Anonymize<I7k9oi9p83j43l> | undefined
> = "f44r7k25km7rl" as RuntimeDescriptor<
  [index: number],
  Anonymize<I7k9oi9p83j43l> | undefined
>
const runtime_ParachainHost_submit_pvf_check_statement: RuntimeDescriptor<
  [
    stmt: {
      accept: boolean
      subject: Binary
      session_index: number
      validator_index: number
    },
    signature: Binary,
  ],
  undefined
> = "156a4rikarf9m" as RuntimeDescriptor<
  [
    stmt: {
      accept: boolean
      subject: Binary
      session_index: number
      validator_index: number
    },
    signature: Binary,
  ],
  undefined
>
const runtime_ParachainHost_pvfs_require_precheck: RuntimeDescriptor<
  [],
  Array<Binary>
> = "2tjq7ncksi1hj" as RuntimeDescriptor<[], Array<Binary>>
const runtime_ParachainHost_validation_code_hash: RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Binary | undefined
> = "86ckgu3oplhf6" as RuntimeDescriptor<
  [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
  Binary | undefined
>
const runtime_ParachainHost_disputes: RuntimeDescriptor<
  [],
  Array<Anonymize<Irsmd7gp7po60>>
> = "cne3bdfipu9lt" as RuntimeDescriptor<[], Array<Anonymize<Irsmd7gp7po60>>>
const runtime_ParachainHost_session_executor_params: RuntimeDescriptor<
  [session_index: number],
  Anonymize<I6sbufrhmgqdb6> | undefined
> = "aqgq4gd2di33d" as RuntimeDescriptor<
  [session_index: number],
  Anonymize<I6sbufrhmgqdb6> | undefined
>
const runtime_ParachainHost_unapplied_slashes: RuntimeDescriptor<
  [],
  Array<Anonymize<I5ork0l271qluj>>
> = "adhvdm4odvv70" as RuntimeDescriptor<[], Array<Anonymize<I5ork0l271qluj>>>
const runtime_ParachainHost_key_ownership_proof: RuntimeDescriptor<
  [validator_id: Binary],
  Binary | undefined
> = "51krimg7evbqt" as RuntimeDescriptor<
  [validator_id: Binary],
  Binary | undefined
>
const runtime_ParachainHost_submit_report_dispute_lost: RuntimeDescriptor<
  [
    dispute_proof: {
      time_slot: Anonymize<Ib0p1u8q0nho37>
      kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
      validator_index: number
      validator_id: Binary
    },
    key_ownership_proof: Binary,
  ],
  boolean
> = "6beaf16n6ga3p" as RuntimeDescriptor<
  [
    dispute_proof: {
      time_slot: Anonymize<Ib0p1u8q0nho37>
      kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
      validator_index: number
      validator_id: Binary
    },
    key_ownership_proof: Binary,
  ],
  boolean
>
const runtime_ParachainHost_minimum_backing_votes: RuntimeDescriptor<
  [],
  number
> = "5kdm82a42hnhk" as RuntimeDescriptor<[], number>
const runtime_ParachainHost_para_backing_state: RuntimeDescriptor<
  [_: number],
  Anonymize<I53uro0ns8ba5b> | undefined
> = "96f0io5cu28uq" as RuntimeDescriptor<
  [_: number],
  Anonymize<I53uro0ns8ba5b> | undefined
>
const runtime_ParachainHost_async_backing_params: RuntimeDescriptor<
  [],
  { max_candidate_depth: number; allowed_ancestry_len: number }
> = "3o7ksjk7qbal3" as RuntimeDescriptor<
  [],
  { max_candidate_depth: number; allowed_ancestry_len: number }
>
const runtime_ParachainHost_disabled_validators: RuntimeDescriptor<
  [],
  Array<number>
> = "64k0v4qcjg4rj" as RuntimeDescriptor<[], Array<number>>
const runtime_BeefyApi_beefy_genesis: RuntimeDescriptor<
  [],
  number | undefined
> = "2lqngfidsjia" as RuntimeDescriptor<[], number | undefined>
const runtime_BeefyApi_validator_set: RuntimeDescriptor<
  [],
  Anonymize<I17bb7o70l1ke3> | undefined
> = "8t9ag0905fer5" as RuntimeDescriptor<
  [],
  Anonymize<I17bb7o70l1ke3> | undefined
>
const runtime_BeefyApi_submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
  [
    equivocation_proof: {
      first: Anonymize<Ifukb31gb9emjd>
      second: Anonymize<Ifukb31gb9emjd>
    },
    key_owner_proof: Binary,
  ],
  boolean
> = "aevemnfkodffb" as RuntimeDescriptor<
  [
    equivocation_proof: {
      first: Anonymize<Ifukb31gb9emjd>
      second: Anonymize<Ifukb31gb9emjd>
    },
    key_owner_proof: Binary,
  ],
  boolean
>
const runtime_BeefyApi_generate_key_ownership_proof: RuntimeDescriptor<
  [set_id: bigint, authority_id: Binary],
  Binary | undefined
> = "bp5tmqibnocla" as RuntimeDescriptor<
  [set_id: bigint, authority_id: Binary],
  Binary | undefined
>
const runtime_MmrApi_mmr_root: RuntimeDescriptor<
  [],
  ResultPayload<Binary, MmrPrimitivesError>
> = "d0t5emn06irpm" as RuntimeDescriptor<
  [],
  ResultPayload<Binary, MmrPrimitivesError>
>
const runtime_MmrApi_mmr_leaf_count: RuntimeDescriptor<
  [],
  ResultPayload<bigint, MmrPrimitivesError>
> = "f67nhstfojq8e" as RuntimeDescriptor<
  [],
  ResultPayload<bigint, MmrPrimitivesError>
>
const runtime_MmrApi_generate_proof: RuntimeDescriptor<
  [block_numbers: Array<number>, best_known_block_number: number | undefined],
  ResultPayload<Anonymize<If93480lp8rssc>, MmrPrimitivesError>
> = "flul6i3tbh308" as RuntimeDescriptor<
  [block_numbers: Array<number>, best_known_block_number: number | undefined],
  ResultPayload<Anonymize<If93480lp8rssc>, MmrPrimitivesError>
>
const runtime_MmrApi_verify_proof: RuntimeDescriptor<
  [
    leaves: Array<Binary>,
    proof: {
      leaf_indices: Anonymize<Iafqnechp3omqg>
      leaf_count: bigint
      items: Anonymize<Idhnf6rtqoslea>
    },
  ],
  ResultPayload<undefined, MmrPrimitivesError>
> = "filfm8m2rpcos" as RuntimeDescriptor<
  [
    leaves: Array<Binary>,
    proof: {
      leaf_indices: Anonymize<Iafqnechp3omqg>
      leaf_count: bigint
      items: Anonymize<Idhnf6rtqoslea>
    },
  ],
  ResultPayload<undefined, MmrPrimitivesError>
>
const runtime_MmrApi_verify_proof_stateless: RuntimeDescriptor<
  [
    root: Binary,
    leaves: Array<Binary>,
    proof: {
      leaf_indices: Anonymize<Iafqnechp3omqg>
      leaf_count: bigint
      items: Anonymize<Idhnf6rtqoslea>
    },
  ],
  ResultPayload<undefined, MmrPrimitivesError>
> = "7l16q2gl8950m" as RuntimeDescriptor<
  [
    root: Binary,
    leaves: Array<Binary>,
    proof: {
      leaf_indices: Anonymize<Iafqnechp3omqg>
      leaf_count: bigint
      items: Anonymize<Idhnf6rtqoslea>
    },
  ],
  ResultPayload<undefined, MmrPrimitivesError>
>
const runtime_BeefyMmrApi_authority_set_proof: RuntimeDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary }
> = "esom3oc644tt8" as RuntimeDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary }
>
const runtime_BeefyMmrApi_next_authority_set_proof: RuntimeDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary }
> = "esom3oc644tt8" as RuntimeDescriptor<
  [],
  { id: bigint; len: number; keyset_commitment: Binary }
>
const runtime_GrandpaApi_grandpa_authorities: RuntimeDescriptor<
  [],
  Array<Anonymize<I3iuggguvi9njj>>
> = "42oj3l6qgi9il" as RuntimeDescriptor<[], Array<Anonymize<I3iuggguvi9njj>>>
const runtime_GrandpaApi_submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
  [
    equivocation_proof: { set_id: bigint; equivocation: GrandpaEquivocation },
    key_owner_proof: Binary,
  ],
  boolean
> = "brn6vo9bp0vkf" as RuntimeDescriptor<
  [
    equivocation_proof: { set_id: bigint; equivocation: GrandpaEquivocation },
    key_owner_proof: Binary,
  ],
  boolean
>
const runtime_GrandpaApi_generate_key_ownership_proof: RuntimeDescriptor<
  [set_id: bigint, authority_id: Binary],
  Binary | undefined
> = "7pgcvj2lrvoco" as RuntimeDescriptor<
  [set_id: bigint, authority_id: Binary],
  Binary | undefined
>
const runtime_GrandpaApi_current_set_id: RuntimeDescriptor<[], bigint> =
  "b54qab7tpjjsf" as RuntimeDescriptor<[], bigint>
const runtime_BabeApi_configuration: RuntimeDescriptor<
  [],
  {
    slot_duration: bigint
    epoch_length: bigint
    c: Anonymize<I2j729bmgsdiuo>
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    allowed_slots: BabeAllowedSlots
  }
> = "2u3ba9266gu5i" as RuntimeDescriptor<
  [],
  {
    slot_duration: bigint
    epoch_length: bigint
    c: Anonymize<I2j729bmgsdiuo>
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    allowed_slots: BabeAllowedSlots
  }
>
const runtime_BabeApi_current_epoch_start: RuntimeDescriptor<[], bigint> =
  "b54qab7tpjjsf" as RuntimeDescriptor<[], bigint>
const runtime_BabeApi_current_epoch: RuntimeDescriptor<
  [],
  {
    epoch_index: bigint
    start_slot: bigint
    duration: bigint
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    config: Anonymize<Idkva8q2m9meg0>
  }
> = "67iiqsn0vc7uk" as RuntimeDescriptor<
  [],
  {
    epoch_index: bigint
    start_slot: bigint
    duration: bigint
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    config: Anonymize<Idkva8q2m9meg0>
  }
>
const runtime_BabeApi_next_epoch: RuntimeDescriptor<
  [],
  {
    epoch_index: bigint
    start_slot: bigint
    duration: bigint
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    config: Anonymize<Idkva8q2m9meg0>
  }
> = "67iiqsn0vc7uk" as RuntimeDescriptor<
  [],
  {
    epoch_index: bigint
    start_slot: bigint
    duration: bigint
    authorities: Anonymize<I2qinct8jq4bqe>
    randomness: Binary
    config: Anonymize<Idkva8q2m9meg0>
  }
>
const runtime_BabeApi_generate_key_ownership_proof: RuntimeDescriptor<
  [slot: bigint, authority_id: Binary],
  Binary | undefined
> = "29qdvifd7f7h8" as RuntimeDescriptor<
  [slot: bigint, authority_id: Binary],
  Binary | undefined
>
const runtime_BabeApi_submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
  [
    equivocation_proof: {
      offender: Binary
      slot: bigint
      first_header: Anonymize<I6t1nedlt7mobn>
      second_header: Anonymize<I6t1nedlt7mobn>
    },
    key_owner_proof: Binary,
  ],
  boolean
> = "66g8om8g9vie3" as RuntimeDescriptor<
  [
    equivocation_proof: {
      offender: Binary
      slot: bigint
      first_header: Anonymize<I6t1nedlt7mobn>
      second_header: Anonymize<I6t1nedlt7mobn>
    },
    key_owner_proof: Binary,
  ],
  boolean
>
const runtime_AuthorityDiscoveryApi_authorities: RuntimeDescriptor<
  [],
  Array<Binary>
> = "2tjq7ncksi1hj" as RuntimeDescriptor<[], Array<Binary>>
const runtime_SessionKeys_generate_session_keys: RuntimeDescriptor<
  [seed: Binary | undefined],
  Binary
> = "66l59qralgdd4" as RuntimeDescriptor<[seed: Binary | undefined], Binary>
const runtime_SessionKeys_decode_session_keys: RuntimeDescriptor<
  [encoded: Binary],
  Anonymize<I4gkfq1hbsjrle> | undefined
> = "5kfkb20lni12j" as RuntimeDescriptor<
  [encoded: Binary],
  Anonymize<I4gkfq1hbsjrle> | undefined
>
const runtime_AccountNonceApi_account_nonce: RuntimeDescriptor<
  [account: SS58String],
  number
> = "6hhhkoebr077h" as RuntimeDescriptor<[account: SS58String], number>
const runtime_TransactionPaymentApi_query_info: RuntimeDescriptor<
  [uxt: Binary, len: number],
  {
    weight: Anonymize<I4q39t5hn830vp>
    class: DispatchClass
    partial_fee: bigint
  }
> = "18btbc6sp470m" as RuntimeDescriptor<
  [uxt: Binary, len: number],
  {
    weight: Anonymize<I4q39t5hn830vp>
    class: DispatchClass
    partial_fee: bigint
  }
>
const runtime_TransactionPaymentApi_query_fee_details: RuntimeDescriptor<
  [uxt: Binary, len: number],
  { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
> = "c4cp9g5l2rts5" as RuntimeDescriptor<
  [uxt: Binary, len: number],
  { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
>
const runtime_TransactionPaymentApi_query_weight_to_fee: RuntimeDescriptor<
  [weight: { ref_time: bigint; proof_size: bigint }],
  bigint
> = "9fha9spid57qj" as RuntimeDescriptor<
  [weight: { ref_time: bigint; proof_size: bigint }],
  bigint
>
const runtime_TransactionPaymentApi_query_length_to_fee: RuntimeDescriptor<
  [length: number],
  bigint
> = "5a7vbbavuk0jq" as RuntimeDescriptor<[length: number], bigint>
const runtime_TransactionPaymentCallApi_query_call_info: RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        Scheduler: Anonymize<I1abrp8gjcpfc>
        Preimage: Anonymize<Imbphi6s5kus8>
        Babe: Anonymize<BabePalletCall>
        Timestamp: Anonymize<TimestampPalletCall>
        Indices: Anonymize<IndicesPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        Staking: Anonymize<StakingPalletCall>
        Session: Anonymize<I454da453jskvn>
        Grandpa: Anonymize<GrandpaPalletCall>
        ImOnline: Anonymize<ImOnlinePalletCall>
        Treasury: Anonymize<Ibiic8ba5o502g>
        ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
        Referenda: Anonymize<ReferendaPalletCall>
        Whitelist: Anonymize<I51p8lm6kqdnho>
        Claims: Anonymize<ClaimsPalletCall>
        Vesting: Anonymize<VestingPalletCall>
        Utility: Anonymize<Iap9gdffi2u6nu>
        Identity: Anonymize<IdentityPalletCall>
        Proxy: Anonymize<Idedbf4rqpdmri>
        Multisig: Anonymize<Idd2oimlrnr76q>
        Bounties: Anonymize<BountiesPalletCall>
        ChildBounties: Anonymize<ChildBountiesPalletCall>
        ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
        VoterList: Anonymize<BagsListPalletCall>
        NominationPools: Anonymize<I29f4027kh5dho>
        FastUnstake: Anonymize<FastUnstakePalletCall>
        Configuration: Anonymize<ParachainsConfigurationPalletCall>
        ParasShared: Anonymize<undefined>
        ParaInclusion: Anonymize<undefined>
        ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
        Paras: Anonymize<ParachainsParasPalletCall>
        Initializer: Anonymize<ParachainsInitializerPalletCall>
        Hrmp: Anonymize<I2vev2224bc186>
        ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
        ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
        Registrar: Anonymize<CommonParasRegistrarPalletCall>
        Slots: Anonymize<CommonSlotsPalletCall>
        Auctions: Anonymize<CommonAuctionsPalletCall>
        Crowdloan: Anonymize<CommonCrowdloanPalletCall>
        XcmPallet: Anonymize<XcmPalletCall>
        MessageQueue: Anonymize<MessageQueuePalletCall>
        AssetRate: Anonymize<I2gv42mnmfo4fm>
        Beefy: Anonymize<Ibeddosggop7dd>
      }>
    >,
    len: number,
  ],
  {
    weight: Anonymize<I4q39t5hn830vp>
    class: DispatchClass
    partial_fee: bigint
  }
> = "6a557qjps4r0d" as RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        Scheduler: Anonymize<I1abrp8gjcpfc>
        Preimage: Anonymize<Imbphi6s5kus8>
        Babe: Anonymize<BabePalletCall>
        Timestamp: Anonymize<TimestampPalletCall>
        Indices: Anonymize<IndicesPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        Staking: Anonymize<StakingPalletCall>
        Session: Anonymize<I454da453jskvn>
        Grandpa: Anonymize<GrandpaPalletCall>
        ImOnline: Anonymize<ImOnlinePalletCall>
        Treasury: Anonymize<Ibiic8ba5o502g>
        ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
        Referenda: Anonymize<ReferendaPalletCall>
        Whitelist: Anonymize<I51p8lm6kqdnho>
        Claims: Anonymize<ClaimsPalletCall>
        Vesting: Anonymize<VestingPalletCall>
        Utility: Anonymize<Iap9gdffi2u6nu>
        Identity: Anonymize<IdentityPalletCall>
        Proxy: Anonymize<Idedbf4rqpdmri>
        Multisig: Anonymize<Idd2oimlrnr76q>
        Bounties: Anonymize<BountiesPalletCall>
        ChildBounties: Anonymize<ChildBountiesPalletCall>
        ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
        VoterList: Anonymize<BagsListPalletCall>
        NominationPools: Anonymize<I29f4027kh5dho>
        FastUnstake: Anonymize<FastUnstakePalletCall>
        Configuration: Anonymize<ParachainsConfigurationPalletCall>
        ParasShared: Anonymize<undefined>
        ParaInclusion: Anonymize<undefined>
        ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
        Paras: Anonymize<ParachainsParasPalletCall>
        Initializer: Anonymize<ParachainsInitializerPalletCall>
        Hrmp: Anonymize<I2vev2224bc186>
        ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
        ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
        Registrar: Anonymize<CommonParasRegistrarPalletCall>
        Slots: Anonymize<CommonSlotsPalletCall>
        Auctions: Anonymize<CommonAuctionsPalletCall>
        Crowdloan: Anonymize<CommonCrowdloanPalletCall>
        XcmPallet: Anonymize<XcmPalletCall>
        MessageQueue: Anonymize<MessageQueuePalletCall>
        AssetRate: Anonymize<I2gv42mnmfo4fm>
        Beefy: Anonymize<Ibeddosggop7dd>
      }>
    >,
    len: number,
  ],
  {
    weight: Anonymize<I4q39t5hn830vp>
    class: DispatchClass
    partial_fee: bigint
  }
>
const runtime_TransactionPaymentCallApi_query_call_fee_details: RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        Scheduler: Anonymize<I1abrp8gjcpfc>
        Preimage: Anonymize<Imbphi6s5kus8>
        Babe: Anonymize<BabePalletCall>
        Timestamp: Anonymize<TimestampPalletCall>
        Indices: Anonymize<IndicesPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        Staking: Anonymize<StakingPalletCall>
        Session: Anonymize<I454da453jskvn>
        Grandpa: Anonymize<GrandpaPalletCall>
        ImOnline: Anonymize<ImOnlinePalletCall>
        Treasury: Anonymize<Ibiic8ba5o502g>
        ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
        Referenda: Anonymize<ReferendaPalletCall>
        Whitelist: Anonymize<I51p8lm6kqdnho>
        Claims: Anonymize<ClaimsPalletCall>
        Vesting: Anonymize<VestingPalletCall>
        Utility: Anonymize<Iap9gdffi2u6nu>
        Identity: Anonymize<IdentityPalletCall>
        Proxy: Anonymize<Idedbf4rqpdmri>
        Multisig: Anonymize<Idd2oimlrnr76q>
        Bounties: Anonymize<BountiesPalletCall>
        ChildBounties: Anonymize<ChildBountiesPalletCall>
        ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
        VoterList: Anonymize<BagsListPalletCall>
        NominationPools: Anonymize<I29f4027kh5dho>
        FastUnstake: Anonymize<FastUnstakePalletCall>
        Configuration: Anonymize<ParachainsConfigurationPalletCall>
        ParasShared: Anonymize<undefined>
        ParaInclusion: Anonymize<undefined>
        ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
        Paras: Anonymize<ParachainsParasPalletCall>
        Initializer: Anonymize<ParachainsInitializerPalletCall>
        Hrmp: Anonymize<I2vev2224bc186>
        ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
        ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
        Registrar: Anonymize<CommonParasRegistrarPalletCall>
        Slots: Anonymize<CommonSlotsPalletCall>
        Auctions: Anonymize<CommonAuctionsPalletCall>
        Crowdloan: Anonymize<CommonCrowdloanPalletCall>
        XcmPallet: Anonymize<XcmPalletCall>
        MessageQueue: Anonymize<MessageQueuePalletCall>
        AssetRate: Anonymize<I2gv42mnmfo4fm>
        Beefy: Anonymize<Ibeddosggop7dd>
      }>
    >,
    len: number,
  ],
  { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
> = "3o3m4dsvu56tu" as RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        Scheduler: Anonymize<I1abrp8gjcpfc>
        Preimage: Anonymize<Imbphi6s5kus8>
        Babe: Anonymize<BabePalletCall>
        Timestamp: Anonymize<TimestampPalletCall>
        Indices: Anonymize<IndicesPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        Staking: Anonymize<StakingPalletCall>
        Session: Anonymize<I454da453jskvn>
        Grandpa: Anonymize<GrandpaPalletCall>
        ImOnline: Anonymize<ImOnlinePalletCall>
        Treasury: Anonymize<Ibiic8ba5o502g>
        ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
        Referenda: Anonymize<ReferendaPalletCall>
        Whitelist: Anonymize<I51p8lm6kqdnho>
        Claims: Anonymize<ClaimsPalletCall>
        Vesting: Anonymize<VestingPalletCall>
        Utility: Anonymize<Iap9gdffi2u6nu>
        Identity: Anonymize<IdentityPalletCall>
        Proxy: Anonymize<Idedbf4rqpdmri>
        Multisig: Anonymize<Idd2oimlrnr76q>
        Bounties: Anonymize<BountiesPalletCall>
        ChildBounties: Anonymize<ChildBountiesPalletCall>
        ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
        VoterList: Anonymize<BagsListPalletCall>
        NominationPools: Anonymize<I29f4027kh5dho>
        FastUnstake: Anonymize<FastUnstakePalletCall>
        Configuration: Anonymize<ParachainsConfigurationPalletCall>
        ParasShared: Anonymize<undefined>
        ParaInclusion: Anonymize<undefined>
        ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
        Paras: Anonymize<ParachainsParasPalletCall>
        Initializer: Anonymize<ParachainsInitializerPalletCall>
        Hrmp: Anonymize<I2vev2224bc186>
        ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
        ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
        Registrar: Anonymize<CommonParasRegistrarPalletCall>
        Slots: Anonymize<CommonSlotsPalletCall>
        Auctions: Anonymize<CommonAuctionsPalletCall>
        Crowdloan: Anonymize<CommonCrowdloanPalletCall>
        XcmPallet: Anonymize<XcmPalletCall>
        MessageQueue: Anonymize<MessageQueuePalletCall>
        AssetRate: Anonymize<I2gv42mnmfo4fm>
        Beefy: Anonymize<Ibeddosggop7dd>
      }>
    >,
    len: number,
  ],
  { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
>
const runtime_TransactionPaymentCallApi_query_weight_to_fee: RuntimeDescriptor<
  [weight: { ref_time: bigint; proof_size: bigint }],
  bigint
> = "9fha9spid57qj" as RuntimeDescriptor<
  [weight: { ref_time: bigint; proof_size: bigint }],
  bigint
>
const runtime_TransactionPaymentCallApi_query_length_to_fee: RuntimeDescriptor<
  [length: number],
  bigint
> = "5a7vbbavuk0jq" as RuntimeDescriptor<[length: number], bigint>
const runtime_GenesisBuilder_create_default_config: RuntimeDescriptor<
  [],
  Binary
> = "57k61dni7tq1q" as RuntimeDescriptor<[], Binary>
const runtime_GenesisBuilder_build_config: RuntimeDescriptor<
  [json: Binary],
  ResultPayload<undefined, string>
> = "4mqfppbv6571j" as RuntimeDescriptor<
  [json: Binary],
  ResultPayload<undefined, string>
>

type IPallets = {
  System: [
    {
      /**
       * The full account information for a particular account ID.
       */
      Account: StorageDescriptor<
        [Key: SS58String],
        {
          nonce: number
          consumers: number
          providers: number
          sufficients: number
          data: Anonymize<I1q8tnt1cluu5j>
        },
        false
      >

      /**
       * Total extrinsics count for the current block.
       */
      ExtrinsicCount: StorageDescriptor<[], number, true>

      /**
       * The current weight for the block.
       */
      BlockWeight: StorageDescriptor<
        [],
        {
          normal: Anonymize<I4q39t5hn830vp>
          operational: Anonymize<I4q39t5hn830vp>
          mandatory: Anonymize<I4q39t5hn830vp>
        },
        false
      >

      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       */
      AllExtrinsicsLen: StorageDescriptor<[], number, true>

      /**
       * Map of block numbers to block hashes.
       */
      BlockHash: StorageDescriptor<[Key: number], Binary, false>

      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       */
      ExtrinsicData: StorageDescriptor<[Key: number], Binary, false>

      /**
       * The current block number being processed. Set by `execute_block`.
       */
      Number: StorageDescriptor<[], number, false>

      /**
       * Hash of the previous block.
       */
      ParentHash: StorageDescriptor<[], Binary, false>

      /**
       * Digest of the current block, also part of the block header.
       */
      Digest: StorageDescriptor<[], Array<DigestItem>, false>

      /**
       * Events deposited for the current block.
       *
       * NOTE: The item is unbound and should therefore never be read on chain.
       * It could otherwise inflate the PoV size of a block.
       *
       * Events have a large in-memory size. Box the events to not go out-of-memory
       * just in case someone still reads them from within the runtime.
       */
      Events: StorageDescriptor<[], Array<Anonymize<I2s0spoacio2qd>>, false>

      /**
       * The number of events in the `Events<T>` list.
       */
      EventCount: StorageDescriptor<[], number, false>

      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       *
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       *
       * The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       */
      EventTopics: StorageDescriptor<
        [Key: Binary],
        Array<Anonymize<I5g2vv0ckl2m8b>>,
        false
      >

      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
       */
      LastRuntimeUpgrade: StorageDescriptor<
        [],
        { spec_version: number; spec_name: string },
        true
      >

      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
       */
      UpgradedToU32RefCount: StorageDescriptor<[], boolean, false>

      /**
       * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
       * (default) if not.
       */
      UpgradedToTripleRefCount: StorageDescriptor<[], boolean, false>

      /**
       * The execution phase of the block.
       */
      ExecutionPhase: StorageDescriptor<[], Phase, true>
    },
    {
      /**
       *See [`Pallet::remark`].
       */
      remark: TxDescriptor<{ remark: Binary }>

      /**
       *See [`Pallet::set_heap_pages`].
       */
      set_heap_pages: TxDescriptor<{ pages: bigint }>

      /**
       *See [`Pallet::set_code`].
       */
      set_code: TxDescriptor<{ code: Binary }>

      /**
       *See [`Pallet::set_code_without_checks`].
       */
      set_code_without_checks: TxDescriptor<{ code: Binary }>

      /**
       *See [`Pallet::set_storage`].
       */
      set_storage: TxDescriptor<{ items: Anonymize<I5g1ftt6bt65bl> }>

      /**
       *See [`Pallet::kill_storage`].
       */
      kill_storage: TxDescriptor<{ keys: Anonymize<Itom7fk49o0c9> }>

      /**
       *See [`Pallet::kill_prefix`].
       */
      kill_prefix: TxDescriptor<{ prefix: Binary; subkeys: number }>

      /**
       *See [`Pallet::remark_with_event`].
       */
      remark_with_event: TxDescriptor<{ remark: Binary }>
    },
    {
      /**
       *An extrinsic completed successfully.
       */
      ExtrinsicSuccess: PlainDescriptor<{
        dispatch_info: Anonymize<Ia2iiohca2et6f>
      }>

      /**
       *An extrinsic failed.
       */
      ExtrinsicFailed: PlainDescriptor<{
        dispatch_error: DispatchError
        dispatch_info: Anonymize<Ia2iiohca2et6f>
      }>

      /**
       *`:code` was updated.
       */
      CodeUpdated: PlainDescriptor<undefined>

      /**
       *A new account was created.
       */
      NewAccount: PlainDescriptor<{ account: SS58String }>

      /**
       *An account was reaped.
       */
      KilledAccount: PlainDescriptor<{ account: SS58String }>

      /**
       *On on-chain remark happened.
       */
      Remarked: PlainDescriptor<{ sender: SS58String; hash: Binary }>
    },
    {
      /**
       *The name of specification does not match between the current runtime
       *and the new runtime.
       */
      InvalidSpecName: PlainDescriptor<undefined>

      /**
       *The specification version is not allowed to decrease between the current runtime
       *and the new runtime.
       */
      SpecVersionNeedsToIncrease: PlainDescriptor<undefined>

      /**
       *Failed to extract the runtime version from the new runtime.
       *
       *Either calling `Core_version` or decoding `RuntimeVersion` failed.
       */
      FailedToExtractRuntimeVersion: PlainDescriptor<undefined>

      /**
       *Suicide called when the account has non-default composite data.
       */
      NonDefaultComposite: PlainDescriptor<undefined>

      /**
       *There is a non-zero reference count preventing the account from being purged.
       */
      NonZeroRefCount: PlainDescriptor<undefined>

      /**
       *The origin filter prevent the call to be dispatched.
       */
      CallFiltered: PlainDescriptor<undefined>
    },
    {
      /**
       * Block & extrinsics weights: base values and limits.
       */
      BlockWeights: PlainDescriptor<{
        base_block: Anonymize<I4q39t5hn830vp>
        max_block: Anonymize<I4q39t5hn830vp>
        per_class: Anonymize<I79te2qqsklnbd>
      }>

      /**
       * The maximum length of a block (in bytes).
       */
      BlockLength: PlainDescriptor<{
        normal: number
        operational: number
        mandatory: number
      }>

      /**
       * Maximum number of block number to block hash mappings to keep (oldest pruned first).
       */
      BlockHashCount: PlainDescriptor<number>

      /**
       * The weight of runtime database operations the runtime can invoke.
       */
      DbWeight: PlainDescriptor<{ read: bigint; write: bigint }>

      /**
       * Get the chain's current version.
       */
      Version: PlainDescriptor<{
        spec_name: string
        impl_name: string
        authoring_version: number
        spec_version: number
        impl_version: number
        apis: Anonymize<I1st1p92iu8h7e>
        transaction_version: number
        state_version: number
      }>

      /**
       * The designated SS58 prefix of this chain.
       *
       * This replaces the "ss58Format" property declared in the chain spec. Reason is
       * that the runtime should know about the prefix in order to make use of it as
       * an identifier of the chain.
       */
      SS58Prefix: PlainDescriptor<number>
    },
  ]
  Scheduler: [
    {
      /**

 */
      IncompleteSince: StorageDescriptor<[], number, true>

      /**
       * Items to be executed, indexed by the block number that they should be executed on.
       */
      Agenda: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I1n29q4mt87e84>>,
        false
      >

      /**
       * Lookup from a name to the block number and index of the task.
       *
       * For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
       * identities.
       */
      Lookup: StorageDescriptor<[Key: Binary], [number, number], true>
    },
    {
      /**
       *See [`Pallet::schedule`].
       */
      schedule: TxDescriptor<{
        when: number
        maybe_periodic: Anonymize<I34gtdjipdmjpt>
        priority: number
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::cancel`].
       */
      cancel: TxDescriptor<{ when: number; index: number }>

      /**
       *See [`Pallet::schedule_named`].
       */
      schedule_named: TxDescriptor<{
        id: Binary
        when: number
        maybe_periodic: Anonymize<I34gtdjipdmjpt>
        priority: number
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::cancel_named`].
       */
      cancel_named: TxDescriptor<{ id: Binary }>

      /**
       *See [`Pallet::schedule_after`].
       */
      schedule_after: TxDescriptor<{
        after: number
        maybe_periodic: Anonymize<I34gtdjipdmjpt>
        priority: number
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::schedule_named_after`].
       */
      schedule_named_after: TxDescriptor<{
        id: Binary
        after: number
        maybe_periodic: Anonymize<I34gtdjipdmjpt>
        priority: number
        call: Anonymize<I8e6un4uk1q07c>
      }>
    },
    {
      /**
       *Scheduled some task.
       */
      Scheduled: PlainDescriptor<{ when: number; index: number }>

      /**
       *Canceled some task.
       */
      Canceled: PlainDescriptor<{ when: number; index: number }>

      /**
       *Dispatched some task.
       */
      Dispatched: PlainDescriptor<{
        task: Anonymize<I5g2vv0ckl2m8b>
        id: Anonymize<I17k3ujudqd5df>
        result: Anonymize<Idtdr91jmq5g4i>
      }>

      /**
       *The call for the provided hash was not found so the task has been aborted.
       */
      CallUnavailable: PlainDescriptor<{
        task: Anonymize<I5g2vv0ckl2m8b>
        id: Anonymize<I17k3ujudqd5df>
      }>

      /**
       *The given task was unable to be renewed since the agenda is full at that block.
       */
      PeriodicFailed: PlainDescriptor<{
        task: Anonymize<I5g2vv0ckl2m8b>
        id: Anonymize<I17k3ujudqd5df>
      }>

      /**
       *The given task can never be executed since it is overweight.
       */
      PermanentlyOverweight: PlainDescriptor<{
        task: Anonymize<I5g2vv0ckl2m8b>
        id: Anonymize<I17k3ujudqd5df>
      }>
    },
    {
      /**
       *Failed to schedule a call
       */
      FailedToSchedule: PlainDescriptor<undefined>

      /**
       *Cannot find the scheduled call.
       */
      NotFound: PlainDescriptor<undefined>

      /**
       *Given target block number is in the past.
       */
      TargetBlockNumberInPast: PlainDescriptor<undefined>

      /**
       *Reschedule failed because it does not change scheduled time.
       */
      RescheduleNoChange: PlainDescriptor<undefined>

      /**
       *Attempt to use a non-named function on a named task.
       */
      Named: PlainDescriptor<undefined>
    },
    {
      /**
       * The maximum weight that may be scheduled per block for any dispatchables.
       */
      MaximumWeight: PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>

      /**
       * The maximum number of scheduled calls in the queue for a single block.
       *
       * NOTE:
       * + Dependent pallets' benchmarks might require a higher limit for the setting. Set a
       * higher limit under `runtime-benchmarks` feature.
       */
      MaxScheduledPerBlock: PlainDescriptor<number>
    },
  ]
  Preimage: [
    {
      /**
       * The request status of a given hash.
       */
      StatusFor: StorageDescriptor<[Key: Binary], PreimageRequestStatus, true>

      /**
       * The request status of a given hash.
       */
      RequestStatusFor: StorageDescriptor<
        [Key: Binary],
        Anonymize<
          AnonymousEnum<{
            Unrequested: Anonymize<Idvcv8961o32th>
            Requested: Anonymize<In82i9avte5re>
          }>
        >,
        true
      >

      /**

 */
      PreimageFor: StorageDescriptor<[Key: [Binary, number]], Binary, true>
    },
    {
      /**
       *See [`Pallet::note_preimage`].
       */
      note_preimage: TxDescriptor<{ bytes: Binary }>

      /**
       *See [`Pallet::unnote_preimage`].
       */
      unnote_preimage: TxDescriptor<{ hash: Binary }>

      /**
       *See [`Pallet::request_preimage`].
       */
      request_preimage: TxDescriptor<{ hash: Binary }>

      /**
       *See [`Pallet::unrequest_preimage`].
       */
      unrequest_preimage: TxDescriptor<{ hash: Binary }>

      /**
       *See [`Pallet::ensure_updated`].
       */
      ensure_updated: TxDescriptor<{ hashes: Anonymize<Idhnf6rtqoslea> }>
    },
    {
      /**
       *A preimage has been noted.
       */
      Noted: PlainDescriptor<{ hash: Binary }>

      /**
       *A preimage has been requested.
       */
      Requested: PlainDescriptor<{ hash: Binary }>

      /**
       *A preimage has ben cleared.
       */
      Cleared: PlainDescriptor<{ hash: Binary }>
    },
    {
      /**
       *Preimage is too large to store on-chain.
       */
      TooBig: PlainDescriptor<undefined>

      /**
       *Preimage has already been noted on-chain.
       */
      AlreadyNoted: PlainDescriptor<undefined>

      /**
       *The user is not authorized to perform this action.
       */
      NotAuthorized: PlainDescriptor<undefined>

      /**
       *The preimage cannot be removed since it has not yet been noted.
       */
      NotNoted: PlainDescriptor<undefined>

      /**
       *A preimage may not be removed when there are outstanding requests.
       */
      Requested: PlainDescriptor<undefined>

      /**
       *The preimage request cannot be removed since no outstanding requests exist.
       */
      NotRequested: PlainDescriptor<undefined>

      /**
       *More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
       */
      TooMany: PlainDescriptor<undefined>

      /**
       *Too few hashes were requested to be upgraded (i.e. zero).
       */
      TooFew: PlainDescriptor<undefined>
    },
    {},
  ]
  Babe: [
    {
      /**
       * Current epoch index.
       */
      EpochIndex: StorageDescriptor<[], bigint, false>

      /**
       * Current epoch authorities.
       */
      Authorities: StorageDescriptor<
        [],
        Array<Anonymize<I3iuggguvi9njj>>,
        false
      >

      /**
       * The slot at which the first epoch actually started. This is 0
       * until the first block of the chain.
       */
      GenesisSlot: StorageDescriptor<[], bigint, false>

      /**
       * Current slot number.
       */
      CurrentSlot: StorageDescriptor<[], bigint, false>

      /**
       * The epoch randomness for the *current* epoch.
       *
       * # Security
       *
       * This MUST NOT be used for gambling, as it can be influenced by a
       * malicious validator in the short term. It MAY be used in many
       * cryptographic protocols, however, so long as one remembers that this
       * (like everything else on-chain) it is public. For example, it can be
       * used where a number is needed that cannot have been chosen by an
       * adversary, for purposes such as public-coin zero-knowledge proofs.
       */
      Randomness: StorageDescriptor<[], Binary, false>

      /**
       * Pending epoch configuration change that will be applied when the next epoch is enacted.
       */
      PendingEpochConfigChange: StorageDescriptor<
        [],
        BabeDigestsNextConfigDescriptor,
        true
      >

      /**
       * Next epoch randomness.
       */
      NextRandomness: StorageDescriptor<[], Binary, false>

      /**
       * Next epoch authorities.
       */
      NextAuthorities: StorageDescriptor<
        [],
        Array<Anonymize<I3iuggguvi9njj>>,
        false
      >

      /**
       * Randomness under construction.
       *
       * We make a trade-off between storage accesses and list length.
       * We store the under-construction randomness in segments of up to
       * `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
       *
       * Once a segment reaches this length, we begin the next one.
       * We reset all segments and return to `0` at the beginning of every
       * epoch.
       */
      SegmentIndex: StorageDescriptor<[], number, false>

      /**
       * TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay.
       */
      UnderConstruction: StorageDescriptor<[Key: number], Array<Binary>, false>

      /**
       * Temporary value (cleared at block finalization) which is `Some`
       * if per-block initialization has already been called for current block.
       */
      Initialized: StorageDescriptor<[], BabeDigestsPreDigest | undefined, true>

      /**
       * This field should always be populated during block processing unless
       * secondary plain slots are enabled (which don't contain a VRF output).
       *
       * It is set in `on_finalize`, before it will contain the value from the last block.
       */
      AuthorVrfRandomness: StorageDescriptor<[], Binary | undefined, false>

      /**
       * The block numbers when the last and current epoch have started, respectively `N-1` and
       * `N`.
       * NOTE: We track this is in order to annotate the block number when a given pool of
       * entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
       * slots, which may be skipped, the block numbers may not line up with the slot numbers.
       */
      EpochStart: StorageDescriptor<[], [number, number], false>

      /**
       * How late the current block is compared to its parent.
       *
       * This entry is populated as part of block execution and is cleaned up
       * on block finalization. Querying this storage entry outside of block
       * execution context should always yield zero.
       */
      Lateness: StorageDescriptor<[], number, false>

      /**
       * The configuration for the current epoch. Should never be `None` as it is initialized in
       * genesis.
       */
      EpochConfig: StorageDescriptor<
        [],
        { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
        true
      >

      /**
       * The configuration for the next epoch, `None` if the config will not change
       * (you can fallback to `EpochConfig` instead in that case).
       */
      NextEpochConfig: StorageDescriptor<
        [],
        { c: Anonymize<I2j729bmgsdiuo>; allowed_slots: BabeAllowedSlots },
        true
      >

      /**
       * A list of the last 100 skipped epochs and the corresponding session index
       * when the epoch was skipped.
       *
       * This is only used for validating equivocation proofs. An equivocation proof
       * must contains a key-ownership proof for a given session, therefore we need a
       * way to tie together sessions and epoch indices, i.e. we need to validate that
       * a validator was the owner of a given key on a given session, and what the
       * active epoch index was during that session.
       */
      SkippedEpochs: StorageDescriptor<
        [],
        Array<Anonymize<I6cs1itejju2vv>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::report_equivocation`].
       */
      report_equivocation: TxDescriptor<{
        equivocation_proof: Anonymize<I7bek4s9acs8nl>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::report_equivocation_unsigned`].
       */
      report_equivocation_unsigned: TxDescriptor<{
        equivocation_proof: Anonymize<I7bek4s9acs8nl>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::plan_config_change`].
       */
      plan_config_change: TxDescriptor<{
        config: BabeDigestsNextConfigDescriptor
      }>
    },
    {},
    {
      /**
       *An equivocation proof provided as part of an equivocation report is invalid.
       */
      InvalidEquivocationProof: PlainDescriptor<undefined>

      /**
       *A key ownership proof provided as part of an equivocation report is invalid.
       */
      InvalidKeyOwnershipProof: PlainDescriptor<undefined>

      /**
       *A given equivocation report is valid but already previously reported.
       */
      DuplicateOffenceReport: PlainDescriptor<undefined>

      /**
       *Submitted configuration is invalid.
       */
      InvalidConfiguration: PlainDescriptor<undefined>
    },
    {
      /**
       * The amount of time, in slots, that each epoch should last.
       * NOTE: Currently it is not possible to change the epoch duration after
       * the chain has started. Attempting to do so will brick block production.
       */
      EpochDuration: PlainDescriptor<bigint>

      /**
       * The expected average block time at which BABE should be creating
       * blocks. Since BABE is probabilistic it is not trivial to figure out
       * what the expected average block time should be based on the slot
       * duration and the security parameter `c` (where `1 - c` represents
       * the probability of a slot being empty).
       */
      ExpectedBlockTime: PlainDescriptor<bigint>

      /**
       * Max number of authorities allowed
       */
      MaxAuthorities: PlainDescriptor<number>

      /**
       * The maximum number of nominators for each validator.
       */
      MaxNominators: PlainDescriptor<number>
    },
  ]
  Timestamp: [
    {
      /**
       * The current time for the current block.
       */
      Now: StorageDescriptor<[], bigint, false>

      /**
       * Whether the timestamp has been updated in this block.
       *
       * This value is updated to `true` upon successful submission of a timestamp by a node.
       * It is then checked at the end of each block execution in the `on_finalize` hook.
       */
      DidUpdate: StorageDescriptor<[], boolean, false>
    },
    {
      /**
       *See [`Pallet::set`].
       */
      set: TxDescriptor<{ now: bigint }>
    },
    {},
    {},
    {
      /**
       * The minimum period between blocks.
       *
       * Be aware that this is different to the *expected* period that the block production
       * apparatus provides. Your chosen consensus system will generally work with this to
       * determine a sensible block time. For example, in the Aura pallet it will be double this
       * period on default settings.
       */
      MinimumPeriod: PlainDescriptor<bigint>
    },
  ]
  Indices: [
    {
      /**
       * The lookup from index to account.
       */
      Accounts: StorageDescriptor<
        [Key: number],
        [SS58String, bigint, boolean],
        true
      >
    },
    {
      /**
       *See [`Pallet::claim`].
       */
      claim: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::transfer`].
       */
      transfer: TxDescriptor<{ index: number; new: MultiAddress }>

      /**
       *See [`Pallet::free`].
       */
      free: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::force_transfer`].
       */
      force_transfer: TxDescriptor<{
        new: MultiAddress
        index: number
        freeze: boolean
      }>

      /**
       *See [`Pallet::freeze`].
       */
      freeze: TxDescriptor<{ index: number }>
    },
    {
      /**
       *A account index was assigned.
       */
      IndexAssigned: PlainDescriptor<{ who: SS58String; index: number }>

      /**
       *A account index has been freed up (unassigned).
       */
      IndexFreed: PlainDescriptor<{ index: number }>

      /**
       *A account index has been frozen to its current account ID.
       */
      IndexFrozen: PlainDescriptor<{ who: SS58String; index: number }>
    },
    {
      /**
       *The index was not already assigned.
       */
      NotAssigned: PlainDescriptor<undefined>

      /**
       *The index is assigned to another account.
       */
      NotOwner: PlainDescriptor<undefined>

      /**
       *The index was not available.
       */
      InUse: PlainDescriptor<undefined>

      /**
       *The source and destination accounts are identical.
       */
      NotTransfer: PlainDescriptor<undefined>

      /**
       *The index is permanent and may not be freed/changed.
       */
      Permanent: PlainDescriptor<undefined>
    },
    {
      /**
       * The deposit needed for reserving an index.
       */
      Deposit: PlainDescriptor<bigint>
    },
  ]
  Balances: [
    {
      /**
       * The total units issued in the system.
       */
      TotalIssuance: StorageDescriptor<[], bigint, false>

      /**
       * The total units of outstanding deactivated balance in the system.
       */
      InactiveIssuance: StorageDescriptor<[], bigint, false>

      /**
       * The Balances pallet example of storing the balance of an account.
       *
       * # Example
       *
       * ```nocompile
       *  impl pallet_balances::Config for Runtime {
       *    type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
       *  }
       * ```
       *
       * You can also store the balance of an account in the `System` pallet.
       *
       * # Example
       *
       * ```nocompile
       *  impl pallet_balances::Config for Runtime {
       *   type AccountStore = System
       *  }
       * ```
       *
       * But this comes with tradeoffs, storing account balances in the system pallet stores
       * `frame_system` data alongside the account data contrary to storing account balances in the
       * `Balances` pallet, which uses a `StorageMap` to store balances data only.
       * NOTE: This is only used in the case that this pallet is used to store balances.
       */
      Account: StorageDescriptor<
        [Key: SS58String],
        { free: bigint; reserved: bigint; frozen: bigint; flags: bigint },
        false
      >

      /**
       * Any liquidity locks on some account balances.
       * NOTE: Should only be accessed when setting, changing and freeing a lock.
       */
      Locks: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I5b29v4qfq4tu7>>,
        false
      >

      /**
       * Named reserves on some account balances.
       */
      Reserves: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I32btm6htd9bck>>,
        false
      >

      /**
       * Holds on account balances.
       */
      Holds: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I2g6pdv83dq8hk>>,
        false
      >

      /**
       * Freeze locks on account balances.
       */
      Freezes: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I6nlcdgcjnohed>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::transfer_allow_death`].
       */
      transfer_allow_death: TxDescriptor<{ dest: MultiAddress; value: bigint }>

      /**
       *See [`Pallet::force_transfer`].
       */
      force_transfer: TxDescriptor<{
        source: MultiAddress
        dest: MultiAddress
        value: bigint
      }>

      /**
       *See [`Pallet::transfer_keep_alive`].
       */
      transfer_keep_alive: TxDescriptor<{ dest: MultiAddress; value: bigint }>

      /**
       *See [`Pallet::transfer_all`].
       */
      transfer_all: TxDescriptor<{ dest: MultiAddress; keep_alive: boolean }>

      /**
       *See [`Pallet::force_unreserve`].
       */
      force_unreserve: TxDescriptor<{ who: MultiAddress; amount: bigint }>

      /**
       *See [`Pallet::upgrade_accounts`].
       */
      upgrade_accounts: TxDescriptor<{ who: Anonymize<Ia2lhg7l2hilo3> }>

      /**
       *See [`Pallet::force_set_balance`].
       */
      force_set_balance: TxDescriptor<{ who: MultiAddress; new_free: bigint }>
    },
    {
      /**
       *An account was created with some free balance.
       */
      Endowed: PlainDescriptor<{ account: SS58String; free_balance: bigint }>

      /**
       *An account was removed whose balance was non-zero but below ExistentialDeposit,
       *resulting in an outright loss.
       */
      DustLost: PlainDescriptor<{ account: SS58String; amount: bigint }>

      /**
       *Transfer succeeded.
       */
      Transfer: PlainDescriptor<{
        from: SS58String
        to: SS58String
        amount: bigint
      }>

      /**
       *A balance was set by root.
       */
      BalanceSet: PlainDescriptor<{ who: SS58String; free: bigint }>

      /**
       *Some balance was reserved (moved from free to reserved).
       */
      Reserved: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some balance was unreserved (moved from reserved to free).
       */
      Unreserved: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some balance was moved from the reserve of the first account to the second account.
       *Final argument indicates the destination balance type.
       */
      ReserveRepatriated: PlainDescriptor<{
        from: SS58String
        to: SS58String
        amount: bigint
        destination_status: BalanceStatus
      }>

      /**
       *Some amount was deposited (e.g. for transaction fees).
       */
      Deposit: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was withdrawn from the account (e.g. for transaction fees).
       */
      Withdraw: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was removed from the account (e.g. for misbehavior).
       */
      Slashed: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was minted into an account.
       */
      Minted: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was burned from an account.
       */
      Burned: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was suspended from an account (it can be restored later).
       */
      Suspended: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some amount was restored into an account.
       */
      Restored: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *An account was upgraded.
       */
      Upgraded: PlainDescriptor<{ who: SS58String }>

      /**
       *Total issuance was increased by `amount`, creating a credit to be balanced.
       */
      Issued: PlainDescriptor<{ amount: bigint }>

      /**
       *Total issuance was decreased by `amount`, creating a debt to be balanced.
       */
      Rescinded: PlainDescriptor<{ amount: bigint }>

      /**
       *Some balance was locked.
       */
      Locked: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some balance was unlocked.
       */
      Unlocked: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some balance was frozen.
       */
      Frozen: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *Some balance was thawed.
       */
      Thawed: PlainDescriptor<{ who: SS58String; amount: bigint }>
    },
    {
      /**
       *Vesting balance too high to send value.
       */
      VestingBalance: PlainDescriptor<undefined>

      /**
       *Account liquidity restrictions prevent withdrawal.
       */
      LiquidityRestrictions: PlainDescriptor<undefined>

      /**
       *Balance too low to send value.
       */
      InsufficientBalance: PlainDescriptor<undefined>

      /**
       *Value too low to create account due to existential deposit.
       */
      ExistentialDeposit: PlainDescriptor<undefined>

      /**
       *Transfer/payment would kill account.
       */
      Expendability: PlainDescriptor<undefined>

      /**
       *A vesting schedule already exists for this account.
       */
      ExistingVestingSchedule: PlainDescriptor<undefined>

      /**
       *Beneficiary account must pre-exist.
       */
      DeadAccount: PlainDescriptor<undefined>

      /**
       *Number of named reserves exceed `MaxReserves`.
       */
      TooManyReserves: PlainDescriptor<undefined>

      /**
       *Number of holds exceed `MaxHolds`.
       */
      TooManyHolds: PlainDescriptor<undefined>

      /**
       *Number of freezes exceed `MaxFreezes`.
       */
      TooManyFreezes: PlainDescriptor<undefined>
    },
    {
      /**
       * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
       *
       * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
       * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
       * In case you have multiple sources of provider references, you may also get unexpected
       * behaviour if you set this to zero.
       *
       * Bottom line: Do yourself a favour and make it at least one!
       */
      ExistentialDeposit: PlainDescriptor<bigint>

      /**
       * The maximum number of locks that should exist on an account.
       * Not strictly enforced, but used for weight estimation.
       */
      MaxLocks: PlainDescriptor<number>

      /**
       * The maximum number of named reserves that can exist on an account.
       */
      MaxReserves: PlainDescriptor<number>

      /**
       * The maximum number of holds that can exist on an account at any time.
       */
      MaxHolds: PlainDescriptor<number>

      /**
       * The maximum number of individual freeze locks that can exist on an account at any time.
       */
      MaxFreezes: PlainDescriptor<number>
    },
  ]
  TransactionPayment: [
    {
      /**

 */
      NextFeeMultiplier: StorageDescriptor<[], bigint, false>

      /**

 */
      StorageVersion: StorageDescriptor<[], TransactionPaymentReleases, false>
    },
    {},
    {
      /**
       *A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       *has been paid by `who`.
       */
      TransactionFeePaid: PlainDescriptor<{
        who: SS58String
        actual_fee: bigint
        tip: bigint
      }>
    },
    {},
    {
      /**
       * A fee mulitplier for `Operational` extrinsics to compute "virtual tip" to boost their
       * `priority`
       *
       * This value is multipled by the `final_fee` to obtain a "virtual tip" that is later
       * added to a tip component in regular `priority` calculations.
       * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
       * extrinsic (with no tip), by including a tip value greater than the virtual tip.
       *
       * ```rust,ignore
       * // For `Normal`
       * let priority = priority_calc(tip);
       *
       * // For `Operational`
       * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
       * let priority = priority_calc(tip + virtual_tip);
       * ```
       *
       * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
       * sent with the transaction. So, not only does the transaction get a priority bump based
       * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
       * transactions.
       */
      OperationalFeeMultiplier: PlainDescriptor<number>
    },
  ]
  Authorship: [
    {
      /**
       * Author of current block.
       */
      Author: StorageDescriptor<[], SS58String, true>
    },
    {},
    {},
    {},
    {},
  ]
  Staking: [
    {
      /**
       * The ideal number of active validators.
       */
      ValidatorCount: StorageDescriptor<[], number, false>

      /**
       * Minimum number of staking participants before emergency conditions are imposed.
       */
      MinimumValidatorCount: StorageDescriptor<[], number, false>

      /**
       * Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
       * easy to initialize and the performance hit is minimal (we expect no more than four
       * invulnerables) and restricted to testnets.
       */
      Invulnerables: StorageDescriptor<[], Array<SS58String>, false>

      /**
       * Map from all locked "stash" accounts to the controller account.
       *
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       */
      Bonded: StorageDescriptor<[Key: SS58String], SS58String, true>

      /**
       * The minimum active bond to become and maintain the role of a nominator.
       */
      MinNominatorBond: StorageDescriptor<[], bigint, false>

      /**
       * The minimum active bond to become and maintain the role of a validator.
       */
      MinValidatorBond: StorageDescriptor<[], bigint, false>

      /**
       * The minimum active nominator stake of the last successful election.
       */
      MinimumActiveStake: StorageDescriptor<[], bigint, false>

      /**
       * The minimum amount of commission that validators can set.
       *
       * If set to `0`, no limit exists.
       */
      MinCommission: StorageDescriptor<[], number, false>

      /**
       * Map from all (unlocked) "controller" accounts to the info regarding the staking.
       *
       * Note: All the reads and mutations to this storage *MUST* be done through the methods exposed
       * by [`StakingLedger`] to ensure data and lock consistency.
       */
      Ledger: StorageDescriptor<
        [Key: SS58String],
        {
          stash: SS58String
          total: bigint
          active: bigint
          unlocking: Anonymize<I9nc4v1upo2c8e>
          claimed_rewards: Anonymize<Icgljjb6j82uhn>
        },
        true
      >

      /**
       * Where the reward payment should be made. Keyed by stash.
       *
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       */
      Payee: StorageDescriptor<
        [Key: SS58String],
        StakingRewardDestination,
        false
      >

      /**
       * The map from (wannabe) validator stash key to the preferences of that validator.
       *
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       */
      Validators: StorageDescriptor<
        [Key: SS58String],
        { commission: number; blocked: boolean },
        false
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForValidators: StorageDescriptor<[], number, false>

      /**
       * The maximum validator count before we stop allowing new validators to join.
       *
       * When this value is not set, no limits are enforced.
       */
      MaxValidatorsCount: StorageDescriptor<[], number, true>

      /**
       * The map from nominator stash key to their nomination preferences, namely the validators that
       * they wish to support.
       *
       * Note that the keys of this storage map might become non-decodable in case the
       * account's [`NominationsQuota::MaxNominations`] configuration is decreased.
       * In this rare case, these nominators
       * are still existent in storage, their key is correct and retrievable (i.e. `contains_key`
       * indicates that they exist), but their value cannot be decoded. Therefore, the non-decodable
       * nominators will effectively not-exist, until they re-submit their preferences such that it
       * is within the bounds of the newly set `Config::MaxNominations`.
       *
       * This implies that `::iter_keys().count()` and `::iter().count()` might return different
       * values for this map. Moreover, the main `::count()` is aligned with the former, namely the
       * number of keys that exist.
       *
       * Lastly, if any of the nominators become non-decodable, they can be chilled immediately via
       * [`Call::chill_other`] dispatchable by anyone.
       *
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       */
      Nominators: StorageDescriptor<
        [Key: SS58String],
        {
          targets: Anonymize<Ia2lhg7l2hilo3>
          submitted_in: number
          suppressed: boolean
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForNominators: StorageDescriptor<[], number, false>

      /**
       * The maximum nominator count before we stop allowing new validators to join.
       *
       * When this value is not set, no limits are enforced.
       */
      MaxNominatorsCount: StorageDescriptor<[], number, true>

      /**
       * The current era index.
       *
       * This is the latest planned era, depending on how the Session pallet queues the validator
       * set, it might be active or not.
       */
      CurrentEra: StorageDescriptor<[], number, true>

      /**
       * The active era information, it holds index and start.
       *
       * The active era is the era being currently rewarded. Validator set of this era must be
       * equal to [`SessionInterface::validators`].
       */
      ActiveEra: StorageDescriptor<
        [],
        { index: number; start: Anonymize<I35p85j063s0il> },
        true
      >

      /**
       * The session index at which the era start for the last `HISTORY_DEPTH` eras.
       *
       * Note: This tracks the starting session (i.e. session index when era start being active)
       * for the eras in `[CurrentEra - HISTORY_DEPTH, CurrentEra]`.
       */
      ErasStartSessionIndex: StorageDescriptor<[Key: number], number, true>

      /**
       * Exposure of validator at era.
       *
       * This is keyed first by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       * If stakers hasn't been set or has been removed then empty exposure is returned.
       */
      ErasStakers: StorageDescriptor<
        [number, SS58String],
        { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
        false
      >

      /**
       * Clipped Exposure of validator at era.
       *
       * This is similar to [`ErasStakers`] but number of nominators exposed is reduced to the
       * `T::MaxNominatorRewardedPerValidator` biggest stakers.
       * (Note: the field `total` and `own` of the exposure remains unchanged).
       * This is used to limit the i/o cost for the nominator payout.
       *
       * This is keyed fist by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       * If stakers hasn't been set or has been removed then empty exposure is returned.
       */
      ErasStakersClipped: StorageDescriptor<
        [number, SS58String],
        { total: bigint; own: bigint; others: Anonymize<I252o97fo263q7> },
        false
      >

      /**
       * Similar to `ErasStakers`, this holds the preferences of validators.
       *
       * This is keyed first by the era index to allow bulk deletion and then the stash account.
       *
       * Is it removed after `HISTORY_DEPTH` eras.
       */
      ErasValidatorPrefs: StorageDescriptor<
        [number, SS58String],
        { commission: number; blocked: boolean },
        false
      >

      /**
       * The total validator era payout for the last `HISTORY_DEPTH` eras.
       *
       * Eras that haven't finished yet or has been removed doesn't have reward.
       */
      ErasValidatorReward: StorageDescriptor<[Key: number], bigint, true>

      /**
       * Rewards for the last `HISTORY_DEPTH` eras.
       * If reward hasn't been set or has been removed then 0 reward is returned.
       */
      ErasRewardPoints: StorageDescriptor<
        [Key: number],
        { total: number; individual: Anonymize<I205qrookusi3d> },
        false
      >

      /**
       * The total amount staked for the last `HISTORY_DEPTH` eras.
       * If total hasn't been set or has been removed then 0 stake is returned.
       */
      ErasTotalStake: StorageDescriptor<[Key: number], bigint, false>

      /**
       * Mode of era forcing.
       */
      ForceEra: StorageDescriptor<[], StakingForcing, false>

      /**
       * The percentage of the slash that is distributed to reporters.
       *
       * The rest of the slashed value is handled by the `Slash`.
       */
      SlashRewardFraction: StorageDescriptor<[], number, false>

      /**
       * The amount of currency given to reporters of a slash event which was
       * canceled by extraordinary circumstances (e.g. governance).
       */
      CanceledSlashPayout: StorageDescriptor<[], bigint, false>

      /**
       * All unapplied slashes that are queued for later.
       */
      UnappliedSlashes: StorageDescriptor<
        [Key: number],
        Array<Anonymize<Ifedledo2fog34>>,
        false
      >

      /**
       * A mapping from still-bonded eras to the first session index of that era.
       *
       * Must contains information for eras for the range:
       * `[active_era - bounding_duration; active_era]`
       */
      BondedEras: StorageDescriptor<[], Array<Anonymize<I5g2vv0ckl2m8b>>, false>

      /**
       * All slashing events on validators, mapped by era to the highest slash proportion
       * and slash value of the era.
       */
      ValidatorSlashInEra: StorageDescriptor<
        [number, SS58String],
        [number, bigint],
        true
      >

      /**
       * All slashing events on nominators, mapped by era to the highest slash value of the era.
       */
      NominatorSlashInEra: StorageDescriptor<[number, SS58String], bigint, true>

      /**
       * Slashing spans for stash accounts.
       */
      SlashingSpans: StorageDescriptor<
        [Key: SS58String],
        {
          span_index: number
          last_start: number
          last_nonzero_slash: number
          prior: Anonymize<Icgljjb6j82uhn>
        },
        true
      >

      /**
       * Records information about the maximum slash of a stash within a slashing span,
       * as well as how much reward has been paid out.
       */
      SpanSlash: StorageDescriptor<
        [Key: [SS58String, number]],
        { slashed: bigint; paid_out: bigint },
        false
      >

      /**
       * The last planned session scheduled by the session pallet.
       *
       * This is basically in sync with the call to [`pallet_session::SessionManager::new_session`].
       */
      CurrentPlannedSession: StorageDescriptor<[], number, false>

      /**
       * Indices of validators that have offended in the active era and whether they are currently
       * disabled.
       *
       * This value should be a superset of disabled validators since not all offences lead to the
       * validator being disabled (if there was no slash). This is needed to track the percentage of
       * validators that have offended in the current era, ensuring a new era is forced if
       * `OffendingValidatorsThreshold` is reached. The vec is always kept sorted so that we can find
       * whether a given validator has previously offended using binary search. It gets cleared when
       * the era ends.
       */
      OffendingValidators: StorageDescriptor<
        [],
        Array<Anonymize<I39p6ln31i4n46>>,
        false
      >

      /**
       * The threshold for when users can start calling `chill_other` for other validators /
       * nominators. The threshold is compared to the actual number of validators / nominators
       * (`CountFor*`) in the system compared to the configured max (`Max*Count`).
       */
      ChillThreshold: StorageDescriptor<[], number, true>
    },
    {
      /**
       *See [`Pallet::bond`].
       */
      bond: TxDescriptor<{ value: bigint; payee: StakingRewardDestination }>

      /**
       *See [`Pallet::bond_extra`].
       */
      bond_extra: TxDescriptor<{ max_additional: bigint }>

      /**
       *See [`Pallet::unbond`].
       */
      unbond: TxDescriptor<{ value: bigint }>

      /**
       *See [`Pallet::withdraw_unbonded`].
       */
      withdraw_unbonded: TxDescriptor<{ num_slashing_spans: number }>

      /**
       *See [`Pallet::validate`].
       */
      validate: TxDescriptor<{ prefs: Anonymize<I9o7ssi9vmhmgr> }>

      /**
       *See [`Pallet::nominate`].
       */
      nominate: TxDescriptor<{ targets: Anonymize<I65ih42boctoq4> }>

      /**
       *See [`Pallet::chill`].
       */
      chill: TxDescriptor<undefined>

      /**
       *See [`Pallet::set_payee`].
       */
      set_payee: TxDescriptor<{ payee: StakingRewardDestination }>

      /**
       *See [`Pallet::set_controller`].
       */
      set_controller: TxDescriptor<undefined>

      /**
       *See [`Pallet::set_validator_count`].
       */
      set_validator_count: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::increase_validator_count`].
       */
      increase_validator_count: TxDescriptor<{ additional: number }>

      /**
       *See [`Pallet::scale_validator_count`].
       */
      scale_validator_count: TxDescriptor<{ factor: number }>

      /**
       *See [`Pallet::force_no_eras`].
       */
      force_no_eras: TxDescriptor<undefined>

      /**
       *See [`Pallet::force_new_era`].
       */
      force_new_era: TxDescriptor<undefined>

      /**
       *See [`Pallet::set_invulnerables`].
       */
      set_invulnerables: TxDescriptor<{
        invulnerables: Anonymize<Ia2lhg7l2hilo3>
      }>

      /**
       *See [`Pallet::force_unstake`].
       */
      force_unstake: TxDescriptor<{
        stash: SS58String
        num_slashing_spans: number
      }>

      /**
       *See [`Pallet::force_new_era_always`].
       */
      force_new_era_always: TxDescriptor<undefined>

      /**
       *See [`Pallet::cancel_deferred_slash`].
       */
      cancel_deferred_slash: TxDescriptor<{
        era: number
        slash_indices: Anonymize<Icgljjb6j82uhn>
      }>

      /**
       *See [`Pallet::payout_stakers`].
       */
      payout_stakers: TxDescriptor<{ validator_stash: SS58String; era: number }>

      /**
       *See [`Pallet::rebond`].
       */
      rebond: TxDescriptor<{ value: bigint }>

      /**
       *See [`Pallet::reap_stash`].
       */
      reap_stash: TxDescriptor<{
        stash: SS58String
        num_slashing_spans: number
      }>

      /**
       *See [`Pallet::kick`].
       */
      kick: TxDescriptor<{ who: Anonymize<I65ih42boctoq4> }>

      /**
       *See [`Pallet::set_staking_configs`].
       */
      set_staking_configs: TxDescriptor<{
        min_nominator_bond: StakingPalletConfigOp
        min_validator_bond: StakingPalletConfigOp
        max_nominator_count: StakingPalletConfigOp1
        max_validator_count: StakingPalletConfigOp1
        chill_threshold: StakingPalletConfigOp1
        min_commission: StakingPalletConfigOp1
      }>

      /**
       *See [`Pallet::chill_other`].
       */
      chill_other: TxDescriptor<{ controller: SS58String }>

      /**
       *See [`Pallet::force_apply_min_commission`].
       */
      force_apply_min_commission: TxDescriptor<{ validator_stash: SS58String }>

      /**
       *See [`Pallet::set_min_commission`].
       */
      set_min_commission: TxDescriptor<{ new: number }>
    },
    {
      /**
       *The era payout has been set; the first balance is the validator-payout; the second is
       *the remainder from the maximum amount of reward.
       */
      EraPaid: PlainDescriptor<{
        era_index: number
        validator_payout: bigint
        remainder: bigint
      }>

      /**
       *The nominator has been rewarded by this amount to this destination.
       */
      Rewarded: PlainDescriptor<{
        stash: SS58String
        dest: StakingRewardDestination
        amount: bigint
      }>

      /**
       *A staker (validator or nominator) has been slashed by the given amount.
       */
      Slashed: PlainDescriptor<{ staker: SS58String; amount: bigint }>

      /**
       *A slash for the given validator, for the given percentage of their stake, at the given
       *era as been reported.
       */
      SlashReported: PlainDescriptor<{
        validator: SS58String
        fraction: number
        slash_era: number
      }>

      /**
       *An old slashing report from a prior era was discarded because it could
       *not be processed.
       */
      OldSlashingReportDiscarded: PlainDescriptor<{ session_index: number }>

      /**
       *A new set of stakers was elected.
       */
      StakersElected: PlainDescriptor<undefined>

      /**
       *An account has bonded this amount. \[stash, amount\]
       *
       *NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
       *it will not be emitted for staking rewards when they are added to stake.
       */
      Bonded: PlainDescriptor<{ stash: SS58String; amount: bigint }>

      /**
       *An account has unbonded this amount.
       */
      Unbonded: PlainDescriptor<{ stash: SS58String; amount: bigint }>

      /**
       *An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
       *from the unlocking queue.
       */
      Withdrawn: PlainDescriptor<{ stash: SS58String; amount: bigint }>

      /**
       *A nominator has been kicked from a validator.
       */
      Kicked: PlainDescriptor<{ nominator: SS58String; stash: SS58String }>

      /**
       *The election failed. No new era is planned.
       */
      StakingElectionFailed: PlainDescriptor<undefined>

      /**
       *An account has stopped participating as either a validator or nominator.
       */
      Chilled: PlainDescriptor<{ stash: SS58String }>

      /**
       *The stakers' rewards are getting paid.
       */
      PayoutStarted: PlainDescriptor<{
        era_index: number
        validator_stash: SS58String
      }>

      /**
       *A validator has set their preferences.
       */
      ValidatorPrefsSet: PlainDescriptor<{
        stash: SS58String
        prefs: Anonymize<I9o7ssi9vmhmgr>
      }>

      /**
       *Voters size limit reached.
       */
      SnapshotVotersSizeExceeded: PlainDescriptor<{ size: number }>

      /**
       *Targets size limit reached.
       */
      SnapshotTargetsSizeExceeded: PlainDescriptor<{ size: number }>

      /**
       *A new force era mode was set.
       */
      ForceEra: PlainDescriptor<{ mode: StakingForcing }>
    },
    {
      /**
       *Not a controller account.
       */
      NotController: PlainDescriptor<undefined>

      /**
       *Not a stash account.
       */
      NotStash: PlainDescriptor<undefined>

      /**
       *Stash is already bonded.
       */
      AlreadyBonded: PlainDescriptor<undefined>

      /**
       *Controller is already paired.
       */
      AlreadyPaired: PlainDescriptor<undefined>

      /**
       *Targets cannot be empty.
       */
      EmptyTargets: PlainDescriptor<undefined>

      /**
       *Duplicate index.
       */
      DuplicateIndex: PlainDescriptor<undefined>

      /**
       *Slash record index out of bounds.
       */
      InvalidSlashIndex: PlainDescriptor<undefined>

      /**
       *Cannot have a validator or nominator role, with value less than the minimum defined by
       *governance (see `MinValidatorBond` and `MinNominatorBond`). If unbonding is the
       *intention, `chill` first to remove one's role as validator/nominator.
       */
      InsufficientBond: PlainDescriptor<undefined>

      /**
       *Can not schedule more unlock chunks.
       */
      NoMoreChunks: PlainDescriptor<undefined>

      /**
       *Can not rebond without unlocking chunks.
       */
      NoUnlockChunk: PlainDescriptor<undefined>

      /**
       *Attempting to target a stash that still has funds.
       */
      FundedTarget: PlainDescriptor<undefined>

      /**
       *Invalid era to reward.
       */
      InvalidEraToReward: PlainDescriptor<undefined>

      /**
       *Invalid number of nominations.
       */
      InvalidNumberOfNominations: PlainDescriptor<undefined>

      /**
       *Items are not sorted and unique.
       */
      NotSortedAndUnique: PlainDescriptor<undefined>

      /**
       *Rewards for this era have already been claimed for this validator.
       */
      AlreadyClaimed: PlainDescriptor<undefined>

      /**
       *Incorrect previous history depth input provided.
       */
      IncorrectHistoryDepth: PlainDescriptor<undefined>

      /**
       *Incorrect number of slashing spans provided.
       */
      IncorrectSlashingSpans: PlainDescriptor<undefined>

      /**
       *Internal state has become somehow corrupted and the operation cannot continue.
       */
      BadState: PlainDescriptor<undefined>

      /**
       *Too many nomination targets supplied.
       */
      TooManyTargets: PlainDescriptor<undefined>

      /**
       *A nomination target was supplied that was blocked or otherwise not a validator.
       */
      BadTarget: PlainDescriptor<undefined>

      /**
       *The user has enough bond and thus cannot be chilled forcefully by an external person.
       */
      CannotChillOther: PlainDescriptor<undefined>

      /**
       *There are too many nominators in the system. Governance needs to adjust the staking
       *settings to keep things safe for the runtime.
       */
      TooManyNominators: PlainDescriptor<undefined>

      /**
       *There are too many validator candidates in the system. Governance needs to adjust the
       *staking settings to keep things safe for the runtime.
       */
      TooManyValidators: PlainDescriptor<undefined>

      /**
       *Commission is too low. Must be at least `MinCommission`.
       */
      CommissionTooLow: PlainDescriptor<undefined>

      /**
       *Some bound is not met.
       */
      BoundNotMet: PlainDescriptor<undefined>
    },
    {
      /**
       * Number of eras to keep in history.
       *
       * Following information is kept for eras in `[current_era -
       * HistoryDepth, current_era]`: `ErasStakers`, `ErasStakersClipped`,
       * `ErasValidatorPrefs`, `ErasValidatorReward`, `ErasRewardPoints`,
       * `ErasTotalStake`, `ErasStartSessionIndex`,
       * `StakingLedger.claimed_rewards`.
       *
       * Must be more than the number of eras delayed by session.
       * I.e. active era must always be in history. I.e. `active_era >
       * current_era - history_depth` must be guaranteed.
       *
       * If migrating an existing pallet from storage value to config value,
       * this should be set to same value or greater as in storage.
       *
       * Note: `HistoryDepth` is used as the upper bound for the `BoundedVec`
       * item `StakingLedger.claimed_rewards`. Setting this value lower than
       * the existing value can lead to inconsistencies in the
       * `StakingLedger` and will need to be handled properly in a migration.
       * The test `reducing_history_depth_abrupt` shows this effect.
       */
      HistoryDepth: PlainDescriptor<number>

      /**
       * Number of sessions per era.
       */
      SessionsPerEra: PlainDescriptor<number>

      /**
       * Number of eras that staked funds must remain bonded for.
       */
      BondingDuration: PlainDescriptor<number>

      /**
       * Number of eras that slashes are deferred by, after computation.
       *
       * This should be less than the bonding duration. Set to 0 if slashes
       * should be applied immediately, without opportunity for intervention.
       */
      SlashDeferDuration: PlainDescriptor<number>

      /**
       * The maximum number of nominators rewarded for each validator.
       *
       * For each validator only the `$MaxNominatorRewardedPerValidator` biggest stakers can
       * claim their reward. This used to limit the i/o cost for the nominator payout.
       */
      MaxNominatorRewardedPerValidator: PlainDescriptor<number>

      /**
       * The maximum number of `unlocking` chunks a [`StakingLedger`] can
       * have. Effectively determines how many unique eras a staker may be
       * unbonding in.
       *
       * Note: `MaxUnlockingChunks` is used as the upper bound for the
       * `BoundedVec` item `StakingLedger.unlocking`. Setting this value
       * lower than the existing value can lead to inconsistencies in the
       * `StakingLedger` and will need to be handled properly in a runtime
       * migration. The test `reducing_max_unlocking_chunks_abrupt` shows
       * this effect.
       */
      MaxUnlockingChunks: PlainDescriptor<number>
    },
  ]
  Offences: [
    {
      /**
       * The primary structure that holds all offence records keyed by report identifiers.
       */
      Reports: StorageDescriptor<
        [Key: Binary],
        {
          offender: Anonymize<Idi27pva6ajg4>
          reporters: Anonymize<Ia2lhg7l2hilo3>
        },
        true
      >

      /**
       * A vector of reports of the same kind that happened at the same time slot.
       */
      ConcurrentReportsIndex: StorageDescriptor<
        [Binary, Binary],
        Array<Binary>,
        false
      >
    },
    {},
    {
      /**
       *There is an offence reported of the given `kind` happened at the `session_index` and
       *(kind-specific) time slot. This event is not deposited for duplicate slashes.
       *\[kind, timeslot\].
       */
      Offence: PlainDescriptor<{ kind: Binary; timeslot: Binary }>
    },
    {},
    {},
  ]
  Historical: [{}, {}, {}, {}, {}]
  Session: [
    {
      /**
       * The current set of validators.
       */
      Validators: StorageDescriptor<[], Array<SS58String>, false>

      /**
       * Current index of the session.
       */
      CurrentIndex: StorageDescriptor<[], number, false>

      /**
       * True if the underlying economic identities or weighting behind the validators
       * has changed in the queued validator set.
       */
      QueuedChanged: StorageDescriptor<[], boolean, false>

      /**
       * The queued keys for the next session. When the next session begins, these keys
       * will be used to determine the validator's session keys.
       */
      QueuedKeys: StorageDescriptor<[], Array<Anonymize<Idp8pf1r5mria2>>, false>

      /**
       * Indices of disabled validators.
       *
       * The vec is always kept sorted so that we can find whether a given validator is
       * disabled using binary search. It gets cleared when `on_session_ending` returns
       * a new set of identities.
       */
      DisabledValidators: StorageDescriptor<[], Array<number>, false>

      /**
       * The next session keys for a validator.
       */
      NextKeys: StorageDescriptor<
        [Key: SS58String],
        {
          grandpa: Binary
          babe: Binary
          im_online: Binary
          para_validator: Binary
          para_assignment: Binary
          authority_discovery: Binary
          beefy: Binary
        },
        true
      >

      /**
       * The owner of a key. The key is the `KeyTypeId` + the encoded key.
       */
      KeyOwner: StorageDescriptor<[Key: [Binary, Binary]], SS58String, true>
    },
    {
      /**
       *See [`Pallet::set_keys`].
       */
      set_keys: TxDescriptor<{ keys: Anonymize<I4g61cdhi06s1m>; proof: Binary }>

      /**
       *See [`Pallet::purge_keys`].
       */
      purge_keys: TxDescriptor<undefined>
    },
    {
      /**
       *New session has happened. Note that the argument is the session index, not the
       *block number as the type might suggest.
       */
      NewSession: PlainDescriptor<{ session_index: number }>
    },
    {
      /**
       *Invalid ownership proof.
       */
      InvalidProof: PlainDescriptor<undefined>

      /**
       *No associated validator ID for account.
       */
      NoAssociatedValidatorId: PlainDescriptor<undefined>

      /**
       *Registered duplicate key.
       */
      DuplicatedKey: PlainDescriptor<undefined>

      /**
       *No keys are associated with this account.
       */
      NoKeys: PlainDescriptor<undefined>

      /**
       *Key setting account is not live, so it's impossible to associate keys.
       */
      NoAccount: PlainDescriptor<undefined>
    },
    {},
  ]
  Grandpa: [
    {
      /**
       * State of the current authority set.
       */
      State: StorageDescriptor<[], GrandpaStoredState, false>

      /**
       * Pending change: (signaled at, scheduled change).
       */
      PendingChange: StorageDescriptor<
        [],
        {
          scheduled_at: number
          delay: number
          next_authorities: Anonymize<I2qinct8jq4bqe>
          forced: Anonymize<I4arjljr6dpflb>
        },
        true
      >

      /**
       * next block number where we can force a change.
       */
      NextForced: StorageDescriptor<[], number, true>

      /**
       * `true` if we are currently stalled.
       */
      Stalled: StorageDescriptor<[], [number, number], true>

      /**
       * The number of changes (both in terms of keys and underlying economic responsibilities)
       * in the "set" of Grandpa validators from genesis.
       */
      CurrentSetId: StorageDescriptor<[], bigint, false>

      /**
       * A mapping from grandpa set ID to the index of the *most recent* session for which its
       * members were responsible.
       *
       * This is only used for validating equivocation proofs. An equivocation proof must
       * contains a key-ownership proof for a given session, therefore we need a way to tie
       * together sessions and GRANDPA set ids, i.e. we need to validate that a validator
       * was the owner of a given key on a given session, and what the active set ID was
       * during that session.
       *
       * TWOX-NOTE: `SetId` is not under user control.
       */
      SetIdSession: StorageDescriptor<[Key: bigint], number, true>
    },
    {
      /**
       *See [`Pallet::report_equivocation`].
       */
      report_equivocation: TxDescriptor<{
        equivocation_proof: Anonymize<I95fr9lj1pb8v8>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::report_equivocation_unsigned`].
       */
      report_equivocation_unsigned: TxDescriptor<{
        equivocation_proof: Anonymize<I95fr9lj1pb8v8>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::note_stalled`].
       */
      note_stalled: TxDescriptor<{
        delay: number
        best_finalized_block_number: number
      }>
    },
    {
      /**
       *New authority set has been applied.
       */
      NewAuthorities: PlainDescriptor<{
        authority_set: Anonymize<I2qinct8jq4bqe>
      }>

      /**
       *Current authority set has been paused.
       */
      Paused: PlainDescriptor<undefined>

      /**
       *Current authority set has been resumed.
       */
      Resumed: PlainDescriptor<undefined>
    },
    {
      /**
       *Attempt to signal GRANDPA pause when the authority set isn't live
       *(either paused or already pending pause).
       */
      PauseFailed: PlainDescriptor<undefined>

      /**
       *Attempt to signal GRANDPA resume when the authority set isn't paused
       *(either live or already pending resume).
       */
      ResumeFailed: PlainDescriptor<undefined>

      /**
       *Attempt to signal GRANDPA change with one already pending.
       */
      ChangePending: PlainDescriptor<undefined>

      /**
       *Cannot signal forced change so soon after last.
       */
      TooSoon: PlainDescriptor<undefined>

      /**
       *A key ownership proof provided as part of an equivocation report is invalid.
       */
      InvalidKeyOwnershipProof: PlainDescriptor<undefined>

      /**
       *An equivocation proof provided as part of an equivocation report is invalid.
       */
      InvalidEquivocationProof: PlainDescriptor<undefined>

      /**
       *A given equivocation report is valid but already previously reported.
       */
      DuplicateOffenceReport: PlainDescriptor<undefined>
    },
    {
      /**
       * Max Authorities in use
       */
      MaxAuthorities: PlainDescriptor<number>

      /**
       * The maximum number of nominators for each validator.
       */
      MaxNominators: PlainDescriptor<number>

      /**
       * The maximum number of entries to keep in the set id to session index mapping.
       *
       * Since the `SetIdSession` map is only used for validating equivocations this
       * value should relate to the bonding duration of whatever staking system is
       * being used (if any). If equivocation handling is not enabled then this value
       * can be zero.
       */
      MaxSetIdSessionEntries: PlainDescriptor<bigint>
    },
  ]
  ImOnline: [
    {
      /**
       * The block number after which it's ok to send heartbeats in the current
       * session.
       *
       * At the beginning of each session we set this to a value that should fall
       * roughly in the middle of the session duration. The idea is to first wait for
       * the validators to produce a block in the current session, so that the
       * heartbeat later on will not be necessary.
       *
       * This value will only be used as a fallback if we fail to get a proper session
       * progress estimate from `NextSessionRotation`, as those estimates should be
       * more accurate then the value we calculate for `HeartbeatAfter`.
       */
      HeartbeatAfter: StorageDescriptor<[], number, false>

      /**
       * The current set of keys that may issue a heartbeat.
       */
      Keys: StorageDescriptor<[], Array<Binary>, false>

      /**
       * For each session index, we keep a mapping of `SessionIndex` and `AuthIndex`.
       */
      ReceivedHeartbeats: StorageDescriptor<[number, number], boolean, true>

      /**
       * For each session index, we keep a mapping of `ValidatorId<T>` to the
       * number of blocks authored by the given authority.
       */
      AuthoredBlocks: StorageDescriptor<[number, SS58String], number, false>
    },
    {
      /**
       *See [`Pallet::heartbeat`].
       */
      heartbeat: TxDescriptor<{
        heartbeat: Anonymize<I7a9s2tcf2ejdv>
        signature: Binary
      }>
    },
    {
      /**
       *A new heartbeat was received from `AuthorityId`.
       */
      HeartbeatReceived: PlainDescriptor<{ authority_id: Binary }>

      /**
       *At the end of the session, no offence was committed.
       */
      AllGood: PlainDescriptor<undefined>

      /**
       *At the end of the session, at least one validator was found to be offline.
       */
      SomeOffline: PlainDescriptor<{ offline: Anonymize<I67ag5q10ogtvt> }>
    },
    {
      /**
       *Non existent public key.
       */
      InvalidKey: PlainDescriptor<undefined>

      /**
       *Duplicated heartbeat.
       */
      DuplicatedHeartbeat: PlainDescriptor<undefined>
    },
    {
      /**
       * A configuration for base priority of unsigned transactions.
       *
       * This is exposed so that it can be tuned for particular runtime, when
       * multiple pallets send unsigned transactions.
       */
      UnsignedPriority: PlainDescriptor<bigint>
    },
  ]
  AuthorityDiscovery: [{}, {}, {}, {}, {}]
  Treasury: [
    {
      /**
       * Number of proposals that have been made.
       */
      ProposalCount: StorageDescriptor<[], number, false>

      /**
       * Proposals that have been made.
       */
      Proposals: StorageDescriptor<
        [Key: number],
        {
          proposer: SS58String
          value: bigint
          beneficiary: SS58String
          bond: bigint
        },
        true
      >

      /**
       * The amount which has been reported as inactive to Currency.
       */
      Deactivated: StorageDescriptor<[], bigint, false>

      /**
       * Proposal indices that have been approved but not yet awarded.
       */
      Approvals: StorageDescriptor<[], Array<number>, false>

      /**
       * The count of spends that have been made.
       */
      SpendCount: StorageDescriptor<[], number, false>

      /**
       * Spends that have been approved and being processed.
       */
      Spends: StorageDescriptor<
        [Key: number],
        {
          asset_kind: Anonymize<I32r9skkupsthv>
          amount: bigint
          beneficiary: XcmVersionedMultiLocation
          valid_from: number
          expire_at: number
          status: Anonymize<Ie3iqv87ntls1>
        },
        true
      >
    },
    {
      /**
       *See [`Pallet::propose_spend`].
       */
      propose_spend: TxDescriptor<{ value: bigint; beneficiary: MultiAddress }>

      /**
       *See [`Pallet::reject_proposal`].
       */
      reject_proposal: TxDescriptor<{ proposal_id: number }>

      /**
       *See [`Pallet::approve_proposal`].
       */
      approve_proposal: TxDescriptor<{ proposal_id: number }>

      /**
       *See [`Pallet::spend_local`].
       */
      spend_local: TxDescriptor<{ amount: bigint; beneficiary: MultiAddress }>

      /**
       *See [`Pallet::remove_approval`].
       */
      remove_approval: TxDescriptor<{ proposal_id: number }>

      /**
       *See [`Pallet::spend`].
       */
      spend: TxDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
        amount: bigint
        beneficiary: XcmVersionedMultiLocation
        valid_from: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::payout`].
       */
      payout: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::check_status`].
       */
      check_status: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::void_spend`].
       */
      void_spend: TxDescriptor<{ index: number }>
    },
    {
      /**
       *New proposal.
       */
      Proposed: PlainDescriptor<{ proposal_index: number }>

      /**
       *We have ended a spend period and will now allocate funds.
       */
      Spending: PlainDescriptor<{ budget_remaining: bigint }>

      /**
       *Some funds have been allocated.
       */
      Awarded: PlainDescriptor<{
        proposal_index: number
        award: bigint
        account: SS58String
      }>

      /**
       *A proposal was rejected; funds were slashed.
       */
      Rejected: PlainDescriptor<{ proposal_index: number; slashed: bigint }>

      /**
       *Some of our funds have been burnt.
       */
      Burnt: PlainDescriptor<{ burnt_funds: bigint }>

      /**
       *Spending has finished; this is the amount that rolls over until next spend.
       */
      Rollover: PlainDescriptor<{ rollover_balance: bigint }>

      /**
       *Some funds have been deposited.
       */
      Deposit: PlainDescriptor<{ value: bigint }>

      /**
       *A new spend proposal has been approved.
       */
      SpendApproved: PlainDescriptor<{
        proposal_index: number
        amount: bigint
        beneficiary: SS58String
      }>

      /**
       *The inactive funds of the pallet have been updated.
       */
      UpdatedInactive: PlainDescriptor<{
        reactivated: bigint
        deactivated: bigint
      }>

      /**
       *A new asset spend proposal has been approved.
       */
      AssetSpendApproved: PlainDescriptor<{
        index: number
        asset_kind: Anonymize<I32r9skkupsthv>
        amount: bigint
        beneficiary: XcmVersionedMultiLocation
        valid_from: number
        expire_at: number
      }>

      /**
       *An approved spend was voided.
       */
      AssetSpendVoided: PlainDescriptor<{ index: number }>

      /**
       *A payment happened.
       */
      Paid: PlainDescriptor<{ index: number; payment_id: bigint }>

      /**
       *A payment failed and can be retried.
       */
      PaymentFailed: PlainDescriptor<{ index: number; payment_id: bigint }>

      /**
       *A spend was processed and removed from the storage. It might have been successfully
       *paid or it may have expired.
       */
      SpendProcessed: PlainDescriptor<{ index: number }>
    },
    {
      /**
       *Proposer's balance is too low.
       */
      InsufficientProposersBalance: PlainDescriptor<undefined>

      /**
       *No proposal, bounty or spend at that index.
       */
      InvalidIndex: PlainDescriptor<undefined>

      /**
       *Too many approvals in the queue.
       */
      TooManyApprovals: PlainDescriptor<undefined>

      /**
       *The spend origin is valid but the amount it is allowed to spend is lower than the
       *amount to be spent.
       */
      InsufficientPermission: PlainDescriptor<undefined>

      /**
       *Proposal has not been approved.
       */
      ProposalNotApproved: PlainDescriptor<undefined>

      /**
       *The balance of the asset kind is not convertible to the balance of the native asset.
       */
      FailedToConvertBalance: PlainDescriptor<undefined>

      /**
       *The spend has expired and cannot be claimed.
       */
      SpendExpired: PlainDescriptor<undefined>

      /**
       *The spend is not yet eligible for payout.
       */
      EarlyPayout: PlainDescriptor<undefined>

      /**
       *The payment has already been attempted.
       */
      AlreadyAttempted: PlainDescriptor<undefined>

      /**
       *There was some issue with the mechanism of payment.
       */
      PayoutError: PlainDescriptor<undefined>

      /**
       *The payout was not yet attempted/claimed.
       */
      NotAttempted: PlainDescriptor<undefined>

      /**
       *The payment has neither failed nor succeeded yet.
       */
      Inconclusive: PlainDescriptor<undefined>
    },
    {
      /**
       * Fraction of a proposal's value that should be bonded in order to place the proposal.
       * An accepted proposal gets these back. A rejected proposal does not.
       */
      ProposalBond: PlainDescriptor<number>

      /**
       * Minimum amount of funds that should be placed in a deposit for making a proposal.
       */
      ProposalBondMinimum: PlainDescriptor<bigint>

      /**
       * Maximum amount of funds that should be placed in a deposit for making a proposal.
       */
      ProposalBondMaximum: PlainDescriptor<bigint | undefined>

      /**
       * Period between successive spends.
       */
      SpendPeriod: PlainDescriptor<number>

      /**
       * Percentage of spare funds (if any) that are burnt per spend period.
       */
      Burn: PlainDescriptor<number>

      /**
       * The treasury's pallet id, used for deriving its sovereign account ID.
       */
      PalletId: PlainDescriptor<Binary>

      /**
       * The maximum number of approvals that can wait in the spending queue.
       *
       * NOTE: This parameter is also used within the Bounties Pallet extension if enabled.
       */
      MaxApprovals: PlainDescriptor<number>

      /**
       * The period during which an approved treasury spend has to be claimed.
       */
      PayoutPeriod: PlainDescriptor<number>
    },
  ]
  ConvictionVoting: [
    {
      /**
       * All voting for a particular voter in a particular voting class. We store the balance for the
       * number of votes that we have recorded.
       */
      VotingFor: StorageDescriptor<
        [SS58String, number],
        ConvictionVotingVoteVoting,
        false
      >

      /**
       * The voting classes which have a non-zero lock requirement and the lock amounts which they
       * require. The actual amount locked on behalf of this pallet should always be the maximum of
       * this list.
       */
      ClassLocksFor: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I4ojmnsk1dchql>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::vote`].
       */
      vote: TxDescriptor<{
        poll_index: number
        vote: ConvictionVotingVoteAccountVote
      }>

      /**
       *See [`Pallet::delegate`].
       */
      delegate: TxDescriptor<{
        class: number
        to: MultiAddress
        conviction: VotingConviction
        balance: bigint
      }>

      /**
       *See [`Pallet::undelegate`].
       */
      undelegate: TxDescriptor<{ class: number }>

      /**
       *See [`Pallet::unlock`].
       */
      unlock: TxDescriptor<{ class: number; target: MultiAddress }>

      /**
       *See [`Pallet::remove_vote`].
       */
      remove_vote: TxDescriptor<{
        class: Anonymize<I4arjljr6dpflb>
        index: number
      }>

      /**
       *See [`Pallet::remove_other_vote`].
       */
      remove_other_vote: TxDescriptor<{
        target: MultiAddress
        class: number
        index: number
      }>
    },
    {
      /**
       *An account has delegated their vote to another account. \[who, target\]
       */
      Delegated: PlainDescriptor<[SS58String, SS58String]>

      /**
       *An \[account\] has cancelled a previous delegation operation.
       */
      Undelegated: PlainDescriptor<SS58String>
    },
    {
      /**
       *Poll is not ongoing.
       */
      NotOngoing: PlainDescriptor<undefined>

      /**
       *The given account did not vote on the poll.
       */
      NotVoter: PlainDescriptor<undefined>

      /**
       *The actor has no permission to conduct the action.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The actor has no permission to conduct the action right now but will do in the future.
       */
      NoPermissionYet: PlainDescriptor<undefined>

      /**
       *The account is already delegating.
       */
      AlreadyDelegating: PlainDescriptor<undefined>

      /**
       *The account currently has votes attached to it and the operation cannot succeed until
       *these are removed, either through `unvote` or `reap_vote`.
       */
      AlreadyVoting: PlainDescriptor<undefined>

      /**
       *Too high a balance was provided that the account cannot afford.
       */
      InsufficientFunds: PlainDescriptor<undefined>

      /**
       *The account is not currently delegating.
       */
      NotDelegating: PlainDescriptor<undefined>

      /**
       *Delegation to oneself makes no sense.
       */
      Nonsense: PlainDescriptor<undefined>

      /**
       *Maximum number of votes reached.
       */
      MaxVotesReached: PlainDescriptor<undefined>

      /**
       *The class must be supplied since it is not easily determinable from the state.
       */
      ClassNeeded: PlainDescriptor<undefined>

      /**
       *The class ID supplied is invalid.
       */
      BadClass: PlainDescriptor<undefined>
    },
    {
      /**
       * The maximum number of concurrent votes an account may have.
       *
       * Also used to compute weight, an overly large value can lead to extrinsics with large
       * weight estimation: see `delegate` for instance.
       */
      MaxVotes: PlainDescriptor<number>

      /**
       * The minimum period of vote locking.
       *
       * It should be no shorter than enactment period to ensure that in the case of an approval,
       * those successful voters are locked into the consequences that their votes entail.
       */
      VoteLockingPeriod: PlainDescriptor<number>
    },
  ]
  Referenda: [
    {
      /**
       * The next free referendum index, aka the number of referenda started so far.
       */
      ReferendumCount: StorageDescriptor<[], number, false>

      /**
       * Information concerning any given referendum.
       */
      ReferendumInfoFor: StorageDescriptor<
        [Key: number],
        ReferendaTypesReferendumInfo,
        true
      >

      /**
       * The sorted list of referenda ready to be decided but not yet being decided, ordered by
       * conviction-weighted approvals.
       *
       * This should be empty if `DecidingCount` is less than `TrackInfo::max_deciding`.
       */
      TrackQueue: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I4ojmnsk1dchql>>,
        false
      >

      /**
       * The number of referenda being decided currently.
       */
      DecidingCount: StorageDescriptor<[Key: number], number, false>

      /**
       * The metadata is a general information concerning the referendum.
       * The `Hash` refers to the preimage of the `Preimages` provider which can be a JSON
       * dump or IPFS hash of a JSON file.
       *
       * Consider a garbage collection for a metadata of finished referendums to `unrequest` (remove)
       * large preimages.
       */
      MetadataOf: StorageDescriptor<[Key: number], Binary, true>
    },
    {
      /**
       *See [`Pallet::submit`].
       */
      submit: TxDescriptor<{
        proposal_origin: PolkadotRuntimeOriginCaller
        proposal: PreimagesBounded
        enactment_moment: TraitsScheduleDispatchTime
      }>

      /**
       *See [`Pallet::place_decision_deposit`].
       */
      place_decision_deposit: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::refund_decision_deposit`].
       */
      refund_decision_deposit: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::cancel`].
       */
      cancel: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::kill`].
       */
      kill: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::nudge_referendum`].
       */
      nudge_referendum: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::one_fewer_deciding`].
       */
      one_fewer_deciding: TxDescriptor<{ track: number }>

      /**
       *See [`Pallet::refund_submission_deposit`].
       */
      refund_submission_deposit: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{
        index: number
        maybe_hash: Anonymize<I17k3ujudqd5df>
      }>
    },
    {
      /**
       *A referendum has been submitted.
       */
      Submitted: PlainDescriptor<{
        index: number
        track: number
        proposal: PreimagesBounded
      }>

      /**
       *The decision deposit has been placed.
       */
      DecisionDepositPlaced: PlainDescriptor<{
        index: number
        who: SS58String
        amount: bigint
      }>

      /**
       *The decision deposit has been refunded.
       */
      DecisionDepositRefunded: PlainDescriptor<{
        index: number
        who: SS58String
        amount: bigint
      }>

      /**
       *A deposit has been slashaed.
       */
      DepositSlashed: PlainDescriptor<{ who: SS58String; amount: bigint }>

      /**
       *A referendum has moved into the deciding phase.
       */
      DecisionStarted: PlainDescriptor<{
        index: number
        track: number
        proposal: PreimagesBounded
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**

 */
      ConfirmStarted: PlainDescriptor<{ index: number }>

      /**

 */
      ConfirmAborted: PlainDescriptor<{ index: number }>

      /**
       *A referendum has ended its confirmation phase and is ready for approval.
       */
      Confirmed: PlainDescriptor<{
        index: number
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**
       *A referendum has been approved and its proposal has been scheduled.
       */
      Approved: PlainDescriptor<{ index: number }>

      /**
       *A proposal has been rejected by referendum.
       */
      Rejected: PlainDescriptor<{
        index: number
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**
       *A referendum has been timed out without being decided.
       */
      TimedOut: PlainDescriptor<{
        index: number
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**
       *A referendum has been cancelled.
       */
      Cancelled: PlainDescriptor<{
        index: number
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**
       *A referendum has been killed.
       */
      Killed: PlainDescriptor<{
        index: number
        tally: Anonymize<Ifsk7cbmtit1jd>
      }>

      /**
       *The submission deposit has been refunded.
       */
      SubmissionDepositRefunded: PlainDescriptor<{
        index: number
        who: SS58String
        amount: bigint
      }>

      /**
       *Metadata for a referendum has been set.
       */
      MetadataSet: PlainDescriptor<{ index: number; hash: Binary }>

      /**
       *Metadata for a referendum has been cleared.
       */
      MetadataCleared: PlainDescriptor<{ index: number; hash: Binary }>
    },
    {
      /**
       *Referendum is not ongoing.
       */
      NotOngoing: PlainDescriptor<undefined>

      /**
       *Referendum's decision deposit is already paid.
       */
      HasDeposit: PlainDescriptor<undefined>

      /**
       *The track identifier given was invalid.
       */
      BadTrack: PlainDescriptor<undefined>

      /**
       *There are already a full complement of referenda in progress for this track.
       */
      Full: PlainDescriptor<undefined>

      /**
       *The queue of the track is empty.
       */
      QueueEmpty: PlainDescriptor<undefined>

      /**
       *The referendum index provided is invalid in this context.
       */
      BadReferendum: PlainDescriptor<undefined>

      /**
       *There was nothing to do in the advancement.
       */
      NothingToDo: PlainDescriptor<undefined>

      /**
       *No track exists for the proposal origin.
       */
      NoTrack: PlainDescriptor<undefined>

      /**
       *Any deposit cannot be refunded until after the decision is over.
       */
      Unfinished: PlainDescriptor<undefined>

      /**
       *The deposit refunder is not the depositor.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The deposit cannot be refunded since none was made.
       */
      NoDeposit: PlainDescriptor<undefined>

      /**
       *The referendum status is invalid for this operation.
       */
      BadStatus: PlainDescriptor<undefined>

      /**
       *The preimage does not exist.
       */
      PreimageNotExist: PlainDescriptor<undefined>
    },
    {
      /**
       * The minimum amount to be used as a deposit for a public referendum proposal.
       */
      SubmissionDeposit: PlainDescriptor<bigint>

      /**
       * Maximum size of the referendum queue for a single track.
       */
      MaxQueued: PlainDescriptor<number>

      /**
       * The number of blocks after submission that a referendum must begin being decided by.
       * Once this passes, then anyone may cancel the referendum.
       */
      UndecidingTimeout: PlainDescriptor<number>

      /**
       * Quantization level for the referendum wakeup scheduler. A higher number will result in
       * fewer storage reads/writes needed for smaller voters, but also result in delays to the
       * automatic referendum status changes. Explicit servicing instructions are unaffected.
       */
      AlarmInterval: PlainDescriptor<number>

      /**
       * Information concerning the different referendum tracks.
       */
      Tracks: PlainDescriptor<Array<Anonymize<Ida9vhl30l98p4>>>
    },
  ]
  Whitelist: [
    {
      /**

 */
      WhitelistedCall: StorageDescriptor<[Key: Binary], undefined, true>
    },
    {
      /**
       *See [`Pallet::whitelist_call`].
       */
      whitelist_call: TxDescriptor<{ call_hash: Binary }>

      /**
       *See [`Pallet::remove_whitelisted_call`].
       */
      remove_whitelisted_call: TxDescriptor<{ call_hash: Binary }>

      /**
       *See [`Pallet::dispatch_whitelisted_call`].
       */
      dispatch_whitelisted_call: TxDescriptor<{
        call_hash: Binary
        call_encoded_len: number
        call_weight_witness: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::dispatch_whitelisted_call_with_preimage`].
       */
      dispatch_whitelisted_call_with_preimage: TxDescriptor<{
        call: Anonymize<I8e6un4uk1q07c>
      }>
    },
    {
      /**

 */
      CallWhitelisted: PlainDescriptor<{ call_hash: Binary }>

      /**

 */
      WhitelistedCallRemoved: PlainDescriptor<{ call_hash: Binary }>

      /**

 */
      WhitelistedCallDispatched: PlainDescriptor<{
        call_hash: Binary
        result: Anonymize<Idurpak8qagatr>
      }>
    },
    {
      /**
       *The preimage of the call hash could not be loaded.
       */
      UnavailablePreImage: PlainDescriptor<undefined>

      /**
       *The call could not be decoded.
       */
      UndecodableCall: PlainDescriptor<undefined>

      /**
       *The weight of the decoded call was higher than the witness.
       */
      InvalidCallWeightWitness: PlainDescriptor<undefined>

      /**
       *The call was not whitelisted.
       */
      CallIsNotWhitelisted: PlainDescriptor<undefined>

      /**
       *The call was already whitelisted; No-Op.
       */
      CallAlreadyWhitelisted: PlainDescriptor<undefined>
    },
    {},
  ]
  Claims: [
    {
      /**

 */
      Claims: StorageDescriptor<[Key: Binary], bigint, true>

      /**

 */
      Total: StorageDescriptor<[], bigint, false>

      /**
       * Vesting schedule for a claim.
       * First balance is the total amount that should be held for vesting.
       * Second balance is how much should be unlocked per block.
       * The block number is when the vesting should start.
       */
      Vesting: StorageDescriptor<[Key: Binary], [bigint, bigint, number], true>

      /**
       * The statement kind that must be signed, if any.
       */
      Signing: StorageDescriptor<[Key: Binary], ClaimsStatementKind, true>

      /**
       * Pre-claimed Ethereum accounts, by the Account ID that they are claimed to.
       */
      Preclaims: StorageDescriptor<[Key: SS58String], Binary, true>
    },
    {
      /**
       *See [`Pallet::claim`].
       */
      claim: TxDescriptor<{ dest: SS58String; ethereum_signature: Binary }>

      /**
       *See [`Pallet::mint_claim`].
       */
      mint_claim: TxDescriptor<{
        who: Binary
        value: bigint
        vesting_schedule: Anonymize<I70kqehrkegc98>
        statement: Anonymize<I6rcr4im2g3gv9>
      }>

      /**
       *See [`Pallet::claim_attest`].
       */
      claim_attest: TxDescriptor<{
        dest: SS58String
        ethereum_signature: Binary
        statement: Binary
      }>

      /**
       *See [`Pallet::attest`].
       */
      attest: TxDescriptor<{ statement: Binary }>

      /**
       *See [`Pallet::move_claim`].
       */
      move_claim: TxDescriptor<{
        old: Binary
        new: Binary
        maybe_preclaim: Anonymize<Ihfphjolmsqq1>
      }>
    },
    {
      /**
       *Someone claimed some DOTs.
       */
      Claimed: PlainDescriptor<{
        who: SS58String
        ethereum_address: Binary
        amount: bigint
      }>
    },
    {
      /**
       *Invalid Ethereum signature.
       */
      InvalidEthereumSignature: PlainDescriptor<undefined>

      /**
       *Ethereum address has no claim.
       */
      SignerHasNoClaim: PlainDescriptor<undefined>

      /**
       *Account ID sending transaction has no claim.
       */
      SenderHasNoClaim: PlainDescriptor<undefined>

      /**
       *There's not enough in the pot to pay out some unvested amount. Generally implies a
       *logic error.
       */
      PotUnderflow: PlainDescriptor<undefined>

      /**
       *A needed statement was not included.
       */
      InvalidStatement: PlainDescriptor<undefined>

      /**
       *The account already has a vested balance.
       */
      VestedBalanceExists: PlainDescriptor<undefined>
    },
    {
      /**

 */
      Prefix: PlainDescriptor<Binary>
    },
  ]
  Vesting: [
    {
      /**
       * Information regarding the vesting of a given account.
       */
      Vesting: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I4aro1m78pdrtt>>,
        true
      >

      /**
       * Storage version of the pallet.
       *
       * New networks start with latest version, as determined by the genesis build.
       */
      StorageVersion: StorageDescriptor<[], VestingReleases, false>
    },
    {
      /**
       *See [`Pallet::vest`].
       */
      vest: TxDescriptor<undefined>

      /**
       *See [`Pallet::vest_other`].
       */
      vest_other: TxDescriptor<{ target: MultiAddress }>

      /**
       *See [`Pallet::vested_transfer`].
       */
      vested_transfer: TxDescriptor<{
        target: MultiAddress
        schedule: Anonymize<I4aro1m78pdrtt>
      }>

      /**
       *See [`Pallet::force_vested_transfer`].
       */
      force_vested_transfer: TxDescriptor<{
        source: MultiAddress
        target: MultiAddress
        schedule: Anonymize<I4aro1m78pdrtt>
      }>

      /**
       *See [`Pallet::merge_schedules`].
       */
      merge_schedules: TxDescriptor<{
        schedule1_index: number
        schedule2_index: number
      }>
    },
    {
      /**
       *The amount vested has been updated. This could indicate a change in funds available.
       *The balance given is the amount which is left unvested (and thus locked).
       */
      VestingUpdated: PlainDescriptor<{ account: SS58String; unvested: bigint }>

      /**
       *An \[account\] has become fully vested.
       */
      VestingCompleted: PlainDescriptor<{ account: SS58String }>
    },
    {
      /**
       *The account given is not vesting.
       */
      NotVesting: PlainDescriptor<undefined>

      /**
       *The account already has `MaxVestingSchedules` count of schedules and thus
       *cannot add another one. Consider merging existing schedules in order to add another.
       */
      AtMaxVestingSchedules: PlainDescriptor<undefined>

      /**
       *Amount being transferred is too low to create a vesting schedule.
       */
      AmountLow: PlainDescriptor<undefined>

      /**
       *An index was out of bounds of the vesting schedules.
       */
      ScheduleIndexOutOfBounds: PlainDescriptor<undefined>

      /**
       *Failed to create a new schedule because some parameter was invalid.
       */
      InvalidScheduleParams: PlainDescriptor<undefined>
    },
    {
      /**
       * The minimum amount transferred to call `vested_transfer`.
       */
      MinVestedTransfer: PlainDescriptor<bigint>

      /**

 */
      MaxVestingSchedules: PlainDescriptor<number>
    },
  ]
  Utility: [
    {},
    {
      /**
       *See [`Pallet::batch`].
       */
      batch: TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>

      /**
       *See [`Pallet::as_derivative`].
       */
      as_derivative: TxDescriptor<{
        index: number
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::batch_all`].
       */
      batch_all: TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>

      /**
       *See [`Pallet::dispatch_as`].
       */
      dispatch_as: TxDescriptor<{
        as_origin: PolkadotRuntimeOriginCaller
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::force_batch`].
       */
      force_batch: TxDescriptor<{ calls: Anonymize<I1bfn7sbvfvk3t> }>

      /**
       *See [`Pallet::with_weight`].
       */
      with_weight: TxDescriptor<{
        call: Anonymize<I8e6un4uk1q07c>
        weight: Anonymize<I4q39t5hn830vp>
      }>
    },
    {
      /**
       *Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       *well as the error.
       */
      BatchInterrupted: PlainDescriptor<{ index: number; error: DispatchError }>

      /**
       *Batch of dispatches completed fully with no error.
       */
      BatchCompleted: PlainDescriptor<undefined>

      /**
       *Batch of dispatches completed but has errors.
       */
      BatchCompletedWithErrors: PlainDescriptor<undefined>

      /**
       *A single item within a Batch of dispatches has completed with no error.
       */
      ItemCompleted: PlainDescriptor<undefined>

      /**
       *A single item within a Batch of dispatches has completed with error.
       */
      ItemFailed: PlainDescriptor<{ error: DispatchError }>

      /**
       *A call was dispatched.
       */
      DispatchedAs: PlainDescriptor<{ result: Anonymize<Idtdr91jmq5g4i> }>
    },
    {
      /**
       *Too many calls batched.
       */
      TooManyCalls: PlainDescriptor<undefined>
    },
    {
      /**
       * The limit on the number of batched calls.
       */
      batched_calls_limit: PlainDescriptor<number>
    },
  ]
  Identity: [
    {
      /**
       * Information that is pertinent to identify the entity behind an account.
       *
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       */
      IdentityOf: StorageDescriptor<
        [Key: SS58String],
        {
          judgements: Anonymize<I8lr6mvrp6262n>
          deposit: bigint
          info: Anonymize<I939m6d6t3dsgm>
        },
        true
      >

      /**
       * The super-identity of an alternative "sub" identity together with its name, within that
       * context. If the account is not some other account's sub-identity, then just `None`.
       */
      SuperOf: StorageDescriptor<
        [Key: SS58String],
        [SS58String, IdentityTypesData],
        true
      >

      /**
       * Alternative "sub" identities of this account.
       *
       * The first item is the deposit, the second is a vector of the accounts.
       *
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       */
      SubsOf: StorageDescriptor<
        [Key: SS58String],
        [bigint, Anonymize<Ia2lhg7l2hilo3>],
        false
      >

      /**
       * The set of registrars. Not expected to get very big as can only be added through a
       * special origin (likely a council motion).
       *
       * The index into this can be cast to `RegistrarIndex` to get a valid value.
       */
      Registrars: StorageDescriptor<[], Array<Anonymize<I48v3sekdprq30>>, false>
    },
    {
      /**
       *See [`Pallet::add_registrar`].
       */
      add_registrar: TxDescriptor<{ account: MultiAddress }>

      /**
       *See [`Pallet::set_identity`].
       */
      set_identity: TxDescriptor<{ info: Anonymize<I939m6d6t3dsgm> }>

      /**
       *See [`Pallet::set_subs`].
       */
      set_subs: TxDescriptor<{ subs: Anonymize<I47e5e4dh41s5v> }>

      /**
       *See [`Pallet::clear_identity`].
       */
      clear_identity: TxDescriptor<undefined>

      /**
       *See [`Pallet::request_judgement`].
       */
      request_judgement: TxDescriptor<{ reg_index: number; max_fee: bigint }>

      /**
       *See [`Pallet::cancel_request`].
       */
      cancel_request: TxDescriptor<{ reg_index: number }>

      /**
       *See [`Pallet::set_fee`].
       */
      set_fee: TxDescriptor<{ index: number; fee: bigint }>

      /**
       *See [`Pallet::set_account_id`].
       */
      set_account_id: TxDescriptor<{ index: number; new: MultiAddress }>

      /**
       *See [`Pallet::set_fields`].
       */
      set_fields: TxDescriptor<{ index: number; fields: bigint }>

      /**
       *See [`Pallet::provide_judgement`].
       */
      provide_judgement: TxDescriptor<{
        reg_index: number
        target: MultiAddress
        judgement: IdentityJudgement
        identity: Binary
      }>

      /**
       *See [`Pallet::kill_identity`].
       */
      kill_identity: TxDescriptor<{ target: MultiAddress }>

      /**
       *See [`Pallet::add_sub`].
       */
      add_sub: TxDescriptor<{ sub: MultiAddress; data: IdentityTypesData }>

      /**
       *See [`Pallet::rename_sub`].
       */
      rename_sub: TxDescriptor<{ sub: MultiAddress; data: IdentityTypesData }>

      /**
       *See [`Pallet::remove_sub`].
       */
      remove_sub: TxDescriptor<{ sub: MultiAddress }>

      /**
       *See [`Pallet::quit_sub`].
       */
      quit_sub: TxDescriptor<undefined>
    },
    {
      /**
       *A name was set or reset (which will remove all judgements).
       */
      IdentitySet: PlainDescriptor<{ who: SS58String }>

      /**
       *A name was cleared, and the given balance returned.
       */
      IdentityCleared: PlainDescriptor<{ who: SS58String; deposit: bigint }>

      /**
       *A name was removed and the given balance slashed.
       */
      IdentityKilled: PlainDescriptor<{ who: SS58String; deposit: bigint }>

      /**
       *A judgement was asked from a registrar.
       */
      JudgementRequested: PlainDescriptor<{
        who: SS58String
        registrar_index: number
      }>

      /**
       *A judgement request was retracted.
       */
      JudgementUnrequested: PlainDescriptor<{
        who: SS58String
        registrar_index: number
      }>

      /**
       *A judgement was given by a registrar.
       */
      JudgementGiven: PlainDescriptor<{
        target: SS58String
        registrar_index: number
      }>

      /**
       *A registrar was added.
       */
      RegistrarAdded: PlainDescriptor<{ registrar_index: number }>

      /**
       *A sub-identity was added to an identity and the deposit paid.
       */
      SubIdentityAdded: PlainDescriptor<{
        sub: SS58String
        main: SS58String
        deposit: bigint
      }>

      /**
       *A sub-identity was removed from an identity and the deposit freed.
       */
      SubIdentityRemoved: PlainDescriptor<{
        sub: SS58String
        main: SS58String
        deposit: bigint
      }>

      /**
       *A sub-identity was cleared, and the given deposit repatriated from the
       *main identity account to the sub-identity account.
       */
      SubIdentityRevoked: PlainDescriptor<{
        sub: SS58String
        main: SS58String
        deposit: bigint
      }>
    },
    {
      /**
       *Too many subs-accounts.
       */
      TooManySubAccounts: PlainDescriptor<undefined>

      /**
       *Account isn't found.
       */
      NotFound: PlainDescriptor<undefined>

      /**
       *Account isn't named.
       */
      NotNamed: PlainDescriptor<undefined>

      /**
       *Empty index.
       */
      EmptyIndex: PlainDescriptor<undefined>

      /**
       *Fee is changed.
       */
      FeeChanged: PlainDescriptor<undefined>

      /**
       *No identity found.
       */
      NoIdentity: PlainDescriptor<undefined>

      /**
       *Sticky judgement.
       */
      StickyJudgement: PlainDescriptor<undefined>

      /**
       *Judgement given.
       */
      JudgementGiven: PlainDescriptor<undefined>

      /**
       *Invalid judgement.
       */
      InvalidJudgement: PlainDescriptor<undefined>

      /**
       *The index is invalid.
       */
      InvalidIndex: PlainDescriptor<undefined>

      /**
       *The target is invalid.
       */
      InvalidTarget: PlainDescriptor<undefined>

      /**
       *Too many additional fields.
       */
      TooManyFields: PlainDescriptor<undefined>

      /**
       *Maximum amount of registrars reached. Cannot add any more.
       */
      TooManyRegistrars: PlainDescriptor<undefined>

      /**
       *Account ID is already named.
       */
      AlreadyClaimed: PlainDescriptor<undefined>

      /**
       *Sender is not a sub-account.
       */
      NotSub: PlainDescriptor<undefined>

      /**
       *Sub-account isn't owned by sender.
       */
      NotOwned: PlainDescriptor<undefined>

      /**
       *The provided judgement was for a different identity.
       */
      JudgementForDifferentIdentity: PlainDescriptor<undefined>

      /**
       *Error that occurs when there is an issue paying for judgement.
       */
      JudgementPaymentFailed: PlainDescriptor<undefined>
    },
    {
      /**
       * The amount held on deposit for a registered identity
       */
      BasicDeposit: PlainDescriptor<bigint>

      /**
       * The amount held on deposit per additional field for a registered identity.
       */
      FieldDeposit: PlainDescriptor<bigint>

      /**
       * The amount held on deposit for a registered subaccount. This should account for the fact
       * that one storage item's value will increase by the size of an account ID, and there will
       * be another trie item whose value is the size of an account ID plus 32 bytes.
       */
      SubAccountDeposit: PlainDescriptor<bigint>

      /**
       * The maximum number of sub-accounts allowed per identified account.
       */
      MaxSubAccounts: PlainDescriptor<number>

      /**
       * Maximum number of additional fields that may be stored in an ID. Needed to bound the I/O
       * required to access an identity, but can be pretty high.
       */
      MaxAdditionalFields: PlainDescriptor<number>

      /**
       * Maxmimum number of registrars allowed in the system. Needed to bound the complexity
       * of, e.g., updating judgements.
       */
      MaxRegistrars: PlainDescriptor<number>
    },
  ]
  Proxy: [
    {
      /**
       * The set of account proxies. Maps the account which has delegated to the accounts
       * which are being delegated to, together with the amount held on deposit.
       */
      Proxies: StorageDescriptor<
        [Key: SS58String],
        [Anonymize<Id1245cgi7butj>, bigint],
        false
      >

      /**
       * The announcements made by the proxy (key).
       */
      Announcements: StorageDescriptor<
        [Key: SS58String],
        [Anonymize<I99svmvk5amkcq>, bigint],
        false
      >
    },
    {
      /**
       *See [`Pallet::proxy`].
       */
      proxy: TxDescriptor<{
        real: MultiAddress
        force_proxy_type: Anonymize<Idrnto663vhd97>
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::add_proxy`].
       */
      add_proxy: TxDescriptor<{
        delegate: MultiAddress
        proxy_type: ProxyType
        delay: number
      }>

      /**
       *See [`Pallet::remove_proxy`].
       */
      remove_proxy: TxDescriptor<{
        delegate: MultiAddress
        proxy_type: ProxyType
        delay: number
      }>

      /**
       *See [`Pallet::remove_proxies`].
       */
      remove_proxies: TxDescriptor<undefined>

      /**
       *See [`Pallet::create_pure`].
       */
      create_pure: TxDescriptor<{
        proxy_type: ProxyType
        delay: number
        index: number
      }>

      /**
       *See [`Pallet::kill_pure`].
       */
      kill_pure: TxDescriptor<{
        spawner: MultiAddress
        proxy_type: ProxyType
        index: number
        height: number
        ext_index: number
      }>

      /**
       *See [`Pallet::announce`].
       */
      announce: TxDescriptor<{ real: MultiAddress; call_hash: Binary }>

      /**
       *See [`Pallet::remove_announcement`].
       */
      remove_announcement: TxDescriptor<{
        real: MultiAddress
        call_hash: Binary
      }>

      /**
       *See [`Pallet::reject_announcement`].
       */
      reject_announcement: TxDescriptor<{
        delegate: MultiAddress
        call_hash: Binary
      }>

      /**
       *See [`Pallet::proxy_announced`].
       */
      proxy_announced: TxDescriptor<{
        delegate: MultiAddress
        real: MultiAddress
        force_proxy_type: Anonymize<Idrnto663vhd97>
        call: Anonymize<I8e6un4uk1q07c>
      }>
    },
    {
      /**
       *A proxy was executed correctly, with the given.
       */
      ProxyExecuted: PlainDescriptor<{ result: Anonymize<Idtdr91jmq5g4i> }>

      /**
       *A pure account has been created by new proxy with given
       *disambiguation index and proxy type.
       */
      PureCreated: PlainDescriptor<{
        pure: SS58String
        who: SS58String
        proxy_type: ProxyType
        disambiguation_index: number
      }>

      /**
       *An announcement was placed to make a call in the future.
       */
      Announced: PlainDescriptor<{
        real: SS58String
        proxy: SS58String
        call_hash: Binary
      }>

      /**
       *A proxy was added.
       */
      ProxyAdded: PlainDescriptor<{
        delegator: SS58String
        delegatee: SS58String
        proxy_type: ProxyType
        delay: number
      }>

      /**
       *A proxy was removed.
       */
      ProxyRemoved: PlainDescriptor<{
        delegator: SS58String
        delegatee: SS58String
        proxy_type: ProxyType
        delay: number
      }>
    },
    {
      /**
       *There are too many proxies registered or too many announcements pending.
       */
      TooMany: PlainDescriptor<undefined>

      /**
       *Proxy registration not found.
       */
      NotFound: PlainDescriptor<undefined>

      /**
       *Sender is not a proxy of the account to be proxied.
       */
      NotProxy: PlainDescriptor<undefined>

      /**
       *A call which is incompatible with the proxy type's filter was attempted.
       */
      Unproxyable: PlainDescriptor<undefined>

      /**
       *Account is already a proxy.
       */
      Duplicate: PlainDescriptor<undefined>

      /**
       *Call may not be made by proxy because it may escalate its privileges.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *Announcement, if made at all, was made too recently.
       */
      Unannounced: PlainDescriptor<undefined>

      /**
       *Cannot add self as proxy.
       */
      NoSelfProxy: PlainDescriptor<undefined>
    },
    {
      /**
       * The base amount of currency needed to reserve for creating a proxy.
       *
       * This is held for an additional storage item whose value size is
       * `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.
       */
      ProxyDepositBase: PlainDescriptor<bigint>

      /**
       * The amount of currency needed per proxy added.
       *
       * This is held for adding 32 bytes plus an instance of `ProxyType` more into a
       * pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take
       * into account `32 + proxy_type.encode().len()` bytes of data.
       */
      ProxyDepositFactor: PlainDescriptor<bigint>

      /**
       * The maximum amount of proxies allowed for a single account.
       */
      MaxProxies: PlainDescriptor<number>

      /**
       * The maximum amount of time-delayed announcements that are allowed to be pending.
       */
      MaxPending: PlainDescriptor<number>

      /**
       * The base amount of currency needed to reserve for creating an announcement.
       *
       * This is held when a new storage item holding a `Balance` is created (typically 16
       * bytes).
       */
      AnnouncementDepositBase: PlainDescriptor<bigint>

      /**
       * The amount of currency needed per announcement made.
       *
       * This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes)
       * into a pre-existing storage value.
       */
      AnnouncementDepositFactor: PlainDescriptor<bigint>
    },
  ]
  Multisig: [
    {
      /**
       * The set of open multisig operations.
       */
      Multisigs: StorageDescriptor<
        [SS58String, Binary],
        {
          when: Anonymize<Itvprrpb0nm3o>
          deposit: bigint
          depositor: SS58String
          approvals: Anonymize<Ia2lhg7l2hilo3>
        },
        true
      >
    },
    {
      /**
       *See [`Pallet::as_multi_threshold_1`].
       */
      as_multi_threshold_1: TxDescriptor<{
        other_signatories: Anonymize<Ia2lhg7l2hilo3>
        call: Anonymize<I8e6un4uk1q07c>
      }>

      /**
       *See [`Pallet::as_multi`].
       */
      as_multi: TxDescriptor<{
        threshold: number
        other_signatories: Anonymize<Ia2lhg7l2hilo3>
        maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
        call: Anonymize<I8e6un4uk1q07c>
        max_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::approve_as_multi`].
       */
      approve_as_multi: TxDescriptor<{
        threshold: number
        other_signatories: Anonymize<Ia2lhg7l2hilo3>
        maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
        call_hash: Binary
        max_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::cancel_as_multi`].
       */
      cancel_as_multi: TxDescriptor<{
        threshold: number
        other_signatories: Anonymize<Ia2lhg7l2hilo3>
        timepoint: Anonymize<Itvprrpb0nm3o>
        call_hash: Binary
      }>
    },
    {
      /**
       *A new multisig operation has begun.
       */
      NewMultisig: PlainDescriptor<{
        approving: SS58String
        multisig: SS58String
        call_hash: Binary
      }>

      /**
       *A multisig operation has been approved by someone.
       */
      MultisigApproval: PlainDescriptor<{
        approving: SS58String
        timepoint: Anonymize<Itvprrpb0nm3o>
        multisig: SS58String
        call_hash: Binary
      }>

      /**
       *A multisig operation has been executed.
       */
      MultisigExecuted: PlainDescriptor<{
        approving: SS58String
        timepoint: Anonymize<Itvprrpb0nm3o>
        multisig: SS58String
        call_hash: Binary
        result: Anonymize<Idtdr91jmq5g4i>
      }>

      /**
       *A multisig operation has been cancelled.
       */
      MultisigCancelled: PlainDescriptor<{
        cancelling: SS58String
        timepoint: Anonymize<Itvprrpb0nm3o>
        multisig: SS58String
        call_hash: Binary
      }>
    },
    {
      /**
       *Threshold must be 2 or greater.
       */
      MinimumThreshold: PlainDescriptor<undefined>

      /**
       *Call is already approved by this signatory.
       */
      AlreadyApproved: PlainDescriptor<undefined>

      /**
       *Call doesn't need any (more) approvals.
       */
      NoApprovalsNeeded: PlainDescriptor<undefined>

      /**
       *There are too few signatories in the list.
       */
      TooFewSignatories: PlainDescriptor<undefined>

      /**
       *There are too many signatories in the list.
       */
      TooManySignatories: PlainDescriptor<undefined>

      /**
       *The signatories were provided out of order; they should be ordered.
       */
      SignatoriesOutOfOrder: PlainDescriptor<undefined>

      /**
       *The sender was contained in the other signatories; it shouldn't be.
       */
      SenderInSignatories: PlainDescriptor<undefined>

      /**
       *Multisig operation not found when attempting to cancel.
       */
      NotFound: PlainDescriptor<undefined>

      /**
       *Only the account that originally created the multisig is able to cancel it.
       */
      NotOwner: PlainDescriptor<undefined>

      /**
       *No timepoint was given, yet the multisig operation is already underway.
       */
      NoTimepoint: PlainDescriptor<undefined>

      /**
       *A different timepoint was given to the multisig operation that is underway.
       */
      WrongTimepoint: PlainDescriptor<undefined>

      /**
       *A timepoint was given, yet no multisig operation is underway.
       */
      UnexpectedTimepoint: PlainDescriptor<undefined>

      /**
       *The maximum weight information provided was too low.
       */
      MaxWeightTooLow: PlainDescriptor<undefined>

      /**
       *The data to be stored is already stored.
       */
      AlreadyStored: PlainDescriptor<undefined>
    },
    {
      /**
       * The base amount of currency needed to reserve for creating a multisig execution or to
       * store a dispatch call for later.
       *
       * This is held for an additional storage item whose value size is
       * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
       * `32 + sizeof(AccountId)` bytes.
       */
      DepositBase: PlainDescriptor<bigint>

      /**
       * The amount of currency needed per unit threshold when creating a multisig execution.
       *
       * This is held for adding 32 bytes more into a pre-existing storage value.
       */
      DepositFactor: PlainDescriptor<bigint>

      /**
       * The maximum amount of signatories allowed in the multisig.
       */
      MaxSignatories: PlainDescriptor<number>
    },
  ]
  Bounties: [
    {
      /**
       * Number of bounty proposals that have been made.
       */
      BountyCount: StorageDescriptor<[], number, false>

      /**
       * Bounties that have been made.
       */
      Bounties: StorageDescriptor<
        [Key: number],
        {
          proposer: SS58String
          value: bigint
          fee: bigint
          curator_deposit: bigint
          bond: bigint
          status: BountiesBountyStatus
        },
        true
      >

      /**
       * The description of each bounty.
       */
      BountyDescriptions: StorageDescriptor<[Key: number], Binary, true>

      /**
       * Bounty indices that have been approved but not yet funded.
       */
      BountyApprovals: StorageDescriptor<[], Array<number>, false>
    },
    {
      /**
       *See [`Pallet::propose_bounty`].
       */
      propose_bounty: TxDescriptor<{ value: bigint; description: Binary }>

      /**
       *See [`Pallet::approve_bounty`].
       */
      approve_bounty: TxDescriptor<{ bounty_id: number }>

      /**
       *See [`Pallet::propose_curator`].
       */
      propose_curator: TxDescriptor<{
        bounty_id: number
        curator: MultiAddress
        fee: bigint
      }>

      /**
       *See [`Pallet::unassign_curator`].
       */
      unassign_curator: TxDescriptor<{ bounty_id: number }>

      /**
       *See [`Pallet::accept_curator`].
       */
      accept_curator: TxDescriptor<{ bounty_id: number }>

      /**
       *See [`Pallet::award_bounty`].
       */
      award_bounty: TxDescriptor<{
        bounty_id: number
        beneficiary: MultiAddress
      }>

      /**
       *See [`Pallet::claim_bounty`].
       */
      claim_bounty: TxDescriptor<{ bounty_id: number }>

      /**
       *See [`Pallet::close_bounty`].
       */
      close_bounty: TxDescriptor<{ bounty_id: number }>

      /**
       *See [`Pallet::extend_bounty_expiry`].
       */
      extend_bounty_expiry: TxDescriptor<{ bounty_id: number; remark: Binary }>
    },
    {
      /**
       *New bounty proposal.
       */
      BountyProposed: PlainDescriptor<{ index: number }>

      /**
       *A bounty proposal was rejected; funds were slashed.
       */
      BountyRejected: PlainDescriptor<{ index: number; bond: bigint }>

      /**
       *A bounty proposal is funded and became active.
       */
      BountyBecameActive: PlainDescriptor<{ index: number }>

      /**
       *A bounty is awarded to a beneficiary.
       */
      BountyAwarded: PlainDescriptor<{ index: number; beneficiary: SS58String }>

      /**
       *A bounty is claimed by beneficiary.
       */
      BountyClaimed: PlainDescriptor<{
        index: number
        payout: bigint
        beneficiary: SS58String
      }>

      /**
       *A bounty is cancelled.
       */
      BountyCanceled: PlainDescriptor<{ index: number }>

      /**
       *A bounty expiry is extended.
       */
      BountyExtended: PlainDescriptor<{ index: number }>

      /**
       *A bounty is approved.
       */
      BountyApproved: PlainDescriptor<{ index: number }>

      /**
       *A bounty curator is proposed.
       */
      CuratorProposed: PlainDescriptor<{
        bounty_id: number
        curator: SS58String
      }>

      /**
       *A bounty curator is unassigned.
       */
      CuratorUnassigned: PlainDescriptor<{ bounty_id: number }>

      /**
       *A bounty curator is accepted.
       */
      CuratorAccepted: PlainDescriptor<{
        bounty_id: number
        curator: SS58String
      }>
    },
    {
      /**
       *Proposer's balance is too low.
       */
      InsufficientProposersBalance: PlainDescriptor<undefined>

      /**
       *No proposal or bounty at that index.
       */
      InvalidIndex: PlainDescriptor<undefined>

      /**
       *The reason given is just too big.
       */
      ReasonTooBig: PlainDescriptor<undefined>

      /**
       *The bounty status is unexpected.
       */
      UnexpectedStatus: PlainDescriptor<undefined>

      /**
       *Require bounty curator.
       */
      RequireCurator: PlainDescriptor<undefined>

      /**
       *Invalid bounty value.
       */
      InvalidValue: PlainDescriptor<undefined>

      /**
       *Invalid bounty fee.
       */
      InvalidFee: PlainDescriptor<undefined>

      /**
       *A bounty payout is pending.
       *To cancel the bounty, you must unassign and slash the curator.
       */
      PendingPayout: PlainDescriptor<undefined>

      /**
       *The bounties cannot be claimed/closed because it's still in the countdown period.
       */
      Premature: PlainDescriptor<undefined>

      /**
       *The bounty cannot be closed because it has active child bounties.
       */
      HasActiveChildBounty: PlainDescriptor<undefined>

      /**
       *Too many approvals are already queued.
       */
      TooManyQueued: PlainDescriptor<undefined>
    },
    {
      /**
       * The amount held on deposit for placing a bounty proposal.
       */
      BountyDepositBase: PlainDescriptor<bigint>

      /**
       * The delay period for which a bounty beneficiary need to wait before claim the payout.
       */
      BountyDepositPayoutDelay: PlainDescriptor<number>

      /**
       * Bounty duration in blocks.
       */
      BountyUpdatePeriod: PlainDescriptor<number>

      /**
       * The curator deposit is calculated as a percentage of the curator fee.
       *
       * This deposit has optional upper and lower bounds with `CuratorDepositMax` and
       * `CuratorDepositMin`.
       */
      CuratorDepositMultiplier: PlainDescriptor<number>

      /**
       * Maximum amount of funds that should be placed in a deposit for making a proposal.
       */
      CuratorDepositMax: PlainDescriptor<bigint | undefined>

      /**
       * Minimum amount of funds that should be placed in a deposit for making a proposal.
       */
      CuratorDepositMin: PlainDescriptor<bigint | undefined>

      /**
       * Minimum value for a bounty.
       */
      BountyValueMinimum: PlainDescriptor<bigint>

      /**
       * The amount held on deposit per byte within the tip report reason or bounty description.
       */
      DataDepositPerByte: PlainDescriptor<bigint>

      /**
       * Maximum acceptable reason length.
       *
       * Benchmarks depend on this value, be sure to update weights file when changing this value
       */
      MaximumReasonLength: PlainDescriptor<number>
    },
  ]
  ChildBounties: [
    {
      /**
       * Number of total child bounties.
       */
      ChildBountyCount: StorageDescriptor<[], number, false>

      /**
       * Number of child bounties per parent bounty.
       * Map of parent bounty index to number of child bounties.
       */
      ParentChildBounties: StorageDescriptor<[Key: number], number, false>

      /**
       * Child bounties that have been added.
       */
      ChildBounties: StorageDescriptor<
        [number, number],
        {
          parent_bounty: number
          value: bigint
          fee: bigint
          curator_deposit: bigint
          status: ChildBountyStatus
        },
        true
      >

      /**
       * The description of each child-bounty.
       */
      ChildBountyDescriptions: StorageDescriptor<[Key: number], Binary, true>

      /**
       * The cumulative child-bounty curator fee for each parent bounty.
       */
      ChildrenCuratorFees: StorageDescriptor<[Key: number], bigint, false>
    },
    {
      /**
       *See [`Pallet::add_child_bounty`].
       */
      add_child_bounty: TxDescriptor<{
        parent_bounty_id: number
        value: bigint
        description: Binary
      }>

      /**
       *See [`Pallet::propose_curator`].
       */
      propose_curator: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
        curator: MultiAddress
        fee: bigint
      }>

      /**
       *See [`Pallet::accept_curator`].
       */
      accept_curator: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
      }>

      /**
       *See [`Pallet::unassign_curator`].
       */
      unassign_curator: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
      }>

      /**
       *See [`Pallet::award_child_bounty`].
       */
      award_child_bounty: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
        beneficiary: MultiAddress
      }>

      /**
       *See [`Pallet::claim_child_bounty`].
       */
      claim_child_bounty: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
      }>

      /**
       *See [`Pallet::close_child_bounty`].
       */
      close_child_bounty: TxDescriptor<{
        parent_bounty_id: number
        child_bounty_id: number
      }>
    },
    {
      /**
       *A child-bounty is added.
       */
      Added: PlainDescriptor<{ index: number; child_index: number }>

      /**
       *A child-bounty is awarded to a beneficiary.
       */
      Awarded: PlainDescriptor<{
        index: number
        child_index: number
        beneficiary: SS58String
      }>

      /**
       *A child-bounty is claimed by beneficiary.
       */
      Claimed: PlainDescriptor<{
        index: number
        child_index: number
        payout: bigint
        beneficiary: SS58String
      }>

      /**
       *A child-bounty is cancelled.
       */
      Canceled: PlainDescriptor<{ index: number; child_index: number }>
    },
    {
      /**
       *The parent bounty is not in active state.
       */
      ParentBountyNotActive: PlainDescriptor<undefined>

      /**
       *The bounty balance is not enough to add new child-bounty.
       */
      InsufficientBountyBalance: PlainDescriptor<undefined>

      /**
       *Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
       */
      TooManyChildBounties: PlainDescriptor<undefined>
    },
    {
      /**
       * Maximum number of child bounties that can be added to a parent bounty.
       */
      MaxActiveChildBountyCount: PlainDescriptor<number>

      /**
       * Minimum value for a child-bounty.
       */
      ChildBountyValueMinimum: PlainDescriptor<bigint>
    },
  ]
  ElectionProviderMultiPhase: [
    {
      /**
       * Internal counter for the number of rounds.
       *
       * This is useful for de-duplication of transactions submitted to the pool, and general
       * diagnostics of the pallet.
       *
       * This is merely incremented once per every time that an upstream `elect` is called.
       */
      Round: StorageDescriptor<[], number, false>

      /**
       * Current phase.
       */
      CurrentPhase: StorageDescriptor<
        [],
        ElectionProviderMultiPhasePhase,
        false
      >

      /**
       * Current best solution, signed or unsigned, queued to be returned upon `elect`.
       *
       * Always sorted by score.
       */
      QueuedSolution: StorageDescriptor<
        [],
        {
          supports: Anonymize<I4bboqsv44evel>
          score: Anonymize<I8s6n43okuj2b1>
          compute: ElectionProviderMultiPhaseElectionCompute
        },
        true
      >

      /**
       * Snapshot data of the round.
       *
       * This is created at the beginning of the signed phase and cleared upon calling `elect`.
       */
      Snapshot: StorageDescriptor<
        [],
        {
          voters: Anonymize<I9cpogojpnsq8h>
          targets: Anonymize<Ia2lhg7l2hilo3>
        },
        true
      >

      /**
       * Desired number of targets to elect for this round.
       *
       * Only exists when [`Snapshot`] is present.
       */
      DesiredTargets: StorageDescriptor<[], number, true>

      /**
       * The metadata of the [`RoundSnapshot`]
       *
       * Only exists when [`Snapshot`] is present.
       */
      SnapshotMetadata: StorageDescriptor<
        [],
        { voters: number; targets: number },
        true
      >

      /**
       * The next index to be assigned to an incoming signed submission.
       *
       * Every accepted submission is assigned a unique index; that index is bound to that particular
       * submission for the duration of the election. On election finalization, the next index is
       * reset to 0.
       *
       * We can't just use `SignedSubmissionIndices.len()`, because that's a bounded set; past its
       * capacity, it will simply saturate. We can't just iterate over `SignedSubmissionsMap`,
       * because iteration is slow. Instead, we store the value here.
       */
      SignedSubmissionNextIndex: StorageDescriptor<[], number, false>

      /**
       * A sorted, bounded vector of `(score, block_number, index)`, where each `index` points to a
       * value in `SignedSubmissions`.
       *
       * We never need to process more than a single signed submission at a time. Signed submissions
       * can be quite large, so we're willing to pay the cost of multiple database accesses to access
       * them one at a time instead of reading and decoding all of them at once.
       */
      SignedSubmissionIndices: StorageDescriptor<
        [],
        Array<Anonymize<Ie663uperueqm5>>,
        false
      >

      /**
       * Unchecked, signed solutions.
       *
       * Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
       * allowing us to keep only a single one in memory at a time.
       *
       * Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
       * affect; we shouldn't need a cryptographically secure hasher.
       */
      SignedSubmissionsMap: StorageDescriptor<
        [Key: number],
        {
          who: SS58String
          deposit: bigint
          raw_solution: Anonymize<I7je4n92ump862>
          call_fee: bigint
        },
        true
      >

      /**
       * The minimum score that each 'untrusted' solution must attain in order to be considered
       * feasible.
       *
       * Can be set via `set_minimum_untrusted_score`.
       */
      MinimumUntrustedScore: StorageDescriptor<
        [],
        { minimal_stake: bigint; sum_stake: bigint; sum_stake_squared: bigint },
        true
      >
    },
    {
      /**
       *See [`Pallet::submit_unsigned`].
       */
      submit_unsigned: TxDescriptor<{
        raw_solution: Anonymize<I7je4n92ump862>
        witness: Anonymize<Iasd2iat48n080>
      }>

      /**
       *See [`Pallet::set_minimum_untrusted_score`].
       */
      set_minimum_untrusted_score: TxDescriptor<{
        maybe_next_score: Anonymize<Iaebc5kcl654ln>
      }>

      /**
       *See [`Pallet::set_emergency_election_result`].
       */
      set_emergency_election_result: TxDescriptor<{
        supports: Anonymize<I4bboqsv44evel>
      }>

      /**
       *See [`Pallet::submit`].
       */
      submit: TxDescriptor<{ raw_solution: Anonymize<I7je4n92ump862> }>

      /**
       *See [`Pallet::governance_fallback`].
       */
      governance_fallback: TxDescriptor<{
        maybe_max_voters: Anonymize<I4arjljr6dpflb>
        maybe_max_targets: Anonymize<I4arjljr6dpflb>
      }>
    },
    {
      /**
       *A solution was stored with the given compute.
       *
       *The `origin` indicates the origin of the solution. If `origin` is `Some(AccountId)`,
       *the stored solution was submited in the signed phase by a miner with the `AccountId`.
       *Otherwise, the solution was stored either during the unsigned phase or by
       *`T::ForceOrigin`. The `bool` is `true` when a previous solution was ejected to make
       *room for this one.
       */
      SolutionStored: PlainDescriptor<{
        compute: ElectionProviderMultiPhaseElectionCompute
        origin: Anonymize<Ihfphjolmsqq1>
        prev_ejected: boolean
      }>

      /**
       *The election has been finalized, with the given computation and score.
       */
      ElectionFinalized: PlainDescriptor<{
        compute: ElectionProviderMultiPhaseElectionCompute
        score: Anonymize<I8s6n43okuj2b1>
      }>

      /**
       *An election failed.
       *
       *Not much can be said about which computes failed in the process.
       */
      ElectionFailed: PlainDescriptor<undefined>

      /**
       *An account has been rewarded for their signed submission being finalized.
       */
      Rewarded: PlainDescriptor<{ account: SS58String; value: bigint }>

      /**
       *An account has been slashed for submitting an invalid signed submission.
       */
      Slashed: PlainDescriptor<{ account: SS58String; value: bigint }>

      /**
       *There was a phase transition in a given round.
       */
      PhaseTransitioned: PlainDescriptor<{
        from: ElectionProviderMultiPhasePhase
        to: ElectionProviderMultiPhasePhase
        round: number
      }>
    },
    {
      /**
       *Submission was too early.
       */
      PreDispatchEarlySubmission: PlainDescriptor<undefined>

      /**
       *Wrong number of winners presented.
       */
      PreDispatchWrongWinnerCount: PlainDescriptor<undefined>

      /**
       *Submission was too weak, score-wise.
       */
      PreDispatchWeakSubmission: PlainDescriptor<undefined>

      /**
       *The queue was full, and the solution was not better than any of the existing ones.
       */
      SignedQueueFull: PlainDescriptor<undefined>

      /**
       *The origin failed to pay the deposit.
       */
      SignedCannotPayDeposit: PlainDescriptor<undefined>

      /**
       *Witness data to dispatchable is invalid.
       */
      SignedInvalidWitness: PlainDescriptor<undefined>

      /**
       *The signed submission consumes too much weight
       */
      SignedTooMuchWeight: PlainDescriptor<undefined>

      /**
       *OCW submitted solution for wrong round
       */
      OcwCallWrongEra: PlainDescriptor<undefined>

      /**
       *Snapshot metadata should exist but didn't.
       */
      MissingSnapshotMetadata: PlainDescriptor<undefined>

      /**
       *`Self::insert_submission` returned an invalid index.
       */
      InvalidSubmissionIndex: PlainDescriptor<undefined>

      /**
       *The call is not allowed at this point.
       */
      CallNotAllowed: PlainDescriptor<undefined>

      /**
       *The fallback failed
       */
      FallbackFailed: PlainDescriptor<undefined>

      /**
       *Some bound not met
       */
      BoundNotMet: PlainDescriptor<undefined>

      /**
       *Submitted solution has too many winners
       */
      TooManyWinners: PlainDescriptor<undefined>
    },
    {
      /**
       * Duration of the unsigned phase.
       */
      UnsignedPhase: PlainDescriptor<number>

      /**
       * Duration of the signed phase.
       */
      SignedPhase: PlainDescriptor<number>

      /**
       * The minimum amount of improvement to the solution score that defines a solution as
       * "better" in the Signed phase.
       */
      BetterSignedThreshold: PlainDescriptor<number>

      /**
       * The minimum amount of improvement to the solution score that defines a solution as
       * "better" in the Unsigned phase.
       */
      BetterUnsignedThreshold: PlainDescriptor<number>

      /**
       * The repeat threshold of the offchain worker.
       *
       * For example, if it is 5, that means that at least 5 blocks will elapse between attempts
       * to submit the worker's solution.
       */
      OffchainRepeat: PlainDescriptor<number>

      /**
       * The priority of the unsigned transaction submitted in the unsigned-phase
       */
      MinerTxPriority: PlainDescriptor<bigint>

      /**
       * Maximum number of signed submissions that can be queued.
       *
       * It is best to avoid adjusting this during an election, as it impacts downstream data
       * structures. In particular, `SignedSubmissionIndices<T>` is bounded on this value. If you
       * update this value during an election, you _must_ ensure that
       * `SignedSubmissionIndices.len()` is less than or equal to the new value. Otherwise,
       * attempts to submit new solutions may cause a runtime panic.
       */
      SignedMaxSubmissions: PlainDescriptor<number>

      /**
       * Maximum weight of a signed solution.
       *
       * If [`Config::MinerConfig`] is being implemented to submit signed solutions (outside of
       * this pallet), then [`MinerConfig::solution_weight`] is used to compare against
       * this value.
       */
      SignedMaxWeight: PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>

      /**
       * The maximum amount of unchecked solutions to refund the call fee for.
       */
      SignedMaxRefunds: PlainDescriptor<number>

      /**
       * Base reward for a signed solution
       */
      SignedRewardBase: PlainDescriptor<bigint>

      /**
       * Per-byte deposit for a signed solution.
       */
      SignedDepositByte: PlainDescriptor<bigint>

      /**
       * Per-weight deposit for a signed solution.
       */
      SignedDepositWeight: PlainDescriptor<bigint>

      /**
       * The maximum number of winners that can be elected by this `ElectionProvider`
       * implementation.
       *
       * Note: This must always be greater or equal to `T::DataProvider::desired_targets()`.
       */
      MaxWinners: PlainDescriptor<number>

      /**

 */
      MinerMaxLength: PlainDescriptor<number>

      /**

 */
      MinerMaxWeight: PlainDescriptor<{ ref_time: bigint; proof_size: bigint }>

      /**

 */
      MinerMaxVotesPerVoter: PlainDescriptor<number>

      /**

 */
      MinerMaxWinners: PlainDescriptor<number>
    },
  ]
  VoterList: [
    {
      /**
       * A single node, within some bag.
       *
       * Nodes store links forward and back within their respective bags.
       */
      ListNodes: StorageDescriptor<
        [Key: SS58String],
        {
          id: SS58String
          prev: Anonymize<Ihfphjolmsqq1>
          next: Anonymize<Ihfphjolmsqq1>
          bag_upper: bigint
          score: bigint
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForListNodes: StorageDescriptor<[], number, false>

      /**
       * A bag stored in storage.
       *
       * Stores a `Bag` struct, which stores head and tail pointers to itself.
       */
      ListBags: StorageDescriptor<
        [Key: bigint],
        { head: Anonymize<Ihfphjolmsqq1>; tail: Anonymize<Ihfphjolmsqq1> },
        true
      >
    },
    {
      /**
       *See [`Pallet::rebag`].
       */
      rebag: TxDescriptor<{ dislocated: MultiAddress }>

      /**
       *See [`Pallet::put_in_front_of`].
       */
      put_in_front_of: TxDescriptor<{ lighter: MultiAddress }>

      /**
       *See [`Pallet::put_in_front_of_other`].
       */
      put_in_front_of_other: TxDescriptor<{
        heavier: MultiAddress
        lighter: MultiAddress
      }>
    },
    {
      /**
       *Moved an account from one bag to another.
       */
      Rebagged: PlainDescriptor<{ who: SS58String; from: bigint; to: bigint }>

      /**
       *Updated the score of some account to the given amount.
       */
      ScoreUpdated: PlainDescriptor<{ who: SS58String; new_score: bigint }>
    },
    {
      /**
       *A error in the list interface implementation.
       */
      List: PlainDescriptor<BagsListListListError>
    },
    {
      /**
       * The list of thresholds separating the various bags.
       *
       * Ids are separated into unsorted bags according to their score. This specifies the
       * thresholds separating the bags. An id's bag is the largest bag for which the id's score
       * is less than or equal to its upper threshold.
       *
       * When ids are iterated, higher bags are iterated completely before lower bags. This means
       * that iteration is _semi-sorted_: ids of higher score tend to come before ids of lower
       * score, but peer ids within a particular bag are sorted in insertion order.
       *
       * # Expressing the constant
       *
       * This constant must be sorted in strictly increasing order. Duplicate items are not
       * permitted.
       *
       * There is an implied upper limit of `Score::MAX`; that value does not need to be
       * specified within the bag. For any two threshold lists, if one ends with
       * `Score::MAX`, the other one does not, and they are otherwise equal, the two
       * lists will behave identically.
       *
       * # Calculation
       *
       * It is recommended to generate the set of thresholds in a geometric series, such that
       * there exists some constant ratio such that `threshold[k + 1] == (threshold[k] *
       * constant_ratio).max(threshold[k] + 1)` for all `k`.
       *
       * The helpers in the `/utils/frame/generate-bags` module can simplify this calculation.
       *
       * # Examples
       *
       * - If `BagThresholds::get().is_empty()`, then all ids are put into the same bag, and
       *   iteration is strictly in insertion order.
       * - If `BagThresholds::get().len() == 64`, and the thresholds are determined according to
       *   the procedure given above, then the constant ratio is equal to 2.
       * - If `BagThresholds::get().len() == 200`, and the thresholds are determined according to
       *   the procedure given above, then the constant ratio is approximately equal to 1.248.
       * - If the threshold list begins `[1, 2, 3, ...]`, then an id with score 0 or 1 will fall
       *   into bag 0, an id with score 2 will fall into bag 1, etc.
       *
       * # Migration
       *
       * In the event that this list ever changes, a copy of the old bags list must be retained.
       * With that `List::migrate` can be called, which will perform the appropriate migration.
       */
      BagThresholds: PlainDescriptor<Array<bigint>>
    },
  ]
  NominationPools: [
    {
      /**
       * The sum of funds across all pools.
       *
       * This might be lower but never higher than the sum of `total_balance` of all [`PoolMembers`]
       * because calling `pool_withdraw_unbonded` might decrease the total stake of the pool's
       * `bonded_account` without adjusting the pallet-internal `UnbondingPool`'s.
       */
      TotalValueLocked: StorageDescriptor<[], bigint, false>

      /**
       * Minimum amount to bond to join a pool.
       */
      MinJoinBond: StorageDescriptor<[], bigint, false>

      /**
       * Minimum bond required to create a pool.
       *
       * This is the amount that the depositor must put as their initial stake in the pool, as an
       * indication of "skin in the game".
       *
       * This is the value that will always exist in the staking ledger of the pool bonded account
       * while all other accounts leave.
       */
      MinCreateBond: StorageDescriptor<[], bigint, false>

      /**
       * Maximum number of nomination pools that can exist. If `None`, then an unbounded number of
       * pools can exist.
       */
      MaxPools: StorageDescriptor<[], number, true>

      /**
       * Maximum number of members that can exist in the system. If `None`, then the count
       * members are not bound on a system wide basis.
       */
      MaxPoolMembers: StorageDescriptor<[], number, true>

      /**
       * Maximum number of members that may belong to pool. If `None`, then the count of
       * members is not bound on a per pool basis.
       */
      MaxPoolMembersPerPool: StorageDescriptor<[], number, true>

      /**
       * The maximum commission that can be charged by a pool. Used on commission payouts to bound
       * pool commissions that are > `GlobalMaxCommission`, necessary if a future
       * `GlobalMaxCommission` is lower than some current pool commissions.
       */
      GlobalMaxCommission: StorageDescriptor<[], number, true>

      /**
       * Active members.
       *
       * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
       */
      PoolMembers: StorageDescriptor<
        [Key: SS58String],
        {
          pool_id: number
          points: bigint
          last_recorded_reward_counter: bigint
          unbonding_eras: Anonymize<If9jidduiuq7vv>
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForPoolMembers: StorageDescriptor<[], number, false>

      /**
       * Storage for bonded pools.
       */
      BondedPools: StorageDescriptor<
        [Key: number],
        {
          commission: Anonymize<I30ffej1k6vjpu>
          member_counter: number
          points: bigint
          roles: Anonymize<Ia8iksu9hedf5n>
          state: NominationPoolsPoolState
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForBondedPools: StorageDescriptor<[], number, false>

      /**
       * Reward pools. This is where there rewards for each pool accumulate. When a members payout is
       * claimed, the balance comes out fo the reward pool. Keyed by the bonded pools account.
       */
      RewardPools: StorageDescriptor<
        [Key: number],
        {
          last_recorded_reward_counter: bigint
          last_recorded_total_payouts: bigint
          total_rewards_claimed: bigint
          total_commission_pending: bigint
          total_commission_claimed: bigint
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForRewardPools: StorageDescriptor<[], number, false>

      /**
       * Groups of unbonding pools. Each group of unbonding pools belongs to a
       * bonded pool, hence the name sub-pools. Keyed by the bonded pools account.
       */
      SubPoolsStorage: StorageDescriptor<
        [Key: number],
        {
          no_era: Anonymize<I4h0cfnkiqrna6>
          with_era: Anonymize<I48jqs22bfh5as>
        },
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForSubPoolsStorage: StorageDescriptor<[], number, false>

      /**
       * Metadata for the pool.
       */
      Metadata: StorageDescriptor<[Key: number], Binary, false>

      /**
       *Counter for the related counted storage map
       */
      CounterForMetadata: StorageDescriptor<[], number, false>

      /**
       * Ever increasing number of all pools created so far.
       */
      LastPoolId: StorageDescriptor<[], number, false>

      /**
       * A reverse lookup from the pool's account id to its id.
       *
       * This is only used for slashing. In all other instances, the pool id is used, and the
       * accounts are deterministically derived from it.
       */
      ReversePoolIdLookup: StorageDescriptor<[Key: SS58String], number, true>

      /**
       *Counter for the related counted storage map
       */
      CounterForReversePoolIdLookup: StorageDescriptor<[], number, false>

      /**
       * Map from a pool member account to their opted claim permission.
       */
      ClaimPermissions: StorageDescriptor<
        [Key: SS58String],
        NominationPoolsClaimPermission,
        false
      >
    },
    {
      /**
       *See [`Pallet::join`].
       */
      join: TxDescriptor<{ amount: bigint; pool_id: number }>

      /**
       *See [`Pallet::bond_extra`].
       */
      bond_extra: TxDescriptor<{ extra: NominationPoolsBondExtra }>

      /**
       *See [`Pallet::claim_payout`].
       */
      claim_payout: TxDescriptor<undefined>

      /**
       *See [`Pallet::unbond`].
       */
      unbond: TxDescriptor<{
        member_account: MultiAddress
        unbonding_points: bigint
      }>

      /**
       *See [`Pallet::pool_withdraw_unbonded`].
       */
      pool_withdraw_unbonded: TxDescriptor<{
        pool_id: number
        num_slashing_spans: number
      }>

      /**
       *See [`Pallet::withdraw_unbonded`].
       */
      withdraw_unbonded: TxDescriptor<{
        member_account: MultiAddress
        num_slashing_spans: number
      }>

      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        amount: bigint
        root: MultiAddress
        nominator: MultiAddress
        bouncer: MultiAddress
      }>

      /**
       *See [`Pallet::create_with_pool_id`].
       */
      create_with_pool_id: TxDescriptor<{
        amount: bigint
        root: MultiAddress
        nominator: MultiAddress
        bouncer: MultiAddress
        pool_id: number
      }>

      /**
       *See [`Pallet::nominate`].
       */
      nominate: TxDescriptor<{
        pool_id: number
        validators: Anonymize<Ia2lhg7l2hilo3>
      }>

      /**
       *See [`Pallet::set_state`].
       */
      set_state: TxDescriptor<{
        pool_id: number
        state: NominationPoolsPoolState
      }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{ pool_id: number; metadata: Binary }>

      /**
       *See [`Pallet::set_configs`].
       */
      set_configs: TxDescriptor<{
        min_join_bond: StakingPalletConfigOp
        min_create_bond: StakingPalletConfigOp
        max_pools: StakingPalletConfigOp1
        max_members: StakingPalletConfigOp1
        max_members_per_pool: StakingPalletConfigOp1
        global_max_commission: StakingPalletConfigOp1
      }>

      /**
       *See [`Pallet::update_roles`].
       */
      update_roles: TxDescriptor<{
        pool_id: number
        new_root: NominationPoolsConfigOp
        new_nominator: NominationPoolsConfigOp
        new_bouncer: NominationPoolsConfigOp
      }>

      /**
       *See [`Pallet::chill`].
       */
      chill: TxDescriptor<{ pool_id: number }>

      /**
       *See [`Pallet::bond_extra_other`].
       */
      bond_extra_other: TxDescriptor<{
        member: MultiAddress
        extra: NominationPoolsBondExtra
      }>

      /**
       *See [`Pallet::set_claim_permission`].
       */
      set_claim_permission: TxDescriptor<{
        permission: NominationPoolsClaimPermission
      }>

      /**
       *See [`Pallet::claim_payout_other`].
       */
      claim_payout_other: TxDescriptor<{ other: SS58String }>

      /**
       *See [`Pallet::set_commission`].
       */
      set_commission: TxDescriptor<{
        pool_id: number
        new_commission: Anonymize<Ie8iutm7u02lmj>
      }>

      /**
       *See [`Pallet::set_commission_max`].
       */
      set_commission_max: TxDescriptor<{
        pool_id: number
        max_commission: number
      }>

      /**
       *See [`Pallet::set_commission_change_rate`].
       */
      set_commission_change_rate: TxDescriptor<{
        pool_id: number
        change_rate: Anonymize<Ibqul338t9c1ll>
      }>

      /**
       *See [`Pallet::claim_commission`].
       */
      claim_commission: TxDescriptor<{ pool_id: number }>

      /**
       *See [`Pallet::adjust_pool_deposit`].
       */
      adjust_pool_deposit: TxDescriptor<{ pool_id: number }>
    },
    {
      /**
       *A pool has been created.
       */
      Created: PlainDescriptor<{ depositor: SS58String; pool_id: number }>

      /**
       *A member has became bonded in a pool.
       */
      Bonded: PlainDescriptor<{
        member: SS58String
        pool_id: number
        bonded: bigint
        joined: boolean
      }>

      /**
       *A payout has been made to a member.
       */
      PaidOut: PlainDescriptor<{
        member: SS58String
        pool_id: number
        payout: bigint
      }>

      /**
       *A member has unbonded from their pool.
       *
       *- `balance` is the corresponding balance of the number of points that has been
       *  requested to be unbonded (the argument of the `unbond` transaction) from the bonded
       *  pool.
       *- `points` is the number of points that are issued as a result of `balance` being
       *dissolved into the corresponding unbonding pool.
       *- `era` is the era in which the balance will be unbonded.
       *In the absence of slashing, these values will match. In the presence of slashing, the
       *number of points that are issued in the unbonding pool will be less than the amount
       *requested to be unbonded.
       */
      Unbonded: PlainDescriptor<{
        member: SS58String
        pool_id: number
        balance: bigint
        points: bigint
        era: number
      }>

      /**
       *A member has withdrawn from their pool.
       *
       *The given number of `points` have been dissolved in return of `balance`.
       *
       *Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
       *will be 1.
       */
      Withdrawn: PlainDescriptor<{
        member: SS58String
        pool_id: number
        balance: bigint
        points: bigint
      }>

      /**
       *A pool has been destroyed.
       */
      Destroyed: PlainDescriptor<{ pool_id: number }>

      /**
       *The state of a pool has changed
       */
      StateChanged: PlainDescriptor<{
        pool_id: number
        new_state: NominationPoolsPoolState
      }>

      /**
       *A member has been removed from a pool.
       *
       *The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
       */
      MemberRemoved: PlainDescriptor<{ pool_id: number; member: SS58String }>

      /**
       *The roles of a pool have been updated to the given new roles. Note that the depositor
       *can never change.
       */
      RolesUpdated: PlainDescriptor<{
        root: Anonymize<Ihfphjolmsqq1>
        bouncer: Anonymize<Ihfphjolmsqq1>
        nominator: Anonymize<Ihfphjolmsqq1>
      }>

      /**
       *The active balance of pool `pool_id` has been slashed to `balance`.
       */
      PoolSlashed: PlainDescriptor<{ pool_id: number; balance: bigint }>

      /**
       *The unbond pool at `era` of pool `pool_id` has been slashed to `balance`.
       */
      UnbondingPoolSlashed: PlainDescriptor<{
        pool_id: number
        era: number
        balance: bigint
      }>

      /**
       *A pool's commission setting has been changed.
       */
      PoolCommissionUpdated: PlainDescriptor<{
        pool_id: number
        current: Anonymize<Ie8iutm7u02lmj>
      }>

      /**
       *A pool's maximum commission setting has been changed.
       */
      PoolMaxCommissionUpdated: PlainDescriptor<{
        pool_id: number
        max_commission: number
      }>

      /**
       *A pool's commission `change_rate` has been changed.
       */
      PoolCommissionChangeRateUpdated: PlainDescriptor<{
        pool_id: number
        change_rate: Anonymize<Ibqul338t9c1ll>
      }>

      /**
       *Pool commission has been claimed.
       */
      PoolCommissionClaimed: PlainDescriptor<{
        pool_id: number
        commission: bigint
      }>

      /**
       *Topped up deficit in frozen ED of the reward pool.
       */
      MinBalanceDeficitAdjusted: PlainDescriptor<{
        amount: bigint
        pool_id: number
      }>

      /**
       *Claimed excess frozen ED of af the reward pool.
       */
      MinBalanceExcessAdjusted: PlainDescriptor<{
        amount: bigint
        pool_id: number
      }>
    },
    {
      /**
       *A (bonded) pool id does not exist.
       */
      PoolNotFound: PlainDescriptor<undefined>

      /**
       *An account is not a member.
       */
      PoolMemberNotFound: PlainDescriptor<undefined>

      /**
       *A reward pool does not exist. In all cases this is a system logic error.
       */
      RewardPoolNotFound: PlainDescriptor<undefined>

      /**
       *A sub pool does not exist.
       */
      SubPoolsNotFound: PlainDescriptor<undefined>

      /**
       *An account is already delegating in another pool. An account may only belong to one
       *pool at a time.
       */
      AccountBelongsToOtherPool: PlainDescriptor<undefined>

      /**
       *The member is fully unbonded (and thus cannot access the bonded and reward pool
       *anymore to, for example, collect rewards).
       */
      FullyUnbonding: PlainDescriptor<undefined>

      /**
       *The member cannot unbond further chunks due to reaching the limit.
       */
      MaxUnbondingLimit: PlainDescriptor<undefined>

      /**
       *None of the funds can be withdrawn yet because the bonding duration has not passed.
       */
      CannotWithdrawAny: PlainDescriptor<undefined>

      /**
       *The amount does not meet the minimum bond to either join or create a pool.
       *
       *The depositor can never unbond to a value less than `Pallet::depositor_min_bond`. The
       *caller does not have nominating permissions for the pool. Members can never unbond to a
       *value below `MinJoinBond`.
       */
      MinimumBondNotMet: PlainDescriptor<undefined>

      /**
       *The transaction could not be executed due to overflow risk for the pool.
       */
      OverflowRisk: PlainDescriptor<undefined>

      /**
       *A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
       *other members to be permissionlessly unbonded.
       */
      NotDestroying: PlainDescriptor<undefined>

      /**
       *The caller does not have nominating permissions for the pool.
       */
      NotNominator: PlainDescriptor<undefined>

      /**
       *Either a) the caller cannot make a valid kick or b) the pool is not destroying.
       */
      NotKickerOrDestroying: PlainDescriptor<undefined>

      /**
       *The pool is not open to join
       */
      NotOpen: PlainDescriptor<undefined>

      /**
       *The system is maxed out on pools.
       */
      MaxPools: PlainDescriptor<undefined>

      /**
       *Too many members in the pool or system.
       */
      MaxPoolMembers: PlainDescriptor<undefined>

      /**
       *The pools state cannot be changed.
       */
      CanNotChangeState: PlainDescriptor<undefined>

      /**
       *The caller does not have adequate permissions.
       */
      DoesNotHavePermission: PlainDescriptor<undefined>

      /**
       *Metadata exceeds [`Config::MaxMetadataLen`]
       */
      MetadataExceedsMaxLen: PlainDescriptor<undefined>

      /**
       *Some error occurred that should never happen. This should be reported to the
       *maintainers.
       */
      Defensive: PlainDescriptor<NominationPoolsPalletDefensiveError>

      /**
       *Partial unbonding now allowed permissionlessly.
       */
      PartialUnbondNotAllowedPermissionlessly: PlainDescriptor<undefined>

      /**
       *The pool's max commission cannot be set higher than the existing value.
       */
      MaxCommissionRestricted: PlainDescriptor<undefined>

      /**
       *The supplied commission exceeds the max allowed commission.
       */
      CommissionExceedsMaximum: PlainDescriptor<undefined>

      /**
       *The supplied commission exceeds global maximum commission.
       */
      CommissionExceedsGlobalMaximum: PlainDescriptor<undefined>

      /**
       *Not enough blocks have surpassed since the last commission update.
       */
      CommissionChangeThrottled: PlainDescriptor<undefined>

      /**
       *The submitted changes to commission change rate are not allowed.
       */
      CommissionChangeRateNotAllowed: PlainDescriptor<undefined>

      /**
       *There is no pending commission to claim.
       */
      NoPendingCommission: PlainDescriptor<undefined>

      /**
       *No commission current has been set.
       */
      NoCommissionCurrentSet: PlainDescriptor<undefined>

      /**
       *Pool id currently in use.
       */
      PoolIdInUse: PlainDescriptor<undefined>

      /**
       *Pool id provided is not correct/usable.
       */
      InvalidPoolId: PlainDescriptor<undefined>

      /**
       *Bonding extra is restricted to the exact pending reward amount.
       */
      BondExtraRestricted: PlainDescriptor<undefined>

      /**
       *No imbalance in the ED deposit for the pool.
       */
      NothingToAdjust: PlainDescriptor<undefined>
    },
    {
      /**
       * The nomination pool's pallet id.
       */
      PalletId: PlainDescriptor<Binary>

      /**
       * The maximum pool points-to-balance ratio that an `open` pool can have.
       *
       * This is important in the event slashing takes place and the pool's points-to-balance
       * ratio becomes disproportional.
       *
       * Moreover, this relates to the `RewardCounter` type as well, as the arithmetic operations
       * are a function of number of points, and by setting this value to e.g. 10, you ensure
       * that the total number of points in the system are at most 10 times the total_issuance of
       * the chain, in the absolute worse case.
       *
       * For a value of 10, the threshold would be a pool points-to-balance ratio of 10:1.
       * Such a scenario would also be the equivalent of the pool being 90% slashed.
       */
      MaxPointsToBalance: PlainDescriptor<number>
    },
  ]
  FastUnstake: [
    {
      /**
       * The current "head of the queue" being unstaked.
       *
       * The head in itself can be a batch of up to [`Config::BatchSize`] stakers.
       */
      Head: StorageDescriptor<
        [],
        {
          stashes: Anonymize<Iba9inugg1atvo>
          checked: Anonymize<Icgljjb6j82uhn>
        },
        true
      >

      /**
       * The map of all accounts wishing to be unstaked.
       *
       * Keeps track of `AccountId` wishing to unstake and it's corresponding deposit.
       */
      Queue: StorageDescriptor<[Key: SS58String], bigint, true>

      /**
       *Counter for the related counted storage map
       */
      CounterForQueue: StorageDescriptor<[], number, false>

      /**
       * Number of eras to check per block.
       *
       * If set to 0, this pallet does absolutely nothing. Cannot be set to more than
       * [`Config::MaxErasToCheckPerBlock`].
       *
       * Based on the amount of weight available at [`Pallet::on_idle`], up to this many eras are
       * checked. The checking is represented by updating [`UnstakeRequest::checked`], which is
       * stored in [`Head`].
       */
      ErasToCheckPerBlock: StorageDescriptor<[], number, false>
    },
    {
      /**
       *See [`Pallet::register_fast_unstake`].
       */
      register_fast_unstake: TxDescriptor<undefined>

      /**
       *See [`Pallet::deregister`].
       */
      deregister: TxDescriptor<undefined>

      /**
       *See [`Pallet::control`].
       */
      control: TxDescriptor<{ eras_to_check: number }>
    },
    {
      /**
       *A staker was unstaked.
       */
      Unstaked: PlainDescriptor<{
        stash: SS58String
        result: Anonymize<Idtdr91jmq5g4i>
      }>

      /**
       *A staker was slashed for requesting fast-unstake whilst being exposed.
       */
      Slashed: PlainDescriptor<{ stash: SS58String; amount: bigint }>

      /**
       *A batch was partially checked for the given eras, but the process did not finish.
       */
      BatchChecked: PlainDescriptor<{ eras: Anonymize<Icgljjb6j82uhn> }>

      /**
       *A batch of a given size was terminated.
       *
       *This is always follows by a number of `Unstaked` or `Slashed` events, marking the end
       *of the batch. A new batch will be created upon next block.
       */
      BatchFinished: PlainDescriptor<{ size: number }>

      /**
       *An internal error happened. Operations will be paused now.
       */
      InternalError: PlainDescriptor<undefined>
    },
    {
      /**
       *The provided Controller account was not found.
       *
       *This means that the given account is not bonded.
       */
      NotController: PlainDescriptor<undefined>

      /**
       *The bonded account has already been queued.
       */
      AlreadyQueued: PlainDescriptor<undefined>

      /**
       *The bonded account has active unlocking chunks.
       */
      NotFullyBonded: PlainDescriptor<undefined>

      /**
       *The provided un-staker is not in the `Queue`.
       */
      NotQueued: PlainDescriptor<undefined>

      /**
       *The provided un-staker is already in Head, and cannot deregister.
       */
      AlreadyHead: PlainDescriptor<undefined>

      /**
       *The call is not allowed at this point because the pallet is not active.
       */
      CallNotAllowed: PlainDescriptor<undefined>
    },
    {
      /**
       * Deposit to take for unstaking, to make sure we're able to slash the it in order to cover
       * the costs of resources on unsuccessful unstake.
       */
      Deposit: PlainDescriptor<bigint>
    },
  ]
  ParachainsOrigin: [{}, {}, {}, {}, {}]
  Configuration: [
    {
      /**
       * The active configuration for the current session.
       */
      ActiveConfig: StorageDescriptor<
        [],
        {
          max_code_size: number
          max_head_data_size: number
          max_upward_queue_count: number
          max_upward_queue_size: number
          max_upward_message_size: number
          max_upward_message_num_per_candidate: number
          hrmp_max_message_num_per_candidate: number
          validation_upgrade_cooldown: number
          validation_upgrade_delay: number
          async_backing_params: Anonymize<Iavuvfkop6318c>
          max_pov_size: number
          max_downward_message_size: number
          hrmp_max_parachain_outbound_channels: number
          hrmp_sender_deposit: bigint
          hrmp_recipient_deposit: bigint
          hrmp_channel_max_capacity: number
          hrmp_channel_max_total_size: number
          hrmp_max_parachain_inbound_channels: number
          hrmp_channel_max_message_size: number
          executor_params: Anonymize<I6sbufrhmgqdb6>
          code_retention_period: number
          on_demand_cores: number
          on_demand_retries: number
          on_demand_queue_max_size: number
          on_demand_target_queue_utilization: number
          on_demand_fee_variability: number
          on_demand_base_fee: bigint
          on_demand_ttl: number
          group_rotation_frequency: number
          paras_availability_period: number
          scheduling_lookahead: number
          max_validators_per_core: Anonymize<I4arjljr6dpflb>
          max_validators: Anonymize<I4arjljr6dpflb>
          dispute_period: number
          dispute_post_conclusion_acceptance_period: number
          no_show_slots: number
          n_delay_tranches: number
          zeroth_delay_tranche_width: number
          needed_approvals: number
          relay_vrf_modulo_samples: number
          pvf_voting_ttl: number
          minimum_validation_upgrade_delay: number
          minimum_backing_votes: number
        },
        false
      >

      /**
       * Pending configuration changes.
       *
       * This is a list of configuration changes, each with a session index at which it should
       * be applied.
       *
       * The list is sorted ascending by session index. Also, this list can only contain at most
       * 2 items: for the next session and for the `scheduled_session`.
       */
      PendingConfigs: StorageDescriptor<
        [],
        Array<Anonymize<If7itfec5udsb7>>,
        false
      >

      /**
       * If this is set, then the configuration setters will bypass the consistency checks. This
       * is meant to be used only as the last resort.
       */
      BypassConsistencyCheck: StorageDescriptor<[], boolean, false>
    },
    {
      /**
       *See [`Pallet::set_validation_upgrade_cooldown`].
       */
      set_validation_upgrade_cooldown: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_validation_upgrade_delay`].
       */
      set_validation_upgrade_delay: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_code_retention_period`].
       */
      set_code_retention_period: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_code_size`].
       */
      set_max_code_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_pov_size`].
       */
      set_max_pov_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_head_data_size`].
       */
      set_max_head_data_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_on_demand_cores`].
       */
      set_on_demand_cores: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_on_demand_retries`].
       */
      set_on_demand_retries: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_group_rotation_frequency`].
       */
      set_group_rotation_frequency: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_paras_availability_period`].
       */
      set_paras_availability_period: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_scheduling_lookahead`].
       */
      set_scheduling_lookahead: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_validators_per_core`].
       */
      set_max_validators_per_core: TxDescriptor<{
        new: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::set_max_validators`].
       */
      set_max_validators: TxDescriptor<{ new: Anonymize<I4arjljr6dpflb> }>

      /**
       *See [`Pallet::set_dispute_period`].
       */
      set_dispute_period: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_dispute_post_conclusion_acceptance_period`].
       */
      set_dispute_post_conclusion_acceptance_period: TxDescriptor<{
        new: number
      }>

      /**
       *See [`Pallet::set_no_show_slots`].
       */
      set_no_show_slots: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_n_delay_tranches`].
       */
      set_n_delay_tranches: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_zeroth_delay_tranche_width`].
       */
      set_zeroth_delay_tranche_width: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_needed_approvals`].
       */
      set_needed_approvals: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_relay_vrf_modulo_samples`].
       */
      set_relay_vrf_modulo_samples: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_upward_queue_count`].
       */
      set_max_upward_queue_count: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_upward_queue_size`].
       */
      set_max_upward_queue_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_downward_message_size`].
       */
      set_max_downward_message_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_upward_message_size`].
       */
      set_max_upward_message_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_max_upward_message_num_per_candidate`].
       */
      set_max_upward_message_num_per_candidate: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_open_request_ttl`].
       */
      set_hrmp_open_request_ttl: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_sender_deposit`].
       */
      set_hrmp_sender_deposit: TxDescriptor<{ new: bigint }>

      /**
       *See [`Pallet::set_hrmp_recipient_deposit`].
       */
      set_hrmp_recipient_deposit: TxDescriptor<{ new: bigint }>

      /**
       *See [`Pallet::set_hrmp_channel_max_capacity`].
       */
      set_hrmp_channel_max_capacity: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_channel_max_total_size`].
       */
      set_hrmp_channel_max_total_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_max_parachain_inbound_channels`].
       */
      set_hrmp_max_parachain_inbound_channels: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_channel_max_message_size`].
       */
      set_hrmp_channel_max_message_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_max_parachain_outbound_channels`].
       */
      set_hrmp_max_parachain_outbound_channels: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_hrmp_max_message_num_per_candidate`].
       */
      set_hrmp_max_message_num_per_candidate: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_pvf_voting_ttl`].
       */
      set_pvf_voting_ttl: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_minimum_validation_upgrade_delay`].
       */
      set_minimum_validation_upgrade_delay: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_bypass_consistency_check`].
       */
      set_bypass_consistency_check: TxDescriptor<{ new: boolean }>

      /**
       *See [`Pallet::set_async_backing_params`].
       */
      set_async_backing_params: TxDescriptor<{ new: Anonymize<Iavuvfkop6318c> }>

      /**
       *See [`Pallet::set_executor_params`].
       */
      set_executor_params: TxDescriptor<{ new: Anonymize<I6sbufrhmgqdb6> }>

      /**
       *See [`Pallet::set_on_demand_base_fee`].
       */
      set_on_demand_base_fee: TxDescriptor<{ new: bigint }>

      /**
       *See [`Pallet::set_on_demand_fee_variability`].
       */
      set_on_demand_fee_variability: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_on_demand_queue_max_size`].
       */
      set_on_demand_queue_max_size: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_on_demand_target_queue_utilization`].
       */
      set_on_demand_target_queue_utilization: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_on_demand_ttl`].
       */
      set_on_demand_ttl: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::set_minimum_backing_votes`].
       */
      set_minimum_backing_votes: TxDescriptor<{ new: number }>
    },
    {},
    {
      /**
       *The new value for a configuration parameter is invalid.
       */
      InvalidNewValue: PlainDescriptor<undefined>
    },
    {},
  ]
  ParasShared: [
    {
      /**
       * The current session index.
       */
      CurrentSessionIndex: StorageDescriptor<[], number, false>

      /**
       * All the validators actively participating in parachain consensus.
       * Indices are into the broader validator set.
       */
      ActiveValidatorIndices: StorageDescriptor<[], Array<number>, false>

      /**
       * The parachain attestation keys of the validators actively participating in parachain
       * consensus. This should be the same length as `ActiveValidatorIndices`.
       */
      ActiveValidatorKeys: StorageDescriptor<[], Array<Binary>, false>

      /**
       * All allowed relay-parents.
       */
      AllowedRelayParents: StorageDescriptor<
        [],
        { buffer: Anonymize<Idm6djpsp7gtcm>; latest_number: number },
        false
      >
    },
    {},
    {},
    {},
    {},
  ]
  ParaInclusion: [
    {
      /**
       * The latest bitfield for each validator, referred to by their index in the validator set.
       */
      AvailabilityBitfields: StorageDescriptor<
        [Key: number],
        {
          bitfield: { bytes: Uint8Array; bitsLen: number }
          submitted_at: number
        },
        true
      >

      /**
       * Candidates pending availability by `ParaId`.
       */
      PendingAvailability: StorageDescriptor<
        [Key: number],
        {
          core: number
          hash: Binary
          descriptor: Anonymize<Ib2u20s6roco9i>
          availability_votes: { bytes: Uint8Array; bitsLen: number }
          backers: { bytes: Uint8Array; bitsLen: number }
          relay_parent_number: number
          backed_in_number: number
          backing_group: number
        },
        true
      >

      /**
       * The commitments of candidates pending availability, by `ParaId`.
       */
      PendingAvailabilityCommitments: StorageDescriptor<
        [Key: number],
        {
          upward_messages: Anonymize<Itom7fk49o0c9>
          horizontal_messages: Anonymize<I6r5cbv8ttrb09>
          new_validation_code: Anonymize<Iabpgqcjikia83>
          head_data: Binary
          processed_downward_messages: number
          hrmp_watermark: number
        },
        true
      >
    },
    {},
    {
      /**
       *A candidate was backed. `[candidate, head_data]`
       */
      CandidateBacked: PlainDescriptor<
        [Anonymize<I4vjld3472quct>, Binary, number, number]
      >

      /**
       *A candidate was included. `[candidate, head_data]`
       */
      CandidateIncluded: PlainDescriptor<
        [Anonymize<I4vjld3472quct>, Binary, number, number]
      >

      /**
       *A candidate timed out. `[candidate, head_data]`
       */
      CandidateTimedOut: PlainDescriptor<
        [Anonymize<I4vjld3472quct>, Binary, number]
      >

      /**
       *Some upward messages have been received and will be processed.
       */
      UpwardMessagesReceived: PlainDescriptor<{ from: number; count: number }>
    },
    {
      /**
       *Validator indices are out of order or contains duplicates.
       */
      UnsortedOrDuplicateValidatorIndices: PlainDescriptor<undefined>

      /**
       *Dispute statement sets are out of order or contain duplicates.
       */
      UnsortedOrDuplicateDisputeStatementSet: PlainDescriptor<undefined>

      /**
       *Backed candidates are out of order (core index) or contain duplicates.
       */
      UnsortedOrDuplicateBackedCandidates: PlainDescriptor<undefined>

      /**
       *A different relay parent was provided compared to the on-chain stored one.
       */
      UnexpectedRelayParent: PlainDescriptor<undefined>

      /**
       *Availability bitfield has unexpected size.
       */
      WrongBitfieldSize: PlainDescriptor<undefined>

      /**
       *Bitfield consists of zeros only.
       */
      BitfieldAllZeros: PlainDescriptor<undefined>

      /**
       *Multiple bitfields submitted by same validator or validators out of order by index.
       */
      BitfieldDuplicateOrUnordered: PlainDescriptor<undefined>

      /**
       *Validator index out of bounds.
       */
      ValidatorIndexOutOfBounds: PlainDescriptor<undefined>

      /**
       *Invalid signature
       */
      InvalidBitfieldSignature: PlainDescriptor<undefined>

      /**
       *Candidate submitted but para not scheduled.
       */
      UnscheduledCandidate: PlainDescriptor<undefined>

      /**
       *Candidate scheduled despite pending candidate already existing for the para.
       */
      CandidateScheduledBeforeParaFree: PlainDescriptor<undefined>

      /**
       *Scheduled cores out of order.
       */
      ScheduledOutOfOrder: PlainDescriptor<undefined>

      /**
       *Head data exceeds the configured maximum.
       */
      HeadDataTooLarge: PlainDescriptor<undefined>

      /**
       *Code upgrade prematurely.
       */
      PrematureCodeUpgrade: PlainDescriptor<undefined>

      /**
       *Output code is too large
       */
      NewCodeTooLarge: PlainDescriptor<undefined>

      /**
       *The candidate's relay-parent was not allowed. Either it was
       *not recent enough or it didn't advance based on the last parachain block.
       */
      DisallowedRelayParent: PlainDescriptor<undefined>

      /**
       *Failed to compute group index for the core: either it's out of bounds
       *or the relay parent doesn't belong to the current session.
       */
      InvalidAssignment: PlainDescriptor<undefined>

      /**
       *Invalid group index in core assignment.
       */
      InvalidGroupIndex: PlainDescriptor<undefined>

      /**
       *Insufficient (non-majority) backing.
       */
      InsufficientBacking: PlainDescriptor<undefined>

      /**
       *Invalid (bad signature, unknown validator, etc.) backing.
       */
      InvalidBacking: PlainDescriptor<undefined>

      /**
       *Collator did not sign PoV.
       */
      NotCollatorSigned: PlainDescriptor<undefined>

      /**
       *The validation data hash does not match expected.
       */
      ValidationDataHashMismatch: PlainDescriptor<undefined>

      /**
       *The downward message queue is not processed correctly.
       */
      IncorrectDownwardMessageHandling: PlainDescriptor<undefined>

      /**
       *At least one upward message sent does not pass the acceptance criteria.
       */
      InvalidUpwardMessages: PlainDescriptor<undefined>

      /**
       *The candidate didn't follow the rules of HRMP watermark advancement.
       */
      HrmpWatermarkMishandling: PlainDescriptor<undefined>

      /**
       *The HRMP messages sent by the candidate is not valid.
       */
      InvalidOutboundHrmp: PlainDescriptor<undefined>

      /**
       *The validation code hash of the candidate is not valid.
       */
      InvalidValidationCodeHash: PlainDescriptor<undefined>

      /**
       *The `para_head` hash in the candidate descriptor doesn't match the hash of the actual
       *para head in the commitments.
       */
      ParaHeadMismatch: PlainDescriptor<undefined>

      /**
       *A bitfield that references a freed core,
       *either intentionally or as part of a concluded
       *invalid dispute.
       */
      BitfieldReferencesFreedCore: PlainDescriptor<undefined>
    },
    {},
  ]
  ParaInherent: [
    {
      /**
       * Whether the paras inherent was included within this block.
       *
       * The `Option<()>` is effectively a `bool`, but it never hits storage in the `None` variant
       * due to the guarantees of FRAME's storage APIs.
       *
       * If this is `None` at the end of the block, we panic and render the block invalid.
       */
      Included: StorageDescriptor<[], undefined, true>

      /**
       * Scraped on chain data for extracting resolved disputes as well as backing votes.
       */
      OnChainVotes: StorageDescriptor<
        [],
        {
          session: number
          backing_validators_per_candidate: Anonymize<Ibabtlc0psj69a>
          disputes: Anonymize<I65nq8pomrmfij>
        },
        true
      >
    },
    {
      /**
       *See [`Pallet::enter`].
       */
      enter: TxDescriptor<{ data: Anonymize<Ieal73d05pk7dg> }>
    },
    {},
    {
      /**
       *Inclusion inherent called more than once per block.
       */
      TooManyInclusionInherents: PlainDescriptor<undefined>

      /**
       *The hash of the submitted parent header doesn't correspond to the saved block hash of
       *the parent.
       */
      InvalidParentHeader: PlainDescriptor<undefined>

      /**
       *Disputed candidate that was concluded invalid.
       */
      CandidateConcludedInvalid: PlainDescriptor<undefined>

      /**
       *The data given to the inherent will result in an overweight block.
       */
      InherentOverweight: PlainDescriptor<undefined>

      /**
       *The ordering of dispute statements was invalid.
       */
      DisputeStatementsUnsortedOrDuplicates: PlainDescriptor<undefined>

      /**
       *A dispute statement was invalid.
       */
      DisputeInvalid: PlainDescriptor<undefined>
    },
    {},
  ]
  ParaScheduler: [
    {
      /**
       * All the validator groups. One for each core. Indices are into `ActiveValidators` - not the
       * broader set of Polkadot validators, but instead just the subset used for parachains during
       * this session.
       *
       * Bound: The number of cores is the sum of the numbers of parachains and parathread
       * multiplexers. Reasonably, 100-1000. The dominant factor is the number of validators: safe
       * upper bound at 10k.
       */
      ValidatorGroups: StorageDescriptor<
        [],
        Array<Anonymize<Icgljjb6j82uhn>>,
        false
      >

      /**
       * One entry for each availability core. Entries are `None` if the core is not currently
       * occupied. Can be temporarily `Some` if scheduled but not occupied.
       * The i'th parachain belongs to the i'th core, with the remaining cores all being
       * parathread-multiplexers.
       *
       * Bounded by the maximum of either of these two values:
       *   * The number of parachains and parathread multiplexers
       *   * The number of validators divided by `configuration.max_validators_per_core`.
       */
      AvailabilityCores: StorageDescriptor<
        [],
        Array<PolkadotPrimitivesV5CoreOccupied>,
        false
      >

      /**
       * The block number where the session start occurred. Used to track how many group rotations
       * have occurred.
       *
       * Note that in the context of parachains modules the session change is signaled during
       * the block and enacted at the end of the block (at the finalization stage, to be exact).
       * Thus for all intents and purposes the effect of the session change is observed at the
       * block following the session change, block number of which we save in this storage value.
       */
      SessionStartBlock: StorageDescriptor<[], number, false>

      /**
       * One entry for each availability core. The `VecDeque` represents the assignments to be
       * scheduled on that core. `None` is used to signal to not schedule the next para of the core
       * as there is one currently being scheduled. Not using `None` here would overwrite the
       * `CoreState` in the runtime API. The value contained here will not be valid after the end of
       * a block. Runtime APIs should be used to determine scheduled cores/ for the upcoming block.
       */
      ClaimQueue: StorageDescriptor<[], Array<Anonymize<Iabtbb330q3t3q>>, false>
    },
    {},
    {},
    {},
    {},
  ]
  Paras: [
    {
      /**
       * All currently active PVF pre-checking votes.
       *
       * Invariant:
       * - There are no PVF pre-checking votes that exists in list but not in the set and vice versa.
       */
      PvfActiveVoteMap: StorageDescriptor<
        [Key: Binary],
        {
          votes_accept: { bytes: Uint8Array; bitsLen: number }
          votes_reject: { bytes: Uint8Array; bitsLen: number }
          age: number
          created_at: number
          causes: Anonymize<Ia0a9586d8d811>
        },
        true
      >

      /**
       * The list of all currently active PVF votes. Auxiliary to `PvfActiveVoteMap`.
       */
      PvfActiveVoteList: StorageDescriptor<[], Array<Binary>, false>

      /**
       * All lease holding parachains. Ordered ascending by `ParaId`. On demand parachains are not
       * included.
       *
       * Consider using the [`ParachainsCache`] type of modifying.
       */
      Parachains: StorageDescriptor<[], Array<number>, false>

      /**
       * The current lifecycle of a all known Para IDs.
       */
      ParaLifecycles: StorageDescriptor<
        [Key: number],
        ParachainsParasParaLifecycle,
        true
      >

      /**
       * The head-data of every registered para.
       */
      Heads: StorageDescriptor<[Key: number], Binary, true>

      /**
       * The context (relay-chain block number) of the most recent parachain head.
       */
      MostRecentContext: StorageDescriptor<[Key: number], number, true>

      /**
       * The validation code hash of every live para.
       *
       * Corresponding code can be retrieved with [`CodeByHash`].
       */
      CurrentCodeHash: StorageDescriptor<[Key: number], Binary, true>

      /**
       * Actual past code hash, indicated by the para id as well as the block number at which it
       * became outdated.
       *
       * Corresponding code can be retrieved with [`CodeByHash`].
       */
      PastCodeHash: StorageDescriptor<[Key: [number, number]], Binary, true>

      /**
       * Past code of parachains. The parachains themselves may not be registered anymore,
       * but we also keep their code on-chain for the same amount of time as outdated code
       * to keep it available for approval checkers.
       */
      PastCodeMeta: StorageDescriptor<
        [Key: number],
        {
          upgrade_times: Anonymize<I2v6n2k262gqsq>
          last_pruned: Anonymize<I4arjljr6dpflb>
        },
        false
      >

      /**
       * Which paras have past code that needs pruning and the relay-chain block at which the code
       * was replaced. Note that this is the actual height of the included block, not the expected
       * height at which the code upgrade would be applied, although they may be equal.
       * This is to ensure the entire acceptance period is covered, not an offset acceptance period
       * starting from the time at which the parachain perceives a code upgrade as having occurred.
       * Multiple entries for a single para are permitted. Ordered ascending by block number.
       */
      PastCodePruning: StorageDescriptor<
        [],
        Array<Anonymize<I5g2vv0ckl2m8b>>,
        false
      >

      /**
       * The block number at which the planned code change is expected for a para.
       * The change will be applied after the first parablock for this ID included which executes
       * in the context of a relay chain block with a number >= `expected_at`.
       */
      FutureCodeUpgrades: StorageDescriptor<[Key: number], number, true>

      /**
       * The actual future code hash of a para.
       *
       * Corresponding code can be retrieved with [`CodeByHash`].
       */
      FutureCodeHash: StorageDescriptor<[Key: number], Binary, true>

      /**
       * This is used by the relay-chain to communicate to a parachain a go-ahead with in the upgrade
       * procedure.
       *
       * This value is absent when there are no upgrades scheduled or during the time the relay chain
       * performs the checks. It is set at the first relay-chain block when the corresponding
       * parachain can switch its upgrade function. As soon as the parachain's block is included, the
       * value gets reset to `None`.
       *
       * NOTE that this field is used by parachains via merkle storage proofs, therefore changing
       * the format will require migration of parachains.
       */
      UpgradeGoAheadSignal: StorageDescriptor<
        [Key: number],
        PolkadotPrimitivesV5UpgradeGoAhead,
        true
      >

      /**
       * This is used by the relay-chain to communicate that there are restrictions for performing
       * an upgrade for this parachain.
       *
       * This may be a because the parachain waits for the upgrade cooldown to expire. Another
       * potential use case is when we want to perform some maintenance (such as storage migration)
       * we could restrict upgrades to make the process simpler.
       *
       * NOTE that this field is used by parachains via merkle storage proofs, therefore changing
       * the format will require migration of parachains.
       */
      UpgradeRestrictionSignal: StorageDescriptor<
        [Key: number],
        PolkadotPrimitivesV5UpgradeRestriction,
        true
      >

      /**
       * The list of parachains that are awaiting for their upgrade restriction to cooldown.
       *
       * Ordered ascending by block number.
       */
      UpgradeCooldowns: StorageDescriptor<
        [],
        Array<Anonymize<I5g2vv0ckl2m8b>>,
        false
      >

      /**
       * The list of upcoming code upgrades. Each item is a pair of which para performs a code
       * upgrade and at which relay-chain block it is expected at.
       *
       * Ordered ascending by block number.
       */
      UpcomingUpgrades: StorageDescriptor<
        [],
        Array<Anonymize<I5g2vv0ckl2m8b>>,
        false
      >

      /**
       * The actions to perform during the start of a specific session index.
       */
      ActionsQueue: StorageDescriptor<[Key: number], Array<number>, false>

      /**
       * Upcoming paras instantiation arguments.
       *
       * NOTE that after PVF pre-checking is enabled the para genesis arg will have it's code set
       * to empty. Instead, the code will be saved into the storage right away via `CodeByHash`.
       */
      UpcomingParasGenesis: StorageDescriptor<
        [Key: number],
        { genesis_head: Binary; validation_code: Binary; para_kind: boolean },
        true
      >

      /**
       * The number of reference on the validation code in [`CodeByHash`] storage.
       */
      CodeByHashRefs: StorageDescriptor<[Key: Binary], number, false>

      /**
       * Validation code stored by its hash.
       *
       * This storage is consistent with [`FutureCodeHash`], [`CurrentCodeHash`] and
       * [`PastCodeHash`].
       */
      CodeByHash: StorageDescriptor<[Key: Binary], Binary, true>
    },
    {
      /**
       *See [`Pallet::force_set_current_code`].
       */
      force_set_current_code: TxDescriptor<{ para: number; new_code: Binary }>

      /**
       *See [`Pallet::force_set_current_head`].
       */
      force_set_current_head: TxDescriptor<{ para: number; new_head: Binary }>

      /**
       *See [`Pallet::force_schedule_code_upgrade`].
       */
      force_schedule_code_upgrade: TxDescriptor<{
        para: number
        new_code: Binary
        relay_parent_number: number
      }>

      /**
       *See [`Pallet::force_note_new_head`].
       */
      force_note_new_head: TxDescriptor<{ para: number; new_head: Binary }>

      /**
       *See [`Pallet::force_queue_action`].
       */
      force_queue_action: TxDescriptor<{ para: number }>

      /**
       *See [`Pallet::add_trusted_validation_code`].
       */
      add_trusted_validation_code: TxDescriptor<{ validation_code: Binary }>

      /**
       *See [`Pallet::poke_unused_validation_code`].
       */
      poke_unused_validation_code: TxDescriptor<{
        validation_code_hash: Binary
      }>

      /**
       *See [`Pallet::include_pvf_check_statement`].
       */
      include_pvf_check_statement: TxDescriptor<{
        stmt: Anonymize<I3h1ccufdk38ej>
        signature: Binary
      }>

      /**
       *See [`Pallet::force_set_most_recent_context`].
       */
      force_set_most_recent_context: TxDescriptor<{
        para: number
        context: number
      }>
    },
    {
      /**
       *Current code has been updated for a Para. `para_id`
       */
      CurrentCodeUpdated: PlainDescriptor<number>

      /**
       *Current head has been updated for a Para. `para_id`
       */
      CurrentHeadUpdated: PlainDescriptor<number>

      /**
       *A code upgrade has been scheduled for a Para. `para_id`
       */
      CodeUpgradeScheduled: PlainDescriptor<number>

      /**
       *A new head has been noted for a Para. `para_id`
       */
      NewHeadNoted: PlainDescriptor<number>

      /**
       *A para has been queued to execute pending actions. `para_id`
       */
      ActionQueued: PlainDescriptor<[number, number]>

      /**
       *The given para either initiated or subscribed to a PVF check for the given validation
       *code. `code_hash` `para_id`
       */
      PvfCheckStarted: PlainDescriptor<[Binary, number]>

      /**
       *The given validation code was accepted by the PVF pre-checking vote.
       *`code_hash` `para_id`
       */
      PvfCheckAccepted: PlainDescriptor<[Binary, number]>

      /**
       *The given validation code was rejected by the PVF pre-checking vote.
       *`code_hash` `para_id`
       */
      PvfCheckRejected: PlainDescriptor<[Binary, number]>
    },
    {
      /**
       *Para is not registered in our system.
       */
      NotRegistered: PlainDescriptor<undefined>

      /**
       *Para cannot be onboarded because it is already tracked by our system.
       */
      CannotOnboard: PlainDescriptor<undefined>

      /**
       *Para cannot be offboarded at this time.
       */
      CannotOffboard: PlainDescriptor<undefined>

      /**
       *Para cannot be upgraded to a lease holding parachain.
       */
      CannotUpgrade: PlainDescriptor<undefined>

      /**
       *Para cannot be downgraded to an on-demand parachain.
       */
      CannotDowngrade: PlainDescriptor<undefined>

      /**
       *The statement for PVF pre-checking is stale.
       */
      PvfCheckStatementStale: PlainDescriptor<undefined>

      /**
       *The statement for PVF pre-checking is for a future session.
       */
      PvfCheckStatementFuture: PlainDescriptor<undefined>

      /**
       *Claimed validator index is out of bounds.
       */
      PvfCheckValidatorIndexOutOfBounds: PlainDescriptor<undefined>

      /**
       *The signature for the PVF pre-checking is invalid.
       */
      PvfCheckInvalidSignature: PlainDescriptor<undefined>

      /**
       *The given validator already has cast a vote.
       */
      PvfCheckDoubleVote: PlainDescriptor<undefined>

      /**
       *The given PVF does not exist at the moment of process a vote.
       */
      PvfCheckSubjectInvalid: PlainDescriptor<undefined>

      /**
       *Parachain cannot currently schedule a code upgrade.
       */
      CannotUpgradeCode: PlainDescriptor<undefined>
    },
    {
      /**

 */
      UnsignedPriority: PlainDescriptor<bigint>
    },
  ]
  Initializer: [
    {
      /**
       * Whether the parachains modules have been initialized within this block.
       *
       * Semantically a `bool`, but this guarantees it should never hit the trie,
       * as this is cleared in `on_finalize` and Frame optimizes `None` values to be empty values.
       *
       * As a `bool`, `set(false)` and `remove()` both lead to the next `get()` being false, but one
       * of them writes to the trie and one does not. This confusion makes `Option<()>` more suitable
       * for the semantics of this variable.
       */
      HasInitialized: StorageDescriptor<[], undefined, true>

      /**
       * Buffered session changes along with the block number at which they should be applied.
       *
       * Typically this will be empty or one element long. Apart from that this item never hits
       * the storage.
       *
       * However this is a `Vec` regardless to handle various edge cases that may occur at runtime
       * upgrade boundaries or if governance intervenes.
       */
      BufferedSessionChanges: StorageDescriptor<
        [],
        Array<Anonymize<I36mfku1ea0i8t>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::force_approve`].
       */
      force_approve: TxDescriptor<{ up_to: number }>
    },
    {},
    {},
    {},
  ]
  Dmp: [
    {
      /**
       * The downward messages addressed for a certain para.
       */
      DownwardMessageQueues: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I60847k37jfcc6>>,
        false
      >

      /**
       * A mapping that stores the downward message queue MQC head for each para.
       *
       * Each link in this chain has a form:
       * `(prev_head, B, H(M))`, where
       * - `prev_head`: is the previous head hash or zero if none.
       * - `B`: is the relay-chain block number in which a message was appended.
       * - `H(M)`: is the hash of the message being appended.
       */
      DownwardMessageQueueHeads: StorageDescriptor<[Key: number], Binary, false>

      /**
       * The factor to multiply the base delivery fee by.
       */
      DeliveryFeeFactor: StorageDescriptor<[Key: number], bigint, false>
    },
    {},
    {},
    {},
    {},
  ]
  Hrmp: [
    {
      /**
       * The set of pending HRMP open channel requests.
       *
       * The set is accompanied by a list for iteration.
       *
       * Invariant:
       * - There are no channels that exists in list but not in the set and vice versa.
       */
      HrmpOpenChannelRequests: StorageDescriptor<
        [Key: { sender: number; recipient: number }],
        {
          confirmed: boolean
          _age: number
          sender_deposit: bigint
          max_message_size: number
          max_capacity: number
          max_total_size: number
        },
        true
      >

      /**

 */
      HrmpOpenChannelRequestsList: StorageDescriptor<
        [],
        Array<Anonymize<I50mrcbubp554e>>,
        false
      >

      /**
       * This mapping tracks how many open channel requests are initiated by a given sender para.
       * Invariant: `HrmpOpenChannelRequests` should contain the same number of items that has
       * `(X, _)` as the number of `HrmpOpenChannelRequestCount` for `X`.
       */
      HrmpOpenChannelRequestCount: StorageDescriptor<
        [Key: number],
        number,
        false
      >

      /**
       * This mapping tracks how many open channel requests were accepted by a given recipient para.
       * Invariant: `HrmpOpenChannelRequests` should contain the same number of items `(_, X)` with
       * `confirmed` set to true, as the number of `HrmpAcceptedChannelRequestCount` for `X`.
       */
      HrmpAcceptedChannelRequestCount: StorageDescriptor<
        [Key: number],
        number,
        false
      >

      /**
       * A set of pending HRMP close channel requests that are going to be closed during the session
       * change. Used for checking if a given channel is registered for closure.
       *
       * The set is accompanied by a list for iteration.
       *
       * Invariant:
       * - There are no channels that exists in list but not in the set and vice versa.
       */
      HrmpCloseChannelRequests: StorageDescriptor<
        [Key: { sender: number; recipient: number }],
        undefined,
        true
      >

      /**

 */
      HrmpCloseChannelRequestsList: StorageDescriptor<
        [],
        Array<Anonymize<I50mrcbubp554e>>,
        false
      >

      /**
       * The HRMP watermark associated with each para.
       * Invariant:
       * - each para `P` used here as a key should satisfy `Paras::is_valid_para(P)` within a
       *   session.
       */
      HrmpWatermarks: StorageDescriptor<[Key: number], number, true>

      /**
       * HRMP channel data associated with each para.
       * Invariant:
       * - each participant in the channel should satisfy `Paras::is_valid_para(P)` within a session.
       */
      HrmpChannels: StorageDescriptor<
        [Key: { sender: number; recipient: number }],
        {
          max_capacity: number
          max_total_size: number
          max_message_size: number
          msg_count: number
          total_size: number
          mqc_head: Anonymize<I17k3ujudqd5df>
          sender_deposit: bigint
          recipient_deposit: bigint
        },
        true
      >

      /**
       * Ingress/egress indexes allow to find all the senders and receivers given the opposite side.
       * I.e.
       *
       * (a) ingress index allows to find all the senders for a given recipient.
       * (b) egress index allows to find all the recipients for a given sender.
       *
       * Invariants:
       * - for each ingress index entry for `P` each item `I` in the index should present in
       *   `HrmpChannels` as `(I, P)`.
       * - for each egress index entry for `P` each item `E` in the index should present in
       *   `HrmpChannels` as `(P, E)`.
       * - there should be no other dangling channels in `HrmpChannels`.
       * - the vectors are sorted.
       */
      HrmpIngressChannelsIndex: StorageDescriptor<
        [Key: number],
        Array<number>,
        false
      >

      /**

 */
      HrmpEgressChannelsIndex: StorageDescriptor<
        [Key: number],
        Array<number>,
        false
      >

      /**
       * Storage for the messages for each channel.
       * Invariant: cannot be non-empty if the corresponding channel in `HrmpChannels` is `None`.
       */
      HrmpChannelContents: StorageDescriptor<
        [Key: { sender: number; recipient: number }],
        Array<Anonymize<I409qo0sfkbh16>>,
        false
      >

      /**
       * Maintains a mapping that can be used to answer the question: What paras sent a message at
       * the given block number for a given receiver. Invariants:
       * - The inner `Vec<ParaId>` is never empty.
       * - The inner `Vec<ParaId>` cannot store two same `ParaId`.
       * - The outer vector is sorted ascending by block number and cannot store two items with the
       *   same block number.
       */
      HrmpChannelDigests: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I8pg2rpr4ldgp9>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::hrmp_init_open_channel`].
       */
      hrmp_init_open_channel: TxDescriptor<{
        recipient: number
        proposed_max_capacity: number
        proposed_max_message_size: number
      }>

      /**
       *See [`Pallet::hrmp_accept_open_channel`].
       */
      hrmp_accept_open_channel: TxDescriptor<{ sender: number }>

      /**
       *See [`Pallet::hrmp_close_channel`].
       */
      hrmp_close_channel: TxDescriptor<{
        channel_id: Anonymize<I50mrcbubp554e>
      }>

      /**
       *See [`Pallet::force_clean_hrmp`].
       */
      force_clean_hrmp: TxDescriptor<{
        para: number
        num_inbound: number
        num_outbound: number
      }>

      /**
       *See [`Pallet::force_process_hrmp_open`].
       */
      force_process_hrmp_open: TxDescriptor<{ channels: number }>

      /**
       *See [`Pallet::force_process_hrmp_close`].
       */
      force_process_hrmp_close: TxDescriptor<{ channels: number }>

      /**
       *See [`Pallet::hrmp_cancel_open_request`].
       */
      hrmp_cancel_open_request: TxDescriptor<{
        channel_id: Anonymize<I50mrcbubp554e>
        open_requests: number
      }>

      /**
       *See [`Pallet::force_open_hrmp_channel`].
       */
      force_open_hrmp_channel: TxDescriptor<{
        sender: number
        recipient: number
        max_capacity: number
        max_message_size: number
      }>

      /**
       *See [`Pallet::establish_system_channel`].
       */
      establish_system_channel: TxDescriptor<{
        sender: number
        recipient: number
      }>

      /**
       *See [`Pallet::poke_channel_deposits`].
       */
      poke_channel_deposits: TxDescriptor<{ sender: number; recipient: number }>
    },
    {
      /**
       *Open HRMP channel requested.
       */
      OpenChannelRequested: PlainDescriptor<{
        sender: number
        recipient: number
        proposed_max_capacity: number
        proposed_max_message_size: number
      }>

      /**
       *An HRMP channel request sent by the receiver was canceled by either party.
       */
      OpenChannelCanceled: PlainDescriptor<{
        by_parachain: number
        channel_id: Anonymize<I50mrcbubp554e>
      }>

      /**
       *Open HRMP channel accepted.
       */
      OpenChannelAccepted: PlainDescriptor<{
        sender: number
        recipient: number
      }>

      /**
       *HRMP channel closed.
       */
      ChannelClosed: PlainDescriptor<{
        by_parachain: number
        channel_id: Anonymize<I50mrcbubp554e>
      }>

      /**
       *An HRMP channel was opened via Root origin.
       */
      HrmpChannelForceOpened: PlainDescriptor<{
        sender: number
        recipient: number
        proposed_max_capacity: number
        proposed_max_message_size: number
      }>

      /**
       *An HRMP channel was opened between two system chains.
       */
      HrmpSystemChannelOpened: PlainDescriptor<{
        sender: number
        recipient: number
        proposed_max_capacity: number
        proposed_max_message_size: number
      }>

      /**
       *An HRMP channel's deposits were updated.
       */
      OpenChannelDepositsUpdated: PlainDescriptor<{
        sender: number
        recipient: number
      }>
    },
    {
      /**
       *The sender tried to open a channel to themselves.
       */
      OpenHrmpChannelToSelf: PlainDescriptor<undefined>

      /**
       *The recipient is not a valid para.
       */
      OpenHrmpChannelInvalidRecipient: PlainDescriptor<undefined>

      /**
       *The requested capacity is zero.
       */
      OpenHrmpChannelZeroCapacity: PlainDescriptor<undefined>

      /**
       *The requested capacity exceeds the global limit.
       */
      OpenHrmpChannelCapacityExceedsLimit: PlainDescriptor<undefined>

      /**
       *The requested maximum message size is 0.
       */
      OpenHrmpChannelZeroMessageSize: PlainDescriptor<undefined>

      /**
       *The open request requested the message size that exceeds the global limit.
       */
      OpenHrmpChannelMessageSizeExceedsLimit: PlainDescriptor<undefined>

      /**
       *The channel already exists
       */
      OpenHrmpChannelAlreadyExists: PlainDescriptor<undefined>

      /**
       *There is already a request to open the same channel.
       */
      OpenHrmpChannelAlreadyRequested: PlainDescriptor<undefined>

      /**
       *The sender already has the maximum number of allowed outbound channels.
       */
      OpenHrmpChannelLimitExceeded: PlainDescriptor<undefined>

      /**
       *The channel from the sender to the origin doesn't exist.
       */
      AcceptHrmpChannelDoesntExist: PlainDescriptor<undefined>

      /**
       *The channel is already confirmed.
       */
      AcceptHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined>

      /**
       *The recipient already has the maximum number of allowed inbound channels.
       */
      AcceptHrmpChannelLimitExceeded: PlainDescriptor<undefined>

      /**
       *The origin tries to close a channel where it is neither the sender nor the recipient.
       */
      CloseHrmpChannelUnauthorized: PlainDescriptor<undefined>

      /**
       *The channel to be closed doesn't exist.
       */
      CloseHrmpChannelDoesntExist: PlainDescriptor<undefined>

      /**
       *The channel close request is already requested.
       */
      CloseHrmpChannelAlreadyUnderway: PlainDescriptor<undefined>

      /**
       *Canceling is requested by neither the sender nor recipient of the open channel request.
       */
      CancelHrmpOpenChannelUnauthorized: PlainDescriptor<undefined>

      /**
       *The open request doesn't exist.
       */
      OpenHrmpChannelDoesntExist: PlainDescriptor<undefined>

      /**
       *Cannot cancel an HRMP open channel request because it is already confirmed.
       */
      OpenHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined>

      /**
       *The provided witness data is wrong.
       */
      WrongWitness: PlainDescriptor<undefined>

      /**
       *The channel between these two chains cannot be authorized.
       */
      ChannelCreationNotAuthorized: PlainDescriptor<undefined>
    },
    {},
  ]
  ParaSessionInfo: [
    {
      /**
       * Assignment keys for the current session.
       * Note that this API is private due to it being prone to 'off-by-one' at session boundaries.
       * When in doubt, use `Sessions` API instead.
       */
      AssignmentKeysUnsafe: StorageDescriptor<[], Array<Binary>, false>

      /**
       * The earliest session for which previous session info is stored.
       */
      EarliestStoredSession: StorageDescriptor<[], number, false>

      /**
       * Session information in a rolling window.
       * Should have an entry in range `EarliestStoredSession..=CurrentSessionIndex`.
       * Does not have any entries before the session index in the first session change notification.
       */
      Sessions: StorageDescriptor<
        [Key: number],
        {
          active_validator_indices: Anonymize<Icgljjb6j82uhn>
          random_seed: Binary
          dispute_period: number
          validators: Anonymize<Idhnf6rtqoslea>
          discovery_keys: Anonymize<Idhnf6rtqoslea>
          assignment_keys: Anonymize<Idhnf6rtqoslea>
          validator_groups: Anonymize<Iarlj3qd8u1v13>
          n_cores: number
          zeroth_delay_tranche_width: number
          relay_vrf_modulo_samples: number
          n_delay_tranches: number
          no_show_slots: number
          needed_approvals: number
        },
        true
      >

      /**
       * The validator account keys of the validators actively participating in parachain consensus.
       */
      AccountKeys: StorageDescriptor<[Key: number], Array<SS58String>, true>

      /**
       * Executor parameter set for a given session index
       */
      SessionExecutorParams: StorageDescriptor<
        [Key: number],
        Array<PolkadotPrimitivesV5ExecutorParam>,
        true
      >
    },
    {},
    {},
    {},
    {},
  ]
  ParasDisputes: [
    {
      /**
       * The last pruned session, if any. All data stored by this module
       * references sessions.
       */
      LastPrunedSession: StorageDescriptor<[], number, true>

      /**
       * All ongoing or concluded disputes for the last several sessions.
       */
      Disputes: StorageDescriptor<
        [number, Binary],
        {
          validators_for: { bytes: Uint8Array; bitsLen: number }
          validators_against: { bytes: Uint8Array; bitsLen: number }
          start: number
          concluded_at: Anonymize<I4arjljr6dpflb>
        },
        true
      >

      /**
       * Backing votes stored for each dispute.
       * This storage is used for slashing.
       */
      BackersOnDisputes: StorageDescriptor<
        [number, Binary],
        Array<number>,
        true
      >

      /**
       * All included blocks on the chain, as well as the block number in this chain that
       * should be reverted back to if the candidate is disputed and determined to be invalid.
       */
      Included: StorageDescriptor<[number, Binary], number, true>

      /**
       * Whether the chain is frozen. Starts as `None`. When this is `Some`,
       * the chain will not accept any new parachain blocks for backing or inclusion,
       * and its value indicates the last valid block number in the chain.
       * It can only be set back to `None` by governance intervention.
       */
      Frozen: StorageDescriptor<[], number | undefined, false>
    },
    {
      /**
       *See [`Pallet::force_unfreeze`].
       */
      force_unfreeze: TxDescriptor<undefined>
    },
    {
      /**
       *A dispute has been initiated. \[candidate hash, dispute location\]
       */
      DisputeInitiated: PlainDescriptor<
        [Binary, ParachainsDisputesDisputeLocation]
      >

      /**
       *A dispute has concluded for or against a candidate.
       *`\[para id, candidate hash, dispute result\]`
       */
      DisputeConcluded: PlainDescriptor<
        [Binary, ParachainsDisputesDisputeResult]
      >

      /**
       *A dispute has concluded with supermajority against a candidate.
       *Block authors should no longer build on top of this head and should
       *instead revert the block at the given height. This should be the
       *number of the child of the last known valid block in the chain.
       */
      Revert: PlainDescriptor<number>
    },
    {
      /**
       *Duplicate dispute statement sets provided.
       */
      DuplicateDisputeStatementSets: PlainDescriptor<undefined>

      /**
       *Ancient dispute statement provided.
       */
      AncientDisputeStatement: PlainDescriptor<undefined>

      /**
       *Validator index on statement is out of bounds for session.
       */
      ValidatorIndexOutOfBounds: PlainDescriptor<undefined>

      /**
       *Invalid signature on statement.
       */
      InvalidSignature: PlainDescriptor<undefined>

      /**
       *Validator vote submitted more than once to dispute.
       */
      DuplicateStatement: PlainDescriptor<undefined>

      /**
       *A dispute where there are only votes on one side.
       */
      SingleSidedDispute: PlainDescriptor<undefined>

      /**
       *A dispute vote from a malicious backer.
       */
      MaliciousBacker: PlainDescriptor<undefined>

      /**
       *No backing votes were provides along dispute statements.
       */
      MissingBackingVotes: PlainDescriptor<undefined>

      /**
       *Unconfirmed dispute statement sets provided.
       */
      UnconfirmedDispute: PlainDescriptor<undefined>
    },
    {},
  ]
  ParasSlashing: [
    {
      /**
       * Validators pending dispute slashes.
       */
      UnappliedSlashes: StorageDescriptor<
        [number, Binary],
        {
          keys: Anonymize<I93ssha9egqq23>
          kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
        },
        true
      >

      /**
       * `ValidatorSetCount` per session.
       */
      ValidatorSetCounts: StorageDescriptor<[Key: number], number, true>
    },
    {
      /**
       *See [`Pallet::report_dispute_lost_unsigned`].
       */
      report_dispute_lost_unsigned: TxDescriptor<{
        dispute_proof: Anonymize<Iag14tqe65tvpf>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>
    },
    {},
    {
      /**
       *The key ownership proof is invalid.
       */
      InvalidKeyOwnershipProof: PlainDescriptor<undefined>

      /**
       *The session index is too old or invalid.
       */
      InvalidSessionIndex: PlainDescriptor<undefined>

      /**
       *The candidate hash is invalid.
       */
      InvalidCandidateHash: PlainDescriptor<undefined>

      /**
       *There is no pending slash for the given validator index and time
       *slot.
       */
      InvalidValidatorIndex: PlainDescriptor<undefined>

      /**
       *The validator index does not match the validator id.
       */
      ValidatorIndexIdMismatch: PlainDescriptor<undefined>

      /**
       *The given slashing report is valid but already previously reported.
       */
      DuplicateSlashingReport: PlainDescriptor<undefined>
    },
    {},
  ]
  ParaAssignmentProvider: [{}, {}, {}, {}, {}]
  Registrar: [
    {
      /**
       * Pending swap operations.
       */
      PendingSwap: StorageDescriptor<[Key: number], number, true>

      /**
       * Amount held on deposit for each para and the original depositor.
       *
       * The given account ID is responsible for registering the code and initial head data, but may
       * only do so if it isn't yet registered. (After that, it's up to governance to do so.)
       */
      Paras: StorageDescriptor<
        [Key: number],
        {
          manager: SS58String
          deposit: bigint
          locked: Anonymize<I8ie0dco0kcuq5>
        },
        true
      >

      /**
       * The next free `ParaId`.
       */
      NextFreeParaId: StorageDescriptor<[], number, false>
    },
    {
      /**
       *See [`Pallet::register`].
       */
      register: TxDescriptor<{
        id: number
        genesis_head: Binary
        validation_code: Binary
      }>

      /**
       *See [`Pallet::force_register`].
       */
      force_register: TxDescriptor<{
        who: SS58String
        deposit: bigint
        id: number
        genesis_head: Binary
        validation_code: Binary
      }>

      /**
       *See [`Pallet::deregister`].
       */
      deregister: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::swap`].
       */
      swap: TxDescriptor<{ id: number; other: number }>

      /**
       *See [`Pallet::remove_lock`].
       */
      remove_lock: TxDescriptor<{ para: number }>

      /**
       *See [`Pallet::reserve`].
       */
      reserve: TxDescriptor<undefined>

      /**
       *See [`Pallet::add_lock`].
       */
      add_lock: TxDescriptor<{ para: number }>

      /**
       *See [`Pallet::schedule_code_upgrade`].
       */
      schedule_code_upgrade: TxDescriptor<{ para: number; new_code: Binary }>

      /**
       *See [`Pallet::set_current_head`].
       */
      set_current_head: TxDescriptor<{ para: number; new_head: Binary }>
    },
    {
      /**

 */
      Registered: PlainDescriptor<{ para_id: number; manager: SS58String }>

      /**

 */
      Deregistered: PlainDescriptor<{ para_id: number }>

      /**

 */
      Reserved: PlainDescriptor<{ para_id: number; who: SS58String }>

      /**

 */
      Swapped: PlainDescriptor<{ para_id: number; other_id: number }>
    },
    {
      /**
       *The ID is not registered.
       */
      NotRegistered: PlainDescriptor<undefined>

      /**
       *The ID is already registered.
       */
      AlreadyRegistered: PlainDescriptor<undefined>

      /**
       *The caller is not the owner of this Id.
       */
      NotOwner: PlainDescriptor<undefined>

      /**
       *Invalid para code size.
       */
      CodeTooLarge: PlainDescriptor<undefined>

      /**
       *Invalid para head data size.
       */
      HeadDataTooLarge: PlainDescriptor<undefined>

      /**
       *Para is not a Parachain.
       */
      NotParachain: PlainDescriptor<undefined>

      /**
       *Para is not a Parathread (on-demand parachain).
       */
      NotParathread: PlainDescriptor<undefined>

      /**
       *Cannot deregister para
       */
      CannotDeregister: PlainDescriptor<undefined>

      /**
       *Cannot schedule downgrade of lease holding parachain to on-demand parachain
       */
      CannotDowngrade: PlainDescriptor<undefined>

      /**
       *Cannot schedule upgrade of on-demand parachain to lease holding parachain
       */
      CannotUpgrade: PlainDescriptor<undefined>

      /**
       *Para is locked from manipulation by the manager. Must use parachain or relay chain
       *governance.
       */
      ParaLocked: PlainDescriptor<undefined>

      /**
       *The ID given for registration has not been reserved.
       */
      NotReserved: PlainDescriptor<undefined>

      /**
       *Registering parachain with empty code is not allowed.
       */
      EmptyCode: PlainDescriptor<undefined>

      /**
       *Cannot perform a parachain slot / lifecycle swap. Check that the state of both paras
       *are correct for the swap to work.
       */
      CannotSwap: PlainDescriptor<undefined>
    },
    {
      /**
       * The deposit to be paid to run a on-demand parachain.
       * This should include the cost for storing the genesis head and validation code.
       */
      ParaDeposit: PlainDescriptor<bigint>

      /**
       * The deposit to be paid per byte stored on chain.
       */
      DataDepositPerByte: PlainDescriptor<bigint>
    },
  ]
  Slots: [
    {
      /**
       * Amounts held on deposit for each (possibly future) leased parachain.
       *
       * The actual amount locked on its behalf by any account at any time is the maximum of the
       * second values of the items in this list whose first value is the account.
       *
       * The first item in the list is the amount locked for the current Lease Period. Following
       * items are for the subsequent lease periods.
       *
       * The default value (an empty list) implies that the parachain no longer exists (or never
       * existed) as far as this pallet is concerned.
       *
       * If a parachain doesn't exist *yet* but is scheduled to exist in the future, then it
       * will be left-padded with one or more `None`s to denote the fact that nothing is held on
       * deposit for the non-existent chain currently, but is held at some point in the future.
       *
       * It is illegal for a `None` value to trail in the list.
       */
      Leases: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I92hdo1clkbp4g>>,
        false
      >
    },
    {
      /**
       *See [`Pallet::force_lease`].
       */
      force_lease: TxDescriptor<{
        para: number
        leaser: SS58String
        amount: bigint
        period_begin: number
        period_count: number
      }>

      /**
       *See [`Pallet::clear_all_leases`].
       */
      clear_all_leases: TxDescriptor<{ para: number }>

      /**
       *See [`Pallet::trigger_onboard`].
       */
      trigger_onboard: TxDescriptor<{ para: number }>
    },
    {
      /**
       *A new `[lease_period]` is beginning.
       */
      NewLeasePeriod: PlainDescriptor<{ lease_period: number }>

      /**
       *A para has won the right to a continuous set of lease periods as a parachain.
       *First balance is any extra amount reserved on top of the para's existing deposit.
       *Second balance is the total amount reserved.
       */
      Leased: PlainDescriptor<{
        para_id: number
        leaser: SS58String
        period_begin: number
        period_count: number
        extra_reserved: bigint
        total_amount: bigint
      }>
    },
    {
      /**
       *The parachain ID is not onboarding.
       */
      ParaNotOnboarding: PlainDescriptor<undefined>

      /**
       *There was an error with the lease.
       */
      LeaseError: PlainDescriptor<undefined>
    },
    {
      /**
       * The number of blocks over which a single period lasts.
       */
      LeasePeriod: PlainDescriptor<number>

      /**
       * The number of blocks to offset each lease period by.
       */
      LeaseOffset: PlainDescriptor<number>
    },
  ]
  Auctions: [
    {
      /**
       * Number of auctions started so far.
       */
      AuctionCounter: StorageDescriptor<[], number, false>

      /**
       * Information relating to the current auction, if there is one.
       *
       * The first item in the tuple is the lease period index that the first of the four
       * contiguous lease periods on auction is for. The second is the block number when the
       * auction will "begin to end", i.e. the first block of the Ending Period of the auction.
       */
      AuctionInfo: StorageDescriptor<[], [number, number], true>

      /**
       * Amounts currently reserved in the accounts of the bidders currently winning
       * (sub-)ranges.
       */
      ReservedAmounts: StorageDescriptor<
        [Key: [SS58String, number]],
        bigint,
        true
      >

      /**
       * The winning bids for each of the 10 ranges at each sample in the final Ending Period of
       * the current auction. The map's key is the 0-based index into the Sample Size. The
       * first sample of the ending period is 0; the last is `Sample Size - 1`.
       */
      Winning: StorageDescriptor<
        [Key: number],
        Array<Anonymize<I1qlf98109qt29>>,
        true
      >
    },
    {
      /**
       *See [`Pallet::new_auction`].
       */
      new_auction: TxDescriptor<{
        duration: number
        lease_period_index: number
      }>

      /**
       *See [`Pallet::bid`].
       */
      bid: TxDescriptor<{
        para: number
        auction_index: number
        first_slot: number
        last_slot: number
        amount: bigint
      }>

      /**
       *See [`Pallet::cancel_auction`].
       */
      cancel_auction: TxDescriptor<undefined>
    },
    {
      /**
       *An auction started. Provides its index and the block number where it will begin to
       *close and the first lease period of the quadruplet that is auctioned.
       */
      AuctionStarted: PlainDescriptor<{
        auction_index: number
        lease_period: number
        ending: number
      }>

      /**
       *An auction ended. All funds become unreserved.
       */
      AuctionClosed: PlainDescriptor<{ auction_index: number }>

      /**
       *Funds were reserved for a winning bid. First balance is the extra amount reserved.
       *Second is the total.
       */
      Reserved: PlainDescriptor<{
        bidder: SS58String
        extra_reserved: bigint
        total_amount: bigint
      }>

      /**
       *Funds were unreserved since bidder is no longer active. `[bidder, amount]`
       */
      Unreserved: PlainDescriptor<{ bidder: SS58String; amount: bigint }>

      /**
       *Someone attempted to lease the same slot twice for a parachain. The amount is held in
       *reserve but no parachain slot has been leased.
       */
      ReserveConfiscated: PlainDescriptor<{
        para_id: number
        leaser: SS58String
        amount: bigint
      }>

      /**
       *A new bid has been accepted as the current winner.
       */
      BidAccepted: PlainDescriptor<{
        bidder: SS58String
        para_id: number
        amount: bigint
        first_slot: number
        last_slot: number
      }>

      /**
       *The winning offset was chosen for an auction. This will map into the `Winning` storage
       *map.
       */
      WinningOffset: PlainDescriptor<{
        auction_index: number
        block_number: number
      }>
    },
    {
      /**
       *This auction is already in progress.
       */
      AuctionInProgress: PlainDescriptor<undefined>

      /**
       *The lease period is in the past.
       */
      LeasePeriodInPast: PlainDescriptor<undefined>

      /**
       *Para is not registered
       */
      ParaNotRegistered: PlainDescriptor<undefined>

      /**
       *Not a current auction.
       */
      NotCurrentAuction: PlainDescriptor<undefined>

      /**
       *Not an auction.
       */
      NotAuction: PlainDescriptor<undefined>

      /**
       *Auction has already ended.
       */
      AuctionEnded: PlainDescriptor<undefined>

      /**
       *The para is already leased out for part of this range.
       */
      AlreadyLeasedOut: PlainDescriptor<undefined>
    },
    {
      /**
       * The number of blocks over which an auction may be retroactively ended.
       */
      EndingPeriod: PlainDescriptor<number>

      /**
       * The length of each sample to take during the ending period.
       *
       * `EndingPeriod` / `SampleLength` = Total # of Samples
       */
      SampleLength: PlainDescriptor<number>

      /**

 */
      SlotRangeCount: PlainDescriptor<number>

      /**

 */
      LeasePeriodsPerSlot: PlainDescriptor<number>
    },
  ]
  Crowdloan: [
    {
      /**
       * Info on all of the funds.
       */
      Funds: StorageDescriptor<
        [Key: number],
        {
          depositor: SS58String
          verifier: Anonymize<I8t18p6mokc3s4>
          deposit: bigint
          raised: bigint
          end: number
          cap: bigint
          last_contribution: CommonCrowdloanLastContribution
          first_period: number
          last_period: number
          fund_index: number
        },
        true
      >

      /**
       * The funds that have had additional contributions during the last block. This is used
       * in order to determine which funds should submit new or updated bids.
       */
      NewRaise: StorageDescriptor<[], Array<number>, false>

      /**
       * The number of auctions that have entered into their ending period so far.
       */
      EndingsCount: StorageDescriptor<[], number, false>

      /**
       * Tracker for the next available fund index
       */
      NextFundIndex: StorageDescriptor<[], number, false>
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        index: number
        cap: bigint
        first_period: number
        last_period: number
        end: number
        verifier: Anonymize<I8t18p6mokc3s4>
      }>

      /**
       *See [`Pallet::contribute`].
       */
      contribute: TxDescriptor<{
        index: number
        value: bigint
        signature: Anonymize<I7us28h09nc5sv>
      }>

      /**
       *See [`Pallet::withdraw`].
       */
      withdraw: TxDescriptor<{ who: SS58String; index: number }>

      /**
       *See [`Pallet::refund`].
       */
      refund: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::dissolve`].
       */
      dissolve: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::edit`].
       */
      edit: TxDescriptor<{
        index: number
        cap: bigint
        first_period: number
        last_period: number
        end: number
        verifier: Anonymize<I8t18p6mokc3s4>
      }>

      /**
       *See [`Pallet::add_memo`].
       */
      add_memo: TxDescriptor<{ index: number; memo: Binary }>

      /**
       *See [`Pallet::poke`].
       */
      poke: TxDescriptor<{ index: number }>

      /**
       *See [`Pallet::contribute_all`].
       */
      contribute_all: TxDescriptor<{
        index: number
        signature: Anonymize<I7us28h09nc5sv>
      }>
    },
    {
      /**
       *Create a new crowdloaning campaign.
       */
      Created: PlainDescriptor<{ para_id: number }>

      /**
       *Contributed to a crowd sale.
       */
      Contributed: PlainDescriptor<{
        who: SS58String
        fund_index: number
        amount: bigint
      }>

      /**
       *Withdrew full balance of a contributor.
       */
      Withdrew: PlainDescriptor<{
        who: SS58String
        fund_index: number
        amount: bigint
      }>

      /**
       *The loans in a fund have been partially dissolved, i.e. there are some left
       *over child keys that still need to be killed.
       */
      PartiallyRefunded: PlainDescriptor<{ para_id: number }>

      /**
       *All loans in a fund have been refunded.
       */
      AllRefunded: PlainDescriptor<{ para_id: number }>

      /**
       *Fund is dissolved.
       */
      Dissolved: PlainDescriptor<{ para_id: number }>

      /**
       *The result of trying to submit a new bid to the Slots pallet.
       */
      HandleBidResult: PlainDescriptor<{
        para_id: number
        result: Anonymize<Idtdr91jmq5g4i>
      }>

      /**
       *The configuration to a crowdloan has been edited.
       */
      Edited: PlainDescriptor<{ para_id: number }>

      /**
       *A memo has been updated.
       */
      MemoUpdated: PlainDescriptor<{
        who: SS58String
        para_id: number
        memo: Binary
      }>

      /**
       *A parachain has been moved to `NewRaise`
       */
      AddedToNewRaise: PlainDescriptor<{ para_id: number }>
    },
    {
      /**
       *The current lease period is more than the first lease period.
       */
      FirstPeriodInPast: PlainDescriptor<undefined>

      /**
       *The first lease period needs to at least be less than 3 `max_value`.
       */
      FirstPeriodTooFarInFuture: PlainDescriptor<undefined>

      /**
       *Last lease period must be greater than first lease period.
       */
      LastPeriodBeforeFirstPeriod: PlainDescriptor<undefined>

      /**
       *The last lease period cannot be more than 3 periods after the first period.
       */
      LastPeriodTooFarInFuture: PlainDescriptor<undefined>

      /**
       *The campaign ends before the current block number. The end must be in the future.
       */
      CannotEndInPast: PlainDescriptor<undefined>

      /**
       *The end date for this crowdloan is not sensible.
       */
      EndTooFarInFuture: PlainDescriptor<undefined>

      /**
       *There was an overflow.
       */
      Overflow: PlainDescriptor<undefined>

      /**
       *The contribution was below the minimum, `MinContribution`.
       */
      ContributionTooSmall: PlainDescriptor<undefined>

      /**
       *Invalid fund index.
       */
      InvalidParaId: PlainDescriptor<undefined>

      /**
       *Contributions exceed maximum amount.
       */
      CapExceeded: PlainDescriptor<undefined>

      /**
       *The contribution period has already ended.
       */
      ContributionPeriodOver: PlainDescriptor<undefined>

      /**
       *The origin of this call is invalid.
       */
      InvalidOrigin: PlainDescriptor<undefined>

      /**
       *This crowdloan does not correspond to a parachain.
       */
      NotParachain: PlainDescriptor<undefined>

      /**
       *This parachain lease is still active and retirement cannot yet begin.
       */
      LeaseActive: PlainDescriptor<undefined>

      /**
       *This parachain's bid or lease is still active and withdraw cannot yet begin.
       */
      BidOrLeaseActive: PlainDescriptor<undefined>

      /**
       *The crowdloan has not yet ended.
       */
      FundNotEnded: PlainDescriptor<undefined>

      /**
       *There are no contributions stored in this crowdloan.
       */
      NoContributions: PlainDescriptor<undefined>

      /**
       *The crowdloan is not ready to dissolve. Potentially still has a slot or in retirement
       *period.
       */
      NotReadyToDissolve: PlainDescriptor<undefined>

      /**
       *Invalid signature.
       */
      InvalidSignature: PlainDescriptor<undefined>

      /**
       *The provided memo is too large.
       */
      MemoTooLarge: PlainDescriptor<undefined>

      /**
       *The fund is already in `NewRaise`
       */
      AlreadyInNewRaise: PlainDescriptor<undefined>

      /**
       *No contributions allowed during the VRF delay
       */
      VrfDelayInProgress: PlainDescriptor<undefined>

      /**
       *A lease period has not started yet, due to an offset in the starting block.
       */
      NoLeasePeriod: PlainDescriptor<undefined>
    },
    {
      /**
       * `PalletId` for the crowdloan pallet. An appropriate value could be
       * `PalletId(*b"py/cfund")`
       */
      PalletId: PlainDescriptor<Binary>

      /**
       * The minimum amount that may be contributed into a crowdloan. Should almost certainly be
       * at least `ExistentialDeposit`.
       */
      MinContribution: PlainDescriptor<bigint>

      /**
       * Max number of storage keys to remove per extrinsic call.
       */
      RemoveKeysLimit: PlainDescriptor<number>
    },
  ]
  XcmPallet: [
    {
      /**
       * The latest available query index.
       */
      QueryCounter: StorageDescriptor<[], bigint, false>

      /**
       * The ongoing queries.
       */
      Queries: StorageDescriptor<[Key: bigint], XcmPalletQueryStatus, true>

      /**
       * The existing asset traps.
       *
       * Key is the blake2 256 hash of (origin, versioned `MultiAssets`) pair. Value is the number of
       * times this pair has been trapped (usually just 1 if it exists at all).
       */
      AssetTraps: StorageDescriptor<[Key: Binary], number, false>

      /**
       * Default version to encode XCM when latest version of destination is unknown. If `None`,
       * then the destinations whose XCM version is unknown are considered unreachable.
       */
      SafeXcmVersion: StorageDescriptor<[], number, true>

      /**
       * The Latest versions that we know various locations support.
       */
      SupportedVersion: StorageDescriptor<
        [number, XcmVersionedMultiLocation],
        number,
        true
      >

      /**
       * All locations that we have requested version notifications from.
       */
      VersionNotifiers: StorageDescriptor<
        [number, XcmVersionedMultiLocation],
        bigint,
        true
      >

      /**
       * The target locations that are subscribed to our version changes, as well as the most recent
       * of our versions we informed them of.
       */
      VersionNotifyTargets: StorageDescriptor<
        [number, XcmVersionedMultiLocation],
        [bigint, Anonymize<I4q39t5hn830vp>, number],
        true
      >

      /**
       * Destinations whose latest XCM version we would like to know. Duplicates not allowed, and
       * the `u32` counter is the number of times that a send to the destination has been attempted,
       * which is used as a prioritization.
       */
      VersionDiscoveryQueue: StorageDescriptor<
        [],
        Array<Anonymize<I2tguvlrf6n4ik>>,
        false
      >

      /**
       * The current migration's stage, if any.
       */
      CurrentMigration: StorageDescriptor<
        [],
        XcmPalletVersionMigrationStage,
        true
      >

      /**
       * Fungible assets which we know are locked on a remote chain.
       */
      RemoteLockedFungibles: StorageDescriptor<
        [number, SS58String, XcmVersionedAssetId],
        {
          amount: bigint
          owner: XcmVersionedMultiLocation
          locker: XcmVersionedMultiLocation
          consumers: Anonymize<I48jka0f0ufl6q>
        },
        true
      >

      /**
       * Fungible assets which we know are locked on this chain.
       */
      LockedFungibles: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<Ifk51k72g143a3>>,
        true
      >

      /**
       * Global suspension state of the XCM executor.
       */
      XcmExecutionSuspended: StorageDescriptor<[], boolean, false>
    },
    {
      /**
       *See [`Pallet::send`].
       */
      send: TxDescriptor<{
        dest: XcmVersionedMultiLocation
        message: XcmVersionedXcm
      }>

      /**
       *See [`Pallet::teleport_assets`].
       */
      teleport_assets: TxDescriptor<{
        dest: XcmVersionedMultiLocation
        beneficiary: XcmVersionedMultiLocation
        assets: XcmVersionedMultiAssets
        fee_asset_item: number
      }>

      /**
       *See [`Pallet::reserve_transfer_assets`].
       */
      reserve_transfer_assets: TxDescriptor<{
        dest: XcmVersionedMultiLocation
        beneficiary: XcmVersionedMultiLocation
        assets: XcmVersionedMultiAssets
        fee_asset_item: number
      }>

      /**
       *See [`Pallet::execute`].
       */
      execute: TxDescriptor<{
        message: XcmVersionedXcm1
        max_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::force_xcm_version`].
       */
      force_xcm_version: TxDescriptor<{
        location: Anonymize<I43cmiele6sevi>
        version: number
      }>

      /**
       *See [`Pallet::force_default_xcm_version`].
       */
      force_default_xcm_version: TxDescriptor<{
        maybe_xcm_version: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::force_subscribe_version_notify`].
       */
      force_subscribe_version_notify: TxDescriptor<{
        location: XcmVersionedMultiLocation
      }>

      /**
       *See [`Pallet::force_unsubscribe_version_notify`].
       */
      force_unsubscribe_version_notify: TxDescriptor<{
        location: XcmVersionedMultiLocation
      }>

      /**
       *See [`Pallet::limited_reserve_transfer_assets`].
       */
      limited_reserve_transfer_assets: TxDescriptor<{
        dest: XcmVersionedMultiLocation
        beneficiary: XcmVersionedMultiLocation
        assets: XcmVersionedMultiAssets
        fee_asset_item: number
        weight_limit: XcmV3WeightLimit
      }>

      /**
       *See [`Pallet::limited_teleport_assets`].
       */
      limited_teleport_assets: TxDescriptor<{
        dest: XcmVersionedMultiLocation
        beneficiary: XcmVersionedMultiLocation
        assets: XcmVersionedMultiAssets
        fee_asset_item: number
        weight_limit: XcmV3WeightLimit
      }>

      /**
       *See [`Pallet::force_suspension`].
       */
      force_suspension: TxDescriptor<{ suspended: boolean }>
    },
    {
      /**
       *Execution of an XCM message was attempted.
       */
      Attempted: PlainDescriptor<{ outcome: XcmV3TraitsOutcome }>

      /**
       *A XCM message was sent.
       */
      Sent: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        destination: Anonymize<I43cmiele6sevi>
        message: Anonymize<I8l0577387vghn>
        message_id: Binary
      }>

      /**
       *Query response received which does not match a registered query. This may be because a
       *matching query was never registered, it may be because it is a duplicate response, or
       *because the query timed out.
       */
      UnexpectedResponse: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        query_id: bigint
      }>

      /**
       *Query response has been received and is ready for taking with `take_response`. There is
       *no registered notification call.
       */
      ResponseReady: PlainDescriptor<{
        query_id: bigint
        response: XcmV3Response
      }>

      /**
       *Query response has been received and query is removed. The registered notification has
       *been dispatched and executed successfully.
       */
      Notified: PlainDescriptor<{
        query_id: bigint
        pallet_index: number
        call_index: number
      }>

      /**
       *Query response has been received and query is removed. The registered notification
       *could not be dispatched because the dispatch weight is greater than the maximum weight
       *originally budgeted by this runtime for the query result.
       */
      NotifyOverweight: PlainDescriptor<{
        query_id: bigint
        pallet_index: number
        call_index: number
        actual_weight: Anonymize<I4q39t5hn830vp>
        max_budgeted_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *Query response has been received and query is removed. There was a general error with
       *dispatching the notification call.
       */
      NotifyDispatchError: PlainDescriptor<{
        query_id: bigint
        pallet_index: number
        call_index: number
      }>

      /**
       *Query response has been received and query is removed. The dispatch was unable to be
       *decoded into a `Call`; this might be due to dispatch function having a signature which
       *is not `(origin, QueryId, Response)`.
       */
      NotifyDecodeFailed: PlainDescriptor<{
        query_id: bigint
        pallet_index: number
        call_index: number
      }>

      /**
       *Expected query response has been received but the origin location of the response does
       *not match that expected. The query remains registered for a later, valid, response to
       *be received and acted upon.
       */
      InvalidResponder: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        query_id: bigint
        expected_location: Anonymize<I74hapqfd00s9i>
      }>

      /**
       *Expected query response has been received but the expected origin location placed in
       *storage by this runtime previously cannot be decoded. The query remains registered.
       *
       *This is unexpected (since a location placed in storage in a previously executing
       *runtime should be readable prior to query timeout) and dangerous since the possibly
       *valid response will be dropped. Manual governance intervention is probably going to be
       *needed.
       */
      InvalidResponderVersion: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        query_id: bigint
      }>

      /**
       *Received query response has been read and removed.
       */
      ResponseTaken: PlainDescriptor<{ query_id: bigint }>

      /**
       *Some assets have been placed in an asset trap.
       */
      AssetsTrapped: PlainDescriptor<{
        hash: Binary
        origin: Anonymize<I43cmiele6sevi>
        assets: XcmVersionedMultiAssets
      }>

      /**
       *An XCM version change notification message has been attempted to be sent.
       *
       *The cost of sending it (borne by the chain) is included.
       */
      VersionChangeNotified: PlainDescriptor<{
        destination: Anonymize<I43cmiele6sevi>
        result: number
        cost: Anonymize<Id7mn3j3ge1h6a>
        message_id: Binary
      }>

      /**
       *The supported version of a location has been changed. This might be through an
       *automatic notification or a manual intervention.
       */
      SupportedVersionChanged: PlainDescriptor<{
        location: Anonymize<I43cmiele6sevi>
        version: number
      }>

      /**
       *A given location which had a version change subscription was dropped owing to an error
       *sending the notification to it.
       */
      NotifyTargetSendFail: PlainDescriptor<{
        location: Anonymize<I43cmiele6sevi>
        query_id: bigint
        error: XcmV3TraitsError
      }>

      /**
       *A given location which had a version change subscription was dropped owing to an error
       *migrating the location to our new XCM format.
       */
      NotifyTargetMigrationFail: PlainDescriptor<{
        location: XcmVersionedMultiLocation
        query_id: bigint
      }>

      /**
       *Expected query response has been received but the expected querier location placed in
       *storage by this runtime previously cannot be decoded. The query remains registered.
       *
       *This is unexpected (since a location placed in storage in a previously executing
       *runtime should be readable prior to query timeout) and dangerous since the possibly
       *valid response will be dropped. Manual governance intervention is probably going to be
       *needed.
       */
      InvalidQuerierVersion: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        query_id: bigint
      }>

      /**
       *Expected query response has been received but the querier location of the response does
       *not match the expected. The query remains registered for a later, valid, response to
       *be received and acted upon.
       */
      InvalidQuerier: PlainDescriptor<{
        origin: Anonymize<I43cmiele6sevi>
        query_id: bigint
        expected_querier: Anonymize<I43cmiele6sevi>
        maybe_actual_querier: Anonymize<I74hapqfd00s9i>
      }>

      /**
       *A remote has requested XCM version change notification from us and we have honored it.
       *A version information message is sent to them and its cost is included.
       */
      VersionNotifyStarted: PlainDescriptor<{
        destination: Anonymize<I43cmiele6sevi>
        cost: Anonymize<Id7mn3j3ge1h6a>
        message_id: Binary
      }>

      /**
       *We have requested that a remote chain send us XCM version change notifications.
       */
      VersionNotifyRequested: PlainDescriptor<{
        destination: Anonymize<I43cmiele6sevi>
        cost: Anonymize<Id7mn3j3ge1h6a>
        message_id: Binary
      }>

      /**
       *We have requested that a remote chain stops sending us XCM version change
       *notifications.
       */
      VersionNotifyUnrequested: PlainDescriptor<{
        destination: Anonymize<I43cmiele6sevi>
        cost: Anonymize<Id7mn3j3ge1h6a>
        message_id: Binary
      }>

      /**
       *Fees were paid from a location for an operation (often for using `SendXcm`).
       */
      FeesPaid: PlainDescriptor<{
        paying: Anonymize<I43cmiele6sevi>
        fees: Anonymize<Id7mn3j3ge1h6a>
      }>

      /**
       *Some assets have been claimed from an asset trap
       */
      AssetsClaimed: PlainDescriptor<{
        hash: Binary
        origin: Anonymize<I43cmiele6sevi>
        assets: XcmVersionedMultiAssets
      }>
    },
    {
      /**
       *The desired destination was unreachable, generally because there is a no way of routing
       *to it.
       */
      Unreachable: PlainDescriptor<undefined>

      /**
       *There was some other issue (i.e. not to do with routing) in sending the message.
       *Perhaps a lack of space for buffering the message.
       */
      SendFailure: PlainDescriptor<undefined>

      /**
       *The message execution fails the filter.
       */
      Filtered: PlainDescriptor<undefined>

      /**
       *The message's weight could not be determined.
       */
      UnweighableMessage: PlainDescriptor<undefined>

      /**
       *The destination `MultiLocation` provided cannot be inverted.
       */
      DestinationNotInvertible: PlainDescriptor<undefined>

      /**
       *The assets to be sent are empty.
       */
      Empty: PlainDescriptor<undefined>

      /**
       *Could not re-anchor the assets to declare the fees for the destination chain.
       */
      CannotReanchor: PlainDescriptor<undefined>

      /**
       *Too many assets have been attempted for transfer.
       */
      TooManyAssets: PlainDescriptor<undefined>

      /**
       *Origin is invalid for sending.
       */
      InvalidOrigin: PlainDescriptor<undefined>

      /**
       *The version of the `Versioned` value used is not able to be interpreted.
       */
      BadVersion: PlainDescriptor<undefined>

      /**
       *The given location could not be used (e.g. because it cannot be expressed in the
       *desired version of XCM).
       */
      BadLocation: PlainDescriptor<undefined>

      /**
       *The referenced subscription could not be found.
       */
      NoSubscription: PlainDescriptor<undefined>

      /**
       *The location is invalid since it already has a subscription from us.
       */
      AlreadySubscribed: PlainDescriptor<undefined>

      /**
       *Invalid asset for the operation.
       */
      InvalidAsset: PlainDescriptor<undefined>

      /**
       *The owner does not own (all) of the asset that they wish to do the operation on.
       */
      LowBalance: PlainDescriptor<undefined>

      /**
       *The asset owner has too many locks on the asset.
       */
      TooManyLocks: PlainDescriptor<undefined>

      /**
       *The given account is not an identifiable sovereign account for any location.
       */
      AccountNotSovereign: PlainDescriptor<undefined>

      /**
       *The operation required fees to be paid which the initiator could not meet.
       */
      FeesNotMet: PlainDescriptor<undefined>

      /**
       *A remote lock with the corresponding data could not be found.
       */
      LockNotFound: PlainDescriptor<undefined>

      /**
       *The unlock operation cannot succeed because there are still consumers of the lock.
       */
      InUse: PlainDescriptor<undefined>
    },
    {},
  ]
  MessageQueue: [
    {
      /**
       * The index of the first and last (non-empty) pages.
       */
      BookStateFor: StorageDescriptor<
        [Key: ParachainsInclusionAggregateMessageOrigin],
        {
          begin: number
          end: number
          count: number
          ready_neighbours: Anonymize<Iav3cdf9g9n9fp>
          message_count: bigint
          size: bigint
        },
        false
      >

      /**
       * The origin at which we should begin servicing.
       */
      ServiceHead: StorageDescriptor<
        [],
        ParachainsInclusionAggregateMessageOrigin,
        true
      >

      /**
       * The map of page indices to pages.
       */
      Pages: StorageDescriptor<
        [ParachainsInclusionAggregateMessageOrigin, number],
        {
          remaining: number
          remaining_size: number
          first_index: number
          first: number
          last: number
          heap: Binary
        },
        true
      >
    },
    {
      /**
       *See [`Pallet::reap_page`].
       */
      reap_page: TxDescriptor<{
        message_origin: ParachainsInclusionAggregateMessageOrigin
        page_index: number
      }>

      /**
       *See [`Pallet::execute_overweight`].
       */
      execute_overweight: TxDescriptor<{
        message_origin: ParachainsInclusionAggregateMessageOrigin
        page: number
        index: number
        weight_limit: Anonymize<I4q39t5hn830vp>
      }>
    },
    {
      /**
       *Message discarded due to an error in the `MessageProcessor` (usually a format error).
       */
      ProcessingFailed: PlainDescriptor<{
        id: Binary
        origin: ParachainsInclusionAggregateMessageOrigin
        error: ProcessMessageError
      }>

      /**
       *Message is processed.
       */
      Processed: PlainDescriptor<{
        id: Binary
        origin: ParachainsInclusionAggregateMessageOrigin
        weight_used: Anonymize<I4q39t5hn830vp>
        success: boolean
      }>

      /**
       *Message placed in overweight queue.
       */
      OverweightEnqueued: PlainDescriptor<{
        id: Binary
        origin: ParachainsInclusionAggregateMessageOrigin
        page_index: number
        message_index: number
      }>

      /**
       *This page was reaped.
       */
      PageReaped: PlainDescriptor<{
        origin: ParachainsInclusionAggregateMessageOrigin
        index: number
      }>
    },
    {
      /**
       *Page is not reapable because it has items remaining to be processed and is not old
       *enough.
       */
      NotReapable: PlainDescriptor<undefined>

      /**
       *Page to be reaped does not exist.
       */
      NoPage: PlainDescriptor<undefined>

      /**
       *The referenced message could not be found.
       */
      NoMessage: PlainDescriptor<undefined>

      /**
       *The message was already processed and cannot be processed again.
       */
      AlreadyProcessed: PlainDescriptor<undefined>

      /**
       *The message is queued for future execution.
       */
      Queued: PlainDescriptor<undefined>

      /**
       *There is temporarily not enough weight to continue servicing messages.
       */
      InsufficientWeight: PlainDescriptor<undefined>

      /**
       *This message is temporarily unprocessable.
       *
       *Such errors are expected, but not guaranteed, to resolve themselves eventually through
       *retrying.
       */
      TemporarilyUnprocessable: PlainDescriptor<undefined>

      /**
       *The queue is paused and no message can be executed from it.
       *
       *This can change at any time and may resolve in the future by re-trying.
       */
      QueuePaused: PlainDescriptor<undefined>
    },
    {
      /**
       * The size of the page; this implies the maximum message size which can be sent.
       *
       * A good value depends on the expected message sizes, their weights, the weight that is
       * available for processing them and the maximal needed message size. The maximal message
       * size is slightly lower than this as defined by [`MaxMessageLenOf`].
       */
      HeapSize: PlainDescriptor<number>

      /**
       * The maximum number of stale pages (i.e. of overweight messages) allowed before culling
       * can happen. Once there are more stale pages than this, then historical pages may be
       * dropped, even if they contain unprocessed overweight messages.
       */
      MaxStale: PlainDescriptor<number>

      /**
       * The amount of weight (if any) which should be provided to the message queue for
       * servicing enqueued items.
       *
       * This may be legitimately `None` in the case that you will call
       * `ServiceQueues::service_queues` manually.
       */
      ServiceWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp> | undefined>
    },
  ]
  AssetRate: [
    {
      /**
       * Maps an asset to its fixed point representation in the native balance.
       *
       * E.g. `native_amount = asset_amount * ConversionRateToNative::<T>::get(asset_kind)`
       */
      ConversionRateToNative: StorageDescriptor<
        [Key: Anonymize<AnonymousEnum<{ V3: Anonymize<I30in122a9nnlb> }>>],
        bigint,
        true
      >
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
        rate: bigint
      }>

      /**
       *See [`Pallet::update`].
       */
      update: TxDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
        rate: bigint
      }>

      /**
       *See [`Pallet::remove`].
       */
      remove: TxDescriptor<{ asset_kind: Anonymize<I32r9skkupsthv> }>
    },
    {
      /**

 */
      AssetRateCreated: PlainDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
        rate: bigint
      }>

      /**

 */
      AssetRateRemoved: PlainDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
      }>

      /**

 */
      AssetRateUpdated: PlainDescriptor<{
        asset_kind: Anonymize<I32r9skkupsthv>
        old: bigint
        new: bigint
      }>
    },
    {
      /**
       *The given asset ID is unknown.
       */
      UnknownAssetKind: PlainDescriptor<undefined>

      /**
       *The given asset ID already has an assigned conversion rate and cannot be re-created.
       */
      AlreadyExists: PlainDescriptor<undefined>
    },
    {},
  ]
  Beefy: [
    {
      /**
       * The current authorities set
       */
      Authorities: StorageDescriptor<[], Array<Binary>, false>

      /**
       * The current validator set id
       */
      ValidatorSetId: StorageDescriptor<[], bigint, false>

      /**
       * Authorities set scheduled to be used with the next session
       */
      NextAuthorities: StorageDescriptor<[], Array<Binary>, false>

      /**
       * A mapping from BEEFY set ID to the index of the *most recent* session for which its
       * members were responsible.
       *
       * This is only used for validating equivocation proofs. An equivocation proof must
       * contains a key-ownership proof for a given session, therefore we need a way to tie
       * together sessions and BEEFY set ids, i.e. we need to validate that a validator
       * was the owner of a given key on a given session, and what the active set ID was
       * during that session.
       *
       * TWOX-NOTE: `ValidatorSetId` is not under user control.
       */
      SetIdSession: StorageDescriptor<[Key: bigint], number, true>

      /**
       * Block number where BEEFY consensus is enabled/started.
       * By changing this (through privileged `set_new_genesis()`), BEEFY consensus is effectively
       * restarted from the newly set block number.
       */
      GenesisBlock: StorageDescriptor<[], number | undefined, false>
    },
    {
      /**
       *See [`Pallet::report_equivocation`].
       */
      report_equivocation: TxDescriptor<{
        equivocation_proof: Anonymize<I6lgkrki6lhal>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::report_equivocation_unsigned`].
       */
      report_equivocation_unsigned: TxDescriptor<{
        equivocation_proof: Anonymize<I6lgkrki6lhal>
        key_owner_proof: Anonymize<I3ia7aufsoj0l1>
      }>

      /**
       *See [`Pallet::set_new_genesis`].
       */
      set_new_genesis: TxDescriptor<{ delay_in_blocks: number }>
    },
    {},
    {
      /**
       *A key ownership proof provided as part of an equivocation report is invalid.
       */
      InvalidKeyOwnershipProof: PlainDescriptor<undefined>

      /**
       *An equivocation proof provided as part of an equivocation report is invalid.
       */
      InvalidEquivocationProof: PlainDescriptor<undefined>

      /**
       *A given equivocation report is valid but already previously reported.
       */
      DuplicateOffenceReport: PlainDescriptor<undefined>

      /**
       *Submitted configuration is invalid.
       */
      InvalidConfiguration: PlainDescriptor<undefined>
    },
    {
      /**
       * The maximum number of authorities that can be added.
       */
      MaxAuthorities: PlainDescriptor<number>

      /**
       * The maximum number of nominators for each validator.
       */
      MaxNominators: PlainDescriptor<number>

      /**
       * The maximum number of entries to keep in the set id to session index mapping.
       *
       * Since the `SetIdSession` map is only used for validating equivocations this
       * value should relate to the bonding duration of whatever staking system is
       * being used (if any). If equivocation handling is not enabled then this value
       * can be zero.
       */
      MaxSetIdSessionEntries: PlainDescriptor<bigint>
    },
  ]
  Mmr: [
    {
      /**
       * Latest MMR Root hash.
       */
      RootHash: StorageDescriptor<[], Binary, false>

      /**
       * Current size of the MMR (number of leaves).
       */
      NumberOfLeaves: StorageDescriptor<[], bigint, false>

      /**
       * Hashes of the nodes in the MMR.
       *
       * Note this collection only contains MMR peaks, the inner nodes (and leaves)
       * are pruned and only stored in the Offchain DB.
       */
      Nodes: StorageDescriptor<[Key: bigint], Binary, true>
    },
    {},
    {},
    {},
    {},
  ]
  BeefyMmrLeaf: [
    {
      /**
       * Details of current BEEFY authority set.
       */
      BeefyAuthorities: StorageDescriptor<
        [],
        { id: bigint; len: number; keyset_commitment: Binary },
        false
      >

      /**
       * Details of next BEEFY authority set.
       *
       * This storage entry is used as cache for calls to `update_beefy_next_authority_set`.
       */
      BeefyNextAuthorities: StorageDescriptor<
        [],
        { id: bigint; len: number; keyset_commitment: Binary },
        false
      >
    },
    {},
    {},
    {},
    {},
  ]
}
export const pallets: IPallets = {
  System: [
    {
      Account: stg_System_Account,
      ExtrinsicCount: stg_System_ExtrinsicCount,
      BlockWeight: stg_System_BlockWeight,
      AllExtrinsicsLen: stg_System_AllExtrinsicsLen,
      BlockHash: stg_System_BlockHash,
      ExtrinsicData: stg_System_ExtrinsicData,
      Number: stg_System_Number,
      ParentHash: stg_System_ParentHash,
      Digest: stg_System_Digest,
      Events: stg_System_Events,
      EventCount: stg_System_EventCount,
      EventTopics: stg_System_EventTopics,
      LastRuntimeUpgrade: stg_System_LastRuntimeUpgrade,
      UpgradedToU32RefCount: stg_System_UpgradedToU32RefCount,
      UpgradedToTripleRefCount: stg_System_UpgradedToTripleRefCount,
      ExecutionPhase: stg_System_ExecutionPhase,
    },
    {
      remark: call_System_remark,
      set_heap_pages: call_System_set_heap_pages,
      set_code: call_System_set_code,
      set_code_without_checks: call_System_set_code_without_checks,
      set_storage: call_System_set_storage,
      kill_storage: call_System_kill_storage,
      kill_prefix: call_System_kill_prefix,
      remark_with_event: call_System_remark_with_event,
    },
    {
      ExtrinsicSuccess: evt_System_ExtrinsicSuccess,
      ExtrinsicFailed: evt_System_ExtrinsicFailed,
      CodeUpdated: evt_System_CodeUpdated,
      NewAccount: evt_System_NewAccount,
      KilledAccount: evt_System_KilledAccount,
      Remarked: evt_System_Remarked,
    },
    {
      InvalidSpecName: err_System_InvalidSpecName,
      SpecVersionNeedsToIncrease: err_System_SpecVersionNeedsToIncrease,
      FailedToExtractRuntimeVersion: err_System_FailedToExtractRuntimeVersion,
      NonDefaultComposite: err_System_NonDefaultComposite,
      NonZeroRefCount: err_System_NonZeroRefCount,
      CallFiltered: err_System_CallFiltered,
    },
    {
      BlockWeights: const_System_BlockWeights,
      BlockLength: const_System_BlockLength,
      BlockHashCount: const_System_BlockHashCount,
      DbWeight: const_System_DbWeight,
      Version: const_System_Version,
      SS58Prefix: const_System_SS58Prefix,
    },
  ],
  Scheduler: [
    {
      IncompleteSince: stg_Scheduler_IncompleteSince,
      Agenda: stg_Scheduler_Agenda,
      Lookup: stg_Scheduler_Lookup,
    },
    {
      schedule: call_Scheduler_schedule,
      cancel: call_Scheduler_cancel,
      schedule_named: call_Scheduler_schedule_named,
      cancel_named: call_Scheduler_cancel_named,
      schedule_after: call_Scheduler_schedule_after,
      schedule_named_after: call_Scheduler_schedule_named_after,
    },
    {
      Scheduled: evt_Scheduler_Scheduled,
      Canceled: evt_Scheduler_Canceled,
      Dispatched: evt_Scheduler_Dispatched,
      CallUnavailable: evt_Scheduler_CallUnavailable,
      PeriodicFailed: evt_Scheduler_PeriodicFailed,
      PermanentlyOverweight: evt_Scheduler_PermanentlyOverweight,
    },
    {
      FailedToSchedule: err_Scheduler_FailedToSchedule,
      NotFound: err_Scheduler_NotFound,
      TargetBlockNumberInPast: err_Scheduler_TargetBlockNumberInPast,
      RescheduleNoChange: err_Scheduler_RescheduleNoChange,
      Named: err_Scheduler_Named,
    },
    {
      MaximumWeight: const_Scheduler_MaximumWeight,
      MaxScheduledPerBlock: const_Scheduler_MaxScheduledPerBlock,
    },
  ],
  Preimage: [
    {
      StatusFor: stg_Preimage_StatusFor,
      RequestStatusFor: stg_Preimage_RequestStatusFor,
      PreimageFor: stg_Preimage_PreimageFor,
    },
    {
      note_preimage: call_Preimage_note_preimage,
      unnote_preimage: call_Preimage_unnote_preimage,
      request_preimage: call_Preimage_request_preimage,
      unrequest_preimage: call_Preimage_unrequest_preimage,
      ensure_updated: call_Preimage_ensure_updated,
    },
    {
      Noted: evt_Preimage_Noted,
      Requested: evt_Preimage_Requested,
      Cleared: evt_Preimage_Cleared,
    },
    {
      TooBig: err_Preimage_TooBig,
      AlreadyNoted: err_Preimage_AlreadyNoted,
      NotAuthorized: err_Preimage_NotAuthorized,
      NotNoted: err_Preimage_NotNoted,
      Requested: err_Preimage_Requested,
      NotRequested: err_Preimage_NotRequested,
      TooMany: err_Preimage_TooMany,
      TooFew: err_Preimage_TooFew,
    },
    {},
  ],
  Babe: [
    {
      EpochIndex: stg_Babe_EpochIndex,
      Authorities: stg_Babe_Authorities,
      GenesisSlot: stg_Babe_GenesisSlot,
      CurrentSlot: stg_Babe_CurrentSlot,
      Randomness: stg_Babe_Randomness,
      PendingEpochConfigChange: stg_Babe_PendingEpochConfigChange,
      NextRandomness: stg_Babe_NextRandomness,
      NextAuthorities: stg_Babe_NextAuthorities,
      SegmentIndex: stg_Babe_SegmentIndex,
      UnderConstruction: stg_Babe_UnderConstruction,
      Initialized: stg_Babe_Initialized,
      AuthorVrfRandomness: stg_Babe_AuthorVrfRandomness,
      EpochStart: stg_Babe_EpochStart,
      Lateness: stg_Babe_Lateness,
      EpochConfig: stg_Babe_EpochConfig,
      NextEpochConfig: stg_Babe_NextEpochConfig,
      SkippedEpochs: stg_Babe_SkippedEpochs,
    },
    {
      report_equivocation: call_Babe_report_equivocation,
      report_equivocation_unsigned: call_Babe_report_equivocation_unsigned,
      plan_config_change: call_Babe_plan_config_change,
    },
    {},
    {
      InvalidEquivocationProof: err_Babe_InvalidEquivocationProof,
      InvalidKeyOwnershipProof: err_Babe_InvalidKeyOwnershipProof,
      DuplicateOffenceReport: err_Babe_DuplicateOffenceReport,
      InvalidConfiguration: err_Babe_InvalidConfiguration,
    },
    {
      EpochDuration: const_Babe_EpochDuration,
      ExpectedBlockTime: const_Babe_ExpectedBlockTime,
      MaxAuthorities: const_Babe_MaxAuthorities,
      MaxNominators: const_Babe_MaxNominators,
    },
  ],
  Timestamp: [
    { Now: stg_Timestamp_Now, DidUpdate: stg_Timestamp_DidUpdate },
    { set: call_Timestamp_set },
    {},
    {},
    { MinimumPeriod: const_Timestamp_MinimumPeriod },
  ],
  Indices: [
    { Accounts: stg_Indices_Accounts },
    {
      claim: call_Indices_claim,
      transfer: call_Indices_transfer,
      free: call_Indices_free,
      force_transfer: call_Indices_force_transfer,
      freeze: call_Indices_freeze,
    },
    {
      IndexAssigned: evt_Indices_IndexAssigned,
      IndexFreed: evt_Indices_IndexFreed,
      IndexFrozen: evt_Indices_IndexFrozen,
    },
    {
      NotAssigned: err_Indices_NotAssigned,
      NotOwner: err_Indices_NotOwner,
      InUse: err_Indices_InUse,
      NotTransfer: err_Indices_NotTransfer,
      Permanent: err_Indices_Permanent,
    },
    { Deposit: const_Indices_Deposit },
  ],
  Balances: [
    {
      TotalIssuance: stg_Balances_TotalIssuance,
      InactiveIssuance: stg_Balances_InactiveIssuance,
      Account: stg_Balances_Account,
      Locks: stg_Balances_Locks,
      Reserves: stg_Balances_Reserves,
      Holds: stg_Balances_Holds,
      Freezes: stg_Balances_Freezes,
    },
    {
      transfer_allow_death: call_Balances_transfer_allow_death,
      force_transfer: call_Balances_force_transfer,
      transfer_keep_alive: call_Balances_transfer_keep_alive,
      transfer_all: call_Balances_transfer_all,
      force_unreserve: call_Balances_force_unreserve,
      upgrade_accounts: call_Balances_upgrade_accounts,
      force_set_balance: call_Balances_force_set_balance,
    },
    {
      Endowed: evt_Balances_Endowed,
      DustLost: evt_Balances_DustLost,
      Transfer: evt_Balances_Transfer,
      BalanceSet: evt_Balances_BalanceSet,
      Reserved: evt_Balances_Reserved,
      Unreserved: evt_Balances_Unreserved,
      ReserveRepatriated: evt_Balances_ReserveRepatriated,
      Deposit: evt_Balances_Deposit,
      Withdraw: evt_Balances_Withdraw,
      Slashed: evt_Balances_Slashed,
      Minted: evt_Balances_Minted,
      Burned: evt_Balances_Burned,
      Suspended: evt_Balances_Suspended,
      Restored: evt_Balances_Restored,
      Upgraded: evt_Balances_Upgraded,
      Issued: evt_Balances_Issued,
      Rescinded: evt_Balances_Rescinded,
      Locked: evt_Balances_Locked,
      Unlocked: evt_Balances_Unlocked,
      Frozen: evt_Balances_Frozen,
      Thawed: evt_Balances_Thawed,
    },
    {
      VestingBalance: err_Balances_VestingBalance,
      LiquidityRestrictions: err_Balances_LiquidityRestrictions,
      InsufficientBalance: err_Balances_InsufficientBalance,
      ExistentialDeposit: err_Balances_ExistentialDeposit,
      Expendability: err_Balances_Expendability,
      ExistingVestingSchedule: err_Balances_ExistingVestingSchedule,
      DeadAccount: err_Balances_DeadAccount,
      TooManyReserves: err_Balances_TooManyReserves,
      TooManyHolds: err_Balances_TooManyHolds,
      TooManyFreezes: err_Balances_TooManyFreezes,
    },
    {
      ExistentialDeposit: const_Balances_ExistentialDeposit,
      MaxLocks: const_Balances_MaxLocks,
      MaxReserves: const_Balances_MaxReserves,
      MaxHolds: const_Balances_MaxHolds,
      MaxFreezes: const_Balances_MaxFreezes,
    },
  ],
  TransactionPayment: [
    {
      NextFeeMultiplier: stg_TransactionPayment_NextFeeMultiplier,
      StorageVersion: stg_TransactionPayment_StorageVersion,
    },
    {},
    { TransactionFeePaid: evt_TransactionPayment_TransactionFeePaid },
    {},
    {
      OperationalFeeMultiplier:
        const_TransactionPayment_OperationalFeeMultiplier,
    },
  ],
  Authorship: [{ Author: stg_Authorship_Author }, {}, {}, {}, {}],
  Staking: [
    {
      ValidatorCount: stg_Staking_ValidatorCount,
      MinimumValidatorCount: stg_Staking_MinimumValidatorCount,
      Invulnerables: stg_Staking_Invulnerables,
      Bonded: stg_Staking_Bonded,
      MinNominatorBond: stg_Staking_MinNominatorBond,
      MinValidatorBond: stg_Staking_MinValidatorBond,
      MinimumActiveStake: stg_Staking_MinimumActiveStake,
      MinCommission: stg_Staking_MinCommission,
      Ledger: stg_Staking_Ledger,
      Payee: stg_Staking_Payee,
      Validators: stg_Staking_Validators,
      CounterForValidators: stg_Staking_CounterForValidators,
      MaxValidatorsCount: stg_Staking_MaxValidatorsCount,
      Nominators: stg_Staking_Nominators,
      CounterForNominators: stg_Staking_CounterForNominators,
      MaxNominatorsCount: stg_Staking_MaxNominatorsCount,
      CurrentEra: stg_Staking_CurrentEra,
      ActiveEra: stg_Staking_ActiveEra,
      ErasStartSessionIndex: stg_Staking_ErasStartSessionIndex,
      ErasStakers: stg_Staking_ErasStakers,
      ErasStakersClipped: stg_Staking_ErasStakersClipped,
      ErasValidatorPrefs: stg_Staking_ErasValidatorPrefs,
      ErasValidatorReward: stg_Staking_ErasValidatorReward,
      ErasRewardPoints: stg_Staking_ErasRewardPoints,
      ErasTotalStake: stg_Staking_ErasTotalStake,
      ForceEra: stg_Staking_ForceEra,
      SlashRewardFraction: stg_Staking_SlashRewardFraction,
      CanceledSlashPayout: stg_Staking_CanceledSlashPayout,
      UnappliedSlashes: stg_Staking_UnappliedSlashes,
      BondedEras: stg_Staking_BondedEras,
      ValidatorSlashInEra: stg_Staking_ValidatorSlashInEra,
      NominatorSlashInEra: stg_Staking_NominatorSlashInEra,
      SlashingSpans: stg_Staking_SlashingSpans,
      SpanSlash: stg_Staking_SpanSlash,
      CurrentPlannedSession: stg_Staking_CurrentPlannedSession,
      OffendingValidators: stg_Staking_OffendingValidators,
      ChillThreshold: stg_Staking_ChillThreshold,
    },
    {
      bond: call_Staking_bond,
      bond_extra: call_Staking_bond_extra,
      unbond: call_Staking_unbond,
      withdraw_unbonded: call_Staking_withdraw_unbonded,
      validate: call_Staking_validate,
      nominate: call_Staking_nominate,
      chill: call_Staking_chill,
      set_payee: call_Staking_set_payee,
      set_controller: call_Staking_set_controller,
      set_validator_count: call_Staking_set_validator_count,
      increase_validator_count: call_Staking_increase_validator_count,
      scale_validator_count: call_Staking_scale_validator_count,
      force_no_eras: call_Staking_force_no_eras,
      force_new_era: call_Staking_force_new_era,
      set_invulnerables: call_Staking_set_invulnerables,
      force_unstake: call_Staking_force_unstake,
      force_new_era_always: call_Staking_force_new_era_always,
      cancel_deferred_slash: call_Staking_cancel_deferred_slash,
      payout_stakers: call_Staking_payout_stakers,
      rebond: call_Staking_rebond,
      reap_stash: call_Staking_reap_stash,
      kick: call_Staking_kick,
      set_staking_configs: call_Staking_set_staking_configs,
      chill_other: call_Staking_chill_other,
      force_apply_min_commission: call_Staking_force_apply_min_commission,
      set_min_commission: call_Staking_set_min_commission,
    },
    {
      EraPaid: evt_Staking_EraPaid,
      Rewarded: evt_Staking_Rewarded,
      Slashed: evt_Staking_Slashed,
      SlashReported: evt_Staking_SlashReported,
      OldSlashingReportDiscarded: evt_Staking_OldSlashingReportDiscarded,
      StakersElected: evt_Staking_StakersElected,
      Bonded: evt_Staking_Bonded,
      Unbonded: evt_Staking_Unbonded,
      Withdrawn: evt_Staking_Withdrawn,
      Kicked: evt_Staking_Kicked,
      StakingElectionFailed: evt_Staking_StakingElectionFailed,
      Chilled: evt_Staking_Chilled,
      PayoutStarted: evt_Staking_PayoutStarted,
      ValidatorPrefsSet: evt_Staking_ValidatorPrefsSet,
      SnapshotVotersSizeExceeded: evt_Staking_SnapshotVotersSizeExceeded,
      SnapshotTargetsSizeExceeded: evt_Staking_SnapshotTargetsSizeExceeded,
      ForceEra: evt_Staking_ForceEra,
    },
    {
      NotController: err_Staking_NotController,
      NotStash: err_Staking_NotStash,
      AlreadyBonded: err_Staking_AlreadyBonded,
      AlreadyPaired: err_Staking_AlreadyPaired,
      EmptyTargets: err_Staking_EmptyTargets,
      DuplicateIndex: err_Staking_DuplicateIndex,
      InvalidSlashIndex: err_Staking_InvalidSlashIndex,
      InsufficientBond: err_Staking_InsufficientBond,
      NoMoreChunks: err_Staking_NoMoreChunks,
      NoUnlockChunk: err_Staking_NoUnlockChunk,
      FundedTarget: err_Staking_FundedTarget,
      InvalidEraToReward: err_Staking_InvalidEraToReward,
      InvalidNumberOfNominations: err_Staking_InvalidNumberOfNominations,
      NotSortedAndUnique: err_Staking_NotSortedAndUnique,
      AlreadyClaimed: err_Staking_AlreadyClaimed,
      IncorrectHistoryDepth: err_Staking_IncorrectHistoryDepth,
      IncorrectSlashingSpans: err_Staking_IncorrectSlashingSpans,
      BadState: err_Staking_BadState,
      TooManyTargets: err_Staking_TooManyTargets,
      BadTarget: err_Staking_BadTarget,
      CannotChillOther: err_Staking_CannotChillOther,
      TooManyNominators: err_Staking_TooManyNominators,
      TooManyValidators: err_Staking_TooManyValidators,
      CommissionTooLow: err_Staking_CommissionTooLow,
      BoundNotMet: err_Staking_BoundNotMet,
    },
    {
      HistoryDepth: const_Staking_HistoryDepth,
      SessionsPerEra: const_Staking_SessionsPerEra,
      BondingDuration: const_Staking_BondingDuration,
      SlashDeferDuration: const_Staking_SlashDeferDuration,
      MaxNominatorRewardedPerValidator:
        const_Staking_MaxNominatorRewardedPerValidator,
      MaxUnlockingChunks: const_Staking_MaxUnlockingChunks,
    },
  ],
  Offences: [
    {
      Reports: stg_Offences_Reports,
      ConcurrentReportsIndex: stg_Offences_ConcurrentReportsIndex,
    },
    {},
    { Offence: evt_Offences_Offence },
    {},
    {},
  ],
  Historical: [{}, {}, {}, {}, {}],
  Session: [
    {
      Validators: stg_Session_Validators,
      CurrentIndex: stg_Session_CurrentIndex,
      QueuedChanged: stg_Session_QueuedChanged,
      QueuedKeys: stg_Session_QueuedKeys,
      DisabledValidators: stg_Session_DisabledValidators,
      NextKeys: stg_Session_NextKeys,
      KeyOwner: stg_Session_KeyOwner,
    },
    { set_keys: call_Session_set_keys, purge_keys: call_Session_purge_keys },
    { NewSession: evt_Session_NewSession },
    {
      InvalidProof: err_Session_InvalidProof,
      NoAssociatedValidatorId: err_Session_NoAssociatedValidatorId,
      DuplicatedKey: err_Session_DuplicatedKey,
      NoKeys: err_Session_NoKeys,
      NoAccount: err_Session_NoAccount,
    },
    {},
  ],
  Grandpa: [
    {
      State: stg_Grandpa_State,
      PendingChange: stg_Grandpa_PendingChange,
      NextForced: stg_Grandpa_NextForced,
      Stalled: stg_Grandpa_Stalled,
      CurrentSetId: stg_Grandpa_CurrentSetId,
      SetIdSession: stg_Grandpa_SetIdSession,
    },
    {
      report_equivocation: call_Grandpa_report_equivocation,
      report_equivocation_unsigned: call_Grandpa_report_equivocation_unsigned,
      note_stalled: call_Grandpa_note_stalled,
    },
    {
      NewAuthorities: evt_Grandpa_NewAuthorities,
      Paused: evt_Grandpa_Paused,
      Resumed: evt_Grandpa_Resumed,
    },
    {
      PauseFailed: err_Grandpa_PauseFailed,
      ResumeFailed: err_Grandpa_ResumeFailed,
      ChangePending: err_Grandpa_ChangePending,
      TooSoon: err_Grandpa_TooSoon,
      InvalidKeyOwnershipProof: err_Grandpa_InvalidKeyOwnershipProof,
      InvalidEquivocationProof: err_Grandpa_InvalidEquivocationProof,
      DuplicateOffenceReport: err_Grandpa_DuplicateOffenceReport,
    },
    {
      MaxAuthorities: const_Grandpa_MaxAuthorities,
      MaxNominators: const_Grandpa_MaxNominators,
      MaxSetIdSessionEntries: const_Grandpa_MaxSetIdSessionEntries,
    },
  ],
  ImOnline: [
    {
      HeartbeatAfter: stg_ImOnline_HeartbeatAfter,
      Keys: stg_ImOnline_Keys,
      ReceivedHeartbeats: stg_ImOnline_ReceivedHeartbeats,
      AuthoredBlocks: stg_ImOnline_AuthoredBlocks,
    },
    { heartbeat: call_ImOnline_heartbeat },
    {
      HeartbeatReceived: evt_ImOnline_HeartbeatReceived,
      AllGood: evt_ImOnline_AllGood,
      SomeOffline: evt_ImOnline_SomeOffline,
    },
    {
      InvalidKey: err_ImOnline_InvalidKey,
      DuplicatedHeartbeat: err_ImOnline_DuplicatedHeartbeat,
    },
    { UnsignedPriority: const_ImOnline_UnsignedPriority },
  ],
  AuthorityDiscovery: [{}, {}, {}, {}, {}],
  Treasury: [
    {
      ProposalCount: stg_Treasury_ProposalCount,
      Proposals: stg_Treasury_Proposals,
      Deactivated: stg_Treasury_Deactivated,
      Approvals: stg_Treasury_Approvals,
      SpendCount: stg_Treasury_SpendCount,
      Spends: stg_Treasury_Spends,
    },
    {
      propose_spend: call_Treasury_propose_spend,
      reject_proposal: call_Treasury_reject_proposal,
      approve_proposal: call_Treasury_approve_proposal,
      spend_local: call_Treasury_spend_local,
      remove_approval: call_Treasury_remove_approval,
      spend: call_Treasury_spend,
      payout: call_Treasury_payout,
      check_status: call_Treasury_check_status,
      void_spend: call_Treasury_void_spend,
    },
    {
      Proposed: evt_Treasury_Proposed,
      Spending: evt_Treasury_Spending,
      Awarded: evt_Treasury_Awarded,
      Rejected: evt_Treasury_Rejected,
      Burnt: evt_Treasury_Burnt,
      Rollover: evt_Treasury_Rollover,
      Deposit: evt_Treasury_Deposit,
      SpendApproved: evt_Treasury_SpendApproved,
      UpdatedInactive: evt_Treasury_UpdatedInactive,
      AssetSpendApproved: evt_Treasury_AssetSpendApproved,
      AssetSpendVoided: evt_Treasury_AssetSpendVoided,
      Paid: evt_Treasury_Paid,
      PaymentFailed: evt_Treasury_PaymentFailed,
      SpendProcessed: evt_Treasury_SpendProcessed,
    },
    {
      InsufficientProposersBalance: err_Treasury_InsufficientProposersBalance,
      InvalidIndex: err_Treasury_InvalidIndex,
      TooManyApprovals: err_Treasury_TooManyApprovals,
      InsufficientPermission: err_Treasury_InsufficientPermission,
      ProposalNotApproved: err_Treasury_ProposalNotApproved,
      FailedToConvertBalance: err_Treasury_FailedToConvertBalance,
      SpendExpired: err_Treasury_SpendExpired,
      EarlyPayout: err_Treasury_EarlyPayout,
      AlreadyAttempted: err_Treasury_AlreadyAttempted,
      PayoutError: err_Treasury_PayoutError,
      NotAttempted: err_Treasury_NotAttempted,
      Inconclusive: err_Treasury_Inconclusive,
    },
    {
      ProposalBond: const_Treasury_ProposalBond,
      ProposalBondMinimum: const_Treasury_ProposalBondMinimum,
      ProposalBondMaximum: const_Treasury_ProposalBondMaximum,
      SpendPeriod: const_Treasury_SpendPeriod,
      Burn: const_Treasury_Burn,
      PalletId: const_Treasury_PalletId,
      MaxApprovals: const_Treasury_MaxApprovals,
      PayoutPeriod: const_Treasury_PayoutPeriod,
    },
  ],
  ConvictionVoting: [
    {
      VotingFor: stg_ConvictionVoting_VotingFor,
      ClassLocksFor: stg_ConvictionVoting_ClassLocksFor,
    },
    {
      vote: call_ConvictionVoting_vote,
      delegate: call_ConvictionVoting_delegate,
      undelegate: call_ConvictionVoting_undelegate,
      unlock: call_ConvictionVoting_unlock,
      remove_vote: call_ConvictionVoting_remove_vote,
      remove_other_vote: call_ConvictionVoting_remove_other_vote,
    },
    {
      Delegated: evt_ConvictionVoting_Delegated,
      Undelegated: evt_ConvictionVoting_Undelegated,
    },
    {
      NotOngoing: err_ConvictionVoting_NotOngoing,
      NotVoter: err_ConvictionVoting_NotVoter,
      NoPermission: err_ConvictionVoting_NoPermission,
      NoPermissionYet: err_ConvictionVoting_NoPermissionYet,
      AlreadyDelegating: err_ConvictionVoting_AlreadyDelegating,
      AlreadyVoting: err_ConvictionVoting_AlreadyVoting,
      InsufficientFunds: err_ConvictionVoting_InsufficientFunds,
      NotDelegating: err_ConvictionVoting_NotDelegating,
      Nonsense: err_ConvictionVoting_Nonsense,
      MaxVotesReached: err_ConvictionVoting_MaxVotesReached,
      ClassNeeded: err_ConvictionVoting_ClassNeeded,
      BadClass: err_ConvictionVoting_BadClass,
    },
    {
      MaxVotes: const_ConvictionVoting_MaxVotes,
      VoteLockingPeriod: const_ConvictionVoting_VoteLockingPeriod,
    },
  ],
  Referenda: [
    {
      ReferendumCount: stg_Referenda_ReferendumCount,
      ReferendumInfoFor: stg_Referenda_ReferendumInfoFor,
      TrackQueue: stg_Referenda_TrackQueue,
      DecidingCount: stg_Referenda_DecidingCount,
      MetadataOf: stg_Referenda_MetadataOf,
    },
    {
      submit: call_Referenda_submit,
      place_decision_deposit: call_Referenda_place_decision_deposit,
      refund_decision_deposit: call_Referenda_refund_decision_deposit,
      cancel: call_Referenda_cancel,
      kill: call_Referenda_kill,
      nudge_referendum: call_Referenda_nudge_referendum,
      one_fewer_deciding: call_Referenda_one_fewer_deciding,
      refund_submission_deposit: call_Referenda_refund_submission_deposit,
      set_metadata: call_Referenda_set_metadata,
    },
    {
      Submitted: evt_Referenda_Submitted,
      DecisionDepositPlaced: evt_Referenda_DecisionDepositPlaced,
      DecisionDepositRefunded: evt_Referenda_DecisionDepositRefunded,
      DepositSlashed: evt_Referenda_DepositSlashed,
      DecisionStarted: evt_Referenda_DecisionStarted,
      ConfirmStarted: evt_Referenda_ConfirmStarted,
      ConfirmAborted: evt_Referenda_ConfirmAborted,
      Confirmed: evt_Referenda_Confirmed,
      Approved: evt_Referenda_Approved,
      Rejected: evt_Referenda_Rejected,
      TimedOut: evt_Referenda_TimedOut,
      Cancelled: evt_Referenda_Cancelled,
      Killed: evt_Referenda_Killed,
      SubmissionDepositRefunded: evt_Referenda_SubmissionDepositRefunded,
      MetadataSet: evt_Referenda_MetadataSet,
      MetadataCleared: evt_Referenda_MetadataCleared,
    },
    {
      NotOngoing: err_Referenda_NotOngoing,
      HasDeposit: err_Referenda_HasDeposit,
      BadTrack: err_Referenda_BadTrack,
      Full: err_Referenda_Full,
      QueueEmpty: err_Referenda_QueueEmpty,
      BadReferendum: err_Referenda_BadReferendum,
      NothingToDo: err_Referenda_NothingToDo,
      NoTrack: err_Referenda_NoTrack,
      Unfinished: err_Referenda_Unfinished,
      NoPermission: err_Referenda_NoPermission,
      NoDeposit: err_Referenda_NoDeposit,
      BadStatus: err_Referenda_BadStatus,
      PreimageNotExist: err_Referenda_PreimageNotExist,
    },
    {
      SubmissionDeposit: const_Referenda_SubmissionDeposit,
      MaxQueued: const_Referenda_MaxQueued,
      UndecidingTimeout: const_Referenda_UndecidingTimeout,
      AlarmInterval: const_Referenda_AlarmInterval,
      Tracks: const_Referenda_Tracks,
    },
  ],
  Whitelist: [
    { WhitelistedCall: stg_Whitelist_WhitelistedCall },
    {
      whitelist_call: call_Whitelist_whitelist_call,
      remove_whitelisted_call: call_Whitelist_remove_whitelisted_call,
      dispatch_whitelisted_call: call_Whitelist_dispatch_whitelisted_call,
      dispatch_whitelisted_call_with_preimage:
        call_Whitelist_dispatch_whitelisted_call_with_preimage,
    },
    {
      CallWhitelisted: evt_Whitelist_CallWhitelisted,
      WhitelistedCallRemoved: evt_Whitelist_WhitelistedCallRemoved,
      WhitelistedCallDispatched: evt_Whitelist_WhitelistedCallDispatched,
    },
    {
      UnavailablePreImage: err_Whitelist_UnavailablePreImage,
      UndecodableCall: err_Whitelist_UndecodableCall,
      InvalidCallWeightWitness: err_Whitelist_InvalidCallWeightWitness,
      CallIsNotWhitelisted: err_Whitelist_CallIsNotWhitelisted,
      CallAlreadyWhitelisted: err_Whitelist_CallAlreadyWhitelisted,
    },
    {},
  ],
  Claims: [
    {
      Claims: stg_Claims_Claims,
      Total: stg_Claims_Total,
      Vesting: stg_Claims_Vesting,
      Signing: stg_Claims_Signing,
      Preclaims: stg_Claims_Preclaims,
    },
    {
      claim: call_Claims_claim,
      mint_claim: call_Claims_mint_claim,
      claim_attest: call_Claims_claim_attest,
      attest: call_Claims_attest,
      move_claim: call_Claims_move_claim,
    },
    { Claimed: evt_Claims_Claimed },
    {
      InvalidEthereumSignature: err_Claims_InvalidEthereumSignature,
      SignerHasNoClaim: err_Claims_SignerHasNoClaim,
      SenderHasNoClaim: err_Claims_SenderHasNoClaim,
      PotUnderflow: err_Claims_PotUnderflow,
      InvalidStatement: err_Claims_InvalidStatement,
      VestedBalanceExists: err_Claims_VestedBalanceExists,
    },
    { Prefix: const_Claims_Prefix },
  ],
  Vesting: [
    {
      Vesting: stg_Vesting_Vesting,
      StorageVersion: stg_Vesting_StorageVersion,
    },
    {
      vest: call_Vesting_vest,
      vest_other: call_Vesting_vest_other,
      vested_transfer: call_Vesting_vested_transfer,
      force_vested_transfer: call_Vesting_force_vested_transfer,
      merge_schedules: call_Vesting_merge_schedules,
    },
    {
      VestingUpdated: evt_Vesting_VestingUpdated,
      VestingCompleted: evt_Vesting_VestingCompleted,
    },
    {
      NotVesting: err_Vesting_NotVesting,
      AtMaxVestingSchedules: err_Vesting_AtMaxVestingSchedules,
      AmountLow: err_Vesting_AmountLow,
      ScheduleIndexOutOfBounds: err_Vesting_ScheduleIndexOutOfBounds,
      InvalidScheduleParams: err_Vesting_InvalidScheduleParams,
    },
    {
      MinVestedTransfer: const_Vesting_MinVestedTransfer,
      MaxVestingSchedules: const_Vesting_MaxVestingSchedules,
    },
  ],
  Utility: [
    {},
    {
      batch: call_Utility_batch,
      as_derivative: call_Utility_as_derivative,
      batch_all: call_Utility_batch_all,
      dispatch_as: call_Utility_dispatch_as,
      force_batch: call_Utility_force_batch,
      with_weight: call_Utility_with_weight,
    },
    {
      BatchInterrupted: evt_Utility_BatchInterrupted,
      BatchCompleted: evt_Utility_BatchCompleted,
      BatchCompletedWithErrors: evt_Utility_BatchCompletedWithErrors,
      ItemCompleted: evt_Utility_ItemCompleted,
      ItemFailed: evt_Utility_ItemFailed,
      DispatchedAs: evt_Utility_DispatchedAs,
    },
    { TooManyCalls: err_Utility_TooManyCalls },
    { batched_calls_limit: const_Utility_batched_calls_limit },
  ],
  Identity: [
    {
      IdentityOf: stg_Identity_IdentityOf,
      SuperOf: stg_Identity_SuperOf,
      SubsOf: stg_Identity_SubsOf,
      Registrars: stg_Identity_Registrars,
    },
    {
      add_registrar: call_Identity_add_registrar,
      set_identity: call_Identity_set_identity,
      set_subs: call_Identity_set_subs,
      clear_identity: call_Identity_clear_identity,
      request_judgement: call_Identity_request_judgement,
      cancel_request: call_Identity_cancel_request,
      set_fee: call_Identity_set_fee,
      set_account_id: call_Identity_set_account_id,
      set_fields: call_Identity_set_fields,
      provide_judgement: call_Identity_provide_judgement,
      kill_identity: call_Identity_kill_identity,
      add_sub: call_Identity_add_sub,
      rename_sub: call_Identity_rename_sub,
      remove_sub: call_Identity_remove_sub,
      quit_sub: call_Identity_quit_sub,
    },
    {
      IdentitySet: evt_Identity_IdentitySet,
      IdentityCleared: evt_Identity_IdentityCleared,
      IdentityKilled: evt_Identity_IdentityKilled,
      JudgementRequested: evt_Identity_JudgementRequested,
      JudgementUnrequested: evt_Identity_JudgementUnrequested,
      JudgementGiven: evt_Identity_JudgementGiven,
      RegistrarAdded: evt_Identity_RegistrarAdded,
      SubIdentityAdded: evt_Identity_SubIdentityAdded,
      SubIdentityRemoved: evt_Identity_SubIdentityRemoved,
      SubIdentityRevoked: evt_Identity_SubIdentityRevoked,
    },
    {
      TooManySubAccounts: err_Identity_TooManySubAccounts,
      NotFound: err_Identity_NotFound,
      NotNamed: err_Identity_NotNamed,
      EmptyIndex: err_Identity_EmptyIndex,
      FeeChanged: err_Identity_FeeChanged,
      NoIdentity: err_Identity_NoIdentity,
      StickyJudgement: err_Identity_StickyJudgement,
      JudgementGiven: err_Identity_JudgementGiven,
      InvalidJudgement: err_Identity_InvalidJudgement,
      InvalidIndex: err_Identity_InvalidIndex,
      InvalidTarget: err_Identity_InvalidTarget,
      TooManyFields: err_Identity_TooManyFields,
      TooManyRegistrars: err_Identity_TooManyRegistrars,
      AlreadyClaimed: err_Identity_AlreadyClaimed,
      NotSub: err_Identity_NotSub,
      NotOwned: err_Identity_NotOwned,
      JudgementForDifferentIdentity: err_Identity_JudgementForDifferentIdentity,
      JudgementPaymentFailed: err_Identity_JudgementPaymentFailed,
    },
    {
      BasicDeposit: const_Identity_BasicDeposit,
      FieldDeposit: const_Identity_FieldDeposit,
      SubAccountDeposit: const_Identity_SubAccountDeposit,
      MaxSubAccounts: const_Identity_MaxSubAccounts,
      MaxAdditionalFields: const_Identity_MaxAdditionalFields,
      MaxRegistrars: const_Identity_MaxRegistrars,
    },
  ],
  Proxy: [
    { Proxies: stg_Proxy_Proxies, Announcements: stg_Proxy_Announcements },
    {
      proxy: call_Proxy_proxy,
      add_proxy: call_Proxy_add_proxy,
      remove_proxy: call_Proxy_remove_proxy,
      remove_proxies: call_Proxy_remove_proxies,
      create_pure: call_Proxy_create_pure,
      kill_pure: call_Proxy_kill_pure,
      announce: call_Proxy_announce,
      remove_announcement: call_Proxy_remove_announcement,
      reject_announcement: call_Proxy_reject_announcement,
      proxy_announced: call_Proxy_proxy_announced,
    },
    {
      ProxyExecuted: evt_Proxy_ProxyExecuted,
      PureCreated: evt_Proxy_PureCreated,
      Announced: evt_Proxy_Announced,
      ProxyAdded: evt_Proxy_ProxyAdded,
      ProxyRemoved: evt_Proxy_ProxyRemoved,
    },
    {
      TooMany: err_Proxy_TooMany,
      NotFound: err_Proxy_NotFound,
      NotProxy: err_Proxy_NotProxy,
      Unproxyable: err_Proxy_Unproxyable,
      Duplicate: err_Proxy_Duplicate,
      NoPermission: err_Proxy_NoPermission,
      Unannounced: err_Proxy_Unannounced,
      NoSelfProxy: err_Proxy_NoSelfProxy,
    },
    {
      ProxyDepositBase: const_Proxy_ProxyDepositBase,
      ProxyDepositFactor: const_Proxy_ProxyDepositFactor,
      MaxProxies: const_Proxy_MaxProxies,
      MaxPending: const_Proxy_MaxPending,
      AnnouncementDepositBase: const_Proxy_AnnouncementDepositBase,
      AnnouncementDepositFactor: const_Proxy_AnnouncementDepositFactor,
    },
  ],
  Multisig: [
    { Multisigs: stg_Multisig_Multisigs },
    {
      as_multi_threshold_1: call_Multisig_as_multi_threshold_1,
      as_multi: call_Multisig_as_multi,
      approve_as_multi: call_Multisig_approve_as_multi,
      cancel_as_multi: call_Multisig_cancel_as_multi,
    },
    {
      NewMultisig: evt_Multisig_NewMultisig,
      MultisigApproval: evt_Multisig_MultisigApproval,
      MultisigExecuted: evt_Multisig_MultisigExecuted,
      MultisigCancelled: evt_Multisig_MultisigCancelled,
    },
    {
      MinimumThreshold: err_Multisig_MinimumThreshold,
      AlreadyApproved: err_Multisig_AlreadyApproved,
      NoApprovalsNeeded: err_Multisig_NoApprovalsNeeded,
      TooFewSignatories: err_Multisig_TooFewSignatories,
      TooManySignatories: err_Multisig_TooManySignatories,
      SignatoriesOutOfOrder: err_Multisig_SignatoriesOutOfOrder,
      SenderInSignatories: err_Multisig_SenderInSignatories,
      NotFound: err_Multisig_NotFound,
      NotOwner: err_Multisig_NotOwner,
      NoTimepoint: err_Multisig_NoTimepoint,
      WrongTimepoint: err_Multisig_WrongTimepoint,
      UnexpectedTimepoint: err_Multisig_UnexpectedTimepoint,
      MaxWeightTooLow: err_Multisig_MaxWeightTooLow,
      AlreadyStored: err_Multisig_AlreadyStored,
    },
    {
      DepositBase: const_Multisig_DepositBase,
      DepositFactor: const_Multisig_DepositFactor,
      MaxSignatories: const_Multisig_MaxSignatories,
    },
  ],
  Bounties: [
    {
      BountyCount: stg_Bounties_BountyCount,
      Bounties: stg_Bounties_Bounties,
      BountyDescriptions: stg_Bounties_BountyDescriptions,
      BountyApprovals: stg_Bounties_BountyApprovals,
    },
    {
      propose_bounty: call_Bounties_propose_bounty,
      approve_bounty: call_Bounties_approve_bounty,
      propose_curator: call_Bounties_propose_curator,
      unassign_curator: call_Bounties_unassign_curator,
      accept_curator: call_Bounties_accept_curator,
      award_bounty: call_Bounties_award_bounty,
      claim_bounty: call_Bounties_claim_bounty,
      close_bounty: call_Bounties_close_bounty,
      extend_bounty_expiry: call_Bounties_extend_bounty_expiry,
    },
    {
      BountyProposed: evt_Bounties_BountyProposed,
      BountyRejected: evt_Bounties_BountyRejected,
      BountyBecameActive: evt_Bounties_BountyBecameActive,
      BountyAwarded: evt_Bounties_BountyAwarded,
      BountyClaimed: evt_Bounties_BountyClaimed,
      BountyCanceled: evt_Bounties_BountyCanceled,
      BountyExtended: evt_Bounties_BountyExtended,
      BountyApproved: evt_Bounties_BountyApproved,
      CuratorProposed: evt_Bounties_CuratorProposed,
      CuratorUnassigned: evt_Bounties_CuratorUnassigned,
      CuratorAccepted: evt_Bounties_CuratorAccepted,
    },
    {
      InsufficientProposersBalance: err_Bounties_InsufficientProposersBalance,
      InvalidIndex: err_Bounties_InvalidIndex,
      ReasonTooBig: err_Bounties_ReasonTooBig,
      UnexpectedStatus: err_Bounties_UnexpectedStatus,
      RequireCurator: err_Bounties_RequireCurator,
      InvalidValue: err_Bounties_InvalidValue,
      InvalidFee: err_Bounties_InvalidFee,
      PendingPayout: err_Bounties_PendingPayout,
      Premature: err_Bounties_Premature,
      HasActiveChildBounty: err_Bounties_HasActiveChildBounty,
      TooManyQueued: err_Bounties_TooManyQueued,
    },
    {
      BountyDepositBase: const_Bounties_BountyDepositBase,
      BountyDepositPayoutDelay: const_Bounties_BountyDepositPayoutDelay,
      BountyUpdatePeriod: const_Bounties_BountyUpdatePeriod,
      CuratorDepositMultiplier: const_Bounties_CuratorDepositMultiplier,
      CuratorDepositMax: const_Bounties_CuratorDepositMax,
      CuratorDepositMin: const_Bounties_CuratorDepositMin,
      BountyValueMinimum: const_Bounties_BountyValueMinimum,
      DataDepositPerByte: const_Bounties_DataDepositPerByte,
      MaximumReasonLength: const_Bounties_MaximumReasonLength,
    },
  ],
  ChildBounties: [
    {
      ChildBountyCount: stg_ChildBounties_ChildBountyCount,
      ParentChildBounties: stg_ChildBounties_ParentChildBounties,
      ChildBounties: stg_ChildBounties_ChildBounties,
      ChildBountyDescriptions: stg_ChildBounties_ChildBountyDescriptions,
      ChildrenCuratorFees: stg_ChildBounties_ChildrenCuratorFees,
    },
    {
      add_child_bounty: call_ChildBounties_add_child_bounty,
      propose_curator: call_ChildBounties_propose_curator,
      accept_curator: call_ChildBounties_accept_curator,
      unassign_curator: call_ChildBounties_unassign_curator,
      award_child_bounty: call_ChildBounties_award_child_bounty,
      claim_child_bounty: call_ChildBounties_claim_child_bounty,
      close_child_bounty: call_ChildBounties_close_child_bounty,
    },
    {
      Added: evt_ChildBounties_Added,
      Awarded: evt_ChildBounties_Awarded,
      Claimed: evt_ChildBounties_Claimed,
      Canceled: evt_ChildBounties_Canceled,
    },
    {
      ParentBountyNotActive: err_ChildBounties_ParentBountyNotActive,
      InsufficientBountyBalance: err_ChildBounties_InsufficientBountyBalance,
      TooManyChildBounties: err_ChildBounties_TooManyChildBounties,
    },
    {
      MaxActiveChildBountyCount: const_ChildBounties_MaxActiveChildBountyCount,
      ChildBountyValueMinimum: const_ChildBounties_ChildBountyValueMinimum,
    },
  ],
  ElectionProviderMultiPhase: [
    {
      Round: stg_ElectionProviderMultiPhase_Round,
      CurrentPhase: stg_ElectionProviderMultiPhase_CurrentPhase,
      QueuedSolution: stg_ElectionProviderMultiPhase_QueuedSolution,
      Snapshot: stg_ElectionProviderMultiPhase_Snapshot,
      DesiredTargets: stg_ElectionProviderMultiPhase_DesiredTargets,
      SnapshotMetadata: stg_ElectionProviderMultiPhase_SnapshotMetadata,
      SignedSubmissionNextIndex:
        stg_ElectionProviderMultiPhase_SignedSubmissionNextIndex,
      SignedSubmissionIndices:
        stg_ElectionProviderMultiPhase_SignedSubmissionIndices,
      SignedSubmissionsMap: stg_ElectionProviderMultiPhase_SignedSubmissionsMap,
      MinimumUntrustedScore:
        stg_ElectionProviderMultiPhase_MinimumUntrustedScore,
    },
    {
      submit_unsigned: call_ElectionProviderMultiPhase_submit_unsigned,
      set_minimum_untrusted_score:
        call_ElectionProviderMultiPhase_set_minimum_untrusted_score,
      set_emergency_election_result:
        call_ElectionProviderMultiPhase_set_emergency_election_result,
      submit: call_ElectionProviderMultiPhase_submit,
      governance_fallback: call_ElectionProviderMultiPhase_governance_fallback,
    },
    {
      SolutionStored: evt_ElectionProviderMultiPhase_SolutionStored,
      ElectionFinalized: evt_ElectionProviderMultiPhase_ElectionFinalized,
      ElectionFailed: evt_ElectionProviderMultiPhase_ElectionFailed,
      Rewarded: evt_ElectionProviderMultiPhase_Rewarded,
      Slashed: evt_ElectionProviderMultiPhase_Slashed,
      PhaseTransitioned: evt_ElectionProviderMultiPhase_PhaseTransitioned,
    },
    {
      PreDispatchEarlySubmission:
        err_ElectionProviderMultiPhase_PreDispatchEarlySubmission,
      PreDispatchWrongWinnerCount:
        err_ElectionProviderMultiPhase_PreDispatchWrongWinnerCount,
      PreDispatchWeakSubmission:
        err_ElectionProviderMultiPhase_PreDispatchWeakSubmission,
      SignedQueueFull: err_ElectionProviderMultiPhase_SignedQueueFull,
      SignedCannotPayDeposit:
        err_ElectionProviderMultiPhase_SignedCannotPayDeposit,
      SignedInvalidWitness: err_ElectionProviderMultiPhase_SignedInvalidWitness,
      SignedTooMuchWeight: err_ElectionProviderMultiPhase_SignedTooMuchWeight,
      OcwCallWrongEra: err_ElectionProviderMultiPhase_OcwCallWrongEra,
      MissingSnapshotMetadata:
        err_ElectionProviderMultiPhase_MissingSnapshotMetadata,
      InvalidSubmissionIndex:
        err_ElectionProviderMultiPhase_InvalidSubmissionIndex,
      CallNotAllowed: err_ElectionProviderMultiPhase_CallNotAllowed,
      FallbackFailed: err_ElectionProviderMultiPhase_FallbackFailed,
      BoundNotMet: err_ElectionProviderMultiPhase_BoundNotMet,
      TooManyWinners: err_ElectionProviderMultiPhase_TooManyWinners,
    },
    {
      UnsignedPhase: const_ElectionProviderMultiPhase_UnsignedPhase,
      SignedPhase: const_ElectionProviderMultiPhase_SignedPhase,
      BetterSignedThreshold:
        const_ElectionProviderMultiPhase_BetterSignedThreshold,
      BetterUnsignedThreshold:
        const_ElectionProviderMultiPhase_BetterUnsignedThreshold,
      OffchainRepeat: const_ElectionProviderMultiPhase_OffchainRepeat,
      MinerTxPriority: const_ElectionProviderMultiPhase_MinerTxPriority,
      SignedMaxSubmissions:
        const_ElectionProviderMultiPhase_SignedMaxSubmissions,
      SignedMaxWeight: const_ElectionProviderMultiPhase_SignedMaxWeight,
      SignedMaxRefunds: const_ElectionProviderMultiPhase_SignedMaxRefunds,
      SignedRewardBase: const_ElectionProviderMultiPhase_SignedRewardBase,
      SignedDepositByte: const_ElectionProviderMultiPhase_SignedDepositByte,
      SignedDepositWeight: const_ElectionProviderMultiPhase_SignedDepositWeight,
      MaxWinners: const_ElectionProviderMultiPhase_MaxWinners,
      MinerMaxLength: const_ElectionProviderMultiPhase_MinerMaxLength,
      MinerMaxWeight: const_ElectionProviderMultiPhase_MinerMaxWeight,
      MinerMaxVotesPerVoter:
        const_ElectionProviderMultiPhase_MinerMaxVotesPerVoter,
      MinerMaxWinners: const_ElectionProviderMultiPhase_MinerMaxWinners,
    },
  ],
  VoterList: [
    {
      ListNodes: stg_VoterList_ListNodes,
      CounterForListNodes: stg_VoterList_CounterForListNodes,
      ListBags: stg_VoterList_ListBags,
    },
    {
      rebag: call_VoterList_rebag,
      put_in_front_of: call_VoterList_put_in_front_of,
      put_in_front_of_other: call_VoterList_put_in_front_of_other,
    },
    {
      Rebagged: evt_VoterList_Rebagged,
      ScoreUpdated: evt_VoterList_ScoreUpdated,
    },
    { List: err_VoterList_List },
    { BagThresholds: const_VoterList_BagThresholds },
  ],
  NominationPools: [
    {
      TotalValueLocked: stg_NominationPools_TotalValueLocked,
      MinJoinBond: stg_NominationPools_MinJoinBond,
      MinCreateBond: stg_NominationPools_MinCreateBond,
      MaxPools: stg_NominationPools_MaxPools,
      MaxPoolMembers: stg_NominationPools_MaxPoolMembers,
      MaxPoolMembersPerPool: stg_NominationPools_MaxPoolMembersPerPool,
      GlobalMaxCommission: stg_NominationPools_GlobalMaxCommission,
      PoolMembers: stg_NominationPools_PoolMembers,
      CounterForPoolMembers: stg_NominationPools_CounterForPoolMembers,
      BondedPools: stg_NominationPools_BondedPools,
      CounterForBondedPools: stg_NominationPools_CounterForBondedPools,
      RewardPools: stg_NominationPools_RewardPools,
      CounterForRewardPools: stg_NominationPools_CounterForRewardPools,
      SubPoolsStorage: stg_NominationPools_SubPoolsStorage,
      CounterForSubPoolsStorage: stg_NominationPools_CounterForSubPoolsStorage,
      Metadata: stg_NominationPools_Metadata,
      CounterForMetadata: stg_NominationPools_CounterForMetadata,
      LastPoolId: stg_NominationPools_LastPoolId,
      ReversePoolIdLookup: stg_NominationPools_ReversePoolIdLookup,
      CounterForReversePoolIdLookup:
        stg_NominationPools_CounterForReversePoolIdLookup,
      ClaimPermissions: stg_NominationPools_ClaimPermissions,
    },
    {
      join: call_NominationPools_join,
      bond_extra: call_NominationPools_bond_extra,
      claim_payout: call_NominationPools_claim_payout,
      unbond: call_NominationPools_unbond,
      pool_withdraw_unbonded: call_NominationPools_pool_withdraw_unbonded,
      withdraw_unbonded: call_NominationPools_withdraw_unbonded,
      create: call_NominationPools_create,
      create_with_pool_id: call_NominationPools_create_with_pool_id,
      nominate: call_NominationPools_nominate,
      set_state: call_NominationPools_set_state,
      set_metadata: call_NominationPools_set_metadata,
      set_configs: call_NominationPools_set_configs,
      update_roles: call_NominationPools_update_roles,
      chill: call_NominationPools_chill,
      bond_extra_other: call_NominationPools_bond_extra_other,
      set_claim_permission: call_NominationPools_set_claim_permission,
      claim_payout_other: call_NominationPools_claim_payout_other,
      set_commission: call_NominationPools_set_commission,
      set_commission_max: call_NominationPools_set_commission_max,
      set_commission_change_rate:
        call_NominationPools_set_commission_change_rate,
      claim_commission: call_NominationPools_claim_commission,
      adjust_pool_deposit: call_NominationPools_adjust_pool_deposit,
    },
    {
      Created: evt_NominationPools_Created,
      Bonded: evt_NominationPools_Bonded,
      PaidOut: evt_NominationPools_PaidOut,
      Unbonded: evt_NominationPools_Unbonded,
      Withdrawn: evt_NominationPools_Withdrawn,
      Destroyed: evt_NominationPools_Destroyed,
      StateChanged: evt_NominationPools_StateChanged,
      MemberRemoved: evt_NominationPools_MemberRemoved,
      RolesUpdated: evt_NominationPools_RolesUpdated,
      PoolSlashed: evt_NominationPools_PoolSlashed,
      UnbondingPoolSlashed: evt_NominationPools_UnbondingPoolSlashed,
      PoolCommissionUpdated: evt_NominationPools_PoolCommissionUpdated,
      PoolMaxCommissionUpdated: evt_NominationPools_PoolMaxCommissionUpdated,
      PoolCommissionChangeRateUpdated:
        evt_NominationPools_PoolCommissionChangeRateUpdated,
      PoolCommissionClaimed: evt_NominationPools_PoolCommissionClaimed,
      MinBalanceDeficitAdjusted: evt_NominationPools_MinBalanceDeficitAdjusted,
      MinBalanceExcessAdjusted: evt_NominationPools_MinBalanceExcessAdjusted,
    },
    {
      PoolNotFound: err_NominationPools_PoolNotFound,
      PoolMemberNotFound: err_NominationPools_PoolMemberNotFound,
      RewardPoolNotFound: err_NominationPools_RewardPoolNotFound,
      SubPoolsNotFound: err_NominationPools_SubPoolsNotFound,
      AccountBelongsToOtherPool: err_NominationPools_AccountBelongsToOtherPool,
      FullyUnbonding: err_NominationPools_FullyUnbonding,
      MaxUnbondingLimit: err_NominationPools_MaxUnbondingLimit,
      CannotWithdrawAny: err_NominationPools_CannotWithdrawAny,
      MinimumBondNotMet: err_NominationPools_MinimumBondNotMet,
      OverflowRisk: err_NominationPools_OverflowRisk,
      NotDestroying: err_NominationPools_NotDestroying,
      NotNominator: err_NominationPools_NotNominator,
      NotKickerOrDestroying: err_NominationPools_NotKickerOrDestroying,
      NotOpen: err_NominationPools_NotOpen,
      MaxPools: err_NominationPools_MaxPools,
      MaxPoolMembers: err_NominationPools_MaxPoolMembers,
      CanNotChangeState: err_NominationPools_CanNotChangeState,
      DoesNotHavePermission: err_NominationPools_DoesNotHavePermission,
      MetadataExceedsMaxLen: err_NominationPools_MetadataExceedsMaxLen,
      Defensive: err_NominationPools_Defensive,
      PartialUnbondNotAllowedPermissionlessly:
        err_NominationPools_PartialUnbondNotAllowedPermissionlessly,
      MaxCommissionRestricted: err_NominationPools_MaxCommissionRestricted,
      CommissionExceedsMaximum: err_NominationPools_CommissionExceedsMaximum,
      CommissionExceedsGlobalMaximum:
        err_NominationPools_CommissionExceedsGlobalMaximum,
      CommissionChangeThrottled: err_NominationPools_CommissionChangeThrottled,
      CommissionChangeRateNotAllowed:
        err_NominationPools_CommissionChangeRateNotAllowed,
      NoPendingCommission: err_NominationPools_NoPendingCommission,
      NoCommissionCurrentSet: err_NominationPools_NoCommissionCurrentSet,
      PoolIdInUse: err_NominationPools_PoolIdInUse,
      InvalidPoolId: err_NominationPools_InvalidPoolId,
      BondExtraRestricted: err_NominationPools_BondExtraRestricted,
      NothingToAdjust: err_NominationPools_NothingToAdjust,
    },
    {
      PalletId: const_NominationPools_PalletId,
      MaxPointsToBalance: const_NominationPools_MaxPointsToBalance,
    },
  ],
  FastUnstake: [
    {
      Head: stg_FastUnstake_Head,
      Queue: stg_FastUnstake_Queue,
      CounterForQueue: stg_FastUnstake_CounterForQueue,
      ErasToCheckPerBlock: stg_FastUnstake_ErasToCheckPerBlock,
    },
    {
      register_fast_unstake: call_FastUnstake_register_fast_unstake,
      deregister: call_FastUnstake_deregister,
      control: call_FastUnstake_control,
    },
    {
      Unstaked: evt_FastUnstake_Unstaked,
      Slashed: evt_FastUnstake_Slashed,
      BatchChecked: evt_FastUnstake_BatchChecked,
      BatchFinished: evt_FastUnstake_BatchFinished,
      InternalError: evt_FastUnstake_InternalError,
    },
    {
      NotController: err_FastUnstake_NotController,
      AlreadyQueued: err_FastUnstake_AlreadyQueued,
      NotFullyBonded: err_FastUnstake_NotFullyBonded,
      NotQueued: err_FastUnstake_NotQueued,
      AlreadyHead: err_FastUnstake_AlreadyHead,
      CallNotAllowed: err_FastUnstake_CallNotAllowed,
    },
    { Deposit: const_FastUnstake_Deposit },
  ],
  ParachainsOrigin: [{}, {}, {}, {}, {}],
  Configuration: [
    {
      ActiveConfig: stg_Configuration_ActiveConfig,
      PendingConfigs: stg_Configuration_PendingConfigs,
      BypassConsistencyCheck: stg_Configuration_BypassConsistencyCheck,
    },
    {
      set_validation_upgrade_cooldown:
        call_Configuration_set_validation_upgrade_cooldown,
      set_validation_upgrade_delay:
        call_Configuration_set_validation_upgrade_delay,
      set_code_retention_period: call_Configuration_set_code_retention_period,
      set_max_code_size: call_Configuration_set_max_code_size,
      set_max_pov_size: call_Configuration_set_max_pov_size,
      set_max_head_data_size: call_Configuration_set_max_head_data_size,
      set_on_demand_cores: call_Configuration_set_on_demand_cores,
      set_on_demand_retries: call_Configuration_set_on_demand_retries,
      set_group_rotation_frequency:
        call_Configuration_set_group_rotation_frequency,
      set_paras_availability_period:
        call_Configuration_set_paras_availability_period,
      set_scheduling_lookahead: call_Configuration_set_scheduling_lookahead,
      set_max_validators_per_core:
        call_Configuration_set_max_validators_per_core,
      set_max_validators: call_Configuration_set_max_validators,
      set_dispute_period: call_Configuration_set_dispute_period,
      set_dispute_post_conclusion_acceptance_period:
        call_Configuration_set_dispute_post_conclusion_acceptance_period,
      set_no_show_slots: call_Configuration_set_no_show_slots,
      set_n_delay_tranches: call_Configuration_set_n_delay_tranches,
      set_zeroth_delay_tranche_width:
        call_Configuration_set_zeroth_delay_tranche_width,
      set_needed_approvals: call_Configuration_set_needed_approvals,
      set_relay_vrf_modulo_samples:
        call_Configuration_set_relay_vrf_modulo_samples,
      set_max_upward_queue_count: call_Configuration_set_max_upward_queue_count,
      set_max_upward_queue_size: call_Configuration_set_max_upward_queue_size,
      set_max_downward_message_size:
        call_Configuration_set_max_downward_message_size,
      set_max_upward_message_size:
        call_Configuration_set_max_upward_message_size,
      set_max_upward_message_num_per_candidate:
        call_Configuration_set_max_upward_message_num_per_candidate,
      set_hrmp_open_request_ttl: call_Configuration_set_hrmp_open_request_ttl,
      set_hrmp_sender_deposit: call_Configuration_set_hrmp_sender_deposit,
      set_hrmp_recipient_deposit: call_Configuration_set_hrmp_recipient_deposit,
      set_hrmp_channel_max_capacity:
        call_Configuration_set_hrmp_channel_max_capacity,
      set_hrmp_channel_max_total_size:
        call_Configuration_set_hrmp_channel_max_total_size,
      set_hrmp_max_parachain_inbound_channels:
        call_Configuration_set_hrmp_max_parachain_inbound_channels,
      set_hrmp_channel_max_message_size:
        call_Configuration_set_hrmp_channel_max_message_size,
      set_hrmp_max_parachain_outbound_channels:
        call_Configuration_set_hrmp_max_parachain_outbound_channels,
      set_hrmp_max_message_num_per_candidate:
        call_Configuration_set_hrmp_max_message_num_per_candidate,
      set_pvf_voting_ttl: call_Configuration_set_pvf_voting_ttl,
      set_minimum_validation_upgrade_delay:
        call_Configuration_set_minimum_validation_upgrade_delay,
      set_bypass_consistency_check:
        call_Configuration_set_bypass_consistency_check,
      set_async_backing_params: call_Configuration_set_async_backing_params,
      set_executor_params: call_Configuration_set_executor_params,
      set_on_demand_base_fee: call_Configuration_set_on_demand_base_fee,
      set_on_demand_fee_variability:
        call_Configuration_set_on_demand_fee_variability,
      set_on_demand_queue_max_size:
        call_Configuration_set_on_demand_queue_max_size,
      set_on_demand_target_queue_utilization:
        call_Configuration_set_on_demand_target_queue_utilization,
      set_on_demand_ttl: call_Configuration_set_on_demand_ttl,
      set_minimum_backing_votes: call_Configuration_set_minimum_backing_votes,
    },
    {},
    { InvalidNewValue: err_Configuration_InvalidNewValue },
    {},
  ],
  ParasShared: [
    {
      CurrentSessionIndex: stg_ParasShared_CurrentSessionIndex,
      ActiveValidatorIndices: stg_ParasShared_ActiveValidatorIndices,
      ActiveValidatorKeys: stg_ParasShared_ActiveValidatorKeys,
      AllowedRelayParents: stg_ParasShared_AllowedRelayParents,
    },
    {},
    {},
    {},
    {},
  ],
  ParaInclusion: [
    {
      AvailabilityBitfields: stg_ParaInclusion_AvailabilityBitfields,
      PendingAvailability: stg_ParaInclusion_PendingAvailability,
      PendingAvailabilityCommitments:
        stg_ParaInclusion_PendingAvailabilityCommitments,
    },
    {},
    {
      CandidateBacked: evt_ParaInclusion_CandidateBacked,
      CandidateIncluded: evt_ParaInclusion_CandidateIncluded,
      CandidateTimedOut: evt_ParaInclusion_CandidateTimedOut,
      UpwardMessagesReceived: evt_ParaInclusion_UpwardMessagesReceived,
    },
    {
      UnsortedOrDuplicateValidatorIndices:
        err_ParaInclusion_UnsortedOrDuplicateValidatorIndices,
      UnsortedOrDuplicateDisputeStatementSet:
        err_ParaInclusion_UnsortedOrDuplicateDisputeStatementSet,
      UnsortedOrDuplicateBackedCandidates:
        err_ParaInclusion_UnsortedOrDuplicateBackedCandidates,
      UnexpectedRelayParent: err_ParaInclusion_UnexpectedRelayParent,
      WrongBitfieldSize: err_ParaInclusion_WrongBitfieldSize,
      BitfieldAllZeros: err_ParaInclusion_BitfieldAllZeros,
      BitfieldDuplicateOrUnordered:
        err_ParaInclusion_BitfieldDuplicateOrUnordered,
      ValidatorIndexOutOfBounds: err_ParaInclusion_ValidatorIndexOutOfBounds,
      InvalidBitfieldSignature: err_ParaInclusion_InvalidBitfieldSignature,
      UnscheduledCandidate: err_ParaInclusion_UnscheduledCandidate,
      CandidateScheduledBeforeParaFree:
        err_ParaInclusion_CandidateScheduledBeforeParaFree,
      ScheduledOutOfOrder: err_ParaInclusion_ScheduledOutOfOrder,
      HeadDataTooLarge: err_ParaInclusion_HeadDataTooLarge,
      PrematureCodeUpgrade: err_ParaInclusion_PrematureCodeUpgrade,
      NewCodeTooLarge: err_ParaInclusion_NewCodeTooLarge,
      DisallowedRelayParent: err_ParaInclusion_DisallowedRelayParent,
      InvalidAssignment: err_ParaInclusion_InvalidAssignment,
      InvalidGroupIndex: err_ParaInclusion_InvalidGroupIndex,
      InsufficientBacking: err_ParaInclusion_InsufficientBacking,
      InvalidBacking: err_ParaInclusion_InvalidBacking,
      NotCollatorSigned: err_ParaInclusion_NotCollatorSigned,
      ValidationDataHashMismatch: err_ParaInclusion_ValidationDataHashMismatch,
      IncorrectDownwardMessageHandling:
        err_ParaInclusion_IncorrectDownwardMessageHandling,
      InvalidUpwardMessages: err_ParaInclusion_InvalidUpwardMessages,
      HrmpWatermarkMishandling: err_ParaInclusion_HrmpWatermarkMishandling,
      InvalidOutboundHrmp: err_ParaInclusion_InvalidOutboundHrmp,
      InvalidValidationCodeHash: err_ParaInclusion_InvalidValidationCodeHash,
      ParaHeadMismatch: err_ParaInclusion_ParaHeadMismatch,
      BitfieldReferencesFreedCore:
        err_ParaInclusion_BitfieldReferencesFreedCore,
    },
    {},
  ],
  ParaInherent: [
    {
      Included: stg_ParaInherent_Included,
      OnChainVotes: stg_ParaInherent_OnChainVotes,
    },
    { enter: call_ParaInherent_enter },
    {},
    {
      TooManyInclusionInherents: err_ParaInherent_TooManyInclusionInherents,
      InvalidParentHeader: err_ParaInherent_InvalidParentHeader,
      CandidateConcludedInvalid: err_ParaInherent_CandidateConcludedInvalid,
      InherentOverweight: err_ParaInherent_InherentOverweight,
      DisputeStatementsUnsortedOrDuplicates:
        err_ParaInherent_DisputeStatementsUnsortedOrDuplicates,
      DisputeInvalid: err_ParaInherent_DisputeInvalid,
    },
    {},
  ],
  ParaScheduler: [
    {
      ValidatorGroups: stg_ParaScheduler_ValidatorGroups,
      AvailabilityCores: stg_ParaScheduler_AvailabilityCores,
      SessionStartBlock: stg_ParaScheduler_SessionStartBlock,
      ClaimQueue: stg_ParaScheduler_ClaimQueue,
    },
    {},
    {},
    {},
    {},
  ],
  Paras: [
    {
      PvfActiveVoteMap: stg_Paras_PvfActiveVoteMap,
      PvfActiveVoteList: stg_Paras_PvfActiveVoteList,
      Parachains: stg_Paras_Parachains,
      ParaLifecycles: stg_Paras_ParaLifecycles,
      Heads: stg_Paras_Heads,
      MostRecentContext: stg_Paras_MostRecentContext,
      CurrentCodeHash: stg_Paras_CurrentCodeHash,
      PastCodeHash: stg_Paras_PastCodeHash,
      PastCodeMeta: stg_Paras_PastCodeMeta,
      PastCodePruning: stg_Paras_PastCodePruning,
      FutureCodeUpgrades: stg_Paras_FutureCodeUpgrades,
      FutureCodeHash: stg_Paras_FutureCodeHash,
      UpgradeGoAheadSignal: stg_Paras_UpgradeGoAheadSignal,
      UpgradeRestrictionSignal: stg_Paras_UpgradeRestrictionSignal,
      UpgradeCooldowns: stg_Paras_UpgradeCooldowns,
      UpcomingUpgrades: stg_Paras_UpcomingUpgrades,
      ActionsQueue: stg_Paras_ActionsQueue,
      UpcomingParasGenesis: stg_Paras_UpcomingParasGenesis,
      CodeByHashRefs: stg_Paras_CodeByHashRefs,
      CodeByHash: stg_Paras_CodeByHash,
    },
    {
      force_set_current_code: call_Paras_force_set_current_code,
      force_set_current_head: call_Paras_force_set_current_head,
      force_schedule_code_upgrade: call_Paras_force_schedule_code_upgrade,
      force_note_new_head: call_Paras_force_note_new_head,
      force_queue_action: call_Paras_force_queue_action,
      add_trusted_validation_code: call_Paras_add_trusted_validation_code,
      poke_unused_validation_code: call_Paras_poke_unused_validation_code,
      include_pvf_check_statement: call_Paras_include_pvf_check_statement,
      force_set_most_recent_context: call_Paras_force_set_most_recent_context,
    },
    {
      CurrentCodeUpdated: evt_Paras_CurrentCodeUpdated,
      CurrentHeadUpdated: evt_Paras_CurrentHeadUpdated,
      CodeUpgradeScheduled: evt_Paras_CodeUpgradeScheduled,
      NewHeadNoted: evt_Paras_NewHeadNoted,
      ActionQueued: evt_Paras_ActionQueued,
      PvfCheckStarted: evt_Paras_PvfCheckStarted,
      PvfCheckAccepted: evt_Paras_PvfCheckAccepted,
      PvfCheckRejected: evt_Paras_PvfCheckRejected,
    },
    {
      NotRegistered: err_Paras_NotRegistered,
      CannotOnboard: err_Paras_CannotOnboard,
      CannotOffboard: err_Paras_CannotOffboard,
      CannotUpgrade: err_Paras_CannotUpgrade,
      CannotDowngrade: err_Paras_CannotDowngrade,
      PvfCheckStatementStale: err_Paras_PvfCheckStatementStale,
      PvfCheckStatementFuture: err_Paras_PvfCheckStatementFuture,
      PvfCheckValidatorIndexOutOfBounds:
        err_Paras_PvfCheckValidatorIndexOutOfBounds,
      PvfCheckInvalidSignature: err_Paras_PvfCheckInvalidSignature,
      PvfCheckDoubleVote: err_Paras_PvfCheckDoubleVote,
      PvfCheckSubjectInvalid: err_Paras_PvfCheckSubjectInvalid,
      CannotUpgradeCode: err_Paras_CannotUpgradeCode,
    },
    { UnsignedPriority: const_Paras_UnsignedPriority },
  ],
  Initializer: [
    {
      HasInitialized: stg_Initializer_HasInitialized,
      BufferedSessionChanges: stg_Initializer_BufferedSessionChanges,
    },
    { force_approve: call_Initializer_force_approve },
    {},
    {},
    {},
  ],
  Dmp: [
    {
      DownwardMessageQueues: stg_Dmp_DownwardMessageQueues,
      DownwardMessageQueueHeads: stg_Dmp_DownwardMessageQueueHeads,
      DeliveryFeeFactor: stg_Dmp_DeliveryFeeFactor,
    },
    {},
    {},
    {},
    {},
  ],
  Hrmp: [
    {
      HrmpOpenChannelRequests: stg_Hrmp_HrmpOpenChannelRequests,
      HrmpOpenChannelRequestsList: stg_Hrmp_HrmpOpenChannelRequestsList,
      HrmpOpenChannelRequestCount: stg_Hrmp_HrmpOpenChannelRequestCount,
      HrmpAcceptedChannelRequestCount: stg_Hrmp_HrmpAcceptedChannelRequestCount,
      HrmpCloseChannelRequests: stg_Hrmp_HrmpCloseChannelRequests,
      HrmpCloseChannelRequestsList: stg_Hrmp_HrmpCloseChannelRequestsList,
      HrmpWatermarks: stg_Hrmp_HrmpWatermarks,
      HrmpChannels: stg_Hrmp_HrmpChannels,
      HrmpIngressChannelsIndex: stg_Hrmp_HrmpIngressChannelsIndex,
      HrmpEgressChannelsIndex: stg_Hrmp_HrmpEgressChannelsIndex,
      HrmpChannelContents: stg_Hrmp_HrmpChannelContents,
      HrmpChannelDigests: stg_Hrmp_HrmpChannelDigests,
    },
    {
      hrmp_init_open_channel: call_Hrmp_hrmp_init_open_channel,
      hrmp_accept_open_channel: call_Hrmp_hrmp_accept_open_channel,
      hrmp_close_channel: call_Hrmp_hrmp_close_channel,
      force_clean_hrmp: call_Hrmp_force_clean_hrmp,
      force_process_hrmp_open: call_Hrmp_force_process_hrmp_open,
      force_process_hrmp_close: call_Hrmp_force_process_hrmp_close,
      hrmp_cancel_open_request: call_Hrmp_hrmp_cancel_open_request,
      force_open_hrmp_channel: call_Hrmp_force_open_hrmp_channel,
      establish_system_channel: call_Hrmp_establish_system_channel,
      poke_channel_deposits: call_Hrmp_poke_channel_deposits,
    },
    {
      OpenChannelRequested: evt_Hrmp_OpenChannelRequested,
      OpenChannelCanceled: evt_Hrmp_OpenChannelCanceled,
      OpenChannelAccepted: evt_Hrmp_OpenChannelAccepted,
      ChannelClosed: evt_Hrmp_ChannelClosed,
      HrmpChannelForceOpened: evt_Hrmp_HrmpChannelForceOpened,
      HrmpSystemChannelOpened: evt_Hrmp_HrmpSystemChannelOpened,
      OpenChannelDepositsUpdated: evt_Hrmp_OpenChannelDepositsUpdated,
    },
    {
      OpenHrmpChannelToSelf: err_Hrmp_OpenHrmpChannelToSelf,
      OpenHrmpChannelInvalidRecipient: err_Hrmp_OpenHrmpChannelInvalidRecipient,
      OpenHrmpChannelZeroCapacity: err_Hrmp_OpenHrmpChannelZeroCapacity,
      OpenHrmpChannelCapacityExceedsLimit:
        err_Hrmp_OpenHrmpChannelCapacityExceedsLimit,
      OpenHrmpChannelZeroMessageSize: err_Hrmp_OpenHrmpChannelZeroMessageSize,
      OpenHrmpChannelMessageSizeExceedsLimit:
        err_Hrmp_OpenHrmpChannelMessageSizeExceedsLimit,
      OpenHrmpChannelAlreadyExists: err_Hrmp_OpenHrmpChannelAlreadyExists,
      OpenHrmpChannelAlreadyRequested: err_Hrmp_OpenHrmpChannelAlreadyRequested,
      OpenHrmpChannelLimitExceeded: err_Hrmp_OpenHrmpChannelLimitExceeded,
      AcceptHrmpChannelDoesntExist: err_Hrmp_AcceptHrmpChannelDoesntExist,
      AcceptHrmpChannelAlreadyConfirmed:
        err_Hrmp_AcceptHrmpChannelAlreadyConfirmed,
      AcceptHrmpChannelLimitExceeded: err_Hrmp_AcceptHrmpChannelLimitExceeded,
      CloseHrmpChannelUnauthorized: err_Hrmp_CloseHrmpChannelUnauthorized,
      CloseHrmpChannelDoesntExist: err_Hrmp_CloseHrmpChannelDoesntExist,
      CloseHrmpChannelAlreadyUnderway: err_Hrmp_CloseHrmpChannelAlreadyUnderway,
      CancelHrmpOpenChannelUnauthorized:
        err_Hrmp_CancelHrmpOpenChannelUnauthorized,
      OpenHrmpChannelDoesntExist: err_Hrmp_OpenHrmpChannelDoesntExist,
      OpenHrmpChannelAlreadyConfirmed: err_Hrmp_OpenHrmpChannelAlreadyConfirmed,
      WrongWitness: err_Hrmp_WrongWitness,
      ChannelCreationNotAuthorized: err_Hrmp_ChannelCreationNotAuthorized,
    },
    {},
  ],
  ParaSessionInfo: [
    {
      AssignmentKeysUnsafe: stg_ParaSessionInfo_AssignmentKeysUnsafe,
      EarliestStoredSession: stg_ParaSessionInfo_EarliestStoredSession,
      Sessions: stg_ParaSessionInfo_Sessions,
      AccountKeys: stg_ParaSessionInfo_AccountKeys,
      SessionExecutorParams: stg_ParaSessionInfo_SessionExecutorParams,
    },
    {},
    {},
    {},
    {},
  ],
  ParasDisputes: [
    {
      LastPrunedSession: stg_ParasDisputes_LastPrunedSession,
      Disputes: stg_ParasDisputes_Disputes,
      BackersOnDisputes: stg_ParasDisputes_BackersOnDisputes,
      Included: stg_ParasDisputes_Included,
      Frozen: stg_ParasDisputes_Frozen,
    },
    { force_unfreeze: call_ParasDisputes_force_unfreeze },
    {
      DisputeInitiated: evt_ParasDisputes_DisputeInitiated,
      DisputeConcluded: evt_ParasDisputes_DisputeConcluded,
      Revert: evt_ParasDisputes_Revert,
    },
    {
      DuplicateDisputeStatementSets:
        err_ParasDisputes_DuplicateDisputeStatementSets,
      AncientDisputeStatement: err_ParasDisputes_AncientDisputeStatement,
      ValidatorIndexOutOfBounds: err_ParasDisputes_ValidatorIndexOutOfBounds,
      InvalidSignature: err_ParasDisputes_InvalidSignature,
      DuplicateStatement: err_ParasDisputes_DuplicateStatement,
      SingleSidedDispute: err_ParasDisputes_SingleSidedDispute,
      MaliciousBacker: err_ParasDisputes_MaliciousBacker,
      MissingBackingVotes: err_ParasDisputes_MissingBackingVotes,
      UnconfirmedDispute: err_ParasDisputes_UnconfirmedDispute,
    },
    {},
  ],
  ParasSlashing: [
    {
      UnappliedSlashes: stg_ParasSlashing_UnappliedSlashes,
      ValidatorSetCounts: stg_ParasSlashing_ValidatorSetCounts,
    },
    {
      report_dispute_lost_unsigned:
        call_ParasSlashing_report_dispute_lost_unsigned,
    },
    {},
    {
      InvalidKeyOwnershipProof: err_ParasSlashing_InvalidKeyOwnershipProof,
      InvalidSessionIndex: err_ParasSlashing_InvalidSessionIndex,
      InvalidCandidateHash: err_ParasSlashing_InvalidCandidateHash,
      InvalidValidatorIndex: err_ParasSlashing_InvalidValidatorIndex,
      ValidatorIndexIdMismatch: err_ParasSlashing_ValidatorIndexIdMismatch,
      DuplicateSlashingReport: err_ParasSlashing_DuplicateSlashingReport,
    },
    {},
  ],
  ParaAssignmentProvider: [{}, {}, {}, {}, {}],
  Registrar: [
    {
      PendingSwap: stg_Registrar_PendingSwap,
      Paras: stg_Registrar_Paras,
      NextFreeParaId: stg_Registrar_NextFreeParaId,
    },
    {
      register: call_Registrar_register,
      force_register: call_Registrar_force_register,
      deregister: call_Registrar_deregister,
      swap: call_Registrar_swap,
      remove_lock: call_Registrar_remove_lock,
      reserve: call_Registrar_reserve,
      add_lock: call_Registrar_add_lock,
      schedule_code_upgrade: call_Registrar_schedule_code_upgrade,
      set_current_head: call_Registrar_set_current_head,
    },
    {
      Registered: evt_Registrar_Registered,
      Deregistered: evt_Registrar_Deregistered,
      Reserved: evt_Registrar_Reserved,
      Swapped: evt_Registrar_Swapped,
    },
    {
      NotRegistered: err_Registrar_NotRegistered,
      AlreadyRegistered: err_Registrar_AlreadyRegistered,
      NotOwner: err_Registrar_NotOwner,
      CodeTooLarge: err_Registrar_CodeTooLarge,
      HeadDataTooLarge: err_Registrar_HeadDataTooLarge,
      NotParachain: err_Registrar_NotParachain,
      NotParathread: err_Registrar_NotParathread,
      CannotDeregister: err_Registrar_CannotDeregister,
      CannotDowngrade: err_Registrar_CannotDowngrade,
      CannotUpgrade: err_Registrar_CannotUpgrade,
      ParaLocked: err_Registrar_ParaLocked,
      NotReserved: err_Registrar_NotReserved,
      EmptyCode: err_Registrar_EmptyCode,
      CannotSwap: err_Registrar_CannotSwap,
    },
    {
      ParaDeposit: const_Registrar_ParaDeposit,
      DataDepositPerByte: const_Registrar_DataDepositPerByte,
    },
  ],
  Slots: [
    { Leases: stg_Slots_Leases },
    {
      force_lease: call_Slots_force_lease,
      clear_all_leases: call_Slots_clear_all_leases,
      trigger_onboard: call_Slots_trigger_onboard,
    },
    { NewLeasePeriod: evt_Slots_NewLeasePeriod, Leased: evt_Slots_Leased },
    {
      ParaNotOnboarding: err_Slots_ParaNotOnboarding,
      LeaseError: err_Slots_LeaseError,
    },
    {
      LeasePeriod: const_Slots_LeasePeriod,
      LeaseOffset: const_Slots_LeaseOffset,
    },
  ],
  Auctions: [
    {
      AuctionCounter: stg_Auctions_AuctionCounter,
      AuctionInfo: stg_Auctions_AuctionInfo,
      ReservedAmounts: stg_Auctions_ReservedAmounts,
      Winning: stg_Auctions_Winning,
    },
    {
      new_auction: call_Auctions_new_auction,
      bid: call_Auctions_bid,
      cancel_auction: call_Auctions_cancel_auction,
    },
    {
      AuctionStarted: evt_Auctions_AuctionStarted,
      AuctionClosed: evt_Auctions_AuctionClosed,
      Reserved: evt_Auctions_Reserved,
      Unreserved: evt_Auctions_Unreserved,
      ReserveConfiscated: evt_Auctions_ReserveConfiscated,
      BidAccepted: evt_Auctions_BidAccepted,
      WinningOffset: evt_Auctions_WinningOffset,
    },
    {
      AuctionInProgress: err_Auctions_AuctionInProgress,
      LeasePeriodInPast: err_Auctions_LeasePeriodInPast,
      ParaNotRegistered: err_Auctions_ParaNotRegistered,
      NotCurrentAuction: err_Auctions_NotCurrentAuction,
      NotAuction: err_Auctions_NotAuction,
      AuctionEnded: err_Auctions_AuctionEnded,
      AlreadyLeasedOut: err_Auctions_AlreadyLeasedOut,
    },
    {
      EndingPeriod: const_Auctions_EndingPeriod,
      SampleLength: const_Auctions_SampleLength,
      SlotRangeCount: const_Auctions_SlotRangeCount,
      LeasePeriodsPerSlot: const_Auctions_LeasePeriodsPerSlot,
    },
  ],
  Crowdloan: [
    {
      Funds: stg_Crowdloan_Funds,
      NewRaise: stg_Crowdloan_NewRaise,
      EndingsCount: stg_Crowdloan_EndingsCount,
      NextFundIndex: stg_Crowdloan_NextFundIndex,
    },
    {
      create: call_Crowdloan_create,
      contribute: call_Crowdloan_contribute,
      withdraw: call_Crowdloan_withdraw,
      refund: call_Crowdloan_refund,
      dissolve: call_Crowdloan_dissolve,
      edit: call_Crowdloan_edit,
      add_memo: call_Crowdloan_add_memo,
      poke: call_Crowdloan_poke,
      contribute_all: call_Crowdloan_contribute_all,
    },
    {
      Created: evt_Crowdloan_Created,
      Contributed: evt_Crowdloan_Contributed,
      Withdrew: evt_Crowdloan_Withdrew,
      PartiallyRefunded: evt_Crowdloan_PartiallyRefunded,
      AllRefunded: evt_Crowdloan_AllRefunded,
      Dissolved: evt_Crowdloan_Dissolved,
      HandleBidResult: evt_Crowdloan_HandleBidResult,
      Edited: evt_Crowdloan_Edited,
      MemoUpdated: evt_Crowdloan_MemoUpdated,
      AddedToNewRaise: evt_Crowdloan_AddedToNewRaise,
    },
    {
      FirstPeriodInPast: err_Crowdloan_FirstPeriodInPast,
      FirstPeriodTooFarInFuture: err_Crowdloan_FirstPeriodTooFarInFuture,
      LastPeriodBeforeFirstPeriod: err_Crowdloan_LastPeriodBeforeFirstPeriod,
      LastPeriodTooFarInFuture: err_Crowdloan_LastPeriodTooFarInFuture,
      CannotEndInPast: err_Crowdloan_CannotEndInPast,
      EndTooFarInFuture: err_Crowdloan_EndTooFarInFuture,
      Overflow: err_Crowdloan_Overflow,
      ContributionTooSmall: err_Crowdloan_ContributionTooSmall,
      InvalidParaId: err_Crowdloan_InvalidParaId,
      CapExceeded: err_Crowdloan_CapExceeded,
      ContributionPeriodOver: err_Crowdloan_ContributionPeriodOver,
      InvalidOrigin: err_Crowdloan_InvalidOrigin,
      NotParachain: err_Crowdloan_NotParachain,
      LeaseActive: err_Crowdloan_LeaseActive,
      BidOrLeaseActive: err_Crowdloan_BidOrLeaseActive,
      FundNotEnded: err_Crowdloan_FundNotEnded,
      NoContributions: err_Crowdloan_NoContributions,
      NotReadyToDissolve: err_Crowdloan_NotReadyToDissolve,
      InvalidSignature: err_Crowdloan_InvalidSignature,
      MemoTooLarge: err_Crowdloan_MemoTooLarge,
      AlreadyInNewRaise: err_Crowdloan_AlreadyInNewRaise,
      VrfDelayInProgress: err_Crowdloan_VrfDelayInProgress,
      NoLeasePeriod: err_Crowdloan_NoLeasePeriod,
    },
    {
      PalletId: const_Crowdloan_PalletId,
      MinContribution: const_Crowdloan_MinContribution,
      RemoveKeysLimit: const_Crowdloan_RemoveKeysLimit,
    },
  ],
  XcmPallet: [
    {
      QueryCounter: stg_XcmPallet_QueryCounter,
      Queries: stg_XcmPallet_Queries,
      AssetTraps: stg_XcmPallet_AssetTraps,
      SafeXcmVersion: stg_XcmPallet_SafeXcmVersion,
      SupportedVersion: stg_XcmPallet_SupportedVersion,
      VersionNotifiers: stg_XcmPallet_VersionNotifiers,
      VersionNotifyTargets: stg_XcmPallet_VersionNotifyTargets,
      VersionDiscoveryQueue: stg_XcmPallet_VersionDiscoveryQueue,
      CurrentMigration: stg_XcmPallet_CurrentMigration,
      RemoteLockedFungibles: stg_XcmPallet_RemoteLockedFungibles,
      LockedFungibles: stg_XcmPallet_LockedFungibles,
      XcmExecutionSuspended: stg_XcmPallet_XcmExecutionSuspended,
    },
    {
      send: call_XcmPallet_send,
      teleport_assets: call_XcmPallet_teleport_assets,
      reserve_transfer_assets: call_XcmPallet_reserve_transfer_assets,
      execute: call_XcmPallet_execute,
      force_xcm_version: call_XcmPallet_force_xcm_version,
      force_default_xcm_version: call_XcmPallet_force_default_xcm_version,
      force_subscribe_version_notify:
        call_XcmPallet_force_subscribe_version_notify,
      force_unsubscribe_version_notify:
        call_XcmPallet_force_unsubscribe_version_notify,
      limited_reserve_transfer_assets:
        call_XcmPallet_limited_reserve_transfer_assets,
      limited_teleport_assets: call_XcmPallet_limited_teleport_assets,
      force_suspension: call_XcmPallet_force_suspension,
    },
    {
      Attempted: evt_XcmPallet_Attempted,
      Sent: evt_XcmPallet_Sent,
      UnexpectedResponse: evt_XcmPallet_UnexpectedResponse,
      ResponseReady: evt_XcmPallet_ResponseReady,
      Notified: evt_XcmPallet_Notified,
      NotifyOverweight: evt_XcmPallet_NotifyOverweight,
      NotifyDispatchError: evt_XcmPallet_NotifyDispatchError,
      NotifyDecodeFailed: evt_XcmPallet_NotifyDecodeFailed,
      InvalidResponder: evt_XcmPallet_InvalidResponder,
      InvalidResponderVersion: evt_XcmPallet_InvalidResponderVersion,
      ResponseTaken: evt_XcmPallet_ResponseTaken,
      AssetsTrapped: evt_XcmPallet_AssetsTrapped,
      VersionChangeNotified: evt_XcmPallet_VersionChangeNotified,
      SupportedVersionChanged: evt_XcmPallet_SupportedVersionChanged,
      NotifyTargetSendFail: evt_XcmPallet_NotifyTargetSendFail,
      NotifyTargetMigrationFail: evt_XcmPallet_NotifyTargetMigrationFail,
      InvalidQuerierVersion: evt_XcmPallet_InvalidQuerierVersion,
      InvalidQuerier: evt_XcmPallet_InvalidQuerier,
      VersionNotifyStarted: evt_XcmPallet_VersionNotifyStarted,
      VersionNotifyRequested: evt_XcmPallet_VersionNotifyRequested,
      VersionNotifyUnrequested: evt_XcmPallet_VersionNotifyUnrequested,
      FeesPaid: evt_XcmPallet_FeesPaid,
      AssetsClaimed: evt_XcmPallet_AssetsClaimed,
    },
    {
      Unreachable: err_XcmPallet_Unreachable,
      SendFailure: err_XcmPallet_SendFailure,
      Filtered: err_XcmPallet_Filtered,
      UnweighableMessage: err_XcmPallet_UnweighableMessage,
      DestinationNotInvertible: err_XcmPallet_DestinationNotInvertible,
      Empty: err_XcmPallet_Empty,
      CannotReanchor: err_XcmPallet_CannotReanchor,
      TooManyAssets: err_XcmPallet_TooManyAssets,
      InvalidOrigin: err_XcmPallet_InvalidOrigin,
      BadVersion: err_XcmPallet_BadVersion,
      BadLocation: err_XcmPallet_BadLocation,
      NoSubscription: err_XcmPallet_NoSubscription,
      AlreadySubscribed: err_XcmPallet_AlreadySubscribed,
      InvalidAsset: err_XcmPallet_InvalidAsset,
      LowBalance: err_XcmPallet_LowBalance,
      TooManyLocks: err_XcmPallet_TooManyLocks,
      AccountNotSovereign: err_XcmPallet_AccountNotSovereign,
      FeesNotMet: err_XcmPallet_FeesNotMet,
      LockNotFound: err_XcmPallet_LockNotFound,
      InUse: err_XcmPallet_InUse,
    },
    {},
  ],
  MessageQueue: [
    {
      BookStateFor: stg_MessageQueue_BookStateFor,
      ServiceHead: stg_MessageQueue_ServiceHead,
      Pages: stg_MessageQueue_Pages,
    },
    {
      reap_page: call_MessageQueue_reap_page,
      execute_overweight: call_MessageQueue_execute_overweight,
    },
    {
      ProcessingFailed: evt_MessageQueue_ProcessingFailed,
      Processed: evt_MessageQueue_Processed,
      OverweightEnqueued: evt_MessageQueue_OverweightEnqueued,
      PageReaped: evt_MessageQueue_PageReaped,
    },
    {
      NotReapable: err_MessageQueue_NotReapable,
      NoPage: err_MessageQueue_NoPage,
      NoMessage: err_MessageQueue_NoMessage,
      AlreadyProcessed: err_MessageQueue_AlreadyProcessed,
      Queued: err_MessageQueue_Queued,
      InsufficientWeight: err_MessageQueue_InsufficientWeight,
      TemporarilyUnprocessable: err_MessageQueue_TemporarilyUnprocessable,
      QueuePaused: err_MessageQueue_QueuePaused,
    },
    {
      HeapSize: const_MessageQueue_HeapSize,
      MaxStale: const_MessageQueue_MaxStale,
      ServiceWeight: const_MessageQueue_ServiceWeight,
    },
  ],
  AssetRate: [
    { ConversionRateToNative: stg_AssetRate_ConversionRateToNative },
    {
      create: call_AssetRate_create,
      update: call_AssetRate_update,
      remove: call_AssetRate_remove,
    },
    {
      AssetRateCreated: evt_AssetRate_AssetRateCreated,
      AssetRateRemoved: evt_AssetRate_AssetRateRemoved,
      AssetRateUpdated: evt_AssetRate_AssetRateUpdated,
    },
    {
      UnknownAssetKind: err_AssetRate_UnknownAssetKind,
      AlreadyExists: err_AssetRate_AlreadyExists,
    },
    {},
  ],
  Beefy: [
    {
      Authorities: stg_Beefy_Authorities,
      ValidatorSetId: stg_Beefy_ValidatorSetId,
      NextAuthorities: stg_Beefy_NextAuthorities,
      SetIdSession: stg_Beefy_SetIdSession,
      GenesisBlock: stg_Beefy_GenesisBlock,
    },
    {
      report_equivocation: call_Beefy_report_equivocation,
      report_equivocation_unsigned: call_Beefy_report_equivocation_unsigned,
      set_new_genesis: call_Beefy_set_new_genesis,
    },
    {},
    {
      InvalidKeyOwnershipProof: err_Beefy_InvalidKeyOwnershipProof,
      InvalidEquivocationProof: err_Beefy_InvalidEquivocationProof,
      DuplicateOffenceReport: err_Beefy_DuplicateOffenceReport,
      InvalidConfiguration: err_Beefy_InvalidConfiguration,
    },
    {
      MaxAuthorities: const_Beefy_MaxAuthorities,
      MaxNominators: const_Beefy_MaxNominators,
      MaxSetIdSessionEntries: const_Beefy_MaxSetIdSessionEntries,
    },
  ],
  Mmr: [
    {
      RootHash: stg_Mmr_RootHash,
      NumberOfLeaves: stg_Mmr_NumberOfLeaves,
      Nodes: stg_Mmr_Nodes,
    },
    {},
    {},
    {},
    {},
  ],
  BeefyMmrLeaf: [
    {
      BeefyAuthorities: stg_BeefyMmrLeaf_BeefyAuthorities,
      BeefyNextAuthorities: stg_BeefyMmrLeaf_BeefyNextAuthorities,
    },
    {},
    {},
    {},
    {},
  ],
}

type IRuntimeCalls = {
  /**
   * The `Core` runtime api that every Substrate runtime needs to implement.
   */
  Core: {
    /**
     * Returns the version of the runtime.
     */
    version: RuntimeDescriptor<
      [],
      {
        spec_name: string
        impl_name: string
        authoring_version: number
        spec_version: number
        impl_version: number
        apis: Anonymize<I1st1p92iu8h7e>
        transaction_version: number
        state_version: number
      }
    >

    /**
     * Execute the given block.
     */
    execute_block: RuntimeDescriptor<
      [
        block: {
          header: Anonymize<I6t1nedlt7mobn>
          extrinsics: Anonymize<Itom7fk49o0c9>
        },
      ],
      undefined
    >

    /**
     * Initialize a block with the given header.
     */
    initialize_block: RuntimeDescriptor<
      [
        header: {
          parent_hash: Binary
          number: number
          state_root: Binary
          extrinsics_root: Binary
          digest: Anonymize<Idin6nhq46lvdj>
        },
      ],
      undefined
    >
  }

  /**
   * The `Metadata` api trait that returns metadata for the runtime.
   */
  Metadata: {
    /**
     * Returns the metadata of a runtime.
     */
    metadata: RuntimeDescriptor<[], Binary>

    /**
     * Returns the metadata at a given version.
     *
     * If the given `version` isn't supported, this will return `None`.
     * Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.
     */
    metadata_at_version: RuntimeDescriptor<
      [version: number],
      Binary | undefined
    >

    /**
     * Returns the supported metadata versions.
     *
     * This can be used to call `metadata_at_version`.
     */
    metadata_versions: RuntimeDescriptor<[], Array<number>>
  }

  /**
   * The `BlockBuilder` api trait that provides the required functionality for building a block.
   */
  BlockBuilder: {
    /**
     * Apply the given extrinsic.
     *
     * Returns an inclusion outcome which specifies if this extrinsic is included in
     * this block or not.
     */
    apply_extrinsic: RuntimeDescriptor<
      [extrinsic: Binary],
      ResultPayload<Anonymize<Idtdr91jmq5g4i>, TransactionValidityError>
    >

    /**
     * Finish the current block.
     */
    finalize_block: RuntimeDescriptor<
      [],
      {
        parent_hash: Binary
        number: number
        state_root: Binary
        extrinsics_root: Binary
        digest: Anonymize<Idin6nhq46lvdj>
      }
    >

    /**
     * Generate inherent extrinsics. The inherent data will vary from chain to chain.
     */
    inherent_extrinsics: RuntimeDescriptor<
      [inherent: Array<Anonymize<I1kbn2golmm2dm>>],
      Array<Binary>
    >

    /**
     * Check that the inherents are valid. The inherent data will vary from chain to chain.
     */
    check_inherents: RuntimeDescriptor<
      [
        block: {
          header: Anonymize<I6t1nedlt7mobn>
          extrinsics: Anonymize<Itom7fk49o0c9>
        },
        data: Array<Anonymize<I1kbn2golmm2dm>>,
      ],
      { okay: boolean; fatal_error: boolean; errors: Anonymize<If39abi8floaaf> }
    >
  }

  /**
   * Runtime api for accessing information about nomination pools.
   */
  NominationPoolsApi: {
    /**
     * Returns the pending rewards for the member that the AccountId was given for.
     */
    pending_rewards: RuntimeDescriptor<[who: SS58String], bigint>

    /**
     * Returns the equivalent balance of `points` for a given pool.
     */
    points_to_balance: RuntimeDescriptor<
      [pool_id: number, points: bigint],
      bigint
    >

    /**
     * Returns the equivalent points of `new_funds` for a given pool.
     */
    balance_to_points: RuntimeDescriptor<
      [pool_id: number, new_funds: bigint],
      bigint
    >
  }

  /**

 */
  StakingApi: {
    /**
     * Returns the nominations quota for a nominator with a given balance.
     */
    nominations_quota: RuntimeDescriptor<[balance: bigint], number>
  }

  /**
   * The `TaggedTransactionQueue` api trait for interfering with the transaction queue.
   */
  TaggedTransactionQueue: {
    /**
     * Validate the transaction.
     *
     * This method is invoked by the transaction pool to learn details about given transaction.
     * The implementation should make sure to verify the correctness of the transaction
     * against current state. The given `block_hash` corresponds to the hash of the block
     * that is used as current state.
     *
     * Note that this call may be performed by the pool multiple times and transactions
     * might be verified in any possible order.
     */
    validate_transaction: RuntimeDescriptor<
      [
        source: TransactionValidityTransactionSource,
        tx: Binary,
        block_hash: Binary,
      ],
      ResultPayload<Anonymize<I6g5lcd9vf2cr0>, TransactionValidityError>
    >
  }

  /**
   * The offchain worker api.
   */
  OffchainWorkerApi: {
    /**
     * Starts the off-chain task for given block header.
     */
    offchain_worker: RuntimeDescriptor<
      [
        header: {
          parent_hash: Binary
          number: number
          state_root: Binary
          extrinsics_root: Binary
          digest: Anonymize<Idin6nhq46lvdj>
        },
      ],
      undefined
    >
  }

  /**
   * The API for querying the state of parachains on-chain.
   */
  ParachainHost: {
    /**
     * Get the current validators.
     */
    validators: RuntimeDescriptor<[], Array<Binary>>

    /**
     * Returns the validator groups and rotation info localized based on the hypothetical child
     *  of a block whose state  this is invoked on. Note that `now` in the `GroupRotationInfo`
     * should be the successor of the number of the block.
     */
    validator_groups: RuntimeDescriptor<
      [],
      [Anonymize<Iarlj3qd8u1v13>, Anonymize<I94uslvmqboam8>]
    >

    /**
     * Yields information on all availability cores as relevant to the child block.
     * Cores are either free or occupied. Free cores can have paras assigned to them.
     */
    availability_cores: RuntimeDescriptor<
      [],
      Array<PolkadotPrimitivesV5CoreState>
    >

    /**
     * Yields the persisted validation data for the given `ParaId` along with an assumption that
     * should be used if the para currently occupies a core.
     *
     * Returns `None` if either the para is not registered or the assumption is `Freed`
     * and the para already occupies a core.
     */
    persisted_validation_data: RuntimeDescriptor<
      [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
      Anonymize<I5r8ef6aie125l> | undefined
    >

    /**
     * Returns the persisted validation data for the given `ParaId` along with the corresponding
     * validation code hash. Instead of accepting assumption about the para, matches the validation
     * data hash against an expected one and yields `None` if they're not equal.
     */
    assumed_validation_data: RuntimeDescriptor<
      [para_id: number, expected_persisted_validation_data_hash: Binary],
      Anonymize<I9rov8gdjkv3b9> | undefined
    >

    /**
     * Checks if the given validation outputs pass the acceptance criteria.
     */
    check_validation_outputs: RuntimeDescriptor<
      [
        para_id: number,
        outputs: {
          upward_messages: Anonymize<Itom7fk49o0c9>
          horizontal_messages: Anonymize<I6r5cbv8ttrb09>
          new_validation_code: Anonymize<Iabpgqcjikia83>
          head_data: Binary
          processed_downward_messages: number
          hrmp_watermark: number
        },
      ],
      boolean
    >

    /**
     * Returns the session index expected at a child of the block.
     *
     * This can be used to instantiate a `SigningContext`.
     */
    session_index_for_child: RuntimeDescriptor<[], number>

    /**
     * Fetch the validation code used by a para, making the given `OccupiedCoreAssumption`.
     *
     * Returns `None` if either the para is not registered or the assumption is `Freed`
     * and the para already occupies a core.
     */
    validation_code: RuntimeDescriptor<
      [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
      Binary | undefined
    >

    /**
     * Get the receipt of a candidate pending availability. This returns `Some` for any paras
     * assigned to occupied cores in `availability_cores` and `None` otherwise.
     */
    candidate_pending_availability: RuntimeDescriptor<
      [para_id: number],
      Anonymize<Iedmhjqij0hr8g> | undefined
    >

    /**
     * Get a vector of events concerning candidates that occurred within a block.
     */
    candidate_events: RuntimeDescriptor<
      [],
      Array<PolkadotPrimitivesV5CandidateEvent>
    >

    /**
     * Get all the pending inbound messages in the downward message queue for a para.
     */
    dmq_contents: RuntimeDescriptor<
      [recipient: number],
      Array<Anonymize<I60847k37jfcc6>>
    >

    /**
     * Get the contents of all channels addressed to the given recipient. Channels that have no
     * messages in them are also included.
     */
    inbound_hrmp_channels_contents: RuntimeDescriptor<
      [recipient: number],
      Array<Anonymize<I9hvej6h53dqj0>>
    >

    /**
     * Get the validation code from its hash.
     */
    validation_code_by_hash: RuntimeDescriptor<
      [hash: Binary],
      Binary | undefined
    >

    /**
     * Scrape dispute relevant from on-chain, backing votes and resolved disputes.
     */
    on_chain_votes: RuntimeDescriptor<[], Anonymize<I3qttgoifdk5v6> | undefined>

    /**
     * Get the session info for the given session, if stored.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    session_info: RuntimeDescriptor<
      [index: number],
      Anonymize<I7k9oi9p83j43l> | undefined
    >

    /**
     * Submits a PVF pre-checking statement into the transaction pool.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    submit_pvf_check_statement: RuntimeDescriptor<
      [
        stmt: {
          accept: boolean
          subject: Binary
          session_index: number
          validator_index: number
        },
        signature: Binary,
      ],
      undefined
    >

    /**
     * Returns code hashes of PVFs that require pre-checking by validators in the active set.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    pvfs_require_precheck: RuntimeDescriptor<[], Array<Binary>>

    /**
     * Fetch the hash of the validation code used by a para, making the given `OccupiedCoreAssumption`.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    validation_code_hash: RuntimeDescriptor<
      [para_id: number, assumption: PolkadotPrimitivesV5OccupiedCoreAssumption],
      Binary | undefined
    >

    /**
     * Returns all onchain disputes.
     */
    disputes: RuntimeDescriptor<[], Array<Anonymize<Irsmd7gp7po60>>>

    /**
     * Returns execution parameters for the session.
     */
    session_executor_params: RuntimeDescriptor<
      [session_index: number],
      Anonymize<I6sbufrhmgqdb6> | undefined
    >

    /**
     * Returns a list of validators that lost a past session dispute and need to be slashed.
     * NOTE: This function is only available since parachain host version 5.
     */
    unapplied_slashes: RuntimeDescriptor<[], Array<Anonymize<I5ork0l271qluj>>>

    /**
     * Returns a merkle proof of a validator session key.
     * NOTE: This function is only available since parachain host version 5.
     */
    key_ownership_proof: RuntimeDescriptor<
      [validator_id: Binary],
      Binary | undefined
    >

    /**
     * Submit an unsigned extrinsic to slash validators who lost a dispute about
     * a candidate of a past session.
     * NOTE: This function is only available since parachain host version 5.
     */
    submit_report_dispute_lost: RuntimeDescriptor<
      [
        dispute_proof: {
          time_slot: Anonymize<Ib0p1u8q0nho37>
          kind: PolkadotPrimitivesV5SlashingSlashingOffenceKind
          validator_index: number
          validator_id: Binary
        },
        key_ownership_proof: Binary,
      ],
      boolean
    >

    /**
     * Get the minimum number of backing votes for a parachain candidate.
     * This is a staging method! Do not use on production runtimes!
     */
    minimum_backing_votes: RuntimeDescriptor<[], number>

    /**
     * Returns the state of parachain backing for a given para.
     */
    para_backing_state: RuntimeDescriptor<
      [_: number],
      Anonymize<I53uro0ns8ba5b> | undefined
    >

    /**
     * Returns candidate's acceptance limitations for asynchronous backing for a relay parent.
     */
    async_backing_params: RuntimeDescriptor<
      [],
      { max_candidate_depth: number; allowed_ancestry_len: number }
    >

    /**
     * Returns a list of all disabled validators at the given block.
     */
    disabled_validators: RuntimeDescriptor<[], Array<number>>
  }

  /**
   * API necessary for BEEFY voters.
   */
  BeefyApi: {
    /**
     * Return the block number where BEEFY consensus is enabled/started
     */
    beefy_genesis: RuntimeDescriptor<[], number | undefined>

    /**
     * Return the current active BEEFY validator set
     */
    validator_set: RuntimeDescriptor<[], Anonymize<I17bb7o70l1ke3> | undefined>

    /**
     * Submits an unsigned extrinsic to report an equivocation. The caller
     * must provide the equivocation proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
      [
        equivocation_proof: {
          first: Anonymize<Ifukb31gb9emjd>
          second: Anonymize<Ifukb31gb9emjd>
        },
        key_owner_proof: Binary,
      ],
      boolean
    >

    /**
     * Generates a proof of key ownership for the given authority in the
     * given set. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `set_id` as parameter the current
     * implementations ignores this parameter and instead relies on this
     * method being called at the correct block height, i.e. any point at
     * which the given set id is live on-chain. Future implementations will
     * instead use indexed data through an offchain worker, not requiring
     * older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [set_id: bigint, authority_id: Binary],
      Binary | undefined
    >
  }

  /**
   * API to interact with MMR pallet.
   */
  MmrApi: {
    /**
     * Return the on-chain MMR root hash.
     */
    mmr_root: RuntimeDescriptor<[], ResultPayload<Binary, MmrPrimitivesError>>

    /**
     * Return the number of MMR blocks in the chain.
     */
    mmr_leaf_count: RuntimeDescriptor<
      [],
      ResultPayload<bigint, MmrPrimitivesError>
    >

    /**
     * Generate MMR proof for a series of block numbers. If `best_known_block_number = Some(n)`,
     * use historical MMR state at given block height `n`. Else, use current MMR state.
     */
    generate_proof: RuntimeDescriptor<
      [
        block_numbers: Array<number>,
        best_known_block_number: number | undefined,
      ],
      ResultPayload<Anonymize<If93480lp8rssc>, MmrPrimitivesError>
    >

    /**
     * Verify MMR proof against on-chain MMR for a batch of leaves.
     *
     * Note this function will use on-chain MMR root hash and check if the proof matches the hash.
     * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
     * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [Proof]
     */
    verify_proof: RuntimeDescriptor<
      [
        leaves: Array<Binary>,
        proof: {
          leaf_indices: Anonymize<Iafqnechp3omqg>
          leaf_count: bigint
          items: Anonymize<Idhnf6rtqoslea>
        },
      ],
      ResultPayload<undefined, MmrPrimitivesError>
    >

    /**
     * Verify MMR proof against given root hash for a batch of leaves.
     *
     * Note this function does not require any on-chain storage - the
     * proof is verified against given MMR root hash.
     *
     * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
     * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [Proof]
     */
    verify_proof_stateless: RuntimeDescriptor<
      [
        root: Binary,
        leaves: Array<Binary>,
        proof: {
          leaf_indices: Anonymize<Iafqnechp3omqg>
          leaf_count: bigint
          items: Anonymize<Idhnf6rtqoslea>
        },
      ],
      ResultPayload<undefined, MmrPrimitivesError>
    >
  }

  /**
   * API useful for BEEFY light clients.
   */
  BeefyMmrApi: {
    /**
     * Return the currently active BEEFY authority set proof.
     */
    authority_set_proof: RuntimeDescriptor<
      [],
      { id: bigint; len: number; keyset_commitment: Binary }
    >

    /**
     * Return the next/queued BEEFY authority set proof.
     */
    next_authority_set_proof: RuntimeDescriptor<
      [],
      { id: bigint; len: number; keyset_commitment: Binary }
    >
  }

  /**
   * APIs for integrating the GRANDPA finality gadget into runtimes.
   * This should be implemented on the runtime side.
   *
   * This is primarily used for negotiating authority-set changes for the
   * gadget. GRANDPA uses a signaling model of changing authority sets:
   * changes should be signaled with a delay of N blocks, and then automatically
   * applied in the runtime after those N blocks have passed.
   *
   * The consensus protocol will coordinate the handoff externally.
   */
  GrandpaApi: {
    /**
     * Get the current GRANDPA authorities and weights. This should not change except
     * for when changes are scheduled and the corresponding delay has passed.
     *
     * When called at block B, it will return the set of authorities that should be
     * used to finalize descendants of this block (B+1, B+2, ...). The block B itself
     * is finalized by the authorities from block B-1.
     */
    grandpa_authorities: RuntimeDescriptor<[], Array<Anonymize<I3iuggguvi9njj>>>

    /**
     * Submits an unsigned extrinsic to report an equivocation. The caller
     * must provide the equivocation proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
      [
        equivocation_proof: {
          set_id: bigint
          equivocation: GrandpaEquivocation
        },
        key_owner_proof: Binary,
      ],
      boolean
    >

    /**
     * Generates a proof of key ownership for the given authority in the
     * given set. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `set_id` as parameter the current
     * implementations ignore this parameter and instead rely on this
     * method being called at the correct block height, i.e. any point at
     * which the given set id is live on-chain. Future implementations will
     * instead use indexed data through an offchain worker, not requiring
     * older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [set_id: bigint, authority_id: Binary],
      Binary | undefined
    >

    /**
     * Get current GRANDPA authority set id.
     */
    current_set_id: RuntimeDescriptor<[], bigint>
  }

  /**
   * API necessary for block authorship with BABE.
   */
  BabeApi: {
    /**
     * Return the configuration for BABE.
     */
    configuration: RuntimeDescriptor<
      [],
      {
        slot_duration: bigint
        epoch_length: bigint
        c: Anonymize<I2j729bmgsdiuo>
        authorities: Anonymize<I2qinct8jq4bqe>
        randomness: Binary
        allowed_slots: BabeAllowedSlots
      }
    >

    /**
     * Returns the slot that started the current epoch.
     */
    current_epoch_start: RuntimeDescriptor<[], bigint>

    /**
     * Returns information regarding the current epoch.
     */
    current_epoch: RuntimeDescriptor<
      [],
      {
        epoch_index: bigint
        start_slot: bigint
        duration: bigint
        authorities: Anonymize<I2qinct8jq4bqe>
        randomness: Binary
        config: Anonymize<Idkva8q2m9meg0>
      }
    >

    /**
     * Returns information regarding the next epoch (which was already
     * previously announced).
     */
    next_epoch: RuntimeDescriptor<
      [],
      {
        epoch_index: bigint
        start_slot: bigint
        duration: bigint
        authorities: Anonymize<I2qinct8jq4bqe>
        randomness: Binary
        config: Anonymize<Idkva8q2m9meg0>
      }
    >

    /**
     * Generates a proof of key ownership for the given authority in the
     * current epoch. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `slot` as parameter the current
     * implementations ignores this parameter and instead relies on this
     * method being called at the correct block height, i.e. any point at
     * which the epoch for the given slot is live on-chain. Future
     * implementations will instead use indexed data through an offchain
     * worker, not requiring older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [slot: bigint, authority_id: Binary],
      Binary | undefined
    >

    /**
     * Submits an unsigned extrinsic to report an equivocation. The caller
     * must provide the equivocation proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
      [
        equivocation_proof: {
          offender: Binary
          slot: bigint
          first_header: Anonymize<I6t1nedlt7mobn>
          second_header: Anonymize<I6t1nedlt7mobn>
        },
        key_owner_proof: Binary,
      ],
      boolean
    >
  }

  /**
   * The authority discovery api.
   *
   * This api is used by the `client/authority-discovery` module to retrieve identifiers
   * of the current and next authority set.
   */
  AuthorityDiscoveryApi: {
    /**
     * Retrieve authority identifiers of the current and next authority set.
     */
    authorities: RuntimeDescriptor<[], Array<Binary>>
  }

  /**
   * Session keys runtime api.
   */
  SessionKeys: {
    /**
     * Generate a set of session keys with optionally using the given seed.
     * The keys should be stored within the keystore exposed via runtime
     * externalities.
     *
     * The seed needs to be a valid `utf8` string.
     *
     * Returns the concatenated SCALE encoded public keys.
     */
    generate_session_keys: RuntimeDescriptor<[seed: Binary | undefined], Binary>

    /**
     * Decode the given public session keys.
     *
     * Returns the list of public raw public keys + key type.
     */
    decode_session_keys: RuntimeDescriptor<
      [encoded: Binary],
      Anonymize<I4gkfq1hbsjrle> | undefined
    >
  }

  /**
   * The API to query account nonce.
   */
  AccountNonceApi: {
    /**
     * Get current account nonce of given `AccountId`.
     */
    account_nonce: RuntimeDescriptor<[account: SS58String], number>
  }

  /**

 */
  TransactionPaymentApi: {
    /**

 */
    query_info: RuntimeDescriptor<
      [uxt: Binary, len: number],
      {
        weight: Anonymize<I4q39t5hn830vp>
        class: DispatchClass
        partial_fee: bigint
      }
    >

    /**

 */
    query_fee_details: RuntimeDescriptor<
      [uxt: Binary, len: number],
      { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
    >

    /**

 */
    query_weight_to_fee: RuntimeDescriptor<
      [weight: { ref_time: bigint; proof_size: bigint }],
      bigint
    >

    /**

 */
    query_length_to_fee: RuntimeDescriptor<[length: number], bigint>
  }

  /**

 */
  TransactionPaymentCallApi: {
    /**
     * Query information of a dispatch class, weight, and fee of a given encoded `Call`.
     */
    query_call_info: RuntimeDescriptor<
      [
        call: Anonymize<
          AnonymousEnum<{
            System: Anonymize<SystemPalletCall>
            Scheduler: Anonymize<I1abrp8gjcpfc>
            Preimage: Anonymize<Imbphi6s5kus8>
            Babe: Anonymize<BabePalletCall>
            Timestamp: Anonymize<TimestampPalletCall>
            Indices: Anonymize<IndicesPalletCall>
            Balances: Anonymize<Ibf8j84ii3a3kr>
            Staking: Anonymize<StakingPalletCall>
            Session: Anonymize<I454da453jskvn>
            Grandpa: Anonymize<GrandpaPalletCall>
            ImOnline: Anonymize<ImOnlinePalletCall>
            Treasury: Anonymize<Ibiic8ba5o502g>
            ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
            Referenda: Anonymize<ReferendaPalletCall>
            Whitelist: Anonymize<I51p8lm6kqdnho>
            Claims: Anonymize<ClaimsPalletCall>
            Vesting: Anonymize<VestingPalletCall>
            Utility: Anonymize<Iap9gdffi2u6nu>
            Identity: Anonymize<IdentityPalletCall>
            Proxy: Anonymize<Idedbf4rqpdmri>
            Multisig: Anonymize<Idd2oimlrnr76q>
            Bounties: Anonymize<BountiesPalletCall>
            ChildBounties: Anonymize<ChildBountiesPalletCall>
            ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
            VoterList: Anonymize<BagsListPalletCall>
            NominationPools: Anonymize<I29f4027kh5dho>
            FastUnstake: Anonymize<FastUnstakePalletCall>
            Configuration: Anonymize<ParachainsConfigurationPalletCall>
            ParasShared: Anonymize<undefined>
            ParaInclusion: Anonymize<undefined>
            ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
            Paras: Anonymize<ParachainsParasPalletCall>
            Initializer: Anonymize<ParachainsInitializerPalletCall>
            Hrmp: Anonymize<I2vev2224bc186>
            ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
            ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
            Registrar: Anonymize<CommonParasRegistrarPalletCall>
            Slots: Anonymize<CommonSlotsPalletCall>
            Auctions: Anonymize<CommonAuctionsPalletCall>
            Crowdloan: Anonymize<CommonCrowdloanPalletCall>
            XcmPallet: Anonymize<XcmPalletCall>
            MessageQueue: Anonymize<MessageQueuePalletCall>
            AssetRate: Anonymize<I2gv42mnmfo4fm>
            Beefy: Anonymize<Ibeddosggop7dd>
          }>
        >,
        len: number,
      ],
      {
        weight: Anonymize<I4q39t5hn830vp>
        class: DispatchClass
        partial_fee: bigint
      }
    >

    /**
     * Query fee details of a given encoded `Call`.
     */
    query_call_fee_details: RuntimeDescriptor<
      [
        call: Anonymize<
          AnonymousEnum<{
            System: Anonymize<SystemPalletCall>
            Scheduler: Anonymize<I1abrp8gjcpfc>
            Preimage: Anonymize<Imbphi6s5kus8>
            Babe: Anonymize<BabePalletCall>
            Timestamp: Anonymize<TimestampPalletCall>
            Indices: Anonymize<IndicesPalletCall>
            Balances: Anonymize<Ibf8j84ii3a3kr>
            Staking: Anonymize<StakingPalletCall>
            Session: Anonymize<I454da453jskvn>
            Grandpa: Anonymize<GrandpaPalletCall>
            ImOnline: Anonymize<ImOnlinePalletCall>
            Treasury: Anonymize<Ibiic8ba5o502g>
            ConvictionVoting: Anonymize<ConvictionVotingPalletCall>
            Referenda: Anonymize<ReferendaPalletCall>
            Whitelist: Anonymize<I51p8lm6kqdnho>
            Claims: Anonymize<ClaimsPalletCall>
            Vesting: Anonymize<VestingPalletCall>
            Utility: Anonymize<Iap9gdffi2u6nu>
            Identity: Anonymize<IdentityPalletCall>
            Proxy: Anonymize<Idedbf4rqpdmri>
            Multisig: Anonymize<Idd2oimlrnr76q>
            Bounties: Anonymize<BountiesPalletCall>
            ChildBounties: Anonymize<ChildBountiesPalletCall>
            ElectionProviderMultiPhase: Anonymize<ElectionProviderMultiPhasePalletCall>
            VoterList: Anonymize<BagsListPalletCall>
            NominationPools: Anonymize<I29f4027kh5dho>
            FastUnstake: Anonymize<FastUnstakePalletCall>
            Configuration: Anonymize<ParachainsConfigurationPalletCall>
            ParasShared: Anonymize<undefined>
            ParaInclusion: Anonymize<undefined>
            ParaInherent: Anonymize<ParachainsParasInherentPalletCall>
            Paras: Anonymize<ParachainsParasPalletCall>
            Initializer: Anonymize<ParachainsInitializerPalletCall>
            Hrmp: Anonymize<I2vev2224bc186>
            ParasDisputes: Anonymize<ParachainsDisputesPalletCall>
            ParasSlashing: Anonymize<ParachainsDisputesSlashingPalletCall>
            Registrar: Anonymize<CommonParasRegistrarPalletCall>
            Slots: Anonymize<CommonSlotsPalletCall>
            Auctions: Anonymize<CommonAuctionsPalletCall>
            Crowdloan: Anonymize<CommonCrowdloanPalletCall>
            XcmPallet: Anonymize<XcmPalletCall>
            MessageQueue: Anonymize<MessageQueuePalletCall>
            AssetRate: Anonymize<I2gv42mnmfo4fm>
            Beefy: Anonymize<Ibeddosggop7dd>
          }>
        >,
        len: number,
      ],
      { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
    >

    /**
     * Query the output of the current `WeightToFee` given some input.
     */
    query_weight_to_fee: RuntimeDescriptor<
      [weight: { ref_time: bigint; proof_size: bigint }],
      bigint
    >

    /**
     * Query the output of the current `LengthToFee` given some input.
     */
    query_length_to_fee: RuntimeDescriptor<[length: number], bigint>
  }

  /**
   * API to interact with GenesisConfig for the runtime
   */
  GenesisBuilder: {
    /**
     * Creates the default `GenesisConfig` and returns it as a JSON blob.
     *
     * This function instantiates the default `GenesisConfig` struct for the runtime and serializes it into a JSON
     * blob. It returns a `Vec<u8>` containing the JSON representation of the default `GenesisConfig`.
     */
    create_default_config: RuntimeDescriptor<[], Binary>

    /**
     * Build `GenesisConfig` from a JSON blob not using any defaults and store it in the storage.
     *
     * This function deserializes the full `GenesisConfig` from the given JSON blob and puts it into the storage.
     * If the provided JSON blob is incorrect or incomplete or the deserialization fails, an error is returned.
     * It is recommended to log any errors encountered during the process.
     *
     * Please note that provided json blob must contain all `GenesisConfig` fields, no defaults will be used.
     */
    build_config: RuntimeDescriptor<
      [json: Binary],
      ResultPayload<undefined, string>
    >
  }
}
export const apis: IRuntimeCalls = {
  Core: {
    version: runtime_Core_version,
    execute_block: runtime_Core_execute_block,
    initialize_block: runtime_Core_initialize_block,
  },
  Metadata: {
    metadata: runtime_Metadata_metadata,
    metadata_at_version: runtime_Metadata_metadata_at_version,
    metadata_versions: runtime_Metadata_metadata_versions,
  },
  BlockBuilder: {
    apply_extrinsic: runtime_BlockBuilder_apply_extrinsic,
    finalize_block: runtime_BlockBuilder_finalize_block,
    inherent_extrinsics: runtime_BlockBuilder_inherent_extrinsics,
    check_inherents: runtime_BlockBuilder_check_inherents,
  },
  NominationPoolsApi: {
    pending_rewards: runtime_NominationPoolsApi_pending_rewards,
    points_to_balance: runtime_NominationPoolsApi_points_to_balance,
    balance_to_points: runtime_NominationPoolsApi_balance_to_points,
  },
  StakingApi: { nominations_quota: runtime_StakingApi_nominations_quota },
  TaggedTransactionQueue: {
    validate_transaction: runtime_TaggedTransactionQueue_validate_transaction,
  },
  OffchainWorkerApi: {
    offchain_worker: runtime_OffchainWorkerApi_offchain_worker,
  },
  ParachainHost: {
    validators: runtime_ParachainHost_validators,
    validator_groups: runtime_ParachainHost_validator_groups,
    availability_cores: runtime_ParachainHost_availability_cores,
    persisted_validation_data: runtime_ParachainHost_persisted_validation_data,
    assumed_validation_data: runtime_ParachainHost_assumed_validation_data,
    check_validation_outputs: runtime_ParachainHost_check_validation_outputs,
    session_index_for_child: runtime_ParachainHost_session_index_for_child,
    validation_code: runtime_ParachainHost_validation_code,
    candidate_pending_availability:
      runtime_ParachainHost_candidate_pending_availability,
    candidate_events: runtime_ParachainHost_candidate_events,
    dmq_contents: runtime_ParachainHost_dmq_contents,
    inbound_hrmp_channels_contents:
      runtime_ParachainHost_inbound_hrmp_channels_contents,
    validation_code_by_hash: runtime_ParachainHost_validation_code_by_hash,
    on_chain_votes: runtime_ParachainHost_on_chain_votes,
    session_info: runtime_ParachainHost_session_info,
    submit_pvf_check_statement:
      runtime_ParachainHost_submit_pvf_check_statement,
    pvfs_require_precheck: runtime_ParachainHost_pvfs_require_precheck,
    validation_code_hash: runtime_ParachainHost_validation_code_hash,
    disputes: runtime_ParachainHost_disputes,
    session_executor_params: runtime_ParachainHost_session_executor_params,
    unapplied_slashes: runtime_ParachainHost_unapplied_slashes,
    key_ownership_proof: runtime_ParachainHost_key_ownership_proof,
    submit_report_dispute_lost:
      runtime_ParachainHost_submit_report_dispute_lost,
    minimum_backing_votes: runtime_ParachainHost_minimum_backing_votes,
    para_backing_state: runtime_ParachainHost_para_backing_state,
    async_backing_params: runtime_ParachainHost_async_backing_params,
    disabled_validators: runtime_ParachainHost_disabled_validators,
  },
  BeefyApi: {
    beefy_genesis: runtime_BeefyApi_beefy_genesis,
    validator_set: runtime_BeefyApi_validator_set,
    submit_report_equivocation_unsigned_extrinsic:
      runtime_BeefyApi_submit_report_equivocation_unsigned_extrinsic,
    generate_key_ownership_proof: runtime_BeefyApi_generate_key_ownership_proof,
  },
  MmrApi: {
    mmr_root: runtime_MmrApi_mmr_root,
    mmr_leaf_count: runtime_MmrApi_mmr_leaf_count,
    generate_proof: runtime_MmrApi_generate_proof,
    verify_proof: runtime_MmrApi_verify_proof,
    verify_proof_stateless: runtime_MmrApi_verify_proof_stateless,
  },
  BeefyMmrApi: {
    authority_set_proof: runtime_BeefyMmrApi_authority_set_proof,
    next_authority_set_proof: runtime_BeefyMmrApi_next_authority_set_proof,
  },
  GrandpaApi: {
    grandpa_authorities: runtime_GrandpaApi_grandpa_authorities,
    submit_report_equivocation_unsigned_extrinsic:
      runtime_GrandpaApi_submit_report_equivocation_unsigned_extrinsic,
    generate_key_ownership_proof:
      runtime_GrandpaApi_generate_key_ownership_proof,
    current_set_id: runtime_GrandpaApi_current_set_id,
  },
  BabeApi: {
    configuration: runtime_BabeApi_configuration,
    current_epoch_start: runtime_BabeApi_current_epoch_start,
    current_epoch: runtime_BabeApi_current_epoch,
    next_epoch: runtime_BabeApi_next_epoch,
    generate_key_ownership_proof: runtime_BabeApi_generate_key_ownership_proof,
    submit_report_equivocation_unsigned_extrinsic:
      runtime_BabeApi_submit_report_equivocation_unsigned_extrinsic,
  },
  AuthorityDiscoveryApi: {
    authorities: runtime_AuthorityDiscoveryApi_authorities,
  },
  SessionKeys: {
    generate_session_keys: runtime_SessionKeys_generate_session_keys,
    decode_session_keys: runtime_SessionKeys_decode_session_keys,
  },
  AccountNonceApi: { account_nonce: runtime_AccountNonceApi_account_nonce },
  TransactionPaymentApi: {
    query_info: runtime_TransactionPaymentApi_query_info,
    query_fee_details: runtime_TransactionPaymentApi_query_fee_details,
    query_weight_to_fee: runtime_TransactionPaymentApi_query_weight_to_fee,
    query_length_to_fee: runtime_TransactionPaymentApi_query_length_to_fee,
  },
  TransactionPaymentCallApi: {
    query_call_info: runtime_TransactionPaymentCallApi_query_call_info,
    query_call_fee_details:
      runtime_TransactionPaymentCallApi_query_call_fee_details,
    query_weight_to_fee: runtime_TransactionPaymentCallApi_query_weight_to_fee,
    query_length_to_fee: runtime_TransactionPaymentCallApi_query_length_to_fee,
  },
  GenesisBuilder: {
    create_default_config: runtime_GenesisBuilder_create_default_config,
    build_config: runtime_GenesisBuilder_build_config,
  },
}

type IAsset = PlainDescriptor<void>
const asset: IAsset = "" as IAsset

type IDescriptors = { pallets: IPallets; apis: IRuntimeCalls; asset: IAsset }
const _allDescriptors: IDescriptors = { pallets, apis, asset }
export default _allDescriptors

export type Queries = QueryFromDescriptors<IDescriptors>
export type Calls = TxFromDescriptors<IDescriptors>
export type Events = EventsFromDescriptors<IDescriptors>
export type Errors = ErrorsFromDescriptors<IDescriptors>
export type Constants = ConstFromDescriptors<IDescriptors>
