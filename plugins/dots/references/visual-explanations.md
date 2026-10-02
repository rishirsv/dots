# Visual Explanations

Read this when the user wants a visual answer or a diagram would make an
explanation substantially easier to follow. The skill handling the subject
still owns the investigation and claims. This reference chooses their visual
form.

Start with the least elaborate form that reveals the important relationship:

- **Pseudocode** for logic or an algorithm.

  ```text
  on(request)
    if session is expired
      reject the request
    load the account
    return the result
  ```

- **Call tree** for runtime control flow.

  ```text
  completeCheckout
    priceOrder
    authorizePayment
      recordAttempt
      callProvider
    issueReceipt
  ```

- **Component tree** for UI structure. Include only the state and module
  boundaries that matter.

  ```text
  <CheckoutScreen> (routes/checkout.tsx)
    useCart()
    <OrderSummary>
    <PaymentForm> (packages/payments)
  ```

- **Shallow file tree** for responsibility or architectural placement.

  ```text
  src/
  ├── checkout/       # coordinates the purchase
  ├── payments/       # talks to the provider
  └── receipts/       # records the outcome
  ```

- **Mermaid** for interaction, control flow, or data flow where direction and
  handoffs carry the meaning.

  ```mermaid
  sequenceDiagram
      participant App
      participant API
      participant Provider
      App->>API: submit payment
      API->>Provider: authorize
      Provider-->>API: approved
      API-->>App: receipt
  ```

## Show changes in their existing shape

Use a diff when the point is what changes and the surrounding shape already
exists. Match the diff to the subject: component tree, file layout, call tree,
state transition, or control flow.

```diff
 authorizePayment
   recordAttempt
+  applyIdempotencyKey
   callProvider
```

Show the whole block when most of it is new, omitted context would hide
ownership or order, or the reader needs a copyable target shape.

## Choose HTML when the answer needs a page

Use one focused HTML artifact for a visual UI, spatial layout, dense state
comparison, or explanation that needs to be durable or shareable. Give `html`
the finished content, evidence, and reading order so it can render the page
without redoing the investigation. Follow [Visual Proof](visual-proof.md) when
the result must be verified as rendered output.

When the user requests HTML or a skill routes to HTML, follow HTML's visual
explanation default. Plans begin with a useful visual overview and retain
their full steps. Reports and explainers choose diagrams proactively. The
inline-first guidance above does not suppress those views. Respect explicit
format and template constraints. Ordinary chat answers can use inline views
without creating an artifact.

Keep each visual beside the short text it supports. Use real labels and facts
from the owning skill's evidence. Include only the calls, files, props, states,
and boundaries needed to answer the question. Use several views when they
teach different parts of the answer, but do not turn the available forms into
a checklist. In chat, omit a visual when prose is clearer. In HTML, select useful visual
relationships before drafting; omit figures that would only repeat a sentence.
