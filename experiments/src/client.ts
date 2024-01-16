import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { noop } from "@polkadot-api/utils"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { createClient } from "@polkadot-api/client"

// hint: remember to run the `codegen` script
import ksm, { Queries } from "./descriptors/ksm"
import { Binary } from "@polkadot-api/substrate-bindings"
const scProvider = getScProvider()

const polkadotChain = await getChain({
  provider: scProvider(WellKnownChain.ksmcc3).relayChain,
  keyring: { getPairs: () => [], onKeyPairsChanged: () => noop },
})

const relayChain = createClient(polkadotChain.connect, { ksm, ksm1_2: ksm })
const collectives = relayChain

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
