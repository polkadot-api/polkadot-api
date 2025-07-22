import { randomBytes } from "crypto"
import {
  combineLatest,
  filter,
  firstValueFrom,
  identity,
  lastValueFrom,
  map,
  mergeMap,
  NEVER,
  switchMap,
  take,
  tap,
} from "rxjs"
import { expect, describe, it, beforeAll } from "vitest"
import { start } from "polkadot-api/smoldot"
import {
  AccountId,
  Binary,
  CompatibilityLevel,
  PolkadotClient,
  SS58String,
  TxEvent,
  TypedApi,
  createClient,
  BlockNotPinnedError,
} from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { getWsProvider } from "polkadot-api/ws-provider/node"
import {
  createClient as createRawClient,
  JsonRpcProvider,
} from "@polkadot-api/substrate-client"
import { getMetadata, MultiAddress, roc } from "@polkadot-api/descriptors"
import { accounts } from "./keyring"
import { getPolkadotSigner } from "polkadot-api/signer"
import { fromHex } from "@polkadot-api/utils"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { withLogsRecorder } from "polkadot-api/logs-provider"
import { appendFileSync } from "fs"

const fakeSignature = new Uint8Array(64)
const getFakeSignature = () => fakeSignature
const fakeSigner = (from: Uint8Array) =>
  getPolkadotSigner(from, "Sr25519", getFakeSignature)

// The retrial system is needed because often the `sync_state_genSyncSpec`
// request fails immediately after starting zombienet.
let { PROVIDER, VERSION } = process.env

let enhancer: (input: JsonRpcProvider) => JsonRpcProvider = identity
let appendSmLog:
  | ((level: number, target: string, message: string) => void)
  | undefined = undefined

if (VERSION) {
  const jsonRpcFileName = `./${VERSION}_JSON_RPC`
  enhancer = (input) =>
    withLogsRecorder(
      (log) => appendFileSync(jsonRpcFileName, log + "\n"),
      input,
    )

  const smoldotFileName = `./${VERSION}_SMOLDOT`
  appendSmLog = (level: number, target: string, message: string) => {
    const msg = `${tickDate} (${level})${target}\n${message}\n`
    if (level <= 3) console.log(msg)
    appendFileSync(smoldotFileName, msg)
  }
}

let tickDate = ""
const setTickDate = () => {
  tickDate = new Date().toISOString()
  setTimeout(setTickDate, 0)
}
setTickDate()

if (PROVIDER !== "sm" && PROVIDER !== "ws")
  throw new Error(`$PROVIDER env has to be "ws" or "sm". Got ${PROVIDER}`)
let ARCHIVE = false
const rawClient = createRawClient(
  enhancer(getWsProvider("ws://127.0.0.1:9934/")),
)
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
const FEE_VARIATION_TOLERANCE = 10_000_000n

console.log("got the chainspec")

describe("E2E", async () => {
  let client: PolkadotClient
  console.log("starting the client")
  if (PROVIDER === "sm") {
    const smoldot = start({
      logCallback: appendSmLog,
      maxLogLevel: appendSmLog ? 7 : 3,
    })
    client = createClient(
      enhancer(getSmProvider(smoldot.addChain({ chainSpec }))),
    )
  } else {
    client = createClient(
      enhancer(withPolkadotSdkCompat(getWsProvider("ws://127.0.0.1:9934"))),
      { getMetadata },
    )
    const { methods } = await client._request<{ methods: string[] }, []>(
      "rpc_methods",
      [],
    )
    ARCHIVE = methods.some((m) => m.startsWith("archive_v1"))
    console.log("ARCHIVE", ARCHIVE)
    if (!ARCHIVE) console.log(JSON.stringify(methods))
  }
  console.log("client started")
  const api = client.getTypedApi(roc)
  const firstBlock = client.getFinalizedBlock()

  it("does not throw BlockNotPinnedError on initial blocks", async () => {
    await lastValueFrom(
      client.blocks$.pipe(
        take(3),
        mergeMap(async (block) =>
          api.query.System.Events.getValue({ at: block.hash }),
        ),
      ),
    )

    expect(true).toBe(true)
  })

  console.log("waiting for compatibility token")
  const token = await api.compatibilityToken
  console.log("got the compatibility token")

  it("unsafe API", async () => {
    const unsafe = client.getUnsafeApi<typeof roc>()
    expect(unsafe.runtimeToken).toBeDefined()
    const unsTok = await unsafe.runtimeToken

    // let's check the token indeed works
    expect(typeof unsafe.constants.Balances.ExistentialDeposit()).toBe("object")
    expect(unsafe.constants.Balances.ExistentialDeposit(unsTok)).toEqual(ED)
  })

  it("evaluates constant values", () => {
    const ss58Prefix = api.constants.System.SS58Prefix(token)
    expect(ss58Prefix).toEqual(42)

    const ed = api.constants.Balances.ExistentialDeposit(token)
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

    expect(Number(aliceEstimatedFee / FEE_VARIATION_TOLERANCE)).toBeCloseTo(
      Number(aliceActualFee / FEE_VARIATION_TOLERANCE),
    )
    expect(Number(bobEstimatedFee / FEE_VARIATION_TOLERANCE)).toBeCloseTo(
      Number(bobActualFee / FEE_VARIATION_TOLERANCE),
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

    // txs from call data
    const txCallData = aliceTransfer.getEncodedData(token)
    const reEncodedTx = api.txFromCallData(txCallData, token)
    expect(reEncodedTx.getEncodedData(token).asHex()).toBe(txCallData.asHex())
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
            e.type === "txBestBlocksState" && e.found,
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

  it("different mortality values", async () => {
    const alice = accounts["alice"]["sr25519"]
    const bob = accounts["bob"]["sr25519"]
    const aliceAddress = accountIdDec(alice.publicKey)
    const bobAddress = accountIdDec(bob.publicKey)
    const initialNonce =
      await api.apis.AccountNonceApi.account_nonce(aliceAddress)

    const tx = api.tx.Balances.transfer_allow_death({
      dest: MultiAddress.Id(bobAddress),
      value: ED,
    })
    let i = 0
    const submitAndWait = (
      mortality: { mortal: false } | { mortal: true; period: number },
    ) =>
      lastValueFrom(
        tx.signSubmitAndWatch(alice, { mortality, nonce: initialNonce + i++ }),
      )

    await Promise.all([
      submitAndWait({ mortal: false }),
      submitAndWait({ mortal: true, period: 8 }),
      submitAndWait({ mortal: true, period: 25 }),
      submitAndWait({
        mortal: true,
        period: api.constants.System.BlockHashCount(token),
      }),
    ])

    const currentNonce =
      await api.apis.AccountNonceApi.account_nonce(aliceAddress)

    expect(currentNonce).toEqual(initialNonce + 4)
  })

  it("keeps on validating transactions after they have been broadcasted", async () => {
    const alice = accounts["alice"]["sr25519"]
    const bob = accounts["bob"]["sr25519"]
    const bobAddress = accountIdDec(bob.publicKey)

    const bobInitialBalance = await api.query.System.Account.getValue(
      bobAddress,
    ).then((x) => x.data.free)

    const transsferTx = api.tx.Balances.transfer_allow_death({
      dest: MultiAddress.Id(bobAddress),
      value: ED,
    })

    let nBroadcasted = 0
    let nError = 0
    let nSuccess = 0

    await Promise.all(
      Array(3)
        .fill(null)
        .map(() =>
          lastValueFrom(
            transsferTx.signSubmitAndWatch(alice).pipe(
              tap((x) => {
                if (x.type === "broadcasted") nBroadcasted++
              }),
            ),
          ).then(
            () => nSuccess++,
            () => nError++,
          ),
        ),
    )

    expect(nBroadcasted).toBe(3)
    expect(nError).toBe(2)
    expect(nSuccess).toBe(1)

    const bobCurrentBalance = await api.query.System.Account.getValue(
      bobAddress,
    ).then((x) => x.data.free)

    expect(bobCurrentBalance).toEqual(bobInitialBalance + ED)
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

  it("runtime call with extrinsic as input", async () => {
    const tx = api.tx.System.remark({
      remark: Binary.fromHex("hello world!"),
    })
    const binaryExtrinsic = Binary.fromOpaqueHex(
      await tx.sign(fakeSigner(accounts["alice"]["sr25519"].publicKey)),
    )

    const [{ partial_fee: manualFee }, estimatedFee] = await Promise.all([
      api.apis.TransactionPaymentApi.query_info(
        binaryExtrinsic,
        binaryExtrinsic.asOpaqueBytes().length,
      ),
      tx.getEstimatedFees(accounts["alice"]["sr25519"].publicKey),
    ])

    expect(manualFee).toEqual(estimatedFee)
  })

  it("consecutive transactions", async () => {
    const signer = accounts["alice"]["sr25519"]

    for (let i = 0; i < 3; i++) {
      const intialNonce = await api.apis.AccountNonceApi.account_nonce(
        accountIdDec(signer.publicKey),
      )

      const tx = api.tx.System.remark({
        remark: Binary.fromHex("first"),
      })

      const initialInBestBlock$ = tx
        .signSubmitAndWatch(signer)
        .pipe(filter((x) => x.type === "txBestBlocksState"))

      await lastValueFrom(
        initialInBestBlock$.pipe(
          switchMap((x) =>
            x.found
              ? tx.signSubmitAndWatch(signer, { at: x.block.hash })
              : NEVER,
          ),
        ),
      )

      const finalNonce = await api.apis.AccountNonceApi.account_nonce(
        accountIdDec(signer.publicKey),
      )

      expect(finalNonce).toBe(intialNonce + 2)
    }
  })

  it("queries opaque storage entries", async () => {
    // some old polkadot-sdk versions don't include this pallet
    // ensure that some version tested include it
    if (
      !(await api.query.CoretimeAssignmentProvider.CoreDescriptors.isCompatible(
        CompatibilityLevel.Partial,
      ))
    ) {
      return
    }

    const entries =
      await api.query.CoretimeAssignmentProvider.CoreDescriptors.getEntries()

    expect(entries.every((x) => !!fromHex(x.keyArgs[0]))).toBe(true)
  })

  it("generates correct storage keys", async () => {
    expect(await api.query.System.Account.getKey()).toEqual(
      "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9",
    )
    expect(
      await api.query.System.Account.getKey(
        "5EjdajLJp5CKhGVaWV21wiyGxUw42rhCqGN32LuVH4wrqXTN",
      ),
    ).toEqual(
      "0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da91cdb29d91f7665b36dc5ec5903de32467628a5be63c4d3c8dbb96c2904b1a9682e02831a1af836c7efc808020b92fa63",
    )
  })

  describe("BlockNotPinnedError", () => {
    const options = {
      at: "0x750d7c25fd87702beabd86afd4cf1cc2a8cdcab7fae89b189900b4fcf894e0e7",
    }
    const aliceAddress = accountIdDec(accounts.alice.sr25519.publicKey)

    it("BlockNotPinnedError: query", async () => {
      await expect(
        api.query.System.Account.getValue(aliceAddress, options),
      ).rejects.toThrowError(BlockNotPinnedError)
    })

    it("BlockNotPinnedError: query System.Number", async () => {
      await expect(
        api.query.System.Number.getValue(options),
      ).rejects.toThrowError(BlockNotPinnedError)
    })

    it("BlockNotPinnedError: apis", async () => {
      await expect(
        api.apis.AccountNonceApi.account_nonce(aliceAddress, options),
      ).rejects.toThrowError(BlockNotPinnedError)
    })

    it("BlockNotPinnedError: body", async () => {
      await expect(() => client.getBlockBody(options.at)).rejects.toThrowError(
        BlockNotPinnedError,
      )
    })

    it("BlockNotPinnedError: header", async () => {
      await expect(client.getBlockHeader(options.at)).rejects.toThrowError(
        BlockNotPinnedError,
      )
    })
  })

  if (PROVIDER === "ws" && ARCHIVE) {
    describe("archive", async () => {
      const aliceAddress = accountIdDec(accounts.alice.sr25519.publicKey)
      let newClient: PolkadotClient
      const oldBlock = await firstBlock
      console.log("oldBlock", oldBlock.hash)
      const options = { at: oldBlock.hash }
      let oldApi: TypedApi<typeof roc>

      beforeAll(async () => {
        do {
          newClient?.destroy()
          console.log("creating archive client")
          newClient = createClient(
            withPolkadotSdkCompat(getWsProvider("ws://127.0.0.1:9934")),
          )
        } while ((await newClient.getFinalizedBlock()).hash === oldBlock.hash)
        oldApi = newClient.getTypedApi(roc)
      })

      it("Archive: query", async () => {
        const {
          data: { free },
        } = await oldApi.query.System.Account.getValue(aliceAddress, options)
        expect(free).toBeGreaterThan(0n)
      })

      it("Archive: query System.Number", async () => {
        expect(await oldApi.query.System.Number.getValue(options)).toEqual(
          oldBlock.number,
        )
      })

      it("Archive: apis", async () => {
        expect(
          await oldApi.apis.AccountNonceApi.account_nonce(
            aliceAddress,
            options,
          ),
        ).toEqual(0)
      })

      it("Archive: body", async () => {
        expect((await newClient.getBlockBody(options.at)).length).not.toBe(0)
      })

      it("Archive: header", async () => {
        expect(await newClient.getBlockHeader(options.at)).not.toBeNull()
      })
    })
  }
})
