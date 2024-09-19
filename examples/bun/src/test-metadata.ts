import { getDynamicBuilder, getLookupFn } from "@polkadot-api/metadata-builders"
import { getObservableClient } from "@polkadot-api/observable-client"
import { metadata } from "@polkadot-api/substrate-bindings"
import { createClient } from "@polkadot-api/substrate-client"
import { AccountId } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { toHex } from "polkadot-api/utils"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { filter, firstValueFrom } from "rxjs"

const client = getObservableClient(
  createClient(
    withPolkadotSdkCompat(
      getWsProvider("wss://polkadot-public-rpc.blockops.network/ws"),
    ),
  ),
)

const chainHead = client.chainHead$()

const runtime = await firstValueFrom(chainHead.runtime$.pipe(filter(Boolean)))

const hexMetadata = metadata.dec(toHex(runtime.metadataRaw))

console.log(hexMetadata.metadata.value)

/*
const lookupFn = getLookupFn(metadata)

const dynBuilder = getDynamicBuilder(lookupFn)

const result = dynBuilder.buildConstant("System", "Version")
const systemVersionHex = metadata.pallets
  .find((x) => x.name === "System")!
  .constants.find((x) => x.name === "Version")!.value

console.log(
  AccountId(63).dec(
    AccountId(1).enc("15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5"),
  ),
)
*/
