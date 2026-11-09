# Custom network module

`NetworkModule` is framework-agnostic: consumers supply both record transformation
and request dispatch. The library does not choose a URL, authentication, retry
policy, or JSON serialization format.

```ts
import { LogLens, NetworkModule } from 'js-log-lens';

const lens = new LogLens();
lens.modules.add('network', new NetworkModule({
  dependencies: {
    transform: (entry) => ({
      level: entry.logInfo.level,
      args: entry.args,
      meta: entry.meta,
    }),
    request: async (payload) => {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    },
    onError: (error) => console.error('Delivery failed', error),
  },
}));

const log = lens.build();
log.error('Request failed');
```

To filter levels, extend `NetworkModule` and override `filter(entry)`;
the manager calls it before `run(entry)`. Async operations are not awaited.
The optional adapter in `SendToServer.ts` shows Error serialization. Circular
structures require a consumer-provided serializer.
