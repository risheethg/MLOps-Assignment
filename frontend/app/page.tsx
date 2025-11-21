'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Activity, TrendingUp, Target, Zap } from 'lucide-react'
import MetricsChart from '@/components/MetricsChart'
import ModelComparison from '@/components/ModelComparison'
import MetricCard from '@/components/MetricCard'

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

export default function Home() {
  const [metrics, setMetrics] = useState<ModelMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('all')

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/metrics.json')
      setMetrics(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch metrics. Please ensure metrics.json exists.')
      console.error('Error fetching metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  const getBestModel = () => {
    if (metrics.length === 0) return null
    return metrics.reduce((best, current) => 
      current.test_r2 > best.test_r2 ? current : best
    )
  }

  const getAverageMetric = (metricName: keyof ModelMetrics) => {
    if (metrics.length === 0) return 0
    const sum = metrics.reduce((acc, m) => acc + (m[metricName] as number), 0)
    return sum / metrics.length
  }

  const filteredMetrics = selectedModel === 'all' 
    ? metrics 
    : metrics.filter(m => m.model === selectedModel)

  const bestModel = getBestModel()

  if (loading && metrics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading metrics...</p>
        </div>
      </div>
    )
  }

  if (error && metrics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={fetchMetrics}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Activity className="text-primary-500" size={36} />
                MLOps Metrics Dashboard
              </h1>
              <p className="text-slate-400 text-lg">
                Model Performance Analytics
              </p>
            </div>
            <button
              onClick={fetchMetrics}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
            >
              <Zap size={18} />
              Refresh
            </button>
          </div>

        {/* Model Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedModel('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedModel === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            All Models
          </button>
          {Array.from(new Set(metrics.map(m => m.model))).map(model => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                selectedModel === model
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Best Model"
            value={bestModel?.model || 'N/A'}
            subtitle={`R² Score: ${bestModel?.test_r2.toFixed(4) || 'N/A'}`}
            icon={<Target className="text-primary-400" size={24} />}
            trend="up"
          />
          <MetricCard
            title="Avg Test RMSE"
            value={getAverageMetric('test_rmse').toFixed(4)}
            subtitle="Root Mean Squared Error"
            icon={<Activity className="text-primary-400" size={24} />}
          />
          <MetricCard
            title="Avg Test MAE"
            value={getAverageMetric('test_mae').toFixed(4)}
            subtitle="Mean Absolute Error"
            icon={<TrendingUp className="text-primary-400" size={24} />}
          />
          <MetricCard
            title="Total Models"
            value={metrics.length.toString()}
            subtitle="Tracked experiments"
            icon={<Zap className="text-primary-400" size={24} />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MetricsChart 
            metrics={filteredMetrics}
            title="Test Set Performance"
            type="test"
          />
          <MetricsChart 
            metrics={filteredMetrics}
            title="Training Set Performance"
            type="train"
          />
        </div>

        {/* Full Width Model Comparison Table */}
        <ModelComparison metrics={filteredMetrics} />
      </div>
    </main>
  )
}
