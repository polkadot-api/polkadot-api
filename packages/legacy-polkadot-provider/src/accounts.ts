import type { Signer } from "@polkadot/api/types"
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

export const getAllAccounts$ = (
  injected: Promise<InjectedExtension | undefined>,
) => {
  const accountsSubsribe = (cb: (accounts: InjectedAccount[]) => void) => {
    let onDone = noop
    let isRunning = true

    injected.then((web3) => {
      if (!isRunning || !web3) return
      onDone = web3.accounts.subscribe(cb)
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
