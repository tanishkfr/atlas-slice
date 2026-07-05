import { motion, useReducedMotion } from 'framer-motion'

type SettleBeatProps = {
  askedQuery: string
  matchedQuery: string
}

/**
 * Settle — the query settling into place. Was six independent, unguarded
 * copies (one per shape plus App.tsx's own attempt) that had drifted from
 * a single source. One component, one useReducedMotion() check, done once.
 *
 * `matchedQuery` is entry.query — the exact phrasing the reasoning below
 * was actually written for. Keyword matching means what someone typed and
 * what Atlas answers are often close but not identical; when they differ,
 * that gap gets named instead of quietly papered over.
 */
export function SettleBeat({ askedQuery, matchedQuery }: SettleBeatProps) {
  const reduceMotion = useReducedMotion()
  const isExactMatch = askedQuery.trim().toLowerCase() === matchedQuery.toLowerCase()

  return (
    <>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint"
      >
        You asked
      </motion.p>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="mt-2 font-serif text-2xl leading-snug tracking-tight text-ink sm:text-3xl"
      >
        {askedQuery}
      </motion.p>

      {!isExactMatch && (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="mt-3 text-sm text-ink-faint"
        >
          Answered as: <span className="text-ink-soft">{matchedQuery}</span>.
          Atlas's closest documented case for that question.
        </motion.p>
      )}
    </>
  )
}
