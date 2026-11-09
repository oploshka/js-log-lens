# Connecting LogLens to an application

`SetupLogger.ts` configures a single project-owned LogLens instance and
registers the standard ConsoleModule. The public library is accessed through
`js-log-lens`, not internal implementation paths.

```ts
import { setupLogger } from './SetupLogger';

const { lens, log } = setupLogger();

log.info('Application started');
log.child('WebSocket', { module: 'ws' }).debug('Connected');

// Add project-specific modules at application bootstrap:
// lens.modules.add('custom', customModule);
```

The playground uses this exact integration in `test/app/main.ts`. The UI
and testing-only history module are deliberately kept in `test/app`.
