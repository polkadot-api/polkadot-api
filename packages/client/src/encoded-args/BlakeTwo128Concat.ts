import { createEncodedArgument } from "./createEncodedArg"
import { blakeTwo128Concat } from "../hashes/blake2-128-concat"

export const BlakeTwo128Concat = createEncodedArgument(blakeTwo128Concat)
