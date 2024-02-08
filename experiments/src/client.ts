import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { noop } from "@polkadot-api/utils"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { createClient } from "@polkadot-api/client"

// hint: remember to run the `codegen` script
import Ksm, {
  KsmOption,
  KsmXcmV2OriginKind,
  KsmXcmV3Instruction,
  KsmXcmV3JunctionJunction,
  KsmXcmV3JunctionsJunctions,
  KsmXcmV3MultiassetAssetId,
  KsmXcmV3MultiassetAssetInstance,
  KsmXcmV3MultiassetFungibility,
  KsmXcmVersionedXcm,
  Queries,
} from "./descriptors/ksm"
import { Enum, Binary, EnumOption } from "@polkadot-api/substrate-bindings"
const scProvider = getScProvider()

const polkadotChain = await getChain({
  provider: scProvider(WellKnownChain.ksmcc3).relayChain,
  keyring: { getPairs: () => [], onKeyPairsChanged: () => noop },
})

const relayChain = createClient(polkadotChain.connect, { Ksm, Ksm1_2: Ksm })
const collectives = relayChain

relayChain.Ksm.tx.XcmPallet.execute(
  KsmXcmVersionedXcm.V3([
    KsmXcmV3Instruction.LockAsset({
      asset: {
        id: KsmXcmV3MultiassetAssetId.Abstract(""),
        fun: KsmXcmV3MultiassetFungibility.Fungible(4n),
      },
      unlocker: {
        parents: 4,
        interior: KsmXcmV3JunctionsJunctions.X1(
          KsmXcmV3JunctionJunction.Parachain(4),
        ),
      },
    }),
  ]),
  {
    ref_time: 3n,
    proof_size: 5n,
  },
)

const transact1: EnumOption<KsmXcmV3Instruction, "Transact"> = {
  call: Binary(""),
  origin_kind: Enum("Xcm"),
  require_weight_at_most: {
    ref_time: 3n,
    proof_size: 33n,
  },
}

const instructions: Array<KsmXcmV3Instruction> = [
  Enum("Transact", transact1),
  Enum("WithdrawAsset", [
    {
      id: Enum("Concrete", {
        parents: 3,
        interior: Enum("Here"),
      }),
      fun: Enum("Fungible", 5n),
    },
  ]),
]

relayChain.Ksm.tx.XcmPallet.execute(Enum("V3", instructions), {
  proof_size: 3n,
  ref_time: 3n,
})

relayChain.Ksm.tx.XcmPallet.execute(KsmXcmVersionedXcm.V3([]), {
  ref_time: 5n,
  proof_size: 3n,
})
relayChain.Ksm.tx.XcmPallet.execute(
  KsmXcmVersionedXcm.V3([
    KsmXcmV3Instruction.ExpectOrigin(
      KsmOption.Some({
        ref_time: 4n,
        proof_size: 2n,
      }),
    ),
  ]),
  {
    ref_time: 5n,
    proof_size: 33n,
  },
)

relayChain.Ksm.tx.XcmPallet.execute(
  KsmXcmVersionedXcm.V3([
    KsmXcmV3Instruction.Transact({
      call: Binary("0x32ff"),
      origin_kind: KsmXcmV2OriginKind.Native(),
      require_weight_at_most: {
        ref_time: 5n,
        proof_size: 3n,
      },
    }),
    KsmXcmV3Instruction.BurnAsset([
      {
        id: KsmXcmV3MultiassetAssetId.Abstract(""),
        fun: KsmXcmV3MultiassetFungibility.NonFungible(
          KsmXcmV3MultiassetAssetInstance.Index(3n),
        ),
      },
    ]),
  ]),
  { ref_time: 3n, proof_size: 3n },
)

relayChain.Ksm.tx.Utility.batch([
  Enum("Identity", Enum("set_fee", { index: 2, fee: 3n })),
  Enum(
    "Beefy",
    Enum("report_equivocation_unsigned", {
      equivocation_proof: {
        first: {
          commitment: {
            payload: [[Binary(""), Binary("")]],
            block_number: 3,
            validator_set_id: 3n,
          },
          id: Binary(""),
          signature: Binary(""),
        },
        second: {
          commitment: {
            payload: [[Binary(""), Binary("")]],
            block_number: 3,
            validator_set_id: 3n,
          },
          id: Binary(""),
          signature: Binary(""),
        },
      },
      key_owner_proof: {
        session: 3,
        trie_nodes: [Binary("")],
        validator_count: 3,
      },
    }),
  ),
])

const identityDataToString = (value: string | Binary | undefined) =>
  value instanceof Binary ? value.asText() : value ?? ""

function mapRawIdentity(
  rawIdentity?: Queries["Identity"]["IdentityOf"]["Value"],
) {
  if (!rawIdentity) return rawIdentity

  const {
    info: { additional, ...rawInfo },
  } = rawIdentity

  const additionalInfo = Object.fromEntries(
    additional.map(([key, { value }]) => [
      identityDataToString(key.value!),
      identityDataToString(value),
    ]),
  )

  const info = Object.fromEntries(
    Object.entries(rawInfo)
      .map(([key, { value }]) => [key, identityDataToString(value as Binary)])
      .filter(([, value]) => value),
  )

  return { ...info, ...additionalInfo }
}

const relevantIdentities =
  await collectives.Ksm.query.FellowshipCollective.Members.getEntries()
    .then((allMembers) => allMembers.filter(({ value }) => value >= 4))
    .then((members) =>
      relayChain.Ksm.query.Identity.IdentityOf.getValues(
        members.map((m) => m.keyArgs),
      ).then((identities) =>
        identities.map((identity, idx) => ({
          address: members[idx].keyArgs[0],
          rank: members[idx].value,
          ...mapRawIdentity(identity),
        })),
      ),
    )

relevantIdentities.forEach((identity) => console.log(identity))

const runtime = await relayChain.runtime.latest()

console.log(runtime.constants.Ksm.System.Version.spec_name)
console.log(runtime.constants.Ksm.System.Version.spec_version)
console.log(
  "Is Balances.transfer_allow_death compatible:",
  runtime.isCompatible((api) => api.Ksm.tx.Balances.transfer_allow_death),
)
