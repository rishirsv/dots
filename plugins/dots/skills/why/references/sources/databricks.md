# Databricks Analytics & System Tables

## What this source contains

Use Databricks for product analytics, data pipelines, and warehouse telemetry. Datadog records infrastructure and runtime behavior. Databricks records user actions, experiments, feature usage, and data that may explain a threshold.

- **Product analytics events.** `your_warehouse.events.analytics_track_event` (raw) and typed, deduplicated per-event dbt models in `<your_analytics_db>.<schema>.<table>`. User behavior: feature invocations, clicks, accepts/rejects, submissions, client-reported errors.
- **Usage & billing events.** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`; `your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`. For cost- or volume-driven decisions.
- **Experiment / feature-flag data.** Exposure and outcome tables. **Schema is company-specific.** Run `SHOW TABLES` to confirm table names before querying them.
- **System tables.** `system.query.history`, `system.compute.warehouses`, `system.billing.*`, `system.access.audit`. Answer "was this query expensive?", "how often did anyone run this?", "when did warehouse load spike?"
- **dbt lineage.** Models in `<your_analytics_db>.<schema>` reveal what pipelines depend on a table/field; upstream changes frequently motivate consumer-code changes.
- **Databricks notebooks.** Exploratory analyses engineers wrote before code changes. **Not queryable via the SQL MCP.** If you suspect the rationale lives in a notebook, name it as a gap.

## How to search it

Use the Databricks SQL MCP. Primary tool: `execute_sql_read_only`. If it returns a `statement_id`, poll with `poll_sql_result` rather than re-running.

**Identify the schema before querying.** Schemas are company-specific; probe before trusting a table name:

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**Set a time window for every query.** These tables are huge and unconstrained scans time out. Filter on `_timestamp` (events) or `start_time` (`system.query.history`) with a window around the release date. Start with approximately 30 days before and after. Widen it only when a specific reason justifies the additional search.

**Prefer typed dbt models over the raw table.** `<your_analytics_db>.<schema>.<table>` is deduplicated, typed, and liquid-clustered; `your_warehouse.events.analytics_track_event` has duplicates and untyped `properties_json`. Model-name pattern: `stg_<source>_<event_name_with_underscores>`, where `<source>` is `app`, `backend`, `website`, or `cli`; confirm the exact model name with `SHOW TABLES` when the pattern alone doesn't resolve it. Use the raw table only when there's no dbt model yet, or you need events that the scheduled dbt refresh has not yet included.

**Column conventions on typed dbt models:**

- `_timestamp`, `_id`, `_auth_id`, `_request_id`, `event_name`. Standard on every model
- `properties_<name>`. Typed, underscore-cased event properties (`properties_entrypoint`, `properties_size_bytes`, …)
- `context_team_id`, `context_client_version`, `context_country`, `context_client_os`. Pre-extracted client context

### Useful Investigation Queries

Choose the table and columns that match the target:

1. **Event usage over time.** Daily counts on the relevant `stg_*` model across a ±30d window around the PR merge. A step function from zero to steady volume within a day or two of the merge is strong circumstantial evidence the PR launched the feature. A decay to zero suggests a deprecation or deletion.
2. **Origin of a defensive check.** Distribution (median / p99 / max) of the relevant `properties_<name>` column in the 14 days *before* the PR. A p99 that matches the target's threshold constant suggests the number was chosen from data.
3. **Experiment / feature-flag lookup.** `SHOW TABLES ... LIKE '*experiment*'` to find the exposure table, then pull exposure counts by variant for the relevant flag key near the PR date.
4. **Query-history evidence for migrations, backfills, or perf rewrites.** `system.query.history` filtered by `statement_text ILIKE '%<table_or_symbol>%'` with a narrow `start_time` window finds expensive queries that likely motivated the change (sort by `total_duration_ms` or aggregate `SUM(read_bytes)`, `COUNT(*)`).
5. **dbt lineage.** If the target reads from or writes into a `<your_analytics_db>.<schema>` model, the model's own git history (in this repo) often carries the rationale. Send that reference to the git investigator. Keep your search within the assigned analytics source.

## What good evidence looks like here

In addition to the queries above:

- An error-classifying event's count drops to near zero in the days after a defensive-code PR. Suggests the PR resolved that error class
- An exposure table row names the target's feature-flag key with a "shipped" / "concluded" decision around the PR ship date

## Common pitfalls

- **Instrumentation does not establish causation.** An event's existence means someone cared enough to log it, not that the target code exists *because* of it. Pair with a PR/commit citation from the git investigator before claiming causation.
- **Silent instrumentation changes.** A step function in event volume may mean a new event started being logged, not that user behavior changed. Check for instrumentation PRs in the same window before treating the increase as evidence of a feature launch.
- **Schema drift.** Event properties evolve; a column on the typed dbt model today may not have existed when the target was written. Older data may carry the property only inside raw `properties_json`.
- **dbt refresh lag.** `<your_analytics_db>.<schema>.*` is rebuilt on a schedule (often hourly/daily). For events from the last few hours, fall back to `your_warehouse.events.*` and deduplicate by `_id`.
- **Company-specific tables.** Experiment, feature-flag, billing, and usage tables vary. Reporting a result from a table whose existence you never confirmed is a classic failure mode. Probe with `SHOW TABLES` / `DESCRIBE TABLE` first.
- **Missing historical data.** If the relevant window predates the table's retention or the dbt model's creation date, that's a gap in coverage. Do not report it as a search with no results. Name it explicitly so the synthesizer does not interpret missing data as no activity.
- **Notebooks aren't queryable.** The SQL MCP can't see Databricks notebooks. If you suspect the rationale lives in one, return a gap.

## What to return

For each relevant finding:
- Type (product event / experiment exposure / usage or billing event / system-table row / dbt model)
- Fully-qualified table name and the exact query you ran
- Time window queried
- Compact numeric summary (counts, percentiles, first/last-seen timestamps). **Don't dump raw rows.**
- Temporal correlation with the target's release date (e.g., "first row 2024-08-15; PR #49074 merged 2024-08-14")
- Relevance + strength: direct / circumstantial / weak
