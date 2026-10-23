export const tools = [
  `<section class="clinic-tool-shell wrap" aria-labelledby="clinic-tool-title">
    <div class="clinic-tool-intro">
      <p class="eyebrow">FJMK · Practical tool</p>
      <h1 id="clinic-tool-title">Free clinic website check in Lagos, Nigeria</h1>
      <p>A first-page report on technical SEO, mobile performance and patient contact routes for clinics and hospitals.</p>
    </div>
    <div class="clinic-tool-panel">
      <form id="clinic-audit-form" class="clinic-tool-form">
        <label for="clinic-audit-url">Website address</label>
        <div class="clinic-tool-entry">
          <input id="clinic-audit-url" name="website" type="text" inputmode="url" autocomplete="url" placeholder="yourclinic.com" required>
          <button class="button" type="submit">Run free check <span aria-hidden="true">↗</span></button>
        </div>
        <p class="clinic-tool-note">Public homepage only. Don’t enter sign-in or patient pages. <a href="/privacy">Privacy</a></p>
        <p id="clinic-audit-status" class="clinic-tool-status" role="status" aria-live="polite" hidden></p>
        <div id="clinic-audit-progress" class="clinic-progress" aria-hidden="true" hidden><img src="/assets/img/brand/fjmk-logo-v1.svg" width="130" height="36" alt=""><span class="clinic-progress-line"></span><span class="clinic-progress-copy">Reading the public homepage · checking response, search signals and patient contact routes</span></div>
        <noscript><p class="clinic-tool-status">This check needs JavaScript enabled in your browser.</p></noscript>
      </form>
    </div>
  </section>`,
  `<section id="clinic-audit-report" class="clinic-report wrap" hidden aria-labelledby="clinic-audit-report-title" tabindex="-1">
    <header class="clinic-report-head">
      <div class="clinic-report-title">
        <p class="eyebrow">Website report <span aria-hidden="true">·</span> <span data-report-date></span></p>
        <h2 id="clinic-audit-report-title">Website check report</h2>
        <p class="clinic-report-host" data-report-host></p>
        <a class="clinic-report-url" data-report-url target="_blank" rel="noopener"></a>
      </div>
      <dl class="clinic-report-meta">
        <div><dt>Response</dt><dd data-report-response></dd></div>
        <div><dt>Time</dt><dd data-report-time></dd></div>
      </dl>
    </header>
    <section class="clinic-report-overview" aria-label="Check summary">
      <div><p class="eyebrow">First-page scan</p><p class="clinic-report-summary" data-report-summary></p></div>
      <dl class="clinic-report-counts">
        <div><dt>To review</dt><dd data-report-review-count></dd></div>
        <div><dt>Looks good</dt><dd data-report-good-count></dd></div>
        <div><dt>Signals</dt><dd data-report-info-count></dd></div>
      </dl>
    </section>
    <div class="clinic-report-actions">
      <a class="button" data-report-whatsapp target="_blank" rel="noopener"><span data-report-whatsapp-label>Get help prioritising these findings</span><span aria-hidden="true">↗</span></a>
      <button class="button button-secondary" type="button" data-report-print>Save report as PDF</button>
    </div>
    <section class="checkup-lighthouse" data-lighthouse hidden aria-labelledby="clinic-lighthouse-title">
      <div class="checkup-lighthouse-head">
        <div><p class="eyebrow">Mobile performance</p><h3 id="clinic-lighthouse-title">Google PageSpeed</h3></div>
        <p data-lighthouse-status role="status"></p>
      </div>
      <div class="checkup-lighthouse-scores" data-lighthouse-scores></div>
      <dl class="checkup-lighthouse-metrics" data-lighthouse-metrics></dl>
    </section>
    <section class="clinic-checks" aria-labelledby="clinic-checks-title">
      <div class="clinic-checks-head"><h3 id="clinic-checks-title">Checks</h3><p>Select a check for its next step and evidence.</p></div>
      <div id="clinic-audit-findings" class="checkup-groups"></div>
    </section>
  </section>`
].join("");
