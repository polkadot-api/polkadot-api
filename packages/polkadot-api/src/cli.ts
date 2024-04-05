#!/usr/bin/env node

import { add, generate, getCli, remove, update } from "@polkadot-api/cli"

getCli({
  add,
  generate: (opts) =>
    generate({
      clientLibrary: "polkadot-connect",
      ...opts,
    }),
  remove,
  update,
}).parse()
