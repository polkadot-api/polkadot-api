import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { noop } from "@polkadot-api/utils"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { createClient } from "@polkadot-api/client"

// hint: remember to run the `codegen` script
import ksm, { Queries } from "./descriptors/ksm"

const polkadotChain = await getChain({
  provider: ScProvider(WellKnownChain.ksmcc3),
  keyring: { getPairs: () => [], onKeyPairsChanged: () => noop },
})

const relayChain = createClient(polkadotChain.connect, { ksm })
const collectives = relayChain

function mapRawIdentity(
  rawIdentity?: Queries["Identity"]["IdentityOf"]["Value"],
) {
  if (!rawIdentity) return rawIdentity

  const {
    info: { additional, ...rawInfo },
  } = rawIdentity

  const additionalInfo = Object.fromEntries(
    additional.map(([key, value]) => {
      return [key.value!, value.value!]
    }),
  )

  const info = Object.fromEntries(
    Object.entries(rawInfo)
      .map(([key, value]) => [key, value.value])
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
