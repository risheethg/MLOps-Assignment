'use client'

interface ModelMetrics {
  model: string
  train_rmse: number
  train_mae: number
  train_r2: number
  test_rmse: number
  test_mae: number
  test_r2: number
  mlflow_run_id: string
  timestamp?: string
}

interface ModelComparisonProps {
  metrics: ModelMetrics[]
}

export default function ModelComparison({ metrics }: ModelComparisonProps) {
  const getBestValue = (metricName: keyof ModelMetrics, higher: boolean = false) => {
    if (metrics.length === 0) return null
    const values = metrics.map(m => m[metricName] as number)
    return higher ? Math.max(...values) : Math.min(...values)
  }

  const isBestValue = (value: number, metricName: keyof ModelMetrics, higher: boolean = false) => {
    const bestValue = getBestValue(metricName, higher)
    return value === bestValue
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Model Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Model</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Train RMSE</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Train MAE</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Train R²</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Test RMSE</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Test MAE</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Test R²</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Run ID</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr 
                key={index}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-white font-medium capitalize bg-slate-700 px-3 py-1 rounded-full text-sm">
                    {metric.model}
                  </span>
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.train_rmse, 'train_rmse') 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.train_rmse.toFixed(6)}
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.train_mae, 'train_mae') 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.train_mae.toFixed(6)}
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.train_r2, 'train_r2', true) 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.train_r2.toFixed(6)}
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.test_rmse, 'test_rmse') 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.test_rmse.toFixed(6)}
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.test_mae, 'test_mae') 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.test_mae.toFixed(6)}
                </td>
                <td className={`text-right py-4 px-4 ${
                  isBestValue(metric.test_r2, 'test_r2', true) 
                    ? 'text-primary-400 font-bold' 
                    : 'text-slate-300'
                }`}>
                  {metric.test_r2.toFixed(6)}
                </td>
                <td className="text-right py-4 px-4 text-slate-400 font-mono text-xs">
                  {metric.mlflow_run_id.substring(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {metrics.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No metrics available. Train some models first!
        </div>
      )}
    </div>
  )
}
