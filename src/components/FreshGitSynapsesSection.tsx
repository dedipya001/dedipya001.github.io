import React from 'react';
import { GitSynapsesSection as ExistingGitSynapsesSection } from './GitSynapsesSection.tsx';

let fetchShimInstalled = false;

function installFreshGitHubStatsFetch() {
  if (fetchShimInstalled || typeof window === 'undefined') return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const rawUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const parsedUrl = new URL(rawUrl, window.location.href);
    const isGitHubStatsApi = parsedUrl.pathname.endsWith('/api/github-contributions');
    const isGitHubStatsJson = parsedUrl.pathname.endsWith('/data/github_contributions.json');

    if (isGitHubStatsApi || isGitHubStatsJson) {
      const freshUrl = `${import.meta.env.BASE_URL}data/github_contributions.json?v=${Date.now()}`;
      return originalFetch(freshUrl, {
        ...init,
        cache: 'no-store',
        headers: {
          ...(init?.headers || {}),
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
    }

    return originalFetch(input, init);
  }) as typeof window.fetch;

  fetchShimInstalled = true;
}

export const FreshGitSynapsesSection: React.FC = () => {
  // Install before the existing section mounts so its useEffect receives fresh data.
  installFreshGitHubStatsFetch();
  return <ExistingGitSynapsesSection />;
};
