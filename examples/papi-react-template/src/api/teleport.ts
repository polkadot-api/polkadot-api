import { SS58String, Binary, AccountId } from "@polkadot-api/client"
import {
  XcmV3Junction,
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedMultiAssets,
  XcmVersionedMultiLocation,
} from "../codegen/dot"
import { relayChainApi } from "./relay-chain"
import { CORETIME_PARACHAIN_ID, paraChainApi } from "./para-chain"

const getBeneficiary = (address: SS58String) =>
  XcmVersionedMultiLocation.V3({
    parents: 0,
    interior: XcmV3Junctions.X1(
      XcmV3Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(AccountId().enc(address)),
      }),
    ),
  })

const getNativeAsset = (amount: bigint, parents: 1 | 0) =>
  XcmVersionedMultiAssets.V3([
    {
      id: XcmV3MultiassetAssetId.Concrete({
        parents,
        interior: XcmV3Junctions.Here(),
      }),
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ])

const toParaChain = (paraChainId: number) =>
  XcmVersionedMultiLocation.V3({
    parents: 0,
    interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(paraChainId)),
  })

const toRelayChain = (parents = 1) =>
  XcmVersionedMultiLocation.V3({
    parents,
    interior: XcmV3Junctions.Here(),
  })

export const teleportToParaChain = (address: SS58String, amount: bigint) =>
  relayChainApi.tx.XcmPallet.limited_teleport_assets({
    dest: toParaChain(CORETIME_PARACHAIN_ID),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 0),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })

export const teleportToRelayChain = (address: SS58String, amount: bigint) =>
  paraChainApi.tx.PolkadotXcm.limited_teleport_assets({
    dest: toRelayChain(),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 1),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })
