# Package manager

Use `pnpm` for dependencies and project scripts, as in `vue-dialog/develop`. The configured package-manager version is recorded in `package.json`.

```sh
corepack enable
pnpm install
pnpm serve
pnpm typecheck
pnpm lint
pnpm test
pnpm build:library
pnpm build:pages
```

## Lockfile and CI

`pnpm-lock.yaml` is present in the repository. Keep it synchronized with `package.json` and commit updates whenever dependencies change.

The Pages workflow still installs with `pnpm install --no-frozen-lockfile`. A follow-up tooling change should verify lockfile compatibility with the configured pnpm version, switch CI to `--frozen-lockfile` and optionally configure pnpm caching.

Do not copy the lockfile from `vue-dlg`: the dependency graph is different.
