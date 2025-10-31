import { Binary, createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"
import { chainSpec } from "polkadot-api/chains/polkadot"
import { defer, map, mergeMap, take, withLatestFrom } from "rxjs"
import { wnd } from "@polkadot-api/descriptors"
import { getExtrinsicDecoder } from "@polkadot-api/tx-utils"

export const JSONprint = (e: unknown) =>
  JSON.stringify(
    e,
    (_, v) =>
      typeof v === "bigint"
        ? v.toString()
        : v instanceof Binary
          ? v.asHex()
          : v,
    2,
  )

const smoldot = start()

const client = createClient(
  getSmProvider(() => smoldot.addChain({ chainSpec })),
)
const api = client.getTypedApi(wnd)

const extrinsicDecoder$ = defer(() =>
  api.api.Metadata.metadata_at_version(15),
).pipe(map((metadata) => getExtrinsicDecoder(metadata!.asBytes())))

client.finalizedBlock$
  .pipe(
    take(10),
    mergeMap((blockInfo) =>
      client
        .watchBlockBody(blockInfo.hash)
        .pipe(map((txs) => ({ txs, blockInfo }))),
    ),
    withLatestFrom(extrinsicDecoder$),
    map(([{ txs, blockInfo }, extrinsicDecoder]) => ({
      blockInfo,
      txs: txs.map(extrinsicDecoder).filter((x) => x.type === "signed"),
    })),
  )
  .subscribe({
    next(x) {
      console.log(JSONprint(x))
    },
    error: console.error,
    complete() {
      client.destroy()
      smoldot.terminate()
    },
  })
