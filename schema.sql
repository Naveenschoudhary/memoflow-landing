-- MemoFlow landing database schema. Run once against the Postgres database
-- that DATABASE_URL points at:
--   psql "$DATABASE_URL" -f schema.sql

CREATE TABLE IF NOT EXISTS downloads (
    id            uuid PRIMARY KEY,
    email         text        NOT NULL,
    os            text        NOT NULL,
    download_link text        NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    status        text        NOT NULL DEFAULT 'pending',
    email_status  text        NOT NULL DEFAULT 'pending',
    downloaded_at timestamptz
);

-- The signup list you actually market to.
CREATE INDEX IF NOT EXISTS downloads_email_idx ON downloads (email);
CREATE INDEX IF NOT EXISTS downloads_created_at_idx ON downloads (created_at DESC);
