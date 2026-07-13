import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { AboutAtlas } from './components/AboutAtlas'
import { AtlasAnswer } from './components/AtlasAnswer'
import { AtlasMark } from './components/AtlasMark'
import { Figure } from './components/Figure'
import { MisconceptionAnswer } from './components/MisconceptionAnswer'
import { MultiVariableAnswer } from './components/MultiVariableAnswer'
import { RuleInversionAnswer } from './components/RuleInversionAnswer'
import { StressTrace } from './components/StressTrace'
import { allEntries, type Entry } from './content/entry'

type View = 'stress' | 'corpus' | 'about'
type Route = { view: View; entry: Entry | null }

function slugFor(entry: Entry) {
  return entry.query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function routeFromHash(): Route {
  const path = window.location.hash.replace(/^#\/?/, '')
  if (path === 'about') return { view: 'about', entry: null }
  if (path.startsWith('corpus/')) {
    const slug = path.slice('corpus/'.length)
    return {
      view: 'corpus',
      entry: allEntries.find((candidate) => slugFor(candidate) === slug) ?? null,
    }
  }
  if (path === 'corpus') return { view: 'corpus', entry: null }
  return { view: 'stress', entry: null }
}

function renderAnswer(entry: Entry) {
  switch (entry.kind) {
    case 'branch':
      return <AtlasAnswer key={entry.query} entry={entry} askedQuery={entry.query} />
    case 'misconception':
      return <MisconceptionAnswer key={entry.query} entry={entry} askedQuery={entry.query} />
    case 'rule-inversion':
      return <RuleInversionAnswer key={entry.query} entry={entry} askedQuery={entry.query} />
    case 'multi-variable':
      return <MultiVariableAnswer key={entry.query} entry={entry} askedQuery={entry.query} />
  }
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const mainRef = useRef<HTMLElement>(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }))
  }, [route])

  function navigate(view: View, entry: Entry | null = null) {
    const nextHash = entry ? `#/corpus/${slugFor(entry)}` : `#/${view}`
    if (window.location.hash === nextHash) {
      setRoute({ view, entry })
      window.scrollTo({ top: 0, behavior: 'auto' })
      mainRef.current?.focus({ preventScroll: true })
      return
    }
    window.location.hash = nextHash
  }

  return (
    <div className="min-h-screen bg-paper">
      <a href="#main-content" onClick={(event) => { event.preventDefault(); mainRef.current?.focus() }} className="fixed left-4 top-3 z-50 -translate-y-20 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform focus:translate-y-0">
        Skip to content
      </a>

      <header className="border-b border-line px-4 sm:px-8">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate('stress')}
            className="group inline-flex min-h-11 items-center gap-2 rounded-sm px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            aria-label="Atlas home: stress trace"
          >
            <AtlasMark />
            <span className="font-serif text-base tracking-wide text-ink-soft transition-colors group-hover:text-ink">
              Atlas <span className="hidden text-ink-faint lg:inline">· test a design rule</span>
            </span>
          </button>
          <nav className="flex items-center gap-0.5 text-sm sm:gap-3" aria-label="Atlas sections">
            <NavButton active={route.view === 'stress'} onClick={() => navigate('stress')}>
              <span className="sm:hidden">Test</span><span className="hidden sm:inline">Test a rule</span>
            </NavButton>
            <NavButton active={route.view === 'corpus'} onClick={() => navigate('corpus')}>33 examples</NavButton>
            <NavButton active={route.view === 'about'} onClick={() => navigate('about')}>About</NavButton>
          </nav>
        </div>
      </header>

      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex flex-col items-center px-5 pt-10 outline-none sm:px-10 sm:pt-16">
        <div className="flex w-full flex-col items-center">
          {route.entry ? (
            <div className="flex w-full flex-col items-center pb-28">
              <div className="mb-9 w-full max-w-2xl">
                <button type="button" onClick={() => navigate('corpus')} className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                  <ArrowLeft size={14} weight="bold" /> Back to all examples
                </button>
              </div>
              {renderAnswer(route.entry)}
              <button type="button" onClick={() => navigate('corpus')} className="mt-14 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-ink-faint underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                <ArrowLeft size={14} weight="bold" /> See all 33 examples
              </button>
            </div>
          ) : route.view === 'stress' ? (
            <StressTrace onBrowseExamples={() => navigate('corpus')} />
          ) : route.view === 'corpus' ? (
            <div className="flex w-full flex-col items-center pb-28">
              <Figure onBack={() => navigate('stress')} onAsk={(_query, entry) => navigate('corpus', entry)} />
            </div>
          ) : (
            <div className="flex w-full flex-col items-center pb-28">
              <AboutAtlas onBack={() => navigate('stress')} />
            </div>
          )}
        </div>
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
      className={`relative inline-flex min-h-11 items-center rounded-sm px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${active ? 'text-ink' : 'text-ink-faint hover:text-ink'}`}
    >
      {children}
      <span aria-hidden className={`absolute inset-x-2 bottom-1.5 h-px origin-left bg-accent transition-transform ${active ? 'scale-x-100' : 'scale-x-0'}`} />
    </button>
  )
}

export default App
