;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}
;(Set.prototype as any).toJSON = function () {
  return [...this]
}
