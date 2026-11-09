# Project website

The GitHub Pages site is built from `test/app` using `vite.demo.config.ts`.
It is a project landing page during early development, not a promise of implemented logger APIs.

- Workflow: `.github/workflows/pages.yml`
- Source branch: `develop`
- Artifact: `dist/`, produced by `npm run build:demo`
- Intended URL: https://oploshka.github.io/js-log-lens/

## One-time GitHub setup

In repository **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
The connector cannot change these repository administration settings.
After enabling Pages, inspect the **Deploy project site** workflow in the Actions tab.

This does not publish an npm package; npm release configuration remains separate.
