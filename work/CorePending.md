# Open design questions — LogLens core

## Meta

Define immutable contextual metadata inheritance, merging precedence, and per-call metadata without mixing it with `args`. Origin (module, tab, async event source) must survive propagation.

## Trace / DevTools

Potential design: capture an `Error` at the logging callsite, expose a lazily evaluated and locally cached trace to interested modules. A fresh Error is necessary per call; binding `this` or caching one stack across calls cannot recover distinct callsites.
Investigate the effect on browser DevTools caller location separately. A module must not know the number of internal stack frames. Benchmark cost before committing to a mandatory capture.

## Disposal

Should `LogLens.dispose()` exist publicly, and should already returned `Log` instances stop emitting, continue silently, or remain operational with no modules? Do not finalize without discussion.

## Log record immutability

Currently a rule for consumers; decide whether the library should enforce shallow/deep immutability or use immutable views. Avoid freezing user-provided objects in `args`.

## Error and async corner cases

Synchronous module errors are isolated and reported to native console. `run()` may schedule async work, and must handle its own rejections. Confirm expectations for async methods accidentally returning a rejected promise and the failure policy for exceptional lifecycle methods.
