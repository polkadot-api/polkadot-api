import { select, checkbox, confirm } from "@inquirer/prompts"
import type { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import util from "util"

export class ExtrinsicData {
  #data: Record<
    string,
    { events: Record<string, Set<string>>; errors: Record<string, Set<string>> }
  >

  constructor() {
    this.#data = {}
  }

  get data(): ReadonlyRecord<
    string,
    Readonly<{
      events: ReadonlyRecord<string, ReadonlySet<string>>
      errors: ReadonlyRecord<string, ReadonlySet<string>>
    }>
  > {
    return this.#data
  }

  async prompt(
    extrinsics: string[],
    events: ReadonlyArray<readonly [pallet: string, event: string]>,
    errors: ReadonlyArray<readonly [pallet: string, event: string]>,
  ) {
    const ext = await select({
      message: "Select an extrinsic",
      choices: extrinsics.map((s) => ({
        name: s,
        value: s,
      })),
    })

    if (ext in this.#data) {
      const deleteExt = await confirm({ message: "Delete extrinsic?" })
      if (deleteExt) {
        delete this.#data[ext]
        return
      }
    }

    if (!this.#data[ext]) {
      this.#data[ext] = { events: {}, errors: {} }
    }
    for (const [pallet, _] of events) {
      if (!this.#data[ext].events[pallet]) {
        this.#data[ext].events[pallet] = new Set()
      }
    }
    for (const [pallet, _] of errors) {
      if (!this.#data[ext].errors[pallet]) {
        this.#data[ext].errors[pallet] = new Set()
      }
    }
    const selectedEvents = this.#data[ext].events
    const selectedErrors = this.#data[ext].errors

    const newSelectedEvents = await checkbox({
      message: "Select Events for this extrinsic",
      choices: events.map(([pallet, event]) => ({
        name: `${pallet} - ${event}`,
        value: [pallet, event] as [pallet: string, event: string],
        checked: selectedEvents[pallet].has(event),
      })),
    })
    const newSelectedErrors = await checkbox({
      message: "Select Errors for this extrinsic",
      choices: errors.map(([pallet, error]) => ({
        name: `${pallet} - ${error}`,
        value: [pallet, error] as [pallet: string, event: string],
        checked: selectedErrors[pallet].has(error),
      })),
    })

    for (const [pallet, events] of newSelectedEvents) {
      this.#data[ext].events[pallet] = new Set(events)
    }
    for (const [pallet, errors] of newSelectedErrors) {
      this.#data[ext].errors[pallet] = new Set(errors)
    }
  }

  [util.inspect.custom]() {
    return this.toJSON()
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this.#data).map(([k, v]) => [
        k,
        {
          events: Object.fromEntries(
            Object.entries(v.events).map(([k, v]) => [k, Array.from(v)]),
          ),
          errors: Object.fromEntries(
            Object.entries(v.errors).map(([k, v]) => [k, Array.from(v)]),
          ),
        },
      ]),
    )
  }
}
