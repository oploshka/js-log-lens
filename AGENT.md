# Agent

Read the shared rules from the source and ref specified in `DocumentationSource.json`.
Follow the entrypoint and reading order described there, including DocReading, Work and Agent modules.
Use `./work` for project-specific temporary context.

This project is a reusable JS library; do not infer application-specific business behavior or transport dependencies.
Keep unresolved public API and architecture choices in `doc/Architecture/Decisions.md` instead of silently deciding them.
