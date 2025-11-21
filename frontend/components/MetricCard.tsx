interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

export default function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-700/50 rounded-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-3xl font-bold mb-1">{value}</p>
      <p className="text-slate-500 text-xs">{subtitle}</p>
    </div>
  )
}
