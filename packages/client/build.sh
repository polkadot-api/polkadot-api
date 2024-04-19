#!/bin/bash
set -e

pnpm tsc --noEmit

reexports=$(ls -1 ./src/reexports/*.ts | sed 's/\.\///g' | tr "\n" " ")

pnpm tsup-node src/index.ts ${reexports} --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts
pnpm tsup-node src/index.ts ${reexports} --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir dist/min

pnpm tsup-node src/cli.ts --clean --sourcemap --platform neutral --target=es2020 --format esm --out-dir "bin"
