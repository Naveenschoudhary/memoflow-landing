import Image from 'next/image';
import Link from 'next/link';

/**
 * Article building blocks.
 *
 * Kept separate from PageShell's `Section` because articles need anchored,
 * larger H2s and a nested H3 level, while the legal pages are flat prose and
 * should not change size because an article wanted bigger headings.
 *
 * The sizing ladder is deliberate: h1 (4xl/5xl, in PageShell) → h2 (2xl) →
 * h3 (lg). Sequential, single-level-per-step heading structure is what makes a
 * page chunk cleanly for passage-level retrieval — see
 * claudedocs/AI_VISIBILITY_PLAN.md, phase 2.
 */

/** A top-level article section. `id` is the table-of-contents anchor. */
export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}

/** A subsection inside an ArticleSection. */
export function ArticleSubsection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-2">
      <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h3>
      <div className="mt-3 space-y-4 leading-relaxed text-[var(--muted)]">{children}</div>
    </div>
  );
}

/**
 * The byline row: dates, reading time, and who wrote it.
 *
 * Both dates are rendered as <time datetime> so the machine-readable value
 * agrees with the JSON-LD instead of only existing there.
 */
export function Byline({
  publishedIso,
  publishedLabel,
  updatedIso,
  updatedLabel,
  readingMinutes,
  author,
}: {
  publishedIso: string;
  publishedLabel: string;
  updatedIso: string;
  updatedLabel: string;
  readingMinutes: number;
  author: string;
}) {
  const wasUpdated = updatedIso !== publishedIso;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
      <span className="text-[var(--text)]">{author}</span>
      <span aria-hidden="true">·</span>
      <span>
        <time dateTime={publishedIso}>{publishedLabel}</time>
      </span>
      {wasUpdated && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={updatedIso}>{updatedLabel}</time>
          </span>
        </>
      )}
      <span aria-hidden="true">·</span>
      <span>{readingMinutes} min read</span>
    </div>
  );
}

/**
 * The short list of conclusions, above the body.
 *
 * 44% of LLM citations come from the first 30% of a page, so the page's actual
 * answers belong here rather than only in a conclusion nobody retrieves.
 */
export function KeyTakeaways({ items }: { items: React.ReactNode[] }) {
  return (
    <aside
      aria-label="Key takeaways"
      className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
        The short answer
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="text-[var(--accent)]">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Jump links. Real anchors, so they work without JavaScript and get crawled. */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-[var(--line)] p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        On this page
      </h2>
      <ol className="mt-4 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-3">
            <span aria-hidden="true" className="tabular-nums text-[var(--muted)]/60">
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${item.id}`}
              className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * An image with a caption.
 *
 * next/image is used for the automatic srcset and the reserved aspect box —
 * an unsized screenshot mid-article is the usual cause of layout shift, which
 * is a ranking input, not just a nuisance.
 */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  sizes = '(min-width: 768px) 768px, 100vw',
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="not-prose">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--panel)]"
      />
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-[var(--muted)]/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** A bordered table that scrolls inside itself rather than widening the page. */
export function DataTable({
  caption,
  columns,
  rows,
  highlightFirstRow = false,
  minWidth = 640,
}: {
  caption?: React.ReactNode;
  columns: string[];
  /** Each row's first cell becomes the row header. */
  rows: React.ReactNode[][];
  /** Tint the first row — used where that row is MemoFlow. */
  highlightFirstRow?: boolean;
  minWidth?: number;
}) {
  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table
          className="w-full border-collapse text-left text-sm"
          style={{ minWidth: `${minWidth}px` }}
        >
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--panel)]">
              {columns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[var(--line)] last:border-b-0 ${
                  highlightFirstRow && i === 0 ? 'bg-[var(--accent)]/[0.07]' : ''
                }`}
              >
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th
                      key={j}
                      scope="row"
                      className={`px-4 py-3 align-top ${
                        highlightFirstRow && i === 0
                          ? 'font-semibold text-[var(--text)]'
                          : 'font-medium text-[var(--text)]'
                      }`}
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className="px-4 py-3 align-top text-[var(--muted)]">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-[var(--muted)]/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * The FAQ accordion.
 *
 * Native <details> so the answers are in the HTML whether or not anyone
 * expands them — a JS-gated accordion hides its own content from the
 * retrievers the FAQPage markup is there to feed. Styling lives in
 * globals.css alongside the home page's FAQ.
 */
export function ArticleFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
        Frequently asked questions
      </h2>
      <div className="mt-4 space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-5 py-4"
          >
            <summary className="pr-8 font-medium text-[var(--text)]">{f.q}</summary>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Internal links out of the article, so it is not a dead end for crawlers. */
export function KeepReading({ links }: { links: { href: string; title: string; blurb: string }[] }) {
  return (
    <section aria-labelledby="keep-reading">
      <h2
        id="keep-reading"
        className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
      >
        Keep reading
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[var(--accent)]/40"
          >
            <span className="block font-semibold tracking-tight text-[var(--text)]">{l.title}</span>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--muted)]">{l.blurb}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
