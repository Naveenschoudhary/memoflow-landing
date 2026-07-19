import mysql from "mysql2/promise";

// Hosted MySQL (Hostinger), configured with a single connection string:
//   DATABASE_URL=mysql://user:password@host:3306/database
// (percent-encode special characters in the password, e.g. $ -> %24).
// Schema lives in schema.sql.
const url = process.env.DATABASE_URL;

// A tiny pool per serverless instance — signup traffic never needs more,
// and shared MySQL hosting caps concurrent connections.
export const db = url
  ? mysql.createPool({ uri: url, connectionLimit: 2, waitForConnections: true })
  : null;

export const isInitialized = () => !!db;

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
