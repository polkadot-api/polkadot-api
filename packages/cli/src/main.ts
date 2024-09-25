#!/usr/bin/env node

import { getCli } from "./cli"
import { add, generate, ink, remove, update } from "./commands"

const program = getCli({ add, generate, remove, update, ink })
program.parse()
