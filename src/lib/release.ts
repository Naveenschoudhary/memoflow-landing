// Where the site learns what "latest" means, so no constant here needs bumping
// on release day.
// Exported so the superadmin dashboard reads download counts from the same
// repository this file already treats as the source of releases.
export const REPO = 'Naveenschoudhary/memoflow-models';

// Primary source: the GitHub release. It exists the moment the DMG is uploaded,
// and the asset URL comes straight from it, so the link can't point at a
// missing file. (Drafts and prereleases are excluded by /releases/latest.)
const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;

// Backup source: the Sparkle appcast installed apps poll. Served by the raw
// CDN with no API rate limit — but published by a separate manual step
// (Scripts/publish-appcast.sh), so it can lag a release. Hence second.
const APPCAST_URL = `https://raw.githubusercontent.com/${REPO}/main/appcast.xml`;

// Last resort, if both sources are unreachable, so a signup still gets a
// working link. Worth refreshing occasionally, but never load-bearing.
const PINNED: Release = {
  version: '0.6.0',
  dmgUrl: `https://github.com/${REPO}/releases/download/v0.6.0/MemoFlow-0.6.0.dmg`,
};

export type Release = { version: string; dmgUrl: string };

// One fetch per 10 minutes per deployment, so a burst of signups doesn't
// hammer GitHub (the unauthenticated API allows 60 requests/hour per IP).
const fetchOptions = () => ({
  next: { revalidate: 600 },
  signal: AbortSignal.timeout(5000),
});

// Survives a transient outage with the last good answer rather than dropping
// all the way back to the pinned constant.
let lastKnownGood: Release | null = null;

async function fromReleaseApi(): Promise<Release | null> {
  const res = await fetch(RELEASE_API, {
    ...fetchOptions(),
    headers: {
      Accept: 'application/vnd.github+json',
      // Optional: set GITHUB_TOKEN in Vercel to lift the rate limit to
      // 5,000/hour if shared serverless IPs ever start getting throttled.
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });
  if (!res.ok) throw new Error(`release API HTTP ${res.status}`);

  const release = await res.json();
  const version = String(release?.tag_name ?? '').replace(/^v/, '');
  const dmgUrl = (release?.assets ?? []).find((asset: { name?: string }) =>
    asset?.name?.endsWith('.dmg')
  )?.browser_download_url;

  return version && dmgUrl ? { version, dmgUrl } : null;
}

async function fromAppcast(): Promise<Release | null> {
  const res = await fetch(APPCAST_URL, fetchOptions());
  if (!res.ok) throw new Error(`appcast HTTP ${res.status}`);

  const xml = await res.text();
  let latest: Release | null = null;

  for (const item of xml.match(/<item\b[\s\S]*?<\/item>/g) ?? []) {
    const version = (
      item.match(/<sparkle:shortVersionString>([^<]+)<\/sparkle:shortVersionString>/) ??
      item.match(/<sparkle:version>([^<]+)<\/sparkle:version>/)
    )?.[1]?.trim();
    const dmgUrl = item.match(/<enclosure[^>]*\burl="([^"]+)"/)?.[1];

    // update-appcast.py writes newest-first, but comparing is cheap insurance
    // against a hand-edited or re-ordered appcast.
    if (version && dmgUrl && (!latest || isNewer(version, latest.version))) {
      latest = { version, dmgUrl };
    }
  }

  return latest;
}

/** Numeric, segment by segment, so 0.10.0 beats 0.9.0. */
function isNewer(a: string, b: string) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff) return diff > 0;
  }
  return false;
}

/** Latest shipped release. Never throws — degrades to the last good value. */
export async function getLatestRelease(): Promise<Release> {
  for (const source of [fromReleaseApi, fromAppcast]) {
    try {
      const release = await source();
      if (release) {
        lastKnownGood = release;
        return release;
      }
      console.error(`${source.name}: no usable release found`);
    } catch (error) {
      console.error(`${source.name}: could not read latest version:`, error);
    }
  }

  return lastKnownGood ?? PINNED;
}
