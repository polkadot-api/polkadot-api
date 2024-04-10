#!/bin/bash
set -e

tsc --noEmit
tsup-node src/index.ts --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts
tsup-node src/index.ts --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir dist/min

# pnpm tsc --noEmit
for src in ./src/reexports/*.ts
do
    name=$(basename ${src%.ts})
    if [ "$name" = "cli" ]; then
        pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format esm --out-dir "bin"
    else
        pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts --out-dir "dist/${name}"
        pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir "dist/${name}/min"
    fi
done