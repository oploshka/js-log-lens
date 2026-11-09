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

- `Log` creates structured entries with the eight PSR-3 severity methods.
- `LogEvent` broadcasts entries, without filtering or module semantics.
- `LogLensModule<TSettings, TDependencies>` implements basic lifecycle (`install/uninstall`), pass-through `filter`, configurable `run`, and `setSettings`, `mergeSettings`, `getSettings`.
- `LogLensModuleManager` owns subscriptions and enables, disables, adds, or removes named module instances.
- `LogLens` bundles the event, manager and logger. `use(name, module)` is a shorthand for `modules.add(name, module)`.
- `ConsoleModule` supplies console output with its own defaults and optional injected console dependency.

`setSettings` replaces settings, `mergeSettings` performs a shallow update.
Module defaults come from the concrete class's static `getDefaultSettings()` via `this.constructor` in the base constructor.
TypeScript does not support `abstract static`, so compile-time enforcement of overrides is not available.
Constructors receive `{ dependencies?, settings? }` through one `super(options)` call.

`add()` calls `install()`, registers a listener; `disable()` only prevents dispatch; `remove()` unsubscribes and calls `uninstall()`.
The manager also handles registrations after the logger has been built.
`dispose()` unregisters all modules but does not invalidate a previously returned `Log`.

## TODO

- Contextual `meta` / scoped logger API.
- Browser DevTools caller location (previous console-bound `Proxy` implementation).
- Module settings validation and enforcement of required dependencies.
- Error isolation across subscribers and asynchronous lifecycle conventions.
- Full PSR-3 compliance vs matching severity names.
