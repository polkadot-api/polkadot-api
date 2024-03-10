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

type I675elaq874cr7 = Array<Anonymize<Iepshjdsbc1nmq>>

type Iepshjdsbc1nmq = {
  phase: Phase
  event: Anonymize<Ifp71mf5sutvfn>
  topics: Anonymize<Idhnf6rtqoslea>
}

export type Phase = Enum<
  | { type: "ApplyExtrinsic"; value: Anonymize<number> }
  | { type: "Finalization"; value: undefined }
  | { type: "Initialization"; value: undefined }
>
export const Phase = _Enum as unknown as GetEnum<Phase>

type Ifp71mf5sutvfn = AnonymousEnum<{
  System: Anonymize<PalletEvent>
  ParachainSystem: Anonymize<Iav0g2u30ljnec>
  Balances: Anonymize<BalancesEvent>
  TransactionPayment: Anonymize<TransactionPaymentEvent>
  AssetTxPayment: Anonymize<I21mhhl8m4b79b>
  CollatorSelection: Anonymize<I2k46ltub59oi1>
  Session: Anonymize<SessionEvent>
  XcmpQueue: Anonymize<I94qdlrjig0c73>
  PolkadotXcm: Anonymize<XcmEvent>
  CumulusXcm: Anonymize<I8l8o4l0arhl3h>
  DmpQueue: Anonymize<Idq1303hvl1nc4>
  Utility: Anonymize<UtilityEvent>
  Multisig: Anonymize<MultisigEvent>
  Proxy: Anonymize<Ic34oed3t4vigg>
  Assets: Anonymize<Ie4o50pgs5mq4e>
  Uniques: Anonymize<Ia0j71vjrjqu9p>
  Nfts: Anonymize<Id31e45564s5of>
  ForeignAssets: Anonymize<I6tvd3rc3h20en>
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

type Iav0g2u30ljnec = AnonymousEnum<{
  ValidationFunctionStored: undefined
  ValidationFunctionApplied: Anonymize<Idd7hd99u0ho0n>
  ValidationFunctionDiscarded: undefined
  UpgradeAuthorized: Anonymize<I6a5n5ij3gomuo>
  DownwardMessagesReceived: Anonymize<Iafscmv8tjf0ou>
  DownwardMessagesProcessed: Anonymize<I7a3a6ua4hud3s>
  UpwardMessageSent: Anonymize<I4n7056p1k6c8b>
}>

type Idd7hd99u0ho0n = { relay_chain_block_num: number }

type I6a5n5ij3gomuo = { code_hash: Binary }

type Iafscmv8tjf0ou = { count: number }

type I7a3a6ua4hud3s = {
  weight_used: Anonymize<I4q39t5hn830vp>
  dmq_head: Binary
}

type I4n7056p1k6c8b = { message_hash: Anonymize<I17k3ujudqd5df> }

type I17k3ujudqd5df = Binary | undefined

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

type I21mhhl8m4b79b = AnonymousEnum<{
  AssetTxFeePaid: Anonymize<I94ss5ias99t8d>
}>

type I94ss5ias99t8d = {
  who: SS58String
  actual_fee: bigint
  tip: bigint
  asset_id: Anonymize<I4arjljr6dpflb>
}

type I4arjljr6dpflb = number | undefined

type I2k46ltub59oi1 = AnonymousEnum<{
  NewInvulnerables: Anonymize<I39t01nnod9109>
  InvulnerableAdded: Anonymize<I6v8sm60vvkmk7>
  InvulnerableRemoved: Anonymize<I6v8sm60vvkmk7>
  NewDesiredCandidates: Anonymize<I1qmtmbe5so8r3>
  NewCandidacyBond: Anonymize<Ih99m6ehpcar7>
  CandidateAdded: Anonymize<Idgorhsbgdq2ap>
  CandidateRemoved: Anonymize<I6v8sm60vvkmk7>
  InvalidInvulnerableSkipped: Anonymize<I6v8sm60vvkmk7>
}>

type I39t01nnod9109 = { invulnerables: Anonymize<Ia2lhg7l2hilo3> }

type Ia2lhg7l2hilo3 = Array<SS58String>

type I6v8sm60vvkmk7 = { account_id: SS58String }

type I1qmtmbe5so8r3 = { desired_candidates: number }

type Ih99m6ehpcar7 = { bond_amount: bigint }

type Idgorhsbgdq2ap = { account_id: SS58String; deposit: bigint }

export type SessionEvent = Enum<{
  type: "NewSession"
  value: Anonymize<I2hq50pu2kdjpo>
}>
export const SessionEvent = _Enum as unknown as GetEnum<SessionEvent>

type I2hq50pu2kdjpo = { session_index: number }

type I94qdlrjig0c73 = AnonymousEnum<{
  Success: Anonymize<I7nj4acpodcef4>
  Fail: Anonymize<I3n8ln6mqdfgb8>
  BadVersion: Anonymize<I2vo9trn8nhllu>
  BadFormat: Anonymize<I2vo9trn8nhllu>
  XcmpMessageSent: Anonymize<I2vo9trn8nhllu>
  OverweightEnqueued: Anonymize<If8b64mo2bodj0>
  OverweightServiced: Anonymize<Icu5p58ltu1veo>
}>

type I7nj4acpodcef4 = {
  message_hash: Binary
  message_id: Binary
  weight: Anonymize<I4q39t5hn830vp>
}

type I3n8ln6mqdfgb8 = {
  message_hash: Binary
  message_id: Binary
  error: XcmV3TraitsError
  weight: Anonymize<I4q39t5hn830vp>
}

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

type I2vo9trn8nhllu = { message_hash: Binary }

type If8b64mo2bodj0 = {
  sender: number
  sent_at: number
  index: bigint
  required: Anonymize<I4q39t5hn830vp>
}

type Icu5p58ltu1veo = { index: bigint; used: Anonymize<I4q39t5hn830vp> }

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

type Ia5b8kts5gt3p5 = {
  origin: Anonymize<I43cmiele6sevi>
  destination: Anonymize<I43cmiele6sevi>
  message: Anonymize<I8l0577387vghn>
  message_id: Binary
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

export type XcmV3MultiassetAssetId = Enum<
  | { type: "Concrete"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Abstract"; value: Anonymize<Binary> }
>
export const XcmV3MultiassetAssetId =
  _Enum as unknown as GetEnum<XcmV3MultiassetAssetId>

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

export type XcmVersionedMultiLocation = Enum<
  | { type: "V2"; value: Anonymize<Ibki0d249v3ojt> }
  | { type: "V3"; value: Anonymize<I43cmiele6sevi> }
>
export const XcmVersionedMultiLocation =
  _Enum as unknown as GetEnum<XcmVersionedMultiLocation>

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

type I8l8o4l0arhl3h = AnonymousEnum<{
  InvalidFormat: Anonymize<Binary>
  UnsupportedVersion: Anonymize<Binary>
  ExecutedDownward: Anonymize<Id0ii3t0e6fgob>
}>

type Id0ii3t0e6fgob = [Binary, XcmV3TraitsOutcome]

type Idq1303hvl1nc4 = AnonymousEnum<{
  InvalidFormat: Anonymize<I2vo9trn8nhllu>
  UnsupportedVersion: Anonymize<I2vo9trn8nhllu>
  ExecutedDownward: Anonymize<I6mr530l14uapg>
  WeightExhausted: Anonymize<I2ds5dc604t7si>
  OverweightEnqueued: Anonymize<Idqsknek3bsc0s>
  OverweightServiced: Anonymize<Ise9gq7rqlnvm>
  MaxMessagesExhausted: Anonymize<I2vo9trn8nhllu>
}>

type I6mr530l14uapg = {
  message_hash: Binary
  message_id: Binary
  outcome: XcmV3TraitsOutcome
}

type I2ds5dc604t7si = {
  message_hash: Binary
  message_id: Binary
  remaining_weight: Anonymize<I4q39t5hn830vp>
  required_weight: Anonymize<I4q39t5hn830vp>
}

type Idqsknek3bsc0s = {
  message_hash: Binary
  message_id: Binary
  overweight_index: bigint
  required_weight: Anonymize<I4q39t5hn830vp>
}

type Ise9gq7rqlnvm = {
  overweight_index: bigint
  weight_used: Anonymize<I4q39t5hn830vp>
}

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

type Idtdr91jmq5g4i = ResultPayload<undefined, DispatchError>

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

type Ic34oed3t4vigg = AnonymousEnum<{
  ProxyExecuted: Anonymize<Ie5i8qqljk3tjb>
  PureCreated: Anonymize<I8claf7liq8o9r>
  Announced: Anonymize<Idbjbboh0q507r>
  ProxyAdded: Anonymize<I28ankic0g500e>
  ProxyRemoved: Anonymize<I28ankic0g500e>
}>

type I8claf7liq8o9r = {
  pure: SS58String
  who: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  disambiguation_index: number
}

type Ie45ibn6h4uq45 = AnonymousEnum<{
  Any: undefined
  NonTransfer: undefined
  CancelProxy: undefined
  Assets: undefined
  AssetOwner: undefined
  AssetManager: undefined
  Collator: undefined
}>

type Idbjbboh0q507r = { real: SS58String; proxy: SS58String; call_hash: Binary }

type I28ankic0g500e = {
  delegator: SS58String
  delegatee: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}

type Ie4o50pgs5mq4e = AnonymousEnum<{
  Created: Anonymize<I88ff3u4dpivk>
  Issued: Anonymize<I33cp947glv1ks>
  Transferred: Anonymize<Ic9om1gmmqu7rq>
  Burned: Anonymize<I5hfov2b68ppb6>
  TeamChanged: Anonymize<Ibthhb2m9vneds>
  OwnerChanged: Anonymize<Iaitn5bqfacj7k>
  Frozen: Anonymize<If4ebvclj2ugvi>
  Thawed: Anonymize<If4ebvclj2ugvi>
  AssetFrozen: Anonymize<Ia5le7udkgbaq9>
  AssetThawed: Anonymize<Ia5le7udkgbaq9>
  AccountsDestroyed: Anonymize<Ieduc1e6frq8rb>
  ApprovalsDestroyed: Anonymize<I9h6gbtabovtm4>
  DestructionStarted: Anonymize<Ia5le7udkgbaq9>
  Destroyed: Anonymize<Ia5le7udkgbaq9>
  ForceCreated: Anonymize<Iaitn5bqfacj7k>
  MetadataSet: Anonymize<Ifnsa0dkkpf465>
  MetadataCleared: Anonymize<Ia5le7udkgbaq9>
  ApprovedTransfer: Anonymize<I65dtqr2egjbc3>
  ApprovalCancelled: Anonymize<Ibqj3vg5s5lk0c>
  TransferredApproved: Anonymize<I6l73u513p8rna>
  AssetStatusChanged: Anonymize<Ia5le7udkgbaq9>
  AssetMinBalanceChanged: Anonymize<Iefqmt2htu1dlu>
  Touched: Anonymize<If8bgtgqrchjtu>
  Blocked: Anonymize<If4ebvclj2ugvi>
}>

type I88ff3u4dpivk = {
  asset_id: number
  creator: SS58String
  owner: SS58String
}

type I33cp947glv1ks = { asset_id: number; owner: SS58String; amount: bigint }

type Ic9om1gmmqu7rq = {
  asset_id: number
  from: SS58String
  to: SS58String
  amount: bigint
}

type I5hfov2b68ppb6 = { asset_id: number; owner: SS58String; balance: bigint }

type Ibthhb2m9vneds = {
  asset_id: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}

type Iaitn5bqfacj7k = { asset_id: number; owner: SS58String }

type If4ebvclj2ugvi = { asset_id: number; who: SS58String }

type Ia5le7udkgbaq9 = { asset_id: number }

type Ieduc1e6frq8rb = {
  asset_id: number
  accounts_destroyed: number
  accounts_remaining: number
}

type I9h6gbtabovtm4 = {
  asset_id: number
  approvals_destroyed: number
  approvals_remaining: number
}

type Ifnsa0dkkpf465 = {
  asset_id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}

type I65dtqr2egjbc3 = {
  asset_id: number
  source: SS58String
  delegate: SS58String
  amount: bigint
}

type Ibqj3vg5s5lk0c = {
  asset_id: number
  owner: SS58String
  delegate: SS58String
}

type I6l73u513p8rna = {
  asset_id: number
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}

type Iefqmt2htu1dlu = { asset_id: number; new_min_balance: bigint }

type If8bgtgqrchjtu = {
  asset_id: number
  who: SS58String
  depositor: SS58String
}

type Ia0j71vjrjqu9p = AnonymousEnum<{
  Created: Anonymize<I9gqanbbbe917p>
  ForceCreated: Anonymize<Id1m1230297f7a>
  Destroyed: Anonymize<I6cu7obfo0rr0o>
  Issued: Anonymize<Ifvb1p5munhhv4>
  Transferred: Anonymize<I46h83ilqeed3g>
  Burned: Anonymize<Ifvb1p5munhhv4>
  Frozen: Anonymize<Iafkqus0ohh6l6>
  Thawed: Anonymize<Iafkqus0ohh6l6>
  CollectionFrozen: Anonymize<I6cu7obfo0rr0o>
  CollectionThawed: Anonymize<I6cu7obfo0rr0o>
  OwnerChanged: Anonymize<Icahse3uoi76n7>
  TeamChanged: Anonymize<I75sj3uv7gnemk>
  ApprovedTransfer: Anonymize<I5fjkvcb5vr6nb>
  ApprovalCancelled: Anonymize<I5fjkvcb5vr6nb>
  ItemStatusChanged: Anonymize<I6cu7obfo0rr0o>
  CollectionMetadataSet: Anonymize<I9viqhmdtuof5e>
  CollectionMetadataCleared: Anonymize<I6cu7obfo0rr0o>
  MetadataSet: Anonymize<Iceq9fmmp9aeqv>
  MetadataCleared: Anonymize<Iafkqus0ohh6l6>
  Redeposited: Anonymize<I2gr1toekv86b9>
  AttributeSet: Anonymize<I5tvvgui05tn6e>
  AttributeCleared: Anonymize<Ibal0joadvdc2h>
  OwnershipAcceptanceChanged: Anonymize<I2v2ikqt2trp52>
  CollectionMaxSupplySet: Anonymize<I6h88h8vba22v8>
  ItemPriceSet: Anonymize<If3057hi1g5qlo>
  ItemPriceRemoved: Anonymize<Iafkqus0ohh6l6>
  ItemBought: Anonymize<Iaii5qf41d5n3d>
}>

type I9gqanbbbe917p = {
  collection: number
  creator: SS58String
  owner: SS58String
}

type Id1m1230297f7a = { collection: number; owner: SS58String }

type I6cu7obfo0rr0o = { collection: number }

type Ifvb1p5munhhv4 = { collection: number; item: number; owner: SS58String }

type I46h83ilqeed3g = {
  collection: number
  item: number
  from: SS58String
  to: SS58String
}

type Iafkqus0ohh6l6 = { collection: number; item: number }

type Icahse3uoi76n7 = { collection: number; new_owner: SS58String }

type I75sj3uv7gnemk = {
  collection: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}

type I5fjkvcb5vr6nb = {
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}

type I9viqhmdtuof5e = { collection: number; data: Binary; is_frozen: boolean }

type Iceq9fmmp9aeqv = {
  collection: number
  item: number
  data: Binary
  is_frozen: boolean
}

type I2gr1toekv86b9 = {
  collection: number
  successful_items: Anonymize<Icgljjb6j82uhn>
}

type Icgljjb6j82uhn = Array<number>

type I5tvvgui05tn6e = {
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
  value: Binary
}

type Ibal0joadvdc2h = {
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
}

type I2v2ikqt2trp52 = {
  who: SS58String
  maybe_collection: Anonymize<I4arjljr6dpflb>
}

type I6h88h8vba22v8 = { collection: number; max_supply: number }

type If3057hi1g5qlo = {
  collection: number
  item: number
  price: bigint
  whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
}

type Ihfphjolmsqq1 = SS58String | undefined

type Iaii5qf41d5n3d = {
  collection: number
  item: number
  price: bigint
  seller: SS58String
  buyer: SS58String
}

type Id31e45564s5of = AnonymousEnum<{
  Created: Anonymize<I9gqanbbbe917p>
  ForceCreated: Anonymize<Id1m1230297f7a>
  Destroyed: Anonymize<I6cu7obfo0rr0o>
  Issued: Anonymize<Ifvb1p5munhhv4>
  Transferred: Anonymize<I46h83ilqeed3g>
  Burned: Anonymize<Ifvb1p5munhhv4>
  ItemTransferLocked: Anonymize<Iafkqus0ohh6l6>
  ItemTransferUnlocked: Anonymize<Iafkqus0ohh6l6>
  ItemPropertiesLocked: Anonymize<I1jj31tn29ie3c>
  CollectionLocked: Anonymize<I6cu7obfo0rr0o>
  OwnerChanged: Anonymize<Icahse3uoi76n7>
  TeamChanged: Anonymize<Ico8bnjc6taa27>
  TransferApproved: Anonymize<I78i1bvlonei69>
  ApprovalCancelled: Anonymize<I5fjkvcb5vr6nb>
  AllApprovalsCancelled: Anonymize<Ifvb1p5munhhv4>
  CollectionConfigChanged: Anonymize<I6cu7obfo0rr0o>
  CollectionMetadataSet: Anonymize<I78u60nqh0etah>
  CollectionMetadataCleared: Anonymize<I6cu7obfo0rr0o>
  ItemMetadataSet: Anonymize<Icrkms46uh8tpb>
  ItemMetadataCleared: Anonymize<Iafkqus0ohh6l6>
  Redeposited: Anonymize<I2gr1toekv86b9>
  AttributeSet: Anonymize<I8caj3ho0b8kia>
  AttributeCleared: Anonymize<Irn56pucio7gb>
  ItemAttributesApprovalAdded: Anonymize<I9i1f9mrso1hmf>
  ItemAttributesApprovalRemoved: Anonymize<I9i1f9mrso1hmf>
  OwnershipAcceptanceChanged: Anonymize<I2v2ikqt2trp52>
  CollectionMaxSupplySet: Anonymize<I6h88h8vba22v8>
  CollectionMintSettingsUpdated: Anonymize<I6cu7obfo0rr0o>
  NextCollectionIdIncremented: Anonymize<I9ksla2si91s56>
  ItemPriceSet: Anonymize<If3057hi1g5qlo>
  ItemPriceRemoved: Anonymize<Iafkqus0ohh6l6>
  ItemBought: Anonymize<Iaii5qf41d5n3d>
  TipSent: Anonymize<Id9j7b85otvjru>
  SwapCreated: Anonymize<I1cft1pbnpmk8h>
  SwapCancelled: Anonymize<I1cft1pbnpmk8h>
  SwapClaimed: Anonymize<I4itqom6arbchs>
  PreSignedAttributesSet: Anonymize<If66fuhp1p95q>
  PalletAttributeSet: Anonymize<I4obtjucjucdlg>
}>

type I1jj31tn29ie3c = {
  collection: number
  item: number
  lock_metadata: boolean
  lock_attributes: boolean
}

type Ico8bnjc6taa27 = {
  collection: number
  issuer: Anonymize<Ihfphjolmsqq1>
  admin: Anonymize<Ihfphjolmsqq1>
  freezer: Anonymize<Ihfphjolmsqq1>
}

type I78i1bvlonei69 = {
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
  deadline: Anonymize<I4arjljr6dpflb>
}

type I78u60nqh0etah = { collection: number; data: Binary }

type Icrkms46uh8tpb = { collection: number; item: number; data: Binary }

type I8caj3ho0b8kia = {
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}

type I966fu47vp6aqm = AnonymousEnum<{
  Pallet: undefined
  CollectionOwner: undefined
  ItemOwner: undefined
  Account: Anonymize<SS58String>
}>

type Irn56pucio7gb = {
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
}

type I9i1f9mrso1hmf = { collection: number; item: number; delegate: SS58String }

type I9ksla2si91s56 = { next_id: Anonymize<I4arjljr6dpflb> }

type Id9j7b85otvjru = {
  collection: number
  item: number
  sender: SS58String
  receiver: SS58String
  amount: bigint
}

type I1cft1pbnpmk8h = {
  offered_collection: number
  offered_item: number
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}

type Iemn9sl4bs903b = Anonymize<I6ihva9jldsquq> | undefined

type I6ihva9jldsquq = { amount: bigint; direction: Anonymize<Ie7b0oc9o0k6a5> }

type Ie7b0oc9o0k6a5 = AnonymousEnum<{ Send: undefined; Receive: undefined }>

type I4itqom6arbchs = {
  sent_collection: number
  sent_item: number
  sent_item_owner: SS58String
  received_collection: number
  received_item: number
  received_item_owner: SS58String
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}

type If66fuhp1p95q = {
  collection: number
  item: number
  namespace: Anonymize<I966fu47vp6aqm>
}

type I4obtjucjucdlg = {
  collection: number
  item: Anonymize<I4arjljr6dpflb>
  attribute: Anonymize<I5ngqtbe5pl60l>
  value: Binary
}

type I5ngqtbe5pl60l = AnonymousEnum<{
  UsedToClaim: Anonymize<number>
  TransferDisabled: undefined
}>

type I6tvd3rc3h20en = AnonymousEnum<{
  Created: Anonymize<I7hlh8kikd6p4q>
  Issued: Anonymize<I773vhjbkoph68>
  Transferred: Anonymize<Ib48p64dtbhtjh>
  Burned: Anonymize<I67h5652vttqrv>
  TeamChanged: Anonymize<I4tcg4kkcmk1b8>
  OwnerChanged: Anonymize<I2c3boiuqtga9e>
  Frozen: Anonymize<Iddsdcglf5ofsb>
  Thawed: Anonymize<Iddsdcglf5ofsb>
  AssetFrozen: Anonymize<I9lo1oa3a7kqqa>
  AssetThawed: Anonymize<I9lo1oa3a7kqqa>
  AccountsDestroyed: Anonymize<I9s7a8akkhql1>
  ApprovalsDestroyed: Anonymize<I6goc5k4sgmd8c>
  DestructionStarted: Anonymize<I9lo1oa3a7kqqa>
  Destroyed: Anonymize<I9lo1oa3a7kqqa>
  ForceCreated: Anonymize<I2c3boiuqtga9e>
  MetadataSet: Anonymize<I3fomiurk0sgm7>
  MetadataCleared: Anonymize<I9lo1oa3a7kqqa>
  ApprovedTransfer: Anonymize<Idlu0dsu3lckof>
  ApprovalCancelled: Anonymize<Iavb0613seobiu>
  TransferredApproved: Anonymize<I7fmiabj1mvkth>
  AssetStatusChanged: Anonymize<I9lo1oa3a7kqqa>
  AssetMinBalanceChanged: Anonymize<Ifbbapj50vfmd1>
  Touched: Anonymize<I6sl14purtgkga>
  Blocked: Anonymize<Iddsdcglf5ofsb>
}>

type I7hlh8kikd6p4q = {
  asset_id: Anonymize<I43cmiele6sevi>
  creator: SS58String
  owner: SS58String
}

type I773vhjbkoph68 = {
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  amount: bigint
}

type Ib48p64dtbhtjh = {
  asset_id: Anonymize<I43cmiele6sevi>
  from: SS58String
  to: SS58String
  amount: bigint
}

type I67h5652vttqrv = {
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  balance: bigint
}

type I4tcg4kkcmk1b8 = {
  asset_id: Anonymize<I43cmiele6sevi>
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}

type I2c3boiuqtga9e = { asset_id: Anonymize<I43cmiele6sevi>; owner: SS58String }

type Iddsdcglf5ofsb = { asset_id: Anonymize<I43cmiele6sevi>; who: SS58String }

type I9lo1oa3a7kqqa = { asset_id: Anonymize<I43cmiele6sevi> }

type I9s7a8akkhql1 = {
  asset_id: Anonymize<I43cmiele6sevi>
  accounts_destroyed: number
  accounts_remaining: number
}

type I6goc5k4sgmd8c = {
  asset_id: Anonymize<I43cmiele6sevi>
  approvals_destroyed: number
  approvals_remaining: number
}

type I3fomiurk0sgm7 = {
  asset_id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}

type Idlu0dsu3lckof = {
  asset_id: Anonymize<I43cmiele6sevi>
  source: SS58String
  delegate: SS58String
  amount: bigint
}

type Iavb0613seobiu = {
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
}

type I7fmiabj1mvkth = {
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}

type Ifbbapj50vfmd1 = {
  asset_id: Anonymize<I43cmiele6sevi>
  new_min_balance: bigint
}

type I6sl14purtgkga = {
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
  depositor: SS58String
}

type Idhnf6rtqoslea = Array<Binary>

type Iep4uo61810hfs = Array<Anonymize<I5g2vv0ckl2m8b>>

type I5g2vv0ckl2m8b = [number, number]

type Ieniouoqkq4icf = { spec_version: number; spec_name: string }

type I6f7juk1vj8fiq = Array<Anonymize<I8ajtuet8esesv>>

type I8ajtuet8esesv = {
  used_bandwidth: Anonymize<Ieafp1gui1o4cl>
  para_head_hash: Anonymize<I17k3ujudqd5df>
  consumed_go_ahead_signal: Anonymize<Ie1vdku2j6ccvj>
}

type Ieafp1gui1o4cl = {
  ump_msg_count: number
  ump_total_bytes: number
  hrmp_outgoing: Anonymize<I68brng9hc4b57>
}

type I68brng9hc4b57 = Array<Anonymize<I2hfpgo4vigap7>>

type I2hfpgo4vigap7 = [number, Anonymize<I37lfg356jmoof>]

type I37lfg356jmoof = { msg_count: number; total_bytes: number }

type Ie1vdku2j6ccvj = PolkadotPrimitivesV5UpgradeGoAhead | undefined

export type PolkadotPrimitivesV5UpgradeGoAhead = Enum<
  { type: "Abort"; value: undefined } | { type: "GoAhead"; value: undefined }
>
export const PolkadotPrimitivesV5UpgradeGoAhead =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5UpgradeGoAhead>

type Iamnn769l033b4 = {
  used_bandwidth: Anonymize<Ieafp1gui1o4cl>
  hrmp_watermark: Anonymize<I4arjljr6dpflb>
  consumed_go_ahead_signal: Anonymize<Ie1vdku2j6ccvj>
}

type I5r8ef6aie125l = {
  parent_head: Binary
  relay_parent_number: number
  relay_parent_storage_root: Binary
  max_pov_size: number
}

type Id34bi0o1gnln9 = PolkadotPrimitivesV5UpgradeRestriction | undefined

export type PolkadotPrimitivesV5UpgradeRestriction = Enum<{
  type: "Present"
  value: undefined
}>
export const PolkadotPrimitivesV5UpgradeRestriction =
  _Enum as unknown as GetEnum<PolkadotPrimitivesV5UpgradeRestriction>

type Itom7fk49o0c9 = Array<Binary>

type I8gicq33tfu7j1 = {
  dmq_mqc_head: Binary
  relay_dispatch_queue_remaining_capacity: Anonymize<I3j1v1c2btq4bd>
  ingress_channels: Anonymize<I90nfahji0n33j>
  egress_channels: Anonymize<I90nfahji0n33j>
}

type I3j1v1c2btq4bd = { remaining_count: number; remaining_size: number }

type I90nfahji0n33j = Array<Anonymize<Iemudar0nobhvs>>

type Iemudar0nobhvs = [number, Anonymize<I5q7ff8kblv2cn>]

type I5q7ff8kblv2cn = {
  max_capacity: number
  max_total_size: number
  max_message_size: number
  msg_count: number
  total_size: number
  mqc_head: Anonymize<I17k3ujudqd5df>
}

type I4iumukclgj8ej = {
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
}

type Iavuvfkop6318c = {
  max_candidate_depth: number
  allowed_ancestry_len: number
}

type I93ssha9egqq23 = Array<Anonymize<If89923vhoiaim>>

type If89923vhoiaim = [number, Binary]

type I6r5cbv8ttrb09 = Array<Anonymize<I958l48g4qg5rf>>

type I958l48g4qg5rf = { recipient: number; data: Binary }

type Ib3qt1mgvgmbgi = { code_hash: Binary; check_version: boolean }

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

type I3fe7nt2ne6qtf = Array<Anonymize<I7qdm60946h5u9>>

type I7qdm60946h5u9 = { id: undefined; amount: bigint }

export type TransactionPaymentReleases = Enum<
  { type: "V1Ancient"; value: undefined } | { type: "V2"; value: undefined }
>
export const TransactionPaymentReleases =
  _Enum as unknown as GetEnum<TransactionPaymentReleases>

type Ifi4da1gej1fri = Array<Anonymize<Iep1lmt6q3s6r3>>

type Iep1lmt6q3s6r3 = { who: SS58String; deposit: bigint }

type I9our4clsjkim0 = Array<Anonymize<I73gble6tmb52f>>

type I73gble6tmb52f = [SS58String, Binary]

type I6cs1itejju2vv = [bigint, number]

type I1imu1nmuvsfjb = Array<Anonymize<Ifqaq2umctvajg>>

type Ifqaq2umctvajg = {
  sender: number
  state: Anonymize<Iafdd71v7fmmtg>
  message_metadata: Anonymize<Iffef4jcdngnuk>
}

type Iafdd71v7fmmtg = AnonymousEnum<{ Ok: undefined; Suspended: undefined }>

type Iffef4jcdngnuk = Array<Anonymize<I3n2gg5r6bbqh>>

type I3n2gg5r6bbqh = [number, Anonymize<Iaacmm7vkdld2p>]

type Iaacmm7vkdld2p = AnonymousEnum<{
  ConcatenatedVersionedXcm: undefined
  ConcatenatedEncodedBlob: undefined
  Signals: undefined
}>

type I1mse8p8gvh143 = Array<Anonymize<Ittnsbm78tol1>>

type Ittnsbm78tol1 = {
  recipient: number
  state: Anonymize<Iafdd71v7fmmtg>
  signals_exist: boolean
  first_index: number
  last_index: number
}

type Ie0cpusdmler9p = {
  suspend_threshold: number
  drop_threshold: number
  resume_threshold: number
  threshold_weight: Anonymize<I4q39t5hn830vp>
  weight_restrict_decay: Anonymize<I4q39t5hn830vp>
  xcmp_max_individual_weight: Anonymize<I4q39t5hn830vp>
}

type I6o3vavku3vjsk = [number, number, Binary]

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

type I34gtdjipdmjpt = Anonymize<I5g2vv0ckl2m8b> | undefined

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

type Iabpgqcjikia83 = Binary | undefined

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

type Iepvrcsdbii2qt = {
  begin_used: number
  end_used: number
  overweight_count: bigint
}

type I82vjkits3vc46 = Array<Anonymize<Icp9h5ma02v1rg>>

type Icp9h5ma02v1rg = [number, Binary]

type I7f4alf2hnuu8s = { delivery_fee_factor: bigint; is_congested: boolean }

type Iag146hmjgqfgj = {
  when: Anonymize<Itvprrpb0nm3o>
  deposit: bigint
  depositor: SS58String
  approvals: Anonymize<Ia2lhg7l2hilo3>
}

type I7hqmdsnd82ji2 = [Anonymize<I9rurpvdrvevl0>, bigint]

type I9rurpvdrvevl0 = Array<Anonymize<Ibr9lf0cakmq5b>>

type Ibr9lf0cakmq5b = {
  delegate: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}

type I3tjio59962rg2 = [Anonymize<I99svmvk5amkcq>, bigint]

type I99svmvk5amkcq = Array<Anonymize<I5gk1hg65t79fm>>

type I5gk1hg65t79fm = { real: SS58String; call_hash: Binary; height: number }

type Idacc63fkgcgsh = {
  owner: SS58String
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
  supply: bigint
  deposit: bigint
  min_balance: bigint
  is_sufficient: boolean
  accounts: number
  sufficients: number
  approvals: number
  status: Anonymize<Ichpfv056f8vda>
}

type Ichpfv056f8vda = AnonymousEnum<{
  Live: undefined
  Frozen: undefined
  Destroying: undefined
}>

type I633fcsu6muf7e = {
  balance: bigint
  status: Anonymize<I4toln8faf1bi6>
  reason: Anonymize<Idcivh1e680ag5>
  extra: undefined
}

type I4toln8faf1bi6 = AnonymousEnum<{
  Liquid: undefined
  Frozen: undefined
  Blocked: undefined
}>

type Idcivh1e680ag5 = AnonymousEnum<{
  Consumer: undefined
  Sufficient: undefined
  DepositHeld: Anonymize<bigint>
  DepositRefunded: undefined
  DepositFrom: Anonymize<I95l2k9b1re95f>
}>

type I95l2k9b1re95f = [SS58String, bigint]

type I7svnfko10tq2e = [number, SS58String]

type I4s6jkha20aoh0 = { amount: bigint; deposit: bigint }

type I2brm5b9jij1st = [number, SS58String, SS58String]

type I78s05f59eoi8b = {
  deposit: bigint
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}

type Ianufjuplcj6u4 = {
  owner: SS58String
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
  total_deposit: bigint
  free_holding: boolean
  items: number
  item_metadatas: number
  attributes: number
  is_frozen: boolean
}

type Id32h28hjj1tch = [SS58String, number, number]

type I6ouflveob4eli = [SS58String, number]

type I2mv9dvsaj3kcr = {
  owner: SS58String
  approved: Anonymize<Ihfphjolmsqq1>
  is_frozen: boolean
  deposit: bigint
}

type I7781vnk0rm9eq = { deposit: bigint; data: Binary; is_frozen: boolean }

type Ie2iqtdb0stqo1 = [Binary, bigint]

type I5irutptk105do = [number, Anonymize<I4arjljr6dpflb>, Binary]

type Ic9nev69d8grv1 = [bigint, Anonymize<Ihfphjolmsqq1>]

type I18m6a0sc4k7s9 = {
  owner: SS58String
  owner_deposit: bigint
  items: number
  item_metadatas: number
  item_configs: number
  attributes: number
}

type Ic9iokm15iigt6 = {
  owner: SS58String
  approvals: Anonymize<I4m61c4hi7qpuv>
  deposit: Anonymize<Ic262ibdoec56a>
}

type I4m61c4hi7qpuv = Array<Anonymize<I2bebbvuje4ra8>>

type I2bebbvuje4ra8 = [SS58String, Anonymize<I4arjljr6dpflb>]

type I35m96p3u4vl0p = { deposit: bigint; data: Binary }

type Iapmji0h53pmkn = { deposit: Anonymize<I6e70ge7ubff75>; data: Binary }

type I6e70ge7ubff75 = { account: Anonymize<Ihfphjolmsqq1>; amount: bigint }

type Idrr42svup341f = [Binary, Anonymize<I6e70ge7ubff75>]

type I4re5pnvv1c7nf = [
  number,
  Anonymize<I4arjljr6dpflb>,
  Anonymize<I966fu47vp6aqm>,
  Binary,
]

type Idm8ptlbm1nvbr = {
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}

type If362jnk79orio = {
  settings: bigint
  max_supply: Anonymize<I4arjljr6dpflb>
  mint_settings: Anonymize<I3lel2b740s3fh>
}

type I3lel2b740s3fh = {
  mint_type: Anonymize<Icopkaasa7itcc>
  price: Anonymize<I35p85j063s0il>
  start_block: Anonymize<I4arjljr6dpflb>
  end_block: Anonymize<I4arjljr6dpflb>
  default_item_settings: bigint
}

type Icopkaasa7itcc = AnonymousEnum<{
  Issuer: undefined
  Public: undefined
  HolderOf: Anonymize<number>
}>

type I35p85j063s0il = bigint | undefined

type I45vqunm1qmlkt = [Anonymize<I43cmiele6sevi>, SS58String]

type Ie3uepa99ve7rj = [Anonymize<I43cmiele6sevi>, SS58String, SS58String]

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

type Iasb8k6ash5mjn = Anonymize<I4q39t5hn830vp> | undefined

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

type Ia0jlnena5ajog = AnonymousEnum<{
  set_validation_data: Anonymize<I68js79djhsbni>
  sudo_send_upward_message: Anonymize<Ifpj261e8s63m3>
  authorize_upgrade: Anonymize<Ib3qt1mgvgmbgi>
  enact_authorized_upgrade: Anonymize<I6pjjpfvhvcfru>
}>

type I68js79djhsbni = { data: Anonymize<Icj9r7l64kc5ku> }

type Icj9r7l64kc5ku = {
  validation_data: Anonymize<I5r8ef6aie125l>
  relay_chain_state: Anonymize<Itom7fk49o0c9>
  downward_messages: Anonymize<I6ljjd4b5fa4ov>
  horizontal_messages: Anonymize<I2pf0b05mc7sdr>
}

type I6ljjd4b5fa4ov = Array<Anonymize<I60847k37jfcc6>>

type I60847k37jfcc6 = { sent_at: number; msg: Binary }

type I2pf0b05mc7sdr = Array<Anonymize<I9hvej6h53dqj0>>

type I9hvej6h53dqj0 = [number, Anonymize<Iev3u09i2vqn93>]

type Iev3u09i2vqn93 = Array<Anonymize<I409qo0sfkbh16>>

type I409qo0sfkbh16 = { sent_at: number; data: Binary }

type Ifpj261e8s63m3 = { message: Binary }

export type TimestampPalletCall = Enum<{
  type: "set"
  value: Anonymize<Idcr6u6361oad9>
}>
export const TimestampPalletCall =
  _Enum as unknown as GetEnum<TimestampPalletCall>

type Idcr6u6361oad9 = { now: bigint }

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

export type MultiAddress = Enum<
  | { type: "Id"; value: Anonymize<SS58String> }
  | { type: "Index"; value: Anonymize<number> }
  | { type: "Raw"; value: Anonymize<Binary> }
  | { type: "Address32"; value: Anonymize<Binary> }
  | { type: "Address20"; value: Anonymize<Binary> }
>
export const MultiAddress = _Enum as unknown as GetEnum<MultiAddress>

type Icacgruoo9j3r2 = {
  source: MultiAddress
  dest: MultiAddress
  value: bigint
}

type I7dgmo7im9hljo = { dest: MultiAddress; keep_alive: boolean }

type Iargojp1sv9icj = { who: MultiAddress; amount: bigint }

type Ibmr18suc9ikh9 = { who: Anonymize<Ia2lhg7l2hilo3> }

type Ie0io91hk7pejj = { who: MultiAddress; new_free: bigint }

type Idicb249fns7nd = AnonymousEnum<{
  set_invulnerables: Anonymize<Ifccifqltb5obi>
  set_desired_candidates: Anonymize<Iadtsfv699cq8b>
  set_candidacy_bond: Anonymize<Ialpmgmhr3gk5r>
  register_as_candidate: undefined
  leave_intent: undefined
  add_invulnerable: Anonymize<I4cbvqmqadhrea>
  remove_invulnerable: Anonymize<I4cbvqmqadhrea>
}>

type Ifccifqltb5obi = { new: Anonymize<Ia2lhg7l2hilo3> }

type Iadtsfv699cq8b = { max: number }

type Ialpmgmhr3gk5r = { bond: bigint }

type I3v8vq7j9grsdj = AnonymousEnum<{
  set_keys: Anonymize<Ivojoo8sbcs0m>
  purge_keys: undefined
}>

type Ivojoo8sbcs0m = { keys: Binary; proof: Binary }

type Iemk8msmejs2tt = AnonymousEnum<{
  service_overweight: Anonymize<Iab1retd4gg4q1>
  suspend_xcm_execution: undefined
  resume_xcm_execution: undefined
  update_suspend_threshold: Anonymize<I3vh014cqgmrfd>
  update_drop_threshold: Anonymize<I3vh014cqgmrfd>
  update_resume_threshold: Anonymize<I3vh014cqgmrfd>
  update_threshold_weight: Anonymize<I2tni7rrb2buqm>
  update_weight_restrict_decay: Anonymize<I2tni7rrb2buqm>
  update_xcmp_max_individual_weight: Anonymize<I2tni7rrb2buqm>
}>

type Iab1retd4gg4q1 = { index: bigint; weight_limit: Anonymize<I4q39t5hn830vp> }

type I3vh014cqgmrfd = { new: number }

type I2tni7rrb2buqm = { new: Anonymize<I4q39t5hn830vp> }

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

type I3lfpt1qictomp = AnonymousEnum<{
  service_overweight: Anonymize<Iab1retd4gg4q1>
}>

type I6buo4n6s39j28 = AnonymousEnum<{
  report_bridge_status: Anonymize<I7qii6me707csu>
}>

type I7qii6me707csu = { bridge_id: Binary; is_congested: boolean }

type Iakgmukh287lgd = AnonymousEnum<{
  batch: Anonymize<I6m9u9b2jh9e7q>
  as_derivative: Anonymize<I3a9gjlu51cehg>
  batch_all: Anonymize<I6m9u9b2jh9e7q>
  dispatch_as: Anonymize<Ibmq86o76d7t49>
  force_batch: Anonymize<I6m9u9b2jh9e7q>
  with_weight: Anonymize<Ib3khl2i8bnoln>
}>

type I6m9u9b2jh9e7q = { calls: Anonymize<I9umjnqmckto5n> }

type I9umjnqmckto5n = Array<Anonymize<I9ih0jev11cnlt>>

type I9ih0jev11cnlt = AnonymousEnum<{
  System: Anonymize<SystemPalletCall>
  ParachainSystem: Anonymize<Ia0jlnena5ajog>
  Timestamp: Anonymize<TimestampPalletCall>
  Balances: Anonymize<Ibf8j84ii3a3kr>
  CollatorSelection: Anonymize<Idicb249fns7nd>
  Session: Anonymize<I3v8vq7j9grsdj>
  XcmpQueue: Anonymize<Iemk8msmejs2tt>
  PolkadotXcm: Anonymize<XcmPalletCall>
  DmpQueue: Anonymize<I3lfpt1qictomp>
  ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
  Utility: Anonymize<Iakgmukh287lgd>
  Multisig: Anonymize<I25c5pk92h8gi9>
  Proxy: Anonymize<I8l19tjqe7q083>
  Assets: Anonymize<Id6smp39btrdm7>
  Uniques: Anonymize<I4p2mihcqro9rd>
  Nfts: Anonymize<Ifub2394n314hb>
  ForeignAssets: Anonymize<If63s12hm5a8p0>
}>

type I25c5pk92h8gi9 = AnonymousEnum<{
  as_multi_threshold_1: Anonymize<I6dgou98v9pgi8>
  as_multi: Anonymize<I5r5n4apqdp1fq>
  approve_as_multi: Anonymize<I349bg0i7n8ohu>
  cancel_as_multi: Anonymize<I8plicv234mqe5>
}>

type I6dgou98v9pgi8 = {
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I9ih0jev11cnlt>
}

type I5r5n4apqdp1fq = {
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I9ih0jev11cnlt>
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

type I8l19tjqe7q083 = AnonymousEnum<{
  proxy: Anonymize<I3246qdho5ce4m>
  add_proxy: Anonymize<I5f79m6vb0cjl3>
  remove_proxy: Anonymize<I5f79m6vb0cjl3>
  remove_proxies: undefined
  create_pure: Anonymize<I9ka5llru04c3v>
  kill_pure: Anonymize<Ial2ape05din8j>
  announce: Anonymize<Id3bpmvju2iqi5>
  remove_announcement: Anonymize<Id3bpmvju2iqi5>
  reject_announcement: Anonymize<Ietdab69eu3c4e>
  proxy_announced: Anonymize<I98oa9b85ojqlf>
}>

type I3246qdho5ce4m = {
  real: MultiAddress
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}

type I5m6c79u5faiin = Anonymize<Ie45ibn6h4uq45> | undefined

type I5f79m6vb0cjl3 = {
  delegate: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}

type I9ka5llru04c3v = {
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
  index: number
}

type Ial2ape05din8j = {
  spawner: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  index: number
  height: number
  ext_index: number
}

type Id3bpmvju2iqi5 = { real: MultiAddress; call_hash: Binary }

type Ietdab69eu3c4e = { delegate: MultiAddress; call_hash: Binary }

type I98oa9b85ojqlf = {
  delegate: MultiAddress
  real: MultiAddress
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}

type Id6smp39btrdm7 = AnonymousEnum<{
  create: Anonymize<I533um4il0td12>
  force_create: Anonymize<I7qfdo8o1rkqtm>
  start_destroy: Anonymize<Ic5b47dj4coa3r>
  destroy_accounts: Anonymize<Ic5b47dj4coa3r>
  destroy_approvals: Anonymize<Ic5b47dj4coa3r>
  finish_destroy: Anonymize<Ic5b47dj4coa3r>
  mint: Anonymize<I9onodvmibifmb>
  burn: Anonymize<Ibkt6hr2fhk8mr>
  transfer: Anonymize<I9gfesr77iu6er>
  transfer_keep_alive: Anonymize<I9gfesr77iu6er>
  force_transfer: Anonymize<I48n65o3p66msb>
  freeze: Anonymize<Idabu8cc4fnfuq>
  thaw: Anonymize<Idabu8cc4fnfuq>
  freeze_asset: Anonymize<Ic5b47dj4coa3r>
  thaw_asset: Anonymize<Ic5b47dj4coa3r>
  transfer_ownership: Anonymize<Id7ea0upj3s5ui>
  set_team: Anonymize<Ic2uiliialbe3h>
  set_metadata: Anonymize<I8hff7chabggkd>
  clear_metadata: Anonymize<Ic5b47dj4coa3r>
  force_set_metadata: Anonymize<I49i39mtj1ivbs>
  force_clear_metadata: Anonymize<Ic5b47dj4coa3r>
  force_asset_status: Anonymize<If8sgtc04i0mv8>
  approve_transfer: Anonymize<I5nr0k3uvh9bvr>
  cancel_approval: Anonymize<Iacuu5hmgv3l03>
  force_cancel_approval: Anonymize<I7djqe23edivs4>
  transfer_approved: Anonymize<I4eb1md7k7r9bm>
  touch: Anonymize<Ic5b47dj4coa3r>
  refund: Anonymize<I9vl5kpk0fpakt>
  set_min_balance: Anonymize<I717jt61hu19b4>
  touch_other: Anonymize<Idabu8cc4fnfuq>
  refund_other: Anonymize<Idabu8cc4fnfuq>
  block: Anonymize<Idabu8cc4fnfuq>
}>

type I533um4il0td12 = { id: number; admin: MultiAddress; min_balance: bigint }

type I7qfdo8o1rkqtm = {
  id: number
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}

type Ic5b47dj4coa3r = { id: number }

type I9onodvmibifmb = { id: number; beneficiary: MultiAddress; amount: bigint }

type Ibkt6hr2fhk8mr = { id: number; who: MultiAddress; amount: bigint }

type I9gfesr77iu6er = { id: number; target: MultiAddress; amount: bigint }

type I48n65o3p66msb = {
  id: number
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}

type Idabu8cc4fnfuq = { id: number; who: MultiAddress }

type Id7ea0upj3s5ui = { id: number; owner: MultiAddress }

type Ic2uiliialbe3h = {
  id: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}

type I8hff7chabggkd = {
  id: number
  name: Binary
  symbol: Binary
  decimals: number
}

type I49i39mtj1ivbs = {
  id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}

type If8sgtc04i0mv8 = {
  id: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}

type I5nr0k3uvh9bvr = { id: number; delegate: MultiAddress; amount: bigint }

type Iacuu5hmgv3l03 = { id: number; delegate: MultiAddress }

type I7djqe23edivs4 = {
  id: number
  owner: MultiAddress
  delegate: MultiAddress
}

type I4eb1md7k7r9bm = {
  id: number
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}

type I9vl5kpk0fpakt = { id: number; allow_burn: boolean }

type I717jt61hu19b4 = { id: number; min_balance: bigint }

type I4p2mihcqro9rd = AnonymousEnum<{
  create: Anonymize<Ib9s51pghbgn6b>
  force_create: Anonymize<Ic9ojioik482he>
  destroy: Anonymize<I223jg78mng8hq>
  mint: Anonymize<Idl8k9cbpbc2n9>
  burn: Anonymize<I1iqcl3tfr8p9>
  transfer: Anonymize<I69ivk0lfrfoev>
  redeposit: Anonymize<If9vko7pv0231m>
  freeze: Anonymize<Iafkqus0ohh6l6>
  thaw: Anonymize<Iafkqus0ohh6l6>
  freeze_collection: Anonymize<I6cu7obfo0rr0o>
  thaw_collection: Anonymize<I6cu7obfo0rr0o>
  transfer_ownership: Anonymize<I5u33v2v4pjs8l>
  set_team: Anonymize<I3bsaee34vu0no>
  approve_transfer: Anonymize<Ifc31bg23jr6fj>
  cancel_approval: Anonymize<Ic6udaafcaa1fr>
  force_item_status: Anonymize<I7p6okt14sqi28>
  set_attribute: Anonymize<I5tvvgui05tn6e>
  clear_attribute: Anonymize<Ibal0joadvdc2h>
  set_metadata: Anonymize<Iceq9fmmp9aeqv>
  clear_metadata: Anonymize<Iafkqus0ohh6l6>
  set_collection_metadata: Anonymize<I9viqhmdtuof5e>
  clear_collection_metadata: Anonymize<I6cu7obfo0rr0o>
  set_accept_ownership: Anonymize<Ibqooroq6rr5kr>
  set_collection_max_supply: Anonymize<I6h88h8vba22v8>
  set_price: Anonymize<I96e9cuvpvnf1h>
  buy_item: Anonymize<I19jiel1ftbcce>
}>

type Ib9s51pghbgn6b = { collection: number; admin: MultiAddress }

type Ic9ojioik482he = {
  collection: number
  owner: MultiAddress
  free_holding: boolean
}

type I223jg78mng8hq = { collection: number; witness: Anonymize<I59th026dnaruk> }

type I59th026dnaruk = {
  items: number
  item_metadatas: number
  attributes: number
}

type Idl8k9cbpbc2n9 = { collection: number; item: number; owner: MultiAddress }

type I1iqcl3tfr8p9 = {
  collection: number
  item: number
  check_owner: Anonymize<Idcl76h8eqajgc>
}

type Idcl76h8eqajgc = MultiAddress | undefined

type I69ivk0lfrfoev = { collection: number; item: number; dest: MultiAddress }

type If9vko7pv0231m = { collection: number; items: Anonymize<Icgljjb6j82uhn> }

type I5u33v2v4pjs8l = { collection: number; owner: MultiAddress }

type I3bsaee34vu0no = {
  collection: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}

type Ifc31bg23jr6fj = {
  collection: number
  item: number
  delegate: MultiAddress
}

type Ic6udaafcaa1fr = {
  collection: number
  item: number
  maybe_check_delegate: Anonymize<Idcl76h8eqajgc>
}

type I7p6okt14sqi28 = {
  collection: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  free_holding: boolean
  is_frozen: boolean
}

type Ibqooroq6rr5kr = { maybe_collection: Anonymize<I4arjljr6dpflb> }

type I96e9cuvpvnf1h = {
  collection: number
  item: number
  price: Anonymize<I35p85j063s0il>
  whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
}

type I19jiel1ftbcce = { collection: number; item: number; bid_price: bigint }

type Ifub2394n314hb = AnonymousEnum<{
  create: Anonymize<I6rqo16k4nu49m>
  force_create: Anonymize<I38spad9r7d170>
  destroy: Anonymize<I77ie723ncd4co>
  mint: Anonymize<Iaj5lbvoboku16>
  force_mint: Anonymize<I8a6kl8su4id8o>
  burn: Anonymize<Iafkqus0ohh6l6>
  transfer: Anonymize<I69ivk0lfrfoev>
  redeposit: Anonymize<If9vko7pv0231m>
  lock_item_transfer: Anonymize<Iafkqus0ohh6l6>
  unlock_item_transfer: Anonymize<Iafkqus0ohh6l6>
  lock_collection: Anonymize<I1ahf3pvgsgbu>
  transfer_ownership: Anonymize<I5u33v2v4pjs8l>
  set_team: Anonymize<I9qasfq3nkoi2r>
  force_collection_owner: Anonymize<I5u33v2v4pjs8l>
  force_collection_config: Anonymize<I54s4l4td7i9km>
  approve_transfer: Anonymize<I1iv9thng6meth>
  cancel_approval: Anonymize<Ifc31bg23jr6fj>
  clear_all_transfer_approvals: Anonymize<Iafkqus0ohh6l6>
  lock_item_properties: Anonymize<I1jj31tn29ie3c>
  set_attribute: Anonymize<I8caj3ho0b8kia>
  force_set_attribute: Anonymize<I52lhebajmfrtb>
  clear_attribute: Anonymize<Irn56pucio7gb>
  approve_item_attributes: Anonymize<Ifc31bg23jr6fj>
  cancel_item_attributes_approval: Anonymize<I4464j8bj461ff>
  set_metadata: Anonymize<Icrkms46uh8tpb>
  clear_metadata: Anonymize<Iafkqus0ohh6l6>
  set_collection_metadata: Anonymize<I78u60nqh0etah>
  clear_collection_metadata: Anonymize<I6cu7obfo0rr0o>
  set_accept_ownership: Anonymize<Ibqooroq6rr5kr>
  set_collection_max_supply: Anonymize<I6h88h8vba22v8>
  update_mint_settings: Anonymize<I355299hrt5pr6>
  set_price: Anonymize<I96e9cuvpvnf1h>
  buy_item: Anonymize<I19jiel1ftbcce>
  pay_tips: Anonymize<I26c8p47106toa>
  create_swap: Anonymize<I8a1f2hu0n509e>
  cancel_swap: Anonymize<Ic3j8ku6mbsms4>
  claim_swap: Anonymize<If3m92s67irtpm>
  mint_pre_signed: Anonymize<I14r4a9hr0ql0e>
  set_attributes_pre_signed: Anonymize<I8a5mufiann5a3>
}>

type I6rqo16k4nu49m = { admin: MultiAddress; config: Anonymize<If362jnk79orio> }

type I38spad9r7d170 = { owner: MultiAddress; config: Anonymize<If362jnk79orio> }

type I77ie723ncd4co = { collection: number; witness: Anonymize<Idqhe2sslgfeu8> }

type Idqhe2sslgfeu8 = {
  item_metadatas: number
  item_configs: number
  attributes: number
}

type Iaj5lbvoboku16 = {
  collection: number
  item: number
  mint_to: MultiAddress
  witness_data: Anonymize<Ib0113vv89gbic>
}

type Ib0113vv89gbic = Anonymize<Ia2e23n2425vqn> | undefined

type Ia2e23n2425vqn = {
  owned_item: Anonymize<I4arjljr6dpflb>
  mint_price: Anonymize<I35p85j063s0il>
}

type I8a6kl8su4id8o = {
  collection: number
  item: number
  mint_to: MultiAddress
  item_config: bigint
}

type I1ahf3pvgsgbu = { collection: number; lock_settings: bigint }

type I9qasfq3nkoi2r = {
  collection: number
  issuer: Anonymize<Idcl76h8eqajgc>
  admin: Anonymize<Idcl76h8eqajgc>
  freezer: Anonymize<Idcl76h8eqajgc>
}

type I54s4l4td7i9km = { collection: number; config: Anonymize<If362jnk79orio> }

type I1iv9thng6meth = {
  collection: number
  item: number
  delegate: MultiAddress
  maybe_deadline: Anonymize<I4arjljr6dpflb>
}

type I52lhebajmfrtb = {
  set_as: Anonymize<Ihfphjolmsqq1>
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}

type I4464j8bj461ff = {
  collection: number
  item: number
  delegate: MultiAddress
  witness: number
}

type I355299hrt5pr6 = {
  collection: number
  mint_settings: Anonymize<I3lel2b740s3fh>
}

type I26c8p47106toa = { tips: Anonymize<I73vqjhh9uvase> }

type I73vqjhh9uvase = Array<Anonymize<I21hhoccptr6ko>>

type I21hhoccptr6ko = {
  collection: number
  item: number
  receiver: SS58String
  amount: bigint
}

type I8a1f2hu0n509e = {
  offered_collection: number
  offered_item: number
  desired_collection: number
  maybe_desired_item: Anonymize<I4arjljr6dpflb>
  maybe_price: Anonymize<Iemn9sl4bs903b>
  duration: number
}

type Ic3j8ku6mbsms4 = { offered_collection: number; offered_item: number }

type If3m92s67irtpm = {
  send_collection: number
  send_item: number
  receive_collection: number
  receive_item: number
  witness_price: Anonymize<Iemn9sl4bs903b>
}

type I14r4a9hr0ql0e = {
  mint_data: Anonymize<I4o46ti9h9g8u9>
  signature: MultiSignature
  signer: SS58String
}

type I4o46ti9h9g8u9 = {
  collection: number
  item: number
  attributes: Anonymize<I5g1ftt6bt65bl>
  metadata: Binary
  only_account: Anonymize<Ihfphjolmsqq1>
  deadline: number
  mint_price: Anonymize<I35p85j063s0il>
}

export type MultiSignature = Enum<
  | { type: "Ed25519"; value: Anonymize<Binary> }
  | { type: "Sr25519"; value: Anonymize<Binary> }
  | { type: "Ecdsa"; value: Anonymize<Binary> }
>
export const MultiSignature = _Enum as unknown as GetEnum<MultiSignature>

type I8a5mufiann5a3 = {
  data: Anonymize<Iaaqgpqooangl>
  signature: MultiSignature
  signer: SS58String
}

type Iaaqgpqooangl = {
  collection: number
  item: number
  attributes: Anonymize<I5g1ftt6bt65bl>
  namespace: Anonymize<I966fu47vp6aqm>
  deadline: number
}

type If63s12hm5a8p0 = AnonymousEnum<{
  create: Anonymize<Ieoilfl76rj048>
  force_create: Anonymize<Icl4v2o4s41rdj>
  start_destroy: Anonymize<I27502riuof4h7>
  destroy_accounts: Anonymize<I27502riuof4h7>
  destroy_approvals: Anonymize<I27502riuof4h7>
  finish_destroy: Anonymize<I27502riuof4h7>
  mint: Anonymize<I7sjl8t0qp2l1u>
  burn: Anonymize<I1n4e3mqee7mpq>
  transfer: Anonymize<I4e2e1qjctjtie>
  transfer_keep_alive: Anonymize<I4e2e1qjctjtie>
  force_transfer: Anonymize<Ib78u91ga2e3iq>
  freeze: Anonymize<Iee8i15mhu1cm>
  thaw: Anonymize<Iee8i15mhu1cm>
  freeze_asset: Anonymize<I27502riuof4h7>
  thaw_asset: Anonymize<I27502riuof4h7>
  transfer_ownership: Anonymize<I5njg3n9tpp2qs>
  set_team: Anonymize<I2964puubsic5d>
  set_metadata: Anonymize<Ifg4ia2dpd33c6>
  clear_metadata: Anonymize<I27502riuof4h7>
  force_set_metadata: Anonymize<Ifcqbnmct91p9u>
  force_clear_metadata: Anonymize<I27502riuof4h7>
  force_asset_status: Anonymize<Ifuask0ie8qhdm>
  approve_transfer: Anonymize<I45abj40ogbub1>
  cancel_approval: Anonymize<Im5jn73018qbs>
  force_cancel_approval: Anonymize<I5kenlv06877de>
  transfer_approved: Anonymize<Ib0hhlh5fdej9c>
  touch: Anonymize<I27502riuof4h7>
  refund: Anonymize<Id0po48pmpq2il>
  set_min_balance: Anonymize<Ifbdn1fab64mfj>
  touch_other: Anonymize<Iee8i15mhu1cm>
  refund_other: Anonymize<Iee8i15mhu1cm>
  block: Anonymize<Iee8i15mhu1cm>
}>

type Ieoilfl76rj048 = {
  id: Anonymize<I43cmiele6sevi>
  admin: MultiAddress
  min_balance: bigint
}

type Icl4v2o4s41rdj = {
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}

type I27502riuof4h7 = { id: Anonymize<I43cmiele6sevi> }

type I7sjl8t0qp2l1u = {
  id: Anonymize<I43cmiele6sevi>
  beneficiary: MultiAddress
  amount: bigint
}

type I1n4e3mqee7mpq = {
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
  amount: bigint
}

type I4e2e1qjctjtie = {
  id: Anonymize<I43cmiele6sevi>
  target: MultiAddress
  amount: bigint
}

type Ib78u91ga2e3iq = {
  id: Anonymize<I43cmiele6sevi>
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}

type Iee8i15mhu1cm = { id: Anonymize<I43cmiele6sevi>; who: MultiAddress }

type I5njg3n9tpp2qs = { id: Anonymize<I43cmiele6sevi>; owner: MultiAddress }

type I2964puubsic5d = {
  id: Anonymize<I43cmiele6sevi>
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}

type Ifg4ia2dpd33c6 = {
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
}

type Ifcqbnmct91p9u = {
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}

type Ifuask0ie8qhdm = {
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}

type I45abj40ogbub1 = {
  id: Anonymize<I43cmiele6sevi>
  delegate: MultiAddress
  amount: bigint
}

type Im5jn73018qbs = { id: Anonymize<I43cmiele6sevi>; delegate: MultiAddress }

type I5kenlv06877de = {
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  delegate: MultiAddress
}

type Ib0hhlh5fdej9c = {
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}

type Id0po48pmpq2il = { id: Anonymize<I43cmiele6sevi>; allow_burn: boolean }

type Ifbdn1fab64mfj = { id: Anonymize<I43cmiele6sevi>; min_balance: bigint }

type I3a9gjlu51cehg = { index: number; call: Anonymize<I9ih0jev11cnlt> }

type Ibmq86o76d7t49 = {
  as_origin: Anonymize<I1un5g4rnbtvdk>
  call: Anonymize<I9ih0jev11cnlt>
}

type I1un5g4rnbtvdk = AnonymousEnum<{
  system: Anonymize<DispatchRawOrigin>
  PolkadotXcm: Anonymize<XcmPalletOrigin>
  CumulusXcm: Anonymize<Ierdca6i2vfk3r>
  Void: Anonymize<undefined>
}>

export type DispatchRawOrigin = Enum<
  | { type: "Root"; value: undefined }
  | { type: "Signed"; value: Anonymize<SS58String> }
  | { type: "None"; value: undefined }
>
export const DispatchRawOrigin = _Enum as unknown as GetEnum<DispatchRawOrigin>

export type XcmPalletOrigin = Enum<
  | { type: "Xcm"; value: Anonymize<I43cmiele6sevi> }
  | { type: "Response"; value: Anonymize<I43cmiele6sevi> }
>
export const XcmPalletOrigin = _Enum as unknown as GetEnum<XcmPalletOrigin>

type Ierdca6i2vfk3r = AnonymousEnum<{
  Relay: undefined
  SiblingParachain: Anonymize<number>
}>

type Ib3khl2i8bnoln = {
  call: Anonymize<I9ih0jev11cnlt>
  weight: Anonymize<I4q39t5hn830vp>
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

type I9vapnho0vb2oi = AnonymousEnum<{
  OverlappingUpgrades: undefined
  ProhibitedByPolkadot: undefined
  TooBig: undefined
  ValidationDataNotAvailable: undefined
  HostConfigurationNotAvailable: undefined
  NotScheduled: undefined
  NothingAuthorized: undefined
  Unauthorized: undefined
}>

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

type I3la0pignkgcnh = AnonymousEnum<{
  TooManyCandidates: undefined
  TooFewEligibleCollators: undefined
  AlreadyCandidate: undefined
  NotCandidate: undefined
  TooManyInvulnerables: undefined
  AlreadyInvulnerable: undefined
  NotInvulnerable: undefined
  NoAssociatedValidatorId: undefined
  ValidatorNotRegistered: undefined
}>

export type SessionPalletError = Enum<
  | { type: "InvalidProof"; value: undefined }
  | { type: "NoAssociatedValidatorId"; value: undefined }
  | { type: "DuplicatedKey"; value: undefined }
  | { type: "NoKeys"; value: undefined }
  | { type: "NoAccount"; value: undefined }
>
export const SessionPalletError =
  _Enum as unknown as GetEnum<SessionPalletError>

type I76qm6phqhi8t1 = AnonymousEnum<{
  FailedToSend: undefined
  BadXcmOrigin: undefined
  BadXcm: undefined
  BadOverweightIndex: undefined
  WeightOverLimit: undefined
}>

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

type Iah28jd3h6cvoq = AnonymousEnum<{
  Unknown: undefined
  OverLimit: undefined
}>

export type UtilityPalletError = Enum<{
  type: "TooManyCalls"
  value: undefined
}>
export const UtilityPalletError =
  _Enum as unknown as GetEnum<UtilityPalletError>

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

type Ie2fkaetore4tc = AnonymousEnum<{
  BalanceLow: undefined
  NoAccount: undefined
  NoPermission: undefined
  Unknown: undefined
  Frozen: undefined
  InUse: undefined
  BadWitness: undefined
  MinBalanceZero: undefined
  UnavailableConsumer: undefined
  BadMetadata: undefined
  Unapproved: undefined
  WouldDie: undefined
  AlreadyExists: undefined
  NoDeposit: undefined
  WouldBurn: undefined
  LiveAsset: undefined
  AssetNotLive: undefined
  IncorrectStatus: undefined
  NotFrozen: undefined
  CallbackFailed: undefined
}>

type I65g5p25pk955m = AnonymousEnum<{
  NoPermission: undefined
  UnknownCollection: undefined
  AlreadyExists: undefined
  WrongOwner: undefined
  BadWitness: undefined
  InUse: undefined
  Frozen: undefined
  WrongDelegate: undefined
  NoDelegate: undefined
  Unapproved: undefined
  Unaccepted: undefined
  Locked: undefined
  MaxSupplyReached: undefined
  MaxSupplyAlreadySet: undefined
  MaxSupplyTooSmall: undefined
  UnknownItem: undefined
  NotForSale: undefined
  BidTooLow: undefined
}>

type Ibsev88na80mu7 = AnonymousEnum<{
  NoPermission: undefined
  UnknownCollection: undefined
  AlreadyExists: undefined
  ApprovalExpired: undefined
  WrongOwner: undefined
  BadWitness: undefined
  CollectionIdInUse: undefined
  ItemsNonTransferable: undefined
  NotDelegate: undefined
  WrongDelegate: undefined
  Unapproved: undefined
  Unaccepted: undefined
  ItemLocked: undefined
  LockedItemAttributes: undefined
  LockedCollectionAttributes: undefined
  LockedItemMetadata: undefined
  LockedCollectionMetadata: undefined
  MaxSupplyReached: undefined
  MaxSupplyLocked: undefined
  MaxSupplyTooSmall: undefined
  UnknownItem: undefined
  UnknownSwap: undefined
  MetadataNotFound: undefined
  AttributeNotFound: undefined
  NotForSale: undefined
  BidTooLow: undefined
  ReachedApprovalLimit: undefined
  DeadlineExpired: undefined
  WrongDuration: undefined
  MethodDisabled: undefined
  WrongSetting: undefined
  InconsistentItemConfig: undefined
  NoConfig: undefined
  RolesNotCleared: undefined
  MintNotStarted: undefined
  MintEnded: undefined
  AlreadyClaimed: undefined
  IncorrectData: undefined
  WrongOrigin: undefined
  WrongSignature: undefined
  IncorrectMetadata: undefined
  MaxAttributesLimitReached: undefined
  WrongNamespace: undefined
  CollectionNotEmpty: undefined
  WitnessRequired: undefined
}>

type Ia4jqf401148a4 = {
  header: Anonymize<I6t1nedlt7mobn>
  extrinsics: Anonymize<Itom7fk49o0c9>
}

type I6t1nedlt7mobn = {
  parent_hash: Binary
  number: number
  state_root: Binary
  extrinsics_root: Binary
  digest: Anonymize<Idin6nhq46lvdj>
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

type I2h3gvnoso66r7 = ResultPayload<
  XcmVersionedMultiAssets,
  Anonymize<Ifinuns4munfa5>
>

type Ifinuns4munfa5 = AnonymousEnum<{
  AssetIdConversionFailed: undefined
  AmountToBalanceConversionFailed: undefined
}>

type Ic1d4u2opv3fst = {
  upward_messages: Anonymize<Itom7fk49o0c9>
  horizontal_messages: Anonymize<I6r5cbv8ttrb09>
  new_validation_code: Anonymize<Iabpgqcjikia83>
  processed_downward_messages: number
  hrmp_watermark: number
  head_data: Binary
}

type I9q9lvv0h98nhk = ResultPayload<undefined, string>

const cf3ncnq6stc567 = "f3ncnq6stc567"
const cfmam6uono5akb = "fmam6uono5akb"
const c7i24fvhamijd = "7i24fvhamijd"
const cegurtje61sbu9 = "egurtje61sbu9"
const c51jgofmopm9om = "51jgofmopm9om"
const ctom7fk49o0c9 = "tom7fk49o0c9"
const c7d2tqf029vcod = "7d2tqf029vcod"
const c4q39t5hn830vp = "4q39t5hn830vp"
const cb3qt1mgvgmbgi = "b3qt1mgvgmbgi"
const cbfv6n704ucltm = "bfv6n704ucltm"
const ca2lhg7l2hilo3 = "a2lhg7l2hilo3"
const c44uqc9gktfck1 = "44uqc9gktfck1"
const cdhnf6rtqoslea = "dhnf6rtqoslea"
const c8m3ph6rer8teq = "8m3ph6rer8teq"
const cak71lriap930h = "ak71lriap930h"
const c56gikrvhifab0 = "56gikrvhifab0"
const cd3n7dqk3crl60 = "d3n7dqk3crl60"
const c8ofcg5rbj0g2c = "8ofcg5rbj0g2c"
const c6pjjpfvhvcfru = "6pjjpfvhvcfru"
const cen6q0lasi0m7i = "en6q0lasi0m7i"
const c39ibapn5dm6tr = "39ibapn5dm6tr"
const c4cbvqmqadhrea = "4cbvqmqadhrea"
const cab1retd4gg4q1 = "ab1retd4gg4q1"
const c3vh014cqgmrfd = "3vh014cqgmrfd"
const c2tni7rrb2buqm = "2tni7rrb2buqm"
const ceeis6pj62kiu4 = "eeis6pj62kiu4"
const c732o5n04n5ohg = "732o5n04n5ohg"
const c3pog27ittgi9g = "3pog27ittgi9g"
const cfcceq8taolrca = "fcceq8taolrca"
const c6m9u9b2jh9e7q = "6m9u9b2jh9e7q"
const c5f79m6vb0cjl3 = "5f79m6vb0cjl3"
const cd3bpmvju2iqi5 = "d3bpmvju2iqi5"
const cc5b47dj4coa3r = "c5b47dj4coa3r"
const c9gfesr77iu6er = "9gfesr77iu6er"
const cdabu8cc4fnfuq = "dabu8cc4fnfuq"
const c69ivk0lfrfoev = "69ivk0lfrfoev"
const cf9vko7pv0231m = "f9vko7pv0231m"
const cafkqus0ohh6l6 = "afkqus0ohh6l6"
const c6cu7obfo0rr0o = "6cu7obfo0rr0o"
const c5u33v2v4pjs8l = "5u33v2v4pjs8l"
const cfc31bg23jr6fj = "fc31bg23jr6fj"
const c5tvvgui05tn6e = "5tvvgui05tn6e"
const cbal0joadvdc2h = "bal0joadvdc2h"
const cceq9fmmp9aeqv = "ceq9fmmp9aeqv"
const c9viqhmdtuof5e = "9viqhmdtuof5e"
const cbqooroq6rr5kr = "bqooroq6rr5kr"
const c6h88h8vba22v8 = "6h88h8vba22v8"
const c96e9cuvpvnf1h = "96e9cuvpvnf1h"
const c19jiel1ftbcce = "19jiel1ftbcce"
const c1jj31tn29ie3c = "1jj31tn29ie3c"
const c8caj3ho0b8kia = "8caj3ho0b8kia"
const crn56pucio7gb = "rn56pucio7gb"
const ccrkms46uh8tpb = "crkms46uh8tpb"
const c78u60nqh0etah = "78u60nqh0etah"
const c27502riuof4h7 = "27502riuof4h7"
const c4e2e1qjctjtie = "4e2e1qjctjtie"
const cee8i15mhu1cm = "ee8i15mhu1cm"
const ccbccs0ug47ilf = "cbccs0ug47ilf"
const cd5fm4p8lj5qgi = "d5fm4p8lj5qgi"
const c3qt1hgg4djhgb = "3qt1hgg4djhgb"
const c6v8sm60vvkmk7 = "6v8sm60vvkmk7"
const c2vo9trn8nhllu = "2vo9trn8nhllu"
const cse9r0vrat2m6 = "se9r0vrat2m6"
const c2uqmls7kcdnii = "2uqmls7kcdnii"
const c5qm1bvb2j3ap2 = "5qm1bvb2j3ap2"
const c5pnf8l8c1nkfk = "5pnf8l8c1nkfk"
const c3s707ha9gi47u = "3s707ha9gi47u"
const ce5i8qqljk3tjb = "e5i8qqljk3tjb"
const c28ankic0g500e = "28ankic0g500e"
const caitn5bqfacj7k = "aitn5bqfacj7k"
const cf4ebvclj2ugvi = "f4ebvclj2ugvi"
const ca5le7udkgbaq9 = "a5le7udkgbaq9"
const c9gqanbbbe917p = "9gqanbbbe917p"
const cd1m1230297f7a = "d1m1230297f7a"
const cfvb1p5munhhv4 = "fvb1p5munhhv4"
const c46h83ilqeed3g = "46h83ilqeed3g"
const ccahse3uoi76n7 = "cahse3uoi76n7"
const c5fjkvcb5vr6nb = "5fjkvcb5vr6nb"
const c2gr1toekv86b9 = "2gr1toekv86b9"
const c2v2ikqt2trp52 = "2v2ikqt2trp52"
const cf3057hi1g5qlo = "f3057hi1g5qlo"
const caii5qf41d5n3d = "aii5qf41d5n3d"
const c9i1f9mrso1hmf = "9i1f9mrso1hmf"
const c1cft1pbnpmk8h = "1cft1pbnpmk8h"
const c2c3boiuqtga9e = "2c3boiuqtga9e"
const cddsdcglf5ofsb = "ddsdcglf5ofsb"
const c9lo1oa3a7kqqa = "9lo1oa3a7kqqa"

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
  "dhc577m5btfvc" as StorageDescriptor<[Key: number], Binary, false>
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
  Array<Anonymize<Iepshjdsbc1nmq>>,
  false
> = "675elaq874cr7" as StorageDescriptor<
  [],
  Array<Anonymize<Iepshjdsbc1nmq>>,
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
const stg_ParachainSystem_UnincludedSegment: StorageDescriptor<
  [],
  Array<Anonymize<I8ajtuet8esesv>>,
  false
> = "6f7juk1vj8fiq" as StorageDescriptor<
  [],
  Array<Anonymize<I8ajtuet8esesv>>,
  false
>
const stg_ParachainSystem_AggregatedUnincludedSegment: StorageDescriptor<
  [],
  {
    used_bandwidth: Anonymize<Ieafp1gui1o4cl>
    hrmp_watermark: Anonymize<I4arjljr6dpflb>
    consumed_go_ahead_signal: Anonymize<Ie1vdku2j6ccvj>
  },
  true
> = "amnn769l033b4" as StorageDescriptor<
  [],
  {
    used_bandwidth: Anonymize<Ieafp1gui1o4cl>
    hrmp_watermark: Anonymize<I4arjljr6dpflb>
    consumed_go_ahead_signal: Anonymize<Ie1vdku2j6ccvj>
  },
  true
>
const stg_ParachainSystem_PendingValidationCode: StorageDescriptor<
  [],
  Binary,
  false
> = c51jgofmopm9om as StorageDescriptor<[], Binary, false>
const stg_ParachainSystem_NewValidationCode: StorageDescriptor<
  [],
  Binary,
  true
> = c51jgofmopm9om as StorageDescriptor<[], Binary, true>
const stg_ParachainSystem_ValidationData: StorageDescriptor<
  [],
  {
    parent_head: Binary
    relay_parent_number: number
    relay_parent_storage_root: Binary
    max_pov_size: number
  },
  true
> = "5r8ef6aie125l" as StorageDescriptor<
  [],
  {
    parent_head: Binary
    relay_parent_number: number
    relay_parent_storage_root: Binary
    max_pov_size: number
  },
  true
>
const stg_ParachainSystem_DidSetValidationCode: StorageDescriptor<
  [],
  boolean,
  false
> = cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_ParachainSystem_LastRelayChainBlockNumber: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParachainSystem_UpgradeRestrictionSignal: StorageDescriptor<
  [],
  PolkadotPrimitivesV5UpgradeRestriction | undefined,
  false
> = "d34bi0o1gnln9" as StorageDescriptor<
  [],
  PolkadotPrimitivesV5UpgradeRestriction | undefined,
  false
>
const stg_ParachainSystem_UpgradeGoAhead: StorageDescriptor<
  [],
  PolkadotPrimitivesV5UpgradeGoAhead | undefined,
  false
> = "e1vdku2j6ccvj" as StorageDescriptor<
  [],
  PolkadotPrimitivesV5UpgradeGoAhead | undefined,
  false
>
const stg_ParachainSystem_RelayStateProof: StorageDescriptor<
  [],
  Array<Binary>,
  true
> = ctom7fk49o0c9 as StorageDescriptor<[], Array<Binary>, true>
const stg_ParachainSystem_RelevantMessagingState: StorageDescriptor<
  [],
  {
    dmq_mqc_head: Binary
    relay_dispatch_queue_remaining_capacity: Anonymize<I3j1v1c2btq4bd>
    ingress_channels: Anonymize<I90nfahji0n33j>
    egress_channels: Anonymize<I90nfahji0n33j>
  },
  true
> = "8gicq33tfu7j1" as StorageDescriptor<
  [],
  {
    dmq_mqc_head: Binary
    relay_dispatch_queue_remaining_capacity: Anonymize<I3j1v1c2btq4bd>
    ingress_channels: Anonymize<I90nfahji0n33j>
    egress_channels: Anonymize<I90nfahji0n33j>
  },
  true
>
const stg_ParachainSystem_HostConfiguration: StorageDescriptor<
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
  },
  true
> = "4iumukclgj8ej" as StorageDescriptor<
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
  },
  true
>
const stg_ParachainSystem_LastDmqMqcHead: StorageDescriptor<[], Binary, false> =
  c7i24fvhamijd as StorageDescriptor<[], Binary, false>
const stg_ParachainSystem_LastHrmpMqcHeads: StorageDescriptor<
  [],
  Array<Anonymize<If89923vhoiaim>>,
  false
> = "93ssha9egqq23" as StorageDescriptor<
  [],
  Array<Anonymize<If89923vhoiaim>>,
  false
>
const stg_ParachainSystem_ProcessedDownwardMessages: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParachainSystem_HrmpWatermark: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParachainSystem_HrmpOutboundMessages: StorageDescriptor<
  [],
  Array<Anonymize<I958l48g4qg5rf>>,
  false
> = "6r5cbv8ttrb09" as StorageDescriptor<
  [],
  Array<Anonymize<I958l48g4qg5rf>>,
  false
>
const stg_ParachainSystem_UpwardMessages: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = ctom7fk49o0c9 as StorageDescriptor<[], Array<Binary>, false>
const stg_ParachainSystem_PendingUpwardMessages: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = ctom7fk49o0c9 as StorageDescriptor<[], Array<Binary>, false>
const stg_ParachainSystem_UpwardDeliveryFeeFactor: StorageDescriptor<
  [],
  bigint,
  false
> = c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_ParachainSystem_AnnouncedHrmpMessagesPerCandidate: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ParachainSystem_ReservedXcmpWeightOverride: StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  true
> = c4q39t5hn830vp as StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  true
>
const stg_ParachainSystem_ReservedDmpWeightOverride: StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  true
> = c4q39t5hn830vp as StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  true
>
const stg_ParachainSystem_AuthorizedUpgrade: StorageDescriptor<
  [],
  { code_hash: Binary; check_version: boolean },
  true
> = cb3qt1mgvgmbgi as StorageDescriptor<
  [],
  { code_hash: Binary; check_version: boolean },
  true
>
const stg_ParachainSystem_CustomValidationHeadData: StorageDescriptor<
  [],
  Binary,
  true
> = c51jgofmopm9om as StorageDescriptor<[], Binary, true>
const stg_Timestamp_Now: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_Timestamp_DidUpdate: StorageDescriptor<[], boolean, false> =
  cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_ParachainInfo_ParachainId: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
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
  Array<Anonymize<I7qdm60946h5u9>>,
  false
> = cbfv6n704ucltm as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I7qdm60946h5u9>>,
  false
>
const stg_Balances_Freezes: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I7qdm60946h5u9>>,
  false
> = cbfv6n704ucltm as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<I7qdm60946h5u9>>,
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
const stg_CollatorSelection_Invulnerables: StorageDescriptor<
  [],
  Array<SS58String>,
  false
> = ca2lhg7l2hilo3 as StorageDescriptor<[], Array<SS58String>, false>
const stg_CollatorSelection_Candidates: StorageDescriptor<
  [],
  Array<Anonymize<Iep1lmt6q3s6r3>>,
  false
> = "fi4da1gej1fri" as StorageDescriptor<
  [],
  Array<Anonymize<Iep1lmt6q3s6r3>>,
  false
>
const stg_CollatorSelection_LastAuthoredBlock: StorageDescriptor<
  [Key: SS58String],
  number,
  false
> = c44uqc9gktfck1 as StorageDescriptor<[Key: SS58String], number, false>
const stg_CollatorSelection_DesiredCandidates: StorageDescriptor<
  [],
  number,
  false
> = cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_CollatorSelection_CandidacyBond: StorageDescriptor<
  [],
  bigint,
  false
> = c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
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
  Array<Anonymize<I73gble6tmb52f>>,
  false
> = "9our4clsjkim0" as StorageDescriptor<
  [],
  Array<Anonymize<I73gble6tmb52f>>,
  false
>
const stg_Session_DisabledValidators: StorageDescriptor<
  [],
  Array<number>,
  false
> = "cgljjb6j82uhn" as StorageDescriptor<[], Array<number>, false>
const stg_Session_NextKeys: StorageDescriptor<[Key: SS58String], Binary, true> =
  "jf67g8lik487" as StorageDescriptor<[Key: SS58String], Binary, true>
const stg_Session_KeyOwner: StorageDescriptor<
  [Key: [Binary, Binary]],
  SS58String,
  true
> = "8drjr6qpp26i0" as StorageDescriptor<
  [Key: [Binary, Binary]],
  SS58String,
  true
>
const stg_Aura_Authorities: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_Aura_CurrentSlot: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_AuraExt_Authorities: StorageDescriptor<
  [],
  Array<Binary>,
  false
> = cdhnf6rtqoslea as StorageDescriptor<[], Array<Binary>, false>
const stg_AuraExt_SlotInfo: StorageDescriptor<[], [bigint, number], true> =
  "6cs1itejju2vv" as StorageDescriptor<[], [bigint, number], true>
const stg_XcmpQueue_InboundXcmpStatus: StorageDescriptor<
  [],
  Array<Anonymize<Ifqaq2umctvajg>>,
  false
> = "1imu1nmuvsfjb" as StorageDescriptor<
  [],
  Array<Anonymize<Ifqaq2umctvajg>>,
  false
>
const stg_XcmpQueue_InboundXcmpMessages: StorageDescriptor<
  [number, number],
  Binary,
  false
> = c8m3ph6rer8teq as StorageDescriptor<[number, number], Binary, false>
const stg_XcmpQueue_OutboundXcmpStatus: StorageDescriptor<
  [],
  Array<Anonymize<Ittnsbm78tol1>>,
  false
> = "1mse8p8gvh143" as StorageDescriptor<
  [],
  Array<Anonymize<Ittnsbm78tol1>>,
  false
>
const stg_XcmpQueue_OutboundXcmpMessages: StorageDescriptor<
  [number, number],
  Binary,
  false
> = c8m3ph6rer8teq as StorageDescriptor<[number, number], Binary, false>
const stg_XcmpQueue_SignalMessages: StorageDescriptor<
  [Key: number],
  Binary,
  false
> = cfmam6uono5akb as StorageDescriptor<[Key: number], Binary, false>
const stg_XcmpQueue_QueueConfig: StorageDescriptor<
  [],
  {
    suspend_threshold: number
    drop_threshold: number
    resume_threshold: number
    threshold_weight: Anonymize<I4q39t5hn830vp>
    weight_restrict_decay: Anonymize<I4q39t5hn830vp>
    xcmp_max_individual_weight: Anonymize<I4q39t5hn830vp>
  },
  false
> = "e0cpusdmler9p" as StorageDescriptor<
  [],
  {
    suspend_threshold: number
    drop_threshold: number
    resume_threshold: number
    threshold_weight: Anonymize<I4q39t5hn830vp>
    weight_restrict_decay: Anonymize<I4q39t5hn830vp>
    xcmp_max_individual_weight: Anonymize<I4q39t5hn830vp>
  },
  false
>
const stg_XcmpQueue_Overweight: StorageDescriptor<
  [Key: bigint],
  [number, number, Binary],
  true
> = "ag7teajaeahih" as StorageDescriptor<
  [Key: bigint],
  [number, number, Binary],
  true
>
const stg_XcmpQueue_CounterForOverweight: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_XcmpQueue_OverweightCount: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_XcmpQueue_QueueSuspended: StorageDescriptor<[], boolean, false> =
  cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_XcmpQueue_DeliveryFeeFactor: StorageDescriptor<
  [Key: number],
  bigint,
  false
> = "au4oj9ee8cokk" as StorageDescriptor<[Key: number], bigint, false>
const stg_PolkadotXcm_QueryCounter: StorageDescriptor<[], bigint, false> =
  c7d2tqf029vcod as StorageDescriptor<[], bigint, false>
const stg_PolkadotXcm_Queries: StorageDescriptor<
  [Key: bigint],
  XcmPalletQueryStatus,
  true
> = "aifcpen4lan73" as StorageDescriptor<
  [Key: bigint],
  XcmPalletQueryStatus,
  true
>
const stg_PolkadotXcm_AssetTraps: StorageDescriptor<
  [Key: Binary],
  number,
  false
> = "csbuok7olbg29" as StorageDescriptor<[Key: Binary], number, false>
const stg_PolkadotXcm_SafeXcmVersion: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_PolkadotXcm_SupportedVersion: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  number,
  true
> = "a2prke2fv2gco" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  number,
  true
>
const stg_PolkadotXcm_VersionNotifiers: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  bigint,
  true
> = "b5eb0g1ji08ce" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  bigint,
  true
>
const stg_PolkadotXcm_VersionNotifyTargets: StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  [bigint, Anonymize<I4q39t5hn830vp>, number],
  true
> = "doqdmp81cgk1" as StorageDescriptor<
  [number, XcmVersionedMultiLocation],
  [bigint, Anonymize<I4q39t5hn830vp>, number],
  true
>
const stg_PolkadotXcm_VersionDiscoveryQueue: StorageDescriptor<
  [],
  Array<Anonymize<I2tguvlrf6n4ik>>,
  false
> = "bdqc639q3ofe0" as StorageDescriptor<
  [],
  Array<Anonymize<I2tguvlrf6n4ik>>,
  false
>
const stg_PolkadotXcm_CurrentMigration: StorageDescriptor<
  [],
  XcmPalletVersionMigrationStage,
  true
> = "1s1utqquuaa2b" as StorageDescriptor<
  [],
  XcmPalletVersionMigrationStage,
  true
>
const stg_PolkadotXcm_RemoteLockedFungibles: StorageDescriptor<
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
const stg_PolkadotXcm_LockedFungibles: StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<Ifk51k72g143a3>>,
  true
> = "eq3sb8bdg5e7m" as StorageDescriptor<
  [Key: SS58String],
  Array<Anonymize<Ifk51k72g143a3>>,
  true
>
const stg_PolkadotXcm_XcmExecutionSuspended: StorageDescriptor<
  [],
  boolean,
  false
> = cegurtje61sbu9 as StorageDescriptor<[], boolean, false>
const stg_DmpQueue_Configuration: StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  false
> = c4q39t5hn830vp as StorageDescriptor<
  [],
  { ref_time: bigint; proof_size: bigint },
  false
>
const stg_DmpQueue_PageIndex: StorageDescriptor<
  [],
  { begin_used: number; end_used: number; overweight_count: bigint },
  false
> = "epvrcsdbii2qt" as StorageDescriptor<
  [],
  { begin_used: number; end_used: number; overweight_count: bigint },
  false
>
const stg_DmpQueue_Pages: StorageDescriptor<
  [Key: number],
  Array<Anonymize<Icp9h5ma02v1rg>>,
  false
> = "bqe43slm72ei6" as StorageDescriptor<
  [Key: number],
  Array<Anonymize<Icp9h5ma02v1rg>>,
  false
>
const stg_DmpQueue_Overweight: StorageDescriptor<
  [Key: bigint],
  [number, Binary],
  true
> = "2d9i2pki3fgef" as StorageDescriptor<[Key: bigint], [number, Binary], true>
const stg_DmpQueue_CounterForOverweight: StorageDescriptor<[], number, false> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, false>
const stg_ToKusamaXcmRouter_Bridge: StorageDescriptor<
  [],
  { delivery_fee_factor: bigint; is_congested: boolean },
  false
> = "7f4alf2hnuu8s" as StorageDescriptor<
  [],
  { delivery_fee_factor: bigint; is_congested: boolean },
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
const stg_Proxy_Proxies: StorageDescriptor<
  [Key: SS58String],
  [Anonymize<I9rurpvdrvevl0>, bigint],
  false
> = "amtomqbhcnvak" as StorageDescriptor<
  [Key: SS58String],
  [Anonymize<I9rurpvdrvevl0>, bigint],
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
const stg_Assets_Asset: StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    supply: bigint
    deposit: bigint
    min_balance: bigint
    is_sufficient: boolean
    accounts: number
    sufficients: number
    approvals: number
    status: Anonymize<Ichpfv056f8vda>
  },
  true
> = "eckoncnsoi18k" as StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    supply: bigint
    deposit: bigint
    min_balance: bigint
    is_sufficient: boolean
    accounts: number
    sufficients: number
    approvals: number
    status: Anonymize<Ichpfv056f8vda>
  },
  true
>
const stg_Assets_Account: StorageDescriptor<
  [number, SS58String],
  {
    balance: bigint
    status: Anonymize<I4toln8faf1bi6>
    reason: Anonymize<Idcivh1e680ag5>
    extra: undefined
  },
  true
> = "h026ll0jf3ke" as StorageDescriptor<
  [number, SS58String],
  {
    balance: bigint
    status: Anonymize<I4toln8faf1bi6>
    reason: Anonymize<Idcivh1e680ag5>
    extra: undefined
  },
  true
>
const stg_Assets_Approvals: StorageDescriptor<
  [number, SS58String, SS58String],
  { amount: bigint; deposit: bigint },
  true
> = "5t8fbofv263rh" as StorageDescriptor<
  [number, SS58String, SS58String],
  { amount: bigint; deposit: bigint },
  true
>
const stg_Assets_Metadata: StorageDescriptor<
  [Key: number],
  {
    deposit: bigint
    name: Binary
    symbol: Binary
    decimals: number
    is_frozen: boolean
  },
  false
> = "1f5ndhes4p8v2" as StorageDescriptor<
  [Key: number],
  {
    deposit: bigint
    name: Binary
    symbol: Binary
    decimals: number
    is_frozen: boolean
  },
  false
>
const stg_Uniques_Class: StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    total_deposit: bigint
    free_holding: boolean
    items: number
    item_metadatas: number
    attributes: number
    is_frozen: boolean
  },
  true
> = "7tlgda4qpqv69" as StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    total_deposit: bigint
    free_holding: boolean
    items: number
    item_metadatas: number
    attributes: number
    is_frozen: boolean
  },
  true
>
const stg_Uniques_OwnershipAcceptance: StorageDescriptor<
  [Key: SS58String],
  number,
  true
> = c44uqc9gktfck1 as StorageDescriptor<[Key: SS58String], number, true>
const stg_Uniques_Account: StorageDescriptor<
  [SS58String, number, number],
  undefined,
  true
> = cak71lriap930h as StorageDescriptor<
  [SS58String, number, number],
  undefined,
  true
>
const stg_Uniques_ClassAccount: StorageDescriptor<
  [SS58String, number],
  undefined,
  true
> = c56gikrvhifab0 as StorageDescriptor<[SS58String, number], undefined, true>
const stg_Uniques_Asset: StorageDescriptor<
  [number, number],
  {
    owner: SS58String
    approved: Anonymize<Ihfphjolmsqq1>
    is_frozen: boolean
    deposit: bigint
  },
  true
> = "9g6icdg5josm0" as StorageDescriptor<
  [number, number],
  {
    owner: SS58String
    approved: Anonymize<Ihfphjolmsqq1>
    is_frozen: boolean
    deposit: bigint
  },
  true
>
const stg_Uniques_ClassMetadataOf: StorageDescriptor<
  [Key: number],
  { deposit: bigint; data: Binary; is_frozen: boolean },
  true
> = "eh73atsc0t61k" as StorageDescriptor<
  [Key: number],
  { deposit: bigint; data: Binary; is_frozen: boolean },
  true
>
const stg_Uniques_InstanceMetadataOf: StorageDescriptor<
  [number, number],
  { deposit: bigint; data: Binary; is_frozen: boolean },
  true
> = "crlqu3a4qpjtu" as StorageDescriptor<
  [number, number],
  { deposit: bigint; data: Binary; is_frozen: boolean },
  true
>
const stg_Uniques_Attribute: StorageDescriptor<
  [number, Anonymize<I4arjljr6dpflb>, Binary],
  [Binary, bigint],
  true
> = "78ar9nhrjipca" as StorageDescriptor<
  [number, Anonymize<I4arjljr6dpflb>, Binary],
  [Binary, bigint],
  true
>
const stg_Uniques_ItemPriceOf: StorageDescriptor<
  [number, number],
  [bigint, Anonymize<Ihfphjolmsqq1>],
  true
> = cd3n7dqk3crl60 as StorageDescriptor<
  [number, number],
  [bigint, Anonymize<Ihfphjolmsqq1>],
  true
>
const stg_Uniques_CollectionMaxSupply: StorageDescriptor<
  [Key: number],
  number,
  true
> = "2snmki6ntodt" as StorageDescriptor<[Key: number], number, true>
const stg_Nfts_Collection: StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    owner_deposit: bigint
    items: number
    item_metadatas: number
    item_configs: number
    attributes: number
  },
  true
> = "78kmk33nhtvn0" as StorageDescriptor<
  [Key: number],
  {
    owner: SS58String
    owner_deposit: bigint
    items: number
    item_metadatas: number
    item_configs: number
    attributes: number
  },
  true
>
const stg_Nfts_OwnershipAcceptance: StorageDescriptor<
  [Key: SS58String],
  number,
  true
> = c44uqc9gktfck1 as StorageDescriptor<[Key: SS58String], number, true>
const stg_Nfts_Account: StorageDescriptor<
  [SS58String, number, number],
  undefined,
  true
> = cak71lriap930h as StorageDescriptor<
  [SS58String, number, number],
  undefined,
  true
>
const stg_Nfts_CollectionAccount: StorageDescriptor<
  [SS58String, number],
  undefined,
  true
> = c56gikrvhifab0 as StorageDescriptor<[SS58String, number], undefined, true>
const stg_Nfts_CollectionRoleOf: StorageDescriptor<
  [number, SS58String],
  number,
  true
> = "79l89n8ard6m" as StorageDescriptor<[number, SS58String], number, true>
const stg_Nfts_Item: StorageDescriptor<
  [number, number],
  {
    owner: SS58String
    approvals: Anonymize<I4m61c4hi7qpuv>
    deposit: Anonymize<Ic262ibdoec56a>
  },
  true
> = "de6ootcvd1ck3" as StorageDescriptor<
  [number, number],
  {
    owner: SS58String
    approvals: Anonymize<I4m61c4hi7qpuv>
    deposit: Anonymize<Ic262ibdoec56a>
  },
  true
>
const stg_Nfts_CollectionMetadataOf: StorageDescriptor<
  [Key: number],
  { deposit: bigint; data: Binary },
  true
> = "ci39i09utsmgt" as StorageDescriptor<
  [Key: number],
  { deposit: bigint; data: Binary },
  true
>
const stg_Nfts_ItemMetadataOf: StorageDescriptor<
  [number, number],
  { deposit: Anonymize<I6e70ge7ubff75>; data: Binary },
  true
> = "2g22ro5hj1gqj" as StorageDescriptor<
  [number, number],
  { deposit: Anonymize<I6e70ge7ubff75>; data: Binary },
  true
>
const stg_Nfts_Attribute: StorageDescriptor<
  [number, Anonymize<I4arjljr6dpflb>, Anonymize<I966fu47vp6aqm>, Binary],
  [Binary, Anonymize<I6e70ge7ubff75>],
  true
> = "7c7ocghana2iu" as StorageDescriptor<
  [number, Anonymize<I4arjljr6dpflb>, Anonymize<I966fu47vp6aqm>, Binary],
  [Binary, Anonymize<I6e70ge7ubff75>],
  true
>
const stg_Nfts_ItemPriceOf: StorageDescriptor<
  [number, number],
  [bigint, Anonymize<Ihfphjolmsqq1>],
  true
> = cd3n7dqk3crl60 as StorageDescriptor<
  [number, number],
  [bigint, Anonymize<Ihfphjolmsqq1>],
  true
>
const stg_Nfts_ItemAttributesApprovalsOf: StorageDescriptor<
  [number, number],
  Array<SS58String>,
  false
> = "caqaj5v24r6mc" as StorageDescriptor<
  [number, number],
  Array<SS58String>,
  false
>
const stg_Nfts_NextCollectionId: StorageDescriptor<[], number, true> =
  cf3ncnq6stc567 as StorageDescriptor<[], number, true>
const stg_Nfts_PendingSwapOf: StorageDescriptor<
  [number, number],
  {
    desired_collection: number
    desired_item: Anonymize<I4arjljr6dpflb>
    price: Anonymize<Iemn9sl4bs903b>
    deadline: number
  },
  true
> = "95kg03n96be91" as StorageDescriptor<
  [number, number],
  {
    desired_collection: number
    desired_item: Anonymize<I4arjljr6dpflb>
    price: Anonymize<Iemn9sl4bs903b>
    deadline: number
  },
  true
>
const stg_Nfts_CollectionConfigOf: StorageDescriptor<
  [Key: number],
  {
    settings: bigint
    max_supply: Anonymize<I4arjljr6dpflb>
    mint_settings: Anonymize<I3lel2b740s3fh>
  },
  true
> = "brr7ats1eq5m0" as StorageDescriptor<
  [Key: number],
  {
    settings: bigint
    max_supply: Anonymize<I4arjljr6dpflb>
    mint_settings: Anonymize<I3lel2b740s3fh>
  },
  true
>
const stg_Nfts_ItemConfigOf: StorageDescriptor<[number, number], bigint, true> =
  "frhi2nqu8b2n8" as StorageDescriptor<[number, number], bigint, true>
const stg_ForeignAssets_Asset: StorageDescriptor<
  [Key: { parents: number; interior: XcmV3Junctions }],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    supply: bigint
    deposit: bigint
    min_balance: bigint
    is_sufficient: boolean
    accounts: number
    sufficients: number
    approvals: number
    status: Anonymize<Ichpfv056f8vda>
  },
  true
> = "e1fkqq2jtmm1j" as StorageDescriptor<
  [Key: { parents: number; interior: XcmV3Junctions }],
  {
    owner: SS58String
    issuer: SS58String
    admin: SS58String
    freezer: SS58String
    supply: bigint
    deposit: bigint
    min_balance: bigint
    is_sufficient: boolean
    accounts: number
    sufficients: number
    approvals: number
    status: Anonymize<Ichpfv056f8vda>
  },
  true
>
const stg_ForeignAssets_Account: StorageDescriptor<
  [Anonymize<I43cmiele6sevi>, SS58String],
  {
    balance: bigint
    status: Anonymize<I4toln8faf1bi6>
    reason: Anonymize<Idcivh1e680ag5>
    extra: undefined
  },
  true
> = "89dj4j7p28c2r" as StorageDescriptor<
  [Anonymize<I43cmiele6sevi>, SS58String],
  {
    balance: bigint
    status: Anonymize<I4toln8faf1bi6>
    reason: Anonymize<Idcivh1e680ag5>
    extra: undefined
  },
  true
>
const stg_ForeignAssets_Approvals: StorageDescriptor<
  [Anonymize<I43cmiele6sevi>, SS58String, SS58String],
  { amount: bigint; deposit: bigint },
  true
> = "b0ik3ekkva9vb" as StorageDescriptor<
  [Anonymize<I43cmiele6sevi>, SS58String, SS58String],
  { amount: bigint; deposit: bigint },
  true
>
const stg_ForeignAssets_Metadata: StorageDescriptor<
  [Key: { parents: number; interior: XcmV3Junctions }],
  {
    deposit: bigint
    name: Binary
    symbol: Binary
    decimals: number
    is_frozen: boolean
  },
  false
> = "fj6ppmuc9llcd" as StorageDescriptor<
  [Key: { parents: number; interior: XcmV3Junctions }],
  {
    deposit: bigint
    name: Binary
    symbol: Binary
    decimals: number
    is_frozen: boolean
  },
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
const call_ParachainSystem_set_validation_data: TxDescriptor<{
  data: Anonymize<Icj9r7l64kc5ku>
}> = "68js79djhsbni" as TxDescriptor<{ data: Anonymize<Icj9r7l64kc5ku> }>
const call_ParachainSystem_sudo_send_upward_message: TxDescriptor<{
  message: Binary
}> = "fpj261e8s63m3" as TxDescriptor<{ message: Binary }>
const call_ParachainSystem_authorize_upgrade: TxDescriptor<{
  code_hash: Binary
  check_version: boolean
}> = cb3qt1mgvgmbgi as TxDescriptor<{
  code_hash: Binary
  check_version: boolean
}>
const call_ParachainSystem_enact_authorized_upgrade: TxDescriptor<{
  code: Binary
}> = c6pjjpfvhvcfru as TxDescriptor<{ code: Binary }>
const call_Timestamp_set: TxDescriptor<{ now: bigint }> =
  "dcr6u6361oad9" as TxDescriptor<{ now: bigint }>
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
const call_CollatorSelection_set_invulnerables: TxDescriptor<{
  new: Anonymize<Ia2lhg7l2hilo3>
}> = "fccifqltb5obi" as TxDescriptor<{ new: Anonymize<Ia2lhg7l2hilo3> }>
const call_CollatorSelection_set_desired_candidates: TxDescriptor<{
  max: number
}> = "adtsfv699cq8b" as TxDescriptor<{ max: number }>
const call_CollatorSelection_set_candidacy_bond: TxDescriptor<{
  bond: bigint
}> = "alpmgmhr3gk5r" as TxDescriptor<{ bond: bigint }>
const call_CollatorSelection_register_as_candidate: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_CollatorSelection_leave_intent: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_CollatorSelection_add_invulnerable: TxDescriptor<{
  who: SS58String
}> = c4cbvqmqadhrea as TxDescriptor<{ who: SS58String }>
const call_CollatorSelection_remove_invulnerable: TxDescriptor<{
  who: SS58String
}> = c4cbvqmqadhrea as TxDescriptor<{ who: SS58String }>
const call_Session_set_keys: TxDescriptor<{ keys: Binary; proof: Binary }> =
  "vojoo8sbcs0m" as TxDescriptor<{ keys: Binary; proof: Binary }>
const call_Session_purge_keys: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_XcmpQueue_service_overweight: TxDescriptor<{
  index: bigint
  weight_limit: Anonymize<I4q39t5hn830vp>
}> = cab1retd4gg4q1 as TxDescriptor<{
  index: bigint
  weight_limit: Anonymize<I4q39t5hn830vp>
}>
const call_XcmpQueue_suspend_xcm_execution: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_XcmpQueue_resume_xcm_execution: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_XcmpQueue_update_suspend_threshold: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_XcmpQueue_update_drop_threshold: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_XcmpQueue_update_resume_threshold: TxDescriptor<{ new: number }> =
  c3vh014cqgmrfd as TxDescriptor<{ new: number }>
const call_XcmpQueue_update_threshold_weight: TxDescriptor<{
  new: Anonymize<I4q39t5hn830vp>
}> = c2tni7rrb2buqm as TxDescriptor<{ new: Anonymize<I4q39t5hn830vp> }>
const call_XcmpQueue_update_weight_restrict_decay: TxDescriptor<{
  new: Anonymize<I4q39t5hn830vp>
}> = c2tni7rrb2buqm as TxDescriptor<{ new: Anonymize<I4q39t5hn830vp> }>
const call_XcmpQueue_update_xcmp_max_individual_weight: TxDescriptor<{
  new: Anonymize<I4q39t5hn830vp>
}> = c2tni7rrb2buqm as TxDescriptor<{ new: Anonymize<I4q39t5hn830vp> }>
const call_PolkadotXcm_send: TxDescriptor<{
  dest: XcmVersionedMultiLocation
  message: XcmVersionedXcm
}> = "cvpjofp09bmlh" as TxDescriptor<{
  dest: XcmVersionedMultiLocation
  message: XcmVersionedXcm
}>
const call_PolkadotXcm_teleport_assets: TxDescriptor<{
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
const call_PolkadotXcm_reserve_transfer_assets: TxDescriptor<{
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
const call_PolkadotXcm_execute: TxDescriptor<{
  message: XcmVersionedXcm1
  max_weight: Anonymize<I4q39t5hn830vp>
}> = "53e0mdinhcvpm" as TxDescriptor<{
  message: XcmVersionedXcm1
  max_weight: Anonymize<I4q39t5hn830vp>
}>
const call_PolkadotXcm_force_xcm_version: TxDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}> = c732o5n04n5ohg as TxDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}>
const call_PolkadotXcm_force_default_xcm_version: TxDescriptor<{
  maybe_xcm_version: Anonymize<I4arjljr6dpflb>
}> = "c76kfh5ebqkpl" as TxDescriptor<{
  maybe_xcm_version: Anonymize<I4arjljr6dpflb>
}>
const call_PolkadotXcm_force_subscribe_version_notify: TxDescriptor<{
  location: XcmVersionedMultiLocation
}> = c3pog27ittgi9g as TxDescriptor<{ location: XcmVersionedMultiLocation }>
const call_PolkadotXcm_force_unsubscribe_version_notify: TxDescriptor<{
  location: XcmVersionedMultiLocation
}> = c3pog27ittgi9g as TxDescriptor<{ location: XcmVersionedMultiLocation }>
const call_PolkadotXcm_limited_reserve_transfer_assets: TxDescriptor<{
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
const call_PolkadotXcm_limited_teleport_assets: TxDescriptor<{
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
const call_PolkadotXcm_force_suspension: TxDescriptor<{ suspended: boolean }> =
  "bgm4rnf22lal1" as TxDescriptor<{ suspended: boolean }>
const call_DmpQueue_service_overweight: TxDescriptor<{
  index: bigint
  weight_limit: Anonymize<I4q39t5hn830vp>
}> = cab1retd4gg4q1 as TxDescriptor<{
  index: bigint
  weight_limit: Anonymize<I4q39t5hn830vp>
}>
const call_ToKusamaXcmRouter_report_bridge_status: TxDescriptor<{
  bridge_id: Binary
  is_congested: boolean
}> = "7qii6me707csu" as TxDescriptor<{
  bridge_id: Binary
  is_congested: boolean
}>
const call_Utility_batch: TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }> =
  c6m9u9b2jh9e7q as TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>
const call_Utility_as_derivative: TxDescriptor<{
  index: number
  call: Anonymize<I9ih0jev11cnlt>
}> = "3a9gjlu51cehg" as TxDescriptor<{
  index: number
  call: Anonymize<I9ih0jev11cnlt>
}>
const call_Utility_batch_all: TxDescriptor<{
  calls: Anonymize<I9umjnqmckto5n>
}> = c6m9u9b2jh9e7q as TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>
const call_Utility_dispatch_as: TxDescriptor<{
  as_origin: Anonymize<I1un5g4rnbtvdk>
  call: Anonymize<I9ih0jev11cnlt>
}> = "bmq86o76d7t49" as TxDescriptor<{
  as_origin: Anonymize<I1un5g4rnbtvdk>
  call: Anonymize<I9ih0jev11cnlt>
}>
const call_Utility_force_batch: TxDescriptor<{
  calls: Anonymize<I9umjnqmckto5n>
}> = c6m9u9b2jh9e7q as TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>
const call_Utility_with_weight: TxDescriptor<{
  call: Anonymize<I9ih0jev11cnlt>
  weight: Anonymize<I4q39t5hn830vp>
}> = "b3khl2i8bnoln" as TxDescriptor<{
  call: Anonymize<I9ih0jev11cnlt>
  weight: Anonymize<I4q39t5hn830vp>
}>
const call_Multisig_as_multi_threshold_1: TxDescriptor<{
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I9ih0jev11cnlt>
}> = "6dgou98v9pgi8" as TxDescriptor<{
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  call: Anonymize<I9ih0jev11cnlt>
}>
const call_Multisig_as_multi: TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I9ih0jev11cnlt>
  max_weight: Anonymize<I4q39t5hn830vp>
}> = "5r5n4apqdp1fq" as TxDescriptor<{
  threshold: number
  other_signatories: Anonymize<Ia2lhg7l2hilo3>
  maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
  call: Anonymize<I9ih0jev11cnlt>
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
const call_Proxy_proxy: TxDescriptor<{
  real: MultiAddress
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}> = "3246qdho5ce4m" as TxDescriptor<{
  real: MultiAddress
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}>
const call_Proxy_add_proxy: TxDescriptor<{
  delegate: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}> = c5f79m6vb0cjl3 as TxDescriptor<{
  delegate: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}>
const call_Proxy_remove_proxy: TxDescriptor<{
  delegate: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}> = c5f79m6vb0cjl3 as TxDescriptor<{
  delegate: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}>
const call_Proxy_remove_proxies: TxDescriptor<undefined> =
  c39ibapn5dm6tr as TxDescriptor<undefined>
const call_Proxy_create_pure: TxDescriptor<{
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
  index: number
}> = "9ka5llru04c3v" as TxDescriptor<{
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
  index: number
}>
const call_Proxy_kill_pure: TxDescriptor<{
  spawner: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  index: number
  height: number
  ext_index: number
}> = "al2ape05din8j" as TxDescriptor<{
  spawner: MultiAddress
  proxy_type: Anonymize<Ie45ibn6h4uq45>
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
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}> = "98oa9b85ojqlf" as TxDescriptor<{
  delegate: MultiAddress
  real: MultiAddress
  force_proxy_type: Anonymize<I5m6c79u5faiin>
  call: Anonymize<I9ih0jev11cnlt>
}>
const call_Assets_create: TxDescriptor<{
  id: number
  admin: MultiAddress
  min_balance: bigint
}> = "533um4il0td12" as TxDescriptor<{
  id: number
  admin: MultiAddress
  min_balance: bigint
}>
const call_Assets_force_create: TxDescriptor<{
  id: number
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}> = "7qfdo8o1rkqtm" as TxDescriptor<{
  id: number
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}>
const call_Assets_start_destroy: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_destroy_accounts: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_destroy_approvals: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_finish_destroy: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_mint: TxDescriptor<{
  id: number
  beneficiary: MultiAddress
  amount: bigint
}> = "9onodvmibifmb" as TxDescriptor<{
  id: number
  beneficiary: MultiAddress
  amount: bigint
}>
const call_Assets_burn: TxDescriptor<{
  id: number
  who: MultiAddress
  amount: bigint
}> = "bkt6hr2fhk8mr" as TxDescriptor<{
  id: number
  who: MultiAddress
  amount: bigint
}>
const call_Assets_transfer: TxDescriptor<{
  id: number
  target: MultiAddress
  amount: bigint
}> = c9gfesr77iu6er as TxDescriptor<{
  id: number
  target: MultiAddress
  amount: bigint
}>
const call_Assets_transfer_keep_alive: TxDescriptor<{
  id: number
  target: MultiAddress
  amount: bigint
}> = c9gfesr77iu6er as TxDescriptor<{
  id: number
  target: MultiAddress
  amount: bigint
}>
const call_Assets_force_transfer: TxDescriptor<{
  id: number
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}> = "48n65o3p66msb" as TxDescriptor<{
  id: number
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}>
const call_Assets_freeze: TxDescriptor<{ id: number; who: MultiAddress }> =
  cdabu8cc4fnfuq as TxDescriptor<{ id: number; who: MultiAddress }>
const call_Assets_thaw: TxDescriptor<{ id: number; who: MultiAddress }> =
  cdabu8cc4fnfuq as TxDescriptor<{ id: number; who: MultiAddress }>
const call_Assets_freeze_asset: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_thaw_asset: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_transfer_ownership: TxDescriptor<{
  id: number
  owner: MultiAddress
}> = "d7ea0upj3s5ui" as TxDescriptor<{ id: number; owner: MultiAddress }>
const call_Assets_set_team: TxDescriptor<{
  id: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}> = "c2uiliialbe3h" as TxDescriptor<{
  id: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}>
const call_Assets_set_metadata: TxDescriptor<{
  id: number
  name: Binary
  symbol: Binary
  decimals: number
}> = "8hff7chabggkd" as TxDescriptor<{
  id: number
  name: Binary
  symbol: Binary
  decimals: number
}>
const call_Assets_clear_metadata: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_force_set_metadata: TxDescriptor<{
  id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}> = "49i39mtj1ivbs" as TxDescriptor<{
  id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}>
const call_Assets_force_clear_metadata: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_force_asset_status: TxDescriptor<{
  id: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}> = "f8sgtc04i0mv8" as TxDescriptor<{
  id: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}>
const call_Assets_approve_transfer: TxDescriptor<{
  id: number
  delegate: MultiAddress
  amount: bigint
}> = "5nr0k3uvh9bvr" as TxDescriptor<{
  id: number
  delegate: MultiAddress
  amount: bigint
}>
const call_Assets_cancel_approval: TxDescriptor<{
  id: number
  delegate: MultiAddress
}> = "acuu5hmgv3l03" as TxDescriptor<{ id: number; delegate: MultiAddress }>
const call_Assets_force_cancel_approval: TxDescriptor<{
  id: number
  owner: MultiAddress
  delegate: MultiAddress
}> = "7djqe23edivs4" as TxDescriptor<{
  id: number
  owner: MultiAddress
  delegate: MultiAddress
}>
const call_Assets_transfer_approved: TxDescriptor<{
  id: number
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}> = "4eb1md7k7r9bm" as TxDescriptor<{
  id: number
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}>
const call_Assets_touch: TxDescriptor<{ id: number }> =
  cc5b47dj4coa3r as TxDescriptor<{ id: number }>
const call_Assets_refund: TxDescriptor<{ id: number; allow_burn: boolean }> =
  "9vl5kpk0fpakt" as TxDescriptor<{ id: number; allow_burn: boolean }>
const call_Assets_set_min_balance: TxDescriptor<{
  id: number
  min_balance: bigint
}> = "717jt61hu19b4" as TxDescriptor<{ id: number; min_balance: bigint }>
const call_Assets_touch_other: TxDescriptor<{ id: number; who: MultiAddress }> =
  cdabu8cc4fnfuq as TxDescriptor<{ id: number; who: MultiAddress }>
const call_Assets_refund_other: TxDescriptor<{
  id: number
  who: MultiAddress
}> = cdabu8cc4fnfuq as TxDescriptor<{ id: number; who: MultiAddress }>
const call_Assets_block: TxDescriptor<{ id: number; who: MultiAddress }> =
  cdabu8cc4fnfuq as TxDescriptor<{ id: number; who: MultiAddress }>
const call_Uniques_create: TxDescriptor<{
  collection: number
  admin: MultiAddress
}> = "b9s51pghbgn6b" as TxDescriptor<{
  collection: number
  admin: MultiAddress
}>
const call_Uniques_force_create: TxDescriptor<{
  collection: number
  owner: MultiAddress
  free_holding: boolean
}> = "c9ojioik482he" as TxDescriptor<{
  collection: number
  owner: MultiAddress
  free_holding: boolean
}>
const call_Uniques_destroy: TxDescriptor<{
  collection: number
  witness: Anonymize<I59th026dnaruk>
}> = "223jg78mng8hq" as TxDescriptor<{
  collection: number
  witness: Anonymize<I59th026dnaruk>
}>
const call_Uniques_mint: TxDescriptor<{
  collection: number
  item: number
  owner: MultiAddress
}> = "dl8k9cbpbc2n9" as TxDescriptor<{
  collection: number
  item: number
  owner: MultiAddress
}>
const call_Uniques_burn: TxDescriptor<{
  collection: number
  item: number
  check_owner: Anonymize<Idcl76h8eqajgc>
}> = "1iqcl3tfr8p9" as TxDescriptor<{
  collection: number
  item: number
  check_owner: Anonymize<Idcl76h8eqajgc>
}>
const call_Uniques_transfer: TxDescriptor<{
  collection: number
  item: number
  dest: MultiAddress
}> = c69ivk0lfrfoev as TxDescriptor<{
  collection: number
  item: number
  dest: MultiAddress
}>
const call_Uniques_redeposit: TxDescriptor<{
  collection: number
  items: Anonymize<Icgljjb6j82uhn>
}> = cf9vko7pv0231m as TxDescriptor<{
  collection: number
  items: Anonymize<Icgljjb6j82uhn>
}>
const call_Uniques_freeze: TxDescriptor<{ collection: number; item: number }> =
  cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Uniques_thaw: TxDescriptor<{ collection: number; item: number }> =
  cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Uniques_freeze_collection: TxDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as TxDescriptor<{ collection: number }>
const call_Uniques_thaw_collection: TxDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as TxDescriptor<{ collection: number }>
const call_Uniques_transfer_ownership: TxDescriptor<{
  collection: number
  owner: MultiAddress
}> = c5u33v2v4pjs8l as TxDescriptor<{ collection: number; owner: MultiAddress }>
const call_Uniques_set_team: TxDescriptor<{
  collection: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}> = "3bsaee34vu0no" as TxDescriptor<{
  collection: number
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}>
const call_Uniques_approve_transfer: TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}> = cfc31bg23jr6fj as TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}>
const call_Uniques_cancel_approval: TxDescriptor<{
  collection: number
  item: number
  maybe_check_delegate: Anonymize<Idcl76h8eqajgc>
}> = "c6udaafcaa1fr" as TxDescriptor<{
  collection: number
  item: number
  maybe_check_delegate: Anonymize<Idcl76h8eqajgc>
}>
const call_Uniques_force_item_status: TxDescriptor<{
  collection: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  free_holding: boolean
  is_frozen: boolean
}> = "7p6okt14sqi28" as TxDescriptor<{
  collection: number
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  free_holding: boolean
  is_frozen: boolean
}>
const call_Uniques_set_attribute: TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
  value: Binary
}> = c5tvvgui05tn6e as TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
  value: Binary
}>
const call_Uniques_clear_attribute: TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
}> = cbal0joadvdc2h as TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
}>
const call_Uniques_set_metadata: TxDescriptor<{
  collection: number
  item: number
  data: Binary
  is_frozen: boolean
}> = cceq9fmmp9aeqv as TxDescriptor<{
  collection: number
  item: number
  data: Binary
  is_frozen: boolean
}>
const call_Uniques_clear_metadata: TxDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Uniques_set_collection_metadata: TxDescriptor<{
  collection: number
  data: Binary
  is_frozen: boolean
}> = c9viqhmdtuof5e as TxDescriptor<{
  collection: number
  data: Binary
  is_frozen: boolean
}>
const call_Uniques_clear_collection_metadata: TxDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as TxDescriptor<{ collection: number }>
const call_Uniques_set_accept_ownership: TxDescriptor<{
  maybe_collection: Anonymize<I4arjljr6dpflb>
}> = cbqooroq6rr5kr as TxDescriptor<{
  maybe_collection: Anonymize<I4arjljr6dpflb>
}>
const call_Uniques_set_collection_max_supply: TxDescriptor<{
  collection: number
  max_supply: number
}> = c6h88h8vba22v8 as TxDescriptor<{ collection: number; max_supply: number }>
const call_Uniques_set_price: TxDescriptor<{
  collection: number
  item: number
  price: Anonymize<I35p85j063s0il>
  whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
}> = c96e9cuvpvnf1h as TxDescriptor<{
  collection: number
  item: number
  price: Anonymize<I35p85j063s0il>
  whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
}>
const call_Uniques_buy_item: TxDescriptor<{
  collection: number
  item: number
  bid_price: bigint
}> = c19jiel1ftbcce as TxDescriptor<{
  collection: number
  item: number
  bid_price: bigint
}>
const call_Nfts_create: TxDescriptor<{
  admin: MultiAddress
  config: Anonymize<If362jnk79orio>
}> = "6rqo16k4nu49m" as TxDescriptor<{
  admin: MultiAddress
  config: Anonymize<If362jnk79orio>
}>
const call_Nfts_force_create: TxDescriptor<{
  owner: MultiAddress
  config: Anonymize<If362jnk79orio>
}> = "38spad9r7d170" as TxDescriptor<{
  owner: MultiAddress
  config: Anonymize<If362jnk79orio>
}>
const call_Nfts_destroy: TxDescriptor<{
  collection: number
  witness: Anonymize<Idqhe2sslgfeu8>
}> = "77ie723ncd4co" as TxDescriptor<{
  collection: number
  witness: Anonymize<Idqhe2sslgfeu8>
}>
const call_Nfts_mint: TxDescriptor<{
  collection: number
  item: number
  mint_to: MultiAddress
  witness_data: Anonymize<Ib0113vv89gbic>
}> = "aj5lbvoboku16" as TxDescriptor<{
  collection: number
  item: number
  mint_to: MultiAddress
  witness_data: Anonymize<Ib0113vv89gbic>
}>
const call_Nfts_force_mint: TxDescriptor<{
  collection: number
  item: number
  mint_to: MultiAddress
  item_config: bigint
}> = "8a6kl8su4id8o" as TxDescriptor<{
  collection: number
  item: number
  mint_to: MultiAddress
  item_config: bigint
}>
const call_Nfts_burn: TxDescriptor<{ collection: number; item: number }> =
  cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Nfts_transfer: TxDescriptor<{
  collection: number
  item: number
  dest: MultiAddress
}> = c69ivk0lfrfoev as TxDescriptor<{
  collection: number
  item: number
  dest: MultiAddress
}>
const call_Nfts_redeposit: TxDescriptor<{
  collection: number
  items: Anonymize<Icgljjb6j82uhn>
}> = cf9vko7pv0231m as TxDescriptor<{
  collection: number
  items: Anonymize<Icgljjb6j82uhn>
}>
const call_Nfts_lock_item_transfer: TxDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Nfts_unlock_item_transfer: TxDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Nfts_lock_collection: TxDescriptor<{
  collection: number
  lock_settings: bigint
}> = "1ahf3pvgsgbu" as TxDescriptor<{
  collection: number
  lock_settings: bigint
}>
const call_Nfts_transfer_ownership: TxDescriptor<{
  collection: number
  owner: MultiAddress
}> = c5u33v2v4pjs8l as TxDescriptor<{ collection: number; owner: MultiAddress }>
const call_Nfts_set_team: TxDescriptor<{
  collection: number
  issuer: Anonymize<Idcl76h8eqajgc>
  admin: Anonymize<Idcl76h8eqajgc>
  freezer: Anonymize<Idcl76h8eqajgc>
}> = "9qasfq3nkoi2r" as TxDescriptor<{
  collection: number
  issuer: Anonymize<Idcl76h8eqajgc>
  admin: Anonymize<Idcl76h8eqajgc>
  freezer: Anonymize<Idcl76h8eqajgc>
}>
const call_Nfts_force_collection_owner: TxDescriptor<{
  collection: number
  owner: MultiAddress
}> = c5u33v2v4pjs8l as TxDescriptor<{ collection: number; owner: MultiAddress }>
const call_Nfts_force_collection_config: TxDescriptor<{
  collection: number
  config: Anonymize<If362jnk79orio>
}> = "54s4l4td7i9km" as TxDescriptor<{
  collection: number
  config: Anonymize<If362jnk79orio>
}>
const call_Nfts_approve_transfer: TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
  maybe_deadline: Anonymize<I4arjljr6dpflb>
}> = "1iv9thng6meth" as TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
  maybe_deadline: Anonymize<I4arjljr6dpflb>
}>
const call_Nfts_cancel_approval: TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}> = cfc31bg23jr6fj as TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}>
const call_Nfts_clear_all_transfer_approvals: TxDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Nfts_lock_item_properties: TxDescriptor<{
  collection: number
  item: number
  lock_metadata: boolean
  lock_attributes: boolean
}> = c1jj31tn29ie3c as TxDescriptor<{
  collection: number
  item: number
  lock_metadata: boolean
  lock_attributes: boolean
}>
const call_Nfts_set_attribute: TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}> = c8caj3ho0b8kia as TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}>
const call_Nfts_force_set_attribute: TxDescriptor<{
  set_as: Anonymize<Ihfphjolmsqq1>
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}> = "52lhebajmfrtb" as TxDescriptor<{
  set_as: Anonymize<Ihfphjolmsqq1>
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}>
const call_Nfts_clear_attribute: TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
}> = crn56pucio7gb as TxDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
}>
const call_Nfts_approve_item_attributes: TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}> = cfc31bg23jr6fj as TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
}>
const call_Nfts_cancel_item_attributes_approval: TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
  witness: number
}> = "4464j8bj461ff" as TxDescriptor<{
  collection: number
  item: number
  delegate: MultiAddress
  witness: number
}>
const call_Nfts_set_metadata: TxDescriptor<{
  collection: number
  item: number
  data: Binary
}> = ccrkms46uh8tpb as TxDescriptor<{
  collection: number
  item: number
  data: Binary
}>
const call_Nfts_clear_metadata: TxDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as TxDescriptor<{ collection: number; item: number }>
const call_Nfts_set_collection_metadata: TxDescriptor<{
  collection: number
  data: Binary
}> = c78u60nqh0etah as TxDescriptor<{ collection: number; data: Binary }>
const call_Nfts_clear_collection_metadata: TxDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as TxDescriptor<{ collection: number }>
const call_Nfts_set_accept_ownership: TxDescriptor<{
  maybe_collection: Anonymize<I4arjljr6dpflb>
}> = cbqooroq6rr5kr as TxDescriptor<{
  maybe_collection: Anonymize<I4arjljr6dpflb>
}>
const call_Nfts_set_collection_max_supply: TxDescriptor<{
  collection: number
  max_supply: number
}> = c6h88h8vba22v8 as TxDescriptor<{ collection: number; max_supply: number }>
const call_Nfts_update_mint_settings: TxDescriptor<{
  collection: number
  mint_settings: Anonymize<I3lel2b740s3fh>
}> = "355299hrt5pr6" as TxDescriptor<{
  collection: number
  mint_settings: Anonymize<I3lel2b740s3fh>
}>
const call_Nfts_set_price: TxDescriptor<{
  collection: number
  item: number
  price: Anonymize<I35p85j063s0il>
  whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
}> = c96e9cuvpvnf1h as TxDescriptor<{
  collection: number
  item: number
  price: Anonymize<I35p85j063s0il>
  whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
}>
const call_Nfts_buy_item: TxDescriptor<{
  collection: number
  item: number
  bid_price: bigint
}> = c19jiel1ftbcce as TxDescriptor<{
  collection: number
  item: number
  bid_price: bigint
}>
const call_Nfts_pay_tips: TxDescriptor<{ tips: Anonymize<I73vqjhh9uvase> }> =
  "26c8p47106toa" as TxDescriptor<{ tips: Anonymize<I73vqjhh9uvase> }>
const call_Nfts_create_swap: TxDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  maybe_desired_item: Anonymize<I4arjljr6dpflb>
  maybe_price: Anonymize<Iemn9sl4bs903b>
  duration: number
}> = "8a1f2hu0n509e" as TxDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  maybe_desired_item: Anonymize<I4arjljr6dpflb>
  maybe_price: Anonymize<Iemn9sl4bs903b>
  duration: number
}>
const call_Nfts_cancel_swap: TxDescriptor<{
  offered_collection: number
  offered_item: number
}> = "c3j8ku6mbsms4" as TxDescriptor<{
  offered_collection: number
  offered_item: number
}>
const call_Nfts_claim_swap: TxDescriptor<{
  send_collection: number
  send_item: number
  receive_collection: number
  receive_item: number
  witness_price: Anonymize<Iemn9sl4bs903b>
}> = "f3m92s67irtpm" as TxDescriptor<{
  send_collection: number
  send_item: number
  receive_collection: number
  receive_item: number
  witness_price: Anonymize<Iemn9sl4bs903b>
}>
const call_Nfts_mint_pre_signed: TxDescriptor<{
  mint_data: Anonymize<I4o46ti9h9g8u9>
  signature: MultiSignature
  signer: SS58String
}> = "14r4a9hr0ql0e" as TxDescriptor<{
  mint_data: Anonymize<I4o46ti9h9g8u9>
  signature: MultiSignature
  signer: SS58String
}>
const call_Nfts_set_attributes_pre_signed: TxDescriptor<{
  data: Anonymize<Iaaqgpqooangl>
  signature: MultiSignature
  signer: SS58String
}> = "8a5mufiann5a3" as TxDescriptor<{
  data: Anonymize<Iaaqgpqooangl>
  signature: MultiSignature
  signer: SS58String
}>
const call_ForeignAssets_create: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  admin: MultiAddress
  min_balance: bigint
}> = "eoilfl76rj048" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  admin: MultiAddress
  min_balance: bigint
}>
const call_ForeignAssets_force_create: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}> = "cl4v2o4s41rdj" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  is_sufficient: boolean
  min_balance: bigint
}>
const call_ForeignAssets_start_destroy: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_destroy_accounts: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_destroy_approvals: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_finish_destroy: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_mint: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  beneficiary: MultiAddress
  amount: bigint
}> = "7sjl8t0qp2l1u" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  beneficiary: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_burn: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
  amount: bigint
}> = "1n4e3mqee7mpq" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_transfer: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  target: MultiAddress
  amount: bigint
}> = c4e2e1qjctjtie as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  target: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_transfer_keep_alive: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  target: MultiAddress
  amount: bigint
}> = c4e2e1qjctjtie as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  target: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_force_transfer: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}> = "b78u91ga2e3iq" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  source: MultiAddress
  dest: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_freeze: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}> = cee8i15mhu1cm as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}>
const call_ForeignAssets_thaw: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}> = cee8i15mhu1cm as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}>
const call_ForeignAssets_freeze_asset: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_thaw_asset: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_transfer_ownership: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
}> = "5njg3n9tpp2qs" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
}>
const call_ForeignAssets_set_team: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}> = "2964puubsic5d" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
}>
const call_ForeignAssets_set_metadata: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
}> = "fg4ia2dpd33c6" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
}>
const call_ForeignAssets_clear_metadata: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_force_set_metadata: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}> = "fcqbnmct91p9u" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}>
const call_ForeignAssets_force_clear_metadata: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_force_asset_status: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}> = "fuask0ie8qhdm" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  issuer: MultiAddress
  admin: MultiAddress
  freezer: MultiAddress
  min_balance: bigint
  is_sufficient: boolean
  is_frozen: boolean
}>
const call_ForeignAssets_approve_transfer: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  delegate: MultiAddress
  amount: bigint
}> = "45abj40ogbub1" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  delegate: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_cancel_approval: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  delegate: MultiAddress
}> = "m5jn73018qbs" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  delegate: MultiAddress
}>
const call_ForeignAssets_force_cancel_approval: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  delegate: MultiAddress
}> = "5kenlv06877de" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  delegate: MultiAddress
}>
const call_ForeignAssets_transfer_approved: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}> = "b0hhlh5fdej9c" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  owner: MultiAddress
  destination: MultiAddress
  amount: bigint
}>
const call_ForeignAssets_touch: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
}> = c27502riuof4h7 as TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>
const call_ForeignAssets_refund: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  allow_burn: boolean
}> = "d0po48pmpq2il" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  allow_burn: boolean
}>
const call_ForeignAssets_set_min_balance: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  min_balance: bigint
}> = "fbdn1fab64mfj" as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  min_balance: bigint
}>
const call_ForeignAssets_touch_other: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}> = cee8i15mhu1cm as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}>
const call_ForeignAssets_refund_other: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}> = cee8i15mhu1cm as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}>
const call_ForeignAssets_block: TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}> = cee8i15mhu1cm as TxDescriptor<{
  id: Anonymize<I43cmiele6sevi>
  who: MultiAddress
}>
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
const evt_ParachainSystem_ValidationFunctionStored: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ParachainSystem_ValidationFunctionApplied: PlainDescriptor<{
  relay_chain_block_num: number
}> = "dd7hd99u0ho0n" as PlainDescriptor<{ relay_chain_block_num: number }>
const evt_ParachainSystem_ValidationFunctionDiscarded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const evt_ParachainSystem_UpgradeAuthorized: PlainDescriptor<{
  code_hash: Binary
}> = "6a5n5ij3gomuo" as PlainDescriptor<{ code_hash: Binary }>
const evt_ParachainSystem_DownwardMessagesReceived: PlainDescriptor<{
  count: number
}> = "afscmv8tjf0ou" as PlainDescriptor<{ count: number }>
const evt_ParachainSystem_DownwardMessagesProcessed: PlainDescriptor<{
  weight_used: Anonymize<I4q39t5hn830vp>
  dmq_head: Binary
}> = "7a3a6ua4hud3s" as PlainDescriptor<{
  weight_used: Anonymize<I4q39t5hn830vp>
  dmq_head: Binary
}>
const evt_ParachainSystem_UpwardMessageSent: PlainDescriptor<{
  message_hash: Anonymize<I17k3ujudqd5df>
}> = "4n7056p1k6c8b" as PlainDescriptor<{
  message_hash: Anonymize<I17k3ujudqd5df>
}>
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
const evt_AssetTxPayment_AssetTxFeePaid: PlainDescriptor<{
  who: SS58String
  actual_fee: bigint
  tip: bigint
  asset_id: Anonymize<I4arjljr6dpflb>
}> = "94ss5ias99t8d" as PlainDescriptor<{
  who: SS58String
  actual_fee: bigint
  tip: bigint
  asset_id: Anonymize<I4arjljr6dpflb>
}>
const evt_CollatorSelection_NewInvulnerables: PlainDescriptor<{
  invulnerables: Anonymize<Ia2lhg7l2hilo3>
}> = "39t01nnod9109" as PlainDescriptor<{
  invulnerables: Anonymize<Ia2lhg7l2hilo3>
}>
const evt_CollatorSelection_InvulnerableAdded: PlainDescriptor<{
  account_id: SS58String
}> = c6v8sm60vvkmk7 as PlainDescriptor<{ account_id: SS58String }>
const evt_CollatorSelection_InvulnerableRemoved: PlainDescriptor<{
  account_id: SS58String
}> = c6v8sm60vvkmk7 as PlainDescriptor<{ account_id: SS58String }>
const evt_CollatorSelection_NewDesiredCandidates: PlainDescriptor<{
  desired_candidates: number
}> = "1qmtmbe5so8r3" as PlainDescriptor<{ desired_candidates: number }>
const evt_CollatorSelection_NewCandidacyBond: PlainDescriptor<{
  bond_amount: bigint
}> = "h99m6ehpcar7" as PlainDescriptor<{ bond_amount: bigint }>
const evt_CollatorSelection_CandidateAdded: PlainDescriptor<{
  account_id: SS58String
  deposit: bigint
}> = "dgorhsbgdq2ap" as PlainDescriptor<{
  account_id: SS58String
  deposit: bigint
}>
const evt_CollatorSelection_CandidateRemoved: PlainDescriptor<{
  account_id: SS58String
}> = c6v8sm60vvkmk7 as PlainDescriptor<{ account_id: SS58String }>
const evt_CollatorSelection_InvalidInvulnerableSkipped: PlainDescriptor<{
  account_id: SS58String
}> = c6v8sm60vvkmk7 as PlainDescriptor<{ account_id: SS58String }>
const evt_Session_NewSession: PlainDescriptor<{ session_index: number }> =
  "2hq50pu2kdjpo" as PlainDescriptor<{ session_index: number }>
const evt_XcmpQueue_Success: PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  weight: Anonymize<I4q39t5hn830vp>
}> = "7nj4acpodcef4" as PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  weight: Anonymize<I4q39t5hn830vp>
}>
const evt_XcmpQueue_Fail: PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  error: XcmV3TraitsError
  weight: Anonymize<I4q39t5hn830vp>
}> = "3n8ln6mqdfgb8" as PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  error: XcmV3TraitsError
  weight: Anonymize<I4q39t5hn830vp>
}>
const evt_XcmpQueue_BadVersion: PlainDescriptor<{ message_hash: Binary }> =
  c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
const evt_XcmpQueue_BadFormat: PlainDescriptor<{ message_hash: Binary }> =
  c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
const evt_XcmpQueue_XcmpMessageSent: PlainDescriptor<{ message_hash: Binary }> =
  c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
const evt_XcmpQueue_OverweightEnqueued: PlainDescriptor<{
  sender: number
  sent_at: number
  index: bigint
  required: Anonymize<I4q39t5hn830vp>
}> = "f8b64mo2bodj0" as PlainDescriptor<{
  sender: number
  sent_at: number
  index: bigint
  required: Anonymize<I4q39t5hn830vp>
}>
const evt_XcmpQueue_OverweightServiced: PlainDescriptor<{
  index: bigint
  used: Anonymize<I4q39t5hn830vp>
}> = "cu5p58ltu1veo" as PlainDescriptor<{
  index: bigint
  used: Anonymize<I4q39t5hn830vp>
}>
const evt_PolkadotXcm_Attempted: PlainDescriptor<{
  outcome: XcmV3TraitsOutcome
}> = "4e7dkr4hrus3u" as PlainDescriptor<{ outcome: XcmV3TraitsOutcome }>
const evt_PolkadotXcm_Sent: PlainDescriptor<{
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
const evt_PolkadotXcm_UnexpectedResponse: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_PolkadotXcm_ResponseReady: PlainDescriptor<{
  query_id: bigint
  response: XcmV3Response
}> = "7kkbgm2llu2o3" as PlainDescriptor<{
  query_id: bigint
  response: XcmV3Response
}>
const evt_PolkadotXcm_Notified: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_PolkadotXcm_NotifyOverweight: PlainDescriptor<{
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
const evt_PolkadotXcm_NotifyDispatchError: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_PolkadotXcm_NotifyDecodeFailed: PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}> = c2uqmls7kcdnii as PlainDescriptor<{
  query_id: bigint
  pallet_index: number
  call_index: number
}>
const evt_PolkadotXcm_InvalidResponder: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_location: Anonymize<I74hapqfd00s9i>
}> = "9j133okge3c2" as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
  expected_location: Anonymize<I74hapqfd00s9i>
}>
const evt_PolkadotXcm_InvalidResponderVersion: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_PolkadotXcm_ResponseTaken: PlainDescriptor<{ query_id: bigint }> =
  "30pg328m00nr3" as PlainDescriptor<{ query_id: bigint }>
const evt_PolkadotXcm_AssetsTrapped: PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}> = c5qm1bvb2j3ap2 as PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}>
const evt_PolkadotXcm_VersionChangeNotified: PlainDescriptor<{
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
const evt_PolkadotXcm_SupportedVersionChanged: PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}> = c732o5n04n5ohg as PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  version: number
}>
const evt_PolkadotXcm_NotifyTargetSendFail: PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  query_id: bigint
  error: XcmV3TraitsError
}> = "arlf7ddo81fm5" as PlainDescriptor<{
  location: Anonymize<I43cmiele6sevi>
  query_id: bigint
  error: XcmV3TraitsError
}>
const evt_PolkadotXcm_NotifyTargetMigrationFail: PlainDescriptor<{
  location: XcmVersionedMultiLocation
  query_id: bigint
}> = "e9bjgclf7vho0" as PlainDescriptor<{
  location: XcmVersionedMultiLocation
  query_id: bigint
}>
const evt_PolkadotXcm_InvalidQuerierVersion: PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}> = cse9r0vrat2m6 as PlainDescriptor<{
  origin: Anonymize<I43cmiele6sevi>
  query_id: bigint
}>
const evt_PolkadotXcm_InvalidQuerier: PlainDescriptor<{
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
const evt_PolkadotXcm_VersionNotifyStarted: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_PolkadotXcm_VersionNotifyRequested: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_PolkadotXcm_VersionNotifyUnrequested: PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}> = c5pnf8l8c1nkfk as PlainDescriptor<{
  destination: Anonymize<I43cmiele6sevi>
  cost: Anonymize<Id7mn3j3ge1h6a>
  message_id: Binary
}>
const evt_PolkadotXcm_FeesPaid: PlainDescriptor<{
  paying: Anonymize<I43cmiele6sevi>
  fees: Anonymize<Id7mn3j3ge1h6a>
}> = "bknqphki4flb3" as PlainDescriptor<{
  paying: Anonymize<I43cmiele6sevi>
  fees: Anonymize<Id7mn3j3ge1h6a>
}>
const evt_PolkadotXcm_AssetsClaimed: PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}> = c5qm1bvb2j3ap2 as PlainDescriptor<{
  hash: Binary
  origin: Anonymize<I43cmiele6sevi>
  assets: XcmVersionedMultiAssets
}>
const evt_CumulusXcm_InvalidFormat: PlainDescriptor<Binary> =
  c3s707ha9gi47u as PlainDescriptor<Binary>
const evt_CumulusXcm_UnsupportedVersion: PlainDescriptor<Binary> =
  c3s707ha9gi47u as PlainDescriptor<Binary>
const evt_CumulusXcm_ExecutedDownward: PlainDescriptor<
  [Binary, XcmV3TraitsOutcome]
> = "d0ii3t0e6fgob" as PlainDescriptor<[Binary, XcmV3TraitsOutcome]>
const evt_DmpQueue_InvalidFormat: PlainDescriptor<{ message_hash: Binary }> =
  c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
const evt_DmpQueue_UnsupportedVersion: PlainDescriptor<{
  message_hash: Binary
}> = c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
const evt_DmpQueue_ExecutedDownward: PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  outcome: XcmV3TraitsOutcome
}> = "6mr530l14uapg" as PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  outcome: XcmV3TraitsOutcome
}>
const evt_DmpQueue_WeightExhausted: PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  remaining_weight: Anonymize<I4q39t5hn830vp>
  required_weight: Anonymize<I4q39t5hn830vp>
}> = "2ds5dc604t7si" as PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  remaining_weight: Anonymize<I4q39t5hn830vp>
  required_weight: Anonymize<I4q39t5hn830vp>
}>
const evt_DmpQueue_OverweightEnqueued: PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  overweight_index: bigint
  required_weight: Anonymize<I4q39t5hn830vp>
}> = "dqsknek3bsc0s" as PlainDescriptor<{
  message_hash: Binary
  message_id: Binary
  overweight_index: bigint
  required_weight: Anonymize<I4q39t5hn830vp>
}>
const evt_DmpQueue_OverweightServiced: PlainDescriptor<{
  overweight_index: bigint
  weight_used: Anonymize<I4q39t5hn830vp>
}> = "se9gq7rqlnvm" as PlainDescriptor<{
  overweight_index: bigint
  weight_used: Anonymize<I4q39t5hn830vp>
}>
const evt_DmpQueue_MaxMessagesExhausted: PlainDescriptor<{
  message_hash: Binary
}> = c2vo9trn8nhllu as PlainDescriptor<{ message_hash: Binary }>
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
const evt_Proxy_ProxyExecuted: PlainDescriptor<{
  result: Anonymize<Idtdr91jmq5g4i>
}> = ce5i8qqljk3tjb as PlainDescriptor<{ result: Anonymize<Idtdr91jmq5g4i> }>
const evt_Proxy_PureCreated: PlainDescriptor<{
  pure: SS58String
  who: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  disambiguation_index: number
}> = "8claf7liq8o9r" as PlainDescriptor<{
  pure: SS58String
  who: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
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
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}> = c28ankic0g500e as PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}>
const evt_Proxy_ProxyRemoved: PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}> = c28ankic0g500e as PlainDescriptor<{
  delegator: SS58String
  delegatee: SS58String
  proxy_type: Anonymize<Ie45ibn6h4uq45>
  delay: number
}>
const evt_Assets_Created: PlainDescriptor<{
  asset_id: number
  creator: SS58String
  owner: SS58String
}> = "88ff3u4dpivk" as PlainDescriptor<{
  asset_id: number
  creator: SS58String
  owner: SS58String
}>
const evt_Assets_Issued: PlainDescriptor<{
  asset_id: number
  owner: SS58String
  amount: bigint
}> = "33cp947glv1ks" as PlainDescriptor<{
  asset_id: number
  owner: SS58String
  amount: bigint
}>
const evt_Assets_Transferred: PlainDescriptor<{
  asset_id: number
  from: SS58String
  to: SS58String
  amount: bigint
}> = "c9om1gmmqu7rq" as PlainDescriptor<{
  asset_id: number
  from: SS58String
  to: SS58String
  amount: bigint
}>
const evt_Assets_Burned: PlainDescriptor<{
  asset_id: number
  owner: SS58String
  balance: bigint
}> = "5hfov2b68ppb6" as PlainDescriptor<{
  asset_id: number
  owner: SS58String
  balance: bigint
}>
const evt_Assets_TeamChanged: PlainDescriptor<{
  asset_id: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}> = "bthhb2m9vneds" as PlainDescriptor<{
  asset_id: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}>
const evt_Assets_OwnerChanged: PlainDescriptor<{
  asset_id: number
  owner: SS58String
}> = caitn5bqfacj7k as PlainDescriptor<{ asset_id: number; owner: SS58String }>
const evt_Assets_Frozen: PlainDescriptor<{
  asset_id: number
  who: SS58String
}> = cf4ebvclj2ugvi as PlainDescriptor<{ asset_id: number; who: SS58String }>
const evt_Assets_Thawed: PlainDescriptor<{
  asset_id: number
  who: SS58String
}> = cf4ebvclj2ugvi as PlainDescriptor<{ asset_id: number; who: SS58String }>
const evt_Assets_AssetFrozen: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_AssetThawed: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_AccountsDestroyed: PlainDescriptor<{
  asset_id: number
  accounts_destroyed: number
  accounts_remaining: number
}> = "educ1e6frq8rb" as PlainDescriptor<{
  asset_id: number
  accounts_destroyed: number
  accounts_remaining: number
}>
const evt_Assets_ApprovalsDestroyed: PlainDescriptor<{
  asset_id: number
  approvals_destroyed: number
  approvals_remaining: number
}> = "9h6gbtabovtm4" as PlainDescriptor<{
  asset_id: number
  approvals_destroyed: number
  approvals_remaining: number
}>
const evt_Assets_DestructionStarted: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_Destroyed: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_ForceCreated: PlainDescriptor<{
  asset_id: number
  owner: SS58String
}> = caitn5bqfacj7k as PlainDescriptor<{ asset_id: number; owner: SS58String }>
const evt_Assets_MetadataSet: PlainDescriptor<{
  asset_id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}> = "fnsa0dkkpf465" as PlainDescriptor<{
  asset_id: number
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}>
const evt_Assets_MetadataCleared: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_ApprovedTransfer: PlainDescriptor<{
  asset_id: number
  source: SS58String
  delegate: SS58String
  amount: bigint
}> = "65dtqr2egjbc3" as PlainDescriptor<{
  asset_id: number
  source: SS58String
  delegate: SS58String
  amount: bigint
}>
const evt_Assets_ApprovalCancelled: PlainDescriptor<{
  asset_id: number
  owner: SS58String
  delegate: SS58String
}> = "bqj3vg5s5lk0c" as PlainDescriptor<{
  asset_id: number
  owner: SS58String
  delegate: SS58String
}>
const evt_Assets_TransferredApproved: PlainDescriptor<{
  asset_id: number
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}> = "6l73u513p8rna" as PlainDescriptor<{
  asset_id: number
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}>
const evt_Assets_AssetStatusChanged: PlainDescriptor<{ asset_id: number }> =
  ca5le7udkgbaq9 as PlainDescriptor<{ asset_id: number }>
const evt_Assets_AssetMinBalanceChanged: PlainDescriptor<{
  asset_id: number
  new_min_balance: bigint
}> = "efqmt2htu1dlu" as PlainDescriptor<{
  asset_id: number
  new_min_balance: bigint
}>
const evt_Assets_Touched: PlainDescriptor<{
  asset_id: number
  who: SS58String
  depositor: SS58String
}> = "f8bgtgqrchjtu" as PlainDescriptor<{
  asset_id: number
  who: SS58String
  depositor: SS58String
}>
const evt_Assets_Blocked: PlainDescriptor<{
  asset_id: number
  who: SS58String
}> = cf4ebvclj2ugvi as PlainDescriptor<{ asset_id: number; who: SS58String }>
const evt_Uniques_Created: PlainDescriptor<{
  collection: number
  creator: SS58String
  owner: SS58String
}> = c9gqanbbbe917p as PlainDescriptor<{
  collection: number
  creator: SS58String
  owner: SS58String
}>
const evt_Uniques_ForceCreated: PlainDescriptor<{
  collection: number
  owner: SS58String
}> = cd1m1230297f7a as PlainDescriptor<{
  collection: number
  owner: SS58String
}>
const evt_Uniques_Destroyed: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Uniques_Issued: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}> = cfvb1p5munhhv4 as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}>
const evt_Uniques_Transferred: PlainDescriptor<{
  collection: number
  item: number
  from: SS58String
  to: SS58String
}> = c46h83ilqeed3g as PlainDescriptor<{
  collection: number
  item: number
  from: SS58String
  to: SS58String
}>
const evt_Uniques_Burned: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}> = cfvb1p5munhhv4 as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}>
const evt_Uniques_Frozen: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Uniques_Thawed: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Uniques_CollectionFrozen: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Uniques_CollectionThawed: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Uniques_OwnerChanged: PlainDescriptor<{
  collection: number
  new_owner: SS58String
}> = ccahse3uoi76n7 as PlainDescriptor<{
  collection: number
  new_owner: SS58String
}>
const evt_Uniques_TeamChanged: PlainDescriptor<{
  collection: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}> = "75sj3uv7gnemk" as PlainDescriptor<{
  collection: number
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}>
const evt_Uniques_ApprovedTransfer: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}> = c5fjkvcb5vr6nb as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}>
const evt_Uniques_ApprovalCancelled: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}> = c5fjkvcb5vr6nb as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}>
const evt_Uniques_ItemStatusChanged: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Uniques_CollectionMetadataSet: PlainDescriptor<{
  collection: number
  data: Binary
  is_frozen: boolean
}> = c9viqhmdtuof5e as PlainDescriptor<{
  collection: number
  data: Binary
  is_frozen: boolean
}>
const evt_Uniques_CollectionMetadataCleared: PlainDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Uniques_MetadataSet: PlainDescriptor<{
  collection: number
  item: number
  data: Binary
  is_frozen: boolean
}> = cceq9fmmp9aeqv as PlainDescriptor<{
  collection: number
  item: number
  data: Binary
  is_frozen: boolean
}>
const evt_Uniques_MetadataCleared: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Uniques_Redeposited: PlainDescriptor<{
  collection: number
  successful_items: Anonymize<Icgljjb6j82uhn>
}> = c2gr1toekv86b9 as PlainDescriptor<{
  collection: number
  successful_items: Anonymize<Icgljjb6j82uhn>
}>
const evt_Uniques_AttributeSet: PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
  value: Binary
}> = c5tvvgui05tn6e as PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
  value: Binary
}>
const evt_Uniques_AttributeCleared: PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
}> = cbal0joadvdc2h as PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  key: Binary
}>
const evt_Uniques_OwnershipAcceptanceChanged: PlainDescriptor<{
  who: SS58String
  maybe_collection: Anonymize<I4arjljr6dpflb>
}> = c2v2ikqt2trp52 as PlainDescriptor<{
  who: SS58String
  maybe_collection: Anonymize<I4arjljr6dpflb>
}>
const evt_Uniques_CollectionMaxSupplySet: PlainDescriptor<{
  collection: number
  max_supply: number
}> = c6h88h8vba22v8 as PlainDescriptor<{
  collection: number
  max_supply: number
}>
const evt_Uniques_ItemPriceSet: PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
}> = cf3057hi1g5qlo as PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
}>
const evt_Uniques_ItemPriceRemoved: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Uniques_ItemBought: PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  seller: SS58String
  buyer: SS58String
}> = caii5qf41d5n3d as PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  seller: SS58String
  buyer: SS58String
}>
const evt_Nfts_Created: PlainDescriptor<{
  collection: number
  creator: SS58String
  owner: SS58String
}> = c9gqanbbbe917p as PlainDescriptor<{
  collection: number
  creator: SS58String
  owner: SS58String
}>
const evt_Nfts_ForceCreated: PlainDescriptor<{
  collection: number
  owner: SS58String
}> = cd1m1230297f7a as PlainDescriptor<{
  collection: number
  owner: SS58String
}>
const evt_Nfts_Destroyed: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Nfts_Issued: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}> = cfvb1p5munhhv4 as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}>
const evt_Nfts_Transferred: PlainDescriptor<{
  collection: number
  item: number
  from: SS58String
  to: SS58String
}> = c46h83ilqeed3g as PlainDescriptor<{
  collection: number
  item: number
  from: SS58String
  to: SS58String
}>
const evt_Nfts_Burned: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}> = cfvb1p5munhhv4 as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}>
const evt_Nfts_ItemTransferLocked: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Nfts_ItemTransferUnlocked: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Nfts_ItemPropertiesLocked: PlainDescriptor<{
  collection: number
  item: number
  lock_metadata: boolean
  lock_attributes: boolean
}> = c1jj31tn29ie3c as PlainDescriptor<{
  collection: number
  item: number
  lock_metadata: boolean
  lock_attributes: boolean
}>
const evt_Nfts_CollectionLocked: PlainDescriptor<{ collection: number }> =
  c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Nfts_OwnerChanged: PlainDescriptor<{
  collection: number
  new_owner: SS58String
}> = ccahse3uoi76n7 as PlainDescriptor<{
  collection: number
  new_owner: SS58String
}>
const evt_Nfts_TeamChanged: PlainDescriptor<{
  collection: number
  issuer: Anonymize<Ihfphjolmsqq1>
  admin: Anonymize<Ihfphjolmsqq1>
  freezer: Anonymize<Ihfphjolmsqq1>
}> = "co8bnjc6taa27" as PlainDescriptor<{
  collection: number
  issuer: Anonymize<Ihfphjolmsqq1>
  admin: Anonymize<Ihfphjolmsqq1>
  freezer: Anonymize<Ihfphjolmsqq1>
}>
const evt_Nfts_TransferApproved: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
  deadline: Anonymize<I4arjljr6dpflb>
}> = "78i1bvlonei69" as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
  deadline: Anonymize<I4arjljr6dpflb>
}>
const evt_Nfts_ApprovalCancelled: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}> = c5fjkvcb5vr6nb as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
  delegate: SS58String
}>
const evt_Nfts_AllApprovalsCancelled: PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}> = cfvb1p5munhhv4 as PlainDescriptor<{
  collection: number
  item: number
  owner: SS58String
}>
const evt_Nfts_CollectionConfigChanged: PlainDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Nfts_CollectionMetadataSet: PlainDescriptor<{
  collection: number
  data: Binary
}> = c78u60nqh0etah as PlainDescriptor<{ collection: number; data: Binary }>
const evt_Nfts_CollectionMetadataCleared: PlainDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Nfts_ItemMetadataSet: PlainDescriptor<{
  collection: number
  item: number
  data: Binary
}> = ccrkms46uh8tpb as PlainDescriptor<{
  collection: number
  item: number
  data: Binary
}>
const evt_Nfts_ItemMetadataCleared: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Nfts_Redeposited: PlainDescriptor<{
  collection: number
  successful_items: Anonymize<Icgljjb6j82uhn>
}> = c2gr1toekv86b9 as PlainDescriptor<{
  collection: number
  successful_items: Anonymize<Icgljjb6j82uhn>
}>
const evt_Nfts_AttributeSet: PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}> = c8caj3ho0b8kia as PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
  value: Binary
}>
const evt_Nfts_AttributeCleared: PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
}> = crn56pucio7gb as PlainDescriptor<{
  collection: number
  maybe_item: Anonymize<I4arjljr6dpflb>
  namespace: Anonymize<I966fu47vp6aqm>
  key: Binary
}>
const evt_Nfts_ItemAttributesApprovalAdded: PlainDescriptor<{
  collection: number
  item: number
  delegate: SS58String
}> = c9i1f9mrso1hmf as PlainDescriptor<{
  collection: number
  item: number
  delegate: SS58String
}>
const evt_Nfts_ItemAttributesApprovalRemoved: PlainDescriptor<{
  collection: number
  item: number
  delegate: SS58String
}> = c9i1f9mrso1hmf as PlainDescriptor<{
  collection: number
  item: number
  delegate: SS58String
}>
const evt_Nfts_OwnershipAcceptanceChanged: PlainDescriptor<{
  who: SS58String
  maybe_collection: Anonymize<I4arjljr6dpflb>
}> = c2v2ikqt2trp52 as PlainDescriptor<{
  who: SS58String
  maybe_collection: Anonymize<I4arjljr6dpflb>
}>
const evt_Nfts_CollectionMaxSupplySet: PlainDescriptor<{
  collection: number
  max_supply: number
}> = c6h88h8vba22v8 as PlainDescriptor<{
  collection: number
  max_supply: number
}>
const evt_Nfts_CollectionMintSettingsUpdated: PlainDescriptor<{
  collection: number
}> = c6cu7obfo0rr0o as PlainDescriptor<{ collection: number }>
const evt_Nfts_NextCollectionIdIncremented: PlainDescriptor<{
  next_id: Anonymize<I4arjljr6dpflb>
}> = "9ksla2si91s56" as PlainDescriptor<{ next_id: Anonymize<I4arjljr6dpflb> }>
const evt_Nfts_ItemPriceSet: PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
}> = cf3057hi1g5qlo as PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
}>
const evt_Nfts_ItemPriceRemoved: PlainDescriptor<{
  collection: number
  item: number
}> = cafkqus0ohh6l6 as PlainDescriptor<{ collection: number; item: number }>
const evt_Nfts_ItemBought: PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  seller: SS58String
  buyer: SS58String
}> = caii5qf41d5n3d as PlainDescriptor<{
  collection: number
  item: number
  price: bigint
  seller: SS58String
  buyer: SS58String
}>
const evt_Nfts_TipSent: PlainDescriptor<{
  collection: number
  item: number
  sender: SS58String
  receiver: SS58String
  amount: bigint
}> = "d9j7b85otvjru" as PlainDescriptor<{
  collection: number
  item: number
  sender: SS58String
  receiver: SS58String
  amount: bigint
}>
const evt_Nfts_SwapCreated: PlainDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}> = c1cft1pbnpmk8h as PlainDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}>
const evt_Nfts_SwapCancelled: PlainDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}> = c1cft1pbnpmk8h as PlainDescriptor<{
  offered_collection: number
  offered_item: number
  desired_collection: number
  desired_item: Anonymize<I4arjljr6dpflb>
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}>
const evt_Nfts_SwapClaimed: PlainDescriptor<{
  sent_collection: number
  sent_item: number
  sent_item_owner: SS58String
  received_collection: number
  received_item: number
  received_item_owner: SS58String
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}> = "4itqom6arbchs" as PlainDescriptor<{
  sent_collection: number
  sent_item: number
  sent_item_owner: SS58String
  received_collection: number
  received_item: number
  received_item_owner: SS58String
  price: Anonymize<Iemn9sl4bs903b>
  deadline: number
}>
const evt_Nfts_PreSignedAttributesSet: PlainDescriptor<{
  collection: number
  item: number
  namespace: Anonymize<I966fu47vp6aqm>
}> = "f66fuhp1p95q" as PlainDescriptor<{
  collection: number
  item: number
  namespace: Anonymize<I966fu47vp6aqm>
}>
const evt_Nfts_PalletAttributeSet: PlainDescriptor<{
  collection: number
  item: Anonymize<I4arjljr6dpflb>
  attribute: Anonymize<I5ngqtbe5pl60l>
  value: Binary
}> = "4obtjucjucdlg" as PlainDescriptor<{
  collection: number
  item: Anonymize<I4arjljr6dpflb>
  attribute: Anonymize<I5ngqtbe5pl60l>
  value: Binary
}>
const evt_ForeignAssets_Created: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  creator: SS58String
  owner: SS58String
}> = "7hlh8kikd6p4q" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  creator: SS58String
  owner: SS58String
}>
const evt_ForeignAssets_Issued: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  amount: bigint
}> = "773vhjbkoph68" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  amount: bigint
}>
const evt_ForeignAssets_Transferred: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  from: SS58String
  to: SS58String
  amount: bigint
}> = "b48p64dtbhtjh" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  from: SS58String
  to: SS58String
  amount: bigint
}>
const evt_ForeignAssets_Burned: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  balance: bigint
}> = "67h5652vttqrv" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  balance: bigint
}>
const evt_ForeignAssets_TeamChanged: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}> = "4tcg4kkcmk1b8" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  issuer: SS58String
  admin: SS58String
  freezer: SS58String
}>
const evt_ForeignAssets_OwnerChanged: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
}> = c2c3boiuqtga9e as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
}>
const evt_ForeignAssets_Frozen: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
}> = cddsdcglf5ofsb as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
}>
const evt_ForeignAssets_Thawed: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
}> = cddsdcglf5ofsb as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
}>
const evt_ForeignAssets_AssetFrozen: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_AssetThawed: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_AccountsDestroyed: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  accounts_destroyed: number
  accounts_remaining: number
}> = "9s7a8akkhql1" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  accounts_destroyed: number
  accounts_remaining: number
}>
const evt_ForeignAssets_ApprovalsDestroyed: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  approvals_destroyed: number
  approvals_remaining: number
}> = "6goc5k4sgmd8c" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  approvals_destroyed: number
  approvals_remaining: number
}>
const evt_ForeignAssets_DestructionStarted: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_Destroyed: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_ForceCreated: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
}> = c2c3boiuqtga9e as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
}>
const evt_ForeignAssets_MetadataSet: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}> = "3fomiurk0sgm7" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  name: Binary
  symbol: Binary
  decimals: number
  is_frozen: boolean
}>
const evt_ForeignAssets_MetadataCleared: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_ApprovedTransfer: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  source: SS58String
  delegate: SS58String
  amount: bigint
}> = "dlu0dsu3lckof" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  source: SS58String
  delegate: SS58String
  amount: bigint
}>
const evt_ForeignAssets_ApprovalCancelled: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
}> = "avb0613seobiu" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
}>
const evt_ForeignAssets_TransferredApproved: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}> = "7fmiabj1mvkth" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  owner: SS58String
  delegate: SS58String
  destination: SS58String
  amount: bigint
}>
const evt_ForeignAssets_AssetStatusChanged: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
}> = c9lo1oa3a7kqqa as PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>
const evt_ForeignAssets_AssetMinBalanceChanged: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  new_min_balance: bigint
}> = "fbbapj50vfmd1" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  new_min_balance: bigint
}>
const evt_ForeignAssets_Touched: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
  depositor: SS58String
}> = "6sl14purtgkga" as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
  depositor: SS58String
}>
const evt_ForeignAssets_Blocked: PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
}> = cddsdcglf5ofsb as PlainDescriptor<{
  asset_id: Anonymize<I43cmiele6sevi>
  who: SS58String
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
const err_ParachainSystem_OverlappingUpgrades: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_ProhibitedByPolkadot: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_TooBig: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_ValidationDataNotAvailable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_HostConfigurationNotAvailable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_NotScheduled: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_NothingAuthorized: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ParachainSystem_Unauthorized: PlainDescriptor<undefined> =
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
const err_CollatorSelection_TooManyCandidates: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_TooFewEligibleCollators: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_AlreadyCandidate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_NotCandidate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_TooManyInvulnerables: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_AlreadyInvulnerable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_NotInvulnerable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_NoAssociatedValidatorId: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_CollatorSelection_ValidatorNotRegistered: PlainDescriptor<undefined> =
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
const err_XcmpQueue_FailedToSend: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmpQueue_BadXcmOrigin: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmpQueue_BadXcm: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmpQueue_BadOverweightIndex: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_XcmpQueue_WeightOverLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_Unreachable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_SendFailure: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_Filtered: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_UnweighableMessage: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_DestinationNotInvertible: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_Empty: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_CannotReanchor: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_TooManyAssets: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_InvalidOrigin: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_BadVersion: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_BadLocation: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_NoSubscription: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_AlreadySubscribed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_InvalidAsset: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_LowBalance: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_TooManyLocks: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_AccountNotSovereign: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_FeesNotMet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_LockNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_PolkadotXcm_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_DmpQueue_Unknown: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_DmpQueue_OverLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Utility_TooManyCalls: PlainDescriptor<undefined> =
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
const err_Assets_BalanceLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_NoAccount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_Unknown: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_Frozen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_BadWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_MinBalanceZero: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_UnavailableConsumer: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_BadMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_Unapproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_WouldDie: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_AlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_NoDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_WouldBurn: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_LiveAsset: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_AssetNotLive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_IncorrectStatus: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_NotFrozen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Assets_CallbackFailed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_UnknownCollection: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_AlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_WrongOwner: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_BadWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_Frozen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_WrongDelegate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_NoDelegate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_Unapproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_Unaccepted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_Locked: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_MaxSupplyReached: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_MaxSupplyAlreadySet: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_MaxSupplyTooSmall: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_UnknownItem: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_NotForSale: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Uniques_BidTooLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_UnknownCollection: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_AlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_ApprovalExpired: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongOwner: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_BadWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_CollectionIdInUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_ItemsNonTransferable: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_NotDelegate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongDelegate: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_Unapproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_Unaccepted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_ItemLocked: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_LockedItemAttributes: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_LockedCollectionAttributes: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_LockedItemMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_LockedCollectionMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MaxSupplyReached: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MaxSupplyLocked: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MaxSupplyTooSmall: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_UnknownItem: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_UnknownSwap: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MetadataNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_AttributeNotFound: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_NotForSale: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_BidTooLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_ReachedApprovalLimit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_DeadlineExpired: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongDuration: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MethodDisabled: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongSetting: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_InconsistentItemConfig: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_NoConfig: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_RolesNotCleared: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MintNotStarted: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MintEnded: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_AlreadyClaimed: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_IncorrectData: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongOrigin: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongSignature: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_IncorrectMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_MaxAttributesLimitReached: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WrongNamespace: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_CollectionNotEmpty: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_Nfts_WitnessRequired: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_BalanceLow: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_NoAccount: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_NoPermission: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_Unknown: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_Frozen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_InUse: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_BadWitness: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_MinBalanceZero: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_UnavailableConsumer: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_BadMetadata: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_Unapproved: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_WouldDie: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_AlreadyExists: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_NoDeposit: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_WouldBurn: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_LiveAsset: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_AssetNotLive: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_IncorrectStatus: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_NotFrozen: PlainDescriptor<undefined> =
  c39ibapn5dm6tr as PlainDescriptor<undefined>
const err_ForeignAssets_CallbackFailed: PlainDescriptor<undefined> =
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
const const_Timestamp_MinimumPeriod: PlainDescriptor<bigint> =
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
const const_Utility_batched_calls_limit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Multisig_DepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Multisig_DepositFactor: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Multisig_MaxSignatories: PlainDescriptor<number> =
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
const const_Assets_RemoveItemsLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Assets_AssetDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Assets_AssetAccountDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Assets_MetadataDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Assets_MetadataDepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Assets_ApprovalDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Assets_StringLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Uniques_CollectionDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Uniques_ItemDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Uniques_MetadataDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Uniques_AttributeDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Uniques_DepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Uniques_StringLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Uniques_KeyLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Uniques_ValueLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_CollectionDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Nfts_ItemDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Nfts_MetadataDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Nfts_AttributeDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Nfts_DepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_Nfts_StringLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_KeyLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_ValueLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_ApprovalsLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_ItemAttributesApprovalsLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_MaxTips: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_MaxDeadlineDuration: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_MaxAttributesPerCall: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_Nfts_Features: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_RemoveItemsLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const const_ForeignAssets_AssetDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_AssetAccountDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_MetadataDepositBase: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_MetadataDepositPerByte: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_ApprovalDeposit: PlainDescriptor<bigint> =
  c7d2tqf029vcod as PlainDescriptor<bigint>
const const_ForeignAssets_StringLimit: PlainDescriptor<number> =
  cf3ncnq6stc567 as PlainDescriptor<number>
const runtime_AuraApi_slot_duration: RuntimeDescriptor<[], bigint> =
  "b54qab7tpjjsf" as RuntimeDescriptor<[], bigint>
const runtime_AuraApi_authorities: RuntimeDescriptor<
  [],
  Array<Binary>
> = "2tjq7ncksi1hj" as RuntimeDescriptor<[], Array<Binary>>
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
        ParachainSystem: Anonymize<Ia0jlnena5ajog>
        Timestamp: Anonymize<TimestampPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        CollatorSelection: Anonymize<Idicb249fns7nd>
        Session: Anonymize<I3v8vq7j9grsdj>
        XcmpQueue: Anonymize<Iemk8msmejs2tt>
        PolkadotXcm: Anonymize<XcmPalletCall>
        DmpQueue: Anonymize<I3lfpt1qictomp>
        ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
        Utility: Anonymize<Iakgmukh287lgd>
        Multisig: Anonymize<I25c5pk92h8gi9>
        Proxy: Anonymize<I8l19tjqe7q083>
        Assets: Anonymize<Id6smp39btrdm7>
        Uniques: Anonymize<I4p2mihcqro9rd>
        Nfts: Anonymize<Ifub2394n314hb>
        ForeignAssets: Anonymize<If63s12hm5a8p0>
      }>
    >,
    len: number,
  ],
  {
    weight: Anonymize<I4q39t5hn830vp>
    class: DispatchClass
    partial_fee: bigint
  }
> = "aijojh9799cvi" as RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        ParachainSystem: Anonymize<Ia0jlnena5ajog>
        Timestamp: Anonymize<TimestampPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        CollatorSelection: Anonymize<Idicb249fns7nd>
        Session: Anonymize<I3v8vq7j9grsdj>
        XcmpQueue: Anonymize<Iemk8msmejs2tt>
        PolkadotXcm: Anonymize<XcmPalletCall>
        DmpQueue: Anonymize<I3lfpt1qictomp>
        ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
        Utility: Anonymize<Iakgmukh287lgd>
        Multisig: Anonymize<I25c5pk92h8gi9>
        Proxy: Anonymize<I8l19tjqe7q083>
        Assets: Anonymize<Id6smp39btrdm7>
        Uniques: Anonymize<I4p2mihcqro9rd>
        Nfts: Anonymize<Ifub2394n314hb>
        ForeignAssets: Anonymize<If63s12hm5a8p0>
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
        ParachainSystem: Anonymize<Ia0jlnena5ajog>
        Timestamp: Anonymize<TimestampPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        CollatorSelection: Anonymize<Idicb249fns7nd>
        Session: Anonymize<I3v8vq7j9grsdj>
        XcmpQueue: Anonymize<Iemk8msmejs2tt>
        PolkadotXcm: Anonymize<XcmPalletCall>
        DmpQueue: Anonymize<I3lfpt1qictomp>
        ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
        Utility: Anonymize<Iakgmukh287lgd>
        Multisig: Anonymize<I25c5pk92h8gi9>
        Proxy: Anonymize<I8l19tjqe7q083>
        Assets: Anonymize<Id6smp39btrdm7>
        Uniques: Anonymize<I4p2mihcqro9rd>
        Nfts: Anonymize<Ifub2394n314hb>
        ForeignAssets: Anonymize<If63s12hm5a8p0>
      }>
    >,
    len: number,
  ],
  { inclusion_fee: Anonymize<Id37fum600qfau>; tip: bigint }
> = "24m0hq5lbss1i" as RuntimeDescriptor<
  [
    call: Anonymize<
      AnonymousEnum<{
        System: Anonymize<SystemPalletCall>
        ParachainSystem: Anonymize<Ia0jlnena5ajog>
        Timestamp: Anonymize<TimestampPalletCall>
        Balances: Anonymize<Ibf8j84ii3a3kr>
        CollatorSelection: Anonymize<Idicb249fns7nd>
        Session: Anonymize<I3v8vq7j9grsdj>
        XcmpQueue: Anonymize<Iemk8msmejs2tt>
        PolkadotXcm: Anonymize<XcmPalletCall>
        DmpQueue: Anonymize<I3lfpt1qictomp>
        ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
        Utility: Anonymize<Iakgmukh287lgd>
        Multisig: Anonymize<I25c5pk92h8gi9>
        Proxy: Anonymize<I8l19tjqe7q083>
        Assets: Anonymize<Id6smp39btrdm7>
        Uniques: Anonymize<I4p2mihcqro9rd>
        Nfts: Anonymize<Ifub2394n314hb>
        ForeignAssets: Anonymize<If63s12hm5a8p0>
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
const runtime_FungiblesApi_query_account_balances: RuntimeDescriptor<
  [account: SS58String],
  ResultPayload<XcmVersionedMultiAssets, Anonymize<Ifinuns4munfa5>>
> = "b2gkeu620vq3d" as RuntimeDescriptor<
  [account: SS58String],
  ResultPayload<XcmVersionedMultiAssets, Anonymize<Ifinuns4munfa5>>
>
const runtime_CollectCollationInfo_collect_collation_info: RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  {
    upward_messages: Anonymize<Itom7fk49o0c9>
    horizontal_messages: Anonymize<I6r5cbv8ttrb09>
    new_validation_code: Anonymize<Iabpgqcjikia83>
    processed_downward_messages: number
    hrmp_watermark: number
    head_data: Binary
  }
> = "9th1phn8v89r5" as RuntimeDescriptor<
  [
    header: {
      parent_hash: Binary
      number: number
      state_root: Binary
      extrinsics_root: Binary
      digest: Anonymize<Idin6nhq46lvdj>
    },
  ],
  {
    upward_messages: Anonymize<Itom7fk49o0c9>
    horizontal_messages: Anonymize<I6r5cbv8ttrb09>
    new_validation_code: Anonymize<Iabpgqcjikia83>
    processed_downward_messages: number
    hrmp_watermark: number
    head_data: Binary
  }
>
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
      Events: StorageDescriptor<[], Array<Anonymize<Iepshjdsbc1nmq>>, false>

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
  ParachainSystem: [
    {
      /**
       * Latest included block descendants the runtime accepted. In other words, these are
       * ancestors of the currently executing block which have not been included in the observed
       * relay-chain state.
       *
       * The segment length is limited by the capacity returned from the [`ConsensusHook`] configured
       * in the pallet.
       */
      UnincludedSegment: StorageDescriptor<
        [],
        Array<Anonymize<I8ajtuet8esesv>>,
        false
      >

      /**
       * Storage field that keeps track of bandwidth used by the unincluded segment along with the
       * latest HRMP watermark. Used for limiting the acceptance of new blocks with
       * respect to relay chain constraints.
       */
      AggregatedUnincludedSegment: StorageDescriptor<
        [],
        {
          used_bandwidth: Anonymize<Ieafp1gui1o4cl>
          hrmp_watermark: Anonymize<I4arjljr6dpflb>
          consumed_go_ahead_signal: Anonymize<Ie1vdku2j6ccvj>
        },
        true
      >

      /**
       * In case of a scheduled upgrade, this storage field contains the validation code to be
       * applied.
       *
       * As soon as the relay chain gives us the go-ahead signal, we will overwrite the
       * [`:code`][sp_core::storage::well_known_keys::CODE] which will result the next block process
       * with the new validation code. This concludes the upgrade process.
       */
      PendingValidationCode: StorageDescriptor<[], Binary, false>

      /**
       * Validation code that is set by the parachain and is to be communicated to collator and
       * consequently the relay-chain.
       *
       * This will be cleared in `on_initialize` of each new block if no other pallet already set
       * the value.
       */
      NewValidationCode: StorageDescriptor<[], Binary, true>

      /**
       * The [`PersistedValidationData`] set for this block.
       * This value is expected to be set only once per block and it's never stored
       * in the trie.
       */
      ValidationData: StorageDescriptor<
        [],
        {
          parent_head: Binary
          relay_parent_number: number
          relay_parent_storage_root: Binary
          max_pov_size: number
        },
        true
      >

      /**
       * Were the validation data set to notify the relay chain?
       */
      DidSetValidationCode: StorageDescriptor<[], boolean, false>

      /**
       * The relay chain block number associated with the last parachain block.
       *
       * This is updated in `on_finalize`.
       */
      LastRelayChainBlockNumber: StorageDescriptor<[], number, false>

      /**
       * An option which indicates if the relay-chain restricts signalling a validation code upgrade.
       * In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
       * candidate will be invalid.
       *
       * This storage item is a mirror of the corresponding value for the current parachain from the
       * relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
       * set after the inherent.
       */
      UpgradeRestrictionSignal: StorageDescriptor<
        [],
        PolkadotPrimitivesV5UpgradeRestriction | undefined,
        false
      >

      /**
       * Optional upgrade go-ahead signal from the relay-chain.
       *
       * This storage item is a mirror of the corresponding value for the current parachain from the
       * relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
       * set after the inherent.
       */
      UpgradeGoAhead: StorageDescriptor<
        [],
        PolkadotPrimitivesV5UpgradeGoAhead | undefined,
        false
      >

      /**
       * The state proof for the last relay parent block.
       *
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       *
       * This data is also absent from the genesis.
       */
      RelayStateProof: StorageDescriptor<[], Array<Binary>, true>

      /**
       * The snapshot of some state related to messaging relevant to the current parachain as per
       * the relay parent.
       *
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       *
       * This data is also absent from the genesis.
       */
      RelevantMessagingState: StorageDescriptor<
        [],
        {
          dmq_mqc_head: Binary
          relay_dispatch_queue_remaining_capacity: Anonymize<I3j1v1c2btq4bd>
          ingress_channels: Anonymize<I90nfahji0n33j>
          egress_channels: Anonymize<I90nfahji0n33j>
        },
        true
      >

      /**
       * The parachain host configuration that was obtained from the relay parent.
       *
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       *
       * This data is also absent from the genesis.
       */
      HostConfiguration: StorageDescriptor<
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
        },
        true
      >

      /**
       * The last downward message queue chain head we have observed.
       *
       * This value is loaded before and saved after processing inbound downward messages carried
       * by the system inherent.
       */
      LastDmqMqcHead: StorageDescriptor<[], Binary, false>

      /**
       * The message queue chain heads we have observed per each channel incoming channel.
       *
       * This value is loaded before and saved after processing inbound downward messages carried
       * by the system inherent.
       */
      LastHrmpMqcHeads: StorageDescriptor<
        [],
        Array<Anonymize<If89923vhoiaim>>,
        false
      >

      /**
       * Number of downward messages processed in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      ProcessedDownwardMessages: StorageDescriptor<[], number, false>

      /**
       * HRMP watermark that was set in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      HrmpWatermark: StorageDescriptor<[], number, false>

      /**
       * HRMP messages that were sent in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      HrmpOutboundMessages: StorageDescriptor<
        [],
        Array<Anonymize<I958l48g4qg5rf>>,
        false
      >

      /**
       * Upward messages that were sent in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      UpwardMessages: StorageDescriptor<[], Array<Binary>, false>

      /**
       * Upward messages that are still pending and not yet send to the relay chain.
       */
      PendingUpwardMessages: StorageDescriptor<[], Array<Binary>, false>

      /**
       * The factor to multiply the base delivery fee by for UMP.
       */
      UpwardDeliveryFeeFactor: StorageDescriptor<[], bigint, false>

      /**
       * The number of HRMP messages we observed in `on_initialize` and thus used that number for
       * announcing the weight of `on_initialize` and `on_finalize`.
       */
      AnnouncedHrmpMessagesPerCandidate: StorageDescriptor<[], number, false>

      /**
       * The weight we reserve at the beginning of the block for processing XCMP messages. This
       * overrides the amount set in the Config trait.
       */
      ReservedXcmpWeightOverride: StorageDescriptor<
        [],
        { ref_time: bigint; proof_size: bigint },
        true
      >

      /**
       * The weight we reserve at the beginning of the block for processing DMP messages. This
       * overrides the amount set in the Config trait.
       */
      ReservedDmpWeightOverride: StorageDescriptor<
        [],
        { ref_time: bigint; proof_size: bigint },
        true
      >

      /**
       * The next authorized upgrade, if there is one.
       */
      AuthorizedUpgrade: StorageDescriptor<
        [],
        { code_hash: Binary; check_version: boolean },
        true
      >

      /**
       * A custom head data that should be returned as result of `validate_block`.
       *
       * See `Pallet::set_custom_validation_head_data` for more information.
       */
      CustomValidationHeadData: StorageDescriptor<[], Binary, true>
    },
    {
      /**
       *See [`Pallet::set_validation_data`].
       */
      set_validation_data: TxDescriptor<{ data: Anonymize<Icj9r7l64kc5ku> }>

      /**
       *See [`Pallet::sudo_send_upward_message`].
       */
      sudo_send_upward_message: TxDescriptor<{ message: Binary }>

      /**
       *See [`Pallet::authorize_upgrade`].
       */
      authorize_upgrade: TxDescriptor<{
        code_hash: Binary
        check_version: boolean
      }>

      /**
       *See [`Pallet::enact_authorized_upgrade`].
       */
      enact_authorized_upgrade: TxDescriptor<{ code: Binary }>
    },
    {
      /**
       *The validation function has been scheduled to apply.
       */
      ValidationFunctionStored: PlainDescriptor<undefined>

      /**
       *The validation function was applied as of the contained relay chain block number.
       */
      ValidationFunctionApplied: PlainDescriptor<{
        relay_chain_block_num: number
      }>

      /**
       *The relay-chain aborted the upgrade process.
       */
      ValidationFunctionDiscarded: PlainDescriptor<undefined>

      /**
       *An upgrade has been authorized.
       */
      UpgradeAuthorized: PlainDescriptor<{ code_hash: Binary }>

      /**
       *Some downward messages have been received and will be processed.
       */
      DownwardMessagesReceived: PlainDescriptor<{ count: number }>

      /**
       *Downward messages were processed using the given weight.
       */
      DownwardMessagesProcessed: PlainDescriptor<{
        weight_used: Anonymize<I4q39t5hn830vp>
        dmq_head: Binary
      }>

      /**
       *An upward message was sent to the relay chain.
       */
      UpwardMessageSent: PlainDescriptor<{
        message_hash: Anonymize<I17k3ujudqd5df>
      }>
    },
    {
      /**
       *Attempt to upgrade validation function while existing upgrade pending.
       */
      OverlappingUpgrades: PlainDescriptor<undefined>

      /**
       *Polkadot currently prohibits this parachain from upgrading its validation function.
       */
      ProhibitedByPolkadot: PlainDescriptor<undefined>

      /**
       *The supplied validation function has compiled into a blob larger than Polkadot is
       *willing to run.
       */
      TooBig: PlainDescriptor<undefined>

      /**
       *The inherent which supplies the validation data did not run this block.
       */
      ValidationDataNotAvailable: PlainDescriptor<undefined>

      /**
       *The inherent which supplies the host configuration did not run this block.
       */
      HostConfigurationNotAvailable: PlainDescriptor<undefined>

      /**
       *No validation function upgrade is currently scheduled.
       */
      NotScheduled: PlainDescriptor<undefined>

      /**
       *No code upgrade has been authorized.
       */
      NothingAuthorized: PlainDescriptor<undefined>

      /**
       *The given code upgrade has not been authorized.
       */
      Unauthorized: PlainDescriptor<undefined>
    },
    {},
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
  ParachainInfo: [
    {
      /**

 */
      ParachainId: StorageDescriptor<[], number, false>
    },
    {},
    {},
    {},
    {},
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
        Array<Anonymize<I7qdm60946h5u9>>,
        false
      >

      /**
       * Freeze locks on account balances.
       */
      Freezes: StorageDescriptor<
        [Key: SS58String],
        Array<Anonymize<I7qdm60946h5u9>>,
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
  AssetTxPayment: [
    {},
    {},
    {
      /**
       *A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
       *has been paid by `who` in an asset `asset_id`.
       */
      AssetTxFeePaid: PlainDescriptor<{
        who: SS58String
        actual_fee: bigint
        tip: bigint
        asset_id: Anonymize<I4arjljr6dpflb>
      }>
    },
    {},
    {},
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
  CollatorSelection: [
    {
      /**
       * The invulnerable, permissioned collators. This list must be sorted.
       */
      Invulnerables: StorageDescriptor<[], Array<SS58String>, false>

      /**
       * The (community, limited) collation candidates. `Candidates` and `Invulnerables` should be
       * mutually exclusive.
       */
      Candidates: StorageDescriptor<[], Array<Anonymize<Iep1lmt6q3s6r3>>, false>

      /**
       * Last block authored by collator.
       */
      LastAuthoredBlock: StorageDescriptor<[Key: SS58String], number, false>

      /**
       * Desired number of candidates.
       *
       * This should ideally always be less than [`Config::MaxCandidates`] for weights to be correct.
       */
      DesiredCandidates: StorageDescriptor<[], number, false>

      /**
       * Fixed amount to deposit to become a collator.
       *
       * When a collator calls `leave_intent` they immediately receive the deposit back.
       */
      CandidacyBond: StorageDescriptor<[], bigint, false>
    },
    {
      /**
       *See [`Pallet::set_invulnerables`].
       */
      set_invulnerables: TxDescriptor<{ new: Anonymize<Ia2lhg7l2hilo3> }>

      /**
       *See [`Pallet::set_desired_candidates`].
       */
      set_desired_candidates: TxDescriptor<{ max: number }>

      /**
       *See [`Pallet::set_candidacy_bond`].
       */
      set_candidacy_bond: TxDescriptor<{ bond: bigint }>

      /**
       *See [`Pallet::register_as_candidate`].
       */
      register_as_candidate: TxDescriptor<undefined>

      /**
       *See [`Pallet::leave_intent`].
       */
      leave_intent: TxDescriptor<undefined>

      /**
       *See [`Pallet::add_invulnerable`].
       */
      add_invulnerable: TxDescriptor<{ who: SS58String }>

      /**
       *See [`Pallet::remove_invulnerable`].
       */
      remove_invulnerable: TxDescriptor<{ who: SS58String }>
    },
    {
      /**
       *New Invulnerables were set.
       */
      NewInvulnerables: PlainDescriptor<{
        invulnerables: Anonymize<Ia2lhg7l2hilo3>
      }>

      /**
       *A new Invulnerable was added.
       */
      InvulnerableAdded: PlainDescriptor<{ account_id: SS58String }>

      /**
       *An Invulnerable was removed.
       */
      InvulnerableRemoved: PlainDescriptor<{ account_id: SS58String }>

      /**
       *The number of desired candidates was set.
       */
      NewDesiredCandidates: PlainDescriptor<{ desired_candidates: number }>

      /**
       *The candidacy bond was set.
       */
      NewCandidacyBond: PlainDescriptor<{ bond_amount: bigint }>

      /**
       *A new candidate joined.
       */
      CandidateAdded: PlainDescriptor<{
        account_id: SS58String
        deposit: bigint
      }>

      /**
       *A candidate was removed.
       */
      CandidateRemoved: PlainDescriptor<{ account_id: SS58String }>

      /**
       *An account was unable to be added to the Invulnerables because they did not have keys
       *registered. Other Invulnerables may have been set.
       */
      InvalidInvulnerableSkipped: PlainDescriptor<{ account_id: SS58String }>
    },
    {
      /**
       *The pallet has too many candidates.
       */
      TooManyCandidates: PlainDescriptor<undefined>

      /**
       *Leaving would result in too few candidates.
       */
      TooFewEligibleCollators: PlainDescriptor<undefined>

      /**
       *Account is already a candidate.
       */
      AlreadyCandidate: PlainDescriptor<undefined>

      /**
       *Account is not a candidate.
       */
      NotCandidate: PlainDescriptor<undefined>

      /**
       *There are too many Invulnerables.
       */
      TooManyInvulnerables: PlainDescriptor<undefined>

      /**
       *Account is already an Invulnerable.
       */
      AlreadyInvulnerable: PlainDescriptor<undefined>

      /**
       *Account is not an Invulnerable.
       */
      NotInvulnerable: PlainDescriptor<undefined>

      /**
       *Account has no associated validator ID.
       */
      NoAssociatedValidatorId: PlainDescriptor<undefined>

      /**
       *Validator ID is not yet registered.
       */
      ValidatorNotRegistered: PlainDescriptor<undefined>
    },
    {},
  ]
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
      QueuedKeys: StorageDescriptor<[], Array<Anonymize<I73gble6tmb52f>>, false>

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
      NextKeys: StorageDescriptor<[Key: SS58String], Binary, true>

      /**
       * The owner of a key. The key is the `KeyTypeId` + the encoded key.
       */
      KeyOwner: StorageDescriptor<[Key: [Binary, Binary]], SS58String, true>
    },
    {
      /**
       *See [`Pallet::set_keys`].
       */
      set_keys: TxDescriptor<{ keys: Binary; proof: Binary }>

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
  Aura: [
    {
      /**
       * The current authority set.
       */
      Authorities: StorageDescriptor<[], Array<Binary>, false>

      /**
       * The current slot of this block.
       *
       * This will be set in `on_initialize`.
       */
      CurrentSlot: StorageDescriptor<[], bigint, false>
    },
    {},
    {},
    {},
    {},
  ]
  AuraExt: [
    {
      /**
       * Serves as cache for the authorities.
       *
       * The authorities in AuRa are overwritten in `on_initialize` when we switch to a new session,
       * but we require the old authorities to verify the seal when validating a PoV. This will
       * always be updated to the latest AuRa authorities in `on_finalize`.
       */
      Authorities: StorageDescriptor<[], Array<Binary>, false>

      /**
       * Current slot paired with a number of authored blocks.
       *
       * Updated on each block initialization.
       */
      SlotInfo: StorageDescriptor<[], [bigint, number], true>
    },
    {},
    {},
    {},
    {},
  ]
  XcmpQueue: [
    {
      /**
       * Status of the inbound XCMP channels.
       */
      InboundXcmpStatus: StorageDescriptor<
        [],
        Array<Anonymize<Ifqaq2umctvajg>>,
        false
      >

      /**
       * Inbound aggregate XCMP messages. It can only be one per ParaId/block.
       */
      InboundXcmpMessages: StorageDescriptor<[number, number], Binary, false>

      /**
       * The non-empty XCMP channels in order of becoming non-empty, and the index of the first
       * and last outbound message. If the two indices are equal, then it indicates an empty
       * queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
       * than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
       * case of the need to send a high-priority signal message this block.
       * The bool is true if there is a signal message waiting to be sent.
       */
      OutboundXcmpStatus: StorageDescriptor<
        [],
        Array<Anonymize<Ittnsbm78tol1>>,
        false
      >

      /**
       * The messages outbound in a given XCMP channel.
       */
      OutboundXcmpMessages: StorageDescriptor<[number, number], Binary, false>

      /**
       * Any signal messages waiting to be sent.
       */
      SignalMessages: StorageDescriptor<[Key: number], Binary, false>

      /**
       * The configuration which controls the dynamics of the outbound queue.
       */
      QueueConfig: StorageDescriptor<
        [],
        {
          suspend_threshold: number
          drop_threshold: number
          resume_threshold: number
          threshold_weight: Anonymize<I4q39t5hn830vp>
          weight_restrict_decay: Anonymize<I4q39t5hn830vp>
          xcmp_max_individual_weight: Anonymize<I4q39t5hn830vp>
        },
        false
      >

      /**
       * The messages that exceeded max individual message weight budget.
       *
       * These message stay in this storage map until they are manually dispatched via
       * `service_overweight`.
       */
      Overweight: StorageDescriptor<
        [Key: bigint],
        [number, number, Binary],
        true
      >

      /**
       *Counter for the related counted storage map
       */
      CounterForOverweight: StorageDescriptor<[], number, false>

      /**
       * The number of overweight messages ever recorded in `Overweight`. Also doubles as the next
       * available free overweight index.
       */
      OverweightCount: StorageDescriptor<[], bigint, false>

      /**
       * Whether or not the XCMP queue is suspended from executing incoming XCMs or not.
       */
      QueueSuspended: StorageDescriptor<[], boolean, false>

      /**
       * The factor to multiply the base delivery fee by.
       */
      DeliveryFeeFactor: StorageDescriptor<[Key: number], bigint, false>
    },
    {
      /**
       *See [`Pallet::service_overweight`].
       */
      service_overweight: TxDescriptor<{
        index: bigint
        weight_limit: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::suspend_xcm_execution`].
       */
      suspend_xcm_execution: TxDescriptor<undefined>

      /**
       *See [`Pallet::resume_xcm_execution`].
       */
      resume_xcm_execution: TxDescriptor<undefined>

      /**
       *See [`Pallet::update_suspend_threshold`].
       */
      update_suspend_threshold: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::update_drop_threshold`].
       */
      update_drop_threshold: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::update_resume_threshold`].
       */
      update_resume_threshold: TxDescriptor<{ new: number }>

      /**
       *See [`Pallet::update_threshold_weight`].
       */
      update_threshold_weight: TxDescriptor<{ new: Anonymize<I4q39t5hn830vp> }>

      /**
       *See [`Pallet::update_weight_restrict_decay`].
       */
      update_weight_restrict_decay: TxDescriptor<{
        new: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *See [`Pallet::update_xcmp_max_individual_weight`].
       */
      update_xcmp_max_individual_weight: TxDescriptor<{
        new: Anonymize<I4q39t5hn830vp>
      }>
    },
    {
      /**
       *Some XCM was executed ok.
       */
      Success: PlainDescriptor<{
        message_hash: Binary
        message_id: Binary
        weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *Some XCM failed.
       */
      Fail: PlainDescriptor<{
        message_hash: Binary
        message_id: Binary
        error: XcmV3TraitsError
        weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *Bad XCM version used.
       */
      BadVersion: PlainDescriptor<{ message_hash: Binary }>

      /**
       *Bad XCM format used.
       */
      BadFormat: PlainDescriptor<{ message_hash: Binary }>

      /**
       *An HRMP message was sent to a sibling parachain.
       */
      XcmpMessageSent: PlainDescriptor<{ message_hash: Binary }>

      /**
       *An XCM exceeded the individual message weight budget.
       */
      OverweightEnqueued: PlainDescriptor<{
        sender: number
        sent_at: number
        index: bigint
        required: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *An XCM from the overweight queue was executed with the given actual weight used.
       */
      OverweightServiced: PlainDescriptor<{
        index: bigint
        used: Anonymize<I4q39t5hn830vp>
      }>
    },
    {
      /**
       *Failed to send XCM message.
       */
      FailedToSend: PlainDescriptor<undefined>

      /**
       *Bad XCM origin.
       */
      BadXcmOrigin: PlainDescriptor<undefined>

      /**
       *Bad XCM data.
       */
      BadXcm: PlainDescriptor<undefined>

      /**
       *Bad overweight index.
       */
      BadOverweightIndex: PlainDescriptor<undefined>

      /**
       *Provided weight is possibly not enough to execute the message.
       */
      WeightOverLimit: PlainDescriptor<undefined>
    },
    {},
  ]
  PolkadotXcm: [
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
  CumulusXcm: [
    {},
    {},
    {
      /**
       *Downward message is invalid XCM.
       *\[ id \]
       */
      InvalidFormat: PlainDescriptor<Binary>

      /**
       *Downward message is unsupported version of XCM.
       *\[ id \]
       */
      UnsupportedVersion: PlainDescriptor<Binary>

      /**
       *Downward message executed with the given outcome.
       *\[ id, outcome \]
       */
      ExecutedDownward: PlainDescriptor<[Binary, XcmV3TraitsOutcome]>
    },
    {},
    {},
  ]
  DmpQueue: [
    {
      /**
       * The configuration.
       */
      Configuration: StorageDescriptor<
        [],
        { ref_time: bigint; proof_size: bigint },
        false
      >

      /**
       * The page index.
       */
      PageIndex: StorageDescriptor<
        [],
        { begin_used: number; end_used: number; overweight_count: bigint },
        false
      >

      /**
       * The queue pages.
       */
      Pages: StorageDescriptor<
        [Key: number],
        Array<Anonymize<Icp9h5ma02v1rg>>,
        false
      >

      /**
       * The overweight messages.
       */
      Overweight: StorageDescriptor<[Key: bigint], [number, Binary], true>

      /**
       *Counter for the related counted storage map
       */
      CounterForOverweight: StorageDescriptor<[], number, false>
    },
    {
      /**
       *See [`Pallet::service_overweight`].
       */
      service_overweight: TxDescriptor<{
        index: bigint
        weight_limit: Anonymize<I4q39t5hn830vp>
      }>
    },
    {
      /**
       *Downward message is invalid XCM.
       */
      InvalidFormat: PlainDescriptor<{ message_hash: Binary }>

      /**
       *Downward message is unsupported version of XCM.
       */
      UnsupportedVersion: PlainDescriptor<{ message_hash: Binary }>

      /**
       *Downward message executed with the given outcome.
       */
      ExecutedDownward: PlainDescriptor<{
        message_hash: Binary
        message_id: Binary
        outcome: XcmV3TraitsOutcome
      }>

      /**
       *The weight limit for handling downward messages was reached.
       */
      WeightExhausted: PlainDescriptor<{
        message_hash: Binary
        message_id: Binary
        remaining_weight: Anonymize<I4q39t5hn830vp>
        required_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *Downward message is overweight and was placed in the overweight queue.
       */
      OverweightEnqueued: PlainDescriptor<{
        message_hash: Binary
        message_id: Binary
        overweight_index: bigint
        required_weight: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *Downward message from the overweight queue was executed.
       */
      OverweightServiced: PlainDescriptor<{
        overweight_index: bigint
        weight_used: Anonymize<I4q39t5hn830vp>
      }>

      /**
       *The maximum number of downward messages was reached.
       */
      MaxMessagesExhausted: PlainDescriptor<{ message_hash: Binary }>
    },
    {
      /**
       *The message index given is unknown.
       */
      Unknown: PlainDescriptor<undefined>

      /**
       *The amount of weight given is possibly not enough for executing the message.
       */
      OverLimit: PlainDescriptor<undefined>
    },
    {},
  ]
  ToKusamaXcmRouter: [
    {
      /**
       * Bridge that we are using.
       *
       * **bridges-v1** assumptions: all outbound messages through this router are using single lane
       * and to single remote consensus. If there is some other remote consensus that uses the same
       * bridge hub, the separate pallet instance shall be used, In `v2` we'll have all required
       * primitives (lane-id aka bridge-id, derived from XCM locations) to support multiple  bridges
       * by the same pallet instance.
       */
      Bridge: StorageDescriptor<
        [],
        { delivery_fee_factor: bigint; is_congested: boolean },
        false
      >
    },
    {
      /**
       *See [`Pallet::report_bridge_status`].
       */
      report_bridge_status: TxDescriptor<{
        bridge_id: Binary
        is_congested: boolean
      }>
    },
    {},
    {},
    {},
  ]
  Utility: [
    {},
    {
      /**
       *See [`Pallet::batch`].
       */
      batch: TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>

      /**
       *See [`Pallet::as_derivative`].
       */
      as_derivative: TxDescriptor<{
        index: number
        call: Anonymize<I9ih0jev11cnlt>
      }>

      /**
       *See [`Pallet::batch_all`].
       */
      batch_all: TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>

      /**
       *See [`Pallet::dispatch_as`].
       */
      dispatch_as: TxDescriptor<{
        as_origin: Anonymize<I1un5g4rnbtvdk>
        call: Anonymize<I9ih0jev11cnlt>
      }>

      /**
       *See [`Pallet::force_batch`].
       */
      force_batch: TxDescriptor<{ calls: Anonymize<I9umjnqmckto5n> }>

      /**
       *See [`Pallet::with_weight`].
       */
      with_weight: TxDescriptor<{
        call: Anonymize<I9ih0jev11cnlt>
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
        call: Anonymize<I9ih0jev11cnlt>
      }>

      /**
       *See [`Pallet::as_multi`].
       */
      as_multi: TxDescriptor<{
        threshold: number
        other_signatories: Anonymize<Ia2lhg7l2hilo3>
        maybe_timepoint: Anonymize<I95jfd8j5cr5eh>
        call: Anonymize<I9ih0jev11cnlt>
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
  Proxy: [
    {
      /**
       * The set of account proxies. Maps the account which has delegated to the accounts
       * which are being delegated to, together with the amount held on deposit.
       */
      Proxies: StorageDescriptor<
        [Key: SS58String],
        [Anonymize<I9rurpvdrvevl0>, bigint],
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
        force_proxy_type: Anonymize<I5m6c79u5faiin>
        call: Anonymize<I9ih0jev11cnlt>
      }>

      /**
       *See [`Pallet::add_proxy`].
       */
      add_proxy: TxDescriptor<{
        delegate: MultiAddress
        proxy_type: Anonymize<Ie45ibn6h4uq45>
        delay: number
      }>

      /**
       *See [`Pallet::remove_proxy`].
       */
      remove_proxy: TxDescriptor<{
        delegate: MultiAddress
        proxy_type: Anonymize<Ie45ibn6h4uq45>
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
        proxy_type: Anonymize<Ie45ibn6h4uq45>
        delay: number
        index: number
      }>

      /**
       *See [`Pallet::kill_pure`].
       */
      kill_pure: TxDescriptor<{
        spawner: MultiAddress
        proxy_type: Anonymize<Ie45ibn6h4uq45>
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
        force_proxy_type: Anonymize<I5m6c79u5faiin>
        call: Anonymize<I9ih0jev11cnlt>
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
        proxy_type: Anonymize<Ie45ibn6h4uq45>
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
        proxy_type: Anonymize<Ie45ibn6h4uq45>
        delay: number
      }>

      /**
       *A proxy was removed.
       */
      ProxyRemoved: PlainDescriptor<{
        delegator: SS58String
        delegatee: SS58String
        proxy_type: Anonymize<Ie45ibn6h4uq45>
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
  Assets: [
    {
      /**
       * Details of an asset.
       */
      Asset: StorageDescriptor<
        [Key: number],
        {
          owner: SS58String
          issuer: SS58String
          admin: SS58String
          freezer: SS58String
          supply: bigint
          deposit: bigint
          min_balance: bigint
          is_sufficient: boolean
          accounts: number
          sufficients: number
          approvals: number
          status: Anonymize<Ichpfv056f8vda>
        },
        true
      >

      /**
       * The holdings of a specific account for a specific asset.
       */
      Account: StorageDescriptor<
        [number, SS58String],
        {
          balance: bigint
          status: Anonymize<I4toln8faf1bi6>
          reason: Anonymize<Idcivh1e680ag5>
          extra: undefined
        },
        true
      >

      /**
       * Approved balance transfers. First balance is the amount approved for transfer. Second
       * is the amount of `T::Currency` reserved for storing this.
       * First key is the asset ID, second key is the owner and third key is the delegate.
       */
      Approvals: StorageDescriptor<
        [number, SS58String, SS58String],
        { amount: bigint; deposit: bigint },
        true
      >

      /**
       * Metadata of an asset.
       */
      Metadata: StorageDescriptor<
        [Key: number],
        {
          deposit: bigint
          name: Binary
          symbol: Binary
          decimals: number
          is_frozen: boolean
        },
        false
      >
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        id: number
        admin: MultiAddress
        min_balance: bigint
      }>

      /**
       *See [`Pallet::force_create`].
       */
      force_create: TxDescriptor<{
        id: number
        owner: MultiAddress
        is_sufficient: boolean
        min_balance: bigint
      }>

      /**
       *See [`Pallet::start_destroy`].
       */
      start_destroy: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::destroy_accounts`].
       */
      destroy_accounts: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::destroy_approvals`].
       */
      destroy_approvals: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::finish_destroy`].
       */
      finish_destroy: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::mint`].
       */
      mint: TxDescriptor<{
        id: number
        beneficiary: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::burn`].
       */
      burn: TxDescriptor<{ id: number; who: MultiAddress; amount: bigint }>

      /**
       *See [`Pallet::transfer`].
       */
      transfer: TxDescriptor<{
        id: number
        target: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::transfer_keep_alive`].
       */
      transfer_keep_alive: TxDescriptor<{
        id: number
        target: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::force_transfer`].
       */
      force_transfer: TxDescriptor<{
        id: number
        source: MultiAddress
        dest: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::freeze`].
       */
      freeze: TxDescriptor<{ id: number; who: MultiAddress }>

      /**
       *See [`Pallet::thaw`].
       */
      thaw: TxDescriptor<{ id: number; who: MultiAddress }>

      /**
       *See [`Pallet::freeze_asset`].
       */
      freeze_asset: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::thaw_asset`].
       */
      thaw_asset: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::transfer_ownership`].
       */
      transfer_ownership: TxDescriptor<{ id: number; owner: MultiAddress }>

      /**
       *See [`Pallet::set_team`].
       */
      set_team: TxDescriptor<{
        id: number
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
      }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{
        id: number
        name: Binary
        symbol: Binary
        decimals: number
      }>

      /**
       *See [`Pallet::clear_metadata`].
       */
      clear_metadata: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::force_set_metadata`].
       */
      force_set_metadata: TxDescriptor<{
        id: number
        name: Binary
        symbol: Binary
        decimals: number
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::force_clear_metadata`].
       */
      force_clear_metadata: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::force_asset_status`].
       */
      force_asset_status: TxDescriptor<{
        id: number
        owner: MultiAddress
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
        min_balance: bigint
        is_sufficient: boolean
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::approve_transfer`].
       */
      approve_transfer: TxDescriptor<{
        id: number
        delegate: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::cancel_approval`].
       */
      cancel_approval: TxDescriptor<{ id: number; delegate: MultiAddress }>

      /**
       *See [`Pallet::force_cancel_approval`].
       */
      force_cancel_approval: TxDescriptor<{
        id: number
        owner: MultiAddress
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::transfer_approved`].
       */
      transfer_approved: TxDescriptor<{
        id: number
        owner: MultiAddress
        destination: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::touch`].
       */
      touch: TxDescriptor<{ id: number }>

      /**
       *See [`Pallet::refund`].
       */
      refund: TxDescriptor<{ id: number; allow_burn: boolean }>

      /**
       *See [`Pallet::set_min_balance`].
       */
      set_min_balance: TxDescriptor<{ id: number; min_balance: bigint }>

      /**
       *See [`Pallet::touch_other`].
       */
      touch_other: TxDescriptor<{ id: number; who: MultiAddress }>

      /**
       *See [`Pallet::refund_other`].
       */
      refund_other: TxDescriptor<{ id: number; who: MultiAddress }>

      /**
       *See [`Pallet::block`].
       */
      block: TxDescriptor<{ id: number; who: MultiAddress }>
    },
    {
      /**
       *Some asset class was created.
       */
      Created: PlainDescriptor<{
        asset_id: number
        creator: SS58String
        owner: SS58String
      }>

      /**
       *Some assets were issued.
       */
      Issued: PlainDescriptor<{
        asset_id: number
        owner: SS58String
        amount: bigint
      }>

      /**
       *Some assets were transferred.
       */
      Transferred: PlainDescriptor<{
        asset_id: number
        from: SS58String
        to: SS58String
        amount: bigint
      }>

      /**
       *Some assets were destroyed.
       */
      Burned: PlainDescriptor<{
        asset_id: number
        owner: SS58String
        balance: bigint
      }>

      /**
       *The management team changed.
       */
      TeamChanged: PlainDescriptor<{
        asset_id: number
        issuer: SS58String
        admin: SS58String
        freezer: SS58String
      }>

      /**
       *The owner changed.
       */
      OwnerChanged: PlainDescriptor<{ asset_id: number; owner: SS58String }>

      /**
       *Some account `who` was frozen.
       */
      Frozen: PlainDescriptor<{ asset_id: number; who: SS58String }>

      /**
       *Some account `who` was thawed.
       */
      Thawed: PlainDescriptor<{ asset_id: number; who: SS58String }>

      /**
       *Some asset `asset_id` was frozen.
       */
      AssetFrozen: PlainDescriptor<{ asset_id: number }>

      /**
       *Some asset `asset_id` was thawed.
       */
      AssetThawed: PlainDescriptor<{ asset_id: number }>

      /**
       *Accounts were destroyed for given asset.
       */
      AccountsDestroyed: PlainDescriptor<{
        asset_id: number
        accounts_destroyed: number
        accounts_remaining: number
      }>

      /**
       *Approvals were destroyed for given asset.
       */
      ApprovalsDestroyed: PlainDescriptor<{
        asset_id: number
        approvals_destroyed: number
        approvals_remaining: number
      }>

      /**
       *An asset class is in the process of being destroyed.
       */
      DestructionStarted: PlainDescriptor<{ asset_id: number }>

      /**
       *An asset class was destroyed.
       */
      Destroyed: PlainDescriptor<{ asset_id: number }>

      /**
       *Some asset class was force-created.
       */
      ForceCreated: PlainDescriptor<{ asset_id: number; owner: SS58String }>

      /**
       *New metadata has been set for an asset.
       */
      MetadataSet: PlainDescriptor<{
        asset_id: number
        name: Binary
        symbol: Binary
        decimals: number
        is_frozen: boolean
      }>

      /**
       *Metadata has been cleared for an asset.
       */
      MetadataCleared: PlainDescriptor<{ asset_id: number }>

      /**
       *(Additional) funds have been approved for transfer to a destination account.
       */
      ApprovedTransfer: PlainDescriptor<{
        asset_id: number
        source: SS58String
        delegate: SS58String
        amount: bigint
      }>

      /**
       *An approval for account `delegate` was cancelled by `owner`.
       */
      ApprovalCancelled: PlainDescriptor<{
        asset_id: number
        owner: SS58String
        delegate: SS58String
      }>

      /**
       *An `amount` was transferred in its entirety from `owner` to `destination` by
       *the approved `delegate`.
       */
      TransferredApproved: PlainDescriptor<{
        asset_id: number
        owner: SS58String
        delegate: SS58String
        destination: SS58String
        amount: bigint
      }>

      /**
       *An asset has had its attributes changed by the `Force` origin.
       */
      AssetStatusChanged: PlainDescriptor<{ asset_id: number }>

      /**
       *The min_balance of an asset has been updated by the asset owner.
       */
      AssetMinBalanceChanged: PlainDescriptor<{
        asset_id: number
        new_min_balance: bigint
      }>

      /**
       *Some account `who` was created with a deposit from `depositor`.
       */
      Touched: PlainDescriptor<{
        asset_id: number
        who: SS58String
        depositor: SS58String
      }>

      /**
       *Some account `who` was blocked.
       */
      Blocked: PlainDescriptor<{ asset_id: number; who: SS58String }>
    },
    {
      /**
       *Account balance must be greater than or equal to the transfer amount.
       */
      BalanceLow: PlainDescriptor<undefined>

      /**
       *The account to alter does not exist.
       */
      NoAccount: PlainDescriptor<undefined>

      /**
       *The signing account has no permission to do the operation.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The given asset ID is unknown.
       */
      Unknown: PlainDescriptor<undefined>

      /**
       *The origin account is frozen.
       */
      Frozen: PlainDescriptor<undefined>

      /**
       *The asset ID is already taken.
       */
      InUse: PlainDescriptor<undefined>

      /**
       *Invalid witness data given.
       */
      BadWitness: PlainDescriptor<undefined>

      /**
       *Minimum balance should be non-zero.
       */
      MinBalanceZero: PlainDescriptor<undefined>

      /**
       *Unable to increment the consumer reference counters on the account. Either no provider
       *reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
       *fewer then the maximum number of consumers has been reached.
       */
      UnavailableConsumer: PlainDescriptor<undefined>

      /**
       *Invalid metadata given.
       */
      BadMetadata: PlainDescriptor<undefined>

      /**
       *No approval exists that would allow the transfer.
       */
      Unapproved: PlainDescriptor<undefined>

      /**
       *The source account would not survive the transfer and it needs to stay alive.
       */
      WouldDie: PlainDescriptor<undefined>

      /**
       *The asset-account already exists.
       */
      AlreadyExists: PlainDescriptor<undefined>

      /**
       *The asset-account doesn't have an associated deposit.
       */
      NoDeposit: PlainDescriptor<undefined>

      /**
       *The operation would result in funds being burned.
       */
      WouldBurn: PlainDescriptor<undefined>

      /**
       *The asset is a live asset and is actively being used. Usually emit for operations such
       *as `start_destroy` which require the asset to be in a destroying state.
       */
      LiveAsset: PlainDescriptor<undefined>

      /**
       *The asset is not live, and likely being destroyed.
       */
      AssetNotLive: PlainDescriptor<undefined>

      /**
       *The asset status is not the expected status.
       */
      IncorrectStatus: PlainDescriptor<undefined>

      /**
       *The asset should be frozen before the given operation.
       */
      NotFrozen: PlainDescriptor<undefined>

      /**
       *Callback action resulted in error
       */
      CallbackFailed: PlainDescriptor<undefined>
    },
    {
      /**
       * Max number of items to destroy per `destroy_accounts` and `destroy_approvals` call.
       *
       * Must be configured to result in a weight that makes each call fit in a block.
       */
      RemoveItemsLimit: PlainDescriptor<number>

      /**
       * The basic amount of funds that must be reserved for an asset.
       */
      AssetDeposit: PlainDescriptor<bigint>

      /**
       * The amount of funds that must be reserved for a non-provider asset account to be
       * maintained.
       */
      AssetAccountDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding metadata to your asset.
       */
      MetadataDepositBase: PlainDescriptor<bigint>

      /**
       * The additional funds that must be reserved for the number of bytes you store in your
       * metadata.
       */
      MetadataDepositPerByte: PlainDescriptor<bigint>

      /**
       * The amount of funds that must be reserved when creating a new approval.
       */
      ApprovalDeposit: PlainDescriptor<bigint>

      /**
       * The maximum length of a name or symbol stored on-chain.
       */
      StringLimit: PlainDescriptor<number>
    },
  ]
  Uniques: [
    {
      /**
       * Details of a collection.
       */
      Class: StorageDescriptor<
        [Key: number],
        {
          owner: SS58String
          issuer: SS58String
          admin: SS58String
          freezer: SS58String
          total_deposit: bigint
          free_holding: boolean
          items: number
          item_metadatas: number
          attributes: number
          is_frozen: boolean
        },
        true
      >

      /**
       * The collection, if any, of which an account is willing to take ownership.
       */
      OwnershipAcceptance: StorageDescriptor<[Key: SS58String], number, true>

      /**
       * The items held by any given account; set out this way so that items owned by a single
       * account can be enumerated.
       */
      Account: StorageDescriptor<[SS58String, number, number], undefined, true>

      /**
       * The collections owned by any given account; set out this way so that collections owned by
       * a single account can be enumerated.
       */
      ClassAccount: StorageDescriptor<[SS58String, number], undefined, true>

      /**
       * The items in existence and their ownership details.
       */
      Asset: StorageDescriptor<
        [number, number],
        {
          owner: SS58String
          approved: Anonymize<Ihfphjolmsqq1>
          is_frozen: boolean
          deposit: bigint
        },
        true
      >

      /**
       * Metadata of a collection.
       */
      ClassMetadataOf: StorageDescriptor<
        [Key: number],
        { deposit: bigint; data: Binary; is_frozen: boolean },
        true
      >

      /**
       * Metadata of an item.
       */
      InstanceMetadataOf: StorageDescriptor<
        [number, number],
        { deposit: bigint; data: Binary; is_frozen: boolean },
        true
      >

      /**
       * Attributes of a collection.
       */
      Attribute: StorageDescriptor<
        [number, Anonymize<I4arjljr6dpflb>, Binary],
        [Binary, bigint],
        true
      >

      /**
       * Price of an asset instance.
       */
      ItemPriceOf: StorageDescriptor<
        [number, number],
        [bigint, Anonymize<Ihfphjolmsqq1>],
        true
      >

      /**
       * Keeps track of the number of items a collection might have.
       */
      CollectionMaxSupply: StorageDescriptor<[Key: number], number, true>
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{ collection: number; admin: MultiAddress }>

      /**
       *See [`Pallet::force_create`].
       */
      force_create: TxDescriptor<{
        collection: number
        owner: MultiAddress
        free_holding: boolean
      }>

      /**
       *See [`Pallet::destroy`].
       */
      destroy: TxDescriptor<{
        collection: number
        witness: Anonymize<I59th026dnaruk>
      }>

      /**
       *See [`Pallet::mint`].
       */
      mint: TxDescriptor<{
        collection: number
        item: number
        owner: MultiAddress
      }>

      /**
       *See [`Pallet::burn`].
       */
      burn: TxDescriptor<{
        collection: number
        item: number
        check_owner: Anonymize<Idcl76h8eqajgc>
      }>

      /**
       *See [`Pallet::transfer`].
       */
      transfer: TxDescriptor<{
        collection: number
        item: number
        dest: MultiAddress
      }>

      /**
       *See [`Pallet::redeposit`].
       */
      redeposit: TxDescriptor<{
        collection: number
        items: Anonymize<Icgljjb6j82uhn>
      }>

      /**
       *See [`Pallet::freeze`].
       */
      freeze: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::thaw`].
       */
      thaw: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::freeze_collection`].
       */
      freeze_collection: TxDescriptor<{ collection: number }>

      /**
       *See [`Pallet::thaw_collection`].
       */
      thaw_collection: TxDescriptor<{ collection: number }>

      /**
       *See [`Pallet::transfer_ownership`].
       */
      transfer_ownership: TxDescriptor<{
        collection: number
        owner: MultiAddress
      }>

      /**
       *See [`Pallet::set_team`].
       */
      set_team: TxDescriptor<{
        collection: number
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
      }>

      /**
       *See [`Pallet::approve_transfer`].
       */
      approve_transfer: TxDescriptor<{
        collection: number
        item: number
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::cancel_approval`].
       */
      cancel_approval: TxDescriptor<{
        collection: number
        item: number
        maybe_check_delegate: Anonymize<Idcl76h8eqajgc>
      }>

      /**
       *See [`Pallet::force_item_status`].
       */
      force_item_status: TxDescriptor<{
        collection: number
        owner: MultiAddress
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
        free_holding: boolean
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::set_attribute`].
       */
      set_attribute: TxDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        key: Binary
        value: Binary
      }>

      /**
       *See [`Pallet::clear_attribute`].
       */
      clear_attribute: TxDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        key: Binary
      }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{
        collection: number
        item: number
        data: Binary
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::clear_metadata`].
       */
      clear_metadata: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::set_collection_metadata`].
       */
      set_collection_metadata: TxDescriptor<{
        collection: number
        data: Binary
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::clear_collection_metadata`].
       */
      clear_collection_metadata: TxDescriptor<{ collection: number }>

      /**
       *See [`Pallet::set_accept_ownership`].
       */
      set_accept_ownership: TxDescriptor<{
        maybe_collection: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::set_collection_max_supply`].
       */
      set_collection_max_supply: TxDescriptor<{
        collection: number
        max_supply: number
      }>

      /**
       *See [`Pallet::set_price`].
       */
      set_price: TxDescriptor<{
        collection: number
        item: number
        price: Anonymize<I35p85j063s0il>
        whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
      }>

      /**
       *See [`Pallet::buy_item`].
       */
      buy_item: TxDescriptor<{
        collection: number
        item: number
        bid_price: bigint
      }>
    },
    {
      /**
       *A `collection` was created.
       */
      Created: PlainDescriptor<{
        collection: number
        creator: SS58String
        owner: SS58String
      }>

      /**
       *A `collection` was force-created.
       */
      ForceCreated: PlainDescriptor<{ collection: number; owner: SS58String }>

      /**
       *A `collection` was destroyed.
       */
      Destroyed: PlainDescriptor<{ collection: number }>

      /**
       *An `item` was issued.
       */
      Issued: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
      }>

      /**
       *An `item` was transferred.
       */
      Transferred: PlainDescriptor<{
        collection: number
        item: number
        from: SS58String
        to: SS58String
      }>

      /**
       *An `item` was destroyed.
       */
      Burned: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
      }>

      /**
       *Some `item` was frozen.
       */
      Frozen: PlainDescriptor<{ collection: number; item: number }>

      /**
       *Some `item` was thawed.
       */
      Thawed: PlainDescriptor<{ collection: number; item: number }>

      /**
       *Some `collection` was frozen.
       */
      CollectionFrozen: PlainDescriptor<{ collection: number }>

      /**
       *Some `collection` was thawed.
       */
      CollectionThawed: PlainDescriptor<{ collection: number }>

      /**
       *The owner changed.
       */
      OwnerChanged: PlainDescriptor<{
        collection: number
        new_owner: SS58String
      }>

      /**
       *The management team changed.
       */
      TeamChanged: PlainDescriptor<{
        collection: number
        issuer: SS58String
        admin: SS58String
        freezer: SS58String
      }>

      /**
       *An `item` of a `collection` has been approved by the `owner` for transfer by
       *a `delegate`.
       */
      ApprovedTransfer: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
        delegate: SS58String
      }>

      /**
       *An approval for a `delegate` account to transfer the `item` of an item
       *`collection` was cancelled by its `owner`.
       */
      ApprovalCancelled: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
        delegate: SS58String
      }>

      /**
       *A `collection` has had its attributes changed by the `Force` origin.
       */
      ItemStatusChanged: PlainDescriptor<{ collection: number }>

      /**
       *New metadata has been set for a `collection`.
       */
      CollectionMetadataSet: PlainDescriptor<{
        collection: number
        data: Binary
        is_frozen: boolean
      }>

      /**
       *Metadata has been cleared for a `collection`.
       */
      CollectionMetadataCleared: PlainDescriptor<{ collection: number }>

      /**
       *New metadata has been set for an item.
       */
      MetadataSet: PlainDescriptor<{
        collection: number
        item: number
        data: Binary
        is_frozen: boolean
      }>

      /**
       *Metadata has been cleared for an item.
       */
      MetadataCleared: PlainDescriptor<{ collection: number; item: number }>

      /**
       *Metadata has been cleared for an item.
       */
      Redeposited: PlainDescriptor<{
        collection: number
        successful_items: Anonymize<Icgljjb6j82uhn>
      }>

      /**
       *New attribute metadata has been set for a `collection` or `item`.
       */
      AttributeSet: PlainDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        key: Binary
        value: Binary
      }>

      /**
       *Attribute metadata has been cleared for a `collection` or `item`.
       */
      AttributeCleared: PlainDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        key: Binary
      }>

      /**
       *Ownership acceptance has changed for an account.
       */
      OwnershipAcceptanceChanged: PlainDescriptor<{
        who: SS58String
        maybe_collection: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *Max supply has been set for a collection.
       */
      CollectionMaxSupplySet: PlainDescriptor<{
        collection: number
        max_supply: number
      }>

      /**
       *The price was set for the instance.
       */
      ItemPriceSet: PlainDescriptor<{
        collection: number
        item: number
        price: bigint
        whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
      }>

      /**
       *The price for the instance was removed.
       */
      ItemPriceRemoved: PlainDescriptor<{ collection: number; item: number }>

      /**
       *An item was bought.
       */
      ItemBought: PlainDescriptor<{
        collection: number
        item: number
        price: bigint
        seller: SS58String
        buyer: SS58String
      }>
    },
    {
      /**
       *The signing account has no permission to do the operation.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The given item ID is unknown.
       */
      UnknownCollection: PlainDescriptor<undefined>

      /**
       *The item ID has already been used for an item.
       */
      AlreadyExists: PlainDescriptor<undefined>

      /**
       *The owner turned out to be different to what was expected.
       */
      WrongOwner: PlainDescriptor<undefined>

      /**
       *Invalid witness data given.
       */
      BadWitness: PlainDescriptor<undefined>

      /**
       *The item ID is already taken.
       */
      InUse: PlainDescriptor<undefined>

      /**
       *The item or collection is frozen.
       */
      Frozen: PlainDescriptor<undefined>

      /**
       *The delegate turned out to be different to what was expected.
       */
      WrongDelegate: PlainDescriptor<undefined>

      /**
       *There is no delegate approved.
       */
      NoDelegate: PlainDescriptor<undefined>

      /**
       *No approval exists that would allow the transfer.
       */
      Unapproved: PlainDescriptor<undefined>

      /**
       *The named owner has not signed ownership of the collection is acceptable.
       */
      Unaccepted: PlainDescriptor<undefined>

      /**
       *The item is locked.
       */
      Locked: PlainDescriptor<undefined>

      /**
       *All items have been minted.
       */
      MaxSupplyReached: PlainDescriptor<undefined>

      /**
       *The max supply has already been set.
       */
      MaxSupplyAlreadySet: PlainDescriptor<undefined>

      /**
       *The provided max supply is less to the amount of items a collection already has.
       */
      MaxSupplyTooSmall: PlainDescriptor<undefined>

      /**
       *The given item ID is unknown.
       */
      UnknownItem: PlainDescriptor<undefined>

      /**
       *Item is not for sale.
       */
      NotForSale: PlainDescriptor<undefined>

      /**
       *The provided bid is too low.
       */
      BidTooLow: PlainDescriptor<undefined>
    },
    {
      /**
       * The basic amount of funds that must be reserved for collection.
       */
      CollectionDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved for an item.
       */
      ItemDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding metadata to your item.
       */
      MetadataDepositBase: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding an attribute to an item.
       */
      AttributeDepositBase: PlainDescriptor<bigint>

      /**
       * The additional funds that must be reserved for the number of bytes store in metadata,
       * either "normal" metadata or attribute metadata.
       */
      DepositPerByte: PlainDescriptor<bigint>

      /**
       * The maximum length of data stored on-chain.
       */
      StringLimit: PlainDescriptor<number>

      /**
       * The maximum length of an attribute key.
       */
      KeyLimit: PlainDescriptor<number>

      /**
       * The maximum length of an attribute value.
       */
      ValueLimit: PlainDescriptor<number>
    },
  ]
  Nfts: [
    {
      /**
       * Details of a collection.
       */
      Collection: StorageDescriptor<
        [Key: number],
        {
          owner: SS58String
          owner_deposit: bigint
          items: number
          item_metadatas: number
          item_configs: number
          attributes: number
        },
        true
      >

      /**
       * The collection, if any, of which an account is willing to take ownership.
       */
      OwnershipAcceptance: StorageDescriptor<[Key: SS58String], number, true>

      /**
       * The items held by any given account; set out this way so that items owned by a single
       * account can be enumerated.
       */
      Account: StorageDescriptor<[SS58String, number, number], undefined, true>

      /**
       * The collections owned by any given account; set out this way so that collections owned by
       * a single account can be enumerated.
       */
      CollectionAccount: StorageDescriptor<
        [SS58String, number],
        undefined,
        true
      >

      /**
       * The items in existence and their ownership details.
       * Stores collection roles as per account.
       */
      CollectionRoleOf: StorageDescriptor<[number, SS58String], number, true>

      /**
       * The items in existence and their ownership details.
       */
      Item: StorageDescriptor<
        [number, number],
        {
          owner: SS58String
          approvals: Anonymize<I4m61c4hi7qpuv>
          deposit: Anonymize<Ic262ibdoec56a>
        },
        true
      >

      /**
       * Metadata of a collection.
       */
      CollectionMetadataOf: StorageDescriptor<
        [Key: number],
        { deposit: bigint; data: Binary },
        true
      >

      /**
       * Metadata of an item.
       */
      ItemMetadataOf: StorageDescriptor<
        [number, number],
        { deposit: Anonymize<I6e70ge7ubff75>; data: Binary },
        true
      >

      /**
       * Attributes of a collection.
       */
      Attribute: StorageDescriptor<
        [number, Anonymize<I4arjljr6dpflb>, Anonymize<I966fu47vp6aqm>, Binary],
        [Binary, Anonymize<I6e70ge7ubff75>],
        true
      >

      /**
       * A price of an item.
       */
      ItemPriceOf: StorageDescriptor<
        [number, number],
        [bigint, Anonymize<Ihfphjolmsqq1>],
        true
      >

      /**
       * Item attribute approvals.
       */
      ItemAttributesApprovalsOf: StorageDescriptor<
        [number, number],
        Array<SS58String>,
        false
      >

      /**
       * Stores the `CollectionId` that is going to be used for the next collection.
       * This gets incremented whenever a new collection is created.
       */
      NextCollectionId: StorageDescriptor<[], number, true>

      /**
       * Handles all the pending swaps.
       */
      PendingSwapOf: StorageDescriptor<
        [number, number],
        {
          desired_collection: number
          desired_item: Anonymize<I4arjljr6dpflb>
          price: Anonymize<Iemn9sl4bs903b>
          deadline: number
        },
        true
      >

      /**
       * Config of a collection.
       */
      CollectionConfigOf: StorageDescriptor<
        [Key: number],
        {
          settings: bigint
          max_supply: Anonymize<I4arjljr6dpflb>
          mint_settings: Anonymize<I3lel2b740s3fh>
        },
        true
      >

      /**
       * Config of an item.
       */
      ItemConfigOf: StorageDescriptor<[number, number], bigint, true>
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        admin: MultiAddress
        config: Anonymize<If362jnk79orio>
      }>

      /**
       *See [`Pallet::force_create`].
       */
      force_create: TxDescriptor<{
        owner: MultiAddress
        config: Anonymize<If362jnk79orio>
      }>

      /**
       *See [`Pallet::destroy`].
       */
      destroy: TxDescriptor<{
        collection: number
        witness: Anonymize<Idqhe2sslgfeu8>
      }>

      /**
       *See [`Pallet::mint`].
       */
      mint: TxDescriptor<{
        collection: number
        item: number
        mint_to: MultiAddress
        witness_data: Anonymize<Ib0113vv89gbic>
      }>

      /**
       *See [`Pallet::force_mint`].
       */
      force_mint: TxDescriptor<{
        collection: number
        item: number
        mint_to: MultiAddress
        item_config: bigint
      }>

      /**
       *See [`Pallet::burn`].
       */
      burn: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::transfer`].
       */
      transfer: TxDescriptor<{
        collection: number
        item: number
        dest: MultiAddress
      }>

      /**
       *See [`Pallet::redeposit`].
       */
      redeposit: TxDescriptor<{
        collection: number
        items: Anonymize<Icgljjb6j82uhn>
      }>

      /**
       *See [`Pallet::lock_item_transfer`].
       */
      lock_item_transfer: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::unlock_item_transfer`].
       */
      unlock_item_transfer: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::lock_collection`].
       */
      lock_collection: TxDescriptor<{
        collection: number
        lock_settings: bigint
      }>

      /**
       *See [`Pallet::transfer_ownership`].
       */
      transfer_ownership: TxDescriptor<{
        collection: number
        owner: MultiAddress
      }>

      /**
       *See [`Pallet::set_team`].
       */
      set_team: TxDescriptor<{
        collection: number
        issuer: Anonymize<Idcl76h8eqajgc>
        admin: Anonymize<Idcl76h8eqajgc>
        freezer: Anonymize<Idcl76h8eqajgc>
      }>

      /**
       *See [`Pallet::force_collection_owner`].
       */
      force_collection_owner: TxDescriptor<{
        collection: number
        owner: MultiAddress
      }>

      /**
       *See [`Pallet::force_collection_config`].
       */
      force_collection_config: TxDescriptor<{
        collection: number
        config: Anonymize<If362jnk79orio>
      }>

      /**
       *See [`Pallet::approve_transfer`].
       */
      approve_transfer: TxDescriptor<{
        collection: number
        item: number
        delegate: MultiAddress
        maybe_deadline: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::cancel_approval`].
       */
      cancel_approval: TxDescriptor<{
        collection: number
        item: number
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::clear_all_transfer_approvals`].
       */
      clear_all_transfer_approvals: TxDescriptor<{
        collection: number
        item: number
      }>

      /**
       *See [`Pallet::lock_item_properties`].
       */
      lock_item_properties: TxDescriptor<{
        collection: number
        item: number
        lock_metadata: boolean
        lock_attributes: boolean
      }>

      /**
       *See [`Pallet::set_attribute`].
       */
      set_attribute: TxDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        namespace: Anonymize<I966fu47vp6aqm>
        key: Binary
        value: Binary
      }>

      /**
       *See [`Pallet::force_set_attribute`].
       */
      force_set_attribute: TxDescriptor<{
        set_as: Anonymize<Ihfphjolmsqq1>
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        namespace: Anonymize<I966fu47vp6aqm>
        key: Binary
        value: Binary
      }>

      /**
       *See [`Pallet::clear_attribute`].
       */
      clear_attribute: TxDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        namespace: Anonymize<I966fu47vp6aqm>
        key: Binary
      }>

      /**
       *See [`Pallet::approve_item_attributes`].
       */
      approve_item_attributes: TxDescriptor<{
        collection: number
        item: number
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::cancel_item_attributes_approval`].
       */
      cancel_item_attributes_approval: TxDescriptor<{
        collection: number
        item: number
        delegate: MultiAddress
        witness: number
      }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{
        collection: number
        item: number
        data: Binary
      }>

      /**
       *See [`Pallet::clear_metadata`].
       */
      clear_metadata: TxDescriptor<{ collection: number; item: number }>

      /**
       *See [`Pallet::set_collection_metadata`].
       */
      set_collection_metadata: TxDescriptor<{
        collection: number
        data: Binary
      }>

      /**
       *See [`Pallet::clear_collection_metadata`].
       */
      clear_collection_metadata: TxDescriptor<{ collection: number }>

      /**
       *See [`Pallet::set_accept_ownership`].
       */
      set_accept_ownership: TxDescriptor<{
        maybe_collection: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *See [`Pallet::set_collection_max_supply`].
       */
      set_collection_max_supply: TxDescriptor<{
        collection: number
        max_supply: number
      }>

      /**
       *See [`Pallet::update_mint_settings`].
       */
      update_mint_settings: TxDescriptor<{
        collection: number
        mint_settings: Anonymize<I3lel2b740s3fh>
      }>

      /**
       *See [`Pallet::set_price`].
       */
      set_price: TxDescriptor<{
        collection: number
        item: number
        price: Anonymize<I35p85j063s0il>
        whitelisted_buyer: Anonymize<Idcl76h8eqajgc>
      }>

      /**
       *See [`Pallet::buy_item`].
       */
      buy_item: TxDescriptor<{
        collection: number
        item: number
        bid_price: bigint
      }>

      /**
       *See [`Pallet::pay_tips`].
       */
      pay_tips: TxDescriptor<{ tips: Anonymize<I73vqjhh9uvase> }>

      /**
       *See [`Pallet::create_swap`].
       */
      create_swap: TxDescriptor<{
        offered_collection: number
        offered_item: number
        desired_collection: number
        maybe_desired_item: Anonymize<I4arjljr6dpflb>
        maybe_price: Anonymize<Iemn9sl4bs903b>
        duration: number
      }>

      /**
       *See [`Pallet::cancel_swap`].
       */
      cancel_swap: TxDescriptor<{
        offered_collection: number
        offered_item: number
      }>

      /**
       *See [`Pallet::claim_swap`].
       */
      claim_swap: TxDescriptor<{
        send_collection: number
        send_item: number
        receive_collection: number
        receive_item: number
        witness_price: Anonymize<Iemn9sl4bs903b>
      }>

      /**
       *See [`Pallet::mint_pre_signed`].
       */
      mint_pre_signed: TxDescriptor<{
        mint_data: Anonymize<I4o46ti9h9g8u9>
        signature: MultiSignature
        signer: SS58String
      }>

      /**
       *See [`Pallet::set_attributes_pre_signed`].
       */
      set_attributes_pre_signed: TxDescriptor<{
        data: Anonymize<Iaaqgpqooangl>
        signature: MultiSignature
        signer: SS58String
      }>
    },
    {
      /**
       *A `collection` was created.
       */
      Created: PlainDescriptor<{
        collection: number
        creator: SS58String
        owner: SS58String
      }>

      /**
       *A `collection` was force-created.
       */
      ForceCreated: PlainDescriptor<{ collection: number; owner: SS58String }>

      /**
       *A `collection` was destroyed.
       */
      Destroyed: PlainDescriptor<{ collection: number }>

      /**
       *An `item` was issued.
       */
      Issued: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
      }>

      /**
       *An `item` was transferred.
       */
      Transferred: PlainDescriptor<{
        collection: number
        item: number
        from: SS58String
        to: SS58String
      }>

      /**
       *An `item` was destroyed.
       */
      Burned: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
      }>

      /**
       *An `item` became non-transferable.
       */
      ItemTransferLocked: PlainDescriptor<{ collection: number; item: number }>

      /**
       *An `item` became transferable.
       */
      ItemTransferUnlocked: PlainDescriptor<{
        collection: number
        item: number
      }>

      /**
       *`item` metadata or attributes were locked.
       */
      ItemPropertiesLocked: PlainDescriptor<{
        collection: number
        item: number
        lock_metadata: boolean
        lock_attributes: boolean
      }>

      /**
       *Some `collection` was locked.
       */
      CollectionLocked: PlainDescriptor<{ collection: number }>

      /**
       *The owner changed.
       */
      OwnerChanged: PlainDescriptor<{
        collection: number
        new_owner: SS58String
      }>

      /**
       *The management team changed.
       */
      TeamChanged: PlainDescriptor<{
        collection: number
        issuer: Anonymize<Ihfphjolmsqq1>
        admin: Anonymize<Ihfphjolmsqq1>
        freezer: Anonymize<Ihfphjolmsqq1>
      }>

      /**
       *An `item` of a `collection` has been approved by the `owner` for transfer by
       *a `delegate`.
       */
      TransferApproved: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
        delegate: SS58String
        deadline: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *An approval for a `delegate` account to transfer the `item` of an item
       *`collection` was cancelled by its `owner`.
       */
      ApprovalCancelled: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
        delegate: SS58String
      }>

      /**
       *All approvals of an item got cancelled.
       */
      AllApprovalsCancelled: PlainDescriptor<{
        collection: number
        item: number
        owner: SS58String
      }>

      /**
       *A `collection` has had its config changed by the `Force` origin.
       */
      CollectionConfigChanged: PlainDescriptor<{ collection: number }>

      /**
       *New metadata has been set for a `collection`.
       */
      CollectionMetadataSet: PlainDescriptor<{
        collection: number
        data: Binary
      }>

      /**
       *Metadata has been cleared for a `collection`.
       */
      CollectionMetadataCleared: PlainDescriptor<{ collection: number }>

      /**
       *New metadata has been set for an item.
       */
      ItemMetadataSet: PlainDescriptor<{
        collection: number
        item: number
        data: Binary
      }>

      /**
       *Metadata has been cleared for an item.
       */
      ItemMetadataCleared: PlainDescriptor<{ collection: number; item: number }>

      /**
       *The deposit for a set of `item`s within a `collection` has been updated.
       */
      Redeposited: PlainDescriptor<{
        collection: number
        successful_items: Anonymize<Icgljjb6j82uhn>
      }>

      /**
       *New attribute metadata has been set for a `collection` or `item`.
       */
      AttributeSet: PlainDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        namespace: Anonymize<I966fu47vp6aqm>
        key: Binary
        value: Binary
      }>

      /**
       *Attribute metadata has been cleared for a `collection` or `item`.
       */
      AttributeCleared: PlainDescriptor<{
        collection: number
        maybe_item: Anonymize<I4arjljr6dpflb>
        namespace: Anonymize<I966fu47vp6aqm>
        key: Binary
      }>

      /**
       *A new approval to modify item attributes was added.
       */
      ItemAttributesApprovalAdded: PlainDescriptor<{
        collection: number
        item: number
        delegate: SS58String
      }>

      /**
       *A new approval to modify item attributes was removed.
       */
      ItemAttributesApprovalRemoved: PlainDescriptor<{
        collection: number
        item: number
        delegate: SS58String
      }>

      /**
       *Ownership acceptance has changed for an account.
       */
      OwnershipAcceptanceChanged: PlainDescriptor<{
        who: SS58String
        maybe_collection: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *Max supply has been set for a collection.
       */
      CollectionMaxSupplySet: PlainDescriptor<{
        collection: number
        max_supply: number
      }>

      /**
       *Mint settings for a collection had changed.
       */
      CollectionMintSettingsUpdated: PlainDescriptor<{ collection: number }>

      /**
       *Event gets emitted when the `NextCollectionId` gets incremented.
       */
      NextCollectionIdIncremented: PlainDescriptor<{
        next_id: Anonymize<I4arjljr6dpflb>
      }>

      /**
       *The price was set for the item.
       */
      ItemPriceSet: PlainDescriptor<{
        collection: number
        item: number
        price: bigint
        whitelisted_buyer: Anonymize<Ihfphjolmsqq1>
      }>

      /**
       *The price for the item was removed.
       */
      ItemPriceRemoved: PlainDescriptor<{ collection: number; item: number }>

      /**
       *An item was bought.
       */
      ItemBought: PlainDescriptor<{
        collection: number
        item: number
        price: bigint
        seller: SS58String
        buyer: SS58String
      }>

      /**
       *A tip was sent.
       */
      TipSent: PlainDescriptor<{
        collection: number
        item: number
        sender: SS58String
        receiver: SS58String
        amount: bigint
      }>

      /**
       *An `item` swap intent was created.
       */
      SwapCreated: PlainDescriptor<{
        offered_collection: number
        offered_item: number
        desired_collection: number
        desired_item: Anonymize<I4arjljr6dpflb>
        price: Anonymize<Iemn9sl4bs903b>
        deadline: number
      }>

      /**
       *The swap was cancelled.
       */
      SwapCancelled: PlainDescriptor<{
        offered_collection: number
        offered_item: number
        desired_collection: number
        desired_item: Anonymize<I4arjljr6dpflb>
        price: Anonymize<Iemn9sl4bs903b>
        deadline: number
      }>

      /**
       *The swap has been claimed.
       */
      SwapClaimed: PlainDescriptor<{
        sent_collection: number
        sent_item: number
        sent_item_owner: SS58String
        received_collection: number
        received_item: number
        received_item_owner: SS58String
        price: Anonymize<Iemn9sl4bs903b>
        deadline: number
      }>

      /**
       *New attributes have been set for an `item` of the `collection`.
       */
      PreSignedAttributesSet: PlainDescriptor<{
        collection: number
        item: number
        namespace: Anonymize<I966fu47vp6aqm>
      }>

      /**
       *A new attribute in the `Pallet` namespace was set for the `collection` or an `item`
       *within that `collection`.
       */
      PalletAttributeSet: PlainDescriptor<{
        collection: number
        item: Anonymize<I4arjljr6dpflb>
        attribute: Anonymize<I5ngqtbe5pl60l>
        value: Binary
      }>
    },
    {
      /**
       *The signing account has no permission to do the operation.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The given item ID is unknown.
       */
      UnknownCollection: PlainDescriptor<undefined>

      /**
       *The item ID has already been used for an item.
       */
      AlreadyExists: PlainDescriptor<undefined>

      /**
       *The approval had a deadline that expired, so the approval isn't valid anymore.
       */
      ApprovalExpired: PlainDescriptor<undefined>

      /**
       *The owner turned out to be different to what was expected.
       */
      WrongOwner: PlainDescriptor<undefined>

      /**
       *The witness data given does not match the current state of the chain.
       */
      BadWitness: PlainDescriptor<undefined>

      /**
       *Collection ID is already taken.
       */
      CollectionIdInUse: PlainDescriptor<undefined>

      /**
       *Items within that collection are non-transferable.
       */
      ItemsNonTransferable: PlainDescriptor<undefined>

      /**
       *The provided account is not a delegate.
       */
      NotDelegate: PlainDescriptor<undefined>

      /**
       *The delegate turned out to be different to what was expected.
       */
      WrongDelegate: PlainDescriptor<undefined>

      /**
       *No approval exists that would allow the transfer.
       */
      Unapproved: PlainDescriptor<undefined>

      /**
       *The named owner has not signed ownership acceptance of the collection.
       */
      Unaccepted: PlainDescriptor<undefined>

      /**
       *The item is locked (non-transferable).
       */
      ItemLocked: PlainDescriptor<undefined>

      /**
       *Item's attributes are locked.
       */
      LockedItemAttributes: PlainDescriptor<undefined>

      /**
       *Collection's attributes are locked.
       */
      LockedCollectionAttributes: PlainDescriptor<undefined>

      /**
       *Item's metadata is locked.
       */
      LockedItemMetadata: PlainDescriptor<undefined>

      /**
       *Collection's metadata is locked.
       */
      LockedCollectionMetadata: PlainDescriptor<undefined>

      /**
       *All items have been minted.
       */
      MaxSupplyReached: PlainDescriptor<undefined>

      /**
       *The max supply is locked and can't be changed.
       */
      MaxSupplyLocked: PlainDescriptor<undefined>

      /**
       *The provided max supply is less than the number of items a collection already has.
       */
      MaxSupplyTooSmall: PlainDescriptor<undefined>

      /**
       *The given item ID is unknown.
       */
      UnknownItem: PlainDescriptor<undefined>

      /**
       *Swap doesn't exist.
       */
      UnknownSwap: PlainDescriptor<undefined>

      /**
       *The given item has no metadata set.
       */
      MetadataNotFound: PlainDescriptor<undefined>

      /**
       *The provided attribute can't be found.
       */
      AttributeNotFound: PlainDescriptor<undefined>

      /**
       *Item is not for sale.
       */
      NotForSale: PlainDescriptor<undefined>

      /**
       *The provided bid is too low.
       */
      BidTooLow: PlainDescriptor<undefined>

      /**
       *The item has reached its approval limit.
       */
      ReachedApprovalLimit: PlainDescriptor<undefined>

      /**
       *The deadline has already expired.
       */
      DeadlineExpired: PlainDescriptor<undefined>

      /**
       *The duration provided should be less than or equal to `MaxDeadlineDuration`.
       */
      WrongDuration: PlainDescriptor<undefined>

      /**
       *The method is disabled by system settings.
       */
      MethodDisabled: PlainDescriptor<undefined>

      /**
       *The provided setting can't be set.
       */
      WrongSetting: PlainDescriptor<undefined>

      /**
       *Item's config already exists and should be equal to the provided one.
       */
      InconsistentItemConfig: PlainDescriptor<undefined>

      /**
       *Config for a collection or an item can't be found.
       */
      NoConfig: PlainDescriptor<undefined>

      /**
       *Some roles were not cleared.
       */
      RolesNotCleared: PlainDescriptor<undefined>

      /**
       *Mint has not started yet.
       */
      MintNotStarted: PlainDescriptor<undefined>

      /**
       *Mint has already ended.
       */
      MintEnded: PlainDescriptor<undefined>

      /**
       *The provided Item was already used for claiming.
       */
      AlreadyClaimed: PlainDescriptor<undefined>

      /**
       *The provided data is incorrect.
       */
      IncorrectData: PlainDescriptor<undefined>

      /**
       *The extrinsic was sent by the wrong origin.
       */
      WrongOrigin: PlainDescriptor<undefined>

      /**
       *The provided signature is incorrect.
       */
      WrongSignature: PlainDescriptor<undefined>

      /**
       *The provided metadata might be too long.
       */
      IncorrectMetadata: PlainDescriptor<undefined>

      /**
       *Can't set more attributes per one call.
       */
      MaxAttributesLimitReached: PlainDescriptor<undefined>

      /**
       *The provided namespace isn't supported in this call.
       */
      WrongNamespace: PlainDescriptor<undefined>

      /**
       *Can't delete non-empty collections.
       */
      CollectionNotEmpty: PlainDescriptor<undefined>

      /**
       *The witness data should be provided.
       */
      WitnessRequired: PlainDescriptor<undefined>
    },
    {
      /**
       * The basic amount of funds that must be reserved for collection.
       */
      CollectionDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved for an item.
       */
      ItemDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding metadata to your item.
       */
      MetadataDepositBase: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding an attribute to an item.
       */
      AttributeDepositBase: PlainDescriptor<bigint>

      /**
       * The additional funds that must be reserved for the number of bytes store in metadata,
       * either "normal" metadata or attribute metadata.
       */
      DepositPerByte: PlainDescriptor<bigint>

      /**
       * The maximum length of data stored on-chain.
       */
      StringLimit: PlainDescriptor<number>

      /**
       * The maximum length of an attribute key.
       */
      KeyLimit: PlainDescriptor<number>

      /**
       * The maximum length of an attribute value.
       */
      ValueLimit: PlainDescriptor<number>

      /**
       * The maximum approvals an item could have.
       */
      ApprovalsLimit: PlainDescriptor<number>

      /**
       * The maximum attributes approvals an item could have.
       */
      ItemAttributesApprovalsLimit: PlainDescriptor<number>

      /**
       * The max number of tips a user could send.
       */
      MaxTips: PlainDescriptor<number>

      /**
       * The max duration in blocks for deadlines.
       */
      MaxDeadlineDuration: PlainDescriptor<number>

      /**
       * The max number of attributes a user could set per call.
       */
      MaxAttributesPerCall: PlainDescriptor<number>

      /**
       * Disables some of pallet's features.
       */
      Features: PlainDescriptor<bigint>
    },
  ]
  ForeignAssets: [
    {
      /**
       * Details of an asset.
       */
      Asset: StorageDescriptor<
        [Key: { parents: number; interior: XcmV3Junctions }],
        {
          owner: SS58String
          issuer: SS58String
          admin: SS58String
          freezer: SS58String
          supply: bigint
          deposit: bigint
          min_balance: bigint
          is_sufficient: boolean
          accounts: number
          sufficients: number
          approvals: number
          status: Anonymize<Ichpfv056f8vda>
        },
        true
      >

      /**
       * The holdings of a specific account for a specific asset.
       */
      Account: StorageDescriptor<
        [Anonymize<I43cmiele6sevi>, SS58String],
        {
          balance: bigint
          status: Anonymize<I4toln8faf1bi6>
          reason: Anonymize<Idcivh1e680ag5>
          extra: undefined
        },
        true
      >

      /**
       * Approved balance transfers. First balance is the amount approved for transfer. Second
       * is the amount of `T::Currency` reserved for storing this.
       * First key is the asset ID, second key is the owner and third key is the delegate.
       */
      Approvals: StorageDescriptor<
        [Anonymize<I43cmiele6sevi>, SS58String, SS58String],
        { amount: bigint; deposit: bigint },
        true
      >

      /**
       * Metadata of an asset.
       */
      Metadata: StorageDescriptor<
        [Key: { parents: number; interior: XcmV3Junctions }],
        {
          deposit: bigint
          name: Binary
          symbol: Binary
          decimals: number
          is_frozen: boolean
        },
        false
      >
    },
    {
      /**
       *See [`Pallet::create`].
       */
      create: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        admin: MultiAddress
        min_balance: bigint
      }>

      /**
       *See [`Pallet::force_create`].
       */
      force_create: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        owner: MultiAddress
        is_sufficient: boolean
        min_balance: bigint
      }>

      /**
       *See [`Pallet::start_destroy`].
       */
      start_destroy: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::destroy_accounts`].
       */
      destroy_accounts: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::destroy_approvals`].
       */
      destroy_approvals: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::finish_destroy`].
       */
      finish_destroy: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::mint`].
       */
      mint: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        beneficiary: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::burn`].
       */
      burn: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        who: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::transfer`].
       */
      transfer: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        target: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::transfer_keep_alive`].
       */
      transfer_keep_alive: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        target: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::force_transfer`].
       */
      force_transfer: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        source: MultiAddress
        dest: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::freeze`].
       */
      freeze: TxDescriptor<{ id: Anonymize<I43cmiele6sevi>; who: MultiAddress }>

      /**
       *See [`Pallet::thaw`].
       */
      thaw: TxDescriptor<{ id: Anonymize<I43cmiele6sevi>; who: MultiAddress }>

      /**
       *See [`Pallet::freeze_asset`].
       */
      freeze_asset: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::thaw_asset`].
       */
      thaw_asset: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::transfer_ownership`].
       */
      transfer_ownership: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        owner: MultiAddress
      }>

      /**
       *See [`Pallet::set_team`].
       */
      set_team: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
      }>

      /**
       *See [`Pallet::set_metadata`].
       */
      set_metadata: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        name: Binary
        symbol: Binary
        decimals: number
      }>

      /**
       *See [`Pallet::clear_metadata`].
       */
      clear_metadata: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::force_set_metadata`].
       */
      force_set_metadata: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        name: Binary
        symbol: Binary
        decimals: number
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::force_clear_metadata`].
       */
      force_clear_metadata: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::force_asset_status`].
       */
      force_asset_status: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        owner: MultiAddress
        issuer: MultiAddress
        admin: MultiAddress
        freezer: MultiAddress
        min_balance: bigint
        is_sufficient: boolean
        is_frozen: boolean
      }>

      /**
       *See [`Pallet::approve_transfer`].
       */
      approve_transfer: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        delegate: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::cancel_approval`].
       */
      cancel_approval: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::force_cancel_approval`].
       */
      force_cancel_approval: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        owner: MultiAddress
        delegate: MultiAddress
      }>

      /**
       *See [`Pallet::transfer_approved`].
       */
      transfer_approved: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        owner: MultiAddress
        destination: MultiAddress
        amount: bigint
      }>

      /**
       *See [`Pallet::touch`].
       */
      touch: TxDescriptor<{ id: Anonymize<I43cmiele6sevi> }>

      /**
       *See [`Pallet::refund`].
       */
      refund: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        allow_burn: boolean
      }>

      /**
       *See [`Pallet::set_min_balance`].
       */
      set_min_balance: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        min_balance: bigint
      }>

      /**
       *See [`Pallet::touch_other`].
       */
      touch_other: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        who: MultiAddress
      }>

      /**
       *See [`Pallet::refund_other`].
       */
      refund_other: TxDescriptor<{
        id: Anonymize<I43cmiele6sevi>
        who: MultiAddress
      }>

      /**
       *See [`Pallet::block`].
       */
      block: TxDescriptor<{ id: Anonymize<I43cmiele6sevi>; who: MultiAddress }>
    },
    {
      /**
       *Some asset class was created.
       */
      Created: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        creator: SS58String
        owner: SS58String
      }>

      /**
       *Some assets were issued.
       */
      Issued: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
        amount: bigint
      }>

      /**
       *Some assets were transferred.
       */
      Transferred: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        from: SS58String
        to: SS58String
        amount: bigint
      }>

      /**
       *Some assets were destroyed.
       */
      Burned: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
        balance: bigint
      }>

      /**
       *The management team changed.
       */
      TeamChanged: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        issuer: SS58String
        admin: SS58String
        freezer: SS58String
      }>

      /**
       *The owner changed.
       */
      OwnerChanged: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
      }>

      /**
       *Some account `who` was frozen.
       */
      Frozen: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        who: SS58String
      }>

      /**
       *Some account `who` was thawed.
       */
      Thawed: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        who: SS58String
      }>

      /**
       *Some asset `asset_id` was frozen.
       */
      AssetFrozen: PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>

      /**
       *Some asset `asset_id` was thawed.
       */
      AssetThawed: PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>

      /**
       *Accounts were destroyed for given asset.
       */
      AccountsDestroyed: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        accounts_destroyed: number
        accounts_remaining: number
      }>

      /**
       *Approvals were destroyed for given asset.
       */
      ApprovalsDestroyed: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        approvals_destroyed: number
        approvals_remaining: number
      }>

      /**
       *An asset class is in the process of being destroyed.
       */
      DestructionStarted: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
      }>

      /**
       *An asset class was destroyed.
       */
      Destroyed: PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>

      /**
       *Some asset class was force-created.
       */
      ForceCreated: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
      }>

      /**
       *New metadata has been set for an asset.
       */
      MetadataSet: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        name: Binary
        symbol: Binary
        decimals: number
        is_frozen: boolean
      }>

      /**
       *Metadata has been cleared for an asset.
       */
      MetadataCleared: PlainDescriptor<{ asset_id: Anonymize<I43cmiele6sevi> }>

      /**
       *(Additional) funds have been approved for transfer to a destination account.
       */
      ApprovedTransfer: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        source: SS58String
        delegate: SS58String
        amount: bigint
      }>

      /**
       *An approval for account `delegate` was cancelled by `owner`.
       */
      ApprovalCancelled: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
        delegate: SS58String
      }>

      /**
       *An `amount` was transferred in its entirety from `owner` to `destination` by
       *the approved `delegate`.
       */
      TransferredApproved: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        owner: SS58String
        delegate: SS58String
        destination: SS58String
        amount: bigint
      }>

      /**
       *An asset has had its attributes changed by the `Force` origin.
       */
      AssetStatusChanged: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
      }>

      /**
       *The min_balance of an asset has been updated by the asset owner.
       */
      AssetMinBalanceChanged: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        new_min_balance: bigint
      }>

      /**
       *Some account `who` was created with a deposit from `depositor`.
       */
      Touched: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        who: SS58String
        depositor: SS58String
      }>

      /**
       *Some account `who` was blocked.
       */
      Blocked: PlainDescriptor<{
        asset_id: Anonymize<I43cmiele6sevi>
        who: SS58String
      }>
    },
    {
      /**
       *Account balance must be greater than or equal to the transfer amount.
       */
      BalanceLow: PlainDescriptor<undefined>

      /**
       *The account to alter does not exist.
       */
      NoAccount: PlainDescriptor<undefined>

      /**
       *The signing account has no permission to do the operation.
       */
      NoPermission: PlainDescriptor<undefined>

      /**
       *The given asset ID is unknown.
       */
      Unknown: PlainDescriptor<undefined>

      /**
       *The origin account is frozen.
       */
      Frozen: PlainDescriptor<undefined>

      /**
       *The asset ID is already taken.
       */
      InUse: PlainDescriptor<undefined>

      /**
       *Invalid witness data given.
       */
      BadWitness: PlainDescriptor<undefined>

      /**
       *Minimum balance should be non-zero.
       */
      MinBalanceZero: PlainDescriptor<undefined>

      /**
       *Unable to increment the consumer reference counters on the account. Either no provider
       *reference exists to allow a non-zero balance of a non-self-sufficient asset, or one
       *fewer then the maximum number of consumers has been reached.
       */
      UnavailableConsumer: PlainDescriptor<undefined>

      /**
       *Invalid metadata given.
       */
      BadMetadata: PlainDescriptor<undefined>

      /**
       *No approval exists that would allow the transfer.
       */
      Unapproved: PlainDescriptor<undefined>

      /**
       *The source account would not survive the transfer and it needs to stay alive.
       */
      WouldDie: PlainDescriptor<undefined>

      /**
       *The asset-account already exists.
       */
      AlreadyExists: PlainDescriptor<undefined>

      /**
       *The asset-account doesn't have an associated deposit.
       */
      NoDeposit: PlainDescriptor<undefined>

      /**
       *The operation would result in funds being burned.
       */
      WouldBurn: PlainDescriptor<undefined>

      /**
       *The asset is a live asset and is actively being used. Usually emit for operations such
       *as `start_destroy` which require the asset to be in a destroying state.
       */
      LiveAsset: PlainDescriptor<undefined>

      /**
       *The asset is not live, and likely being destroyed.
       */
      AssetNotLive: PlainDescriptor<undefined>

      /**
       *The asset status is not the expected status.
       */
      IncorrectStatus: PlainDescriptor<undefined>

      /**
       *The asset should be frozen before the given operation.
       */
      NotFrozen: PlainDescriptor<undefined>

      /**
       *Callback action resulted in error
       */
      CallbackFailed: PlainDescriptor<undefined>
    },
    {
      /**
       * Max number of items to destroy per `destroy_accounts` and `destroy_approvals` call.
       *
       * Must be configured to result in a weight that makes each call fit in a block.
       */
      RemoveItemsLimit: PlainDescriptor<number>

      /**
       * The basic amount of funds that must be reserved for an asset.
       */
      AssetDeposit: PlainDescriptor<bigint>

      /**
       * The amount of funds that must be reserved for a non-provider asset account to be
       * maintained.
       */
      AssetAccountDeposit: PlainDescriptor<bigint>

      /**
       * The basic amount of funds that must be reserved when adding metadata to your asset.
       */
      MetadataDepositBase: PlainDescriptor<bigint>

      /**
       * The additional funds that must be reserved for the number of bytes you store in your
       * metadata.
       */
      MetadataDepositPerByte: PlainDescriptor<bigint>

      /**
       * The amount of funds that must be reserved when creating a new approval.
       */
      ApprovalDeposit: PlainDescriptor<bigint>

      /**
       * The maximum length of a name or symbol stored on-chain.
       */
      StringLimit: PlainDescriptor<number>
    },
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
  ParachainSystem: [
    {
      UnincludedSegment: stg_ParachainSystem_UnincludedSegment,
      AggregatedUnincludedSegment:
        stg_ParachainSystem_AggregatedUnincludedSegment,
      PendingValidationCode: stg_ParachainSystem_PendingValidationCode,
      NewValidationCode: stg_ParachainSystem_NewValidationCode,
      ValidationData: stg_ParachainSystem_ValidationData,
      DidSetValidationCode: stg_ParachainSystem_DidSetValidationCode,
      LastRelayChainBlockNumber: stg_ParachainSystem_LastRelayChainBlockNumber,
      UpgradeRestrictionSignal: stg_ParachainSystem_UpgradeRestrictionSignal,
      UpgradeGoAhead: stg_ParachainSystem_UpgradeGoAhead,
      RelayStateProof: stg_ParachainSystem_RelayStateProof,
      RelevantMessagingState: stg_ParachainSystem_RelevantMessagingState,
      HostConfiguration: stg_ParachainSystem_HostConfiguration,
      LastDmqMqcHead: stg_ParachainSystem_LastDmqMqcHead,
      LastHrmpMqcHeads: stg_ParachainSystem_LastHrmpMqcHeads,
      ProcessedDownwardMessages: stg_ParachainSystem_ProcessedDownwardMessages,
      HrmpWatermark: stg_ParachainSystem_HrmpWatermark,
      HrmpOutboundMessages: stg_ParachainSystem_HrmpOutboundMessages,
      UpwardMessages: stg_ParachainSystem_UpwardMessages,
      PendingUpwardMessages: stg_ParachainSystem_PendingUpwardMessages,
      UpwardDeliveryFeeFactor: stg_ParachainSystem_UpwardDeliveryFeeFactor,
      AnnouncedHrmpMessagesPerCandidate:
        stg_ParachainSystem_AnnouncedHrmpMessagesPerCandidate,
      ReservedXcmpWeightOverride:
        stg_ParachainSystem_ReservedXcmpWeightOverride,
      ReservedDmpWeightOverride: stg_ParachainSystem_ReservedDmpWeightOverride,
      AuthorizedUpgrade: stg_ParachainSystem_AuthorizedUpgrade,
      CustomValidationHeadData: stg_ParachainSystem_CustomValidationHeadData,
    },
    {
      set_validation_data: call_ParachainSystem_set_validation_data,
      sudo_send_upward_message: call_ParachainSystem_sudo_send_upward_message,
      authorize_upgrade: call_ParachainSystem_authorize_upgrade,
      enact_authorized_upgrade: call_ParachainSystem_enact_authorized_upgrade,
    },
    {
      ValidationFunctionStored: evt_ParachainSystem_ValidationFunctionStored,
      ValidationFunctionApplied: evt_ParachainSystem_ValidationFunctionApplied,
      ValidationFunctionDiscarded:
        evt_ParachainSystem_ValidationFunctionDiscarded,
      UpgradeAuthorized: evt_ParachainSystem_UpgradeAuthorized,
      DownwardMessagesReceived: evt_ParachainSystem_DownwardMessagesReceived,
      DownwardMessagesProcessed: evt_ParachainSystem_DownwardMessagesProcessed,
      UpwardMessageSent: evt_ParachainSystem_UpwardMessageSent,
    },
    {
      OverlappingUpgrades: err_ParachainSystem_OverlappingUpgrades,
      ProhibitedByPolkadot: err_ParachainSystem_ProhibitedByPolkadot,
      TooBig: err_ParachainSystem_TooBig,
      ValidationDataNotAvailable:
        err_ParachainSystem_ValidationDataNotAvailable,
      HostConfigurationNotAvailable:
        err_ParachainSystem_HostConfigurationNotAvailable,
      NotScheduled: err_ParachainSystem_NotScheduled,
      NothingAuthorized: err_ParachainSystem_NothingAuthorized,
      Unauthorized: err_ParachainSystem_Unauthorized,
    },
    {},
  ],
  Timestamp: [
    { Now: stg_Timestamp_Now, DidUpdate: stg_Timestamp_DidUpdate },
    { set: call_Timestamp_set },
    {},
    {},
    { MinimumPeriod: const_Timestamp_MinimumPeriod },
  ],
  ParachainInfo: [
    { ParachainId: stg_ParachainInfo_ParachainId },
    {},
    {},
    {},
    {},
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
  AssetTxPayment: [
    {},
    {},
    { AssetTxFeePaid: evt_AssetTxPayment_AssetTxFeePaid },
    {},
    {},
  ],
  Authorship: [{ Author: stg_Authorship_Author }, {}, {}, {}, {}],
  CollatorSelection: [
    {
      Invulnerables: stg_CollatorSelection_Invulnerables,
      Candidates: stg_CollatorSelection_Candidates,
      LastAuthoredBlock: stg_CollatorSelection_LastAuthoredBlock,
      DesiredCandidates: stg_CollatorSelection_DesiredCandidates,
      CandidacyBond: stg_CollatorSelection_CandidacyBond,
    },
    {
      set_invulnerables: call_CollatorSelection_set_invulnerables,
      set_desired_candidates: call_CollatorSelection_set_desired_candidates,
      set_candidacy_bond: call_CollatorSelection_set_candidacy_bond,
      register_as_candidate: call_CollatorSelection_register_as_candidate,
      leave_intent: call_CollatorSelection_leave_intent,
      add_invulnerable: call_CollatorSelection_add_invulnerable,
      remove_invulnerable: call_CollatorSelection_remove_invulnerable,
    },
    {
      NewInvulnerables: evt_CollatorSelection_NewInvulnerables,
      InvulnerableAdded: evt_CollatorSelection_InvulnerableAdded,
      InvulnerableRemoved: evt_CollatorSelection_InvulnerableRemoved,
      NewDesiredCandidates: evt_CollatorSelection_NewDesiredCandidates,
      NewCandidacyBond: evt_CollatorSelection_NewCandidacyBond,
      CandidateAdded: evt_CollatorSelection_CandidateAdded,
      CandidateRemoved: evt_CollatorSelection_CandidateRemoved,
      InvalidInvulnerableSkipped:
        evt_CollatorSelection_InvalidInvulnerableSkipped,
    },
    {
      TooManyCandidates: err_CollatorSelection_TooManyCandidates,
      TooFewEligibleCollators: err_CollatorSelection_TooFewEligibleCollators,
      AlreadyCandidate: err_CollatorSelection_AlreadyCandidate,
      NotCandidate: err_CollatorSelection_NotCandidate,
      TooManyInvulnerables: err_CollatorSelection_TooManyInvulnerables,
      AlreadyInvulnerable: err_CollatorSelection_AlreadyInvulnerable,
      NotInvulnerable: err_CollatorSelection_NotInvulnerable,
      NoAssociatedValidatorId: err_CollatorSelection_NoAssociatedValidatorId,
      ValidatorNotRegistered: err_CollatorSelection_ValidatorNotRegistered,
    },
    {},
  ],
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
  Aura: [
    { Authorities: stg_Aura_Authorities, CurrentSlot: stg_Aura_CurrentSlot },
    {},
    {},
    {},
    {},
  ],
  AuraExt: [
    { Authorities: stg_AuraExt_Authorities, SlotInfo: stg_AuraExt_SlotInfo },
    {},
    {},
    {},
    {},
  ],
  XcmpQueue: [
    {
      InboundXcmpStatus: stg_XcmpQueue_InboundXcmpStatus,
      InboundXcmpMessages: stg_XcmpQueue_InboundXcmpMessages,
      OutboundXcmpStatus: stg_XcmpQueue_OutboundXcmpStatus,
      OutboundXcmpMessages: stg_XcmpQueue_OutboundXcmpMessages,
      SignalMessages: stg_XcmpQueue_SignalMessages,
      QueueConfig: stg_XcmpQueue_QueueConfig,
      Overweight: stg_XcmpQueue_Overweight,
      CounterForOverweight: stg_XcmpQueue_CounterForOverweight,
      OverweightCount: stg_XcmpQueue_OverweightCount,
      QueueSuspended: stg_XcmpQueue_QueueSuspended,
      DeliveryFeeFactor: stg_XcmpQueue_DeliveryFeeFactor,
    },
    {
      service_overweight: call_XcmpQueue_service_overweight,
      suspend_xcm_execution: call_XcmpQueue_suspend_xcm_execution,
      resume_xcm_execution: call_XcmpQueue_resume_xcm_execution,
      update_suspend_threshold: call_XcmpQueue_update_suspend_threshold,
      update_drop_threshold: call_XcmpQueue_update_drop_threshold,
      update_resume_threshold: call_XcmpQueue_update_resume_threshold,
      update_threshold_weight: call_XcmpQueue_update_threshold_weight,
      update_weight_restrict_decay: call_XcmpQueue_update_weight_restrict_decay,
      update_xcmp_max_individual_weight:
        call_XcmpQueue_update_xcmp_max_individual_weight,
    },
    {
      Success: evt_XcmpQueue_Success,
      Fail: evt_XcmpQueue_Fail,
      BadVersion: evt_XcmpQueue_BadVersion,
      BadFormat: evt_XcmpQueue_BadFormat,
      XcmpMessageSent: evt_XcmpQueue_XcmpMessageSent,
      OverweightEnqueued: evt_XcmpQueue_OverweightEnqueued,
      OverweightServiced: evt_XcmpQueue_OverweightServiced,
    },
    {
      FailedToSend: err_XcmpQueue_FailedToSend,
      BadXcmOrigin: err_XcmpQueue_BadXcmOrigin,
      BadXcm: err_XcmpQueue_BadXcm,
      BadOverweightIndex: err_XcmpQueue_BadOverweightIndex,
      WeightOverLimit: err_XcmpQueue_WeightOverLimit,
    },
    {},
  ],
  PolkadotXcm: [
    {
      QueryCounter: stg_PolkadotXcm_QueryCounter,
      Queries: stg_PolkadotXcm_Queries,
      AssetTraps: stg_PolkadotXcm_AssetTraps,
      SafeXcmVersion: stg_PolkadotXcm_SafeXcmVersion,
      SupportedVersion: stg_PolkadotXcm_SupportedVersion,
      VersionNotifiers: stg_PolkadotXcm_VersionNotifiers,
      VersionNotifyTargets: stg_PolkadotXcm_VersionNotifyTargets,
      VersionDiscoveryQueue: stg_PolkadotXcm_VersionDiscoveryQueue,
      CurrentMigration: stg_PolkadotXcm_CurrentMigration,
      RemoteLockedFungibles: stg_PolkadotXcm_RemoteLockedFungibles,
      LockedFungibles: stg_PolkadotXcm_LockedFungibles,
      XcmExecutionSuspended: stg_PolkadotXcm_XcmExecutionSuspended,
    },
    {
      send: call_PolkadotXcm_send,
      teleport_assets: call_PolkadotXcm_teleport_assets,
      reserve_transfer_assets: call_PolkadotXcm_reserve_transfer_assets,
      execute: call_PolkadotXcm_execute,
      force_xcm_version: call_PolkadotXcm_force_xcm_version,
      force_default_xcm_version: call_PolkadotXcm_force_default_xcm_version,
      force_subscribe_version_notify:
        call_PolkadotXcm_force_subscribe_version_notify,
      force_unsubscribe_version_notify:
        call_PolkadotXcm_force_unsubscribe_version_notify,
      limited_reserve_transfer_assets:
        call_PolkadotXcm_limited_reserve_transfer_assets,
      limited_teleport_assets: call_PolkadotXcm_limited_teleport_assets,
      force_suspension: call_PolkadotXcm_force_suspension,
    },
    {
      Attempted: evt_PolkadotXcm_Attempted,
      Sent: evt_PolkadotXcm_Sent,
      UnexpectedResponse: evt_PolkadotXcm_UnexpectedResponse,
      ResponseReady: evt_PolkadotXcm_ResponseReady,
      Notified: evt_PolkadotXcm_Notified,
      NotifyOverweight: evt_PolkadotXcm_NotifyOverweight,
      NotifyDispatchError: evt_PolkadotXcm_NotifyDispatchError,
      NotifyDecodeFailed: evt_PolkadotXcm_NotifyDecodeFailed,
      InvalidResponder: evt_PolkadotXcm_InvalidResponder,
      InvalidResponderVersion: evt_PolkadotXcm_InvalidResponderVersion,
      ResponseTaken: evt_PolkadotXcm_ResponseTaken,
      AssetsTrapped: evt_PolkadotXcm_AssetsTrapped,
      VersionChangeNotified: evt_PolkadotXcm_VersionChangeNotified,
      SupportedVersionChanged: evt_PolkadotXcm_SupportedVersionChanged,
      NotifyTargetSendFail: evt_PolkadotXcm_NotifyTargetSendFail,
      NotifyTargetMigrationFail: evt_PolkadotXcm_NotifyTargetMigrationFail,
      InvalidQuerierVersion: evt_PolkadotXcm_InvalidQuerierVersion,
      InvalidQuerier: evt_PolkadotXcm_InvalidQuerier,
      VersionNotifyStarted: evt_PolkadotXcm_VersionNotifyStarted,
      VersionNotifyRequested: evt_PolkadotXcm_VersionNotifyRequested,
      VersionNotifyUnrequested: evt_PolkadotXcm_VersionNotifyUnrequested,
      FeesPaid: evt_PolkadotXcm_FeesPaid,
      AssetsClaimed: evt_PolkadotXcm_AssetsClaimed,
    },
    {
      Unreachable: err_PolkadotXcm_Unreachable,
      SendFailure: err_PolkadotXcm_SendFailure,
      Filtered: err_PolkadotXcm_Filtered,
      UnweighableMessage: err_PolkadotXcm_UnweighableMessage,
      DestinationNotInvertible: err_PolkadotXcm_DestinationNotInvertible,
      Empty: err_PolkadotXcm_Empty,
      CannotReanchor: err_PolkadotXcm_CannotReanchor,
      TooManyAssets: err_PolkadotXcm_TooManyAssets,
      InvalidOrigin: err_PolkadotXcm_InvalidOrigin,
      BadVersion: err_PolkadotXcm_BadVersion,
      BadLocation: err_PolkadotXcm_BadLocation,
      NoSubscription: err_PolkadotXcm_NoSubscription,
      AlreadySubscribed: err_PolkadotXcm_AlreadySubscribed,
      InvalidAsset: err_PolkadotXcm_InvalidAsset,
      LowBalance: err_PolkadotXcm_LowBalance,
      TooManyLocks: err_PolkadotXcm_TooManyLocks,
      AccountNotSovereign: err_PolkadotXcm_AccountNotSovereign,
      FeesNotMet: err_PolkadotXcm_FeesNotMet,
      LockNotFound: err_PolkadotXcm_LockNotFound,
      InUse: err_PolkadotXcm_InUse,
    },
    {},
  ],
  CumulusXcm: [
    {},
    {},
    {
      InvalidFormat: evt_CumulusXcm_InvalidFormat,
      UnsupportedVersion: evt_CumulusXcm_UnsupportedVersion,
      ExecutedDownward: evt_CumulusXcm_ExecutedDownward,
    },
    {},
    {},
  ],
  DmpQueue: [
    {
      Configuration: stg_DmpQueue_Configuration,
      PageIndex: stg_DmpQueue_PageIndex,
      Pages: stg_DmpQueue_Pages,
      Overweight: stg_DmpQueue_Overweight,
      CounterForOverweight: stg_DmpQueue_CounterForOverweight,
    },
    { service_overweight: call_DmpQueue_service_overweight },
    {
      InvalidFormat: evt_DmpQueue_InvalidFormat,
      UnsupportedVersion: evt_DmpQueue_UnsupportedVersion,
      ExecutedDownward: evt_DmpQueue_ExecutedDownward,
      WeightExhausted: evt_DmpQueue_WeightExhausted,
      OverweightEnqueued: evt_DmpQueue_OverweightEnqueued,
      OverweightServiced: evt_DmpQueue_OverweightServiced,
      MaxMessagesExhausted: evt_DmpQueue_MaxMessagesExhausted,
    },
    { Unknown: err_DmpQueue_Unknown, OverLimit: err_DmpQueue_OverLimit },
    {},
  ],
  ToKusamaXcmRouter: [
    { Bridge: stg_ToKusamaXcmRouter_Bridge },
    { report_bridge_status: call_ToKusamaXcmRouter_report_bridge_status },
    {},
    {},
    {},
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
  Assets: [
    {
      Asset: stg_Assets_Asset,
      Account: stg_Assets_Account,
      Approvals: stg_Assets_Approvals,
      Metadata: stg_Assets_Metadata,
    },
    {
      create: call_Assets_create,
      force_create: call_Assets_force_create,
      start_destroy: call_Assets_start_destroy,
      destroy_accounts: call_Assets_destroy_accounts,
      destroy_approvals: call_Assets_destroy_approvals,
      finish_destroy: call_Assets_finish_destroy,
      mint: call_Assets_mint,
      burn: call_Assets_burn,
      transfer: call_Assets_transfer,
      transfer_keep_alive: call_Assets_transfer_keep_alive,
      force_transfer: call_Assets_force_transfer,
      freeze: call_Assets_freeze,
      thaw: call_Assets_thaw,
      freeze_asset: call_Assets_freeze_asset,
      thaw_asset: call_Assets_thaw_asset,
      transfer_ownership: call_Assets_transfer_ownership,
      set_team: call_Assets_set_team,
      set_metadata: call_Assets_set_metadata,
      clear_metadata: call_Assets_clear_metadata,
      force_set_metadata: call_Assets_force_set_metadata,
      force_clear_metadata: call_Assets_force_clear_metadata,
      force_asset_status: call_Assets_force_asset_status,
      approve_transfer: call_Assets_approve_transfer,
      cancel_approval: call_Assets_cancel_approval,
      force_cancel_approval: call_Assets_force_cancel_approval,
      transfer_approved: call_Assets_transfer_approved,
      touch: call_Assets_touch,
      refund: call_Assets_refund,
      set_min_balance: call_Assets_set_min_balance,
      touch_other: call_Assets_touch_other,
      refund_other: call_Assets_refund_other,
      block: call_Assets_block,
    },
    {
      Created: evt_Assets_Created,
      Issued: evt_Assets_Issued,
      Transferred: evt_Assets_Transferred,
      Burned: evt_Assets_Burned,
      TeamChanged: evt_Assets_TeamChanged,
      OwnerChanged: evt_Assets_OwnerChanged,
      Frozen: evt_Assets_Frozen,
      Thawed: evt_Assets_Thawed,
      AssetFrozen: evt_Assets_AssetFrozen,
      AssetThawed: evt_Assets_AssetThawed,
      AccountsDestroyed: evt_Assets_AccountsDestroyed,
      ApprovalsDestroyed: evt_Assets_ApprovalsDestroyed,
      DestructionStarted: evt_Assets_DestructionStarted,
      Destroyed: evt_Assets_Destroyed,
      ForceCreated: evt_Assets_ForceCreated,
      MetadataSet: evt_Assets_MetadataSet,
      MetadataCleared: evt_Assets_MetadataCleared,
      ApprovedTransfer: evt_Assets_ApprovedTransfer,
      ApprovalCancelled: evt_Assets_ApprovalCancelled,
      TransferredApproved: evt_Assets_TransferredApproved,
      AssetStatusChanged: evt_Assets_AssetStatusChanged,
      AssetMinBalanceChanged: evt_Assets_AssetMinBalanceChanged,
      Touched: evt_Assets_Touched,
      Blocked: evt_Assets_Blocked,
    },
    {
      BalanceLow: err_Assets_BalanceLow,
      NoAccount: err_Assets_NoAccount,
      NoPermission: err_Assets_NoPermission,
      Unknown: err_Assets_Unknown,
      Frozen: err_Assets_Frozen,
      InUse: err_Assets_InUse,
      BadWitness: err_Assets_BadWitness,
      MinBalanceZero: err_Assets_MinBalanceZero,
      UnavailableConsumer: err_Assets_UnavailableConsumer,
      BadMetadata: err_Assets_BadMetadata,
      Unapproved: err_Assets_Unapproved,
      WouldDie: err_Assets_WouldDie,
      AlreadyExists: err_Assets_AlreadyExists,
      NoDeposit: err_Assets_NoDeposit,
      WouldBurn: err_Assets_WouldBurn,
      LiveAsset: err_Assets_LiveAsset,
      AssetNotLive: err_Assets_AssetNotLive,
      IncorrectStatus: err_Assets_IncorrectStatus,
      NotFrozen: err_Assets_NotFrozen,
      CallbackFailed: err_Assets_CallbackFailed,
    },
    {
      RemoveItemsLimit: const_Assets_RemoveItemsLimit,
      AssetDeposit: const_Assets_AssetDeposit,
      AssetAccountDeposit: const_Assets_AssetAccountDeposit,
      MetadataDepositBase: const_Assets_MetadataDepositBase,
      MetadataDepositPerByte: const_Assets_MetadataDepositPerByte,
      ApprovalDeposit: const_Assets_ApprovalDeposit,
      StringLimit: const_Assets_StringLimit,
    },
  ],
  Uniques: [
    {
      Class: stg_Uniques_Class,
      OwnershipAcceptance: stg_Uniques_OwnershipAcceptance,
      Account: stg_Uniques_Account,
      ClassAccount: stg_Uniques_ClassAccount,
      Asset: stg_Uniques_Asset,
      ClassMetadataOf: stg_Uniques_ClassMetadataOf,
      InstanceMetadataOf: stg_Uniques_InstanceMetadataOf,
      Attribute: stg_Uniques_Attribute,
      ItemPriceOf: stg_Uniques_ItemPriceOf,
      CollectionMaxSupply: stg_Uniques_CollectionMaxSupply,
    },
    {
      create: call_Uniques_create,
      force_create: call_Uniques_force_create,
      destroy: call_Uniques_destroy,
      mint: call_Uniques_mint,
      burn: call_Uniques_burn,
      transfer: call_Uniques_transfer,
      redeposit: call_Uniques_redeposit,
      freeze: call_Uniques_freeze,
      thaw: call_Uniques_thaw,
      freeze_collection: call_Uniques_freeze_collection,
      thaw_collection: call_Uniques_thaw_collection,
      transfer_ownership: call_Uniques_transfer_ownership,
      set_team: call_Uniques_set_team,
      approve_transfer: call_Uniques_approve_transfer,
      cancel_approval: call_Uniques_cancel_approval,
      force_item_status: call_Uniques_force_item_status,
      set_attribute: call_Uniques_set_attribute,
      clear_attribute: call_Uniques_clear_attribute,
      set_metadata: call_Uniques_set_metadata,
      clear_metadata: call_Uniques_clear_metadata,
      set_collection_metadata: call_Uniques_set_collection_metadata,
      clear_collection_metadata: call_Uniques_clear_collection_metadata,
      set_accept_ownership: call_Uniques_set_accept_ownership,
      set_collection_max_supply: call_Uniques_set_collection_max_supply,
      set_price: call_Uniques_set_price,
      buy_item: call_Uniques_buy_item,
    },
    {
      Created: evt_Uniques_Created,
      ForceCreated: evt_Uniques_ForceCreated,
      Destroyed: evt_Uniques_Destroyed,
      Issued: evt_Uniques_Issued,
      Transferred: evt_Uniques_Transferred,
      Burned: evt_Uniques_Burned,
      Frozen: evt_Uniques_Frozen,
      Thawed: evt_Uniques_Thawed,
      CollectionFrozen: evt_Uniques_CollectionFrozen,
      CollectionThawed: evt_Uniques_CollectionThawed,
      OwnerChanged: evt_Uniques_OwnerChanged,
      TeamChanged: evt_Uniques_TeamChanged,
      ApprovedTransfer: evt_Uniques_ApprovedTransfer,
      ApprovalCancelled: evt_Uniques_ApprovalCancelled,
      ItemStatusChanged: evt_Uniques_ItemStatusChanged,
      CollectionMetadataSet: evt_Uniques_CollectionMetadataSet,
      CollectionMetadataCleared: evt_Uniques_CollectionMetadataCleared,
      MetadataSet: evt_Uniques_MetadataSet,
      MetadataCleared: evt_Uniques_MetadataCleared,
      Redeposited: evt_Uniques_Redeposited,
      AttributeSet: evt_Uniques_AttributeSet,
      AttributeCleared: evt_Uniques_AttributeCleared,
      OwnershipAcceptanceChanged: evt_Uniques_OwnershipAcceptanceChanged,
      CollectionMaxSupplySet: evt_Uniques_CollectionMaxSupplySet,
      ItemPriceSet: evt_Uniques_ItemPriceSet,
      ItemPriceRemoved: evt_Uniques_ItemPriceRemoved,
      ItemBought: evt_Uniques_ItemBought,
    },
    {
      NoPermission: err_Uniques_NoPermission,
      UnknownCollection: err_Uniques_UnknownCollection,
      AlreadyExists: err_Uniques_AlreadyExists,
      WrongOwner: err_Uniques_WrongOwner,
      BadWitness: err_Uniques_BadWitness,
      InUse: err_Uniques_InUse,
      Frozen: err_Uniques_Frozen,
      WrongDelegate: err_Uniques_WrongDelegate,
      NoDelegate: err_Uniques_NoDelegate,
      Unapproved: err_Uniques_Unapproved,
      Unaccepted: err_Uniques_Unaccepted,
      Locked: err_Uniques_Locked,
      MaxSupplyReached: err_Uniques_MaxSupplyReached,
      MaxSupplyAlreadySet: err_Uniques_MaxSupplyAlreadySet,
      MaxSupplyTooSmall: err_Uniques_MaxSupplyTooSmall,
      UnknownItem: err_Uniques_UnknownItem,
      NotForSale: err_Uniques_NotForSale,
      BidTooLow: err_Uniques_BidTooLow,
    },
    {
      CollectionDeposit: const_Uniques_CollectionDeposit,
      ItemDeposit: const_Uniques_ItemDeposit,
      MetadataDepositBase: const_Uniques_MetadataDepositBase,
      AttributeDepositBase: const_Uniques_AttributeDepositBase,
      DepositPerByte: const_Uniques_DepositPerByte,
      StringLimit: const_Uniques_StringLimit,
      KeyLimit: const_Uniques_KeyLimit,
      ValueLimit: const_Uniques_ValueLimit,
    },
  ],
  Nfts: [
    {
      Collection: stg_Nfts_Collection,
      OwnershipAcceptance: stg_Nfts_OwnershipAcceptance,
      Account: stg_Nfts_Account,
      CollectionAccount: stg_Nfts_CollectionAccount,
      CollectionRoleOf: stg_Nfts_CollectionRoleOf,
      Item: stg_Nfts_Item,
      CollectionMetadataOf: stg_Nfts_CollectionMetadataOf,
      ItemMetadataOf: stg_Nfts_ItemMetadataOf,
      Attribute: stg_Nfts_Attribute,
      ItemPriceOf: stg_Nfts_ItemPriceOf,
      ItemAttributesApprovalsOf: stg_Nfts_ItemAttributesApprovalsOf,
      NextCollectionId: stg_Nfts_NextCollectionId,
      PendingSwapOf: stg_Nfts_PendingSwapOf,
      CollectionConfigOf: stg_Nfts_CollectionConfigOf,
      ItemConfigOf: stg_Nfts_ItemConfigOf,
    },
    {
      create: call_Nfts_create,
      force_create: call_Nfts_force_create,
      destroy: call_Nfts_destroy,
      mint: call_Nfts_mint,
      force_mint: call_Nfts_force_mint,
      burn: call_Nfts_burn,
      transfer: call_Nfts_transfer,
      redeposit: call_Nfts_redeposit,
      lock_item_transfer: call_Nfts_lock_item_transfer,
      unlock_item_transfer: call_Nfts_unlock_item_transfer,
      lock_collection: call_Nfts_lock_collection,
      transfer_ownership: call_Nfts_transfer_ownership,
      set_team: call_Nfts_set_team,
      force_collection_owner: call_Nfts_force_collection_owner,
      force_collection_config: call_Nfts_force_collection_config,
      approve_transfer: call_Nfts_approve_transfer,
      cancel_approval: call_Nfts_cancel_approval,
      clear_all_transfer_approvals: call_Nfts_clear_all_transfer_approvals,
      lock_item_properties: call_Nfts_lock_item_properties,
      set_attribute: call_Nfts_set_attribute,
      force_set_attribute: call_Nfts_force_set_attribute,
      clear_attribute: call_Nfts_clear_attribute,
      approve_item_attributes: call_Nfts_approve_item_attributes,
      cancel_item_attributes_approval:
        call_Nfts_cancel_item_attributes_approval,
      set_metadata: call_Nfts_set_metadata,
      clear_metadata: call_Nfts_clear_metadata,
      set_collection_metadata: call_Nfts_set_collection_metadata,
      clear_collection_metadata: call_Nfts_clear_collection_metadata,
      set_accept_ownership: call_Nfts_set_accept_ownership,
      set_collection_max_supply: call_Nfts_set_collection_max_supply,
      update_mint_settings: call_Nfts_update_mint_settings,
      set_price: call_Nfts_set_price,
      buy_item: call_Nfts_buy_item,
      pay_tips: call_Nfts_pay_tips,
      create_swap: call_Nfts_create_swap,
      cancel_swap: call_Nfts_cancel_swap,
      claim_swap: call_Nfts_claim_swap,
      mint_pre_signed: call_Nfts_mint_pre_signed,
      set_attributes_pre_signed: call_Nfts_set_attributes_pre_signed,
    },
    {
      Created: evt_Nfts_Created,
      ForceCreated: evt_Nfts_ForceCreated,
      Destroyed: evt_Nfts_Destroyed,
      Issued: evt_Nfts_Issued,
      Transferred: evt_Nfts_Transferred,
      Burned: evt_Nfts_Burned,
      ItemTransferLocked: evt_Nfts_ItemTransferLocked,
      ItemTransferUnlocked: evt_Nfts_ItemTransferUnlocked,
      ItemPropertiesLocked: evt_Nfts_ItemPropertiesLocked,
      CollectionLocked: evt_Nfts_CollectionLocked,
      OwnerChanged: evt_Nfts_OwnerChanged,
      TeamChanged: evt_Nfts_TeamChanged,
      TransferApproved: evt_Nfts_TransferApproved,
      ApprovalCancelled: evt_Nfts_ApprovalCancelled,
      AllApprovalsCancelled: evt_Nfts_AllApprovalsCancelled,
      CollectionConfigChanged: evt_Nfts_CollectionConfigChanged,
      CollectionMetadataSet: evt_Nfts_CollectionMetadataSet,
      CollectionMetadataCleared: evt_Nfts_CollectionMetadataCleared,
      ItemMetadataSet: evt_Nfts_ItemMetadataSet,
      ItemMetadataCleared: evt_Nfts_ItemMetadataCleared,
      Redeposited: evt_Nfts_Redeposited,
      AttributeSet: evt_Nfts_AttributeSet,
      AttributeCleared: evt_Nfts_AttributeCleared,
      ItemAttributesApprovalAdded: evt_Nfts_ItemAttributesApprovalAdded,
      ItemAttributesApprovalRemoved: evt_Nfts_ItemAttributesApprovalRemoved,
      OwnershipAcceptanceChanged: evt_Nfts_OwnershipAcceptanceChanged,
      CollectionMaxSupplySet: evt_Nfts_CollectionMaxSupplySet,
      CollectionMintSettingsUpdated: evt_Nfts_CollectionMintSettingsUpdated,
      NextCollectionIdIncremented: evt_Nfts_NextCollectionIdIncremented,
      ItemPriceSet: evt_Nfts_ItemPriceSet,
      ItemPriceRemoved: evt_Nfts_ItemPriceRemoved,
      ItemBought: evt_Nfts_ItemBought,
      TipSent: evt_Nfts_TipSent,
      SwapCreated: evt_Nfts_SwapCreated,
      SwapCancelled: evt_Nfts_SwapCancelled,
      SwapClaimed: evt_Nfts_SwapClaimed,
      PreSignedAttributesSet: evt_Nfts_PreSignedAttributesSet,
      PalletAttributeSet: evt_Nfts_PalletAttributeSet,
    },
    {
      NoPermission: err_Nfts_NoPermission,
      UnknownCollection: err_Nfts_UnknownCollection,
      AlreadyExists: err_Nfts_AlreadyExists,
      ApprovalExpired: err_Nfts_ApprovalExpired,
      WrongOwner: err_Nfts_WrongOwner,
      BadWitness: err_Nfts_BadWitness,
      CollectionIdInUse: err_Nfts_CollectionIdInUse,
      ItemsNonTransferable: err_Nfts_ItemsNonTransferable,
      NotDelegate: err_Nfts_NotDelegate,
      WrongDelegate: err_Nfts_WrongDelegate,
      Unapproved: err_Nfts_Unapproved,
      Unaccepted: err_Nfts_Unaccepted,
      ItemLocked: err_Nfts_ItemLocked,
      LockedItemAttributes: err_Nfts_LockedItemAttributes,
      LockedCollectionAttributes: err_Nfts_LockedCollectionAttributes,
      LockedItemMetadata: err_Nfts_LockedItemMetadata,
      LockedCollectionMetadata: err_Nfts_LockedCollectionMetadata,
      MaxSupplyReached: err_Nfts_MaxSupplyReached,
      MaxSupplyLocked: err_Nfts_MaxSupplyLocked,
      MaxSupplyTooSmall: err_Nfts_MaxSupplyTooSmall,
      UnknownItem: err_Nfts_UnknownItem,
      UnknownSwap: err_Nfts_UnknownSwap,
      MetadataNotFound: err_Nfts_MetadataNotFound,
      AttributeNotFound: err_Nfts_AttributeNotFound,
      NotForSale: err_Nfts_NotForSale,
      BidTooLow: err_Nfts_BidTooLow,
      ReachedApprovalLimit: err_Nfts_ReachedApprovalLimit,
      DeadlineExpired: err_Nfts_DeadlineExpired,
      WrongDuration: err_Nfts_WrongDuration,
      MethodDisabled: err_Nfts_MethodDisabled,
      WrongSetting: err_Nfts_WrongSetting,
      InconsistentItemConfig: err_Nfts_InconsistentItemConfig,
      NoConfig: err_Nfts_NoConfig,
      RolesNotCleared: err_Nfts_RolesNotCleared,
      MintNotStarted: err_Nfts_MintNotStarted,
      MintEnded: err_Nfts_MintEnded,
      AlreadyClaimed: err_Nfts_AlreadyClaimed,
      IncorrectData: err_Nfts_IncorrectData,
      WrongOrigin: err_Nfts_WrongOrigin,
      WrongSignature: err_Nfts_WrongSignature,
      IncorrectMetadata: err_Nfts_IncorrectMetadata,
      MaxAttributesLimitReached: err_Nfts_MaxAttributesLimitReached,
      WrongNamespace: err_Nfts_WrongNamespace,
      CollectionNotEmpty: err_Nfts_CollectionNotEmpty,
      WitnessRequired: err_Nfts_WitnessRequired,
    },
    {
      CollectionDeposit: const_Nfts_CollectionDeposit,
      ItemDeposit: const_Nfts_ItemDeposit,
      MetadataDepositBase: const_Nfts_MetadataDepositBase,
      AttributeDepositBase: const_Nfts_AttributeDepositBase,
      DepositPerByte: const_Nfts_DepositPerByte,
      StringLimit: const_Nfts_StringLimit,
      KeyLimit: const_Nfts_KeyLimit,
      ValueLimit: const_Nfts_ValueLimit,
      ApprovalsLimit: const_Nfts_ApprovalsLimit,
      ItemAttributesApprovalsLimit: const_Nfts_ItemAttributesApprovalsLimit,
      MaxTips: const_Nfts_MaxTips,
      MaxDeadlineDuration: const_Nfts_MaxDeadlineDuration,
      MaxAttributesPerCall: const_Nfts_MaxAttributesPerCall,
      Features: const_Nfts_Features,
    },
  ],
  ForeignAssets: [
    {
      Asset: stg_ForeignAssets_Asset,
      Account: stg_ForeignAssets_Account,
      Approvals: stg_ForeignAssets_Approvals,
      Metadata: stg_ForeignAssets_Metadata,
    },
    {
      create: call_ForeignAssets_create,
      force_create: call_ForeignAssets_force_create,
      start_destroy: call_ForeignAssets_start_destroy,
      destroy_accounts: call_ForeignAssets_destroy_accounts,
      destroy_approvals: call_ForeignAssets_destroy_approvals,
      finish_destroy: call_ForeignAssets_finish_destroy,
      mint: call_ForeignAssets_mint,
      burn: call_ForeignAssets_burn,
      transfer: call_ForeignAssets_transfer,
      transfer_keep_alive: call_ForeignAssets_transfer_keep_alive,
      force_transfer: call_ForeignAssets_force_transfer,
      freeze: call_ForeignAssets_freeze,
      thaw: call_ForeignAssets_thaw,
      freeze_asset: call_ForeignAssets_freeze_asset,
      thaw_asset: call_ForeignAssets_thaw_asset,
      transfer_ownership: call_ForeignAssets_transfer_ownership,
      set_team: call_ForeignAssets_set_team,
      set_metadata: call_ForeignAssets_set_metadata,
      clear_metadata: call_ForeignAssets_clear_metadata,
      force_set_metadata: call_ForeignAssets_force_set_metadata,
      force_clear_metadata: call_ForeignAssets_force_clear_metadata,
      force_asset_status: call_ForeignAssets_force_asset_status,
      approve_transfer: call_ForeignAssets_approve_transfer,
      cancel_approval: call_ForeignAssets_cancel_approval,
      force_cancel_approval: call_ForeignAssets_force_cancel_approval,
      transfer_approved: call_ForeignAssets_transfer_approved,
      touch: call_ForeignAssets_touch,
      refund: call_ForeignAssets_refund,
      set_min_balance: call_ForeignAssets_set_min_balance,
      touch_other: call_ForeignAssets_touch_other,
      refund_other: call_ForeignAssets_refund_other,
      block: call_ForeignAssets_block,
    },
    {
      Created: evt_ForeignAssets_Created,
      Issued: evt_ForeignAssets_Issued,
      Transferred: evt_ForeignAssets_Transferred,
      Burned: evt_ForeignAssets_Burned,
      TeamChanged: evt_ForeignAssets_TeamChanged,
      OwnerChanged: evt_ForeignAssets_OwnerChanged,
      Frozen: evt_ForeignAssets_Frozen,
      Thawed: evt_ForeignAssets_Thawed,
      AssetFrozen: evt_ForeignAssets_AssetFrozen,
      AssetThawed: evt_ForeignAssets_AssetThawed,
      AccountsDestroyed: evt_ForeignAssets_AccountsDestroyed,
      ApprovalsDestroyed: evt_ForeignAssets_ApprovalsDestroyed,
      DestructionStarted: evt_ForeignAssets_DestructionStarted,
      Destroyed: evt_ForeignAssets_Destroyed,
      ForceCreated: evt_ForeignAssets_ForceCreated,
      MetadataSet: evt_ForeignAssets_MetadataSet,
      MetadataCleared: evt_ForeignAssets_MetadataCleared,
      ApprovedTransfer: evt_ForeignAssets_ApprovedTransfer,
      ApprovalCancelled: evt_ForeignAssets_ApprovalCancelled,
      TransferredApproved: evt_ForeignAssets_TransferredApproved,
      AssetStatusChanged: evt_ForeignAssets_AssetStatusChanged,
      AssetMinBalanceChanged: evt_ForeignAssets_AssetMinBalanceChanged,
      Touched: evt_ForeignAssets_Touched,
      Blocked: evt_ForeignAssets_Blocked,
    },
    {
      BalanceLow: err_ForeignAssets_BalanceLow,
      NoAccount: err_ForeignAssets_NoAccount,
      NoPermission: err_ForeignAssets_NoPermission,
      Unknown: err_ForeignAssets_Unknown,
      Frozen: err_ForeignAssets_Frozen,
      InUse: err_ForeignAssets_InUse,
      BadWitness: err_ForeignAssets_BadWitness,
      MinBalanceZero: err_ForeignAssets_MinBalanceZero,
      UnavailableConsumer: err_ForeignAssets_UnavailableConsumer,
      BadMetadata: err_ForeignAssets_BadMetadata,
      Unapproved: err_ForeignAssets_Unapproved,
      WouldDie: err_ForeignAssets_WouldDie,
      AlreadyExists: err_ForeignAssets_AlreadyExists,
      NoDeposit: err_ForeignAssets_NoDeposit,
      WouldBurn: err_ForeignAssets_WouldBurn,
      LiveAsset: err_ForeignAssets_LiveAsset,
      AssetNotLive: err_ForeignAssets_AssetNotLive,
      IncorrectStatus: err_ForeignAssets_IncorrectStatus,
      NotFrozen: err_ForeignAssets_NotFrozen,
      CallbackFailed: err_ForeignAssets_CallbackFailed,
    },
    {
      RemoveItemsLimit: const_ForeignAssets_RemoveItemsLimit,
      AssetDeposit: const_ForeignAssets_AssetDeposit,
      AssetAccountDeposit: const_ForeignAssets_AssetAccountDeposit,
      MetadataDepositBase: const_ForeignAssets_MetadataDepositBase,
      MetadataDepositPerByte: const_ForeignAssets_MetadataDepositPerByte,
      ApprovalDeposit: const_ForeignAssets_ApprovalDeposit,
      StringLimit: const_ForeignAssets_StringLimit,
    },
  ],
}

type IRuntimeCalls = {
  /**
   * API necessary for block authorship with aura.
   */
  AuraApi: {
    /**
     * Returns the slot duration for Aura.
     *
     * Currently, only the value provided by this type at genesis will be used.
     */
    slot_duration: RuntimeDescriptor<[], bigint>

    /**
     * Return the current set of authorities.
     */
    authorities: RuntimeDescriptor<[], Array<Binary>>
  }

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
            ParachainSystem: Anonymize<Ia0jlnena5ajog>
            Timestamp: Anonymize<TimestampPalletCall>
            Balances: Anonymize<Ibf8j84ii3a3kr>
            CollatorSelection: Anonymize<Idicb249fns7nd>
            Session: Anonymize<I3v8vq7j9grsdj>
            XcmpQueue: Anonymize<Iemk8msmejs2tt>
            PolkadotXcm: Anonymize<XcmPalletCall>
            DmpQueue: Anonymize<I3lfpt1qictomp>
            ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
            Utility: Anonymize<Iakgmukh287lgd>
            Multisig: Anonymize<I25c5pk92h8gi9>
            Proxy: Anonymize<I8l19tjqe7q083>
            Assets: Anonymize<Id6smp39btrdm7>
            Uniques: Anonymize<I4p2mihcqro9rd>
            Nfts: Anonymize<Ifub2394n314hb>
            ForeignAssets: Anonymize<If63s12hm5a8p0>
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
            ParachainSystem: Anonymize<Ia0jlnena5ajog>
            Timestamp: Anonymize<TimestampPalletCall>
            Balances: Anonymize<Ibf8j84ii3a3kr>
            CollatorSelection: Anonymize<Idicb249fns7nd>
            Session: Anonymize<I3v8vq7j9grsdj>
            XcmpQueue: Anonymize<Iemk8msmejs2tt>
            PolkadotXcm: Anonymize<XcmPalletCall>
            DmpQueue: Anonymize<I3lfpt1qictomp>
            ToKusamaXcmRouter: Anonymize<I6buo4n6s39j28>
            Utility: Anonymize<Iakgmukh287lgd>
            Multisig: Anonymize<I25c5pk92h8gi9>
            Proxy: Anonymize<I8l19tjqe7q083>
            Assets: Anonymize<Id6smp39btrdm7>
            Uniques: Anonymize<I4p2mihcqro9rd>
            Nfts: Anonymize<Ifub2394n314hb>
            ForeignAssets: Anonymize<If63s12hm5a8p0>
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
   * The API for querying account's balances from runtime.
   */
  FungiblesApi: {
    /**
     * Returns the list of all [`MultiAsset`] that an `AccountId` has.
     */
    query_account_balances: RuntimeDescriptor<
      [account: SS58String],
      ResultPayload<XcmVersionedMultiAssets, Anonymize<Ifinuns4munfa5>>
    >
  }

  /**
   * Runtime api to collect information about a collation.
   */
  CollectCollationInfo: {
    /**
     * Collect information about a collation.
     *
     * The given `header` is the header of the built block for that
     * we are collecting the collation info for.
     */
    collect_collation_info: RuntimeDescriptor<
      [
        header: {
          parent_hash: Binary
          number: number
          state_root: Binary
          extrinsics_root: Binary
          digest: Anonymize<Idin6nhq46lvdj>
        },
      ],
      {
        upward_messages: Anonymize<Itom7fk49o0c9>
        horizontal_messages: Anonymize<I6r5cbv8ttrb09>
        new_validation_code: Anonymize<Iabpgqcjikia83>
        processed_downward_messages: number
        hrmp_watermark: number
        head_data: Binary
      }
    >
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
  AuraApi: {
    slot_duration: runtime_AuraApi_slot_duration,
    authorities: runtime_AuraApi_authorities,
  },
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
  TaggedTransactionQueue: {
    validate_transaction: runtime_TaggedTransactionQueue_validate_transaction,
  },
  OffchainWorkerApi: {
    offchain_worker: runtime_OffchainWorkerApi_offchain_worker,
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
  FungiblesApi: {
    query_account_balances: runtime_FungiblesApi_query_account_balances,
  },
  CollectCollationInfo: {
    collect_collation_info: runtime_CollectCollationInfo_collect_collation_info,
  },
  GenesisBuilder: {
    create_default_config: runtime_GenesisBuilder_create_default_config,
    build_config: runtime_GenesisBuilder_build_config,
  },
}

type IAsset = PlainDescriptor<number>
const asset: IAsset = "f3ncnq6stc567" as IAsset

type IDescriptors = { pallets: IPallets; apis: IRuntimeCalls; asset: IAsset }
const _allDescriptors: IDescriptors = { pallets, apis, asset }
export default _allDescriptors

export type Queries = QueryFromDescriptors<IDescriptors>
export type Calls = TxFromDescriptors<IDescriptors>
export type Events = EventsFromDescriptors<IDescriptors>
export type Errors = ErrorsFromDescriptors<IDescriptors>
export type Constants = ConstFromDescriptors<IDescriptors>
