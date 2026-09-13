# Layout And Responsiveness

Compose around the user's task and information relationships. Preserve established
grids and spacing conventions unless changing them is part of the brief.

## Establish Hierarchy And Density

Identify the primary action, reading order, and information needed together.
Group related content through proximity, alignment, and type before adding
containers. Cards suit independently meaningful objects; they are not a default
wrapper for every section. Match density to use: repeated expert work may need
more simultaneous information than onboarding or a focused decision.

Choose a grid that serves the content. Give repeated rows consistent lanes for
icons, labels, values, and actions, including rows with missing optional content.
Tune optical alignment after structural alignment. Use spacing tokens for repeated
relationships while allowing composition-specific exceptions with a clear purpose.

Use a few strong alignment axes within each region; several unrelated left,
center, and right edges make scanning harder. When whitespace carries the
grouping, keep gaps within a group visibly smaller than gaps around it. Start
with enough space to expose the groups, then tighten deliberately when the task
benefits from density.

## Adapt The Composition

Choose breakpoints where content stops working, not only from device labels.
Decide what reflows, stacks, condenses, moves into disclosure, or remains scrollable.
Preserve task priority and logical reading order as the structure changes.

Prefer intrinsic sizing, flexible tracks, and bounded reading widths over fixed
geometry. Account for long labels, empty regions, additional rows, translated
content, and enlarged text. Keep controls reachable when browser chrome, a virtual
keyboard, safe areas, or sticky regions reduce the available space.

Do not scale every property by the same ratio. Large display type, media, and
generous padding often need to contract faster than body text, controls, and
touch targets. Keep elements near the size their content needs while space is
available; let flexible regions absorb change and introduce compression only
when a real constraint requires it.

Dense tables and canvases may need intentional scrolling or alternate views.
Keep essential context and controls available, and distinguish that behavior from
accidental page overflow. Avoid hiding information solely to fit a smaller screen.

## Inspect In Context

Inspect narrow and wide containers and the widths around layout transitions.
Check real content, extreme lengths, text scaling, and relevant orientations.
Look for collisions, stranded headings, broken grouping, and sticky elements
covering focused content. Evaluate whether hierarchy survives, not merely whether
the page fits. Use the active audit or QA workflow for findings and iterations.
