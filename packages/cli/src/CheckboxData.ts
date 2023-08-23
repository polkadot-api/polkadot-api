import { checkbox } from "@inquirer/prompts"
import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import util from "util"

export class CheckboxData {
  #data: Record<string, bigint>

  constructor() {
    this.#data = {}
  }

  get data(): ReadonlyRecord<string, bigint> {
    return this.#data
  }

  async prompt(message: string, items: [string, bigint][]) {
    const selected = await checkbox({
      message,
      choices: items.map(([s, checksum]) => ({
        name: s,
        value: [s, checksum] as const,
        checked: s in this.#data,
      })),
    })

    for (const [s, checksum] of selected) {
      this.#data[s] = checksum
    }
  }

  [util.inspect.custom]() {
    return this.toJSON()
  }

  toJSON() {
    return this.#data
  }
}
