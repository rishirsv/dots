# KPMG Slides Workspace Agent Post-Launch Evidence Ledger

Status: Master research ledger for hand-written postmortem memo.

Prepared: 24 June 2026.

Purpose: Consolidate the post-launch postmortem research into one evidence-first file. This is not a memo draft. It is a structured research base for writing a separate narrative.

## How To Use This Ledger

- Use this file as the single active research and evidence artifact.
- The only companion files in this folder are the two original raw source files.
- Extracted Teams, Outlook, and transcript evidence is embedded in the appendices below.
- Treat conclusions below as research hypotheses supported by evidence, not final memo language.
- Keep source-specific detail here rather than in the memo body.

## Source Inventory

| Source ID | Location | Type | Contents | Notes |
|---|---|---|---|---|
| S1 | `Holy_Grail_KPMG_Slides_Detailed_Conversation_Record.txt`; embedded in this file, Appendix A | Consolidated Outlook/Teams search record | Approval threads, risk/privacy/security review, UAT, launch enablement, access, stakeholder messages, source index. | Search-derived record, not complete legal archive. |
| S2 | `Holg rail discussion.docx` | Meeting transcript | June 18 rebuild/publishing meeting. | Automated transcript; line references below use extracted text. |
| S3 | This file, Appendix C | Extracted transcript text | Plain-text export of S2 with numbered lines. | Embedded in this ledger for single-file use. |
| S4 | This file, Appendix B | Teams chat extract | WA Task Force conversation: access failures, build book, UAT sign-off, production builder access request, product-manager visibility. | Connector output did not expose per-message timestamps. |
| S5 | This file | Prior source notes | Earlier source-area notes and evidence limitations. | Prior working notes were consolidated here; old drafts were deleted during folder cleanup. |
| S6 | External best-practice sources | Public guidance | OpenAI, Anthropic, NIST, ISO, OWASP sources used as operating-context anchors. | Context only; not binding KPMG policy. |
| S7 | This file, Appendix D | Teams chat/channel extract | Newer post-launch Teams evidence from 19 June onward: launch availability, WA Task Force, UAT updates, feedback-form access, risk terminology, source/provenance, agent-task permissions. | Embedded in this ledger; search-derived; WA Task Force transcript lacks per-line timestamps. |
| S8 | This file, Appendix E | Outlook email extract | Newer Outlook evidence from 19 June onward: enterprise launch announcement, practice-specific follow-up, build documentation, updated documentation, final UAT confirmation. | Embedded in this ledger; attachments confirmed but not downloaded by connector. |
| S9 | `../kpmg-slides-v2-current-review/teams-knights-enrichment-notes.md`; summarized in Appendix F | Teams chat extract | Knights of the Round Table scoped Teams pass: risk-framing debate, production access wait, launched-version archive, Risk/Security education, Security rebuild call, build-book/support requirement, repo/source-of-truth risk, quality follow-ups. | Connector exposed chat fetch and scoped search, not raw paginated full-history export; older entries include message IDs for reopen. |

## Research Themes

| Theme | Working Finding | Confidence | Primary Sources |
|---|---|---:|---|
| Risk framing | The project appears to have been framed too broadly as platform/privacy risk instead of being separated into AI-risk approval and operational release readiness. | Medium-high | S1, S2/S3, S6 |
| Approval condition | The control condition that ITS own publishing while Business builds became the central operating constraint. | High | S1 |
| Publishing/rebuild | The approved control model did not match Workspace Agent mechanics because the live agent had to be rebuilt manually, not deployed from GitHub. | High | S2/S3 |
| Access | Representative access was not proven before launch; users outside the initial UAT group could not access or see Agents. | High | S1, S4 |
| UAT gate | UAT sign-off was used as a deployment gate, but it did not prove operational release readiness. | High | S1, S4 |
| Build book | The build book was needed to execute the approved publishing model but was clarified after launch pressure had already surfaced. | High | S2/S3, S4 |
| Product ownership | Product-manager visibility into release forums was inconsistent; full invite revision history remains unverified. | Medium | S1, S4, S5 |
| Launch communications | KPMG Slides was broadly launched on 22 June 2026 as a ChatGPT Enterprise Workspace Agent, with training, feedback, cost, and responsible-use links included in communications. | High | S7, S8 |
| Post-launch operations | Newer conversations show unresolved operating questions after launch, including feedback-form collaboration access, agent-task permissions, workspace configuration, source/provenance, and future agent intake/publishing process. | High | S7, S8 |
| Governance model | Future releases need a lighter process for low-delta internal agents and stricter process only where the actual delta warrants it. | Medium-high | S1, S4, S6 |

## Claim-Level Evidence Map

| ID | Claim / Fact | Evidence | Confidence | Memo Use |
|---|---|---|---:|---|
| E001 | KPMG Slides was developed under the stealth working title Holy Grail. | S1 lines 17, 214, 650. | High | Naming/chronology only. |
| E002 | The formal security approval described the agent as operating inside ChatGPT Enterprise with constrained scope and no external systems, connectors, plugins, or external GPTs. | S1 lines 154-160, 588-596, 661-662. | High | Risk classification. |
| E003 | The solution was assessed as medium residual risk primarily due to reliance on third-party LLM processing. | S1 lines 154-160, 588-596. | High | Risk classification. |
| E004 | CISO/security approval was granted for firm-wide ChatGPT Enterprise users. | S1 lines 154-168, 557-565. | High | Approval chain. |
| E005 | The approval condition required ITS admin to own publishing while Business would build. | S1 lines 164-166, 562-565. | High | Core control model. |
| E006 | Privacy was comfortable that a separate PIA was not needed for the Holy Grail Workspace Agent. | S1 lines 194-204, 616-624. | High | Privacy context. |
| E007 | Privacy noted the rollout was closer to the privacy-compliance line because Workspace itself had not already been reviewed. | S1 lines 204, 668. | High | Caveat/risk nuance. |
| E008 | Risk review required clarification of platform terminology and scope. | S1 lines 210-216, 659. | High | Governance comprehension gap. |
| E009 | Anthony stated that Risk thought "Workspace" was its own platform, creating excessive review friction. | S1 lines 226-244, 659. | High | Terminology issue. |
| E010 | OpenAI clarified that KPMG owns governance, review, code, permissions, and behavior for deployed agents/skills. | S1 lines 85-101. | High | Ownership/accountability. |
| E011 | Governance material identified risks that later surfaced: lifecycle, availability/continuity, deployment/recovery, sharing/access. | S1 lines 107-129. | High | Missed launch gates. |
| E012 | Business-side admin/builder access was raised because beta iteration and maintenance would otherwise be too slow. | S1 lines 250-266. | High | Operating model tension. |
| E013 | UAT sign-off was sent on 18 June for KPMG Slides Beta. | S1 lines 293-300. | High | UAT evidence. |
| E014 | UAT was described as product testing: make decks, ask for images, reimagine slides, try modes, check for major errors. | S1 lines 282-286. | High | UAT scope. |
| E015 | Security was described as wanting approved UAT sign-off rather than evaluating product behavior directly. | S1 lines 284-286, 670-671. | Medium-high | UAT/release readiness distinction. |
| E016 | Access still failed after workspace-level enablement was confirmed. | S1 lines 306-318, 552; S4 Evidence Summary. | High | Access launch gate failure. |
| E017 | Users outside the initial UAT group could not see Agents or access the shared agent. | S4 Evidence Summary and extracted transcript. | High | Access launch gate failure. |
| E018 | The June 18 meeting established that ITS would need to rebuild the agent from scratch to publish/share under the approved model. | S3 lines 13-21, 55-56. | High | Publishing/rebuild issue. |
| E019 | The team had an unresolved assumption that GitHub access meant rapid Workspace Agent redeployability. | S3 lines 29-35, 56, 70-85, 82-94. | High | Source-to-agent provenance. |
| E020 | Kev did not have confirmed GitHub/repo access when the rebuild issue surfaced. | S3 lines 70-75; S1 lines 544-552. | High | Operational readiness. |
| E021 | The Workspace Agent was not directly connected to GitHub; source components had to be manually uploaded and assembled. | S3 lines 82-94. | High | Publishing/rebuild mechanics. |
| E022 | A rebuild book was required for someone else to rebuild the production agent. | S3 lines 85-92, 191-192; S4 build-book guidance. | High | Documentation/control maturity. |
| E023 | Duplicate/restore did not work reliably during the launch call. | S3 lines 108-110, 204-214. | High | Rollback/recovery gap. |
| E024 | Manual rebuild required seven skill folders, an instruction markdown file, files/fonts, and manual retagging of skill references. | S3 lines 219-261, 320-326. | High | Manual release fragility. |
| E025 | One skill upload failed or timed out during the live rebuild attempt. | S3 lines 262-269, 290-295, 330-334. | High | Runtime/package fragility. |
| E026 | Training/launch timing overlapped with unresolved rebuild work. | S3 lines 117-119, 327-330; S1 lines 326-334. | High | Go-live decision pressure. |
| E027 | The WA Task Force process still required UAT sign-off email and build book before deployment. | S4 transcript entries from Andrew Cain and Harris Ghafoor. | High | Release evidence gap. |
| E028 | The build-book content was clarified after launch pressure had surfaced. | S4 Harris Ghafoor build documentation guidance. | High | Documentation timing. |
| E029 | A request was made to grant Raj production builder access for testing only, not publishing or sharing. | S4 Zack Mindel and Scott Shannon entries. | High | Business/ITS permission model unresolved. |
| E030 | Scott noted small-audience Workspace Agents may need a lighter process similar to Custom GPTs. | S4 Scott Shannon entry. | High | Future governance model. |
| E031 | Rishi Sharma reported that issues had been warned about and could have been avoided if he had not been taken off calls. | S5 Product Manager Exclusion; S1 lines 352-356; S4 shows later addition to chat. | Medium | Product ownership/process issue. |
| E032 | Rishi was later added to WA Task Force "to keep him in the loop." | S4 final entries. | High | Product ownership/process issue. |
| E033 | Full invite revision history for product-manager removal was not available through connector evidence. | S5 Product Manager Exclusion. | High | Evidence limitation. |
| E034 | KPMG Slides (Beta) was broadly announced to the ChatGPT user group on 22 June 2026 as a new agent in ChatGPT Enterprise. | S8 enterprise launch announcement. | High | Launch chronology. |
| E035 | The launch communication positioned KPMG Slides as available "as of today" and directed users to browse Agents in ChatGPT and select KPMG Slides under the KPMG CA directory tab. | S8 enterprise launch announcement. | High | Launch/access context. |
| E036 | The launch communication listed capabilities covering deck creation, structure, narrative articulation, refinement, reimagination, and image-to-editable-PowerPoint conversion. | S8 enterprise launch announcement. | High | Scope and user expectation. |
| E037 | The launch communication included feedback-form, training-material, risk-guideline, cost, and responsible-use language. | S8 enterprise launch announcement. | High | Communications/readiness context. |
| E038 | On 22 June 2026, the CA ChatGPT Enterprise Community posted a Teams training recap saying KPMG Slides was "now available" within ChatGPT Enterprise and linking training, FAQ, and resources. | S7 CA ChatGPT Enterprise Community extract. | High | Launch/training chronology. |
| E039 | Practice-specific users immediately asked whether additional TS-specific training was needed and whether the agent aligned to TS/FDD templates. | S8 follow-up thread. | High | Adoption and enablement gap. |
| E040 | Build documentation was sent to IT/security stakeholders on 19 June 2026 and updated later the same day. | S8 build documentation emails. | High | Documentation timing/versioning. |
| E041 | Final UAT confirmation was supplemented on 22 June 2026 with attached build documentation and a UAT tester list. | S8 Holy Grail UAT Approval email. | High | UAT/package chronology. |
| E042 | UAT testers were told on 19 June 2026 that KPMG Slides had been updated, including workflow, resume behavior, image-to-PowerPoint routing, visual generation, and packaged brand reference changes. | S7 UAT Testing extract. | High | Post-UAT product changes. |
| E043 | The feedback form collaboration link still required explicit user sharing on launch day. | S7 direct-chat feedback-form extract. | High | Feedback intake readiness. |
| E044 | Risk terminology confusion has additional Teams support: Anthony Hui wrote that Risk thought Workspace Agent was a different platform, making assessment more complex. | S7 risk terminology extract. | High | Risk classification. |
| E045 | Post-launch Teams discussion recorded immediate demand for future agents and concern that the intake/build process was backwards because people needed access before proving viability. | S7 WA Task Force extract. | High | Governance/process design. |
| E046 | On 22 June 2026, Rishi Sharma asked for all off-repo changes to be integrated into the repo and for separate management of the Workspace Agent and Codex plugin before marking v1 released on GitHub. | S7 Knights of the Round Table extract. | High | Source-of-truth/release provenance. |
| E047 | On 23 June 2026, WA Task Force discussion identified insufficient permissions around KPMG Slides scheduled agent tasks and raised cost/configuration concerns for recurring automations. | S7 WA Task Force extract. | High | Post-launch configuration/support. |
| E048 | On 9 June 2026, Knights chat participants framed the agent's risk delta as ownership and Workspace Agent controls rather than external-system exposure, because the agent did not connect to external systems. | S9 message IDs 1781013820801, 1781013945682. | Medium-high | Risk classification. |
| E049 | Jacques was described in the Knights chat as supporting the low-risk interpretation. | S9 message ID 1781014183897. | Medium | Risk classification; corroborating context only. |
| E050 | On 15 June 2026, Zack Mindel was still waiting for Security to provide production access to make the agent. | S9 message ID 1781558063067. | High | Production readiness. |
| E051 | On 17 June 2026, Zack asked for a ZIP/archive of the launched version after merge so it could be stored for Security and Risk. | S9 message ID 1781708541255. | High | Release provenance. |
| E052 | On 17 June 2026, Zack said he told Anthony that Risk and Security needed significant education on Workspace Agents. | S9 message ID 1781708968528. | High | Governance comprehension gap. |
| E053 | On 18 June 2026, Zack said he and Raj had spent three hours on the phone with Security trying to help set up the Workspace Agent so it could be released under Security's name rather than Zack's. | S9 message IDs 1781817766664, 1781817791603, 1781817806524. | High | Publishing/rebuild issue. |
| E054 | On 19 June 2026, Zack said the build documentation should satisfy the build-book requirement and allow Risk/Security or support teams to understand what was built and how to maintain it. | S9 message ID 1781840859284. | High | Build book/support readiness. |
| E055 | On 19 June 2026, Rishi asked the team to send all comms with IT, Risk, Security, or anyone who touched KPMG Slides in text files; Zack then shared the conversation record and warned to quote carefully because it included personal chats with Anthony and Scott. | S9 message IDs 1781879388991, 1781880619600. | High | Evidence-collection provenance. |
| E056 | On 19 June 2026, Raj said Kev had been added to the repo, Harris did not have Git, and this created a risk that the agent host could not pull the latest agent version. | S9 message ID 1781884275637. | High | Source-of-truth/release provenance. |
| E057 | On 19 June 2026, Rishi stated that the initial risk premise was incorrect because there was no incremental risk compared with GPTs and Skills; Raj agreed. | S9 message IDs 1781887528744, 1781887575395. | Medium-high | Risk classification. |
| E058 | On 19 June 2026, the team identified quality follow-ups: redesign the sparse four-point-summary layout and get a French speaker to validate French slides. | S9 message IDs 1781881578420, 1781905893875. | High | Product quality/readiness. |
| E059 | On 22 June 2026, Rishi connected scheduled tasks with KPMG Slides and separately noted that KPMG Slides was working. | S9 message IDs 1782153901922, 1782154313141. | Medium | Post-launch capability/adoption signal. |

## Detailed Research By Theme

### 1. Risk Framing And Classification

#### What The Evidence Shows

The approval record framed the agent as a constrained ChatGPT Enterprise use case. The security request emphasized:

- operation inside ChatGPT Enterprise;
- constrained scope;
- predefined skills and KPMG templates;
- no external systems, connectors, plugins, or external GPTs;
- strict role-based access restrictions;
- single-builder model and consumer-only access;
- non-sensitive inputs;
- medium residual risk due primarily to third-party LLM processing.

Privacy relied on a similar basis: the agent did not introduce additional sub-processors, data locations, connectors, external GPTs, plugins, or data sources beyond the existing ChatGPT Enterprise environment. Privacy still noted that the rollout was closer to the line than preferred because Workspace itself had not already been reviewed.

The record also shows terminology confusion. Risk appears to have needed clarification that "Workspace" was not a separate platform in the way it was initially understood, but rather Workspace Agents inside the ChatGPT Enterprise context.

#### Research Interpretation

The evidence supports a distinction between AI/platform risk and operational-release risk. The record does not show a major incremental connector/data-source risk. It does show material operational risks: source-to-agent handoff, publishing authority, rebuild, access, rollback, monitoring, and support.

#### Writer Notes

Use this theme to argue that the process should start with the delta from existing GPTs/Skills/ChatGPT Enterprise controls. Avoid saying "risk did nothing"; the record shows Risk, Security, Privacy, and business stakeholders did engage. The issue is that the controls did not match the operational failure mode.

### 2. Approval Condition And Operating Model

#### What The Evidence Shows

Security approval was forwarded with a condition: ITS admin would own publishing while Business would build. This became the central control model.

Before launch, the team discussed the need for business-side builder/admin access because the product was in beta and would need quick updates based on user feedback. The IT/Security model separated builder/dev ability from production publishing. Harris described a path where business could make updates as builder/dev, then inform ITS and provide the updated agent for ITS to share with users.

#### Research Interpretation

The condition was understandable as segregation of duties. It reduced one risk: uncontrolled production publishing by business users. It created another risk: the approved publisher had to be able to recreate or publish the same artifact the business built. That second risk was not proven.

#### Writer Notes

This is the cleanest way to avoid finger-pointing: the control was sensible in abstract but untested in practice.

### 3. Publishing, Rebuild, And Source-To-Agent Provenance

#### What The Evidence Shows

The June 18 rebuild meeting is the strongest source for the release-model failure.

Key facts:

- The team understood that for ITS to publish/share the agent under the approved model, Kev or Harris would need to rebuild the agent.
- There had been an assumption or impression that GitHub access could allow rapid redeployment.
- Zack clarified that GitHub was not connected to the Workspace Agent. GitHub held components; the Workspace Agent was isolated.
- Rebuild required manual upload and configuration.
- Duplicate did not work reliably.
- Kev lacked confirmed repo access when the issue surfaced.
- Live rebuild involved seven skills, an instruction markdown file, files/fonts, skill upload, file upload, and manual retagging.
- One upload failed or timed out.
- Training timing overlapped with the rebuild effort.

#### Research Interpretation

The approved publishing control failed because there was no reproducible production artifact. A repository is not enough if the live system cannot deploy from it. A build book is not enough unless it has been tested by the operating team.

#### Writer Notes

This is the technical heart of the postmortem. Keep the main memo high-level, then refer to Appendix/ledger for mechanics.

### 4. Access Enablement

#### What The Evidence Shows

Access failed in multiple ways:

- Workspace-level "Enable Agents" was confirmed, but some users still could not access the agent.
- Users outside the initial UAT group could not see Agents in ChatGPT.
- Owner/UAT-group users could access things ordinary users could not.
- Kev added all shared-with users to the UAT group as a workaround and asked the team to retest.
- Retesting was not immediately complete.

#### Research Interpretation

Access should have been a separate launch gate with representative non-owner users. Access was not simply an IT toggle; it was part of the product experience.

#### Writer Notes

Use "representative access" language. Avoid overstating root cause if the record does not prove exactly which permission failed.

### 5. UAT Versus Release Readiness

#### What The Evidence Shows

UAT focused on whether selected testers could use the agent and whether there were major product errors. UAT sign-off was then used as a deployment gate. At the same time, access, rebuild, build book, and production builder-access questions were still active.

#### Research Interpretation

UAT was necessary but not sufficient. It validated product usefulness for selected testers; it did not validate launch readiness.

#### Writer Notes

Separate:

- product UAT;
- operational release readiness;
- go/no-go decision.

### 6. Build Book And Operational Support

#### What The Evidence Shows

The build book was treated as a Risk/Security requirement and later clarified in detail. Required content included:

- overview;
- audience;
- step-by-step build/configuration instructions;
- assets;
- ownership/contact details;
- support model;
- go-live/support notes;
- UAT sign-off;
- testers/scenarios;
- known issues/limitations;
- screenshots where helpful;
- AI Use Case ID;
- GitHub repo link;
- repo access for IT operators.

#### Research Interpretation

For this product, the build book was not documentation after the fact. It was the operational bridge between the source package and the live agent.

#### Writer Notes

Use this point to argue that build documentation should be a launch artifact and tested evidence gate.

### 7. Product Ownership And Forum Visibility

#### What The Evidence Shows

The evidence supports that product-owner visibility was a real issue but has a limitation:

- Rishi Sharma was the KPMG Slides product manager.
- A training/prep thread questioned whether Rishi needed to be included.
- Rishi later stated issues could have been avoided if he had not been taken off calls.
- Raj later added Rishi to the WA Task Force to keep him in the loop.
- Full invite revision history was not available through the connector evidence.

#### Research Interpretation

The safest factual framing is not "every removal event is proven." The supported framing is: product ownership visibility was inconsistent, the product manager reported being removed from calls, and later chat behavior suggests the team recognized a need to restore visibility.

#### Writer Notes

Use careful wording. This is a governance issue, not a personal accusation. The recommendation is that product owner/product manager attendance should be required for release-readiness, IT coordination, and risk forums.

### 8. Post-Launch Communications And Operating Issues

#### What The Evidence Shows

Newer Outlook and Teams evidence confirms that KPMG Slides was broadly launched on 22 June 2026.

The enterprise launch email described KPMG Slides as a new ChatGPT Enterprise agent available to the ChatGPT user group. It positioned the beta as available "as of today," described the agent's deck-generation and slide-conversion capabilities, linked a feedback form, provided cost guidance, and included responsible-use language. A Teams post in the CA ChatGPT Enterprise Community also described KPMG Slides as "now available" and linked training, FAQ, and resource materials from the 18 June training session.

The same post-launch window shows unresolved operating questions:

- practice-specific users immediately asked whether TS-specific training was needed and whether the tool aligned to TS/FDD templates;
- the feedback form collaboration link required explicit user sharing;
- UAT testers were told the agent had been updated on 19 June, including workflow, resume, routing, visual-generation, and brand-reference packaging changes;
- build documentation was sent and updated on 19 June, then attached again with final UAT confirmation on launch day;
- WA Task Force discussion after launch raised whether the risk classification should be revisited, because participants did not see a meaningful incremental risk compared with GPTs or Skills;
- WA Task Force discussion raised insufficient permissions around scheduled agent tasks and cost/configuration controls for recurring automations;
- the product team asked for off-repo changes to be integrated into the repository and for the Workspace Agent and Codex plugin to be managed separately before marking v1 released on GitHub.

#### Research Interpretation

The launch communication itself was reasonably complete as a user-facing announcement. The failure pattern sits behind the announcement: release artifacts, permissions, feedback intake, source state, and configuration controls were still moving at the same time the product was being announced as available.

The newer evidence also strengthens the core risk-framing point. The project was treated as an agent-governance problem, but participants continued to debate whether the true risk delta was different from existing GPTs/Skills. Meanwhile, the concrete issues that surfaced were operational: who can build, who can publish, what state is canonical, who can access the agent, who can run scheduled tasks, who can delete them, how costs are controlled, and how feedback enters the build cycle.

#### Writer Notes

Use this section to separate communications quality from release readiness. The launch email can be treated as a useful artifact; the issue is that the operating system around the product was not stable enough for the communication to be true in practice for all required audiences.

### 9. Knights Chat Enrichment

#### What The Evidence Shows

The 25 June Teams enrichment pass over `Knights of the Round Table` adds the product-team operating-room view behind the more formal Outlook/WA Task Force evidence.

Key facts:

- On 9 June, the team framed the true risk delta as ownership and Workspace Agent controls, not external-system exposure, because the agent did not connect to anything external.
- On 15 June, production access for making the agent was still pending from Security.
- On 17 June, the team identified the need for a launched-version ZIP/archive that could be stored for Security/Risk, and Zack told Anthony that Risk/Security needed education on Workspace Agents.
- On 18 June, Zack reported a three-hour call with Security to help set up the Workspace Agent so it could be released under Security's name rather than his.
- On 19 June, build documentation was being shaped to satisfy the build-book requirement and to let Risk/Security/support understand what had been built and how to maintain it.
- On 19 June, the team actively collected IT/Risk/Security communication evidence and Zack shared the detailed conversation record now used as S1.
- On 19 June, repo/source-of-truth risk surfaced: Kev had repo access, Harris did not have Git, and the agent host might not be able to pull the latest agent version.
- On 19 June, Rishi and Raj explicitly characterized the risk framework as misclassified because they did not see incremental risk compared with GPTs and Skills.
- On 19 June and 22 June, product-hardening follow-ups continued: improve the sparse four-point-summary layout, validate French slides with a French speaker, connect scheduled tasks to KPMG Slides, and note that the product was working.

#### Research Interpretation

This evidence strengthens the operating-model thesis. The launch issue was not just whether the agent produced good slides or whether formal approval existed. The unresolved issues were concrete and operational: who could create the production agent, who could publish it, whether the live agent matched source control, whether a launched version was archived, whether support teams could understand the build, whether Risk/Security understood the platform, and whether language/product-quality follow-ups had a launch gate.

The Knights chat also clarifies why the risk-framing argument persisted after formal approval: product participants believed the review model was treating Workspace Agents as a larger platform delta than the actual agent warranted, while the operational risks of release provenance and access were the real failure surface.

#### Writer Notes

Use the Knights evidence carefully. It is internal working chat, not formal approval language. It is strongest as corroborating evidence for process diagnosis: risk framing, education need, release artifact mismatch, and source-of-truth gaps. Avoid overusing casual phrasing in the memo body; cite the message IDs in appendices when needed.

## External Best-Practice Anchors

| Source | Relevant Guidance | Application |
|---|---|---|
| OpenAI Help Center: ChatGPT Workspace Agents for Enterprise and Business | Workspace Agents can be tested before publishing; Enterprise agents are off by default; access is governed by RBAC; builders manage tools, skills, files, access, version history, analytics, and publishing roles. | Access, publishing, update, versioning, analytics, and RBAC should be launch gates. |
| OpenAI Help Center: ChatGPT Enterprise admin quickstart | Setup should include owners/admins, launch scope, identity, groups/RBAC, apps/connectors/agents, security/compliance controls, monitoring, support readiness, and onboarding sequencing. | Even beta launch needs named owners, access evidence, monitoring, and support. |
| OpenAI Developers: Evaluate agent workflows | Agent workflows should be evaluated through traces, graders, datasets, repeatable evals, tool use, and instruction-following checks. | UAT should be complemented by regression/eval gates. |
| Anthropic: Building effective agents | Start simple; add agentic complexity only where needed; document/test agent-computer interfaces; use sandbox testing and guardrails. | Manual Workspace Agent rebuilding is an agent-computer-interface risk that needed sandbox rehearsal. |
| Anthropic: Demystifying evals for AI agents | Agent evals should combine code-based, model-based, and human graders, with regression protection. | Informal UAT did not establish release thresholds or regression protection. |
| Anthropic Claude Code monitoring docs | Enterprise agentic tooling should expose telemetry for usage, costs, tool activity, errors, permission changes, plugin/skill activation, retries, and feedback. | Monitoring/support signals should be live before broader launch. |
| NIST AI RMF Core | AI risk management is lifecycle-wide and continuous: govern, map, measure, manage. | Release, monitoring, and recovery are part of AI governance, not post-launch add-ons. |
| NIST AI 600-1 Generative AI Profile | GenAI risk management spans governance, measurement, and management across the lifecycle. | Agent launch controls should include operations and incident handling. |
| ISO/IEC 42001 | AI management systems require policies/processes for responsible development/provision/use and continuous improvement. | KPMG Slides needs an operating management system, not only an approval event. |
| OWASP Top 10 for LLM Applications | LLM application risk includes excessive agency and supply-chain/component risks. | Skill packages, publishing authority, rebuilds, and tool permissions belong in the risk model. |

## Open Research Gaps

| Gap | Why It Matters | Suggested Follow-Up |
|---|---|---|
| Final live owner, publisher, and access mode | Needed to determine current operating state. | Inspect live Workspace Agent admin/config screen. |
| Final build book attachment | Needed to assess whether documentation is now sufficient. | Add the June 19 build documentation attachment; Outlook confirms it exists but the connector did not download it. |
| Exact access error screenshots | Needed to identify permission failure type. | Preserve hosted Teams images or screenshots. |
| Complete invite revision history for product-manager exclusion | Needed to prove each removal event. | Organizer-side calendar audit or Outlook audit trail. |
| Analytics/log availability | Needed for support and monitoring assessment. | Inspect Workspace Agent analytics/admin export. |
| Final beta launch email body | Needed for communications chronology. | Completed as S8; preserve original `.eml` if a legal/archive-grade source is needed. |
| Feedback form permissions | Needed to know whether beta feedback collection was available to all intended reviewers/users. | Inspect Forms sharing settings and response/collaboration permissions. |
| Scheduled agent task permissions | Needed to determine whether users can create/delete agent automations and how cost controls work. | Inspect Workspace Agent / ChatGPT admin configuration and preserve screenshots. |
| Source-of-truth reconciliation | Needed to know whether GitHub, Workspace Agent, and Codex plugin states match. | Compare live agent configuration, repository HEAD/release tag, and plugin package version. |
| Generated deck outputs and defect examples | Needed to distinguish product quality issues from release-control issues. | Save representative generated decks and bug reports. |

## Suggested Memo Spine

This is not draft prose; it is a possible structure for hand-writing.

1. Executive finding: the launch failed because the operating model was not ready.
2. Why the risk frame was wrong: the delta was operational release control, not net-new external exposure.
3. Why the control model failed: publishing was separated from building without a tested artifact handoff.
4. Why UAT did not save the launch: product usefulness is not release readiness.
5. Why access and rebuild should have blocked launch.
6. What governance should look like next: lighter where incremental risk is low, stricter where actual risk is high.
7. Appendix: factual issue breakdown and chronology.

## Evidence Limitations

- The Outlook/Teams record is search-derived, not a complete legal archive.
- Some Microsoft 365 items are represented by snippets and source IDs rather than full message bodies.
- The WA Task Force chat was fetched in connector-returned order without per-message timestamps.
- Newer Outlook evidence confirms attachment existence but does not include attachment file contents.
- The product-manager exclusion item has direct Teams support and later chat-addition evidence, but not complete invite revision logs.
- The meeting transcript is automated and may contain transcription errors in names or short phrases.
- External guidance is best-practice context, not binding KPMG policy.
- The Knights chat enrichment used Teams scoped search and individual message fetches where available; the connector did not expose a raw paginated full-history export in this session, so some older Knights evidence is represented by connector search summaries and message IDs.

## Integrated Evidence Appendices

Status: Active single-file consolidation. The appendices below embed the extracted evidence directly in this ledger so the active research surface is one Markdown file. The two original raw source files sit beside this ledger in the same folder.

### Appendix F: Knights Of The Round Table Teams Enrichment (S9)

Source path: `../kpmg-slides-v2-current-review/teams-knights-enrichment-notes.md`.

This appendix summarizes a scoped Teams pass over the `Knights of the Round Table` chat on 25 June 2026. The source file contains the detailed chronology and message IDs. Connector boundary: chat fetch returned the recent transcript slice and scoped search returned older message summaries; a raw paginated full-history export was not exposed in-session.

High-value message IDs:

| Date | Message ID | Evidence |
|---|---:|---|
| 2026-06-09 | `1781013820801`, `1781013945682`, `1781014183897` | No external-system connection risk framing; risk centered on ownership and Workspace Agent controls; Jacques described as supporting low-risk view. |
| 2026-06-15 | `1781531542727`, `1781558063067`, `1781559194374` | Misuse-risk framing, production builder access pending from Security, frustration with per-toggle risk assessments. |
| 2026-06-17 | `1781708541255`, `1781708968528`, `1781709030885`, `1781709051087`, `1781712044789` | Launched-version archive need, Risk/Security education need, AI-fluent risk/security skill gap, relevant review group. |
| 2026-06-18 | `1781817766664`, `1781817791603`, `1781817806524` | Three-hour Security setup call so the Workspace Agent could be released under Security's name rather than Zack's. |
| 2026-06-19 | `1781840859284`, `1781879388991`, `1781880619600`, `1781884275637`, `1781887528744`, `1781887575395` | Build-book/support documentation, comms collection, conversation-record handoff, repo/source-of-truth risk, risk-framework misclassification view. |
| 2026-06-19 | `1781881578420`, `1781905893875` | Product-quality follow-ups: four-point-summary layout redesign and French-slide validation. |
| 2026-06-22 | `1782153901922`, `1782154313141` | Scheduled tasks plus KPMG Slides; note that KPMG Slides was working. |

### Appendix A: Holy Grail Detailed Conversation Record (S1)

Source path: `Holy_Grail_KPMG_Slides_Detailed_Conversation_Record.txt`.

Original consolidated Outlook/Teams search record used for approval, risk/privacy/security, UAT, launch enablement, access, stakeholder messages, and source index claims.

```text
HOLY GRAIL / KPMG SLIDES – DETAILED CONVERSATION AND APPROVAL RECORD
Prepared for: Zack Mindel
Generated: 19 June 2026
Scope: Microsoft 365 search results covering Teams chats, email threads, meeting records, and related files about Holy Grail / KPMG Slides, especially conversations involving Anthony Hui, Scott Shannon, Andrew Cain, Kev Vadgama, Varun Sharma, Jacques-Yves Gadbois, Risk, Security, NITSO, ITS, and related stakeholders.

IMPORTANT LIMITATION
This document is compiled from the search results available in this Copilot session. It is intended as a detailed evidence pack, not a legally complete archive. Where a source result only returned a snippet, the quotation below is limited to that returned snippet. Source IDs are included throughout so that the originating Microsoft 365 item can be traced.

================================================================================
EXECUTIVE SUMMARY
================================================================================

The Holy Grail / KPMG Slides record shows a product moving from lab/sandbox experimentation into production under significant governance, risk, security, privacy, and operational scrutiny. The recurring issue across the record is not only whether the agent itself was acceptable, but who should own publishing/admin rights, how Workspace Agents should be governed, whether a PIA was required, whether the security/risk review understood the underlying platform correctly, and how quickly enablement could happen in advance of a planned launch and training schedule.

The key facts evidenced in the available messages are:

1. Holy Grail was later positioned as KPMG Slides in production. In the SAR approval email chain, Shripal Doshi wrote: "It will be known as 'KPMG Slides' when in production. Holy Grail was our stealth working title while it was being developed in the lab." [Source: turn3search173]

2. Security approval was granted for firm-wide ChatGPT Enterprise users, but with a condition. Varun Sharma forwarded CISO approval and wrote: "Please see below CISO approval, for firm-wide Chat GPT Enterprise users for Holy Grail ChatGPT workspace agent. You may proceed with enablement." He then added: "Further, wanted to add a keynote condition to this approval – ITS admin to own publishing of this agent, while Business will build." [Source: turn3search173]

3. The security approval request described the product as follows: "The solution automates the end-to-end creation of KPMG consulting presentations, improving efficiency, turnaround time, and consistency in deliverables." It also said the agent operated "within the ChatGPT Enterprise environment," had "constrained scope," did not integrate with "external systems, connectors, plugins, or external GPTs," used "strict role-based access restrictions," and was assessed as "Medium residual risk." [Source: turn3search173]

4. Risk approved after the SAR and privacy review points were addressed. Denease Prinold wrote: "Risk approves also. Rob will follow with his sign-off on the actual document. I’ve made updates to reflect the name change." [Source: turn3search173]

5. OGC Privacy said a PIA was not needed for the Holy Grail Workspace Agent, with conditions/reasons including that it was built on ChatGPT Enterprise, already PIA approved; it did not introduce new sub-processors, data locations, connectors, external GPTs, plugins, or data sources; and the PIA for Workspace would still be conducted. Paul Winton also cautioned: "we are a bit closer to the line on privacy compliance than I would normally like to be... but I am comfortable that we can justify our approach in this case." [Source: turn3search173]

6. A recurring source of friction was the review team's understanding of Workspace Agents. In a chat with Anthony Hui, Anthony wrote after a risk call: "They thought 'Workspace' was its own platform hence the excessive risk review" and later: "I was like no....its workspace agents smh". Zack responded: "we need more education for risk and security" and Anthony replied: "Yeah I gotta do that" and "Going to invest time upfront really helping them understand what we're trying to do". [Source: turn3search124]

7. Anthony Hui repeatedly acted as the coordinator/escalator for security, risk, privacy, launch, training, and governance. He wrote to Zia Shah: "I’m raising the need to expedite security approval for the KPMG Slides / Holy Grail workspace agent ahead of this Thursday's June 18 launch" and asked whether NITSO/security approval could be prioritized by EOD. [Source: turn3search172]

8. UAT sign-off was sent by Zack on 18 June. Zack wrote: "Signing off on UAT for KPMG Slides (Beta) Workspace Agent." Andrew Cain replied: "Thanks Zack." [Source: turn3search182]

9. Access/publishing remained practically painful even after approvals. In chats, Zack and Anthony discussed that enablement/sharing did not work as expected, and Anthony pushed Kev Vadgama to confirm that Workspace Agents had been enabled. Kev replied: "the 'Enable Agents' permission has been enabled for all members of the workspace." Zack replied that other people still could not access it. [Source: turn2search110]

10. Earlier sandbox enablement followed a similar pattern: security review, sandbox-only scope, dev accounts, and an approval/enablement loop. Kev wrote that "All GTA AI Lab accounts have now received approval to use Workspace Agents in our sandbox workspace" and that access had been enabled, with sync delays possible. [Source: turn3search167]

================================================================================
DETAILED TIMELINE AND EVIDENCE
================================================================================

--------------------------------------------------------------------------------
1. Early sandbox enablement and questions about real security concerns
--------------------------------------------------------------------------------

The earliest relevant enablement thread shows Workspace Agents being requested for sandbox testing and then enabled for GTA AI Lab accounts.

On 24 April 2026, Shripal Doshi asked Kev Vadgama and Nitin Kotak: "ChatGPT released workspace agents - can we please enable in our sandbox asap, as we'd like to test it's capability." [Source: turn3search167]

On 28 April 2026, Kev Vadgama responded that the request was under review by security: "Your request to enable Workspace Agents in our sandbox workspace is currently under review by our security team, I’ll update you as soon as we’re ready to proceed." Kev also asked whether the feature was intended for the AI lab accounts and listed the GTA AI lab user accounts. [Source: turn3search167]

Shripal confirmed the intended sandbox/lab scope: "This is correct as a starting point. So we can test the capabilities of it in the lab and we can rollout to other users post-lab testing." [Source: turn3search167]

On 4 May 2026, Shripal pushed for activation: "Can we please activate in the lab today!" Kev then confirmed: "All GTA AI Lab accounts have now received approval to use Workspace Agents in our sandbox workspace. Access has been enabled. It may take up to 4hrs for the accounts to see this feature in the sandbox workspace." [Source: turn3search167]

After sandbox access was enabled, Ryan MacDonald told the broader team: "FYI - workspace agents enabled on the lab accounts let’s get Raj and Ethan building out workspace agents in the lab this week….probably worth getting holy grail into a workspace agent ASAP." [Source: turn3search167]

Scott Shannon immediately framed the issue as one of production path and security rationale: "Is there a real security concern here preventing broader rollout? (cost notwithstanding) They did the security review for the lab - something they explicitly stated in the lab charter they didn’t need to do. I hope that means we have a clear path for production now?" [Source: turn3search167]

Rishi Sharma then pointed to additional partner demand for Workspace Agent-style use cases, arguing the need extended beyond Holy Grail. Examples he identified included an "Asset Availability and Sourcing Agent" for the Infrastructure Deals Team and an "M&A Niche news" agent for Deal Advisory. He labelled requirements as "Workspace Agents, Pitchbook, Teams, Outlook Connector, 2-3 Skills" and described impact as "HIGH" and complexity as "LOW". [Source: turn3search167]

Interpretation based strictly on the record: early enablement was explicitly sandbox/lab-scoped, subject to security review, and immediately raised the question of how to move from sandbox to production without repeating review bottlenecks for each incremental request.

--------------------------------------------------------------------------------
2. Approval for sandbox workspace agents and demonstrations of value
--------------------------------------------------------------------------------

On 27 May 2026, Scott Shannon emailed Kev Vadgama after speaking with Varun Sharma: "We received approval today from Varun and Zia to enable Workspace Agents for some developers on their devcloud accounts. Would we be able to get that enabled? I just got off the phone with Varun. Many thanks!" [Source: turn3search175]

Scott listed the developer accounts to be enabled, including Rishi Sharma, Adnaan Khan, Zack Mindel, Raj Gogia, and Scott Shannon dev accounts. [Source: turn3search175]

Kev replied: "We have enabled access to Workspace Agents for the team members listed below in our sandbox. It may take up to 2hrs for full synchronization of group permissions." [Source: turn3search175]

Scott responded: "Thank you! We already have it running. Most appreciated!" [Source: turn3search175]

Zack then sent a value demonstration to Varun Sharma, Sindhoori Munagala, Kev Vadgama, Shripal Doshi, Ryan MacDonald, Zia Shah, Glen Brookman, Kasia Parent, Rishi Sharma, Safdar Mahmood, Raj Gogia, and Scott Shannon: "Hey everyone - Just wanted to say thanks for getting this setup and share what we were able to produce with this workspace agent. Both of the attached decks were made in under 20 minutes from simple prompts. This should be a major win for the firm when released at scale!" [Source: turn3search175]

Glen Brookman replied: "That’s fantastic! And very cool!" [Source: turn3search175]

Interpretation based strictly on the record: the team used the sandbox enablement to produce proof points and to show that decks could be generated quickly. This was used as evidence for the value of broader release.

--------------------------------------------------------------------------------
3. OpenAI clarification on technical responsibility and governance
--------------------------------------------------------------------------------

A thread forwarded by Shripal Doshi on 13 May 2026 included an external clarification from Philip Makings at OpenAI. The context was enterprise uncertainty about generated scripts, code, dependencies, ownership, vulnerability scanning, and maintenance when Codex skills are packaged as Workspace Agents. [Source: turn3search171]

Tal Beno’s question captured the governance concern: "The enterprise technology groups are asking then who owns these generated Python scripts... for continuous vulnerability scanning, and patching/maintenance. That applies for the Codex side first (individual consumption), but even more so when packaged as a workspace agent and published for a large group of people." [Source: turn3search171]

Tal also wrote: "Codex is allowing business people to create skills but those skills carry code, and code must be maintained even when running within a segregated virtual machine. That code can have access to enterprise data through web and sensitive connectors, and someone must maintain it for security purposes." [Source: turn3search171]

OpenAI’s response stated: "OpenAI provides the Workspace Agents/Codex platform and the administrator controls around it. We do not maintain customer-created or agent-generated scripts, code, or dependencies across customer environments after they are created or packaged into an agent or skill." [Source: turn3search171]

OpenAI also stated: "Where [skills] do [include scripts/code], the creator of the skill is the owner of that skill, and the workspace’s Enterprise admins should manage how those skills are used, shared, reviewed, and maintained." [Source: turn3search171]

OpenAI added that ChatGPT Enterprise admins can use the Compliance API "to export an archive of skill source files, understand which skills are installed and used across the workspace, and conduct scanning, patching, and maintenance as they see fit." [Source: turn3search171]

OpenAI further clarified that "A skill referencing an app, connector, or MCP does not by itself grant access to data" and that access remains governed by the underlying app/MCP controls, including authentication, user entitlements, workspace policy, data handling, and action controls. [Source: turn3search171]

OpenAI concluded: "OpenAI provides the tools to govern and review agents/skills; KPMG is responsible for governing and reviewing the agents, skills, code, permissions, and behavior it chooses to deploy. Which function governance sits within KPMG is not something we can comment on." [Source: turn3search171]

Interpretation based strictly on the record: this thread gave KPMG a clear external statement that OpenAI provides the platform/admin tooling, while KPMG retains responsibility for governance, review, code, permissions, and behaviour of the agents/skills it deploys.

--------------------------------------------------------------------------------
4. Show-and-tell and proposed governance model
--------------------------------------------------------------------------------

On 9 June 2026, Kev Vadgama shared a deck in the "Agent Workspaces Show and Tell" thread: "Sharing a copy of our deck on Technical & Governance controls as requested." [Source: turn3search181]

The meeting invite stated: "You are already aware of the business request to enable ChatGPT Workspace Agents. The first agent built on this capability is the Holy Grail, expected to go live June 19th. We'd like to offer a show and tell with the objective of making the review process easier." [Source: turn3search181]

The discussion areas listed in the invite were:
- "ChatGPT workspaces capability"
- "Intro to first agent: Holy Grail"
- "Proposed Agent Governance model and its fit with the Copilot Studio Governance model" [Source: turn3search181]

The attached/embedded governance material included Workspace permission roles:
- "Enable Agents – Allow members to browse and run agents in the workspace"
- "Enable agent building – Allow members to create, edit & duplicate agents in the workspace"
- "Enable agent sharing – Allow members to share agents with other users in the workspace" [Source: turn3search181]

The same material also referenced technical/admin capabilities including:
- "Compliance API"
- "Unpublish Workspace Agent – Preserves the draft record, removes visibility to other members, disables triggers"
- "Delete Workspace Agent – Removes agent record from workspace"
- "Log Files – agent lifecycle activity, runtime usage, trigger changes, connector calls"
- "Agent Analytics" including "Usage", "Runs", and "Access" [Source: turn3search181]

The governance controls material included risk categories such as "Agent ownership and Lifecycle gaps", "Agent availability & continuity risks", "Lack of Deployment & recovery mechanisms", and "Sharing & Access". Proposed controls included restricting build permissions to an approved builder identity, RBAC to control building and sharing, monitoring ownership via admin console/compliance API, requiring business and technical owner, registering agents in an AI registry, offboarding transition of ownership, periodic recertification, inventory reviews, documented business purpose/rebuild instructions, and testing/validation before production use. [Source: turn3search181]

Interpretation based strictly on the record: before launch, the team attempted to proactively educate/reduce review friction by explaining the Workspace capability, Holy Grail as the first agent, and a control model aligned to governance expectations.

--------------------------------------------------------------------------------
5. Specific approval request to Security / NITSO for June launch
--------------------------------------------------------------------------------

On 16 June 2026, Anthony Hui emailed Zia Shah, Varun Sharma, and Victoria Akpore, copying Shripal Doshi, Kasia Parent, Jacques-Yves Gadbois, Andrew Cain, Zack Mindel, and Sabrina Ciardullo. The subject was "Urgent: Security approval required today – KPMG Slides / Holy Grail agent (June 18 launch)". [Source: turn3search172]

Anthony wrote: "Following our discussion yesterday on urgent business priorities, I’m raising the need to expedite security approval for the KPMG Slides / Holy Grail workspace agent ahead of this Thursday's June 18 launch." [Source: turn3search172]

He continued: "I understand your team is still completing internal reviews for this pilot agent. Given we are now <2 days from launch - and need time to enable and test in production - are we able to prioritize NITSO/ security approval by EOD today?" [Source: turn3search172]

Anthony explained why timing mattered: "This is a critical business enablement priority for Shripal ahead of his upcoming leave. With firmwide training and comms set to go out this Thursday, we need to ensure the broader workspace can properly access the agent when we launch." [Source: turn3search172]

Zia Shah replied: "Hi Anthony, the team has prioritized this ask, put in extra efforts to expedite and of today, completed the review. Varun or Victoria will relay the approval shortly, noting one concern that has been identified through this review." [Source: turn3search172]

Shripal replied in the same chain: "Thank you all for moving so quickly on this!!" [Source: turn3search179]

Interpretation based strictly on the record: Anthony escalated the need for same-day NITSO/security approval because the launch was imminent, access testing still had to occur, and firmwide training/comms were planned.

--------------------------------------------------------------------------------
6. Security approval, medium residual risk, and publishing condition
--------------------------------------------------------------------------------

The SAR Approved thread contains the detailed approval language and conditions. Victoria Akpore’s request to Zia Shah stated: "I am seeking approval for the Holy Grail ChatGPT workspace agent. The solution automates the end-to-end creation of KPMG consulting presentations, improving efficiency, turnaround time, and consistency in deliverables." [Source: turn3search173]

Victoria described scope and constraints: "The agent operates within the ChatGPT Enterprise environment and is designed with a constrained scope, leveraging predefined skills and publicly available KPMG templates. It does not integrate with external systems, connectors, plugins, or external GPTs." [Source: turn3search173]

Victoria described security controls: "Key security controls include strict role-based access restrictions, single builder model with consumer-only access." [Source: turn3search173]

Victoria described data usage and risk rating: "Data usage is restricted to non-sensitive inputs in alignment with enterprise data classification policies. The solution is assessed as Medium residual risk, primarily due to reliance on third-party LLM processing, where KPMG does not have direct control over inference operations." [Source: turn3search173]

Zia Shah replied simply: "Approved." [Source: turn3search173]

Varun Sharma forwarded the approval to Andrew Cain, Kev Vadgama, and Harris Ghafoor, copying Kasia Parent, Victoria Akpore, and Jacques-Yves Gadbois: "Please see below CISO approval, for firm-wide Chat GPT Enterprise users for Holy Grail ChatGPT workspace agent. You may proceed with enablement." [Source: turn3search173]

Varun then added the condition: "Further, wanted to add a keynote condition to this approval – ITS admin to own publishing of this agent, while Business will build." [Source: turn3search173]

Interpretation based strictly on the record: Security approved the agent for firm-wide ChatGPT Enterprise users, but Business building and ITS owning publishing became the central control condition.

--------------------------------------------------------------------------------
7. Risk, privacy, and QRMM 16.6.4 review
--------------------------------------------------------------------------------

After security approval, Kasia Parent forwarded the SAR to Denease Prinold and others: "Hi Denise, please see below security approval. The IT team will be ready to roll when they have the green light on any outstanding Risk Management questions. @Hui, Anthony is there anything outstanding on this front?" [Source: turn3search173]

Denease asked about privacy and terms: "Thanks Kasia. Varun has forwarded the SAR, I have a look. @Hui, Anthony - Any word on Privacy's review and Shripal's review of the product terms for Workspace?" [Source: turn3search173]

Anthony replied: "I connected with Shripal earlier today. He is comfortable with the product terms for the WS agent for this pilot. He responded confirming to proceed in a separate thread." [Source: turn3search173]

Anthony then flagged urgency on Privacy: "In term of privacy - I haven't been across this review. @Ajuwape, Seyi is this on your radar for the Holy Grail workspace agent? We are one day out from launch so if there's any final reviews - we need to iron this out ASAP." He also asked Andrew Cain: "let me know if there's anything I'm missing." [Source: turn3search173]

Kasia proposed a quick touchpoint: "Hi Seyi - maybe we (either Anthony or I) can do a quick tb with you tomorrow just to tie off this end - if you need a formal intake to document that can be done but let's talk to keep the timeline." [Source: turn3search173]

Kasia then clarified for Seyi and Paul Winton: "The agent is a low-risk category agent on OpenAI ChatGPT - which is indeed an approved platform. Reference: The low-risk category is the one where the agent can help generate content but needs human input and action." [Source: turn3search173]

Kasia continued: "The agent was created using a newer feature of ChatGPT called Workspace (which is similar to copilot studio). At this time GPT Agent Workspace is still going through last stage reviews - the holy grail agent is being promoted on an exception basis after rigorous review." [Source: turn3search173]

Kasia described the product’s purpose: "The agent specifically generates branded power point decks with content articulated by the submitter." [Source: turn3search173]

Kasia described data handling: "There are no new or third parties who will gain access to our data by using this agent. Data processing location is unchanged - our data remains in Canada with processing in the U.S. through OpenAi ChatGPT enterprise." [Source: turn3search173]

Kasia added: "The GPT platform has Risk Guidelines for use that platform users are expected to adhere to. Restricted data is not allowed in ChatGPT." [Source: turn3search173]

Paul Winton responded that the agent may fall within the established PIA carveout: "Kasia, I will confer with Seyi tomorrow morning, but based on the below this agent may fall within the established PIA carveout for agents built on PIA approved applications." [Source: turn3search173]

Paul later confirmed: "All, OGC Privacy is comfortable that a PIA is not needed for the Holy Grail Workspace Agent" and listed the basis, including:
- "it is built off of ChatGPT Enterprise which has already been PIA approved"
- "will not result in disclosure of KPMG or client CI or PI to any additional sub-processors or in any additional locations beyond our existing use of ChatGPT Enterprise"
- "it does not introduce any new connectors, external GPTs, plugins, or data sources beyond the existing ChatGPT Enterprise environment"
- "use guidelines for ChatGPT Enterprise... have been established"
- "a SAR has been conducted from an information security perspective"
- "a PIA will be conducted in respect of Workspace" [Source: turn3search173]

Paul added an important caution: "Note that we are a bit closer to the line on privacy compliance than I would normally like to be by virtue of rolling out the Holy Grail Workspace Agent without having already reviewed Workspace itself from a privacy perspective, but I am comfortable that we can justify our approach in this case." [Source: turn3search173]

Ven Adamov wrote: "I have no further comments. @Rowe, Robert (Toronto) W Can you confirm we are good to proceed?" [Source: turn3search173]

Rob Rowe clarified sequence/sign-off: "Denease does the RA, Shripal signs then then I sign it - Denease are we ready?" [Source: turn3search173]

Denease wrote: "I worked on the RA last night. Anthony and I just wrapped up a good conversation to clarify some items regarding the platform/terminology and scope of this review. I shared the draft risk assessment on screen. I’ll circle back with Rob now to finalize and share with Shripal." [Source: turn3search173]

Denease then wrote to Shripal: "I will send you a link to the QRMM 16.6.4 risk assessment for your review and approval. We can tweak the wording afterwards, if needed, but we want to be able to expedite things to allow your team to prepare for the deployment. Risk would be good to approve the deployment of the Holy Grail Agent after your review. I can walk you through the risk assessment, if you prefer. The SAR reported a medium risk. If you have any comments, please share. I understand Anthony is working on updating the guidelines in relation to the agent." [Source: turn3search173]

Shripal responded: "I’ve signed off on it. It will be known as 'KPMG Slides' when in production. Holy Grail was our stealth working title while it was being developed in the lab." [Source: turn3search173]

Denease then confirmed Risk approval: "Risk approves also. Rob will follow with his sign-off on the actual document. I’ve made updates to reflect the name change." [Source: turn3search173]

Shripal forwarded to the broader team: "It’s time to ship KPMG Slides Beta – aka Holy Grail. Great work everyone!" Safdar Mahmood replied: "Amazing - congratulations all! Well done." [Source: turn3search173]

Interpretation based strictly on the record: Security approval was followed by Risk, QRMM, and Privacy review. The record indicates the review required clarification on platform/terminology/scope and ended with risk approval after Shripal’s approval and name-change updates.

--------------------------------------------------------------------------------
8. Anthony/Zack private chat: risk/security misunderstanding and education need
--------------------------------------------------------------------------------

In a direct/group chat involving Anthony Hui and Zack Mindel, Anthony asked about costs and the slide. Zack answered: "Raj has a slide on it", "its a couple $ per deck", "$1-$10 depending on size", and noted that image generation and image-to-PPTX skills were harder to quantify and likely where spend would come from, while "the pptx skills are very token efficient." [Source: turn3search124]

Anthony wrote: "Can you send me the slide" and then later: "Just hopped off a 45 min call with risk". [Source: turn3search124]

Zack asked: "we good to go?!?!" [Source: turn3search124]

Anthony replied: "They thought 'Workspace' was its own platform hence the excessive risk review". Zack responded: "hahahaah" and "so dumb". [Source: turn3search124]

Anthony continued: "We are t-minus 1 hr out from full sign off fully" and "Risk was the last piece". [Source: turn3search124]

Anthony wrote: "I'm being hella nice but bro" and "I was like no....its workspace agents smh". [Source: turn3search124]

Zack replied: "we need more education for risk and security" and "thats insane". [Source: turn3search124]

Anthony agreed: "Yeah I gotta do that", "Going to invest time upfront really helping them understand what we're trying to do", and "And then have them go away and do their thing". [Source: turn3search124]

Zack replied: "its needed". Anthony concluded: "This was bumpy but we'll do it better for docs etc." Zack replied: "it will be easier next time fs". [Source: turn3search124]

Interpretation based strictly on the record: this chat is one of the clearest pieces of evidence that part of the risk review delay/friction arose from confusion over the term "Workspace" and whether it referred to a separate platform rather than a feature/capability inside ChatGPT Enterprise.

--------------------------------------------------------------------------------
9. Admin/build/publish controls and the tension between agility and governance
--------------------------------------------------------------------------------

A chat involving Anthony Hui, Kev Vadgama, Harris Ghafoor, Zack Mindel, Raj Gogia, and Rishi Sharma captured the admin setup discussion. Anthony wrote: "Hey Vadgama, Kev Ghafoor, Harris - spinning up a quick side bar re: admin access to Holy Grail going forward". [Source: turn2search104]

Anthony stated the objective: "We need to ensure there are admin users from the business who understand how it is works / implement changes". [Source: turn2search104]

Anthony proposed the admin setup for launch: "Can we align on the following admin setup for the Holy Grail launch: Kev Vadgama, Harris Ghafoor, Zack Mindel, Raj Gogja, Rishi Sharma". [Source: turn2search104]

Zack wrote: "It is crucial to the success of the agent that we have admin controls to maintain and update the agent. As it is in beta we will be getting continuous feedback that should be acted on timely to ensure the user experience is as good as possible. If there are issues / errors / updates etc. not having immediate access to making updates will be a bigger risk to users." [Source: turn2search104]

Kev asked for clarification: "Thanks Anthony, just to confirm that this is the list of users that will require an agent builder role in the workspace? Co-editing of a workspace agent is currently limited to the author." [Source: turn2search104]

Anthony clarified two permission concepts: "So for my understanding - there are two things: agent building permissions in the workspace + admin permissions in the Azure security group that is currently being enabled by Global for Holy Grail". [Source: turn2search104]

Anthony then stated the desired outcome: "I just want to make sure that Zack can do this. If it means have both #1 and #2 enabled, we should do that for those users". [Source: turn2search104]

Harris responded: "Zack will be able to make as many updates to the agent as he's a builder, it's effectively dev which he can test. Once the updated agent is ready to be pushed, he will need to inform ITS (Kev and I) and provide the updated agent to share with the users." [Source: turn2search104]

Interpretation based strictly on the record: Zack and Anthony argued that business-side admin/builder control was necessary to maintain and iterate the beta. ITS/Security’s control model separated builder/development ability from production publishing, with ITS owning the final push/share step.

--------------------------------------------------------------------------------
10. UAT testing, sharing/access issues, and production enablement
--------------------------------------------------------------------------------

The UAT chat shows practical access/testing friction just before launch. Anthony asked: "How we doing?" and asked whether Zack/Raj were running the call from the Lab, adding that he might join because "Internet is kind of trash on 38". [Source: turn2search105]

Zack wrote: "ive approved UAT with Kev and Andrew" and "once Raj pushes these changes and we test it will be good to og". Zack then flagged: "idk if security has approved workspace agents for everyone tho" and asked Anthony: "can you follow up in that chat". [Source: turn2search105]

Anthony asked: "? Like just for KPMG Slides?" Raj asked whether this was about making agents for testing in prod or separate. Zack clarified: "i can still only share kpmg slides with this group" and "they need to enable it for everyone so when i toggle it on they can access it". Anthony replied: "K got it, let me ping". [Source: turn2search105]

Zack later wrote: "its not working" and "ive sent it to other people and they cant access it". Scott Shannon asked: "if you list the agent would that change anythign?" Zack replied: "i dont want to do that yet" and "people should be able to access it when i add them". [Source: turn2search105]

In another related thread, Anthony asked: "Guys - re: UAT Mindel, Zack are we done? Any other bugs, defects we gotta sort out?" Zack replied: "yes still sorting some stuff out now". Anthony responded: "ITS needs the green light". Raj said fixes were implemented and test before merging to master was needed. Anthony said: "Will ping you on the side". [Source: turn2search106]

In an early-access UAT group, Zack wrote: "Hi all - this is the group that has been granted early access to workspace agents" and shared the agent link, asking: "please let me know if you can access this link to test". Anthony replied: "I can see the Agents view as well. Has KPMG Slides been uploaded?" Zack clarified: "i didn't push it to the whole workspace" and "i just shared it with this group individually". [Source: turn2search107]

Zack directed testers: "if everyone could play around with it - make a deck or 2. ask for images. reimagine a slide. try out different operating mode that would be great. as long as there are no massive errors we should be good to launch." He added: "once everyone gives me a 'looks good' I will approve the UAT with security and they can work to approve it in prod". [Source: turn2search107]

Scott asked: "what is security evaluating?" Zack responded: "nothing - they just want approved UAT sign off". [Source: turn2search107]

Zack later noted improvements: "description and starter prompts updated" and that starter prompts populate the textbox with a full prompt. [Source: turn2search107]

Interpretation based strictly on the record: UAT sign-off was treated as a gating item for security/prod, but access and sharing did not behave as cleanly as expected. Zack expected users to be able to access when he added them; ITS/security enablement and workspace permissions were still actively being resolved.

--------------------------------------------------------------------------------
11. Formal UAT approval email
--------------------------------------------------------------------------------

On 18 June 2026, Zack emailed Andrew Cain, Kev Vadgama, Harris Ghafoor, and Anthony Hui with subject "Holy Grail UAT Approval". Zack wrote: "Hi all, Signing off on UAT for KPMG Slides (Beta) Workspace Agent." [Source: turn3search182]

Andrew Cain replied: "Thanks Zack." [Source: turn3search182]

Interpretation based strictly on the record: this was the formal UAT approval communication used to confirm KPMG Slides Beta / Holy Grail was ready from the UAT perspective.

--------------------------------------------------------------------------------
12. Production access after approval: enablement still not working cleanly
--------------------------------------------------------------------------------

In a launch/enablement thread, Andrew Cain asked: "good morning folks - any updates on the UAT for HG?" Zack wrote: "We are cleaning up 1 last thing - once you approve it for everyone, I still need to publish it and put it into the KPMG Directory. For times sake, I can send you the approval email, your team can push it to prod and then this afternoon when we launch it I can put it into the KPMG Directory for people to use. does that work?" [Source: turn2search110]

Andrew replied: "sure thing - once we get the email Vadgama, Kev can we make 'rocket ship go' please". Kev replied: "Yes, will connect with Zack after we receive approval. Thanks". [Source: turn2search110]

Zack wrote: "email sent" and noted that he was in a client workshop until 1pm but could message. Anthony then asked Kev: "can you confirm WS agents has been enabled for the workspace? Zack will need that done first so he can then share Holy Grail to the rest of the workspace and folks will have access." [Source: turn2search110]

Kev replied: "Hi Anthony, yes, the 'Enable Agents' permission has been enabled for all members of the workspace." [Source: turn2search110]

Zack then reported that the expected access was not working: "I have sent the link to other people and they are not able to access it" and shared the agent link. He asked Harris: "can you access this?" Harris replied: "Yes". Zack asked whether Harris was enabled in the UAT group and said: "Anthony is able to access it also - but I just sent it to someone with a ChatGPT enterprise license and it didn't work for them". [Source: turn2search110]

Harris replied: "Who else did you share the URL with? Please share their names so Kev can cross-reference." Harris also noted: "I might be an outlier since I'm an Owner of the workspace." [Source: turn2search110]

Interpretation based strictly on the record: even after enablement was confirmed, actual user access was inconsistent; workspace ownership/UAT group membership may have affected who could access, though the record only explicitly states Harris might be an outlier because he was an Owner.

--------------------------------------------------------------------------------
13. Launch/training pressure and operational fallout
--------------------------------------------------------------------------------

In another chat, Anthony wrote: "So they're confused why this is so difficult to redeploy the workspace agent" and "Sigh". He added: "Get through this one and we'll figure out a better way after." [Source: turn2search111]

Zack replied: "They are now seeing why it is difficult and tedious lol". [Source: turn2search111]

Anthony asked: "Are you going to miss your intro on the training?" and suggested: "We can also hedge and say that it will be available before EOD today". He asked: "You working with Kev?" and later: "Let us know when you're good and he's enabled - team is on standby for comms until it's actually confirmed in prod and working." [Source: turn2search111]

Zack replied: "Likely won’t launch until tmr" and "They still havnt enabled workspace agents lol". Anthony responded: "Smh" and "Thanks for dealing with this mess" and "at least the training went well lol". [Source: turn2search111]

Zack wrote: "And it didn’t even let Kev build it so Harris did. Spent around 3h on it" and "They now understand why I wanted publishing access". [Source: turn2search111]

Interpretation based strictly on the record: despite security/risk/UAT progress, the operational release process remained painful and time-consuming. Zack specifically tied the difficulty to why he had wanted publishing access.

--------------------------------------------------------------------------------
14. Anthony/Zack planning for security hold-up and training deck
--------------------------------------------------------------------------------

On Monday before launch, Anthony told Zack: "Security is the hold up right now. Not sure why. Chatting with Zia today" and "We'll get this done dw". [Source: turn2search119]

Anthony also wrote: "Want to get your eyes on the deck soon for the training / launch call on Thursday" and "I think you and I are co-facilitating this so I want us to be on the same wave length for the vibe / delivery of it". [Source: turn2search119]

Zack asked: "any update on WA?" Anthony provided the latest from Varun: "Security is still the hold up. They’re well aware of our launch date". [Source: turn2search119]

Interpretation based strictly on the record: Anthony was tracking security, launch readiness, and training/storytelling in parallel.

--------------------------------------------------------------------------------
15. Product naming and training material alignment
--------------------------------------------------------------------------------

In the training/touchpoint email thread, Anthony wrote: "Can we include Zack / Raj on these prep invites going forward given they’ll be helping with this particular training? Not sure if we need Rishi, might be overkill." [Source: turn2search100]

Anthony added: "Small note - I think we're referring to Holy Grail as 'KPMG Slides' in the short-term. At least for this initial launch. This should be reflected throughout the training materials." [Source: turn2search100]

A related training slides file, "KPMG Training Slides for June 18th", lists Anthony Hui, Zack Mindel, and Raj Gogia as presenters; agenda items include "Building slides", "Building documents", "Building sheets", "Building slides from scratch is slow, hard, and inconsistent", "Video Demonstration", "KPMG Slides", "How the deck engine actually works", "Risk considerations from KPMG’s AI investigation", and "Risk Guidelines". [Source: turn3search150]

Interpretation based strictly on the record: the team deliberately shifted the launch-facing name to KPMG Slides and included risk/governance content in the June 18 training materials.

--------------------------------------------------------------------------------
16. Scott Shannon’s position on prioritisation and productionising Workspace Agents
--------------------------------------------------------------------------------

Scott’s communications show a consistent focus on building an enablement path for Workspace Agents and avoiding excessive blockers.

In the SOW Developer thread, Scott wrote: "… ummm I think we should delay this and it should be #2 after holy grail in workspace agents. No idea why / how they got this information to send it. maybe something else is being worked on elsewhere?." [Source: turn3search169]

In the Advisory AI Transformation weekly status chat, Scott asked: "Does holy grail use that many tokens? Using scripts should reduce that by alot right?" Zack answered that slide generation is efficient and scripts do the heavy lifting, while supplementary image-gen and PPTX reconstruction are more token intensive. [Source: turn3search125]

The same status thread captured follow-up topics including: "Align on the framework and process for productionizing workspace agents and present it to risk and security for approval", "Determine next steps and responsibilities for enabling Codex for client work," and "Establish service level agreements (SLAs) with ITS to ensure timely support for Codex and workspace agent enablement." [Source: turn3search125]

In the sandbox/enablement thread, Scott asked directly whether a real security concern existed and whether lab review meant there was now a path to production: "Is there a real security concern here preventing broader rollout?" and "I hope that means we have a clear path for production now?" [Source: turn3search167]

In a later UAT testing discussion, Scott wrote that he was going to tell Monika that "we can't do service line re-engineering like this" and noted that he was "not allowed to engage with ITS other than through Anthony" and would raise through Saf/Monika while keeping Anthony informed. [Source: turn2search106]

Interpretation based strictly on the record: Scott consistently placed Holy Grail/KPMG Slides as a priority Workspace Agent and pushed for a scalable process with clear risk/security approval, ITS SLAs, and a productionisation framework.

--------------------------------------------------------------------------------
17. Group chat on in-house solution vs vendor / off-the-shelf
--------------------------------------------------------------------------------

In the KPMG Slides Training Session Final Update touchpoint, Anthony shared a LinkedIn post about Claude Design and wrote: "we should hit on why we built our own solution in-house vs. partnered w/ vendor vs. bought off-the-shelf". [Source: turn2search102]

Anthony added: "I think we have our reasons (access to KPMG-specific branding and requirements, improved token efficiency) but just need to ensure we have answers during the training call". [Source: turn2search102]

Zack responded: "yea all the design stuff is a sham - it looks good in html and react. its made for web designers not ppl stuck in the Microsoft suite" and "its also extremely timely and expensive to create pptx decks from scratch". [Source: turn2search102]

Zack also wrote: "when we spoke with external vendors like templafy they were going down the same path as us of using deterministic template filling as the solutions". [Source: turn2search102]

Raj Gogia added: "Getting this type of stuff over to powerpoint is the actual difficult problem out there" and "most out of box solutions simply just suck, so that's why we had to make something that actually does the job right". [Source: turn2search102]

Interpretation based strictly on the record: the team’s rationale for the in-house build included KPMG-specific branding/requirements, token efficiency, and the difficulty of producing high-quality editable PowerPoint output.

--------------------------------------------------------------------------------
18. Broader launch communications and promotional push
--------------------------------------------------------------------------------

In the GTA AI Lab group, Zack shared an updated promo video: "Updated promo video with audio and KPMG font". Scott replied: "lets start sharing more broadly to get some hype. we should get this on Stephanie's digital desk + KPMG today." [Source: turn3search126]

Zack asked: "Do we have a Release Date? Are we close to risk approvals?" Anthony replied: "Met with Kasia and Jacques yesterday. They have a plan to close risk / security concerns specifically for WS agents in the context of KPMG Slides / Holy Grail. They are presenting the plan back to NITSO early next week and if they get sign-off there, we should be good to go. But will keep you guys posted." [Source: turn3search126]

Anthony added: "This looks killer btw." Scott wrote: "it takes time to get on both those. I certainly hope we are live by then." [Source: turn3search126]

Interpretation based strictly on the record: communications planning was ahead of, and dependent on, risk/security sign-off. Anthony indicated that Kasia and Jacques had a plan to close risk/security concerns and present back to NITSO.

--------------------------------------------------------------------------------
19. Quick chat meeting about Holy Grail
--------------------------------------------------------------------------------

A meeting titled "Quick chat on Holy Grail" was organised by Andrew Cain for last Thursday at 8:30 AM–8:55 AM. The invitees included Anthony Hui, Zack Mindel, Varun Sharma, and Victoria Akpore. The meeting invitation stated: "Blocking time to sync on Holy Grail and ensure we are aligned on all details". [Source: turn3search140]

Related resources for that meeting included the UAT Approval email, SAR Approved email, and Urgent Security Approval email. [Source: turn3search140]

Interpretation based strictly on the record: Andrew Cain set up a targeted alignment meeting with Anthony, Zack, Varun, and Victoria, tied to the major approval/UAT/security threads.

--------------------------------------------------------------------------------
20. Cost/governance content in training update meeting
--------------------------------------------------------------------------------

In the "KPMG Slide Training Session Updates - Touchpoint" meeting transcript, Anthony Hui discussed cost governance. He said people needed to take "some accountability and a closer look at how they're using these tools and what they're using it for, because there's real cost implications to the firm." [Source: turn3search141]

Anthony added: "this translates directly into how we're investing in AI for FY27 and our spend" and "the costs are real in the way that we govern them" at both enterprise and individual levels. [Source: turn3search141]

Anthony connected this to Shripal and Stephanie discussions, saying Shripal was going to Stephanie asking for funding and Stephanie was asking "for what? Like, what am I getting back for it?" and whether people were using the tools properly. [Source: turn3search141]

Anthony framed the training narrative as needing to cover the governance/cost topic before the more exciting parts: "I think we got to do a little bit of the unsexy to get to the fun stuff later." [Source: turn3search141]

Interpretation based strictly on the record: the training story around KPMG Slides was not only product functionality; it included governance, consumption, and financial discipline around AI usage.

================================================================================
STAKEHOLDER-SPECIFIC QUOTE BANK
================================================================================

--------------------------------------------------------------------------------
Anthony Hui
--------------------------------------------------------------------------------

"we should hit on why we built our own solution in-house vs. partnered w/ vendor vs. bought off-the-shelf" [Source: turn2search102]

"I think we have our reasons (access to KPMG-specific branding and requirements, improved token efficiency) but just need to ensure we have answers during the training call" [Source: turn2search102]

"Security is the hold up right now. Not sure why. Chatting with Zia today" [Source: turn2search119]

"We'll get this done dw" [Source: turn2search119]

"I think you and I are co-facilitating this so I want us to be on the same wave length for the vibe / delivery of it" [Source: turn2search119]

"Security is still the hold up. They’re well aware of our launch date" [Source: turn2search119]

"We need to ensure there are admin users from the business who understand how it is works / implement changes" [Source: turn2search104]

"I just want to make sure that Zack can do this. If it means have both #1 and #2 enabled, we should do that for those users" [Source: turn2search104]

"Following our discussion yesterday on urgent business priorities, I’m raising the need to expedite security approval for the KPMG Slides / Holy Grail workspace agent ahead of this Thursday's June 18 launch." [Source: turn3search172]

"Given we are now <2 days from launch - and need time to enable and test in production - are we able to prioritize NITSO/ security approval by EOD today?" [Source: turn3search172]

"This is a critical business enablement priority for Shripal ahead of his upcoming leave. With firmwide training and comms set to go out this Thursday, we need to ensure the broader workspace can properly access the agent when we launch." [Source: turn3search172]

"In term of privacy - I haven't been across this review... We are one day out from launch so if there's any final reviews - we need to iron this out ASAP." [Source: turn3search173]

"They thought 'Workspace' was its own platform hence the excessive risk review" [Source: turn3search124]

"Risk was the last piece" [Source: turn3search124]

"I was like no....its workspace agents smh" [Source: turn3search124]

"Going to invest time upfront really helping them understand what we're trying to do" [Source: turn3search124]

"This was bumpy but we'll do it better for docs etc." [Source: turn3search124]

"So they're confused why this is so difficult to redeploy the workspace agent" [Source: turn2search111]

"Get through this one and we'll figure out a better way after." [Source: turn2search111]

"Let us know when you're good and he's enabled - team is on standby for comms until it's actually confirmed in prod and working." [Source: turn2search111]

--------------------------------------------------------------------------------
Zack Mindel
--------------------------------------------------------------------------------

"It is crucial to the success of the agent that we have admin controls to maintain and update the agent. As it is in beta we will be getting continuous feedback that should be acted on timely to ensure the user experience is as good as possible. If there are issues / errors / updates etc. not having immediate access to making updates will be a bigger risk to users." [Source: turn2search104]

"idk if security has approved workspace agents for everyone tho" [Source: turn2search105]

"i can still only share kpmg slides with this group" [Source: turn2search105]

"they need to enable it for everyone so when i toggle it on they can access it" [Source: turn2search105]

"its not working" / "ive sent it to other people and they cant access it" [Source: turn2search105]

"people should be able to access it when i add them" [Source: turn2search105]

"if everyone could play around with it - make a deck or 2. ask for images. reimagine a slide. try out different operating mode that would be great. as long as there are no massive errors we should be good to launch." [Source: turn2search107]

"once everyone gives me a 'looks good' I will approve the UAT with security and they can work to approve it in prod" [Source: turn2search107]

"nothing - they just want approved UAT sign off" [Source: turn2search107]

"Signing off on UAT for KPMG Slides (Beta) Workspace Agent." [Source: turn3search182]

"we need more education for risk and security" [Source: turn3search124]

"They are now seeing why it is difficult and tedious lol" [Source: turn2search111]

"They now understand why I wanted publishing access" [Source: turn2search111]

--------------------------------------------------------------------------------
Scott Shannon
--------------------------------------------------------------------------------

"Is there a real security concern here preventing broader rollout? (cost notwithstanding)" [Source: turn3search167]

"They did the security review for the lab - something they explicitly stated in the lab charter they didn’t need to do. I hope that means we have a clear path for production now?" [Source: turn3search167]

"Does holy grail use that many tokens? Using scripts should reduce that by alot right?" [Source: turn3search125]

"… ummm I think we should delay this and it should be #2 after holy grail in workspace agents." [Source: turn3search169]

"lets start sharing more broadly to get some hype. we should get this on Stephanie's digital desk + KPMG today." [Source: turn3search126]

"Thank you! We already have it running. Most appreciated!" [Source: turn3search175]

"I'm going to basically tell Monika in my next update that we can't do service line re-engineering like this" [Source: turn2search106]

"I'm not allowed to engage with ITS other than through Anthony so I'm going to be just raising through Saf/Monika and I've let Anthony know" [Source: turn2search106]

--------------------------------------------------------------------------------
Andrew Cain
--------------------------------------------------------------------------------

"good morning folks - any updates on the UAT for HG?" [Source: turn2search110]

"sure thing - once we get the email Vadgama, Kev can we make 'rocket ship go' please" [Source: turn2search110]

"Thanks Zack." [Source: turn3search182]

Meeting invite: "Blocking time to sync on Holy Grail and ensure we are aligned on all details" [Source: turn3search140]

--------------------------------------------------------------------------------
Kev Vadgama
--------------------------------------------------------------------------------

"Your request to enable Workspace Agents in our sandbox workspace is currently under review by our security team, I’ll update you as soon as we’re ready to proceed." [Source: turn3search167]

"All GTA AI Lab accounts have now received approval to use Workspace Agents in our sandbox workspace. Access has been enabled. It may take up to 4hrs for the accounts to see this feature in the sandbox workspace." [Source: turn3search167]

"We have enabled access to Workspace Agents for the team members listed below in our sandbox. It may take up to 2hrs for full synchronization of group permissions." [Source: turn3search175]

"Sharing a copy of our deck on Technical & Governance controls as requested." [Source: turn3search181]

"Hi Anthony, yes, the 'Enable Agents' permission has been enabled for all members of the workspace." [Source: turn2search110]

"Thanks Anthony, just to confirm that this is the list of users that will require an agent builder role in the workspace? Co-editing of a workspace agent is currently limited to the author." [Source: turn2search104]

--------------------------------------------------------------------------------
Varun Sharma
--------------------------------------------------------------------------------

"Workspace agents were approved for use within the Sandbox environment, with Public data. The difference in this ask is – use of Branding data/ KPMG Branded templates in Sandbox. Will discuss today." [Source: turn3search177]

"Please see below CISO approval, for firm-wide Chat GPT Enterprise users for Holy Grail ChatGPT workspace agent. You may proceed with enablement." [Source: turn3search173]

"Further, wanted to add a keynote condition to this approval – ITS admin to own publishing of this agent, while Business will build." [Source: turn3search173]

--------------------------------------------------------------------------------
Jacques-Yves Gadbois
--------------------------------------------------------------------------------

The available snippets show Jacques-Yves Gadbois copied on security/NITSO approval threads and included in the distribution for the Security approval and Agent Workspaces Show and Tell. [Sources: turn3search172, turn3search173, turn3search181]

Anthony reported in a group chat: "Met with Kasia and Jacques yesterday. They have a plan to close risk / security concerns specifically for WS agents in the context of KPMG Slides / Holy Grail. They are presenting the plan back to NITSO early next week and if they get sign-off there, we should be good to go." [Source: turn3search126]

There was no direct Jacques-Yves quote about Holy Grail/KPMG Slides in the snippets returned, beyond his inclusion on the relevant threads.

--------------------------------------------------------------------------------
Zia Shah
--------------------------------------------------------------------------------

"Approved." [Source: turn3search173]

"Hi Anthony, the team has prioritized this ask, put in extra efforts to expedite and of today, completed the review. Varun or Victoria will relay the approval shortly, noting one concern that has been identified through this review." [Source: turn3search172]

--------------------------------------------------------------------------------
Victoria Akpore
--------------------------------------------------------------------------------

"I am seeking approval for the Holy Grail ChatGPT workspace agent. The solution automates the end-to-end creation of KPMG consulting presentations, improving efficiency, turnaround time, and consistency in deliverables." [Source: turn3search173]

"The agent operates within the ChatGPT Enterprise environment and is designed with a constrained scope, leveraging predefined skills and publicly available KPMG templates. It does not integrate with external systems, connectors, plugins, or external GPTs." [Source: turn3search173]

"Key security controls include strict role-based access restrictions, single builder model with consumer-only access." [Source: turn3search173]

"Data usage is restricted to non-sensitive inputs in alignment with enterprise data classification policies." [Source: turn3search173]

"The solution is assessed as Medium residual risk, primarily due to reliance on third-party LLM processing, where KPMG does not have direct control over inference operations." [Source: turn3search173]

--------------------------------------------------------------------------------
Denease Prinold / Risk
--------------------------------------------------------------------------------

"Any word on Privacy's review and Shripal's review of the product terms for Workspace?" [Source: turn3search173]

"I worked on the RA last night. Anthony and I just wrapped up a good conversation to clarify some items regarding the platform/terminology and scope of this review. I shared the draft risk assessment on screen. I’ll circle back with Rob now to finalize and share with Shripal." [Source: turn3search173]

"Risk would be good to approve the deployment of the Holy Grail Agent after your review." [Source: turn3search173]

"The SAR reported a medium risk." [Source: turn3search173]

"Risk approves also. Rob will follow with his sign-off on the actual document. I’ve made updates to reflect the name change." [Source: turn3search173]

--------------------------------------------------------------------------------
Paul Winton / OGC Privacy
--------------------------------------------------------------------------------

"Kasia, I will confer with Seyi tomorrow morning, but based on the below this agent may fall within the established PIA carveout for agents built on PIA approved applications." [Source: turn3search173]

"OGC Privacy is comfortable that a PIA is not needed for the Holy Grail Workspace Agent" [Source: turn3search173]

"it is built off of ChatGPT Enterprise which has already been PIA approved" [Source: turn3search173]

"it does not introduce any new connectors, external GPTs, plugins, or data sources beyond the existing ChatGPT Enterprise environment" [Source: turn3search173]

"we are a bit closer to the line on privacy compliance than I would normally like to be... but I am comfortable that we can justify our approach in this case." [Source: turn3search173]

--------------------------------------------------------------------------------
Kasia Parent
--------------------------------------------------------------------------------

"The IT team will be ready to roll when they have the green light on any outstanding Risk Management questions." [Source: turn3search173]

"The agent is a low-risk category agent on OpenAI ChatGPT - which is indeed an approved platform." [Source: turn3search173]

"The agent was created using a newer feature of ChatGPT called Workspace (which is similar to copilot studio)." [Source: turn3search173]

"At this time GPT Agent Workspace is still going through last stage reviews - the holy grail agent is being promoted on an exception basis after rigorous review." [Source: turn3search173]

"There are no new or third parties who will gain access to our data by using this agent." [Source: turn3search173]

"Restricted data is not allowed in ChatGPT." [Source: turn3search173]

--------------------------------------------------------------------------------
Shripal Doshi
--------------------------------------------------------------------------------

"Can we please activate in the lab today!" [Source: turn3search167]

"Thank you all for moving so quickly on this!!" [Source: turn3search179]

"I’ve signed off on it. It will be known as 'KPMG Slides' when in production. Holy Grail was our stealth working title while it was being developed in the lab." [Source: turn3search173]

"It’s time to ship KPMG Slides Beta – aka Holy Grail. Great work everyone!" [Source: turn3search173]

================================================================================
KEY THEMES FOR RISK / SECURITY RETROSPECTIVE
================================================================================

1. Terminology confusion appears to have been material.
Anthony explicitly stated after a risk call that Risk "thought 'Workspace' was its own platform hence the excessive risk review" and that he clarified "its workspace agents". Denease later wrote that she and Anthony clarified "platform/terminology and scope" of the review. [Sources: turn3search124, turn3search173]

2. The formal approval basis focused on constrained scope.
The security request stressed no external systems, connectors, plugins, or external GPTs; strict role-based access; single builder model; consumer-only access; non-sensitive inputs; and medium residual risk due to third-party LLM processing. [Source: turn3search173]

3. The condition that ITS owns publishing while Business builds became a core operational constraint.
Varun wrote the condition explicitly. Zack’s later chats show why this caused practical difficulty: redeployment and publishing took time, Kev could not build, Harris had to build, and Zack said they now understood why he wanted publishing access. [Sources: turn3search173, turn2search111]

4. Privacy did not require a separate PIA for the Holy Grail agent, but the privacy approval came with caution.
Paul Winton said OGC Privacy was comfortable a PIA was not needed, but said the rollout was "a bit closer to the line" because Workspace itself had not already been reviewed from a privacy perspective. [Source: turn3search173]

5. UAT sign-off was required even though, in Zack’s words, security was not evaluating anything beyond sign-off.
Scott asked "what is security evaluating?" and Zack replied: "nothing - they just want approved UAT sign off". Zack later sent the formal UAT approval email. [Sources: turn2search107, turn3search182]

6. The operational process remained fragile after approval.
Even after approval and enablement, Zack reported that users could not access the link, while Harris could, potentially because he was an Owner. Anthony asked Kev to confirm enablement and Kev confirmed the "Enable Agents" permission was enabled. [Source: turn2search110]

7. There was a recognised need for a repeatable productionisation framework.
The weekly status thread listed follow-ups to align on the framework/process for productionising workspace agents and present it to risk/security, enable Codex for client work, and establish ITS SLAs. [Source: turn3search125]

================================================================================
SOURCE INDEX
================================================================================

turn2search100 – Email: Re: Skills/Project Holygrail Training Session - Touchpoint
turn2search102 – TeamsMessage: KPMG Slides Training Session Final Update- Touchpoint
turn2search104 – TeamsMessage: Holy Grail admin access / business admin setup
turn2search105 – TeamsMessage: UAT Testing - KPMG Slides
turn2search106 – TeamsMessage: UAT Testing - KPMG Slides / ITS and launch discussion
turn2search107 – TeamsMessage: UAT Testing - KPMG Slides / early access testing
turn2search110 – TeamsMessage: UAT / enablement / production sharing thread
turn2search111 – TeamsMessage: Production launch/redeployment friction
turn2search119 – TeamsMessage: Anthony/Zack security hold-up and training deck discussion
turn3search124 – TeamsMessage: Anthony/Zack risk-call recap and terminology misunderstanding
turn3search125 – TeamsMessage: Advisory AI Transformation – Weekly Status
turn3search126 – TeamsMessage: GTA AI Lab - Lab Rats / release date and risk approvals
turn3search140 – Event: Quick chat on Holy Grail
turn3search141 – Event: KPMG Slide Training Session Updates - Touchpoint transcript excerpt
turn3search150 – File: KPMG Training Slides for June 18th
turn3search167 – Email: Re: Enabling Workspace Agents / early sandbox enablement
turn3search171 – Email: Fw: Workspace Agents Questions / OpenAI clarification
turn3search172 – Email: RE: Urgent: Security approval required today – KPMG Slides / Holy Grail agent
turn3search173 – Email: Re: SAR Approved – Holy Grail Workspace Agent
turn3search175 – Email: Re: Approval for sandbox workspace agents
turn3search177 – Email: Re: Enabling Workspace Agents / branding data in sandbox issue
turn3search181 – Email: RE: Agent Workspaces Show and Tell
turn3search182 – Email: Re: Holy Grail UAT Approval
turn3search169 – Email: Re: SOW Developer / Scott prioritisation quote

================================================================================
END OF DOCUMENT
================================================================================
```

### Appendix B: WA Task Force Teams Chat Evidence (S4)

Source: embedded Teams extract.

Teams connector transcript capture for access failures, build book, UAT sign-off, production builder access request, and product-manager visibility.

```text
# WA Task Force Teams Chat Evidence

Status: Teams connector transcript capture for the KPMG Slides Workspace Agent postmortem.

Captured: 19 June 2026.

Chat: WA Task Force.

Teams chat ID: `19:5cbf0e1a770748379107a850d734240f@thread.v2`

Teams link: https://teams.microsoft.com/l/chat/19:5cbf0e1a770748379107a850d734240f@thread.v2/conversations?context={"contextType":"chat"}

Connector limitation: The Teams `fetch` output provided a conversation transcript and hosted image links, but not per-message timestamps. Message order below is the connector-returned order.

## Participants

- Andrew Cain
- Harris Ghafoor
- Scott Shannon
- Anthony Hui
- Raj Gogia
- Kev Vadgama
- Zack Mindel
- Rishi Sharma

## Evidence Summary

The WA Task Force chat reinforces four findings in the postmortem:

1. **Broader access was not enabled at launch.** Raj reported other users receiving an error. Zack stated that all users outside the initial UAT group were receiving the error, Workspace Agents were still not enabled for the broader workspace, and users outside the group could not see Agents on the left side of their screen.
2. **Go-live still depended on UAT sign-off and a build book.** Andrew stated that UAT sign-off needed to be emailed before the team would deploy, and also required the build book to be completed under Risk/Security requirements.
3. **The build-book requirement was clarified after launch pressure had already surfaced.** Harris specified the minimum build documentation contents: overview, audience, step-by-step build/configuration instructions, assets, ownership/contact details, support model, go-live notes, UAT sign-off, testers/scenarios, known issues/limitations, and screenshots where helpful.
4. **Business-side production builder access remained unresolved.** Zack asked whether Raj could be granted production agent-building access for testing only, not publishing or sharing, to reduce reliance on Harris for updates. Scott noted that small-audience Workspace Agents may need a lighter future process similar to Custom GPTs.

## Extracted Transcript

**Raj Gogia:** Take these client documents and help me create a deck narrative for our final deliverable, including the core storyline, slide flow, and key supporting points.

**Raj Gogia:** Reimagine this slide and give me presentation-ready redesign options that preserve the core message but improve the layout, hierarchy, and overall visual impact.

**Raj Gogia:** Convert this image into a natively editable PowerPoint slide while preserving the structure, key content, and overall visual design as closely as possible.

**Raj Gogia:** Develop a KPMG-style brand asset about a topic I specify, such as a diagram, process visual, map, org chart, or executive-ready graphic.

**Raj Gogia:** Workspace Agent limitations and constraints:

- No GUI
- Runs in Linux, so no Apple-only dependencies are available
- Blocked downloading access on KPMG side
- Cannot install runtime dependencies on the fly; npm install is blocked on KPMG side
- System-level instructions prevent subagents from being spawned without official approval from the user
- Even if subagents are available, they cannot run on frontier models
- Zero control over which reasoning level to use for which task
- Duplicating agents
- Trouble making edits because of timeouts

**Raj Gogia:** Harris, sorry one last request if you happen to have a minute. Could you please add Josh Burslem?

**Harris Ghafoor:** Sure thing. Done.

**Raj Gogia:** Ur the best, thank you!

**Raj Gogia:** Harris, sorry one more thing. I just want to make sure I'm not missing anyone. Would you be able to send a screenshot of who it's currently shared with?

**Harris Ghafoor:** Sure.

Hosted image: https://graph.microsoft.com/v1.0/chats/19:5cbf0e1a770748379107a850d734240f@thread.v2/messages/1781814742535/hostedContents/aWQ9eF8wLWVjYS1kMy02OTcyNTZmYjc2MGUxMjMyNmE4M2RlODc4MTFjMjQxNSx0eXBlPTEsdXJsPWh0dHBzOi8vY2EtcHJvZC5hc3luY2d3LnRlYW1zLm1pY3Jvc29mdC5jb20vdjEvb2JqZWN0cy8wLWVjYS1kMy02OTcyNTZmYjc2MGUxMjMyNmE4M2RlODc4MTFjMjQxNS92aWV3cy9pbWdv/$value

**Raj Gogia:** thank you sir

**Raj Gogia:** Harris, Kev: Other users are getting this error:

Hosted image: https://graph.microsoft.com/v1.0/chats/19:5cbf0e1a770748379107a850d734240f@thread.v2/messages/1781815835425/hostedContents/aWQ9eF8wLWNjYS1kNC0xMTI3M2FiNjE4YTA5OWU1MjlmMmI4OGE4OGRmYzI2NCx0eXBlPTEsdXJsPWh0dHBzOi8vY2EtcHJvZC5hc3luY2d3LnRlYW1zLm1pY3Jvc29mdC5jb20vdjEvb2JqZWN0cy8wLWNjYS1kNC0xMTI3M2FiNjE4YTA5OWU1MjlmMmI4OGE4OGRmYzI2NC92aWV3cy9pbWdv/$value

**Zack Mindel:** All users outside of the initial UAT group that was setup are getting that error. Workspace Agents are still not enabled for the broader workspace. No one outside of that group can see Agents on the left side of their screen.

**Zack Mindel:** FYI - Andrew ^

**Andrew Cain:** thanks

**Zack Mindel:** is this something that can be resolved tonight?

**Kev Vadgama:** Hi Zack, all members that the agent has been shared with have now been added to the UAT group, please could you ask them to try again and let me know if they're still unable to get access to the agent? Thanks

**Raj Gogia:** Thanks Kev

**Raj Gogia:** I've asked people to test and see if it opens, however, I suspect we won't get an answer till tomorrow morning. I'll keep you updated

**Raj Gogia:** For my own knowledge what does the process look like to go live for everyone? Do we essentially ping you and say we're good to go and then you enable it?

**Andrew Cain:** You will need to send me an email stating that we have UAT sign off then I will ask the team to deploy

**Raj Gogia:** Amazing, thanks Andrew. Hopefully we'll get that to you soon then

**Andrew Cain:** you will also need to make sure the build book is completed, as per the RISK / security requirements

**Zack Mindel:** I will build that tonight

**Zack Mindel:** How detailed does it need to be? Just explaining the process we went through today with screenshots?

**Andrew Cain:** i would defer to Harris as to the detail level but i believe that would be a good start

**Andrew Cain:** I am logging off for the evening - thanks for all your efforts guys -

**Harris Ghafoor:** Hi Zack, the build documentation should be detailed enough that someone else could understand how the Workspace Agent was created, what it uses, who owns it, and how it would be supported if needed.

At minimum, please include:

- Overview of the agent: name, purpose, what it does, key use cases, and current version
- Expected audience: who the agent is intended for
- Step-by-step build/configuration instructions: how the agent is created and configured
- Assets: links to the source files/assets used, or attach them directly if easier
- Ownership/contact details:
  - Business owner
  - Technical owner
  - Any key contributors
- Support model: who users or support teams should contact if there are issues
- Go-live/support notes: anything important for deployment, attach UAT sign-off, add who tested it and what scenarios were tested, known issues/limitations
- Include screenshots where helpful

It should be clear enough to satisfy the build book requirement and allow Risk/Security or support teams to understand what was built and how to maintain it.

**Zack Mindel:** sorry lol - here is final version. Should I send over email?

**Andrew Cain:** Good morning folks - any updates on the UAT?

**Raj Gogia:** i'm putting together fixes for all minor issues identified. once i'm done we will run test cases against those issues. If successful we will be good to go

**Andrew Cain:** Ok, sounds good

**Harris Ghafoor:** Thanks Zack. Two minor items:

1. Please include in the "At a Glance" section on page 2 the Use Case ID# for the AI Use Case Intake submission.
2. For the Build and Configuration section on page 5, step 1, can you include the link to the GitHub repo and ensure that Kev and I are granted access to the repo?

Please share the updated document once ready.

**Zack Mindel:** harris you dont have gh

**Zack Mindel:** its been shared with kev

**Zack Mindel:** updated the other points

**Zack Mindel:** and sent by email

**Zack Mindel:** Can you grant Raj access to build agents in prod same as myself so he can test there. It will sped up our time to go live significantly

**Zack Mindel:** He will not publish or share the agent. It is purely for his ability to test in prod rather than calling Harris 100 times today to update.

**Scott Shannon:** This is going to be something we need in the future anyways. People will be permitted to build workspace agents with under 20 people w/o this dev/prod process - similar to how we do it with Custom GPTs now.

**Raj Gogia:** adding Anthony to keep him in the loop as well

**Raj Gogia:** adding Rishi to keep him in the loop as well

**Zack Mindel:** Please let us know if this is possible today
```

### Appendix C: Holg Rail Discussion Transcript Extract (S3)

Source: embedded transcript extract from `Holg rail discussion.docx`.

Plain-text transcript export of the June 18 rebuild/publishing meeting.

```text
1: Holg rail discussion-20260618_130632-Meeting Transcript
2: June 18, 2026, 5:06PM
3: 51m 12s
4: Cain, Andrew started transcription
5: Cain, Andrew   0:04Wow, what did that do?
6: Ghafoor, Harris   0:06Thank you for pulling me in. I didn't have the invite.Haha.
7: Cain, Andrew   0:09Sorry, I literally just sent it right in a second.
8: Parent, Kasia   0:10Paris, do you want, do you want Jacques McCall?
9: Vadgama, Kev   0:11Q.
10: Ghafoor, Harris   0:12That's okay.Um...I don't think we need Jacques. I feel like we know.The key points here, so let me see what Jacques, you know what? He's green. Yeah, let's let me, let's pull him in.
11: Parent, Kasia   0:27Well, he is because he was on an alignment call with us, which we just very promptly dumped in favor of this.
12: Ghafoor, Harris   0:35Ah.
13: Parent, Kasia   0:37But I wonder whether he would have an opinion on the complexity of pushing out code and why the code should not change. So, okay, Anthony, tell us what the problem is.
14: Hui, Anthony   0:52Yeah, so I think it's a this is a great learning experience for us, but so what I'm hearing is to be able to share slash publish a workspace agent in order for Kev or Harris to be able to do that.they would need to essentially rebuild the agent from scratch.
15: Parent, Kasia   1:12Yes, because Open AI has a limitation on co-authoring and sharing agents.
16: Hui, Anthony   1:16Yeah.Exactly, so.
17: Parent, Kasia   1:21Remember, those were the those were some of the issues we flagged around there. It was one of the many issues where we said they're really lacking.
18: Hui, Anthony   1:31So I think that's pretty much the crux of it though, Kasia, is I think in order for Kevin Harris to be, like, we're launching in T-minus 2:00 to Eastern, so.They, apparently, it's quite complex to be able to build. I mean, the team's been working on building this workspace agent for, you know, over three to four months now. So for Kevin Harris to rebuild it from scratch, Zach would have to kind of show them how to do that. That introduces build risk as far as if they get anything wrong as far asthe way it was constructed, any of the UAT that's been done to date. If any of that goes wrong, it introduces build risk as far as the product not actually working. From a maintenance perspective, if there's any updates, bug fixes there on after, that would also have to go through Kevin Harris. So.
19: Parent, Kasia   2:16Yes, they would. Yes, they would. But that was understood, Anthony. That was very clear. Hold on a second. But the, so, Anthony, just one sec, please. So one of the important things was that we added a smoke test or a health test, depending on what organization you work with.
20: Hui, Anthony   2:20I, I saw.Okay, so maybe that was the missing line, so that's the crux of it.
21: Parent, Kasia   2:37is that when the agent is redeployed by the workspace owner, who effectively, risk management and security agreed, were the only people that could publish.They, right, we would do a smoke test after that to make sure it's working. Conducted by the same people that originally built it just to make sure. So there is a bit of a quality assurance element there.
22: Hui, Anthony   3:03Yeah, I think that makes sense. It's getting Kevin Harris to the point where they have rebuilt it. I don't know how long that would take. I think there was probably some cross wires here, Kevin. I...
23: Parent, Kasia   3:13So why, but why don't we, sorry, but why we're, I mean, it sounds like we're assuming they can't rebuild it. Why don't we actually ask them? Like, isn't this just a...
24: Hui, Anthony   3:21So I'm seeing some pushback from what I'm hearing in the business. The complexity required to rebuild Holy Grail from scratch right now and walk Kevin Harris through an application that they're not, I mean, Kevin Harris, you tell me if you're familiar with the workspace agent build process, but that exercise.Would create a lot of friction and complexity that that's what I'm hearing from the business side as far as kind of who's doing that.
25: Parent, Kasia   3:47Why would they not have said that a few days ago?
26: Hui, Anthony   3:49Yeah, I, I think it's what I'm, I mean, it's probably this is the...
27: Parent, Kasia   3:51Fair to be fair to this team, right?
28: Hui, Anthony   3:54Oh, 100%. I don't think anyone's at fault here. I think this is just new information that's coming to light and we just got to figure out a way to navigate around it towards this launch date. So I think that's what I'm focused on. I don't think it's, you know, we're just finding things out and we're kind of adopting.
29: Parent, Kasia   4:09So, Anthony, when when Jacques when Jacques asked for, I think Jacques had a huddle with Zach.at some point because he wait as part of the compensating controls. Zach confirmed, I'm just getting this from Jacques, Zach confirmed that the code can be deployed from GitHub in minutes.So I don't understand where the misconnection is. So is Zach sitting on a client call right now?
30: Hui, Anthony   4:31Oke.He's on a client call right now, yeah. But let me see if I can, maybe we can pull him in and we can just talk through it together.See.
31: Ghafoor, Harris   4:53Yeah, and in terms of what if we could do it, it's definitely something that Kevin and I can follow instructions. Typically, I mean, by standard, there should be build document.And that's usually created when someone's building in for the first time, and we would just replicate the instructions.
32: Vadgama, Kev   5:04Yeah.
33: Hui, Anthony   5:07Yeah.
34: Vadgama, Kev   5:08Yeah, and Anthony, the...
35: Hui, Anthony   5:09I've asked Haque to build that that doesn't exist right now, so it would have to be hopping on the phone right now, walking you through specifically how to build it. Tasha, to your point, like maybe that's easier. What I'm hearing from Zach and team is that that is very complex and it would introduce a significant amount of build risk. So I...
36: Ghafoor, Harris   5:10The.
37: Parent, Kasia   5:26Well...I think so, and we've done that before, by the way, where we actually, when we have a vendor in our space, we literally sit over their shoulder just to make sure it's done right. But I'd want to double confirm the GitHub piece because what you're telling me or what they're telling you now.
38: Hui, Anthony   5:28Yes.
39: Parent, Kasia   5:49Does not line up with what they said to Jacques.
40: Hui, Anthony   5:52Oke.
41: Parent, Kasia   5:53You see what I mean?
42: Hui, Anthony   5:54Yeah, I mean, I'm hearing both things. I can forward the messages that I'm getting. I'm in another group chat where they're stressed out about like the complexity of trying to do this right now. So that, yeah.
43: Parent, Kasia   6:05Well, but I understand that. But Anthony, what you're asking us to do right now.We could get fired for it.To be absolutely clear, we would be going against what security and risk management signed off on.And that's after helping create the compensating controls.
44: Hui, Anthony   6:24Yeah, I, I, I'm not, I'm Kasia. I'm not here to tell anyone to do anything. I'm just gonna play with the facts, so I'm happy to work within it. I think if we need to have a chat with Shripal and just and Jacques and just let them know where we're at, I think this would compromise the launch, it sounds like, and...
45: Parent, Kasia   6:29Yeah, well.I actually think, so that's on your side, that's an escalation. Jacques is my colleague. So what I think we need to do is get Zach on this call and ask Jacques to come in because Jacques spoke to Zach about GitHub. And let's get alignment on that.
46: Hui, Anthony   6:48Yeah.Yeah.Mhm.
47: Cain, Andrew   7:05Let me see if I can add them right now.
48: Hui, Anthony   7:07Yep, sounds good.Well, I'm just pinging Zach right now.
49: Cain, Andrew   7:31Okay, I just tried calling him, so he should hopefully answer.
50: Parent, Kasia   7:37Are we are we able to?Are we able to, I don't know, I'd have to, I don't, Kev, do you have your document handy from what was presented to risk management?
51: Vadgama, Kev   7:53This is the PowerPoint.
52: Parent, Kasia   7:54And was there a discussion on whether we would give temporary access to build and then take it away after validation?As I work, as I work around.
53: Vadgama, Kev   8:04Yeah.Let me just pull that up. So this would be on the PowerPoint slides that we presented.
54: Parent, Kasia   8:12But yeah, you have put together.Hey Jacques, thanks for joining us.Anthony, why don't you explain to Jacques what you're hearing on the other call?
55: Hui, Anthony   8:24Mhm.Yeah, sounds good. So Jacques, I guess the, I think we're learning this new piece of information now. What the business slash build team is telling me is that in order for Kev and Harris to share the workspace agent, they would have to rebuild the entire holy grail agent from scratch.In order to do that, obviously, you know, there could be a period of Zach sitting with them to rebuild it, but I think their concern is there is a significant amount of build risk by them teaching someone else to rebuild their solution that might introduce, that might compromise the way that the product works.introduce net new defects and just be like introduce a lot of friction as far as kind of Kevin Harris, maybe not having been in the workspace agent build platform. So I think they see that as introducing a different kind of risk, but then obviously understanding the controls that we've discussed to date.haven't accounted for Zach being the one to ultimately share the workspace agent to the rest of the workspace. So I think that's kind of where we're at right now is we haven't gotten that formal risk and security approval for Zach to be the one to share, but then finding out now that Kevin Harris would have to be the one to rebuild it and then maintain any net new updates if there are new defects.that would also have to flow through Kevin Harris too. You're essentially assigning build ownership. You're handing the baton of who is the builder to Kevin Harris. And that's kind of the crux of it. We're just trying to work through it.
56: Gadbois, Jacques-Yves   10:10Sorry, when I was exchanging with Zach last week, he said that anybody who has access to the refo on GitHub could redeploy the agent in minutes.So, what's changed? We have that convo.
57: Hui, Anthony   10:20Yeah.Let me, I'm trying to pull him in because I don't want to speak on his behalf on what's changing there. They seem to think that...It's much more complex. So let me, I don't know if my calls aren't going through because he's saying he can join right now, but.
58: Vadgama, Kev   10:38Yeah.
59: Parent, Kasia   10:39He may have, ohh, is he on do not disturb?They wouldn't go through if he's on do not disturb.
60: Hui, Anthony   10:50Okay, give me a sec.
61: Cain, Andrew   11:00He shows green for me. Do you want me to try and invite him?
62: Hui, Anthony   11:01Mhm.
63: Cain, Andrew   11:04I can try and add him to the code if you like.
64: Hui, Anthony   11:05He says he's not he's not getting a call, so maybe we just need to start with him.
65: Cain, Andrew   11:09Hang on, there we go. I'm calling him in right now.
66: Hui, Anthony   11:20Or can we forward on the invite, Vander, and then he can just...
67: Cain, Andrew   11:22Oh, already, already on it.
68: Hui, Anthony   11:25Kev.
69: Cain, Andrew   11:32Yeah, if he doesn't pick up, I sent him the invite as well.
70: Parent, Kasia   11:46Kev, while we're waiting, do you have access to the GitHub repo where the agent is?
71: Vadgama, Kev   11:54I do not currently. I did request access to GitHub that.
72: Parent, Kasia   11:58And they haven't given it to you.
73: Vadgama, Kev   12:01No, I haven't had anything shared with me.
74: Gadbois, Jacques-Yves   12:04Did you get access to GitHub though, Kev?
75: Vadgama, Kev   12:07Actually, I haven't received confirmation of my access to GitHub.
76: Gadbois, Jacques-Yves   12:13Oh.
77: Vadgama, Kev   12:14S.
78: Mindel, Zack   12:15Hi, everyone. Sorry, I'm just at a client workshop, but...
79: Hui, Anthony   12:24No worries, Zach. We just...
80: Mindel, Zack   12:24What, uh, what needs to be confirmed?
81: Hui, Anthony   12:29So we're just catching up on some conversations. Maybe walk the team through the complexity as far as rebuilding the workspace agent via Kevin Harris. And I know that you and Jacques had a conversation around controls and kind of backups using the GitHub repo. I think there's just a disconnect in terms of like why is this process so complex and why is this only coming out now?
82: Mindel, Zack   12:53We are building and maintaining the agent inside of GitHub. When we are building in Codex and testing in Codex and improving it with Codex, it is connected to GitHub so we can easily build, maintain, share, test inside of GitHub. Our workspace agent is an isolated environment and is not connected to anything.So if we want to take something that exists inside of GitHub and use it in a workspace agent, you have to manually upload everything into the workspace agent. The workspace agent itself isn't a super simple drag and draw component. There's.You like, you need to update all of the skills individually and the instruction set individually, and then map the instruction set to the skills. It is slightly inconsistent and sometimes buggy, so I wouldn't necessarily trust someone else to just copy and paste and click go. There is time that is spent to.to building it. So it is, we would be way more comfortable if I am able to build it and share it. I won't build any other agents or share any other agents with other people, but that is the structure of it.
83: Gadbois, Jacques-Yves   14:08So Zach, when you and I are messaging around DR and access to the GitHub repo, I was left with the impression that it was a matter of minutes to push it to a workspace from GitHub. So that's not actually the case.
84: Mindel, Zack   14:22So GitHub isn't connected directly to GitHub. So it's not like you can press a button and the connector is live. It's just that each individual component lives on GitHub. So if someone needed to reconstruct it themselves, it is available there.
85: Gadbois, Jacques-Yves   14:30I.Okay, so there would need to be a whole rebuild book that would go along with access to the GitHub repo for somebody to rebuild this in production.
86: Mindel, Zack   14:50Yes.
87: Gadbois, Jacques-Yves   14:51And we don't have that yet.
88: Mindel, Zack   14:53I can, I can put one together.
89: Gadbois, Jacques-Yves   14:57Okay.So, if we look at, if we look at all the technical controls and governance controls that we presented to Riz.Um...I mean, obviously, there's a few that stick out for me, but require documented, require rebuild documentation for all production agents.is an important control that we agreed to with risk.Obviously, limiting who can deploy in production was another important control.Um...What do we need to tidy up here to be able, like, Zach, this is our first one. So you gotta, you gotta appreciate that there's, we're gonna get better at this, but.
90: Mindel, Zack   15:46The.
91: Gadbois, Jacques-Yves   15:51Without the rebuild documentation, there's a risk. Is it like a showstopper risk? I don't, I can't really say one way or the other right now. How long would it take you to build that rebuild documentation?
92: Mindel, Zack   16:06An hour.
93: Gadbois, Jacques-Yves   16:07You know, using codecs.
94: Mindel, Zack   16:10Yeah, it really is as simple as you click the add skill button and you drag in the folder of the skill that the GitHub repository creates and you copy and paste the instructions into the agent and then you just have to do a once over of any time a skill is mentioned, you tag it back to the skill.It's nothing, nothing actually more than that. It just, it's not, it's not a push to prod function. It's manual intervention to create a workspace agent.
95: Gadbois, Jacques-Yves   16:45Yeah, okay, fair enough. So that's one takeaway, Anthony and Zach. I'm hoping that we can get to ground on ASAP. Kev, we'll follow up on our side around the access to GitHub because it should have been provisioned, but I know that our administrator had a bad accident two days ago.So we have to, Harris, maybe you can take that away and figure out how we make sure Kev has success sooner than later.
96: Ghafoor, Harris   17:08Yep.
97: Gadbois, Jacques-Yves   17:12One of the risks, obviously, Zach, of you being the one who is provided with the builder access in production is, to your point, you can go off and build other agents, basically.without any compliance requirements if you chose to do so. You could also update the KPMG slides agent without any QA, UAT documentation updates, et cetera. So those are two risks. Now, can we work with those risks in the short term?Probably. Would you need sign and blood? You would, for sure.
98: Mindel, Zack   17:50It.
99: Gadbois, Jacques-Yves   17:56Um, so...I think that we need to come to ground on the documentation. We need to determine whether we need to go back to risk and security to modify their understanding of how we were going to deploy. KPNG slides.to get this thing out the door.Mm.
100: Parent, Kasia   18:17And there's one, maybe one other option in that.For just for today.And I don't know whose approval needs to be given.We give Zach access to build.But we immediately take it away, and it's with oversight.Because there is, there, it is possible to add random code.
101: Gadbois, Jacques-Yves   18:45I think that there was, maybe I'm wrong, Kasia, but I think, Kev, correct me if I'm wrong, but if you take away builder access from the owner of the workspace agent, it'll stop working.
102: Parent, Kasia   18:45Yes, I was.
103: Gadbois, Jacques-Yves   18:56Is that true or not true?
104: Parent, Kasia   18:57Oh, yes. Yes.
105: Vadgama, Kev   18:58If it's if it's not shared with anyone, then yes, it will.
106: Parent, Kasia   19:03But then if it's shared, then it loses continuity. Remember, those are some of the issues that OpenAI tool had.
107: Gadbois, Jacques-Yves   19:03Oh.The.
108: Vadgama, Kev   19:14Zach, I'm not sure if you've explored the duplicate option. There is the ability to duplicate an agent.
109: Mindel, Zack   19:18The.Yeah, it it doesn't it doesn't work reliably.
110: Vadgama, Kev   19:22Cain.Oke.
111: Mindel, Zack   19:32What's stopping Kevin from putting in malicious code into the agent and redeploying it?
112: Parent, Kasia   19:32So, what's the plan?all kinds of controls on our ends are.
113: Gadbois, Jacques-Yves   19:45That's the ITS platform governance gate.But, um...So do we need to have a follow-up conversation with Varun and Victoria? Do we need to have a follow-up conversation with Denise to come to ground?
114: Parent, Kasia   20:04Can we see, can we see if Varun is available?
115: Hui, Anthony   20:09Yeah.
116: Cain, Andrew   20:09Yeah, I'll try not him.
117: Hui, Anthony   20:12Because I guess from a timing perspective, Jacques, like we were, when we thought about the launch, we have a firm wide training in 30 minutes. I think that was going to be the official kind of unveiling of this. Zach and I are going to hop on a call with 400 people in a little bit and talk about the slides. So I think ideally we were hoping toBe able to say, like, you know, you can access it, you know, either during the call or live or shortly thereafter, but I think it's all legitimate response. Yeah, no, I know, I, I, I, I used to, I, I used to work in this world cacher, so I'm familiar, but I, I know.
118: Parent, Kasia   20:42Welcome to our world, Anthony. None of this stuff is easy, right? So...I did, listen, I did caution you guys, don't do anything until this thing is up and running.
119: Hui, Anthony   20:54I know, I know. I think Shripal is just really pushing for this to go live, but if these are the constraints, we'll work with you guys, right?
120: Gadbois, Jacques-Yves   20:58Yeah.
121: Cain, Andrew   21:01Folks, we have Varun on the call.
122: Hui, Anthony   21:04Hey, Varun.
123: Sharma, Varun   21:05Heide.
124: Gadbois, Jacques-Yves   21:07Hey, Varun.
125: Sharma, Varun   21:08Heide.
126: Gadbois, Jacques-Yves   21:09We're just, uh, we're just working through a challenge right now with publishing the KPMG slides to prod.We originally expected that Kevin would be the one to publish it.
127: Sharma, Varun   21:24Yeah.
128: Gadbois, Jacques-Yves   21:26It appears that it would be...Very difficult for Kev to do that work effort.It's not a next, next finish.
129: Sharma, Varun   21:34I.
130: Gadbois, Jacques-Yves   21:36The business is requesting that Zach, the builder of KPMG slides, be provided with the ability to build it in prod and share it in prod.It would only be Zach.But that is what would allow them to get this thing published in time for their training sessions, for the go live that they had planned, versus it being Kev that does it.Is there anything in your security approval?
131: Sharma, Varun   22:13Yeah.
132: Gadbois, Jacques-Yves   22:13Because I re-read your security approval and Zia is an approval.that specifically mandated that it be ITS that share or that ITS that share.
133: Sharma, Varun   22:25Yeah, it is. It is my star.
134: Gadbois, Jacques-Yves   22:26Agent.Send the SAR.
135: Sharma, Varun   22:29Yeah, and that is what we've discussed with Zia as well and agreed upon.So we have to take it back.
136: Mindel, Zack   22:38Um...
137: Sharma, Varun   22:40Can I have a quick can I ask a quick question before Zach? Sorry, this publishing happens once.Every time you change it first when you create it, where you build it, and then you want to publish it just once. And then after that, it's iterative only basis if there's any change, right?
138: Parent, Kasia   22:58Correct.
139: Mindel, Zack   22:58Yeah.
140: Sharma, Varun   22:59Mhm.
141: Parent, Kasia   23:00So the plan Varun as a workaround, because we are pushed into a corner here, we want to comply, but the business has scheduled an announcement and training and so on. So the exception here would be that we grant Zach access. Maybe the control would be someone looks over his shoulder while it's being done with a screen share.
142: Sharma, Varun   23:01That's a change control thing, right? Yeah.
143: Parent, Kasia   23:25And then, when it's published...What do we do if we revoke his access? Does the agent stop working after? It's so hold on a sec. Sorry, Varun, hold on. From an open AI perspective, Kev, what happens if we revoke Zach's access to edit the agent?
144: Sharma, Varun   23:32Yeah.Oh no, we...Yeah.
145: Vadgama, Kev   23:45So as long as it's shared and Zach remains a member of the workspace, it should continue to exist. And yeah, if Zach is removed from the workspace, that's when...
146: Parent, Kasia   23:52It should.Okay, hold on.But he won't be right, like he's in the workspace, but if...
147: Vadgama, Kev   23:59Yeah, yeah.
148: Parent, Kasia   24:05Um...Sorry, so we revoke his access. The agents have been shared. Let's say next week they need to make a modification to the agent. We give him back access. He can still modify that same agent.
149: Vadgama, Kev   24:17The builder access.
150: Parent, Kasia   24:24Does it propagate to the users?
151: Vadgama, Kev   24:28It'll have to be republished again.
152: Parent, Kasia   24:31What does that mean to the user experience?
153: Vadgama, Kev   24:32So that means that.So that means once Zach does the update, he'll need to re-share effectively.
154: Ghafoor, Harris   24:43That changes the URL, so Kev.
155: Gadbois, Jacques-Yves   24:43S.
156: Mindel, Zack   24:43No, so sorry, just to confirm, when you share a workspace agent into the workspace directory, everyone has access to add it from that location. If any updates are made to the workspace agent, it automatically applies to the added workspace agent for the end user.
157: Vadgama, Kev   24:44Update, yeah.
158: Mindel, Zack   25:05So they won't even know that anything has changed, correct?
159: Parent, Kasia   25:07It propagates.
160: Vadgama, Kev   25:08No problem, okay.
161: Parent, Kasia   25:09It propagates, right?
162: Mindel, Zack   25:10Yes, it is. It is just an update button in the workspace agent setting, and it'll it goes through all the users.
163: Parent, Kasia   25:17But unfortunately, if we wanted them to be compliant with what security and risk agreed to, we would have to transfer ownership of the agent, which capability again does not exist with open AI.We are supposed.
164: Mindel, Zack   25:32So, sorry, just a question, like in terms of getting this over the finish line today, if I right now hop on the phone with Kev and I walk him through rebuilding it and he's able to share it, then it can go live today.
165: Sharma, Varun   25:48Mhm.
166: Parent, Kasia   25:48We are compliant. We will be compliant. I mean, the question is like, when are you guys doing your training?
167: Mindel, Zack   25:5828 minutes.
168: Parent, Kasia   25:59So is there enough time? I thought you said it was really complicated to build it.
169: Mindel, Zack   26:06No, we can, we can definitely, it's not that it's extremely, it's very straightforward. It's just the OpenAI product itself isn't always 100% accurate. Like I've just run into small issues while I'm doing it. And that can be difficult at times.
170: Hui, Anthony   26:26But it's doable then, Zach. Like you're saying, like it's a knowing, but it's not a show. Okay, then why don't we just repurpose this time for you to sit with Kevin, then at least we're complying with everything we've agreed to.
171: Mindel, Zack   26:28Yeah, so it's very doable.Yes.
172: Parent, Kasia   26:3927 minutes now.
173: Ghafoor, Harris   26:39Yeah, bye.Kev, I need your request for that GitHub account. Ken's asking for it so he can get it applied.
174: Hui, Anthony   26:41Like.
175: Vadgama, Kev   26:47OK, cool, get that over to you.
176: Sharma, Varun   26:48I'm going to stand down for now. You guys just circle back. Let me know. Yes. All right. Cheers. Take care.
177: Parent, Kasia   26:51Yeah, bye, Varun.
178: Cain, Andrew   26:53Thanks, Varun.
179: Parent, Kasia   26:57So the GitHub account, is that needed for Kev to be able to do it? Does it take time to sync?
180: Mindel, Zack   27:02No, I can.I can send him the files directly.
181: Parent, Kasia   27:08Okay, why don't we leave you guys on this call to actually execute and we get out of your way.
182: Hui, Anthony   27:10Okay.
183: Mindel, Zack   27:17Yeah.
184: Hui, Anthony   27:17Agreed.
185: Ghafoor, Harris   27:19I'll stay and listen and observe.
186: Parent, Kasia   27:19Oke.
187: Gadbois, Jacques-Yves   27:21Let's do that.
188: Parent, Kasia   27:21Yeah, Harris.
189: Hui, Anthony   27:21Right on.
190: Parent, Kasia   27:23I, I'm running away.
191: Gadbois, Jacques-Yves   27:23Look up.And Zach, please, Anthony, please make sure we also, after we get through this fire, that we deal with the rebuild documentation.
192: Hui, Anthony   27:33Yeah, yeah, Zach and I already messaged him on the side, and I think it's a great call.
193: Ghafoor, Harris   27:34Definitely.
194: Gadbois, Jacques-Yves   27:38OK, so.
195: Parent, Kasia   27:38Anthony, I'm going to call you direct for a sec, okay?
196: Hui, Anthony   27:41Sure, yeah.
197: Parent, Kasia   27:42Thanks.
198: Gadbois, Jacques-Yves   27:42All right, we'll leave, we'll leave you guys to it, and then we'll circle back on the right process to follow going forward once we get past. OK. All right, thanks guys.
199: Hui, Anthony   27:49Sounds good. Thanks, John. Appreciate you.
200: Vadgama, Kev   27:53Thank you.
201: Ghafoor, Harris   27:54Thanks.
202: Cain, Andrew   27:56Guys, want me to stay just to listen in and then let everyone know when we're done? Or I can go off camera if you're afraid of looking at my face. That's okay.
203: Ghafoor, Harris   28:04Now you can listen in.
204: Mindel, Zack   28:05Um, I am currently...Oh, I'm at a, I'm literally standing outside of South Lake Hospital right now.because we did a session with them, with their executive leadership team this morning. I'm not actually on my computer. Can you? So, Kevin, can we?Can you try to duplicate the agent? Can we just see what happens? Because when I've been trying to duplicate it, it just gives me a fail.
205: Vadgama, Kev   28:31Yep.Yep.Okay, let me try and duplicate now. And good news, Harris, I've just tried to go in to github.com and I seem to be able to access it.
206: Ghafoor, Harris   28:49Nice. Thank you.
207: Vadgama, Kev   28:50Although I didn't receive any formal confirmation that I was given access, so...
208: Mindel, Zack   28:54Well, we'll give you access to the KPMG slides repo.
209: Vadgama, Kev   29:00Thank you. So I'm just going to hit duplicate now.
210: Mindel, Zack   29:05If the duplicate function works, then it becomes easy because I can build a pre-prod version of it and then you would just duplicate it and share that. But as you can see, it loads for a bit and then a red error screen kind of pops up.
211: Vadgama, Kev   29:13Okay.
212: Mindel, Zack   29:25Yeah, so that's the same issue that I've encountered each time.
213: Ghafoor, Harris   29:25Yeah, Journal.
214: Mindel, Zack   29:30So I've had to build it, like if I want to change things substantially, I have to build it again from scratch, which is just an annoying process.
215: Vadgama, Kev   29:41Mhm.
216: Mindel, Zack   29:42Um...
217: Vadgama, Kev   29:43So, in that case...
218: Mindel, Zack   29:44Let me see if I can forward you.Some files from my.
219: Vadgama, Kev   29:53So, you've got one, two, three, 4, 7 skills, and you've got a couple of files here, which I believe are just fonts.
220: Mindel, Zack   29:58Yeah.Yeah.Yeah, I'm just trying to download the workspace package and send it to you on Teams.Okay, were you able to receive that zip file?
221: Vadgama, Kev   30:46Just checking now.
222: Mindel, Zack   30:50I sent it to you over to.
223: Vadgama, Kev   30:52It's popping up now.Yep, I'm just downloading that to my machine.Okay, just unzipping the content to my downloads folder.
224: Mindel, Zack   31:27Okay, inside of that folder.There's going to be 8 artifacts. There's going to be 7 folders and one markdown file.
225: Vadgama, Kev   31:40Kev.
226: Mindel, Zack   31:41The 7 folders are the seven skills, and the markdown file is the agent instruction set.
227: Vadgama, Kev   31:50Oke, I see that now.
228: Mindel, Zack   31:51Okay, so now you can go back into the browser.
229: Vadgama, Kev   31:57Mhm.
230: Mindel, Zack   31:58and go to agents and go to create.In the top right, create agent.And then, yeah, click start blank.
231: Vadgama, Kev   32:11Yes.A blank.
232: Mindel, Zack   32:16Okay, you can name it KPMG slides beta.You can click, click the little icon.
233: Vadgama, Kev   32:29Which is here.
234: Mindel, Zack   32:29Like the little, no, like the emoji guy above KPMG slides. Yeah. And pick the, like the canvas one. It looks like a, like an art canvas.
235: Vadgama, Kev   32:32Yeah.
236: Mindel, Zack   32:44To the left of the fire one.
237: Vadgama, Kev   32:47That one there.
238: Ghafoor, Harris   32:47Oh, middle row.
239: Mindel, Zack   32:47Yeah, that one and click the, click the little, click the colors next to it.I click it again and click the little colors.
240: Vadgama, Kev   32:59Their icons, yep.
241: Mindel, Zack   33:00No, no, click characters and then hover over. Yeah, there's like a, yeah, that ****.
242: Vadgama, Kev   33:04Oh, there's a palette. Okay. Yeah.
243: Mindel, Zack   33:06And pick the purple one, the second one from the right.Yeah, perfect. Okay. So the first thing you can do is open up the agents.md file that I sent you. Select everything and paste it where it says instructions.
244: Vadgama, Kev   33:23Mhm.Okay, just opening up that file now.Can I upload directly in or not?
245: Mindel, Zack   33:43No, no.
246: Vadgama, Kev   33:57And you mentioned the instruction.
247: Mindel, Zack   34:03Yeah, so once you copy all the text from the agents.md file, like you can just click anywhere and command A.
248: Vadgama, Kev   34:12Copy, and...
249: Mindel, Zack   34:13Yeah, copy it and then paste it right under where it says instructions. It says give your agent, yeah, if you just paste it right there. Okay, so you can scroll up now.
250: Vadgama, Kev   34:21And.
251: Mindel, Zack   34:28Okay, now where you see it, it says add skill.
252: Vadgama, Kev   34:34Mm.
253: Mindel, Zack   34:35Click upload skill to on the left side underneath add skill and you have to 1 by 1 either upload them or drop them in directly all seven of them one at a time.
254: Vadgama, Kev   34:39Yep.Oke.
255: Mindel, Zack   34:51Now you can see why it's an annoying process.
256: Ghafoor, Harris   34:54Man, they don't make it easy for you.
257: Vadgama, Kev   34:55Yeah.
258: Mindel, Zack   34:57No, this is like, I exactly like the reason why I wanted access to it is because if we want to change one word in one of these skills, you have to pretty much remove, remove everything, change everything, and then this isn't even the most tedious thing. We're going to have to go through the entire instruction set and anytime you see any reference to a skill.
259: Ghafoor, Harris   34:58Why drop balls?
260: Vadgama, Kev   35:13Cain.
261: Mindel, Zack   35:17You have to delete the word and actually tag it manually yourself.So it's not a complex process. It's an insanely tedious, annoying process.
262: Ghafoor, Harris   35:34Very good feedback for open AI. Oh, it timed out.
263: Mindel, Zack   35:37Open AI, so...Yeah, try a difference. Did you drop in the file or did you select it?
264: Vadgama, Kev   35:41First time now.I dragged, no, I dragged and dropped, or tried to.
265: Mindel, Zack   35:50Try to select a.
266: Vadgama, Kev   35:56I upload a full.So, it's not allowing to upload here.
267: Mindel, Zack   36:21See.
268: Ghafoor, Harris   36:21It drills down when you choose the folder in upload folder.
269: Vadgama, Kev   36:25Yeah, let's try with this option here, which is just the upload folder.
270: Ghafoor, Harris   36:43I'll be back in a minute. I know this will take some time.
271: Vadgama, Kev   36:45Worries.
272: Ghafoor, Harris   36:49Kev, are you okay with other meetings and stuff like that, especially with tenants?
273: Vadgama, Kev   36:52Um, I am, yes.
274: Ghafoor, Harris   36:55Okay, good. Just making sure.
275: Vadgama, Kev   36:57Kev.
276: Mindel, Zack   37:26Can you try a?Try a different one. Try dragging in one of the other files.
277: Vadgama, Kev   37:34Mm-hmm.So KPMG brand assets, let's try that.
278: Mindel, Zack   37:47Nice, okay. So keep going through and then the ones that are stuck, we can figure it out there.
279: Vadgama, Kev   37:58Oke.Skill.This wants to reimagine slide.
280: Mindel, Zack   38:51Three for seven.Having fun, Kev?
281: Vadgama, Kev   40:46Haque.
282: Mindel, Zack   40:48Yes.
283: Vadgama, Kev   40:49Bui.Having a whale of a time here.
284: Mindel, Zack   40:51Oke.
285: Cain, Andrew   40:51I think we need to, I think we need to redefine the definition of fun there, Kev.
286: Vadgama, Kev   40:56Yeah.
287: Mindel, Zack   40:59Ohh.
288: Vadgama, Kev   41:01I'm glad you only have 7.If only that duplicate option.functioning.
289: Mindel, Zack   41:09Yeah, the duplicate option would be super helpful.
290: Vadgama, Kev   41:13Yeah.It's weird, I don't know why it's timing out on the...Image to PPTX light.
291: Mindel, Zack   41:21What?
292: Vadgama, Kev   41:24Um...Let's try again.
293: Mindel, Zack   41:27Okay.Let me try to send you.Um...Okay, I'm gonna I'll try to figure that out while that's happening while I'm so six of the seven skills are uploaded, correct?
294: Vadgama, Kev   42:47See.
295: Mindel, Zack   42:49One, two, three, 4, 5, 6. Okay. I just sent you another zip titled fonts.
296: Vadgama, Kev   42:58Mhm.Yes, downloading that one now.
297: Mindel, Zack   43:02Yeah, so when you, where it says files, you'll see it says memory. Next to it, it says upload files. In this section, you can either upload files or upload a folder. It is very important that you upload the folder, and the folder is the fonts folder.
298: Vadgama, Kev   43:08Mmh.Yeah.Okay.Yeah.Oke.
299: Mindel, Zack   43:21For some reason, if you upload the files instead of the folder, it no longer works.
300: Vadgama, Kev   43:27Just unzip that fine.And that is tedious.
301: Mindel, Zack   43:40You're not, you're not even at the best part yet, Kev.
302: Vadgama, Kev   43:43Yeah.So sorry, can you just repeat the instructions on the fonts? Is it the folder?
303: Mindel, Zack   43:54Yeah, so upload the folder.
304: Vadgama, Kev   43:55Oke.Should take.
305: Mindel, Zack   44:16Okay, let me see.
306: Vadgama, Kev   44:17Oke.
307: Mindel, Zack   44:22It says two files. Let me just confirm something.Can you click on where it says 2 files?Perfect.
308: Vadgama, Kev   44:41Mhm.
309: Mindel, Zack   44:42Um...One second.File slash.Why is it?I wonder where that, that one second, let me just see something, because it should just be files slash fonts, not files slash fonts with the size.Um...Sorry, can you go back? So, can you delete that?
310: Vadgama, Kev   45:30Ohh.Okay.
311: Mindel, Zack   45:34Just even click the delete on the right.
312: Vadgama, Kev   45:36Yeah.
313: Mindel, Zack   45:42Delete that as well.And click back.Can you show me what it what the folder looks like in your downloads?
314: Vadgama, Kev   45:59Do you want me to just remove?
315: Mindel, Zack   46:01Yeah, rename the folder to just fonts.And can you open that folder actually just so I can see what's in it?
316: Vadgama, Kev   46:11Mhm.
317: Mindel, Zack   46:16Okay, open up that fonts folder.Okay, so that fonts folder that you just opened, that's the one that you need to upload.
318: Vadgama, Kev   46:26Ah, okay.Then drill down into.
319: Ghafoor, Harris   46:48It's like nested into the fonts folder, right?
320: Mindel, Zack   46:52Yeah.Okay, now click on the files.The font's perfect.Okay, well I figure out the image to PPTX then. Okay, as you scroll through the instructions, we call on all of those skills many, many times throughout it.
321: Vadgama, Kev   47:30Mmh.
322: Mindel, Zack   47:31we need to actually reference the real skill. So to do this, see where it says slide planner, for example?
323: Vadgama, Kev   47:42Yeah.
324: Mindel, Zack   47:43Like if you just put your cursor like to the right of it and click space.Or sorry, I actually put it before it.And now type the at symbol.And now click the slide planner from there.And now delete the other slide planner.So you have to do that all.
325: Vadgama, Kev   48:11All of them, yeah.
326: Mindel, Zack   48:13For every single one, and then the whole instruction set, so this one takes takes a bit of time, unfortunately.While you do that, I will.
327: Hui, Anthony   48:33Zach, are you going to, we're like t-minus 5 minutes here. I want to give you the intro on the call. Are you going to be able to join? Like, could you and Kev pick this up after the training? Like, we don't have to necessarily say it's live right now. We can see, yeah, it'll be at the end of the day, you will see this pop up, but...
328: Mindel, Zack   48:47Yeah, for sure.
329: Hui, Anthony   48:51Um, this is kind of an early, an early view of what to expect. Like, I can, I can play around with how we talk about it, but I, I just want, I want you on the call.
330: Mindel, Zack   49:00Yeah, so Kev, honestly, just keep going through this until they're all done and then we can connect after and I'll figure out the last skill with you.
331: Vadgama, Kev   49:06Oke.No worries. Thanks.
332: Mindel, Zack   49:14So, wherever you see the...The image to PPTX, you just obviously won't be able to call the skill there because it's not in yet.
333: Vadgama, Kev   49:23And I'll just try to re-upload it again and see if it...
334: Mindel, Zack   49:26Yeah, and in the meantime, I'll send you another one if that works.
335: Vadgama, Kev   49:27and magically works.Oke.
336: Mindel, Zack   49:33Okay, thank you very much.
337: Vadgama, Kev   49:33Thanks, so I'll pause here. Thank you.
338: Hui, Anthony   49:35Exactly. Thanks, Kev. Appreciate it.
339: Cain, Andrew   49:36Cheers, guys.
340: Mindel, Zack   49:36Thank you.
341: Vadgama, Kev   49:36Cheers. No worries. Thanks. Bye.
342: Cain, Andrew   49:38See you later. Bye.
343: Mindel, Zack   49:39But.
344: Hui, Anthony   49:39All right, thanks, Andrew.
345: Ghafoor, Harris   49:44Alright, you guys good?
346: Cain, Andrew   49:45Yeah, I'm gonna hit.
347: Ghafoor, Harris   49:46Have you probably need to take a break?
348: Cain, Andrew   49:48I'm going to go to my next meeting and circle back. I've already drafted an email as per Glen's direction to sort of let everybody know that it's live, including Glen, Jack, Kasia and just the whole team, okay? So once it's rocking and rolling and rocket ship's gone, let me know and then I'll fire that off.
349: Ghafoor, Harris   49:49And.Yeah, well, we will, and Kev, if you haven't taken like lunch or a break, please do so. Do let me know if there's any, you know, any concerns about not having access to GitHub or in the repos or anything like that, and yep.
350: Cain, Andrew   50:14Hell yeah.
351: Vadgama, Kev   50:24access, but I don't see, well, I know Zach, Jacques had mentioned he was going to share the repo with me, but I don't think he has.
352: Ghafoor, Harris   50:34That's probably, I'm betting he probably hasn't, but yeah, you can bring it up. Actually, you know what, I'll send them an email, so don't worry, and I'll include Andrew in that too. So don't worry about that. And then what was I going to say last thing? I think I forgot. Oh, later when dust settles, let's make a ticket to OpenAI about the...
353: Vadgama, Kev   50:36Yeah.Yep.
354: Ghafoor, Harris   50:53not able to duplicate piece because that should definitely go to OpenAI. Maybe that might save a lot of the headache when it comes to this.
355: Cain, Andrew   50:55Mm-hmm.
356: Vadgama, Kev   50:56Yeah.Oh yeah, yeah.
357: Cain, Andrew   51:04All right, guys, give us a shout if you need anything. Cheers, bye.
358: Ghafoor, Harris   51:05Thank you.
359: Vadgama, Kev   51:06Thank you.
360: Ghafoor, Harris   51:07Bye-bye.
361: Vadgama, Kev   51:07Will do. Cheers. Bye.
362: Cain, Andrew stopped transcription
```

### Appendix D: Post-Launch Teams Evidence Extract (S7)

Source: embedded Teams extract.

Newer Teams evidence from 19 June onward, including launch availability, WA Task Force, UAT updates, feedback-form access, risk terminology, source/provenance, and agent-task permissions.

```text
# Post-Launch Teams Evidence Extract

Extracted: 24 June 2026.

Scope: Microsoft Teams searches and fetches for newer KPMG Slides / Holy Grail / Workspace Agent conversations from 19 June 2026 onward.

Purpose: Add post-launch evidence to the master ledger. This file preserves source detail; it is not memo prose.

## Search Scope

- `KPMG Slides`, sent after 2026-06-19.
- `Holy Grail`, sent after 2026-06-19.
- `Workspace Agent`, sent after 2026-06-19.
- Follow-up fetches for WA Task Force, CA ChatGPT Enterprise Community, UAT Testing, and selected direct/chat messages.

## Key Extracts

### WA Task Force: Release, Governance, And Post-Launch Configuration

Source: Microsoft Teams chat, `WA Task Force`.

Fetched transcript includes the following post-launch evidence:

- On the first day of release, an end-user support question was already routed to the project team.
- A participant joked that "on the first day of KPMG Slides they ask when Slides 2 is being released."
- Scott Shannon asked whether there was an approval blocker and stated there were "20-30 agents" that the team wanted to start testing in dev and move to pre-prod.
- Zack Mindel said the team should begin the process of allowing the team to build and publish the Workspace Agent.
- Rishi Sharma stated his view that the item should go back to Risk and be reclassified, because he did not understand why it was treated differently than GPTs or Skills, and because the technical delta was Codex App Server as runner compared with Responses API in chat.
- Scott Shannon stated that leadership did not like the GPT model and appeared to be using Workspace Agent approval to bring agent approval into a different process; he added that for agents under 20 people the same process should not apply.
- Scott Shannon noted that other agents were being ported from an approval process that "wasn't working."
- Rishi Sharma stated that submitting an agent intake to get access to the application before testing whether an idea is viable is backwards and causes people to build on personal computers.
- Scott Shannon agreed and said the process should allow people to build like GPTs, with a badging process and warning for unreviewed agents.
- Rishi Sharma raised a post-launch permissions issue: users could set or attempt to run KPMG Slides as a scheduled automation, but users had insufficient permissions to remove the automation.
- Raj Gogia tested and reported he could not even create the scheduled task; Rishi later reproduced insufficient permissions.
- Raj Gogia noted consumption-based cost concerns for frequent automations.
- Anthony Hui suggested a weekly alignment process for workspace-configuration changes and a separate tracker tab for configuration.

Evidence use:

- Supports post-launch demand and immediate support/configuration issues.
- Supports the risk-classification theme: participants compared Workspace Agents with GPTs and Skills and questioned the approval framework.
- Supports the operating-model theme: teams needed a way to build, test, publish, and configure agents without blocking viable experimentation.
- Supports cost/control theme for scheduled agent tasks.

### CA ChatGPT Enterprise Community: Public Training Recap And Launch Availability

Source: Microsoft Teams channel message, `CA - ChatGPT Enterprise Community / General`.

Message title: `Training Recap & Introducing KPMG Slides (Beta)`.

Created: 2026-06-22T17:10:03.809Z.

Author: Esha Chopra.

Key facts:

- KPMG Slides (Beta) was described as "a workspace agent now available within the ChatGPT Enterprise ecosystem."
- The message shared resources from the KPMG Slides training session.
- The training scope included usage guidance, best practices, creating presentation drafts from prompts and source materials, end-to-end presentation generation workflows, risk and compliance considerations, and refining/editing generated decks.
- The message linked a 2026-06-18 training recording, FAQ, and training resources.

Evidence use:

- Supports chronology: broad Teams communication occurred on 22 June 2026 after the June 18 training.
- Supports launch-positioning evidence: KPMG Slides was presented as available within ChatGPT Enterprise.
- Supports the distinction between training/UAT and operational readiness.

### UAT Testing: Post-UAT Product Updates

Source: Microsoft Teams chat message, `UAT Testing - KPMG Slides`.

Created: 2026-06-19T21:19:16.516Z.

Author: Raj Gogia.

Key facts:

- UAT testers were told "KPMG Slides (Beta) has been updated."
- Listed changes included clearer autonomous workflow detection, better resume behavior, safer image-to-PowerPoint routing, more reliable KPMG visual generation, and packaged brand reference materials.
- The message provided an agent link for testers who had not already tried it.

Evidence use:

- Supports that product behavior and packaging were still being changed after the initial approval/UAT period.
- Supports the need for regression/release gates beyond user sign-off.
- Supports the source-package issue: brand reference materials were packaged to avoid inaccessible paths.

### Direct Chat: Feedback Form Collaboration Access

Source: Microsoft Teams direct/chat message.

Created: 2026-06-22T17:09:29.259Z.

Author: Raj Gogia.

Key fact:

- Raj Gogia sent the KPMG Slides feedback form collaboration link and wrote that if it did not work, he had already requested that the recipient's email be specifically added.

Evidence use:

- Supports that even post-launch feedback collection had access/collaboration friction.
- Supports a broader operating-readiness theme: launch artifacts such as feedback intake need permission validation too.

### Direct Chat: Risk Classification Terminology

Source: Microsoft Teams direct/chat message.

Created: 2026-06-19T20:28:18.068Z.

Author: Anthony Hui.

Key fact:

- Anthony Hui wrote that Risk thought the "Workspace" in Workspace Agent was a different platform, making the assessment more complex.

Evidence use:

- Corroborates prior evidence that terminology confusion affected risk classification.
- Supports the interpretation that incremental risk should have been assessed against the actual delta from ChatGPT Enterprise / GPTs / Skills.

### Knights Of The Round Table: Off-Repo Changes And Release Provenance

Source: Microsoft Teams chat message, `Knights of the Round Table`.

Created: 2026-06-22T17:31:29.279Z.

Author: Rishi Sharma.

Key fact:

- Rishi Sharma asked for all off-repo changes to be integrated into the repo and asked someone to separately manage the Workspace Agent and Codex plugin before marking v1 as released on GitHub.

Evidence use:

- Supports source-of-truth and release-provenance concerns after launch.
- Supports the theme that GitHub state, Workspace Agent state, and plugin state needed explicit reconciliation.

## Evidence Limitations

- The WA Task Force fetch returns a recent transcript without per-message timestamps for each line.
- Hosted images were represented as Microsoft Graph hosted-content URLs, not local screenshots.
- Some direct-message paths are chat-specific and may not identify every participant in this extracted file.
```

### Appendix E: Post-Launch Outlook Evidence Extract (S8)

Source: embedded Outlook extract.

Newer Outlook evidence from 19 June onward, including launch announcement, practice-specific follow-up, build documentation, updated documentation, and final UAT confirmation.

```text
# Post-Launch Outlook Evidence Extract

Extracted: 24 June 2026.

Scope: Outlook Email searches and fetches for newer KPMG Slides / Holy Grail / Workspace Agent conversations from 19 June 2026 onward.

Purpose: Add launch communications, build-documentation, and UAT-confirmation evidence to the master ledger. This file preserves source detail; it is not memo prose.

## Search Scope

- `"KPMG Slides" received>=2026-06-19`
- `"Holy Grail" received>=2026-06-19`
- `"Workspace Agent" received>=2026-06-19`

## Key Extracts

### Enterprise Launch Announcement

Source: Outlook email.

Subject: `Introducing KPMG Slides (Beta) within ChatGPT Enterprise | Nouveau! KPMG Slides (version bêta) dans ChatGPT Enterprise`.

Sender: CA-FM ChatGPT.

Recipients: CA-DL ChatGPT User Group.

Received: 2026-06-22T16:28:51Z.

Key facts:

- The email announced "a new agent in ChatGPT Enterprise: KPMG Slides (Beta)."
- The stated purpose was to help create KPMG-branded PowerPoint decks more efficiently.
- Capabilities listed: create, structure, articulate, refine, reimagine, and convert.
- Getting-started instructions directed users to log into ChatGPT, browse Agents, and select KPMG Slides (Beta) under the KPMG CA directory tab.
- Example prompts covered deck planning, research for deck content, slide reconstruction, and deck creation.
- The beta trial was described as available "as of today" for teams to explore, learn, provide feedback, and refine functionality.
- The launch email linked a feedback form, training materials, the ChatGPT Enterprise portal, and risk guidelines.
- The launch email stated that creating a deck typically costs $2-$10 depending on deck length and complexity, with future chargeback information to follow.
- Responsible-use language told users to follow engagement guidelines, review risk guidelines if unsure, and review AI-generated content before use in reports, publications, and client deliverables.

Evidence use:

- Confirms broad launch timing: 22 June 2026.
- Confirms launch positioning: KPMG Slides was launched as a ChatGPT Enterprise Workspace Agent.
- Confirms communication included usage, feedback, cost, and responsible-use guidance.
- Confirms that broad availability was communicated before all post-launch operating questions were resolved in Teams.

### Follow-Up: Practice-Specific Training Question

Source: Outlook email thread forwarding the enterprise launch announcement.

Subject: `Re: Introducing KPMG Slides (Beta) within ChatGPT Enterprise | Nouveau! KPMG Slides (version bêta) dans ChatGPT Enterprise`.

Latest sender: Rishi Sharma.

Received: 2026-06-22T18:48:11Z.

Key facts:

- John Cho forwarded the launch announcement and asked whether it was the slide creator discussed the previous week.
- Rishi Sharma confirmed yes.
- John Cho asked whether TS-specific training was needed.
- Rishi Sharma responded that the tool should be self-explanatory and that there had been firm-wide training the prior week.
- Rishi also noted that it does not use the TS Diligence template exactly, but outputs in KPMG brand, and that it would be the base for a future FDD Report Writer agent.

Evidence use:

- Supports immediate business-interest and enablement questions after launch.
- Supports that launch material triggered practice-specific questions about fit with TS/FDD standards.
- Supports the distinction between general KPMG-branded output and practice-specific deliverable standards.

### Build Documentation Sent To IT / Security Stakeholders

Source: Outlook email.

Subject: `KPMG Slides Build Documentation`.

Sender: Zack Mindel.

Recipients: Kev Vadgama, Andrew Cain, Harris Ghafoor.

CC: Scott Shannon, Rishi Sharma, Raj Gogia.

Received: 2026-06-19T15:16:25Z.

Key fact:

- Zack Mindel wrote: "Attached is the KPMG Slides Build Documentation."

Evidence use:

- Confirms build documentation was sent to IT / security stakeholders on 19 June 2026.
- Confirms the build documentation existed as an attachment, but this connector extract did not retrieve the attachment body.

### Updated Build Documentation

Source: Outlook email reply.

Subject: `Re: KPMG Slides Build Documentation`.

Sender: Zack Mindel.

Recipients: Kev Vadgama, Andrew Cain, Harris Ghafoor.

CC: Scott Shannon, Rishi Sharma, Raj Gogia.

Received: 2026-06-19T15:57:38Z.

Key fact:

- Zack Mindel wrote: "Here is the updated Documentation."

Evidence use:

- Confirms the build documentation changed the same day it was first sent.
- Supports documentation timing and version-control concerns.

### Final UAT Confirmation With Build Documentation

Source: Outlook email.

Subject: `Re: Holy Grail UAT Approval`.

Sender: Zack Mindel.

Recipients: Andrew Cain, Kev Vadgama, Harris Ghafoor, Anthony Hui.

CC: Rishi Sharma, Raj Gogia.

Received: 2026-06-22T12:56:13Z.

Key facts:

- Zack Mindel wrote: "Giving the final UAT confirmation."
- He also wrote that the build documentation was attached and included the list of UAT testers.
- The thread includes the June 18 UAT sign-off: "Signing off on UAT for KPMG Slides (Beta) Workspace Agent."
- Andrew Cain responded on June 18: "Thanks Zack."

Evidence use:

- Confirms final UAT confirmation was resent or supplemented on 22 June 2026.
- Confirms build documentation and UAT tester list were tied together as part of the deployment evidence package.
- Supports that build documentation and UAT evidence were still being packaged on launch day.

## Evidence Limitations

- The Outlook connector confirms attachments exist but did not expose the attachment files for local preservation.
- The launch email body is HTML with embedded images and French translation; this extract preserves English-language facts rather than full formatting.
- GitHub notification emails appeared in the search results and may evidence post-launch hardening work, but they were not extracted here because the request was focused on Outlook/Teams conversations.
```
