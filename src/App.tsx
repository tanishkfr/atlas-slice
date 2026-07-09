import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { QueryInput } from './components/QueryInput'
import { QuestionIndex } from './components/QuestionIndex'
import { AboutAtlas } from './components/AboutAtlas'
import { Figure } from './components/Figure'
import { AtlasAnswer } from './components/AtlasAnswer'
import { MisconceptionAnswer } from './components/MisconceptionAnswer'
import { RuleInversionAnswer } from './components/RuleInversionAnswer'
import { MultiVariableAnswer } from './components/MultiVariableAnswer'
import { AtlasMark } from './components/AtlasMark'
import { ExampleLink } from './components/ExampleLink'
import {
  deleteConfirmationEntry,
  darkModeEntry,
  clickCountEntry,
  adaptiveUiEntry,
  type Entry,
} from './content/entry'

function renderAnswer(entry: Entry, askedQuery: string) {
  switch (entry.kind) {
    case 'branch':
      return <AtlasAnswer key={entry.query} entry={entry} askedQuery={askedQuery} />
    case 'misconception':
      return <MisconceptionAnswer key={entry.query} entry={entry} askedQuery={askedQuery} />
    case 'rule-inversion':
      return <RuleInversionAnswer key={entry.query} entry={entry} askedQuery={askedQuery} />
    case 'multi-variable':
      return <MultiVariableAnswer key={entry.query} entry={entry} askedQuery={askedQuery} />
  }
}

// One well-established representative per shape, fixed rather than random —
// the point is that clicking through in order eventually surfaces all four
// kinds of reasoning as a felt pattern, not that the suggestion varies.
// Never named as "shape," "branch," etc. anywhere in view — the rotation
// itself is what does the work.
const shapeOrder: Entry['kind'][] = ['branch', 'misconception', 'rule-inversion', 'multi-variable']
const flagshipByShape: Record<Entry['kind'], Entry> = {
  branch: deleteConfirmationEntry,
  misconception: darkModeEntry,
  'rule-inversion': clickCountEntry,
  'multi-variable': adaptiveUiEntry,
}

function nextShapeSuggestion(currentKind: Entry['kind']): Entry {
  const currentIndex = shapeOrder.indexOf(currentKind)
  const nextKind = shapeOrder[(currentIndex + 1) % shapeOrder.length]
  return flagshipByShape[nextKind]
}

function App() {
  const [asked, setAsked] = useState<{ query: string; entry: Entry } | null>(null)
  const [showIndex, setShowIndex] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showFigure, setShowFigure] = useState(false)
  const reduceMotion = useReducedMotion()

  function handleAsk(query: string, entry: Entry) {
    setShowIndex(false)
    setShowAbout(false)
    setShowFigure(false)
    setAsked({ query, entry })
  }

  function goHome() {
    setAsked(null)
    setShowIndex(false)
    setShowAbout(false)
    setShowFigure(false)
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between px-6 pt-10 sm:px-10">
        <button
          type="button"
          onClick={goHome}
          className="group inline-flex items-center gap-2 rounded-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <AtlasMark />
          <p className="font-serif text-sm tracking-wide text-ink-soft transition-colors duration-150 group-hover:text-ink">
            Atlas
            <span className="hidden text-ink-faint/70 sm:inline">
              {' '}
              · a map of how to think, not what to know
            </span>
          </p>
        </button>

        <nav className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              setAsked(null)
              setShowIndex(false)
              setShowAbout(false)
              setShowFigure(true)
            }}
            className="group relative rounded-sm text-sm text-ink-faint transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Survey
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent/70 transition-transform duration-200 ease-out group-hover:scale-x-100"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setAsked(null)
              setShowIndex(false)
              setShowFigure(false)
              setShowAbout(true)
            }}
            className="group relative rounded-sm text-sm text-ink-faint transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            About
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent/70 transition-transform duration-200 ease-out group-hover:scale-x-100"
            />
          </button>
        </nav>
      </header>

      <main className="flex flex-col items-center px-6 sm:px-10">
        <AnimatePresence mode="wait">
          {asked ? (
            <motion.div
              key="answer"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex w-full flex-col items-center pb-32 pt-16 sm:pt-24"
            >
              {/* key forces a clean remount per entry — no shape's local state leaks between questions */}
              {renderAnswer(asked.entry, asked.query)}

              <div className="mt-16 flex w-full max-w-2xl flex-col items-start gap-1.5">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                  A different kind of question
                </p>
                <ExampleLink
                  entry={nextShapeSuggestion(asked.entry.kind)}
                  onSelect={(entry) => handleAsk(entry.query, entry)}
                />
              </div>

              <button
                type="button"
                onClick={() => setAsked(null)}
                className="mt-8 rounded-sm text-sm text-ink-faint underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Ask something else
              </button>
            </motion.div>
          ) : showIndex ? (
            <motion.div
              key="index"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-col items-center pb-32 pt-16 sm:pt-24"
            >
              <QuestionIndex onAsk={handleAsk} onBack={() => setShowIndex(false)} />
            </motion.div>
          ) : showAbout ? (
            <motion.div
              key="about"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-col items-center pb-32 pt-16 sm:pt-24"
            >
              <AboutAtlas onBack={() => setShowAbout(false)} />
            </motion.div>
          ) : showFigure ? (
            <motion.div
              key="figure"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-col items-center pb-32 pt-16 sm:pt-24"
            >
              <Figure onBack={() => setShowFigure(false)} onAsk={handleAsk} />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex min-h-[70vh] w-full flex-col items-center justify-center"
            >
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl text-balance text-center font-serif text-4xl leading-[1.1] text-ink sm:text-5xl"
              >
                Ask one interaction design question.
              </motion.h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-md text-balance text-center text-[15px] leading-relaxed text-ink-soft"
              >
                A curated field guide to interaction judgment — every answer
                argued from real, shipped examples, not a generic rule.
              </motion.p>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 w-full flex justify-center"
              >
                <QueryInput
                  onAsk={handleAsk}
                  onShowIndex={() => setShowIndex(true)}
                  onShowFigure={() => setShowFigure(true)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
