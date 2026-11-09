# Interactive development playground

Run `pnpm dev` to open the demo, or `pnpm build:demo` to generate the Pages site.

The app has two pages, selected via URL hashes (no Vue Router dependency):
- `#example` — interactive logging playground, with controls and a live history module.
- `#devtools` — **manual browser DevTools validation**; each button exercises ConsoleModule
  and the page documents how to inspect console formatting, metadata and source links.

Structure:
- `main.ts` bootstraps the project logger via `example/Install/SetupLogger.ts`,
  registers a test-only `PageLogModule`, then provides the shared context to Vue.
- `App.vue` owns the application layout and simple page navigation.
- `Page/Example.vue` coordinates the playground and controls enable/disable.
- `Page/ConsoleDevTools.vue` owns a separate temporary logger configured with `includeMeta: true`
  and disposes it when leaving the page.
- `Component/LogControls.vue` triggers the eight PSR-3 levels and scoped logging.
- `Component/LogViewer.vue` renders the last 100 structured entries.
- `Usage/Levels.ts` contains the test scenarios.
- `Style/App.css` holds the playground styling.

Pause/resume disables/enables only the page-history module; logging to the
console continues. The shared logger is application-scoped, not tied to an
individual Vue component's unmount lifecycle.

Unit tests are in `test/unit` (run with `pnpm test`).
