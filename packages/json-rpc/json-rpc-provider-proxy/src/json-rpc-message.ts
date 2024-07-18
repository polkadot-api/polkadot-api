export const jsonRpcMsg = <T extends {}>(msg: T) =>
  JSON.stringify({
    jsonrpc: "2.0",
    ...msg,
  })
