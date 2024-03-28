import { getScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { getChain } from "@polkadot-api/node-polkadot-provider"
import { createClient, Binary } from "@polkadot-api/client"

// hint: remember to run the `codegen` script
import { KsmQueries, ksm } from "@polkadot-api/client/descriptors"
const scProvider = getScProvider()

const polkadotChain = getChain({
  provider: scProvider(WellKnownChain.ksmcc3).relayChain,
  keyring: [],
})

const relayChain = createClient(polkadotChain)
// const collectives = relayChain

const apis = relayChain.getTypedApi(ksm)

const identityDataToString = (value: string | Binary | undefined) =>
  typeof value === "object" ? value.asText() : value ?? ""

function mapRawIdentity(
  rawIdentity?: KsmQueries["Identity"]["IdentityOf"]["Value"],
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
      .map(([key, x]) => [
        key,
        identityDataToString(
          x instanceof Binary ? x.asText() : x?.value?.asText(),
        ),
      ])
      .filter(([, value]) => value),
  )

  return { ...info, ...additionalInfo }
}

const relevantIdentities =
  await apis.query.FellowshipCollective.Members.getEntries()
    .then((allMembers) => allMembers.filter(({ value }) => value >= 4))
    .then((members) =>
      apis.query.Identity.IdentityOf.getValues(
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
