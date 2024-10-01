import {
  getInkClient,
  type Event,
  type InkCallableDescriptor,
  type InkDescriptors,
} from "@polkadot-api/ink-contracts"
import {
  Binary,
  Enum,
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
} from "./types"
import { wrapAsyncTx, type AsyncTransaction } from "./utils"

export const createInkSdk = <
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    unknown,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
>(
  typedApi: T,
  contractDescriptors: D,
): InkSdk<T, D> => {
  const inkClient = getInkClient(contractDescriptors)

  return {
    getContract(address: string): Contract<T, D> {
      const contractDetails =
        typedApi.query.Contracts.ContractInfoOf.getValue(address)

      return {
        async getRootStorage(): Promise<
          ResultPayload<D["__types"]["storage"] | undefined, StorageError>
        > {
          const result = await typedApi.apis.ContractsApi.get_storage(
            address,
            inkClient.storage.rootKey,
          )
          if (result.success) {
            return {
              success: true,
              value: result.value
                ? inkClient.storage.decodeRoot(result.value)
                : undefined,
            }
          }
          return {
            success: false,
            value: result.value,
          }
        },
        async query(message, args) {
          const msg = inkClient.message(message)

          const response = await typedApi.apis.ContractsApi.call(
            args.origin,
            address,
            args.options?.value ?? 0n,
            args.options?.gasLimit,
            args.options?.storageDepositLimit,
            msg.encode(args.data ?? {}),
          )
          if (response.result.success) {
            return { success: true, value: msg.decode(response.result.value) }
          }
          return {
            success: false,
            value: response.result.value,
          }
        },
        send: (message, args) =>
          wrapAsyncTx(async () => {
            const data = inkClient.message(message).encode(args.data ?? {})

            const gasLimit = await (async () => {
              if ("gasLimit" in args) return args.gasLimit

              const response = await typedApi.apis.ContractsApi.call(
                args.origin,
                address,
                args.options?.value ?? 0n,
                undefined,
                args.options?.storageDepositLimit,
                data,
              )

              return response.gas_required
            })()

            return typedApi.tx.Contracts.call({
              dest: Enum("Id", address),
              value: args.options?.value ?? 0n,
              gas_limit: gasLimit,
              storage_deposit_limit: args.options?.storageDepositLimit,
              data,
            })
          }),
        async dryRunRedeploy(constructorLabel, args) {
          const details = await contractDetails
          if (!details) {
            return {
              success: false,
              value: NotFoundError,
            }
          }
          const ctor = inkClient.constructor(constructorLabel)
          const response = await typedApi.apis.ContractsApi.instantiate(
            args.origin,
            args.options?.value ?? 0n,
            args.options?.gasLimit,
            args.options?.storageDepositLimit,
            Enum("Existing", details.code_hash),
            ctor.encode(args.data ?? {}),
            args.options?.salt ?? Binary.fromText(""),
          )
          if (response.result.success) {
            return {
              success: true,
              value: {
                accountId: response.result.value.account_id,
                response: ctor.decode(response.result.value.result),
              },
            }
          }
          return {
            success: false,
            value: response.result.value,
          }
        },
        redeploy: (constructorLabel, args) =>
          wrapAsyncTx(async () => {
            const details = await contractDetails
            const hash =
              details?.code_hash ?? Binary.fromBytes(new Uint8Array(32))
            const ctor = inkClient.constructor(constructorLabel)

            const gasLimit = await (async () => {
              if ("gasLimit" in args) return args.gasLimit

              const response = await typedApi.apis.ContractsApi.instantiate(
                args.origin,
                args.options?.value ?? 0n,
                undefined,
                args.options?.storageDepositLimit,
                Enum("Existing", hash),
                ctor.encode(args.data ?? {}),
                args.options?.salt ?? Binary.fromText(""),
              )

              return response.gas_required
            })()

            return typedApi.tx.Contracts.instantiate({
              value: args.options?.value ?? 0n,
              gas_limit: gasLimit,
              storage_deposit_limit: args.options?.storageDepositLimit,
              code_hash: hash,
              data: ctor.encode(args.data ?? {}),
              salt: args.options?.salt ?? Binary.fromText(""),
            })
          }),
      }
    },

    getDeployer(code) {
      return {
        async dryRun(constructorLabel, args) {
          const ctor = inkClient.constructor(constructorLabel)
          const response = await typedApi.apis.ContractsApi.instantiate(
            args.origin,
            args.options?.value ?? 0n,
            args.options?.gasLimit,
            args.options?.storageDepositLimit,
            Enum("Upload", code),
            ctor.encode(args.data ?? {}),
            args.options?.salt ?? Binary.fromText(""),
          )
          if (response.result.success) {
            return {
              success: true,
              value: {
                accountId: response.result.value.account_id,
                response: ctor.decode(response.result.value.result),
              },
            }
          }
          return {
            success: false,
            value: response.result.value,
          }
        },
        deploy: (constructorLabel, args) =>
          wrapAsyncTx(async () => {
            const ctor = inkClient.constructor(constructorLabel)

            const gasLimit = await (async () => {
              if ("gasLimit" in args) return args.gasLimit

              const response = await typedApi.apis.ContractsApi.instantiate(
                args.origin,
                args.options?.value ?? 0n,
                undefined,
                args.options?.storageDepositLimit,
                Enum("Upload", code),
                ctor.encode(args.data ?? {}),
                args.options?.salt ?? Binary.fromText(""),
              )

              return response.gas_required
            })()

            return typedApi.tx.Contracts.instantiate_with_code({
              value: args.options?.value ?? 0n,
              gas_limit: gasLimit,
              storage_deposit_limit: args.options?.storageDepositLimit,
              code,
              data: ctor.encode(args.data ?? {}),
              salt: args.options?.salt ?? Binary.fromText(""),
            })
          }),
      }
    },
  }
}

const NotFoundError = {
  type: "Module" as const,
  value: {
    type: "Contracts" as const,
    value: {
      type: "ContractNotFound" as const,
    },
  },
}

interface InkSdk<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    unknown,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  getContract(adddress: SS58String): Contract<T, D>
  getDeployer(code: Binary): Deployer<T, D>
}

type DryRunDeployFn<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    unknown,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> = <L extends string & keyof D["__types"]["constructors"]>(
  constructor: L,
  args: DryRunRedeployArgs<D["__types"]["constructors"][L]["message"]>,
) => Promise<
  ResultPayload<
    D["__types"]["constructors"][L]["response"],
    GetErr<T> | typeof NotFoundError
  >
>

type DeployFn<
  D extends InkDescriptors<
    unknown,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> = <L extends string & keyof D["__types"]["constructors"]>(
  constructor: L,
  args: RedeployArgs<D["__types"]["constructors"][L]["message"]>,
) => AsyncTransaction<any, any, any, any>

interface Deployer<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    unknown,
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

interface Contract<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    unknown,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  getRootStorage(): Promise<
    ResultPayload<D["__types"]["storage"] | undefined, StorageError>
  >
  query: <L extends string & keyof D["__types"]["messages"]>(
    message: L,
    args: QueryArgs<D["__types"]["messages"][L]["message"]>,
  ) => Promise<
    ResultPayload<D["__types"]["messages"][L]["response"], GetErr<T>>
  >
  send: <L extends string & keyof D["__types"]["messages"]>(
    message: L,
    args: SendArgs<D["__types"]["messages"][L]["message"]>,
  ) => AsyncTransaction<any, any, any, any>
  dryRunRedeploy: DryRunDeployFn<T, D>
  redeploy: DeployFn<D>
}

type QueryOptions = Partial<{
  value: bigint
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
} & GasInput

type DeployOptions = Partial<{
  value: bigint
  gasLimit: Gas
  storageDepositLimit: bigint
  salt: Binary
}>
type DryRunRedeployArgs<D> = Data<D> & {
  options?: DeployOptions
  origin: SS58String
}
type RedeployArgs<D> = Data<D> & {
  options?: Omit<DeployOptions, "gasLimit">
} & GasInput
