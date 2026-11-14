import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { Answer } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import DemoVideo from '@/components/DemoVideo';
import {
  ArticleFaq,
  ArticleSection,
  ArticleSubsection,
  Byline,
  DataTable,
  Figure,
  KeepReading,
  TableOfContents,
} from '@/components/article';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
  videoJsonLd,
  type Faq,
} from '@/lib/jsonld';
import { AUTHOR, BASE, formatDate, getPost, postUrl } from '@/lib/posts';

const SLUG = 'best-hinglish-transcription-apps-indian-teams-2026';
const post = getPost(SLUG)!;
const URL = postUrl(SLUG);
const MEDIA = '/blog/hinglish-transcription-2026';

export const metadata: Metadata = {
  title: post.metaTitle,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: post.title,
    description: post.description,
    url: URL,
    siteName: 'MemoFlow',
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified,
    images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.hero.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
    images: [post.ogImage],
  },
};

/**
 * Questions phrased the way people actually type them, not the way the
 * headings are phrased. The headings answer the reader's question; these catch
 * the long-tail variants the headings miss.
 */
const faqs: Faq[] = [
  {
    q: 'What is the best Hinglish transcription app for my workflow?',
    a: 'For live Mac meetings, shortlist MemoFlow and Muesli. For edited interviews or subtitles, check the editing and export options before choosing. Compare tools on the same Hindi-English recording, with the model and language settings noted.',
  },
  {
    q: 'Why do transcription apps get Hinglish wrong?',
    a: 'A model can handle Hindi and English separately and still drop words when a speaker switches languages within one sentence. Test names, dates and English work terms in the same sample.',
  },
  {
    q: 'Is there a Hinglish transcription app that works offline?',
    a: 'MemoFlow runs the Apex model locally once it has finished downloading and preparing. Muesli documents local Indic transcription with Bodhan models on Apple Silicon. Test the specific model and features you plan to use.',
  },
  {
    q: 'Which Hinglish transcription tool should I use for subtitles?',
    a: 'Choose an editor that lets you correct text, adjust timings and export subtitles in your required format, such as SRT or VTT. Test whether the exported file preserves the script you need.',
  },
];

const toc = [
  { id: 'why-it-breaks', label: 'Where mixed-language transcripts go wrong' },
  { id: 'what-to-look-for', label: 'What a capable app must do' },
  { id: 'meetings', label: 'What to check on a live call' },
  { id: 'by-use-case', label: 'Which app fits your use case' },
  { id: 'privacy', label: 'Privacy and the DPDP Act' },
  { id: 'best-practices', label: 'Getting cleaner transcripts' },
  { id: 'verdict', label: 'The right tool for the situation' },
  { id: 'faq', label: 'FAQ' },
];

export default function HinglishTranscriptionApps() {
  return (
    <PageShell
      eyebrow="Guide"
      title={post.title}
      backHref="/blog"
      backLabel="← All articles"
      meta={
        <Byline
          author={AUTHOR.name}
          publishedIso={post.datePublished}
          publishedLabel={formatDate(post.datePublished)}
          updatedIso={post.dateModified}
          updatedLabel={formatDate(post.dateModified)}
          readingMinutes={post.readingMinutes}
        />
      }
      hero={
        <Figure
          src={post.hero.src}
          alt={post.hero.alt}
          width={post.hero.width}
          height={post.hero.height}
          priority
        />
      }
    >
      <JsonLd
        data={articleJsonLd({
          url: URL,
          headline: post.title,
          description: post.description,
          image: `${BASE}${post.ogImage}`,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          keywords: post.keywords,
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: BASE },
          { name: 'Blog', url: `${BASE}/blog` },
          { name: post.title, url: URL },
        ])}
      />
      <JsonLd
        data={videoJsonLd({
          name: 'Hinglish dictation on a Mac, transcribed on-device',
          description:
            'MemoFlow dictating a code-switched Hinglish sentence — “Ok, kal ek client call bhi hai, so uske lie prepare hokar aana.” — directly into a chat app on macOS, with no language switching and no audio leaving the machine.',
          contentUrl: `${BASE}${MEDIA}/hinglish-dictation.mp4`,
          thumbnailUrl: `${BASE}${MEDIA}/hinglish-dictation-poster.webp`,
          uploadDate: post.datePublished,
          duration: 'PT16S',
        })}
      />

      <p className="text-lg leading-relaxed text-[var(--muted)]">
        For Hinglish meetings on a Mac, start by comparing MemoFlow and Muesli on
        the same call. For recorded interviews or subtitles, look for an editor
        with the export format you need. In both cases, try a sentence where the
        speaker switches from Hindi to English and changes a date or name.
      </p>

      <TableOfContents items={toc} />

      <ArticleSection id="why-it-breaks" title="Where do Hindi-English transcripts go wrong?">
        <Answer>
          A tool can recognise Hindi and English separately and still miss a
          name or deadline when the speaker switches mid-sentence.
        </Answer>
        <p>
          Script is another choice. Hindi written in Latin script may be useful
          for a captioning workflow. A team reviewing notes in Devanagari may
          prefer Hindi words in Devanagari and English names in Latin script.
          Agree on the output before comparing tools, then check whether the
          words and the meaning survive.
        </p>
      </ArticleSection>

      <ArticleSection
        id="what-to-look-for"
        title="What must a reliable Hinglish transcription app actually do?"
      >
        <Answer>
          Check mixed-language words, names and deadlines, the speaker
          attribution you need, and the output format your team will use.
        </Answer>
        <p>
          Try the same passage on each tool. Record the model and language settings
          and keep the raw output. If a spoken correction changes a deadline,
          compare both the transcript and the summary with the original audio.
        </p>

        <figure className="not-prose">
          <DemoVideo
            mp4={`${MEDIA}/hinglish-dictation.mp4`}
            webm={`${MEDIA}/hinglish-dictation.webm`}
            poster={`${MEDIA}/hinglish-dictation-poster.webp`}
            width={1600}
            height={280}
            label="Screen recording: dictating a Hinglish sentence into a chat app on macOS. A “Listening…” indicator appears, then the sentence “Ok, kal ek client call bhi hai, so uske lie prepare hokar aana.” is typed into the message field."
          />
          <figcaption className="mt-3 text-xs leading-relaxed text-[var(--muted)]/80">
            This published MemoFlow dictation clip shows a mixed-language sentence
            typed into a Mac app. The Hindi words appear in Latin script in this example.
          </figcaption>
        </figure>

        <DataTable
          columns={['Example', 'What to check']}
          rows={[
            [<span key="mixed" lang="hi">“कल client demo है। Deck Wednesday तक भेज देना।”</span>, 'Both languages survive. The transcript keeps client demo, deck and Wednesday.'],
            [<span key="date" lang="hi">“Tuesday नहीं, Wednesday को भेजना।”</span>, 'The transcript keeps the correction. The action item uses Wednesday.'],
          ]}
          caption="Illustrative test lines. Compare the transcript each app actually returns with the source line."
          minWidth={420}
        />
      </ArticleSection>

      <ArticleSection
        id="meetings"
        title="What should you check on a live call?"
      >
        <p>
          Calls add overlapping speech and compressed remote audio. Check whether
          the recorder captures both your microphone and the sound from the call
          before judging its speech model.
        </p>
        <p>
          MemoFlow uses the local Apex model for Hindi and Hinglish and labels
          microphone and system audio as You and Others. Use the
          {' '}<Link href="/blog/transcribe-hinglish-meeting-mac" className="underline underline-offset-4">two-person Hinglish test call</Link>{' '}
          to check each track, then review the summary for a name and deadline.
        </p>

        <Figure
          src={`${MEDIA}/memoflow-dashboard.webp`}
          alt="MemoFlow's dashboard on macOS: a sidebar of recorded standups and planning meetings, tiles reading 24,494 words captured, 90 action items, 18 meetings and 41 minutes saved, plus an activity chart and dictation statistics."
          width={2000}
          height={1306}
          caption="MemoFlow’s meeting dashboard and saved recordings."
        />
      </ArticleSection>

      <ArticleSection id="by-use-case" title="Which Hinglish transcription app fits your use case?">
        <DataTable
          columns={['Tool or workflow', 'Use it for', 'What to verify']}
          highlightFirstRow
          rows={[
            ['MemoFlow', 'Local meeting transcripts and summaries on Mac', 'Use Apex for mixed Hindi-English. Check microphone and system audio separately.'],
            ['Muesli', 'Local Indic meeting transcription on Apple Silicon', 'Its guide describes a final transcript using Bodhan Core or Flex. Verify live and final output separately.'],
            ['Sonix or MacWhisper', 'Recorded audio with timings and manual correction', 'Check SRT or VTT export and whether your chosen speech model preserves mixed-language words.'],
            ['Shunya Labs Zero STT CodeSwitch', 'An API for mixed-language speech recognition', 'Check the raw output, how your integration handles speaker labels, and where data is sent.'],
          ]}
          caption="A shortlist by workflow. The table does not report a head-to-head accuracy test."
        />
        <ArticleSubsection id="creators" title="For recorded interviews and subtitles">
          <p>
            Choose your export format before comparing models. Word timestamps
            help if you need to line up speech with video. A plain-text or
            document export may be enough if you are pulling quotes from an interview.
            Both <a href="https://help.sonix.ai/en/articles/4649596-how-do-i-create-subtitles-in-sonix" className="underline underline-offset-4">Sonix</a>{' '}
            and <a href="https://www.macwhisper.com/" className="underline underline-offset-4">MacWhisper</a>{' '}
            list SRT and VTT export. If you are building your own workflow,
            {' '}<a href="https://www.shunyalabs.ai/zero-code-switch" className="underline underline-offset-4">Shunya Labs documents an API model for code-switched speech</a>.
            Run the same clip through each candidate and open the exported file in your editor.
          </p>
        </ArticleSubsection>
        <ArticleSubsection id="teams" title="For teams and client calls">
          <p>
            Check where the app stores recordings and whether text is sent to
            another service for summaries. Check how remote speakers are labelled
            and whether a note links back to the source audio.
            {' '}<a href="https://muesli.works/blog/hinglish-indic-meeting-notes-mac/" className="underline underline-offset-4">Muesli’s Hinglish meeting guide</a>{' '}
            documents its local model options and final-transcript workflow.
          </p>
        </ArticleSubsection>
        <ArticleSubsection id="students" title="For occasional use">
          <p>
            Test a short clip from the class or interview you need to transcribe.
            Check plan limits before uploading a long recording. For offline
            speech-to-text into your own editor, see our
            {' '}<Link href="/compare/free-dictation-app-mac" className="underline underline-offset-4">Mac dictation comparison</Link>.
          </p>
        </ArticleSubsection>
      </ArticleSection>

      <ArticleSection
        id="privacy"
        title="What does India’s DPDP Act mean for cloud transcription?"
      >
        <p>
          Before recording a client call, check your organisation’s policy for
          recording, processing and sharing. If you use a hosted service, find
          out what it stores, who can access the data and how to delete it.
          For the underlying Indian rules, see the
          {' '}<a href="https://www.indiacode.nic.in/indiacode/handle/123456789/22037?view_type=browse" className="underline underline-offset-4">Digital Personal Data Protection Act on India Code</a>.
        </p>
        <p>
          MemoFlow records and transcribes on your Mac. If you explicitly
          configure a cloud model with your own API key, transcript text may
          be sent to that provider. See the
          {' '}<Link href="/privacy" className="underline underline-offset-4">MemoFlow privacy policy</Link>{' '}
          for storage and processing details.
        </p>
      </ArticleSection>

      <ArticleSection id="best-practices" title="How do you get the cleanest Hinglish transcripts?">
        <ul className="list-disc space-y-3 pl-6">
          <li>Check both audio sources before a live call. For an uploaded recording, use the cleanest copy you have.</li>
          <li>Select a model that supports mixed Hindi-English speech. Check the tool’s language options instead of assuming its default fits.</li>
          <li>Listen back around names, numbers and deadlines before sharing a transcript or summary.</li>
        </ul>
      </ArticleSection>

      <ArticleSection id="verdict" title="Choose a tool for the output you need">
        <p>
          If you need a transcript and action items from a live call, test the
          full meeting workflow. If you need captions, test the final subtitle
          export. Decide based on how much correction the output needs on a
          recording that sounds like your work.
        </p>
      </ArticleSection>

      <ArticleFaq faqs={faqs} />

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Try Hinglish meeting notes on your Mac.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          Record both sides of a practice call and review the transcript, summary and
          action items before your next meeting.
        </p>
        <div className="mt-5">
          <CTAButton>Download MemoFlow for macOS</CTAButton>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]/70">
          macOS 26 · Apple Silicon · no account, free for 7 days
        </p>
      </div>

      <KeepReading
        links={[
          {
            href: '/compare/free-dictation-app-mac',
            title: 'The best free dictation apps for Mac',
            blurb:
              'MemoFlow, Handy, OpenWhispr and FluidVoice compared — including when one of the others is the better pick.',
          },
          {
            href: '/blog/transcribe-hinglish-meeting-mac',
            title: 'How to transcribe a Hinglish meeting on Mac',
            blurb: 'Choose the local model and check both sides of a practice call.',
          },
        ]}
      />
    </PageShell>
  );
}
