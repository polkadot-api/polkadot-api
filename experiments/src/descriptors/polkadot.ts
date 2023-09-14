import {
  Struct,
  compactBn,
  Enum,
  _void,
  Tuple,
  u32,
  u64,
  str,
  Vector,
  Bytes,
  u8,
  u16,
  Codec,
  CodecType,
  u128,
} from "@unstoppablejs/substrate-bindings"

const cSp_weightsWeight_v2Weight = Struct({
  ref_time: compactBn,
  proof_size: compactBn,
})
export type cSp_weightsWeight_v2Weight = CodecType<
  typeof cSp_weightsWeight_v2Weight
>

const cOptionSome = Tuple(cSp_weightsWeight_v2Weight)
export type cOptionSome = CodecType<typeof cOptionSome>

const cOption = Enum({ None: _void, Some: cOptionSome })
export type cOption = CodecType<typeof cOption>

const cFrame_systemLimitsWeightsPerClass = Struct({
  base_extrinsic: cSp_weightsWeight_v2Weight,
  max_extrinsic: cOption,
  max_total: cOption,
  reserved: cOption,
})
export type cFrame_systemLimitsWeightsPerClass = CodecType<
  typeof cFrame_systemLimitsWeightsPerClass
>

const cFrame_supportDispatchPerDispatchClass = Struct({
  normal: cFrame_systemLimitsWeightsPerClass,
  operational: cFrame_systemLimitsWeightsPerClass,
  mandatory: cFrame_systemLimitsWeightsPerClass,
})
export type cFrame_supportDispatchPerDispatchClass = CodecType<
  typeof cFrame_supportDispatchPerDispatchClass
>

const cFrame_systemLimitsBlockWeights = Struct({
  base_block: cSp_weightsWeight_v2Weight,
  max_block: cSp_weightsWeight_v2Weight,
  per_class: cFrame_supportDispatchPerDispatchClass,
})
export type cFrame_systemLimitsBlockWeights = CodecType<
  typeof cFrame_systemLimitsBlockWeights
>

const cSp_weightsRuntimeDbWeight = Struct({ read: u64, write: u64 })
export type cSp_weightsRuntimeDbWeight = CodecType<
  typeof cSp_weightsRuntimeDbWeight
>

const cdc198 = Bytes(8)
export type cdc198 = CodecType<typeof cdc198>

const cdc493 = Tuple(cdc198, u32)
export type cdc493 = CodecType<typeof cdc493>

const cdc492 = Vector(cdc493)
export type cdc492 = CodecType<typeof cdc492>

const cSp_versionRuntimeVersion = Struct({
  spec_name: str,
  impl_name: str,
  authoring_version: u32,
  spec_version: u32,
  impl_version: u32,
  apis: cdc492,
  transaction_version: u32,
  state_version: u8,
})
export type cSp_versionRuntimeVersion = CodecType<
  typeof cSp_versionRuntimeVersion
>

const cFrame_supportDispatchDispatchClass = Enum({
  Normal: _void,
  Operational: _void,
  Mandatory: _void,
})
export type cFrame_supportDispatchDispatchClass = CodecType<
  typeof cFrame_supportDispatchDispatchClass
>

const cFrame_supportDispatchPays = Enum({ Yes: _void, No: _void })
export type cFrame_supportDispatchPays = CodecType<
  typeof cFrame_supportDispatchPays
>

const cFrame_supportDispatchDispatchInfo = Struct({
  weight: cSp_weightsWeight_v2Weight,
  class: cFrame_supportDispatchDispatchClass,
  pays_fee: cFrame_supportDispatchPays,
})
export type cFrame_supportDispatchDispatchInfo = CodecType<
  typeof cFrame_supportDispatchDispatchInfo
>

const cFrame_systemPalletEventExtrinsicSuccess = Struct({
  dispatch_info: cFrame_supportDispatchDispatchInfo,
})
export type cFrame_systemPalletEventExtrinsicSuccess = CodecType<
  typeof cFrame_systemPalletEventExtrinsicSuccess
>

const cdc17 = Bytes(4)
export type cdc17 = CodecType<typeof cdc17>

const cSp_runtimeModuleError = Struct({ index: u8, error: cdc17 })
export type cSp_runtimeModuleError = CodecType<typeof cSp_runtimeModuleError>

const cSp_runtimeDispatchErrorModule = Tuple(cSp_runtimeModuleError)
export type cSp_runtimeDispatchErrorModule = CodecType<
  typeof cSp_runtimeDispatchErrorModule
>

const cSp_runtimeTokenError = Enum({
  FundsUnavailable: _void,
  OnlyProvider: _void,
  BelowMinimum: _void,
  CannotCreate: _void,
  UnknownAsset: _void,
  Frozen: _void,
  Unsupported: _void,
  CannotCreateHold: _void,
  NotExpendable: _void,
  Blocked: _void,
})
export type cSp_runtimeTokenError = CodecType<typeof cSp_runtimeTokenError>

const cSp_runtimeDispatchErrorToken = Tuple(cSp_runtimeTokenError)
export type cSp_runtimeDispatchErrorToken = CodecType<
  typeof cSp_runtimeDispatchErrorToken
>

const cSp_arithmeticArithmeticError = Enum({
  Underflow: _void,
  Overflow: _void,
  DivisionByZero: _void,
})
export type cSp_arithmeticArithmeticError = CodecType<
  typeof cSp_arithmeticArithmeticError
>

const cSp_runtimeDispatchErrorArithmetic = Tuple(cSp_arithmeticArithmeticError)
export type cSp_runtimeDispatchErrorArithmetic = CodecType<
  typeof cSp_runtimeDispatchErrorArithmetic
>

const cSp_runtimeTransactionalError = Enum({
  LimitReached: _void,
  NoLayer: _void,
})
export type cSp_runtimeTransactionalError = CodecType<
  typeof cSp_runtimeTransactionalError
>

const cSp_runtimeDispatchErrorTransactional = Tuple(
  cSp_runtimeTransactionalError,
)
export type cSp_runtimeDispatchErrorTransactional = CodecType<
  typeof cSp_runtimeDispatchErrorTransactional
>

const cSp_runtimeDispatchError = Enum({
  Other: _void,
  CannotLookup: _void,
  BadOrigin: _void,
  Module: cSp_runtimeDispatchErrorModule,
  ConsumerRemaining: _void,
  NoProviders: _void,
  TooManyConsumers: _void,
  Token: cSp_runtimeDispatchErrorToken,
  Arithmetic: cSp_runtimeDispatchErrorArithmetic,
  Transactional: cSp_runtimeDispatchErrorTransactional,
  Exhausted: _void,
  Corruption: _void,
  Unavailable: _void,
  RootNotAllowed: _void,
})
export type cSp_runtimeDispatchError = CodecType<
  typeof cSp_runtimeDispatchError
>

const cFrame_systemPalletEventExtrinsicFailed = Struct({
  dispatch_error: cSp_runtimeDispatchError,
  dispatch_info: cFrame_supportDispatchDispatchInfo,
})
export type cFrame_systemPalletEventExtrinsicFailed = CodecType<
  typeof cFrame_systemPalletEventExtrinsicFailed
>

const cdc1 = Bytes(32)
export type cdc1 = CodecType<typeof cdc1>

const cFrame_systemPalletEventNewAccount = Struct({ account: cdc1 })
export type cFrame_systemPalletEventNewAccount = CodecType<
  typeof cFrame_systemPalletEventNewAccount
>

const cFrame_systemPalletEventKilledAccount = Struct({ account: cdc1 })
export type cFrame_systemPalletEventKilledAccount = CodecType<
  typeof cFrame_systemPalletEventKilledAccount
>

const cFrame_systemPalletEventRemarked = Struct({ sender: cdc1, hash: cdc1 })
export type cFrame_systemPalletEventRemarked = CodecType<
  typeof cFrame_systemPalletEventRemarked
>

const cFrame_systemPalletEvent = Enum({
  ExtrinsicSuccess: cFrame_systemPalletEventExtrinsicSuccess,
  ExtrinsicFailed: cFrame_systemPalletEventExtrinsicFailed,
  CodeUpdated: _void,
  NewAccount: cFrame_systemPalletEventNewAccount,
  KilledAccount: cFrame_systemPalletEventKilledAccount,
  Remarked: cFrame_systemPalletEventRemarked,
})
export type cFrame_systemPalletEvent = CodecType<
  typeof cFrame_systemPalletEvent
>

const cFrame_systemPalletEventCodeUpdated = _void
export type cFrame_systemPalletEventCodeUpdated = CodecType<
  typeof cFrame_systemPalletEventCodeUpdated
>

const cFrame_systemPalletError = Enum({
  InvalidSpecName: _void,
  SpecVersionNeedsToIncrease: _void,
  FailedToExtractRuntimeVersion: _void,
  NonDefaultComposite: _void,
  NonZeroRefCount: _void,
  CallFiltered: _void,
})
export type cFrame_systemPalletError = CodecType<
  typeof cFrame_systemPalletError
>

const cFrame_systemPalletErrorInvalidSpecName = _void
export type cFrame_systemPalletErrorInvalidSpecName = CodecType<
  typeof cFrame_systemPalletErrorInvalidSpecName
>

const cFrame_systemPalletErrorSpecVersionNeedsToIncrease = _void
export type cFrame_systemPalletErrorSpecVersionNeedsToIncrease = CodecType<
  typeof cFrame_systemPalletErrorSpecVersionNeedsToIncrease
>

const cFrame_systemPalletErrorFailedToExtractRuntimeVersion = _void
export type cFrame_systemPalletErrorFailedToExtractRuntimeVersion = CodecType<
  typeof cFrame_systemPalletErrorFailedToExtractRuntimeVersion
>

const cFrame_systemPalletErrorNonDefaultComposite = _void
export type cFrame_systemPalletErrorNonDefaultComposite = CodecType<
  typeof cFrame_systemPalletErrorNonDefaultComposite
>

const cFrame_systemPalletErrorNonZeroRefCount = _void
export type cFrame_systemPalletErrorNonZeroRefCount = CodecType<
  typeof cFrame_systemPalletErrorNonZeroRefCount
>

const cFrame_systemPalletErrorCallFiltered = _void
export type cFrame_systemPalletErrorCallFiltered = CodecType<
  typeof cFrame_systemPalletErrorCallFiltered
>

const _bytesSeq = Bytes()
export type _bytesSeq = CodecType<typeof _bytesSeq>

const cFrame_systemPalletCallRemarkTupled: Codec<
  [remark: CodecType<typeof _bytesSeq>]
> = Tuple(_bytesSeq)
export type cFrame_systemPalletCallRemarkTupled = CodecType<
  typeof cFrame_systemPalletCallRemarkTupled
>

const _emptyTuple: Codec<[]> = Tuple()
export type _emptyTuple = CodecType<typeof _emptyTuple>

const cPallet_balancesTypesAccountData = Struct({
  free: u128,
  reserved: u128,
  frozen: u128,
  flags: u128,
})
export type cPallet_balancesTypesAccountData = CodecType<
  typeof cPallet_balancesTypesAccountData
>

const cSp_coreCryptoAccountId32Tupled: Codec<[key: CodecType<typeof cdc1>]> =
  Tuple(cdc1)
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>

const cPallet_balancesTypesReasons = Enum({
  Fee: _void,
  Misc: _void,
  All: _void,
})
export type cPallet_balancesTypesReasons = CodecType<
  typeof cPallet_balancesTypesReasons
>

const cPallet_balancesTypesBalanceLock = Struct({
  id: cdc198,
  amount: u128,
  reasons: cPallet_balancesTypesReasons,
})
export type cPallet_balancesTypesBalanceLock = CodecType<
  typeof cPallet_balancesTypesBalanceLock
>

const cdc526 = Vector(cPallet_balancesTypesBalanceLock)
export type cdc526 = CodecType<typeof cdc526>

const cPallet_balancesTypesReserveData = Struct({ id: cdc198, amount: u128 })
export type cPallet_balancesTypesReserveData = CodecType<
  typeof cPallet_balancesTypesReserveData
>

const cdc529 = Vector(cPallet_balancesTypesReserveData)
export type cdc529 = CodecType<typeof cdc529>

const cPallet_balancesTypesIdAmount = Struct({ id: _void, amount: u128 })
export type cPallet_balancesTypesIdAmount = CodecType<
  typeof cPallet_balancesTypesIdAmount
>

const cdc532 = Vector(cPallet_balancesTypesIdAmount)
export type cdc532 = CodecType<typeof cdc532>
