import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { SystemStats } from '../types';
import { AlertTriangle, TrendingUp, Info, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: SystemStats | null;
}

interface IncidentAnnotation {
  hour: string;
  title: string;
  type: 'CRITICAL_SPIKE' | 'GEO_VELOCITY_CLUSTER' | 'BASELINE_BREACH' | 'CARD_TESTING_BOT';
  description: string;
  flaggedCount: number;
  preventedUsd: number;
  deviation: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentAnnotation | null>(null);
  const [showBaseline, setShowBaseline] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);

  if (!stats) return null;

  // Expected 30-day baseline threshold for normal operation
  const HISTORICAL_BASELINE_TOTAL = 28;
  const HISTORICAL_BASELINE_ANOMALIES = 1.2;

  const distributionData = [
    { name: 'Low Risk (<35%)', count: stats.riskDistribution.low, color: '#10b981' },
    { name: 'Moderate (35-74%)', count: stats.riskDistribution.medium, color: '#f59e0b' },
    { name: 'Critical (>75%)', count: stats.riskDistribution.high, color: '#f43f5e' },
  ];

  // Extended timeline with realistic multi-hour trending and annotated significant incidents
  const hourlyTrends = [
    {
      hour: '10:00',
      total: 22,
      flagged: 1,
      baselineTotal: 25,
      baselineFlagged: 1,
      p99LatencyMs: 21,
    },
    {
      hour: '11:00',
      total: 26,
      flagged: 1,
      baselineTotal: 27,
      baselineFlagged: 1,
      p99LatencyMs: 22,
    },
    {
      hour: '12:00',
      total: 34,
      flagged: 2,
      baselineTotal: 28,
      baselineFlagged: 1,
      p99LatencyMs: 24,
    },
    {
      hour: '13:00',
      total: 38,
      flagged: 3,
      baselineTotal: 30,
      baselineFlagged: 1.5,
      p99LatencyMs: 25,
      incident: {
        hour: '13:00',
        title: 'Distributed Card-Testing Burst',
        type: 'CARD_TESTING_BOT' as const,
        description: 'Automated script fired 14 micro-authorizations ($1-$3) across 6 BIN numbers within 4 minutes. In-memory rate limiter auto-throttled.',
        flaggedCount: 3,
        preventedUsd: 4120,
        deviation: '+180% vs 30d baseline',
      },
    },
    {
      hour: '14:00',
      total: 48,
      flagged: 6,
      baselineTotal: 32,
      baselineFlagged: 1.5,
      p99LatencyMs: 27,
      incident: {
        hour: '14:00',
        title: 'Transcontinental Impossible Travel Cluster',
        type: 'GEO_VELOCITY_CLUSTER' as const,
        description: 'Simultaneous luxury electronics purchases in Bucharest and Lagos following London authorizations under 12 minutes (Mach 8.4 velocity).',
        flaggedCount: 6,
        preventedUsd: 14200,
        deviation: '+300% anomaly spike',
      },
    },
    {
      hour: '15:00',
      total: 42,
      flagged: 3,
      baselineTotal: 30,
      baselineFlagged: 1.4,
      p99LatencyMs: 24,
    },
    {
      hour: '16:00',
      total: Math.max(stats.totalEvaluated > 50 ? 54 : stats.totalEvaluated, 38),
      flagged: Math.max(stats.totalFlagged, 4),
      baselineTotal: 29,
      baselineFlagged: 1.2,
      p99LatencyMs: 23,
      incident: {
        hour: '16:00',
        title: 'Crypto Off-Ramp High-Deviation Wave',
        type: 'CRITICAL_SPIKE' as const,
        description: '3 high-value wire transfers ($4,200 - $5,200) routed through peer-to-peer cryptocurrency gateways with unauthenticated device hashes.',
        flaggedCount: stats.totalFlagged || 4,
        preventedUsd: stats.preventedFraudUsd || 894320,
        deviation: '+340% historical dollar volume',
      },
    },
  ];

  const significantIncidents = hourlyTrends
    .filter(h => h.incident)
    .map(h => h.incident as IncidentAnnotation);

  // Custom Dot renderer for trend lines highlighting incident pins
  const RenderIncidentDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.incident || !showAnnotations) {
      return (
        <circle cx={cx} cy={cy} r={3} fill="#f43f5e" stroke="#0f172a" strokeWidth={1.5} />
      );
    }

    const isSelected = selectedIncident?.hour === payload.hour;

    return (
      <g
        className="cursor-pointer transition-transform hover:scale-125"
        onClick={() => setSelectedIncident(payload.incident)}
      >
        {/* Pulsing indicator ring */}
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 10 : 7}
          fill="rgba(244, 63, 94, 0.25)"
          className="animate-ping"
        />
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 6 : 5}
          fill="#f43f5e"
          stroke="#ffffff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fill="#fda4af"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          !
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Distribution Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Fraud Risk Tier Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                P99 24ms
              </span>
            </div>
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

        {/* Hourly Stream Velocity with Historical Baselines & Incident Annotations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Transaction Volume & Incident Trend Line
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/70 text-rose-400 border border-rose-800/60 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>3 Annotations</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live Kafka stream vs. 30-day baseline threshold with flagged operational incidents
              </p>
            </div>

            {/* Interactive display toggles */}
            <div className="flex items-center space-x-3 text-xs font-mono">
              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={showBaseline}
                  onChange={(e) => setShowBaseline(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-[11px] flex items-center space-x-1">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
                  <span>30d Baseline</span>
                </span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="text-[11px] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                  <span>Incident Pins</span>
                </span>
              </label>
            </div>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyTrends} margin={{ top: 12, right: 15, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs shadow-xl space-y-1.5 max-w-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="font-mono font-bold text-slate-200">{label}:00 UTC</span>
                          <span className="text-[10px] text-slate-400 font-mono">P99: {data.p99LatencyMs}ms</span>
                        </div>
                        <div className="flex justify-between text-cyan-400 font-mono">
                          <span>Volume Ingested:</span>
                          <strong>{data.total} tx</strong>
                        </div>
                        <div className="flex justify-between text-rose-400 font-mono">
                          <span>Flagged Anomalies:</span>
                          <strong>{data.flagged} tx</strong>
                        </div>
                        {showBaseline && (
                          <div className="flex justify-between text-amber-400/90 font-mono text-[11px] pt-1 border-t border-slate-800/80">
                            <span>Baseline Expectation:</span>
                            <span>{data.baselineTotal} total / {data.baselineFlagged} anom</span>
                          </div>
                        )}
                        {data.incident && (
                          <div className="mt-2 pt-1.5 border-t border-rose-900/50 bg-rose-950/30 p-1.5 rounded text-[11px] text-rose-300">
                            <span className="font-bold flex items-center space-x-1 text-rose-400">
                              <AlertTriangle size={12} className="shrink-0" />
                              <span>{data.incident.title}</span>
                            </span>
                            <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-2">{data.incident.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                {/* Total Transaction Volume Bars */}
                <Bar dataKey="total" name="Total Volume" fill="#06b6d4" opacity={0.65} radius={[4, 4, 0, 0]} />

                {/* Historical Baseline Marker Line */}
                {showBaseline && (
                  <ReferenceLine
                    y={HISTORICAL_BASELINE_TOTAL}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `30d Mean: ${HISTORICAL_BASELINE_TOTAL} tx/h`,
                      fill: '#fbbf24',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                )}

                {/* Historical Baseline Anomaly Threshold */}
                {showBaseline && (
                  <ReferenceLine
                    y={HISTORICAL_BASELINE_ANOMALIES}
                    stroke="#fb7185"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                    label={{
                      value: 'Baseline Anom Cap (1.2)',
                      fill: '#fda4af',
                      fontSize: 9,
                      position: 'insideBottomRight',
                    }}
                  />
                )}

                {/* Significant Incident Anomaly Line with Customized Interactive Pins */}
                <Line
                  type="monotone"
                  dataKey="flagged"
                  name="Flagged Anomalies"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={<RenderIncidentDot />}
                  activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2 gap-2">
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500 opacity-70" />
                <span className="text-slate-300">Total Volume</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-rose-500 rounded" />
                <span className="text-slate-300">Anomalies</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-0.5 border-t border-dashed border-amber-400" />
                <span className="text-amber-400">Historical Baseline</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Click any <strong className="text-rose-400">red incident pin</strong> to inspect audit telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Significant Incident Annotations Card Deck */}
      {showAnnotations && significantIncidents.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert size={16} className="text-rose-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Significant Incident Annotations ({significantIncidents.length} Breaches)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Timeline Correlation: 10:00 - 16:00 UTC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {significantIncidents.map((incident) => {
              const isSelected = selectedIncident?.hour === incident.hour;
              return (
                <div
                  key={incident.hour}
                  onClick={() => setSelectedIncident(incident)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-rose-300 border border-rose-900/50">
                        {incident.hour}:00 UTC
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-rose-400">
                        {incident.deviation}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-200 text-xs flex items-center space-x-1">
                      <span>{incident.title}</span>
                    </h5>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {incident.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Prevented: <strong className="text-emerald-400">${incident.preventedUsd.toLocaleString()}</strong></span>
                    <span className="text-rose-400 font-semibold">{incident.flaggedCount} Flagged</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Detail Drawer / Expansion when an incident is selected */}
          {selectedIncident && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/60 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  Incident Deep Dive: {selectedIncident.title} ({selectedIncident.hour}:00 UTC)
                </span>
                <p className="text-slate-300 text-xs">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
