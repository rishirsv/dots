/**
 * Pulse's Bird credential boundary: explicit environment cookies only.
 * Browser profiles, Keychain, and session stores are intentionally unsupported.
 */
function normalizeValue(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cookieHeader(authToken, ct0) {
  return `auth_token=${authToken}; ct0=${ct0}`;
}

export async function resolveCredentials() {
  const authToken = normalizeValue(process.env.AUTH_TOKEN);
  const ct0 = normalizeValue(process.env.CT0);
  const warnings = [];
  if (!authToken) warnings.push('Missing AUTH_TOKEN environment variable');
  if (!ct0) warnings.push('Missing CT0 environment variable');
  return {
    cookies: {
      authToken,
      ct0,
      cookieHeader: authToken && ct0 ? cookieHeader(authToken, ct0) : null,
      source: authToken && ct0 ? 'explicit environment variables' : null,
    },
    warnings,
  };
}
