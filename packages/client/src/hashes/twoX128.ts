import { h64 } from "xxhashjs"

export const twoX128 = (input: string | ArrayBuffer | Buffer) => {
  const result = new Array<string>(16)

  const part1 = h64(input, 0).toString(16).padStart(16, "0")
  for (let i = 0; i < 8; i++) {
    result[i] = part1.substr(16 - (i + 1) * 2, 2)
  }

  const part2 = h64(input, 1).toString(16).padStart(16, "0")
  for (let i = 0; i < 8; i++) {
    result[i + 8] = part2.substr(16 - (i + 1) * 2, 2)
  }

  return result.join("")
}
