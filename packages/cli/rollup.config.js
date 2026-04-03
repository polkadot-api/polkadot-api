import { generateEntry } from "../../rollup_utils.js"

export default [...generateEntry("index"), ...generateEntry("main")]
