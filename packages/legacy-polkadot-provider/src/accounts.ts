import type { Signer } from "@polkadot/api/types"
import {
  Observable,
  catchError,
  distinctUntilChanged,
  firstValueFrom,
  map,
  noop,
  of,
  share,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs"
import { Callback } from "./types/polkadot-provider"
import { UnsubscribeFn } from "@polkadot-api/substrate-client"
import { AccountId } from "@polkadot-api/substrate-bindings"

declare global {
  interface Window {
    injectedWeb3?: InjectedWeb3
  }
}

export interface InjectedExtension {
  signer: Signer
  accounts: {
    get: () => Array<InjectedAccount>
    subscribe: (cb: (accounts: InjectedAccount[]) => void) => () => void
  }
}

export type InjectedWeb3 = Record<
  string,
  | {
      enable: () => Promise<InjectedExtension>
    }
  | undefined
>

const noSigner = (() => {
  throw new Error("No signer detected")
}) as unknown as NonNullable<Signer["signPayload"]>

export const getSigner = async (
  injected: Promise<InjectedExtension | undefined>,
): Promise<NonNullable<Signer["signPayload"]>> =>
  (await injected)?.signer?.signPayload ?? noSigner

export type KeypairType = "ed25519" | "sr25519" | "ecdsa"
export interface InjectedAccount {
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

const emptyList: InjectedAccount[] = []

export const getAllAccounts$ = (
  injected$: Observable<Promise<InjectedExtension | undefined> | undefined>,
) => {
  const result = injected$.pipe(
    switchMap((x) => {
      if (!x) return of(emptyList)
      return new Observable<InjectedAccount[]>((observer) => {
        observer.next(emptyList)
        let onDone = noop
        let isRunning = true

        x.then((web3) => {
          if (!isRunning) return
          if (!web3?.accounts?.subscribe) return observer.next([])

          onDone = web3.accounts.subscribe((x) => {
            observer.next(x)
          })
        })

        return () => {
          isRunning = false
          onDone()
        }
      })
    }),
    startWith(emptyList),
    distinctUntilChanged(),
    shareReplay(1),
  )
  result.subscribe()
  return result
}

export interface Account {
  address: string
  publicKey: Uint8Array
  displayName?: string
}

export const getAccountsChainFns = (
  genesisHash: string,
  ss58format: number,
  allAccounts$: Observable<InjectedAccount[]>,
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
            (data) => !data.genesisHash || data.genesisHash === genesisHash,
          )
          .map(({ address: addressRaw, name }) => {
            const publicKey = encoder(addressRaw as any)
            const address = decoder(publicKey)
            return {
              publicKey,
              address,
              displayName: name,
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
