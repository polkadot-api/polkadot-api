const chainHead = {
  body: "",
  call: "",
  continue: "",
  follow: "",
  header: "",
  stopOperation: "",
  storage: "",
  unfollow: "",
  unpin: "",
}

const transaction = {
  broadcast: "",
  stop: "",
}

const chainSpec = {
  chainName: "",
  genesisHash: "",
  properties: "",
}

Object.entries({ chainHead, chainSpec, transaction }).forEach(
  ([fnGroupName, methods]) => {
    Object.keys(methods).forEach((methodName) => {
      ;(methods as any)[methodName] = `${fnGroupName}_v1_${methodName}`
    })
  },
)

export { chainHead, transaction, chainSpec }
