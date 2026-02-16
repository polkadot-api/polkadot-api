import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"
import { MultiAddress, wnd } from "@polkadot-api/descriptors"
import { LedgerSigner } from "@polkadot-api/ledger-signer"
import { AccountId, createClient } from "polkadot-api"
import { chainSpec } from "polkadot-api/chains/westend"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"

const smoldot = start()
const client = createClient(
  getSmProvider(() => smoldot.addChain({ chainSpec })),
)
const api = client.getTypedApi(wnd)

const transport = await TransportNodeHid.create()
const ledgerSigner = new LedgerSigner(transport)

// get first 10 addresses and query balances for them
const accId = AccountId(42)
const pubkeys = new Array(10)
  .fill(0)
  .map((_, idx) => ledgerSigner.getPubkey(idx))

const balances = await Promise.all(
  pubkeys.map(async (prom) => {
    const pubkey = await prom
    const addr = accId.dec(pubkey)
    console.log(`got ${addr}`)
    const value = await api.query.System.Account.getValue(addr)
    console.log(`queried ${addr}`)
    return { addr, value }
  }),
)
const totalBalance = balances.reduce(
  (p, { value: { data } }) => p + (data.free + data.frozen),
  0n,
)
console.log({ totalBalance })

// send a 1 WND from addr 0 to addr 1
const dest = accId.dec(await ledgerSigner.getPubkey(1))
const signer = await ledgerSigner.getPolkadotSigner(
  {
    // this info should be get off-chain, from the chainspec
    decimals: 12,
    tokenSymbol: "WND",
  },
  0,
)
api.tx.Balances.transfer_keep_alive({
  dest: MultiAddress.Id(dest),
  // 1 WND -> 12 decimals
  value: 10n ** 12n,
})
  .signSubmitAndWatch(signer)
  .subscribe({
    next(value) {
      console.log(value)
    },
    error(err) {
      console.error(err)
    },
  })
