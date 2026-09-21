import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionsTable } from './components/TransactionsTable';
import { InvestigationDrawer } from './components/InvestigationDrawer';
import { PipelineTester } from './components/PipelineTester';
import { MarketingPage } from '@web/MarketingPage';
import { MobilePushSimulator } from './components/MobilePushSimulator';
import { AuditComplianceModal } from './components/AuditComplianceModal';
import { RulesConfigModal } from './components/RulesConfigModal';
import { Transaction, SystemStats } from './types';
import { INITIAL_SYSTEM_STATS, INITIAL_TRANSACTIONS } from './data';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>(INITIAL_SYSTEM_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMobilePushOpen, setIsMobilePushOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'alert' } | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'marketing'>('marketing');

  const streamIntervalRef = useRef<any>(null);

  const showNotification = (message: string, type: 'success' | 'alert' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        fetch('/api/v1/stats').catch(() => null),
        fetch('/api/v1/transactions').catch(() => null),
      ]);

      if (statsRes && statsRes.ok && txRes && txRes.ok) {
        const statsData = await statsRes.json();
        const txData = await txRes.json();
        setStats(statsData);
        setTransactions(txData);

        // Keep selectedTx up to date if currently viewed
        if (selectedTx) {
          const updated = txData.find((t: Transaction) => t.id === selectedTx.id);
          if (updated) setSelectedTx(updated);
        }
      }
    } catch (err) {
      console.warn('Network request deferred or offline, using initialized state:', err);
    }
  }, [selectedTx]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Continuous stream simulator toggle
  useEffect(() => {
    if (isStreaming) {
      const scenarios = ['readme', 'crypto_offramp', 'normal', 'card_not_present'];
      streamIntervalRef.current = setInterval(async () => {
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        try {
          await fetch('/api/v1/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scenario: randomScenario }),
          });
          fetchData();
        } catch (e) {
          console.error('Stream generation error:', e);
        }
      }, 5000);
    } else {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [isStreaming, fetchData]);

  const handleSimulate = async (scenario?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenario || 'readme' }),
      });
      const data = await res.json();
      await fetchData();

      if (data.transaction) {
        setSelectedTx(data.transaction);
        if (activeView === 'marketing') {
          setActiveView('dashboard');
        }
        if (data.transaction.flagged) {
          showNotification(`⚠️ High-risk anomaly flagged: ${data.transaction.id} (${data.transaction.merchant})`, 'alert');
        } else {
          showNotification(`Cleared low-risk transaction: ${data.transaction.id}`, 'success');
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: 'FREEZE' | 'APPROVE' | 'REQUEST_2FA' | 'DISMISS' | 'ESCALATE',
    notes?: string
  ) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/v1/investigations/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
      });
      if (res.ok) {
        const result = await res.json();
        await fetchData();
        if (result.transaction) {
          setSelectedTx(result.transaction);
        }
        showNotification(
          action === 'FREEZE'
            ? `Account frozen for transaction ${id}`
            : action === 'ESCALATE'
            ? `Case ${id} escalated to Tier 2 SecOps`
            : action === 'REQUEST_2FA'
            ? `Mobile 2FA step-up dispatched to cardholder`
            : `Transaction ${id} actioned: ${action}`
        );
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Cardholder response from Mobile Push Simulator
  const handleRespond2FA = async (decision: 'CONFIRMED_USER' | 'DENIED_FRAUD') => {
    if (!selectedTx) return;
    try {
      const res = await fetch(`/api/v1/investigations/${selectedTx.id}/2fa-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchData();
        if (data.transaction) {
          setSelectedTx(data.transaction);
        }
        showNotification(
          decision === 'CONFIRMED_USER'
            ? `Customer authenticated via Biometric 2FA. Transaction approved.`
            : `Customer reported unauthorized access! Account automatically frozen.`,
          decision === 'CONFIRMED_USER' ? 'success' : 'alert'
        );
      }
    } catch (err) {
      console.error('2FA simulation error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* If Marketing View is active */}
      {activeView === 'marketing' ? (
        <MarketingPage
          onEnterDashboard={() => setActiveView('dashboard')}
          onOpenTester={() => setIsTesterOpen(true)}
        />
      ) : (
        <>
          {/* Top Navigation & Status */}
          <Header
            onSimulate={handleSimulate}
            onOpenTester={() => setIsTesterOpen(true)}
            isLoading={isLoading}
            activeView={activeView}
            onViewChange={setActiveView}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(!isStreaming)}
            onOpenCompliance={() => setIsComplianceOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
          />

          {/* Main Content Dashboard */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
            {/* Toast alert banner if active */}
            {notification && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium transition animate-in fade-in slide-in-from-top-2 duration-200 ${
                  notification.type === 'alert'
                    ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                    : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {notification.type === 'alert' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>{notification.message}</span>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-xs opacity-70 hover:opacity-100 ml-4 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 1. Metrics Overview (Evaluated, Flagged, Prevented, MTTI, ROC-AUC, Latency) */}
            <MetricsBar stats={stats} />

            {/* 2. Analytical Trends & Risk Breakdown */}
            <AnalyticsCharts stats={stats} />

            {/* 3. Live Scoring Transactions Stream */}
            <TransactionsTable
              transactions={transactions}
              selectedTx={selectedTx}
              onSelectTx={(tx) => setSelectedTx(tx)}
            />
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
            <span>Wayo Enterprise AI Fraud System • In-Flight Scoring & LLM Investigation Engine</span>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <button onClick={() => setIsComplianceOpen(true)} className="text-cyan-400 hover:underline">
                Compliance & SAR Audit Ledger
              </button>
              <span>•</span>
              <button onClick={() => setIsRulesOpen(true)} className="text-amber-400 hover:underline">
                Rules Engine
              </button>
              <span>•</span>
              <button onClick={() => setActiveView('marketing')} className="text-slate-400 hover:text-white">
                Marketing Specs
              </button>
              <span>•</span>
              <button onClick={() => setIsTesterOpen(true)} className="text-slate-400 hover:text-white">
                API Sandbox
              </button>
            </div>
          </footer>
        </>
      )}

      {/* Detail Investigation Drawer (Shared across views if opened) */}
      <InvestigationDrawer
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
        onAction={handleAction}
        isActionLoading={isActionLoading}
        onOpenMobile2FA={() => setIsMobilePushOpen(true)}
      />

      {/* Interactive Pipeline Tester Modal */}
      <PipelineTester
        isOpen={isTesterOpen}
        onClose={() => setIsTesterOpen(false)}
        onScoreSuccess={() => {
          fetchData();
          setActiveView('dashboard');
        }}
      />

      {/* Mobile 2FA / Biometric Simulator Modal */}
      <MobilePushSimulator
        isOpen={isMobilePushOpen}
        transaction={selectedTx}
        onClose={() => setIsMobilePushOpen(false)}
        onRespond2FA={handleRespond2FA}
      />

      {/* Regulatory Compliance & SAR Ledger Modal */}
      <AuditComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      {/* Rules Engine Configuration Modal */}
      <RulesConfigModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        onRulesChanged={() => fetchData()}
      />
    </div>
  );
};

export default App;
