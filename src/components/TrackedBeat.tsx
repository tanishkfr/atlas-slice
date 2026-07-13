import type { ReactNode } from 'react'

type TrackedBeatProps = {
  children: ReactNode
  className?: string
}

export function TrackedBeat({ children, className }: TrackedBeatProps) {
  return <div className={className}>{children}</div>
}
