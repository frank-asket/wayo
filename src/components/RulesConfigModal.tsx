import React, { useState, useEffect } from 'react';
import { Sliders, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, RefreshCw, Zap, Plus, Lock } from 'lucide-react';
import { FraudRule } from '../types';

interface RulesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRulesChanged?: () => void;
}

export const RulesConfigModal: React.FC<RulesConfigModalProps> = ({ isOpen, onClose, onRulesChanged }) => {
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/rules');
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      }
    } catch (e) {
      console.error('Failed to load rules:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRules();
    }
  }, [isOpen]);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/v1/rules/${id}/toggle`, {
        method: 'PUT',
      });
      if (res.ok) {
        const result = await res.json();
        setRules((prev) =>
          prev.map((r) => (r.id === id ? result.rule : r))
        );
        if (onRulesChanged) onRulesChanged();
      }
    } catch (e) {
      console.error('Failed to toggle rule:', e);
    } finally {
      setTogglingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Fraud Prevention Rules Engine</h2>
              <p className="text-xs text-slate-400">
                Deterministic threshold guards executed prior to ML & RAG pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-mono transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span>Configured Policy Directives ({rules.length})</span>
            <button
              onClick={fetchRules}
              className="flex items-center space-x-1 text-cyan-400 hover:underline"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Policy</span>
            </button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => {
              const isToggling = togglingId === rule.id;
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border transition-all ${
                    rule.enabled
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-200">
                          {rule.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                          Priority {rule.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rule.action === 'FREEZE'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : rule.action === 'STEP_UP_2FA'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          ACTION: {rule.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rule.description}</p>
                      <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500 pt-1">
                        <span>Field: <strong className="text-slate-300">{rule.field}</strong></span>
                        <span>Op: <strong className="text-slate-300">{rule.operator}</strong></span>
                        <span>Threshold: <strong className="text-slate-300">{rule.thresholdValue}</strong></span>
                        <span>Triggered: <strong className="text-amber-400">{rule.triggeredCount} times</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleToggle(rule.id)}
                        disabled={isToggling}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                          rule.enabled
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {rule.enabled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>All rule evaluations stream to immutable WORM audit logs</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
