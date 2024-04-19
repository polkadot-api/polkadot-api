# Changelog

## Unreleased

### Added

- Specify a whitelist file through `generate --whitelist filename` command.

## 0.2.2 - 2024-04-11

### Fixed

- Remove the descriptors folder if it exists before attempting to create it.

## 0.2.1 - 2024-04-11

### Fixed

- Check if the descriptors folder exists before attempting to create the folder.

## 0.2.0 - 2024-04-11

### Changed

- Generated code imports from `polkadot-api` instead of `@polkadot-api/client`

## 0.1.0 - 2024-04-09

### Changed

- CLI can now be imported from another module.
- `generate` cleans the output dir before compiling sources.

### Fixed

- Remove bogus dependency `@polkadot-api/client`

## 0.0.1 - 2024-04-03

### Changed

Initial release
