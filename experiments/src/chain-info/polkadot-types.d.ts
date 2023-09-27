import { Codec, u32, CodecType } from "@polkadot-api/substrate-bindings"
declare const _emptyTuple: Codec<[]>
export type _emptyTuple = CodecType<typeof _emptyTuple>
declare const _accountId: Codec<
  import("@polkadot-api/polkadot-api-bindings").SS58String
>
export type _accountId = CodecType<typeof _accountId>
declare const cdc104: Codec<
  import("@polkadot-api/substrate-bindings").SS58String[]
>
export type cdc104 = CodecType<typeof cdc104>
declare const cSp_coreCryptoAccountId32Tupled: Codec<
  [key: CodecType<typeof _accountId>]
>
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>
declare const cPallet_stakingUnlockChunk: Codec<{
  value: bigint
  era: number
}>
export type cPallet_stakingUnlockChunk = CodecType<
  typeof cPallet_stakingUnlockChunk
>
declare const cdc539: Codec<
  {
    value: bigint
    era: number
  }[]
>
export type cdc539 = CodecType<typeof cdc539>
declare const cdc109: Codec<number[]>
export type cdc109 = CodecType<typeof cdc109>
declare const cPallet_stakingStakingLedger: Codec<{
  stash: import("@unstoppablejs/substrate-bindings").SS58String
  total: bigint
  active: bigint
  unlocking: {
    value: bigint
    era: number
  }[]
  claimed_rewards: number[]
}>
export type cPallet_stakingStakingLedger = CodecType<
  typeof cPallet_stakingStakingLedger
>
declare const cPallet_stakingRewardDestination: Codec<
  | {
      tag: "Staked"
      value: undefined
    }
  | {
      tag: "Stash"
      value: undefined
    }
  | {
      tag: "Controller"
      value: undefined
    }
  | {
      tag: "Account"
      value: import("@unstoppablejs/substrate-bindings").SS58String
    }
  | {
      tag: "None"
      value: undefined
    }
>
export type cPallet_stakingRewardDestination = CodecType<
  typeof cPallet_stakingRewardDestination
>
declare const cPallet_stakingValidatorPrefs: Codec<{
  commission: number
  blocked: boolean
}>
export type cPallet_stakingValidatorPrefs = CodecType<
  typeof cPallet_stakingValidatorPrefs
>
declare const cPallet_stakingNominations: Codec<{
  targets: import("@unstoppablejs/substrate-bindings").SS58String[]
  submitted_in: number
  suppressed: boolean
}>
export type cPallet_stakingNominations = CodecType<
  typeof cPallet_stakingNominations
>
declare const cOption: Codec<
  | {
      tag: "None"
      value: undefined
    }
  | {
      tag: "Some"
      value: bigint
    }
>
export type cOption = CodecType<typeof cOption>
declare const cPallet_stakingActiveEraInfo: Codec<{
  index: number
  start:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: bigint
      }
}>
export type cPallet_stakingActiveEraInfo = CodecType<
  typeof cPallet_stakingActiveEraInfo
>
declare const cdc4Tupled: Codec<[key: CodecType<typeof u32>]>
export type cdc4Tupled = CodecType<typeof cdc4Tupled>
declare const cPallet_stakingIndividualExposure: Codec<{
  who: import("@unstoppablejs/substrate-bindings").SS58String
  value: bigint
}>
export type cPallet_stakingIndividualExposure = CodecType<
  typeof cPallet_stakingIndividualExposure
>
declare const cdc61: Codec<
  {
    who: import("@unstoppablejs/substrate-bindings").SS58String
    value: bigint
  }[]
>
export type cdc61 = CodecType<typeof cdc61>
declare const cPallet_stakingExposure: Codec<{
  total: bigint
  own: bigint
  others: {
    who: import("@unstoppablejs/substrate-bindings").SS58String
    value: bigint
  }[]
}>
export type cPallet_stakingExposure = CodecType<typeof cPallet_stakingExposure>
declare const cdc545: Codec<
  [number, import("@unstoppablejs/substrate-bindings").SS58String]
>
export type cdc545 = CodecType<typeof cdc545>
declare const cdc549: Codec<
  [import("@unstoppablejs/substrate-bindings").SS58String, number]
>
export type cdc549 = CodecType<typeof cdc549>
declare const cdc548: Codec<
  [import("@unstoppablejs/substrate-bindings").SS58String, number][]
>
export type cdc548 = CodecType<typeof cdc548>
declare const cPallet_stakingEraRewardPoints: Codec<{
  total: number
  individual: [import("@unstoppablejs/substrate-bindings").SS58String, number][]
}>
export type cPallet_stakingEraRewardPoints = CodecType<
  typeof cPallet_stakingEraRewardPoints
>
declare const cPallet_stakingForcing: Codec<
  | {
      tag: "NotForcing"
      value: undefined
    }
  | {
      tag: "ForceNew"
      value: undefined
    }
  | {
      tag: "ForceNone"
      value: undefined
    }
  | {
      tag: "ForceAlways"
      value: undefined
    }
>
export type cPallet_stakingForcing = CodecType<typeof cPallet_stakingForcing>
declare const cdc72: Codec<
  [import("@unstoppablejs/substrate-bindings").SS58String, bigint]
>
export type cdc72 = CodecType<typeof cdc72>
declare const cdc71: Codec<
  [import("@unstoppablejs/substrate-bindings").SS58String, bigint][]
>
export type cdc71 = CodecType<typeof cdc71>
declare const cPallet_stakingUnappliedSlash: Codec<{
  validator: import("@unstoppablejs/substrate-bindings").SS58String
  own: bigint
  others: [import("@unstoppablejs/substrate-bindings").SS58String, bigint][]
  reporters: import("@unstoppablejs/substrate-bindings").SS58String[]
  payout: bigint
}>
export type cPallet_stakingUnappliedSlash = CodecType<
  typeof cPallet_stakingUnappliedSlash
>
declare const cdc550: Codec<
  {
    validator: import("@unstoppablejs/substrate-bindings").SS58String
    own: bigint
    others: [import("@unstoppablejs/substrate-bindings").SS58String, bigint][]
    reporters: import("@unstoppablejs/substrate-bindings").SS58String[]
    payout: bigint
  }[]
>
export type cdc550 = CodecType<typeof cdc550>
declare const cdc31: Codec<[number, number]>
export type cdc31 = CodecType<typeof cdc31>
declare const cdc481: Codec<[number, number][]>
export type cdc481 = CodecType<typeof cdc481>
declare const cdc552: Codec<[number, bigint]>
export type cdc552 = CodecType<typeof cdc552>
declare const cPallet_stakingSlashingSlashingSpans: Codec<{
  span_index: number
  last_start: number
  last_nonzero_slash: number
  prior: number[]
}>
export type cPallet_stakingSlashingSlashingSpans = CodecType<
  typeof cPallet_stakingSlashingSlashingSpans
>
declare const cPallet_stakingSlashingSpanRecord: Codec<{
  slashed: bigint
  paid_out: bigint
}>
export type cPallet_stakingSlashingSpanRecord = CodecType<
  typeof cPallet_stakingSlashingSpanRecord
>
declare const cdc549Tupled: Codec<[key: CodecType<typeof cdc549>]>
export type cdc549Tupled = CodecType<typeof cdc549Tupled>
declare const cdc556: Codec<[number, boolean]>
export type cdc556 = CodecType<typeof cdc556>
declare const cdc555: Codec<[number, boolean][]>
export type cdc555 = CodecType<typeof cdc555>
declare const cPallet_identityTypesJudgement: Codec<
  | {
      tag: "Unknown"
      value: undefined
    }
  | {
      tag: "FeePaid"
      value: bigint
    }
  | {
      tag: "Reasonable"
      value: undefined
    }
  | {
      tag: "KnownGood"
      value: undefined
    }
  | {
      tag: "OutOfDate"
      value: undefined
    }
  | {
      tag: "LowQuality"
      value: undefined
    }
  | {
      tag: "Erroneous"
      value: undefined
    }
>
export type cPallet_identityTypesJudgement = CodecType<
  typeof cPallet_identityTypesJudgement
>
declare const cdc651: Codec<
  [
    number,
    (
      | {
          tag: "Unknown"
          value: undefined
        }
      | {
          tag: "FeePaid"
          value: bigint
        }
      | {
          tag: "Reasonable"
          value: undefined
        }
      | {
          tag: "KnownGood"
          value: undefined
        }
      | {
          tag: "OutOfDate"
          value: undefined
        }
      | {
          tag: "LowQuality"
          value: undefined
        }
      | {
          tag: "Erroneous"
          value: undefined
        }
    ),
  ]
>
export type cdc651 = CodecType<typeof cdc651>
declare const cdc652: Codec<
  [
    number,
    (
      | {
          tag: "Unknown"
          value: undefined
        }
      | {
          tag: "FeePaid"
          value: bigint
        }
      | {
          tag: "Reasonable"
          value: undefined
        }
      | {
          tag: "KnownGood"
          value: undefined
        }
      | {
          tag: "OutOfDate"
          value: undefined
        }
      | {
          tag: "LowQuality"
          value: undefined
        }
      | {
          tag: "Erroneous"
          value: undefined
        }
    ),
  ][]
>
export type cdc652 = CodecType<typeof cdc652>
declare const _fixedStr0: Codec<string>
export type _fixedStr0 = CodecType<typeof _fixedStr0>
declare const _fixedStr1: Codec<string>
export type _fixedStr1 = CodecType<typeof _fixedStr1>
declare const _fixedStr2: Codec<string>
export type _fixedStr2 = CodecType<typeof _fixedStr2>
declare const _fixedStr3: Codec<string>
export type _fixedStr3 = CodecType<typeof _fixedStr3>
declare const _fixedStr4: Codec<string>
export type _fixedStr4 = CodecType<typeof _fixedStr4>
declare const _fixedStr5: Codec<string>
export type _fixedStr5 = CodecType<typeof _fixedStr5>
declare const _fixedStr6: Codec<string>
export type _fixedStr6 = CodecType<typeof _fixedStr6>
declare const _fixedStr7: Codec<string>
export type _fixedStr7 = CodecType<typeof _fixedStr7>
declare const _fixedStr8: Codec<string>
export type _fixedStr8 = CodecType<typeof _fixedStr8>
declare const _fixedStr9: Codec<string>
export type _fixedStr9 = CodecType<typeof _fixedStr9>
declare const _fixedStr10: Codec<string>
export type _fixedStr10 = CodecType<typeof _fixedStr10>
declare const _fixedStr11: Codec<string>
export type _fixedStr11 = CodecType<typeof _fixedStr11>
declare const _fixedStr12: Codec<string>
export type _fixedStr12 = CodecType<typeof _fixedStr12>
declare const _fixedStr13: Codec<string>
export type _fixedStr13 = CodecType<typeof _fixedStr13>
declare const _fixedStr14: Codec<string>
export type _fixedStr14 = CodecType<typeof _fixedStr14>
declare const _fixedStr15: Codec<string>
export type _fixedStr15 = CodecType<typeof _fixedStr15>
declare const _fixedStr16: Codec<string>
export type _fixedStr16 = CodecType<typeof _fixedStr16>
declare const _fixedStr17: Codec<string>
export type _fixedStr17 = CodecType<typeof _fixedStr17>
declare const _fixedStr18: Codec<string>
export type _fixedStr18 = CodecType<typeof _fixedStr18>
declare const _fixedStr19: Codec<string>
export type _fixedStr19 = CodecType<typeof _fixedStr19>
declare const _fixedStr20: Codec<string>
export type _fixedStr20 = CodecType<typeof _fixedStr20>
declare const _fixedStr21: Codec<string>
export type _fixedStr21 = CodecType<typeof _fixedStr21>
declare const _fixedStr22: Codec<string>
export type _fixedStr22 = CodecType<typeof _fixedStr22>
declare const _fixedStr23: Codec<string>
export type _fixedStr23 = CodecType<typeof _fixedStr23>
declare const _fixedStr24: Codec<string>
export type _fixedStr24 = CodecType<typeof _fixedStr24>
declare const _fixedStr25: Codec<string>
export type _fixedStr25 = CodecType<typeof _fixedStr25>
declare const _fixedStr26: Codec<string>
export type _fixedStr26 = CodecType<typeof _fixedStr26>
declare const _fixedStr27: Codec<string>
export type _fixedStr27 = CodecType<typeof _fixedStr27>
declare const _fixedStr28: Codec<string>
export type _fixedStr28 = CodecType<typeof _fixedStr28>
declare const _fixedStr29: Codec<string>
export type _fixedStr29 = CodecType<typeof _fixedStr29>
declare const _fixedStr30: Codec<string>
export type _fixedStr30 = CodecType<typeof _fixedStr30>
declare const _fixedStr31: Codec<string>
export type _fixedStr31 = CodecType<typeof _fixedStr31>
declare const _fixedStr32: Codec<string>
export type _fixedStr32 = CodecType<typeof _fixedStr32>
declare const cPallet_identityTypesData: Codec<
  | {
      tag: "None"
      value: undefined
    }
  | {
      tag: "Raw0"
      value: string
    }
  | {
      tag: "Raw1"
      value: string
    }
  | {
      tag: "Raw2"
      value: string
    }
  | {
      tag: "Raw3"
      value: string
    }
  | {
      tag: "Raw4"
      value: string
    }
  | {
      tag: "Raw5"
      value: string
    }
  | {
      tag: "Raw6"
      value: string
    }
  | {
      tag: "Raw7"
      value: string
    }
  | {
      tag: "Raw8"
      value: string
    }
  | {
      tag: "Raw9"
      value: string
    }
  | {
      tag: "Raw10"
      value: string
    }
  | {
      tag: "Raw11"
      value: string
    }
  | {
      tag: "Raw12"
      value: string
    }
  | {
      tag: "Raw13"
      value: string
    }
  | {
      tag: "Raw14"
      value: string
    }
  | {
      tag: "Raw15"
      value: string
    }
  | {
      tag: "Raw16"
      value: string
    }
  | {
      tag: "Raw17"
      value: string
    }
  | {
      tag: "Raw18"
      value: string
    }
  | {
      tag: "Raw19"
      value: string
    }
  | {
      tag: "Raw20"
      value: string
    }
  | {
      tag: "Raw21"
      value: string
    }
  | {
      tag: "Raw22"
      value: string
    }
  | {
      tag: "Raw23"
      value: string
    }
  | {
      tag: "Raw24"
      value: string
    }
  | {
      tag: "Raw25"
      value: string
    }
  | {
      tag: "Raw26"
      value: string
    }
  | {
      tag: "Raw27"
      value: string
    }
  | {
      tag: "Raw28"
      value: string
    }
  | {
      tag: "Raw29"
      value: string
    }
  | {
      tag: "Raw30"
      value: string
    }
  | {
      tag: "Raw31"
      value: string
    }
  | {
      tag: "Raw32"
      value: string
    }
  | {
      tag: "BlakeTwo256"
      value: import("@unstoppablejs/substrate-bindings").SS58String
    }
  | {
      tag: "Sha256"
      value: import("@unstoppablejs/substrate-bindings").SS58String
    }
  | {
      tag: "Keccak256"
      value: import("@unstoppablejs/substrate-bindings").SS58String
    }
  | {
      tag: "ShaThree256"
      value: import("@unstoppablejs/substrate-bindings").SS58String
    }
>
export type cPallet_identityTypesData = CodecType<
  typeof cPallet_identityTypesData
>
declare const cdc189: Codec<
  [
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
  ]
>
export type cdc189 = CodecType<typeof cdc189>
declare const cdc220: Codec<
  [
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
  ][]
>
export type cdc220 = CodecType<typeof cdc220>
declare const cPallet_identityTypesIdentityInfo: Codec<{
  additional: [
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
  ][]
  display:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  legal:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  web:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  riot:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  email:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  pgp_fingerprint:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: bigint
      }
  image:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
  twitter:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Raw0"
        value: string
      }
    | {
        tag: "Raw1"
        value: string
      }
    | {
        tag: "Raw2"
        value: string
      }
    | {
        tag: "Raw3"
        value: string
      }
    | {
        tag: "Raw4"
        value: string
      }
    | {
        tag: "Raw5"
        value: string
      }
    | {
        tag: "Raw6"
        value: string
      }
    | {
        tag: "Raw7"
        value: string
      }
    | {
        tag: "Raw8"
        value: string
      }
    | {
        tag: "Raw9"
        value: string
      }
    | {
        tag: "Raw10"
        value: string
      }
    | {
        tag: "Raw11"
        value: string
      }
    | {
        tag: "Raw12"
        value: string
      }
    | {
        tag: "Raw13"
        value: string
      }
    | {
        tag: "Raw14"
        value: string
      }
    | {
        tag: "Raw15"
        value: string
      }
    | {
        tag: "Raw16"
        value: string
      }
    | {
        tag: "Raw17"
        value: string
      }
    | {
        tag: "Raw18"
        value: string
      }
    | {
        tag: "Raw19"
        value: string
      }
    | {
        tag: "Raw20"
        value: string
      }
    | {
        tag: "Raw21"
        value: string
      }
    | {
        tag: "Raw22"
        value: string
      }
    | {
        tag: "Raw23"
        value: string
      }
    | {
        tag: "Raw24"
        value: string
      }
    | {
        tag: "Raw25"
        value: string
      }
    | {
        tag: "Raw26"
        value: string
      }
    | {
        tag: "Raw27"
        value: string
      }
    | {
        tag: "Raw28"
        value: string
      }
    | {
        tag: "Raw29"
        value: string
      }
    | {
        tag: "Raw30"
        value: string
      }
    | {
        tag: "Raw31"
        value: string
      }
    | {
        tag: "Raw32"
        value: string
      }
    | {
        tag: "BlakeTwo256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Sha256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "Keccak256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
    | {
        tag: "ShaThree256"
        value: import("@unstoppablejs/substrate-bindings").SS58String
      }
}>
export type cPallet_identityTypesIdentityInfo = CodecType<
  typeof cPallet_identityTypesIdentityInfo
>
declare const cPallet_identityTypesRegistration: Codec<{
  judgements: [
    number,
    (
      | {
          tag: "Unknown"
          value: undefined
        }
      | {
          tag: "FeePaid"
          value: bigint
        }
      | {
          tag: "Reasonable"
          value: undefined
        }
      | {
          tag: "KnownGood"
          value: undefined
        }
      | {
          tag: "OutOfDate"
          value: undefined
        }
      | {
          tag: "LowQuality"
          value: undefined
        }
      | {
          tag: "Erroneous"
          value: undefined
        }
    ),
  ][]
  deposit: bigint
  info: {
    additional: [
      (
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Raw0"
            value: string
          }
        | {
            tag: "Raw1"
            value: string
          }
        | {
            tag: "Raw2"
            value: string
          }
        | {
            tag: "Raw3"
            value: string
          }
        | {
            tag: "Raw4"
            value: string
          }
        | {
            tag: "Raw5"
            value: string
          }
        | {
            tag: "Raw6"
            value: string
          }
        | {
            tag: "Raw7"
            value: string
          }
        | {
            tag: "Raw8"
            value: string
          }
        | {
            tag: "Raw9"
            value: string
          }
        | {
            tag: "Raw10"
            value: string
          }
        | {
            tag: "Raw11"
            value: string
          }
        | {
            tag: "Raw12"
            value: string
          }
        | {
            tag: "Raw13"
            value: string
          }
        | {
            tag: "Raw14"
            value: string
          }
        | {
            tag: "Raw15"
            value: string
          }
        | {
            tag: "Raw16"
            value: string
          }
        | {
            tag: "Raw17"
            value: string
          }
        | {
            tag: "Raw18"
            value: string
          }
        | {
            tag: "Raw19"
            value: string
          }
        | {
            tag: "Raw20"
            value: string
          }
        | {
            tag: "Raw21"
            value: string
          }
        | {
            tag: "Raw22"
            value: string
          }
        | {
            tag: "Raw23"
            value: string
          }
        | {
            tag: "Raw24"
            value: string
          }
        | {
            tag: "Raw25"
            value: string
          }
        | {
            tag: "Raw26"
            value: string
          }
        | {
            tag: "Raw27"
            value: string
          }
        | {
            tag: "Raw28"
            value: string
          }
        | {
            tag: "Raw29"
            value: string
          }
        | {
            tag: "Raw30"
            value: string
          }
        | {
            tag: "Raw31"
            value: string
          }
        | {
            tag: "Raw32"
            value: string
          }
        | {
            tag: "BlakeTwo256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "Sha256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "Keccak256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "ShaThree256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
      ),
      (
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Raw0"
            value: string
          }
        | {
            tag: "Raw1"
            value: string
          }
        | {
            tag: "Raw2"
            value: string
          }
        | {
            tag: "Raw3"
            value: string
          }
        | {
            tag: "Raw4"
            value: string
          }
        | {
            tag: "Raw5"
            value: string
          }
        | {
            tag: "Raw6"
            value: string
          }
        | {
            tag: "Raw7"
            value: string
          }
        | {
            tag: "Raw8"
            value: string
          }
        | {
            tag: "Raw9"
            value: string
          }
        | {
            tag: "Raw10"
            value: string
          }
        | {
            tag: "Raw11"
            value: string
          }
        | {
            tag: "Raw12"
            value: string
          }
        | {
            tag: "Raw13"
            value: string
          }
        | {
            tag: "Raw14"
            value: string
          }
        | {
            tag: "Raw15"
            value: string
          }
        | {
            tag: "Raw16"
            value: string
          }
        | {
            tag: "Raw17"
            value: string
          }
        | {
            tag: "Raw18"
            value: string
          }
        | {
            tag: "Raw19"
            value: string
          }
        | {
            tag: "Raw20"
            value: string
          }
        | {
            tag: "Raw21"
            value: string
          }
        | {
            tag: "Raw22"
            value: string
          }
        | {
            tag: "Raw23"
            value: string
          }
        | {
            tag: "Raw24"
            value: string
          }
        | {
            tag: "Raw25"
            value: string
          }
        | {
            tag: "Raw26"
            value: string
          }
        | {
            tag: "Raw27"
            value: string
          }
        | {
            tag: "Raw28"
            value: string
          }
        | {
            tag: "Raw29"
            value: string
          }
        | {
            tag: "Raw30"
            value: string
          }
        | {
            tag: "Raw31"
            value: string
          }
        | {
            tag: "Raw32"
            value: string
          }
        | {
            tag: "BlakeTwo256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "Sha256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "Keccak256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
        | {
            tag: "ShaThree256"
            value: import("@unstoppablejs/substrate-bindings").SS58String
          }
      ),
    ][]
    display:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    legal:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    web:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    riot:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    email:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    pgp_fingerprint:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: bigint
        }
    image:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    twitter:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
  }
}>
export type cPallet_identityTypesRegistration = CodecType<
  typeof cPallet_identityTypesRegistration
>
declare const cdc223: Codec<
  [
    import("@unstoppablejs/substrate-bindings").SS58String,
    (
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Raw0"
          value: string
        }
      | {
          tag: "Raw1"
          value: string
        }
      | {
          tag: "Raw2"
          value: string
        }
      | {
          tag: "Raw3"
          value: string
        }
      | {
          tag: "Raw4"
          value: string
        }
      | {
          tag: "Raw5"
          value: string
        }
      | {
          tag: "Raw6"
          value: string
        }
      | {
          tag: "Raw7"
          value: string
        }
      | {
          tag: "Raw8"
          value: string
        }
      | {
          tag: "Raw9"
          value: string
        }
      | {
          tag: "Raw10"
          value: string
        }
      | {
          tag: "Raw11"
          value: string
        }
      | {
          tag: "Raw12"
          value: string
        }
      | {
          tag: "Raw13"
          value: string
        }
      | {
          tag: "Raw14"
          value: string
        }
      | {
          tag: "Raw15"
          value: string
        }
      | {
          tag: "Raw16"
          value: string
        }
      | {
          tag: "Raw17"
          value: string
        }
      | {
          tag: "Raw18"
          value: string
        }
      | {
          tag: "Raw19"
          value: string
        }
      | {
          tag: "Raw20"
          value: string
        }
      | {
          tag: "Raw21"
          value: string
        }
      | {
          tag: "Raw22"
          value: string
        }
      | {
          tag: "Raw23"
          value: string
        }
      | {
          tag: "Raw24"
          value: string
        }
      | {
          tag: "Raw25"
          value: string
        }
      | {
          tag: "Raw26"
          value: string
        }
      | {
          tag: "Raw27"
          value: string
        }
      | {
          tag: "Raw28"
          value: string
        }
      | {
          tag: "Raw29"
          value: string
        }
      | {
          tag: "Raw30"
          value: string
        }
      | {
          tag: "Raw31"
          value: string
        }
      | {
          tag: "Raw32"
          value: string
        }
      | {
          tag: "BlakeTwo256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Sha256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "Keccak256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
      | {
          tag: "ShaThree256"
          value: import("@unstoppablejs/substrate-bindings").SS58String
        }
    ),
  ]
>
export type cdc223 = CodecType<typeof cdc223>
declare const cdc653: Codec<
  [bigint, import("@unstoppablejs/substrate-bindings").SS58String[]]
>
export type cdc653 = CodecType<typeof cdc653>
declare const cdc658: Codec<
  (
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: bigint
      }
  )[]
>
export type cdc658 = CodecType<typeof cdc658>
export {}
