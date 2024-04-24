export const chainHead = {
  body: "",
  call: "",
  continue: "",
  follow: "",
  header: "",
  stopOperation: "",
  storage: "",
  unfollow: "",
  unpin: "",
  followEvent: "",
}

export const chainSpec = {
  chainName: "",
  genesisHash: "",
  properties: "",
}

export const transaction = {
  broadcast: "",
  stop: "",
}

export const transactionWatch = {
  submitAndWatch: "",
  unwatch: "",
}

Object.entries({ chainHead, chainSpec, transaction, transactionWatch }).forEach(
  ([fnGroupName, methods]) => {
    Object.keys(methods).forEach((methodName) => {
      ;(methods as any)[methodName] = `${fnGroupName}_v1_${methodName}`
    })
  },
)
