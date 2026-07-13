import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { MisconceptionEntry } from '../content/entry'
import { RevealSection } from './RevealSection'
import { CommitChoice } from './CommitChoice'
import { PrincipleCard } from './PrincipleCard'
import { AnswerLayout } from './AnswerLayout'
import { TrackedBeat } from './TrackedBeat'
import { SettleBeat } from './SettleBeat'

type MisconceptionAnswerProps = {
  entry: MisconceptionEntry
  askedQuery: string
}

/**
 * Settle -> Pause(brief) -> Reveal(mirror) -> Commit -> Pause(held) ->
 * Reveal(contradiction, sharp) + Recede(the corrected claim, immediately
 * beneath it) -> Reveal(explanation, slows down) -> Evidence ->
 * Weight(principle).
 *
 * Recede sits right after the contradiction, not right before the
 * principle. Looking back at what got overturned belongs next to the
 * moment of surprise, where it confirms what just landed — placed next
 * to the resolution instead, it reads as a backward glance competing
 * with the payoff. The sharp reveal itself is tuned for less travel, not
 * more — a shorter, smaller-amplitude arrival is what actually reads as
 * invisible-but-different, since more displacement is more to notice,
 * not less.
 *
 * The commit->contradiction sequence is state-driven, not scroll-triggered —
 * it's a direct, immediate response to the reader's own click, which is why
 * a short delay there doesn't violate reader-paced scrolling. Everything
 * after it reverts to the normal scroll-triggered rhythm.
 */
export function MisconceptionAnswer({ entry, askedQuery }: MisconceptionAnswerProps) {
  const [guess, setGuess] = useState<'true' | 'false' | null>(null)
  const reduceMotion = useReducedMotion()

  // Every mirrorClaim in the corpus is the false belief being corrected, so
  // guessing "false" is the correct instinct. The reveal that follows was
  // identical either way until this existed — a correct guess deserves to
  // be told it landed, not steamrolled by the same "you were wrong" beat a
  // wrong guess gets.
  const guessedCorrectly = guess === 'false'

  return (
    <AnswerLayout>
      {/* Settle */}
      <SettleBeat askedQuery={askedQuery} matchedQuery={entry.query} />

      {/* Pause(brief) — same held whitespace as every other entry's opening beat */}
      <div className="h-10 sm:h-14" />

      {/* Reveal(mirror) + Commit, as one unit — the claim and the prediction belong together */}
      <TrackedBeat>
        <RevealSection>
          <CommitChoice claim={entry.mirrorClaim} onCommit={setGuess} />
        </RevealSection>
      </TrackedBeat>

      {guess && (
        <div className="mt-8">
          <TrackedBeat>
            {/* Acknowledge the actual guess before the shared correction — the
                one thing missing before: nothing distinguished a correct
                "false" guess from an incorrect "true" one. Same quiet weight
                as the Recede line below, not competing with the contradiction. */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-ink-faint"
            >
              {guessedCorrectly
                ? "You called it. Here's exactly why:"
                : "A common first guess — here's why it doesn't hold up:"}
            </motion.p>

            {/* Reveal(contradiction) — sharp: short duration, minimal travel, barely any blur.
                Less displacement than the default reveal, not more — a smaller, quicker
                arrival reads as sudden without reading as "an animation happened." */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.22, bounce: 0, delay: 0.1 }}
              className="mt-2 text-pretty font-serif text-2xl text-ink sm:text-3xl"
            >
              {entry.contradiction}
            </motion.p>

            {/* Recede — tightly coupled to the contradiction above it, not a separate beat.
                Confirms what just got overturned while the surprise is still live. */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-2 text-sm text-ink-faint line-through decoration-ink-faint/60"
            >
              “{entry.mirrorClaim}”
            </motion.p>
          </TrackedBeat>

          {/* Reveal(explanation) — slows back down to the normal recipe */}
          <div className="mt-8">
            <TrackedBeat>
              <RevealSection>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {entry.explanation}
                </p>
              </RevealSection>
            </TrackedBeat>
          </div>

          {/* Evidence */}
          <div className="mt-8">
            <RevealSection>
              <p className="text-[15px] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-accent">
                  {entry.evidence.product}
                </strong>{' '}
                {entry.evidence.text}
              </p>
            </RevealSection>
          </div>

          {/* Weight(principle) — unchanged from every other shape */}
          <div className="mt-8">
            <RevealSection weight="principle">
              <PrincipleCard principle={entry.principle} />
            </RevealSection>
          </div>
        </div>
      )}
    </AnswerLayout>
  )
}
