import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealSectionProps = {
  children: ReactNode
  delay?: number
  className?: string
  weight?: 'default' | 'principle' | 'sharp'
}

export function RevealSection({
  children,
  delay = 0,
  className,
  weight = 'default',
}: RevealSectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  const duration = weight === 'principle' ? 0.38 : weight === 'sharp' ? 0.16 : 0.24
  const initialY = weight === 'principle' ? 6 : weight === 'sharp' ? 2 : 4

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
