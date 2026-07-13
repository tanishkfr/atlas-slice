import { motion, useReducedMotion } from 'framer-motion'

type SettleBeatProps = {
  askedQuery: string
  matchedQuery: string
}

export function SettleBeat({ askedQuery, matchedQuery }: SettleBeatProps) {
  const reduceMotion = useReducedMotion()
  const isExactMatch = askedQuery.trim().toLowerCase() === matchedQuery.toLowerCase()

  return (
    <>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.16 }}
        className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink-faint"
      >
        You asked
      </motion.p>
      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.03 }}
        className="mt-2 font-serif text-2xl leading-snug tracking-tight text-ink sm:text-3xl"
      >
        {askedQuery}
      </motion.h1>

      {!isExactMatch && (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-3 text-sm text-ink-faint"
        >
          Answered as: <span className="text-ink-soft">{matchedQuery}</span>. Atlas&apos;s closest documented case for that question.
        </motion.p>
      )}
    </>
  )
}
