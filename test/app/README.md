# Interactive development playground

Run `pnpm dev` and open the Vite URL. The left column triggers each PSR-3
method plus `child()` and one-shot `meta()`. The right column shows structured
entries delivered through a test-only `PageLogModule`, with a 100-entry limit.
Pause/resume uses `LogLensModuleManager.disable/enable`, and Clear resets
the page module's history.

The logger is initialized by the consumer-style example in
`example/Project/setupLogger.ts`. The UI and `Usage/` actions live entirely
under `test/app`. The playground still outputs to the browser console through
`ConsoleModule`.

`pnpm build:demo` builds the same playground for GitHub Pages.
