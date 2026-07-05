import { ArrowRight } from '@phosphor-icons/react'
import type { Entry } from '../content/entry'

type ExampleLinkProps = {
  entry: Entry
  onSelect: (entry: Entry) => void
  /**
   * Show a hover affordance (a trailing arrow). Only for the homescreen's short
   * example list — at index density, a motion cue on every one of dozens of
   * rows competes with scanning instead of aiding it, so it stays off there.
   */
  affordance?: boolean
}

/**
 * One clickable question, used both in the homescreen's short example list and
 * the full index — kept as one component so the two never visually drift apart.
 */
export function ExampleLink({ entry, onSelect, affordance = false }: ExampleLinkProps) {
  if (!affordance) {
    return (
      <button
        type="button"
        onClick={() => onSelect(entry)}
        className="rounded-sm text-left text-[15px] leading-snug text-ink-soft transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        {entry.query}
      </button>
    )
  }

  // The arrow is an inline element right after the text, so it trails the final
  // word even when the question wraps — never floating at the block's centre.
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="group rounded-sm text-left text-[15px] leading-snug text-ink-soft transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      {entry.query}
      <ArrowRight
        size={13}
        weight="bold"
        aria-hidden
        className="ml-1 inline -translate-x-1 align-[-0.05em] opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100"
      />
    </button>
  )
}
