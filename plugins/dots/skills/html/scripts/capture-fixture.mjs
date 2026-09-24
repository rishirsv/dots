export function bodyFixture() {
  return `<nav data-component="toc-rail" class="toc-rail" aria-label="On this page">
    <div class="toc-wide"><p class="toc-label">On this page</p><div class="toc-links">
      <a href="#decision">Decision</a><a href="#process">Process</a><a href="#risks">Risks</a>
      <a href="#evidence">Evidence</a><a href="#implementation">Implementation</a><a href="#next">Next step</a>
    </div></div>
    <details class="toc-compact"><summary>On this page</summary><div class="toc-links">
      <a href="#decision">Decision</a><a href="#process">Process</a><a href="#risks">Risks</a>
      <a href="#evidence">Evidence</a><a href="#implementation">Implementation</a><a href="#next">Next step</a>
    </div></details>
  </nav>
  <section id="decision"><h2>The rollout can proceed after one contained check</h2>
    <div data-component="callout" class="callout"><p><strong>Decision.</strong> Keep the migration scoped and verify the final mobile state before release.</p></div>
  </section>
  <section id="process"><h2>Verification path</h2>
    <ol data-component="process-steps" class="process-steps">
      <li class="process-step"><span class="process-marker">1</span><div class="process-title">Inspect</div><p class="process-detail">Read the source.</p></li>
      <li class="process-step"><span class="process-marker">2</span><div class="process-title">Change</div><p class="process-detail">Apply the correction.</p></li>
      <li class="process-step is-current"><span class="process-marker">3</span><div class="process-title">Render</div><p class="process-detail">Check each width.</p></li>
      <li class="process-step"><span class="process-marker">4</span><div class="process-title">Ship</div><p class="process-detail">Attach the evidence.</p></li>
    </ol>
  </section>
  <section id="comparison"><h2>Comparison cardinality</h2>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="2">
      <div class="option-card"><h3>Before</h3><p>Broad request.</p></div>
      <div class="option-card"><h3>After</h3><p>Scoped request.</p></div>
    </div>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="3">
      <div class="option-card"><h3>One</h3><p>First option.</p></div>
      <div class="option-card"><h3>Two</h3><p>Second option.</p></div>
      <div class="option-card"><h3>Three</h3><p>Third option.</p></div>
    </div>
    <div data-component="comparison-grid" class="comparison-grid" data-columns="4">
      <div class="option-card"><h3>One</h3><p>First option.</p></div>
      <div class="option-card"><h3>Two</h3><p>Second option.</p></div>
      <div class="option-card"><h3>Three</h3><p>Third option.</p></div>
      <div class="option-card"><h3>Four</h3><p>Fourth option.</p></div>
    </div>
  </section>
  <section id="risks"><h2>Release risks</h2>
    <div data-component="data-table" class="table-scroll table-stack"><table><thead><tr><th>Risk</th><th>Owner</th><th>State</th><th>Mitigation</th></tr></thead><tbody>
      <tr><td class="cell-label" data-label="Risk">Small-screen title collision</td><td data-label="Owner">Web</td><td data-label="State">Resolved</td><td data-label="Mitigation">Keep the title readable on narrow screens.</td></tr>
      <tr><td class="cell-label" data-label="Risk">Evidence too dense to read</td><td data-label="Owner">Research</td><td data-label="State">Resolved</td><td data-label="Mitigation">Use one focal figure and two supporting views.</td></tr>
    </tbody></table></div>
  </section>
  <section id="evidence"><h2>Rendered evidence</h2>
    <figure data-component="wide-figure" class="wide-figure"><svg viewBox="0 0 1040 360" role="img" aria-label="Wide release overview"><rect width="1040" height="360" fill="var(--a4)"/><rect x="80" y="64" width="880" height="232" rx="6" fill="var(--background)" stroke="var(--a20)"/><rect x="132" y="112" width="440" height="28" rx="4" fill="var(--foreground)" opacity=".8"/><rect x="132" y="176" width="776" height="72" rx="6" fill="var(--a8)"/></svg><figcaption>The focal view keeps the release decision readable at desktop and mobile widths.</figcaption></figure>
    <div data-component="evidence-gallery" class="evidence-gallery">
      <figure class="evidence-item is-featured"><svg viewBox="0 0 960 540" role="img" aria-label="Desktop state"><rect width="960" height="540" fill="var(--a4)"/><rect x="120" y="60" width="720" height="420" rx="6" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Desktop.</strong> The complete decision is visible without crowding.</figcaption></figure>
      <figure class="evidence-item"><svg viewBox="0 0 640 360" role="img" aria-label="Mobile state"><rect width="640" height="360" fill="var(--a4)"/><rect x="216" y="24" width="208" height="312" rx="16" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Mobile.</strong> Components stack into one readable column.</figcaption></figure>
      <figure class="evidence-item"><svg viewBox="0 0 640 360" role="img" aria-label="Dark state"><rect width="640" height="360" fill="var(--code-surface)"/><rect x="72" y="44" width="496" height="272" rx="6" fill="var(--background)" stroke="var(--a20)"/></svg><figcaption><strong>Dark.</strong> The same hierarchy survives the theme change.</figcaption></figure>
    </div>
  </section>
  <section id="implementation"><h2>Release boundary</h2><p>The migration remains scoped to one candidate path.</p></section>
  <section id="next"><h2>Release condition</h2><p>Publish after the final mobile state passes the focused check.</p></section>`;
}

