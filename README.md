# LogLens (`js-log-lens`)

Configurable JavaScript logger with contextual metadata, flexible filtering, and PSR-3 severity levels.

**Status:** Early development. The public API and metadata model are being designed; the package is not yet published to npm.

**Project site:** [oploshka.github.io/js-log-lens](https://oploshka.github.io/js-log-lens/) (GitHub Pages, requires Pages deployment to be enabled in repository settings).

## Development

```sh
npm install
npm run dev            # Vite app in test/app
npm run build:library  # Build npm library to lib/
npm run build:demo     # Build GitHub Pages website to dist/
npm run typecheck
npm run lint
npm run pack:check
```

The playground uses Vue only as a development dependency; the library itself is framework-agnostic.

## Structure

- `src/` — library source; no business-specific adapters.
- `test/app/` — development UI and project site, based on the organization of `vue-dlg`.
- `example/` — optional consumer adapters (e.g. user-defined network transport).
- `doc/` — architecture decisions, tooling and publishing notes.
- `work/` — unresolved working context.

Alias details: [Tooling](doc/Architecture/Tooling.md).
Pending API choices: [Decisions](doc/Architecture/Decisions.md).

## GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) builds `test/app` with Vite on pushes to `develop`, or when manually dispatched.
In the repository's **Settings → Pages**, select **GitHub Actions** as the Build and deployment source.
The site is separate from the npm library output.

> Not yet publishable. `private: true` is intentional.
