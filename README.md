# polkadot-api

- [Setup](#setup)
- [Example PAPI React](#example-papi-react)
- [Example Decode Viewer](#example-decode-viewer)
- [FAQ](#faq)

## Setup <a id="setup"></a>

- Fork the repository https://github.com/polkadot-api/polkadot-api
- Clone your fork

```sh
export YOUR_GITHUB_USERNAME='ltfschoen'
git clone https://github.com/$YOUR_GITHUB_USERNAME/polkadot-api
```

- Fetch and checkout specific branch 'feat/teleport-template' from upstream

```sh
git remote add upstream https://github.com/polkadot-api/polkadot-api
git fetch upstream feat/teleport-template:feat/teleport-template
git checkout feat/teleport-template
```

- Install compatible Node.js version

```sh
nvm install && nvm use
```

- Enable compatible [version of PNPM version](https://github.com/pnpm/pnpm/releases) with Corepack. Note: To obtain latest version use `pnpm@latest`

```sh
corepack enable && corepack prepare pnpm@latest --activate
```

- Install dependencies and build

```sh
pnpm install
pnpm prepare
pnpm build
```

--> ERROR

```sh
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  decode-viewer@0.0.0 build: `tsc && vite build`
Exit status 2
 ELIFECYCLE  Command failed with exit code 1.

/Users/luke/.../polkadot-api/examples/papi-react-template:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  papi-react-template@0.0.0 build: `tsc && vite build`
Exit status 2
 ELIFECYCLE  Command failed with exit code 1.
```

## Template PAPI React <a id="template-papi-react"></a>

- Refer to README in folder examples/papi-react-template
- Run example PAPI React

```sh
cd examples/papi-react-template
pnpm install
pnpm run dev
```

- Open in browser http://localhost:5173/

## Template Decode Viewer <a id="template-papi-react"></a>

- Refer to README in folder examples/decode-viewer
- Run example Decode Viewer Storybook

```sh
cd examples/decode-viewer
pnpm storybook
```

- Open in browser http://localhost:6006/
- Run example Decode Viewer dApp

```sh
pnpm install
pnpm run dev
```

--> ERROR

```
import { v14 } from "@polkadot-api/substrate-bindings"
         ^^^
SyntaxError: The requested module '@polkadot-api/substrate-bindings' does not provide an export named 'v14'
```

## FAQ <a id="faq"></a>

- What supported metadata versions? v14
