export const tools = [
  `<section class="clinic-tool-shell wrap" aria-labelledby="clinic-tool-title">
    <div class="clinic-tool-intro">
      <p class="eyebrow">FJMK · Practical tool</p>
      <h1 id="clinic-tool-title">Free health website audit</h1>
      <p>A first-page scan of patient routes, mobile signals, search basics, privacy and security for healthcare organisations.</p>
    </div>
    <div class="clinic-tool-panel">
      <form id="clinic-audit-form" class="clinic-tool-form">
        <label for="clinic-audit-url">Health website address</label>
        <div class="clinic-tool-entry">
          <input id="clinic-audit-url" name="website" type="text" inputmode="url" autocomplete="url" placeholder="yourclinic.com" required>
          <button class="button" type="submit">Run free audit <span aria-hidden="true">↗</span></button>
        </div>
        <p class="clinic-tool-note">Public homepage only. Don’t enter sign-in or patient pages. Non-health websites are not accepted. <a href="/privacy">Privacy</a></p>
        <p id="clinic-audit-status" class="clinic-tool-status" role="status" aria-live="polite" hidden></p>
        <div id="clinic-audit-progress" class="clinic-progress" aria-hidden="true" hidden><img src="/assets/img/brand/fjmk-logo-v1.svg" width="130" height="36" alt=""><span class="clinic-progress-line"></span><span class="clinic-progress-copy">Reading the public homepage · checking response, search signals and patient routes</span></div>
        <noscript><p class="clinic-tool-status">This audit needs JavaScript enabled in your browser.</p></noscript>
      </form>
    </div>
  </section>`,
  `<section id="clinic-audit-report" class="clinic-report wrap" hidden aria-labelledby="clinic-audit-report-title" tabindex="-1">
    <header class="clinic-report-head">
      <div class="clinic-report-title">
        <p class="eyebrow">Health website audit <span aria-hidden="true">·</span> <span data-report-date></span></p>
        <h2 id="clinic-audit-report-title">Your homepage score</h2>
        <p class="clinic-report-host" data-report-host></p>
        <a class="clinic-report-url" data-report-url target="_blank" rel="noopener"></a>
      </div>
    </header>
    <section class="clinic-score-card" data-score-card aria-labelledby="clinic-score-label">
      <div class="clinic-score-result" aria-label="Overall score">
        <span class="clinic-score-value" data-score-value></span>
        <span class="clinic-score-denominator">/ 100</span>
        <span class="clinic-score-grade" data-score-grade></span>
      </div>
      <div class="clinic-score-copy">
        <p class="eyebrow">Weighted homepage score</p>
        <h3 id="clinic-score-label" data-score-label></h3>
        <p data-score-method></p>
      </div>
    </section>
    <section class="clinic-report-preview" aria-labelledby="clinic-preview-title">
      <div class="clinic-preview-intro">
        <p class="eyebrow">Quick preview</p>
        <h3 id="clinic-preview-title">What the score means</h3>
        <p data-report-summary></p>
      </div>
      <ul class="clinic-preview-highlights" data-preview-highlights></ul>
      <p class="clinic-score-limitation" data-score-limitation></p>
    </section>
    <form id="clinic-report-email" class="clinic-report-gate">
      <label for="clinic-report-email-address">Email address for the full report</label>
      <div class="clinic-report-email-entry">
        <input id="clinic-report-email-address" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required>
        <button class="button" type="submit">Unlock detailed report <span aria-hidden="true">↗</span></button>
      </div>
      <p class="clinic-report-gate-note">Submitting sends your email, the public website address, score and grade to FJMK. The team uses them to unlock the detailed report and follow up about this audit. You won’t be added to a general mailing list. <a href="/privacy">Privacy details</a>.</p>
      <p id="clinic-report-gate-status" class="clinic-tool-status" role="status" aria-live="polite" hidden></p>
    </form>
    <p class="clinic-report-unlocked" data-report-unlocked role="status" hidden></p>
    <section class="clinic-full-report" data-full-report hidden aria-labelledby="clinic-full-report-title">
      <h3 id="clinic-full-report-title" class="clinic-full-report-title">Detailed homepage findings</h3>
      <p class="clinic-score-formula" data-score-formula></p>
      <section class="clinic-report-overview" aria-label="Detailed check summary">
        <div><p class="eyebrow">Full scan</p><p class="clinic-report-summary" data-full-report-summary></p></div>
        <dl class="clinic-report-counts">
          <div class="clinic-count clinic-count--review"><dt>To review</dt><dd data-report-review-count></dd></div>
          <div class="clinic-count clinic-count--good"><dt>Looks good</dt><dd data-report-good-count></dd></div>
          <div class="clinic-count clinic-count--info"><dt>Signals</dt><dd data-report-info-count></dd></div>
        </dl>
        <dl class="clinic-report-meta">
          <div><dt>Response</dt><dd data-report-response></dd></div>
          <div><dt>Time</dt><dd data-report-time></dd></div>
        </dl>
      </section>
      <div class="clinic-report-actions">
        <a class="button" data-report-whatsapp target="_blank" rel="noopener"><span data-report-whatsapp-label>Get help prioritising these findings</span><span aria-hidden="true">↗</span></a>
        <button class="button button-secondary" type="button" data-report-print>Save detailed report as PDF</button>
        <p class="clinic-print-note">Choose “Save as PDF” in your browser’s print dialog.</p>
      </div>
      <section class="checkup-lighthouse" data-lighthouse hidden aria-labelledby="clinic-lighthouse-title">
        <div class="checkup-lighthouse-head">
          <div><p class="eyebrow">Mobile performance</p><h4 id="clinic-lighthouse-title">Google PageSpeed</h4></div>
          <p data-lighthouse-status role="status"></p>
        </div>
        <div class="checkup-lighthouse-scores" data-lighthouse-scores></div>
        <dl class="checkup-lighthouse-metrics" data-lighthouse-metrics></dl>
        <p class="checkup-lighthouse-note">An emulated lab snapshot. These scores vary and do not represent Lagos users’ experience or confirm compliance.</p>
      </section>
      <section class="clinic-checks" aria-labelledby="clinic-checks-title">
        <div class="clinic-checks-head"><h4 id="clinic-checks-title">Checks</h4><p>Select a check for its next step and evidence.</p></div>
        <div id="clinic-audit-findings" class="checkup-groups"></div>
      </section>
      <p class="clinic-report-note">This first-page scan reads public homepage HTML and response headers. It does not crawl a site, submit forms, test pages added by JavaScript, or establish clinical, legal, security or accessibility compliance. No Lagos benchmark is available.</p>
    </section>
  </section>`
].join("");
