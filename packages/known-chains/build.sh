#!/bin/bash
set -e

pnpm tsc --noEmit

pnpm tsup-node ./src/index.ts --clean --platform neutral --target=es2020 --format esm,cjs --dts --out-dir "dist"

for src in ./src/specs/*.ts
do
    name=$(basename ${src%.ts})
    pnpm tsup-node "${src}" --clean --platform neutral --target=es2020 --format esm,cjs --dts --out-dir "dist/${name}"
done