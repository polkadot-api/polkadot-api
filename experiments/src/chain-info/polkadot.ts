import {
  u32,
  CodecType,
  u128,
  _void,
  u8,
  getPalletCreator,
} from "@polkadot-api/substrate-bindings"
import type {
  ArgsWithPayloadCodec,
  StorageDescriptor,
} from "@polkadot-api/substrate-bindings"
import type {
  _emptyTuple,
  _accountId,
  cdc104,
  cSp_coreCryptoAccountId32Tupled,
  cPallet_stakingStakingLedger,
  cPallet_stakingRewardDestination,
  cPallet_stakingValidatorPrefs,
  cPallet_stakingNominations,
  cPallet_stakingActiveEraInfo,
  cdc4Tupled,
  cPallet_stakingExposure,
  cdc545,
  cPallet_stakingEraRewardPoints,
  cPallet_stakingForcing,
  cdc550,
  cdc481,
  cdc552,
  cPallet_stakingSlashingSlashingSpans,
  cPallet_stakingSlashingSpanRecord,
  cdc549Tupled,
  cdc555,
  _fixedStr0,
  _fixedStr1,
  _fixedStr2,
  _fixedStr3,
  _fixedStr4,
  _fixedStr5,
  _fixedStr6,
  _fixedStr7,
  _fixedStr8,
  _fixedStr9,
  _fixedStr10,
  _fixedStr11,
  _fixedStr12,
  _fixedStr13,
  _fixedStr14,
  _fixedStr15,
  _fixedStr16,
  _fixedStr17,
  _fixedStr18,
  _fixedStr19,
  _fixedStr20,
  _fixedStr21,
  _fixedStr22,
  _fixedStr23,
  _fixedStr24,
  _fixedStr25,
  _fixedStr26,
  _fixedStr27,
  _fixedStr28,
  _fixedStr29,
  _fixedStr30,
  _fixedStr31,
  _fixedStr32,
  cPallet_identityTypesRegistration,
  cdc223,
  cdc653,
  cdc658,
} from "./polkadot-types"

type StorageType<
  T extends StorageDescriptor<any, ArgsWithPayloadCodec<any, any>>,
> = T extends StorageDescriptor<
  any,
  ArgsWithPayloadCodec<infer Args, infer Payload>
>
  ? { keyArgs: Args; value: Payload }
  : unknown

const StakingCreator = getPalletCreator("Staking")

const StakingValidatorCountStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "ValidatorCount",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingValidatorCountStorage = StorageType<
  typeof StakingValidatorCountStorage
>

const StakingMinimumValidatorCountStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "MinimumValidatorCount",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingMinimumValidatorCountStorage = StorageType<
  typeof StakingMinimumValidatorCountStorage
>

const StakingInvulnerablesStorage = StakingCreator.getStorageDescriptor(
  9595710288222996231n,
  "Invulnerables",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cdc104>,
)
export type StakingInvulnerablesStorage = StorageType<
  typeof StakingInvulnerablesStorage
>

const StakingBondedStorage = StakingCreator.getStorageDescriptor(
  4990807214815629785n,
  "Bonded",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    _accountId
  >,
)
export type StakingBondedStorage = StorageType<typeof StakingBondedStorage>

const StakingMinNominatorBondStorage = StakingCreator.getStorageDescriptor(
  11739910749150872187n,
  "MinNominatorBond",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u128>>,
)
export type StakingMinNominatorBondStorage = StorageType<
  typeof StakingMinNominatorBondStorage
>

const StakingMinValidatorBondStorage = StakingCreator.getStorageDescriptor(
  11739910749150872187n,
  "MinValidatorBond",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u128>>,
)
export type StakingMinValidatorBondStorage = StorageType<
  typeof StakingMinValidatorBondStorage
>

const StakingMinimumActiveStakeStorage = StakingCreator.getStorageDescriptor(
  11739910749150872187n,
  "MinimumActiveStake",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u128>>,
)
export type StakingMinimumActiveStakeStorage = StorageType<
  typeof StakingMinValidatorBondStorage
>

const StakingMinCommissionStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "MinCommission",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingMinCommissionStorage = StorageType<
  typeof StakingMinCommissionStorage
>

const StakingLedgerStorage = StakingCreator.getStorageDescriptor(
  16599383235077620506n,
  "Ledger",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_stakingStakingLedger
  >,
)
export type StakingLedgerStorage = StorageType<typeof StakingLedgerStorage>

const StakingPayeeStorage = StakingCreator.getStorageDescriptor(
  14983240731579600276n,
  "Payee",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_stakingRewardDestination
  >,
)
export type StakingPayeeStorage = StorageType<typeof StakingPayeeStorage>

const StakingValidatorsStorage = StakingCreator.getStorageDescriptor(
  8147000766871272840n,
  "Validators",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_stakingValidatorPrefs
  >,
)
export type StakingValidatorsStorage = StorageType<
  typeof StakingValidatorsStorage
>

const StakingCounterForValidatorsStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "CounterForValidators",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingCounterForValidatorsStorage = StorageType<
  typeof StakingCounterForValidatorsStorage
>

const StakingMaxValidatorsCountStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "MaxValidatorsCount",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingMaxValidatorsCountStorage = StorageType<
  typeof StakingMaxValidatorsCountStorage
>

const StakingNominatorsStorage = StakingCreator.getStorageDescriptor(
  17320999426850333572n,
  "Nominators",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_stakingNominations
  >,
)
export type StakingNominatorsStorage = StorageType<
  typeof StakingNominatorsStorage
>

const StakingCounterForNominatorsStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "CounterForNominators",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingCounterForNominatorsStorage = StorageType<
  typeof StakingCounterForNominatorsStorage
>

const StakingMaxNominatorsCountStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "MaxNominatorsCount",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingMaxNominatorsCountStorage = StorageType<
  typeof StakingMaxNominatorsCountStorage
>

const StakingCurrentEraStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "CurrentEra",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingCurrentEraStorage = StorageType<
  typeof StakingCurrentEraStorage
>

const StakingActiveEraStorage = StakingCreator.getStorageDescriptor(
  7808466309214672184n,
  "ActiveEra",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cPallet_stakingActiveEraInfo>,
)
export type StakingActiveEraStorage = StorageType<
  typeof StakingActiveEraStorage
>

const StakingErasStartSessionIndexStorage = StakingCreator.getStorageDescriptor(
  15598758350710937805n,
  "ErasStartSessionIndex",
  { len: 1 } as ArgsWithPayloadCodec<cdc4Tupled, CodecType<typeof u32>>,
)
export type StakingErasStartSessionIndexStorage = StorageType<
  typeof StakingErasStartSessionIndexStorage
>

const StakingErasStakersStorage = StakingCreator.getStorageDescriptor(
  8305301168103590367n,
  "ErasStakers",
  { len: 2 } as ArgsWithPayloadCodec<cdc545, cPallet_stakingExposure>,
)
export type StakingErasStakersStorage = StorageType<
  typeof StakingErasStakersStorage
>

const StakingErasStakersClippedStorage = StakingCreator.getStorageDescriptor(
  8305301168103590367n,
  "ErasStakersClipped",
  { len: 2 } as ArgsWithPayloadCodec<cdc545, cPallet_stakingExposure>,
)
export type StakingErasStakersClippedStorage = StorageType<
  typeof StakingErasStakersClippedStorage
>

const StakingErasValidatorPrefsStorage = StakingCreator.getStorageDescriptor(
  6935254455904822647n,
  "ErasValidatorPrefs",
  { len: 2 } as ArgsWithPayloadCodec<cdc545, cPallet_stakingValidatorPrefs>,
)
export type StakingErasValidatorPrefsStorage = StorageType<
  typeof StakingErasValidatorPrefsStorage
>

const StakingErasValidatorRewardStorage = StakingCreator.getStorageDescriptor(
  1299460283915916491n,
  "ErasValidatorReward",
  { len: 1 } as ArgsWithPayloadCodec<cdc4Tupled, CodecType<typeof u128>>,
)
export type StakingErasValidatorRewardStorage = StorageType<
  typeof StakingErasValidatorRewardStorage
>

const StakingErasRewardPointsStorage = StakingCreator.getStorageDescriptor(
  7674248542154448671n,
  "ErasRewardPoints",
  { len: 1 } as ArgsWithPayloadCodec<
    cdc4Tupled,
    cPallet_stakingEraRewardPoints
  >,
)
export type StakingErasRewardPointsStorage = StorageType<
  typeof StakingErasRewardPointsStorage
>

const StakingErasTotalStakeStorage = StakingCreator.getStorageDescriptor(
  1299460283915916491n,
  "ErasTotalStake",
  { len: 1 } as ArgsWithPayloadCodec<cdc4Tupled, CodecType<typeof u128>>,
)
export type StakingErasTotalStakeStorage = StorageType<
  typeof StakingErasTotalStakeStorage
>

const StakingForceEraStorage = StakingCreator.getStorageDescriptor(
  9906044772733035606n,
  "ForceEra",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cPallet_stakingForcing>,
)
export type StakingForceEraStorage = StorageType<typeof StakingForceEraStorage>

const StakingSlashRewardFractionStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "SlashRewardFraction",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingSlashRewardFractionStorage = StorageType<
  typeof StakingSlashRewardFractionStorage
>

const StakingCanceledSlashPayoutStorage = StakingCreator.getStorageDescriptor(
  11739910749150872187n,
  "CanceledSlashPayout",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u128>>,
)
export type StakingCanceledSlashPayoutStorage = StorageType<
  typeof StakingCanceledSlashPayoutStorage
>

const StakingUnappliedSlashesStorage = StakingCreator.getStorageDescriptor(
  2168938891337747056n,
  "UnappliedSlashes",
  { len: 1 } as ArgsWithPayloadCodec<cdc4Tupled, cdc550>,
)
export type StakingUnappliedSlashesStorage = StorageType<
  typeof StakingUnappliedSlashesStorage
>

const StakingBondedErasStorage = StakingCreator.getStorageDescriptor(
  13182175101526355089n,
  "BondedEras",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cdc481>,
)
export type StakingBondedErasStorage = StorageType<
  typeof StakingBondedErasStorage
>

const StakingValidatorSlashInEraStorage = StakingCreator.getStorageDescriptor(
  5522250050680107108n,
  "ValidatorSlashInEra",
  { len: 2 } as ArgsWithPayloadCodec<cdc545, cdc552>,
)
export type StakingValidatorSlashInEraStorage = StorageType<
  typeof StakingValidatorSlashInEraStorage
>

const StakingNominatorSlashInEraStorage = StakingCreator.getStorageDescriptor(
  10880907937610571624n,
  "NominatorSlashInEra",
  { len: 2 } as ArgsWithPayloadCodec<cdc545, CodecType<typeof u128>>,
)
export type StakingNominatorSlashInEraStorage = StorageType<
  typeof StakingNominatorSlashInEraStorage
>

const StakingSlashingSpansStorage = StakingCreator.getStorageDescriptor(
  2188976940198476477n,
  "SlashingSpans",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_stakingSlashingSlashingSpans
  >,
)
export type StakingSlashingSpansStorage = StorageType<
  typeof StakingSlashingSpansStorage
>

const StakingSpanSlashStorage = StakingCreator.getStorageDescriptor(
  11401726906760710988n,
  "SpanSlash",
  { len: 1 } as ArgsWithPayloadCodec<
    cdc549Tupled,
    cPallet_stakingSlashingSpanRecord
  >,
)
export type StakingSpanSlashStorage = StorageType<
  typeof StakingSlashingSpansStorage
>

const StakingCurrentPlannedSessionStorage = StakingCreator.getStorageDescriptor(
  2571917859619161382n,
  "CurrentPlannedSession",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u32>>,
)
export type StakingCurrentPlannedSessionStorage = StorageType<
  typeof StakingSlashingSpansStorage
>

const StakingOffendingValidatorsStorage = StakingCreator.getStorageDescriptor(
  10387756162571061844n,
  "OffendingValidators",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cdc555>,
)
export type StakingOffendingValidatorsStorage = StorageType<
  typeof StakingOffendingValidatorsStorage
>

const StakingChillThresholdStorage = StakingCreator.getStorageDescriptor(
  17595027531443885288n,
  "ChillThreshold",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, CodecType<typeof u8>>,
)
export type StakingChillThresholdStorage = StorageType<
  typeof StakingChillThresholdStorage
>

const IdentityCreator = getPalletCreator("Identity")

const IdentityIdentityOfStorage = IdentityCreator.getStorageDescriptor(
  5720695313478759750n,
  "IdentityOf",
  { len: 1 } as ArgsWithPayloadCodec<
    cSp_coreCryptoAccountId32Tupled,
    cPallet_identityTypesRegistration
  >,
)
export type IdentityIdentityOfStorage = StorageType<
  typeof IdentityIdentityOfStorage
>

const IdentitySuperOfStorage = IdentityCreator.getStorageDescriptor(
  11833126194590017014n,
  "SuperOf",
  { len: 1 } as ArgsWithPayloadCodec<cSp_coreCryptoAccountId32Tupled, cdc223>,
)
export type IdentitySuperOfStorage = StorageType<
  typeof IdentityIdentityOfStorage
>

const IdentitySubsOfStorage = IdentityCreator.getStorageDescriptor(
  10821892280689755428n,
  "SubsOf",
  { len: 1 } as ArgsWithPayloadCodec<cSp_coreCryptoAccountId32Tupled, cdc653>,
)
export type IdentitySubsOfStorage = StorageType<
  typeof IdentityIdentityOfStorage
>

const IdentityRegistrarsStorage = IdentityCreator.getStorageDescriptor(
  16983551277727798149n,
  "Registrars",
  { len: 0 } as ArgsWithPayloadCodec<_emptyTuple, cdc658>,
)
export type IdentityRegistrarsStorage = StorageType<
  typeof IdentityIdentityOfStorage
>

const result: [
  typeof StakingValidatorCountStorage,
  typeof StakingMinimumValidatorCountStorage,
  typeof StakingInvulnerablesStorage,
  typeof StakingBondedStorage,
  typeof StakingMinNominatorBondStorage,
  typeof StakingMinValidatorBondStorage,
  typeof StakingMinimumActiveStakeStorage,
  typeof StakingMinCommissionStorage,
  typeof StakingLedgerStorage,
  typeof StakingPayeeStorage,
  typeof StakingValidatorsStorage,
  typeof StakingCounterForValidatorsStorage,
  typeof StakingMaxValidatorsCountStorage,
  typeof StakingNominatorsStorage,
  typeof StakingCounterForNominatorsStorage,
  typeof StakingMaxNominatorsCountStorage,
  typeof StakingCurrentEraStorage,
  typeof StakingActiveEraStorage,
  typeof StakingErasStartSessionIndexStorage,
  typeof StakingErasStakersStorage,
  typeof StakingErasStakersClippedStorage,
  typeof StakingErasValidatorPrefsStorage,
  typeof StakingErasValidatorRewardStorage,
  typeof StakingErasRewardPointsStorage,
  typeof StakingErasTotalStakeStorage,
  typeof StakingForceEraStorage,
  typeof StakingSlashRewardFractionStorage,
  typeof StakingCanceledSlashPayoutStorage,
  typeof StakingUnappliedSlashesStorage,
  typeof StakingBondedErasStorage,
  typeof StakingValidatorSlashInEraStorage,
  typeof StakingNominatorSlashInEraStorage,
  typeof StakingSlashingSpansStorage,
  typeof StakingSpanSlashStorage,
  typeof StakingCurrentPlannedSessionStorage,
  typeof StakingOffendingValidatorsStorage,
  typeof StakingChillThresholdStorage,
  typeof IdentityIdentityOfStorage,
  typeof IdentitySuperOfStorage,
  typeof IdentitySubsOfStorage,
  typeof IdentityRegistrarsStorage,
] = [
  StakingValidatorCountStorage,
  StakingMinimumValidatorCountStorage,
  StakingInvulnerablesStorage,
  StakingBondedStorage,
  StakingMinNominatorBondStorage,
  StakingMinValidatorBondStorage,
  StakingMinimumActiveStakeStorage,
  StakingMinCommissionStorage,
  StakingLedgerStorage,
  StakingPayeeStorage,
  StakingValidatorsStorage,
  StakingCounterForValidatorsStorage,
  StakingMaxValidatorsCountStorage,
  StakingNominatorsStorage,
  StakingCounterForNominatorsStorage,
  StakingMaxNominatorsCountStorage,
  StakingCurrentEraStorage,
  StakingActiveEraStorage,
  StakingErasStartSessionIndexStorage,
  StakingErasStakersStorage,
  StakingErasStakersClippedStorage,
  StakingErasValidatorPrefsStorage,
  StakingErasValidatorRewardStorage,
  StakingErasRewardPointsStorage,
  StakingErasTotalStakeStorage,
  StakingForceEraStorage,
  StakingSlashRewardFractionStorage,
  StakingCanceledSlashPayoutStorage,
  StakingUnappliedSlashesStorage,
  StakingBondedErasStorage,
  StakingValidatorSlashInEraStorage,
  StakingNominatorSlashInEraStorage,
  StakingSlashingSpansStorage,
  StakingSpanSlashStorage,
  StakingCurrentPlannedSessionStorage,
  StakingOffendingValidatorsStorage,
  StakingChillThresholdStorage,
  IdentityIdentityOfStorage,
  IdentitySuperOfStorage,
  IdentitySubsOfStorage,
  IdentityRegistrarsStorage,
]

export default result
