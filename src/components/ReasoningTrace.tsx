import { motion, useReducedMotion } from 'framer-motion'
import type { Entry } from '../content/entry'

const INK = 'var(--color-ink)'
const FAINT = 'var(--color-ink-faint)'
const ACCENT = 'var(--color-accent)'
const PAPER = 'var(--color-paper)'

type Props = {
  entry?: Entry
  ghostKind?: Entry['kind']
  variableCount?: number
  delay?: number
  highlight?: boolean
}

const descriptions: Record<Entry['kind'], string> = {
  branch: 'Two paths: two valid situations lead to one useful rule.',
  misconception: 'Common belief, corrected: a reasonable first guess is shown to be wrong.',
  'rule-inversion': 'Same rule, opposite answers: two examples show why the question needs to be more specific.',
  'multi-variable': 'Things to weigh: several factors matter, so there is no single answer.',
}

export function ReasoningTrace({ entry, ghostKind, variableCount = 3, delay = 0, highlight = false }: Props) {
  const reduce = useReducedMotion() ?? false
  const kind = entry?.kind ?? ghostKind
  if (!kind) return null

  const varCount =
    entry?.kind === 'multi-variable' ? entry.variables.length : Math.min(Math.max(variableCount, 2), 3)
  const main = highlight ? ACCENT : INK
  const label = entry ? `${entry.query}. ${descriptions[kind]}` : descriptions[kind]

  return (
    <svg
      viewBox="0 0 240 48"
      className="h-11 w-full overflow-visible"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <line x1={0} y1={24} x2={200} y2={24} stroke={FAINT} strokeWidth={1} opacity={0.42} strokeLinecap="round" />
      {renderShape({ kind, varCount, reduce, delay, main })}
    </svg>
  )
}

type ShapeArgs = {
  kind: Entry['kind']
  varCount: number
  reduce: boolean
  delay: number
  main: string
}

function renderShape({ kind, varCount, reduce, delay, main }: ShapeArgs) {
  switch (kind) {
    case 'branch':
      return (
        <>
          <Line d="M8 24 L40 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M40 24 C54 24 58 10 74 10 L148 10 C168 10 186 24 200 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M40 24 C54 24 58 38 74 38 L148 38 C168 38 186 24 200 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M74 24 L200 24" reduce={reduce} delay={delay} faded />
          <Weight cx={204} cy={24} at={delay + 0.45} reduce={reduce} color={main} />
        </>
      )

    case 'misconception':
      return (
        <>
          <Line
            d="M8 24 L26 24 C40 24 42 12 56 12 C66 12 69 12 77 20 C83 28 89 36 104 36 C120 36 128 24 150 24 L200 24"
            reduce={reduce}
            delay={delay}
            color={main}
          />
          <Weight cx={204} cy={24} at={delay + 0.45} reduce={reduce} color={main} />
        </>
      )

    case 'rule-inversion':
      return (
        <>
          <Line d="M8 24 L60 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M60 24 L78 11 L96 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M96 24 L114 37 L132 24" reduce={reduce} delay={delay} color={main} />
          <Line d="M132 24 C152 24 164 13 188 13 L200 13" reduce={reduce} delay={delay} color={main} />
          <Weight cx={204} cy={13} at={delay + 0.45} reduce={reduce} color={main} />
        </>
      )

    case 'multi-variable': {
      const rows = [13, 24, 35].slice(0, Math.max(2, varCount))
      const starts = [40, 54, 70]
      return (
        <>
          <Line d="M8 24 L40 24" reduce={reduce} delay={delay} color={main} />
          {rows.map((y, index) => (
            <Line
              key={y}
              d={`M${starts[index]} 24 C${starts[index] + 14} 24 ${starts[index] + 18} ${y} ${starts[index] + 34} ${y} L196 ${y}`}
              reduce={reduce}
              delay={delay}
              color={main}
            />
          ))}
          <OpenSet ys={rows} at={delay + 0.45} reduce={reduce} color={main} />
        </>
      )
    }
  }
}

function Line({
  d,
  reduce,
  delay,
  faded = false,
  color = INK,
}: {
  d: string
  reduce: boolean
  delay: number
  faded?: boolean
  color?: string
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={faded ? FAINT : color}
      strokeWidth={faded ? 1.1 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: faded ? 0.5 : 1 }}
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={reduce ? undefined : { pathLength: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? undefined : { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
    />
  )
}

function Weight({ cx, cy, at, reduce, color = INK }: { cx: number; cy: number; at: number; reduce: boolean; color?: string }) {
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? undefined : { duration: 0.25, delay: at }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r={6.5} fill="none" stroke={FAINT} strokeWidth={1} opacity={0.5} />
      <circle cx={cx} cy={cy} r={3.4} fill={color} />
    </motion.g>
  )
}

function OpenSet({ ys, at, reduce, color = INK }: { ys: number[]; at: number; reduce: boolean; color?: string }) {
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduce ? undefined : { duration: 0.25, delay: at }}
    >
      <line x1={200} y1={ys[0]} x2={200} y2={ys[ys.length - 1]} stroke={FAINT} strokeWidth={1} opacity={0.55} />
      {ys.map((y) => (
        <circle key={y} cx={200} cy={y} r={2.6} fill={PAPER} stroke={color} strokeWidth={1.4} />
      ))}
    </motion.g>
  )
}
