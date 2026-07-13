import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

type CommitChoiceProps = {
  claim: string
  onCommit: (guess: 'true' | 'false') => void
}

export function CommitChoice({ claim, onCommit }: CommitChoiceProps) {
  const [picked, setPicked] = useState<'true' | 'false' | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!picked) return
    const id = window.setTimeout(() => onCommit(picked), reduceMotion ? 0 : 180)
    return () => window.clearTimeout(id)
  }, [onCommit, picked, reduceMotion])

  return (
    <div>
      <p className="text-[15px] font-medium text-ink-soft">True or false —</p>
      <p className="mt-2 font-serif text-xl text-ink sm:text-2xl">“{claim}”</p>

      <AnimatePresence>
        {!picked && (
          <motion.div
            key="choices"
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <ChoiceButton onClick={() => setPicked('true')}>Seems true to me</ChoiceButton>
            <ChoiceButton onClick={() => setPicked('false')}>Seems off to me</ChoiceButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 flex-1 rounded-sm border border-control px-4 py-3 text-[15px] text-ink-soft transition-colors hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      {children}
    </button>
  )
}
