import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CaretRight } from '@phosphor-icons/react'

type MechanicsDisclosureProps = {
  mechanics: string
}

/**
 * The expand/collapse no longer animates `height` (a layout-triggering
 * property). It uses the CSS grid-template-rows 0fr/1fr technique instead,
 * driven by a plain CSS transition rather than Framer Motion, since
 * fr-unit interpolation isn't a motion value Framer handles natively.
 * The global prefers-reduced-motion rule in index.css already collapses
 * this transition to near-zero, so no separate JS check is needed here.
 */
export function MechanicsDisclosure({ mechanics }: MechanicsDisclosureProps) {
  const [open, setOpen] = useState(false)
  const contentId = useId()
  const reduceMotion = useReducedMotion()

  return (
    <div className="border-t border-line pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="inline-flex text-ink-faint"
        >
          <CaretRight size={14} weight="bold" />
        </motion.span>
        {open ? 'Hide explanation' : 'Show explanation'}
      </button>

      <div
        id={contentId}
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {mechanics}
          </p>
        </div>
      </div>
    </div>
  )
}
