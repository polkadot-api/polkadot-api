import { OperationLimitError } from "@polkadot-api/substrate-client"
import type { Subscriber } from "rxjs"
import { Observable } from "rxjs"

interface PendingTaskNode<T> {
  value: T
  next?: PendingTaskNode<T>
  prev?: PendingTaskNode<T>
}

export default class PendingTaskQueue<T> {
  private first?: PendingTaskNode<T>
  private last?: PendingTaskNode<T>

  private getRemoveFn(node: PendingTaskNode<T>) {
    return () => {
      if (node.prev) {
        node.prev.next = node.next
      } else {
        this.first = node.next
      }

      if (node.next) {
        node.next.prev = node.prev
      } else {
        this.last = node.prev
      }

      delete node.prev
      delete node.next
    }
  }

  push(value: T) {
    const newNode: PendingTaskNode<T> = { value }

    if (this.last === undefined) {
      this.last = this.first = newNode
    } else {
      this.last.next = newNode
      newNode.prev = this.last

      this.last = newNode
    }

    return this.getRemoveFn(newNode)
  }

  unshift(value: T) {
    this.first = { value, next: this.first }
    this.first.next && (this.first.next.prev = this.first)
    this.last ||= this.first
    return this.getRemoveFn(this.first)
  }

  pop() {
    const result = this.first?.value

    if (this.first) {
      this.first = this.first.next

      if (!this.first) {
        this.last = undefined
      } else {
        delete this.first.prev?.next
        delete this.first.prev
      }
    }

    return result
  }

  isEmpty() {
    return !this.first
  }
}

export const getWithRecovery = () => {
  const tearDownOperations = new Map<Observable<any>, () => void>()

  const setTeardown = (observable: Observable<any>, cb: () => void) => {
    tearDownOperations.set(observable, () => {
      tearDownOperations.delete(observable)
      cb()
    })
  }

  const teardown = (observable: Observable<any>) => {
    tearDownOperations.get(observable)?.()
  }

  const pendingTasks = new PendingTaskQueue<{
    observer: Subscriber<any>
    source$: Observable<any>
  }>()
  const unshift = pendingTasks.unshift.bind(pendingTasks)
  const push = pendingTasks.push.bind(pendingTasks)

  const addTask = (
    task: {
      observer: Subscriber<any>
      source$: Observable<any>
    },
    topPriority: boolean,
  ) => {
    const fn = topPriority ? unshift : push
    setTeardown(task.source$, fn(task))
  }

  const onEmptySlot = () => {
    const data = pendingTasks.pop()
    if (!data) return

    tearDownOperations.delete(data.source$)
    process(data)
  }

  const process = <T>(data: {
    observer: Subscriber<T>
    source$: Observable<T>
  }) => {
    const { source$, observer } = data

    const subscription = source$.subscribe({
      next(x) {
        observer.next(x)
      },
      error(e) {
        teardown(source$)
        if (e instanceof OperationLimitError) return addTask(data, true)

        observer.error(e)
        onEmptySlot()
      },
      complete() {
        observer.complete()
        onEmptySlot()
      },
    })

    if (!observer.closed) {
      setTeardown(source$, () => {
        subscription.unsubscribe()
      })
    }
  }

  const withRecovery =
    (topPriority = false) =>
    <T>(source$: Observable<T>): Observable<T> =>
      new Observable((observer) => {
        const pendingTask = { observer, source$ }

        if (pendingTasks.isEmpty()) {
          process(pendingTask)
        } else {
          addTask(pendingTask, topPriority)
        }

        return () => {
          teardown(source$)
        }
      })

  const withNormalRecovery = withRecovery()
  const withRecoveryFn =
    <Args extends Array<any>, T>(fn: (...args: Args) => Observable<T>) =>
    (...args: Args) =>
      withNormalRecovery(fn(...args))

  return { withRecovery, withRecoveryFn }
}
