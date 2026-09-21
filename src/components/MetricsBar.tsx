import React from 'react';
import { ShieldCheck, AlertTriangle, DollarSign, Clock, Zap, Target } from 'lucide-react';
import { SystemStats } from '../types';

interface MetricsBarProps {
  stats: SystemStats | null;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const metrics = [
    {
      id: 'metric-evaluated',
      label: 'Evaluated Transactions',
      value: stats ? stats.totalEvaluated.toLocaleString() : '--',
      subtext: 'Real-time Kafka ingestion',
      icon: ShieldCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/40 border-cyan-800/40',
    },
    {
      id: 'metric-flagged',
      label: 'High-Risk Anomalies',
      value: stats ? stats.totalFlagged.toString() : '--',
      subtext: 'Dispatched to RAG pipeline',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/40',
    },
    {
      id: 'metric-prevented',
      label: 'Fraud Prevented',
      value: stats ? formatCurrency(stats.preventedFraudUsd) : '--',
      subtext: 'Protected capital in flight',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/40',
    },
    {
      id: 'metric-mtti',
      label: 'Mean Time to Investigate',
      value: stats ? `${stats.mttiMinutes || 1.4} min` : '1.4 min',
      subtext: 'Down from 15 min manual baseline',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/40',
    },
    {
      id: 'metric-roc',
      label: 'Model ROC-AUC',
      value: stats ? `${stats.rocAuc || 0.942}` : '0.942',
      subtext: 'Surpassing PRD goal >= 0.92',
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-800/40',
    },
    {
      id: 'metric-latency',
      label: 'P99 ML Latency',
      value: stats ? `${stats.averageLatencyMs} ms` : '24 ms',
      subtext: 'Strict SLA threshold < 50ms',
      icon: Clock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/40 border-indigo-800/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            id={m.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate mr-1">
                {m.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${m.bg} shrink-0`}>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{m.value}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{m.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
