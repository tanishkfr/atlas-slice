import { useState } from 'react'
import type { MultiVariableEntry } from '../content/entry'
import { RevealSection } from './RevealSection'

type TransferExerciseProps = {
  entry: MultiVariableEntry
}

type Side = 'left' | 'right'

/**
 * The reader's turn — the one place Atlas stops doing the reasoning for them.
 *
 * A multi-variable question never resolves to a single answer, so this never
 * grades. The reader places each variable for a case Atlas never wrote about,
 * and their own placements are read back as a held set: the same open,
 * unresolved shape the multi-variable trace draws, never merged to a point.
 * The payoff isn't a right answer — it's watching the same three variables
 * carry to a case the corpus never reached, and doing the carrying yourself.
 */
export function TransferExercise({ entry }: TransferExerciseProps) {
  const [placements, setPlacements] = useState<(Side | null)[]>(() =>
    entry.variables.map(() => null),
  )

  const allPlaced = placements.every((p) => p !== null)

  function place(i: number, side: Side) {
    setPlacements((prev) => {
      const next = [...prev]
      next[i] = side
      return next
    })
  }

  function chosenText(i: number): string {
    const side = placements[i]
    if (!side) return ''
    return entry.transfer.poles[i][side]
  }

  return (
    <div className="border-t border-line pt-10">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Now you
      </p>
      <p className="mt-3 text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        Here's a case Atlas has never answered. Read it, then answer the same
        three questions for it — your own call, not the one above.
      </p>

      {/* The case, held apart as its own quiet object. */}
      <p className="mt-6 border-l-2 border-ink/15 pl-5 text-[15px] leading-relaxed text-ink-soft sm:pl-6">
        {entry.transfer.casePrompt}
      </p>

      {/* One two-pole placement per variable. Each heading is a concrete,
          plain question about *this* case — not the abstract variable
          label used above, which names the idea but doesn't tell someone
          what they're actually deciding here. Both poles stay live after a
          choice — this is a reading you can revise, not a gate you pass. */}
      <div className="mt-8 flex flex-col gap-6">
        {entry.variables.map((variable, i) => {
          const chosen = placements[i]
          const pole = entry.transfer.poles[i]
          return (
            <div key={variable.label}>
              <p className="text-[15px] font-medium leading-snug text-ink-soft">
                {pole.question}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {(['left', 'right'] as const).map((side) => {
                  const isChosen = chosen === side
                  return (
                    <button
                      key={side}
                      type="button"
                      aria-pressed={isChosen}
                      onClick={() => place(i, side)}
                      className={[
                        'flex-1 rounded-sm border px-4 py-2.5 text-left text-sm leading-snug transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                        isChosen
                          ? 'border-accent bg-accent-soft/70 text-ink'
                          : 'border-line text-ink-soft hover:border-ink/30',
                      ].join(' ')}
                    >
                      {pole[side]}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* The reader's placements, read back as a held set — never merged into a
          verdict. Only appears once all three are placed. */}
      {allPlaced && (
        <div className="mt-10">
          <RevealSection weight="principle">
            <div className="border-l-2 border-accent py-5 pl-6 pr-4 sm:pl-8 sm:pr-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                How you read it
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {entry.variables.map((variable, i) => (
                  <li key={variable.label} className="text-[15px] leading-snug text-ink">
                    <span className="text-ink-faint">{variable.label}:</span>{' '}
                    <span className="font-medium">{chosenText(i)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                Nobody at Atlas answered this one for you. You worked it out with
                the same three questions from the case above, just aimed at a new
                situation — which is the actual point of a map like this one: it
                travels to cases the corpus never covers.
              </p>
            </div>
          </RevealSection>
        </div>
      )}
    </div>
  )
}
