import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AboutAtlas } from './components/AboutAtlas'
import { AtlasAnswer } from './components/AtlasAnswer'
import { AtlasMark } from './components/AtlasMark'
import { Figure } from './components/Figure'
import { MisconceptionAnswer } from './components/MisconceptionAnswer'
import { MultiVariableAnswer } from './components/MultiVariableAnswer'
import { RuleInversionAnswer } from './components/RuleInversionAnswer'
import { StressTrace } from './components/StressTrace'
import type { Entry } from './content/entry'

type View = 'stress' | 'corpus' | 'about'

function renderAnswer(entry: Entry, query: string) {
  switch (entry.kind) {
    case 'branch':
      return <AtlasAnswer key={entry.query} entry={entry} askedQuery={query} />
    case 'misconception':
      return <MisconceptionAnswer key={entry.query} entry={entry} askedQuery={query} />
    case 'rule-inversion':
      return <RuleInversionAnswer key={entry.query} entry={entry} askedQuery={query} />
    case 'multi-variable':
      return <MultiVariableAnswer key={entry.query} entry={entry} askedQuery={query} />
  }
}

function App() {
  const reduce = useReducedMotion() ?? false
  const [view, setView] = useState<View>('stress')
  const [asked, setAsked] = useState<{ query: string; entry: Entry } | null>(null)

  function open(next: View) {
    setAsked(null)
    setView(next)
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  function ask(query: string, entry: Entry) {
    setAsked({ query, entry })
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line px-6 py-6 sm:px-10">
        <button type="button" onClick={() => open('stress')} className="group inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <AtlasMark />
          <span className="font-serif text-sm tracking-wide text-ink-soft transition-colors group-hover:text-ink">
            Atlas <span className="hidden text-ink-faint sm:inline">· principles under pressure</span>
          </span>
        </button>
        <nav className="flex items-center gap-5 text-sm sm:gap-7" aria-label="Atlas sections">
          <NavButton active={!asked && view === 'stress'} onClick={() => open('stress')}>Stress trace</NavButton>
          <NavButton active={!asked && view === 'corpus'} onClick={() => open('corpus')}>Corpus</NavButton>
          <NavButton active={!asked && view === 'about'} onClick={() => open('about')}>About</NavButton>
        </nav>
      </header>

      <main className="flex flex-col items-center px-6 pt-12 sm:px-10 sm:pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={asked ? `answer-${asked.entry.query}` : view}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
            className="flex w-full flex-col items-center"
          >
            {asked ? (
              <div className="flex w-full flex-col items-center pb-28">
                {renderAnswer(asked.entry, asked.query)}
                <button type="button" onClick={() => setAsked(null)} className="mt-12 text-sm text-ink-faint underline decoration-line underline-offset-4 hover:text-ink">
                  Return to the corpus
                </button>
              </div>
            ) : view === 'stress' ? (
              <StressTrace />
            ) : view === 'corpus' ? (
              <div className="flex w-full flex-col items-center pb-28">
                <Figure onBack={() => open('stress')} onAsk={ask} />
              </div>
            ) : (
              <div className="flex w-full flex-col items-center pb-28">
                <AboutAtlas onBack={() => open('stress')} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative rounded-sm pb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${active ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}
    >
      {children}
      <span className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform ${active ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
  )
}

export default App
