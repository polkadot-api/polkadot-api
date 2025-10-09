let count = 0
export const getOpaqueToken = (): string => `proxyOpaque${count++}`
