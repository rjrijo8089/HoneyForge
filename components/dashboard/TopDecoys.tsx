interface DecoyItem {
  name: string
  count: number
  type: string
  color: string
}

interface TopDecoysProps {
  data: DecoyItem[]
}

const TYPE_ICONS: Record<string, string> = {
  http: 'HTTP', https: 'HTTPS', ssh: 'SSH', ftp: 'FTP',
  smb: 'SMB', rdp: 'RDP', mysql: 'SQL', telnet: 'TEL',
}

export function TopDecoys({ data }: TopDecoysProps) {
  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-hf-border/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-hf-text">Top Attacked Decoys</h3>
        <p className="text-xs text-hf-muted mt-0.5">By interaction count</p>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.count / max) * 100
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-black font-mono px-1 py-0.5 rounded shrink-0"
                  style={{ color: item.color, background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                >
                  {TYPE_ICONS[item.type] ?? item.type.toUpperCase()}
                </span>
                <span className="text-xs text-hf-muted truncate flex-1">{item.name}</span>
                <span className="text-xs font-mono font-semibold text-hf-text tabular-nums shrink-0">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-hf-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                    boxShadow: `0 0 6px ${item.color}40`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
