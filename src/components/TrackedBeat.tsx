import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type TrackedBeatProps = {
  children: ReactNode
  className?: string
}

/**
 * Wraps an already-revealed beat with the optical-depth effect: the
 * content softens very slightly (blur kept deliberately subtle) once it's
 * scrolled past, having been seen at least once. Reversible by
 * construction: scroll back up and it undoes itself, since useInView
 * toggles both ways.
 *
 * Does not touch what RevealSection does — this wraps around it, it
 * doesn't replace the one-time enter animation.
 */
export function TrackedBeat({ children, className }: TrackedBeatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (inView && !hasBeenSeen) {
      setHasBeenSeen(true)
    }
  }, [inView, hasBeenSeen])

  const passed = hasBeenSeen && !inView

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={
        reduceMotion
          ? undefined
          : {
              filter: passed ? 'blur(1px) saturate(0.9)' : 'blur(0px) saturate(1)',
              opacity: passed ? 0.72 : 1,
            }
      }
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
