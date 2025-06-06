import {
  Observable,
  Subject,
  MonoTypeOperatorFunction,
  BehaviorSubject,
} from "rxjs"
import { switchAll, tap } from "rxjs/operators"

/**
 * A creation operator that helps at creating observables that have circular
 * dependencies.
 *
 * @returns
 */
export const selfDependent = <T>(): [
  Observable<T>,
  () => MonoTypeOperatorFunction<T>,
] => {
  const activeSubject: BehaviorSubject<Subject<T>> = new BehaviorSubject(
    new Subject<T>(),
  )
  return [
    activeSubject.pipe(switchAll()),
    () =>
      tap({
        next: (v) => activeSubject.value.next(v),
        error: (e) => {
          activeSubject.value.error(e)
          activeSubject.next(new Subject<T>())
        },
        complete: () => {
          activeSubject.value.complete()
          activeSubject.next(new Subject<T>())
        },
      }) as MonoTypeOperatorFunction<T>,
  ]
}
