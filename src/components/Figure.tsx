import { ArrowLeft } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { ReasoningTrace } from './ReasoningTrace'

type FigureProps = {
  onBack: () => void
  onAsk: (query: string, entry: Entry) => void
}

// The whole corpus on one sheet. Grouped by the shape each entry's reasoning
// actually takes — but only *arranged*, never named: the groupings are just
// what the traces fall into on their own. Convergent shapes first, the one
// that never resolves last, so the closing note has something to point at.
const order: Entry['kind'][] = ['branch', 'misconception', 'rule-inversion', 'multi-variable']

/**
 * Atlas's Figure 1 — its own destination, reached from the nav.
 *
 * Not documentation of the four shapes and not a diagram of the framework — a
 * survey. Every one of the questions is drawn as the path its reasoning takes,
 * on the one axis they all share, with a mark wherever it rests on a real
 * source. Wildly different questions that reason the same way draw the same
 * line; that recurrence is the contribution, so it's left for the eye to find
 * rather than asserted in a legend. Each row is live: it opens the full
 * reasoning it was traced from.
 *
 * Kept off the homepage on purpose — 33 rows dumped onto the first screen
 * competed with everything else there instead of rewarding a deliberate
 * look. The map is the best thing in the project; it doesn't need to also
 * be the first five seconds of it.
 */
export function Figure({ onBack, onAsk }: FigureProps) {
  const groups = order.map((kind) => allEntries.filter((e) => e.kind === kind))
  let row = 0

  return (
    <div className="w-full max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-faint transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={13} weight="bold" />
        Back
      </button>

      <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        The survey
      </p>
      <h1 className="mt-2 max-w-xl text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
        Every answer, drawn by how its reasoning moves.
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-soft">
        Each line is one question, riding a single axis — from where it was asked,
        on the left, to the principle it lands on. A mark crosses the line wherever
        the reasoning rests on a real, checkable source. Nothing is labelled by type.
        The groupings are only what the shapes themselves fall into once every
        question is drawn the same way.
      </p>

      {/* Axis annotation, once — like the head of a real plate. */}
      <div className="mt-12 hidden items-center gap-3 border-b border-line pb-2 sm:flex">
        <span className="min-w-0 flex-1" />
        <span
          aria-hidden
          className="flex w-[240px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint"
        >
          <span>Asked</span>
          <span>Principle</span>
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-10">
        {groups.map((entries, gi) => (
          <ul key={order[gi]} className="flex flex-col">
            {entries.map((entry) => {
              const delay = Math.min(row++ * 0.04, 0.9)
              return (
                <li key={entry.query}>
                  <button
                    type="button"
                    onClick={() => onAsk(entry.query, entry)}
                    className="group flex w-full flex-col gap-2 rounded-sm py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span className="min-w-0 font-serif text-[15px] leading-snug text-ink-soft transition-colors duration-150 group-hover:text-ink">
                      {entry.query}
                    </span>
                    <span
                      aria-hidden
                      className="hidden h-0 min-w-4 flex-1 self-center border-t border-dotted border-ink-faint/30 transition-colors duration-150 group-hover:border-ink-faint/60 sm:block"
                    />
                    <span className="w-full shrink-0 opacity-95 transition-opacity duration-150 group-hover:opacity-100 sm:w-[240px]">
                      <ReasoningTrace entry={entry} delay={delay} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ))}
      </div>

      <div className="mt-12 border-t border-line pt-6">
        <p className="max-w-xl text-pretty text-sm leading-relaxed text-ink-faint">
          Four shapes, across {allEntries.length} questions — each drawn only from
          its own beats and its own sources, nothing added to make the groups look
          neater than they are. The last group never closes to a single point. That
          isn't unfinished: some questions genuinely don't collapse into one rule,
          and a survey shouldn't draw an answer where the reasoning doesn't reach one.
        </p>
      </div>
    </div>
  )
}
