# Private Secure MCP Tunnel profile

The local path is a real stdio MCP frontend attached to the already-running owner daemon. The private frontend is bound to one owner/device installation, not cryptographically identified individual chats. Do not share it as a multi-account service. The hosted relay is the account-separated path.

The official client supports forwarding a local stdio command. With an already provisioned tunnel and owner-managed runtime-key storage, inspect the installed client's help, configure a dedicated profile, and point its command to the installed Portal launcher:

```sh
tunnel-client help quickstart
tunnel-client init --sample sample_mcp_stdio_local --profile portal \
  --tunnel-id YOUR_PROVISIONED_TUNNEL_ID \
  --mcp-command '/absolute/path/to/portal mcp --stdio'
tunnel-client doctor --profile portal --explain
tunnel-client run --profile portal
```

Supply `CONTROL_PLANE_API_KEY` only through your approved local secret-injection mechanism, not a command argument, a committed file or this runbook. Record the actual client version/hash. Choose a path without quoting ambiguity and validate the generated profile. Portal does not modify an existing tunnel profile or copy legacy credentials. This is an externally run client: **Portal's own tunnel-client supervisor, readiness adapter and reconnection qualification are not implemented here.** `portal configure tunnel` currently records configuration only. Do not confuse that with a working supervised tunnel.

The real host tests must scan the five static skills, read/guard-write a disposable file, start/retrieve a qualified command, disconnect/reconnect the tunnel without replaying it, and capture the actual results seen in ChatGPT. None ran in this container. No anonymous HTTP port is needed or supplied.

Primary source: https://developers.openai.com/api/docs/guides/secure-mcp-tunnels

The provider distinguishes private tunnel access and runtime permissions from public plugin distribution. Use the owned HTTPS relay for the latter; do not describe a subscription as supplying these deployment credentials.
