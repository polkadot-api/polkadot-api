import { randomBytes } from "crypto"
import {
  combineLatest,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  switchMap,
} from "rxjs"
import { expect, describe, it } from "vitest"
import { start } from "polkadot-api/smoldot"
import { AccountId, SS58String, TxEvent, createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { WebSocketProvider } from "polkadot-api/ws-provider/node"
import { createClient as createRawClient } from "@polkadot-api/substrate-client"
import { MultiAddress, roc } from "@polkadot-api/descriptors"
import { accounts } from "./keyring"

const smoldot = start()

const rawClient = createRawClient(WebSocketProvider("ws://127.0.0.1:9934/"))

// The retrial system is needed because often the `sync_state_genSyncSpec`
// request fails immediately after starting zombienet.
const getChainspec = async (count = 1): Promise<{}> => {
  try {
    return await rawClient.request<{}>("sync_state_genSyncSpec", [false])
  } catch (e) {
    if (count === 20) throw e
    await new Promise((res) => setTimeout(res, 3_000))
    return getChainspec(count + 1)
  }
}

const chainSpec = JSON.stringify(await getChainspec())
rawClient.destroy()

const accountIdDec = AccountId().dec
const ED = 10_000_000_000n

console.log("got the chainspec")

const FEE_VARIATION_TOLERANCE = 1_000_000n

describe("E2E", async () => {
  console.log("starting the client")
  const client = createClient(getSmProvider(smoldot.addChain({ chainSpec })))
  const api = client.getTypedApi(roc)

  console.log("getting the latest runtime")
  const runtime = await api.runtime.latest()

  it("evaluates constant values", () => {
    const ss58Prefix = api.constants.System.SS58Prefix(runtime)
    expect(ss58Prefix).toEqual(42)

    const ed = api.constants.Balances.ExistentialDeposit(runtime)
    expect(ed).toEqual(ED)
  })

  it("reads from storage", async () => {
    const finalized = await firstValueFrom(client.finalizedBlock$)
    const number = await api.query.System.Number.getValue({
      at: finalized.hash,
    })

    expect(number).toEqual(finalized.number)
  })

  it("sr25519 transactions", async () => {
    const amount = ED * 10n
    const targets = Object.values(accounts)
      .map((account) =>
        Object.entries(account)
          .filter(([key]) => key !== "sr25519")
          .map(([, value]) => value),
      )
      .flat()
      .map((x) => accountIdDec(x.publicKey))

    const alice = accounts["alice"]["sr25519"]
    const bob = accounts["bob"]["sr25519"]

    const [aliceInitialNonce, bobInitialNonce] = await Promise.all(
      [alice, bob].map((who) =>
        api.apis.AccountNonceApi.account_nonce(accountIdDec(who.publicKey)),
      ),
    )

    const targetsInitialFreeBalances = await Promise.all(
      targets.map((target) =>
        api.query.System.Account.getValue(target).then((x) => x.data.free),
      ),
    )

    const calls = targets.map(
      (to) =>
        api.tx.Balances.transfer_allow_death({
          dest: MultiAddress.Id(to),
          value: amount,
        }).decodedCall,
    )

    const aliceTransfer = api.tx.Utility.batch_all({ calls: calls.slice(0, 2) })
    const bobTransfer = api.tx.Utility.batch_all({ calls: calls.slice(2) })

    const [aliceEstimatedFee, bobEstimatedFee] = await Promise.all(
      [aliceTransfer, bobTransfer].map((call, idx) =>
        call.getEstimatedFees((idx === 0 ? alice : bob).publicKey),
      ),
    )

    const [aliceActualFee, bobActualFee] = await Promise.all(
      [aliceTransfer, bobTransfer].map(async (call, idx) => {
        const result = await call.signAndSubmit(idx === 0 ? alice : bob)
        const [{ actual_fee }] =
          api.event.TransactionPayment.TransactionFeePaid.filter(result.events)
        return actual_fee
      }),
    )

    expect(aliceEstimatedFee / FEE_VARIATION_TOLERANCE).toEqual(
      aliceActualFee / FEE_VARIATION_TOLERANCE,
    )
    expect(bobEstimatedFee / FEE_VARIATION_TOLERANCE).toEqual(
      bobActualFee / FEE_VARIATION_TOLERANCE,
    )

    const [alicePostNonce, bobPostNonce] = await Promise.all(
      [alice, bob].map((who) =>
        api.apis.AccountNonceApi.account_nonce(accountIdDec(who.publicKey)),
      ),
    )

    const targetsPostFreeBalances = await Promise.all(
      targets.map((target) =>
        api.query.System.Account.getValue(target).then((x) => x.data.free),
      ),
    )

    expect(targetsPostFreeBalances).toEqual(
      targetsInitialFreeBalances.map((x) => x + amount),
    )
    expect(alicePostNonce).toEqual(aliceInitialNonce + 1)
    expect(bobPostNonce).toEqual(bobInitialNonce + 1)
  })

  it.each(["ecdsa", "ed25519"] satisfies Array<"ecdsa" | "ed25519">)(
    "%s transactions",
    async (type) => {
      const alice = accounts["alice"][type]
      const bob = accounts["bob"][type]

      // let's wait until they have enough balance
      await firstValueFrom(
        combineLatest(
          [alice, bob].map((from) =>
            api.query.System.Account.watchValue(
              accountIdDec(from.publicKey),
            ).pipe(map((x) => x.data.free)),
          ),
        ).pipe(
          filter((balances) => balances.every((balance) => balance >= ED * 2n)),
        ),
      )

      const to = Array(2)
        .fill(null)
        .map(() => accountIdDec(randomBytes(32)))

      const balancesPre = await Promise.all(
        to.map((who) =>
          api.query.System.Account.getValue(who).then(
            ({ data: { free } }) => free,
          ),
        ),
      )

      await Promise.all(
        [alice, bob].map((from, idx) =>
          api.tx.Balances.transfer_allow_death({
            dest: MultiAddress.Id(to[idx]),
            value: ED,
          }).signAndSubmit(from, {
            mortality: { mortal: true, period: 64 },
            tip: 5n,
          }),
        ),
      )

      const balancesPro = await Promise.all(
        to.map((who) =>
          api.query.System.Account.getValue(who).then(
            ({ data: { free } }) => free,
          ),
        ),
      )

      expect(balancesPro).toEqual(balancesPre.map((x) => x + ED))
    },
  )

  it("optimistic transactions", async () => {
    const amount = ED * 10n
    const target = AccountId().dec(randomBytes(32))

    const alice = accounts["alice"]["sr25519"]
    const transfer = api.tx.Balances.transfer_allow_death({
      dest: MultiAddress.Id(target),
      value: amount,
    })

    const targetPreFreeBalance = await api.query.System.Account.getValue(
      target,
    ).then((x) => x.data.free)

    await lastValueFrom(
      transfer.signSubmitAndWatch(alice).pipe(
        filter(
          (e): e is TxEvent & { type: "bestChainBlockIncluded" } =>
            e.type === "bestChainBlockIncluded",
        ),
        switchMap(({ block: { hash: at } }) =>
          transfer.signSubmitAndWatch(alice, { at }),
        ),
      ),
    )

    const targetPostFreeBalance = await api.query.System.Account.getValue(
      target,
    ).then((x) => x.data.free)

    expect(targetPostFreeBalance).toEqual(targetPreFreeBalance + amount * 2n)
  })

  it("custom nonce transactions", async () => {
    const alice = accounts["alice"]["sr25519"]
    const bob = accounts["bob"]["sr25519"]
    const bobAddress = accountIdDec(bob.publicKey)

    const [aliceInitialNonce, bobInitialBalance] = await Promise.all([
      api.apis.AccountNonceApi.account_nonce(accountIdDec(alice.publicKey)),
      api.query.System.Account.getValue(bobAddress).then((x) => x.data.free),
    ])

    const transsferTx = api.tx.Balances.transfer_allow_death({
      dest: MultiAddress.Id(bobAddress),
      value: ED,
    })

    const N_PARALLEL_TRANSACTIONS = 3
    await Promise.all(
      Array(N_PARALLEL_TRANSACTIONS)
        .fill(null)
        .map((_, diff) =>
          transsferTx.signAndSubmit(alice, { nonce: aliceInitialNonce + diff }),
        ),
    )

    const bobCurrentBalance = await api.query.System.Account.getValue(
      bobAddress,
    ).then((x) => x.data.free)

    expect(bobCurrentBalance).toEqual(
      bobInitialBalance + ED * BigInt(N_PARALLEL_TRANSACTIONS),
    )
  })

  it("operation-limit recovery", async () => {
    const addresses = Array(70)
      .fill(null)
      .map(() => AccountId().dec(randomBytes(32)))

    console.log(`querying ${addresses.length} identities`)
    const result = await api.query.Identity.IdentityOf.getValues(
      addresses.map((address) => [address] as [SS58String]),
    )
    expect(result.length).toEqual(addresses.length)
  })
})
