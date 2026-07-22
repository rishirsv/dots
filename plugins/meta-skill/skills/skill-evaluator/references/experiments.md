# Execution Variants

Declare complete execution environments in
`<skill-name>/.<skill-name>/experiment.json`:

```json
{
  "variants": [
    {
      "variant": "openai-agent",
      "model": {
        "provider": "openai",
        "name": "gpt-5.6",
        "reasoning_effort": "high"
      },
      "prompt": {"path": "prompts/v2.md"},
      "skill": {"kind": "git_ref", "ref": "release-1.4"},
      "tools": ["filesystem"],
      "plugins": ["browser", "presentations"],
      "retrieval": {"strategy": "none"}
    }
  ]
}
```

The default variants are `without-skill` and `current`. A run freezes the
resolved model settings, prompt bytes, skill payload, declared capabilities,
retrieval configuration, source revision, and digests under
`inputs/variants/<variant-id>/`.

An execution adapter must provision every declared field or reject the variant
before creating trials. The current Codex Exec adapter supports OpenAI/Codex
models, reasoning effort, prompt bytes, and skill payloads. It rejects declared
tools, plugins, retrieval, and unsupported providers until an adapter owns
those capabilities.

Label comparisons as controlled when only one dimension changes. Otherwise
label them stack comparisons and limit conclusions to the whole variant.
