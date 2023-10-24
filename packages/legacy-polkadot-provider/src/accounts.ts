import type { Signer } from "@polkadot/api/types"
import type {
  InjectedAccount,
  InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types"
import {
  web3AccountsSubscribe,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp"
import {
  Observable,
  catchError,
  firstValueFrom,
  map,
  noop,
  of,
  share,
  shareReplay,
} from "rxjs"
import { Callback } from "./types/polkadot-provider"
import { UnsubscribeFn } from "@polkadot-api/substrate-client"
import { AccountId } from "@polkadot-api/substrate-bindings"

const noSigner = (() => {
  throw new Error("No signer detected")
}) as unknown as NonNullable<Signer["signPayload"]>

const web3 = web3Enable("legacy-polkadot-provider")

export const getSigner = (
  name: string,
): Promise<NonNullable<Signer["signPayload"]>> =>
  web3.then((options) => {
    const result = options.find((o) => o.name === name)
    if (!result) return noSigner

    web3FromSource(name)
    return result.signer.signPayload ?? noSigner
  })

export const getAllAccounts$ = (name: string) => {
  const accountsSubsribe = (
    cb: (accounts: InjectedAccountWithMeta[]) => void,
  ) => {
    let onDone = noop
    let isRunning = true

    web3
      .then((options) => {
        return options.find((o) => o.name === name)
      })
      .then((x) => {
        if (!x) {
          if (!isRunning) return
          cb([])
          return
        }

        web3AccountsSubscribe(cb).then(
          (x) => {
            if (isRunning) {
              onDone = x
            } else {
              onDone()
            }
          },
          () => {
            if (!isRunning) return
            cb([])
            return
          },
        )
      })

    return () => {
      isRunning = false
      onDone()
    }
  }

  const allAccounts$ = new Observable<InjectedAccount[]>((observer) => {
    return accountsSubsribe((x) => {
      observer.next(x)
    })
  }).pipe(shareReplay(1))
  allAccounts$.subscribe()

  return allAccounts$
}

export interface Account {
  address: string
  publicKey: Uint8Array
  displayName?: string
}

export const getAccountsChainFns = (
  genesisHash: string,
  ss58format: number,
  allAccounts$: Observable<InjectedAccountWithMeta[]>,
) => {
  const encoder = AccountId().enc
  const decoder = AccountId(ss58format).dec

  let accounts: Account[]

  const accounts$ = allAccounts$
    .pipe(
      catchError(() => of([])),
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

  const accountsReady = firstValueFrom(accounts$)
  const getAccounts = async () => {
    await accountsReady
    return accounts
  }

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
