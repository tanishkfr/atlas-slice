import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Copy, Check } from '@phosphor-icons/react'

type PrincipleCardProps = {
  principle: string
  bridge?: string
}

export function PrincipleCard({ principle, bridge }: PrincipleCardProps) {
  const [copied, setCopied] = useState(false)
  const reduceMotion = useReducedMotion()

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(principle)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard access denied, fail silently, the text is still selectable
    }
  }

  return (
    <div className="relative overflow-hidden rounded-r-sm border-l-2 border-accent bg-gradient-to-r from-accent-soft/60 via-accent-soft/20 to-transparent py-6 pl-6 pr-4 sm:pl-8 sm:pr-6">
      {bridge && (
        <p className="mb-2 text-[15px] text-ink-soft">{bridge}</p>
      )}
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
        The principle
      </p>
      <p className="mt-2 font-serif text-2xl leading-snug text-ink sm:text-3xl">
        {principle}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex items-center gap-1.5 rounded-sm border border-accent/30 bg-paper/40 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-150 hover:border-accent hover:bg-accent-soft/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5"
            >
              <Check size={14} weight="bold" />
              Copied
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5"
            >
              <Copy size={14} weight="bold" />
              Copy principle
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
