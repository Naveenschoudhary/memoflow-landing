/**
 * Turns what the admin typed into a branded HTML email plus a plain-text twin.
 *
 * The composer takes plain text rather than HTML on purpose: pasted HTML is
 * the usual way a marketing email ends up broken in Outlook, and an admin
 * writing a promo should not have to think about table layouts. A very small
 * markup subset is supported instead — blank lines split paragraphs, **bold**,
 * and [text](url) links.
 *
 * Everything else is HTML-escaped, so a stray < or & in the copy cannot
 * corrupt the markup.
 */

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Only http(s) survives. Without this check a [click me](javascript:...) in
 * the body would ship a script URL to every recipient.
 */
const safeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null;
  } catch {
    return null;
  }
};

/** Escape first, then re-introduce only the markup we chose to support. */
function inline(text: string) {
  let html = escapeHtml(text);

  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, url: string) => {
    const href = safeUrl(url);
    if (!href) return label;
    return `<a href="${escapeHtml(href)}" style="color:#ff453a;text-decoration:underline;">${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html.replace(/\n/g, '<br />');
}

export function renderPromoHtml({
  body,
  unsubscribeUrl,
}: {
  body: string;
  unsubscribeUrl: string;
}) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">${inline(block)}</p>`
    )
    .join('');

  // Inline styles and a table-free single column: the combination that renders
  // consistently across Gmail, Apple Mail and Outlook.
  return `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="text-align:center;padding:40px 0;">
    <img src="https://memoflow.app/logo.png?v=2" alt="MemoFlow" style="width:96px;border-radius:21%;" />
  </div>
  <div style="background:#ff453a;padding:2px;">
    <div style="background:#ffffff;padding:30px;border-radius:8px;">
      ${paragraphs}
    </div>
  </div>
  <div style="text-align:center;padding:24px 0;color:#9ca3af;font-size:12px;line-height:1.5;">
    <p style="margin:0 0 6px;">You are receiving this because you signed up to download MemoFlow.</p>
    <p style="margin:0;">
      <a href="${escapeHtml(unsubscribeUrl)}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
    </p>
  </div>
</div>`;
}

/**
 * The plain-text alternative. Not optional: an HTML-only message scores badly
 * with spam filters, and the download mail already ships one.
 */
export function renderPromoText({
  body,
  unsubscribeUrl,
}: {
  body: string;
  unsubscribeUrl: string;
}) {
  const text = body
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, url: string) => {
      const href = safeUrl(url);
      return href ? `${label} (${href})` : label;
    })
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();

  return `${text}\n\n—\nYou are receiving this because you signed up to download MemoFlow.\nUnsubscribe: ${unsubscribeUrl}`;
}

export function unsubscribeUrlFor(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://memoflow.app';
  return `${base.replace(/\/$/, '')}/unsubscribe?token=${token}`;
}
