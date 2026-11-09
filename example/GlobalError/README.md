# Browser global error module

Browser errors are forwarded through a regular LogLens module. Lifecycle hooks
subscribe/unsubscribe to browser events; the manager owns LogEvent subscriptions.

```ts
import { GlobalErrorModule, LogLens, ConsoleModule } from '../../src/index';

const lens = new LogLens().use('console', new ConsoleModule());
const logger = lens.build();

lens.modules.add('global-errors', new GlobalErrorModule({
  dependencies: { logger: logger },
}));

// Stops intercepting window.error and window.unhandledrejection.
lens.modules.remove('global-errors');
```

On the server the module does nothing unless an explicit browser-like target is
provided. Disabling the manager module does **not** unhook browser events:
`remove()` calls `uninstall()`. Changing this lifecycle policy is a separate design decision.
