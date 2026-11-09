<template>
  <main class="page">
    <header class="topbar">
      <a class="wordmark" href="./" aria-label="LogLens home">
        LogLens
      </a>
      <a class="github" href="https://github.com/oploshka/js-log-lens">
        GitHub repository ↗
      </a>
    </header>

    <section class="hero">
      <p class="eyebrow">JavaScript logging library · In development</p>
      <h1>See logs<br>in context.</h1>
      <p class="lead">
        LogLens is an upcoming configurable JavaScript logger focused on contextual metadata,
        module-level diagnostics, and flexible filtering.
      </p>
      <div class="actions">
        <a class="primary" href="https://github.com/oploshka/js-log-lens/tree/develop">
          Explore the source
        </a>
        <a class="secondary" href="https://github.com/oploshka/js-log-lens/blob/develop/doc/Architecture/Decisions.md">
          Design decisions
        </a>
      </div>
    </section>

    <section class="principles" aria-label="Project principles">
      <article>
        <h2>Reusable by design</h2>
        <p>Keep framework- and project-specific integrations outside the logging core.</p>
      </article>
      <article>
        <h2>Context-aware</h2>
        <p>Model where diagnostic messages originate without mixing metadata and message arguments.</p>
      </article>
      <article>
        <h2>Configurable output</h2>
        <p>Make delivery and display decisions configurable; network integrations belong in examples.</p>
      </article>
    </section>

    <footer>
      <span>js-log-lens</span>
      <span>Public API under design · Not yet published to npm</span>
    </footer>
  </main>
</template>

<style>
:root {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0d1018;
  color: #e9edf7;
  font-synthesis: none;
}

* { box-sizing: border-box; }
body { margin: 0; }
a { color: inherit; text-decoration: none; }

.page { max-width: 1080px; padding: 0 36px; margin: auto; }
.topbar { padding: 32px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a3040; }
.wordmark { font-size: 24px; font-weight: 750; letter-spacing: -.05em; }
.github { font-size: 14px; color: #aeb9d1; }
.github:hover, .secondary:hover { color: #fff; }
.hero { padding: 100px 0 92px; max-width: 790px; }
.eyebrow { margin: 0 0 20px; font-size: 13px; text-transform: uppercase; letter-spacing: .13em; color: #91aef8; }
h1 { margin: 0; font-size: clamp(56px, 10vw, 106px); line-height: .99; letter-spacing: -.075em; }
.lead { max-width: 620px; margin: 30px 0 36px; font-size: 20px; line-height: 1.55; color: #b0bbcf; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
.actions a { display: inline-block; padding: 13px 18px; font-size: 14px; border-radius: 8px; font-weight: 600; }
.primary { background: #a4bdff; color: #101624; }
.primary:hover { background: #c5d4ff; }
.secondary { border: 1px solid #485168; color: #c5d0e4; }
.principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; padding-bottom: 90px; }
.principles article { border: 1px solid #30384a; border-radius: 12px; padding: 22px; background: #151a25; }
h2 { font-size: 17px; letter-spacing: -.02em; margin: 0 0 10px; }
.principles p { margin: 0; color: #aeb9cc; line-height: 1.55; font-size: 14px; }
footer { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; padding: 26px 0 36px; border-top: 1px solid #2a3040; font-size: 13px; color: #8491aa; }
@media (max-width: 700px) {
  .page { padding: 0 20px; }
  .topbar { padding: 24px 0; }
  .hero { padding: 75px 0; }
  .lead { font-size: 17px; }
  .principles { grid-template-columns: 1fr; padding-bottom: 60px; }
}
</style>
