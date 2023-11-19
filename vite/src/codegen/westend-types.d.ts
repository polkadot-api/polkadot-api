import {
  _void,
  compactNumber,
  compactBn,
  Codec,
  CodecType,
  SS58String,
  HexString,
} from "@polkadot-api/substrate-bindings"
declare const _accountId: Codec<SS58String>
export type _accountId = CodecType<typeof _accountId>
declare const cPallet_balancesPalletEventEndowed: Codec<{
  account: SS58String
  free_balance: bigint
}>
export type cPallet_balancesPalletEventEndowed = CodecType<
  typeof cPallet_balancesPalletEventEndowed
>
declare const cPallet_balancesPalletEventDustLost: Codec<{
  account: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventDustLost = CodecType<
  typeof cPallet_balancesPalletEventDustLost
>
declare const cPallet_balancesPalletEventTransfer: Codec<{
  from: SS58String
  to: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventTransfer = CodecType<
  typeof cPallet_balancesPalletEventTransfer
>
declare const cPallet_balancesPalletEventBalanceSet: Codec<{
  who: SS58String
  free: bigint
}>
export type cPallet_balancesPalletEventBalanceSet = CodecType<
  typeof cPallet_balancesPalletEventBalanceSet
>
declare const cPallet_balancesPalletEventReserved: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventReserved = CodecType<
  typeof cPallet_balancesPalletEventReserved
>
declare const cPallet_balancesPalletEventUnreserved: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventUnreserved = CodecType<
  typeof cPallet_balancesPalletEventUnreserved
>
type IcFrame_supportTraitsTokensMiscBalanceStatus = Codec<
  | {
      tag: "Free"
      value: CodecType<typeof _void>
    }
  | {
      tag: "Reserved"
      value: CodecType<typeof _void>
    }
>
declare const cFrame_supportTraitsTokensMiscBalanceStatus: IcFrame_supportTraitsTokensMiscBalanceStatus
export type cFrame_supportTraitsTokensMiscBalanceStatus = CodecType<
  typeof cFrame_supportTraitsTokensMiscBalanceStatus
>
declare const cPallet_balancesPalletEventReserveRepatriated: Codec<{
  from: SS58String
  to: SS58String
  amount: bigint
  destination_status:
    | {
        tag: "Free"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Reserved"
        value: CodecType<typeof _void>
      }
}>
export type cPallet_balancesPalletEventReserveRepatriated = CodecType<
  typeof cPallet_balancesPalletEventReserveRepatriated
>
declare const cPallet_balancesPalletEventDeposit: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventDeposit = CodecType<
  typeof cPallet_balancesPalletEventDeposit
>
declare const cPallet_balancesPalletEventWithdraw: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventWithdraw = CodecType<
  typeof cPallet_balancesPalletEventWithdraw
>
declare const cPallet_balancesPalletEventSlashed: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventSlashed = CodecType<
  typeof cPallet_balancesPalletEventSlashed
>
declare const cPallet_balancesPalletEventMinted: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventMinted = CodecType<
  typeof cPallet_balancesPalletEventMinted
>
declare const cPallet_balancesPalletEventBurned: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventBurned = CodecType<
  typeof cPallet_balancesPalletEventBurned
>
declare const cPallet_balancesPalletEventSuspended: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventSuspended = CodecType<
  typeof cPallet_balancesPalletEventSuspended
>
declare const cPallet_balancesPalletEventRestored: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventRestored = CodecType<
  typeof cPallet_balancesPalletEventRestored
>
declare const cPallet_balancesPalletEventUpgraded: Codec<{
  who: SS58String
}>
export type cPallet_balancesPalletEventUpgraded = CodecType<
  typeof cPallet_balancesPalletEventUpgraded
>
declare const cPallet_balancesPalletEventIssued: Codec<{
  amount: bigint
}>
export type cPallet_balancesPalletEventIssued = CodecType<
  typeof cPallet_balancesPalletEventIssued
>
declare const cPallet_balancesPalletEventRescinded: Codec<{
  amount: bigint
}>
export type cPallet_balancesPalletEventRescinded = CodecType<
  typeof cPallet_balancesPalletEventRescinded
>
declare const cPallet_balancesPalletEventLocked: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventLocked = CodecType<
  typeof cPallet_balancesPalletEventLocked
>
declare const cPallet_balancesPalletEventUnlocked: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventUnlocked = CodecType<
  typeof cPallet_balancesPalletEventUnlocked
>
declare const cPallet_balancesPalletEventFrozen: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventFrozen = CodecType<
  typeof cPallet_balancesPalletEventFrozen
>
declare const cPallet_balancesPalletEventThawed: Codec<{
  who: SS58String
  amount: bigint
}>
export type cPallet_balancesPalletEventThawed = CodecType<
  typeof cPallet_balancesPalletEventThawed
>
type IcPallet_balancesPalletEvent = Codec<
  | {
      tag: "Endowed"
      value: CodecType<typeof cPallet_balancesPalletEventEndowed>
    }
  | {
      tag: "DustLost"
      value: CodecType<typeof cPallet_balancesPalletEventDustLost>
    }
  | {
      tag: "Transfer"
      value: CodecType<typeof cPallet_balancesPalletEventTransfer>
    }
  | {
      tag: "BalanceSet"
      value: CodecType<typeof cPallet_balancesPalletEventBalanceSet>
    }
  | {
      tag: "Reserved"
      value: CodecType<typeof cPallet_balancesPalletEventReserved>
    }
  | {
      tag: "Unreserved"
      value: CodecType<typeof cPallet_balancesPalletEventUnreserved>
    }
  | {
      tag: "ReserveRepatriated"
      value: CodecType<typeof cPallet_balancesPalletEventReserveRepatriated>
    }
  | {
      tag: "Deposit"
      value: CodecType<typeof cPallet_balancesPalletEventDeposit>
    }
  | {
      tag: "Withdraw"
      value: CodecType<typeof cPallet_balancesPalletEventWithdraw>
    }
  | {
      tag: "Slashed"
      value: CodecType<typeof cPallet_balancesPalletEventSlashed>
    }
  | {
      tag: "Minted"
      value: CodecType<typeof cPallet_balancesPalletEventMinted>
    }
  | {
      tag: "Burned"
      value: CodecType<typeof cPallet_balancesPalletEventBurned>
    }
  | {
      tag: "Suspended"
      value: CodecType<typeof cPallet_balancesPalletEventSuspended>
    }
  | {
      tag: "Restored"
      value: CodecType<typeof cPallet_balancesPalletEventRestored>
    }
  | {
      tag: "Upgraded"
      value: CodecType<typeof cPallet_balancesPalletEventUpgraded>
    }
  | {
      tag: "Issued"
      value: CodecType<typeof cPallet_balancesPalletEventIssued>
    }
  | {
      tag: "Rescinded"
      value: CodecType<typeof cPallet_balancesPalletEventRescinded>
    }
  | {
      tag: "Locked"
      value: CodecType<typeof cPallet_balancesPalletEventLocked>
    }
  | {
      tag: "Unlocked"
      value: CodecType<typeof cPallet_balancesPalletEventUnlocked>
    }
  | {
      tag: "Frozen"
      value: CodecType<typeof cPallet_balancesPalletEventFrozen>
    }
  | {
      tag: "Thawed"
      value: CodecType<typeof cPallet_balancesPalletEventThawed>
    }
>
declare const cPallet_balancesPalletEvent: IcPallet_balancesPalletEvent
export type cPallet_balancesPalletEvent = CodecType<
  typeof cPallet_balancesPalletEvent
>
declare const _bytesSeq: Codec<HexString>
export type _bytesSeq = CodecType<typeof _bytesSeq>
declare const cdc102: Codec<HexString>
export type cdc102 = CodecType<typeof cdc102>
type IcSp_runtimeMultiaddressMultiAddress = Codec<
  | {
      tag: "Id"
      value: CodecType<typeof _accountId>
    }
  | {
      tag: "Index"
      value: CodecType<typeof compactNumber>
    }
  | {
      tag: "Raw"
      value: CodecType<typeof _bytesSeq>
    }
  | {
      tag: "Address32"
      value: CodecType<typeof _accountId>
    }
  | {
      tag: "Address20"
      value: CodecType<typeof cdc102>
    }
>
declare const cSp_runtimeMultiaddressMultiAddress: IcSp_runtimeMultiaddressMultiAddress
export type cSp_runtimeMultiaddressMultiAddress = CodecType<
  typeof cSp_runtimeMultiaddressMultiAddress
>
type IcPallet_balancesPalletCallTransfer_keep_aliveTupled = Codec<
  [
    CodecType<typeof cSp_runtimeMultiaddressMultiAddress>,
    CodecType<typeof compactBn>,
  ]
>
declare const cPallet_balancesPalletCallTransfer_keep_aliveTupled: IcPallet_balancesPalletCallTransfer_keep_aliveTupled
export type cPallet_balancesPalletCallTransfer_keep_aliveTupled = CodecType<
  typeof cPallet_balancesPalletCallTransfer_keep_aliveTupled
>
export {}
