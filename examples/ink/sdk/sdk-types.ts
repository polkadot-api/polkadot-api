import {
  type Event,
  type GenericEvent,
  type InkCallableDescriptor,
  type InkDescriptors,
  type InkStorageDescriptor,
} from "@polkadot-api/ink-contracts"
import {
  Binary,
  FixedSizeBinary,
  type ResultPayload,
  type SS58String,
  type TypedApi,
} from "polkadot-api"
import type {
  Gas,
  InkSdkApis,
  InkSdkPallets,
  SdkDefinition,
  StorageError,
} from "./descriptor-types"
import { type AsyncTransaction } from "./utils"
import type { FlattenErrors, FlattenValues } from "./flatten"

export interface InkSdk<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  getContract(adddress: SS58String): Contract<T, D>
  getDeployer(code: Binary): Deployer<T, D>
  readDeploymentEvents: (
    origin: SS58String,
    events?: Array<{
      event: GenericEvent
      topics: FixedSizeBinary<number>[]
    }>,
  ) => {
    address: string
    contractEvents: Array<D["__types"]["event"]>
  } | null
}

type DryRunDeployFn<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> = <L extends string & keyof D["__types"]["constructors"]>(
  constructor: L,
  args: DryRunRedeployArgs<D["__types"]["constructors"][L]["message"]>,
) => Promise<
  ResultPayload<
    {
      address: SS58String
      response: FlattenValues<D["__types"]["messages"][L]["response"]>
      events: D["__types"]["event"][]
      gasRequired: Gas
    },
    GetErr<T> | FlattenErrors<D["__types"]["messages"][L]["response"]>
    // D["__types"]["messages"][L]["response"]
  >
>

type DeployFn<
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> = <L extends string & keyof D["__types"]["constructors"]>(
  constructor: L,
  args: RedeployArgs<D["__types"]["constructors"][L]["message"]>,
) => AsyncTransaction<any, any, any, any>

export interface Deployer<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  dryRun: DryRunDeployFn<T, D>
  deploy: DeployFn<D>
}

type GetErr<T> =
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis<any, infer R>>>
    ? R
    : any

export type StorageRootType<T extends InkStorageDescriptor> = "" extends keyof T
  ? T[""]["value"]
  : never

export interface Contract<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  getRootStorage(): Promise<
    ResultPayload<
      StorageRootType<D["__types"]["storage"]> | undefined,
      StorageError
    >
  >
  query: <L extends string & keyof D["__types"]["messages"]>(
    message: L,
    args: QueryArgs<D["__types"]["messages"][L]["message"]>,
  ) => Promise<
    ResultPayload<
      {
        response: FlattenValues<D["__types"]["messages"][L]["response"]>
        events: D["__types"]["event"][]
        gasRequired: Gas
      },
      GetErr<T> | FlattenErrors<D["__types"]["messages"][L]["response"]>
      // D["__types"]["messages"][L]["response"]
    >
  >
  send: <L extends string & keyof D["__types"]["messages"]>(
    message: L,
    args: SendArgs<D["__types"]["messages"][L]["message"]>,
  ) => AsyncTransaction<any, any, any, any>
  dryRunRedeploy: DryRunDeployFn<T, D>
  redeploy: DeployFn<D>
  filterEvents: (
    events?: Array<{
      event: GenericEvent
      topics: FixedSizeBinary<number>[]
    }>,
  ) => Array<D["__types"]["event"]>
}

type QueryOptions = Partial<{
  gasLimit: Gas
  storageDepositLimit: bigint
}>
type Data<D> = {} extends D
  ? {
      data?: D
    }
  : {
      data: D
    }

type QueryArgs<D> = Data<D> & {
  options?: QueryOptions
  value?: bigint
  origin: SS58String
}

type GasInput =
  | {
      origin: SS58String
    }
  | {
      gasLimit: Gas
    }

type SendArgs<D> = Data<D> & {
  options?: Omit<QueryOptions, "gasLimit">
  value?: bigint
} & GasInput

type DeployOptions = Partial<{
  gasLimit: Gas
  storageDepositLimit: bigint
  salt: Binary
}>
type DryRunRedeployArgs<D> = Data<D> & {
  options?: DeployOptions
  value?: bigint
  origin: SS58String
}
type RedeployArgs<D> = Data<D> & {
  options?: Omit<DeployOptions, "gasLimit">
  value?: bigint
} & GasInput
