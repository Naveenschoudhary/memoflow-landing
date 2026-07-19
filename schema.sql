-- MemoFlow landing database schema (MySQL). Run once against the database
-- that DATABASE_URL points at, e.g. via phpMyAdmin or:
--   mysql -h srv1870.hstgr.io -u <user> -p <database> < schema.sql

CREATE TABLE IF NOT EXISTS downloads (
    id            CHAR(36)     NOT NULL PRIMARY KEY,
    email         VARCHAR(320) NOT NULL,
    os            VARCHAR(16)  NOT NULL,
    download_link VARCHAR(512) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(32)  NOT NULL DEFAULT 'pending',
    email_status  VARCHAR(32)  NOT NULL DEFAULT 'pending',
    downloaded_at TIMESTAMP    NULL DEFAULT NULL,
    INDEX downloads_email_idx (email),
    INDEX downloads_created_at_idx (created_at)
);
