import { ArrowLeft } from '@phosphor-icons/react'

type AboutAtlasProps = {
  onBack: () => void
}

/**
 * The thesis, stated plainly, plus a genuinely honest account of where
 * this broke during the making of it. Both were previously true only in
 * RESEARCH.md/TODO.md — real, but invisible to anyone who hadn't gone
 * looking. This surfaces them in the one place a visitor actually is.
 */
export function AboutAtlas({ onBack }: AboutAtlasProps) {
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

      <p className="mt-10 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Why this exists
      </p>
      <div className="mt-6 space-y-4">
        <p className="text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
          Design systems have colors, type scales, spacing tokens: a documented visual language. Interaction design has never had the equivalent. A body of reasoning about why an interaction behaves the way it does, tested the way law and business schools test reasoning, through real cases argued from evidence, not asserted from authority.
        </p>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Atlas is an attempt at that. Every entry here is diagnosed into one of four shapes: a real fork between two defensible strategies, a common belief that's simply false, a rule that's directionally right but missing a variable, or a question that never collapses into one rule at all. Each is argued with at least two real, checkable examples, and run through a set of editorial gates before it ships.
        </p>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          None of this is unprecedented by itself. Design-rationale frameworks like IBIS and QOC have modeled reasoning as questions and arguments since the 1970s. What they never did was ground that reasoning in evidence gathered across an entire industry's shipped products, instead of one team's internal notes. That's the actual bet here.
        </p>
      </div>

      <p className="mt-16 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        How this was actually built
      </p>

      <div className="mt-8 space-y-10">
        <div>
          <p className="font-serif text-lg font-medium text-ink">
            Evidence, wrong in both directions
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            An early entry cited Stripe as evidence for keeping a payment button enabled and validating on submit. It was backwards: Stripe's own guidance recommends disabling until the form is valid. The citation read correctly on the page and was wrong in exactly the direction that happened to support the point being argued, which is the specific way a bad citation is hardest to catch from the inside. It shipped once before anyone checked it against a real source. It happened again, in a different entry, months later, before a live verification pass caught it a second time.
          </p>
        </div>

        <div>
          <p className="font-serif text-lg font-medium text-ink">
            One sentence shape, written five times by accident
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Five separate principles, written across five different working sessions, independently reached for the exact same construction: state a claim, negate it in one breath, follow with what it actually is instead. Nobody noticed while writing any single one. The pattern only became visible once every shipped principle was read side by side, which is also what it took to notice the editorial rule meant to catch this, checking only the last three shipped principles, wasn't wide enough to catch a habit that resurfaces every three or four entries.
          </p>
        </div>

        <div>
          <p className="font-serif text-lg font-medium text-ink">
            Three attempts at one small idea
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            A small margin note that echoed what you'd already scrolled past existed for a while, got reworked once for being too quiet to register as intentional, reworked again for looking overdone once it was more visible, and was eventually removed outright. Three attempts at the same small idea before concluding it was never earning the complexity it cost.
          </p>
        </div>
      </div>
    </div>
  )
}
