# Optional network transport

The original `logTransport.js` is an optional example instead of being hard-coded into the logger.

```ts
import { createLogEvent, createLogger } from '../../src/index';
import { createNetworkListener } from './sendToServer';

const events = createLogEvent();
const stop = events.subscribe(createNetworkListener({
  url: '/api/logs',
  onError: (error) => console.error('Log delivery failed', error),
}));
const logger = createLogger(events, { module: 'ws' });
logger.error('Something failed');
stop();
```

This example deliberately does not enforce a URL, authentication, retry policy, or server payload contract.
JSON serialization will fail for circular objects; consumers must supply suitable serialization for their transport.
