const target = {}

const createProxy = (propCall: (prop: string) => unknown) =>
  new Proxy(target, {
    get(_, prop) {
      return propCall(prop as string)
    },
  })

export const createProxyPath = <T>(pathCall: (a: string, b: string) => T) => {
  const cache: Record<string, Record<string, T>> = {}
  return createProxy((a) => {
    if (!cache[a]) cache[a] = {}
    return createProxy((b) => {
      if (!cache[a][b]) cache[a][b] = pathCall(a, b)
      return cache[a][b]
    })
  }) as Record<string, Record<string, T>>
}
