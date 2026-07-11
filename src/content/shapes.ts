import type { Entry } from './entry'

/**
 * The four shapes, made into a *method* rather than a lens.
 *
 * Everywhere else in Atlas the shapes stay implicit — felt through the corpus,
 * never named on the surface (per the project's own rule). Here, and only here,
 * they are named and taught, because this is the one place whose entire job is
 * to hand the reader the shapes as tools they can pick up and use on a question
 * Atlas never wrote. You *feel* the shapes in the Survey; you *learn* them here.
 *
 * Each shape carries: the diagnostic test that identifies it, the tell that
 * gives it away, a plain definition, the reasoning scaffold for working it, and
 * a set of real corpus questions of the same shape — so a reader can sanity-
 * check their own diagnosis against how the corpus was actually classified.
 */
export type MethodShape = {
  kind: Entry['kind']
  /** A quiet, non-jargon name for the shape. */
  name: string
  /** The diagnostic question — "is your question this one?" */
  test: string
  /** The one-line tell that gives this shape away. */
  tell: string
  /** What the shape is, and what the work is. */
  definition: string
  /** The reasoning scaffold — the questions to work through, in order. */
  scaffold: string[]
  /** The closing prompt: what the reader's own principle should do. */
  principlePrompt: string
  /** Real corpus questions of this shape — the inter-rater sanity check. */
  exampleQueries: string[]
}

export const methodShapes: MethodShape[] = [
  {
    kind: 'branch',
    name: 'The fork',
    test: 'Are there two answers a smart person could defend — and which is right depends on the situation?',
    tell: "You keep saying “it depends,” and you mean it.",
    definition:
      'Two strategies are both genuinely valid. The work isn’t picking one — it’s naming the situation that decides between them, and the principle that stays true across both.',
    scaffold: [
      'Name the two situations where the answer flips. What’s true in each?',
      'What’s the real question underneath the surface one? (often: “how bad is it if you’re wrong?”, “does this task have a destination?”)',
      'What does each answer protect? What does it cost?',
      'Optional: is there a third move that dissolves the choice entirely?',
    ],
    principlePrompt:
      'Your principle: what stays true no matter which situation you’re in.',
    exampleQueries: [
      'Should I confirm before deleting a file?',
      'Should I use infinite scrolling for this list?',
      'Should I use a modal here?',
    ],
  },
  {
    kind: 'misconception',
    name: 'The correction',
    test: 'Is there a widely-held belief here that might simply be false?',
    tell: 'Everyone already “knows” the answer — which is exactly why nobody checks it.',
    definition:
      'A common belief is wrong. The work is stating the belief plainly, finding the mechanism that breaks it, then what’s true instead — and where the belief is still partly right.',
    scaffold: [
      'State the belief the way the people who hold it would. No strawman.',
      'What’s the mechanism that actually makes it false? What does it miss?',
      'When is the belief still partly right? (it almost always is, some of the time.)',
    ],
    principlePrompt: 'Your principle: the corrected version, in one line.',
    exampleQueries: [
      'Is dark mode more accessible?',
      'Should I hide navigation behind a hamburger menu to save space?',
      'Should I use placeholder text as the field label to save space?',
    ],
  },
  {
    kind: 'rule-inversion',
    name: 'The inversion',
    test: 'Is there a rule everyone repeats that you suspect flips in certain cases?',
    tell: 'The rule is right often enough to be dangerous.',
    definition:
      'A rule is directionally right but incomplete. The work is a case where it holds, a case where the same rule points the opposite way, and the sharper question that actually decides between them.',
    scaffold: [
      'State the rule. Name a real case where, applied plainly, it’s right.',
      'Find a real case where the same rule, applied just as faithfully, points the other way.',
      'What actually decides between the two? That’s the sharper question the rule was hiding.',
    ],
    principlePrompt: 'Your principle: the rule, corrected by the sharper question.',
    exampleQueries: [
      'Should I minimize the number of clicks it takes to complete a task?',
      'Should I show a skeleton screen instead of a spinner while content loads?',
      'Should deleting something require typing its name to confirm?',
    ],
  },
  {
    kind: 'multi-variable',
    name: 'The map',
    test: 'Does the answer genuinely ride on several factors at once, with no single rule?',
    tell: 'Every honest answer starts with “well, it depends on…” and then lists things.',
    definition:
      'There is no single answer — only a small set of factors that, held together, let you decide any specific case. The work is naming the factors, not resolving them.',
    scaffold: [
      'Name the 2–4 factors that actually decide it. (stop at four — more usually means you split one factor in two.)',
      'For each factor, what does it pull the answer toward at each extreme?',
    ],
    principlePrompt:
      'Your principle: the factors, held together as a map — not a verdict.',
    exampleQueries: [
      'Should the interface adapt to usage, or stay the same for everyone every time?',
      'Should I require an account before someone can use the core feature?',
      'Should a tooltip appear on hover, or require a click or tap?',
    ],
  },
]

export function shapeFor(kind: Entry['kind']): MethodShape {
  return methodShapes.find((s) => s.kind === kind)!
}

/**
 * Real interaction questions Atlas has deliberately *not* written answers for.
 * They exist so the reasoning exercise lands on genuinely open ground — the
 * payoff is only honest if the reader really is the first to reason the case.
 */
export const openCases: string[] = [
  'Should tapping outside a dialog close it?',
  'Should a feed autoplay video by default?',
  'Should there be a maximum length on a password?',
  'Should a date field default to today?',
  'Should a “copy” button confirm that it copied?',
]
