# Class-based logger prototype

## Entry structure

```ts
{
  logInfo: { level: LogLevel.Debug, timestamp: Date.now() },
  args: ['Message received', payload],
  meta: {},
}
```

## Components

- `Log` creates entries with the eight PSR-3 severity methods.
- `LogEvent` synchronously broadcasts records and never mutates them or awaits listeners.
- `LogLensModule<TSettings, TDependencies>` provides default `install()`, `uninstall()`, pass-through `filter()`, abstract `run()` and settings methods.
- `LogLensModuleManager` owns registrations and subscriptions, calls `filter(entry)` before `run(entry)`, and manages module lifecycle.
- `LogLens` assembles event, manager, and logger; `use(name, module)` delegates to manager.
- `ConsoleModule` provides console output; network and history remain independent modules.

`setSettings` replaces the settings; `mergeSettings` shallow-merges them.
Module defaults come from the concrete class's static `getDefaultSettings()` via `this.constructor`.
TypeScript has no `abstract static`; the override is not compile-time enforced.
Constructors receive `{ dependencies?, settings? }` through `super(options)`.

## Fault isolation: agreed principle

**The logging system must not stop the host application.**

- Direct `LogEvent` listeners and manager module `filter()` / `run()` are guarded independently. Failures are reported directly with `console.error` (never through LogLens to avoid recursion) and dispatch continues.
- Reusing a module name or installing the same module instance twice is ignored with a diagnostic, not an exception.
- `install()` failures are reported and the module is not registered.
- `remove()` unsubscribes and attempts `uninstall()`; `uninstall()` failures do not block other modules.
- `enable()` / `disable()` toggle delivery without calling lifecycle methods. `add()` / `remove()` register and unregister modules; these are **manager methods**, not module methods.
- Unknown module names report an error rather than throwing.

## Sync and immutability contracts

- Dispatch is synchronous, but a module may initiate asynchronous work from `run()`; it owns promise rejection handling. No promise is awaited by the event bus or manager.
- Producers and subscribers must not mutate the shared record. This is currently a **documented contract**, not a deep freeze: `args` can contain arbitrary application objects.
- `dispose()` currently removes modules without invalidating the previously returned logger; its final behavior remains undecided.

## TODO

- Contextual `meta` and scoped logger API.
- Browser DevTools caller location and optional `getTrace`: a captured `Error` at log-call time can preserve the original stack, with lazy stack-string decoding/caching, but the record API is undecided. Ordinary memoization of a callsite across calls is incorrect.
- Validate performance and browser support for the trace approach; `bind`/`Proxy` console callsite behavior is a separate problem.
- Decide final `dispose()` contract and whether it belongs in public API.
- Decide how to handle unexpectedly returned rejected promises from async listeners; modules are currently responsible for handling their own asynchronous errors.
- Module settings validation and dependency requirements.
- Full PSR-3 interface compatibility vs severity names only.
