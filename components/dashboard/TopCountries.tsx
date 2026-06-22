import type { CountryData } from '@/services/mock/data/dashboard'

interface TopCountriesProps {
  data: CountryData[]
}

const COUNTRY_COLORS = [
  '#ef4444', '#ea580c', '#d97706', '#16a34a', '#3b82f6', '#8b5cf6', '#ec4899',
]

export function TopCountries({ data }: TopCountriesProps) {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-hf-text">Top Attacker Countries</h3>
        <p className="text-xs text-hf-muted mt-0.5">By source IP geolocation</p>
      </div>

      <div className="space-y-3">
        {data.map((country, i) => (
          <div key={country.code} className="flex items-center gap-3">
            {/* Rank */}
            <span className="text-[10px] font-mono text-hf-dim w-4 shrink-0">{i + 1}</span>

            {/* Country code */}
            <span className="font-mono text-[10px] font-bold text-hf-muted bg-hf-surface-3 border border-hf-border/50 px-1.5 py-0.5 rounded shrink-0 w-8 text-center">
              {country.code}
            </span>

            {/* Bar + name */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-hf-muted truncate">{country.name}</span>
                <span className="font-mono text-hf-text font-semibold shrink-0 ml-2">
                  {country.percent}%
                </span>
              </div>
              <div className="h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${country.percent}%`,
                    background: `linear-gradient(90deg, ${COUNTRY_COLORS[i]}, ${COUNTRY_COLORS[i]}80)`,
                    boxShadow: `0 0 6px ${COUNTRY_COLORS[i]}40`,
                  }}
                />
              </div>
            </div>

            {/* Count */}
            <span className="text-xs font-mono text-hf-dim shrink-0 w-12 text-right">
              {country.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
