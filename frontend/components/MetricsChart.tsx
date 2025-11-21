'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ModelMetrics {
  model: string
  train_rmse: number
  train_mae: number
  train_r2: number
  test_rmse: number
  test_mae: number
  test_r2: number
}

interface MetricsChartProps {
  metrics: ModelMetrics[]
  title: string
  type: 'train' | 'test'
}

export default function MetricsChart({ metrics, title, type }: MetricsChartProps) {
  const data = metrics.map(m => ({
    name: m.model,
    RMSE: type === 'train' ? m.train_rmse : m.test_rmse,
    MAE: type === 'train' ? m.train_mae : m.test_mae,
    'R² Score': type === 'train' ? m.train_r2 : m.test_r2,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2 capitalize">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(4)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
            iconType="circle"
          />
          <Bar dataKey="RMSE" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="MAE" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="R² Score" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
