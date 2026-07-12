import { allEntries, type Entry } from '../content/entry'
import { ReasoningTrace } from './ReasoningTrace'

type FigureProps = {
  onAsk: (query: string, entry: Entry) => void
}

// The whole corpus on one sheet. Grouped by the shape each entry's reasoning
// actually takes — but only *arranged*, never named: the groupings are just
// what the traces fall into on their own. Convergent shapes first, the one
// that never resolves last, so the closing note has something to point at.
const order: Entry['kind'][] = ['branch', 'misconception', 'rule-inversion', 'multi-variable']

/**
 * Atlas's Figure 1 — the map itself.
 *
 * Not documentation of the four shapes and not a diagram of the framework — a
 * survey. Every one of the questions is drawn as the path its reasoning takes,
 * on the one axis they all share, with a mark wherever it rests on a real
 * source. Wildly different questions that reason the same way draw the same
 * line; that recurrence is the contribution, so it's left for the eye to find
 * rather than asserted in a legend. Each row is live: it opens the full
 * reasoning it was traced from.
 *
 * Embedded directly on the homepage, not behind a nav click — the map is the
 * front door, not a reward for exploring. The surrounding thesis statement
 * and framing copy live in App.tsx; this component is just the plate itself.
 */
export function Figure({ onAsk }: FigureProps) {
  const groups = order.map((kind) => allEntries.filter((e) => e.kind === kind))
  let row = 0

  return (
    <div className="w-full max-w-3xl">
      {/* Axis annotation, once — like the head of a real plate. */}
      <div className="hidden items-center gap-3 border-b border-line pb-2 sm:flex">
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
