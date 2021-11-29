const MAX_TIME = 2_000

export class OrfanMessages {
  #messages: Map<string, { expiry: number; message: any }>
  #token: number | NodeJS.Timer | null

  constructor() {
    this.#messages = new Map()
    this.#token = null
  }

  private checkClear(): void {
    if (this.#messages.size > 0) return

    clearInterval(this.#token as any)
    this.#token = null
  }

  set(key: string, message: any): void {
    this.#messages.set(key, { expiry: Date.now() + MAX_TIME, message })

    this.#token =
      this.#token ||
      setInterval(() => {
        const now = Date.now()

        const iterator = this.#messages.entries()
        let tmp = iterator.next()
        while (tmp.done === false && tmp.value[1].expiry <= now) {
          const key = tmp.value[0]
          tmp = iterator.next()
          this.#messages.delete(key)
        }
        this.checkClear()
      }, MAX_TIME)
  }

  upsert<T>(key: string): T | undefined {
    const result = this.#messages.get(key)
    if (!result) return undefined
    this.#messages.delete(key)
    this.checkClear()
    return result.message
  }

  clear() {
    this.#messages.clear()
    this.checkClear()
  }
}
