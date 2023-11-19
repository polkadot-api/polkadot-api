import { getChain, KeyPair } from "@polkadot-api/node-polkadot-provider"
import { createPullClient, WellKnownChain } from "@polkadot-api/client"
import polkadotInfo, { IdentityIdentityOfStorage } from "./chain-data/polkadot"
import collectivesInfo from "./chain-data/collectives"
import collectivesChainSpec from "./collectives-polkadot"
import { ConnectProvider, ScProvider } from "@polkadot-api/sc-provider"
import { noop } from "rxjs"
import { fromHex, toHex } from "@polkadot-api/utils"
import { ed25519 } from "@noble/curves/ed25519"
import { AccountId, SS58String } from "@polkadot-api/substrate-bindings"
import westend from "./westend"
import { getSyncProvider } from "@polkadot-api/json-rpc-provider-proxy"

const withLogsProvider = (input: ConnectProvider): ConnectProvider => {
  return (onMsg) => {
    const result = input((msg) => {
      console.log("<< " + msg)
      onMsg(msg)
    })

    return {
      ...result,
      send: (msg) => {
        console.log(">> " + msg)
        result.send(msg)
      },
    }
  }
}

export const WebSocketProvider = (uri: string, protocols?: string | string[]) =>
  getSyncProvider(async () => {
    const socket = new WebSocket(uri, protocols)

    await new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        resolve()
        socket.removeEventListener("error", onError)
      }
      socket.addEventListener("open", onOpen, { once: true })

      const onError = (e: Event) => {
        reject(e)
        socket.removeEventListener("open", onOpen)
      }
      socket.addEventListener("error", onError, { once: true })
    })

    return (onMessage, onHalt) => {
      const _onMessage = (e: MessageEvent<string>) => {
        onMessage(e.data)
      }

      socket.addEventListener("message", _onMessage)
      socket.addEventListener("error", onHalt)
      socket.addEventListener("close", onHalt)

      return {
        send(msg) {
          socket.send(msg)
        },
        disconnect() {
          socket.removeEventListener("message", _onMessage)
          socket.removeEventListener("error", onHalt)
          socket.removeEventListener("close", onHalt)
          socket.close()
        },
      }
    }
  })

const priv = fromHex(
  "0xb18290bac66576e4067e0c47eb23b2eb40dc2a5906fe9af94063dc163367a1f0",
)
const publicKey = ed25519.getPublicKey(priv)

const keyPair: KeyPair = {
  address: AccountId().dec(publicKey),
  publicKey,
  signingType: "Ed25519",
  sign: async (input) => ed25519.sign(input, priv),
  name: "keyPair",
}

const polkadotChain = await getChain({
  provider: withLogsProvider(WebSocketProvider("wss://dot-rpc.stakeworld.io")),
  keyring: { getPairs: () => [keyPair], onKeyPairsChanged: () => noop },
})

/*
const collectivesChain = await getChain({
  provider: ScProvider(collectivesChainSpec),
  keyring: { getPairs: () => [], onKeyPairsChanged: () => noop },
})
*/

const relayChain = createPullClient(
  polkadotChain.connect,
  polkadotInfo,
  collectivesInfo,
)
const sub = await relayChain.tx.Balances.transfer.submit(
  keyPair.address as SS58String,
  {
    tag: "Id",
    value: "5DyTf5gsCQG3ycM1venTzjoEPMUhKtoU9e9zg1MvnJddbye8" as SS58String,
  },
  1000000000000000000000000000000000n,
)

console.log(
  JSON.stringify(sub, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2),
)

/*

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
  await collectives.query.FellowshipCollective.Members.getEntries()
    .then((allMembers) => allMembers.filter(({ value }) => value >= 4))
    .then((members) =>
      relayChain.query.Identity.IdentityOf.getValues(
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
*/
