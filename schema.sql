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

-- ---------------------------------------------------------------------------
-- Outreach: promotional campaigns and the contact/opt-out list.
-- Additive; the download flow above is untouched.
-- ---------------------------------------------------------------------------

-- One row per address we have ever emailed a promotion to.
--
-- unsubscribe_token is a random per-address secret rather than a signature, so
-- an unsubscribe link stays valid forever — deriving it from any credential
-- would silently break every link already sitting in someone's inbox the next
-- time that credential was rotated.
CREATE TABLE IF NOT EXISTS email_contacts (
    email             VARCHAR(320) NOT NULL PRIMARY KEY,
    unsubscribe_token CHAR(32)     NOT NULL,
    unsubscribed_at   TIMESTAMP    NULL DEFAULT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY email_contacts_token_idx (unsubscribe_token)
);

-- What was sent, to whom, and how it went.
CREATE TABLE IF NOT EXISTS email_campaigns (
    id         CHAR(36)     NOT NULL PRIMARY KEY,
    subject    VARCHAR(255) NOT NULL,
    body       MEDIUMTEXT   NOT NULL,
    audience   VARCHAR(32)  NOT NULL,
    recipients INT          NOT NULL DEFAULT 0,
    sent       INT          NOT NULL DEFAULT 0,
    failed     INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX email_campaigns_created_at_idx (created_at)
);
