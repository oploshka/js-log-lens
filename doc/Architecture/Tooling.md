# Tooling and project structure

This repository follows the separation used by `oploshka/vue-dialog`: framework-independent library code, a consumer-style integration example, a separate Vite playground, tests and independent library/demo builds.

| Location | Purpose |
| --- | --- |
| `src/` | TypeScript library and modules, without Vue runtime dependencies |
| `example/Install/SetupLogger.ts` | Example of configuring LogLens for a consumer application |
| `example/GlobalError/`, `example/NetworkTransport/` | Integration examples and transport customization |
| `test/app/main.ts` | Creates the example logger, registers the test-only history module and mounts Vue |
| `test/app/Page/`, `Component/`, `Usage/`, `Module/` | Interactive demo, DevTools verification and test-only UI features |
| `test/unit/` | Node.js tests for adapter, events and modules |
| `doc/`, `work/` | Current documentation and unresolved questions |

Vite's `root` is `test/app`, so `index.html` remains **there**, not at the repository root. The demo uses hash navigation (`#example` and `#devtools`) without requiring a router dependency.

## Import aliases

- `@loglens/*` → `src/*`
- `@app/*` → `test/app/*`
- `@example/*` → `example/*`
- `js-log-lens` → `src/index.ts` during local development

The public package entry point is `src/index.ts`; Vite builds the ESM library into `lib/` and TypeScript emits declaration files. The package is currently marked `private: true` and has version `0.1.0`.

## Commands

```sh
pnpm install
pnpm serve          # Vite playground with HMR; pnpm dev is equivalent
pnpm typecheck
pnpm lint
pnpm test           # Builds library and runs test/unit/*.test.mjs
pnpm build:library  # Vite ESM bundle + declaration files in lib/
pnpm build:demo     # Local demo build, base /
pnpm build:pages    # GitHub Pages build, base /js-log-lens/
pnpm pack:check
```

`pnpm serve` uses Vite HMR during development. `pnpm build:pages` is used by the Pages workflow; it is separate from the published library build.

## Runtime and publishing

Vue is a **development dependency** for the playground only. Runtime/platform support commitments, ESM/CJS publishing decisions and package release policy are not yet final; see [Publishing](../Package/Publishing.md).
