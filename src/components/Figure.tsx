import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { ReasoningTrace } from './ReasoningTrace'

type FigureProps = {
  onBack: () => void
  onAsk: (query: string, entry: Entry) => void
}

const groups: {
  kind: Entry['kind']
  title: string
  description: string
}[] = [
  {
    kind: 'branch',
    title: 'Two paths',
    description: 'Two valid situations lead to different answers, then one useful rule.',
  },
  {
    kind: 'misconception',
    title: 'Common belief, corrected',
    description: 'A reasonable first guess turns out to be wrong, and the answer explains why.',
  },
  {
    kind: 'rule-inversion',
    title: 'Same rule, opposite answers',
    description: 'The same rule gives opposite answers in two examples, so the question needs to be more specific.',
  },
  {
    kind: 'multi-variable',
    title: 'Things to weigh',
    description: 'Several factors matter, so there is no useful one-line answer.',
  },
]

export function Figure({ onBack, onAsk }: FigureProps) {
  function goToGroup(kind: Entry['kind']) {
    const section = document.getElementById(`pattern-${kind}`)
    const heading = document.getElementById(`heading-${kind}`)
    section?.scrollIntoView({ block: 'start' })
    window.requestAnimationFrame(() => heading?.focus({ preventScroll: true }))
  }

  return (
    <div className="w-full max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={14} weight="bold" />
        Back to rule test
      </button>

      <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">
        All design examples · {allEntries.length} total
      </p>
      <h1 className="mt-2 max-w-2xl text-balance font-serif text-3xl leading-snug text-ink sm:text-4xl">
        Browse all {allEntries.length} design questions and answers.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-soft">
        The questions are grouped by four common ways an answer can unfold. These groups are a writing aid, not a proven system. Open any question to read the full answer.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Example groups">
        {groups.map((group) => (
          <button
            type="button"
            key={group.kind}
            onClick={() => goToGroup(group.kind)}
            className="inline-flex min-h-11 items-center rounded-full border border-control px-3 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {group.title}
          </button>
        ))}
      </nav>

      <div className="mt-12 flex flex-col gap-14">
        {groups.map((group) => {
          const entries = allEntries.filter((entry) => entry.kind === group.kind)
          return (
            <section key={group.kind} id={`pattern-${group.kind}`} className="scroll-mt-6">
              <div className="mb-3 grid gap-4 border-b border-line pb-4 sm:grid-cols-[minmax(0,1fr)_240px] sm:items-end">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 id={`heading-${group.kind}`} tabIndex={-1} className="font-serif text-2xl text-ink outline-none">{group.title}</h2>
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                      {entries.length} {entries.length === 1 ? 'example' : 'examples'}
                    </p>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-faint">{group.description}</p>
                </div>
                <ReasoningTrace ghostKind={group.kind} />
              </div>

              <ul className="flex flex-col border-t border-line">
                {entries.map((entry) => (
                  <li key={entry.query} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => onAsk(entry.query, entry)}
                      className="group flex min-h-16 w-full flex-col items-start gap-2 rounded-sm py-4 text-left transition-colors hover:bg-paper-dim/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:flex-row sm:items-center sm:gap-4 sm:px-2"
                    >
                      <span className="min-w-0 flex-1 font-serif text-base leading-snug text-ink-soft transition-colors group-hover:text-ink">
                        {entry.query}
                      </span>
                      <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                        Read answer <ArrowRight size={14} weight="bold" aria-hidden />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="mt-14 border-t border-line pt-6">
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-ink-faint">
          These four groups make the list easier to scan. They are not the only ways to answer a design question, and they have not been tested as a formal system.
        </p>
      </div>
    </div>
  )
}
