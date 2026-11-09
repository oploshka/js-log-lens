# LogLens (`js-log-lens`)

Configurable JavaScript logger with contextual metadata, flexible filtering, and PSR-3 severity levels.

**Status:** Version `0.1.0` (experimental API), not yet published to npm. The logging core and modules are implemented; release policies and some behavior contracts remain open.

**Project site:** [oploshka.github.io/js-log-lens](https://oploshka.github.io/js-log-lens/) (publication depends on repository Pages and environment permissions).

## Development

```sh
pnpm install
pnpm serve          # Vite test/app with live reload (HMR)
pnpm dev            # Alias for the same development app
pnpm build:library  # Build npm library to lib/
pnpm build:demo     # Build local demo to dist/ (base /)
pnpm build:pages    # Build GitHub Pages website to dist/ (base /js-log-lens/)
pnpm typecheck
pnpm test           # Build library and run Node.js unit tests
pnpm lint
pnpm pack:check
```

The playground uses Vue only as a development dependency; the library itself is framework-agnostic.

## Structure

- `src/` — library source; no business-specific adapters.
- `test/app/` — interactive playground with log controls, a live-history module and a DevTools verification page.
- `test/unit/` — Node.js tests for the library.
- `example/` — consumer integration examples; `Install/SetupLogger.ts` is used by the test app at bootstrap.
- `doc/` — architecture decisions, tooling and publishing notes.
- `work/` — unresolved working context.

Alias details: [Tooling](doc/Architecture/Tooling.md).
Adopted API decisions: [Decisions](doc/Architecture/Decisions.md). Open questions: [CorePending](work/CorePending.md).

## GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) builds `test/app` with `pnpm build:pages` and uploads `dist/` on pushes to `master` or when manually dispatched.

**Required repository settings:** [Settings → Pages](https://github.com/oploshka/js-log-lens/settings/pages) must use **GitHub Actions** as the deployment source, and the `github-pages` environment must allow deployments from the workflow branch. The workflow deploys from `master`; normal development continues in `develop`. See [Website](doc/Package/Website.md).

Vite keeps `index.html` inside its configured `root: test/app` and uses `base: '/'` for `pnpm serve` / `pnpm build:demo`, versus `base: '/js-log-lens/'` for `pnpm build:pages`. Page selection uses `#example` / `#devtools`, so GitHub Pages needs no SPA fallback or history-mode router configuration.

The site is separate from the npm library output.

> Not yet publishable. `private: true` is intentional.

## Logger API

The TypeScript core uses `Log`, `LogAdapter`, `LogEvent`, `LogLens`, and installable modules.

```ts
import { LogLens, ConsoleModule } from 'js-log-lens';

const lens = new LogLens().use('console', new ConsoleModule());
const log = lens.build();
log.debug('Hello');

const ws = log.child('WebSocket', { module: 'ws' });
ws.meta({ requestId: 123 }).debug('Received', { payload: true });

lens.dispose();
```

`LOG` is a convenience export with a console module. The record shape is `{ logInfo, args, meta }` with a hierarchical logger descriptor in `logInfo.logger`. See [implementation](doc/Architecture/Implementation.md).

## Optional modules

`GlobalErrorModule` forwards uncaught browser errors through a logger; `NetworkModule` accepts consumer-defined transformation and request callbacks. See [browser error example](example/GlobalError/README.md) and [network example](example/NetworkTransport/README.md).
