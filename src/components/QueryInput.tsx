import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { ExampleLink } from './ExampleLink'

type QueryInputProps = {
  onAsk: (query: string, entry: Entry) => void
  onShowIndex: () => void
  onShowFigure: () => void
}

// A deliberately curated, fixed-size set, not the first N — chosen to
// show the range of what Atlas does (a branch, a misconception, a
// multi-variable), not just the order entries happen to be authored in.
const featuredQueries = [
  'Should I confirm before deleting a file?',
  'Is dark mode more accessible?',
  'Should the interface adapt to usage, or stay the same for everyone every time?',
]

// Real corpus questions, cycled through the empty field as living examples of
// what Atlas can actually answer. Kept to the shorter ones so none has to wrap.
const rotatingPrompts = [
  'Should I confirm before deleting a file?',
  'Is dark mode more accessible?',
  'Should I use a modal here?',
  'When should I ask for notification permission?',
  'Should I use infinite scrolling for this list?',
  'Is marking an error field in red enough?',
  'Should I use pull-to-refresh, or a visible refresh button?',
]

export function QueryInput({ onAsk, onShowIndex, onShowFigure }: QueryInputProps) {
  const [value, setValue] = useState('')
  const [miss, setMiss] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const reduceMotion = useReducedMotion() ?? false

  // Cycle suggestions the whole time the field is empty — it stops the moment
  // someone actually types (value !== '') and resumes if they clear it again.
  const rotating = !reduceMotion && value === ''
  useEffect(() => {
    if (!rotating) return
    const id = window.setInterval(() => {
      setPromptIndex((i) => (i + 1) % rotatingPrompts.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [rotating])

  function findMatch(text: string): Entry | null {
    const lower = text.toLowerCase()
    return (
      allEntries.find((entry) =>
        entry.keywords.some((k) => lower.includes(k)),
      ) ?? null
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return

    const match = findMatch(trimmed)
    if (match) {
      setMiss(false)
      onAsk(trimmed, match)
    } else {
      setMiss(true)
    }
  }

  function askSuggested(entry: Entry) {
    setValue(entry.query)
    setMiss(false)
    onAsk(entry.query, entry)
  }

  function renderExample(entry: Entry) {
    return (
      <li key={entry.query}>
        <ExampleLink entry={entry} onSelect={askSuggested} affordance />
      </li>
    )
  }

  const featured = allEntries.filter((entry) => featuredQueries.includes(entry.query))
  const hasValue = value.trim().length > 0

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="group relative flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (miss) setMiss(false)
              }}
              placeholder={reduceMotion ? 'Ask an interaction design question…' : ''}
              aria-label="Ask an interaction design question"
              className="peer w-full bg-transparent py-4 text-xl text-ink caret-accent placeholder:text-ink-faint outline-none font-sans"
              autoFocus
            />

            {/* Rotating suggestions, shown only while the field is empty. */}
            {!reduceMotion && value === '' && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center overflow-hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={promptIndex}
                    initial={{ y: '0.55em', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-0.55em', opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="block truncate font-sans text-xl text-ink-faint"
                  >
                    {rotatingPrompts[promptIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`group/btn inline-flex shrink-0 items-center gap-1.5 rounded-sm px-5 py-2.5 text-sm font-medium text-paper transition-[transform,background-color,box-shadow] duration-150 hover:scale-[1.02] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
              hasValue ? 'bg-ink shadow-sm shadow-ink/15' : 'bg-ink/90 hover:bg-ink'
            }`}
          >
            Ask
            <ArrowRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 ease-out group-hover/btn:translate-x-1"
            />
          </button>

          {/* Base rule, plus an accent line that draws in from the left on focus
             (or holds, tinted, on a miss). */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink/15" />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent transition-transform duration-300 ease-out group-focus-within:scale-x-100 ${
              miss ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>
      </form>

      <div className="mt-12 w-full">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Examples
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">{featured.map(renderExample)}</ul>

        <p className="mt-4 text-xs text-ink-faint">
          Atlas covers {allEntries.length} questions like these.{' '}
          <button
            type="button"
            onClick={onShowIndex}
            className="rounded-sm underline decoration-line underline-offset-2 transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            See them all
          </button>
          , or{' '}
          <button
            type="button"
            onClick={onShowFigure}
            className="rounded-sm underline decoration-line underline-offset-2 transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            see the shape behind all of them
          </button>
          .
        </p>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: miss ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p
            className={`mt-3 text-sm text-ink-soft transition-all duration-300 ease-out ${
              miss ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
            }`}
          >
            Atlas answers a curated set of questions right now — try one of the
            examples above, or browse the full{' '}
            <button
              type="button"
              onClick={onShowIndex}
              className="rounded-sm text-accent underline decoration-accent/30 underline-offset-2 transition-colors duration-150 hover:decoration-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              index
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
