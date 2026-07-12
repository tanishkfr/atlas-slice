import { ArrowLeft } from '@phosphor-icons/react'
import { allEntries } from '../content/entry'

type AboutAtlasProps = { onBack: () => void }

export function AboutAtlas({ onBack }: AboutAtlasProps) {
  return (
    <div className="w-full max-w-2xl">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <ArrowLeft size={13} weight="bold" /> Back
      </button>

      <p className="mt-10 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">The proposition</p>
      <p className="mt-6 text-pretty font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        Interaction principles become useful when their assumptions are exposed by cases that do not resemble the one that produced them.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        Atlas is a research-through-design instrument for making that movement inspectable. You begin with a rule, carry it through three deliberately distant pressure cases, and preserve every revision. Atlas does not generate a better answer. Its output is the lineage of your own reasoning.
      </p>

      <p className="mt-16 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">The instrument</p>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>The near case asks whether the rule survives when dismissal is cheap. The high-consequence case reverses the cost of leaving. The switch-access case removes the pointer geography hidden inside the phrase “tap outside.” A fracture can only be recorded after the principle changes, so revision becomes visible rather than rhetorical.</p>
        <p>Source anchors point to W3C and Microsoft guidance that supports the variables in each authored scenario—focus containment, explicit dismissal, safe actions, reversibility, and destructive consequence. Those sources do not settle the principle. The visitor must decide what follows from them.</p>
      </div>

      <p className="mt-16 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Supporting corpus</p>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>The wider Atlas corpus contains {allEntries.length} single-authored entries argued from shipped examples. Its four shapes are an editorial lens, not a proven taxonomy: they emerged through writing and have not been independently classified.</p>
        <p>The corpus supports the project, but it is no longer the organizing interaction. The stress trace is the contribution because it asks a reader to produce and revise a claim instead of only consuming one.</p>
      </div>

      <p className="mt-16 border-b border-line pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Limits</p>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>The three pressure cases are authored, not sampled, and their sequence is intentionally adversarial. Atlas has not yet been tested with learners, so it demonstrates a transferable reasoning interaction without proving transfer.</p>
        <p>That restraint matters. When Atlas lacks evidence, it should expose the gap rather than manufacture a plausible answer. The artifact argues for inspectable revision, not automated authority.</p>
      </div>

      <div className="mt-16 border-t border-line pt-6 text-sm text-ink-faint">
        <a href="https://github.com/tanishkfr/atlas-slice" className="underline decoration-line underline-offset-4 hover:text-ink">Source on GitHub</a>
      </div>
    </div>
  )
}
