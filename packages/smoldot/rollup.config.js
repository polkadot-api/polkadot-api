import { generateEntry } from "../../rollup_utils.js"

export default [
  ...generateEntry("index"),
  ...generateEntry("node-worker"),
  ...generateEntry("worker"),
  ...generateEntry("from-node-worker"),
  ...generateEntry("from-worker"),
]
