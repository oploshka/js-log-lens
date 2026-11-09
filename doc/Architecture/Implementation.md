# Class-based logger architecture

## Public API

```ts
const log = lens.build();
log.debug('Connected');

const ws = log.child('WebSocket', { module: 'ws' });
const connection = ws.child('Connection', { connectionId: '123' });
connection.debug('Connected');
connection.meta({ requestId: 42 }).info('Message', { id: 123 });
```

- `Log` keeps eight PSR-3 severity methods; each accepts an internal structured command `{ args, meta, logger? }`.
- `LogAdapter` exposes variadic severity methods generated from `LogLevel` without a Proxy or eight duplicate wrappers. A mapped type describes the generated methods.
- `child(name, meta)` returns a new full adapter referencing its parent. `child(meta)` also supports unnamed children.
- `meta(meta)` returns **only** the eight severity methods, not another adapter; both forms share the same generator.
- Each child captures an immutable shallow merge of parent and local metadata. New keys win. No modification of parent metadata.
- `LogLens.build()` returns the root `LogAdapter`. All descendants share one internal `Log` and `LogEvent`.

## Entry structure

```ts
{
  logInfo: {
    level: LogLevel.Debug,
    timestamp: Date.now(),
    logger: {
      name: 'Connection',
      parent: { name: 'WebSocket', parent: rootOrigin },
    },
  },
  args: ['Message received', payload],
  meta: { module: 'ws', connectionId: '123' },
}
```

`logInfo.logger` is a reference to the originating adapter's immutable descriptor. The descriptor links to the parent's descriptor; there is no per-message path traversal or array allocation. The adapter itself separately retains `parentLog`. Caller trace remains a separate TODO.

## Modules

- `LogEvent` synchronously broadcasts records and never mutates them or awaits listeners.
- `LogLensModule<TSettings, TDependencies>` provides default lifecycle, pass-through filter, abstract run and settings.
- `LogLensModuleManager` owns registrations and subscriptions, calls `filter(entry)` before `run(entry)`, and manages lifecycle.
- `ConsoleModule` provides console output.
- `GlobalErrorModule` registers browser `error` and `unhandledrejection` listeners in `install()`, removes them in `uninstall()`, and forwards errors through a logger dependency. As an event producer, it does not process LogEvent records in `run()`.
- `NetworkModule<TPayload>` uses consumer-provided `transform(entry)` and `request(payload)` functions. Request failures are caught and reported via an optional `onError`; transport policy and data format belong to the consumer.
- History remains an independent prospective module.

`setSettings` replaces settings; `mergeSettings` shallow-merges. Defaults come from a concrete module's `getDefaultSettings()`; constructors accept `{ dependencies?, settings? }`.

## Fault isolation

**The logging system must not stop the host application.** Module and listener failures are reported directly to native console and dispatch continues. Duplicate registration is diagnosed without throwing. `enable/disable` only toggle delivery; `add/remove` change registrations.

## Immutability / sync

Synchronous fan-out does not await async modules. Consumers must not mutate a shared record, its args, or its metadata. The library performs a shallow copy of record metadata, not a deep freeze of user arguments.

## TODO

- Browser DevTools callsite and optional lazy trace collection.
- Final disposal semantics and module setting validation.
- Exception isolation for asynchronous rejections and full PSR-3 interface compatibility.


## Pending lifecycle detail

Disabling a producer module such as `GlobalErrorModule` does not remove native browser listeners; that only happens on `remove()`/`dispose()`. Decide later whether manager enable/disable should affect producer activity too.
