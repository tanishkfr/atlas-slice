import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { BranchContent } from '../content/entry'

type BranchedReasoningProps = {
  branch: BranchContent
  isFirstReveal: boolean
}

export function BranchedReasoning({ branch, isFirstReveal }: BranchedReasoningProps) {
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0 : isFirstReveal ? 0.3 : 0.16

  return (
    <div className="mt-6 min-h-[1px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={branch.value}
          initial={reduceMotion ? false : { opacity: 0, y: isFirstReveal ? 5 : 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-xl leading-snug text-ink sm:text-2xl">{branch.leadIn}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{branch.reasoning}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-accent">{branch.evidence.product}</strong>{' '}
            {branch.evidence.text}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">{branch.counterNote}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
