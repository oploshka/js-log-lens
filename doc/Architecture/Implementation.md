# LogLens implementation

## Core and public API

```ts
import { ConsoleModule, LogLens } from 'js-log-lens';

const lens = new LogLens().use('console', new ConsoleModule());
const log = lens.build();

log.debug('Application started');

const ws = log.child('WebSocket', { module: 'ws' });
const connection = ws.child('Connection', { connectionId: '123' });
connection.info('Connected', { attempt: 1 });
connection.meta({ requestId: 42 }).debug('Request', { id: 123 });
```

`LogLens` assembles one `LogEvent`, one `LogLensModuleManager` and one internal `Log`. `build()` returns the root `LogAdapter`. Descendants share the underlying emitter.

- Internal `Log`: eight severity methods taking `{ args, meta, logger? }`.
- Public `LogAdapter`: eight variadic methods generated once per adapter from `LogLevel`, typed by `tLogMethods`, without Proxy.
- `child(name, meta?)` or `child(meta)`: creates a new adapter with `parentLog` and shallow-merged metadata; a child's values take precedence.
- `meta(meta)`: returns only the eight log methods, with additional metadata for calls made through the returned object. It cannot be chained into another `child()` or `meta()`.

## Entry format

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
  args: ['Request', { id: 123 }],
  meta: { module: 'ws', connectionId: '123', requestId: 42 },
}
```

The sample illustrates the **shape**; `logger` is a reference to a shared, frozen origin descriptor, not a fresh nested tree constructed on each log call. The root descriptor and unnamed ancestors can have no `name`. `logInfo` stores system data; `meta` stores user data; original `args` stay separate.

`Log` shallow-copies metadata into each entry. The event bus does not deep-freeze entries or user-provided arguments. Consumers must not mutate shared records.

## Event and module handling

`LogEvent` broadcasts synchronously to subscribed listeners; subscriptions return a disposer. It does not store history and does not await listeners.

`LogLensModule<TSettings, TDependencies>` defines `install()`, `uninstall()`, `filter(entry)`, `run(entry)`, `setSettings()`, `mergeSettings()` and `getSettings()`. Settings are initialized from the concrete module's `getDefaultSettings()` and options passed to its constructor.

`LogLensModuleManager` supports `add`, `remove`, `enable`, `disable`, `isEnabled`, `get` and `dispose`. It subscribes registered modules to the event bus, checks the module filter before running, and cleans up on removal or disposal. Errors in synchronous listeners, module processing and lifecycle hooks are reported directly through native console to avoid recursion and to preserve delivery to other subscribers.

Current modules:

- `ConsoleModule` — styled output via the native console, with optional metadata display.
- `GlobalErrorModule` — installs/removes browser `error` and `unhandledrejection` handlers; forwards them through a supplied logger. No-op source module `run()`.
- `NetworkModule<TPayload>` — invokes consumer-supplied `transform(entry)` and `request(payload)`; catches synchronous failures and rejected request promises, reporting through `onError` when provided.

Example integrations live in `example/`. The `PageLogModule` is intentionally **test-only** and lives under `test/app/Module/`.

## Current boundaries

- Manager `disable()` stops delivery to a module's `run()`; it does **not** remove native browser handlers installed by `GlobalErrorModule`. Use `remove()` to unhook them.
- Asynchronous user listeners and arbitrary module async work are not awaited by `LogEvent`; callers must handle their own rejections. The network module handles its own request rejections.
- `LogLens.dispose()` removes modules but does not currently invalidate already returned adapters. Its final public semantics remain open.
- The browser DevTools location may point into `ConsoleModule` rather than the consumer callsite. Manual checks are available in `test/app` at `#devtools`; optional trace capture is not implemented.
- The library exposes PSR-3 severity **names**, not a verified complete PSR-3 contract.

Open questions are maintained in [work/CorePending.md](../../work/CorePending.md).
