import type { ReactNode } from 'react'

type AnswerLayoutProps = {
  children: ReactNode
}

/**
 * Shared root for all four reasoning shapes — the one place "single visual
 * language" actually gets enforced structurally rather than just by
 * convention.
 */
export function AnswerLayout({ children }: AnswerLayoutProps) {
  return <div className="w-full max-w-2xl">{children}</div>
}
