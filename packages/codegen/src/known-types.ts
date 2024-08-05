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
  "90bksimft5ia2": {
    name: "DispatchClass",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["frame_support.dispatch.DispatchClass"],
    type: "Enum(Normal, Operational, Mandatory)",
  },
  bs6bhe2r7m6td: {
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
  "9cmn4io0j9mpl": {
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
  d6duv772jaaa0: {
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
  "66qtljfd6i677": {
    name: "XcmV4AssetAssetFilter",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["staging_xcm.v4.asset.AssetFilter"],
    type: "Enum(Definite, Wild)",
  },
  cku6hgs8hjfqa: {
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
  "7me17hgokelki": {
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
  "1trqm68a7fenf": {
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
  "8p3ln685h7ol1": {
    name: "UtilityEvent",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_utility.pallet.Event"],
    type: "Enum(BatchInterrupted, BatchCompleted, BatchCompletedWithErrors, ItemCompleted, ItemFailed, DispatchedAs)",
  },
  "2qs1hjak060gk": {
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
  "5q3tcdcggtlkj": {
    name: "AssetRateEvent",
    chains:
      "polkadot, polkadot.collectives, rococo, westend, westend.collectives",
    paths: ["pallet_asset_rate.pallet.Event"],
    type: "Enum(AssetRateCreated, AssetRateRemoved, AssetRateUpdated)",
  },
  d4g21730lle69: {
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
  cgde8bg5ldqpa: {
    name: "PreimagesBounded",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["frame_support.traits.preimages.Bounded"],
    type: "Enum(Legacy, Inline, Lookup)",
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
  "1j7evrcrgodra": {
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
  akrveodqukat1: {
    name: "XcmPalletOrigin",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.Origin"],
    type: "Enum(Xcm, Response)",
  },
  e3otks9vj8a3b: {
    name: "TraitsScheduleDispatchTime",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["frame_support.traits.schedule.DispatchTime"],
    type: "Enum(At, After)",
  },
  ck9ts6e39igvh: {
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
  fcqan2gt5adqc: {
    name: "TransactionPaymentReleases",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_transaction_payment.Releases"],
    type: "Enum(V1Ancient, V2)",
  },
  b2qkcg6rhftj: {
    name: "XcmPalletQueryStatus",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["pallet_xcm.pallet.QueryStatus"],
    type: "Enum(Pending, VersionNotifier, Ready)",
  },
  "8aae4pf8l97h0": {
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
  cafl5em0g3d0j: {
    name: "XcmVersionedAssetId",
    chains:
      "polkadot, polkadot.assetHub, polkadot.bridgeHub, polkadot.collectives, kusama.assetHub, kusama.bridgeHub, rococo, rococo.assetHub, westend, westend.assetHub, westend.bridgeHub, westend.collectives",
    paths: ["xcm.VersionedAssetId"],
    type: "Enum(V3, V4)",
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
  "926pkc9itkbdk": {
    name: "ReferendaTypesCurve",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_referenda.types.Curve"],
    type: "Enum(LinearDecreasing, SteppedDecreasing, Reciprocal)",
  },
  "8mdo9fqa201s6": {
    name: "TreasuryPaymentState",
    chains:
      "polkadot, polkadot.collectives, kusama, rococo, westend, westend.collectives",
    paths: ["pallet_treasury.PaymentState"],
    type: "Enum(Pending, Attempted, Failed)",
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
  e4o50pgs5mq4e: {
    name: "AssetsEvent",
    chains:
      "polkadot.assetHub, kusama.assetHub, rococo.assetHub, westend.assetHub",
    paths: ["pallet_assets.pallet.Event"],
    type: "Enum(Created, Issued, Transferred, Burned, TeamChanged, OwnerChanged, Frozen, Thawed, AssetFrozen, AssetThawed, AccountsDestroyed, ApprovalsDestroyed, DestructionStarted, Destroyed, ForceCreated, MetadataSet, MetadataCleared, ApprovedTransfer, ApprovalCancelled, TransferredApproved, AssetStatusChanged, AssetMinBalanceChanged, Touched, Blocked)",
  },
  "47abi8eqlfs7h": {
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
  "60a08att731k3": {
    name: "PolkadotRuntimeRuntimeCall",
    chains: "polkadot",
    paths: ["polkadot_runtime.RuntimeCall"],
    type: "Enum(System, Scheduler, Preimage, Babe, Timestamp, Indices, Balances, Staking, Session, Grandpa, Treasury, ConvictionVoting, Referenda, Whitelist, Claims, Vesting, Utility, Identity, Proxy, Multisig, Bounties, ChildBounties, ElectionProviderMultiPhase, VoterList, NominationPools, FastUnstake, Configuration, ParasShared, ParaInclusion, ParaInherent, Paras, Initializer, Hrmp, ParasDisputes, ParasSlashing, Registrar, Slots, Auctions, Crowdloan, StateTrieMigration, XcmPallet, MessageQueue, AssetRate, Beefy)",
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
  brvqfk00lp42n: {
    name: "GrandpaEquivocation",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_consensus_grandpa.Equivocation"],
    type: "Enum(Prevote, Precommit)",
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
  aq3lhf9801fip: {
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
  "9lvi13skegcil": {
    name: "ClaimsStatementKind",
    chains: "polkadot, kusama, rococo",
    paths: ["polkadot_runtime_common.claims.StatementKind"],
    type: "Enum(Regular, Saft)",
  },
  "4pmimn9ms9vd4": {
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
  "3tnqcv58l4e62": {
    name: "ProxyType",
    chains: "polkadot",
    paths: ["polkadot_runtime.ProxyType"],
    type: "Enum(Any, NonTransfer, Governance, Staking, IdentityJudgement, CancelProxy, Auction, NominationPools)",
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
  "8jjr2rgj6aa2v": {
    name: "SlashingOffenceKind",
    chains: "polkadot, kusama, rococo, westend",
    paths: [
      "polkadot_primitives.v6.slashing.SlashingOffenceKind",
      "polkadot_primitives.v7.slashing.SlashingOffenceKind",
    ],
    type: "Enum(ForInvalid, AgainstValid)",
  },
  d7em8997pfm92: {
    name: "MultiSigner",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["sp_runtime.MultiSigner"],
    type: "Enum(Ed25519, Sr25519, Ecdsa)",
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
  bq3e4bkepuci0: {
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
  e4no561hfc2v2: {
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
  e8uj8pd0qd8ff: {
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
  "3odkl16hqvkd7": {
    name: "CommonCrowdloanEvent",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.pallet.Event"],
    type: "Enum(Created, Contributed, Withdrew, PartiallyRefunded, AllRefunded, Dissolved, HandleBidResult, Edited, MemoUpdated, AddedToNewRaise)",
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
  "66mc66cqnpat1": {
    name: "GrandpaStoredState",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_grandpa.StoredState"],
    type: "Enum(Live, PendingPause, Paused, PendingResume)",
  },
  e5ojv0odma80: {
    name: "ConvictionVotingVoteVoting",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["pallet_conviction_voting.vote.Voting"],
    type: "Enum(Casting, Delegating)",
  },
  "8eicfpc71dtp2": {
    name: "BountiesBountyStatus",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_bounties.BountyStatus"],
    type: "Enum(Proposed, Approved, Funded, CuratorProposed, Active, PendingPayout)",
  },
  "8fgf6e6g02u7k": {
    name: "ChildBountyStatus",
    chains: "polkadot, kusama, rococo",
    paths: ["pallet_child_bounties.ChildBountyStatus"],
    type: "Enum(Added, CuratorProposed, Active, PendingPayout)",
  },
  "5h5t0elhnbseq": {
    name: "BagsListListListError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_bags_list.list.ListError"],
    type: "Enum(Duplicate, NotHeavier, NotInSameBag, NodeNotFound)",
  },
  "8s9terlv6i0tr": {
    name: "NominationPoolsPalletDefensiveError",
    chains: "polkadot, kusama, westend",
    paths: ["pallet_nomination_pools.pallet.DefensiveError"],
    type: "Enum(NotEnoughSpaceInUnbondPool, PoolNotFound, RewardPoolNotFound, SubPoolsNotFound, BondedStashKilledPrematurely)",
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
  "1rjg0rh02tt4m": {
    name: "CommonCrowdloanLastContribution",
    chains: "polkadot, kusama, rococo, westend",
    paths: ["polkadot_runtime_common.crowdloan.LastContribution"],
    type: "Enum(Never, PreEnding, Ending)",
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
  "86spl6bcfm5it": {
    name: "KsmXcmV3Junctions",
    chains: "kusama",
    paths: ["xcm.v3.junctions.Junctions"],
    type: "Enum(Here, X1, X2, X3, X4, X5, X6, X7, X8)",
  },
  aqrmqn3umgltq: {
    name: "KsmXcmV3Junction",
    chains: "kusama",
    paths: ["xcm.v3.junction.Junction"],
    type: "Enum(Parachain, AccountId32, AccountIndex64, AccountKey20, PalletInstance, GeneralIndex, GeneralKey, OnlyChild, Plurality, GlobalConsensus)",
  },
  "4k01tahcim329": {
    name: "KsmXcmV3JunctionNetworkId",
    chains: "kusama",
    paths: ["xcm.v3.junction.NetworkId"],
    type: "Enum(ByGenesis, ByFork, Polkadot, Kusama, Westend, Rococo, Wococo, Ethereum, BitcoinCore, BitcoinCash)",
  },
  c00osfu517iss: {
    name: "KsmXcmV3MultiassetAssetId",
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
    name: "KsmXcmPalletOrigin",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.Origin"],
    type: "Enum(Xcm, Response)",
  },
  apijri6pqtqte: {
    name: "IdentityField",
    chains: "kusama",
    paths: ["pallet_identity.simple.IdentityField"],
    type: "Enum(Display, Legal, Web, Riot, Email, PgpFingerprint, Image, Twitter)",
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
    name: "KsmXcmVersionedXcm",
    chains: "kusama",
    paths: ["xcm.VersionedXcm"],
    type: "Enum(V2, V3)",
  },
  css00hl25cgl4: {
    name: "KsmXcmV3Instruction",
    chains: "kusama",
    paths: ["xcm.v3.Instruction"],
    type: "Enum(WithdrawAsset, ReserveAssetDeposited, ReceiveTeleportedAsset, QueryResponse, TransferAsset, TransferReserveAsset, Transact, HrmpNewChannelOpenRequest, HrmpChannelAccepted, HrmpChannelClosing, ClearOrigin, DescendOrigin, ReportError, DepositAsset, DepositReserveAsset, ExchangeAsset, InitiateReserveWithdraw, InitiateTeleport, ReportHolding, BuyExecution, RefundSurplus, SetErrorHandler, SetAppendix, ClearError, ClaimAsset, Trap, SubscribeVersion, UnsubscribeVersion, BurnAsset, ExpectAsset, ExpectOrigin, ExpectError, ExpectTransactStatus, QueryPallet, ExpectPallet, ReportTransactStatus, ClearTransactStatus, UniversalOrigin, ExportMessage, LockAsset, UnlockAsset, NoteUnlockable, RequestUnlock, SetFeesMode, SetTopic, ClearTopic, AliasOrigin, UnpaidExecution)",
  },
  "4e56rm9p07o27": {
    name: "KsmXcmV3Response",
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
  a4b928jbpau7j: {
    name: "RecoveryEvent",
    chains: "kusama, rococo, westend",
    paths: ["pallet_recovery.pallet.Event"],
    type: "Enum(RecoveryCreated, RecoveryInitiated, RecoveryVouched, RecoveryClosed, AccountRecovered, RecoveryRemoved)",
  },
  b01fvb3ofrhi8: {
    name: "XcmV3TraitsOutcome",
    chains: "kusama",
    paths: ["xcm.v3.traits.Outcome"],
    type: "Enum(Complete, Incomplete, Error)",
  },
  arof15is9j858: {
    name: "KsmBabeDigestsPreDigest",
    chains: "kusama",
    paths: ["sp_consensus_babe.digests.PreDigest"],
    type: "Enum(Primary, SecondaryPlain, SecondaryVRF)",
  },
  b19964q7gq7o9: {
    name: "PolkadotPrimitivesV5CoreOccupied",
    chains: "kusama",
    paths: ["polkadot_runtime_parachains.scheduler.pallet.CoreOccupied"],
    type: "Enum(Free, Paras)",
  },
  "9us7218h9qeio": {
    name: "KsmXcmPalletQueryStatus",
    chains: "kusama",
    paths: ["pallet_xcm.pallet.QueryStatus"],
    type: "Enum(Pending, VersionNotifier, Ready)",
  },
  fjsumieiq38rh: {
    name: "KsmXcmVersionedResponse",
    chains: "kusama",
    paths: ["xcm.VersionedResponse"],
    type: "Enum(V2, V3)",
  },
  "9j0cetcqgjtaf": {
    name: "KsmXcmVersionedAssetId",
    chains: "kusama",
    paths: ["xcm.VersionedAssetId"],
    type: "Enum(V3)",
  },
  c6naohf7oto22: {
    name: "WestendRuntimeOriginCaller",
    chains: "rococo, westend",
    paths: ["rococo_runtime.OriginCaller", "westend_runtime.OriginCaller"],
    type: "Enum(system, Origins, ParachainsOrigin, XcmPallet, Void)",
  },
  cgoc620vdl0ci: {
    name: "BrokerCoretimeInterfaceCoreAssignment",
    chains: "rococo, westend",
    paths: ["pallet_broker.coretime_interface.CoreAssignment"],
    type: "Enum(Idle, Pool, Task)",
  },
  "910lmkjcsvii": {
    name: "PolkadotRuntimeCommonAssignedSlotsSlotLeasePeriodStart",
    chains: "rococo, westend",
    paths: ["polkadot_runtime_common.assigned_slots.SlotLeasePeriodStart"],
    type: "Enum(Current, Next)",
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
  av7m2gstbfp8n: {
    name: "SudoEvent",
    chains: "rococo, westend",
    paths: ["pallet_sudo.pallet.Event"],
    type: "Enum(Sudid, KeyChanged, KeyRemoved, SudoAsDone)",
  },
  "8pk5bmb6e1dro": {
    name: "ReferendaTypesReferendumInfo",
    chains: "rococo, westend",
    paths: ["pallet_referenda.types.ReferendumInfo"],
    type: "Enum(Ongoing, Approved, Rejected, Cancelled, TimedOut, Killed)",
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
