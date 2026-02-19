# Summary of Significant Accounting Policies

**{{company.name}}**

---

## Basis of Presentation

These financial statements have been prepared in accordance with accounting principles generally accepted in the United States of America (US GAAP) on an accrual basis.

---

## Revenue Recognition

{% if industry == "saas" %}
### Software-as-a-Service Revenue

The Company recognizes revenue from subscription services ratably over the subscription term, beginning when the service is made available to the customer. Subscription periods typically range from monthly to annual terms.

**Performance Obligations:**
- Access to the software platform
- Customer support
- Software updates and maintenance

**Timing of Recognition:**
- Subscription revenue: Recognized ratably over the contract term
- Professional services: Recognized as services are performed
- Setup/implementation fees: Recognized over the expected customer relationship period

**Deferred Revenue:**
Amounts billed in advance of services are recorded as deferred revenue and recognized as revenue over the service period.

{% elif industry == "construction" %}
### Construction Contract Revenue

The Company recognizes revenue from construction contracts using the percentage-of-completion method, measured by the ratio of costs incurred to date to total estimated costs.

**Contract Types:**
- Fixed-price contracts: Revenue recognized based on percentage of completion
- Cost-plus contracts: Revenue recognized as costs are incurred plus applicable markup
- Time and materials: Revenue recognized as work is performed

**Change Orders:**
Change orders are included in contract revenue when it is probable that the change order will be approved and the amount can be reasonably estimated.

**Contract Losses:**
Provisions for estimated losses on contracts are recognized in full when identified.

{% elif industry == "manufacturing" %}
### Product Sales Revenue

The Company recognizes revenue from product sales when control of the goods transfers to the customer, which typically occurs upon shipment or delivery depending on contract terms.

**Performance Obligations:**
- Product delivery
- Standard warranty (included in sale)
- Extended warranty (if applicable, recognized over warranty period)

**Shipping Terms:**
- FOB Shipping Point: Revenue recognized upon shipment
- FOB Destination: Revenue recognized upon delivery

**Returns and Allowances:**
A provision for estimated returns is recorded based on historical experience.

{% elif industry == "professional_services" %}
### Professional Services Revenue

The Company recognizes revenue from professional services as the services are rendered, using the following methods based on contract type:

**Time and Materials Engagements:**
Revenue is recognized as hours are incurred at the applicable billing rate.

**Fixed-Fee Engagements:**
Revenue is recognized proportionally as work is performed, typically based on labor hours incurred.

**Retainer Arrangements:**
Retainer fees are recognized ratably over the period covered by the retainer.

**Unbilled Work-in-Progress:**
Work performed but not yet billed is recorded as unbilled receivables (WIP).

{% elif industry == "retail" %}
### Retail Sales Revenue

The Company recognizes revenue from retail sales at the point of sale when payment is received and the customer takes possession of the merchandise.

**Gift Cards:**
Gift card sales are recorded as a liability and recognized as revenue when redeemed. Gift card breakage is estimated and recognized over the expected redemption period.

**Returns:**
A provision for estimated returns is recorded based on historical experience and current trends.

**Loyalty Programs:**
Customer loyalty points are recorded as deferred revenue and recognized when redeemed.

{% endif %}

---

## Cost of Goods Sold / Cost of Services

{% if industry == "saas" %}
Cost of revenue includes hosting and infrastructure costs, customer support personnel, and third-party software costs directly related to providing the service.
{% elif industry == "construction" %}
Cost of revenue includes direct labor, subcontractor costs, materials, equipment costs, and allocable project overhead.
{% elif industry == "manufacturing" %}
Cost of goods sold includes raw materials, direct labor, manufacturing overhead, and freight costs.
{% elif industry == "professional_services" %}
Cost of services includes professional staff compensation, subcontractor costs, and direct engagement expenses.
{% elif industry == "retail" %}
Cost of goods sold includes the cost of merchandise, freight-in, and inventory shrinkage.
{% endif %}

---

## Accounts Receivable

Accounts receivable are stated at the amount management expects to collect. An allowance for doubtful accounts is maintained based on historical collection experience and assessment of specific accounts.

---

## Inventory

{% if industry in ["manufacturing", "retail"] %}
Inventory is stated at the lower of cost or net realizable value using the [FIFO/weighted average] method.

**Inventory Components:**
{% if industry == "manufacturing" %}
- Raw materials
- Work-in-process
- Finished goods
{% elif industry == "retail" %}
- Merchandise inventory
{% endif %}

A reserve for slow-moving and obsolete inventory is maintained based on historical sales trends and management assessment.
{% else %}
Not applicable to the Company's business model.
{% endif %}

---

## Property and Equipment

Property and equipment are stated at cost less accumulated depreciation. Depreciation is computed using the straight-line method over the estimated useful lives of the assets:

| Asset Category | Useful Life |
|---------------|-------------|
| Buildings | 39 years |
| Leasehold improvements | Lesser of lease term or useful life |
| Furniture and fixtures | 5-7 years |
| Machinery and equipment | 5-10 years |
| Computer equipment | 3-5 years |
| Vehicles | 5 years |

Maintenance and repairs are expensed as incurred.

---

## Leases

The Company accounts for leases in accordance with ASC 842. Operating lease right-of-use assets and liabilities are recognized at lease commencement based on the present value of lease payments over the lease term.

---

## Income Taxes

The Company accounts for income taxes using the asset and liability method. Deferred tax assets and liabilities are recognized for the expected future tax consequences of temporary differences between financial statement and tax bases.

---

## Use of Estimates

The preparation of financial statements requires management to make estimates and assumptions that affect reported amounts. Significant estimates include:
- Allowance for doubtful accounts
- Inventory obsolescence reserves
- Useful lives of property and equipment
- Revenue recognition (percentage of completion)
- Accrued liabilities

---

## Fiscal Year

The Company's fiscal year ends on {{financials.fiscal_year_end}}.

---

*This template should be customized based on industry and specific company practices.*
