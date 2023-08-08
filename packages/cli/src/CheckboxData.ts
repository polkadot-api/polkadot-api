import { checkbox } from "@inquirer/prompts"
import util from "util"

export class CheckboxData {
  #data

  constructor() {
    this.#data = new Set<string>()
  }

  get data(): ReadonlySet<string> {
    return this.#data
  }

  async prompt(message: string, items: string[]) {
    const selected = await checkbox({
      message,
      choices: items.map((s) => ({
        name: s,
        value: s,
        checked: this.#data.has(s),
      })),
    })

    this.#data = new Set(selected)
  }

  [util.inspect.custom]() {
    return this.toJSON()
  }

  toJSON() {
    return Array.from(this.#data)
  }
}
