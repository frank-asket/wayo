import React from 'react';
import { ShieldAlert, Activity, Cpu, Sparkles, RefreshCw, Send, Globe, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onSimulate: (scenario?: string) => void;
  onOpenTester: () => void;
  isLoading: boolean;
  activeView: 'dashboard' | 'marketing';
  onViewChange: (view: 'dashboard' | 'marketing') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSimulate, 
  onOpenTester, 
  isLoading,
  activeView,
  onViewChange
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('marketing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-xl">
            W
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Wayo</h1>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Fraud Engine v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI-Powered Financial Fraud Detection & Investigation System
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Marketing Landing vs Analyst Dashboard) */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            id="tab-view-dashboard-btn"
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'dashboard'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-view-marketing-btn"
            onClick={() => onViewChange('marketing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeView === 'marketing'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Product Page</span>
          </button>
        </div>

        {/* Live System Telemetry */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-mono">Kafka 24ms</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-mono">Gemini RAG</span>
          </div>

          {/* Action Buttons */}
          <button
            id="open-tester-btn"
            onClick={onOpenTester}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test API</span>
          </button>

          <button
            id="simulate-tx-btn"
            disabled={isLoading}
            onClick={() => onSimulate()}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Simulate Anomaly</span>
          </button>
        </div>
      </div>
    </header>
  );
};
