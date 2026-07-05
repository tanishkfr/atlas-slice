/**
 * The wordmark's icon: a single excerpt from the survey plate itself, at icon
 * scale — the same three primitives the Reasoning Trace uses (see
 * ReasoningTrace.tsx): a faint axis, one evidence tick crossing it, and a
 * weighted point where it resolves, ringed in its halo. Not a separate
 * symbol invented for branding — a direct quotation of the plate's own
 * vocabulary, shrunk to 18px. Carries the accent throughout, at the same
 * relative weights the plate uses (faint axis, full-strength tick and point).
 */
export function AtlasMark() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className="shrink-0 text-accent transition-transform duration-200 ease-out group-hover:scale-110"
    >
      <line
        x1="1.6"
        y1="9"
        x2="15.1"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="6.6"
        y1="6"
        x2="6.6"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="9" r="3.1" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="14" cy="9" r="1.7" fill="currentColor" />
    </svg>
  )
}
