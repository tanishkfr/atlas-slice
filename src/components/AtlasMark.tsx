export function AtlasMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className="shrink-0 text-accent transition-colors group-hover:text-ink"
    >
      <path
        d="M4.3 15.1 Q9 17.1 13.5 14.1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M9 3 L4.3 15.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3 L13.5 14.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="3" r="1.3" fill="currentColor" />
      <circle cx="4.3" cy="15.1" r="1.1" fill="currentColor" />
      <circle cx="13.5" cy="14.1" r="1.1" fill="currentColor" />
    </svg>
  )
}
