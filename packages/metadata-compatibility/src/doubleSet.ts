export class DoubleSet<T> {
  private value: Map<T, Set<T>> = new Map()

  constructor(values: Array<[T, T]> = []) {
    values.forEach(([a, b]) => this.add(a, b))
  }

  public has(a: T, b: T) {
    return this.value.get(a)?.has(b) ?? false
  }
  public add(a: T, b: T) {
    if (!this.value.has(a)) {
      this.value.set(a, new Set())
    }
    this.value.get(a)!.add(b)
  }
  public addAll(values: Array<[T, T]>) {
    values.forEach(([a, b]) => this.add(a, b))
  }
  public delete(a: T, b: T) {
    if (!this.value.has(a)) return
    const set = this.value.get(a)!
    set.delete(b)
    if (!set.size) {
      this.value.delete(a)
    }
  }
  public isEmpty() {
    return !this.value.size
  }
  public get values() {
    return Array.from(this.value).flatMap(([a, values]) =>
      Array.from(values).map((b) => [a, b] as [T, T]),
    )
  }
}
