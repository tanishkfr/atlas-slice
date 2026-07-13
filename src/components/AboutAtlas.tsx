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
        <ArrowLeft size={14} weight="bold" /> Back to rule test
      </button>

      <p className="mt-9 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">About the project</p>
      <h1 className="mt-2 text-balance font-serif text-4xl leading-tight text-ink sm:text-5xl">Atlas makes changed thinking easy to see.</h1>
      <p className="mt-5 text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        A design rule becomes useful only after you try it in situations that are very different from the one where it started.
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
        Atlas is an independent design project by Tanishk Salagame, designed and built in 2026. It combines writing, interaction design, visual design, prototyping, and front-end engineering.
      </p>

      <SectionLabel>How it works</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          You write a starting rule, try it in a similar example, a high-risk example, and an accessibility example, then choose whether it still works, needs a change, or breaks. Atlas keeps every version.
        </p>
        <p>
          Source links explain important limits in each example, but they do not give you the answer. Atlas does not grade you. It simply shows how your rule changed.
        </p>
      </div>

      <SectionLabel>Why Atlas has two parts</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          Atlas began as a list of completed design answers. That showed the writing, but gave visitors little to do. The rule test was added so people could try the main idea for themselves.
        </p>
        <p>
          The {allEntries.length} design examples are still available. They are grouped in four simple answer styles to make them easier to browse. The groups were created by one author and have not been tested as a formal system.
        </p>
      </div>

      <SectionLabel>Where to start</SectionLabel>
      <ol className="mt-6 space-y-4 border-l border-line pl-6 text-[15px] leading-relaxed text-ink-soft">
        <li><strong className="font-semibold text-ink">1 · Test a rule.</strong> Start with the main activity.</li>
        <li><strong className="font-semibold text-ink">2 · Review your changes.</strong> Look at what you rewrote and why.</li>
        <li><strong className="font-semibold text-ink">3 · Browse all 33 examples.</strong> Open any design question to read the full answer.</li>
        <li><strong className="font-semibold text-ink">4 · Read what is still untested.</strong> The project is clear about what it can and cannot prove.</li>
      </ol>

      <SectionLabel>Limits</SectionLabel>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          The three test examples were written for this project, not taken from a user study. Atlas has not been tested with learners, so it shows a way to practise applying a rule without claiming that learning has been proven.
        </p>
        <p>
          The 33 examples contain written arguments and product references. A separate citation audit records what still needs checking, so these examples should not be treated as universal design rules.
        </p>
      </div>

      <SectionLabel>Authorship and AI use</SectionLabel>
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
