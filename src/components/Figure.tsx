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
    title: 'Conditional branch',
    description: 'Two legitimate conditions stay live before converging on a weighted principle.',
  },
  {
    kind: 'misconception',
    title: 'Misconception reversal',
    description: 'A plausible first belief crosses the axis, then settles into a correction.',
  },
  {
    kind: 'rule-inversion',
    title: 'Rule inversion',
    description: 'One rule produces opposite verdicts in two cases, forcing a sharper question.',
  },
  {
    kind: 'multi-variable',
    title: 'Variable map',
    description: 'Several variables accumulate without collapsing into a single directive.',
  },
]

export function Figure({ onBack, onAsk }: FigureProps) {
  return (
    <div className="w-full max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={14} weight="bold" />
        Back to trace
      </button>

      <p className="mt-8 font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">
        Supporting corpus · {allEntries.length} questions
      </p>
      <h1 className="mt-2 max-w-2xl text-balance font-serif text-3xl leading-snug text-ink sm:text-4xl">
        Four authored patterns for reading how design reasoning moves.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-soft">
        This is an editorial lens, not a validated taxonomy. Each question is assigned to one of four recurring reasoning structures. Open any row to inspect the argument behind its shape.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Corpus reasoning patterns">
        {groups.map((group) => (
          <button
            type="button"
            key={group.kind}
            onClick={() => document.getElementById(`pattern-${group.kind}`)?.scrollIntoView({ block: 'start' })}
            className="inline-flex min-h-11 items-center rounded-full border border-control px-3 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {group.title}
          </button>
        ))}
      </nav>

      <div className="mt-12 hidden items-center gap-3 border-b border-line pb-2 sm:flex" aria-hidden>
        <span className="min-w-0 flex-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">Question</span>
        <span className="flex w-[240px] items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
          <span>Asked</span>
          <span>Principle</span>
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-14">
        {groups.map((group) => {
          const entries = allEntries.filter((entry) => entry.kind === group.kind)
          return (
            <section key={group.kind} id={`pattern-${group.kind}`} className="scroll-mt-6">
              <div className="mb-3 border-b border-line pb-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-serif text-2xl text-ink">{group.title}</h2>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                    {entries.length} {entries.length === 1 ? 'question' : 'questions'}
                  </p>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-faint">{group.description}</p>
              </div>

              <ul className="flex flex-col">
                {entries.map((entry) => (
                  <li key={entry.query}>
                    <button
                      type="button"
                      onClick={() => onAsk(entry.query, entry)}
                      className="group flex min-h-14 w-full flex-col gap-2 rounded-sm py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:flex-row sm:items-center sm:gap-3"
                    >
                      <span className="min-w-0 flex-1 font-serif text-base leading-snug text-ink-soft transition-colors group-hover:text-ink">
                        {entry.query}
                        <ArrowRight
                          size={14}
                          weight="bold"
                          aria-hidden
                          className="ml-1 inline -translate-x-1 align-[-0.05em] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                      <span aria-hidden className="hidden h-0 min-w-4 flex-1 self-center border-t border-dotted border-control/50 transition-colors group-hover:border-control sm:block" />
                      <span className="w-full shrink-0 sm:w-[240px]">
                        <span className="mb-1 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint sm:hidden" aria-hidden>
                          <span>Asked</span><span>Principle</span>
                        </span>
                        <ReasoningTrace entry={entry} />
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
          The repeated silhouettes make the editorial classification visible; they do not claim that each line was measured independently or that the four patterns are exhaustive. The final group remains open because its variables do not resolve to one answer.
        </p>
      </div>
    </div>
  )
}
