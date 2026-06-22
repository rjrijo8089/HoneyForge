export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-orange-400 border border-orange-400/30 bg-orange-400/10 ${className ?? ''}`}
    >
      Demo
    </span>
  )
}
