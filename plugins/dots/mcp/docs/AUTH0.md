# Auth0 and host authorization setup

This is a configuration recipe for an owner-provisioned tenant, not a verified tenant export. Portal is a resource server; it does not implement production passwords or issue production OAuth tokens. The local issuer under tests/support is deliberately test-only and refuses production startup.

## Resource and applications

Create an Auth0 custom API for the exact Portal resource identifier used as `OAUTH_AUDIENCE`, using RS256 access-token signing. Define `portal:read`, `portal:write`, `portal:exec`, `portal:documents`, `portal:network` and `portal:owner` permissions. Give the owner only the required scopes, and verify they arrive in the access-token `scope` claim. Portal does not infer scopes from a dashboard role label.

Create a confidential Regular Web Application for the owner dashboard. Allow exactly `https://YOUR-OWNED-HOST/owner/callback`, configure authorization-code support, and set OWNER_CLIENT_ID/OWNER_CLIENT_SECRET. Portal uses PKCE and checks state, nonce, ID/access-token subject equality, and the owner scope. Keep the secret server-side. No wildcard callback is required.

For the ChatGPT connection, use a distinct appropriately configured OAuth client and the client-registration mode actually supported by the tenant and target host. A predefined client is suitable when the host supports it. Do not advertise CIMD or DCR merely because Portal accepts bearer JWTs. That functionality belongs to the authorization server. Copy the exact callback and client metadata values shown by the host's management page; do not guess a stable callback or grant broad redirect wildcards. Confirm S256 PKCE, issuer discovery, resource-to-audience behavior and enabled advertised OIDC scopes.

Set `OAUTH_ISSUER` including its exact trailing-slash form, `OAUTH_JWKS_URI`, the authorize/token endpoints, `PUBLIC_ORIGIN`, and the audience from the real provider metadata. Portal obtains JWKS only from that configured location. Test issuer, wrong audience, expired/not-yet-valid credentials, wrong signature and missing scope must all fail without local execution.

## Provider qualification

Run E01 using real JOSE against the test issuer first. Then perform an owner login and a real ChatGPT authorization flow against the tenant. Save redacted HTTP statuses, discovery metadata, token claim names/scope/audience/issuer checks, and the account/device routing outcome as `evidence/relay-provider.json`. Do not save raw tokens, authorization codes, refresh credentials or the owner secret. Authenticated device pairing remains a separate, locally initiated linking protocol.

## Primary references

- OpenAI plugin authentication: https://developers.openai.com/plugins/build/auth
- Auth0 API scopes: https://auth0.com/docs/get-started/apis/scopes/api-scopes
- Auth0 application settings: https://auth0.com/docs/get-started/applications/application-settings

These were consulted for integration boundaries. No provider account was created and no host callback mode was tested in this build.
