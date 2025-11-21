import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

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

function readMetricFile(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.trim().split('\n')
    if (lines.length > 0) {
      const parts = lines[0].split(' ')
      if (parts.length >= 2) {
        return parseFloat(parts[1])
      }
    }
  } catch (error) {
    console.error(`Error reading metric file ${filePath}:`, error)
  }
  return 0
}

function readParamFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim()
  } catch (error) {
    console.error(`Error reading param file ${filePath}:`, error)
    return ''
  }
}

function getMetricsFromMLflow(): ModelMetrics[] {
  const metrics: ModelMetrics[] = []
  
  // Path to mlruns - adjust this based on your deployment structure
  const mlrunsPath = path.join(process.cwd(), '..', 'Q3', 'mlruns', '0')
  
  try {
    if (!fs.existsSync(mlrunsPath)) {
      console.error(`MLflow path not found: ${mlrunsPath}`)
      return metrics
    }

    const runs = fs.readdirSync(mlrunsPath)
    
    for (const runDir of runs) {
      if (runDir === 'meta.yaml' || runDir === 'models') continue
      
      const runPath = path.join(mlrunsPath, runDir)
      const metricsPath = path.join(runPath, 'metrics')
      const paramsPath = path.join(runPath, 'params')
      
      if (!fs.existsSync(metricsPath) || !fs.existsSync(paramsPath)) continue
      
      try {
        const modelFile = path.join(paramsPath, 'model')
        if (!fs.existsSync(modelFile)) continue
        
        const modelName = readParamFile(modelFile)
        
        const metric: ModelMetrics = {
          model: modelName,
          train_rmse: readMetricFile(path.join(metricsPath, 'train_rmse')),
          train_mae: readMetricFile(path.join(metricsPath, 'train_mae')),
          train_r2: readMetricFile(path.join(metricsPath, 'train_r2')),
          test_rmse: readMetricFile(path.join(metricsPath, 'test_rmse')),
          test_mae: readMetricFile(path.join(metricsPath, 'test_mae')),
          test_r2: readMetricFile(path.join(metricsPath, 'test_r2')),
          mlflow_run_id: runDir,
        }
        
        metrics.push(metric)
      } catch (error) {
        console.error(`Error processing run ${runDir}:`, error)
      }
    }
  } catch (error) {
    console.error('Error reading MLflow runs:', error)
  }
  
  return metrics
}

export async function GET() {
  try {
    const metrics = getMetricsFromMLflow()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
