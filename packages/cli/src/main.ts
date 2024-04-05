#!/usr/bin/env node

import { getCli } from "./cli"
import { add, generate, remove, update } from "./commands"

const program = getCli({ add, generate, remove, update })
program.parse()
