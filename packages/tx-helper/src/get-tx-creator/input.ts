import {
  ConsumerCallback,
  OnCreateTxCtx,
  UserSignedExtensionName,
  Callback,
} from "@/types"
import { Observable, filter, firstValueFrom, map, noop, share } from "rxjs"

export const getInput$ = <T extends Array<UserSignedExtensionName>>(
  ctx: OnCreateTxCtx<T>,
  onCreateTx: (
    context: OnCreateTxCtx<T>,
    callback: Callback<null | ConsumerCallback<T>>,
  ) => void,
) => {
  const { userSingedExtensionsName: user, unknownSignedExtensions: unknown } =
    ctx

  const input$ = new Observable<ConsumerCallback<T>>((observer) => {
    let onInput: Callback<null | ConsumerCallback<T>> = (x) => {
      if (!x) return observer.error(new Error("User cancelled tx"))

      const userKeys = user
      for (let i = 0; i < userKeys.length; i++) {
        const userKey = userKeys[i]
        if (Object.hasOwn(x.userSignedExtensionsData as any, userKey)) continue

        if (!x.overrides[userKey])
          return observer.error(new Error(`Missing user data for "${userKey}"`))
      }

      const missingUnknown = unknown.filter((uKey) => !x.overrides[uKey])

      if (missingUnknown.length) {
        return observer.error(
          new Error(
            `Missing signed-extensions: "${missingUnknown.join(", ")}"`,
          ),
        )
      }

      observer.next(x)
      observer.complete()
    }

    onCreateTx(ctx, (x) => {
      Promise.resolve().then(() => {
        onInput(x as any)
      })
    })

    return () => {
      onInput = noop
    }
  }).pipe(share())

  const getUserInput$ = (key: UserSignedExtensionName) =>
    input$.pipe(
      map(
        ({ userSignedExtensionsData }) =>
          (userSignedExtensionsData as any)[key],
      ),
      filter((x) => x !== undefined),
    )

  const overrides$: Observable<
    Record<
      string,
      {
        value: Uint8Array
        additionalSigned: Uint8Array
      }
    >
  > = input$.pipe(map(({ overrides }) => overrides))

  const signer$ = input$.pipe(
    map(({ signer, signingType }) => ({ signer, signingType })),
  )

  return {
    getUserInput$,
    overrides: firstValueFrom(overrides$),
    signer$,
  }
}
