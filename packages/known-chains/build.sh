#!/bin/bash
set -e

pnpm tsc --noEmit

chains=$(ls -1 ./src/specs/*.ts | sed 's/\.\///g' | tr "\n" " ")

pnpm tsup-node src/index.ts ${chains} --clean --sourcemap --platform neutral --target=es2022 --format esm,cjs --dts
