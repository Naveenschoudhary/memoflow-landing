import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/**
 * Every read the dashboard makes, in one place. Server-side only — it holds
 * the mysql2 pool, so importing it from a client component fails the build.
 *
 * All aggregation happens in MySQL rather than by pulling rows into the page:
 * the counts stay correct as the table grows, and the day buckets are cut by
 * the same server clock that stamped created_at — bucketing in JS would shift
 * every row by the serverless region's UTC offset.
 *
 * Each function degrades to nulls/empties instead of throwing, so one failing
 * panel never takes the whole dashboard down with it.
 */

export type Overview = {
  signups: number;
  uniqueEmails: number;
  downloaded: number;
  uniqueDownloaders: number;
  pending: number;
  expired: number;
  emailFailed: number;
  emailsSent: number;
  signups24h: number;
  signups7d: number;
  signups30d: number;
  downloads7d: number;
  firstSignupAt: Date | null;
  lastSignupAt: Date | null;
};

export type DayPoint = { day: string; signups: number; downloaded: number };
export type Breakdown = { label: string; count: number; downloaded: number };

export type SignupRow = {
  id: string;
  email: string;
  os: string;
  created_at: Date;
  status: string;
  email_status: string;
  downloaded_at: Date | null;
  /** How many links this address has been sent. Only set in the people view. */
  attempts?: number;
};

/** Statuses the download flow can leave behind (see lib/email + api/download). */
export const STATUSES = ['pending', 'downloaded', 'expired', 'email_failed'] as const;

const num = (value: unknown) => Number(value ?? 0);

export async function getOverview(): Promise<Overview | null> {
  if (!db) return null;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT
         COUNT(*)                                                        AS signups,
         COUNT(DISTINCT email)                                           AS unique_emails,
         COALESCE(SUM(status = 'downloaded'), 0)                         AS downloaded,
         COUNT(DISTINCT CASE WHEN status = 'downloaded' THEN email END)  AS unique_downloaders,
         COALESCE(SUM(status = 'pending'), 0)                            AS pending,
         COALESCE(SUM(status = 'expired'), 0)                            AS expired,
         COALESCE(SUM(status = 'email_failed'), 0)                       AS email_failed,
         COALESCE(SUM(email_status = 'sent'), 0)                         AS emails_sent,
         COALESCE(SUM(created_at >= NOW() - INTERVAL 1 DAY), 0)          AS signups_24h,
         COALESCE(SUM(created_at >= NOW() - INTERVAL 7 DAY), 0)          AS signups_7d,
         COALESCE(SUM(created_at >= NOW() - INTERVAL 30 DAY), 0)         AS signups_30d,
         COALESCE(SUM(status = 'downloaded'
                      AND downloaded_at >= NOW() - INTERVAL 7 DAY), 0)   AS downloads_7d,
         MIN(created_at)                                                 AS first_signup_at,
         MAX(created_at)                                                 AS last_signup_at
       FROM downloads`
    );

    const row = rows[0];
    if (!row) return null;

    return {
      signups: num(row.signups),
      uniqueEmails: num(row.unique_emails),
      downloaded: num(row.downloaded),
      uniqueDownloaders: num(row.unique_downloaders),
      pending: num(row.pending),
      expired: num(row.expired),
      emailFailed: num(row.email_failed),
      emailsSent: num(row.emails_sent),
      signups24h: num(row.signups_24h),
      signups7d: num(row.signups_7d),
      signups30d: num(row.signups_30d),
      downloads7d: num(row.downloads_7d),
      firstSignupAt: row.first_signup_at ? new Date(row.first_signup_at) : null,
      lastSignupAt: row.last_signup_at ? new Date(row.last_signup_at) : null,
    };
  } catch (error) {
    console.error('superadmin/getOverview:', error);
    return null;
  }
}

/**
 * One row per calendar day for the last `days` days — including days nobody
 * signed up, which GROUP BY alone would omit and the chart would then draw as
 * a shorter, denser, and quietly wrong time axis.
 */
export async function getDaily(days = 30): Promise<DayPoint[]> {
  if (!db) return [];

  // Inlined, not a placeholder: mysql2's prepared-statement path rejects a
  // bound parameter inside INTERVAL. Clamped to an integer first, so nothing
  // user-supplied reaches the SQL string.
  const window = Math.min(365, Math.max(1, Math.floor(days)));

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT DATE(created_at)                        AS day,
              COUNT(*)                                AS signups,
              COALESCE(SUM(status = 'downloaded'), 0) AS downloaded
       FROM downloads
       WHERE created_at >= CURDATE() - INTERVAL ${window - 1} DAY
       GROUP BY DATE(created_at)`
    );

    const byDay = new Map<string, { signups: number; downloaded: number }>();
    for (const row of rows) {
      byDay.set(isoDay(row.day), {
        signups: num(row.signups),
        downloaded: num(row.downloaded),
      });
    }

    const today = new Date();
    const series: DayPoint[] = [];
    for (let offset = window - 1; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      const key = isoDay(date);
      const found = byDay.get(key);
      series.push({ day: key, signups: found?.signups ?? 0, downloaded: found?.downloaded ?? 0 });
    }
    return series;
  } catch (error) {
    console.error('superadmin/getDaily:', error);
    return [];
  }
}

/** Local Y-M-D. toISOString would shift the date for anyone behind UTC. */
function isoDay(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function getByOs(): Promise<Breakdown[]> {
  return groupBy('os', 'os');
}

/**
 * Which mailbox providers the signups come from. A rising share of company
 * domains is the difference between hobbyist interest and team interest, and
 * it costs one query to see.
 */
export async function getByDomain(limit = 8): Promise<Breakdown[]> {
  return groupBy("SUBSTRING_INDEX(email, '@', -1)", 'domain', limit);
}

async function groupBy(expression: string, alias: string, limit?: number): Promise<Breakdown[]> {
  if (!db) return [];

  const cap = limit ? `LIMIT ${Math.min(50, Math.max(1, Math.floor(limit)))}` : '';

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT ${expression}                            AS ${alias},
              COUNT(*)                                 AS n,
              COALESCE(SUM(status = 'downloaded'), 0)  AS downloaded
       FROM downloads
       GROUP BY ${alias}
       ORDER BY n DESC
       ${cap}`
    );

    return rows.map((row) => ({
      label: String(row[alias] ?? 'unknown'),
      count: num(row.n),
      downloaded: num(row.downloaded),
    }));
  } catch (error) {
    console.error(`superadmin/groupBy(${alias}):`, error);
    return [];
  }
}

export type SignupQuery = {
  /** Substring match on the email address. */
  q?: string;
  status?: string;
  page?: number;
  perPage?: number;
  /**
   * 'people' — one row per address, which is what the list is for: the
   * download flow writes a row per emailed link, so 68 rows are 21 people and
   * a per-row list repeats the same person up to ten times, each with its own
   * Resend button.
   *
   * 'attempts' — every row, for reading one person's history.
   */
  view?: SignupView;
};

export type SignupView = 'people' | 'attempts';

export async function getSignups({
  q,
  status,
  page = 1,
  perPage = 50,
  view = 'people',
}: SignupQuery): Promise<{
  rows: SignupRow[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}> {
  const size = Math.min(200, Math.max(10, Math.floor(perPage)));
  const current = Math.max(1, Math.floor(page));
  const empty = { rows: [], total: 0, page: current, perPage: size, pages: 0 };

  if (!db) return empty;

  const people = view === 'people';

  const search: string[] = [];
  const searchParams: string[] = [];
  if (q) {
    search.push('email LIKE ?');
    searchParams.push(`%${q}%`);
  }

  // Compared against the known set rather than interpolated, so an unexpected
  // value returns nothing instead of reaching the query.
  const wantedStatus =
    status && (STATUSES as readonly string[]).includes(status) ? status : null;

  /**
   * The status filter lands in different places in the two views.
   *
   * Per row it is a WHERE on that row's own status. Per person it is a HAVING
   * on "has at least one link like this", which is the question an operator is
   * actually asking — and the same rule the resend panel counts by, so the two
   * screens agree. Filtering on the *collapsed* status instead would answer 0
   * for "email failed" here while 27 such rows exist, because nobody's newest
   * attempt happens to be a failure.
   */
  const rowStatus = !people && wantedStatus ? ['status = ?'] : [];
  const clause = [...search, ...rowStatus].length
    ? `WHERE ${[...search, ...rowStatus].join(' AND ')}`
    : '';
  const having = people && wantedStatus ? 'HAVING SUM(status = ?) > 0' : '';
  const params = [...searchParams, ...(wantedStatus ? [wantedStatus] : [])];

  /**
   * One person, collapsed from their rows.
   *
   * GROUP_CONCAT ordered by date, then SUBSTRING_INDEX for the first element,
   * is how MySQL says "the value from the newest row" without a self-join.
   * group_concat_max_len truncates the tail of a long list, which cannot
   * affect the element being read.
   *
   * The status rule is the one that matters: a person who ever downloaded is
   * done, whatever their later rows say. Without it the five people here who
   * downloaded after a failed attempt would each keep a Resend button on their
   * older rows — offering to email the app to people who already have it.
   */
  const personSelect = `SELECT
              SUBSTRING_INDEX(GROUP_CONCAT(id ORDER BY created_at DESC), ',', 1)            AS id,
              email,
              SUBSTRING_INDEX(GROUP_CONCAT(os ORDER BY created_at DESC), ',', 1)            AS os,
              IF(SUM(status = 'downloaded') > 0, 'downloaded',
                 SUBSTRING_INDEX(GROUP_CONCAT(status ORDER BY created_at DESC), ',', 1))    AS person_status,
              SUBSTRING_INDEX(GROUP_CONCAT(email_status ORDER BY created_at DESC), ',', 1)  AS email_status,
              MAX(created_at)                                                               AS created_at,
              MAX(downloaded_at)                                                            AS downloaded_at,
              COUNT(*)                                                                      AS attempts
       FROM downloads
       ${clause}
       GROUP BY email
       ${having}`;

  try {
    const [countRows] = await db.execute<RowDataPacket[]>(
      people
        ? `SELECT COUNT(*) AS total FROM (${personSelect}) AS people`
        : `SELECT COUNT(*) AS total FROM downloads ${clause}`,
      params
    );
    const total = num(countRows[0]?.total);
    const pages = Math.max(1, Math.ceil(total / size));

    // Clamp rather than return an empty page: a stale ?page= from a bookmark
    // or a shrinking filter would otherwise render "no signups recorded yet"
    // over a table that is not actually empty.
    const clamped = Math.min(current, pages);

    // LIMIT/OFFSET are interpolated after Math.floor for the same mysql2
    // prepared-statement limitation as above; both are integers by then.
    const offset = (clamped - 1) * size;
    const [rows] = await db.execute<RowDataPacket[]>(
      people
        ? `${personSelect}
       ORDER BY created_at DESC
       LIMIT ${size} OFFSET ${offset}`
        : `SELECT id, email, os, created_at, status, email_status, downloaded_at
       FROM downloads
       ${clause}
       ORDER BY created_at DESC
       LIMIT ${size} OFFSET ${offset}`,
      params
    );

    const shaped: SignupRow[] = rows.map((row) => ({
      id: String(row.id),
      email: String(row.email),
      os: String(row.os ?? 'mac'),
      created_at: new Date(row.created_at),
      status: String(people ? row.person_status : row.status),
      email_status: String(row.email_status ?? ''),
      downloaded_at: row.downloaded_at ? new Date(row.downloaded_at) : null,
      ...(people ? { attempts: num(row.attempts) } : {}),
    }));

    return { rows: shaped, total, page: clamped, perPage: size, pages };
  } catch (error) {
    console.error('superadmin/getSignups:', error);
    return empty;
  }
}
