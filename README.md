# AI Tools

This repo is organized by purpose so configs, production skills, internal projects, third-party references, and disposable workspaces stay separate.

## Structure

- `configs/`: synced configuration and prompt material
- `configs/chatgpt/`: ChatGPT-specific prompts, archives, and reference files
- `configs/local/`: local machine configs you sync between computers
- `skills/production/`: final, deployed skills you actively use
- `projects/kpmg-utils/`: KPMG/internal AI utilities and development work
- `vendor/examples/`: third-party example skill and plugin repositories from the internet
- `vendor/chatgpt-imports/`: ChatGPT-oriented imports or subsets kept for reference
- `workspaces/sandbox/`: install/test area with `.agents`, sample files, and generated outputs
- `docs/`: lightweight repo documentation

## Conventions

- Build and experiment in `projects/` or `workspaces/`, not inside `skills/production/`.
- Promote only stable, deployable skills into `skills/production/`.
- Keep third-party material in `vendor/` so it never gets confused with your own shipped work.
- Treat `workspaces/sandbox/` as disposable operating space for tests and task execution.
