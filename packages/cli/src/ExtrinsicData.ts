import { select, checkbox, confirm } from "@inquirer/prompts"
import type { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import util from "util"

type Data = Record<
  string,
  {
    checksum: bigint
    events: Record<string, Set<string>>
    errors: Record<string, Set<string>>
  }
>

export class ExtrinsicData {
  #data: Data

  constructor(data?: Data) {
    this.#data = data ?? {}
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
    extrinsics: [name: string, checksum: bigint][],
    events: ReadonlyArray<readonly [pallet: string, event: string]>,
    errors: ReadonlyArray<readonly [pallet: string, event: string]>,
  ) {
    const [ext, checksum] = await select({
      message: "Select an extrinsic",
      choices: extrinsics.map(([s, checksum]) => ({
        name: s,
        value: [s, checksum],
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
      this.#data[ext] = { events: {}, errors: {}, checksum }
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
    /* 
    for (const [pallet, _] of newSelectedEvents) {
      this.#data[ext].events[pallet].clear()
      this.#data[ext].errors[pallet].clear()
    } */

    for (const [pallet, event] of newSelectedEvents) {
      this.#data[ext].events[pallet].add(event)
    }
    for (const [pallet, error] of newSelectedErrors) {
      this.#data[ext].errors[pallet].add(error)
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
          checksum: v.checksum,
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
