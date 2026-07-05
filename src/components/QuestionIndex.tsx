import { ArrowLeft } from '@phosphor-icons/react'
import { allEntries, type Entry } from '../content/entry'
import { ExampleLink } from './ExampleLink'

type QuestionIndexProps = {
  onAsk: (query: string, entry: Entry) => void
  onBack: () => void
}

// The same curated set the homescreen used to show inline under "show
// more" — folded in here instead, so there's exactly one place that lists
// more than a handful of questions, not two overlapping ones.
const commonQueries = [
  'Should I minimize the number of clicks it takes to complete a task?',
  'Should I use a carousel or slider to show featured content on the homepage?',
  'Should I show an exact unread count, or just a dot?',
  'Should I use swipe gestures for actions like archive or delete on a list?',
]

// Every one of the other 29 questions, partitioned once by subject rather
// than by internal shape (Branch/Misconception/etc. stay backend-only,
// per the project's own "surface language isn't schema" rule). Category
// names are themselves alphabetical, and each list is sorted by its own
// visible query text below — so "alphabetical" is something a reader can
// actually verify by looking at the words on screen, not a claim resting
// on a hidden sort key.
const categories: { name: string; queries: string[] }[] = [
  {
    name: 'Accessibility & alternative input',
    queries: [
      'Is dark mode more accessible?',
      'Does drag-and-drop need a keyboard alternative to be accessible?',
      'Should I use swipe gestures for actions like archive or delete on a list?',
    ],
  },
  {
    name: 'Content & discovery',
    queries: [
      'Should an empty state use an illustration, or just plain text?',
      'Should I show a relative timestamp, or the exact date and time?',
      'Can an icon alone communicate its meaning, without a text label?',
      'Should search results update as I type, or wait for me to submit?',
      'Should I use infinite scrolling for this list?',
      'Should I use a carousel or slider to show featured content on the homepage?',
    ],
  },
  {
    name: 'Destructive actions & confirmation',
    queries: [
      'Should I confirm before deleting a file?',
      'Should deleting something require typing its name to confirm?',
    ],
  },
  {
    name: 'Flow & first use',
    queries: [
      'Should I minimize the number of clicks it takes to complete a task?',
      'Should the interface adapt to usage, or stay the same for everyone every time?',
      'Should I require an account before someone can use the core feature?',
      'Should new users get a guided tutorial, or figure out the product themselves?',
    ],
  },
  {
    name: 'Forms & input',
    queries: [
      'Should I disable this button until the form is valid?',
      'Should I use placeholder text as the field label to save space?',
      'Should form fields be in one column, or grouped side by side?',
      'Is marking an error field in red enough?',
      'Should I mark only the optional fields, and assume everything else is required?',
      'Should I pre-fill a form field with a likely-correct guess?',
      'Should I use a stepper (plus and minus buttons) or a text field for choosing a quantity?',
    ],
  },
  {
    name: 'Loading, feedback & saving',
    queries: [
      'Should I show a skeleton screen instead of a spinner while content loads?',
      'Should I show a determinate progress bar, or just indicate that something is happening?',
      'Should changes save automatically, or require an explicit save button?',
      'Should a settings change apply immediately, or wait for an explicit Apply button?',
      'Should I use pull-to-refresh, or a visible refresh button?',
    ],
  },
  {
    name: 'Navigation & wayfinding',
    queries: [
      'Should I use a modal here?',
      'Should I hide navigation behind a hamburger menu to save space?',
      'Should a tooltip appear on hover, or require a click or tap?',
    ],
  },
  {
    name: 'Notifications & permissions',
    queries: [
      'When should I ask for notification permission?',
      'Should I show an exact unread count, or just a dot?',
      'Should notification settings be one master switch, or separate toggles per type?',
    ],
  },
]

/**
 * The full corpus, browsable on its own screen rather than crammed into
 * the homescreen's short example list. Styled like a book's actual index:
 * plain flowing columns, no cards, grouped by subject the way a real
 * reference index is, not by internal implementation shape.
 */
export function QuestionIndex({ onAsk, onBack }: QuestionIndexProps) {
  const entryByQuery = new Map(allEntries.map((entry) => [entry.query, entry]))
  const common = allEntries.filter((entry) => commonQueries.includes(entry.query))

  function renderEntry(entry: Entry) {
    return (
      <li key={entry.query} className="mb-4 break-inside-avoid">
        <ExampleLink entry={entry} onSelect={(e) => onAsk(e.query, e)} />
      </li>
    )
  }

  return (
    <div className="w-full max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-faint transition-colors duration-150 hover:text-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <ArrowLeft size={13} weight="bold" />
        Back
      </button>

      <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        The full index
      </p>
      <h1 className="mt-2 max-w-lg text-balance font-serif text-2xl leading-snug text-ink sm:text-3xl">
        Every question Atlas covers so far.
      </h1>

      <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Most common
      </p>
      <ul className="mt-3 flex flex-col gap-2">{common.map(renderEntry)}</ul>

      <div className="mt-10 sm:grid sm:grid-cols-2 sm:gap-x-10">
        {categories.map((category) => {
          const entries = category.queries
            .map((query) => entryByQuery.get(query))
            .filter((entry): entry is Entry => entry !== undefined && !commonQueries.includes(entry.query))
            .sort((a, b) => a.query.localeCompare(b.query))

          if (entries.length === 0) return null

          return (
            <div key={category.name} className="mb-8 break-inside-avoid">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                {category.name}
              </p>
              <ul className="mt-3 flex flex-col gap-2">{entries.map(renderEntry)}</ul>
            </div>
          )
        })}
      </div>

      <div className="mt-4 border-t border-line pt-6">
        <p className="text-sm leading-relaxed text-ink-faint">
          Thirty-three cases so far, each checked against two real examples and a live source
          before it ships. Whatever isn't here yet is still in that queue, waiting on the same
          bar as everything that made it.
        </p>
      </div>
    </div>
  )
}
