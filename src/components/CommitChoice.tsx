import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

type CommitChoiceProps = {
  claim: string
  onCommit: () => void
}

/**
 * Not BranchChoice. Both options lead to the exact same next beat — the
 * point isn't which one gets picked, it's that the reader commits to a
 * guess before finding out. Once clicked, both options recede together
 * (never one highlighted, one dimmed) because neither answer stays live;
 * the prediction was the interaction, not the content.
 */
export function CommitChoice({ claim, onCommit }: CommitChoiceProps) {
  const [picked, setPicked] = useState<'true' | 'false' | null>(null)
  const reduceMotion = useReducedMotion()

  function handlePick(value: 'true' | 'false') {
    if (picked) return
    setPicked(value)
    window.setTimeout(onCommit, reduceMotion ? 0 : 450)
  }

  return (
    <div>
      <p className="text-[15px] font-medium text-ink-soft">True or false —</p>
      <p className="mt-2 font-serif text-xl text-ink sm:text-2xl">"{claim}"</p>

      <AnimatePresence>
        {!picked && (
          <motion.div
            key="choices"
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="mt-4 flex gap-2"
          >
            <button
              type="button"
              onClick={() => handlePick('true')}
              className="flex-1 rounded-sm border border-line px-4 py-3 text-[15px] text-ink-soft transition-all duration-150 hover:border-accent hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Seems true to me
            </button>
            <button
              type="button"
              onClick={() => handlePick('false')}
              className="flex-1 rounded-sm border border-line px-4 py-3 text-[15px] text-ink-soft transition-all duration-150 hover:border-accent hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Seems off to me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
