# npm beta publishing checklist

## Current state

- The repository is at `0.1.0` on `develop` as of this preparation step.
- The **next planned version** is `0.1.1`, to be set **immediately before the release merge** into `master`; do not bump the development version prematurely.
- The public API is **beta-stage**, not stable. Users should install **exact** versions, without `^`, `~` or floating tags.
- The package is still `private: true`. The GitHub Pages deployment is separate from npm publishing.
- `publishConfig.tag` is `beta`, so the intended publish will **not** update npm's `latest` distribution tag.

A plain `0.1.1` version is a normal SemVer version number, **not** a SemVer prerelease such as `0.1.1-beta.0`. We are using the npm **dist-tag `beta`** to signal distribution status, while also documenting API instability.

## Before publishing `0.1.1`

1. **Choose and commit an explicit license**. A public GitHub repository does not grant reuse rights automatically. Do not guess the author's intended license. Add `LICENSE` and the matching `license` field in `package.json`.
2. Confirm ownership and availability of the **`js-log-lens`** name on npm.
3. Validate on `develop`: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build:library`, `pnpm pack:check`. Verify that importing the packed package works, including type declarations.
4. Finalize the browser/Node runtime support statement and review any breaking API changes. Verify the package contents: the `files` field includes only `lib/`, and `exports` targets the built files.
5. **Immediately before the merge**, bump `package.json` to **`0.1.1`**. Update the lockfile if the package manager requires it. Use the repository's agreed merge-commit procedure to promote `develop` into `master`; do not directly fast-forward or rewrite `master`.
6. For first publication, explicitly change `private: true` to `private: false` in the release commit, after all checks and decisions are satisfied.
7. Publish from the reviewed `master` release state through a configured npm account or a trusted publishing workflow. Make sure the package is published under **`beta`**, not `latest`, and verify its registry version and dist-tags afterward.

## Publishing commands (only after release gates pass)

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm pack:check

npm whoami
npm publish --access public --tag beta
npm view js-log-lens@0.1.1 version
npm dist-tag ls js-log-lens
```

Do **not** run `npm publish` until the package has an approved license, is no longer private, and the final release commit has been reviewed. Publishing the same name/version combination is effectively permanent. No npm credentials or publication are performed by preparing this repository.

For automated publication, prefer npm's [trusted publishing](https://docs.npmjs.com/trusted-publishers/) with GitHub Actions OIDC rather than a long-lived token. The npm package owner must explicitly configure the trusted publisher. Set repository/workflow identity, permissions and release branch appropriately before enabling any publish job.

## Installing a beta release

After `0.1.1` appears in npm:

```sh
npm install --save-exact js-log-lens@0.1.1
# or
pnpm add --save-exact js-log-lens@0.1.1
```

Commit the consuming project's lockfile. Avoid `^0.1.1`, `~0.1.1`, `@beta` or `@latest` in saved dependencies if reproducibility is important. Review the changelog/API changes before every explicit upgrade.

GitHub Pages uses `pnpm build:pages` and does not publish to npm: see [Website](Website.md).
