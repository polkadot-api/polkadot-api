interface QueueNode<T> {
  value: T
  next?: QueueNode<T>
}

export default class Queue<T> {
  private first?: QueueNode<T>
  private last?: QueueNode<T>

  constructor(...vals: T[]) {
    if (vals.length === 0) return
    vals.forEach((val) => this.push(val))
  }

  push(value: T) {
    const nextLast: QueueNode<T> = { value }
    if (this.last === undefined) {
      this.last = nextLast
      this.first = this.last
    } else {
      this.last.next = nextLast
      this.last = nextLast
    }
  }

  pop() {
    const result = this.first?.value
    if (this.first) {
      this.first = this.first.next
      if (!this.first) {
        this.last = undefined
      }
    }
    return result
  }

  peek() {
    return this.first?.value
  }
}
