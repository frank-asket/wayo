import React, { useState } from 'react';
import { X, Play, Copy, Check, Terminal, Sparkles, AlertTriangle } from 'lucide-react';

interface PipelineTesterProps {
  isOpen: boolean;
  onClose: () => void;
  onScoreSuccess: () => void;
}

export const PipelineTester: React.FC<PipelineTesterProps> = ({
  isOpen,
  onClose,
  onScoreSuccess,
}) => {
  const defaultPayload = {
    user_id: 'usr_98123',
    amount: 4200.00,
    merchant: 'Unrecognized Tech Vendor',
    location: 'Lagos, NG',
    device_id: 'dev_new_882',
  };

  const [formData, setFormData] = useState(defaultPayload);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    try {
      const res = await fetch('/api/v1/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount.toString()),
        }),
      });
      const data = await res.json();
      setResponseOutput(data);
      onScoreSuccess();
    } catch (err: any) {
      setResponseOutput({ error: 'Failed to score payload', details: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const loadScenario = (type: string) => {
    if (type === 'readme') {
      setFormData(defaultPayload);
    } else if (type === 'impossible_travel') {
      setFormData({
        user_id: 'usr_44102',
        amount: 1450.00,
        merchant: 'CryptoExchange P2P Gateway',
        location: 'Bucharest, RO',
        device_id: 'dev_unknown_441',
      });
    } else if (type === 'benign') {
      setFormData({
        user_id: 'usr_11094',
        amount: 82.50,
        merchant: 'Swiss Rail SBB Zurich',
        location: 'Zurich, CH',
        device_id: 'dev_iphone_771',
      });
    }
  };

  const copyCurl = () => {
    const cmd = `curl -X POST "http://localhost:3000/api/v1/score" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(formData, null, 2)}'`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">ML Scoring & LLM Investigation Pipeline Tester</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Preset quick links */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Load Scenario:</span>
            <button
              onClick={() => loadScenario('readme')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition"
            >
              README Specimen (Alexander Chen / $4,200)
            </button>
            <button
              onClick={() => loadScenario('impossible_travel')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 transition"
            >
              Impossible Travel Anomaly (Sarah Jenkins)
            </button>
            <button
              onClick={() => loadScenario('benign')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Safe Low-Risk Transaction
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">User ID</label>
              <input
                type="text"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($ USD)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Merchant</label>
              <input
                type="text"
                value={formData.merchant}
                onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Device ID Fingerprint</label>
              <input
                type="text"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action and cURL preview */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={copyCurl}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied cURL' : 'Copy cURL command'}</span>
            </button>

            <button
              id="execute-score-btn"
              disabled={isLoading}
              onClick={handleTest}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoading ? 'Scoring with ML + LLM...' : 'Score Transaction (POST /api/v1/score)'}</span>
            </button>
          </div>

          {/* Live Response Payload */}
          {responseOutput && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span>Response Payload (HTTP 200 OK)</span>
                {responseOutput.flagged && (
                  <span className="flex items-center text-rose-400 font-sans font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Flagged for Investigation
                  </span>
                )}
              </div>

              <pre className="text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(responseOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
