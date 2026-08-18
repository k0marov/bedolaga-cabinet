import { describe, expect, it } from 'vitest';
import { normalizeSubscriptionUrls, withPhpSuffix } from './subscriptionUrl';

describe('withPhpSuffix', () => {
  it('appends .php to an HTTP subscription path', () => {
    expect(withPhpSuffix('https://sub.example.com/abc')).toBe(
      'https://sub.example.com/abc.php',
    );
  });

  it('removes trailing slashes before appending the suffix', () => {
    expect(withPhpSuffix('https://sub.example.com/abc/')).toBe(
      'https://sub.example.com/abc.php',
    );
  });

  it('keeps query parameters and fragments after .php', () => {
    expect(withPhpSuffix('https://sub.example.com/abc?token=1#install')).toBe(
      'https://sub.example.com/abc.php?token=1#install',
    );
  });

  it('does not duplicate an existing suffix', () => {
    expect(withPhpSuffix('https://sub.example.com/abc.PHP?token=1')).toBe(
      'https://sub.example.com/abc.PHP?token=1',
    );
  });

  it('does not alter non-HTTP application links', () => {
    expect(withPhpSuffix('happ://add/example')).toBe('happ://add/example');
  });
});

describe('normalizeSubscriptionUrls', () => {
  it('normalizes snake_case and camelCase fields at any nesting depth', () => {
    const payload = {
      subscription_url: 'https://sub.example.com/one',
      nested: [{ subscriptionUrl: 'https://sub.example.com/two?x=1' }],
      unrelated_url: 'https://sub.example.com/three',
    };

    expect(normalizeSubscriptionUrls(payload)).toEqual({
      subscription_url: 'https://sub.example.com/one.php',
      nested: [{ subscriptionUrl: 'https://sub.example.com/two.php?x=1' }],
      unrelated_url: 'https://sub.example.com/three',
    });
  });
});
