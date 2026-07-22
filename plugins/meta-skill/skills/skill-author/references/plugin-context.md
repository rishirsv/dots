# Skills Inside Plugins

Read this when a skill ships as part of a plugin or its changes depend on other
plugin components. Keep skill authoring focused on the skill payload; use the
host's plugin-development workflow for manifests, scaffolding, installation,
and components that are not skills.

## Choose The Owning Component

Use the component whose runtime matches the job:

| Need | Owning component |
|---|---|
| Reusable judgment, domain knowledge, or a recurring agent workflow | Skill |
| A bounded task delegated to a separate context | Agent |
| A reaction to a lifecycle event or a deterministic guardrail | Hook |
| Live external data, authentication, or tool calls | App, connector, or MCP server |
| User or project configuration and durable runtime state | Host-supported settings or plugin state |
| Packaging, discovery, installation, or presentation metadata | Plugin manifest and marketplace |

Do not hide an agent, hook, service integration, or state system inside skill
prose. A skill may explain when to use another component, but that component
must own its execution, security, lifecycle, and validation.

## Keep The Installed Shape Portable

- Resolve skill links relative to the skill and plugin layout, not the current
  checkout or shell working directory.
- Use a host-provided plugin-root variable only when that host guarantees it;
  otherwise keep resource paths relative and let the owning runtime resolve
  them.
- Keep credentials and machine-specific configuration outside the skill. Point
  to the host's authentication or settings mechanism instead.
- Match component identifiers exactly, including namespaces and tool names.
  Do not document an agent, hook, command, app, or MCP tool that the plugin does
  not actually provide.
- Keep host-specific instructions conditional. Do not present a Claude or Codex
  convention as a portable Agent Skills rule.

## Validate The Plugin Boundary

Before finishing a plugin-contained skill:

1. Check the plugin manifest and marketplace metadata when the change affects
   discovery, paths, capabilities, or public behavior.
2. Resolve every referenced component and resource from the plugin root. Check
   that declared tools, agents, hooks, apps, and MCP servers exist under the
   names the skill uses.
3. Run the skill validator and the owning plugin's component validators and
   deterministic tests.
4. Validate the packaged or copied plugin tree when path resolution or payload
   inclusion matters; a passing source-tree check does not prove the installed
   layout works.
5. Smoke-test discovery and the changed integration in the target host when the
   requested conclusion depends on runtime behavior. Record which host and
   installed version were tested.
6. Update the owning plugin version and marketplace metadata when repository
   release conventions require it.

Repository-owned manifest and marketplace source files follow repository
conventions and may change with the requested source work. Installation, cache
updates, publication, and live service calls remain outside the source scope;
perform them only when the user requests them.
