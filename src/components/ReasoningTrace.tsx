import { motion, useReducedMotion } from 'framer-motion'
import type { Entry } from '../content/entry'

/**
 * One specimen's trace, for the survey plate (Figure.tsx).
 *
 * This is a *transcription*, not a diagram. The line is drawn left → right on
 * the same axis every entry shares — a faint baseline (the question asked, to
 * the principle it lands on). Its shape is read off the entry's own beats:
 * riding above the axis is the reasoning committing one way, crossing it is a
 * reversal, three strands held apart is accumulation. Ticks that cross the line
 * are placed one-per-real-EvidenceNote actually present on the entry, never
 * decoratively: a tick means the reasoning rests, at that beat, on a source you
 * could go check.
 *
 * Nothing is labelled by type. Entries that reason the same way draw the same
 * line; that identity across unrelated questions is the whole claim, so it is
 * left for the eye. The one family that never closes to a single weighted point
 * (multi-variable) is drawn open — some questions genuinely don't collapse to
 * one rule, and the plate shouldn't pretend they do.
 *
 * Coordinate space: 0..240 wide, baseline y=24 (the shared axis). Held
 * identically across all four shapes, per INTERACTION-LANGUAGE.md's invariants.
 */

const INK = 'var(--color-ink)'
const FAINT = 'var(--color-ink-faint)'
const ACCENT = 'var(--color-accent)'
const PAPER = 'var(--color-paper)'

type Props = {
  entry: Entry
  /** Stagger, seconds. The draw represents the reasoning moving; it runs once. */
  delay?: number
}

export function ReasoningTrace({ entry, delay = 0 }: Props) {
  const reduce = useReducedMotion() ?? false
  const markDelay = reduce ? 0 : delay + 0.5

  return (
    <svg
      viewBox="0 0 240 48"
      className="h-11 w-full overflow-visible"
      role="img"
      aria-label="The shape this question's reasoning takes, drawn from its own evidence"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* The axis exists before the reasoning is drawn onto it. */}
      <line x1={0} y1={24} x2={200} y2={24} stroke={FAINT} strokeWidth={1} opacity={0.38} strokeLinecap="round" />
      {renderShape(entry, reduce, delay, markDelay)}
    </svg>
  )
}

function renderShape(entry: Entry, reduce: boolean, delay: number, markDelay: number) {
  switch (entry.kind) {
    /* Forks into two live options that both stay valid, lets a quieter third
       move run between them, then converges to one weighted principle. */
    case 'branch':
      return (
        <>
          <Line d="M8 24 L40 24" reduce={reduce} delay={delay} />
          <Line d="M40 24 C54 24 58 10 74 10 L148 10 C168 10 186 24 200 24" reduce={reduce} delay={delay} />
          <Line d="M40 24 C54 24 58 38 74 38 L148 38 C168 38 186 24 200 24" reduce={reduce} delay={delay} />
          <Line d="M74 24 L200 24" reduce={reduce} delay={delay} faded />
          {entry.branches[0]?.evidence && <Tick x={116} y={10} at={markDelay} reduce={reduce} />}
          {entry.branches[1]?.evidence && <Tick x={116} y={38} at={markDelay} reduce={reduce} />}
          {entry.dissolvingMove?.evidence && <Tick x={138} y={24} at={markDelay} reduce={reduce} />}
          <Weight cx={204} cy={24} at={markDelay} reduce={reduce} />
        </>
      )

    /* Mirrors the belief (rises), reverses it hard and early — a sharp cross of
       the axis, steeper than any other reveal — then settles into the correction. */
    case 'misconception':
      return (
        <>
          <Line
            d="M8 24 L26 24 C40 24 42 12 56 12 C66 12 69 12 77 20 C83 28 89 36 104 36 C120 36 128 24 150 24 L200 24"
            reduce={reduce}
            delay={delay}
          />
          {entry.evidence && <Tick x={172} y={24} at={markDelay} reduce={reduce} />}
          <Weight cx={204} cy={24} at={markDelay} reduce={reduce} />
        </>
      )

    /* Confirms the rule (a spike up), then the same rule pointed the other way
       (a spike down) — two cases juxtaposed — resolving into a sharper line that
       lands above the axis, a new question rather than a return to the rule. */
    case 'rule-inversion':
      return (
        <>
          <Line d="M8 24 L60 24" reduce={reduce} delay={delay} />
          <Line d="M60 24 L78 11 L96 24" reduce={reduce} delay={delay} />
          <Line d="M96 24 L114 37 L132 24" reduce={reduce} delay={delay} />
          <Line d="M132 24 C152 24 164 13 188 13 L200 13" reduce={reduce} delay={delay} />
          {entry.confirmingCase && <Tick x={78} y={11} at={markDelay} reduce={reduce} />}
          {entry.contradictingCase && <Tick x={114} y={37} at={markDelay} reduce={reduce} />}
          <Weight cx={204} cy={13} at={markDelay} reduce={reduce} />
        </>
      )

    /* Variables accumulate — each begins later, none discharges the others —
       and the trace ends open: a set held together on the axis, not resolved to
       a point. Hollow beads on a tie, deliberately not a weight. */
    case 'multi-variable': {
      const rows = [13, 24, 35].slice(0, Math.max(2, entry.variables.length))
      const starts = [40, 54, 70]
      return (
        <>
          <Line d="M8 24 L40 24" reduce={reduce} delay={delay} />
          {rows.map((y, i) => (
            <Line
              key={y}
              d={`M${starts[i]} 24 C${starts[i] + 14} 24 ${starts[i] + 18} ${y} ${starts[i] + 34} ${y} L196 ${y}`}
              reduce={reduce}
              delay={delay}
            />
          ))}
          <OpenSet ys={rows} at={markDelay} reduce={reduce} />
        </>
      )
    }
  }
}

/* ---- primitives ---- */

function Line({
  d,
  reduce,
  delay,
  faded = false,
}: {
  d: string
  reduce: boolean
  delay: number
  faded?: boolean
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={faded ? FAINT : INK}
      strokeWidth={faded ? 1.1 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: faded ? 0.5 : 1 }}
      initial={reduce ? false : { pathLength: 0 }}
      animate={reduce ? undefined : { pathLength: 1 }}
      transition={reduce ? undefined : { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
    />
  )
}

/** Evidence marker: a short bar crossing the line. Accent-coloured, but the
 *  crossing itself carries the meaning, so it survives a black-and-white print. */
function Tick({ x, y, at, reduce }: { x: number; y: number; at: number; reduce: boolean }) {
  return (
    <motion.line
      x1={x}
      y1={y - 5.5}
      x2={x}
      y2={y + 5.5}
      stroke={ACCENT}
      strokeWidth={1.6}
      strokeLinecap="round"
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={reduce ? undefined : { duration: 0.3, delay: at }}
    />
  )
}

/** The closing principle: one filled point with a faint halo — the one place
 *  the trace resolves, carrying more weight than anything before it. */
function Weight({ cx, cy, at, reduce }: { cx: number; cy: number; at: number; reduce: boolean }) {
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      transition={reduce ? undefined : { duration: 0.4, delay: at }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={6.5} fill="none" stroke={FAINT} strokeWidth={1} opacity={0.5} />
      <circle cx={cx} cy={cy} r={3.4} fill={INK} />
    </motion.g>
  )
}

/** The multi-variable terminal: hollow beads on a faint tie, one per variable —
 *  a set held on the axis, never merged. The map, not a directive. */
function OpenSet({ ys, at, reduce }: { ys: number[]; at: number; reduce: boolean }) {
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={reduce ? undefined : { duration: 0.4, delay: at }}
    >
      <line x1={200} y1={ys[0]} x2={200} y2={ys[ys.length - 1]} stroke={FAINT} strokeWidth={1} opacity={0.55} />
      {ys.map((y) => (
        <circle key={y} cx={200} cy={y} r={2.6} fill={PAPER} stroke={INK} strokeWidth={1.4} />
      ))}
    </motion.g>
  )
}
