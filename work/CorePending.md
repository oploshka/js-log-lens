# Open questions — LogLens

Only decisions that are not yet settled belong here. Implemented architecture and public API are described in [Implementation](../doc/Architecture/Implementation.md).

## Caller trace and browser DevTools

- Determine how to preserve the original logging callsite when a module ultimately invokes `console.log`.
- Consider an optional, lazily resolved trace captured at each log invocation. Do not cache a callsite across separate calls or make stack collection mandatory without measuring the cost.
- Validate behavior in Chrome and Firefox through the `#devtools` page of `test/app`.

## Disposal

Define the public contract for `LogLens.dispose()` and for adapters retained after disposal: continue emitting into an empty bus, stop logging, or another documented behavior.

## Record immutability

Decide whether to enforce immutable record views or keep the existing consumer contract. Avoid deep-freezing arbitrary objects in `args`.

## Async errors

Specify the policy for listeners or modules that return rejected promises. Synchronous exceptions are already isolated; asynchronous work currently belongs to its owner.

## Module lifecycle and validation

- `GlobalErrorModule` registers browser event handlers in `install()`; manager `disable()` stops only its LogEvent subscription, not these browser handlers. Decide whether producer modules need active-state hooks.
- Define validation for module settings and required dependencies.

## Remaining API decisions

- Decide whether unnamed logger ancestors should appear in formatted paths and whether origins need further system fields.
- Decide how closely to follow the full PSR-3 interface beyond the eight severity names.

## Before publishing

Finalize package/runtime support, npm release policy and public API stability in [Publishing](../doc/Package/Publishing.md). These are release gates, not blockers for experimenting in `develop`.
