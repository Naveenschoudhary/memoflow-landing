import postgres from "postgres";

// Self-hosted Postgres, configured with a single connection string:
//   DATABASE_URL=postgres://user:password@host:5432/memoflow
// Append ?sslmode=require if the server has TLS. Schema lives in schema.sql.
const url = process.env.DATABASE_URL;

// max 1: each Vercel serverless invocation holds a single short-lived
// connection — signup traffic never needs pooling beyond that.
export const sql = url
  ? postgres(url, { max: 1, idle_timeout: 20, connect_timeout: 10 })
  : null;

export const isInitialized = () => !!sql;

export interface DownloadRow {
  id: string;
  email: string;
  os: string;
  download_link: string;
  created_at: string | Date;
  status: string;
  email_status: string;
  downloaded_at: string | Date | null;
}
