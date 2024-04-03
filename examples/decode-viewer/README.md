# Decode viewer

This project is built with TypeScript, uses PNPM as the package manager, and includes Storybook for UI component development. You can also find a sample application to decode a hex-call with polkadot-api;

## Getting Started

### Prerequisites

Before you begin, ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [PNPM](https://pnpm.io/) (you can install it globally via `npm install -g pnpm`)

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/polkadot-api/polkadot-api
```

1. Navigate to the project directory:

```bash
cd examples/decode-viewer
```

1.Install project dependencies using PNPM:

```bash
pnpm install
```

### Running Storybook

Storybook is a tool for developing UI components in isolation.
To run Storybook and start working on UI components, use the following command:

```bash
pnpm storybook
```

This will start Storybook on `http://localhost:6006/`.

#### Running the Decode Viewer App

Start the app by running the command

```bash
pnpm run dev
```

This will start the Devode Viewer App on `http://localhost:5173/`.
