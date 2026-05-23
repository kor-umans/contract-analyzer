export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <svg
            className="h-4 w-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-neutral-900">
            Contract Analyzer
          </p>
          <p className="text-xs leading-tight text-neutral-400">
            AI-gestuurde juridische analyse
          </p>
        </div>
      </div>
    </header>
  );
}
