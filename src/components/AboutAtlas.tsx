import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react'
import { allEntries } from '../content/entry'

type AboutAtlasProps = { onBack: () => void }

export function AboutAtlas({ onBack }: AboutAtlasProps) {
  return (
    <article className="w-full max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={14} weight="bold" /> Back to trace
      </button>

      <p className="mt-9 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">About the project</p>
      <h1 className="mt-2 text-balance font-serif text-4xl leading-tight text-ink sm:text-5xl">Atlas makes revision visible.</h1>
      <p className="mt-5 text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        Interaction principles become useful when their assumptions are exposed by cases that do not resemble the one that produced them.
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
        Atlas is a self-directed research-through-design project by Tanishk Salagame, designed and built in 2026. The work spans interaction design, editorial research, visual systems, prototyping, and front-end engineering.
      </p>

      <SectionLabel>The instrument</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          You begin with a provisional rule, carry it through a near case, a high-consequence case, and an orthogonal input case, then record whether the rule held, was refined, or fractured. Every version remains in the trace.
        </p>
        <p>
          Guidance anchors constrain each authored scenario; they do not settle the principle. Atlas produces no recommendation and does not score the visitor. Its output is the lineage of the visitor’s own reasoning.
        </p>
      </div>

      <SectionLabel>What changed through making</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          Atlas began as a library of completed design answers. That made the writing visible but left the visitor passive. The project was reorganized around the stress trace so the central claim could be enacted: a principle has to travel before its assumptions become inspectable.
        </p>
        <p>
          The {allEntries.length}-question corpus now supports the instrument rather than leading it. Its four reasoning patterns are explicitly presented as a single-author editorial lens—not as a measured or independently validated taxonomy.
        </p>
      </div>

      <SectionLabel>How to read the work</SectionLabel>
      <ol className="mt-6 space-y-4 border-l border-line pl-6 text-[15px] leading-relaxed text-ink-soft">
        <li><strong className="font-semibold text-ink">1 · Use the trace.</strong> The interaction is the primary artifact.</li>
        <li><strong className="font-semibold text-ink">2 · Inspect the lineage.</strong> The changed wording matters more than a final verdict.</li>
        <li><strong className="font-semibold text-ink">3 · Browse the corpus.</strong> It shows the authored patterns that informed the instrument.</li>
        <li><strong className="font-semibold text-ink">4 · Read the limits.</strong> The project distinguishes what it demonstrates from what remains untested.</li>
      </ol>

      <SectionLabel>Limits</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          The pressure cases are authored, not sampled, and their order is deliberately adversarial. Atlas has not been tested with learners, so it demonstrates a mechanism for practicing transfer without claiming that transfer occurred.
        </p>
        <p>
          The corpus contains authored arguments and product examples. Its citation audit remains part of the project record; corpus patterns should not be read as empirical proof or universal design rules.
        </p>
      </div>

      <SectionLabel>Authorship and AI disclosure</SectionLabel>
      <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
        AI assisted ideation, critique, source discovery, and code iteration. Final concept selection, scenario design, editing, visual direction, implementation decisions, and authorship are by Tanishk Salagame.
      </p>

      <div className="mt-16 flex flex-wrap gap-3 border-t border-line pt-6">
        <ProjectLink href="https://github.com/tanishkfr/atlas-slice">Source on GitHub</ProjectLink>
        <ProjectLink href="https://github.com/tanishkfr/atlas-slice/blob/master/CASESTUDY.md">Case study</ProjectLink>
        <ProjectLink href="https://github.com/tanishkfr/atlas-slice/blob/master/CITATION-AUDIT.md">Citation audit</ProjectLink>
      </div>
    </article>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-16 border-b border-line pb-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
      {children}
    </h2>
  )
}

function ProjectLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-control px-3 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children} <ArrowUpRight size={14} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
