import { REPO } from '@/lib/release';

/**
 * Actual DMG fetches, straight from the GitHub release assets.
 *
 * This is the honest answer to "how many people downloaded the app": the
 * downloads table only counts emailed links that were clicked, and misses
 * anyone who got the DMG from a forwarded link, the release page, or
 * Sparkle's in-app updater. GitHub counts every one of them.
 *
 * What it cannot do is attribute a download to a person — there is no email
 * attached — so the two numbers answer different questions and the dashboard
 * shows both rather than picking one.
 */

export type ReleaseAsset = {
  name: string;
  downloads: number;
  size: number;
};

export type ReleaseStat = {
  version: string;
  tag: string;
  url: string;
  publishedAt: string | null;
  prerelease: boolean;
  downloads: number;
  assets: ReleaseAsset[];
};

export type ReleaseReport = {
  releases: ReleaseStat[];
  total: number;
  /** Set when GitHub could not be read, so the page can say so rather than show zero. */
  error: string | null;
};

export async function getReleaseDownloads(): Promise<ReleaseReport> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
      // Cached briefly: the unauthenticated API allows 60 requests/hour per IP
      // and a dashboard refresh should not be able to burn through that.
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    });

    if (!res.ok) {
      // 403 here is nearly always the rate limit, which is worth naming
      // precisely — it is fixed by setting GITHUB_TOKEN, not by retrying.
      const hint =
        res.status === 403
          ? 'GitHub API rate limit reached — set GITHUB_TOKEN to lift it to 5,000/hour.'
          : `GitHub API returned HTTP ${res.status}.`;
      return { releases: [], total: 0, error: hint };
    }

    const payload = (await res.json()) as GitHubRelease[];

    const releases: ReleaseStat[] = payload.map((release) => {
      // The .dmg only — the same asset lib/release.ts hands out as "the app".
      // This repository also hosts the Whisper model weights as release zips
      // (apex-v1 is a 1.2 GB download), and counting those as app installs
      // would overstate the number by roughly a third.
      const assets = (release.assets ?? [])
        .filter((asset) => asset.name?.endsWith('.dmg'))
        .map((asset) => ({
          name: asset.name,
          downloads: Number(asset.download_count ?? 0),
          size: Number(asset.size ?? 0),
        }));

      return {
        version: String(release.tag_name ?? '').replace(/^v/, '') || 'unknown',
        tag: String(release.tag_name ?? ''),
        url: release.html_url ?? '',
        publishedAt: release.published_at ?? null,
        prerelease: Boolean(release.prerelease),
        downloads: assets.reduce((sum, asset) => sum + asset.downloads, 0),
        assets,
      };
    });

    // Model-weight releases carry no installer, so they are not app versions
    // and do not belong on a page counting app downloads.
    const shipped = releases.filter((release) => release.assets.length > 0);
    shipped.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));

    return {
      releases: shipped,
      total: shipped.reduce((sum, release) => sum + release.downloads, 0),
      error: null,
    };
  } catch (error) {
    console.error('superadmin/getReleaseDownloads:', error);
    return {
      releases: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Could not reach the GitHub API.',
    };
  }
}

type GitHubRelease = {
  tag_name?: string;
  html_url?: string;
  published_at?: string;
  prerelease?: boolean;
  assets?: { name: string; download_count?: number; size?: number }[];
};
