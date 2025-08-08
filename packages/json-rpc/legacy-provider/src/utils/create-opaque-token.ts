let latestId = 1
export const createOpaqueToken = (): string => {
  // TODO: make this fancier
  return `${latestId++}${Date.now()}`
}
