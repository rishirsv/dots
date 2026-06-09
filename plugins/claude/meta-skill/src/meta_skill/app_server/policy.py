"""Current SDK sandbox and approval policy mapping."""


APP_SERVER_SANDBOX = "workspace_write"
APP_SERVER_APPROVAL_POLICY = "deny_all"


def sdk_policy(openai_codex):
    return openai_codex.Sandbox.workspace_write, openai_codex.ApprovalMode.deny_all

