# Optional network transport

Network delivery stays in `example/`, not in the core.

```ts
import { LogLens, LogEvent } from '../../src/index';
import { createNetworkListener } from './sendToServer';

const event = new LogEvent();
const stop = event.subscribe(createNetworkListener({
  url: '/api/logs',
  onError: (error) => console.error('Log delivery failed', error),
}));
const logger = new LogLens(event).build();
logger.error('Something failed');
stop();
```

A network module wrapping the existing listener can implement `iLogModule.install(event)`.
The original transport serializes arguments and sends selected levels only; level filters and payload policy are intentionally left to the consumer adapter.
