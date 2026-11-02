interface FaqProps {
  items: ReadonlyArray<{ question: string; answer: string }>;
}

/** Native details and summary: works without JavaScript and is fully keyboard accessible. */
export function Faq({ items }: FaqProps) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group/faq">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="grid size-7 flex-none place-items-center rounded-full bg-teal-light text-teal-deep transition-transform duration-300 group-open/faq:rotate-45"
            >
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M6 1.5v9M1.5 6h9" />
              </svg>
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-slate">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
