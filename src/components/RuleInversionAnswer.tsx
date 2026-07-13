import type { RuleInversionEntry } from '../content/entry'
import { RevealSection } from './RevealSection'
import { PrincipleCard } from './PrincipleCard'
import { AnswerLayout } from './AnswerLayout'
import { TrackedBeat } from './TrackedBeat'
import { SettleBeat } from './SettleBeat'

type RuleInversionAnswerProps = {
  entry: RuleInversionEntry
  askedQuery: string
}

/**
 * Settle -> Pause(brief) -> Reveal(validation) -> Reveal(case 1, confirms) ->
 * Pause(held) -> Juxtaposition(case 2, opposes) -> Reveal(sharper question +
 * explanation, together) -> Weight(principle).
 *
 * Deliberately no Commit and no Choice: Choice belongs to branching, while
 * Commit belongs to misconception. Neither supports this pattern's tension. The active ingredient is cognitive: feeling the tension between two
 * cases that are both true. Case 1 and case 2 use the identical default
 * reveal recipe, not the sharp one — they're peers, not a twist, and giving
 * case 2 a jolt would borrow Misconception's surprise instead of earning
 * refinement. The held pause is a larger scroll-through gap, not a timer —
 * there's no click here to justify a state-driven delay the way there was
 * in Misconception.
 */
export function RuleInversionAnswer({ entry, askedQuery }: RuleInversionAnswerProps) {
  return (
    <AnswerLayout>
      {/* Settle */}
      <SettleBeat askedQuery={askedQuery} matchedQuery={entry.query} />

      {/* Pause(brief) — identical to every other shape's opening beat */}
      <div className="h-10 sm:h-14" />

      {/* Reveal(validation) — agrees first, corrects nothing yet */}
      <TrackedBeat>
        <RevealSection>
          <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            {entry.validation}
          </p>
        </RevealSection>
      </TrackedBeat>

      {/* Reveal(case 1 — confirms the rule) */}
      <div className="mt-8">
        <TrackedBeat>
          <RevealSection>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-accent">
                {entry.confirmingCase.product}
              </strong>{' '}
              {entry.confirmingCase.text}
            </p>
          </RevealSection>
        </TrackedBeat>
      </div>

      {/* Pause(held) — a real gap the reader scrolls through, not a timer.
          Shorter than the first version: the two-step reveal that follows
          (bridge, then case) now shares the work of holding the tension,
          so the gap doesn't have to carry all of it alone. */}
      <div className="h-14 sm:h-20" />

      <TrackedBeat>
        {/* The bridge gets its own beat, alone, right as the pause resolves —
            isolation is what makes it register, not motion. Same default
            recipe as everything else; nothing here is faster or sharper. */}
        <RevealSection>
          <p className="font-serif text-lg text-ink sm:text-xl">And yet —</p>
        </RevealSection>

        {/* Juxtaposition(case 2 — same rule, opposite verdict), tightly
            coupled to the bridge above it. */}
        <div className="mt-2">
          <RevealSection>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-accent">
                {entry.contradictingCase.product}
              </strong>{' '}
              {entry.contradictingCase.text}
            </p>
          </RevealSection>
        </div>
      </TrackedBeat>

      {/* Reveal(the sharper question) — question and explanation arrive as
          one continuous thought, evenly paced. No jolt; this is where the
          two cases resolve into refinement, not a twist. */}
      <div className="mt-8">
        <RevealSection>
          <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            {entry.sharperQuestion}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {entry.explanation}
          </p>
        </RevealSection>
      </div>

      {/* Weight(principle) — unchanged from every other shape */}
      <div className="mt-8">
        <RevealSection weight="principle">
          <PrincipleCard principle={entry.principle} />
        </RevealSection>
      </div>
    </AnswerLayout>
  )
}
