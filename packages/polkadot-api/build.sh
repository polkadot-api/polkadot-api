#!/bin/bash
set -e

# pnpm tsc --noEmit
for src in ./src/*.ts
do
    name=$(basename ${src%.ts})
    pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts --out-dir "dist/${name}"
    pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir "dist/${name}/min"
done