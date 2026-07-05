import { useState } from 'react'
import type { AtlasEntry } from '../content/entry'
import { RevealSection } from './RevealSection'
import { BranchChoice } from './BranchChoice'
import { BranchedReasoning } from './BranchedReasoning'
import { PrincipleCard } from './PrincipleCard'
import { MechanicsDisclosure } from './MechanicsDisclosure'
import { AnswerLayout } from './AnswerLayout'
import { TrackedBeat } from './TrackedBeat'
import { SettleBeat } from './SettleBeat'

type AtlasAnswerProps = {
  entry: AtlasEntry
  askedQuery: string
}

export function AtlasAnswer({ entry, askedQuery }: AtlasAnswerProps) {
  const [branch, setBranch] = useState<string | null>(null)
  // First selection gets the full considered entrance; every toggle after
  // that is fast and direct — the interaction has become repeatable.
  const [selectionCount, setSelectionCount] = useState(0)

  function handleSelect(value: string) {
    setBranch(value)
    setSelectionCount((c) => c + 1)
  }

  const activeBranch = entry.branches.find((b) => b.value === branch) ?? null

  return (
    <AnswerLayout>
      <SettleBeat askedQuery={askedQuery} matchedQuery={entry.query} />

      {/* held beat — deliberate whitespace, not a spinner */}
      <div className="h-10 sm:h-14" />

      <TrackedBeat>
        <RevealSection>
          <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            {entry.reframe}
          </p>
        </RevealSection>
      </TrackedBeat>

      <div className="mt-10 sm:mt-12">
        <TrackedBeat>
          <RevealSection delay={0.1}>
            <BranchChoice
              prompt={entry.branchPrompt}
              branches={entry.branches}
              selected={branch}
              onSelect={handleSelect}
            />
          </RevealSection>

          {activeBranch && (
            <BranchedReasoning
              branch={activeBranch}
              isFirstReveal={selectionCount <= 1}
            />
          )}
        </TrackedBeat>
      </div>

      {activeBranch && (
        <>
          <div className="mt-12 sm:mt-16">
            <TrackedBeat>
              <RevealSection>
                <p className="text-[15px] font-medium text-ink-soft">
                  {entry.dissolvingMove.intro}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {entry.dissolvingMove.content}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  <strong className="font-semibold text-accent">
                    {entry.dissolvingMove.evidence.product}
                  </strong>{' '}
                  {entry.dissolvingMove.evidence.text}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-faint">
                  {entry.dissolvingMove.costNote}
                </p>
              </RevealSection>
            </TrackedBeat>
          </div>

          <div className="mt-12 sm:mt-16">
            <RevealSection weight="principle">
              <PrincipleCard
                principle={entry.principle}
                bridge={entry.principleBridge}
              />
            </RevealSection>
          </div>

          <div className="mt-8">
            <RevealSection>
              <MechanicsDisclosure mechanics={entry.mechanics} />
            </RevealSection>
          </div>
        </>
      )}
    </AnswerLayout>
  )
}
