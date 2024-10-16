import {
  getInkClient,
  type Event,
  type InkCallableDescriptor,
  type InkDescriptors,
  type InkStorageDescriptor,
} from "@polkadot-api/ink-contracts"
import { type TypedApi } from "polkadot-api"
import type {
  InkSdkApis,
  InkSdkPallets,
  SdkDefinition,
} from "./descriptor-types"
import { getContract } from "./get-contract"
import { getDeployer } from "./get-deployer"
import type { InkSdk } from "./sdk-types"

export const createInkSdk = <
  T extends TypedApi<SdkDefinition<InkSdkPallets, InkSdkApis>>,
  D extends InkDescriptors<
    InkStorageDescriptor,
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
    getContract: (address) => getContract(typedApi, inkClient, address),
    getDeployer: (code) => getDeployer(typedApi, inkClient, code),
    readDeploymentEvents() {
      return null
    },
  }
}
