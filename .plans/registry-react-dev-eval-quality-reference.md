# Registry Skill Eval And Quality Reference

Captured from Chrome on a public skill registry page. Direct source URLs are intentionally omitted so this planning note remains provider-neutral.

This is a planning reference for shaping Meta Skill eval scenarios. It is not an implementation spec.

## Page Summary

- Skill: `react-dev`
- Description: Use when building React components with TypeScript, typing hooks, handling events, or when React TypeScript, React 19, Server Components are mentioned. Covers type-safe patterns for React 18-19 including generic components, proper event typing, and routing integration.
- Overall quality: 95
- Quality: 95%
- Impact: 95%, 1.15x
- Eval basis: average score across 5 eval scenarios
- Eval agent/model: Claude Code, Claude Sonnet 4.6
- Commit: `3027f20`

## Eval Scenarios

The registry presents each eval as:

- scenario score
- impact contribution
- scenario title
- capability subtitle
- task details drawer
- criteria table with `Without context` and `With context` scores

### Build A Contact Form Component Library

- Score: 95%
- Impact contribution: 27%
- Capability: React 19 form component with ref and actions

Task details:

The agent is asked to build a small component library for a React 19 + TypeScript application. The team needs reusable form components that wrap native HTML elements and a contact form that uses them. Components must be properly typed, support all native HTML attributes, and accept refs so parent components can imperatively control them. The contact form must submit with a server action, show pending state, and show field-level validation errors.

Output files:

- `components/Input.tsx`: reusable input component wrapping native `<input>`, with `label`, native input attributes, and ref support.
- `components/Button.tsx`: reusable button component with `variant`; link variant renders an anchor with `href`, button/primary/secondary variants render a button, with native attributes and ref support.
- `components/TextArea.tsx`: reusable textarea with `label`, `error`, native textarea attributes, and ref support.
- `ContactForm.tsx`: client component for name, email, and message; submits to a server action; shows returned validation errors and pending state.
- `actions/contact.ts`: server action validating name, email, and message and returning success or field-level errors.

Criteria:

| Criterion | Without context | With context |
|---|---:|---:|
| ref as prop pattern | 0% | 100% |
| No forwardRef usage | 0% | 100% |
| ComponentPropsWithoutRef | 0% | 100% |
| useActionState for form | 100% | 100% |
| No useFormState | 100% | 100% |
| isPending from useActionState | 100% | 100% |
| `'use client'` directive | 100% | 100% |
| `'use server'` directive | 100% | 100% |
| Specific event types | 100% | 62% |
| Discriminated union for Button | 100% | 100% |
| ReactNode for children | 100% | 75% |

### Build A Generic Data Display Component Kit

- Score: 80%
- Impact contribution: 3%
- Capability: Generic typed data components

Task details:

The agent is asked to build an internal admin dashboard with React and TypeScript. The dashboard displays different data types such as users, products, and orders. Instead of separate components per type, the team wants reusable generic components that work with any data shape while maintaining type safety.

Required pieces:

- generic `DataTable` for arrays of objects with configurable columns
- generic `ItemList` with custom render function
- generic `SelectDropdown` for typed options
- `useSelection` hook for currently selected item
- `Dashboard.tsx` demonstration with a `User` type containing at least `id`, `name`, `email`, and `role`

Output files:

- `components/DataTable.tsx`
- `components/ItemList.tsx`
- `components/SelectDropdown.tsx`
- `hooks/useSelection.ts`
- `Dashboard.tsx`

Criteria:

| Criterion | Without context | With context |
|---|---:|---:|
| Generic type parameter | 100% | 100% |
| keyof T for columns | 100% | 100% |
| Render prop on columns | 100% | 100% |
| keyExtractor pattern | 100% | 100% |
| Constrained generic | 0% | 0% |
| Render prop on ItemList | 100% | 100% |
| ReactNode for rendering | 100% | 100% |
| as const for hook return | 0% | 0% |
| Explicit useState generic | 100% | 100% |
| SelectDropdown generic | 70% | 100% |
| No any types | 100% | 100% |

### Build A Theme And Notification System With Typed Hooks

- Score: 100%
- Impact contribution: 18%
- Capability: Custom hooks and state management typing

Task details:

The agent is asked to add a theme system and notification center to a React + TypeScript app. The theme system needs a context provider that lets any component access and toggle the current theme. The notification center manages a queue of success, error, warning, and info notifications that can be added, dismissed, or auto-expired. The implementation must be fully type-safe with no `any`, using custom hooks and context providers.

Output files:

- `hooks/useToggle.ts`: boolean toggle hook returning current value and toggle function.
- `context/ThemeContext.tsx`: theme context and provider; theme can be `light` or `dark`; includes `useTheme`.
- `hooks/useNotifications.ts`: notification queue hook using `useReducer`; supports `add`, `dismiss`, and `clear-all`.
- `hooks/useTimeout.ts`: timeout ref hook with start/stop/reset controls and properly typed ref.
- `App.tsx`: demonstrates theme toggling, adding/dismissing notifications, and auto-dismiss.

Criteria:

| Criterion | Without context | With context |
|---|---:|---:|
| as const on useToggle | 0% | 100% |
| Context null guard | 100% | 100% |
| createContext with null | 0% | 100% |
| Discriminated union actions | 100% | 100% |
| Typed reducer function | 100% | 100% |
| Mutable ref for timeout | 100% | 100% |
| Explicit useState generic | 100% | 100% |
| ReactNode for children | 100% | 100% |
| Notification type union | 100% | 100% |
| No any types | 100% | 100% |
| Proper ref cleanup | 100% | 100% |

### Build A Task Management Page With Server And Client Components

- Score: 100%
- Capability: Server/client component architecture

Task details:

The agent is asked to build a task management page for a React 19 + TypeScript app using Server Components. The page displays tasks fetched on the server, allows users to add tasks, and lets users toggle completion status. The UI should show instant feedback before the server confirms toggles.

Task type:

```ts
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};
```

Output files:

- `actions/tasks.ts`: server actions for adding a task and toggling completion; simulated module-level array and latency; input validation.
- `components/TaskList.tsx`: client component displaying tasks and toggling completion with immediate visual feedback.
- `components/AddTaskForm.tsx`: client component for adding tasks with submission lifecycle and pending state.
- `page.tsx`: server component fetching initial tasks and composing the page; passes data to client components efficiently for streaming.

Criteria:

| Criterion | Without context | With context |
|---|---:|---:|
| `'use server'` directive | 100% | 100% |
| `'use client'` directives | 100% | 100% |
| No directive mixing | 100% | 100% |
| page.tsx is server component | 100% | 100% |
| useActionState for form | 100% | 100% |
| useOptimistic for toggle | 100% | 100% |
| Promise handoff without await | 100% | 100% |
| Specific event types | 100% | 100% |
| Server action prevState param | 100% | 100% |
| Typed form state | 100% | 100% |
| No any types | 100% | 100% |

### Set Up Type-Safe Routing For A Product Catalog

- Score: 100%
- Impact contribution: 16%
- Capability: TanStack Router type-safe routing setup

Task details:

The agent is asked to build a product catalog application using React, TypeScript, and TanStack Router.

Routes:

- `/`: Home page
- `/products`: product listing with search params for filtering
- `/products/$productId`: product detail page
- `/products/$productId/reviews`: product reviews page

Search params for `/products`:

- `category`: optional string
- `sortBy`: `price | name | rating`, default `name`
- `page`: positive integer, default `1`

Each route should load data through a typed loader. The product listing page needs typed search param validation and manipulation. Navigation should be type-safe. Placeholder hardcoded arrays should be used instead of a real API.

Output files:

- `routes/root.tsx`
- `routes/index.tsx`
- `routes/products.tsx`
- `routes/product-detail.tsx`
- `routes/product-reviews.tsx`
- `router.ts`
- `types.ts`

Criteria:

| Criterion | Without context | With context |
|---|---:|---:|
| validateSearch with Zod | 100% | 100% |
| Zod search param types | 100% | 100% |
| createRoute usage | 100% | 100% |
| Typed loader function | 100% | 100% |
| useLoaderData with from | 20% | 100% |
| useSearch with from | 100% | 100% |
| useParams with from | 0% | 100% |
| Type-safe navigation | 100% | 100% |
| Route tree construction | 100% | 100% |
| getParentRoute defined | 100% | 100% |
| `$param` syntax | 100% | 100% |

## Quality Review

Registry quality is separate from task eval scenarios. It scores discovery, implementation, and validation.

### Discovery

- Score: 89%
- Prompt question: Based on the skill's description, can an agent find and select it at the right time?
- Explanation: Clear, specific descriptions lead to better discovery.
- Review summary: The skill description clearly identifies its niche, provides explicit trigger guidance, has good keyword coverage, and distinguishes itself from generic React or TypeScript skills. The main weakness is that the specific capabilities could be more concrete.

Dimensions:

| Dimension | Reasoning | Score |
|---|---|---:|
| Specificity | Names React with TypeScript and mentions actions such as building components, typing hooks, and handling events, but does not list comprehensive concrete actions. Terms like type-safe patterns and routing integration are somewhat vague. | 2 / 3 |
| Completeness | Explicitly answers both what the skill does and when it should be used. | 3 / 3 |
| Trigger Term Quality | Covers natural user terms such as React components, TypeScript, hooks, events, React 19, Server Components, TanStack Router, React Router, and generic components. | 3 / 3 |
| Distinctiveness Conflict Risk | Clear niche combining React and TypeScript with version markers and router libraries; unlikely to conflict with general React or TypeScript skills. | 3 / 3 |
| Total | Passed | 11 / 12 |

### Implementation

- Score: 100%
- Prompt question: Reviews the quality of instructions and guidance provided to agents.
- Explanation: Good implementation is clear, handles edge cases, and produces reliable results.
- Review summary: The skill is token-efficient while providing comprehensive, actionable guidance. It is well organized with executable examples and progressive disclosure through references. The rules section provides guardrails without being verbose.

Dimensions:

| Dimension | Reasoning | Score |
|---|---|---:|
| Conciseness | Lean and efficient; assumes competence with TypeScript and React; avoids explaining basic concepts. | 3 / 3 |
| Actionability | Code examples are executable and copy-paste ready, with concrete patterns for component props, event handlers, hooks, generics, and routing. | 3 / 3 |
| Workflow Clarity | For a reference/pattern skill, workflow is clear through organized sections and explicit rules. No destructive multi-step operations require checkpoints. | 3 / 3 |
| Progressive Disclosure | Concise inline examples and one-level-deep references to details such as hooks and event handlers. | 3 / 3 |
| Total | Passed | 12 / 12 |

### Validation

- Score: 90%
- Prompt question: Checks the skill against the spec for correct structure and formatting.
- Summary: Validation 10 / 11 passed.

Criteria:

| Criterion | Description | Result |
|---|---|---|
| frontmatter_unknown_keys | Unknown frontmatter key(s) found; consider removing or moving to metadata | Warning |
| skill_md_line_count | SKILL.md line count is 392 (<= 500) | Pass |
| frontmatter_valid | YAML frontmatter is valid | Pass |
| name_field | `name` field is valid: `react-dev` | Pass |
| description_field | `description` field is valid, 323 chars | Pass |
| compatibility_field | `compatibility` field not present, optional | Pass |
| allowed_tools_field | `allowed-tools` field not present, optional | Pass |
| metadata_version | `metadata` field not present, optional | Pass |
| metadata_field | `metadata` field not present, optional | Pass |
| license_field | `license` field not present, optional | Pass |
| body_present | SKILL.md body is present | Pass |
| Total | Validation result | 10 / 11 Passed |

## Notes For Meta Skill Shape

The registry structure suggests two separate artifacts:

1. Eval scenarios: task-level scenario details plus per-scenario measurable criteria and baseline/context comparison.
2. Quality review: skill-level dimensions for discovery, implementation, and validation with reasoning and scores.

For Meta Skill, `.meta-skill/eval-scenarios.md` should likely model scenario intent as:

- scenario title
- capability subtitle
- problem description
- output specification
- criteria list
- expected context lift, if relevant
- vector/type labels such as regression, failure, gate, source-grounding, or activation

Executable `.meta-skill/evals/<slug>/task.md` and `.meta-skill/evals/<slug>/criteria.json` files should then preserve the same task/criteria split, while run evidence can later compare `--no-skill` and skill-mounted runs per criterion.

Quality review should remain separate from executable eval generation. Its dimensions are closer to lint/review output than scenario authoring:

- Discovery: trigger specificity, completeness, trigger term quality, distinctiveness/conflict risk
- Implementation: conciseness, actionability, workflow clarity, progressive disclosure
- Validation: structural checks and pass/warning/failure results

Chrome observation note: the Quality page did not expose separate accessible info-icon targets for the criteria in the inspected DOM. Expanding the validation table exposed the criterion descriptions and results inline. The Evals page details were captured by opening the scenario details drawer and using the drawer navigation.
