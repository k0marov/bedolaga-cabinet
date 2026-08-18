const SUBSCRIPTION_URL_KEYS = new Set(['subscription_url', 'subscriptionUrl']);

/**
 * Append the required .php suffix to a subscription URL exactly once.
 * Query parameters and fragments stay after the suffix:
 * https://example.com/sub/abc?x=1 -> https://example.com/sub/abc.php?x=1
 */
export function withPhpSuffix(value: string): string {
  const match = value.match(/^(https?:\/\/[^/?#]+)([^?#]*)([?#].*)?$/i);
  if (!match) return value;

  const origin = match[1];
  const path = match[2].replace(/\/+$/, '');
  const tail = match[3] ?? '';
  if (/\.php$/i.test(path)) return `${origin}${path}${tail}`;

  return `${origin}${path || '/'}.php${tail}`;
}

/** Normalize every subscription URL field in a JSON API response in place. */
export function normalizeSubscriptionUrls<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) {
    for (const item of payload) normalizeSubscriptionUrls(item);
    return payload;
  }

  const record = payload as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (SUBSCRIPTION_URL_KEYS.has(key) && typeof value === 'string' && value) {
      record[key] = withPhpSuffix(value);
    } else {
      normalizeSubscriptionUrls(value);
    }
  }

  return payload;
}
