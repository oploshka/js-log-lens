# npm publishing checklist

The package is intentionally `private: true`, version `0.1.0`, and is **not ready for publication**. The TypeScript core and ESM build exist, but the release contract is not yet finalized.

## Already available

- Public entry point and exports in `src/index.ts`, including `LogLens`, `LogAdapter` and optional modules.
- Vite ESM library build and TypeScript declaration generation into `lib/`.
- Node.js unit tests in `test/unit/`, invoked via `pnpm test`.
- A pnpm lockfile and a separate development playground.

These are implementation facts, **not** confirmation that all release checks have passed.

## Before the first release

- Stabilize the public API and document runtime/browser compatibility and the Node.js support matrix.
- Choose a license and add a license file and package metadata.
- Confirm npm package-name availability and access to the publishing account.
- Decide release process, ESM-only versus additional module formats and package export policy.
- Validate TypeScript checks, ESLint, unit tests and the library build on supported runtimes.
- Test package contents and imports from a packed artifact (including type declarations).
- Decide between manual publishing, npm provenance or GitHub Actions trusted publishing.
- Remove `private: true` only once these checks and decisions are complete.

## Validation commands

```sh
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build:library
pnpm pack:check
```

GitHub Pages deploys the **playground**, not the npm library; see [Website](Website.md).
