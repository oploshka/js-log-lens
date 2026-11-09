# Architecture

The core logging API and module system are implemented, but the public API is still experimental.

- [Decisions](Decisions.md) — adopted architectural decisions and current boundaries.
- [Implementation](Implementation.md) — current API, entry structure, modules and dispatch behavior.
- [Tooling](Tooling.md) — source layout, aliases, build and local development.
- [Open questions](../../work/CorePending.md) — unresolved decisions; completed design notes do not belong there.

The library is framework-agnostic. Vue is used only by the development playground.
