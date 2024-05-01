import { mapObject } from "@polkadot-api/utils"

export type KnownTypes = Record<string, string>
export type RepositoryEntry =
  | string
  | { name: string; paths?: string[]; type?: string; chains?: string }

export const knownTypesRepository: Record<string, RepositoryEntry> = {
  "7bvp9q4ceuk7": {
    name: "DigestItem",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.generic.digest.DigestItem"],
    type: "Enum(PreRuntime, Consensus, Seal, Other, RuntimeEnvironmentUpdated)",
  },
  "15jjq0jj438cq": {
    name: "PalletEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_system.pallet.Event"],
    type: "Enum(ExtrinsicSuccess, ExtrinsicFailed, CodeUpdated, NewAccount, KilledAccount, Remarked, UpgradeAuthorized)",
  },
  "90bksimft5ia2": {
    name: "DispatchClass",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_support.dispatch.DispatchClass"],
    type: "Enum(Normal, Operational, Mandatory)",
  },
  ehg04bj71rkd: {
    name: "",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "frame_support.dispatch.Pays",
      "polkadot_runtime_parachains.paras.SetGoAhead",
    ],
    type: "Enum(Yes, No)",
  },
  edh5jo3t7dgka: {
    name: "DispatchError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.DispatchError"],
    type: "Enum(Other, CannotLookup, BadOrigin, Module, ConsumerRemaining, NoProviders, TooManyConsumers, Token, Arithmetic, Transactional, Exhausted, Corruption, Unavailable, RootNotAllowed)",
  },
  "5ltp1mv4fr7n7": {
    name: "TokenError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.TokenError"],
    type: "Enum(FundsUnavailable, OnlyProvider, BelowMinimum, CannotCreate, UnknownAsset, Frozen, Unsupported, CannotCreateHold, NotExpendable, Blocked)",
  },
  "87r8lmtt997st": {
    name: "ArithmeticError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_arithmetic.ArithmeticError"],
    type: "Enum(Underflow, Overflow, DivisionByZero)",
  },
  f87qnbuqe30lh: {
    name: "TransactionalError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.TransactionalError"],
    type: "Enum(LimitReached, NoLayer)",
  },
  ao8h4hv7atnq3: {
    name: "BalancesEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_balances.pallet.Event"],
    type: "Enum(Endowed, DustLost, Transfer, BalanceSet, Reserved, Unreserved, ReserveRepatriated, Deposit, Withdraw, Slashed, Minted, Burned, Suspended, Restored, Upgraded, Issued, Rescinded, Locked, Unlocked, Frozen, Thawed, TotalIssuanceForced)",
  },
  "7u481jea1442o": {
    name: "BalanceStatus",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_support.traits.tokens.misc.BalanceStatus"],
    type: "Enum(Free, Reserved)",
  },
  cjonl4a47pcm8: {
    name: "TransactionPaymentEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_transaction_payment.pallet.Event"],
    type: "Enum(TransactionFeePaid)",
  },
  "1078dp8vlrjh3": {
    name: "SessionEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_session.pallet.Event"],
    type: "Enum(NewSession)",
  },
  "5ce1ru810vv9d": {
    name: "XcmEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.Event"],
    type: "Enum(Attempted, Sent, UnexpectedResponse, ResponseReady, Notified, NotifyOverweight, NotifyDispatchError, NotifyDecodeFailed, InvalidResponder, InvalidResponderVersion, ResponseTaken, AssetsTrapped, VersionChangeNotified, SupportedVersionChanged, NotifyTargetSendFail, NotifyTargetMigrationFail, InvalidQuerierVersion, InvalidQuerier, VersionNotifyStarted, VersionNotifyRequested, VersionNotifyUnrequested, FeesPaid, AssetsClaimed, VersionMigrationFinished)",
  },
  bnmfm52c5n7nq: {
    name: "XcmV4TraitsOutcome",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.traits.Outcome"],
    type: "Enum(Complete, Incomplete, Error)",
  },
  "8j0abm9jkapk2": {
    name: "XcmV3TraitsError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.traits.Error"],
    type: "Enum(Overflow, Unimplemented, UntrustedReserveLocation, UntrustedTeleportLocation, LocationFull, LocationNotInvertible, BadOrigin, InvalidLocation, AssetNotFound, FailedToTransactAsset, NotWithdrawable, LocationCannotHold, ExceedsMaxMessageSize, DestinationUnsupported, Transport, Unroutable, UnknownClaim, FailedToDecode, MaxWeightInvalid, NotHoldingFees, TooExpensive, Trap, ExpectationFalse, PalletNotFound, NameMismatch, VersionIncompatible, HoldingWouldOverflow, ExportError, ReanchorFailed, NoDeal, FeesNotMet, LockError, NoPermission, Unanchored, NotDepositable, UnhandledXcmVersion, WeightLimitReached, Barrier, WeightNotComputable, ExceedsStackLimit)",
  },
  faafmcb1jmm2o: {
    name: "XcmV3Junctions",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.junctions.Junctions", "staging_xcm.v4.junctions.Junctions"],
    type: "Enum(Here, X1, X2, X3, X4, X5, X6, X7, X8)",
  },
  "6ag633d941o7v": {
    name: "XcmV3Junction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.junction.Junction", "staging_xcm.v4.junction.Junction"],
    type: "Enum(Parachain, AccountId32, AccountIndex64, AccountKey20, PalletInstance, GeneralIndex, GeneralKey, OnlyChild, Plurality, GlobalConsensus)",
  },
  "982q4n5eor6ih": {
    name: "XcmV3JunctionNetworkId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.junction.NetworkId", "staging_xcm.v4.junction.NetworkId"],
    type: "Enum(ByGenesis, ByFork, Polkadot, Kusama, Westend, Rococo, Wococo, Ethereum, BitcoinCore, BitcoinCash, PolkadotBulletin)",
  },
  bd6859lkk2107: {
    name: "XcmV3JunctionBodyId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.junction.BodyId"],
    type: "Enum(Unit, Moniker, Index, Executive, Technical, Legislative, Judicial, Defense, Administration, Treasury)",
  },
  f5frjbmqcgt5k: {
    name: "XcmV2JunctionBodyPart",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.junction.BodyPart", "xcm.v2.BodyPart"],
    type: "Enum(Voice, Members, Fraction, AtLeastProportion, MoreThanProportion)",
  },
  andndh150vhd7: {
    name: "XcmV4Instruction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.Instruction"],
    type: "Enum(WithdrawAsset, ReserveAssetDeposited, ReceiveTeleportedAsset, QueryResponse, TransferAsset, TransferReserveAsset, Transact, HrmpNewChannelOpenRequest, HrmpChannelAccepted, HrmpChannelClosing, ClearOrigin, DescendOrigin, ReportError, DepositAsset, DepositReserveAsset, ExchangeAsset, InitiateReserveWithdraw, InitiateTeleport, ReportHolding, BuyExecution, RefundSurplus, SetErrorHandler, SetAppendix, ClearError, ClaimAsset, Trap, SubscribeVersion, UnsubscribeVersion, BurnAsset, ExpectAsset, ExpectOrigin, ExpectError, ExpectTransactStatus, QueryPallet, ExpectPallet, ReportTransactStatus, ClearTransactStatus, UniversalOrigin, ExportMessage, LockAsset, UnlockAsset, NoteUnlockable, RequestUnlock, SetFeesMode, SetTopic, ClearTopic, AliasOrigin, UnpaidExecution)",
  },
  d2d2vjc8h66mf: {
    name: "XcmV3MultiassetFungibility",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "xcm.v3.multiasset.Fungibility",
      "staging_xcm.v4.asset.Fungibility",
    ],
    type: "Enum(Fungible, NonFungible)",
  },
  "9d6sev8uj006q": {
    name: "XcmV3MultiassetAssetInstance",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "xcm.v3.multiasset.AssetInstance",
      "staging_xcm.v4.asset.AssetInstance",
    ],
    type: "Enum(Undefined, Index, Array4, Array8, Array16, Array32)",
  },
  csmfdagrgtkj5: {
    name: "XcmV4Response",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.Response"],
    type: "Enum(Null, Assets, ExecutionResult, Version, PalletsInfo, DispatchResult)",
  },
  "5g0925eiftlcf": {
    name: "XcmV3MaybeErrorCode",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.MaybeErrorCode"],
    type: "Enum(Success, Error, TruncatedError)",
  },
  "2dcitigd3tk41": {
    name: "XcmV2OriginKind",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.OriginKind"],
    type: "Enum(Native, SovereignAccount, Superuser, Xcm)",
  },
  biemf2h6nh9pa: {
    name: "XcmV4AssetAssetFilter",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.asset.AssetFilter"],
    type: "Enum(Definite, Wild)",
  },
  e252kk4p31sv6: {
    name: "XcmV4AssetWildAsset",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.asset.WildAsset"],
    type: "Enum(All, AllOf, AllCounted, AllOfCounted)",
  },
  cg1p3hrtv6n5f: {
    name: "XcmV2MultiassetWildFungibility",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "xcm.v2.multiasset.WildFungibility",
      "xcm.v3.multiasset.WildFungibility",
      "staging_xcm.v4.asset.WildFungibility",
    ],
    type: "Enum(Fungible, NonFungible)",
  },
  "769fta165mequ": {
    name: "XcmV3WeightLimit",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.WeightLimit"],
    type: "Enum(Unlimited, Limited)",
  },
  "7vujittrav0br": {
    name: "XcmVersionedAssets",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedAssets"],
    type: "Enum(V2, V3, V4)",
  },
  es1oivk962n6f: {
    name: "XcmV2MultiassetAssetId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multiasset.AssetId"],
    type: "Enum(Concrete, Abstract)",
  },
  aquvu9nu2es05: {
    name: "XcmV2MultilocationJunctions",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multilocation.Junctions"],
    type: "Enum(Here, X1, X2, X3, X4, X5, X6, X7, X8)",
  },
  "505kan7sticn1": {
    name: "XcmV2Junction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.junction.Junction"],
    type: "Enum(Parachain, AccountId32, AccountIndex64, AccountKey20, PalletInstance, GeneralIndex, GeneralKey, OnlyChild, Plurality)",
  },
  "710b6mh49al4f": {
    name: "XcmV2NetworkId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.NetworkId"],
    type: "Enum(Any, Named, Polkadot, Kusama)",
  },
  "46j01db9schbn": {
    name: "XcmV2BodyId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.BodyId"],
    type: "Enum(Unit, Named, Index, Executive, Technical, Legislative, Judicial, Defense, Administration, Treasury)",
  },
  "1e4e6h17tes8n": {
    name: "XcmV2MultiassetFungibility",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multiasset.Fungibility"],
    type: "Enum(Fungible, NonFungible)",
  },
  "11avansl9buvp": {
    name: "XcmV2MultiassetAssetInstance",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multiasset.AssetInstance"],
    type: "Enum(Undefined, Index, Array4, Array8, Array16, Array32, Blob)",
  },
  "4cajo1lbs9cmt": {
    name: "XcmV3MultiassetAssetId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.multiasset.AssetId"],
    type: "Enum(Concrete, Abstract)",
  },
  ap9sokavcmq5o: {
    name: "XcmVersionedLocation",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedLocation"],
    type: "Enum(V2, V3, V4)",
  },
  "4hum2k6q9amhf": {
    name: "ProcessMessageError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_support.traits.messages.ProcessMessageError"],
    type: "Enum(BadFormat, Corrupt, Unsupported, Overweight, Yield)",
  },
  b1t99vn44417o: {
    name: "UtilityEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_utility.pallet.Event"],
    type: "Enum(BatchInterrupted, BatchCompleted, BatchCompletedWithErrors, ItemCompleted, ItemFailed, DispatchedAs)",
  },
  "5830pdel8nng3": {
    name: "MultisigEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_multisig.pallet.Event"],
    type: "Enum(NewMultisig, MultisigApproval, MultisigExecuted, MultisigCancelled)",
  },
  "302o6h1bqiqgu": {
    name: "PreimageEvent",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.pallet.Event"],
    type: "Enum(Noted, Requested, Cleared)",
  },
  cvnn3223kutus: {
    name: "SchedulerEvent",
    chains: "polkadot, polkadot.collectives, kusama",
    paths: ["pallet_scheduler.pallet.Event"],
    type: "Enum(Scheduled, Canceled, Dispatched, CallUnavailable, PeriodicFailed, PermanentlyOverweight)",
  },
  "890aui9hh0f9q": {
    name: "AssetRateEvent",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["pallet_asset_rate.pallet.Event"],
    type: "Enum(AssetRateCreated, AssetRateRemoved, AssetRateUpdated)",
  },
  cc0rvpoin8ucr: {
    name: "VersionedLocatableAsset",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["polkadot_runtime_common.impls.VersionedLocatableAsset"],
    type: "Enum(V3, V4)",
  },
  cuaiiptinb4jf: {
    name: "Version",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_vesting.Releases", "pallet_alliance.types.Version"],
    type: "Enum(V0, V1)",
  },
  // "28aoa43r171jt": {
  //   name: "ReferendaEvent",
  //   chains: "polkadot.collectives, kusama, rococo, westend.collectives",
  //   paths: ["pallet_referenda.pallet.Event"],
  //   type: "Enum(Submitted, DecisionDepositPlaced, DecisionDepositRefunded, DepositSlashed, DecisionStarted, ConfirmStarted, ConfirmAborted, Confirmed, Approved, Rejected, TimedOut, Cancelled, Killed, SubmissionDepositRefunded, MetadataSet, MetadataCleared)",
  // },
  cgde8bg5ldqpa: {
    name: "PreimagesBounded",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["frame_support.traits.preimages.Bounded"],
    type: "Enum(Legacy, Inline, Lookup)",
  },
  ekve0i6djpd9f: {
    name: "PalletCall",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_system.pallet.Call"],
    type: "Enum(remark, set_heap_pages, set_code, set_code_without_checks, set_storage, kill_storage, kill_prefix, remark_with_event, authorize_upgrade, authorize_upgrade_without_checks, apply_authorized_upgrade)",
  },
  "7d75gqfg6jh9c": {
    name: "TimestampPalletCall",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_timestamp.pallet.Call"],
    type: "Enum(set)",
  },
  "68md1shlobg68": {
    name: "BalancesPalletCall",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_balances.pallet.Call"],
    type: "Enum(transfer_allow_death, force_transfer, transfer_keep_alive, transfer_all, force_unreserve, upgrade_accounts, force_set_balance, force_adjust_total_issuance)",
  },
  "5a3qnpcq081o6": {
    name: "MultiAddress",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.multiaddress.MultiAddress"],
    type: "Enum(Id, Index, Raw, Address32, Address20)",
  },
  "3vrnp048j3b2d": {
    name: "BalancesAdjustmentDirection",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_balances.types.AdjustmentDirection"],
    type: "Enum(Increase, Decrease)",
  },
  "77dda7hps0u37": {
    name: "SessionPalletCall",
    chains:
      "polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo.assetHub, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_session.pallet.Call"],
    type: "Enum(set_keys, purge_keys)",
  },
  "31e92o4qn3nku": {
    name: "XcmPalletCall",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub",
    paths: ["pallet_xcm.pallet.Call"],
    type: "Enum(send, teleport_assets, reserve_transfer_assets, execute, force_xcm_version, force_default_xcm_version, force_subscribe_version_notify, force_unsubscribe_version_notify, limited_reserve_transfer_assets, limited_teleport_assets, force_suspension, transfer_assets, claim_assets)",
  },
  m2dj93rjj6ks: {
    name: "XcmVersionedXcm",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedXcm"],
    type: "Enum(V2, V3, V4)",
  },
  ml0q5vk4ei4e: {
    name: "XcmV2Instruction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.Instruction"],
    type: "Enum(WithdrawAsset, ReserveAssetDeposited, ReceiveTeleportedAsset, QueryResponse, TransferAsset, TransferReserveAsset, Transact, HrmpNewChannelOpenRequest, HrmpChannelAccepted, HrmpChannelClosing, ClearOrigin, DescendOrigin, ReportError, DepositAsset, DepositReserveAsset, ExchangeAsset, InitiateReserveWithdraw, InitiateTeleport, QueryHolding, BuyExecution, RefundSurplus, SetErrorHandler, SetAppendix, ClearError, ClaimAsset, Trap, SubscribeVersion, UnsubscribeVersion)",
  },
  "30v4njes1avsr": {
    name: "XcmV2Response",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.Response"],
    type: "Enum(Null, Assets, ExecutionResult, Version)",
  },
  amc6gl7bd9por: {
    name: "XcmV2TraitsError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.traits.Error"],
    type: "Enum(Overflow, Unimplemented, UntrustedReserveLocation, UntrustedTeleportLocation, MultiLocationFull, MultiLocationNotInvertible, BadOrigin, InvalidLocation, AssetNotFound, FailedToTransactAsset, NotWithdrawable, LocationCannotHold, ExceedsMaxMessageSize, DestinationUnsupported, Transport, Unroutable, UnknownClaim, FailedToDecode, MaxWeightInvalid, NotHoldingFees, TooExpensive, Trap, UnhandledXcmVersion, WeightLimitReached, Barrier, WeightNotComputable)",
  },
  fddrr93rdab23: {
    name: "XcmV2MultiAssetFilter",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multiasset.MultiAssetFilter"],
    type: "Enum(Definite, Wild)",
  },
  "3jnpd4dmb650": {
    name: "XcmV2MultiassetWildMultiAsset",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.multiasset.WildMultiAsset"],
    type: "Enum(All, AllOf)",
  },
  adqdire0qjg0e: {
    name: "XcmV2WeightLimit",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v2.WeightLimit"],
    type: "Enum(Unlimited, Limited)",
  },
  "8c614g2bc4iej": {
    name: "XcmV3Instruction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.Instruction"],
    type: "Enum(WithdrawAsset, ReserveAssetDeposited, ReceiveTeleportedAsset, QueryResponse, TransferAsset, TransferReserveAsset, Transact, HrmpNewChannelOpenRequest, HrmpChannelAccepted, HrmpChannelClosing, ClearOrigin, DescendOrigin, ReportError, DepositAsset, DepositReserveAsset, ExchangeAsset, InitiateReserveWithdraw, InitiateTeleport, ReportHolding, BuyExecution, RefundSurplus, SetErrorHandler, SetAppendix, ClearError, ClaimAsset, Trap, SubscribeVersion, UnsubscribeVersion, BurnAsset, ExpectAsset, ExpectOrigin, ExpectError, ExpectTransactStatus, QueryPallet, ExpectPallet, ReportTransactStatus, ClearTransactStatus, UniversalOrigin, ExportMessage, LockAsset, UnlockAsset, NoteUnlockable, RequestUnlock, SetFeesMode, SetTopic, ClearTopic, AliasOrigin, UnpaidExecution)",
  },
  "7ffbrur6hobca": {
    name: "XcmV3Response",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.Response"],
    type: "Enum(Null, Assets, ExecutionResult, Version, PalletsInfo, DispatchResult)",
  },
  ukot04uppvug: {
    name: "XcmV3MultiassetMultiAssetFilter",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.multiasset.MultiAssetFilter"],
    type: "Enum(Definite, Wild)",
  },
  "332pk9bjbk7p3": {
    name: "XcmV3MultiassetWildMultiAsset",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.v3.multiasset.WildMultiAsset"],
    type: "Enum(All, AllOf, AllCounted, AllOfCounted)",
  },
  a3gvv195g4jot: {
    name: "DispatchRawOrigin",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_support.dispatch.RawOrigin"],
    type: "Enum(Root, Signed, None)",
  },
  "5svrq9ei0ks3q": {
    name: "XcmPalletOrigin",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.Origin"],
    type: "Enum(Xcm, Response)",
  },
  f81ks88t5mpk5: {
    name: "PreimagePalletCall",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.pallet.Call"],
    type: "Enum(note_preimage, unnote_preimage, request_preimage, unrequest_preimage, ensure_updated)",
  },
  "85dm8mgt48css": {
    name: "AssetRatePalletCall",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["pallet_asset_rate.pallet.Call"],
    type: "Enum(create, update, remove)",
  },
  e3otks9vj8a3b: {
    name: "TraitsScheduleDispatchTime",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["frame_support.traits.schedule.DispatchTime"],
    type: "Enum(At, After)",
  },
  "1q39env8llhck": {
    name: "TreasuryPalletCall",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["pallet_treasury.pallet.Call"],
    type: "Enum(propose_spend, reject_proposal, approve_proposal, spend_local, remove_approval, spend, payout, check_status, void_spend)",
  },
  "68cld6q6s1gvo": {
    name: "TreasuryEvent",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["pallet_treasury.pallet.Event"],
    type: "Enum(Proposed, Spending, Awarded, Rejected, Burnt, Rollover, Deposit, SpendApproved, UpdatedInactive, AssetSpendApproved, AssetSpendVoided, Paid, PaymentFailed, SpendProcessed)",
  },
  bl1lrline4to8: {
    name: "Phase",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_system.Phase"],
    type: "Enum(ApplyExtrinsic, Finalization, Initialization)",
  },
  "1s2t6elcah93o": {
    name: "PalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub",
    paths: ["frame_system.pallet.Error"],
    type: "Enum(InvalidSpecName, SpecVersionNeedsToIncrease, FailedToExtractRuntimeVersion, NonDefaultComposite, NonZeroRefCount, CallFiltered, NothingAuthorized, Unauthorized)",
  },
  f331um1stp6g0: {
    name: "UpgradeGoAhead",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "polkadot_primitives.v6.UpgradeGoAhead",
      "polkadot_primitives.v7.UpgradeGoAhead",
    ],
    type: "Enum(Abort, GoAhead)",
  },
  "9pobt6o24rqdc": {
    name: "UpgradeRestriction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: [
      "polkadot_primitives.v6.UpgradeRestriction",
      "polkadot_primitives.v7.UpgradeRestriction",
    ],
    type: "Enum(Present)",
  },
  bgr9ooktct68l: {
    name: "BalancesTypesReasons",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_balances.types.Reasons"],
    type: "Enum(Fee, Misc, All)",
  },
  "3nveejfjt6cjg": {
    name: "WestendRuntimeRuntimeHoldReason",
    chains: "polkadot.collectives, westend, westend.collectives",
    paths: [
      "collectives_polkadot_runtime.RuntimeHoldReason",
      "westend_runtime.RuntimeHoldReason",
      "collectives_westend_runtime.RuntimeHoldReason",
    ],
    type: "Enum(Preimage)",
  },
  hpogi4p6q6h5: {
    name: "PreimagePalletHoldReason",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.pallet.HoldReason"],
    type: "Enum(Preimage)",
  },
  dj13i7adlomht: {
    name: "BalancesPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_balances.pallet.Error"],
    type: "Enum(VestingBalance, LiquidityRestrictions, InsufficientBalance, ExistentialDeposit, Expendability, ExistingVestingSchedule, DeadAccount, TooManyReserves, TooManyHolds, TooManyFreezes, IssuanceDeactivated, DeltaZero)",
  },
  fcqan2gt5adqc: {
    name: "TransactionPaymentReleases",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_transaction_payment.Releases"],
    type: "Enum(V1Ancient, V2)",
  },
  "1e07dgbaqd1sq": {
    name: "SessionPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_session.pallet.Error"],
    type: "Enum(InvalidProof, NoAssociatedValidatorId, DuplicatedKey, NoKeys, NoAccount)",
  },
  "1pja0i3r5p1gp": {
    name: "XcmPalletQueryStatus",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.QueryStatus"],
    type: "Enum(Pending, VersionNotifier, Ready)",
  },
  "543plq9vh7s3m": {
    name: "XcmVersionedResponse",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedResponse"],
    type: "Enum(V2, V3, V4)",
  },
  "6c90ieeim9tjd": {
    name: "XcmPalletVersionMigrationStage",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.VersionMigrationStage"],
    type: "Enum(MigrateSupportedVersion, MigrateVersionNotifiers, NotifyCurrentTargets, MigrateAndNotifyOldTargets)",
  },
  fou8ip7o6q00t: {
    name: "XcmVersionedAssetId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedAssetId"],
    type: "Enum(V3, V4)",
  },
  "4s86iefmp2rcu": {
    name: "XcmPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub",
    paths: ["pallet_xcm.pallet.Error"],
    type: "Enum(Unreachable, SendFailure, Filtered, UnweighableMessage, DestinationNotInvertible, Empty, CannotReanchor, TooManyAssets, InvalidOrigin, BadVersion, BadLocation, NoSubscription, AlreadySubscribed, CannotCheckOutTeleport, LowBalance, TooManyLocks, AccountNotSovereign, FeesNotMet, LockNotFound, InUse, InvalidAssetNotConcrete, InvalidAssetUnknownReserve, InvalidAssetUnsupportedReserve, TooManyReserves, LocalExecutionIncomplete)",
  },
  "5iupade5ag2dp": {
    name: "MessageQueuePalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_message_queue.pallet.Error"],
    type: "Enum(NotReapable, NoPage, NoMessage, AlreadyProcessed, Queued, InsufficientWeight, TemporarilyUnprocessable, QueuePaused, RecursiveDisallowed)",
  },
  "8dt2g2hcrgh36": {
    name: "UtilityPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_utility.pallet.Error"],
    type: "Enum(TooManyCalls)",
  },
  a76qmhhg4jvb9: {
    name: "MultisigPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_multisig.pallet.Error"],
    type: "Enum(MinimumThreshold, AlreadyApproved, NoApprovalsNeeded, TooFewSignatories, TooManySignatories, SignatoriesOutOfOrder, SenderInSignatories, NotFound, NotOwner, NoTimepoint, WrongTimepoint, UnexpectedTimepoint, MaxWeightTooLow, AlreadyStored)",
  },
  uvt54ei4cehc: {
    name: "ProxyPalletError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.collectives, kusama, kusama.assetHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.collectives",
    paths: ["pallet_proxy.pallet.Error"],
    type: "Enum(TooMany, NotFound, NotProxy, Unproxyable, Duplicate, NoPermission, Unannounced, NoSelfProxy)",
  },
  "515gfvv2a6c4o": {
    name: "PreimageOldRequestStatus",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.OldRequestStatus"],
    type: "Enum(Unrequested, Requested)",
  },
  "2gj0h0im54fqd": {
    name: "PreimageRequestStatus",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.RequestStatus"],
    type: "Enum(Unrequested, Requested)",
  },
  "4cfhml1prt4lu": {
    name: "PreimagePalletError",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_preimage.pallet.Error"],
    type: "Enum(TooBig, AlreadyNoted, NotAuthorized, NotNoted, Requested, NotRequested, TooMany, TooFew)",
  },
  f7oa8fprnilo5: {
    name: "SchedulerPalletError",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_scheduler.pallet.Error"],
    type: "Enum(FailedToSchedule, NotFound, TargetBlockNumberInPast, RescheduleNoChange, Named)",
  },
  "499e4gfi00j30": {
    name: "AssetRatePalletError",
    chains: "polkadot, polkadot.collectives, kusama",
    paths: ["pallet_asset_rate.pallet.Error"],
    type: "Enum(UnknownAssetKind, AlreadyExists)",
  },
  "926pkc9itkbdk": {
    name: "ReferendaTypesCurve",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_referenda.types.Curve"],
    type: "Enum(LinearDecreasing, SteppedDecreasing, Reciprocal)",
  },
  "8oq2c4augjrlt": {
    name: "ReferendaPalletError",
    chains: "polkadot, polkadot.collectives, kusama",
    paths: ["pallet_referenda.pallet.Error"],
    type: "Enum(NotOngoing, HasDeposit, BadTrack, Full, QueueEmpty, BadReferendum, NothingToDo, NoTrack, Unfinished, NoPermission, NoDeposit, BadStatus, PreimageNotExist)",
  },
  "8mdo9fqa201s6": {
    name: "TreasuryPaymentState",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_treasury.PaymentState"],
    type: "Enum(Pending, Attempted, Failed)",
  },
  "7dodf8ccnun1b": {
    name: "TreasuryPalletError",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_treasury.pallet.Error"],
    type: "Enum(InsufficientProposersBalance, InvalidIndex, TooManyApprovals, InsufficientPermission, ProposalNotApproved, FailedToConvertBalance, SpendExpired, EarlyPayout, AlreadyAttempted, PayoutError, NotAttempted, Inconclusive)",
  },
  bkbo8vqdq5g5a: {
    name: "MultiSignature",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.MultiSignature"],
    type: "Enum(Ed25519, Sr25519, Ecdsa)",
  },
  "8slcnsmtfbubd": {
    name: "ExtensionsCheckMortality",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.generic.era.Era"],
    type: "Enum(Immortal, Mortal1, Mortal2, Mortal3, Mortal4, Mortal5, Mortal6, Mortal7, Mortal8, Mortal9, Mortal10, Mortal11, Mortal12, Mortal13, Mortal14, Mortal15, Mortal16, Mortal17, Mortal18, Mortal19, Mortal20, Mortal21, Mortal22, Mortal23, Mortal24, Mortal25, Mortal26, Mortal27, Mortal28, Mortal29, Mortal30, Mortal31, Mortal32, Mortal33, Mortal34, Mortal35, Mortal36, Mortal37, Mortal38, Mortal39, Mortal40, Mortal41, Mortal42, Mortal43, Mortal44, Mortal45, Mortal46, Mortal47, Mortal48, Mortal49, Mortal50, Mortal51, Mortal52, Mortal53, Mortal54, Mortal55, Mortal56, Mortal57, Mortal58, Mortal59, Mortal60, Mortal61, Mortal62, Mortal63, Mortal64, Mortal65, Mortal66, Mortal67, Mortal68, Mortal69, Mortal70, Mortal71, Mortal72, Mortal73, Mortal74, Mortal75, Mortal76, Mortal77, Mortal78, Mortal79, Mortal80, Mortal81, Mortal82, Mortal83, Mortal84, Mortal85, Mortal86, Mortal87, Mortal88, Mortal89, Mortal90, Mortal91, Mortal92, Mortal93, Mortal94, Mortal95, Mortal96, Mortal97, Mortal98, Mortal99, Mortal100, Mortal101, Mortal102, Mortal103, Mortal104, Mortal105, Mortal106, Mortal107, Mortal108, Mortal109, Mortal110, Mortal111, Mortal112, Mortal113, Mortal114, Mortal115, Mortal116, Mortal117, Mortal118, Mortal119, Mortal120, Mortal121, Mortal122, Mortal123, Mortal124, Mortal125, Mortal126, Mortal127, Mortal128, Mortal129, Mortal130, Mortal131, Mortal132, Mortal133, Mortal134, Mortal135, Mortal136, Mortal137, Mortal138, Mortal139, Mortal140, Mortal141, Mortal142, Mortal143, Mortal144, Mortal145, Mortal146, Mortal147, Mortal148, Mortal149, Mortal150, Mortal151, Mortal152, Mortal153, Mortal154, Mortal155, Mortal156, Mortal157, Mortal158, Mortal159, Mortal160, Mortal161, Mortal162, Mortal163, Mortal164, Mortal165, Mortal166, Mortal167, Mortal168, Mortal169, Mortal170, Mortal171, Mortal172, Mortal173, Mortal174, Mortal175, Mortal176, Mortal177, Mortal178, Mortal179, Mortal180, Mortal181, Mortal182, Mortal183, Mortal184, Mortal185, Mortal186, Mortal187, Mortal188, Mortal189, Mortal190, Mortal191, Mortal192, Mortal193, Mortal194, Mortal195, Mortal196, Mortal197, Mortal198, Mortal199, Mortal200, Mortal201, Mortal202, Mortal203, Mortal204, Mortal205, Mortal206, Mortal207, Mortal208, Mortal209, Mortal210, Mortal211, Mortal212, Mortal213, Mortal214, Mortal215, Mortal216, Mortal217, Mortal218, Mortal219, Mortal220, Mortal221, Mortal222, Mortal223, Mortal224, Mortal225, Mortal226, Mortal227, Mortal228, Mortal229, Mortal230, Mortal231, Mortal232, Mortal233, Mortal234, Mortal235, Mortal236, Mortal237, Mortal238, Mortal239, Mortal240, Mortal241, Mortal242, Mortal243, Mortal244, Mortal245, Mortal246, Mortal247, Mortal248, Mortal249, Mortal250, Mortal251, Mortal252, Mortal253, Mortal254, Mortal255)",
  },
  "8ur8bpe8ahbdb": {
    name: "TransactionValidityError",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.transaction_validity.TransactionValidityError"],
    type: "Enum(Invalid, Unknown)",
  },
  "9jj84pbmaraa": {
    name: "TransactionValidityInvalidTransaction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.transaction_validity.InvalidTransaction"],
    type: "Enum(Call, Payment, Future, Stale, BadProof, AncientBirthBlock, ExhaustsResources, Custom, BadMandatory, MandatoryValidation, BadSigner)",
  },
  avhrl5td7rf4q: {
    name: "TransactionValidityUnknownTransaction",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.transaction_validity.UnknownTransaction"],
    type: "Enum(CannotLookup, NoUnsignedValidator, Custom)",
  },
  cpkfkhj5jq924: {
    name: "TransactionValidityTransactionSource",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["sp_runtime.transaction_validity.TransactionSource"],
    type: "Enum(InBlock, Local, External)",
  },
  "8g2s9dnb88h5": {
    name: "ProxyEvent",
    chains:
      "polkadot.assetHub, kusama.assetHub, rococo.assetHub, westend.assetHub",
    paths: ["pallet_proxy.pallet.Event"],
    type: "Enum(ProxyExecuted, PureCreated, Announced, ProxyAdded, ProxyRemoved)",
  },
  e4o50pgs5mq4e: {
    name: "AssetsEvent",
    chains:
      "polkadot.assetHub, kusama.assetHub, rococo.assetHub, westend.assetHub",
    paths: ["pallet_assets.pallet.Event"],
    type: "Enum(Created, Issued, Transferred, Burned, TeamChanged, OwnerChanged, Frozen, Thawed, AssetFrozen, AssetThawed, AccountsDestroyed, ApprovalsDestroyed, DestructionStarted, Destroyed, ForceCreated, MetadataSet, MetadataCleared, ApprovedTransfer, ApprovalCancelled, TransferredApproved, AssetStatusChanged, AssetMinBalanceChanged, Touched, Blocked)",
  },
  e28eun9h9q5hd: {
    name: "AssetsPalletCall",
    chains:
      "polkadot.assetHub, kusama.assetHub, rococo.assetHub, westend.assetHub",
    paths: ["pallet_assets.pallet.Call"],
    type: "Enum(create, force_create, start_destroy, destroy_accounts, destroy_approvals, finish_destroy, mint, burn, transfer, transfer_keep_alive, force_transfer, freeze, thaw, freeze_asset, thaw_asset, transfer_ownership, set_team, set_metadata, clear_metadata, force_set_metadata, force_clear_metadata, force_asset_status, approve_transfer, cancel_approval, force_cancel_approval, transfer_approved, touch, refund, set_min_balance, touch_other, refund_other, block)",
  },
  fn5p2ma236tv1: {
    name: "AssetsPalletError",
    chains:
      "polkadot.assetHub, kusama.assetHub, rococo.assetHub, westend.assetHub",
    paths: ["pallet_assets.pallet.Error"],
    type: "Enum(BalanceLow, NoAccount, NoPermission, Unknown, Frozen, InUse, BadWitness, MinBalanceZero, UnavailableConsumer, BadMetadata, Unapproved, WouldDie, AlreadyExists, NoDeposit, WouldBurn, LiveAsset, AssetNotLive, IncorrectStatus, NotFrozen, CallbackFailed)",
  },
  "5o0s7c8q1cc9b": {
    name: "PalletError",
    chains:
      "rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_system.pallet.Error"],
    type: "Enum(InvalidSpecName, SpecVersionNeedsToIncrease, FailedToExtractRuntimeVersion, NonDefaultComposite, NonZeroRefCount, CallFiltered, MultiBlockMigrationsOngoing, NothingAuthorized, Unauthorized)",
  },
  "69acthsqnju1b": {
    name: "XcmPalletCall",
    chains:
      "rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.Call"],
    type: "Enum(send, teleport_assets, reserve_transfer_assets, execute, force_xcm_version, force_default_xcm_version, force_subscribe_version_notify, force_unsubscribe_version_notify, limited_reserve_transfer_assets, limited_teleport_assets, force_suspension, transfer_assets, claim_assets, execute_blob, send_blob)",
  },
  f4pgh470sjqmu: {
    name: "XcmPalletError",
    chains:
      "rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.Error"],
    type: "Enum(Unreachable, SendFailure, Filtered, UnweighableMessage, DestinationNotInvertible, Empty, CannotReanchor, TooManyAssets, InvalidOrigin, BadVersion, BadLocation, NoSubscription, AlreadySubscribed, CannotCheckOutTeleport, LowBalance, TooManyLocks, AccountNotSovereign, FeesNotMet, LockNotFound, InUse, InvalidAssetNotConcrete, InvalidAssetUnknownReserve, InvalidAssetUnsupportedReserve, TooManyReserves, LocalExecutionIncomplete, UnableToDecode, XcmTooLarge)",
  },
  cenmqk68rcank: {
    name: "PolkadotRuntimeEvent",
    chains: "polkadot",
    paths: ["polkadot_runtime.RuntimeEvent"],
    type: "Enum(System, Scheduler, Preimage, Indices, Balances, TransactionPayment, Staking, Offences, Session, Grandpa, ImOnline, Treasury, ConvictionVoting, Referenda, Whitelist, Claims, Vesting, Utility, Identity, Proxy, Multisig, Bounties, ChildBounties, ElectionProviderMultiPhase, VoterList, NominationPools, FastUnstake, ParaInclusion, Paras, Hrmp, ParasDisputes, Registrar, Slots, Auctions, Crowdloan, StateTrieMigration, XcmPallet, MessageQueue, AssetRate)",
  },
  "88qf3i6ugbvsp": {
    name: "IndicesEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_indices.pallet.Event"],
    type: "Enum(IndexAssigned, IndexFreed, IndexFrozen)",
  },
  "3bd4nvc4e2g3p": {
    name: "StakingEvent",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_staking.pallet.pallet.Event"],
    type: "Enum(EraPaid, Rewarded, Slashed, SlashReported, OldSlashingReportDiscarded, StakersElected, Bonded, Unbonded, Withdrawn, Kicked, StakingElectionFailed, Chilled, PayoutStarted, ValidatorPrefsSet, SnapshotVotersSizeExceeded, SnapshotTargetsSizeExceeded, ForceEra, ControllerBatchDeprecated)",
  },
  "4peoofcn0loqr": {
    name: "StakingRewardDestination",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_staking.RewardDestination"],
    type: "Enum(Staked, Stash, Controller, Account, None)",
  },
  bs10onqorvq4b: {
    name: "StakingForcing",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_staking.Forcing"],
    type: "Enum(NotForcing, ForceNew, ForceNone, ForceAlways)",
  },
  "1tac42poi01n8": {
    name: "OffencesEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_offences.pallet.Event"],
    type: "Enum(Offence)",
  },
  cg9t1ptkdnbi3: {
    name: "GrandpaEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_grandpa.pallet.Event"],
    type: "Enum(NewAuthorities, Paused, Resumed)",
  },
  "9jqrili6gan6u": {
    name: "ImOnlineEvent",
    chains: "polkadot, kusama",
    paths: [
      "polkadot_runtime.pallet_im_online.pallet.Event",
      "pallet_im_online.pallet.Event",
    ],
    type: "Enum(HeartbeatReceived, AllGood, SomeOffline)",
  },
  ajkhn97prklo5: {
    name: "ConvictionVotingEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.pallet.Event"],
    type: "Enum(Delegated, Undelegated)",
  },
  dfraa3b4eu018: {
    name: "ReferendaEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_referenda.pallet.Event"],
    type: "Enum(Submitted, DecisionDepositPlaced, DecisionDepositRefunded, DepositSlashed, DecisionStarted, ConfirmStarted, ConfirmAborted, Confirmed, Approved, Rejected, TimedOut, Cancelled, Killed, SubmissionDepositRefunded, MetadataSet, MetadataCleared)",
  },
  "60a08att731k3": {
    name: "PolkadotRuntimeRuntimeCall",
    chains: "polkadot",
    paths: ["polkadot_runtime.RuntimeCall"],
    type: "Enum(System, Scheduler, Preimage, Babe, Timestamp, Indices, Balances, Staking, Session, Grandpa, Treasury, ConvictionVoting, Referenda, Whitelist, Claims, Vesting, Utility, Identity, Proxy, Multisig, Bounties, ChildBounties, ElectionProviderMultiPhase, VoterList, NominationPools, FastUnstake, Configuration, ParasShared, ParaInclusion, ParaInherent, Paras, Initializer, Hrmp, ParasDisputes, ParasSlashing, Registrar, Slots, Auctions, Crowdloan, StateTrieMigration, XcmPallet, MessageQueue, AssetRate, Beefy)",
  },
  bis90opk1q3dv: {
    name: "SchedulerPalletCall",
    chains: "polkadot",
    paths: ["pallet_scheduler.pallet.Call"],
    type: "Enum(schedule, cancel, schedule_named, cancel_named, schedule_after, schedule_named_after)",
  },
  "1jeo0dpbkma5g": {
    name: "BabePalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_babe.pallet.Call"],
    type: "Enum(report_equivocation, report_equivocation_unsigned, plan_config_change)",
  },
  ek17d55ubjjm9: {
    name: "BabeDigestsNextConfigDescriptor",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_consensus_babe.digests.NextConfigDescriptor"],
    type: "Enum(V1)",
  },
  "3g7a8g60ho721": {
    name: "BabeAllowedSlots",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_consensus_babe.AllowedSlots"],
    type: "Enum(PrimarySlots, PrimaryAndSecondaryPlainSlots, PrimaryAndSecondaryVRFSlots)",
  },
  "4gfcs0af6e39j": {
    name: "IndicesPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_indices.pallet.Call"],
    type: "Enum(claim, transfer, free, force_transfer, freeze)",
  },
  "2trgcqe1efv42": {
    name: "StakingPalletCall",
    chains: "polkadot",
    paths: ["pallet_staking.pallet.pallet.Call"],
    type: "Enum(bond, bond_extra, unbond, withdraw_unbonded, validate, nominate, chill, set_payee, set_controller, set_validator_count, increase_validator_count, scale_validator_count, force_no_eras, force_new_era, set_invulnerables, force_unstake, force_new_era_always, cancel_deferred_slash, payout_stakers, rebond, reap_stash, kick, set_staking_configs, chill_other, force_apply_min_commission, set_min_commission, payout_stakers_by_page, update_payee, deprecate_controller_batch, restore_ledger)",
  },
  fms5l9j358vie: {
    name: "StakingPalletConfigOpBig",
    chains: "polkadot, kusama, westend",
    paths: [
      "pallet_staking.pallet.pallet.ConfigOp",
      "pallet_nomination_pools.ConfigOp",
    ],
    type: "Enum(Noop, Set, Remove)",
  },
  bb454pgf9ofrq: {
    name: "StakingPalletConfigOp",
    chains: "polkadot, kusama, westend",
    paths: [
      "pallet_staking.pallet.pallet.ConfigOp",
      "pallet_nomination_pools.ConfigOp",
    ],
    type: "Enum(Noop, Set, Remove)",
  },
  ceajactc9a8pc: {
    name: "SessionPalletCall",
    chains: "polkadot, rococo, westend",
    paths: ["pallet_session.pallet.Call"],
    type: "Enum(set_keys, purge_keys)",
  },
  "5u9ggmn8umfqm": {
    name: "GrandpaPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_grandpa.pallet.Call"],
    type: "Enum(report_equivocation, report_equivocation_unsigned, note_stalled)",
  },
  brvqfk00lp42n: {
    name: "GrandpaEquivocation",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_consensus_grandpa.Equivocation"],
    type: "Enum(Prevote, Precommit)",
  },
  "7t0ikq66tic1d": {
    name: "ConvictionVotingPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.pallet.Call"],
    type: "Enum(vote, delegate, undelegate, unlock, remove_vote, remove_other_vote)",
  },
  cee77qkk3c81t: {
    name: "ConvictionVotingVoteAccountVote",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.vote.AccountVote"],
    type: "Enum(Standard, Split, SplitAbstain)",
  },
  "85ca14rjo42j5": {
    name: "VotingConviction",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.conviction.Conviction"],
    type: "Enum(None, Locked1x, Locked2x, Locked3x, Locked4x, Locked5x, Locked6x)",
  },
  bnvffgg4ckmsj: {
    name: "PolkadotRuntimeOriginCaller",
    chains: "polkadot",
    paths: ["polkadot_runtime.OriginCaller"],
    type: "Enum(system, Origins, ParachainsOrigin, XcmPallet, Void)",
  },
  c0rsdcbsdt7kf: {
    name: "GovernanceOrigin",
    chains: "polkadot",
    paths: ["polkadot_runtime.governance.origins.pallet_custom_origins.Origin"],
    type: "Enum(StakingAdmin, Treasurer, FellowshipAdmin, GeneralAdmin, AuctionAdmin, LeaseAdmin, ReferendumCanceller, ReferendumKiller, SmallTipper, BigTipper, SmallSpender, MediumSpender, BigSpender, WhitelistedCaller, WishForChange)",
  },
  "49em457ob9ou0": {
    name: "ParachainsOrigin",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.origin.pallet.Origin"],
    type: "Enum(Parachain)",
  },
  a61vpolk7ekct: {
    name: "WhitelistPalletCall",
    chains: "polkadot",
    paths: ["pallet_whitelist.pallet.Call"],
    type: "Enum(whitelist_call, remove_whitelisted_call, dispatch_whitelisted_call, dispatch_whitelisted_call_with_preimage)",
  },
  d0dj18ct09hlp: {
    name: "ClaimsPalletCall",
    chains: "polkadot, kusama, rococo",
    paths: ["polkadot_runtime_common.claims.pallet.Call"],
    type: "Enum(claim, mint_claim, claim_attest, attest, move_claim)",
  },
  "9lvi13skegcil": {
    name: "ClaimsStatementKind",
    chains: "polkadot, kusama, rococo",
    paths: ["polkadot_runtime_common.claims.StatementKind"],
    type: "Enum(Regular, Saft)",
  },
  "27bisdosp4kdo": {
    name: "VestingPalletCall",
    chains: "polkadot, rococo, westend",
    paths: ["pallet_vesting.pallet.Call"],
    type: "Enum(vest, vest_other, vested_transfer, force_vested_transfer, merge_schedules, force_remove_vesting_schedule)",
  },
  dhhvot7hsmg8r: {
    name: "UtilityPalletCall",
    chains: "polkadot",
    paths: ["pallet_utility.pallet.Call"],
    type: "Enum(batch, as_derivative, batch_all, dispatch_as, force_batch, with_weight)",
  },
  bd2atep95irq3: {
    name: "IdentityPalletCall",
    chains: "polkadot, rococo, westend",
    paths: ["pallet_identity.pallet.Call"],
    type: "Enum(add_registrar, set_identity, set_subs, clear_identity, request_judgement, cancel_request, set_fee, set_account_id, set_fields, provide_judgement, kill_identity, add_sub, rename_sub, remove_sub, quit_sub, add_username_authority, remove_username_authority, set_username_for, accept_username, remove_expired_approval, set_primary_username, remove_dangling_username)",
  },
  "629bfqn3u6tle": {
    name: "IdentityData",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_identity.types.Data"],
    type: "Enum(None, Raw0, Raw1, Raw2, Raw3, Raw4, Raw5, Raw6, Raw7, Raw8, Raw9, Raw10, Raw11, Raw12, Raw13, Raw14, Raw15, Raw16, Raw17, Raw18, Raw19, Raw20, Raw21, Raw22, Raw23, Raw24, Raw25, Raw26, Raw27, Raw28, Raw29, Raw30, Raw31, Raw32, BlakeTwo256, Sha256, Keccak256, ShaThree256)",
  },
  "7ujvudkvg12so": {
    name: "IdentityJudgement",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_identity.types.Judgement"],
    type: "Enum(Unknown, FeePaid, Reasonable, KnownGood, OutOfDate, LowQuality, Erroneous)",
  },
  "5i8b0g5f5hlhh": {
    name: "ProxyPalletCall",
    chains: "polkadot",
    paths: ["pallet_proxy.pallet.Call"],
    type: "Enum(proxy, add_proxy, remove_proxy, remove_proxies, create_pure, kill_pure, announce, remove_announcement, reject_announcement, proxy_announced)",
  },
  "3tnqcv58l4e62": {
    name: "ProxyType",
    chains: "polkadot",
    paths: ["polkadot_runtime.ProxyType"],
    type: "Enum(Any, NonTransfer, Governance, Staking, IdentityJudgement, CancelProxy, Auction, NominationPools)",
  },
  eoqrqg72vm1ue: {
    name: "MultisigPalletCall",
    chains: "polkadot",
    paths: ["pallet_multisig.pallet.Call"],
    type: "Enum(as_multi_threshold_1, as_multi, approve_as_multi, cancel_as_multi)",
  },
  id6a5f1ss4bc: {
    name: "BountiesPalletCall",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_bounties.pallet.Call"],
    type: "Enum(propose_bounty, approve_bounty, propose_curator, unassign_curator, accept_curator, award_bounty, claim_bounty, close_bounty, extend_bounty_expiry)",
  },
  "9rps5u7cv97of": {
    name: "ChildBountiesPalletCall",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_child_bounties.pallet.Call"],
    type: "Enum(add_child_bounty, propose_curator, accept_curator, unassign_curator, award_child_bounty, claim_child_bounty, close_child_bounty)",
  },
  "15soeogelbbbh": {
    name: "ElectionProviderMultiPhasePalletCall",
    chains: "polkadot, westend",
    paths: ["pallet_election_provider_multi_phase.pallet.Call"],
    type: "Enum(submit_unsigned, set_minimum_untrusted_score, set_emergency_election_result, submit, governance_fallback)",
  },
  "613rol2spf5hd": {
    name: "BagsListPalletCall",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_bags_list.pallet.Call"],
    type: "Enum(rebag, put_in_front_of, put_in_front_of_other)",
  },
  annvvkuhf73hh: {
    name: "NominationPoolsPalletCall",
    chains: "polkadot, westend",
    paths: ["pallet_nomination_pools.pallet.Call"],
    type: "Enum(join, bond_extra, claim_payout, unbond, pool_withdraw_unbonded, withdraw_unbonded, create, create_with_pool_id, nominate, set_state, set_metadata, set_configs, update_roles, chill, bond_extra_other, set_claim_permission, claim_payout_other, set_commission, set_commission_max, set_commission_change_rate, claim_commission, adjust_pool_deposit, set_commission_claim_permission)",
  },
  "2bvq1blgrln1s": {
    name: "NominationPoolsBondExtra",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.BondExtra"],
    type: "Enum(FreeBalance, Rewards)",
  },
  "22g1a3o3q475f": {
    name: "NominationPoolsPoolState",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.PoolState"],
    type: "Enum(Open, Blocked, Destroying)",
  },
  "5tbcfetjk0h9h": {
    name: "NominationPoolsConfigOp",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.ConfigOp"],
    type: "Enum(Noop, Set, Remove)",
  },
  "8g50cqebfncn4": {
    name: "NominationPoolsClaimPermission",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.ClaimPermission"],
    type: "Enum(Permissioned, PermissionlessCompound, PermissionlessWithdraw, PermissionlessAll)",
  },
  "1lanl0ouai2l7": {
    name: "NominationPoolsCommissionClaimPermission",
    chains: "polkadot, westend",
    paths: ["pallet_nomination_pools.CommissionClaimPermission"],
    type: "Enum(Permissionless, Account)",
  },
  "44snhj1gahvrd": {
    name: "FastUnstakePalletCall",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_fast_unstake.pallet.Call"],
    type: "Enum(register_fast_unstake, deregister, control)",
  },
  "9p1qu8c4vjki6": {
    name: "ParachainsConfigurationPalletCall",
    chains: "polkadot",
    paths: ["polkadot_runtime_parachains.configuration.pallet.Call"],
    type: "Enum(set_validation_upgrade_cooldown, set_validation_upgrade_delay, set_code_retention_period, set_max_code_size, set_max_pov_size, set_max_head_data_size, set_coretime_cores, set_on_demand_retries, set_group_rotation_frequency, set_paras_availability_period, set_scheduling_lookahead, set_max_validators_per_core, set_max_validators, set_dispute_period, set_dispute_post_conclusion_acceptance_period, set_no_show_slots, set_n_delay_tranches, set_zeroth_delay_tranche_width, set_needed_approvals, set_relay_vrf_modulo_samples, set_max_upward_queue_count, set_max_upward_queue_size, set_max_downward_message_size, set_max_upward_message_size, set_max_upward_message_num_per_candidate, set_hrmp_open_request_ttl, set_hrmp_sender_deposit, set_hrmp_recipient_deposit, set_hrmp_channel_max_capacity, set_hrmp_channel_max_total_size, set_hrmp_max_parachain_inbound_channels, set_hrmp_channel_max_message_size, set_hrmp_max_parachain_outbound_channels, set_hrmp_max_message_num_per_candidate, set_pvf_voting_ttl, set_minimum_validation_upgrade_delay, set_bypass_consistency_check, set_async_backing_params, set_executor_params, set_on_demand_base_fee, set_on_demand_fee_variability, set_on_demand_queue_max_size, set_on_demand_target_queue_utilization, set_on_demand_ttl, set_minimum_backing_votes, set_node_feature, set_approval_voting_params)",
  },
  "9fihu1euvgfa": {
    name: "PolkadotPrimitivesV6ExecutorParamsExecutorParam",
    chains: "polkadot, rococo, westend",
    paths: [
      "polkadot_primitives.v6.executor_params.ExecutorParam",
      "polkadot_primitives.v7.executor_params.ExecutorParam",
    ],
    type: "Enum(MaxMemoryPages, StackLogicalMax, StackNativeMax, PrecheckingMaxMemory, PvfPrepTimeout, PvfExecTimeout, WasmExtBulkMemory)",
  },
  c7d5cscq9c6gi: {
    name: "PolkadotPrimitivesV6PvfPrepKind",
    chains: "polkadot, rococo, westend",
    paths: [
      "polkadot_primitives.v6.PvfPrepKind",
      "polkadot_primitives.v7.PvfPrepKind",
    ],
    type: "Enum(Precheck, Prepare)",
  },
  "4k4r9im11cdan": {
    name: "PvfExecKind",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.PvfExecKind",
      "polkadot_primitives.v6.PvfExecTimeoutKind",
      "polkadot_primitives.v7.PvfExecKind",
    ],
    type: "Enum(Backing, Approval)",
  },
  d5l4f3jqtnb0u: {
    name: "PolkadotRuntimeParachainsParasInherentPalletCall",
    chains: "polkadot, rococo, westend",
    paths: ["polkadot_runtime_parachains.paras_inherent.pallet.Call"],
    type: "Enum(enter)",
  },
  fqkhvelo2q77o: {
    name: "ValidityAttestation",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.ValidityAttestation",
      "polkadot_primitives.v7.ValidityAttestation",
    ],
    type: "Enum(Implicit, Explicit)",
  },
  bs56nuk6pe5bp: {
    name: "PolkadotPrimitivesV6DisputeStatement",
    chains: "polkadot, rococo, westend",
    paths: [
      "polkadot_primitives.v6.DisputeStatement",
      "polkadot_primitives.v7.DisputeStatement",
    ],
    type: "Enum(Valid, Invalid)",
  },
  bta4mfoh73fpt: {
    name: "PolkadotPrimitivesV6ValidDisputeStatementKind",
    chains: "polkadot, rococo, westend",
    paths: [
      "polkadot_primitives.v6.ValidDisputeStatementKind",
      "polkadot_primitives.v7.ValidDisputeStatementKind",
    ],
    type: "Enum(Explicit, BackingSeconded, BackingValid, ApprovalChecking, ApprovalCheckingMultipleCandidates)",
  },
  f9rpgkuafvsb4: {
    name: "InvalidDisputeStatementKind",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.InvalidDisputeStatementKind",
      "polkadot_primitives.v7.InvalidDisputeStatementKind",
    ],
    type: "Enum(Explicit)",
  },
  e2dden5k4kk7t: {
    name: "ParachainsParasPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.paras.pallet.Call"],
    type: "Enum(force_set_current_code, force_set_current_head, force_schedule_code_upgrade, force_note_new_head, force_queue_action, add_trusted_validation_code, poke_unused_validation_code, include_pvf_check_statement, force_set_most_recent_context)",
  },
  eggtnkc96vvt7: {
    name: "ParachainsInitializerPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.initializer.pallet.Call"],
    type: "Enum(force_approve)",
  },
  "2vev2224bc186": {
    name: "ParachainsHrmpPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.hrmp.pallet.Call"],
    type: "Enum(hrmp_init_open_channel, hrmp_accept_open_channel, hrmp_close_channel, force_clean_hrmp, force_process_hrmp_open, force_process_hrmp_close, hrmp_cancel_open_request, force_open_hrmp_channel, establish_system_channel, poke_channel_deposits)",
  },
  fkh1ep7g9h3rv: {
    name: "ParachainsDisputesPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.pallet.Call"],
    type: "Enum(force_unfreeze)",
  },
  "3jj054kp2bjol": {
    name: "ParachainsDisputesSlashingPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.slashing.pallet.Call"],
    type: "Enum(report_dispute_lost_unsigned)",
  },
  "8jjr2rgj6aa2v": {
    name: "SlashingOffenceKind",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.slashing.SlashingOffenceKind",
      "polkadot_primitives.v7.slashing.SlashingOffenceKind",
    ],
    type: "Enum(ForInvalid, AgainstValid)",
  },
  cclqj5sge2nc7: {
    name: "CommonParasRegistrarPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.paras_registrar.pallet.Call"],
    type: "Enum(register, force_register, deregister, swap, remove_lock, reserve, add_lock, schedule_code_upgrade, set_current_head)",
  },
  afhis924j14hg: {
    name: "CommonSlotsPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.slots.pallet.Call"],
    type: "Enum(force_lease, clear_all_leases, trigger_onboard)",
  },
  "4a8qeimc5p3qn": {
    name: "CommonAuctionsPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.auctions.pallet.Call"],
    type: "Enum(new_auction, bid, cancel_auction)",
  },
  aj4q75nu5v2i2: {
    name: "CommonCrowdloanPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.pallet.Call"],
    type: "Enum(create, contribute, withdraw, refund, dissolve, edit, add_memo, poke, contribute_all)",
  },
  d7em8997pfm92: {
    name: "MultiSigner",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_runtime.MultiSigner"],
    type: "Enum(Ed25519, Sr25519, Ecdsa)",
  },
  "39l72gdmkk30t": {
    name: "",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_state_trie_migration.pallet.Call"],
    type: "Enum(control_auto_migration, continue_migrate, migrate_custom_top, migrate_custom_child, set_signed_max_limits, force_set_progress)",
  },
  "1ufmh6d8psvik": {
    name: "",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_state_trie_migration.pallet.Progress"],
    type: "Enum(ToStart, LastKey, Complete)",
  },
  "3lic4llm6egbr": {
    name: "MessageQueuePalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_message_queue.pallet.Call"],
    type: "Enum(reap_page, execute_overweight)",
  },
  "4sjnuvedkqa2r": {
    name: "ParachainsInclusionAggregateMessageOrigin",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.inclusion.AggregateMessageOrigin"],
    type: "Enum(Ump)",
  },
  "29a9v38btsv3g": {
    name: "ParachainsInclusionUmpQueueId",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.inclusion.UmpQueueId"],
    type: "Enum(Para)",
  },
  "918ie8roegt3d": {
    name: "BeefyPalletCall",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_beefy.pallet.Call"],
    type: "Enum(report_equivocation, report_equivocation_unsigned, set_new_genesis)",
  },
  "9iria2mpol0si": {
    name: "WhitelistEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_whitelist.pallet.Event"],
    type: "Enum(CallWhitelisted, WhitelistedCallRemoved, WhitelistedCallDispatched)",
  },
  "2v2nj97k9o9e": {
    name: "CommonClaimsEvent",
    chains: "polkadot, kusama, rococo",
    paths: ["polkadot_runtime_common.claims.pallet.Event"],
    type: "Enum(Claimed)",
  },
  d226b5du5oie9: {
    name: "VestingEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_vesting.pallet.Event"],
    type: "Enum(VestingUpdated, VestingCompleted)",
  },
  bju6hjiipokne: {
    name: "IdentityEvent",
    chains: "polkadot, rococo, westend",
    paths: ["pallet_identity.pallet.Event"],
    type: "Enum(IdentitySet, IdentityCleared, IdentityKilled, JudgementRequested, JudgementUnrequested, JudgementGiven, RegistrarAdded, SubIdentityAdded, SubIdentityRemoved, SubIdentityRevoked, AuthorityAdded, AuthorityRemoved, UsernameSet, UsernameQueued, PreapprovalExpired, PrimaryUsernameSet, DanglingUsernameRemoved)",
  },
  "11i3h84sudutq": {
    name: "ProxyEvent",
    chains: "polkadot",
    paths: ["pallet_proxy.pallet.Event"],
    type: "Enum(ProxyExecuted, PureCreated, Announced, ProxyAdded, ProxyRemoved)",
  },
  ei6k1tdcht3q: {
    name: "BountiesEvent",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_bounties.pallet.Event"],
    type: "Enum(BountyProposed, BountyRejected, BountyBecameActive, BountyAwarded, BountyClaimed, BountyCanceled, BountyExtended, BountyApproved, CuratorProposed, CuratorUnassigned, CuratorAccepted)",
  },
  a5gvqckojmehj: {
    name: "ChildBountiesEvent",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_child_bounties.pallet.Event"],
    type: "Enum(Added, Awarded, Claimed, Canceled)",
  },
  c5529239bmt3g: {
    name: "ElectionProviderMultiPhaseEvent",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_election_provider_multi_phase.pallet.Event"],
    type: "Enum(SolutionStored, ElectionFinalized, ElectionFailed, Rewarded, Slashed, PhaseTransitioned)",
  },
  htopdh9noje5: {
    name: "ElectionProviderMultiPhaseElectionCompute",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_election_provider_multi_phase.ElectionCompute"],
    type: "Enum(OnChain, Signed, Unsigned, Fallback, Emergency)",
  },
  "1ra0103q36u4i": {
    name: "ElectionProviderMultiPhasePhase",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_election_provider_multi_phase.Phase"],
    type: "Enum(Off, Signed, Unsigned, Emergency)",
  },
  "2qbmdeolj2cue": {
    name: "BagsListEvent",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_bags_list.pallet.Event"],
    type: "Enum(Rebagged, ScoreUpdated)",
  },
  "14qmevhulqskl": {
    name: "NominationPoolsEvent",
    chains: "polkadot, westend",
    paths: ["pallet_nomination_pools.pallet.Event"],
    type: "Enum(Created, Bonded, PaidOut, Unbonded, Withdrawn, Destroyed, StateChanged, MemberRemoved, RolesUpdated, PoolSlashed, UnbondingPoolSlashed, PoolCommissionUpdated, PoolMaxCommissionUpdated, PoolCommissionChangeRateUpdated, PoolCommissionClaimPermissionUpdated, PoolCommissionClaimed, MinBalanceDeficitAdjusted, MinBalanceExcessAdjusted)",
  },
  dri14nid3e46g: {
    name: "FastUnstakeEvent",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_fast_unstake.pallet.Event"],
    type: "Enum(Unstaked, Slashed, BatchChecked, BatchFinished, InternalError)",
  },
  dp2d78gpqj4r6: {
    name: "ParachainsInclusionEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.inclusion.pallet.Event"],
    type: "Enum(CandidateBacked, CandidateIncluded, CandidateTimedOut, UpwardMessagesReceived)",
  },
  cb4i7efmuhik2: {
    name: "ParachainsParasEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.paras.pallet.Event"],
    type: "Enum(CurrentCodeUpdated, CurrentHeadUpdated, CodeUpgradeScheduled, NewHeadNoted, ActionQueued, PvfCheckStarted, PvfCheckAccepted, PvfCheckRejected)",
  },
  c4alvt16n58rg: {
    name: "ParachainsHrmpEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.hrmp.pallet.Event"],
    type: "Enum(OpenChannelRequested, OpenChannelCanceled, OpenChannelAccepted, ChannelClosed, HrmpChannelForceOpened, HrmpSystemChannelOpened, OpenChannelDepositsUpdated)",
  },
  "8vj9hqgjobpdo": {
    name: "ParachainsDisputesEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.pallet.Event"],
    type: "Enum(DisputeInitiated, DisputeConcluded, Revert)",
  },
  a2kllcmf9u10g: {
    name: "ParachainsDisputeLocation",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.DisputeLocation"],
    type: "Enum(Local, Remote)",
  },
  "6hem0avr1eoco": {
    name: "ParachainsDisputeResult",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.DisputeResult"],
    type: "Enum(Valid, Invalid)",
  },
  "1pil5vhej188n": {
    name: "CommonParasRegistrarEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.paras_registrar.pallet.Event"],
    type: "Enum(Registered, Deregistered, Reserved, Swapped)",
  },
  fdctp8g6s725t: {
    name: "CommonSlotsEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.slots.pallet.Event"],
    type: "Enum(NewLeasePeriod, Leased)",
  },
  b1eprmg9d9eh2: {
    name: "CommonAuctionsEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.auctions.pallet.Event"],
    type: "Enum(AuctionStarted, AuctionClosed, Reserved, Unreserved, ReserveConfiscated, BidAccepted, WinningOffset)",
  },
  aoe6t9b9v4nhr: {
    name: "CommonCrowdloanEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.pallet.Event"],
    type: "Enum(Created, Contributed, Withdrew, PartiallyRefunded, AllRefunded, Dissolved, HandleBidResult, Edited, MemoUpdated, AddedToNewRaise)",
  },
  "61dksvl51aujo": {
    name: "",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_state_trie_migration.pallet.Event"],
    type: "Enum(Migrated, Slashed, AutoMigrationFinished, Halted)",
  },
  eknqsk8t6a8oo: {
    name: "MessageQueueEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_message_queue.pallet.Event"],
    type: "Enum(ProcessingFailed, Processed, OverweightEnqueued, PageReaped)",
  },
  "9uqvk3mspevjn": {
    name: "BabeDigestsPreDigest",
    chains: "polkadot, rococo, westend",
    paths: ["sp_consensus_babe.digests.PreDigest"],
    type: "Enum(Primary, SecondaryPlain, SecondaryVRF)",
  },
  b6q602k6o213a: {
    name: "BabePalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_babe.pallet.Error", "pallet_beefy.pallet.Error"],
    type: "Enum(InvalidEquivocationProof, InvalidKeyOwnershipProof, DuplicateOffenceReport, InvalidConfiguration)",
  },
  cq1825fru3di2: {
    name: "IndicesPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_indices.pallet.Error"],
    type: "Enum(NotAssigned, NotOwner, InUse, NotTransfer, Permanent)",
  },
  c1jnealhlqk0n: {
    name: "WestendRuntimeRuntimeFreezeReason",
    chains: "polkadot, kusama, westend",
    paths: [
      "polkadot_runtime.RuntimeFreezeReason",
      "staging_kusama_runtime.RuntimeFreezeReason",
      "westend_runtime.RuntimeFreezeReason",
    ],
    type: "Enum(NominationPools)",
  },
  "8b4gf7pjdvue3": {
    name: "NominationPoolsPalletFreezeReason",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.pallet.FreezeReason"],
    type: "Enum(PoolMinBalance)",
  },
  bc76n3snbepig: {
    name: "StakingPalletError",
    chains: "polkadot, westend",
    paths: ["pallet_staking.pallet.pallet.Error"],
    type: "Enum(NotController, NotStash, AlreadyBonded, AlreadyPaired, EmptyTargets, DuplicateIndex, InvalidSlashIndex, InsufficientBond, NoMoreChunks, NoUnlockChunk, FundedTarget, InvalidEraToReward, InvalidNumberOfNominations, NotSortedAndUnique, AlreadyClaimed, InvalidPage, IncorrectHistoryDepth, IncorrectSlashingSpans, BadState, TooManyTargets, BadTarget, CannotChillOther, TooManyNominators, TooManyValidators, CommissionTooLow, BoundNotMet, ControllerDeprecated, CannotRestoreLedger)",
  },
  "66mc66cqnpat1": {
    name: "GrandpaStoredState",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_grandpa.StoredState"],
    type: "Enum(Live, PendingPause, Paused, PendingResume)",
  },
  "7q8i0pp1gkas6": {
    name: "GrandpaPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_grandpa.pallet.Error"],
    type: "Enum(PauseFailed, ResumeFailed, ChangePending, TooSoon, InvalidKeyOwnershipProof, InvalidEquivocationProof, DuplicateOffenceReport)",
  },
  e5ojv0odma80: {
    name: "ConvictionVotingVoteVoting",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.vote.Voting"],
    type: "Enum(Casting, Delegating)",
  },
  dfa8k8ikssbsf: {
    name: "ConvictionVotingPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.pallet.Error"],
    type: "Enum(NotOngoing, NotVoter, NoPermission, NoPermissionYet, AlreadyDelegating, AlreadyVoting, InsufficientFunds, NotDelegating, Nonsense, MaxVotesReached, ClassNeeded, BadClass)",
  },
  "15nctscutpbeh": {
    name: "WhitelistPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_whitelist.pallet.Error"],
    type: "Enum(UnavailablePreImage, UndecodableCall, InvalidCallWeightWitness, CallIsNotWhitelisted, CallAlreadyWhitelisted)",
  },
  jh2jbbqvb176: {
    name: "CommonClaimsPalletError",
    chains: "polkadot, kusama, rococo",
    paths: ["polkadot_runtime_common.claims.pallet.Error"],
    type: "Enum(InvalidEthereumSignature, SignerHasNoClaim, SenderHasNoClaim, PotUnderflow, InvalidStatement, VestedBalanceExists)",
  },
  cof2acl69lq3c: {
    name: "VestingPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_vesting.pallet.Error"],
    type: "Enum(NotVesting, AtMaxVestingSchedules, AmountLow, ScheduleIndexOutOfBounds, InvalidScheduleParams)",
  },
  "9mq328955mgb8": {
    name: "IdentityPalletError",
    chains: "polkadot, rococo, westend",
    paths: ["pallet_identity.pallet.Error"],
    type: "Enum(TooManySubAccounts, NotFound, NotNamed, EmptyIndex, FeeChanged, NoIdentity, StickyJudgement, JudgementGiven, InvalidJudgement, InvalidIndex, InvalidTarget, TooManyRegistrars, AlreadyClaimed, NotSub, NotOwned, JudgementForDifferentIdentity, JudgementPaymentFailed, InvalidSuffix, NotUsernameAuthority, NoAllocation, InvalidSignature, RequiresSignature, InvalidUsername, UsernameTaken, NoUsername, NotExpired)",
  },
  "8eicfpc71dtp2": {
    name: "BountiesBountyStatus",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_bounties.BountyStatus"],
    type: "Enum(Proposed, Approved, Funded, CuratorProposed, Active, PendingPayout)",
  },
  bfvjqqblobf53: {
    name: "BountiesPalletError",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_bounties.pallet.Error"],
    type: "Enum(InsufficientProposersBalance, InvalidIndex, ReasonTooBig, UnexpectedStatus, RequireCurator, InvalidValue, InvalidFee, PendingPayout, Premature, HasActiveChildBounty, TooManyQueued)",
  },
  "8fgf6e6g02u7k": {
    name: "ChildBountyStatus",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_child_bounties.ChildBountyStatus"],
    type: "Enum(Added, CuratorProposed, Active, PendingPayout)",
  },
  "4u5ou5u3tthff": {
    name: "ChildBountiesPalletError",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_child_bounties.pallet.Error"],
    type: "Enum(ParentBountyNotActive, InsufficientBountyBalance, TooManyChildBounties)",
  },
  db84kfjd998sl: {
    name: "ElectionProviderMultiPhasePalletError",
    chains: "polkadot, westend",
    paths: ["pallet_election_provider_multi_phase.pallet.Error"],
    type: "Enum(PreDispatchEarlySubmission, PreDispatchWrongWinnerCount, PreDispatchWeakSubmission, SignedQueueFull, SignedCannotPayDeposit, SignedInvalidWitness, SignedTooMuchWeight, OcwCallWrongEra, MissingSnapshotMetadata, InvalidSubmissionIndex, CallNotAllowed, FallbackFailed, BoundNotMet, TooManyWinners, PreDispatchDifferentRound)",
  },
  c35l5bgiij29p: {
    name: "BagsListPalletError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_bags_list.pallet.Error"],
    type: "Enum(List)",
  },
  "5h5t0elhnbseq": {
    name: "BagsListListListError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_bags_list.list.ListError"],
    type: "Enum(Duplicate, NotHeavier, NotInSameBag, NodeNotFound)",
  },
  "823cj5ecot4us": {
    name: "NominationPoolsPalletError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.pallet.Error"],
    type: "Enum(PoolNotFound, PoolMemberNotFound, RewardPoolNotFound, SubPoolsNotFound, AccountBelongsToOtherPool, FullyUnbonding, MaxUnbondingLimit, CannotWithdrawAny, MinimumBondNotMet, OverflowRisk, NotDestroying, NotNominator, NotKickerOrDestroying, NotOpen, MaxPools, MaxPoolMembers, CanNotChangeState, DoesNotHavePermission, MetadataExceedsMaxLen, Defensive, PartialUnbondNotAllowedPermissionlessly, MaxCommissionRestricted, CommissionExceedsMaximum, CommissionExceedsGlobalMaximum, CommissionChangeThrottled, CommissionChangeRateNotAllowed, NoPendingCommission, NoCommissionCurrentSet, PoolIdInUse, InvalidPoolId, BondExtraRestricted, NothingToAdjust)",
  },
  "8s9terlv6i0tr": {
    name: "NominationPoolsPalletDefensiveError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.pallet.DefensiveError"],
    type: "Enum(NotEnoughSpaceInUnbondPool, PoolNotFound, RewardPoolNotFound, SubPoolsNotFound, BondedStashKilledPrematurely)",
  },
  au9bur8dc3bec: {
    name: "FastUnstakePalletError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_fast_unstake.pallet.Error"],
    type: "Enum(NotController, AlreadyQueued, NotFullyBonded, NotQueued, AlreadyHead, CallNotAllowed)",
  },
  n1jctfv299lm: {
    name: "ParachainsConfigurationPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.configuration.pallet.Error"],
    type: "Enum(InvalidNewValue)",
  },
  dp335n5ul2mnv: {
    name: "ParachainsInclusionPalletError",
    chains: "polkadot, kusama",
    paths: ["polkadot_runtime_parachains.inclusion.pallet.Error"],
    type: "Enum(UnsortedOrDuplicateValidatorIndices, UnsortedOrDuplicateDisputeStatementSet, UnsortedOrDuplicateBackedCandidates, UnexpectedRelayParent, WrongBitfieldSize, BitfieldAllZeros, BitfieldDuplicateOrUnordered, ValidatorIndexOutOfBounds, InvalidBitfieldSignature, UnscheduledCandidate, CandidateScheduledBeforeParaFree, ScheduledOutOfOrder, HeadDataTooLarge, PrematureCodeUpgrade, NewCodeTooLarge, DisallowedRelayParent, InvalidAssignment, InvalidGroupIndex, InsufficientBacking, InvalidBacking, NotCollatorSigned, ValidationDataHashMismatch, IncorrectDownwardMessageHandling, InvalidUpwardMessages, HrmpWatermarkMishandling, InvalidOutboundHrmp, InvalidValidationCodeHash, ParaHeadMismatch, BitfieldReferencesFreedCore)",
  },
  dr9omiep0prh9: {
    name: "PolkadotRuntimeParachainsParasInherentPalletError",
    chains: "polkadot",
    paths: ["polkadot_runtime_parachains.paras_inherent.pallet.Error"],
    type: "Enum(TooManyInclusionInherents, InvalidParentHeader, CandidateConcludedInvalid, InherentOverweight, DisputeStatementsUnsortedOrDuplicates, DisputeInvalid, BackedByDisabled, BackedOnUnscheduledCore, UnscheduledCandidate)",
  },
  d7hag4aqiaqqv: {
    name: "PolkadotRuntimeParachainsSchedulerPalletCoreOccupied",
    chains: "polkadot, rococo, westend",
    paths: ["polkadot_runtime_parachains.scheduler.pallet.CoreOccupied"],
    type: "Enum(Free, Paras)",
  },
  f6qqn0nd8o1nf: {
    name: "PolkadotRuntimeParachainsSchedulerCommonAssignment",
    chains: "polkadot, rococo, westend",
    paths: ["polkadot_runtime_parachains.scheduler.common.Assignment"],
    type: "Enum(Pool, Bulk)",
  },
  "14vn72umovb89": {
    name: "PolkadotRuntimeParachainsParasPvfCheckCause",
    chains: "polkadot, kusama",
    paths: ["polkadot_runtime_parachains.paras.PvfCheckCause"],
    type: "Enum(Onboarding, Upgrade)",
  },
  "341grmvm6j3e5": {
    name: "ParachainsParasParaLifecycle",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.paras.ParaLifecycle"],
    type: "Enum(Onboarding, Parathread, Parachain, UpgradingParathread, DowngradingParachain, OffboardingParathread, OffboardingParachain)",
  },
  bkrdj74n62tfq: {
    name: "ParachainsParasPalletError",
    chains: "polkadot, kusama",
    paths: ["polkadot_runtime_parachains.paras.pallet.Error"],
    type: "Enum(NotRegistered, CannotOnboard, CannotOffboard, CannotUpgrade, CannotDowngrade, PvfCheckStatementStale, PvfCheckStatementFuture, PvfCheckValidatorIndexOutOfBounds, PvfCheckInvalidSignature, PvfCheckDoubleVote, PvfCheckSubjectInvalid, CannotUpgradeCode)",
  },
  bns95nfmm92df: {
    name: "ParachainsHrmpPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.hrmp.pallet.Error"],
    type: "Enum(OpenHrmpChannelToSelf, OpenHrmpChannelInvalidRecipient, OpenHrmpChannelZeroCapacity, OpenHrmpChannelCapacityExceedsLimit, OpenHrmpChannelZeroMessageSize, OpenHrmpChannelMessageSizeExceedsLimit, OpenHrmpChannelAlreadyExists, OpenHrmpChannelAlreadyRequested, OpenHrmpChannelLimitExceeded, AcceptHrmpChannelDoesntExist, AcceptHrmpChannelAlreadyConfirmed, AcceptHrmpChannelLimitExceeded, CloseHrmpChannelUnauthorized, CloseHrmpChannelDoesntExist, CloseHrmpChannelAlreadyUnderway, CancelHrmpOpenChannelUnauthorized, OpenHrmpChannelDoesntExist, OpenHrmpChannelAlreadyConfirmed, WrongWitness, ChannelCreationNotAuthorized)",
  },
  akburbqot4g58: {
    name: "ParachainsDisputesPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.pallet.Error"],
    type: "Enum(DuplicateDisputeStatementSets, AncientDisputeStatement, ValidatorIndexOutOfBounds, InvalidSignature, DuplicateStatement, SingleSidedDispute, MaliciousBacker, MissingBackingVotes, UnconfirmedDispute)",
  },
  "1v70p1j0r2q1j": {
    name: "ParachainsDisputesSlashingPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_parachains.disputes.slashing.pallet.Error"],
    type: "Enum(InvalidKeyOwnershipProof, InvalidSessionIndex, InvalidCandidateHash, InvalidValidatorIndex, ValidatorIndexIdMismatch, DuplicateSlashingReport)",
  },
  "2dgbmoac0j5l9": {
    name: "CommonParasRegistrarPalletError",
    chains: "polkadot, kusama",
    paths: ["polkadot_runtime_common.paras_registrar.pallet.Error"],
    type: "Enum(NotRegistered, AlreadyRegistered, NotOwner, CodeTooLarge, HeadDataTooLarge, NotParachain, NotParathread, CannotDeregister, CannotDowngrade, CannotUpgrade, ParaLocked, NotReserved, EmptyCode, CannotSwap)",
  },
  ers095sa65pbg: {
    name: "CommonSlotsPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.slots.pallet.Error"],
    type: "Enum(ParaNotOnboarding, LeaseError)",
  },
  "4kgo47o2v3701": {
    name: "CommonAuctionsPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.auctions.pallet.Error"],
    type: "Enum(AuctionInProgress, LeasePeriodInPast, ParaNotRegistered, NotCurrentAuction, NotAuction, AuctionEnded, AlreadyLeasedOut)",
  },
  "1rjg0rh02tt4m": {
    name: "CommonCrowdloanLastContribution",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.LastContribution"],
    type: "Enum(Never, PreEnding, Ending)",
  },
  "9o6l1c4r4qc3s": {
    name: "CommonCrowdloanPalletError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.pallet.Error"],
    type: "Enum(FirstPeriodInPast, FirstPeriodTooFarInFuture, LastPeriodBeforeFirstPeriod, LastPeriodTooFarInFuture, CannotEndInPast, EndTooFarInFuture, Overflow, ContributionTooSmall, InvalidParaId, CapExceeded, ContributionPeriodOver, InvalidOrigin, NotParachain, LeaseActive, BidOrLeaseActive, FundNotEnded, NoContributions, NotReadyToDissolve, InvalidSignature, MemoTooLarge, AlreadyInNewRaise, VrfDelayInProgress, NoLeasePeriod)",
  },
  b5fd0r2ju9g0l: {
    name: "CoreState",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.CoreState",
      "polkadot_primitives.v7.CoreState",
    ],
    type: "Enum(Occupied, Scheduled, Free)",
  },
  "4vbt6tkj8bvqs": {
    name: "OccupiedCoreAssumption",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.OccupiedCoreAssumption",
      "polkadot_primitives.v7.OccupiedCoreAssumption",
    ],
    type: "Enum(Included, TimedOut, Free)",
  },
  "129huic8ces20": {
    name: "CandidateEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.CandidateEvent",
      "polkadot_primitives.v7.CandidateEvent",
    ],
    type: "Enum(CandidateBacked, CandidateIncluded, CandidateTimedOut)",
  },
  "6rjjsd07rc200": {
    name: "MmrPrimitivesError",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_mmr_primitives.Error"],
    type: "Enum(InvalidNumericOp, Push, GetRoot, Commit, GenerateProof, Verify, LeafNotFound, PalletNotIncluded, InvalidLeafIndex, InvalidBestKnownBlock)",
  },
  "5lqhrmabiigof": {
    name: "RuntimeError",
    chains: "polkadot",
    paths: ["polkadot_runtime.RuntimeError"],
    type: "Enum(System, Scheduler, Preimage, Babe, Indices, Balances, Staking, Session, Grandpa, Treasury, ConvictionVoting, Referenda, Whitelist, Claims, Vesting, Utility, Identity, Proxy, Multisig, Bounties, ChildBounties, ElectionProviderMultiPhase, VoterList, NominationPools, FastUnstake, Configuration, ParaInclusion, ParaInherent, Paras, Hrmp, ParasDisputes, ParasSlashing, Registrar, Slots, Auctions, Crowdloan, StateTrieMigration, XcmPallet, MessageQueue, AssetRate, Beefy)",
  },
  "5qmbgbglg3djl": {
    name: "PalletEvent",
    chains: "kusama",
    paths: ["frame_system.pallet.Event"],
    type: "Enum(ExtrinsicSuccess, ExtrinsicFailed, CodeUpdated, NewAccount, KilledAccount, Remarked)",
  },
  pa3jfc46ilad: {
    name: "BalancesEvent",
    chains: "kusama",
    paths: ["pallet_balances.pallet.Event"],
    type: "Enum(Endowed, DustLost, Transfer, BalanceSet, Reserved, Unreserved, ReserveRepatriated, Deposit, Withdraw, Slashed, Minted, Burned, Suspended, Restored, Upgraded, Issued, Rescinded, Locked, Unlocked, Frozen, Thawed)",
  },
  "86spl6bcfm5it": {
    name: "XcmV3Junctions",
    chains: "kusama",
    paths: ["xcm.v3.junctions.Junctions"],
    type: "Enum(Here, X1, X2, X3, X4, X5, X6, X7, X8)",
  },
  aqrmqn3umgltq: {
    name: "XcmV3Junction",
    chains: "kusama",
    paths: ["xcm.v3.junction.Junction"],
    type: "Enum(Parachain, AccountId32, AccountIndex64, AccountKey20, PalletInstance, GeneralIndex, GeneralKey, OnlyChild, Plurality, GlobalConsensus)",
  },
  "4k01tahcim329": {
    name: "XcmV3JunctionNetworkId",
    chains: "kusama",
    paths: ["xcm.v3.junction.NetworkId"],
    type: "Enum(ByGenesis, ByFork, Polkadot, Kusama, Westend, Rococo, Wococo, Ethereum, BitcoinCore, BitcoinCash)",
  },
  c00osfu517iss: {
    name: "XcmV3MultiassetAssetId",
    chains: "kusama",
    paths: ["xcm.v3.multiasset.AssetId"],
    type: "Enum(Concrete, Abstract)",
  },
  dbg08q7edq40c: {
    name: "XcmVersionedMultiLocation",
    chains: "kusama",
    paths: ["xcm.VersionedMultiLocation"],
    type: "Enum(V2, V3)",
  },
  ccjej82b2j3c5: {
    name: "SystemPalletCall",
    chains: "kusama",
    paths: ["frame_system.pallet.Call"],
    type: "Enum(remark, set_heap_pages, set_code, set_code_without_checks, set_storage, kill_storage, kill_prefix, remark_with_event)",
  },
  "7ubsrnb7nbvds": {
    name: "ImOnlinePalletCall",
    chains: "kusama",
    paths: ["pallet_im_online.pallet.Call"],
    type: "Enum(heartbeat)",
  },
  "3f4te0335d8h1": {
    name: "WestendRuntimeGovernanceOriginsPalletCustomOriginsOrigin",
    chains: "kusama, rococo, westend",
    paths: [
      "staging_kusama_runtime.governance.origins.pallet_custom_origins.Origin",
      "rococo_runtime.governance.origins.pallet_custom_origins.Origin",
      "westend_runtime.governance.origins.pallet_custom_origins.Origin",
    ],
    type: "Enum(StakingAdmin, Treasurer, FellowshipAdmin, GeneralAdmin, AuctionAdmin, LeaseAdmin, ReferendumCanceller, ReferendumKiller, SmallTipper, BigTipper, SmallSpender, MediumSpender, BigSpender, WhitelistedCaller, FellowshipInitiates, Fellows, FellowshipExperts, FellowshipMasters, Fellowship1Dan, Fellowship2Dan, Fellowship3Dan, Fellowship4Dan, Fellowship5Dan, Fellowship6Dan, Fellowship7Dan, Fellowship8Dan, Fellowship9Dan)",
  },
  "1r9hjo7723qso": {
    name: "XcmPalletOrigin",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.Origin"],
    type: "Enum(Xcm, Response)",
  },
  ciintj40nctsg: {
    name: "IdentityPalletCall",
    chains: "kusama",
    paths: ["pallet_identity.pallet.Call"],
    type: "Enum(add_registrar, set_identity, set_subs, clear_identity, request_judgement, cancel_request, set_fee, set_account_id, set_fields, provide_judgement, kill_identity, add_sub, rename_sub, remove_sub, quit_sub)",
  },
  apijri6pqtqte: {
    name: "IdentityField",
    chains: "kusama",
    paths: ["pallet_identity.simple.IdentityField"],
    type: "Enum(Display, Legal, Web, Riot, Email, PgpFingerprint, Image, Twitter)",
  },
  "4kol6ak3n4pb6": {
    name: "VestingPalletCall",
    chains: "kusama",
    paths: ["pallet_vesting.pallet.Call"],
    type: "Enum(vest, vest_other, vested_transfer, force_vested_transfer, merge_schedules)",
  },
  "2s1qfdh76bati": {
    name: "PolkadotPrimitivesV5ExecutorParam",
    chains: "kusama",
    paths: ["polkadot_primitives.v6.executor_params.ExecutorParam"],
    type: "Enum(MaxMemoryPages, StackLogicalMax, StackNativeMax, PrecheckingMaxMemory, PvfPrepTimeout, PvfExecTimeout, WasmExtBulkMemory)",
  },
  "1p5n9bbuf71e9": {
    name: "PolkadotPrimitivesV5PvfPrepTimeoutKind",
    chains: "kusama",
    paths: ["polkadot_primitives.v6.PvfPrepTimeoutKind"],
    type: "Enum(Precheck, Lenient)",
  },
  din60jmik27o9: {
    name: "ParachainsParasInherentPalletCall",
    chains: "kusama",
    paths: ["polkadot_runtime_parachains.paras_inherent.pallet.Call"],
    type: "Enum(enter)",
  },
  b7nns1qbu48af: {
    name: "PolkadotPrimitivesV5DisputeStatement",
    chains: "kusama",
    paths: ["polkadot_primitives.v6.DisputeStatement"],
    type: "Enum(Valid, Invalid)",
  },
  e33c1balm2hk9: {
    name: "PolkadotPrimitivesV5ValidDisputeStatementKind",
    chains: "kusama",
    paths: ["polkadot_primitives.v6.ValidDisputeStatementKind"],
    type: "Enum(Explicit, BackingSeconded, BackingValid, ApprovalChecking)",
  },
  "5f1g9rtdd19nm": {
    name: "XcmVersionedXcm",
    chains: "kusama",
    paths: ["xcm.VersionedXcm"],
    type: "Enum(V2, V3)",
  },
  css00hl25cgl4: {
    name: "XcmV3Instruction",
    chains: "kusama",
    paths: ["xcm.v3.Instruction"],
    type: "Enum(WithdrawAsset, ReserveAssetDeposited, ReceiveTeleportedAsset, QueryResponse, TransferAsset, TransferReserveAsset, Transact, HrmpNewChannelOpenRequest, HrmpChannelAccepted, HrmpChannelClosing, ClearOrigin, DescendOrigin, ReportError, DepositAsset, DepositReserveAsset, ExchangeAsset, InitiateReserveWithdraw, InitiateTeleport, ReportHolding, BuyExecution, RefundSurplus, SetErrorHandler, SetAppendix, ClearError, ClaimAsset, Trap, SubscribeVersion, UnsubscribeVersion, BurnAsset, ExpectAsset, ExpectOrigin, ExpectError, ExpectTransactStatus, QueryPallet, ExpectPallet, ReportTransactStatus, ClearTransactStatus, UniversalOrigin, ExportMessage, LockAsset, UnlockAsset, NoteUnlockable, RequestUnlock, SetFeesMode, SetTopic, ClearTopic, AliasOrigin, UnpaidExecution)",
  },
  "4e56rm9p07o27": {
    name: "XcmV3Response",
    chains: "kusama",
    paths: ["xcm.v3.Response"],
    type: "Enum(Null, Assets, ExecutionResult, Version, PalletsInfo, DispatchResult)",
  },
  "9enf1rh4u3kii": {
    name: "XcmV3MultiAssetFilter",
    chains: "kusama",
    paths: ["xcm.v3.multiasset.MultiAssetFilter"],
    type: "Enum(Definite, Wild)",
  },
  dhb8s9d0ie70f: {
    name: "XcmV3WildMultiAsset",
    chains: "kusama",
    paths: ["xcm.v3.multiasset.WildMultiAsset"],
    type: "Enum(All, AllOf, AllCounted, AllOfCounted)",
  },
  k93katrmbiat: {
    name: "XcmVersionedMultiAssets",
    chains: "kusama",
    paths: ["xcm.VersionedMultiAssets"],
    type: "Enum(V2, V3)",
  },
  fugjudpfm708s: {
    name: "IdentityEvent",
    chains: "kusama",
    paths: ["pallet_identity.pallet.Event"],
    type: "Enum(IdentitySet, IdentityCleared, IdentityKilled, JudgementRequested, JudgementUnrequested, JudgementGiven, RegistrarAdded, SubIdentityAdded, SubIdentityRemoved, SubIdentityRevoked)",
  },
  a4b928jbpau7j: {
    name: "RecoveryEvent",
    chains: "kusama, rococo, westend",
    paths: ["pallet_recovery.pallet.Event"],
    type: "Enum(RecoveryCreated, RecoveryInitiated, RecoveryVouched, RecoveryClosed, AccountRecovered, RecoveryRemoved)",
  },
  "4r0b7tct6o9ht": {
    name: "XcmEvent",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.Event"],
    type: "Enum(Attempted, Sent, UnexpectedResponse, ResponseReady, Notified, NotifyOverweight, NotifyDispatchError, NotifyDecodeFailed, InvalidResponder, InvalidResponderVersion, ResponseTaken, AssetsTrapped, VersionChangeNotified, SupportedVersionChanged, NotifyTargetSendFail, NotifyTargetMigrationFail, InvalidQuerierVersion, InvalidQuerier, VersionNotifyStarted, VersionNotifyRequested, VersionNotifyUnrequested, FeesPaid, AssetsClaimed)",
  },
  b01fvb3ofrhi8: {
    name: "XcmV3TraitsOutcome",
    chains: "kusama",
    paths: ["xcm.v3.traits.Outcome"],
    type: "Enum(Complete, Incomplete, Error)",
  },
  arof15is9j858: {
    name: "BabeDigestsPreDigest",
    chains: "kusama",
    paths: ["sp_consensus_babe.digests.PreDigest"],
    type: "Enum(Primary, SecondaryPlain, SecondaryVRF)",
  },
  fe9031aj6on0k: {
    name: "BalancesPalletError",
    chains: "kusama",
    paths: ["pallet_balances.pallet.Error"],
    type: "Enum(VestingBalance, LiquidityRestrictions, InsufficientBalance, ExistentialDeposit, Expendability, ExistingVestingSchedule, DeadAccount, TooManyReserves, TooManyHolds, TooManyFreezes)",
  },
  "8kh6j0q1r930d": {
    name: "ImOnlinePalletError",
    chains: "kusama",
    paths: ["pallet_im_online.pallet.Error"],
    type: "Enum(InvalidKey, DuplicatedHeartbeat)",
  },
  "4burhm31qmut2": {
    name: "IdentityPalletError",
    chains: "kusama",
    paths: ["pallet_identity.pallet.Error"],
    type: "Enum(TooManySubAccounts, NotFound, NotNamed, EmptyIndex, FeeChanged, NoIdentity, StickyJudgement, JudgementGiven, InvalidJudgement, InvalidIndex, InvalidTarget, TooManyFields, TooManyRegistrars, AlreadyClaimed, NotSub, NotOwned, JudgementForDifferentIdentity, JudgementPaymentFailed)",
  },
  "29mqdjoga49c9": {
    name: "RecoveryPalletError",
    chains: "kusama, rococo, westend",
    paths: ["pallet_recovery.pallet.Error"],
    type: "Enum(NotAllowed, ZeroThreshold, NotEnoughFriends, MaxFriends, NotSorted, NotRecoverable, AlreadyRecoverable, AlreadyStarted, NotStarted, NotFriend, DelayPeriod, AlreadyVouched, Threshold, StillActive, AlreadyProxy, BadState)",
  },
  aldi0cb4r5uls: {
    name: "ElectionProviderMultiPhasePalletError",
    chains: "kusama",
    paths: ["pallet_election_provider_multi_phase.pallet.Error"],
    type: "Enum(PreDispatchEarlySubmission, PreDispatchWrongWinnerCount, PreDispatchWeakSubmission, SignedQueueFull, SignedCannotPayDeposit, SignedInvalidWitness, SignedTooMuchWeight, OcwCallWrongEra, MissingSnapshotMetadata, InvalidSubmissionIndex, CallNotAllowed, FallbackFailed, BoundNotMet, TooManyWinners)",
  },
  au1n8bje17hl9: {
    name: "ParachainsParasInherentPalletError",
    chains: "kusama",
    paths: ["polkadot_runtime_parachains.paras_inherent.pallet.Error"],
    type: "Enum(TooManyInclusionInherents, InvalidParentHeader, CandidateConcludedInvalid, InherentOverweight, DisputeStatementsUnsortedOrDuplicates, DisputeInvalid)",
  },
  b19964q7gq7o9: {
    name: "PolkadotPrimitivesV5CoreOccupied",
    chains: "kusama",
    paths: ["polkadot_runtime_parachains.scheduler.pallet.CoreOccupied"],
    type: "Enum(Free, Paras)",
  },
  "9us7218h9qeio": {
    name: "XcmPalletQueryStatus",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.QueryStatus"],
    type: "Enum(Pending, VersionNotifier, Ready)",
  },
  fjsumieiq38rh: {
    name: "XcmVersionedResponse",
    chains: "kusama",
    paths: ["xcm.VersionedResponse"],
    type: "Enum(V2, V3)",
  },
  "9j0cetcqgjtaf": {
    name: "XcmVersionedAssetId",
    chains: "kusama",
    paths: ["xcm.VersionedAssetId"],
    type: "Enum(V3)",
  },
  "93avf3rpkhb2d": {
    name: "XcmPalletError",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.Error"],
    type: "Enum(Unreachable, SendFailure, Filtered, UnweighableMessage, DestinationNotInvertible, Empty, CannotReanchor, TooManyAssets, InvalidOrigin, BadVersion, BadLocation, NoSubscription, AlreadySubscribed, InvalidAsset, LowBalance, TooManyLocks, AccountNotSovereign, FeesNotMet, LockNotFound, InUse)",
  },
  "3a4cqqjs0cj3s": {
    name: "MessageQueuePalletError",
    chains: "kusama",
    paths: ["pallet_message_queue.pallet.Error"],
    type: "Enum(NotReapable, NoPage, NoMessage, AlreadyProcessed, Queued, InsufficientWeight, TemporarilyUnprocessable, QueuePaused)",
  },
  "4n17hls1edfih": {
    name: "ReferendaPalletCall",
    chains: "rococo, westend",
    paths: ["pallet_referenda.pallet.Call"],
    type: "Enum(submit, place_decision_deposit, refund_decision_deposit, cancel, kill, nudge_referendum, one_fewer_deciding, refund_submission_deposit, set_metadata)",
  },
  j50joavafcok: {
    name: "WestendRuntimeOriginCaller",
    chains: "rococo, westend",
    paths: ["rococo_runtime.OriginCaller", "westend_runtime.OriginCaller"],
    type: "Enum(system, Origins, ParachainsOrigin, XcmPallet, Void)",
  },
  "9s7urueli180g": {
    name: "PolkadotRuntimeParachainsAssignerOnDemandPalletCall",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.assigner_on_demand.pallet.Call"],
    type: "Enum(place_order_allow_death, place_order_keep_alive)",
  },
  em08ilhcfie6v: {
    name: "PolkadotRuntimeParachainsCoretimePalletCall",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.coretime.pallet.Call"],
    type: "Enum(request_core_count, assign_core)",
  },
  cgoc620vdl0ci: {
    name: "BrokerCoretimeInterfaceCoreAssignment",
    chains: "rococo, westend",
    paths: ["pallet_broker.coretime_interface.CoreAssignment"],
    type: "Enum(Idle, Pool, Task)",
  },
  "67t4bps9r5c4k": {
    name: "PolkadotRuntimeCommonIdentityMigratorPalletCall",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.identity_migrator.pallet.Call"],
    type: "Enum(reap_identity, poke_deposit)",
  },
  "8tnfu4hpnpsg": {
    name: "PolkadotRuntimeCommonParasSudoWrapperPalletCall",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.paras_sudo_wrapper.pallet.Call"],
    type: "Enum(sudo_schedule_para_initialize, sudo_schedule_para_cleanup, sudo_schedule_parathread_upgrade, sudo_schedule_parachain_downgrade, sudo_queue_downward_xcm, sudo_establish_hrmp_channel)",
  },
  dlqs78vqqscm0: {
    name: "PolkadotRuntimeCommonAssignedSlotsPalletCall",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.assigned_slots.pallet.Call"],
    type: "Enum(assign_perm_parachain_slot, assign_temp_parachain_slot, unassign_parachain_slot, set_max_permanent_slots, set_max_temporary_slots)",
  },
  "910lmkjcsvii": {
    name: "PolkadotRuntimeCommonAssignedSlotsSlotLeasePeriodStart",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.assigned_slots.SlotLeasePeriodStart"],
    type: "Enum(Current, Next)",
  },
  "9rkc7eqejp3rj": {
    name: "RootTestingPalletCall",
    chains: "rococo, westend",
    paths: ["pallet_root_testing.pallet.Call"],
    type: "Enum(fill_block, trigger_defensive)",
  },
  "9d4cj2o3vj1d8": {
    name: "SchedulerEvent",
    chains: "rococo, westend, westend.collectives",
    paths: ["pallet_scheduler.pallet.Event"],
    type: "Enum(Scheduled, Canceled, Dispatched, RetrySet, RetryCancelled, CallUnavailable, PeriodicFailed, RetryFailed, PermanentlyOverweight)",
  },
  "9ct52rvkkel07": {
    name: "PolkadotRuntimeParachainsAssignerOnDemandEvent",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.assigner_on_demand.pallet.Event"],
    type: "Enum(OnDemandOrderPlaced, SpotTrafficSet)",
  },
  "7t5v4k056sf3d": {
    name: "PolkadotRuntimeParachainsCoretimeEvent",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.coretime.pallet.Event"],
    type: "Enum(RevenueInfoRequested, CoreAssigned)",
  },
  "43e3ummb3h5dn": {
    name: "PolkadotRuntimeCommonIdentityMigratorEvent",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.identity_migrator.pallet.Event"],
    type: "Enum(IdentityReaped, DepositUpdated)",
  },
  cn24k411b4s6t: {
    name: "PolkadotRuntimeCommonAssignedSlotsEvent",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.assigned_slots.pallet.Event"],
    type: "Enum(PermanentSlotAssigned, TemporarySlotAssigned, MaxPermanentSlotsChanged, MaxTemporarySlotsChanged)",
  },
  tofo38uukr3h: {
    name: "RootTestingEvent",
    chains: "rococo, westend",
    paths: ["pallet_root_testing.pallet.Event"],
    type: "Enum(DefensiveTestCall)",
  },
  "346qm7n7jcer7": {
    name: "SudoEvent",
    chains: "rococo, westend",
    paths: ["pallet_sudo.pallet.Event"],
    type: "Enum(Sudid, KeyChanged, KeyRemoved, SudoAsDone)",
  },
  "2pnuv6i9ju403": {
    name: "ReferendaTypesReferendumInfo",
    chains: "rococo, westend",
    paths: ["pallet_referenda.types.ReferendumInfo"],
    type: "Enum(Ongoing, Approved, Rejected, Cancelled, TimedOut, Killed)",
  },
  "84u4ul208g742": {
    name: "ReferendaPalletError",
    chains: "rococo, westend, westend.collectives",
    paths: ["pallet_referenda.pallet.Error"],
    type: "Enum(NotOngoing, HasDeposit, BadTrack, Full, QueueEmpty, BadReferendum, NothingToDo, NoTrack, Unfinished, NoPermission, NoDeposit, BadStatus, PreimageNotExist, PreimageStoredWithDifferentLength)",
  },
  "3qgd61cgli6cp": {
    name: "AssetRatePalletError",
    chains: "rococo, westend, westend.collectives",
    paths: ["pallet_asset_rate.pallet.Error"],
    type: "Enum(UnknownAssetKind, AlreadyExists, Overflow)",
  },
  eo97unb4d08rl: {
    name: "PolkadotRuntimeParachainsParasPalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.paras.pallet.Error"],
    type: "Enum(NotRegistered, CannotOnboard, CannotOffboard, CannotUpgrade, CannotDowngrade, PvfCheckStatementStale, PvfCheckStatementFuture, PvfCheckValidatorIndexOutOfBounds, PvfCheckInvalidSignature, PvfCheckDoubleVote, PvfCheckSubjectInvalid, CannotUpgradeCode, InvalidCode)",
  },
  e3b9qd0nd59gs: {
    name: "PolkadotRuntimeParachainsAssignerCoretimePalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.assigner_coretime.pallet.Error"],
    type: "Enum(AssignmentsEmpty, OverScheduled, UnderScheduled, DisallowedInsert, DuplicateInsert, AssignmentsNotSorted)",
  },
  "97vkspnd0b8bh": {
    name: "PolkadotRuntimeCommonParasRegistrarPalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.paras_registrar.pallet.Error"],
    type: "Enum(NotRegistered, AlreadyRegistered, NotOwner, CodeTooLarge, HeadDataTooLarge, NotParachain, NotParathread, CannotDeregister, CannotDowngrade, CannotUpgrade, ParaLocked, NotReserved, InvalidCode, CannotSwap)",
  },
  "53h5rnv8hd3qi": {
    name: "PolkadotRuntimeParachainsCoretimePalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_parachains.coretime.pallet.Error"],
    type: "Enum(NotBroker)",
  },
  eq0677kv2oqb2: {
    name: "PolkadotRuntimeCommonParasSudoWrapperPalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.paras_sudo_wrapper.pallet.Error"],
    type: "Enum(ParaDoesntExist, ParaAlreadyExists, ExceedsMaxMessageSize, CouldntCleanup, NotParathread, NotParachain, CannotUpgrade, CannotDowngrade, TooManyCores)",
  },
  "40te5bcfc046n": {
    name: "PolkadotRuntimeCommonAssignedSlotsPalletError",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.assigned_slots.pallet.Error"],
    type: "Enum(ParaDoesntExist, NotParathread, CannotUpgrade, CannotDowngrade, SlotAlreadyAssigned, SlotNotAssigned, OngoingLeaseExists, MaxPermanentSlotsExceeded, MaxTemporarySlotsExceeded)",
  },
  aug04qjhbli00: {
    name: "SudoPalletError",
    chains: "rococo, westend",
    paths: ["pallet_sudo.pallet.Error"],
    type: "Enum(RequireSudo)",
  },
  "8rdpads1sa84": {
    name: "ProxyEvent",
    chains: "westend",
    paths: ["pallet_proxy.pallet.Event"],
    type: "Enum(ProxyExecuted, PureCreated, Announced, ProxyAdded, ProxyRemoved)",
  },
  fbiij71gdkvth: {
    name: "WestendRuntimeProxyType",
    chains: "westend",
    paths: ["westend_runtime.ProxyType"],
    type: "Enum(Any, NonTransfer, Governance, Staking, SudoBalances, IdentityJudgement, CancelProxy, Auction, NominationPools)",
  },
}

const knownTypes: KnownTypes = mapObject(
  knownTypesRepository,
  (entry: RepositoryEntry) => (typeof entry === "string" ? entry : entry.name),
)
export default knownTypes
