import { select, checkbox, confirm } from "@inquirer/prompts"
import util from "util"

export class ExtrinsicData {
  #data: Record<string, [events: ReadonlySet<string>, ReadonlySet: Set<string>]>

  constructor() {
    this.#data = {}
  }

  get data(): Record<
    string,
    readonly [events: ReadonlySet<string>, errors: ReadonlySet<string>]
  > {
    return this.#data
  }

  async prompt(extrinsics: string[], events: string[], errors: string[]) {
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
      this.#data[ext] = [new Set(), new Set()]
    }
    const [selectedEvents, selectedErrors] = this.#data[ext]
    const newSelectedEvents = await checkbox({
      message: "Select Events for this extrinsic",
      choices: events.map((s) => ({
        name: s,
        value: s,
        checked: selectedEvents.has(s),
      })),
    })
    const newSelectedErrors = await checkbox({
      message: "Select Errors for this extrinsic",
      choices: errors.map((s) => ({
        name: s,
        value: s,
        checked: selectedErrors.has(s),
      })),
    })

    this.#data[ext] = [new Set(newSelectedEvents), new Set(newSelectedErrors)]
  }

  [util.inspect.custom]() {
    return this.toJSON()
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this.#data).map(([k, v]) => [
        k,
        { events: Array.from(v[0]), errors: Array.from(v[1]) },
      ]),
    )
  }
}
