export function ToolChips({ tools, className = "" }: { tools: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tools.map((tool) => (
        <li key={tool} className="rounded-md bg-teal-light px-2.5 py-1 font-mono text-sm text-charcoal">
          {tool}
        </li>
      ))}
    </ul>
  );
}
