import type { BranchContent } from '../content/entry'

type BranchChoiceProps = {
  prompt: string
  branches: [BranchContent, BranchContent]
  selected: string | null
  onSelect: (value: string) => void
}

/**
 * Not a quiz gate — a real fork. Both options stay visible and clickable
 * after a choice is made, so the reader can flip back and watch the
 * reasoning re-flow rather than just re-reveal. The unselected option
 * recedes (opacity/scale) instead of disappearing — the alternative was
 * considered, not deleted.
 */
export function BranchChoice({
  prompt,
  branches,
  selected,
  onSelect,
}: BranchChoiceProps) {
  return (
    <div>
      <p className="text-[15px] font-medium text-ink-soft">{prompt}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {branches.map((branch) => {
          const isSelected = selected === branch.value
          const isDimmed = selected !== null && !isSelected
          return (
            <button
              key={branch.value}
              type="button"
              onClick={() => onSelect(branch.value)}
              className={[
                'min-h-12 flex-1 rounded-sm border px-4 py-3 text-left text-[15px] leading-snug transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                isSelected
                  ? 'border-accent bg-accent-soft/70 text-ink'
                  : 'border-control text-ink-soft hover:border-accent',
                isDimmed ? 'opacity-60' : 'opacity-100',
              ].join(' ')}
            >
              {branch.choiceLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
