import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealSectionProps = {
  children: ReactNode
  delay?: number
  className?: string
  weight?: 'default' | 'principle' | 'sharp'
}

/**
 * Scroll-triggered reveal, once, per Jakub's enter recipe (opacity + rise + blur).
 * `weight="principle"` gets a fractionally longer, more settled entrance —
 * the one place motion is allowed to be noticed rather than merely felt.
 * `weight="sharp"` is the opposite move: shorter, less travel, almost no
 * blur — for a contradiction landing, not a conclusion settling. Less
 * displacement than default, not more: a smaller, quicker arrival reads
 * as sudden without reading as a noticeable animation.
 */
export function RevealSection({
  children,
  delay = 0,
  className,
  weight = 'default',
}: RevealSectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const duration = weight === 'principle' ? 0.65 : weight === 'sharp' ? 0.22 : 0.5
  const initialY = weight === 'sharp' ? 6 : 10
  const initialBlur = weight === 'sharp' ? 1 : 4

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: initialY, filter: `blur(${initialBlur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ type: 'spring', duration, bounce: 0, delay }}
    >
      {children}
    </motion.div>
  )
}
