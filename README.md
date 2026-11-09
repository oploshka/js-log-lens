# LogLens (`js-log-lens`)

Configurable JavaScript logger under development.
The library API and metadata model are still being designed.

## Development

```sh
npm install
npm run dev            # Vite app in test/app
npm run build:library  # Build npm library to lib/
npm run build:demo     # Build standalone playground to dist/
npm run typecheck
npm run lint
npm run pack:check
```

The playground uses Vue only as a development dependency; the library itself is framework-agnostic.

## Structure

- `src/` — library source; no business-specific adapters.
- `test/app/` — development UI and manual scenarios, based on the organization of `vue-dlg`.
- `example/` — optional consumer adapters (e.g. user-defined network transport).
- `doc/` — architecture decisions, tooling and publishing notes.
- `work/` — unresolved working context.

Alias details: [Tooling](doc/Architecture/Tooling.md).
Pending API choices: [Decisions](doc/Architecture/Decisions.md).

> Not yet publishable. `private: true` is intentional.
