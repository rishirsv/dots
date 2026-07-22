# Design-System Audit

Audit one coherent product surface against the system that actually governs it.
Preserve the product's identity, reuse existing owners, and prefer no finding to
an unsupported one.

Use the parent skill's severity, finding anatomy, and final-response contract.

## Design System Discovery

Aligning the feature to the design system is **not optional**. Polish without alignment is decoration on top of drift, and it makes the next person's job harder. Discovery comes before any other polish work.

1. **Find the design system**: Search for design system documentation, component libraries, style guides, or token definitions. Study the core patterns: design principles, target audience, color tokens, spacing scale, typography styles, component API, motion conventions.
2. **Note the conventions**: How are shared components imported? What spacing scale is used? Which colors come from tokens vs hard-coded values? What motion and interaction patterns are established? What flow shapes are used for comparable actions (modal vs full-page, inline vs route, save-on-blur vs explicit submit)?
3. **Identify drift, then name the root cause**: For every deviation, classify it as a **missing token** (the value should exist in the system but doesn't), a **one-off implementation** (a shared component already exists but wasn't used), or a **conceptual misalignment** (the feature's flow, IA, or hierarchy doesn't match neighboring features). The fix differs by category: patch the value, swap to the shared component, or rework the flow. Fixing the symptom without naming the cause is how drift compounds.

If a design system exists, polish **must** align the feature with it. If none exists, polish against the conventions visible in the codebase. **If anything about the system is ambiguous, ask. Never guess at design system principles.**

## 1. Select the surface

Honor the user's scope. If the request is broad, select one deployable application and one coherent surface family representing a primary product task. State the selection; do not synthesize the whole repository into one product.

Start from the surface's routes and layouts. Trace the rendered path through compositions, shared components, variants, resolved tokens, and styles. Do not begin with a repository-wide search for inconsistencies.

A connection exists only when it is proven through rendering, imports, props, resolved configuration, CSS inheritance, or a generated artifact loaded by the surface. Shared names, similar tokens, repository proximity, and conceptual relationships do not establish a connection. Exclude other applications, previews, configurators, generated registries, legacy systems, and enterprise variants unless they participate in the traced path.

## 2. Reconstruct the local system

Check for `DESIGN.md`, repository guidance, and surface-local design documentation. Use a source only after proving it is current and governs the selected surface; drafts, proposals, migrations, and task lists describe future intent unless explicitly accepted and current. Absence of design documentation is not a finding.

Inspect only the tokens, variables, themes, primitives, variants, and compositions relevant to the traced path. Resolve aliases and variants to their definitions. Classify an implementation as local or legacy only when the repository says so.

Record:

```markdown
## Design language
- Audited surface:
- Design sources:
- Documented decisions:
- Governing owners and consumers:
- Explicit exceptions:
```

Write `None documented` under `Explicit exceptions` unless a cited source explicitly identifies the exception.

## Design-System Conformance Dimensions

Apply only dimensions the available evidence can establish. Read
[spacing.md](../../design/references/spacing.md) for the complete spatial method.

### Information Architecture & Flow

Visual polish on a misshapen flow is wasted work. Match the *shape* of the experience to the system, not just the surface.

- **Progressive disclosure**: Match how much is revealed when, compared to neighboring features. A settings page exposing 40 fields when the rest of the app reveals 5 at a time is drift, even if every field is perfectly styled.
- **Established user flows**: Multi-step actions follow the same shape as comparable flows elsewhere: modal vs full-page, inline edit vs separate route, save-on-blur vs explicit submit, optimistic vs pessimistic updates.
- **Hierarchy & complexity**: The same conceptual weight gets the same visual weight throughout. Primary actions don't become tertiary in one corner of the product, and tertiary actions don't shout.
- **Empty, loading, and arrival transitions**: How content arrives, updates, and leaves matches how it does in adjacent features.
- **Naming and mental model**: The feature uses the same nouns and verbs as the rest of the system. A "Workspace" here shouldn't be a "Project" three screens away.

### Typography Refinement

- **Hierarchy consistency**: Same elements use same sizes/weights throughout
- **Line length**: 45-75 characters for body text
- **Line height**: Appropriate for font size and context
- **Widows & orphans**: No single words on last line
- **Hyphenation**: Appropriate for language and column width
- **Kerning**: Adjust letter spacing where needed (especially headlines)
- **Font loading**: No FOUT/FOIT flashes

### Color & Contrast

- **Contrast ratios**: All text meets WCAG standards
- **Consistent token usage**: No hard-coded colors, all use design tokens
- **Theme consistency**: Works in all theme variants
- **Color meaning**: Same colors mean same things throughout
- **Accessible focus**: Focus indicators visible with sufficient contrast
- **Gray on color**: Never put gray text on colored backgrounds; use a shade of that color or transparency

### Interaction States

Every interactive element needs all states:

- **Default**: Resting state
- **Hover**: Subtle feedback (color, scale, shadow)
- **Focus**: Keyboard focus indicator (never remove without replacement)
- **Active**: Click/tap feedback
- **Disabled**: Clearly non-interactive
- **Loading**: Async action feedback
- **Error**: Validation or error state
- **Success**: Successful completion

**Missing states create confusion and broken experiences**.

### Content & Copy

- **Consistent terminology**: Same things called same names throughout
- **Consistent capitalization**: Title Case vs Sentence case applied consistently
- **Grammar & spelling**: No typos
- **Appropriate length**: Not too wordy, not too terse
- **Punctuation consistency**: Periods on sentences, not on labels (unless all labels have them)

### Icons & Images

- **Consistent style**: All icons from same family or matching style
- **Appropriate sizing**: Icons sized consistently for context
- **Proper alignment**: Icons align with adjacent text optically
- **Alt text**: All images have descriptive alt text
- **Loading states**: Images don't cause layout shift, proper aspect ratios
- **Retina support**: 2x assets for high-DPI screens

### Forms & Inputs

- **Label consistency**: All inputs properly labeled
- **Required indicators**: Clear and consistent
- **Error messages**: Helpful and consistent
- **Tab order**: Logical keyboard navigation
- **Auto-focus**: Appropriate (don't overuse)
- **Validation timing**: Consistent (on blur vs on submit)

### Edge Cases & Error States

- **Loading states**: All async actions have loading feedback
- **Empty states**: Helpful empty states, not just blank space
- **Error states**: Clear error messages with recovery paths
- **Success states**: Confirmation of successful actions
- **Long content**: Handles very long names, descriptions, etc.
- **No content**: Handles missing data gracefully
- **Offline**: Appropriate offline handling (if applicable)

### Responsiveness

- **All breakpoints**: Test mobile, tablet, desktop
- **Touch targets**: 44x44px minimum on touch devices
- **Readable text**: No text smaller than 14px on mobile
- **No horizontal scroll**: Content fits viewport
- **Appropriate reflow**: Content adapts logically

## 3. Prove findings

Before applying the proof gate, inspect every traced surface's user-facing labels, active-state presentation, responsive branches, and sibling variants for internal contradictions. Treat the results only as candidates.

A finding is in scope only when its correction primarily changes visual presentation, interface copy, layout, component styling, or conformance to a documented design rule. If the correction primarily changes whether product behavior works, reject it.

Search results, repetition, and implementation differences produce candidates, not findings. Keep a candidate only when all three proofs exist:

1. **Contract** — Cite a binding design decision for this property and scope, or a direct contradiction in user-facing presentation or content within the same task. “Prefer,” “generally,” names, omissions, repetition, and absence of an exception do not establish a contract.
2. **Runtime** — Prove that the cited owner, value, or behavior reaches the affected surface through the traced runtime path. Do not compare separate ownership layers or lifecycle states.
3. **Correction** — State one change required by the evidence. If it depends on an existing token, variant, primitive, or exemplar, name it exactly. If the evidence cannot determine the correct choice, the intended condition is ambiguous, the proposal contains alternatives, or the correction requires inventing product intent, reject the candidate.

Source can prove token, typography, color, spacing, layout, copy, component-variant, responsive-presentation, and explicit design-contract violations. It cannot turn functional behavior, state management, or interaction correctness into design findings. Hierarchy, prominence, density, clarity, discoverability, usability, and perceived coherence require rendered or user evidence.

Discard accessibility and HTML/ARIA semantic findings unless the user explicitly requests them. Discard broken routes, redirects, data wiring, action failures, metadata, package API, performance, architecture, and code-quality findings unless the user requested them or a product-specific design contract governs them.

Assign confidence only after all proofs pass. Reuse an existing owner when the evidence supports it; do not create a shared primitive from repetition alone.

## 4. Vet findings

Before reporting, re-open every cited source and try to falsify each candidate. Delete it when:

- The problem does not exactly match the cited implementation.
- The rule does not govern that property and surface.
- Counterevidence shows the difference is valid or deliberate.
- The evidence supports multiple corrections.
- The correction invents product intent.
- Another finding describes the same root problem.

Only findings that survive this pass may enter the table.
