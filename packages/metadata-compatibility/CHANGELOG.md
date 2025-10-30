# Changelog

## Unreleased

### Added

- `isStorageKeyCompatible` to check for compatibility on storage keys.

## 0.3.1 to 0.3.7 - 2025-10-09

### Fixed

- Update dependencies

## 0.3.0 - 2025-06-16

### Added

- `StaticCompatibleResult` includes `changes`, the list of changes that led to the compatibility level result.
- `isStaticCompatible` has a new `deep` parameter to prevent returning early.

### Changed

- `entryPointsAreCompatible` now returns `{ level, changes }` for both args and values.

### Fixed

- `Option<T>` => `Option<R>` when T and R are incompatible should be Partial instead of Incompatible.

## 0.2.1 to 0.2.4 - 2025-05-30

### Fixed

- Update dependencies

## 0.2.0 - 2025-04-14

### Fixed

- Handle enums with variants that reference themselves

### Changed

- `TypedefNode`'s `EnumNode` has changed to accommodate for self-referencing enums.

## 0.1.10 to 0.1.16 - 2025-03-07

### Fixed

- Update dependencies

## 0.1.9 - 2024-10-11

### Fixed

- Target ES2022 when bundling

## 0.1.8 - 2024-10-05

### Changed

- Remove unused `Numeric` primitive.

### Fixed

- Target ES2022 when bundling

## 0.1.6 to 0.1.7 - 2024-10-03

### Fixed

- Update dependencies

## 0.1.5 - 2024-09-10

### Fixed

- Resolve properly enum types

## 0.1.4 - 2024-09-04

### Fixed

- Update dependencies

## 0.1.3 - 2024-08-28

### Fixed

- Update and remove unused dependencies

## 0.1.1 to 0.1.2 - 2024-08-12

### Fixed

- Update dependencies

## 0.1.0 - 2024-07-18

### Changed

Initial release
