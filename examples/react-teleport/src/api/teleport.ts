import { SS58String, Binary, AccountId, Enum } from "polkadot-api"
import {
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmV3Junction,
} from "@polkadot-api/descriptors"

import { relayChainApi } from "./relay-chain"
import { PARACHAIN_ID, paraChainApi } from "./para-chain"

const encodeAccount = AccountId().enc

const getBeneficiary = (address: SS58String) =>
  Enum("V3", {
    parents: 0,
    interior: XcmV3Junctions.X1(
      XcmV3Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(encodeAccount(address)),
      }),
    ),
  })

const getNativeAsset = (amount: bigint, parents: 1 | 0) =>
  Enum("V3", [
    {
      id: XcmV3MultiassetAssetId.Concrete({
        parents,
        interior: XcmV3Junctions.Here(),
      }),
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ])

export const teleportToParaChain = (address: SS58String, amount: bigint) =>
  relayChainApi.tx.XcmPallet.limited_teleport_assets({
    dest: Enum("V3", {
      parents: 0,
      interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(PARACHAIN_ID)),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 0),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })

export const teleportToRelayChain = (address: SS58String, amount: bigint) =>
  paraChainApi.tx.PolkadotXcm.limited_teleport_assets({
    dest: Enum("V3", {
      parents: 1,
      interior: XcmV3Junctions.Here(),
    }),
    beneficiary: getBeneficiary(address),
    assets: getNativeAsset(amount, 1),
    fee_asset_item: 0,
    weight_limit: XcmV3WeightLimit.Unlimited(),
  })
