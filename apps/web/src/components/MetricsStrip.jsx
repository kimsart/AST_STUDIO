export default function MetricsStrip() {
  const colorMap = {
    turquoise: { text: 'text-ast_turquoise', dim: 'text-ast_turquoise/60' },
    pink: { text: 'text-ast_pink', dim: 'text-ast_pink/60' },
    yellow: { text: 'text-ast_yellow', dim: 'text-ast_yellow/60' },
    purple: { text: 'text-ast_purple', dim: 'text-ast_purple/60' },
  }

  const metrics = [
    { label: 'Active Projects', value: '8', change: '+2 this month', color: 'turquoise' },
    { label: 'Supplies Tracked', value: '74', change: '+5 added', color: 'pink' },
    { label: 'Hours This Week', value: '23.5', change: '+1.2%', color: 'yellow' },
    { label: 'Budget Used', value: '67%', change: '—on track', color: 'purple' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-4 hover:border-ast_blue/40 transition"
        >
          <p className="text-xs text-slate-400 mb-2">{metric.label}</p>
          <p className={`text-3xl font-bold ${colorMap[metric.color].text} mb-1`}>{metric.value}</p>
          <p className={`text-xs ${colorMap[metric.color].dim}`}>{metric.change}</p>
        </div>
      ))}
    </div>
  )
}
