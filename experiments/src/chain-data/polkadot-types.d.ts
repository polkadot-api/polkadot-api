import {
  u32,
  _void,
  u128,
  Codec,
  CodecType,
  compactNumber,
  compactBn,
  SS58String,
  HexString,
} from "@polkadot-api/substrate-bindings"
type IcPallet_identityTypesJudgement = Codec<
  | {
      tag: "Unknown"
      value: CodecType<typeof _void>
    }
  | {
      tag: "FeePaid"
      value: CodecType<typeof u128>
    }
  | {
      tag: "Reasonable"
      value: CodecType<typeof _void>
    }
  | {
      tag: "KnownGood"
      value: CodecType<typeof _void>
    }
  | {
      tag: "OutOfDate"
      value: CodecType<typeof _void>
    }
  | {
      tag: "LowQuality"
      value: CodecType<typeof _void>
    }
  | {
      tag: "Erroneous"
      value: CodecType<typeof _void>
    }
>
declare const cPallet_identityTypesJudgement: IcPallet_identityTypesJudgement
export type cPallet_identityTypesJudgement = CodecType<
  typeof cPallet_identityTypesJudgement
>
type Icdc656 = Codec<
  [CodecType<typeof u32>, CodecType<typeof cPallet_identityTypesJudgement>]
>
declare const cdc656: Icdc656
export type cdc656 = CodecType<typeof cdc656>
type Icdc657 = Codec<CodecType<typeof cdc656>[]>
declare const cdc657: Icdc657
export type cdc657 = CodecType<typeof cdc657>
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
declare const _accountId: Codec<SS58String>
export type _accountId = CodecType<typeof _accountId>
type IcPallet_identityTypesData = Codec<
  | {
      tag: "None"
      value: CodecType<typeof _void>
    }
  | {
      tag: "Raw0"
      value: CodecType<typeof _fixedStr0>
    }
  | {
      tag: "Raw1"
      value: CodecType<typeof _fixedStr1>
    }
  | {
      tag: "Raw2"
      value: CodecType<typeof _fixedStr2>
    }
  | {
      tag: "Raw3"
      value: CodecType<typeof _fixedStr3>
    }
  | {
      tag: "Raw4"
      value: CodecType<typeof _fixedStr4>
    }
  | {
      tag: "Raw5"
      value: CodecType<typeof _fixedStr5>
    }
  | {
      tag: "Raw6"
      value: CodecType<typeof _fixedStr6>
    }
  | {
      tag: "Raw7"
      value: CodecType<typeof _fixedStr7>
    }
  | {
      tag: "Raw8"
      value: CodecType<typeof _fixedStr8>
    }
  | {
      tag: "Raw9"
      value: CodecType<typeof _fixedStr9>
    }
  | {
      tag: "Raw10"
      value: CodecType<typeof _fixedStr10>
    }
  | {
      tag: "Raw11"
      value: CodecType<typeof _fixedStr11>
    }
  | {
      tag: "Raw12"
      value: CodecType<typeof _fixedStr12>
    }
  | {
      tag: "Raw13"
      value: CodecType<typeof _fixedStr13>
    }
  | {
      tag: "Raw14"
      value: CodecType<typeof _fixedStr14>
    }
  | {
      tag: "Raw15"
      value: CodecType<typeof _fixedStr15>
    }
  | {
      tag: "Raw16"
      value: CodecType<typeof _fixedStr16>
    }
  | {
      tag: "Raw17"
      value: CodecType<typeof _fixedStr17>
    }
  | {
      tag: "Raw18"
      value: CodecType<typeof _fixedStr18>
    }
  | {
      tag: "Raw19"
      value: CodecType<typeof _fixedStr19>
    }
  | {
      tag: "Raw20"
      value: CodecType<typeof _fixedStr20>
    }
  | {
      tag: "Raw21"
      value: CodecType<typeof _fixedStr21>
    }
  | {
      tag: "Raw22"
      value: CodecType<typeof _fixedStr22>
    }
  | {
      tag: "Raw23"
      value: CodecType<typeof _fixedStr23>
    }
  | {
      tag: "Raw24"
      value: CodecType<typeof _fixedStr24>
    }
  | {
      tag: "Raw25"
      value: CodecType<typeof _fixedStr25>
    }
  | {
      tag: "Raw26"
      value: CodecType<typeof _fixedStr26>
    }
  | {
      tag: "Raw27"
      value: CodecType<typeof _fixedStr27>
    }
  | {
      tag: "Raw28"
      value: CodecType<typeof _fixedStr28>
    }
  | {
      tag: "Raw29"
      value: CodecType<typeof _fixedStr29>
    }
  | {
      tag: "Raw30"
      value: CodecType<typeof _fixedStr30>
    }
  | {
      tag: "Raw31"
      value: CodecType<typeof _fixedStr31>
    }
  | {
      tag: "Raw32"
      value: CodecType<typeof _fixedStr32>
    }
  | {
      tag: "BlakeTwo256"
      value: CodecType<typeof _accountId>
    }
  | {
      tag: "Sha256"
      value: CodecType<typeof _accountId>
    }
  | {
      tag: "Keccak256"
      value: CodecType<typeof _accountId>
    }
  | {
      tag: "ShaThree256"
      value: CodecType<typeof _accountId>
    }
>
declare const cPallet_identityTypesData: IcPallet_identityTypesData
export type cPallet_identityTypesData = CodecType<
  typeof cPallet_identityTypesData
>
type Icdc168 = Codec<
  [
    CodecType<typeof cPallet_identityTypesData>,
    CodecType<typeof cPallet_identityTypesData>,
  ]
>
declare const cdc168: Icdc168
export type cdc168 = CodecType<typeof cdc168>
type Icdc198 = Codec<CodecType<typeof cdc168>[]>
declare const cdc198: Icdc198
export type cdc198 = CodecType<typeof cdc198>
declare const cdc82: Codec<HexString>
export type cdc82 = CodecType<typeof cdc82>
type IcOption = Codec<
  | {
      tag: "None"
      value: CodecType<typeof _void>
    }
  | {
      tag: "Some"
      value: CodecType<typeof cdc82>
    }
>
declare const cOption: IcOption
export type cOption = CodecType<typeof cOption>
declare const cPallet_identityTypesIdentityInfo: Codec<{
  additional: [
    (
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    ),
    (
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    ),
  ][]
  display:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  legal:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  web:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  riot:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  email:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  pgp_fingerprint:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Some"
        value: CodecType<typeof cdc82>
      }
  image:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
      }
  twitter:
    | {
        tag: "None"
        value: CodecType<typeof _void>
      }
    | {
        tag: "Raw0"
        value: CodecType<typeof _fixedStr0>
      }
    | {
        tag: "Raw1"
        value: CodecType<typeof _fixedStr1>
      }
    | {
        tag: "Raw2"
        value: CodecType<typeof _fixedStr2>
      }
    | {
        tag: "Raw3"
        value: CodecType<typeof _fixedStr3>
      }
    | {
        tag: "Raw4"
        value: CodecType<typeof _fixedStr4>
      }
    | {
        tag: "Raw5"
        value: CodecType<typeof _fixedStr5>
      }
    | {
        tag: "Raw6"
        value: CodecType<typeof _fixedStr6>
      }
    | {
        tag: "Raw7"
        value: CodecType<typeof _fixedStr7>
      }
    | {
        tag: "Raw8"
        value: CodecType<typeof _fixedStr8>
      }
    | {
        tag: "Raw9"
        value: CodecType<typeof _fixedStr9>
      }
    | {
        tag: "Raw10"
        value: CodecType<typeof _fixedStr10>
      }
    | {
        tag: "Raw11"
        value: CodecType<typeof _fixedStr11>
      }
    | {
        tag: "Raw12"
        value: CodecType<typeof _fixedStr12>
      }
    | {
        tag: "Raw13"
        value: CodecType<typeof _fixedStr13>
      }
    | {
        tag: "Raw14"
        value: CodecType<typeof _fixedStr14>
      }
    | {
        tag: "Raw15"
        value: CodecType<typeof _fixedStr15>
      }
    | {
        tag: "Raw16"
        value: CodecType<typeof _fixedStr16>
      }
    | {
        tag: "Raw17"
        value: CodecType<typeof _fixedStr17>
      }
    | {
        tag: "Raw18"
        value: CodecType<typeof _fixedStr18>
      }
    | {
        tag: "Raw19"
        value: CodecType<typeof _fixedStr19>
      }
    | {
        tag: "Raw20"
        value: CodecType<typeof _fixedStr20>
      }
    | {
        tag: "Raw21"
        value: CodecType<typeof _fixedStr21>
      }
    | {
        tag: "Raw22"
        value: CodecType<typeof _fixedStr22>
      }
    | {
        tag: "Raw23"
        value: CodecType<typeof _fixedStr23>
      }
    | {
        tag: "Raw24"
        value: CodecType<typeof _fixedStr24>
      }
    | {
        tag: "Raw25"
        value: CodecType<typeof _fixedStr25>
      }
    | {
        tag: "Raw26"
        value: CodecType<typeof _fixedStr26>
      }
    | {
        tag: "Raw27"
        value: CodecType<typeof _fixedStr27>
      }
    | {
        tag: "Raw28"
        value: CodecType<typeof _fixedStr28>
      }
    | {
        tag: "Raw29"
        value: CodecType<typeof _fixedStr29>
      }
    | {
        tag: "Raw30"
        value: CodecType<typeof _fixedStr30>
      }
    | {
        tag: "Raw31"
        value: CodecType<typeof _fixedStr31>
      }
    | {
        tag: "Raw32"
        value: CodecType<typeof _fixedStr32>
      }
    | {
        tag: "BlakeTwo256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Sha256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "Keccak256"
        value: CodecType<typeof _accountId>
      }
    | {
        tag: "ShaThree256"
        value: CodecType<typeof _accountId>
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
          value: CodecType<typeof _void>
        }
      | {
          tag: "FeePaid"
          value: CodecType<typeof u128>
        }
      | {
          tag: "Reasonable"
          value: CodecType<typeof _void>
        }
      | {
          tag: "KnownGood"
          value: CodecType<typeof _void>
        }
      | {
          tag: "OutOfDate"
          value: CodecType<typeof _void>
        }
      | {
          tag: "LowQuality"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Erroneous"
          value: CodecType<typeof _void>
        }
    ),
  ][]
  deposit: bigint
  info: {
    additional: [
      (
        | {
            tag: "None"
            value: CodecType<typeof _void>
          }
        | {
            tag: "Raw0"
            value: CodecType<typeof _fixedStr0>
          }
        | {
            tag: "Raw1"
            value: CodecType<typeof _fixedStr1>
          }
        | {
            tag: "Raw2"
            value: CodecType<typeof _fixedStr2>
          }
        | {
            tag: "Raw3"
            value: CodecType<typeof _fixedStr3>
          }
        | {
            tag: "Raw4"
            value: CodecType<typeof _fixedStr4>
          }
        | {
            tag: "Raw5"
            value: CodecType<typeof _fixedStr5>
          }
        | {
            tag: "Raw6"
            value: CodecType<typeof _fixedStr6>
          }
        | {
            tag: "Raw7"
            value: CodecType<typeof _fixedStr7>
          }
        | {
            tag: "Raw8"
            value: CodecType<typeof _fixedStr8>
          }
        | {
            tag: "Raw9"
            value: CodecType<typeof _fixedStr9>
          }
        | {
            tag: "Raw10"
            value: CodecType<typeof _fixedStr10>
          }
        | {
            tag: "Raw11"
            value: CodecType<typeof _fixedStr11>
          }
        | {
            tag: "Raw12"
            value: CodecType<typeof _fixedStr12>
          }
        | {
            tag: "Raw13"
            value: CodecType<typeof _fixedStr13>
          }
        | {
            tag: "Raw14"
            value: CodecType<typeof _fixedStr14>
          }
        | {
            tag: "Raw15"
            value: CodecType<typeof _fixedStr15>
          }
        | {
            tag: "Raw16"
            value: CodecType<typeof _fixedStr16>
          }
        | {
            tag: "Raw17"
            value: CodecType<typeof _fixedStr17>
          }
        | {
            tag: "Raw18"
            value: CodecType<typeof _fixedStr18>
          }
        | {
            tag: "Raw19"
            value: CodecType<typeof _fixedStr19>
          }
        | {
            tag: "Raw20"
            value: CodecType<typeof _fixedStr20>
          }
        | {
            tag: "Raw21"
            value: CodecType<typeof _fixedStr21>
          }
        | {
            tag: "Raw22"
            value: CodecType<typeof _fixedStr22>
          }
        | {
            tag: "Raw23"
            value: CodecType<typeof _fixedStr23>
          }
        | {
            tag: "Raw24"
            value: CodecType<typeof _fixedStr24>
          }
        | {
            tag: "Raw25"
            value: CodecType<typeof _fixedStr25>
          }
        | {
            tag: "Raw26"
            value: CodecType<typeof _fixedStr26>
          }
        | {
            tag: "Raw27"
            value: CodecType<typeof _fixedStr27>
          }
        | {
            tag: "Raw28"
            value: CodecType<typeof _fixedStr28>
          }
        | {
            tag: "Raw29"
            value: CodecType<typeof _fixedStr29>
          }
        | {
            tag: "Raw30"
            value: CodecType<typeof _fixedStr30>
          }
        | {
            tag: "Raw31"
            value: CodecType<typeof _fixedStr31>
          }
        | {
            tag: "Raw32"
            value: CodecType<typeof _fixedStr32>
          }
        | {
            tag: "BlakeTwo256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "Sha256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "Keccak256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "ShaThree256"
            value: CodecType<typeof _accountId>
          }
      ),
      (
        | {
            tag: "None"
            value: CodecType<typeof _void>
          }
        | {
            tag: "Raw0"
            value: CodecType<typeof _fixedStr0>
          }
        | {
            tag: "Raw1"
            value: CodecType<typeof _fixedStr1>
          }
        | {
            tag: "Raw2"
            value: CodecType<typeof _fixedStr2>
          }
        | {
            tag: "Raw3"
            value: CodecType<typeof _fixedStr3>
          }
        | {
            tag: "Raw4"
            value: CodecType<typeof _fixedStr4>
          }
        | {
            tag: "Raw5"
            value: CodecType<typeof _fixedStr5>
          }
        | {
            tag: "Raw6"
            value: CodecType<typeof _fixedStr6>
          }
        | {
            tag: "Raw7"
            value: CodecType<typeof _fixedStr7>
          }
        | {
            tag: "Raw8"
            value: CodecType<typeof _fixedStr8>
          }
        | {
            tag: "Raw9"
            value: CodecType<typeof _fixedStr9>
          }
        | {
            tag: "Raw10"
            value: CodecType<typeof _fixedStr10>
          }
        | {
            tag: "Raw11"
            value: CodecType<typeof _fixedStr11>
          }
        | {
            tag: "Raw12"
            value: CodecType<typeof _fixedStr12>
          }
        | {
            tag: "Raw13"
            value: CodecType<typeof _fixedStr13>
          }
        | {
            tag: "Raw14"
            value: CodecType<typeof _fixedStr14>
          }
        | {
            tag: "Raw15"
            value: CodecType<typeof _fixedStr15>
          }
        | {
            tag: "Raw16"
            value: CodecType<typeof _fixedStr16>
          }
        | {
            tag: "Raw17"
            value: CodecType<typeof _fixedStr17>
          }
        | {
            tag: "Raw18"
            value: CodecType<typeof _fixedStr18>
          }
        | {
            tag: "Raw19"
            value: CodecType<typeof _fixedStr19>
          }
        | {
            tag: "Raw20"
            value: CodecType<typeof _fixedStr20>
          }
        | {
            tag: "Raw21"
            value: CodecType<typeof _fixedStr21>
          }
        | {
            tag: "Raw22"
            value: CodecType<typeof _fixedStr22>
          }
        | {
            tag: "Raw23"
            value: CodecType<typeof _fixedStr23>
          }
        | {
            tag: "Raw24"
            value: CodecType<typeof _fixedStr24>
          }
        | {
            tag: "Raw25"
            value: CodecType<typeof _fixedStr25>
          }
        | {
            tag: "Raw26"
            value: CodecType<typeof _fixedStr26>
          }
        | {
            tag: "Raw27"
            value: CodecType<typeof _fixedStr27>
          }
        | {
            tag: "Raw28"
            value: CodecType<typeof _fixedStr28>
          }
        | {
            tag: "Raw29"
            value: CodecType<typeof _fixedStr29>
          }
        | {
            tag: "Raw30"
            value: CodecType<typeof _fixedStr30>
          }
        | {
            tag: "Raw31"
            value: CodecType<typeof _fixedStr31>
          }
        | {
            tag: "Raw32"
            value: CodecType<typeof _fixedStr32>
          }
        | {
            tag: "BlakeTwo256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "Sha256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "Keccak256"
            value: CodecType<typeof _accountId>
          }
        | {
            tag: "ShaThree256"
            value: CodecType<typeof _accountId>
          }
      ),
    ][]
    display:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    legal:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    web:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    riot:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    email:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    pgp_fingerprint:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Some"
          value: CodecType<typeof cdc82>
        }
    image:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
    twitter:
      | {
          tag: "None"
          value: CodecType<typeof _void>
        }
      | {
          tag: "Raw0"
          value: CodecType<typeof _fixedStr0>
        }
      | {
          tag: "Raw1"
          value: CodecType<typeof _fixedStr1>
        }
      | {
          tag: "Raw2"
          value: CodecType<typeof _fixedStr2>
        }
      | {
          tag: "Raw3"
          value: CodecType<typeof _fixedStr3>
        }
      | {
          tag: "Raw4"
          value: CodecType<typeof _fixedStr4>
        }
      | {
          tag: "Raw5"
          value: CodecType<typeof _fixedStr5>
        }
      | {
          tag: "Raw6"
          value: CodecType<typeof _fixedStr6>
        }
      | {
          tag: "Raw7"
          value: CodecType<typeof _fixedStr7>
        }
      | {
          tag: "Raw8"
          value: CodecType<typeof _fixedStr8>
        }
      | {
          tag: "Raw9"
          value: CodecType<typeof _fixedStr9>
        }
      | {
          tag: "Raw10"
          value: CodecType<typeof _fixedStr10>
        }
      | {
          tag: "Raw11"
          value: CodecType<typeof _fixedStr11>
        }
      | {
          tag: "Raw12"
          value: CodecType<typeof _fixedStr12>
        }
      | {
          tag: "Raw13"
          value: CodecType<typeof _fixedStr13>
        }
      | {
          tag: "Raw14"
          value: CodecType<typeof _fixedStr14>
        }
      | {
          tag: "Raw15"
          value: CodecType<typeof _fixedStr15>
        }
      | {
          tag: "Raw16"
          value: CodecType<typeof _fixedStr16>
        }
      | {
          tag: "Raw17"
          value: CodecType<typeof _fixedStr17>
        }
      | {
          tag: "Raw18"
          value: CodecType<typeof _fixedStr18>
        }
      | {
          tag: "Raw19"
          value: CodecType<typeof _fixedStr19>
        }
      | {
          tag: "Raw20"
          value: CodecType<typeof _fixedStr20>
        }
      | {
          tag: "Raw21"
          value: CodecType<typeof _fixedStr21>
        }
      | {
          tag: "Raw22"
          value: CodecType<typeof _fixedStr22>
        }
      | {
          tag: "Raw23"
          value: CodecType<typeof _fixedStr23>
        }
      | {
          tag: "Raw24"
          value: CodecType<typeof _fixedStr24>
        }
      | {
          tag: "Raw25"
          value: CodecType<typeof _fixedStr25>
        }
      | {
          tag: "Raw26"
          value: CodecType<typeof _fixedStr26>
        }
      | {
          tag: "Raw27"
          value: CodecType<typeof _fixedStr27>
        }
      | {
          tag: "Raw28"
          value: CodecType<typeof _fixedStr28>
        }
      | {
          tag: "Raw29"
          value: CodecType<typeof _fixedStr29>
        }
      | {
          tag: "Raw30"
          value: CodecType<typeof _fixedStr30>
        }
      | {
          tag: "Raw31"
          value: CodecType<typeof _fixedStr31>
        }
      | {
          tag: "Raw32"
          value: CodecType<typeof _fixedStr32>
        }
      | {
          tag: "BlakeTwo256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Sha256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "Keccak256"
          value: CodecType<typeof _accountId>
        }
      | {
          tag: "ShaThree256"
          value: CodecType<typeof _accountId>
        }
  }
}>
export type cPallet_identityTypesRegistration = CodecType<
  typeof cPallet_identityTypesRegistration
>
type IcSp_coreCryptoAccountId32Tupled = Codec<[CodecType<typeof _accountId>]>
declare const cSp_coreCryptoAccountId32Tupled: IcSp_coreCryptoAccountId32Tupled
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>
declare const _bytesSeq: Codec<HexString>
export type _bytesSeq = CodecType<typeof _bytesSeq>
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
      value: CodecType<typeof cdc82>
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
type IcPallet_balancesPalletCallTransferTupled = Codec<
  [
    CodecType<typeof cSp_runtimeMultiaddressMultiAddress>,
    CodecType<typeof compactBn>,
  ]
>
declare const cPallet_balancesPalletCallTransferTupled: IcPallet_balancesPalletCallTransferTupled
export type cPallet_balancesPalletCallTransferTupled = CodecType<
  typeof cPallet_balancesPalletCallTransferTupled
>
export {}
