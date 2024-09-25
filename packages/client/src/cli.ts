#!/usr/bin/env node

import { add, generate, getCli, remove, update, ink } from "@polkadot-api/cli"

getCli({
  add,
  generate,
  remove,
  update,
  ink,
}).parse()
