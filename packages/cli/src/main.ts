#!/usr/bin/env node

import { getCli } from "./cli"
import { add, generate, ink, remove, update } from "./commands"
import { version } from "../package.json"

const program = getCli({ add, generate, remove, update, ink, version })
program.parse()
