import { getObservableClient } from "@polkadot-api/client"
import { u16, u32, u64 } from "@polkadot-api/substrate-bindings"
import { fromHex, toHex } from "@polkadot-api/utils"
import { lastValueFrom, map, switchMap } from "rxjs"

type ObservableClient = ReturnType<typeof getObservableClient>

export const getNonce =
  (client: ObservableClient) => async (from: Uint8Array) => {
    const lenToDecoder = {
      2: u16.dec,
      4: u32.dec,
      8: u64.dec,
    }

    const chainHead = client.chainHead$()
    return lastValueFrom(
      chainHead.finalized$.pipe(
        switchMap((at) =>
          chainHead.call$(at, "AccountNonceApi_account_nonce", toHex(from)),
        ),
        map((result) => {
          const bytes = fromHex(result)
          const decoder = lenToDecoder[bytes.length as 2 | 4 | 8]
          if (!decoder)
            throw new Error(
              "AccountNonceApi_account_nonce retrieved wrong data",
            )

          return decoder(bytes)
        }),
      ),
    )
  }
