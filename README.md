# LogLens (`js-log-lens`)

Configurable JavaScript logger with contextual metadata, flexible filtering, and PSR-3 severity levels.

**Status:** Early development. The public API and metadata model are being designed; the package is not yet published to npm.

**Project site:** [oploshka.github.io/js-log-lens](https://oploshka.github.io/js-log-lens/) (GitHub Pages, requires Pages deployment to be enabled in repository settings).

## Development

```sh
pnpm install
pnpm dev            # Vite app in test/app
pnpm build:library  # Build npm library to lib/
pnpm build:demo     # Build GitHub Pages website to dist/
pnpm typecheck
pnpm test           # Build library and run Node.js core tests
pnpm lint
pnpm pack:check
```

The playground uses Vue only as a development dependency; the library itself is framework-agnostic.

## Structure

- `src/` — library source; no business-specific adapters.
- `test/app/` — interactive development playground with log controls and a test-only page history module.
- `example/` — consumer integration examples; `Install/SetupLogger.ts` is used by the test app at bootstrap.
- `doc/` — architecture decisions, tooling and publishing notes.
- `work/` — unresolved working context.

Alias details: [Tooling](doc/Architecture/Tooling.md).
Pending API choices: [Decisions](doc/Architecture/Decisions.md).

## GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) builds `test/app` with Vite on pushes to `develop`, or when manually dispatched.
In the repository's **Settings → Pages**, select **GitHub Actions** as the Build and deployment source.
The site is separate from the npm library output.

> Not yet publishable. `private: true` is intentional.

## Logger prototype

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
