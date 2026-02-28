# FDD Researcher — Deployment Guide

## Overview

This guide explains how to deploy the FDD Researcher as a ChatGPT Custom GPT.

## Files to Upload

### 1. System Prompt

**File:** `system-prompt.txt`
**Location:** Paste into the "Instructions" field in GPT Builder

### 2. Knowledge Files (3 files)

Upload these to the "Knowledge" section:

| File | Size | Purpose |
|------|------|---------|
| `knowledge/industry-modules-complete.md` | ~112KB | All 10 industry modules |
| `knowledge/research-guidance.md` | ~7KB | Research methodology |
| `knowledge/output-structure.md` | ~10KB | Brief section definitions |

### 3. Code Interpreter File

**File:** `code/value_driver_pptx.py`
**Purpose:** PowerPoint value driver diagram generation

Upload this as a knowledge file — ChatGPT Code Interpreter can import and use it.

## GPT Configuration

### Name
```
FDD Researcher
```

### Description
```
Prepare financial due diligence kickoff briefs from CIMs, teasers, and VDD excerpts. Extracts key facts, identifies gaps, adds industry context from web research, and generates structured briefs with data requests and management questions.
```

### Conversation Starters
```
- Upload a CIM and I'll prepare a kickoff brief
- Here's a teaser—what research plan do you recommend?
- Generate a value driver diagram for a SaaS business
- What questions should we ask management for a healthcare services deal?
```

### Capabilities

Enable:
- [x] Web Browsing
- [x] Code Interpreter & Data Analysis

Disable:
- [ ] DALL-E Image Generation

## Verification Checklist

After deployment, test these scenarios:

### 1. Industry Inference
Upload a document and verify the GPT:
- Correctly identifies the industry from signals
- States which module it's applying
- Retrieves the right module content

### 2. Workflow
Verify the 3-step workflow:
- Step 1: Quick intake with document summary + clarifying questions
- Step 2: Research plan with approval gate
- Step 3: Execution with full brief

### 3. Value Driver Diagrams
Request a PowerPoint and verify:
- All 3 tree slides generate
- Industry-appropriate titles
- Key drivers (orange) and risk areas (red) highlighted

### 4. Low-Doc Handling
Test with a sparse document (just a teaser) and verify:
- GPT acknowledges limitations
- Leans on industry defaults
- Expands web research appropriately

## File Structure

```
dist/
├── DEPLOYMENT.md           # This file
├── system-prompt.txt       # GPT instructions
├── code/
│   └── value_driver_pptx.py  # PowerPoint generator
└── knowledge/
    ├── industry-modules-complete.md  # All 10 modules
    ├── research-guidance.md          # Research methodology
    └── output-structure.md           # Brief sections
```

## Industries Supported

1. Technology / SaaS
2. Banking & Lending
3. Transportation & Logistics
4. Insurance
5. Real Estate & Construction
6. Business Services
7. Healthcare Services
8. Retail / Consumer
9. Industrial Manufacturing
10. Asset Management

## Version

**v2.0** — January 2026
- All 10 industry modules complete
- Value driver diagram generation
- Streamlined 3-step workflow
- Compressed knowledge files (~200KB total vs ~580KB original)
