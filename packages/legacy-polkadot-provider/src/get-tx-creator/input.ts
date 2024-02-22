import {
  UserSignedExtensionsData,
  OnCreateTxCtx,
  UserSignedExtensionName,
} from "@/types/public-types"
import { Callback } from ".."
import { Observable, filter, map, noop, share } from "rxjs"

export const getInput$ = <T extends Array<UserSignedExtensionName>>(
  ctx: OnCreateTxCtx<T>,
  onCreateTx: (
    context: OnCreateTxCtx<T>,
    callback: Callback<null | UserSignedExtensionsData<T>>,
  ) => void,
) => {
  const { userSingedExtensionsName: user } = ctx

  const input$ = new Observable<UserSignedExtensionsData<T>>((observer) => {
    let onInput: Callback<null | UserSignedExtensionsData<T>> = (x) => {
      if (!x) return observer.error(new Error("User cancelled tx"))

      const userKeys = user
      for (let i = 0; i < userKeys.length; i++) {
        const userKey = userKeys[i]
        if (Object.hasOwn(x, userKey)) continue
        return observer.error(new Error(`Missing user data for "${userKey}"`))
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
      map((userSignedExtensionsData) => (userSignedExtensionsData as any)[key]),
      filter((x) => x !== undefined),
    )

  return getUserInput$
}
