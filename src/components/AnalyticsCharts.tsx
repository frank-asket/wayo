import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { SystemStats } from '../types';

interface AnalyticsChartsProps {
  stats: SystemStats | null;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  if (!stats) return null;

  const distributionData = [
    { name: 'Low Risk (<35%)', count: stats.riskDistribution.low, color: '#10b981' },
    { name: 'Moderate (35-74%)', count: stats.riskDistribution.medium, color: '#f59e0b' },
    { name: 'Critical (>75%)', count: stats.riskDistribution.high, color: '#f43f5e' },
  ];

  const hourlyTrends = [
    { hour: '11:00', total: 18, flagged: 1 },
    { hour: '12:00', total: 24, flagged: 2 },
    { hour: '13:00', total: 31, flagged: 1 },
    { hour: '14:00', total: 42, flagged: 4 },
    { hour: '15:00', total: 39, flagged: 2 },
    { hour: '16:00', total: Math.max(stats.totalEvaluated, 12), flagged: stats.totalFlagged },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Risk Distribution Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Fraud Risk Tier Breakdown
          </h3>
          <p className="text-[11px] text-slate-500">Live classification distribution across all evaluated transactions</p>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-around text-xs border-t border-slate-800/80 pt-2 font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Safe: {stats.riskDistribution.low}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Mod: {stats.riskDistribution.medium}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Crit: {stats.riskDistribution.high}</span>
          </div>
        </div>
      </div>

      {/* Hourly Stream Velocity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Transaction Volume & Anomaly Rate
            </h3>
            <p className="text-[11px] text-slate-500">Hourly throughput ingested via Kafka pipeline</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
              <span className="text-slate-400">Total</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
              <span className="text-slate-400">Anomalies</span>
            </div>
          </div>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flagged" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
          <span>In-flight Feature Extraction Active</span>
          <span className="font-mono text-cyan-400 font-semibold">99.8% System Uptime</span>
        </div>
      </div>
    </div>
  );
};
