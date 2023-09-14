import { Codec, CodecType } from "@unstoppablejs/substrate-bindings"
declare const cSp_weightsWeight_v2Weight: Codec<{
  ref_time: bigint
  proof_size: bigint
}>
export type cSp_weightsWeight_v2Weight = CodecType<
  typeof cSp_weightsWeight_v2Weight
>
declare const cOptionSome: Codec<
  [
    {
      ref_time: bigint
      proof_size: bigint
    },
  ]
>
export type cOptionSome = CodecType<typeof cOptionSome>
declare const cOption: Codec<
  | {
      tag: "None"
      value: undefined
    }
  | {
      tag: "Some"
      value: [
        {
          ref_time: bigint
          proof_size: bigint
        },
      ]
    }
>
export type cOption = CodecType<typeof cOption>
declare const cFrame_systemLimitsWeightsPerClass: Codec<{
  base_extrinsic: {
    ref_time: bigint
    proof_size: bigint
  }
  max_extrinsic:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: [
          {
            ref_time: bigint
            proof_size: bigint
          },
        ]
      }
  max_total:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: [
          {
            ref_time: bigint
            proof_size: bigint
          },
        ]
      }
  reserved:
    | {
        tag: "None"
        value: undefined
      }
    | {
        tag: "Some"
        value: [
          {
            ref_time: bigint
            proof_size: bigint
          },
        ]
      }
}>
export type cFrame_systemLimitsWeightsPerClass = CodecType<
  typeof cFrame_systemLimitsWeightsPerClass
>
declare const cFrame_supportDispatchPerDispatchClass: Codec<{
  normal: {
    base_extrinsic: {
      ref_time: bigint
      proof_size: bigint
    }
    max_extrinsic:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    max_total:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    reserved:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
  }
  operational: {
    base_extrinsic: {
      ref_time: bigint
      proof_size: bigint
    }
    max_extrinsic:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    max_total:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    reserved:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
  }
  mandatory: {
    base_extrinsic: {
      ref_time: bigint
      proof_size: bigint
    }
    max_extrinsic:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    max_total:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
    reserved:
      | {
          tag: "None"
          value: undefined
        }
      | {
          tag: "Some"
          value: [
            {
              ref_time: bigint
              proof_size: bigint
            },
          ]
        }
  }
}>
export type cFrame_supportDispatchPerDispatchClass = CodecType<
  typeof cFrame_supportDispatchPerDispatchClass
>
declare const cFrame_systemLimitsBlockWeights: Codec<{
  base_block: {
    ref_time: bigint
    proof_size: bigint
  }
  max_block: {
    ref_time: bigint
    proof_size: bigint
  }
  per_class: {
    normal: {
      base_extrinsic: {
        ref_time: bigint
        proof_size: bigint
      }
      max_extrinsic:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      max_total:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      reserved:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
    }
    operational: {
      base_extrinsic: {
        ref_time: bigint
        proof_size: bigint
      }
      max_extrinsic:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      max_total:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      reserved:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
    }
    mandatory: {
      base_extrinsic: {
        ref_time: bigint
        proof_size: bigint
      }
      max_extrinsic:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      max_total:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
      reserved:
        | {
            tag: "None"
            value: undefined
          }
        | {
            tag: "Some"
            value: [
              {
                ref_time: bigint
                proof_size: bigint
              },
            ]
          }
    }
  }
}>
export type cFrame_systemLimitsBlockWeights = CodecType<
  typeof cFrame_systemLimitsBlockWeights
>
declare const cSp_weightsRuntimeDbWeight: Codec<{
  read: bigint
  write: bigint
}>
export type cSp_weightsRuntimeDbWeight = CodecType<
  typeof cSp_weightsRuntimeDbWeight
>
declare const cdc198: Codec<Uint8Array>
export type cdc198 = CodecType<typeof cdc198>
declare const cdc493: Codec<[Uint8Array, number]>
export type cdc493 = CodecType<typeof cdc493>
declare const cdc492: Codec<[Uint8Array, number][]>
export type cdc492 = CodecType<typeof cdc492>
declare const cSp_versionRuntimeVersion: Codec<{
  spec_name: string
  impl_name: string
  authoring_version: number
  spec_version: number
  impl_version: number
  apis: [Uint8Array, number][]
  transaction_version: number
  state_version: number
}>
export type cSp_versionRuntimeVersion = CodecType<
  typeof cSp_versionRuntimeVersion
>
declare const cFrame_supportDispatchDispatchClass: Codec<
  | {
      tag: "Normal"
      value: undefined
    }
  | {
      tag: "Operational"
      value: undefined
    }
  | {
      tag: "Mandatory"
      value: undefined
    }
>
export type cFrame_supportDispatchDispatchClass = CodecType<
  typeof cFrame_supportDispatchDispatchClass
>
declare const cFrame_supportDispatchPays: Codec<
  | {
      tag: "Yes"
      value: undefined
    }
  | {
      tag: "No"
      value: undefined
    }
>
export type cFrame_supportDispatchPays = CodecType<
  typeof cFrame_supportDispatchPays
>
declare const cFrame_supportDispatchDispatchInfo: Codec<{
  weight: {
    ref_time: bigint
    proof_size: bigint
  }
  class:
    | {
        tag: "Normal"
        value: undefined
      }
    | {
        tag: "Operational"
        value: undefined
      }
    | {
        tag: "Mandatory"
        value: undefined
      }
  pays_fee:
    | {
        tag: "Yes"
        value: undefined
      }
    | {
        tag: "No"
        value: undefined
      }
}>
export type cFrame_supportDispatchDispatchInfo = CodecType<
  typeof cFrame_supportDispatchDispatchInfo
>
declare const cFrame_systemPalletEventExtrinsicSuccess: Codec<{
  dispatch_info: {
    weight: {
      ref_time: bigint
      proof_size: bigint
    }
    class:
      | {
          tag: "Normal"
          value: undefined
        }
      | {
          tag: "Operational"
          value: undefined
        }
      | {
          tag: "Mandatory"
          value: undefined
        }
    pays_fee:
      | {
          tag: "Yes"
          value: undefined
        }
      | {
          tag: "No"
          value: undefined
        }
  }
}>
export type cFrame_systemPalletEventExtrinsicSuccess = CodecType<
  typeof cFrame_systemPalletEventExtrinsicSuccess
>
declare const cdc17: Codec<Uint8Array>
export type cdc17 = CodecType<typeof cdc17>
declare const cSp_runtimeModuleError: Codec<{
  index: number
  error: Uint8Array
}>
export type cSp_runtimeModuleError = CodecType<typeof cSp_runtimeModuleError>
declare const cSp_runtimeDispatchErrorModule: Codec<
  [
    {
      index: number
      error: Uint8Array
    },
  ]
>
export type cSp_runtimeDispatchErrorModule = CodecType<
  typeof cSp_runtimeDispatchErrorModule
>
declare const cSp_runtimeTokenError: Codec<
  | {
      tag: "FundsUnavailable"
      value: undefined
    }
  | {
      tag: "OnlyProvider"
      value: undefined
    }
  | {
      tag: "BelowMinimum"
      value: undefined
    }
  | {
      tag: "CannotCreate"
      value: undefined
    }
  | {
      tag: "UnknownAsset"
      value: undefined
    }
  | {
      tag: "Frozen"
      value: undefined
    }
  | {
      tag: "Unsupported"
      value: undefined
    }
  | {
      tag: "CannotCreateHold"
      value: undefined
    }
  | {
      tag: "NotExpendable"
      value: undefined
    }
  | {
      tag: "Blocked"
      value: undefined
    }
>
export type cSp_runtimeTokenError = CodecType<typeof cSp_runtimeTokenError>
declare const cSp_runtimeDispatchErrorToken: Codec<
  [
    | {
        tag: "FundsUnavailable"
        value: undefined
      }
    | {
        tag: "OnlyProvider"
        value: undefined
      }
    | {
        tag: "BelowMinimum"
        value: undefined
      }
    | {
        tag: "CannotCreate"
        value: undefined
      }
    | {
        tag: "UnknownAsset"
        value: undefined
      }
    | {
        tag: "Frozen"
        value: undefined
      }
    | {
        tag: "Unsupported"
        value: undefined
      }
    | {
        tag: "CannotCreateHold"
        value: undefined
      }
    | {
        tag: "NotExpendable"
        value: undefined
      }
    | {
        tag: "Blocked"
        value: undefined
      },
  ]
>
export type cSp_runtimeDispatchErrorToken = CodecType<
  typeof cSp_runtimeDispatchErrorToken
>
declare const cSp_arithmeticArithmeticError: Codec<
  | {
      tag: "Underflow"
      value: undefined
    }
  | {
      tag: "Overflow"
      value: undefined
    }
  | {
      tag: "DivisionByZero"
      value: undefined
    }
>
export type cSp_arithmeticArithmeticError = CodecType<
  typeof cSp_arithmeticArithmeticError
>
declare const cSp_runtimeDispatchErrorArithmetic: Codec<
  [
    | {
        tag: "Underflow"
        value: undefined
      }
    | {
        tag: "Overflow"
        value: undefined
      }
    | {
        tag: "DivisionByZero"
        value: undefined
      },
  ]
>
export type cSp_runtimeDispatchErrorArithmetic = CodecType<
  typeof cSp_runtimeDispatchErrorArithmetic
>
declare const cSp_runtimeTransactionalError: Codec<
  | {
      tag: "LimitReached"
      value: undefined
    }
  | {
      tag: "NoLayer"
      value: undefined
    }
>
export type cSp_runtimeTransactionalError = CodecType<
  typeof cSp_runtimeTransactionalError
>
declare const cSp_runtimeDispatchErrorTransactional: Codec<
  [
    | {
        tag: "LimitReached"
        value: undefined
      }
    | {
        tag: "NoLayer"
        value: undefined
      },
  ]
>
export type cSp_runtimeDispatchErrorTransactional = CodecType<
  typeof cSp_runtimeDispatchErrorTransactional
>
declare const cSp_runtimeDispatchError: Codec<
  | {
      tag: "Other"
      value: undefined
    }
  | {
      tag: "CannotLookup"
      value: undefined
    }
  | {
      tag: "BadOrigin"
      value: undefined
    }
  | {
      tag: "Module"
      value: [
        {
          index: number
          error: Uint8Array
        },
      ]
    }
  | {
      tag: "ConsumerRemaining"
      value: undefined
    }
  | {
      tag: "NoProviders"
      value: undefined
    }
  | {
      tag: "TooManyConsumers"
      value: undefined
    }
  | {
      tag: "Token"
      value: [
        | {
            tag: "FundsUnavailable"
            value: undefined
          }
        | {
            tag: "OnlyProvider"
            value: undefined
          }
        | {
            tag: "BelowMinimum"
            value: undefined
          }
        | {
            tag: "CannotCreate"
            value: undefined
          }
        | {
            tag: "UnknownAsset"
            value: undefined
          }
        | {
            tag: "Frozen"
            value: undefined
          }
        | {
            tag: "Unsupported"
            value: undefined
          }
        | {
            tag: "CannotCreateHold"
            value: undefined
          }
        | {
            tag: "NotExpendable"
            value: undefined
          }
        | {
            tag: "Blocked"
            value: undefined
          },
      ]
    }
  | {
      tag: "Arithmetic"
      value: [
        | {
            tag: "Underflow"
            value: undefined
          }
        | {
            tag: "Overflow"
            value: undefined
          }
        | {
            tag: "DivisionByZero"
            value: undefined
          },
      ]
    }
  | {
      tag: "Transactional"
      value: [
        | {
            tag: "LimitReached"
            value: undefined
          }
        | {
            tag: "NoLayer"
            value: undefined
          },
      ]
    }
  | {
      tag: "Exhausted"
      value: undefined
    }
  | {
      tag: "Corruption"
      value: undefined
    }
  | {
      tag: "Unavailable"
      value: undefined
    }
  | {
      tag: "RootNotAllowed"
      value: undefined
    }
>
export type cSp_runtimeDispatchError = CodecType<
  typeof cSp_runtimeDispatchError
>
declare const cFrame_systemPalletEventExtrinsicFailed: Codec<{
  dispatch_error:
    | {
        tag: "Other"
        value: undefined
      }
    | {
        tag: "CannotLookup"
        value: undefined
      }
    | {
        tag: "BadOrigin"
        value: undefined
      }
    | {
        tag: "Module"
        value: [
          {
            index: number
            error: Uint8Array
          },
        ]
      }
    | {
        tag: "ConsumerRemaining"
        value: undefined
      }
    | {
        tag: "NoProviders"
        value: undefined
      }
    | {
        tag: "TooManyConsumers"
        value: undefined
      }
    | {
        tag: "Token"
        value: [
          | {
              tag: "FundsUnavailable"
              value: undefined
            }
          | {
              tag: "OnlyProvider"
              value: undefined
            }
          | {
              tag: "BelowMinimum"
              value: undefined
            }
          | {
              tag: "CannotCreate"
              value: undefined
            }
          | {
              tag: "UnknownAsset"
              value: undefined
            }
          | {
              tag: "Frozen"
              value: undefined
            }
          | {
              tag: "Unsupported"
              value: undefined
            }
          | {
              tag: "CannotCreateHold"
              value: undefined
            }
          | {
              tag: "NotExpendable"
              value: undefined
            }
          | {
              tag: "Blocked"
              value: undefined
            },
        ]
      }
    | {
        tag: "Arithmetic"
        value: [
          | {
              tag: "Underflow"
              value: undefined
            }
          | {
              tag: "Overflow"
              value: undefined
            }
          | {
              tag: "DivisionByZero"
              value: undefined
            },
        ]
      }
    | {
        tag: "Transactional"
        value: [
          | {
              tag: "LimitReached"
              value: undefined
            }
          | {
              tag: "NoLayer"
              value: undefined
            },
        ]
      }
    | {
        tag: "Exhausted"
        value: undefined
      }
    | {
        tag: "Corruption"
        value: undefined
      }
    | {
        tag: "Unavailable"
        value: undefined
      }
    | {
        tag: "RootNotAllowed"
        value: undefined
      }
  dispatch_info: {
    weight: {
      ref_time: bigint
      proof_size: bigint
    }
    class:
      | {
          tag: "Normal"
          value: undefined
        }
      | {
          tag: "Operational"
          value: undefined
        }
      | {
          tag: "Mandatory"
          value: undefined
        }
    pays_fee:
      | {
          tag: "Yes"
          value: undefined
        }
      | {
          tag: "No"
          value: undefined
        }
  }
}>
export type cFrame_systemPalletEventExtrinsicFailed = CodecType<
  typeof cFrame_systemPalletEventExtrinsicFailed
>
declare const cdc1: Codec<Uint8Array>
export type cdc1 = CodecType<typeof cdc1>
declare const cFrame_systemPalletEventNewAccount: Codec<{
  account: Uint8Array
}>
export type cFrame_systemPalletEventNewAccount = CodecType<
  typeof cFrame_systemPalletEventNewAccount
>
declare const cFrame_systemPalletEventKilledAccount: Codec<{
  account: Uint8Array
}>
export type cFrame_systemPalletEventKilledAccount = CodecType<
  typeof cFrame_systemPalletEventKilledAccount
>
declare const cFrame_systemPalletEventRemarked: Codec<{
  sender: Uint8Array
  hash: Uint8Array
}>
export type cFrame_systemPalletEventRemarked = CodecType<
  typeof cFrame_systemPalletEventRemarked
>
declare const cFrame_systemPalletEvent: Codec<
  | {
      tag: "ExtrinsicSuccess"
      value: {
        dispatch_info: {
          weight: {
            ref_time: bigint
            proof_size: bigint
          }
          class:
            | {
                tag: "Normal"
                value: undefined
              }
            | {
                tag: "Operational"
                value: undefined
              }
            | {
                tag: "Mandatory"
                value: undefined
              }
          pays_fee:
            | {
                tag: "Yes"
                value: undefined
              }
            | {
                tag: "No"
                value: undefined
              }
        }
      }
    }
  | {
      tag: "ExtrinsicFailed"
      value: {
        dispatch_error:
          | {
              tag: "Other"
              value: undefined
            }
          | {
              tag: "CannotLookup"
              value: undefined
            }
          | {
              tag: "BadOrigin"
              value: undefined
            }
          | {
              tag: "Module"
              value: [
                {
                  index: number
                  error: Uint8Array
                },
              ]
            }
          | {
              tag: "ConsumerRemaining"
              value: undefined
            }
          | {
              tag: "NoProviders"
              value: undefined
            }
          | {
              tag: "TooManyConsumers"
              value: undefined
            }
          | {
              tag: "Token"
              value: [
                | {
                    tag: "FundsUnavailable"
                    value: undefined
                  }
                | {
                    tag: "OnlyProvider"
                    value: undefined
                  }
                | {
                    tag: "BelowMinimum"
                    value: undefined
                  }
                | {
                    tag: "CannotCreate"
                    value: undefined
                  }
                | {
                    tag: "UnknownAsset"
                    value: undefined
                  }
                | {
                    tag: "Frozen"
                    value: undefined
                  }
                | {
                    tag: "Unsupported"
                    value: undefined
                  }
                | {
                    tag: "CannotCreateHold"
                    value: undefined
                  }
                | {
                    tag: "NotExpendable"
                    value: undefined
                  }
                | {
                    tag: "Blocked"
                    value: undefined
                  },
              ]
            }
          | {
              tag: "Arithmetic"
              value: [
                | {
                    tag: "Underflow"
                    value: undefined
                  }
                | {
                    tag: "Overflow"
                    value: undefined
                  }
                | {
                    tag: "DivisionByZero"
                    value: undefined
                  },
              ]
            }
          | {
              tag: "Transactional"
              value: [
                | {
                    tag: "LimitReached"
                    value: undefined
                  }
                | {
                    tag: "NoLayer"
                    value: undefined
                  },
              ]
            }
          | {
              tag: "Exhausted"
              value: undefined
            }
          | {
              tag: "Corruption"
              value: undefined
            }
          | {
              tag: "Unavailable"
              value: undefined
            }
          | {
              tag: "RootNotAllowed"
              value: undefined
            }
        dispatch_info: {
          weight: {
            ref_time: bigint
            proof_size: bigint
          }
          class:
            | {
                tag: "Normal"
                value: undefined
              }
            | {
                tag: "Operational"
                value: undefined
              }
            | {
                tag: "Mandatory"
                value: undefined
              }
          pays_fee:
            | {
                tag: "Yes"
                value: undefined
              }
            | {
                tag: "No"
                value: undefined
              }
        }
      }
    }
  | {
      tag: "CodeUpdated"
      value: undefined
    }
  | {
      tag: "NewAccount"
      value: {
        account: Uint8Array
      }
    }
  | {
      tag: "KilledAccount"
      value: {
        account: Uint8Array
      }
    }
  | {
      tag: "Remarked"
      value: {
        sender: Uint8Array
        hash: Uint8Array
      }
    }
>
export type cFrame_systemPalletEvent = CodecType<
  typeof cFrame_systemPalletEvent
>
declare const cFrame_systemPalletEventCodeUpdated: Codec<undefined>
export type cFrame_systemPalletEventCodeUpdated = CodecType<
  typeof cFrame_systemPalletEventCodeUpdated
>
declare const cFrame_systemPalletError: Codec<
  | {
      tag: "InvalidSpecName"
      value: undefined
    }
  | {
      tag: "SpecVersionNeedsToIncrease"
      value: undefined
    }
  | {
      tag: "FailedToExtractRuntimeVersion"
      value: undefined
    }
  | {
      tag: "NonDefaultComposite"
      value: undefined
    }
  | {
      tag: "NonZeroRefCount"
      value: undefined
    }
  | {
      tag: "CallFiltered"
      value: undefined
    }
>
export type cFrame_systemPalletError = CodecType<
  typeof cFrame_systemPalletError
>
declare const cFrame_systemPalletErrorInvalidSpecName: Codec<undefined>
export type cFrame_systemPalletErrorInvalidSpecName = CodecType<
  typeof cFrame_systemPalletErrorInvalidSpecName
>
declare const cFrame_systemPalletErrorSpecVersionNeedsToIncrease: Codec<undefined>
export type cFrame_systemPalletErrorSpecVersionNeedsToIncrease = CodecType<
  typeof cFrame_systemPalletErrorSpecVersionNeedsToIncrease
>
declare const cFrame_systemPalletErrorFailedToExtractRuntimeVersion: Codec<undefined>
export type cFrame_systemPalletErrorFailedToExtractRuntimeVersion = CodecType<
  typeof cFrame_systemPalletErrorFailedToExtractRuntimeVersion
>
declare const cFrame_systemPalletErrorNonDefaultComposite: Codec<undefined>
export type cFrame_systemPalletErrorNonDefaultComposite = CodecType<
  typeof cFrame_systemPalletErrorNonDefaultComposite
>
declare const cFrame_systemPalletErrorNonZeroRefCount: Codec<undefined>
export type cFrame_systemPalletErrorNonZeroRefCount = CodecType<
  typeof cFrame_systemPalletErrorNonZeroRefCount
>
declare const cFrame_systemPalletErrorCallFiltered: Codec<undefined>
export type cFrame_systemPalletErrorCallFiltered = CodecType<
  typeof cFrame_systemPalletErrorCallFiltered
>
declare const _bytesSeq: Codec<Uint8Array>
export type _bytesSeq = CodecType<typeof _bytesSeq>
declare const cFrame_systemPalletCallRemarkTupled: Codec<
  [remark: CodecType<typeof _bytesSeq>]
>
export type cFrame_systemPalletCallRemarkTupled = CodecType<
  typeof cFrame_systemPalletCallRemarkTupled
>
declare const _emptyTuple: Codec<[]>
export type _emptyTuple = CodecType<typeof _emptyTuple>
declare const cPallet_balancesTypesAccountData: Codec<{
  free: bigint
  reserved: bigint
  frozen: bigint
  flags: bigint
}>
export type cPallet_balancesTypesAccountData = CodecType<
  typeof cPallet_balancesTypesAccountData
>
declare const cSp_coreCryptoAccountId32Tupled: Codec<
  [key: CodecType<typeof cdc1>]
>
export type cSp_coreCryptoAccountId32Tupled = CodecType<
  typeof cSp_coreCryptoAccountId32Tupled
>
declare const cPallet_balancesTypesReasons: Codec<
  | {
      tag: "Fee"
      value: undefined
    }
  | {
      tag: "Misc"
      value: undefined
    }
  | {
      tag: "All"
      value: undefined
    }
>
export type cPallet_balancesTypesReasons = CodecType<
  typeof cPallet_balancesTypesReasons
>
declare const cPallet_balancesTypesBalanceLock: Codec<{
  id: Uint8Array
  amount: bigint
  reasons:
    | {
        tag: "Fee"
        value: undefined
      }
    | {
        tag: "Misc"
        value: undefined
      }
    | {
        tag: "All"
        value: undefined
      }
}>
export type cPallet_balancesTypesBalanceLock = CodecType<
  typeof cPallet_balancesTypesBalanceLock
>
declare const cdc526: Codec<
  {
    id: Uint8Array
    amount: bigint
    reasons:
      | {
          tag: "Fee"
          value: undefined
        }
      | {
          tag: "Misc"
          value: undefined
        }
      | {
          tag: "All"
          value: undefined
        }
  }[]
>
export type cdc526 = CodecType<typeof cdc526>
declare const cPallet_balancesTypesReserveData: Codec<{
  id: Uint8Array
  amount: bigint
}>
export type cPallet_balancesTypesReserveData = CodecType<
  typeof cPallet_balancesTypesReserveData
>
declare const cdc529: Codec<
  {
    id: Uint8Array
    amount: bigint
  }[]
>
export type cdc529 = CodecType<typeof cdc529>
declare const cPallet_balancesTypesIdAmount: Codec<{
  id: undefined
  amount: bigint
}>
export type cPallet_balancesTypesIdAmount = CodecType<
  typeof cPallet_balancesTypesIdAmount
>
declare const cdc532: Codec<
  {
    id: undefined
    amount: bigint
  }[]
>
export type cdc532 = CodecType<typeof cdc532>
export {}
