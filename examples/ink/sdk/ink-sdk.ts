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
  type Transaction,
  type TypedApi,
} from "polkadot-api"
import type {
  Gas,
  InkSdkApis,
  InkSdkPallets,
  SdkDefinition,
  StorageError,
} from "./types"
import { wrapAsyncTx } from "./utils"

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
) => {
  const inkClient = getInkClient(contractDescriptors)

  return {
    async getRootStorage(
      address: string,
    ): Promise<
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
    message<L extends string & keyof D["__types"]["messages"]>(
      messageLabel: L,
    ) {
      type M = D["__types"]["messages"][L]
      type Args = {
        address: string
        data: M["message"]
        options?: {
          value?: bigint
          gasLimit?: Gas
          storageDepositLimit?: bigint
        }
      }
      type QueryArgs = Args & {
        origin: string
      }
      type SendArgs = Args &
        (
          | {
              gasLimit: Gas
            }
          | {
              origin: string
            }
        )
      const msg = inkClient.message(messageLabel)

      return {
        async query(
          args: QueryArgs,
        ): Promise<ResultPayload<ReturnType<(typeof msg)["decode"]>, any>> {
          const response = await typedApi.apis.ContractsApi.call(
            args.origin,
            args.address,
            args.options?.value ?? 0n,
            args.options?.gasLimit,
            args.options?.storageDepositLimit,
            msg.encode(args.data),
          )
          if (response.result.success) {
            return { success: true, value: msg.decode(response.result.value) }
          }
          return {
            success: false,
            value: response.result.value,
          }
        },
        send: (args: SendArgs) =>
          wrapAsyncTx(async () => {
            const gasLimit = await (async () => {
              if ("gasLimit" in args) return args.gasLimit
              if (args.options?.gasLimit) return args.options.gasLimit

              const response = await typedApi.apis.ContractsApi.call(
                args.origin,
                args.address,
                args.options?.value ?? 0n,
                args.options?.gasLimit,
                args.options?.storageDepositLimit,
                msg.encode(args.data),
              )

              return response.gas_required
            })()

            return typedApi.tx.Contracts.call({
              dest: Enum("Id", args.address),
              value: args.options?.value ?? 0n,
              gas_limit: gasLimit,
              storage_deposit_limit: args.options?.storageDepositLimit,
              data: msg.encode(args.data),
            })
          }),
      }
    },
    constructor<L extends string & keyof D["__types"]["constructors"]>(
      constructorLabel: L,
    ) {
      type M = D["__types"]["constructors"][L]
      type DeployArgs = {
        address: string
        data: M["message"]
        code: Binary
        options?: {
          value?: bigint
          gasLimit?: Gas
          storageDepositLimit?: bigint
          salt?: Binary
        }
      }
      type DryRunDeployArgs = DeployArgs & {
        origin: string
      }
      type SendArgs = DeployArgs &
        (
          | {
              gasLimit: Gas
            }
          | {
              origin: string
            }
        )
      const ctor = inkClient.constructor(constructorLabel)

      return {
        async dryRunDeploy(args: DryRunDeployArgs): Promise<
          ResultPayload<
            {
              accountId: SS58String
              response: ReturnType<(typeof ctor)["decode"]>
            },
            any
          >
        > {
          const response = await typedApi.apis.ContractsApi.instantiate(
            args.origin,
            args.options?.value ?? 0n,
            args.options?.gasLimit,
            args.options?.storageDepositLimit,
            Enum("Upload", args.code),
            ctor.encode(args.data),
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
        deploy: (args: SendArgs) =>
          wrapAsyncTx(async () => {
            const gasLimit = await (async () => {
              if ("gasLimit" in args) return args.gasLimit
              if (args.options?.gasLimit) return args.options.gasLimit

              const response = await typedApi.apis.ContractsApi.call(
                args.origin,
                args.address,
                args.options?.value ?? 0n,
                args.options?.gasLimit,
                args.options?.storageDepositLimit,
                ctor.encode(args.data),
              )

              return response.gas_required
            })()

            return typedApi.tx.Contracts.instantiate_with_code({
              value: args.options?.value ?? 0n,
              gas_limit: gasLimit,
              storage_deposit_limit: args.options?.storageDepositLimit,
              code: args.code,
              data: ctor.encode(args.data),
              salt: args.options?.salt ?? Binary.fromText(""),
            })
          }),
      }
    },
  }
}
