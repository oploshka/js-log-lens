# Architecture decisions

## Agreed direction

The library should be reusable across projects and highly configurable.
Logging payload arguments and logger metadata are distinct concepts.
Multiple contextual loggers may share one underlying store.
Network delivery is a consumer-provided callback; a working adapter belongs in `example/`, not the core runtime.
The original chaining proposal `LOG.debug(...).scope(...)` is dropped.
Formatting and scope filtering are not yet part of the agreed core API.

## TODO — public contracts

- Agree the public names and boundaries of basic logging, contextual logger creation, one-off contextual logging and view settings.
- Agree whether the public logger object exposes factory methods such as `child()` or uses separate factories.
- Specify per-message metadata without ambiguous positional arguments or breaking existing logging calls.
- Define precedence when combining metadata objects, and how consumer modules can preserve the origin of events.
- Decide whether a store retains entries, streams them to sinks, or both; define memory limits and opt-in behavior.
- Decide whether PSR-3 compatibility means severity names only or the complete interface.
- Agree behavior and caller location in browser DevTools, especially with conditional output.
- Decide runtime targets (browser only vs Node.js and other JS runtimes), ESM/CJS support, and public TypeScript types.
- Decide error handling for consumer-provided transport callbacks and serialization of circular data.

## Excluded from scaffold

No logger implementation, browser console formatter, view settings engine or built-in network transport has been selected yet.
