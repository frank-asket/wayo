import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Sparkles, ChevronRight, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  selectedTx: Transaction | null;
  onSelectTx: (tx: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  selectedTx,
  onSelectTx,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.userName && tx.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'FLAGGED') return tx.flagged;
    if (statusFilter === 'PENDING') return tx.status === 'PENDING_REVIEW';
    if (statusFilter === 'FROZEN') return tx.status === 'FROZEN';
    if (statusFilter === 'APPROVED') return tx.status === 'APPROVED' || tx.status === 'AUTO_APPROVED';
    return true;
  });

  const getRiskBadge = (prob: number) => {
    const pct = Math.round(prob * 100);
    if (prob >= 0.75) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>
          {pct}% HIGH RISK
        </span>
      );
    }
    if (prob >= 0.35) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
          {pct}% MODERATE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
        {pct}% SAFE
      </span>
    );
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending Review
          </span>
        );
      case 'FROZEN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Lock className="w-3 h-3 mr-1" /> Account Frozen
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Analyst Approved
          </span>
        );
      case 'AUTO_APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Auto Cleared
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-semibold text-white">Live Ingestion & Scoring Stream</h2>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-400">
            {filtered.length} total
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="transaction-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, merchant, ID..."
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-0.5 rounded transition ${statusFilter === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('FLAGGED')}
              className={`px-2 py-0.5 rounded transition ${statusFilter === 'FLAGGED' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Flagged
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2 py-0.5 rounded transition ${statusFilter === 'PENDING' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-2 py-0.5 rounded transition ${statusFilter === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider sticky top-0 z-10 text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Cardholder / User</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Merchant & Location</th>
              <th className="py-3 px-4">Fraud Probability</th>
              <th className="py-3 px-4">Investigation</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                  No transactions match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isSelected = selectedTx?.id === tx.id;
                return (
                  <tr
                    key={tx.id}
                    id={`tx-row-${tx.id}`}
                    onClick={() => onSelectTx(tx)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition ${isSelected ? 'bg-cyan-950/30 border-l-2 border-cyan-400' : ''}`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-300 whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      <div className="font-medium text-white">{tx.userName || 'Unknown'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{tx.userId}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="text-slate-200 truncate max-w-[180px]" title={tx.merchant}>
                        {tx.merchant}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {tx.location} • <span className="font-mono">{tx.deviceId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getRiskBadge(tx.fraudProbability)}
                    </td>
                    <td className="py-3 px-4 font-sans whitespace-nowrap">
                      {tx.llmInvestigation ? (
                        <div className="flex items-center space-x-1.5 text-indigo-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[140px] text-[11px]">
                            {tx.llmInvestigation.summary}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No RAG Report</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-sans">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTx(tx);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
