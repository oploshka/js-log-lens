# Logger prototype

## Data model

Every call generates one entry. System data and consumer metadata are kept separate:

```ts
{
  logInfo: { level: 'debug', timestamp: Date.now() },
  args: ['Message received', payload],
  meta: { module: 'ws' },
}
```

## Boundaries

- `createLogger(logEvent, meta, now)` creates an immutable PSR-severity API.
- `createLogEvent()` only emits, subscribes and unsubscribes.
- `createConsoleListener()` is optional and preserves the original message arguments.
- `example/NetworkTransport` and `example/GlobalError` migrate existing optional integrations.
- `LOG` is a convenience default logger with a console listener; custom instances have no implicit destinations.

## TODO / design questions

- Naming and public factory API (`LOG_META`, `scope`, `child`) are not final.
- Decide whether the default console listener is desirable in the published package.
- Clarify whether subscriber exceptions should propagate or be isolated (currently propagated).
- Clarify custom logging-level filtering and asynchronous subscriber behavior (currently synchronous fan-out).
- DevTools callsite may point to a listener rather than the caller; original `Proxy` path is not preserved.
- Serialization, timestamp precision, and event identity are future discussion topics.
- Agree final PSR-3 compatibility statement before npm publishing.
