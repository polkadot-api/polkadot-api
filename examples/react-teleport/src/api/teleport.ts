import { SS58String, Binary, AccountId } from "polkadot-api"
import {
  XcmV4Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmV4Junction,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from "@polkadot-api/descriptors"

import { relayChainApi } from "./relay-chain"
import { PARACHAIN_ID, paraChainApi } from "./para-chain"

const encodeAccount = AccountId().enc

const getBeneficiary = (address: SS58String) =>
  XcmVersionedLocation.V3({
    parents: 0,
    interior: XcmV4Junctions.X1(
      XcmV4Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(encodeAccount(address)),
      }),
    ),
  })

const getNativeAsset = (amount: bigint, parents: 1 | 0) =>
  XcmVersionedAssets.V3([
    {
      id: XcmV3MultiassetAssetId.Concrete({
        parents,
        interior: XcmV4Junctions.Here(),
      }),
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ])

export const teleportToParaChain = (address: SS58String, amount: bigint) =>
  relayChainApi.tx.XcmPallet.limited_teleport_assets({
    dest: XcmVersionedLocation.V3({
      parents: 0,
      interior: XcmV4Junctions.X1(XcmV4Junction.Parachain(PARACHAIN_ID)),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 0),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })

export const teleportToRelayChain = (address: SS58String, amount: bigint) =>
  paraChainApi.tx.PolkadotXcm.limited_teleport_assets({
    dest: XcmVersionedLocation.V3({
      parents: 1,
      interior: XcmV4Junctions.Here(),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 1),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })
