import {
  type Event,
  type InkCallableDescriptor,
  type InkClient,
  type InkDescriptors,
  type InkStorageDescriptor,
} from "@polkadot-api/ink-contracts"
import { Binary, Enum, type ResultPayload, type TypedApi } from "polkadot-api"
import type {
  InkSdkApis,
  InkSdkPallets,
  SdkDefinition,
  StorageError,
} from "./descriptor-types"
import { flattenErrors, flattenValues } from "./flatten"
import type { Contract, StorageRootType } from "./sdk-types"
import { wrapAsyncTx } from "./utils"
import type { SdkStorage } from "./get-storage"

export function getContract<
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
>(typedApi: T, inkClient: InkClient<D>, address: string): Contract<T, D> {
  const contractDetails =
    typedApi.query.Contracts.ContractInfoOf.getValue(address)

  return {
    getStorage(): SdkStorage<D["__types"]["storage"]> {
      return null as any
    },
    async getRootStorage(): Promise<
      ResultPayload<
        StorageRootType<D["__types"]["storage"]> | undefined,
        StorageError
      >
    > {
      const rootStorage = inkClient.storage("")
      const result = await typedApi.apis.ContractsApi.get_storage(
        address,
        rootStorage.encode(undefined),
      )

      if (result.success) {
        return {
          success: true,
          value: result.value
            ? (rootStorage.decode(result.value) as any)
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
        args.value ?? 0n,
        args.options?.gasLimit,
        args.options?.storageDepositLimit,
        msg.encode(args.data ?? {}),
      )
      if (response.result.success) {
        const decoded = msg.decode(response.result.value)
        const flattenedError = flattenErrors(decoded)
        if (flattenedError) {
          return {
            success: false,
            value: flattenedError.error,
          }
        }

        return {
          success: true,
          value: {
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
    send: (message, args) =>
      wrapAsyncTx(async () => {
        const data = inkClient.message(message).encode(args.data ?? {})

        const gasLimit = await (async () => {
          if ("gasLimit" in args) return args.gasLimit

          const response = await typedApi.apis.ContractsApi.call(
            args.origin,
            address,
            args.value ?? 0n,
            undefined,
            args.options?.storageDepositLimit,
            data,
          )

          return response.gas_required
        })()

        return typedApi.tx.Contracts.call({
          dest: Enum("Id", address),
          value: args.value ?? 0n,
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
        args.value ?? 0n,
        args.options?.gasLimit,
        args.options?.storageDepositLimit,
        Enum("Existing", details.code_hash),
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

        return {
          success: true,
          value: {
            address: response.result.value.account_id,
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
    redeploy: (constructorLabel, args) =>
      wrapAsyncTx(async () => {
        const details = await contractDetails
        const hash = details?.code_hash ?? Binary.fromBytes(new Uint8Array(32))
        const ctor = inkClient.constructor(constructorLabel)

        const gasLimit = await (async () => {
          if ("gasLimit" in args) return args.gasLimit

          const response = await typedApi.apis.ContractsApi.instantiate(
            args.origin,
            args.value ?? 0n,
            undefined,
            args.options?.storageDepositLimit,
            Enum("Existing", hash),
            ctor.encode(args.data ?? {}),
            args.options?.salt ?? Binary.fromText(""),
          )

          return response.gas_required
        })()

        return typedApi.tx.Contracts.instantiate({
          value: args.value ?? 0n,
          gas_limit: gasLimit,
          storage_deposit_limit: args.options?.storageDepositLimit,
          code_hash: hash,
          data: ctor.encode(args.data ?? {}),
          salt: args.options?.salt ?? Binary.fromText(""),
        })
      }),
    filterEvents(events) {
      return inkClient.event.filter(address, events)
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
