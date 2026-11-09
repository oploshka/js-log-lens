# Connecting LogLens to an application

A consumer sets up a single `LogLens` instance, registers modules and exports
a logger for the rest of the application:

```ts
import { setupLogger } from './setupLogger';

const { lens, log } = setupLogger();

log.info('Application started');
log.child('WebSocket', { module: 'ws' }).debug('Connected');

// The application may register additional modules when needed:
// lens.modules.add('custom', customModule);
```

The example uses the local package alias `js-log-lens`, which resolves to
`src/index.ts` inside this repository. Consumers of a published version would
import the same public API from the installed package.

UI controls and test-only modules live in `test/app`, not in `example`.
