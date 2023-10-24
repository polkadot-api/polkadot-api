import type { Signer } from "@polkadot/api/types"
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import {
  web3AccountsSubscribe,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp"
import { Observable, firstValueFrom, map, share, shareReplay } from "rxjs"
import { Callback } from "./types/polkadot-provider"
import { UnsubscribeFn } from "@polkadot-api/substrate-client"
import { AccountId } from "@polkadot-api/substrate-bindings"

export const signer: Promise<Signer> = web3Enable("legacy-polkadot-provider")
  .then(() => web3FromSource("polkadot-js"))
  .then(({ signer }) => signer)

const allAccounts$ = new Observable<InjectedAccountWithMeta[]>((observer) => {
  let unsubscription: Promise<() => void> | (() => void) =
    web3AccountsSubscribe((x) => {
      observer.next(x)
    }).then((x) => {
      unsubscription = x
      return x
    })

  return () => {
    if (unsubscription instanceof Promise) {
      unsubscription.then((x) => {
        x()
      })
    } else {
      unsubscription()
    }
  }
}).pipe(shareReplay(1))
allAccounts$.subscribe()

export const accountsReady = firstValueFrom(allAccounts$)

export interface Account {
  address: string
  publicKey: Uint8Array
  displayName?: string
}

export const getAccountsChainFns = (
  genesisHash: string,
  ss58format: number,
) => {
  const encoder = AccountId().enc
  const decoder = AccountId(ss58format).dec

  let accounts: Account[] = []

  const accounts$ = allAccounts$
    .pipe(
      map((innerAccounts) =>
        innerAccounts
          .filter(
            ({ meta }) => !meta.genesisHash || meta.genesisHash === genesisHash,
          )
          .map(({ address: addressRaw, meta }) => {
            const publicKey = encoder(addressRaw as any)
            const address = decoder(publicKey)
            return {
              publicKey,
              address,
              displayName: meta.name,
            }
          }),
      ),
    )
    .pipe(share())

  accounts$.subscribe((x) => {
    accounts = x
  })

  const getAccounts = () => accounts

  const onAccountsChange = (
    onAccounts: Callback<
      Array<{
        address: string
        publicKey: Uint8Array
        displayName?: string
      }>
    >,
  ): UnsubscribeFn => {
    if (accounts) onAccounts(accounts)
    const subscription = accounts$.subscribe(onAccounts)

    return () => {
      subscription.unsubscribe()
    }
  }

  return { onAccountsChange, getAccounts }
}
