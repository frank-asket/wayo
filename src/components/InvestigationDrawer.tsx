import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Sparkles,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertOctagon,
  TrendingUp,
  BarChart2,
  History,
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Navigation,
} from 'lucide-react';
import { Transaction } from '../types';
import { GeoVelocityMap } from './GeoVelocityMap';

interface InvestigationDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onAction: (id: string, action: 'FREEZE' | 'APPROVE' | 'REQUEST_2FA' | 'DISMISS' | 'ESCALATE', notes?: string) => Promise<void>;
  isActionLoading: boolean;
  onOpenMobile2FA?: () => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  transaction,
  onClose,
  onAction,
  isActionLoading,
  onOpenMobile2FA,
}) => {
  const [analystNotes, setAnalystNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'narrative' | 'shap' | 'geovelocity' | 'audit'>('narrative');

  if (!transaction) return null;

  const pct = Math.round(transaction.fraudProbability * 100);
  const isHighRisk = transaction.fraudProbability >= 0.75;
  const investigation = transaction.llmInvestigation;

  const handleAction = async (action: 'FREEZE' | 'APPROVE' | 'REQUEST_2FA' | 'DISMISS' | 'ESCALATE') => {
    await onAction(transaction.id, action, analystNotes);
    setAnalystNotes('');
    if (action === 'REQUEST_2FA' && onOpenMobile2FA) {
      onOpenMobile2FA();
    }
  };

  // SHAP waterfall feature impacts (from TRD requirement)
  const shapFeatures = transaction.shapValues || [
    {
      feature: 'amount_vs_historical_avg',
      impact: (transaction.riskFactors?.amountDeviationRatio || 1) > 2.0 ? 0.38 : -0.12,
      description: `${transaction.riskFactors?.amountDeviationRatio || 1}x spike over 90-day baseline`,
    },
    {
      feature: 'geo_velocity_anomaly',
      impact: transaction.riskFactors?.isGeoAnomaly ? 0.28 : -0.15,
      description: transaction.riskFactors?.isGeoAnomaly ? 'Unusual coordinates / impossible travel' : 'Regular domestic zone',
    },
    {
      feature: 'device_fingerprint_match',
      impact: transaction.riskFactors?.isNewDevice ? 0.24 : -0.18,
      description: transaction.riskFactors?.isNewDevice ? 'Unrecognized device token' : 'Trusted hardware fingerprint',
    },
    {
      feature: 'merchant_category_risk',
      impact: (transaction.riskFactors?.merchantRisk || 0) > 0.5 ? 0.20 : -0.10,
      description: `MCC risk index ${(transaction.riskFactors?.merchantRisk || 0.15).toFixed(2)}`,
    },
    {
      feature: 'frequency_velocity_24h',
      impact: isHighRisk ? 0.14 : -0.05,
      description: isHighRisk ? 'Elevated rapid transaction burst' : 'Nominal transaction pace',
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isHighRisk
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {pct}%
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Investigation Case {transaction.id}</h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                  isHighRisk
                    ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                }`}
              >
                {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              User: <span className="text-slate-200 font-medium">{transaction.userName || transaction.userId}</span> • Cardholder ID: {transaction.userId}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs (Narrative vs SHAP Explainability vs Audit Ledger) */}
      <div className="px-6 pt-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center space-x-4">
        <button
          onClick={() => setActiveTab('narrative')}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'narrative'
              ? 'border-indigo-500 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>GenAI Narrative</span>
        </button>

        <button
          onClick={() => setActiveTab('shap')}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'shap'
              ? 'border-cyan-500 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>SHAP Waterfall</span>
        </button>

        <button
          id="tab-geovelocity-btn"
          onClick={() => setActiveTab('geovelocity')}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'geovelocity'
              ? 'border-rose-500 text-rose-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-rose-400" />
          <span>Geo-Velocity Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-1.5 pb-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'audit'
              ? 'border-emerald-500 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Trail ({transaction.auditTrail?.length || 1})</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Risk Probability Score Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Calculated ML Risk Score</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-2xl font-black font-mono ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                {transaction.fraudProbability.toFixed(3)}
              </span>
              <span className="text-xs text-slate-500">/ 1.000 max score</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Decision Threshold</span>
            <span className="text-xs font-mono font-semibold text-slate-300">&ge; 0.750 triggers RAG</span>
          </div>
        </div>

        {/* TAB 1: GenAI Narrative */}
        {activeTab === 'narrative' && (
          <>
            {investigation ? (
              <div className="p-5 rounded-xl bg-gradient-to-b from-indigo-950/30 to-slate-950 border border-indigo-800/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">LLM Automated Investigation Report</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {investigation.modelUsed || 'Wayo RAG'}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 mb-4">
                  <p className="text-xs text-indigo-200 font-medium leading-relaxed italic">
                    "{investigation.summary}"
                  </p>
                </div>

                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Behavioral Anomaly Explanations:
                </h4>
                <ul className="space-y-2">
                  {investigation.reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800"
                    >
                      <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                {investigation.recommendedAction && (
                  <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs">
                    <span className="text-slate-400">AI Prescribed Action:</span>
                    <span className="font-bold text-amber-300 uppercase tracking-wider">
                      {investigation.recommendedAction.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                Transaction scored within normal risk parameters ({transaction.fraudProbability.toFixed(2)} &lt; 0.75). No automated LLM narrative needed.
              </div>
            )}
          </>
        )}

        {/* TAB 2: SHAP Waterfall Visualization */}
        {activeTab === 'shap' && (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Local Feature Attribution (TreeSHAP)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decomposition of risk factors against population expected baseline E[f(x)] = 0.05
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                SR 11-7 Compliant
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {shapFeatures.map((item, idx) => {
                const isRiskInc = item.impact > 0;
                const barWidth = Math.min(100, Math.round(Math.abs(item.impact) * 180));

                return (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-slate-200 font-semibold">{item.feature}</span>
                      <span
                        className={`font-mono font-bold ${
                          isRiskInc ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isRiskInc ? `+${item.impact.toFixed(3)}` : item.impact.toFixed(3)}
                      </span>
                    </div>

                    {/* Impact Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      {isRiskInc ? (
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      ) : (
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ml-auto"
                          style={{ width: `${barWidth}%` }}
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Audit Trail Ledger */}
        {activeTab === 'audit' && (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Immutable Event Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full chronological record of automated flags and analyst actions for this transaction.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Audited
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {transaction.auditTrail && transaction.auditTrail.length > 0 ? (
                transaction.auditTrail.map((log, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1 font-mono text-[11px]">
                      <span>{log.actor}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="font-semibold text-cyan-300 uppercase tracking-wide text-[11px]">
                      {log.action}
                    </p>
                    <p className="text-slate-300 mt-1">{log.details}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Transaction ingested into Kafka stream at {new Date(transaction.timestamp).toLocaleTimeString()}. Awaiting analyst decision.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Geo-Velocity Radar */}
        {activeTab === 'geovelocity' && (
          <GeoVelocityMap transaction={transaction} />
        )}

        {/* Behavioral Discrepancy & Transaction Facts Grid */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Transaction vs Historical Baseline
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-medium">Transaction Amount</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {transaction.riskFactors?.amountDeviationRatio
                  ? `${transaction.riskFactors.amountDeviationRatio}x user's typical average`
                  : 'Compared against 90-day history'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs font-medium">Location Detected</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{transaction.location}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {transaction.riskFactors?.isGeoAnomaly ? '⚠️ Impossible travel deviation' : 'Known location zone'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium">Device Fingerprint</span>
              </div>
              <p className="text-xs font-mono text-white truncate">{transaction.deviceId}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {transaction.riskFactors?.isNewDevice ? '⚠️ Unrecognized device token' : 'Verified hardware token'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-medium">Merchant & MCC</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{transaction.merchant}</p>
              <p className="text-[11px] text-slate-500 mt-1">Category: {transaction.category}</p>
            </div>
          </div>
        </div>

        {/* Analyst Actions Form (FR-3.3: Approve, Freeze, Escalate, 2FA) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Analyst Decision & Remediation
            </h3>
            <span className="text-xs text-slate-500">Current Status: <strong className="text-slate-300">{transaction.status}</strong></span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Case Notes / Justification</label>
            <textarea
              id="analyst-notes-input"
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              placeholder="Record fraud analyst findings or customer confirmation notes..."
              className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              id="freeze-account-btn"
              disabled={isActionLoading || transaction.status === 'FROZEN'}
              onClick={() => handleAction('FREEZE')}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold transition disabled:opacity-50"
            >
              <Lock className="w-4 h-4 mb-1 text-rose-400" />
              <span>Freeze Account</span>
            </button>

            <button
              id="escalate-case-btn"
              disabled={isActionLoading}
              onClick={() => handleAction('ESCALATE')}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 text-xs font-semibold transition disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4 mb-1 text-purple-400" />
              <span>Escalate Tier 2</span>
            </button>

            <button
              id="request-2fa-btn"
              disabled={isActionLoading}
              onClick={() => handleAction('REQUEST_2FA')}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-semibold transition disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4 mb-1 text-amber-400" />
              <span>Request 2FA</span>
            </button>

            <button
              id="approve-tx-btn"
              disabled={isActionLoading || transaction.status === 'APPROVED'}
              onClick={() => handleAction('APPROVE')}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-400" />
              <span>Approve</span>
            </button>

            <button
              id="dismiss-tx-btn"
              disabled={isActionLoading}
              onClick={() => handleAction('DISMISS')}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mb-1 text-slate-400" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
