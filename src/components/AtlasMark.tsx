/**
 * The wordmark's icon: a cartographer's dividers — the actual hinged
 * instrument used to step off and compare distances on a map, open mid-
 * measurement rather than symmetric or at rest. Chosen over an invented
 * abstract glyph because it's a real, specific object with a specific job:
 * measuring one thing against another, which is what every entry in the
 * corpus does. The faint arc is the span the two points are scribing.
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
      <path
        d="M4.3 15.1 Q9 17.1 13.5 14.1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M9 3 L4.3 15.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3 L13.5 14.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="3" r="1.3" fill="currentColor" />
      <circle cx="4.3" cy="15.1" r="1.1" fill="currentColor" />
      <circle cx="13.5" cy="14.1" r="1.1" fill="currentColor" />
    </svg>
  )
}
