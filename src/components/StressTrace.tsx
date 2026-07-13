import { useEffect, useMemo, useRef, useState, type TextareaHTMLAttributes } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowCounterClockwise,
  ArrowRight,
  Check,
  ClipboardText,
  DownloadSimple,
  GitCommit,
  Lightning,
  PencilSimple,
} from '@phosphor-icons/react'

type Verdict = 'held' | 'refined' | 'fractured'

const verdictLabels: Record<Verdict, string> = {
  held: 'still works',
  refined: 'changed',
  fractured: 'breaks',
}

type StressTraceProps = {
  onBrowseExamples: () => void
}

type PressureCase = {
  id: string
  distance: string
  shortLabel: string
  setting: string
  title: string
  situation: string
  constraints: string[]
  sources: { label: string; href: string }[]
  pressure: string
}

type TracePoint = {
  caseId: string
  verdict: Verdict
  principle: string
  note: string
}

type Session = {
  seed: string
  started: boolean
  draft: string
  note: string
  trace: TracePoint[]
}

const STORAGE_KEY = 'atlas-stress-trace-v3'
const STARTER_KEY = 'atlas-stress-starter-v1'
const starters = [
  'Tapping outside a dialog should close it when leaving will not lose work.',
  'A dialog should ignore outside taps unless leaving is clearly safe.',
  'People should be able to close a dialog by tapping outside when the background is a meaningful destination.',
]

const pressureCases: PressureCase[] = [
  {
    id: 'lightbox',
    distance: 'Similar example · low risk',
    shortLabel: 'Similar',
    setting: 'Photo archive',
    title: 'A full-screen image viewer',
    situation:
      'The underlying gallery remains intact. The viewer has no unfinished input and can be reopened without loss.',
    constraints: [
      'The action is reversible',
      'The background is a meaningful destination',
      'Dismissal discards no work',
    ],
    sources: [
      {
        label: 'W3C APG · modal dialog pattern',
        href: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      },
    ],
    pressure: 'Does your rule hold when leaving is cheap and the destination is obvious?',
  },
  {
    id: 'transfer',
    distance: 'Different example · high risk',
    shortLabel: 'Different',
    setting: 'International transfer',
    title: 'A review dialog after twelve fields',
    situation:
      'The person is checking account details before sending money. An accidental dismissal returns them to an expired session.',
    constraints: [
      'Dismissal may destroy work',
      'The outside region is not a destination',
      'Error cost is financial',
    ],
    sources: [
      {
        label: 'Microsoft · dialog controls and safe actions',
        href: 'https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/dialogs-and-flyouts/dialogs',
      },
      {
        label: 'W3C APG · irreversible transactions',
        href: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      },
    ],
    pressure: 'Does the same rule survive when dismissal is destructive?',
  },
  {
    id: 'switch',
    distance: 'Accessibility example · different input',
    shortLabel: 'Access',
    setting: 'Switch-access setup',
    title: 'A dialog navigated without a pointer',
    situation:
      'The person advances focus sequentially. “Outside” is a visual, pointer-based idea that their input method does not expose.',
    constraints: [
      'There may be no outside-tap event',
      'Focus order is the operative geography',
      'Dismissal needs an explicit control',
    ],
    sources: [
      {
        label: 'W3C APG · focus and keyboard interaction',
        href: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      },
    ],
    pressure: 'Is your rule about closing a dialog, or only about tapping with a pointer?',
  },
]

const emptySession: Session = {
  seed: '',
  started: false,
  draft: '',
  note: '',
  trace: [],
}

function loadStarterIndex() {
  const saved = Number.parseInt(window.localStorage.getItem(STARTER_KEY) ?? '0', 10)
  return Number.isInteger(saved) && saved >= 0 ? saved % starters.length : 0
}

function loadSession(): Session {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySession
    const saved = JSON.parse(raw) as Partial<Session>
    if (!Array.isArray(saved.trace)) return emptySession
    const seed = typeof saved.seed === 'string' ? saved.seed.trim() : ''
    const started = saved.started === true && seed.length > 0
    const trace: TracePoint[] = []
    if (started) {
      for (const [index, value] of saved.trace.slice(0, pressureCases.length).entries()) {
        if (!value || typeof value !== 'object') break
        const point = value as Partial<TracePoint>
        if (
          point.caseId !== pressureCases[index].id ||
          !['held', 'refined', 'fractured'].includes(point.verdict ?? '') ||
          typeof point.principle !== 'string' ||
          !point.principle.trim() ||
          typeof point.note !== 'string'
        ) break
        trace.push({
          caseId: point.caseId,
          verdict: point.verdict as Verdict,
          principle: point.principle.trim(),
          note: point.note,
        })
      }
    }
    const fallbackDraft = trace.at(-1)?.principle ?? seed
    return {
      seed,
      started,
      draft: typeof saved.draft === 'string' ? saved.draft : fallbackDraft,
      note: typeof saved.note === 'string' ? saved.note : '',
      trace,
    }
  } catch {
    return emptySession
  }
}

function loadInitialSession(): Session {
  const saved = loadSession()
  return saved.started || saved.seed
    ? saved
    : { ...saved, seed: starters[loadStarterIndex()] }
}

export function StressTrace({ onBrowseExamples }: StressTraceProps) {
  const reduce = useReducedMotion() ?? false
  const [session, setSession] = useState<Session>(loadInitialSession)
  const [starterIndex, setStarterIndex] = useState(loadStarterIndex)
  const [confirmReset, setConfirmReset] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  const nextHeadingRef = useRef<HTMLHeadingElement>(null)

  const { seed, started, draft, note, trace } = session
  const activeCase = pressureCases[trace.length]
  const previousPrinciple = trace.length ? trace[trace.length - 1].principle : seed
  const hasRevision = draft.trim() !== previousPrinciple.trim()
  const complete = trace.length === pressureCases.length
  const versions = useMemo(() => [seed, ...trace.map((point) => point.principle)], [seed, trace])

  useEffect(() => {
    if (!session.started && !session.seed && session.trace.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  useEffect(() => {
    if (!started) return
    const id = window.setTimeout(
      () => nextHeadingRef.current?.focus({ preventScroll: true }),
      reduce ? 0 : 230,
    )
    return () => window.clearTimeout(id)
  }, [reduce, started, trace.length])

  function update(patch: Partial<Session>) {
    setSession((current) => ({ ...current, ...patch }))
  }

  function begin() {
    const principle = seed.trim()
    if (!principle) return
    update({ seed: principle, draft: principle, started: true })
  }

  function commit(verdict: Verdict) {
    const principle = draft.trim()
    if (!activeCase || !principle) return
    if (verdict === 'held' && hasRevision) return
    if (verdict !== 'held' && !hasRevision) return

    setConfirmReset(false)
    setSession((current) => ({
      ...current,
      trace: [
        ...current.trace,
        {
          caseId: activeCase.id,
          verdict,
          principle,
          note: current.note.trim(),
        },
      ],
      note: '',
      draft: principle,
    }))
  }

  function showNextStarter() {
    const next = (starterIndex + 1) % starters.length
    setStarterIndex(next)
    setSession((current) => (
      current.started ? current : { ...current, seed: starters[next], draft: '' }
    ))
    window.localStorage.setItem(STARTER_KEY, String(next))
  }

  function reset() {
    setSession(emptySession)
    setConfirmReset(false)
    setShareStatus('')
    window.localStorage.removeItem(STORAGE_KEY)
    showNextStarter()
    window.requestAnimationFrame(() => document.getElementById('seed-principle')?.focus())
  }

  function traceAsText() {
    const lines = [
      'Atlas — Rule Test',
      '',
      'Question',
      'Should tapping outside a dialog close it?',
      '',
      'Starting rule',
      seed,
      '',
    ]

    trace.forEach((point, index) => {
      const pressure = pressureCases[index]
      lines.push(
        `${index + 1}. ${pressure.setting} — ${verdictLabels[point.verdict]}`,
        point.principle,
        ...(point.note ? [`Noticed: ${point.note}`] : []),
        '',
      )
    })

    lines.push('Final rule', versions[versions.length - 1])
    return lines.join('\n')
  }

  async function copyTrace() {
    try {
      await navigator.clipboard.writeText(traceAsText())
      setShareStatus('Result copied to the clipboard.')
    } catch {
      setShareStatus('Copy was blocked. Use Download instead.')
    }
  }

  function downloadTrace() {
    const blob = new Blob([traceAsText()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'atlas-rule-test.txt'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setShareStatus('Result downloaded.')
  }

  return (
    <div className="w-full max-w-5xl pb-28">
      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Rule test
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-[1.06] text-ink sm:text-6xl">
            Test a design rule against three very different examples.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-soft">
            Write a rule, test it against three different examples, and change it when it stops working.
          </p>
          <button
            type="button"
            onClick={onBrowseExamples}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-accent underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Browse all 33 design examples <ArrowRight size={14} weight="bold" />
          </button>
        </div>

        <aside className="border-l border-line pl-5 lg:mt-7 lg:pl-6">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink-faint">Question</p>
          <p className="mt-2 font-serif text-xl leading-snug text-ink">Should tapping outside a dialog close it?</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            Atlas does not grade your answer. Your progress stays in this browser.
          </p>
        </aside>
      </div>

      {!started ? (
        <section className="mt-14 border-y border-line py-9 sm:mt-16 sm:py-10">
          <label htmlFor="seed-principle" className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink-faint">
            Your starting rule
          </label>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-faint">Edit this rule before you begin.</p>
                <button
                  type="button"
                  onClick={showNextStarter}
                  className="min-h-11 rounded-sm text-xs font-medium text-ink-faint underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Try a different starting rule
                </button>
              </div>
              <AutoGrowTextarea
                id="seed-principle"
                value={seed}
                onChange={(event) => update({ seed: event.target.value })}
                rows={2}
                placeholder="Write a complete rule"
                className="mt-2 w-full border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-2xl leading-snug text-ink outline-none placeholder:text-ink-faint focus-visible:border-accent"
              />
            </div>
            <button
              type="button"
              onClick={begin}
              disabled={!seed.trim()}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Start the test
              <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      ) : (
        <>
          <TraceRail seed={seed} trace={trace} complete={complete} />
          {!complete && (
            <ResetControl
              confirm={confirmReset}
              label="Start over"
              onRequest={() => setConfirmReset(true)}
              onCancel={() => setConfirmReset(false)}
              onReset={reset}
              className="mt-4"
            />
          )}

          <AnimatePresence mode="wait">
            {!complete && activeCase ? (
              <motion.section
                key={activeCase.id}
                initial={reduce ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-10 grid gap-8 border border-line bg-paper-dim/45 p-5 sm:p-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]"
                aria-labelledby={`case-${activeCase.id}`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent">{activeCase.distance}</p>
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">{activeCase.setting}</p>
                  </div>
                  <h2
                    ref={nextHeadingRef}
                    tabIndex={-1}
                    id={`case-${activeCase.id}`}
                    className="mt-4 font-serif text-3xl leading-tight text-ink outline-none"
                  >
                    {activeCase.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{activeCase.situation}</p>
                  <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">What matters here</p>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                    {activeCase.constraints.map((item) => (
                      <li key={item} className="border-t border-line pt-2 text-sm leading-relaxed text-ink-faint">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-col items-start gap-2">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                      Helpful guidance · context, not the answer
                    </span>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {activeCase.sources.map((source) => (
                        <a
                          key={source.href}
                          href={source.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-sm text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          {source.label} <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <p className="mt-7 border-l-2 border-accent pl-4 font-serif text-xl leading-snug text-ink">{activeCase.pressure}</p>
                </div>

                <div className="border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <label htmlFor={`principle-${activeCase.id}`} className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink-faint">
                    Your rule now
                  </label>
                  <AutoGrowTextarea
                    id={`principle-${activeCase.id}`}
                    value={draft}
                    onChange={(event) => update({ draft: event.target.value })}
                    rows={5}
                    className="mt-3 w-full rounded-sm border border-control bg-paper px-4 py-3 font-serif text-xl leading-snug text-ink outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                  />

                  {hasRevision && (
                    <div className="mt-4 rounded-sm bg-paper px-3 py-3">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">What you changed</p>
                      <RevisionDiff before={previousPrinciple} after={draft.trim()} className="mt-2 text-sm leading-relaxed" />
                    </div>
                  )}

                  <label htmlFor={`note-${activeCase.id}`} className="mt-5 block font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-ink-faint">
                    What did you notice? <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id={`note-${activeCase.id}`}
                    value={note}
                    onChange={(event) => update({ note: event.target.value })}
                    placeholder="Write the hidden assumption"
                    className="mt-2 min-h-11 w-full border-0 border-b border-control bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:border-accent"
                  />

                  <p className="mt-6 text-sm leading-relaxed text-ink-faint">
                    {hasRevision
                      ? 'You changed the rule. Was it a small correction, or did the old rule fail?'
                      : 'Keep the same words if the rule still works. Edit the rule first if it needs to change.'}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose what happened to your rule">
                    <VerdictButton
                      icon={<Check size={17} />}
                      label="Still works"
                      description="Keep the same words"
                      disabled={!draft.trim() || hasRevision}
                      onClick={() => commit('held')}
                    />
                    <VerdictButton
                      icon={<PencilSimple size={17} className="text-accent" />}
                      label="Small change"
                      description="I adjusted the rule"
                      disabled={!draft.trim() || !hasRevision}
                      onClick={() => commit('refined')}
                      accent
                    />
                    <VerdictButton
                      icon={<Lightning size={17} className="text-accent" />}
                      label="Needs a new rule"
                      description="The old rule failed"
                      disabled={!draft.trim() || !hasRevision}
                      onClick={() => commit('fractured')}
                      accent
                    />
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="complete"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-14 border-t-2 border-ink pt-10"
              >
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                  <div className="max-w-2xl">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent">Your result</p>
                    <h2 ref={nextHeadingRef} tabIndex={-1} className="mt-3 font-serif text-4xl leading-tight text-ink outline-none">
                      What matters is how your rule changed.
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                      Atlas has not chosen a correct answer. It shows where your rule worked, where you changed it, and what each example made you notice.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button type="button" onClick={copyTrace} className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-control px-3 py-2 text-sm font-medium text-ink-soft hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      <ClipboardText size={16} /> Copy result
                    </button>
                    <button type="button" onClick={downloadTrace} className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-control px-3 py-2 text-sm font-medium text-ink-soft hover:border-accent hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                      <DownloadSimple size={16} /> Download
                    </button>
                  </div>
                </div>

                <p className="mt-3 min-h-5 text-sm text-ink-faint" aria-live="polite">{shareStatus}</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <VersionCard label="Starting rule" principle={versions[0]} />
                  <VersionCard label="Final rule" principle={versions[versions.length - 1]} accent />
                </div>

                <div className="mt-8 border-l-2 border-accent bg-accent-soft/30 px-5 py-5">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent">What changed</p>
                  <RevisionDiff before={versions[0]} after={versions[versions.length - 1]} className="mt-3 font-serif text-xl leading-relaxed" />
                </div>

                <ol className="mt-10 border-l border-line pl-6">
                  {trace.map((point, index) => {
                    const pressure = pressureCases[index]
                    const before = index === 0 ? seed : trace[index - 1].principle
                    return (
                      <li key={point.caseId} className="relative pb-9 last:pb-0">
                        <span className={`absolute -left-[31px] top-0 h-3 w-3 rounded-full border ${point.verdict === 'held' ? 'border-ink bg-paper' : 'border-accent bg-accent'}`} />
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">{pressure.setting}</p>
                          <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.12em] ${point.verdict === 'held' ? 'text-ink-faint' : 'text-accent'}`}>{verdictLabels[point.verdict]}</p>
                        </div>
                        {point.verdict === 'held' ? (
                          <p className="mt-2 font-serif text-xl leading-snug text-ink">{point.principle}</p>
                        ) : (
                          <RevisionDiff before={before} after={point.principle} className="mt-2 font-serif text-xl leading-relaxed" />
                        )}
                        {point.note && <p className="mt-2 text-sm leading-relaxed text-ink-soft">Noticed: {point.note}</p>}
                      </li>
                    )
                  })}
                </ol>

                <ResetControl
                  confirm={confirmReset}
                  label="Test another rule"
                  onRequest={() => setConfirmReset(true)}
                  onCancel={() => setConfirmReset(false)}
                  onReset={reset}
                  className="mt-12 border-t border-line pt-6"
                />
              </motion.section>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function VerdictButton({
  icon,
  label,
  description,
  disabled,
  onClick,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  description: string
  disabled: boolean
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-24 flex-col items-start justify-between rounded-sm border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${accent ? 'border-accent/55 bg-accent-soft/35 hover:border-accent' : 'border-control bg-paper hover:border-ink'}`}
    >
      {icon}
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-xs text-ink-faint">{description}</span>
      </span>
    </button>
  )
}

function ResetControl({
  confirm,
  label,
  onRequest,
  onCancel,
  onReset,
  className = '',
}: {
  confirm: boolean
  label: string
  onRequest: () => void
  onCancel: () => void
  onReset: () => void
  className?: string
}) {
  return (
    <div className={className}>
      {!confirm ? (
        <button
          type="button"
          onClick={onRequest}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-ink-faint underline decoration-line underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowCounterClockwise size={15} /> {label}
        </button>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-sm border border-control p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            This deletes your saved progress and starts with a different rule.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-11 rounded-sm px-3 text-sm font-medium text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 rounded-sm bg-ink px-4 text-sm font-medium text-paper hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Delete and start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TraceRail({ seed, trace, complete }: { seed: string; trace: TracePoint[]; complete: boolean }) {
  const points = [
    {
      label: 'Start',
      fullLabel: 'Starting rule: complete',
      verdict: null as Verdict | null,
      status: 'complete' as const,
    },
    ...pressureCases.map((pressure, index) => {
      const point = trace[index]
      const status = point ? 'complete' : !complete && index === trace.length ? 'current' : 'upcoming'
      return {
        label: pressure.shortLabel,
        fullLabel: point
          ? `${pressure.distance}: ${verdictLabels[point.verdict]}`
          : `${pressure.distance}: ${status === 'current' ? 'current step' : 'upcoming'}`,
        verdict: point?.verdict ?? null,
        status,
      }
    }),
  ]

  return (
    <section className="mt-12" aria-label="Rule test progress">
      <div className="-mx-1 overflow-x-auto px-1 pb-3">
        <ol className="flex min-w-[500px] items-start gap-2">
        {points.map((point, index) => (
          <li
            key={point.label}
            className="flex min-w-0 flex-1 items-center last:flex-none"
            aria-label={point.fullLabel}
            aria-current={point.status === 'current' ? 'step' : undefined}
          >
            <div className="flex shrink-0 flex-col items-center gap-2">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs ${
                point.verdict === 'fractured'
                  ? 'border-accent bg-accent text-paper'
                  : point.verdict === 'refined'
                    ? 'border-accent bg-accent-soft text-accent'
                    : point.verdict === 'held' || index === 0
                      ? 'border-ink bg-paper text-ink'
                      : point.status === 'current'
                        ? 'border-accent bg-paper text-accent'
                        : 'border-dashed border-control bg-paper text-ink-faint'
              }`}>
                {point.verdict === 'fractured' ? (
                  <Lightning size={14} weight="fill" />
                ) : point.verdict === 'refined' ? (
                  <PencilSimple size={14} weight="bold" />
                ) : point.verdict === 'held' ? (
                  <Check size={14} weight="bold" />
                ) : index === 0 ? (
                  <GitCommit size={15} />
                ) : (
                  index
                )}
              </span>
              <span className={`font-mono text-[11px] font-medium uppercase tracking-[0.11em] ${point.status === 'current' ? 'text-accent' : 'text-ink-faint'}`}>
                {point.label}
              </span>
            </div>
            {index < points.length - 1 && (
              <span
                aria-hidden
                className={`mx-2 h-px min-w-8 flex-1 ${points[index + 1].status === 'upcoming' ? 'border-t border-dashed border-control' : 'bg-ink'}`}
              />
            )}
          </li>
        ))}
        </ol>
      </div>
      <p className="mt-2 max-w-3xl font-serif text-lg leading-snug text-ink-soft">
        {trace.length ? trace[trace.length - 1].principle : seed}
      </p>
    </section>
  )
}

function RevisionDiff({ before, after, className = '' }: { before: string; after: string; className?: string }) {
  const beforeParts = before.split(/(\s+)/)
  const afterParts = after.split(/(\s+)/)
  let start = 0
  while (start < beforeParts.length && start < afterParts.length && beforeParts[start] === afterParts[start]) start += 1

  let beforeEnd = beforeParts.length - 1
  let afterEnd = afterParts.length - 1
  while (beforeEnd >= start && afterEnd >= start && beforeParts[beforeEnd] === afterParts[afterEnd]) {
    beforeEnd -= 1
    afterEnd -= 1
  }

  if (before === after) return <p className={`text-ink ${className}`}>{after}</p>

  return (
    <p className={`text-ink ${className}`} aria-label={`Changed from: ${before}. To: ${after}.`}>
      <span aria-hidden>
        {afterParts.slice(0, start).join('')}
        {beforeEnd >= start && (
          <del className="rounded-sm bg-ink/7 px-0.5 text-ink-faint decoration-ink-faint/70">
            {beforeParts.slice(start, beforeEnd + 1).join('')}
          </del>
        )}
        {beforeEnd >= start && afterEnd >= start && ' '}
        {afterEnd >= start && (
          <ins className="rounded-sm bg-accent-soft px-0.5 text-ink no-underline">
            {afterParts.slice(start, afterEnd + 1).join('')}
          </ins>
        )}
        {afterParts.slice(afterEnd + 1).join('')}
      </span>
    </p>
  )
}

function AutoGrowTextarea({ value, style, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }, [value])

  return <textarea ref={ref} value={value} style={{ ...style, overflow: 'hidden', resize: 'none' }} {...props} />
}

function VersionCard({ label, principle, accent = false }: { label: string; principle: string; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? 'border-accent bg-accent-soft/35' : 'border-line'}`}>
      <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.13em] ${accent ? 'text-accent' : 'text-ink-faint'}`}>{label}</p>
      <p className="mt-3 font-serif text-xl leading-snug text-ink">{principle}</p>
    </div>
  )
}
