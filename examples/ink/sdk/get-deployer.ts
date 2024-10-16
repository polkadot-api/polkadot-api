import {
  type Event,
  type InkCallableDescriptor,
  type InkClient,
  type InkDescriptors,
  type InkStorageDescriptor,
} from "@polkadot-api/ink-contracts"
import { Binary, Enum, type TypedApi } from "polkadot-api"
import type {
  InkSdkApis,
  InkSdkPallets,
  SdkDefinition,
} from "./descriptor-types"
import { flattenErrors, flattenValues } from "./flatten"
import type { Deployer } from "./sdk-types"
import { wrapAsyncTx } from "./utils"

export function getDeployer<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
>(typedApi: T, inkClient: InkClient<D>, code: Binary): Deployer<T, D> {
  return {
    async dryRun(constructorLabel, args) {
      const ctor = inkClient.constructor(constructorLabel)
      const response = await typedApi.apis.ContractsApi.instantiate(
        args.origin,
        args.value ?? 0n,
        args.options?.gasLimit,
        args.options?.storageDepositLimit,
        Enum("Upload", code),
        ctor.encode(args.data ?? {}),
        args.options?.salt ?? Binary.fromText(""),
      )
      if (response.result.success) {
        const decoded = ctor.decode(response.result.value.result)
        const flattenedError = flattenErrors(decoded)
        if (flattenedError) {
          return {
            success: false,
            value: flattenedError.error,
          }
        }

        const address = response.result.value.account_id
        return {
          success: true,
          value: {
            address,
            response: flattenValues(decoded),
            events: inkClient.event.filter(address, response.events),
            gasRequired: response.gas_required,
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
            args.value ?? 0n,
            undefined,
            args.options?.storageDepositLimit,
            Enum("Upload", code),
            ctor.encode(args.data ?? {}),
            args.options?.salt ?? Binary.fromText(""),
          )

          return response.gas_required
        })()

        return typedApi.tx.Contracts.instantiate_with_code({
          value: args.value ?? 0n,
          gas_limit: gasLimit,
          storage_deposit_limit: args.options?.storageDepositLimit,
          code,
          data: ctor.encode(args.data ?? {}),
          salt: args.options?.salt ?? Binary.fromText(""),
        })
      }),
  }
}
