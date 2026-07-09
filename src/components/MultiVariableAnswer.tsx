import type { MultiVariableEntry } from '../content/entry'
import { RevealSection } from './RevealSection'
import { PrincipleCard } from './PrincipleCard'
import { AnswerLayout } from './AnswerLayout'
import { TrackedBeat } from './TrackedBeat'
import { SettleBeat } from './SettleBeat'
import { TransferExercise } from './TransferExercise'

type MultiVariableAnswerProps = {
  entry: MultiVariableEntry
  askedQuery: string
}

/**
 * Settle -> Pause(brief) -> Reveal(reframe, sets "no single answer"
 * immediately) -> Accumulation(variable 1) -> Accumulation(variable 2) ->
 * Accumulation(variable 3) -> Weight(principle-as-map).
 *
 * No Commit, no Choice, no Juxtaposition, no held pause, no sharp reveal —
 * none of the other three shapes' signature moves belong here. Every
 * variable uses the identical default reveal recipe and identical spacing:
 * uniform, steady rhythm is the point, not a dramatic beat. Nothing recedes
 * and nothing replaces anything else — that's what makes this Accumulation
 * rather than a longer version of a Reveal sequence every other shape
 * already has. The label + number on each variable exists so the set is
 * visibly countable as it grows, reusing the same small-caps treatment
 * already used for section headers elsewhere in the app — no new type
 * scale, no new component.
 */
export function MultiVariableAnswer({ entry, askedQuery }: MultiVariableAnswerProps) {
  return (
    <AnswerLayout>
      {/* Settle */}
      <SettleBeat askedQuery={askedQuery} matchedQuery={entry.query} />

      {/* Pause(brief) — identical to every other shape's opening beat */}
      <div className="h-10 sm:h-14" />

      {/* Reveal(reframe) — sets the "no single answer" expectation immediately,
          not as a late admission after building up to a verdict that never comes */}
      <TrackedBeat>
        <RevealSection>
          <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            {entry.reframe}
          </p>
        </RevealSection>
      </TrackedBeat>

      {/* Accumulation — every variable stays fully visible, none recede,
          none replace each other. Uniform spacing throughout: steady
          rhythm, not a dramatic beat. Wrapped in one shared, quiet border
          (reusing the existing divider convention, not a new visual
          device) so the set reads as one structure from the moment it
          starts appearing, not three blocks that happen to share a
          numbering scheme. */}
      <div className="mt-10 border-l-2 border-line pl-5 sm:pl-6">
        <div className="flex flex-col gap-8">
          {entry.variables.map((variable, i) => (
            <TrackedBeat key={variable.label}>
              <RevealSection>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                    {i + 1} · {variable.label}
                  </p>
                  {i === 1 && (
                    <p className="mt-1 text-sm text-ink-faint">A second thing decides it, too.</p>
                  )}
                  {i === 2 && (
                    <p className="mt-1 text-sm text-ink-faint">And a third.</p>
                  )}
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {variable.text}
                  </p>
                </div>
              </RevealSection>
            </TrackedBeat>
          ))}
        </div>
      </div>

      {/* Weight(principle-as-map) — same component, same weight as every
          other shape's principle. Its content is a held set, not a verdict,
          but the presence it gets is identical. */}
      <div className="mt-10">
        <RevealSection weight="principle">
          <PrincipleCard principle={entry.principle} bridge={entry.mapIntro} />
        </RevealSection>
      </div>

      {/* The reader's turn — the map's actual claim is that these variables
          travel, so here they carry it to a case Atlas never covered. Placed
          after the principle: read the map first, then use it. */}
      <div className="mt-16">
        <TransferExercise entry={entry} />
      </div>
    </AnswerLayout>
  )
}
