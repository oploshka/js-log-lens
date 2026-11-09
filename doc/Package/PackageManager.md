# Package manager

Use `pnpm` for dependency installation and project scripts, following the active `vue-dlg` development branch.

```sh
corepack enable
pnpm install
pnpm dev
pnpm build:library
pnpm typecheck
pnpm lint
```

The pnpm version is pinned using `packageManager` in `package.json`.

## TODO: lockfile

The initial scaffold has no `pnpm-lock.yaml`.
Generate it locally with `pnpm install` and commit it.
After that, replace `pnpm install --no-frozen-lockfile` in the Pages workflow with `pnpm install --frozen-lockfile` and enable pnpm caching in `actions/setup-node`.

Do not copy the lockfile from `vue-dlg`: its dependency graph is different.
