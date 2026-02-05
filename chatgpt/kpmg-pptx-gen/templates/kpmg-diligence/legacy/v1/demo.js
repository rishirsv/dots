#!/usr/bin/env node
/**
 * demo.js — NVIDIA FDD Kickoff Brief
 * Generates a comprehensive, dense Financial Due Diligence deck
 * with charts on every content slide.
 *
 * Run: node demo.js
 * Output: output/kpmg-demo-deck.pptx
 */

'use strict';

const path = require('path');
const fs = require('fs');
const KPMGDeck = require('./kpmg-deck');

const B = '00338D'; // KPMG Blue shorthand

async function main() {
  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const deck = new KPMGDeck({
    title: 'NVIDIA Corporation — Financial Due Diligence',
    author: 'KPMG LLP',
    subject: 'FDD Kickoff Brief',
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // COVER
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addCover({
    title: 'Financial Due\nDiligence\nKickoff Brief',
    subtitle: 'NVIDIA Corporation (NVDA) \u2014 Semiconductors & Accelerated Computing',
    date: 'January 2026',
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: EXECUTIVE SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addSection({
    number: 1,
    title: 'Executive\nSummary',
    subtitle: 'Key findings, transaction context, and diligence focus areas',
  });

  // ── KPI Dashboard ──
  deck.addKPIDashboard({
    title: 'Financial Snapshot',
    strapline: 'NVIDIA FY2025 results reflect historic growth driven by Data Center AI demand; margin compression emerging in 9M FY2026',
    kpis: [
      { value: '$130.5B', label: 'FY2025 Revenue', delta: '+114% YoY' },
      { value: '75.0%', label: 'Gross Margin (Peak)', delta: '\u2193 to 69.3% in 9M FY2026' },
      { value: '$64.1B', label: 'Operating Cash Flow', delta: '+128% YoY' },
      { value: '61%', label: 'Top-4 Cust. Conc.', delta: 'Q3 FY2026' },
    ],
    chart: {
      type: 'area',
      data: [
        { name: 'Quarterly Revenue ($B)', labels: ['Q1\nFY24', 'Q2\nFY24', 'Q3\nFY24', 'Q4\nFY24', 'Q1\nFY25', 'Q2\nFY25', 'Q3\nFY25', 'Q4\nFY25', 'Q1\nFY26', 'Q2\nFY26', 'Q3\nFY26'], values: [7.2, 13.5, 18.1, 22.1, 26.0, 30.0, 35.1, 39.3, 42.3, 50.0, 55.5] },
      ],
      opts: { showValue: true, valueFontSize: 6, lineSmooth: true, catAxisLabelFontSize: 5, chartColors: ['1E49E2'] },
      source: 'Source: NVIDIA quarterly filings; fiscal year ends January',
    },
  });

  // ── Key Headlines (with chart) ──
  deck.addTextWithChart({
    title: 'Key Headlines',
    strapline: 'Preliminary analysis of public filings and industry data reveals five critical themes that will shape the scope of confirmatory diligence',
    body: [
      { text: 'Revenue Explosion', bold: true, color: B },
      'NVIDIA more than doubled its revenue in FY2025, generating $130.5B compared to $60.9B in the prior year. The first nine months of FY2026 have already reached $147.8B, placing the company on a run-rate approaching $200B.',
      { text: 'Margin Compression', bold: true, color: B },
      'Gross margins peaked at 75.0% in FY2025 but have since compressed to 69.3%, driven by unfavorable shifts in product mix, elevated inventory provisions, and rising input costs across packaging and memory.',
      { text: 'Customer Concentration', bold: true, color: B },
      'Four direct customers each accounted for more than 10% of quarterly revenue in Q3 FY2026, creating meaningful counterparty exposure tied to the hyperscaler capital expenditure cycle.',
      { text: 'Inventory Build', bold: true, color: B },
      'Inventory nearly doubled from $10.1B to $19.8B over just nine months, as the company stages components ahead of the Blackwell platform transition and commits to long-lead supply agreements.',
      { text: 'Aggressive Capital Return', bold: true, color: B },
      'The company repurchased $34.0B of shares in FY2025 and a further $36.7B in the first nine months of FY2026, signaling management\u2019s confidence in the durability of free cash flow generation.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Revenue', labels: ['FY2023', 'FY2024', 'FY2025'], values: [27.0, 60.9, 130.5] },
        { name: 'Net Income', labels: ['FY2023', 'FY2024', 'FY2025'], values: [4.4, 29.8, 72.9] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 7, valAxisTitle: '$B' },
      source: 'Source: NVIDIA 10-K filings',
    },
  });

  // ── Company Overview (with chart) ──
  deck.addTextWithChart({
    title: 'Company & Transaction Overview',
    strapline: 'NVIDIA operates as a fabless semiconductor and systems company whose economics are overwhelmingly driven by Data Center accelerated computing',
    body: [
      { text: 'Business Model', bold: true, color: B },
      'NVIDIA designs silicon architectures and full-stack software platforms while relying on TSMC for wafer fabrication, external partners for assembly and test, and SK hynix as its primary supplier of high-bandwidth memory.',
      'The company reports through two operating segments: Compute & Networking, which generated $116.2B in FY2025, and Graphics, which contributed $14.3B.',
      { text: 'Market Position', bold: true, color: B },
      'Gartner ranked NVIDIA as the largest semiconductor vendor globally by revenue in 2024, a position underpinned by the CUDA software ecosystem, which has accumulated more than six years of developer tooling and creates substantial switching costs for enterprise customers.',
      { text: 'Supply Chain', bold: true, color: B },
      'The company faces structural supply constraints in TSMC\u2019s CoWoS advanced packaging and in high-bandwidth memory allocation, both of which limit near-term production capacity.',
      'TSMC is expanding CoWoS output to approximately 75,000 wafers per month in 2025, roughly doubling 2024 levels, though customer demand continues to outpace available supply.',
    ],
    chart: {
      type: 'doughnut',
      data: [
        { name: 'FY2025 Revenue Mix', labels: ['Data Center', 'Gaming', 'Prof Viz', 'Auto', 'OEM'], values: [115.2, 11.4, 1.9, 1.7, 0.4] },
      ],
      opts: { showPercent: true, dataLabelFontSize: 7, showLegend: true },
      source: 'Source: NVIDIA FY2025 10-K ($130.5B total)',
    },
  });

  // ── Valuation Context — Peer Comparison ──
  deck.addTableSlide({
    title: 'Valuation Context — Peer Comparison',
    strapline: 'NVIDIA trades at a significant premium to semiconductor peers on all traditional valuation metrics, reflecting the market\u2019s expectations for sustained hypergrowth and platform dominance',
    rows: [
      ['Metric', 'NVIDIA', 'AMD', 'Broadcom', 'Marvell', 'Peer Median'],
      ['Market Cap ($B)', '3,420', '202', '1,040', '98', '202'],
      ['EV / Revenue (NTM)', '17.2x', '8.4x', '15.6x', '12.8x', '12.8x'],
      ['EV / EBITDA (NTM)', '24.8x', '23.1x', '25.4x', '32.6x', '25.4x'],
      ['P/E (NTM)', '30.5x', '25.2x', '30.8x', '42.1x', '30.8x'],
      ['PEG Ratio', '0.7x', '1.2x', '1.5x', '2.1x', '1.5x'],
      ['Revenue Growth (NTM)', '+48%', '+28%', '+17%', '+24%', '+24%'],
      ['Gross Margin (LTM)', '69.3%', '49.0%', '63.2%', '46.8%', '49.0%'],
      ['ROIC', '115%', '12%', '18%', '8%', '12%'],
    ],
    colW: [1.8, 1.3, 1.2, 1.3, 1.2, 1.5],
    source: 'Source: FactSet consensus estimates as of January 2026; KPMG analysis (illustrative)',
  });

  // ── Valuation Sensitivity Matrix ──
  deck.addTableSlide({
    title: 'Implied Enterprise Value — Sensitivity Analysis',
    strapline: 'Sensitivity matrix illustrating the range of implied enterprise values at varying Adjusted EBITDA and EV/EBITDA assumptions',
    rows: [
      ['Adj. EBITDA \\ Multiple', '20x', '24x', '28x', '32x', '36x'],
      [{ text: 'Bear ($70B)', opts: { bold: true } }, '$1,400B', '$1,680B', '$1,960B', '$2,240B', '$2,520B'],
      [{ text: 'Base ($86B)', opts: { bold: true } }, '$1,720B', '$2,064B', '$2,408B', '$2,752B', '$3,096B'],
      [{ text: 'Bull ($100B)', opts: { bold: true } }, '$2,000B', '$2,400B', '$2,800B', '$3,200B', '$3,600B'],
      [{ text: 'Upside ($120B)', opts: { bold: true } }, '$2,400B', '$2,880B', '$3,360B', '$3,840B', '$4,320B'],
    ],
    colW: [1.8, 1.3, 1.3, 1.3, 1.3, 1.3],
    source: 'Source: KPMG analysis; Adj. EBITDA scenarios reflect different margin normalization assumptions (illustrative only)',
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: FINANCIAL OVERVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addSection({
    number: 2,
    title: 'Financial\nOverview',
    subtitle: 'Multi-period financial summary, revenue composition, and margin analysis',
  });

  // ── Financial Summary Table ──
  deck.addTableSlide({
    title: 'Financial Summary',
    strapline: 'Revenue more than doubled in FY2025; gross margin peak of 75.0% now compressing as product mix and costs shift',
    rows: [
      ['$ in billions', 'FY2023', 'FY2024', 'FY2025', '9M FY2026'],
      ['Revenue', '27.0', '60.9', '130.5', '147.8'],
      ['Gross profit', 'n/a', '44.3', '97.9', '102.4'],
      [{ text: 'Gross margin %', opts: { italic: true } }, 'n/a', '72.7%', '75.0%', '69.3%'],
      ['Operating income', '4.2', '33.0', '81.5', '92.6'],
      [{ text: 'Operating margin %', opts: { italic: true } }, '15.6%', '54.2%', '62.5%', '62.7%'],
      ['Net income', '4.4', '29.8', '72.9', '77.1'],
      ['Operating cash flow', '5.6', '28.1', '64.1', 'n/a'],
      ['Share repurchases', 'n/a', 'n/a', '34.0', '36.7'],
      ['Inventory (period-end)', 'n/a', 'n/a', '10.1', '19.8'],
    ],
    colW: [2.5, 1.4, 1.4, 1.4, 1.4],
    source: 'Source: NVIDIA Form 10-K (FY2025) and Form 10-Q (Q3 FY2026), SEC EDGAR',
  });

  // ── Revenue by End Market ──
  deck.addTextWithChart({
    title: 'Revenue by End Market',
    strapline: 'Data Center dominance continues to accelerate, representing 88% of FY2025 revenue, while Gaming and all other segments become increasingly marginal to the business',
    body: [
      { text: 'FY2025 Revenue Composition ($130.5B)', bold: true, color: B },
      'The Data Center segment generated $115.2B in FY2025, representing 88.3% of total revenue. Within Data Center, Compute contributed $102.2B and Networking added $13.0B.',
      'Gaming contributed $11.35B (8.7%), Professional Visualization accounted for $1.88B (1.4%), Automotive generated $1.69B (1.3%), and OEM & Other represented the remaining $0.39B (0.3%).',
      { text: 'Nine Months FY2026 ($147.8B, annualizing to ~$197B)', bold: true, color: B },
      'Through the first nine months of FY2026, Data Center revenue reached $131.4B, or 88.9% of the total. Networking revenue accelerated to $20.4B within this period, growing meaningfully faster than the Compute subsegment as hyperscalers deployed increasingly large GPU clusters requiring denser interconnect.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Data Center', labels: ['FY2023', 'FY2024', 'FY2025'], values: [15.0, 47.5, 115.2] },
        { name: 'Gaming', labels: ['FY2023', 'FY2024', 'FY2025'], values: [9.1, 10.3, 11.4] },
        { name: 'Other', labels: ['FY2023', 'FY2024', 'FY2025'], values: [2.9, 3.1, 3.9] },
      ],
      opts: { barDir: 'col', barGrouping: 'stacked', showValue: false, valAxisTitle: '$B' },
      source: 'Source: NVIDIA 10-K filings; KPMG analysis',
    },
  });

  // ── Data Center Decomposition ──
  deck.addOneColumnChart({
    title: 'Data Center Revenue Decomposition',
    strapline: 'Networking revenue is growing faster than Compute, reflecting NVIDIA\u2019s platform attach strategy and surging demand for NVLink and InfiniBand interconnect',
    body: [
      'Data Center compute revenue grew from approximately $34.4B in FY2024 to $102.2B in FY2025, a 197% increase driven primarily by H100 and B100 platform adoption across hyperscaler and enterprise customers.',
      'Networking revenue reached $20.4B in the first nine months of FY2026 alone, implying a run-rate of approximately $27B. This acceleration reflects the growing importance of high-speed interconnect as customers deploy larger, multi-rack GPU clusters.',
      'Public filings do not disclose units shipped by platform, average selling price waterfalls, or the revenue mix between discrete boards, integrated systems, and full rack configurations \u2014 all of which represent critical data requests for confirmatory diligence.',
      'Average selling prices have shifted materially as the product portfolio evolves from discrete GPU boards priced in the $25,000\u2013$40,000 range to HGX multi-GPU systems at $200,000\u2013$400,000 and full DGX SuperPOD rack configurations exceeding $3M per unit. This ASP migration creates both revenue leverage and margin complexity as the bill of materials scales with system-level integration.',
      'Networking revenue per GPU deployed is emerging as a critical efficiency metric for diligence. Each Blackwell-generation cluster requires significantly higher NVLink and InfiniBand interconnect density than prior generations, and NVIDIA\u2019s ability to capture this attach revenue represents a durable competitive advantage that custom ASIC alternatives cannot easily replicate.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'DC Compute', labels: ['FY2024', 'FY2025', '9M FY2026'], values: [34.4, 102.2, 111.0] },
        { name: 'DC Networking', labels: ['FY2024', 'FY2025', '9M FY2026'], values: [13.2, 13.0, 20.4] },
      ],
      opts: { barDir: 'col', barGrouping: 'stacked', showValue: true, valueFontSize: 8 },
      source: 'Source: NVIDIA 10-K/10-Q; FY2024 compute/networking split estimated',
    },
  });

  // ── Quarterly Revenue Trajectory (NEW) ──
  deck.addOneColumnChart({
    title: 'Quarterly Revenue Trajectory',
    strapline: 'Revenue growth rates are decelerating from a peak of +265% year-over-year, but absolute dollar accretion remains unprecedented in semiconductor history',
    body: [
      'NVIDIA reported Q3 FY2026 revenue of $55.5B, compared to $18.1B in the year-ago quarter, representing a 206% increase. Sequential growth of 11% suggests the trajectory is beginning to mature as the installed base scales.',
      'The FY2025 quarterly progression from $26.0B to $30.0B to $35.1B to $39.3B illustrates a 51% ramp across the fiscal year, with each successive quarter setting a new record for any semiconductor company.',
      'The nine-month FY2026 run-rate implies approximately $197B in annualized revenue. Sustaining this trajectory will require continued capital expenditure commitments from the major hyperscalers, which represent the dominant share of Data Center demand.',
      'Year-over-year growth rates have decelerated from a peak of approximately 265% in mid-FY2025 to roughly 94% by Q3 FY2026, a pattern consistent with the mathematical base effect of a rapidly scaling business. Sequential growth has also moderated from approximately 15\u201317% in earlier quarters to 10\u201311% in Q3 FY2026, suggesting the trajectory is beginning to mature.',
      'Management has historically guided conservatively relative to reported results, with actual quarterly revenue exceeding midpoint guidance by an average of $2\u20133B over the past six quarters. Backlog visibility is estimated at approximately two to three quarters based on the long lead times associated with CoWoS and HBM supply commitments, providing meaningful near-term demand certainty.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Revenue ($B)', labels: ['Q1\nFY24', 'Q2\nFY24', 'Q3\nFY24', 'Q4\nFY24', 'Q1\nFY25', 'Q2\nFY25', 'Q3\nFY25', 'Q4\nFY25', 'Q1\nFY26', 'Q2\nFY26', 'Q3\nFY26'], values: [7.2, 13.5, 18.1, 22.1, 26.0, 30.0, 35.1, 39.3, 42.3, 50.0, 55.5] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 6, catAxisLabelFontSize: 5, chartColors: ['00338D'] },
      source: 'Source: NVIDIA quarterly filings; fiscal year ends January',
    },
  });

  // ── Hyperscaler Capex Overlay ──
  deck.addOneColumnChart({
    title: 'Hyperscaler Capital Expenditure Overlay',
    strapline: 'NVIDIA\u2019s revenue trajectory is fundamentally linked to the capex commitments of its four largest hyperscaler end customers, whose combined spending is approaching $300B annually',
    body: [
      'The four largest hyperscaler customers \u2014 Microsoft, Amazon, Google, and Meta \u2014 collectively invested approximately $185B in capital expenditure during calendar year 2024 and have guided to approximately $280B for 2025, representing roughly 50% year-over-year growth in infrastructure spending.',
      'NVIDIA captures an estimated 25\u201335% of incremental hyperscaler capex as AI-related infrastructure spending, implying that each $10B increase in combined hyperscaler capex translates to approximately $2.5\u20133.5B of incremental NVIDIA revenue. This relationship provides a useful cross-check against the company\u2019s bottom-up revenue projections.',
      'The sustainability of this capex cycle is the single most important assumption underlying NVIDIA\u2019s revenue trajectory. Any meaningful pullback in hyperscaler spending \u2014 whether driven by ROI concerns, macroeconomic conditions, or a shift toward custom silicon \u2014 would have an outsized impact on demand visibility and order backlog.',
      'On an individual basis, Microsoft is estimated to invest approximately $80B in calendar 2025, Amazon approximately $75B, Google approximately $65B, and Meta approximately $60B. Each hyperscaler\u2019s AI infrastructure investment is increasingly driven by competitive necessity rather than discretionary allocation, which provides a degree of demand resilience but also raises terminal growth rate questions.',
      'The return on invested capital for hyperscaler AI infrastructure remains difficult to quantify at this stage of the deployment cycle. Emerging indicators suggest that inference-driven revenue from AI-powered products and services is growing rapidly but has not yet reached levels sufficient to fully justify the aggregate capital deployed, creating a long-term demand sustainability risk that diligence should stress-test.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Hyperscaler Capex ($B)', labels: ['2022', '2023', '2024E', '2025E', '2026E'], values: [120, 130, 185, 280, 330] },
        { name: 'NVIDIA Revenue ($B)', labels: ['2022', '2023', '2024E', '2025E', '2026E'], values: [27, 61, 131, 195, 235] },
      ],
      opts: { barDir: 'col', barGrouping: 'grouped', showValue: true, valueFontSize: 7, valAxisTitle: '$B' },
      source: 'Source: Company filings, FactSet estimates; NVIDIA fiscal years aligned to calendar; KPMG analysis',
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: QUALITY OF EARNINGS
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addSection({
    number: 3,
    title: 'Quality of\nEarnings',
    subtitle: 'Margin sustainability, normalization items, and earnings quality assessment',
  });

  // ── Gross Margin Analysis ──
  deck.addTextWithChart({
    title: 'Gross Margin Bridge & Sustainability',
    strapline: 'Gross margin peaked at 75.0% in FY2025 and has compressed by approximately 570 basis points in FY2026, driven by product mix shifts, inventory provisions, and input cost inflation',
    body: [
      { text: 'Margin Drivers', bold: true, color: B },
      'The FY2025 gross margin peak reflected a favorable Data Center revenue mix, premium pricing on supply-constrained GPU platforms, and minimal inventory provision charges during a period of acute demand.',
      { text: 'Current Year Compression', bold: true, color: B },
      'The product mix is shifting toward higher-complexity systems and full-rack configurations, which carry a meaningfully higher bill of materials and compress unit margins relative to discrete GPU boards.',
      'Inventory provisions have increased as the company manages platform transitions from Hopper to Blackwell, while rising costs for HBM memory and CoWoS advanced packaging place additional pressure on input economics.',
      { text: 'Peer Benchmark', bold: true, color: B },
      'AMD reported a GAAP gross margin of 49% in FY2024 (53% on a non-GAAP basis). While NVIDIA\u2019s current margin regime is exceptional by industry standards, some degree of convergence toward peer levels should be expected as competitive dynamics evolve.',
    ],
    chart: {
      type: 'line',
      data: [
        { name: 'NVIDIA GM %', labels: ['FY2024', 'Q1\nFY25', 'Q2\nFY25', 'Q3\nFY25', 'Q4\nFY25', 'Q1\nFY26', 'Q2\nFY26', 'Q3\nFY26'], values: [72.7, 78.4, 75.1, 74.6, 73.0, 69.8, 69.5, 68.5] },
      ],
      opts: { showValue: true, valueFontSize: 7, lineSmooth: false, chartColors: ['00338D'] },
      source: 'Source: NVIDIA quarterly filings; AMD FY2024 10-K; KPMG analysis',
    },
  });

  // ── QoE Adjustments Table ──
  const qoeSlide = deck.addTableSlide({
    title: 'Quality of Earnings \u2014 Candidate Adjustments',
    strapline: 'Preliminary identification of normalization items; magnitude and treatment to be validated during confirmatory diligence',
    rows: [
      ['Adjustment Category', 'FY2024', 'FY2025', '9M FY2026', 'Direction', 'Priority'],
      ['SBC \u2014 equity awards (RSU/PSU)', '2.8', '3.7', '4.1', 'Add-back', 'High'],
      ['SBC \u2014 ESPP & other programs', '0.5', '0.7', '0.7', 'Add-back', 'High'],
      ['Inventory provisions \u2014 obsolescence', '0.6', '0.7', '1.6', 'Normalize', 'High'],
      ['Inventory provisions \u2014 purchase commits', '0.3', '0.4', '0.8', 'Normalize', 'High'],
      ['Gains/losses on equity investments', '(0.2)', '(0.4)', '(0.3)', 'Remove', 'Medium'],
      ['Gains/losses on debt securities', '(0.1)', '(0.2)', '(0.1)', 'Remove', 'Medium'],
      ['Acquisition amortization (intangibles)', '0.1', '0.1', '0.1', 'Add-back', 'Medium'],
      ['Acquisition integration & deal costs', '\u2013', '0.1', '\u2013', 'Add-back', 'Medium'],
      ['Restructuring / severance', '\u2013', '0.1', '\u2013', 'Add-back', 'Low'],
      ['Lease exit & impairment charges', '\u2013', '\u2013', '0.1', 'Add-back', 'Low'],
      ['FX remeasurement gains/losses', '(0.1)', '0.1', '(0.1)', 'Remove', 'Low'],
      [{ text: 'Indicative adj. to EBITDA', opts: { bold: true } }, { text: '~4.0', opts: { bold: true } }, { text: '~5.2', opts: { bold: true } }, { text: '~6.9', opts: { bold: true } }, '', ''],
      [{ text: 'Memo: Adj. EBITDA margin', opts: { italic: true } }, { text: '58.8%', opts: { italic: true } }, { text: '65.7%', opts: { italic: true } }, { text: '64.2%', opts: { italic: true } }, '', ''],
    ],
    colW: [2.4, 1.0, 1.0, 1.0, 1.0, 0.9],
    source: 'Source: NVIDIA 10-K/10-Q disclosures; KPMG preliminary analysis ($ in billions)',
  });
  // Add adjustment commentary below the table
  qoeSlide.addText(
    'Key observations: SBC represents the largest single adjustment at $4.8B annualized, and is treated as a recurring operating cost given NVIDIA\u2019s dependence on equity compensation to attract and retain engineering talent. Inventory provisions are the fastest-growing adjustment category, driven by the Hopper-to-Blackwell platform transition, and should be normalized across a full product cycle. All figures are preliminary and subject to revision upon receipt of management data during confirmatory diligence.',
    { x: 0.823, y: 5.72, w: 8.354, h: 0.65, fontFace: 'Arial', fontSize: 7, color: '333333', italic: true, valign: 'top', wrap: true },
  );

  // ── QoE Adjustment Narratives (Page 1 of 2) ──
  deck.addOneColumn({
    title: 'Quality of Earnings \u2014 Adjustment Narratives (1/2)',
    strapline: 'Detailed rationale for each proposed normalization adjustment, with preliminary magnitude estimates to be validated during confirmatory diligence',
    body: [
      { text: 'Stock-Based Compensation ($3.3B \u2192 $4.8B)', bold: true, color: B },
      'NVIDIA\u2019s stock-based compensation expense has grown from $3.3B in FY2024 to $4.4B in FY2025 and $4.8B in just the first nine months of FY2026. The acceleration reflects both headcount growth in engineering and AI research functions, and the impact of elevated share prices on the fair value of equity grants. In a normalized earnings context, SBC is treated as a recurring operating cost rather than a non-cash add-back, because the company must continue issuing equity to attract and retain technical talent in a hypercompetitive labor market. The dilutive impact and the share repurchase offset of $34B in FY2025 should be evaluated together to assess the true economic cost to equity holders.',
      { text: 'Inventory Provisions, Net ($0.9B \u2192 $2.4B)', bold: true, color: B },
      'Inventory provision charges nearly tripled from $0.9B in FY2024 to an estimated $2.4B in the first nine months of FY2026, driven by the Hopper-to-Blackwell platform transition and accelerating obsolescence of older GPU architectures. These provisions represent a recurring feature of NVIDIA\u2019s business model given the rapid cadence of product transitions \u2014 typically every 18 to 24 months \u2014 and should be normalized over a full product cycle rather than treated as one-time items. Diligence should request a detailed roll-forward of the inventory reserve, test the accuracy of prior-period estimates against actual write-offs, and assess whether the current reserve balance adequately reflects the risk of excess inventory in the channel.',
      { text: 'Gains and Losses on Strategic Investments ($0.3B \u2192 $0.6B)', bold: true, color: B },
      'NVIDIA maintains a portfolio of strategic equity investments in AI infrastructure, autonomous vehicle, and robotics companies, including positions in both public and private entities. Unrealized gains and losses on this portfolio generated a net gain of approximately $0.6B in FY2025 and $0.4B in the first nine months of FY2026. These gains are non-operational and episodic in nature, driven by mark-to-market valuations on public holdings and periodic fair value adjustments on private positions. KPMG recommends removing these items entirely from adjusted EBITDA, as they do not reflect the earnings power of the core semiconductor and platform business.',
    ],
  });

  // ── QoE Adjustment Narratives (Page 2 of 2) ──
  deck.addOneColumn({
    title: 'Quality of Earnings \u2014 Adjustment Narratives (2/2)',
    strapline: 'Additional normalization items and their combined implications for sustainable earnings power',
    body: [
      { text: 'Acquisition-Related Costs ($0.1B \u2192 $0.2B)', bold: true, color: B },
      'Acquisition-related costs include amortization of acquired intangible assets, earn-out adjustments, and integration expenses stemming from NVIDIA\u2019s acquisitions of Mellanox (2020), Cumulus Networks, and several smaller AI software companies. The annual run-rate of approximately $0.2B reflects the tail end of purchase price amortization schedules and is declining over time. These costs are properly excluded from adjusted EBITDA as they represent non-cash accounting charges that do not reflect ongoing operational economics. However, diligence should confirm whether any deferred consideration or contingent payments remain outstanding that could represent future cash obligations.',
      { text: 'Restructuring and Other One-Time Items ($0.0B \u2192 $0.1B)', bold: true, color: B },
      'NVIDIA recorded approximately $0.1B of restructuring-related charges in FY2025, primarily associated with workforce realignment in the Professional Visualization and Automotive segments and facility consolidation following the shift to hybrid work arrangements. These charges are sporadic, immaterial relative to the company\u2019s earnings base, and appropriately treated as non-recurring add-backs. The absence of restructuring charges in FY2024 and 9M FY2026 supports the classification of these items as genuinely one-off in nature.',
      { text: 'Net Adjusted Impact \u2014 Summary', bold: true, color: B },
      'In aggregate, the candidate adjustments increase reported EBITDA by approximately $4.0B in FY2024, $5.2B in FY2025, and an annualized $6.9B based on the first nine months of FY2026. The most material adjustments \u2014 stock-based compensation and inventory provisions \u2014 are inherently recurring costs of doing business in the semiconductor industry and warrant careful treatment in any buyer\u2019s financial model. The net normalization impact as a percentage of reported EBITDA ranges from approximately 5% to 7%, which is modest relative to the underlying earnings base and suggests that reported earnings quality is generally high.',
    ],
  });

  // ── Adjusted EBITDA Bridge ──
  deck.addOneColumnChart({
    title: 'FY2025 Adjusted EBITDA Bridge',
    strapline: 'Walking from reported net income to adjusted EBITDA produces a normalized earnings figure of approximately $85.8B, representing a 65.7% adjusted EBITDA margin',
    body: [
      'The bridge begins with reported FY2025 net income of $72.9B and adds back $4.6B of income tax expense, $0.3B of net interest expense, and $2.8B of depreciation and amortization to arrive at reported EBITDA of approximately $80.6B.',
      'KPMG\u2019s preliminary normalization adjustments add $4.4B of stock-based compensation, $1.1B of net inventory provisions above normalized levels, and $0.3B of acquisition-related and restructuring costs, while removing $0.6B of non-operating investment gains, resulting in net adjustments of approximately $5.2B.',
      'The resulting Adjusted EBITDA of approximately $85.8B implies a 65.7% margin on $130.5B of revenue. This provides a more meaningful basis for valuation multiples and comparable company analysis than reported net income, which benefits from a structurally low effective tax rate.',
      'From a sensitivity perspective, a 100 basis point change in gross margin equates to approximately $1.3B of Adjusted EBITDA impact at current revenue levels. Similarly, every $10B of incremental revenue at current incremental margins contributes approximately $7.5B of additional Adjusted EBITDA, illustrating the extraordinary volume leverage embedded in the business model.',
      'Relative to semiconductor peers, NVIDIA\u2019s Adjusted EBITDA margin of 65.7% is approximately 20\u201325 percentage points above AMD and 30\u201335 percentage points above Intel. While some degree of margin convergence is expected as competitive dynamics evolve, the structural advantages of NVIDIA\u2019s platform ecosystem suggest sustainable margins well above peer levels.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'EBITDA Bridge ($B)', labels: ['Net\nIncome', 'Tax', 'Interest', 'D&A', 'SBC', 'Inv.\nProv.', 'Inv.\nGains', 'Acq. &\nRestr.', 'Adj.\nEBITDA'], values: [72.9, 4.6, 0.3, 2.8, 4.4, 1.1, -0.6, 0.3, 85.8] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 7, catAxisLabelFontSize: 5, chartColors: ['00338D'] },
      source: 'Source: NVIDIA FY2025 10-K; KPMG preliminary normalization analysis ($ in billions)',
    },
  });

  // ── Operating Leverage ──
  deck.addOneColumnChart({
    title: 'Operating Expense Scalability',
    strapline: 'R&D and SG&A are growing in absolute terms but declining as a percentage of revenue, demonstrating the significant operating leverage inherent in a scaled platform business',
    body: [
      'Research and development expense increased from $8.7B in FY2024 to $12.9B in FY2025 and reached $13.3B in the first nine months of FY2026, driven primarily by headcount-related compensation and investment in compute infrastructure for internal AI workloads.',
      'Selling, general, and administrative expense grew from $2.7B to $3.3B to $2.6B over the same periods. Despite the absolute increase in total operating costs, operating margins expanded from 54.2% in FY2024 to 62.5% in FY2025, underscoring the degree of incremental margin leverage at this revenue scale.',
      'A key normalization question for diligence is how much of the current R&D spend represents maintenance of existing platforms versus investment in next-generation architectures, and what the sustainable run-rate will be once the Blackwell transition is complete.',
      'R&D spending is concentrated across three primary categories: headcount-related compensation (estimated at approximately 65% of total R&D), compute infrastructure for internal AI model training and validation (approximately 20%), and silicon tape-out costs, mask sets, and prototype fabrication (approximately 15%). Headcount growth has averaged roughly 15\u201320% annually over the past two years, predominantly in GPU architecture and CUDA software engineering.',
      'SG&A as a percentage of revenue declined from 10.0% in FY2023 to 2.5% in FY2025, reflecting the extreme operating leverage inherent in a platform business model. KPMG will assess the sustainability of this ratio and evaluate whether certain SG&A functions are under-invested relative to the scale and complexity of the business.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'R&D', labels: ['FY2023', 'FY2024', 'FY2025', '9M FY2026'], values: [7.3, 8.7, 12.9, 13.3] },
        { name: 'SG&A', labels: ['FY2023', 'FY2024', 'FY2025', '9M FY2026'], values: [2.4, 2.7, 3.3, 2.6] },
      ],
      opts: { barDir: 'col', barGrouping: 'stacked', showValue: true, valueFontSize: 8, valAxisTitle: '$B' },
      source: 'Source: NVIDIA 10-K/10-Q; KPMG analysis',
    },
  });

  // ── Profitability Build (NEW) ──
  deck.addOneColumnChart({
    title: 'FY2025 Income Statement Build',
    strapline: 'A revenue-to-net-income conversion rate of 55.9% reflects exceptional operating leverage and a cost structure that scales efficiently with volume',
    body: [
      'NVIDIA converted $130.5B of FY2025 revenue into $97.9B of gross profit at a 75.0% margin, $81.5B of operating income at a 62.5% margin, and $72.9B of net income at a 55.9% conversion rate \u2014 a profitability profile that is extraordinary by any industry standard.',
      'Below the operating line, the company benefits from approximately $3.4B in interest income on its substantial cash and investment balances, as well as a structurally low effective tax rate enabled by intellectual property domiciling.',
      'From a sensitivity perspective, each 100 basis points of gross margin movement equates to roughly $1.3B of EBITDA impact at current revenue levels. Volume leverage, rather than pricing or cost control, is the primary driver of earnings quality.',
      'NVIDIA\u2019s effective tax rate has averaged approximately 12\u201314% over the past three fiscal years, materially below the U.S. statutory rate of 21%. This favorable rate is driven by the company\u2019s intellectual property structure, which routes licensing income through subsidiaries in jurisdictions with preferential tax regimes. Diligence should assess the durability of this structure in light of evolving OECD Pillar Two minimum tax rules.',
      'Capital expenditure intensity remains low at approximately 2\u20133% of revenue, reflecting the fabless semiconductor model. However, NVIDIA is increasingly investing in internal compute infrastructure for AI model development and validation, and this category of spend is growing faster than revenue. The distinction between maintenance and growth capex will be a key focus area for free cash flow normalization.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'FY2025 ($B)', labels: ['Revenue', 'COGS', 'Gross\nProfit', 'OpEx', 'Op Income', 'Net Income'], values: [130.5, 32.6, 97.9, 16.4, 81.5, 72.9] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 8, chartColors: ['00338D', 'BC204B', '009A44', 'BC204B', '1E49E2', '00338D'] },
      source: 'Source: NVIDIA FY2025 10-K; KPMG analysis',
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: WORKING CAPITAL & CASH
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addSection({
    number: 4,
    title: 'Working Capital\n& Cash Flow',
    subtitle: 'Inventory dynamics, cash conversion, and capital allocation',
  });

  // ── Inventory & Supply Chain ──
  deck.addTextWithChart({
    title: 'Inventory Position & Supply Chain Risk',
    strapline: 'Inventory nearly doubled in nine months, rising from $10.1B to $19.8B, as the company pre-builds components ahead of the Blackwell platform transition',
    body: [
      { text: 'Inventory Build Drivers', bold: true, color: B },
      'The Blackwell platform ramp requires NVIDIA to stage components months ahead of customer shipment, resulting in a significant increase in work-in-progress and raw material balances.',
      'Long lead times on CoWoS advanced packaging and HBM memory offtake agreements force the company to make forward purchase commitments well in advance of revenue recognition.',
      'As NVIDIA shifts toward selling integrated systems and full-rack configurations, the average bill of materials per unit has increased, mechanically driving higher inventory levels across all stages of production.',
      { text: 'Reserve Quality Questions', bold: true, color: B },
      'Inventory provision charges have historically been lumpy and are sensitive to the timing of platform transitions. Diligence should test the reserve methodology, trigger thresholds, and accuracy of prior-period estimates.',
      'Off-balance-sheet purchase obligations with TSMC and memory suppliers may represent material commitments that are not fully visible in the reported inventory balance.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Inventory ($B)', labels: ['Jan 2023', 'Jan 2024', 'Jan 2025', 'Oct 2025'], values: [5.2, 5.3, 10.1, 19.8] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 9, chartColors: ['00338D'] },
      source: 'Source: NVIDIA balance sheet; SEC filings',
    },
  });

  // ── Cash Conversion ──
  deck.addOneColumnChart({
    title: 'Cash Generation & Capital Allocation',
    strapline: 'Operating cash flow scaled to $64.1B in FY2025, and the company is deploying capital aggressively through an accelerating share repurchase program',
    body: [
      'NVIDIA generated $64.1B of operating cash flow in FY2025, more than doubling the $28.1B produced in FY2024. This represents an EBITDA-to-cash conversion rate of approximately 98%, reflecting the asset-light nature of the fabless model and favorable working capital dynamics during a period of rapid growth.',
      'The company repurchased $34.0B of shares in FY2025 and $36.7B in the first nine months of FY2026, partially offsetting the dilutive impact of $4.4B in stock-based compensation expense. The pace of buybacks has meaningfully accelerated alongside cash generation.',
      'Free cash flow normalization during diligence should isolate maintenance versus growth capital expenditures, distinguish company-funded from customer-funded infrastructure investments, adjust for stock-based compensation settlement timing, and account for working capital cyclicality.',
      'The company\u2019s balance sheet held approximately $43.2B in cash, cash equivalents, and short-term investments as of October 2025, providing substantial financial flexibility. Total debt stands at approximately $8.5B, resulting in a net cash position of $34.7B and a net debt-to-EBITDA ratio that is effectively negative. This fortress balance sheet provides significant capacity for additional share repurchases, strategic acquisitions, or organic investment.',
      'Dividend payments remain nominal at approximately $0.5B annually, reflecting management\u2019s preference for share repurchases as the primary capital return mechanism. The current share repurchase authorization has approximately $16B remaining, and KPMG expects the board to authorize additional capacity given the pace of buyback execution and the company\u2019s cash generation profile.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Operating CF', labels: ['FY2023', 'FY2024', 'FY2025'], values: [5.6, 28.1, 64.1] },
        { name: 'Share Buybacks', labels: ['FY2023', 'FY2024', 'FY2025'], values: [10.0, 9.5, 34.0] },
      ],
      opts: { barDir: 'col', showValue: true, valueFontSize: 8, valAxisTitle: '$B' },
      source: 'Source: NVIDIA cash flow statement; SEC filings',
    },
  });

  // ── Customer Concentration ──
  deck.addTextWithChart({
    title: 'Customer Concentration Analysis',
    strapline: 'Four direct customers each represent more than 10% of Q3 FY2026 revenue, creating structural concentration risk that is fundamentally tied to the hyperscaler capital expenditure cycle',
    body: [
      { text: 'Concentration Profile', bold: true, color: B },
      'In Q3 FY2026, NVIDIA\u2019s four largest direct customers represented 22%, 15%, 13%, and 11% of quarterly revenue respectively, with the top two customers alone accounting for more than one-third of total sales.',
      'On a nine-month basis, two direct customers individually exceeded the 10% disclosure threshold, representing 21% and 13% of revenue.',
      { text: 'Diligence Implications', bold: true, color: B },
      'The direct customers listed in SEC filings are predominantly add-in board partners and original design manufacturers. The ultimate end customers are major hyperscalers, which introduces an additional layer of demand concentration not fully visible in reported figures.',
      'Even modest changes in commercial terms, payment timing, or order volumes with these top counterparties can move quarterly cash flows by billions of dollars.',
      { text: 'Substitution Risk', bold: true, color: B },
      'Several of NVIDIA\u2019s largest end customers are actively developing proprietary accelerator alternatives, including Google\u2019s TPU, Amazon\u2019s Trainium, and Microsoft\u2019s Maia, all of which could reduce long-term dependence on NVIDIA hardware.',
    ],
    chart: {
      type: 'pie',
      data: [
        { name: 'Customer Mix', labels: ['Cust A (22%)', 'Cust B (15%)', 'Cust C (13%)', 'Cust D (11%)', 'Others (39%)'], values: [22, 15, 13, 11, 39] },
      ],
      opts: { showPercent: true, showLegend: true, showValue: false, dataLabelFontSize: 7 },
      source: 'Source: NVIDIA 10-Q (Q3 FY2026); customer identities not disclosed',
    },
  });

  // ── Working Capital Components (NEW) ──
  deck.addOneColumnChart({
    title: 'Net Working Capital Composition',
    strapline: 'Inventory has become the dominant working capital driver, with net working capital reaching $27.0B as of October 2025, reflecting the massive Blackwell prebuild cycle',
    body: [
      'Accounts receivable increased to $17.3B as of October 2025, up from $10.1B at the January 2025 fiscal year-end. The growth reflects larger individual deal sizes and, in some cases, extended payment terms as the company ships increasingly complex, higher-value system configurations.',
      'Inventory reached $19.8B, nearly doubling from $10.1B over the same period. The buildup is driven by component staging for the Blackwell transition and forward capacity hedging on constrained packaging and memory inputs.',
      'Accounts payable grew to $5.4B from $3.5B, a more modest increase that reflects NVIDIA\u2019s limited leverage relative to its key suppliers. TSMC and SK hynix, as dominant providers of fabrication and memory respectively, generally dictate payment terms rather than negotiate them.',
      'Deferred revenue increased to approximately $3.8B as of October 2025, up from $1.9B at fiscal year-end. The growth reflects the expansion of NVIDIA\u2019s enterprise software and support offerings, including AI Enterprise licensing, DGX Cloud subscriptions, and multi-year maintenance contracts. This deferred balance represents a growing source of forward revenue visibility and recurring income.',
      'Accrued liabilities reached $8.2B as of October 2025, encompassing customer rebate and incentive programs, warranty reserves, employee-related accruals, and tax provisions. The customer programs component is the largest and most variable element, and normalization of these accruals will require detailed analysis of historical true-up patterns and program terms during confirmatory diligence.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Accts Receivable', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [4.2, 10.1, 17.3] },
        { name: 'Inventory', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [5.3, 10.1, 19.8] },
        { name: 'Accts Payable', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [2.7, 3.5, 5.4] },
      ],
      opts: { barDir: 'col', barGrouping: 'grouped', showValue: true, valueFontSize: 7, valAxisTitle: '$B' },
      source: 'Source: NVIDIA balance sheet; SEC filings',
    },
  });

  // ── Working Capital Efficiency (DSO / DIO / DPO) ──
  deck.addOneColumnChart({
    title: 'Working Capital Efficiency \u2014 DSO / DIO / DPO',
    strapline: 'Days inventory outstanding has expanded sharply as the company pre-builds for the Blackwell transition, driving the cash conversion cycle from 34 days to 68 days in nine months',
    body: [
      'Days sales outstanding increased from approximately 25 days in January 2024 to 43 days as of October 2025, reflecting larger deal sizes with hyperscaler customers and, in some cases, accommodative payment terms offered to secure long-term platform commitments.',
      'Days inventory outstanding expanded dramatically from 32 days to 49 days over the same period, driven by the Blackwell prebuild cycle and forward component purchases. At current revenue run-rates, each additional day of inventory outstanding equates to roughly $540M of incremental balance sheet investment.',
      'Days payable outstanding remained relatively stable at 20\u201324 days, as NVIDIA has limited negotiating leverage with its dominant suppliers \u2014 TSMC for fabrication and SK hynix for high-bandwidth memory \u2014 both of which operate at capacity and dictate commercial terms. The resulting cash conversion cycle of 68 days represents a meaningful deterioration from the 34-day level at fiscal year-end 2025.',
      'Relative to semiconductor peers, NVIDIA\u2019s cash conversion cycle is now above the industry median of approximately 55 days, a reversal from the below-average levels maintained through FY2025. AMD operates at approximately 80\u201390 days CCC reflecting its own inventory build for MI300X, while Broadcom maintains a more efficient 35\u201340 day cycle given its different business model and supply chain structure.',
      'Diligence should assess whether the elevated CCC represents a temporary condition tied to the Blackwell platform transition or a structural shift reflecting the company\u2019s move toward selling integrated systems. The normalization of net working capital as a percentage of revenue will be a critical input to the free cash flow bridge and, by extension, to enterprise valuation.',
    ],
    chart: {
      type: 'line',
      data: [
        { name: 'DSO (days)', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [25, 28, 43] },
        { name: 'DIO (days)', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [32, 28, 49] },
        { name: 'DPO (days)', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [20, 22, 24] },
        { name: 'CCC (days)', labels: ['Jan 2024', 'Jan 2025', 'Oct 2025'], values: [37, 34, 68] },
      ],
      opts: { showValue: true, valueFontSize: 8, lineSmooth: false, chartColors: ['00338D', 'BC204B', '009A44', '7213EA'] },
      source: 'Source: NVIDIA balance sheet; KPMG analysis (days calculated from reported balances and annualized revenue)',
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: RISKS & DILIGENCE APPROACH
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addSection({
    number: 5,
    title: 'Key Risks &\nDiligence Approach',
    subtitle: 'Competitive threats, regulatory exposure, and proposed workstreams',
  });

  // ── Risks (with chart) ──
  deck.addTextWithChart({
    title: 'Risk Assessment',
    strapline: 'KPMG has developed a preliminary, scenario-based risk impact assessment across the key business and financial risk categories relevant to this transaction',
    body: [
      { text: 'Critical Risks', bold: true, color: B },
      'Gross margin compression represents the most pervasive risk: each 100 basis points of decline equates to approximately $1.3B of annual EBITDA impact at current revenue levels.',
      'Customer concentration creates significant counterparty exposure, with the single largest customer relationship representing approximately $29B of annualized revenue at risk.',
      'The $19.8B inventory balance carries meaningful obsolescence exposure during platform transitions, particularly if Blackwell adoption timelines shift or demand softens.',
      'U.S. export controls have already constrained revenue from China and could tighten further, potentially limiting the addressable market for high-performance accelerator products.',
      { text: 'Structural Advantages', bold: true, color: B },
      'These risks are partially mitigated by NVIDIA\u2019s deep ecosystem advantages, including more than six years of CUDA developer lock-in, incremental operating margins exceeding 80%, and FY2025 operating cash flow generation of $64.1B.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'Est. Impact ($B)', labels: ['Margin\nNormalization', 'Customer\nLoss', 'Inventory\nObsolescence', 'Export\nControls', 'Competition'], values: [13.0, 29.0, 5.0, 8.0, 15.0] },
      ],
      opts: { barDir: 'bar', showValue: true, valueFontSize: 7, chartColors: ['BC204B'] },
      source: 'Source: KPMG analysis \u2014 indicative scenario-based impact estimates',
    },
  });

  // ── Export Controls & China Revenue ──
  deck.addTextWithChart({
    title: 'U.S. Export Controls \u2014 China Revenue Impact',
    strapline: 'U.S. export restrictions have reduced NVIDIA\u2019s addressable market in China by an estimated $8\u201312B annually, with further tightening under active consideration by the Bureau of Industry and Security',
    body: [
      { text: 'Regulatory Timeline', bold: true, color: B },
      'The Bureau of Industry and Security first imposed advanced AI chip export restrictions in October 2022, targeting NVIDIA\u2019s A100 and H100 GPUs. The rules were expanded in October 2023 to cover the A800 and H800 variants that NVIDIA had developed as compliant alternatives, and further tightened in January 2025 with country-level tiering that restricted shipments to an additional 120 nations.',
      { text: 'Revenue Impact', bold: true, color: B },
      'NVIDIA disclosed that China-region revenue represented approximately 17% of Data Center revenue in FY2023, or roughly $2.5B. Following the initial restrictions, the company developed compliance-grade products, but subsequent rule expansions have progressively closed these workarounds and reduced China Data Center revenue to an estimated $3.1B in FY2025.',
      'KPMG estimates the cumulative annual revenue impact of current export controls at $8\u201312B, based on the company\u2019s prior China market share and the growth trajectory of the Chinese AI infrastructure market.',
      { text: 'Forward Risk', bold: true, color: B },
      'Pending regulatory proposals could extend restrictions to inference-class chips and limit the licensing of CUDA software to certain jurisdictions. These measures, if implemented, could further reduce NVIDIA\u2019s addressable market by an additional $3\u20135B annually and create compliance complexity across the global supply chain.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'China DC Revenue ($B)', labels: ['FY2023\n(Pre-Ban)', 'FY2024\n(Partial)', 'FY2025\n(Restricted)', 'FY2026E\n(Full)'], values: [10.2, 6.4, 3.1, 2.0] },
        { name: 'Rest of World DC ($B)', labels: ['FY2023\n(Pre-Ban)', 'FY2024\n(Partial)', 'FY2025\n(Restricted)', 'FY2026E\n(Full)'], values: [4.8, 41.1, 112.1, 155.0] },
      ],
      opts: { barDir: 'col', barGrouping: 'stacked', showValue: true, valueFontSize: 6, catAxisLabelFontSize: 5 },
      source: 'Source: NVIDIA 10-K/10-Q; BIS rulemaking; KPMG analysis (China revenue estimated)',
    },
  });

  // ── Competitive Dynamics ──
  deck.addThreeColumnChart({
    title: 'Competitive Positioning \u2014 Margin Comparison',
    strapline: 'NVIDIA\u2019s margin structure is exceptional vs semiconductor peers; sustainability is the key diligence question',
    columns: [
      {
        text: [
          { text: 'NVIDIA', bold: true, color: B },
          'NVIDIA achieved a 75.0% gross margin in FY2025, compressing to 69.3% in the current year.',
          'The margin profile reflects platform pricing power and favorable mix, though the trend is now moving downward.',
        ],
        chart: {
          type: 'bar',
          data: [{ name: 'GM%', labels: ['FY2024', 'FY2025', '9M\u201926'], values: [72.7, 75.0, 69.3] }],
          opts: { barDir: 'col', showValue: true, valueFontSize: 7, catAxisLabelFontSize: 6, valAxisMinVal: 40, valAxisMaxVal: 80 },
        },
      },
      {
        text: [
          { text: 'AMD (Peer)', bold: true, color: B },
          'AMD reported a 49% GAAP gross margin in FY2024 (53% non-GAAP), with the MI300X gaining traction in Data Center.',
          'The margin trend is improving as the higher-margin accelerator mix grows.',
        ],
        chart: {
          type: 'bar',
          data: [{ name: 'GM%', labels: ['FY2022', 'FY2023', 'FY2024'], values: [45, 46, 49] }],
          opts: { barDir: 'col', showValue: true, valueFontSize: 7, catAxisLabelFontSize: 6, valAxisMinVal: 40, valAxisMaxVal: 80, chartColors: ['1E49E2'] },
        },
      },
      {
        text: [
          { text: 'Intel (Peer)', bold: true, color: B },
          'Intel reported approximately 41% GAAP gross margins in FY2024, reflecting its vertically integrated manufacturing model and different product mix.',
          'The Gaudi accelerator line is gaining some enterprise traction, but margins remain under structural pressure.',
        ],
        chart: {
          type: 'bar',
          data: [{ name: 'GM%', labels: ['FY2022', 'FY2023', 'FY2024'], values: [43, 40, 41] }],
          opts: { barDir: 'col', showValue: true, valueFontSize: 7, catAxisLabelFontSize: 6, valAxisMinVal: 40, valAxisMaxVal: 80, chartColors: ['00B8F5'] },
        },
      },
    ],
  });

  // ── Data Requests ──
  deck.addTableSlide({
    title: 'Priority Data Requests',
    strapline: 'Confirmatory diligence data requests ranked by impact on valuation and risk assessment',
    rows: [
      ['Priority', 'Data Request', 'Rationale'],
      ['High', 'Monthly units by DC platform/SKU and configuration', 'Converts revenue to operational reality'],
      ['High', 'Customer-level revenue and margin bridge for top customers', 'Validates concentration risk and pricing'],
      ['High', 'Supply commitments: foundry, CoWoS, HBM volumes and pricing', 'Explains growth ceiling + margin sensitivity'],
      ['High', 'Inventory roll-forward, reserve methodology and accuracy', 'Tests earnings quality and downside protection'],
      ['High', 'Backlog/bookings, cancellation behavior, lead-times', 'Demand visibility and cyclicality assessment'],
      ['Medium', 'Networking attach data (units per GPU cluster)', 'Platform expansion and moat validation'],
      ['Medium', 'Software/services revenue detail and renewals', 'Determines durability of platform economics'],
      ['Medium', 'Channel inventory, pricing programs, returns/credits', 'Detects channel stuffing risk'],
    ],
    colW: [0.7, 3.8, 3.8],
    source: 'Source: KPMG FDD standard data request framework; tailored for NVIDIA',
  });

  // ── Diligence Workstreams (with chart) ──
  deck.addTextWithChart({
    title: 'Proposed Diligence Workstreams',
    strapline: 'KPMG proposes four parallel diligence tracks aligned to the key value drivers, with estimated resource allocation reflecting the relative importance of each workstream',
    body: [
      { text: 'Track 1: Revenue Quality (35%)', bold: true, color: B },
      'This track will build a bottom-up units-by-configuration-by-ASP model, analyze backlog durability, conduct deep-dive analysis on the top customer relationships, and test channel sell-through patterns against reported shipments.',
      { text: 'Track 2: Margin & Cost (25%)', bold: true, color: B },
      'The margin workstream will construct a detailed gross margin waterfall, decompose bill of materials costs by platform, analyze operating expense scalability, and normalize for stock-based compensation.',
      { text: 'Track 3: Working Capital (25%)', bold: true, color: B },
      'This track will examine the inventory build trajectory, test the adequacy of reserve methodologies, age the accounts receivable portfolio, and develop a normalized free cash flow bridge.',
      { text: 'Track 4: Risk & Controls (15%)', bold: true, color: B },
      'The risk workstream will assess the impact of current and potential export controls, evaluate competitive positioning and substitution threats, map supply chain dependencies, and review related-party transactions.',
    ],
    chart: {
      type: 'doughnut',
      data: [
        { name: 'Allocation', labels: ['Revenue Quality', 'Margin & Cost', 'Working Capital', 'Risk & Controls'], values: [35, 25, 25, 15] },
      ],
      opts: { showPercent: true, dataLabelFontSize: 8, showLegend: true },
      source: 'Source: KPMG FDD standard framework; resource allocation is indicative',
    },
  });

  // ── AI Market Sizing (NEW) ──
  deck.addOneColumnChart({
    title: 'AI Accelerator Market Sizing',
    strapline: 'The data center AI accelerator total addressable market is projected to grow from approximately $45B in 2023 to over $320B by 2027; NVIDIA\u2019s share remains defensible but competitive intensity is rising',
    body: [
      'Industry analysts estimate the AI accelerator total addressable market is growing at a 40\u201350% compound annual rate through 2027, fueled by the expansion of both training and inference workloads across enterprise, sovereign, and hyperscale customers.',
      'NVIDIA currently commands an estimated 70\u201380% share of the training accelerator market. The inference market is more fragmented, however, with custom ASIC solutions from major cloud providers beginning to capture a growing share of inference-specific workloads.',
      'The competitive landscape includes AMD\u2019s MI300X and MI350 product lines, Google\u2019s TPU architecture, Amazon\u2019s Trainium chips, Microsoft\u2019s Maia accelerators, and Broadcom\u2019s custom ASIC design partnerships \u2014 all of which represent credible long-term alternatives to NVIDIA\u2019s GPU-based platform.',
      'The training-versus-inference split is evolving rapidly, with inference workloads estimated to represent approximately 60\u201370% of total AI compute demand by 2027, up from roughly 40% in 2024. NVIDIA\u2019s competitive moat is strongest in training, where the CUDA ecosystem and multi-GPU scaling capabilities create significant switching costs. The inference market is more fragmented and price-sensitive, creating opportunity for alternative architectures.',
      'Sovereign AI represents an emerging demand vector, with governments in the Middle East, Southeast Asia, and Europe investing in domestic AI compute infrastructure for national security, healthcare, and public administration applications. This market segment is estimated at $15\u201325B by 2027 and is less price-sensitive than commercial hyperscale, potentially supporting premium margins for NVIDIA\u2019s enterprise-grade platforms.',
    ],
    chart: {
      type: 'bar',
      data: [
        { name: 'NVIDIA', labels: ['2023E', '2024E', '2025E', '2026E', '2027E'], values: [36, 80, 130, 170, 200] },
        { name: 'AMD', labels: ['2023E', '2024E', '2025E', '2026E', '2027E'], values: [1, 5, 12, 25, 40] },
        { name: 'Custom ASICs', labels: ['2023E', '2024E', '2025E', '2026E', '2027E'], values: [5, 10, 20, 35, 55] },
        { name: 'Other', labels: ['2023E', '2024E', '2025E', '2026E', '2027E'], values: [3, 5, 8, 15, 25] },
      ],
      opts: { barDir: 'col', barGrouping: 'stacked', showValue: false, valAxisTitle: '$B' },
      source: 'Source: Industry analyst estimates compiled by KPMG; illustrative only',
    },
  });

  // ── Diligence Timeline ──
  deck.addProcess({
    title: 'Proposed Diligence Timeline',
    subtitle: 'Six-week confirmatory FDD engagement aligned to workstream priorities and data availability',
    columns: [
      {
        heading: 'Weeks 1\u20132: Kickoff & Data',
        body: [
          'Execute engagement letter and NDA',
          'Submit priority data request list',
          'Conduct management kickoff meeting',
          'Begin public filing analysis and industry benchmarking',
          'Set up virtual data room access and review protocols',
        ],
      },
      {
        heading: 'Weeks 3\u20134: Core Analysis',
        body: [
          'Build bottom-up revenue model by platform and customer',
          'Construct gross margin bridge and BOM cost decomposition',
          'Complete inventory roll-forward and reserve adequacy testing',
          'Analyze AR aging and cash conversion cycle dynamics',
          'Conduct management interviews on key diligence topics',
        ],
      },
      {
        heading: 'Weeks 5\u20136: Synthesis',
        body: [
          'Develop normalized EBITDA and free cash flow bridges',
          'Complete working capital analysis and seasonal adjustments',
          'Finalize export control and regulatory risk assessment',
          'Prepare preliminary findings presentation for deal team',
          'Draft comprehensive FDD report with technical appendices',
        ],
      },
      {
        heading: 'Post-Close Support',
        body: [
          'Support purchase price allocation and valuation',
          'Assist with integration planning for financial systems',
          'Provide 100-day plan financial monitoring framework',
          'Ad-hoc support on identified risk mitigation items',
          'Ongoing advisory on regulatory compliance matters',
        ],
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CLOSING
  // ═══════════════════════════════════════════════════════════════════════════
  deck.addClosing({});

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITE
  // ═══════════════════════════════════════════════════════════════════════════
  const outPath = path.join(outDir, 'kpmg-demo-deck.pptx');
  await deck.write(outPath);
  console.log(`Demo deck written to: ${outPath}`);
  console.log(`Total slides: ${deck._slideCount}`);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
