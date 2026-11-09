# Interactive development playground

Run `pnpm dev` to open the demo, or `pnpm build:demo` to generate the Pages site.

Structure:
- `main.ts` bootstraps the project logger via `example/Install/SetupLogger.ts`,
  registers a test-only `PageLogModule`, then provides the shared context to Vue.
- `App.vue` owns only the application layout.
- `Page/Example.vue` coordinates the playground and controls enable/disable.
- `Component/LogControls.vue` triggers the eight PSR-3 levels and scoped logging.
- `Component/LogViewer.vue` renders the last 100 structured entries.
- `Usage/Levels.ts` contains the test scenarios.
- `Style/App.css` holds the playground styling.

Pause/resume disables/enables only the page-history module; logging to the
console continues. The logger is application-scoped, not tied to an individual
Vue component's unmount lifecycle.

All new directories/files use PascalCase except `main.ts` (Vite entrypoint).
