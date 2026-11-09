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

## Verification status

Node.js unit tests added in `test/unit`, using the built library; run `pnpm test` after installing dependencies.
The full package build, TypeScript project checks, ESLint and real DevTools checks have not been executed in this environment because the npm registry is unreachable. Manual browser checks are available at `#devtools` in `test/app/Page/ConsoleDevTools.vue`.

## Producer module enable/disable

`GlobalErrorModule` listens to browser events in its lifecycle; manager `disable()` only stops LogEvent dispatch to its no-op `run()`. Decide whether producer modules need a separate active-state notification or should be removed to stop collection.
