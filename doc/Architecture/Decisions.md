# Architecture decisions

This document records **implemented decisions**. Remaining design questions are tracked in [work/CorePending.md](../../work/CorePending.md).

## Public logging API

- LogLens is a framework-agnostic TypeScript logging library with the eight PSR-3 **severity names**: `emergency`, `alert`, `critical`, `error`, `warning`, `notice`, `info`, `debug`. Full PSR-3 API compatibility is not claimed.
- `Log` is the structured internal emitter. Each severity method accepts a single `{ args, meta, logger? }` object.
- `LogLens.build()` returns a public `LogAdapter` with console-style variadic logging methods.
- `LogAdapter.child(name, meta?)` and `child(meta)` create scoped adapters. A child retains a reference to its parent, inherits the parent's metadata and shallowly overrides it with local metadata.
- `LogAdapter.meta(meta)` returns **only severity methods**, not another full adapter. The supplied metadata is merged for calls through those methods; it does not modify the original adapter.
- Severity methods on the public adapter are generated from `LogLevel` rather than duplicated or implemented with a Proxy. Their TypeScript type is a mapped type.
- Chaining after an emitted message (such as `LOG.debug(...).scope(...)`) is intentionally not supported.

## Record and origin

- Every entry has separate `logInfo` (system information), `args` (original arguments) and `meta` (user metadata).
- `logInfo.logger` references an immutable origin descriptor with `name?` and `parent?`. Logger paths are not rebuilt per emitted entry.
- `LogEvent` dispatches synchronously to multiple listeners and does not retain history by default.
- Entries and user arguments must not be mutated by listeners. The contract is documented, not enforced by deep freeze.

## Modules and lifecycle

- `LogLensModule` encapsulates module settings and dependencies, `filter(entry)`, `run(entry)`, `install()` and `uninstall()`.
- `LogLensModuleManager` owns registrations, subscriptions, enable/disable state and module lifecycle.
- `ConsoleModule` formats native console output.
- `GlobalErrorModule` is an event **producer**: it forwards browser error events through an injected logger.
- `NetworkModule` receives consumer-provided `transform(entry)`, `request(payload)` and optional `onError(error)` callbacks. Transport protocol, serialization and retry behavior are not prescribed.
- Synchronous listener and module errors are isolated and reported to native `console.error`, without recursive logging through LogLens.
- A test-only page-history module lives in `test/app/Module/PageLog.ts`. The core has no built-in event store.

## Out of scope or still unresolved

- Per-module output formatting beyond the existing ConsoleModule settings and any general view/scoped filtering API.
- Original DevTools callsite and optional tracing support.
- Final `dispose()` contract, producer-module enable/disable semantics and record immutability enforcement.
- Runtime support matrix, packaging/release policy and full PSR-3 interface compatibility.

See [Implementation](Implementation.md) for current behavior, [Tooling](Tooling.md) for builds and [work/CorePending.md](../../work/CorePending.md) for open decisions.
