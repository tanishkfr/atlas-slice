import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowCounterClockwise, ArrowRight, Check, GitCommit, Lightning, X } from '@phosphor-icons/react'

type Verdict = 'held' | 'fractured'

type PressureCase = {
  id: string
  distance: string
  setting: string
  title: string
  situation: string
  evidence: string[]
  pressure: string
}

type TracePoint = {
  caseId: string
  verdict: Verdict
  principle: string
  note: string
}

const pressureCases: PressureCase[] = [
  {
    id: 'lightbox',
    distance: 'Near case · low consequence',
    setting: 'Photo archive',
    title: 'A full-screen image viewer',
    situation: 'The underlying gallery remains intact. The viewer has no unfinished input and can be reopened without loss.',
    evidence: ['The action is reversible', 'The background is a meaningful destination', 'Dismissal discards no work'],
    pressure: 'Does your rule hold when leaving is cheap and the destination is obvious?',
  },
  {
    id: 'transfer',
    distance: 'Distant case · high consequence',
    setting: 'International transfer',
    title: 'A review dialog after twelve fields',
    situation: 'The person is checking account details before sending money. An accidental dismissal returns them to an expired session.',
    evidence: ['Dismissal may destroy work', 'The outside region is not a destination', 'Error cost is financial'],
    pressure: 'Does the same rule survive when dismissal is destructive?',
  },
  {
    id: 'switch',
    distance: 'Orthogonal case · different body',
    setting: 'Switch-access setup',
    title: 'A dialog navigated without a pointer',
    situation: 'The person advances focus sequentially. “Outside” is a visual and pointer-based idea that their input method does not expose.',
    evidence: ['There may be no outside-tap event', 'Focus order is the operative geography', 'Escape must have an explicit equivalent'],
    pressure: 'Is your principle about dismissal—or only about one body and one input device?',
  },
]

const starter = 'Tapping outside a dialog should close it when…'

export function StressTrace() {
  const reduce = useReducedMotion() ?? false
  const [seed, setSeed] = useState('')
  const [started, setStarted] = useState(false)
  const [draft, setDraft] = useState('')
  const [note, setNote] = useState('')
  const [trace, setTrace] = useState<TracePoint[]>([])
  const activeCase = pressureCases[trace.length]
  const previousPrinciple = trace.length ? trace[trace.length - 1].principle : seed
  const fractureHasRevision = draft.trim() !== previousPrinciple.trim()
  const complete = trace.length === pressureCases.length

  const versions = useMemo(() => [seed, ...trace.map((point) => point.principle)], [seed, trace])

  function begin() {
    const principle = seed.trim()
    if (!principle) return
    setSeed(principle)
    setDraft(principle)
    setStarted(true)
  }

  function commit(verdict: Verdict) {
    if (!activeCase || !draft.trim()) return
    setTrace((points) => [
      ...points,
      { caseId: activeCase.id, verdict, principle: draft.trim(), note: note.trim() },
    ])
    setNote('')
  }

  function reset() {
    setSeed('')
    setDraft('')
    setNote('')
    setTrace([])
    setStarted(false)
  }

  return (
    <div className="w-full max-w-5xl pb-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
            Stress trace 01
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-[1.04] text-ink sm:text-6xl">
            A principle is only as useful as the cases it survives.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-soft">
            Make a claim. Atlas will not correct it. Three distant cases will press on it, and the trace will keep every place your reasoning moved.
          </p>
        </div>

        <aside className="border-l border-line pl-6 lg:mt-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">Open question</p>
          <p className="mt-2 font-serif text-xl leading-snug text-ink">Should tapping outside a dialog close it?</p>
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">No answer is generated. The artifact is the movement of your own rule.</p>
        </aside>
      </div>

      {!started ? (
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 border-y border-line py-10"
        >
          <label htmlFor="seed-principle" className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
            Write the rule you believe now
          </label>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex-1">
              <p className="font-serif text-xl text-ink-faint">{starter}</p>
              <textarea
                id="seed-principle"
                value={seed}
                onChange={(event) => setSeed(event.target.value)}
                rows={2}
                autoFocus
                placeholder="state the condition in your own words"
                className="mt-2 w-full resize-none border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-2xl leading-snug text-ink outline-none placeholder:text-ink-faint/45"
              />
            </div>
            <button
              type="button"
              onClick={begin}
              disabled={!seed.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Put it under pressure <ArrowRight size={15} weight="bold" />
            </button>
          </div>
        </motion.section>
      ) : (
        <>
          <TraceRail seed={seed} trace={trace} />

          <AnimatePresence mode="wait">
            {!complete && activeCase ? (
              <motion.section
                key={activeCase.id}
                initial={reduce ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -18 }}
                transition={{ duration: 0.35 }}
                className="mt-12 grid gap-8 border border-line bg-paper-dim/40 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{activeCase.distance}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{activeCase.setting}</p>
                  </div>
                  <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">{activeCase.title}</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{activeCase.situation}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                    {activeCase.evidence.map((item) => (
                      <li key={item} className="border-t border-line pt-2 text-xs leading-relaxed text-ink-faint">{item}</li>
                    ))}
                  </ul>
                  <p className="mt-7 border-l-2 border-accent pl-4 font-serif text-xl leading-snug text-ink">{activeCase.pressure}</p>
                </div>

                <div className="border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <label htmlFor={`principle-${activeCase.id}`} className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                    Principle at this pressure
                  </label>
                  <textarea
                    id={`principle-${activeCase.id}`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={5}
                    className="mt-3 w-full resize-none border border-line bg-paper px-4 py-3 font-serif text-xl leading-snug text-ink outline-none transition-colors focus:border-accent"
                  />
                  <label htmlFor={`note-${activeCase.id}`} className="mt-5 block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
                    What did this case expose? <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id={`note-${activeCase.id}`}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="name the assumption"
                    className="mt-2 w-full border-0 border-b border-line bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-faint/60 focus:border-accent"
                  />

                  <div className="mt-7 grid grid-cols-2 gap-3" role="group" aria-label="Record how the principle responded">
                    <button
                      type="button"
                      onClick={() => commit('held')}
                      disabled={!draft.trim()}
                      className="group flex min-h-20 flex-col items-start justify-between border border-line bg-paper p-3 text-left transition-colors hover:border-ink disabled:opacity-30"
                    >
                      <Check size={16} />
                      <span className="text-sm font-medium text-ink">It held</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => commit('fractured')}
                      disabled={!draft.trim() || !fractureHasRevision}
                      title={!fractureHasRevision ? 'Revise the principle before recording a fracture' : undefined}
                      className="group flex min-h-20 flex-col items-start justify-between border border-accent/45 bg-accent-soft/40 p-3 text-left transition-colors hover:border-accent disabled:opacity-30"
                    >
                      <Lightning size={16} className="text-accent" />
                      <span className="text-sm font-medium text-ink">It fractured</span>
                    </button>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="complete"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-14 border-t-2 border-ink pt-10"
              >
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                  <div className="max-w-2xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Your trace, not Atlas’s verdict</p>
                    <h2 className="mt-3 font-serif text-4xl leading-tight text-ink">The answer is the distance your principle travelled.</h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                      Atlas has not selected a correct rule. It has made the lineage of your reasoning inspectable: where it held, where it fractured, and what each case forced you to notice.
                    </p>
                  </div>
                  <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 text-sm text-ink-faint underline decoration-line underline-offset-4 hover:text-ink">
                    <ArrowCounterClockwise size={14} /> Stress another principle
                  </button>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <VersionCard label="First claim" principle={versions[0]} />
                  <VersionCard label="After pressure" principle={versions[versions.length - 1]} accent />
                </div>

                <ol className="mt-10 border-l border-line pl-6">
                  {trace.map((point, index) => {
                    const pressure = pressureCases[index]
                    return (
                      <li key={point.caseId} className="relative pb-8 last:pb-0">
                        <span className={`absolute -left-[31px] top-0 flex h-3 w-3 items-center justify-center rounded-full border ${point.verdict === 'fractured' ? 'border-accent bg-accent' : 'border-ink bg-paper'}`} />
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{pressure.setting}</p>
                          <p className={`font-mono text-[10px] uppercase tracking-[0.14em] ${point.verdict === 'fractured' ? 'text-accent' : 'text-ink-faint'}`}>{point.verdict}</p>
                        </div>
                        <p className="mt-2 font-serif text-xl leading-snug text-ink">{point.principle}</p>
                        {point.note && <p className="mt-2 text-sm leading-relaxed text-ink-soft">Exposed: {point.note}</p>}
                      </li>
                    )
                  })}
                </ol>
              </motion.section>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function TraceRail({ seed, trace }: { seed: string; trace: TracePoint[] }) {
  const points = [{ label: 'Claim', verdict: null as Verdict | null }, ...trace.map((point, index) => ({ label: `P${index + 1}`, verdict: point.verdict }))]

  return (
    <section className="mt-14" aria-label="Reasoning stress trace">
      <div className="flex items-center gap-2 overflow-x-auto pb-3">
        {points.map((point, index) => (
          <div key={`${point.label}-${index}`} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs ${point.verdict === 'fractured' ? 'border-accent bg-accent text-paper' : 'border-ink bg-paper text-ink'}`}>
                {point.verdict === 'fractured' ? <Lightning size={13} weight="fill" /> : point.verdict === 'held' ? <Check size={13} weight="bold" /> : <GitCommit size={14} />}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-ink-faint">{point.label}</span>
            </div>
            {index < points.length - 1 && <span className={`mx-2 h-px min-w-10 flex-1 ${points[index + 1].verdict === 'fractured' ? 'bg-accent' : 'bg-ink'}`} />}
          </div>
        ))}
        {trace.length < pressureCases.length && (
          <>
            <span className="mx-2 h-px min-w-10 flex-1 border-t border-dashed border-line" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dashed border-line text-ink-faint"><X size={12} /></span>
          </>
        )}
      </div>
      <p className="mt-2 line-clamp-2 max-w-3xl font-serif text-lg leading-snug text-ink-soft">{trace.length ? trace[trace.length - 1].principle : seed}</p>
    </section>
  )
}

function VersionCard({ label, principle, accent = false }: { label: string; principle: string; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? 'border-accent bg-accent-soft/35' : 'border-line'}`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.15em] ${accent ? 'text-accent' : 'text-ink-faint'}`}>{label}</p>
      <p className="mt-3 font-serif text-xl leading-snug text-ink">{principle}</p>
    </div>
  )
}
