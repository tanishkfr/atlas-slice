import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { ExampleLink } from './ExampleLink'

type QueryInputProps = {
  onAsk: (query: string, entry: Entry) => void
  onShowIndex: () => void
}

// Two short, deliberately different-shaped examples — enough to gesture at
// the range without needing a list and its own heading.
const featuredQueries = ['Should I confirm before deleting a file?', 'Is dark mode more accessible?']

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

// Words too common to signal what a question is actually about — matching on
// them would rank every entry equally, which is no ranking at all.
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'to', 'is', 'it', 'i', 'should', 'of', 'for', 'on', 'in',
  'or', 'and', 'my', 'this', 'that', 'with', 'do', 'does', 'be', 'are', 'use',
  'using', 'when', 'how', 'if', 'me', 'my', 'we', 'can', 'need',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

// When nothing matches outright, a miss shouldn't be a dead end. Rank the
// corpus by how many meaningful words a query shares with each entry's own
// question and keywords, and surface the nearest few — an honest "not this
// exactly, but here's the closest thing Atlas does cover."
function rankClosest(text: string): Entry[] {
  const tokens = tokenize(text)
  if (tokens.length === 0) return []
  return allEntries
    .map((entry) => {
      const haystack = new Set([
        ...tokenize(entry.query),
        ...entry.keywords.flatMap(tokenize),
      ])
      const score = tokens.reduce((sum, t) => sum + (haystack.has(t) ? 1 : 0), 0)
      return { entry, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.entry)
}

export function QueryInput({ onAsk, onShowIndex }: QueryInputProps) {
  const [value, setValue] = useState('')
  const [miss, setMiss] = useState(false)
  const [closest, setClosest] = useState<Entry[]>([])
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
      setClosest(rankClosest(trimmed))
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

  const featured = featuredQueries
    .map((q) => allEntries.find((entry) => entry.query === q))
    .filter((e): e is Entry => e !== undefined)
  const hasValue = value.trim().length > 0

  return (
    <div className="w-full max-w-md">
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
              placeholder={reduceMotion ? 'Ask a question…' : ''}
              aria-label="Ask an interaction design question"
              className="peer w-full min-w-0 bg-transparent py-3.5 text-lg text-ink caret-accent placeholder:text-ink-faint outline-none font-sans"
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
                    className="block truncate font-sans text-lg text-ink-faint"
                  >
                    {rotatingPrompts[promptIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`group/btn inline-flex shrink-0 items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-medium text-paper transition-[transform,background-color,box-shadow] duration-150 hover:scale-[1.02] active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
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

      {/* One quiet line instead of a headed list — enough to ground the input
          without building a second competing block of content underneath it. */}
      <p className="mt-4 max-w-sm text-center text-xs leading-relaxed text-ink-faint">
        Try{' '}
        {featured.map((entry, i) => (
          <span key={entry.query}>
            <button
              type="button"
              onClick={() => askSuggested(entry)}
              className="rounded-sm underline decoration-line underline-offset-2 transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              “{entry.query}”
            </button>
            {i < featured.length - 1 ? ' or ' : ''}
          </span>
        ))}
        , or{' '}
        <button
          type="button"
          onClick={onShowIndex}
          className="rounded-sm underline decoration-line underline-offset-2 transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          browse all {allEntries.length}
        </button>
        .
      </p>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: miss ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className={`mt-3 transition-all duration-300 ease-out ${
              miss ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
            }`}
          >
            {closest.length > 0 ? (
              <>
                <p className="text-sm text-ink-soft">
                  Atlas doesn't have that exact question yet. The closest cases it
                  does cover:
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {closest.map(renderExample)}
                </ul>
                <p className="mt-4 text-xs text-ink-faint">
                  Or browse the full{' '}
                  <button
                    type="button"
                    onClick={onShowIndex}
                    className="rounded-sm underline decoration-line underline-offset-2 transition-colors duration-150 hover:text-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    index
                  </button>
                  .
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
