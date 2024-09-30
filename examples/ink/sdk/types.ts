import type { MultiAddress } from "@polkadot-api/descriptors"
import type {
  ApisTypedef,
  Binary,
  Enum,
  FixedSizeBinary,
  PalletsTypedef,
  ResultPayload,
  RuntimeDescriptor,
  SS58String,
  TxDescriptor,
} from "polkadot-api"

export type SdkDefinition<P, R> = {
  descriptors: Promise<any> & {
    pallets: P
    apis: R
  }
  asset: any
  metadataTypes: any
}

export type Gas = {
  ref_time: bigint
  proof_size: bigint
}

export type StorageError = Enum<{
  DoesntExist: undefined
  KeyDecodingFailed: undefined
  MigrationInProgress: undefined
}>
export type InkSdkApis<Ev = any, Err = any> = ApisTypedef<{
  ContractsApi: {
    call: RuntimeDescriptor<
      [
        origin: SS58String,
        dest: SS58String,
        value: bigint,
        gas_limit: Gas | undefined,
        storage_deposit_limit: bigint | undefined,
        input_data: Binary,
      ],
      {
        gas_consumed: Gas
        gas_required: Gas
        storage_deposit: Enum<{
          Refund: bigint
          Charge: bigint
        }>
        debug_message: Binary
        result: ResultPayload<
          {
            flags: number
            data: Binary
          },
          Err
        >
        events?: Array<Ev>
      }
    >
    instantiate: RuntimeDescriptor<
      [
        origin: SS58String,
        value: bigint,
        gas_limit: Gas | undefined,
        storage_deposit_limit: bigint | undefined,
        code: Enum<{
          Upload: Binary
          Existing: FixedSizeBinary<32>
        }>,
        data: Binary,
        salt: Binary,
      ],
      {
        gas_consumed: Gas
        gas_required: Gas
        storage_deposit: Enum<{
          Refund: bigint
          Charge: bigint
        }>
        debug_message: Binary
        result: ResultPayload<
          {
            result: {
              flags: number
              data: Binary
            }
            account_id: SS58String
          },
          Err
        >
        events?: Array<Ev>
      }
    >
    get_storage: RuntimeDescriptor<
      [address: SS58String, key: Binary],
      ResultPayload<Binary | undefined, StorageError>
    >
  }
}>
export type InkSdkPallets = PalletsTypedef<
  {},
  {
    Contracts: {
      call: TxDescriptor<{
        dest: MultiAddress
        value: bigint
        gas_limit: Gas
        storage_deposit_limit?: bigint | undefined
        data: Binary
      }>
      instantiate_with_code: TxDescriptor<{
        value: bigint
        gas_limit: Gas
        storage_deposit_limit?: bigint | undefined
        code: Binary
        data: Binary
        salt: Binary
      }>
    }
  },
  {},
  {},
  {}
>
