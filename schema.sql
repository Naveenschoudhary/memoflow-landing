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

-- ---------------------------------------------------------------------------
-- Payments and licences (Dodo Payments). Written by /api/webhooks/dodo and
-- /api/license/*, read by the licence proxy and the superadmin.
-- ---------------------------------------------------------------------------

-- Every webhook delivery, keyed by Dodo's webhook-id, so retries are idempotent.
-- processed_at is NULL until the handler finished; a retry of a failed event
-- is processed again, a retry of a finished one is acknowledged and skipped.
CREATE TABLE IF NOT EXISTS dodo_events (
    id           VARCHAR(64)  NOT NULL PRIMARY KEY,
    type         VARCHAR(64)  NOT NULL,
    received_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP    NULL DEFAULT NULL,
    payload      JSON         NOT NULL,
    INDEX dodo_events_type_idx (type),
    INDEX dodo_events_received_at_idx (received_at)
);

CREATE TABLE IF NOT EXISTS purchases (
    payment_id  VARCHAR(64)  NOT NULL PRIMARY KEY,
    customer_id VARCHAR(64)  NULL,
    email       VARCHAR(320) NULL,
    product_id  VARCHAR(64)  NULL,
    tier        VARCHAR(32)  NULL,
    amount      INT          NULL,
    currency    CHAR(3)      NULL,
    status      VARCHAR(32)  NOT NULL DEFAULT 'succeeded',
    source      VARCHAR(16)  NULL,
    metadata    JSON         NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX purchases_email_idx (email),
    INDEX purchases_created_at_idx (created_at)
);

-- The key itself is never stored: SHA-256 plus the last four characters is
-- enough to match a support thread to a purchase.
CREATE TABLE IF NOT EXISTS licenses (
    license_key_id    VARCHAR(64)  NOT NULL PRIMARY KEY,
    key_hash          CHAR(64)     NOT NULL,
    key_last4         CHAR(4)      NOT NULL,
    customer_id       VARCHAR(64)  NULL,
    email             VARCHAR(320) NULL,
    product_id        VARCHAR(64)  NOT NULL,
    tier              VARCHAR(32)  NULL,
    payment_id        VARCHAR(64)  NULL,
    activations_limit INT          NULL,
    status            VARCHAR(16)  NOT NULL DEFAULT 'active',
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at        TIMESTAMP    NULL DEFAULT NULL,
    welcome_email_at  TIMESTAMP    NULL DEFAULT NULL,
    UNIQUE KEY licenses_key_hash_idx (key_hash),
    INDEX licenses_email_idx (email),
    INDEX licenses_payment_id_idx (payment_id)
);

CREATE TABLE IF NOT EXISTS license_activations (
    id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    key_hash    CHAR(64)     NOT NULL,
    action      VARCHAR(16)  NOT NULL,
    instance_id VARCHAR(64)  NULL,
    device_name VARCHAR(255) NULL,
    app_version VARCHAR(32)  NULL,
    outcome     VARCHAR(32)  NOT NULL,
    ip_country  VARCHAR(8)   NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX license_activations_key_idx (key_hash),
    INDEX license_activations_created_at_idx (created_at)
);

-- Fixed one-minute windows per bucket ("key:<hash>" or "ip:<address>").
CREATE TABLE IF NOT EXISTS rate_limits (
    bucket       VARCHAR(128) NOT NULL PRIMARY KEY,
    window_start INT          NOT NULL,
    count        INT          NOT NULL DEFAULT 0
);
