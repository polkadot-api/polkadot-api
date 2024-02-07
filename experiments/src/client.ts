import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { noop } from "@polkadot-api/utils"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { createClient } from "@polkadot-api/client"

// hint: remember to run the `codegen` script
import ksm, {
  EcXcmV2OriginKind,
  EcXcmV3Instruction,
  Queries,
} from "./descriptors/ksm"
import { Enum, Binary, EnumOption } from "@polkadot-api/substrate-bindings"
const scProvider = getScProvider()

const polkadotChain = await getChain({
  provider: scProvider(WellKnownChain.ksmcc3).relayChain,
  keyring: { getPairs: () => [], onKeyPairsChanged: () => noop },
})

const relayChain = createClient(polkadotChain.connect, { ksm, ksm1_2: ksm })
const collectives = relayChain

export let foo: (x: Enum<EcXcmV2OriginKind>) => null = () => null as any

const transact1: EnumOption<EcXcmV3Instruction, "Transact"> = {
  call: Binary(""),
  origin_kind: Enum("Xcm"),
  require_weight_at_most: {
    ref_time: 3n,
    proof_size: 33n,
  },
}

const instructions: Array<Enum<EcXcmV3Instruction>> = [
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

relayChain.ksm.tx.XcmPallet.execute(Enum("V3", instructions), {
  proof_size: 3n,
  ref_time: 3n,
})

relayChain.ksm.tx.Utility.batch([
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
  await collectives.ksm.query.FellowshipCollective.Members.getEntries()
    .then((allMembers) => allMembers.filter(({ value }) => value >= 4))
    .then((members) =>
      relayChain.ksm.query.Identity.IdentityOf.getValues(
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

console.log(runtime.constants.ksm.System.Version.spec_name)
console.log(runtime.constants.ksm.System.Version.spec_version)
console.log(
  "Is Balances.transfer_allow_death compatible:",
  runtime.isCompatible((api) => api.ksm.tx.Balances.transfer_allow_death),
)
