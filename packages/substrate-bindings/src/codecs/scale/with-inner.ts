export const withInner = <T, I>(codec: T, inner: I): T & { inner: I } => {
  const result: T & { inner: I } = codec as any
  result.inner = inner
  return result
}
