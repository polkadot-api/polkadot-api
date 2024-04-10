#!/bin/bash
set -e

# Regular client
pnpm tsc --noEmit
pnpm tsup-node src/index.ts --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts
pnpm tsup-node src/index.ts --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir dist/min

# CLI
pnpm tsup-node src/cli.ts --clean --sourcemap --platform neutral --target=es2020 --format esm --out-dir "bin"

# Re-exports
for src in ./src/reexports/*.ts
do
    name=$(basename ${src%.ts})
    pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format esm,cjs --dts --out-dir "dist/${name}"
    pnpm tsup-node "${src}" --clean --sourcemap --platform neutral --target=es2020 --format cjs --dts --minify --out-dir "dist/${name}/min"
done