import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { BranchContent } from '../content/entry'

type BranchedReasoningProps = {
  branch: BranchContent
  isFirstReveal: boolean
}

/**
 * The first time a branch appears, it gets the full considered entrance —
 * this is the reader's first look at where the reasoning landed. Toggling
 * between branches afterward is fast and direct (Emil's frequency rule):
 * once the reader is comparing, the interaction is repeatable, and a slow
 * re-reveal every time would read as performance, not responsiveness.
 */
export function BranchedReasoning({ branch, isFirstReveal }: BranchedReasoningProps) {
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0 : isFirstReveal ? 0.5 : 0.22

  return (
    <div className="mt-6 min-h-[1px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={branch.value}
          initial={reduceMotion ? false : { opacity: 0, y: isFirstReveal ? 10 : 4, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
          transition={{ type: 'spring', duration, bounce: 0 }}
        >
          <p className="font-serif text-xl leading-snug text-ink sm:text-2xl">
            {branch.leadIn}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {branch.reasoning}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-accent">
              {branch.evidence.product}
            </strong>{' '}
            {branch.evidence.text}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            {branch.counterNote}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
