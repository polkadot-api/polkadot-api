ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/base:0-${VARIANT}

ARG ZOMBIENET_VERSION=1.3.68
ARG POLKADOT_VERSION=1.1.0

WORKDIR /bin

RUN curl -fsSL -O https://github.com/paritytech/zombienet/releases/download/v${ZOMBIENET_VERSION}/zombienet-linux-x64 \
  && chmod +x zombienet-linux-x64

RUN curl -fsSL -O https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-v${POLKADOT_VERSION}/polkadot \
  && chmod +x polkadot

RUN curl -fsSL -O https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-v${POLKADOT_VERSION}/polkadot-execute-worker \
  && chmod +x polkadot-execute-worker

RUN curl -fsSL -O https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-v${POLKADOT_VERSION}/polkadot-prepare-worker \
  && chmod +x polkadot-prepare-worker

RUN curl -fsSL -O https://github.com/paritytech/polkadot-sdk/releases/download/polkadot-v${POLKADOT_VERSION}/polkadot-parachain \
  && chmod +x polkadot-parachain
