# npm publishing checklist

The package is intentionally private and must not be published in its current state.

## TODO — before first release

- Agree and implement the stable entrypoint and core public API.
- Choose a license and add its text. `license` is intentionally omitted from `package.json`.
- Confirm available npm name and npm account ownership.
- Decide release version policy, Node.js/browser compatibility, module format, and declaration files.
- Add tests as a separate agreed task; run validation against supported runtimes.
- Generate and commit `pnpm-lock.yaml` after installing dependencies with pnpm.
- Validate lint, build (if introduced), package contents and package import with a packed tarball.
- Confirm whether releases are manual, npm provenance, or trusted publishing through GitHub Actions.
- Only then remove `private: true`, set the initial release version and publish.

## Commands for local inspection

```bash
pnpm install
pnpm lint
pnpm check:syntax
pnpm pack:check
```
