# KPMG Plugin Repurpose Audit

**Date:** February 24, 2026  
**Scope audited:** `knowledge-work-plugins-main` + `financial-services-plugins-main`  
**Coverage:** 144 skills across 26 plugin families (including partner-built packs)

## 1) Portfolio-level verdict (audit of all imported plugin families)

### Recommended for KPMG-branded internal release (high fit)

- `financial-services/private-equity`
- `financial-services/financial-analysis`
- `financial-services/investment-banking`
- `financial-services/partner-built/spglobal`
- `knowledge-work/data`
- `knowledge-work/enterprise-search`
- `knowledge-work/legal`
- `knowledge-work/operations`
- `knowledge-work/finance`
- `knowledge-work/cowork-plugin-management` (as the internal customization engine)

### Keep as secondary/adjacent modules (medium fit)

- `financial-services/equity-research`
- `financial-services/partner-built/lseg`
- `knowledge-work/productivity`
- `knowledge-work/product-management`
- `knowledge-work/engineering`
- `knowledge-work/customer-support`
- `knowledge-work/partner-built/slack`
- `knowledge-work/partner-built/brand-voice`

### Deprioritize for Deal Advisory / TS launch (low fit)

- `financial-services/wealth-management`
- `knowledge-work/sales`
- `knowledge-work/marketing`
- `knowledge-work/human-resources`
- `knowledge-work/design`
- `knowledge-work/bio-research`
- `knowledge-work/partner-built/apollo`
- `knowledge-work/partner-built/common-room`

---

## 2) Priority shortlist to repurpose under KPMG brand

## Wave 1: Core due diligence and deal execution

### A) `private-equity/dd-checklist`

- **How it currently works:** Scopes deal context (sector, deal type, complexity), then generates multi-workstream DD checklists with status states and red-flag tracking.
- **What it provides:** A structured diligence tracker with financial/commercial/legal/operational/HR/IT/ESG workstreams.
- **Value to KPMG DA/TS:** Standardizes kickoff and reduces missed-request risk across concurrent engagements.
- **KPMG customization for internal release:**
  - Map to KPMG TS request-list taxonomy (QoE, NWC, debt/debt-like, tax, carve-out, one-offs).
  - Add mandatory sign-off gates by manager/director/partner.
  - Add industry modules (software ARR quality, healthcare reimbursement, industrial capex/maintenance).

### B) `private-equity/dd-meeting-prep`

- **How it currently works:** Creates meeting-specific question packs (management, expert, customer calls), plus benchmark prompts and red-flag probes.
- **What it provides:** One-page prep briefs with objectives, must-ask questions, follow-up asks.
- **Value to KPMG DA/TS:** Improves management interview quality and issue surfacing speed.
- **KPMG customization for internal release:**
  - Build KPMG question banks by workstream and sector.
  - Add linkage to diligence hypotheses and prior data-room findings.
  - Add “evidence request after call” templates for TS teams.

### C) `private-equity/deal-screening`

- **How it currently works:** Extracts facts from CIM/teaser materials and applies pass/fail criteria with bull/bear case and key questions.
- **What it provides:** A one-page screening memo.
- **Value to KPMG DA/TS:** Faster intake triage and clearer go/no-go framing for staffing and timeline risk.
- **KPMG customization for internal release:**
  - Add KPMG intake fields: independence/conflicts, timeline pressure, expected scope complexity, data quality risk.
  - Add “TS readiness score” and escalation triggers.

### D) `investment-banking/datapack-builder`

- **How it currently works:** Ingests CIMs, filings, and connected data sources; normalizes to standardized multi-tab Excel packs with traceability expectations.
- **What it provides:** IC-ready data packs and normalized financial baselines.
- **Value to KPMG DA/TS:** Speeds data-room-to-analysis conversion and reduces manual reformatting effort.
- **KPMG customization for internal release:**
  - Replace default 8-tab structure with KPMG TS workbook standard.
  - Add dedicated tabs for QoE adjustments, NWC peg, debt-like items, and EBITDA bridge.
  - Enforce citation-at-cell level for auditability.

### E) `financial-analysis/check-model`

- **How it currently works:** Performs structural/integrity/logic checks on Excel models (hardcodes, formula drift, balance checks, circular refs) and outputs issue logs.
- **What it provides:** Severity-ranked model QA reports.
- **Value to KPMG DA/TS:** Lowers model risk before client-facing output.
- **KPMG customization for internal release:**
  - Add TS-specific checks: QoE bridge tie-outs, NWC roll-forward consistency, debt schedule cross-footing.
  - Add required reviewer attestations and release criteria.

### F) `private-equity/ic-memo`

- **How it currently works:** Assembles a structured memo from diligence findings, financial analysis, deal terms, returns, and risks.
- **What it provides:** Decision-ready narrative with tables and recommendation section.
- **Value to KPMG DA/TS:** Converts analytical outputs into clear partner/client decision artifacts.
- **KPMG customization for internal release:**
  - Retemplate for KPMG deliverables: findings memo, SPA adjustment memo, steering committee update.
  - Add standard KPMG disclaimers and review checkpoints.

### G) `private-equity/portfolio-monitoring`

- **How it currently works:** Ingests periodic financial packs, compares vs budget/prior, flags RAG status, summarizes trends.
- **What it provides:** Board-ready KPI/variance summaries.
- **Value to KPMG DA/TS:** Useful for post-deal monitoring and value-creation tracking support engagements.
- **KPMG customization for internal release:**
  - Add covenant monitoring and 13-week cash triggers.
  - Add integration KPI templates for post-close TSA/separation tracking.

### H) `private-equity/unit-economics`

- **How it currently works:** Analyzes ARR cohorts, retention, LTV/CAC, margin waterfall, and benchmark thresholds.
- **What it provides:** Revenue quality analysis workbook and risk flags.
- **Value to KPMG DA/TS:** High impact for software/recurring revenue diligence.
- **KPMG customization for internal release:**
  - Align metrics with KPMG revenue-quality framework.
  - Add customer-level anomaly checks and concentration heatmaps.

### I) `private-equity/returns-analysis`

- **How it currently works:** Builds IRR/MOIC base case, sensitivities, and bull/base/bear scenarios.
- **What it provides:** Returns bridge and sensitivity exhibits.
- **Value to KPMG DA/TS:** Connects diligence findings to valuation and downside protection discussions.
- **KPMG customization for internal release:**
  - Inject QoE/NWC/debt-like adjustment scenarios from TS findings.
  - Add downside case presets by sector and leverage profile.

### J) `investment-banking/deal-tracker`

- **How it currently works:** Tracks deal stages, milestones, action items, weekly review summaries.
- **What it provides:** Engagement process-control layer.
- **Value to KPMG DA/TS:** Better multi-deal execution discipline and fewer deadline misses.
- **KPMG customization for internal release:**
  - Map milestones to KPMG TS phase gates and review points.
  - Add PBC request aging and owner accountability views.

### K) `financial-analysis/comps-analysis`

- **How it currently works:** Builds institutional comps with operating stats, valuation multiples, and statistical benchmark rows.
- **What it provides:** Structured comps workbook.
- **Value to KPMG DA/TS:** Provides external valuation context to challenge assumptions.
- **KPMG customization for internal release:**
  - Predefine approved peer sets and metric packs by subsector.
  - Add audit trail standards and source reliability tags.

### L) `financial-analysis/3-statements`

- **How it currently works:** Completes integrated 3-statement templates while preserving formulas and validating linkages.
- **What it provides:** Completed IS/BS/CF model structures with checks.
- **Value to KPMG DA/TS:** Faster base model setup for deep-dive analyses.
- **KPMG customization for internal release:**
  - Embed KPMG model shell and formatting conventions.
  - Add mandatory tie-outs for working capital, cash, and debt movements.

## Wave 2: Cross-functional accelerators for diligence quality

### M) `partner-built/spglobal/tear-sheet`

- **How it currently works:** Pulls company data via S&P/Kensho MCP and generates structured one-page/two-page company profiles.
- **What it provides:** Fast target-company snapshots.
- **Value to KPMG DA/TS:** Speeds pre-kickoff contexting and market framing.
- **KPMG customization for internal release:**
  - Apply KPMG visual identity, template structure, and approved disclaimers.
  - Include “diligence implications” section by default.

### N) `enterprise-search/search-strategy` + `enterprise-search/knowledge-synthesis`

- **How it currently works:** Decomposes user questions into source-specific searches and then deduplicates/synthesizes results with source attribution/confidence.
- **What it provides:** Cross-tool retrieval + evidence-based synthesis.
- **Value to KPMG DA/TS:** Faster retrieval of precedent analyses, internal guidance, and engagement artifacts.
- **KPMG customization for internal release:**
  - Connect to KPMG M365/Teams/SharePoint and engagement repositories.
  - Add permission-aware, client-confidentiality-safe source filtering and privilege handling.

### O) `data/data-validation`

- **How it currently works:** Applies pre-delivery QA checklist across data quality, joins, denominator logic, reasonableness, and reproducibility.
- **What it provides:** Structured analysis QA gate.
- **Value to KPMG DA/TS:** Reduces risk of factual error in client deliverables.
- **KPMG customization for internal release:**
  - Add TS-specific tie-out checklist (source docs, sample tests, reviewer initials, issue log).
  - Add required “known limitations” statement blocks.

### P) `data/sql-queries`

- **How it currently works:** Provides dialect-specific SQL best practices and performance guidance.
- **What it provides:** Faster, cleaner extraction queries.
- **Value to KPMG DA/TS:** Speeds extraction from client ERP/data warehouse exports.
- **KPMG customization for internal release:**
  - Build reusable query library for SAP/Oracle/NetSuite/Workday-style schemas.
  - Add standardized QoE and working-capital extraction packs.

### Q) `legal/contract-review`

- **How it currently works:** Reviews contract clauses against a playbook, flags deviations, and suggests redlines with severity.
- **What it provides:** Clause risk assessment and negotiation priorities.
- **Value to KPMG DA/TS:** Strengthens legal DD and supports risk translation to financial impacts.
- **KPMG customization for internal release:**
  - Add KPMG legal-DD clause taxonomy and risk-impact mapping.
  - Add jurisdiction-specific fallback language sets.

### R) `legal/legal-risk-assessment`

- **How it currently works:** Uses severity x likelihood matrix, risk score bands, and escalation guidance.
- **What it provides:** Standardized legal risk register and memo format.
- **Value to KPMG DA/TS:** Consistent issue rating across teams and deals.
- **KPMG customization for internal release:**
  - Map risk levels to KPMG red/amber/green deliverable language.
  - Add estimated valuation/cash impact ranges per risk class.

### S) `operations/compliance-tracking`

- **How it currently works:** Tracks controls, evidence, gaps, and audit readiness across frameworks.
- **What it provides:** Compliance status and remediation planning.
- **Value to KPMG DA/TS:** Useful for diligence in regulated sectors and control-heavy targets.
- **KPMG customization for internal release:**
  - Add sector-specific regulatory modules (financial services, healthcare, payments, etc.).
  - Tie controls to DD request lists and evidence trackers.

### T) `finance/variance-analysis`

- **How it currently works:** Decomposes variances (price/volume/mix and other frameworks), builds waterfall narratives and materiality-driven commentary.
- **What it provides:** Driver-level performance explanations.
- **Value to KPMG DA/TS:** Supports QoE and management challenge sessions.
- **KPMG customization for internal release:**
  - Add standard QoE bridge templates and adjustment categories.
  - Add “management question prompts” linked to each variance driver.

---

## 3) Suggested internal release sequence

1. **Release 1 (first 6-8 weeks):** A-F + O
   - Target outcome: standardized DD kickoff, model QA, data-pack creation, and memo outputs.
2. **Release 2 (next 6-8 weeks):** G-L + N
   - Target outcome: end-to-end diligence execution and process control.
3. **Release 3 (next 6-8 weeks):** M + P + Q + R + S + T
   - Target outcome: ecosystem integration, legal/compliance rigor, and broader analytical scale.

---

## 4) Practical customization principles for KPMG branding

- **Methodology first:** Replace generic playbooks with KPMG TS methodology, review gates, and output standards.
- **Risk + auditability:** Require source attribution, reviewer checkpoints, and confidence flags in every client-facing output.
- **Template discipline:** Standardize output formats (Excel/Word/PPT) to KPMG visual and content standards.
- **Connector governance:** Enforce client-segregated data access, permission boundaries, and confidentiality controls.
- **Change control:** Version every customized skill and log change rationale for quality/compliance review.

Zack Shapiro
@zackbshapiro
The Claude-Native Law Firm
How I Actually Practice Law with AI in 2026
A few months ago, the night before a client’s acquisition was set to close, the buyer’s counsel sent a letter demanding that several key deal terms be restructured. New escrow conditions. Expanded indemnification carve-outs. A revised set of closing deliverables. The implicit threat: accept these changes or we walk. It was 7 PM.
I uploaded the purchase agreement, the disclosure schedules, and the demand letter to Claude. Within minutes, Claude mapped every proposed change against the existing deal terms and found what the buyer’s lawyers apparently hadn’t noticed: two of their proposed carve-outs directly contradicted representations they had already confirmed in the disclosure schedules, and a third would have created an internal conflict with the fundamental reps section that would have actually weakened the buyer’s own post-closing protections. Their aggressive last-minute play had holes in it.
As the negotiation continued through the evening with emails going back and forth, I fed each new communication to Claude. It tracked how every proposed concession interacted with provisions across the agreement, flagged where accepting one change would create exposure in another section, and helped me build a response that conceded the points worth conceding and held firm on the ones that mattered. By 11 PM we had a clean set of counter-positions, each grounded in specific cross-references to the buyer’s own language. The deal closed the next morning on terms my client was happy with.
A team of three associates at a mid-size firm would have needed until morning to produce that analysis. I had the core of it in under two hours.
I run a two-person boutique law firm. We handle startup formation, venture capital transactions, and regulatory work. We compete against firms with hundreds and sometimes thousands of lawyers. We are not supposed to be able to do this. But the past year has made something clear: a small firm built around AI doesn’t just keep up with larger competitors. It moves faster, produces more thorough work product, and operates at a cost structure that would have been impossible 18 months ago.
The tool I’ve built my practice around is Claude, made by Anthropic. This piece is an explanation of how I actually use it, every day, for real legal work. Not the theory. The workflow.
Why Claude, Not “Legal AI”
The market is full of specialized legal AI products. Harvey, Spellbook, CoCounsel, Luminance. They all share a thesis: lawyers need AI built specifically for legal work. I’ve evaluated most of them. For a small firm practitioner, a well-configured general-purpose AI is better. It’s not close.
The specialized products are wrappers built on top of the same foundation models that power the general-purpose tools. Their marketing pitch sounds compelling: we’ll customize the AI to your firm’s playbook, train it on your templates, build workflows around your brief bank or clause library. Some of them do this reasonably well. But the pitch contains a fundamental misunderstanding of where the value actually lives.
A template library is not a competitive advantage. Every competent firm in your practice area has roughly the same templates. The NDA, the stock purchase agreement, the employment offer letter. These are commodity inputs. The thing that differentiates a great lawyer from a mediocre one was never the template. It was what the lawyer did with the template: how they spotted the issue the other side buried in Section 14(c), how they knew which indemnification fight was worth having and which to concede, how they structured the advice email so the client actually understood the risk. That is judgment. And judgment doesn’t live at the firm level. It lives at the level of the individual professional.
When legal AI companies talk about customizing AI to a firm’s playbook, they are solving a problem that barely matters and ignoring the one that does. The real leverage comes not from which template the AI starts with, but from the instructionsthat tell it how to think about the work: what to look for, what to flag, how to weigh competing considerations, what format to deliver the output in, what tone to use with the client. Those instructions encode an individual lawyer’s judgment, not a firm’s template library. And that is exactly what Claude’s skill system is built to do.
I’ve created custom instruction files, called “skills,” that encode my analytical frameworks, my preferred formats, my voice, and my judgment about how specific types of legal work should be done. When I upload a contract for review, Claude doesn’t apply a generic framework. It doesn’t even apply my firm’s framework. It applies my framework, the one I’ve developed over a decade of practice, automatically. The difference between a firm playbook and an individual lawyer’s encoded judgment is the difference between giving someone a recipe and teaching them how to cook.
There’s a more fundamental issue, and it’s the one that will matter most to anyone who has spent their career inside Microsoft Word. Claude is a frontier AI model that has been heavily optimized for writing code. That may sound irrelevant to legal practice until you realize what it means: Claude can write code, on the fly, to directly manipulate the applications lawyers already use.
Think about what this means concretely. Every lawyer reading this has lost hours to Word formatting. Paragraph numbering that breaks when you paste from another document. Styles that refuse to cooperate. Track changes that corrupt across versions. Cross-references that go stale. Bluebook citation formatting that requires manual attention on every single period and comma. These are not legal problems. They are software problems. And Claude solves software problems by writing software. When I tell Claude to apply tracked changes to a contract, it doesn’t use a plugin or a macro. It opens the .docx file at the XML level and writes the exact markup that Microsoft Word expects, attributed to my name, preserving every formatting detail. When I tell it to standardize the citation format in a brief, it writes code to parse and reformat every citation in seconds. The result is indistinguishable from expert manual work, delivered in a fraction of the time.
This is the capability gap that no specialized legal AI product can match. They give you a chatbot that talks about documents. Claude is a system that can reach inside those documents and change them. It is the difference between an associate who can tell you what’s wrong with a contract and an associate who can also fix it, format it, produce the redline, and draft the cover email, all without you opening a single application. General-purpose AI advances faster than any vertical product can keep up with. When you’re on the frontier model, every new capability ships to you on day one. When you’re on a wrapper, you’re waiting for someone else’s engineering team to decide what to build next.
I’m describing my own practice here, which is transactional. But nothing about the architecture is practice-specific. A litigator would build skills for deposition preparation, motion drafting, case law synthesis, and discovery review. A tax lawyer would build skills for entity structuring, opinion letter frameworks, and regulatory monitoring. A family lawyer would build skills for asset tracing and custody analysis. The approach is the same: take a powerful general model, teach it your practice, and let it compound your judgment. The content is yours.
Three Modes
Claude’s desktop app has three modes. Learning when to use each one was the single most important step in making this work.
Chat is the conversational interface. I talk to Claude the way I’d talk to a fast, knowledgeable associate sitting across the table. This is where I go for analyzing a legal issue, brainstorming negotiation strategy, getting a first take on a contract provision, or drafting something from scratch. I stay in control of every step. Most lawyers who have used ChatGPT or similar tools have only experienced this mode.
Coworkis the autonomous mode, and it’s the one that changes everything. I point Claude at a folder on my computer, give it a task, and it goes and does it. It reads files, creates new ones, edits existing documents, and makes its own decisions about how to get from A to B. When I have a 40-page agreement that needs a full redline, or a stack of closing documents that need to be generated from a term sheet, I hand it to Cowork and let it work. This is the mode most lawyers haven’t tried. It’s the one that will change their practice the most.
Code is the development mode. Full terminal access. Most lawyers don’t need it daily. But I have a condition that makes it hard to read long documents, so I used Code to build a command-line tool that converts legal documents into spoken audio. It handles the entire pipeline: parsing Word docs and PDFs, converting legal formatting like “Section 4.2(b)(iii)” into natural speech, expanding abbreviations, chunking the text, sending it to an AI voice API, and assembling the final audio file. I listen to contracts on my commute now. Claude built the whole thing.
Teaching Claude Your Practice
This is where the leverage becomes something I wouldn’t have believed two years ago.
Anthropic published a guide on building custom “skills” for Claude: structured instruction files that teach it how to behave in a specific context. Not a prompt you type every time. A persistent set of instructions that fires automatically when the situation calls for it. Instead of reading the guide cover to cover, I uploaded it to Claude and asked a better question: based on the hundreds of conversations we’ve had together, spanning contract drafting, client emails, document editing, legal research, and policy writing, what are the skills that would have the greatest impact on my practice?
Claude analyzed months of our work and identified the patterns: which tasks I repeated most, where the friction was highest, where structured automation could save the most time. The skills it recommended weren’t generic. They were specific to how I actually work. Not “draft contracts faster” but “a contract review skill with four distinct modes depending on context, severity ratings, a missing-provisions checklist, market-term benchmarking, and a seamless handoff to a tracked-changes editing skill when you’re ready to mark up the document.”
We refined the details over a couple hours. I pushed back where the defaults didn’t match my preferences. By the end I had six production-ready skills bundled into a single plugin for the Cowork desktop app: contract review, tracked changes editing, contract drafting, client communications, legal research, and policy writing. Each one encodes years of accumulated professional judgment about how I approach that type of work.
The implication that matters for firm management: the plugin is transferable. If I had 50 associates, I could install it on every machine. Every associate would immediately produce contract reviews using my analytical framework, draft communications in my voice, and apply tracked changes in my preferred format. Knowledge that takes years of mentorship to transmit is now an instruction file that works from the first draft. The output still requires attorney review, but the review starts from a much higher baseline.
What This Looks Like in Practice
Three examples from real work, because I want this to be concrete.
Tracked changes without opening Word. A counterparty sends back a redlined agreement. Forty pages of changes across representations, indemnification, IP, and closing conditions. I upload the document to Claude and say: “Help me evaluate the counterparty’s changes from my client’s perspective.” My contract review skill fires. Claude organizes every change by severity, flags where the counterparty shifted risk, identifies tensions between modified provisions, checks for standard provisions that should be present but aren’t, and produces a summary with specific counter-language for each issue.
Then I apply my judgment. Claude flagged a pattern in the markup. I know from experience what that pattern usually signals. Claude generated three alternative formulations for a disputed clause. I pick the one that accounts for relationship dynamics and deal context that no AI has access to. Once I’ve made my decisions, I tell Claude to apply the edits. This is the part that drops jaws the first time you see it. Claude opens the Word document at the XML level, applies tracked changes attributed to my name, preserves every formatting detail, and produces a clean .docx with real tracked changes that opposing counsel can open in Microsoft Word and review normally. I don’t open Word. I don’t open Litera. Claude produces the redline. I review every change, and I send it. Then the client communications skill drafts the cover email in the right tone. Total time from receiving the markup to having a response package ready to send: under an hour, of which about 30 minutes is my own thinking.
Research without hallucinations. A client needs to understand the regulatory landscape for a new product. The question spans multiple agencies and overlapping statutory frameworks. My research skill instructs Claude to launch parallel research across every relevant angle simultaneously rather than working through them sequentially: the securities analysis, the state licensing requirements, the banking regulations, the consumer protection implications. It runs multiple searches per sub-topic, cross-references sources, and prioritizes primary authority (statutes, regulations, agency guidance, case law) over secondary commentary.
Before delivering anything to me, the skill requires Claude to run a self-review. This is critical, and it’s the part most people skip. Claude must verify that every cited authority actually says what the memo claims. It must flag anything where its confidence is below high. It must check for internal contradictions across sections. And it must specifically guard against hallucinated citations, the problem that got several lawyers sanctioned and made national news. The lawyers who submitted fake AI-generated citations were using tools without this kind of verification layer. The problem was never AI itself. It was AI without quality control.
The output is a structured research memo, with a bottom-line-up-front summary, specific statutory citations, and practical recommendations, that would take a junior associate days to produce. Claude delivers a first draft in under an hour. I then review every citation, stress-test the analysis, and revise where my judgment diverges from the output. The total time is still a fraction of what it would take starting from scratch. And because the skill is calibrated to my standards (confident conclusions with explicit uncertainty flags, tables for comparing regulatory frameworks, practical recommendations rather than academic hedging), the memo is useful immediately.
Real-time contract interpretation. A client called mid-morning to say they had just received a demand letter from a counterparty claiming breach of a commercial services agreement and threatening termination. The client had 48 hours to respond. I uploaded the agreement, the demand letter, and the client’s last three months of correspondence with the counterparty. Claude mapped every factual allegation in the demand letter against the specific contract provisions cited, and found that two of the four claimed breaches referenced obligations that had been expressly modified by a side letter the counterparty’s own counsel had drafted. The demand letter appeared to have been written without checking their own amendments. As I prepared the response, I ran each draft paragraph through Claude to pressure-test whether any of my arguments had unintended implications for other provisions in the agreement. It caught one: a defense I was planning to raise on the service-level metrics could have been read to concede a point on the payment dispute in Section 7. I rewrote the response. That kind of real-time, provision-by-provision stress-testing while actively drafting is something that used to require a second lawyer reviewing your work. Now it happens in the same conversation where the work gets done.
The Privilege Question
Every lawyer asks. The short answer: the same framework that lets you use cloud storage, e-discovery platforms, and online legal research databases applies here. ABA guidance and state bar ethics opinions treat AI tools as third-party technology providers covered by the agent/instrumentality exception. Your obligations are to make reasonable efforts to protect client data, which in practice means turning off model training on your inputs, understanding the provider’s data handling practices, and documenting your reasoning. Anthropic offers a zero-data-retention API option and business data processing agreements, so that none of your client data is used to train models, and inputs are not stored beyond the session. The same diligence you performed before putting client documents in Dropbox, Google Drive, or Clio.
I went a step further. I had Claude help me draft an AI usage provision for my engagement letters. The provision frames AI as an efficiency and quality enhancer, emphasizes attorney supervision, ties data handling to existing confidentiality obligations, and secures client consent. Clients sign it without blinking. Most of them assume I’m already using AI. They’re right.
The ethics rules now require technology competence in most jurisdictions. We are approaching the point where not using these tools is the harder professional responsibility position to defend.
The Prompt Is the Skill
Most lawyers who try AI write something like “review this contract” and get back something mediocre. Then they decide AI isn’t useful for legal work.
The problem is not the AI. The problem is the input.
Compare “review this contract” with “review this services agreement from the vendor’s perspective. Flag provisions where the customer shifted risk beyond market norms for this type of deal. Check for missing provisions that should be present, including limitation of liability, IP ownership, data handling, and termination for convenience. Produce a severity-rated summary with specific counter-language for each high-severity issue. Note that the vendor has limited negotiating leverage and wants to close the deal, so recommendations should focus on provisions worth fighting for versus provisions to concede gracefully.”
The second version produces work product that is useful on the first pass. The first produces work product that requires extensive revision, if it’s useful at all. The entire gap between “AI is a toy” and “AI changed my practice” lives in the quality of your instructions. This is why skills matter: they encode that level of detail so you write it once and it fires every time.
What This Changes
A few things follow from all of this that are worth naming.
Staffing.I run a two-person firm that handles the workload of a much larger practice. That is a direct function of AI. The work that traditionally justified an associate hire, first-pass document review, research memos, initial drafts, redline summaries, routine correspondence, is now handled by Claude under my supervision. To be clear: every document that leaves my firm has been reviewed, revised, and approved by a licensed attorney. AI produces the first pass. I produce the final work product. Associates are not obsolete. But the bar for when hiring one makes economic sense has moved. And what you need them to do has changed: judgment, client relationships, and AI output supervision, not 2,000 hours of document production.
Billing.AI changes the value equation. For some tasks, the time savings are obvious and I pass them on to clients. For others, the same hours produce dramatically deeper analysis, more comprehensive issue-spotting, and higher-quality drafting than would have been possible before. The point is not that every task takes less time. It is that every hour of attorney time produces more value. My firm offers subscription pricing alongside traditional hourly billing, depending on the engagement. The subscription clients get ongoing advisory, contract review, compliance monitoring, and routine governance for a flat monthly fee. No meter running. AI makes this model work, because I can deliver more comprehensive service within a predictable fee structure. Clients love it: they’re not afraid to pick up the phone or send an email. And the revenue is predictable instead of lumpy.
Judgment.Everything I’ve described creates a temptation to let the AI do too much. To stop checking. The research on this is consistent: people who use AI outside its competence, or who trust it without interrogating the output, perform worse than people who don’t use AI at all. The lawyers who will win with this technology understand at a foundational level that the AI is not practicing law. You are practicing law. The AI makes you faster, more thorough, and more consistent. But the judgment, the part where you decide what to fight for and what to concede, where you read between the lines, where you make a call that could go either way and stake your reputation on it, that is yours. Experienced lawyers have an enormous advantage in this new world, and most of them don’t realize it. If you’ve spent 10 or 20 years developing judgment in your practice area, you are sitting on exactly the asset that AI makes more valuable, not less.
Go Build
I don’t work for Anthropic. I’m a practicing lawyer who tried every AI tool available and built my practice around the one that worked best for how I actually work.
The gap between how most lawyers use AI (typing a question into a chatbot and hoping for the best) and what I’ve described here is enormous. Closing that gap doesn’t require technical skill. It requires investing a few hours in learning how the tool actually works: the difference between Chat and Cowork, why long detailed prompts produce dramatically better results than short ones, how to build a skill that encodes your judgment, how to bundle skills into a plugin that any colleague can use.
Download the desktop app. Pick the task you do most often. Write a prompt that describes, in detail, exactly how you want it done. See what comes back. Then build your first skill. The returns compound fast.
