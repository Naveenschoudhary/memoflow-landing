/**
 * Faithful recreations of MemoFlow's real UI, rendered as HTML so they stay
 * retina-crisp at any size. Swap in real screenshots any time by dropping
 * PNGs into /public/screenshots — see README.
 */

const Bars = ({ count, small = false }: { count: number; small?: boolean }) => (
  <span className={`wave ${small ? "wave-sm" : ""}`} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <i key={i} />
    ))}
  </span>
);

const TrafficLights = () => (
  <div className="flex gap-1.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
  </div>
);

/** Hero: the live recording screen with waveform + live transcript. */
export function RecordingWindow() {
  return (
    <div
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-2xl shadow-black/60"
      role="img"
      aria-label="MemoFlow recording a meeting: live waveform and live transcript with You and Others speaker labels"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3">
        <TrafficLights />
        <span className="text-xs text-[var(--muted)]">MemoFlow</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 flex-col border-r border-[var(--line)] bg-black/20 p-3 text-[13px] sm:flex">
          <div className="mb-3 rounded-md bg-white/5 px-2 py-1.5 text-xs text-[var(--muted)]">
            Search meetings
          </div>
          <div className="space-y-0.5 text-[var(--muted)]">
            <div className="rounded-md px-2 py-1">✦ Ask</div>
            <div className="rounded-md px-2 py-1">⌨ Dictation</div>
            <div className="rounded-md px-2 py-1">⚙ Settings</div>
          </div>
          <div className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]/60">
            Meetings
          </div>
          <div className="mt-1 rounded-md bg-white/10 px-2 py-1.5">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Client Kickoff
          </div>
          <div className="px-2 py-1.5 text-[var(--muted)]">Q3 Budget Review</div>
          <div className="mt-auto rounded-lg bg-[var(--accent)] px-3 py-1.5 text-center text-xs font-semibold text-white">
            ◉ Record
          </div>
        </div>

        {/* Detail: recording */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col items-center gap-3 px-6 py-6">
            <div
              className="text-4xl font-medium tracking-tight [font-variant-numeric:tabular-nums]"
              style={{ fontFamily: "ui-rounded, -apple-system, sans-serif" }}
            >
              12:36
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
              Recording
            </div>
            <div className="h-16 w-full max-w-md">
              <Bars count={56} />
            </div>
            <div className="text-[11px] text-[var(--muted)]/60">
              You above · others below
            </div>
            <div className="flex gap-2">
              <span className="rounded-lg border border-[var(--line)] px-4 py-1.5 text-sm text-[var(--muted)]">
                Pause
              </span>
              <span className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white">
                Stop
              </span>
            </div>
          </div>

          {/* Live transcript */}
          <div className="space-y-3 border-t border-[var(--line)] px-6 py-4 text-sm">
            <div>
              <div className="text-[10px] font-semibold text-[var(--accent)]">YOU</div>
              <p>Let&apos;s lock the launch for the 24th and brief design tomorrow.</p>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[var(--muted)]">OTHERS</div>
              <p>
                Works for us — Priya will send the revised budget tonight.
              </p>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-[var(--accent)]">YOU</div>
              <p className="italic text-[var(--muted)]">Perfect, then action items are…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Summary tab with action items. */
export function SummaryFrame() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl shadow-black/40"
      role="img"
      aria-label="MemoFlow meeting summary with action items"
    >
      <div className="border-b border-[var(--line)] px-5 py-4">
        <div className="text-base font-semibold">Q3 Budget Cut to 65k</div>
        <div className="mt-0.5 text-xs text-[var(--muted)]">
          Jul 16 · 32:11 · Zoom
        </div>
        <div className="mt-3 flex w-fit rounded-lg bg-black/30 p-0.5 text-xs">
          <span className="rounded-md bg-white/10 px-3 py-1">Summary</span>
          <span className="px-3 py-1 text-[var(--muted)]">Transcript</span>
          <span className="px-3 py-1 text-[var(--muted)]">Chat</span>
        </div>
      </div>
      <div className="space-y-4 px-5 py-4 text-sm">
        <p className="text-[var(--muted)]">
          The team agreed to reduce Q3 spend from 80k to 65k, protecting the
          hiring budget. Marketing shifts to performance channels only.
        </p>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]/70">
            Action items
          </div>
          <ul className="space-y-1.5">
            {[
              "Priya: send revised budget by Friday",
              "Freeze new tool purchases until August",
              "Naveen: brief design on the launch scope",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-[var(--muted)]/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Ask chat with citation chips. */
export function ChatFrame() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl shadow-black/40"
      role="img"
      aria-label="MemoFlow Ask chat answering a question with citations that jump to the exact moment in the recording"
    >
      <div className="space-y-4 px-5 py-5 text-sm">
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl bg-[var(--accent)]/20 px-4 py-2">
            What did we decide about the launch date?
          </div>
        </div>
        <div className="max-w-[85%] space-y-2">
          <div className="rounded-2xl bg-white/5 px-4 py-2 text-[var(--muted)]">
            You locked the launch for <span className="text-[var(--text)]">July 24th</span> and
            agreed design gets briefed the next morning [1]. Priya owns the
            revised budget before then [2].
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Client Kickoff · 12:04", "Client Kickoff · 27:41"].map((c) => (
              <span
                key={c}
                className="flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                <span className="text-[var(--accent)]">▸</span>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-[var(--muted)]">
          Ask about your meetings…
          <span className="ml-auto text-[var(--accent)]">↑</span>
        </div>
      </div>
    </div>
  );
}

/** Dictation HUD + self-correction demo. */
export function DictationFrame() {
  return (
    <div className="space-y-4" role="img" aria-label="MemoFlow dictation: floating HUD capsule and a self-correction example">
      <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-2)]/90 px-5 py-3 shadow-xl shadow-black/50 backdrop-blur">
        <span className="flex h-5 w-14 items-center">
          <Bars count={14} small />
        </span>
        <span className="text-sm text-[var(--muted)]">
          let&apos;s move the meeting to six… no, seven
        </span>
      </div>
      <div className="mx-auto w-fit rounded-xl border border-[var(--line)] bg-black/30 px-4 py-3 text-sm">
        <span className="text-[var(--muted)]">inserted → </span>
        <span className="font-medium">“Let&apos;s move the meeting to 7 o&apos;clock.”</span>
      </div>
    </div>
  );
}

/** Hinglish transcript sample. */
export function HinglishFrame() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-xl shadow-black/40"
      role="img"
      aria-label="MemoFlow transcribing a Hinglish meeting, mixing Hindi and English naturally"
    >
      <div className="space-y-3 px-5 py-5 text-sm">
        <div>
          <div className="text-[10px] font-semibold text-[var(--accent)]">YOU</div>
          <p lang="hi">
            कल <span className="text-[var(--accent)]">client</span> के साथ meeting
            है, budget final करना है।
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[var(--muted)]">OTHERS</div>
          <p>Haan, deck main aaj raat bhej dunga.</p>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[var(--accent)]">YOU</div>
          <p>Perfect — action items note kar lo.</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] bg-black/20 px-5 py-2.5 text-xs text-[var(--muted)]">
        Whisper large-v3 turbo · on-device · auto Hindi/English
      </div>
    </div>
  );
}
