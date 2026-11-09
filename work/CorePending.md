# Open design questions — LogLens core

## Meta (implemented)

- `LogAdapter.child(name, meta)` keeps a real `parentLog` reference and snapshots merged metadata.
- `LogAdapter.meta(meta)` produces only severity methods for a one-off context.
- System-origin information belongs in `logInfo.logger`, not user `meta`.
- TODO: decide whether unnamed ancestors should appear in formatted paths and whether origin details beyond names are necessary.

## Trace / DevTools

Potential design: capture an `Error` at the logging callsite, expose a lazily evaluated and locally cached trace to interested modules. A fresh Error is necessary per call; binding `this` or caching one stack across calls cannot recover distinct callsites.
Investigate the effect on browser DevTools caller location separately. A module must not know the number of internal stack frames. Benchmark cost before committing to a mandatory capture.

## Disposal

Should `LogLens.dispose()` exist publicly, and should already returned `Log` instances stop emitting, continue silently, or remain operational with no modules? Do not finalize without discussion.

## Log record immutability

Currently a rule for consumers; decide whether the library should enforce shallow/deep immutability or use immutable views. Avoid freezing user-provided objects in `args`.

## Error and async corner cases

Synchronous module errors are isolated and reported to native console. `run()` may schedule async work, and must handle its own rejections. Confirm expectations for async methods accidentally returning a rejected promise and the failure policy for exceptional lifecycle methods.
