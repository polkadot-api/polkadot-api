import { createPullClient, WellKnownChain } from "@polkadot-api/client"
import polkadotInfo, { IdentityIdentityOfStorage } from "./chain-info/polkadot"
import collectivesInfo from "./chain-info/collectives"
import collectivesChainSpec from "./collectives-polkadot"

const relayChain = createPullClient(WellKnownChain.polkadot, polkadotInfo)
const collectives = createPullClient(collectivesChainSpec, collectivesInfo)

function mapRawIdentity(rawIdentity?: IdentityIdentityOfStorage["value"]) {
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
  await collectives.FellowshipCollective.Members.getEntries()
    .then((allMembers) => allMembers.filter(({ value }) => value >= 4))
    .then((members) =>
      relayChain.Identity.IdentityOf.getValues(
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
