# Class-based logger prototype

## Entry format

```ts
{
  logInfo: { level: LogLevel.Debug, timestamp: Date.now() },
  args: ['Message received', payload],
  meta: {},
}
```

## Responsibilities

- `Log`: eight PSR-3 severity methods, each forwarding a structured record to its `LogEvent`.
- `LogEvent`: `emitLog`, `subscribe`, `unsubscribe`; no knowledge of filtering or modules.
- `iLogModule`: `install(event)` may register listeners and return a disposer.
- `ConsoleModule`: migrated console styling and output.
- `LogLens`: assembler; `use(module)`, `build()` and `dispose()`.
- `LOG`: convenience instance assembled with a console module.

Modules are installed once at `build()`. `build()` is idempotent; new modules cannot be added after it.
Disposing stops module subscriptions, but does not disable the previously returned logger.

## TODO

- Contextual `meta` / scoped logger API; currently empty by design.
- Caller location in browser DevTools: original console-bound `Proxy` cannot be preserved by the generic subscriber pipeline without further design.
- Original `loglevel` environment-level filtering and critical-level server delivery are not automatic; these belong in optional modules/filters.
- Confirm whether errors in one subscriber should propagate; currently they do.
- Async listeners are not awaited. Define async and exception policies.
- Decide whether modules may be registered dynamically after `build()`.
- Extend or replace the network example with a proper `NetworkModule` when its configuration contract is agreed.
- Clarify full PSR-3 compliance vs matching severity names.
