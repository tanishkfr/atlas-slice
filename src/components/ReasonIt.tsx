import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, PencilSimpleLine } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { methodShapes, shapeFor, openCases, type MethodShape } from '../content/shapes'
import { ReasoningTrace } from './ReasoningTrace'

type ReasonItProps = {
  onBack: () => void
  onOpenEntry: (entry: Entry) => void
}

const byQuery = new Map(allEntries.map((e) => [e.query, e]))

/**
 * The spine of Atlas: the one place the reader does the reasoning instead of
 * reading it. You bring a question — deliberately, one Atlas has never answered
 * — diagnose its shape, watch it placed on the same survey the corpus lives on,
 * work the shape's scaffold, and land your own principle. Atlas never fabricates
 * an answer here; it hands you the method and gets out of the way. The payoff
 * isn't a verdict — it's the fact that you reasoned a case the corpus doesn't
 * contain, which is the whole claim the project is trying to earn.
 */
export function ReasonIt({ onBack, onOpenEntry }: ReasonItProps) {
  const reduce = useReducedMotion() ?? false
  const [question, setQuestion] = useState('')
  const [custom, setCustom] = useState('')
  const [shape, setShape] = useState<Entry['kind'] | null>(null)
  const [principle, setPrinciple] = useState('')
  const [revealed, setRevealed] = useState(false)

  function chooseQuestion(q: string) {
    setQuestion(q)
    setShape(null)
    setPrinciple('')
    setRevealed(false)
  }

  function submitCustom(e: FormEvent) {
    e.preventDefault()
    const trimmed = custom.trim()
    if (trimmed) chooseQuestion(trimmed)
  }

  const appear = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  const activeShape: MethodShape | null = shape ? shapeFor(shape) : null

  return (
    <div className="w-full max-w-2xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-faint transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={13} weight="bold" />
        Back
      </button>

      <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Reason it yourself
      </p>
      <h1 className="mt-2 text-balance font-serif text-3xl leading-tight text-ink sm:text-4xl">
        Atlas won’t answer this one. You will.
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-soft">
        Pick a question Atlas has never covered. Work out what kind of question it
        is, then reason it with that shape’s method — the same one every entry in
        the corpus was built on. Nothing here is graded, and no answer is generated
        for you. The point is that you leave able to reason a case the corpus doesn’t contain.
      </p>

      {/* 1 — Choose a question */}
      <section className="mt-12">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          1 · Choose an open case
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {openCases.map((q) => {
            const active = question === q
            return (
              <button
                key={q}
                type="button"
                onClick={() => chooseQuestion(q)}
                className={[
                  'rounded-full border px-4 py-2 text-left text-sm leading-snug transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  active
                    ? 'border-accent bg-accent-soft/70 text-ink'
                    : 'border-line text-ink-soft hover:border-ink/30',
                ].join(' ')}
              >
                {q}
              </button>
            )
          })}
        </div>

        <form onSubmit={submitCustom} className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <PencilSimpleLine
              size={15}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="…or bring your own interaction question"
              aria-label="Bring your own interaction question"
              className="w-full border-b border-ink/15 bg-transparent py-2 pl-6 text-[15px] text-ink caret-accent placeholder:text-ink-faint outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={!custom.trim()}
            className="rounded-sm px-3 py-1.5 text-sm font-medium text-accent transition-colors duration-150 hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            Use this
          </button>
        </form>
      </section>

      {/* 2 — Diagnose the shape */}
      {question && (
        <motion.section {...appear()} className="mt-14">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            2 · What kind of question is it?
          </p>
          <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
            You’re reasoning about:{' '}
            <span className="font-serif text-ink">“{question}”</span>. Most
            interaction questions are one of four shapes. Which one is this? (There’s
            no single right answer — the diagnosis is part of the reasoning.)
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {methodShapes.map((s) => {
              const active = shape === s.kind
              return (
                <button
                  key={s.kind}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setShape(s.kind)
                    setRevealed(false)
                  }}
                  className={[
                    'rounded-sm border px-5 py-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                    active ? 'border-accent bg-accent-soft/40' : 'border-line hover:border-ink/25',
                  ].join(' ')}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-medium leading-snug text-ink">{s.test}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                      {s.name}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-faint">{s.tell}</p>
                </button>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* 3 — Placement + 4 — Work it + 5 — Land it */}
      {activeShape && (
        <motion.div key={activeShape.kind} {...appear(0.05)}>
          {/* Placement on the survey */}
          <section className="mt-14">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              3 · Your question, on the survey
            </p>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
              Here’s your question placed among the ones Atlas has already surveyed
              as the same shape. Yours draws in accent — same silhouette, but no
              evidence marks yet. Those marks are the sources; earning them is the
              work below.
            </p>

            <div className="mt-6 rounded-sm border border-line p-5 sm:p-6">
              <PlateRow label={question} labelNote="your question" ghostKind={activeShape.kind} highlight />
              <div className="mt-1 border-t border-line/70 pt-1">
                {activeShape.exampleQueries.map((q) => {
                  const entry = byQuery.get(q)
                  if (!entry) return null
                  return <PlateRow key={q} label={q} entry={entry} onClick={() => onOpenEntry(entry)} />
                })}
              </div>
              <p className="mt-3 text-[13px] leading-snug text-ink-faint">
                These corpus questions were diagnosed as the same shape. If yours
                doesn’t feel like it belongs beside them, that’s a signal — try a
                different shape above.
              </p>
            </div>
          </section>

          {/* Work the scaffold */}
          <section className="mt-14">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              4 · Work it — {activeShape.name.toLowerCase()}
            </p>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-soft">
              {activeShape.definition}
            </p>

            <ol className="mt-6 flex flex-col gap-6">
              {activeShape.scaffold.map((prompt, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 font-mono text-[13px] text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] leading-snug text-ink">{prompt}</p>
                    <textarea
                      rows={2}
                      placeholder="Work it out here — this is your scratch space, never read back."
                      className="mt-2 w-full resize-none rounded-sm border border-line bg-transparent px-3 py-2 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint/70 outline-none transition-colors focus:border-accent"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Land the principle */}
          <section className="mt-12 border-t border-line pt-10">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
              5 · Land it
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">
              {activeShape.principlePrompt}
            </p>
            <textarea
              value={principle}
              onChange={(e) => setPrinciple(e.target.value)}
              rows={2}
              placeholder="Write the one line you’d actually keep."
              className="mt-3 w-full resize-none rounded-sm border border-ink/15 bg-transparent px-4 py-3 font-serif text-lg leading-snug text-ink caret-accent placeholder:font-sans placeholder:text-base placeholder:text-ink-faint/70 outline-none transition-colors focus:border-accent"
            />

            {!revealed && (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                disabled={!principle.trim()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-ink/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                See what you just did
                <ArrowRight size={14} weight="bold" />
              </button>
            )}
          </section>

          {/* The payoff */}
          {revealed && (
            <motion.section {...appear()} className="mt-8">
              <div className="border-l-2 border-accent py-5 pl-6 pr-4 sm:pl-8 sm:pr-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                  What you just did
                </p>
                <p className="mt-3 text-pretty font-serif text-xl leading-snug text-ink sm:text-2xl">
                  Atlas has never written an answer for “{question}” — you just
                  reasoned one anyway.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  The principle you landed on:
                </p>
                <p className="mt-1 font-serif text-lg leading-snug text-ink">
                  <span className="bg-accent-soft px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                    {principle}
                  </span>
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                  You used the same shape as {activeShape.exampleQueries.length} of
                  Atlas’s entries — no answer was handed to you. That’s the whole
                  point of a map: it travels to ground it doesn’t already cover.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {byQuery.get(activeShape.exampleQueries[0]) && (
                    <button
                      type="button"
                      onClick={() => onOpenEntry(byQuery.get(activeShape.exampleQueries[0])!)}
                      className="group inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-accent transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    >
                      Compare with a worked example of this shape
                      <ArrowRight
                        size={13}
                        weight="bold"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      chooseQuestion('')
                      setCustom('')
                      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
                    }}
                    className="rounded-sm text-sm text-ink-faint underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    Reason another
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </motion.div>
      )}
    </div>
  )
}

/** One row of the placement mini-plate: a label + its trace, aligned like the
 *  Survey. The reader's own row is a ghost (no entry); corpus rows are live. */
function PlateRow({
  label,
  labelNote,
  entry,
  ghostKind,
  highlight = false,
  onClick,
}: {
  label: string
  labelNote?: string
  entry?: Entry
  ghostKind?: Entry['kind']
  highlight?: boolean
  onClick?: () => void
}) {
  const content = (
    <>
      <span className="flex min-w-0 flex-col gap-0.5 sm:flex-1">
        <span
          className={[
            'min-w-0 font-serif text-[14px] leading-snug',
            highlight ? 'text-ink' : 'text-ink-soft',
          ].join(' ')}
        >
          {label}
        </span>
        {labelNote && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            {labelNote}
          </span>
        )}
      </span>
      <span className="w-full shrink-0 sm:w-[200px]">
        <ReasoningTrace entry={entry} ghostKind={ghostKind} highlight={highlight} />
      </span>
    </>
  )

  const cls =
    'flex w-full flex-col items-start gap-1 py-2.5 text-left sm:flex-row sm:items-center sm:gap-4'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${cls}`}
      >
        {content}
      </button>
    )
  }
  return <div className={cls}>{content}</div>
}
