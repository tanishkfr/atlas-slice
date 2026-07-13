import { useEffect, useState } from 'react'
import { Check, Copy, WarningCircle } from '@phosphor-icons/react'

type PrincipleCardProps = {
  principle: string
  bridge?: string
}

export function PrincipleCard({ principle, bridge }: PrincipleCardProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (status !== 'copied') return
    const id = window.setTimeout(() => setStatus('idle'), 1800)
    return () => window.clearTimeout(id)
  }, [status])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(principle)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative border-l-2 border-accent py-6 pl-6 pr-4 sm:pl-8 sm:pr-6">
      {bridge && <p className="mb-2 text-[15px] text-ink-soft">{bridge}</p>}
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent">The principle</p>
      <p className="mt-3 font-serif text-2xl leading-snug text-ink sm:text-3xl">
        <span className="bg-accent-soft px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
          {principle}
        </span>
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-control bg-paper/50 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        {status === 'copied' ? <Check size={14} weight="bold" /> : status === 'error' ? <WarningCircle size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
        {status === 'copied' ? 'Copied' : status === 'error' ? 'Copy blocked' : 'Copy principle'}
      </button>
      <p className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Principle copied to the clipboard.' : status === 'error' ? 'Clipboard access was blocked. Select the principle text to copy it.' : ''}
      </p>
    </div>
  )
}
