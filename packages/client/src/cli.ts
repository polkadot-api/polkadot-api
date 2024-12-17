#!/usr/bin/env node

import { add, generate, getCli, remove, update, ink } from "@polkadot-api/cli"
import { version } from "../package.json"

getCli({
  add,
  generate,
  remove,
  update,
  ink,
  version,
}).parse()
