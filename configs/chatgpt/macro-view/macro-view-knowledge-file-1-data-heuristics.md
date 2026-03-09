# Macro View Knowledge File 1 – Data & Heuristics

This file guides how Macro View should internally reason about data, defaults, and “macro‑friendly” choices. It is support knowledge, not part of the main system prompt.

---

## Recommended Knowledge Sources to Upload

Upload small, focused reference files (CSVs or Markdown tables) with:

### 1. Common Foods Macro Reference
A compact table of typical foods and portions, e.g.:

- **Columns**:  
  `food_name`, `canonical_aliases`, `portion_description`, `grams`, `calories`, `carbs_g`, `protein_g`, `fat_g`
- **Rows**:  
  - Chicken breast (grilled, skinless) — 150g cooked  
  - Salmon fillet (baked) — 120g  
  - White rice, brown rice (cooked, per cup)  
  - Oils (olive, canola), butters, dressings (per tbsp)  
  - Common cheeses, nuts, breads, tortillas, sauces  
  - Standard fruits and vegetables (per typical serving)

Macro View should treat these as **strong priors** when inferring from meal descriptions or photos.

---

### 2. Restaurant Cheat Sheets (Optional)

For frequently used chains, upload small sheets with approximate macros for a **subset** of items you care about, for example:

- Chipotle: several bowl/salad templates
- McDonald’s: key sandwiches, fries, common combos
- Starbucks: a few drinks and food items
- Sweetgreen/other salad chains: core salads and base ingredients

Columns can mirror common food references (name + serving + macros).  
Browser results take precedence when official data is found, but these files give Macro View good defaults when web data is missing, ambiguous, or region‑specific.

---

### 3. Macro‑Friendly Heuristics

Upload a short Markdown file describing your preferred defaults, e.g.:

- **Macro‑friendly defaults (if user gives no goal):**
  - Prioritize items with:
    - ≥ 25–30g protein
    - ≤ 650–700 kcal
    - Limited deep‑fried components where alternatives exist
- **Alternate modes** (if user states them):
  - High protein, low fat
  - High protein, low carb
  - Low calorie
- **Tie‑breaking rules**:
  - If two items have similar calories, prefer the one with more protein.
  - If two items have similar protein, prefer the one with fewer calories.

Macro View can use these rules when the prompt mentions “macro‑friendly” but the user doesn’t specify more detail.

---

### 4. Portion Assumption Guidelines

Upload a brief document with your preferred default portions when users give no sizes. For example:

- **Meat/fish**:  
  - Default cooked portion: 150g (~5–6 oz)
- **Rice/pasta/grains**:  
  - Cooked: 150–180g (~1–1.25 cups) per serving
- **Cheese**:  
  - Slices: 20–25g per slice  
  - Shredded: 30g per small handful
- **Oils/butters**:  
  - Cooking fats: assume 1–2 tbsp per portion unless user says “dry” or “no oil”
- **Dressings/sauces**:  
  - Assume ~2 tbsp for salads, ~1–2 tbsp for burgers/wraps unless user says “light” or “extra”

Macro View should:
- Use these defaults when nothing is specified
- Adjust when user says “small portion”, “large portion”, or gives explicit weights/volumes
- Reduce default fats/oils when a dish is clearly described as “plain”, “no oil”, “no dressing”, etc.

---

### 5. Menu Inference Patterns

Use this knowledge when browser or official nutrition info is missing:

- **Grilled vs fried:**
  - “Grilled” → moderate fat from meat + light oil  
  - “Fried”, “crispy”, “breaded” → higher fat and carbs from batter/oil
- **Creamy vs tomato‑based sauces:**
  - “Creamy”, “alfredo”, “cheese sauce” → raise fat and calories  
  - Simple tomato sauces → mostly carbs, minimal fat
- **Salads:**
  - Without dressing or with light vinaigrette → lower fat  
  - With creamy dressing, cheese, bacon, croutons → significantly higher fat/calories
- **Burgers and sandwiches:**
  - Extra patties, cheese, bacon, mayo → large fat/calorie increases  
  - No cheese, no sauce, no bacon, lettuce wrap instead of bun → reduce calories and carbs

Macro View should apply these patterns consistently when exact data is not available, while still presenting results as numeric estimates only.
