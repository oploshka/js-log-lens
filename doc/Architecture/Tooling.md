# Tooling and imports

The tooling structure follows `oploshka/vue-dialog` (npm package with a separate `test/app` Vite playground, library and demo builds, split TypeScript configs and path mappings).

Import aliases:

- `@loglens/*` maps to `src/*`.
- `@app/*` maps to `test/app/*`.
- `@example/*` maps to `example/*`.
- `js-log-lens` maps to the library entry `src/index.js` during development.

`@loglens` was chosen instead of `@jll` because the expanded name is clearer. Alias choice can be revisited without changing the package name.

Vue is a **dev dependency** for the playground only. The library has no Vue runtime dependency.
The library API is not implemented. Keep `private: true` and version `0.0.0` until npm contract, license, public exports and publication workflow are agreed.

TODO: Decide JS versus TS for the library code, CommonJS support, public type declarations and Node/browser support policy. Do not conflate demo build and library build.
