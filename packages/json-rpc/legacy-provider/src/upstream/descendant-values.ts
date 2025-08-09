export const createDescendantValues = (
  request: <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
    onSuccess: (value: Payload) => void,
    onError: (e: any) => void,
  ) => () => void,
) => {
  return (
    rootKey: string,
    at: string,
    onValues: (input: Array<[string, string]>) => void,
    onError: (e: any) => void,
    onDone: () => void,
  ): (() => void) => {
    let isRunning = true
    let areAllKeysDone = false
    let onGoingValues = 0

    const _onError = (e: any) => {
      if (isRunning) {
        isRunning = false
        onError(e)
      }
    }

    const PAGE_SIZE = 1000
    const pullKeys = (startAtKey?: string) => {
      request<[string, number, string | undefined, string], string[]>(
        "state_getKeysPaged",
        [rootKey, PAGE_SIZE, startAtKey || undefined, at],
        (result) => {
          if (!isRunning) return
          if (result.length > 0) {
            onGoingValues++
            request<
              [string[], string],
              [{ block: string; changes: Array<[string, string]> }]
            >(
              "state_queryStorageAt",
              [result, at],
              ([{ changes }]) => {
                if (!isRunning) return
                onGoingValues--
                onValues(changes)
                if (areAllKeysDone && !onGoingValues) onDone()
              },
              _onError,
            )
          }
          if (result.length < PAGE_SIZE) {
            areAllKeysDone = true
            if (!onGoingValues) onDone()
          } else pullKeys(result.at(-1))
        },
        _onError,
      )
    }
    pullKeys()

    return () => {
      isRunning = false
    }
  }
}
