# Console module: manual browser check

This is a browser-only verification; automated Node.js tests cannot determine how browser DevTools chooses its source location.

1. Start the Vite playground with `pnpm dev`, open the page in Chrome or Firefox and open DevTools.
2. Execute in the browser using the same app bundle (e.g. temporarily in `test/app/main.ts`):

```ts
import { LogLens, ConsoleModule } from '../../src/index';

const lens = new LogLens();
lens.modules.add('console', new ConsoleModule({ settings: { includeMeta: true } }));
const log = lens.build();
const ws = log.child('WebSocket', { module: 'ws' });
ws.info('DevTools callsite test', { id: 123 });
ws.meta({ requestId: 42 }).debug('Temporary meta', { id: 2 });
```

3. Verify styled level badges, preservation of original argument objects, and inherited vs one-shot meta.
4. Observe and record which file/line DevTools links to: user callsite, `LogAdapter`, `Log` or `ConsoleModule`.
5. Repeat with browser-console callsite tracking/source maps enabled and disabled if relevant.

**Expected limitation:** The module currently invokes `console.log` inside a listener; the DevTools source link may point to `ConsoleModule`. Preserving the original callsite and providing lazy trace remain TODO. Do not mark the browser callsite behavior as verified until tested in real browsers.
